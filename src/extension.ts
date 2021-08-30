import * as vscode from "vscode";
import { ConfigPanel } from "./ConfigPanel";
import { getWebviewOptions } from "./util";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("customEditor.start", () => {
      ConfigPanel.createOrShow(context.extensionUri);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(ConfigPanel.viewType, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        console.log(`Got state: ${state}`);
        // Reset the webview options so we use latest uri for `localResourceRoots`.
        webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
        ConfigPanel.revive(webviewPanel, context.extensionUri);
      },
    });
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
