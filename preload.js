// const currentWindow = remote.getCurrentWindow();
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

// document.getElementById("close__button").addEventListener("click", () => {
//   ipcRenderer.invoke("quit-app");
// });
// document.getElementById("add__button").addEventListener("click", () => {
//   console.log(1);
//   let add = new BrowserWindow({
//     parent: mainWindow,
//   });
//   add.loadFile("/src/add.html");
//   add.show();
// });
