const { app, BrowserWindow } = require('electron');
const isDevelopment = global.isDevelopment = !!process.env.npm_lifecycle_script
const path = require('path');
const https = require('https');
__dirname =path.resolve(__dirname).toString()
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
let version = require('./package.json').version
console.log(process.argv)
global.test = process.argv
global.loaded = {file: null,
  path:process.env.LOCALAPPDATA+'\\IIslandsOfWar'}

  global.version = {current: version,
    newest:null}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

https.get('https://raw.githubusercontent.com/WilsontheWolf/iiow-editor-api/master/latest.json', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    let final = JSON.parse(data)
    console.log(final);
    if (final) global.version.newest = final
    else global.version.newest = 'unknown'
  });

}).on("error", (err) => {
  global.version.newest = 'unknown'
  console.log("Error: " + err.message);
});
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon:'.assets/icon.png',
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#36393f'
  })

  require('./scripts/first.js')
  // and load the index.html of the app
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
 if(isDevelopment) mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
