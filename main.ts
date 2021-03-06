
namespace Electron {

	const {app, Menu, BrowserWindow} = require("electron");
	const url: any = require("url");
	const path: any = require("path");

	let mainWindow = null;

	function createWindow() {
		mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: true,
			},
		});

		mainWindow.loadURL(
			url.format({
				pathname: path.join(__dirname, `/public/platform.html`),
				protocol: "file:",
				slashes: true,
			}),
		);

		mainWindow.on("closed", function() {
			mainWindow = null;
		});
	}

	app.on("ready", createWindow);

	app.on("window-all-closed", function() {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});

	app.on("activate", function() {
		if (mainWindow === null) {
			createWindow();
		}
	});

	const templateMenu: any = [
		{
			label: "File",
			submenu: [
				{role: "quit"},
			],
		},
		{
			label: "Edit",
			submenu: [
				{role: "undo"},
				{role: "redo"},
			],
		},
		{
			label: "View",
			submenu: [
				{
					label: "DevTools",
					click: () => {
						mainWindow.webContents.openDevTools({mode: "detach"});
					},
				},
			],
		},
	];

	const menu: any = Menu.buildFromTemplate(templateMenu);
	Menu.setApplicationMenu(menu);
}
