const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

var btnClose = document.getElementById("close");
btnClose.addEventListener("click", () => {
  ipc.send("closeApp");
});
document.getElementById("read").addEventListener("click", () => {
  ipcRenderer.send("open-document-triggered");
});
