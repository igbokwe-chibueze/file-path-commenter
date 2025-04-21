// The module 'vscode' contains the VS Code extensibility API
// We import it here to access classes and functions for building our extension.
import * as vscode from 'vscode';

// This function is called when your extension is activated.
// Activation occurs the first time a registered activation event fires,
// such as when a command is executed or a file event we listen for happens.
export function activate(context: vscode.ExtensionContext) {
    // ------------------------------------------------------------
    // Listener 1: Handle newly created files in the workspace
    // ------------------------------------------------------------
    // onDidCreateFiles fires whenever one or more files are created
    // via the VS Code UI (e.g. "New File") or programmatically.
    const createListener = vscode.workspace.onDidCreateFiles(async e => {
        // e.files is an array of Uri objects representing each created file
        for (const uri of e.files) {
            // Compute the file’s path relative to the workspace root.
            // asRelativePath strips the absolute prefix so you get e.g. "src/index.ts".
            const relPath = vscode.workspace.asRelativePath(uri);
            // Format the comment string we’ll insert at the top of the new file.
            // We add a newline so subsequent content shifts down one line.
            const comment = `// ${relPath}\n`;

            // Create a WorkspaceEdit to batch our file modifications.
            const edit = new vscode.WorkspaceEdit();
            // Insert the comment at position (line 0, character 0): the very top.
            edit.insert(uri, new vscode.Position(0, 0), comment);

            // Apply the workspace edit so VS Code writes the change to disk.
            await vscode.workspace.applyEdit(edit);
        }
    });
    // Register the listener so it’s disposed when the extension is deactivated.
    context.subscriptions.push(createListener);

    // ------------------------------------------------------------
    // Listener 2: Handle file renames or moves in the workspace
    // ------------------------------------------------------------
    // onDidRenameFiles fires whenever files are renamed or moved.
    const renameListener = vscode.workspace.onDidRenameFiles(async e => {
        // e.files is an array of { oldUri, newUri } pairs
        for (const { newUri } of e.files) {
            // Compute the new relative path after rename/move
            const relPath = vscode.workspace.asRelativePath(newUri);
            // Build the new comment string (no trailing newline here)
            const comment = `// ${relPath}`;

            // Open the file document so we can read its contents and ranges
            const doc = await vscode.workspace.openTextDocument(newUri);
            // Get the range of the first line (where the old header comment lives)
            const firstLine = doc.lineAt(0).range;

            // Create another WorkspaceEdit for this rename update
            const edit = new vscode.WorkspaceEdit();
            // Replace the old header comment (first line) with the new path comment
            edit.replace(newUri, firstLine, comment);

            // Apply the edit to update the file on disk
            await vscode.workspace.applyEdit(edit);
        }
    });
    // Register the rename listener for automatic disposal
    context.subscriptions.push(renameListener);
}

// This function is called when your extension is deactivated.
// It's a good place to clean up resources, though here we rely on context.subscriptions
// to automatically remove our event listeners.
export function deactivate() {}
