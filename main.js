const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle folder selection and markdown file reading
ipcMain.handle("select-folder", async (event) => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const files = fs.readdirSync(folderPath);
    const markdownFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".md"
    );

    const markdownData = markdownFiles.map((file) => {
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      // Update the regex to match Markdown image syntax ![alt text](image-url)
      const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
      return { fileName: file, imageCount: imageCount };
    });

    return { folderPath, markdownData };
  }
  return null;
});
