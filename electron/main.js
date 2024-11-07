const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const Store = require('electron-store')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 480,
    height: 720,
    frame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  ipcMain.on('minimize-win', () => win.minimize())
  ipcMain.on('set-win-ontop', (_, val) => win.setAlwaysOnTop(val))
  ipcMain.on('quit-app', () => app.quit())

  if (app.isPackaged) {
    win.loadFile('build/index.html') // production
  } else {
    win.loadURL('http://localhost:3000') // development
  }
}

const store = new Store({ name: 'auth', encryptionKey: 'aes-256-cbc' })

ipcMain.on('get-item', async (event, key) => (event.returnValue = store.get(key)))

ipcMain.on('set-item', (_, key, val) => store.set(key, val))

ipcMain.on('open-link', (_, link) => shell.openExternal(link))

app.whenReady().then(() => createWindow())
