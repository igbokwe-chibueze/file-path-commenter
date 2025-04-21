# file-path-commenter

## Introduction

`file-path-commenter` is a Visual Studio Code extension that automatically inserts and maintains a single-line comment at the top of every file, reflecting its workspace-relative path (e.g., `// src/features/workspaces/create-workspace.ts`). It leverages VS Code’s `workspace.onDidCreateFiles` and `workspace.onDidRenameFiles` APIs to react immediately upon file creation and file moves/renames, ensuring the header stays accurate without manual intervention. By providing consistent, navigable “breadcrumbs” at the top of each file, it helps developers orient themselves within large codebases and accelerates onboarding and code reviews. Designed to be lightweight and non-intrusive, `file-path-commenter` follows VS Code’s UX Guidelines and extension-development best practices for minimal performance impact.

## Author

**Igbokwe Chibueze** ([github.com/igbokwe-chibueze](https://github.com/igbokwe-chibueze))

## Features

* **Automatic Path Insertion**
    On creating a new file, the extension computes `vscode.workspace.asRelativePath(uri)` and inserts a comment header at the top.
* **Live Path Synchronization**
    Whenever a file is moved or renamed, the extension replaces the existing header comment with the updated path.
* **Language-Aware Commenting**
    Detects the file’s language ID (e.g., `javascript`, `typescript`, `python`) and uses the appropriate comment delimiter (`//`, `#`, `/* ... */`) to match project conventions.
* **Configurable Exclusions**
    Allows users to exclude specific folders or glob patterns (e.g., `**/node_modules/**`, `**/*.md`) via the `filePathCommenter.excludePatterns` setting.
* **Manual Refresh Command**
    Provides a `filePathCommenter.refreshHeader` command to re-insert or correct headers on demand, useful for bulk file operations.

## Installation

* **Marketplace**
    Open the Extensions view (Ctrl+Shift+X), search for `file-path-commenter`, and click Install.
* **VSIX Package**
    Download `file-path-commenter-<version>.vsix` and in the Extensions view, choose `Install from VSIX…`.
* **Reload**
    Reload VS Code when prompted to activate the extension.

## Usage

* **Create a File**
    Save a new file (e.g., `example.ts`), and observe `// example.ts` automatically inserted as the first line.
* **Rename or Move**
    Rename or drag the file to another folder; upon saving, the header updates to reflect the new relative path.
* **Manual Refresh**
    Run the `Refresh Path Header` command from the Command Palette (Ctrl+Shift+P) to re-generate headers across open documents.

## Configuration

Add the following to your `settings.json` to customize behavior:

```jsonc
{
  // Exclude specific folders or files
  "filePathCommenter.excludePatterns": ["**/node_modules/**", "**/*.md"],

  // Choose comment style: "line" or "block"
  "filePathCommenter.commentStyle": "line",

  // Automatically refresh header on save
  "filePathCommenter.refreshOnSave": true
}
```

* `excludePatterns`: Glob patterns to ignore.
* `commentStyle`:
  * `"line"` uses single-line comments (e.g., `// path`).
  * `"block"` wraps in block comments (e.g., `/* path */`).
* `refreshOnSave`: When `true`, headers are validated on each save operation.

## Commands

| Command                              | Description                                              |
| :----------------------------------- | :------------------------------------------------------- |
| `filePathCommenter.refreshHeader`    | Manually refreshes the path header in the active file    |
| `filePathCommenter.toggleExclusions` | Toggle automatic header insertion for the workspace      |

## Known Issues

* **Binary Files**: Inserting text headers into non-textual files (e.g., images) is skipped, but may lead to warnings in some edge cases.
* **Large Bulk Moves**: Renaming or moving hundreds of files at once may take several seconds as each document is reopened and edited individually.

## Contributing

Contributions are welcome! Please follow these guidelines:

* **Fork the Repo**: Create a feature branch.
* **Write Tests**: Ensure core functionality is covered.
* **Follow VS Code Extension API Practices**: Use `WorkspaceEdit` transactions and clean up event listeners on `deactivate`.
* **Update Documentation**: Keep this README and `CHANGELOG.md` in sync with your changes.
* **Submit a Pull Request**: We review promptly—thank you for helping improve the project!

## Release Notes

### 1.0.0

Added language-aware comment style.
Configurable exclusion patterns.

## License

`file-path-commenter` is released under the MIT License.

Feel free to use, modify, and distribute under the terms of this permissive open-source license.
