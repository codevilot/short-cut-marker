const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;
const path = require("path");
window.addEventListener("DOMContentLoaded", () => {
  const el = {
    // documentName: document.getElementById("documentName"),
    // createDocumentBtn: document.getElementById("createDocumentBtn"),
    openDocumentBtn: document.getElementById("openDocumentBtn"),
    fileTextarea: document.getElementById("fileTextarea"),
  };
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
});
