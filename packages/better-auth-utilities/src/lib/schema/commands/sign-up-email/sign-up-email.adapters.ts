import { SignUpEmailCommand } from './SignUpEmail.command';

export const toSignUpEmailApiBodyNested = (cmd: SignUpEmailCommand) => ({
	name: cmd.name,
	email: cmd.email,
	password: cmd.password,
	callbackURL: cmd.callbackURL,
	image: cmd.image,
	additionalFields: cmd.additionalFields,
});

export const toSignUpEmailApiBodyFlattened = (cmd: SignUpEmailCommand) => ({
	name: cmd.name,
	email: cmd.email,
	password: cmd.password,
	callbackURL: cmd.callbackURL,
	image: cmd.image,
	...cmd.additionalFields,
});
