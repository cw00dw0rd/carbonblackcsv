const {app, BrowserWindow} = require('electron')
const path = require('path')
const ipcMain = require('electron').ipcMain

//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let apiWindow

function createWindow () {
  // Create the browser window.
  // width/height based on 'client' request
  mainWindow = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    width: 800,
    height: 300
  })
  apiWindow = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    width: 800,
    height: 300,
    parent: mainWindow,
    modal: true
  })
  // and load the index.html of the app.
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))
  apiWindow.loadURL(path.join('file://', __dirname, './windows/apiWindow/index.html'))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // apiWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
ipcMain.on(`closeBtn`, function (event, arg) {
  mainWindow.close()
})
ipcMain.on(`saveAPIBtn`, function (event, arg) {
  apiWindow.close()
})

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
