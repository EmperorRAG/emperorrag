/**
 * Input validation error source types for traceability.
 *
 * @pure
 * @description Enables tracing of where the input validation error originated in the workflow.
 */

export enum OperationCodes {
	schemaCreation = 'schema_creation',
	schemaParsing = 'schema_parsing',
	typeGuardValidation = 'type_guard_validation',
	fieldValidation = 'field_validation',
}
