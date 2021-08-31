import * as vscode from "vscode";
import { ConfigEditorProvider } from "./ConfigEditor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(ConfigEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
