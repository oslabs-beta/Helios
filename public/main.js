// const { shell } = require('@electron/remote');
const { app, BrowserWindow } = require("electron");
require("@electron/remote/main").initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:8080");
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   shell.openExternal(url);
  //   return { action: 'deny' };
  // });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on('new-window', function (e, url) {
//   e.preventDefault();
//   app.shell.openExternal(url);
// });

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
