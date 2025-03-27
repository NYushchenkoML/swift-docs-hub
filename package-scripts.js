    // Scripts for package.json
    export default {
      scripts: {
        // Electron scripts
        "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && cross-env NODE_ENV=development electron electron/main.js\"",
        "electron:build": "npm run build && electron-builder",
        "electron:start": "cross-env NODE_ENV=production electron electron/main.js",

        // Capacitor scripts
        "cap:init": "npx cap init swift-docs-hub app.lovable.08d05631e90d4f8b87ea288ab3a081ea --web-dir dist",
        "cap:add:android": "npx cap add android",
        "cap:sync": "npx cap sync",
        "cap:build:android": "npm run build && npx cap sync android",
        "cap:open:android": "npx cap open android",
        "cap:run:android": "npx cap run android"
      }
    };
