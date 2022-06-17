const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const ipc = ipcMain;
const path = require("path");
const fs = require("fs");
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.setAlwaysOnTop(true, "floating");
  // 웹 페이지 로드 완료
  mainWindow.webContents.on("did-finish-load", (evt) => {
    // onWebcontentsValue 이벤트 송신
    mainWindow.webContents.send("onWebcontentsValue", "on load...");
  });

  const openFile = (filePath) => {
    fs.readFile(filePath, "utf8", (error, content) => {
      // if (error) {
      //   handleError();
      // } else {
      app.addRecentDocument(filePath);
      openedFilePath = filePath;
      mainWindow.webContents.send("document-opened", { filePath, content });
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
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // onInputValue 이벤트 수신
  ipcMain.on("onInputValue", (evt, payload) => {
    console.log("on ipcMain event:: ", payload);

    const computedPayload = payload + "(computed)";

    // replyInputValue 송신 또는 응답
    evt.reply("replyInputValue", computedPayload);
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
