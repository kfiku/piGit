// setting env var
const env = process.env.NODE_ENV || 'prod';

const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const installExtension = require('electron-devtools-installer');
installExtension.default(installExtension.REDUX_DEVTOOLS);

const electronSettings = require('electron-settings');

if (env === 'dev') {
  require('electron-debug')({showDevTools: true});
}

let mainWindow

function createWindow () {
  electronSettings.get('window').then((win) => {
    mainWindow = new BrowserWindow(win || {x: 100, y: 100, width: 800, height: 600})
    mainWindow.loadURL(`file://${__dirname}/src/index.html`)

    mainWindow.on('closed', function () {
      mainWindow = null
    })

    let ti;
    mainWindow.on('resize', () => {
      clearTimeout(ti);
      ti = setTimeout(() => {
        electronSettings.set('window', mainWindow.getBounds());
      }, 1000);
    });

    mainWindow.setMenu(null)

    if (env === 'dev') {
      // simple livereload
      const chokidar = require('chokidar');
      chokidar.watch('src/**/*.(js|css)', {
          ignored: /[\/\\]\./,
          persistent: true
        })
        .on('all', (event, path) => {
          mainWindow.reload();
        }
      );
    } else {
    }
  });
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

