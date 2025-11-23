# Past Prompts

```plaintext
Create an implementation plan for converting the types in the types.ts file to take in a generic from the AuthClient type in client.ts to determine the properties and property types of the types in types.ts. This conversion is to account for instances where a better-auth plugin addings a new property to any of the Api methods, then the types automatically adjust for the additional plugin's impact.
```

```plaintext
My objective is to provide as much useful context for AI models when working in the client folder. My idea is that there will be a README.md, CONTRIBUTING.md and SUMMARY.md file in each of the folders in client that have their content scoped to the folder the markdown files are in. AI models would use the SUMMARY.md files for context that summarises the contents of each file's content and the summary of the collective purpose of the typescript files in the folder it is in. AI models would use the CONTRIBUTING.md files for context on the requirements for code within the CONTRIBUTING.md file's directory. AI models and humans would use the README.md files for more detailed context on the README.md file's directory content. Create an implementation plan for achieving my objective.
```

```plaintext
Parse through this CONTRIBUTING file and for every section that you can't make a markdown file reference for, remove the section from the file, for sections which you can make a markdown file reference to, add the markdown file reference to the referenced file's content.
```

```plaintext
Create and implementation plan to implement the equivalent of the client.types.ts file's types, but for the server api in server.types.ts. You don't have to make sure that the types your create work 100% right away because I can only confirm they are correct when I start implementing the server equivalents for the core/email/server functionality. Use the internet to see how the better-auth server functionality is used aka auth.api.signIn.email, or use the context7 mcp tools to do so, the objective is that seeing the usage of the auth.api will help you in creating the quivalent types in server.types.ts.
```

```plaintext
I'm trying to figure out an approach for testing the better-auth functionality that I expose with my better-auth-utilities package, but I hit the issue of requiring a better-auth database instance to perform tests on. I have primarily used postgreSQL to provide the databases I need for my Nx monorepo packages whenever they require a database, but setting up a postgreSQL database every single time I need to run automated tests for the better-auth-utilities package seems like it would be a fairly complex process to implement. Using postgreSQL isn't a requirement for the database so I thought using a more simpler database framework for the bewtter-auth-utilities package's automated tests would be more suitable. I had the idea of using SQLite for the automated testing as its a file based database would should be easy to setup for the tests and cleanup after the tests. I also think that using SQLite is beneficial because of node.js' support for SQLite, and better-auth's support for using the node.js' SQLite; the automated tests also run in a node environment so it works nicely with node.js' SQLite. I would like you to create an implementation plan for using better-auth's support for node.js' SQLite implementation to facilitate the database instance that will be used for the better-auth-utilities package's automated tests; use the context7 mcp tools to help you when you need documentation on packages.
```

```plaintext
I am on node version 24.6.0 so I do have access to node:sqlite. Adjust the implementation plan to account for node:sqlite being used.
```

```plaintext
I'm sure you have also seen in my better-auth-utilities package that I like to expose types for different properties of the better-auth library to make it easier for users when they want to know the properties for the functionality exposed by their specific better-auth instances and config setups. I see for step 2 of the implementation plan, there is an opportunity to create and use a new type that exposes the database options from the better-auth library. I would like this new type is be similar in design to how my other types in the better-auth-utilities package infer the properties and types from the better-auth instance. Please adjust the implementation plan to account for creating and using this new type.
```

```plaintext
Does the implementation plan account for testing both the better-auth-utilities package's client and server functionality? I'm asking because of step 3 of the implementation plan only mentioning server related actions and not any client related actions so I'm unsure if this implementation plan you have made accounts for me wanting to test both the client and server variants of the better-auth-utilities package's functionality. If the implementation plan doesn't account for the client variants of the better-auth-utilities package's functionality, then adjust the implementation plan to account for the client variants of the better-auth-utilities package's functionality.
```

```plaintext
What safe guards are in place for this implementation plan to prevent the AI agent implementing this plan from over engineering the implementation? If there are no safe guards in place to prevent the AI agent implementing this plan from over engineering the implementation, then adjust the implementation plan to account for preventing the AI agent implementing this plan from over engineering the implementation.
```

```plaintext
Create an implementation plan for implementing automated tests for the functionality provided in the server and client folders for the variants of the email functionality in the better-auth-utilities package. These automated tests should only need to make mocks for the emailing functionality of the better-auth instance as the setup-test-env.ts file provides functionality for testing with actual better-auth instances and databases. Avoid over engineering the automated tests.
```

```plaintext
Create an implementation plan for removing any elements of over engineering in these test files provided as context. Also account for there no longer needing to be mocks of the better-auth instance or database as actual instances of the better-auth instance and database are provided through the setup-test-env.ts file's functionality.
```

```plaintext
Create an implementation plan for implementing the core account functionality exposed by the better-auth library. The core email folder has been provided as context to guide you on how to design the account folder's functionality. The core folder has been provided as context to show that only the better-auth library's account functionality be implemented in the account folder as there are subfolders in the core folder for user, session, oath and email which currently or will in the future contain their respective better-auth library's functionality that is not exposed by better-auth library plugins. Some of the offline official documentation for the better-auth library has been provided as context through the official-documentation folder. You have access to the Context7 MCP tools to help with additional documentation on libraries such as better-auth for example. In essence, this implementation plan is phase 2 in a hypthetical implementation plan for exposing the better-auth library's core functrionality where phase 1 was the implementation of the core better-auth library's email functionality.
```

```plaintext
Adjust the implementation plan to account for OAuth functionality being implemented in the oauth folder in the future so for now, any integration with oauth functionality should be mocked.
```

```plaintext
See how in the email functionalities' types files that the types infer the properties and the properties' types from the better-auth instance. See how in the account functionalities' types files that the types are not implemented the same way as the email functionalities' types files where the types infer the properties and the properties' types from the better-auth instance. Create an implementation plan to correct the account functionalities' types files, and then to subsequently correct the code in the account functionalities' files to now account for the corrected account functionalities' types files' content. The current account functionalities' types files not inferring the properties and the properties' types from the better-auth instance is likely the reason why AI agents will struggle to implement tests for the code they generate.
```

```plaintext
See how in the email functionalities' test files that the tests use real better-auth instances provided by the setup-test-env.ts file. See how in the account functionalities' test files that the tests are not implemented the same way as the email functionalities' test files where the tests use real better-auth instances provided by the setup-test-env.ts file. Create an implementation plan to correct the account functionalities' test files.
```

```plaintext
You didn't update the tests to not use mocks for the better-auth client, and instead to use the better-auth client provided by setup-test-env.ts. You are hereby absolutely forbidden from mocking the better-auth client or better-auth server api. Correct the account functionalities' test files.
```

```plaintext
Have you considered that the tests might be failing because you need to sign up an account, then login with that account, then you now have access to the session data, finally you can make calls that affect accounts because you're logged in with the user so you're editing the user's account.
```

```plaintext
Ignore implementing tests for now since it seems like additional functionality needs to first be implemented before the tests will succeed.
```
