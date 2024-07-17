const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  quitApp: () => ipcRenderer.send('quit-app'),
  minimizeWin: () => ipcRenderer.send('minimize-win'),
  setWinOnTop: (val) => ipcRenderer.send('set-win-ontop', val),
  getItem: (key) => ipcRenderer.sendSync('get-item', key),
  setItem: (key, val) => ipcRenderer.send('set-item', key, val),
  openLink: (link) => ipcRenderer.send('open-link', link),
})
