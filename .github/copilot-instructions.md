## Repository-specific instructions for AI coding agents

> **Note:**: For general best practices, coding, and design patterns see [agents-md-best-practices](./agents-md-best-practices.md)

**Code commenting conventions:**
- **Do NOT add inline comments in code**. Explain changes, decisions, and implementation details in the chat response instead.
- Only add comments if absolutely necessary — prefer self-documenting code with clear names.
- If a comment is truly needed, place it as a header comment (JSDoc style) explaining **WHY** something is done, not **WHAT** it does.
- Example of acceptable comment:
  ```typescript
  /**
   * Uses a debounce to prevent excessive API calls when user types quickly.
   * Backend rate limit is 10 req/sec per user.
   */
  searchProducts(query: string): Observable<Product[]> { ... }
  ```
- Never add comments like `// Get all products` or `// Loop through items` — the code should be clear enough.

This repository contains a small TypeScript "clean architecture" sample in the
`clean-architecture/` folder. Follow these concrete, repo-specific rules when
editing, running, or adding code.

- Work inside the `clean-architecture/` subfolder. The project's `package.json`
  lives there and all npm scripts (test, dev) are defined for that package.

- Build & run (developer):
  - Install dependencies in `clean-architecture/` and run tests from there.
  - Example: open a shell in `clean-architecture/`, then `npm install` and
    `npm run test` to execute the test suite (Vitest). The `dev` script runs
    `node --loader ts-node/esm main.ts` to execute `main.ts` under ESM/ts-node.

- TypeScript & runtime model:
  - This is an ESM TypeScript project (tsconfig.json sets `module: nodenext` and
    `noEmit: true`). Source files are not emitted to `dist` by CI/build.
  - Keep new code TypeScript-first and compatible with `es2022`/ESM import
    semantics. Use `allowImportingTsExtensions` when importing `.ts` from
    `main.ts` (the project already imports `./src/shared/health.ts`).

- Test configuration and patterns:
  - Tests use Vitest. See `clean-architecture/vitest.config.ts`. Test files are
    discovered by the glob `tests/**/*.spec.ts` and Vitest runs in a `node`
    environment with globals enabled.
  - Use `describe` / `it` or `test` and prefer `.spec.ts` naming under `tests/`.
  - The test example to mirror is `clean-architecture/tests/shared/health.spec.ts`.

- Module aliases & import style:
  - Vitest resolves aliases defined in `vitest.config.ts`: `@domain`,
    `@application`, `@infrastructure`, `@composition`, and `@shared`.
  - When adding code, prefer these aliases (or update `vitest.config.ts` if you
    add a new top-level folder). Tests and source import paths should match
    those aliases.

- Coding conventions & constraints discovered from config:
  - `tsconfig.json` has `strict: true` and `noUncheckedIndexedAccess`. New code
    must type-check under those strict rules.
  - Avoid changing module/emit-related flags (`module`, `noEmit`, `isolatedModules`)
    without good reason — they reflect the ESM/ts-node dev flow.

- Small examples to follow (concrete patterns):
  - Health function: `src/shared/health.ts` returns a small typed object `Health`
    with `status`, `uptime`, and `timestamp`. Unit test shows how to assert the
    timestamp ISO format and recency — follow that pattern for small utility tests.
  - `main.ts` demonstrates how the project runs under `node --loader ts-node/esm`
    by importing a `.ts` file directly.

- When editing or adding files:
  - Update `tests/` with a `.spec.ts` covering behavior; run `npm run test`.
  - Use the aliases from `vitest.config.ts` in both source and tests.
  - Ensure TypeScript compiles under the project's `tsconfig.json` settings
    (strict mode). Even though `noEmit` is true, run a local tsc check if you
    want type-safety: `npx tsc --noEmit` inside `clean-architecture/`.

- What not to change lightly:
  - `vitest.config.ts` alias names, `tsconfig.json` module and strict flags,
    and the test glob `tests/**/*.spec.ts` — changing them affects tests and
    developer workflows. If you must change one, update references and tests.

- If anything here is unclear or you'd like more examples (for example: where to
  add new domain services or how to wire composition code), tell me which area
  you want expanded and I'll update this file with targeted examples.
