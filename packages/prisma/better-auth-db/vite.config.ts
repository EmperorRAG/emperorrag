import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// import * as fs from 'fs';
import { externalizePackages, toExternalizeConfig } from './externalize-packages';
import externalsJson from './externals.json' with { type: 'json' };

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
	cacheDir: '../../../node_modules/.vite/packages/prisma/better-auth-db',
	plugins: [
		// nxCopyAssetsPlugin(['*.md', 'package.json']),
		dts({
			entryRoot: './src',
			tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
			rollupTypes: false,
			staticImport: true,
			outDir: 'dist',
			exclude: ['**/*.spec.ts', '**/*.test.ts', '**/__tests__/**', '**/dist/**', '**/out-tsc/**'],
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
				index: 'src/index.ts',
				'lib/core/email/client/change-password/changePassword': 'src/lib/core/email/client/change-password/changePassword.ts',
				'lib/core/email/server/change-password/changePassword': 'src/lib/core/email/server/change-password/changePassword.ts',
				'lib/core/email/client/request-password-reset/requestPasswordReset': 'src/lib/core/email/client/request-password-reset/requestPasswordReset.ts',
				'lib/core/email/server/forget-password/forgetPassword': 'src/lib/core/email/server/forget-password/forgetPassword.ts',
				'lib/core/email/client/reset-password/resetPassword': 'src/lib/core/email/client/reset-password/resetPassword.ts',
				'lib/core/email/server/reset-password/resetPassword': 'src/lib/core/email/server/reset-password/resetPassword.ts',
				'lib/core/email/client/send-verification-email/sendVerificationEmail':
					'src/lib/core/email/client/send-verification-email/sendVerificationEmail.ts',
				'lib/core/email/server/send-verification-email/sendVerificationEmail':
					'src/lib/core/email/server/send-verification-email/sendVerificationEmail.ts',
				'lib/core/email/client/sign-in-email/signInEmail': 'src/lib/core/email/client/sign-in-email/signInEmail.ts',
				'lib/core/email/server/sign-in-email/signInEmail': 'src/lib/core/email/server/sign-in-email/signInEmail.ts',
				'lib/core/email/client/sign-out/signOut': 'src/lib/core/email/client/sign-out/signOut.ts',
				'lib/core/email/server/sign-out/signOut': 'src/lib/core/email/server/sign-out/signOut.ts',
				'lib/core/email/client/sign-up-email/signUpEmail': 'src/lib/core/email/client/sign-up-email/signUpEmail.ts',
				'lib/core/email/server/sign-up-email/signUpEmail': 'src/lib/core/email/server/sign-up-email/signUpEmail.ts',
				'lib/core/account/client/link-social/linkSocial': 'src/lib/core/account/client/link-social/linkSocial.ts',
				'lib/core/account/client/list-accounts/listAccounts': 'src/lib/core/account/client/list-accounts/listAccounts.ts',
				'lib/core/account/server/list-accounts/listAccounts': 'src/lib/core/account/server/list-accounts/listAccounts.ts',
				'lib/core/account/client/unlink-account/unlinkAccount': 'src/lib/core/account/client/unlink-account/unlinkAccount.ts',
				'lib/core/account/server/unlink-account/unlinkAccount': 'src/lib/core/account/server/unlink-account/unlinkAccount.ts',
				'lib/core/session/client/get-session/getSession': 'src/lib/core/session/client/get-session/getSession.ts',
				'lib/core/session/server/get-session/getSession': 'src/lib/core/session/server/get-session/getSession.ts',
				'lib/core/user/client/update-user/updateUser': 'src/lib/core/user/client/update-user/updateUser.ts',
				'lib/core/user/server/update-user/updateUser': 'src/lib/core/user/server/update-user/updateUser.ts',
				'lib/core/oauth/client/sign-in/signIn': 'src/lib/core/oauth/client/sign-in/signIn.ts',
				'lib/core/oauth/server/sign-in/signIn': 'src/lib/core/oauth/server/sign-in/signIn.ts',
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
