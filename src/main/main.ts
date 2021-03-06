const env = process.env.NODE_ENV || 'development';
const dev = env === 'development';

const path = require('path');
const url = require('url');
const isDevElectron = require('electron-is-dev'); // is dev electron (run from builded version)
const electron = require('electron'); // Module to control application life.
import * as logger from './logger';
import * as windowBounds from './windowBounds';
import getIcon from './icon';
// const autoUpdater = require('./autoUpdater') // comming soon

const { app, BrowserWindow, globalShortcut } = electron; // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  if (!isDevElectron) {
    // autoUpdater.checkForUpdates(); // comming soon
  }

  if (dev) {
    // const installExtension = require('electron-devtools-installer');
    // installExtension.default(installExtension.REDUX_DEVTOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));

    // installExtension.default(installExtension.REACT_DEVELOPER_TOOLS)
    //   .then((name) => console.log(`Added Extension:  ${name}`))
    //   .catch((err) => console.log('An error occurred: ', err));

    require('electron-debug')({showDevTools: true});
  }

  // Create the browser window.

  mainWindow = new BrowserWindow({
    ...windowBounds.get(),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    icon: getIcon()
  });

  logger.init(mainWindow);
  windowBounds.init(mainWindow);

  if (dev) {
    mainWindow.loadURL('http://localhost:4444');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(app.getAppPath(), 'dist', 'renderer', `index.html`),
      protocol: 'file:',
      slashes: true
    }));
    // mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  console.log('will-quit');
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
