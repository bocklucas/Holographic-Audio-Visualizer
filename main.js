const electron = require('electron')

/** Express server for IPC */
const express = require('express')
const server = express()

server.get('/next', function (req, res) {
  mainWindow.webContents.send("control", "NEXT")
  res.send('success');
})

server.get('/prev', function (req, res) {
  mainWindow.webContents.send("control", "PREVIOUS")
  res.send('success');
})

server.get('/toggle', function (req, res) {
  mainWindow.webContents.send("control", "TOGGLE_PLAY")
  res.send('success');
})

server.get('/volume', function (req, res) {
  let volume = Number(req.query['level']);
  if (volume) {
    volume = volume > 100 ? 100 : volume;
    volume = volume < 0 ? 0 : volume;
    volume = volume / 100.0;
    mainWindow.webContents.send("volume", volume.toString());
  }
  res.send('success');
})

server.get('/toggleVis', function(req, res) {
  mainWindow.webContents.send("control", "TOGGLE_VISUALIZER_SETTING")
  res.send("success");
})

server.get('/changeVis', function(req, res) {
  mainWindow.webContents.send("control", "CHANGE_VISUALIZER")
  res.send("success");
})

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.maximize();
  mainWindow.setFullScreen(true);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
