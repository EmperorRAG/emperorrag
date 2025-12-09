/**
 * Constants
 */
const CHAT_BLOCK_MARKER = 'vscode-chat-code-block';
const RESOURCE_KEYS = ['name', 'file', 'fileName', 'path', 'projectName'];

/**
 * Atoms
 */

/**
 * Checks if a value is a string.
 */
const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if a string contains the chat block marker.
 */
const hasChatMarker = (value: string): boolean => value.includes(CHAT_BLOCK_MARKER);

/**
 * Checks if a value is a valid chat block candidate (string and contains marker).
 */
const isValidChatCandidate = (value: unknown): boolean => isString(value) && hasChatMarker(value);

/**
 * Extracts values from an object based on a list of keys.
 */
const getPotentialValues =
	(keys: string[]) =>
	(args: any): unknown[] =>
		args ? keys.map((key) => args[key]) : [];

/**
 * Normalizes a file path by replacing backslashes with forward slashes.
 */
const normalizePath = (path: string): string => path.replace(/\\/g, '/');

/**
 * Checks if the provided arguments indicate that the operation is related to a VS Code Chat code block.
 *
 * @param args - The arguments object from a trace event.
 * @returns `true` if the arguments contain a reference to a chat code block, `false` otherwise.
 *
 * @step 1. Check if `args` is null or undefined. If so, return `false`.
 * @step 2. Create a list of candidate properties (`name`, `file`, `fileName`, `path`, `projectName`) from `args` that might contain the file path or name.
 * @step 3. Iterate through the candidates. If a candidate is a string and includes the substring 'vscode-chat-code-block', return `true`.
 * @step 4. If no candidate matches, return `false`.
 */
export const isChatBlock = (args: any): boolean => (args ? getPotentialValues(RESOURCE_KEYS)(args).some(isValidChatCandidate) : false);

/**
 * Extracts a resource identifier (e.g., file path, project name) from the trace event arguments.
 *
 * @param args - The arguments object from a trace event.
 * @returns A string representing the resource, or `undefined` if no resource could be identified.
 *
 * @step 1. Check if the arguments indicate a chat block using {@link isChatBlock}. If so, return a placeholder string.
 * @step 2. Check if `args` is null or undefined. If so, return `undefined`.
 * @step 3. Check properties in the following order and return the first string found: `name`, `file`, `fileName`, `path`, `projectName`.
 * @step 4. If none of these properties are strings, return `undefined`.
 */
export const getResource = (args: any): string | undefined =>
	isChatBlock(args) ? '[VS Code Chat Code Block]' : args ? RESOURCE_KEYS.map((key) => args[key]).find(isString) : undefined;

/**
 * Determines if a given file path corresponds to a path that is mapped in the `tsconfig`.
 *
 * @param pathMappedFiles - A Set of normalized paths derived from `tsconfig` paths.
 * @param filePath - The file path to check.
 * @returns `true` if the `filePath` contains any of the mapped paths, `false` otherwise.
 *
 * @step 1. Normalize the input `filePath` by replacing backslashes with forward slashes to ensure consistent comparison.
 * @step 2. Iterate through each `mappedPath` in the `pathMappedFiles` Set.
 * @step 3. Check if the `normalizedPath` includes the `mappedPath`. If it does, return `true`.
 * @step 4. If the loop completes without a match, return `false`.
 */
export const isPathMapped =
	(pathMappedFiles: Set<string>) =>
	(filePath: string): boolean =>
		Array.from(pathMappedFiles).some((mappedPath) => normalizePath(filePath).includes(mappedPath));
