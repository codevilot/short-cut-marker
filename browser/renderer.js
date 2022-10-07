const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-browser").addEventListener("click", () => {
    ipc.send("close-browser");
  });
  document.getElementById("browser-opacity").addEventListener("input", (e) => {
    document.querySelector(
      "#browser"
    ).style.backgroundColor = `rgba(0, 0, 0, ${e.target.value})`;
  });

  const webview = document.querySelector("webview");
  const indicator = document.querySelector(".indicator");

  const loadstart = () => {
    indicator.innerText = "loading...";
  };

  const loadstop = () => {
    indicator.innerText = "";
  };

  webview.addEventListener("did-start-loading", loadstart);
  webview.addEventListener("did-stop-loading", loadstop);
});
