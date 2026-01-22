// main.js
const { app, BrowserWindow, session, protocol } = require("electron");
const path = require("path");
const { URL } = require("url");

const APP_SCHEME = "app";

// ✅ 必须：在创建任何窗口前就设置（Chromium geolocation 会读取这个）
process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyA28rLH7Z9DY7IRh41VVbmkUYQnkgkOPQQ";

// ✅ 必须：在 app ready 之前调用，且只调用一次
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

function setupPermissions() {
  const ses = session.defaultSession;

  ses.setPermissionCheckHandler((_wc, permission) => {
    if (permission === "geolocation") return true;
    return false;
  });

  ses.setPermissionRequestHandler((_wc, permission, callback) => {
    if (permission === "geolocation") return callback(true);
    callback(false);
  });
}

function registerAppProtocol() {
  protocol.registerFileProtocol(APP_SCHEME, (request, callback) => {
    try {
      const u = new URL(request.url);

      let relPath = decodeURIComponent(u.pathname || "/");
      if (relPath.startsWith("/")) relPath = relPath.slice(1);

      if (relPath === "" || relPath.endsWith("/")) {
        relPath = relPath.replace(/\/+$/g, "");
        if (relPath === "") relPath = "index.html";
        else relPath = path.posix.join(relPath, "index.html");
      }

      const filePath = path.normalize(path.join(__dirname, relPath));

      if (!filePath.startsWith(__dirname)) {
        return callback({ error: -10 }); // net::ERR_ACCESS_DENIED
      }

      callback({ path: filePath });
    } catch (e) {
      callback({ error: -6 }); // net::ERR_FILE_NOT_FOUND
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#0a1628",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(`${APP_SCHEME}://-/`);
  // 调试时可以打开：
  // win.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then(() => {
  registerAppProtocol();
  setupPermissions();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});