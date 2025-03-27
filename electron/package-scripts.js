
// Скрипты для package.json
module.exports = {
  scripts: {
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && cross-env NODE_ENV=development electron electron/main.js\"",
    "electron:build": "npm run build && electron-builder",
    "electron:start": "cross-env NODE_ENV=production electron electron/main.js"
  }
};
