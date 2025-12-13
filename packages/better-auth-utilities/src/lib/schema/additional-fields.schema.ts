import * as Either from 'effect/Either';
import * as ParseResult from 'effect/ParseResult';
import * as Schema from 'effect/Schema';
import { AuthServer } from '../server/server.types';

/**
 * Generates a dynamic Effect Schema for Better Auth additional fields.
 *
 * Implements "Option B":
 * - Unknown keys in input are allowed but ignored.
 * - Only keys declared in `authServer.options.user.additionalFields` with `input !== false` are considered.
 * - Required fields must be present.
 * - Validates types (string, number, boolean).
 *
 * @param authServer The Better Auth server instance.
 * @returns A Schema that decodes unknown input into a validated Record<string, unknown>.
 */
export const AdditionalFieldsSchema = (authServer: AuthServer) => {
	const additionalFields = authServer.options?.user?.additionalFields || {};

	// 1. Build runtime field specs
	const fieldSpecs: Record<string, { schema: Schema.Schema<any>; required: boolean }> = {};

	for (const [key, options] of Object.entries(additionalFields)) {
		// Skip fields where input is explicitly false
		if (options.input === false) continue;

		let schema: Schema.Schema<any>;
		// Map types to Effect Schemas
		switch (options.type) {
			case 'string':
				schema = Schema.String;
				break;
			case 'number':
				schema = Schema.Number;
				break;
			case 'boolean':
				schema = Schema.Boolean;
				break;
			default:
				schema = Schema.Unknown;
				break;
		}

		fieldSpecs[key] = {
			schema,
			required: !!options.required,
		};
	}

	// 2. Define the transformation
	return Schema.transformOrFail(Schema.Unknown, Schema.Record({ key: Schema.String, value: Schema.Unknown }), {
		decode: (input: unknown, _options: any, ast: any) => {
			// Ensure input is an object
			if (typeof input !== 'object' || input === null) {
				return ParseResult.fail(new ParseResult.Type(ast, input));
			}

			const output: Record<string, unknown> = {};
			const errors: ParseResult.ParseIssue[] = [];

			// Iterate over the *expected* fields (not the input keys)
			for (const [key, spec] of Object.entries(fieldSpecs)) {
				const value = (input as any)[key];

				// Handle missing values
				if (value === undefined) {
					if (spec.required) {
						errors.push(new ParseResult.Missing(spec.schema.ast as any));
					}
					continue;
				}

				// Validate present values
				const result = Schema.decodeUnknownEither(spec.schema)(value);

				if (Either.isLeft(result)) {
					// Add the error to the list
					// We wrap it in a Pointer error to indicate which field failed
					errors.push(new ParseResult.Pointer(key, value, result.left.issue));
				} else {
					output[key] = result.right;
				}
			}

			if (errors.length > 0) {
				return ParseResult.fail(new ParseResult.Composite(ast, input, errors as any));
			}

			return ParseResult.succeed(output);
		},
		encode: (output: any) => ParseResult.succeed(output), // Encoding is identity
	});
};
