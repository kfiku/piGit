// setting env var
const env = process.env.NODE_ENV || 'production';
const dev = env === 'dev';

console.log(env);

const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const settings = require('electron-settings');

let mainWindow

function createWindow () {
  if (dev) {
    const installExtension = require('electron-devtools-installer');
    installExtension.default(installExtension.REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    require('electron-debug')({showDevTools: true});
  }

  let win = settings.get('window');

  win = win || {x: 100, y: 100, width: 800, height: 600}
  win.icon = __dirname + '/logo/piGit.png';
  mainWindow = new BrowserWindow(win);

  if(dev) {
    mainWindow.loadURL(`http://localhost:4444`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  let ti;
  const saveWindowBounds = function () {
    clearTimeout(ti);
    ti = setTimeout(() => {
      settings.set('window', mainWindow.getBounds());
    }, 1000);
  }

  mainWindow.on('resize', saveWindowBounds);
  mainWindow.on('move', saveWindowBounds);

  mainWindow.setMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
