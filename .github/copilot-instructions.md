## Copilot instructions for contributors and AI agents

Repository status (quick):
- As of 2026-01-03 this workspace path is: `C:\Users\jcbob\OneDrive\Desktop\VentCleaners`.
- There were no source files discoverable in the repository root when this file was created. If you see code elsewhere, update this document with those paths.

If you are an automated coding assistant, start here (discovery checklist):

1. Locate project manifests and entry points (stop after you find the first match):
   - Node: look for `package.json` (root or subfolders). If present, look for `scripts` → `build`, `test`, `start`.
   - Python: `pyproject.toml`, `requirements.txt`, `setup.py`. Prefer `pytest` if `tests/` exists.
   - .NET: look for `*.sln`, `*.csproj` files. Use `dotnet build` / `dotnet test`.
   - Other: `Cargo.toml`, `pom.xml`, etc.

2. Find development tooling and config files that change expected behavior:
   - Linters: `.eslintrc*`, `pylintrc`, `stylecop.json` — run them if present before committing.
   - CI/workflow: `.github/workflows/*.yml` — check job steps for build/test commands and required environment variables.

3. Tests and smoke runs:
   - If `package.json` present: run in PowerShell

       npm install;
       npm test

   - If Python appears: create a venv and run tests

       python -m venv .venv;
       .\\.venv\\Scripts\\Activate.ps1;
       pip install -r requirements.txt; pytest -q

   - If .NET appears:

       dotnet restore; dotnet build; dotnet test

Conventions and expectations for this repo (inference and required confirmation):
- Repository currently appears empty — do not make large feature assumptions. Ask the human owner for the expected runtime, main language, or where source is stored (monorepo subfolder, separate branch, or another folder).
- When adding files, keep changes small and focused: one logical change per PR, include tests for behavior changes, and update README.md with run steps.

How to merge with an existing `.github/copilot-instructions.md`:
- If an older file exists, preserve any concrete, repo-specific commands (example: `scripts` names or `dotnet` commands) and append new discovery checklist items only if they reflect the real files present.

What good PRs look like in this repo:
- Small, self-contained changes with a short description of the goal.
- Include steps to run locally (PowerShell examples), and a one-line verification (what to run to confirm behavior).

If you (the assistant) are blocked by missing files or unclear intent:
- Ask one concise question, for example: “Where is the source code for this project (subfolder name) and which language/runtime should I target first?”

Next steps for a human reviewer:
- If this repo contains code in subfolders, please add the path(s) to the top of this file and include the project language/runtime and the preferred local test commands.

— end of auto-generated template —
