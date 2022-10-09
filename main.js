const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const storage = require("electron-localStorage");
const ipc = ipcMain;
const path = require("path");
const fs = require("fs");
let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
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
    });
  };

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
  ipc.on("open-browser", () => {
    createChildWindow();
  });
  ipc.on("file-content-updated", (_, textareaContent) => {
    fs.writeFile(openedFilePath, textareaContent, (error) => {
      if (error) {
        handleError();
      }
    });
  });
};
const createChildWindow = () => {
  childWindow = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      enableremotemodule: "true",
    },
  });
  ipc.on("close-browser", () => {
    childWindow.close();
  });
  childWindow.loadFile("./browser/browser.html");
  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });
};

ipcMain.on("openChildWindow", (event, arg) => {
  createChildWindow();
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
