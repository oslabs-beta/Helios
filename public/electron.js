// const { shell } = require('@electron/remote');

const { app, BrowserWindow, protocol } = require('electron');
const url = require('url');
const path = require('path');
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

  // mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   shell.openExternal(url);
  //   return { action: 'deny' };
  // });
  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(
  //       __dirname,
  //       'index.html'
  //     ) /* Attention here: origin is path.join(__dirname, 'index.html') */,
  //     protocol: 'file',
  //     slashes: true,
  //   })
  // );
  mainWindow.loadURL('http://localhost:4242');
}

app.on('ready', () => {
  // protocol.interceptFileProtocol(
  //   'file',
  //   (request, callback) => {
  //     const url = request.url.substr(7); /* all urls start with 'file://' */
  //     callback({ path: path.normalize(`${__dirname}/${url}`) });
  //   },
  //   (err) => {
  //     if (err) console.error('Failed to register protocol');
  //   }
  // );
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
