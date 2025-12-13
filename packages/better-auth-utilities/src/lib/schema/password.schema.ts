import * as Schema from 'effect/Schema';

type PasswordPolicy = {
	readonly minLength: number;
	readonly maxLength: number;
};

export const PasswordSchema = (policy: PasswordPolicy) =>
	Schema.String.pipe(Schema.minLength(policy.minLength), Schema.maxLength(policy.maxLength), Schema.brand('Password'));
export type Password = Schema.Schema.Type<ReturnType<typeof PasswordSchema>>;
