/**
 * Atomic Actions for Policy Extraction:
 *
 * 1. Extract Auth Options
 *    - Input: `AuthServer` instance
 *    - Action: Access the `options` property from the `AuthServer` instance.
 *    - Output: `BetterAuthOptions` object (or undefined).
 *
 * 2. Extract Email & Password Configuration
 *    - Input: `BetterAuthOptions`
 *    - Action: Access the `emailAndPassword` property.
 *    - Output: Email and password configuration object (or undefined).
 *
 * 3. Extract Minimum Password Length
 *    - Input: Email and password configuration
 *    - Action: Access `minPasswordLength`.
 *    - Logic: If undefined, default to 8.
 *    - Output: `number`.
 *
 * 4. Extract Maximum Password Length
 *    - Input: Email and password configuration
 *    - Action: Access `maxPasswordLength`.
 *    - Logic: If undefined, default to 32.
 *    - Output: `number`.
 *
 * 5. Construct Password Policy
 *    - Input: Min and Max lengths
 *    - Action: Create a `PasswordPolicy` object.
 *    - Output: `{ minLength: number; maxLength: number }`.
 *
 * 6. Construct Global Policy
 *    - Input: `PasswordPolicy` (and future sub-policies)
 *    - Action: Aggregate into a single `Policy` object.
 *    - Output: `Policy` object.
 */
