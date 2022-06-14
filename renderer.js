const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

var btnClose = document.getElementById("close");
btnClose.addEventListener("click", () => {
  ipc.send("closeApp");
});
