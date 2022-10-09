const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close-browser").addEventListener("click", () => {
    ipc.send("close-browser");
  });
  const $webview = document.querySelector("webview");
  document.getElementById("browser-opacity").addEventListener("input", (e) => {
    document.querySelector(
      "#browser"
    ).style.backgroundColor = `rgba(0, 0, 0, ${e.target.value})`;
    $webview.style.opacity = `${e.target.value}`;
  });
  document.getElementById("address").addEventListener("keyup", (e) => {
    console.log(e.code);
    if (e.code === "Enter") {
      $webview.loadURL(
        e.target.value.includes("http://")
          ? e.target.value
          : "http://" + e.target.value
      );
    }
  });
});
