const { ipcRenderer } = require("electron");
const { changeBackground, changeOpacity } = require("./utils/background.js");
const ipc = ipcRenderer;
const storage = require("electron-localStorage");
const path = require("path");
const fs = require("fs");

window.addEventListener("DOMContentLoaded", () => {
  const $fileTextarea = document.querySelector("#fileTextarea");

  const recentfile = storage.getItem("recentfile");
  const handleDocumentChange = (filePath, content = "") => {
    $fileTextarea.removeAttribute("disabled");
    $fileTextarea.value = content;
    $fileTextarea.focus();
  };
  document.getElementById("close").addEventListener("click", () => {
    ipc.send("closeApp");
  });
  document.getElementById("read").addEventListener("click", () => {
    ipcRenderer.send("open-document");
  });
  document.getElementById("browser-open").addEventListener("click", () => {
    ipcRenderer.send("open-browser");
  });
  ipcRenderer.on("document-opened", (_, { filePath, content }) => {
    handleDocumentChange(filePath, content);
  });
  $fileTextarea.addEventListener("input", (e) => {
    ipcRenderer.send("file-content-updated", e.target.value);
  });
  document.querySelector("#memo-color").addEventListener("input", () => {
    changeBackground("#opacity", "#memo-color");
  });
  document.querySelector("#opacity").addEventListener("input", () => {
    changeBackground("#opacity", "#memo-color");
  });
  if (recentfile) {
    fs.readFile(recentfile, "utf8", (error, content) => {
      handleDocumentChange(recentfile, content);
    });
  }
});
