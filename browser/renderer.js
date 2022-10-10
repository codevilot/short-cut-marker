const { ipcRenderer } = require("electron");
const { changeBackground, changeOpacity } = require("../utils/background.js");
const ipc = ipcRenderer;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-browser").addEventListener("click", () => {
    ipc.send("close-browser");
  });
  const $webview = document.querySelector("webview");
  document.getElementById("browser-opacity").addEventListener("input", () => {
    changeBackground("#browser-opacity", "#browser-color");
    changeOpacity("webview", "#browser-opacity");
  });
  document.getElementById("browser-color").addEventListener("input", () => {
    changeBackground("#browser-opacity", "#browser-color");
  });
  document.getElementById("address").addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
      $webview.loadURL(
        e.target.value.includes("http://")
          ? e.target.value
          : "http://" + e.target.value
      );
    }
  });
});
