const { app, BrowserWindow, session, protocol } = require("electron");
const path = require("path");
const { URL } = require("url");

const APP_SCHEME = "app";

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

      // u.pathname 形如 "/index.html/" 或 "/assets/a.js"
      let relPath = decodeURIComponent(u.pathname || "/");

      // 去掉开头的 /
      if (relPath.startsWith("/")) relPath = relPath.slice(1);

      // 处理尾部斜杠：index.html/ -> index.html, 目录 -> index.html
      if (relPath === "" || relPath.endsWith("/")) {
        relPath = relPath.replace(/\/+$/g, ""); // 去掉多余尾斜杠
        // 如果是空或目录，默认 index.html
        if (relPath === "") relPath = "index.html";
        else relPath = path.posix.join(relPath, "index.html");
      }

      // 归一化到本地路径
      const filePath = path.normalize(path.join(__dirname, relPath));

      // 防目录穿越：必须仍在 __dirname 下
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

  // ✅ 用 app:// 加载根路径（更像网站）
  win.loadURL(`${APP_SCHEME}://-/`);
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