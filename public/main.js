const { app, BrowserWindow } = require('electron');
require('@electron/remote/main').initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:8080');
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
