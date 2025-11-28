export const isChatBlock = (args: any): boolean => {
	if (!args) return false;
	const candidates = [args.name, args.file, args.fileName, args.path, args.projectName];
	for (const c of candidates) {
		if (typeof c === 'string' && c.includes('vscode-chat-code-block')) return true;
	}
	return false;
};

export const getResource = (args: any): string | undefined => {
	if (isChatBlock(args)) return '[VS Code Chat Code Block]';

	if (!args) return undefined;
	if (typeof args.name === 'string') return args.name;
	if (typeof args.file === 'string') return args.file;
	if (typeof args.fileName === 'string') return args.fileName;
	if (typeof args.path === 'string') return args.path;
	if (typeof args.projectName === 'string') return args.projectName;
	return undefined;
};

export const isPathMapped = (filePath: string, pathMappedFiles: Set<string>): boolean => {
	// Normalize slashes for comparison
	const normalizedPath = filePath.replace(/\\/g, '/');
	for (const mappedPath of pathMappedFiles) {
		if (normalizedPath.includes(mappedPath)) {
			return true;
		}
	}
	return false;
};
