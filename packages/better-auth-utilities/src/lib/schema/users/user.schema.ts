import { Schema } from 'effect';

/**
 * @description Schema for Better Auth User
 */
export class User extends Schema.TaggedClass<User>()('User', {
	id: Schema.String,
	name: Schema.String,
	email: Schema.String,
	emailVerified: Schema.Boolean,
	image: Schema.optional(Schema.String),
	createdAt: Schema.Date,
	updatedAt: Schema.Date,
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(User)(input);
	}

	static encode(value: User) {
		return Schema.encode(User)(value);
	}
}
