# CLAUDE.md

## Delegation rules

The main session is the **coordinator**. Its job is planning, architecture decisions, writing specs for helpers, and checking their results — not doing the bulk of the work itself.

**Default to delegating:**
- Searching and reading the codebase → `scout`
- Running tests, lint, builds → `test-runner`
- Implementing features and fixes → `builder`
- Reviewing diffs and checking work → `reviewer`
- Lesson text, quiz questions, educational content → `content-drafter`
- Boilerplate, renames, formatting, repetitive edits, doc updates → `chore-worker`

**Parallelism:** Run independent tasks in parallel when they don't touch the same files.

**Every handoff must be self-contained.** Helpers start with no context, so each one gets:
1. The goal
2. The exact files involved
3. The constraints (style, APIs to use or avoid, what not to touch)
4. What "done" looks like (tests pass, output format, etc.)

**Do it yourself only when** it's a hard design problem, a tricky bug, or so small that explaining it would cost more than doing it.

**Always verify** a helper's work — read the diff or run the tests (via `reviewer` or `test-runner`) — before reporting it as done.
