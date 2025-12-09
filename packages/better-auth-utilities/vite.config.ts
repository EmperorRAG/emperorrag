import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
// import * as fs from 'fs';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import externalsJson from './externals.json' with { type: 'json' };
import { externalizePackages, toExternalizeConfig } from './externalize-packages.js';

/*function getEntries(dir: string, baseDir: string = dir): Record<string, string> {
	const entries: Record<string, string> = {};
	if (!fs.existsSync(dir)) return entries;

	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			if (file === 'test' || file === '__tests__') continue;
			Object.assign(entries, getEntries(fullPath, baseDir));
		} else if (stat.isFile() && file.endsWith('.ts') && !file.endsWith('.d.ts')) {
			if (file.endsWith('.spec.ts') || file.endsWith('.test.ts') || file === 'setup-test-env.ts') continue;

			const relativePath = path.relative(baseDir, fullPath);
			const entryName = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/');
			entries[entryName] = fullPath;
		}
	}
	return entries;
}*/

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/packages/better-auth-utilities',
	plugins: [
		nxCopyAssetsPlugin(['*.md', 'package.json']),
		dts({
			entryRoot: './src',
			tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
			rollupTypes: false,
			staticImport: true,
			outDir: './dist',
		}),
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	// Configuration for building your library.
	// See: https://vitejs.dev/guide/build.html#library-mode
	build: {
		outDir: './dist',
		emptyOutDir: true,
		reportCompressedSize: false,
		minify: false,
		sourcemap: true,
		commonjsOptions: {
			transformMixedEsModules: true,
			esmExternals: true,
		},
		lib: {
			entry: {
				'lib/client/client.service': './src/lib/client/client.service.ts',
				'lib/client/client.types': './src/lib/client/client.types.ts',
				'lib/client/client.constants': './src/lib/client/client.constants.ts',
				'lib/client/config/config.service': './src/lib/client/config/config.service.ts',
				'lib/server/server.service': './src/lib/server/server.service.ts',
				'lib/server/server.types': './src/lib/server/server.types.ts',
				'lib/server/server.constants': './src/lib/server/server.constants.ts',
				'lib/server/config/config.service': './src/lib/server/config/config.service.ts',
				'lib/shared/config/config.types': './src/lib/shared/config/config.types.ts',
				'lib/shared/config/config.constants': './src/lib/shared/config/config.constants.ts',
				'lib/shared/config/config.service': './src/lib/shared/config/config.service.ts',
				'lib/client/core/account/shared/account.types': './src/lib/client/core/account/shared/account.types.ts',
				'lib/client/core/account/shared/account.error': './src/lib/client/core/account/shared/account.error.ts',
				'lib/client/core/email/shared/email.types': './src/lib/client/core/email/shared/email.types.ts',
				'lib/client/core/email/shared/email.error': './src/lib/client/core/email/shared/email.error.ts',
				'lib/client/core/email/shared/email.schema': './src/lib/client/core/email/shared/email.schema.ts',
				'lib/client/core/oauth/shared/oauth.types': './src/lib/client/core/oauth/shared/oauth.types.ts',
				'lib/client/core/oauth/shared/oauth.error': './src/lib/client/core/oauth/shared/oauth.error.ts',
				'lib/client/core/session/shared/session.types': './src/lib/client/core/session/shared/session.types.ts',
				'lib/client/core/session/shared/session.error': './src/lib/client/core/session/shared/session.error.ts',
				'lib/client/core/user/shared/user.types': './src/lib/client/core/user/shared/user.types.ts',
				'lib/client/core/user/shared/user.error': './src/lib/client/core/user/shared/user.error.ts',
				'lib/server/core/account/shared/account.types': './src/lib/server/core/account/shared/account.types.ts',
				'lib/server/core/account/shared/account.error': './src/lib/server/core/account/shared/account.error.ts',
				'lib/server/core/email/shared/email.types': './src/lib/server/core/email/shared/email.types.ts',
				'lib/server/core/email/shared/email.error': './src/lib/server/core/email/shared/email.error.ts',
				'lib/server/core/email/shared/email.schema': './src/lib/server/core/email/shared/email.schema.ts',
				'lib/server/core/oauth/shared/oauth.types': './src/lib/server/core/oauth/shared/oauth.types.ts',
				'lib/server/core/oauth/shared/oauth.error': './src/lib/server/core/oauth/shared/oauth.error.ts',
				'lib/server/core/session/shared/session.types': './src/lib/server/core/session/shared/session.types.ts',
				'lib/server/core/session/shared/session.error': './src/lib/server/core/session/shared/session.error.ts',
				'lib/server/core/user/shared/user.types': './src/lib/server/core/user/shared/user.types.ts',
				'lib/server/core/user/shared/user.error': './src/lib/server/core/user/shared/user.error.ts',
				'lib/client/core/email/change-password/changePassword': './src/lib/client/core/email/change-password/changePassword.ts',
				'lib/server/core/email/change-password/changePassword': './src/lib/server/core/email/change-password/changePassword.ts',
				'lib/client/core/email/request-password-reset/requestPasswordReset':
					'./src/lib/client/core/email/request-password-reset/requestPasswordReset.ts',
				'lib/server/core/email/forget-password/forgetPassword': './src/lib/server/core/email/forget-password/forgetPassword.ts',
				'lib/client/core/email/reset-password/resetPassword': './src/lib/client/core/email/reset-password/resetPassword.ts',
				'lib/server/core/email/reset-password/resetPassword': './src/lib/server/core/email/reset-password/resetPassword.ts',
				'lib/client/core/email/send-verification-email/sendVerificationEmail':
					'./src/lib/client/core/email/send-verification-email/sendVerificationEmail.ts',
				'lib/server/core/email/send-verification-email/sendVerificationEmail':
					'./src/lib/server/core/email/send-verification-email/sendVerificationEmail.ts',
				'lib/client/core/email/sign-in-email/signInEmail': './src/lib/client/core/email/sign-in-email/signInEmail.ts',
				'lib/server/core/email/sign-in-email/signInEmail': './src/lib/server/core/email/sign-in-email/signInEmail.ts',
				'lib/client/core/email/sign-out/signOut': './src/lib/client/core/email/sign-out/signOut.ts',
				'lib/server/core/email/sign-out/signOut': './src/lib/server/core/email/sign-out/signOut.ts',
				'lib/client/core/email/sign-up-email/signUpEmail': './src/lib/client/core/email/sign-up-email/signUpEmail.ts',
				'lib/server/core/email/sign-up-email/signUpEmail': './src/lib/server/core/email/sign-up-email/signUpEmail.ts',
				'lib/client/core/account/link-social/linkSocial': './src/lib/client/core/account/link-social/linkSocial.ts',
				'lib/client/core/account/list-accounts/listAccounts': './src/lib/client/core/account/list-accounts/listAccounts.ts',
				'lib/server/core/account/list-user-accounts/listUserAccounts': './src/lib/server/core/account/list-user-accounts/listUserAccounts.ts',
				'lib/client/core/account/unlink-account/unlinkAccount': './src/lib/client/core/account/unlink-account/unlinkAccount.ts',
				'lib/server/core/account/unlink-account/unlinkAccount': './src/lib/server/core/account/unlink-account/unlinkAccount.ts',
				'lib/client/core/session/get-session/getSession': './src/lib/client/core/session/get-session/getSession.ts',
				'lib/server/core/session/get-session/getSession': './src/lib/server/core/session/get-session/getSession.ts',
				'lib/client/core/user/update-user/updateUser': './src/lib/client/core/user/update-user/updateUser.ts',
				'lib/server/core/user/update-user/updateUser': './src/lib/server/core/user/update-user/updateUser.ts',
				'lib/client/core/oauth/sign-in/signIn': './src/lib/client/core/oauth/sign-in/signIn.ts',
				'lib/server/core/oauth/sign-in/signIn': './src/lib/server/core/oauth/sign-in/signIn.ts',
			},
			fileName: (_format: string, entryName: string) => `${entryName}.js`,
			formats: ['es' as const],
		},
		rollupOptions: {
			external: externalizePackages(toExternalizeConfig(externalsJson)),
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named' as const,
				hoistTransitiveImports: false,
			},
			maxParallelFileOps: 20,
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
				tryCatchDeoptimization: false,
				unknownGlobalSideEffects: false,
			},
		},
	},
}));
