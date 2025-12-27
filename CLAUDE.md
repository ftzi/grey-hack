# Grey Hack Project

This is a project containing multiple programs for the Grey Hack game.


## Understanding Keywords

This and other documents use keywords to indicate requirement severity:

- **MUST** — Mandatory. No exceptions. Violations cause issues.
- **NEVER** — Prohibited. Will cause problems or break functionality.

These represent hard-learned lessons and project-critical requirements.

When writing information to CLAUDE.md itself, these keywords **MUST** be used to clearly indicate requirement severity.


## Language & Tools

- **Language**: Greyscript programming language
- **Transpiler**: [Greybel](https://github.com/ayecue/greybel-js/tree/master)


## Code Principles

Follow Clean Code + SOLID + KISS + YAGNI

- **Clean Code**: Self-documenting, readable code with meaningful names and single responsibility
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Simplest solution that solves the problem, avoid over-engineering
- **YAGNI**: Don't add functionality until actually needed


## Documentation Standards

All class definitions **MUST** include a `@type` JSDoc comment immediately before the class definition.

**Wrong:**
```greyscript
// Missing @type comment
Kv = {}

Kv.New = function(path, headers)
    // ...
end function
```

**Right:**
```greyscript
/*
  Key-value storage using semicolon-separated file format.

  @type Kv
*/
Kv = {}

Kv.New = function(path, headers)
    // ...
end function
```


## Custom Standard Library

The project has custom utility methods defined in `src/lib/std.src`.

You **MUST** check `src/lib/std.src` before implementing utility functions to see what custom methods are already available for general usage. This includes extended functionality for strings, lists, maps, and other common operations.

**IMPORTANT:** Greyscript's built-in `list.sort()` method has a bug where it crashes on empty lists or lists with a single element. You **MUST** always check the list length before calling `.sort()`:

```
if (list.len > 1) then list.sort("property")
```

Alternatively, use the custom `list.sort2()` function which handles edge cases properly.


## Testing Requirements

FILES MUST BE TESTABLE.

You **NEVER** should expect the user to manually run or try changes. All code must be testable automatically.

Functions must be testable. They should have parameters and usually at max 30 lines each.

**IMPORTANT:** New features or changes to existing features **MUST** have associated tests. You **MUST** write tests for any new functionality or modifications before considering the task complete.

You **MUST** run `bun run test` to ensure all tests pass after finishing changes.


## Debugging Runtime Errors

When the user provides a runtime error with a path like `/root/x line 538`, this points to the **transpiled/built code**, not the source code.

**You MUST** follow this process:

1. Check `/build/x.src` to see the transpiled version and understand the error
2. Find the corresponding source file (e.g., `src/x.src`)
3. Fix the source file, not the built file

The error points to the compiled output, but you must edit the source files in `src/`.

Example:
```
Runtime Error: Index Error: list index (0) out of range (0 to -1) [/root/x line 538]
```
→ Check `/build/x.src` line 538 to understand the issue
→ Fix `src/x.src` (or the file it includes)


If you discover any information in this file that is no longer accurate or has become outdated, you **MUST** update it immediately to reflect the current state of the codebase.

**NEVER commit or push:** Do NOT run `git add`, `git commit`, or `git push`. The user handles all git operations manually.
