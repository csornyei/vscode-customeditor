import * as vscode from "vscode";
import { getNonce } from "./util";

export class ConfigEditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new ConfigEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      ConfigEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "customEditor.ConfigEditor";

  constructor(private readonly context: vscode.ExtensionContext) {}
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: "update",
        text: document.getText(),
      });
    }

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview();
        }
      }
    );

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case "add-element":
          console.log(e.payload);
          this.addElement(document, e.payload.name);
          return;

        case "add-model":
          this.addModel(document, e.payload.name, e.payload.model);
          return;
      }
    });

    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptAppUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "out", "js", "app.js")
    );
    console.log(scriptAppUri);
    const scriptVendorUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "out",
        "js",
        "chunk-vendors.js"
      )
    );
    const styleVscodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "vscode.css")
    );

    const nonce = getNonce();

    return `
        <!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleVscodeUri}" rel="stylesheet">

				<title>Custom Editor</title>
			</head>
			<body>
				<div id="app" />
				<script nonce="${nonce}" src="${scriptAppUri}"></script>
				<script nonce="${nonce}" src="${scriptVendorUri}"></script>
			</body>
			</html>`;
  }

  private addElement(document: vscode.TextDocument, elementName: string) {
    const json = this.getDocumentAsJson(document);
    json.elements = [
      ...(Array.isArray(json.elements) ? json.elements : []),
      {
        id: getNonce(),
        name: elementName,
        models: [],
        created: Date.now(),
      },
    ];

    return this.updateTextDocument(document, json);
  }

  private addModel(
    document: vscode.TextDocument,
    elementName: string,
    model: any
  ) {
    const json = this.getDocumentAsJson(document);
    const elements = json.elements;
    const elementIdx = elements.findIndex(
      (v: { id: string; name: string; models: any[]; created: number }) =>
        v.name === elementName
    );
    const e = { ...elements[elementIdx] };
    e.models.push(model);
    elements[elementIdx] = e;
    json.elements = [...elements];

    return this.updateTextDocument(document, json);
  }

  private getDocumentAsJson(document: vscode.TextDocument): any {
    const text = document.getText();
    if (text.trim().length === 0) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        "Could not get document as json. Content is not valid json"
      );
    }
  }

  private updateTextDocument(document: vscode.TextDocument, json: any) {
    const edit = new vscode.WorkspaceEdit();

    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(json, null, 2)
    );

    return vscode.workspace.applyEdit(edit);
  }
}
