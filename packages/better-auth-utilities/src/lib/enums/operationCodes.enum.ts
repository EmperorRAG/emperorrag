import * as Data from "effect/Data";

/**
 * Input validation error source types for traceability.
 *
 * @pure
 * @description Enables tracing of where the input validation error originated in the workflow.
 */

export type OperationCodes = Data.TaggedEnum<{
  SchemaCreation: {};
  SchemaParsing: {};
  TypeGuardValidation: {};
  FieldValidation: {};
}>;

export const OperationCodes = Data.taggedEnum<OperationCodes>();
