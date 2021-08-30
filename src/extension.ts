import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "customeditor" is now active!');

  let disposable = vscode.commands.registerCommand(
    "customeditor.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from customeditor!");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
