const { app, BrowserWindow, protocol } = require('electron');
require('../server/server.js');
require('@electron/remote/main').initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1200,
    title: 'Helios',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      // webSecurity: false,
    },
  });

  mainWindow.loadURL('http://localhost:4242');
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
