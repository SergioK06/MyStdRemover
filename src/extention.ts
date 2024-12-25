import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('my-std-remover.removeStd', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const text = document.getText();

            const usingNamespaceStd = 'using namespace std;\n';

            if (text.includes(usingNamespaceStd)) {
                vscode.window.showInformationMessage("using namespace std; уже существует");
                return;
            }


            const modifiedText = text.replace(/std::/g, '');

            const includeMatch = modifiedText.match(/#include/);
            let insertPosition = 0;
            if (includeMatch) {
                insertPosition = modifiedText.indexOf(includeMatch[0]);
            }

            const finalModifiedText = usingNamespaceStd + modifiedText.slice(0,insertPosition) + modifiedText.slice(insertPosition)


            editor.edit(editBuilder => {
                const firstLine = new vscode.Range(
                    document.lineAt(0).range.start,
                    document.lineAt(document.lineCount - 1).range.end
                );
                editBuilder.replace(firstLine, finalModifiedText);
            });
            vscode.window.showInformationMessage("std:: removed and using namespace std; added");
        } else {
            vscode.window.showErrorMessage("No active text editor found.");
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}