// setting env var
const env = process.env.NODE_ENV || 'prod';

const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const electronSettings = require('electron-settings');

let mainWindow

function createWindow () {
  if (env === 'dev') {
    const installExtension = require('electron-devtools-installer');
    installExtension.default(installExtension.REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    require('electron-debug')({showDevTools: true});
  }

  electronSettings.get('window').then((win) => {
    win = win || {x: 100, y: 100, width: 800, height: 600}
    win.icon = __dirname + '/logo/piGit.png';
    mainWindow = new BrowserWindow(win);
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    mainWindow.on('closed', function () {
      mainWindow = null
    });

    let ti;
    const saveWindowBounds = function () {
      clearTimeout(ti);
      ti = setTimeout(() => {
        electronSettings.set('window', mainWindow.getBounds());
      }, 1000);
    }

    mainWindow.on('resize', saveWindowBounds);
    mainWindow.on('move', saveWindowBounds);

    mainWindow.setMenu(null);

    if (env === 'dev') {
      // simple livereload js
      const chokidar = require('chokidar');
      chokidar.watch('src/**/*.js', {
          ignored: /[\/\\]\./,
          persistent: true
        })
        .on('all', (event, path) => {
          mainWindow.reload();
        }
      );
      // watch css
      chokidar.watch('src/css/*.css', {
          ignored: /[\/\\]\./,
          persistent: true
        })
        .on('all', (event, path) => {
          // mainWindow.reload();
          mainWindow.webContents.executeJavaScript(`
            document.querySelectorAll('link[rel=stylesheet]')
              .forEach(function(link){
                link.href = link.href.replace(/\\?t=[0-9]+/, '?t=' + Date.now())
              })
          `);
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
