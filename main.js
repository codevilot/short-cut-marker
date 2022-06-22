const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const storage = require("electron-localStorage");
const ipc = ipcMain;
const path = require("path");
const fs = require("fs");
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.webContents.on("did-finish-load", (evt) => {
    mainWindow.webContents.send("onWebcontentsValue", "on load...");
  });
  const openFile = (filePath) => {
    fs.readFile(filePath, "utf8", (error, content) => {
      app.addRecentDocument(filePath);
      openedFilePath = filePath;
      mainWindow.webContents.send("document-opened", { filePath, content });
      storage.setItem("recentfile", filePath);
      // }
    });
  };

  ipc.on("minimizeApp", () => {
    mainWindow.minimize();
  });

  ipc.on("maximizeApp", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  ipc.on("closeApp", () => {
    mainWindow.close();
  });
  ipc.on("open-document", () => {
    dialog
      .showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "text files", extensions: ["txt"] }],
      })
      .then(({ filePaths }) => {
        const filePath = filePaths[0];
        openFile(filePath);
      });
  });
  ipc.on("file-content-updated", (_, textareaContent) => {
    fs.writeFile(openedFilePath, textareaContent, (error) => {
      if (error) {
        handleError();
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
