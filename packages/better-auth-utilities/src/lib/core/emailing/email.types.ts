import type { UserInputType } from '@emperorrag/prisma-better-auth-db';

export interface SignInOptions extends Pick<UserInputType, 'name' | 'email' | 'image'> {}

export interface SignUpOptions {
	name: string;
	email: string;
	password: string;
	image: string;
}
