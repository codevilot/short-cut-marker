const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;
const storage = require("electron-localStorage");
const path = require("path");
const fs = require("fs");
window.addEventListener("DOMContentLoaded", () => {
  const el = {
    // documentName: document.getElementById("documentName"),
    // createDocumentBtn: document.getElementById("createDocumentBtn"),
    openDocumentBtn: document.getElementById("openDocumentBtn"),
    fileTextarea: document.getElementById("fileTextarea"),
    opacity: document.getElementById("opacity"),
  };
  const recentfile = storage.getItem("recentfile");
  const handleDocumentChange = (filePath, content = "") => {
    // el.documentName.innerHTML = path.parse(filePath).base;
    el.fileTextarea.removeAttribute("disabled");
    el.fileTextarea.value = content;
    el.fileTextarea.focus();
  };
  var btnClose = document.getElementById("close");
  btnClose.addEventListener("click", () => {
    ipc.send("closeApp");
  });
  document.getElementById("read").addEventListener("click", () => {
    ipcRenderer.send("open-document");
  });
  ipcRenderer.on("document-opened", (_, { filePath, content }) => {
    handleDocumentChange(filePath, content);
  });
  el.fileTextarea.addEventListener("input", (e) => {
    ipcRenderer.send("file-content-updated", e.target.value);
  });
  el.opacity.addEventListener("input", (e) => {
    document.querySelector(
      "#body"
    ).style.backgroundColor = `rgba(0, 0, 0, ${e.target.value})`;
  });
  if (recentfile) {
    fs.readFile(recentfile, "utf8", (error, content) => {
      handleDocumentChange(recentfile, content);
    });
  }
});
