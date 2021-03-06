const { app, BrowserWindow, ipcMain } = require('electron');
const gotTheLock = app.requestSingleInstanceLock()
const path = require('path');
const isDevelopment = global.isDevelopment = !!process.env.npm_lifecycle_script
__dirname = path.resolve(__dirname).toString()
if (!gotTheLock) {
  console.error('There is already a session running! Exiting...')
  app.quit()
}
const createWindow = (indow) => {
  let mainWindow;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: '.assets/icon.png',
    width: 800,
    height: 700,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#36393f'
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

mainWindow.on('closed', () => {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null;
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

if (gotTheLock) {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (!mainWindow) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    let file = commandLine[commandLine.length - 1]
    if (file == '.') return
    mainWindow.loadURL(`file://${__dirname}/file.html`);
  })

  if (isDevelopment) mainWindow.webContents.openDevTools();

}}

const writeConfig = async (c = config) => {
  fs.writeFile(process.env.LOCALAPPDATA + '\\iiow-editor\\prefrences.json', JSON.stringify(c), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
  });
}

function getConfig() {
  const deafult = require('./deafult-config.json')
  let file
  try {
    let current = require(process.env.LOCALAPPDATA + '\\iiow-editor\\prefrences.json')
    file = { ...deafult, ...current }
    writeConfig(file)
  } catch (e) {
    file = deafult
    writeConfig(file)
  }
  return file
}

const https = require('https');
const fs = require('fs')
const extract = require('extract-zip')
const DiscordRPC = require('discord-rpc')
const clientId = '650469346883403786';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
require('./scripts/first.js')
let config = getConfig()
let startTimestamp = new Date()

let version = require('./package.json').version
global.loaded = {
  file: null,
  path: path.join(process.env.LOCALAPPDATA, 'IIslandsOfWar'),
  data: path.join(process.env.LOCALAPPDATA, 'iiow-editor', 'data')
}

global.version = {
  current: version,
  newest: null
}



app.on('ready', createWindow);


ipcMain.on('eval', async (event, command) => {
  if (!isDevelopment) return event.reply('eval', 'Eval is disabled while not in dev mode.')
  let responce
  try {
    responce = await eval(command)
  } catch (e) {
    responce = e.toString()
  }
  event.reply('eval', responce)
})


ipcMain.on('sprites', async (event, command) => {
  let responce
  try {
    responce = updateSprites()
  }
  catch (e) {
    console.error(e)
    responce = e
  }
  event.reply('sprites', responce)
})

ipcMain.on('ids', async (event, command) => {
  let responce
  try {
    responce = updateIds()
  }
  catch (e) {
    console.error(e)
    responce = e
  }
  event.reply('sprites', responce)
})

ipcMain.on('getConfig', async (event) => {
  event.reply('config', config)
})
ipcMain.on('setConfig', async (event, c) => {
  config = c
  writeConfig()
})

ipcMain.on('rpc', async (event, command) => {
  let defaults = {
    largeImageKey: 'icon-full',
    largeImageText: `IIOW Editor v${version}`,
    instance: false,
  }
  if (!command) return
  let result = { ...defaults, ...command }
  setActivity(result)
})

const updateSprites = async () => {
  const file = fs.createWriteStream(`${process.env.TMP}\\iiow-editor-sprites-tmp.zip`);
  https.get('https://raw.githubusercontent.com/WilsontheWolf/iiow-editor-api/master/sprites.zip', function (response) {
    response.pipe(file)
  })
  file.on('finish', () => {
    extract(`${process.env.TMP}\\iiow-editor-sprites-tmp.zip`, { dir: process.env.LOCALAPPDATA + '\\iiow-editor\\data\\sprites' }, function (err) {
      if (err)
        return console.error(err)
      fs.unlink(`${process.env.TMP}\\iiow-editor-sprites-tmp.zip`, err => {
        if (err)
          console.error(err)
      })
    })
    https.get('https://raw.githubusercontent.com/WilsontheWolf/iiow-editor-api/master/latest.json', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let final = JSON.parse(data)
        if (final) {
          config.spriteV = final.sprites
          writeConfig(config)
        }
      });

    }).on("error", (err) => {
      global.version.newest = 'unknown'
      console.error("Error: " + err.message);
    });
  })
};

const updateIds = async () => {
  const file = fs.createWriteStream(`${process.env.TMP}\\iiow-editor-ids-tmp.zip`);
  https.get('https://raw.githubusercontent.com/WilsontheWolf/iiow-editor-api/master/ids.zip', function (response) {
    response.pipe(file)
  })
  file.on('finish', () => {
    extract(`${process.env.TMP}\\iiow-editor-ids-tmp.zip`, { dir: process.env.LOCALAPPDATA + '\\iiow-editor\\data\\ids' }, function (err) {
      if (err)
        return console.error(err)
      fs.unlink(`${process.env.TMP}\\iiow-editor-ids-tmp.zip`, err => {
        if (err)
          console.error(err)
      })
    })
    https.get('https://raw.githubusercontent.com/WilsontheWolf/iiow-editor-api/master/latest.json', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let final = JSON.parse(data)
        if (final) {
          config.idV = final.ids
          writeConfig(config)
        }
      });

    }).on("error", (err) => {
      global.version.newest = 'unknown'
      console.error("Error: " + err.message);
    });
  })
};

async function setActivity(details = {
  details: `IIOW Editor`,//wut ur doing
  largeImageKey: 'icon-full',
  largeImageText: `IIOW Editor v${version}`,
  instance: false,
}) {
  if (!rpc) {
    return;
  }
  rpc.setActivity(details);
}

rpc.on('ready', () => {
  setActivity();
});

rpc.login({ clientId }).catch(console.error);

https.get('https://raw.githubusercontent.com/WilsontheWolf/iiow-editor-api/master/latest.json', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    let final = JSON.parse(data)
    if (final) global.version.newest = final
    else global.version.newest = 'unknown'
    if (config.spriteV < final.sprites && config.autoUpdateSprites) {
      updateSprites()
    }
    if (config.idV < final.ids && config.autoUpdateIds) {
      updateIds()
    }
  });

}).on("error", (err) => {
  global.version.newest = 'unknown'
  console.error("Error: " + err.message);
});