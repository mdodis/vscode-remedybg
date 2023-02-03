import * as vscode from 'vscode';
import * as proc from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('vscode-remedybg.openCurrentFile', rdbgOpenCurrentFile); context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('vscode-remedybg.openSession', rdbgOpenSession);             context.subscriptions.push(disposable);
}

class SessionItem implements vscode.QuickPickItem {
	uri: vscode.Uri;
	label: string;
	kind?: vscode.QuickPickItemKind | undefined;
	description?: string | undefined;
	detail?: string | undefined;
	picked?: boolean | undefined;
	alwaysShow?: boolean | undefined;
	buttons?: readonly vscode.QuickInputButton[] | undefined;

	constructor(uri: vscode.Uri) {
		this.uri = uri;
		this.label = path
			.basename(uri.path)
			.replace('.rdbg', '');
		
		this.kind = vscode.QuickPickItemKind.Default;
		this.description = uri.path;
	}
}

function rdbgOpenSession() {
	vscode.workspace.findFiles('**/*.rdbg').then((uris: vscode.Uri[]) => {

		let items: SessionItem[] = new Array<SessionItem>();
		uris.forEach(uri => {
			items.push(new SessionItem(uri));
		});

		vscode.window.showQuickPick(items).then((value: SessionItem | undefined) => {
			proc.exec(`remedybg.exe ${value?.uri.fsPath}`);
		});
	});
}

function rdbgOpenCurrentFile() {
	var filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
	var fileLine = vscode.window.activeTextEditor?.selection.active.line;
	if (filePath != undefined) {
		proc.exec(`remedybg.exe open-file ${filePath} ${fileLine}`);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
