"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/vite.ts
var vite_exports = {};
__export(vite_exports, {
  default: () => instruckt
});
module.exports = __toCommonJS(vite_exports);
var import_node_fs = require("fs");
var import_node_path = require("path");
var import_node_crypto = require("crypto");
function parseBody(req) {
  return new Promise((resolve2, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve2(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}
function json(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
function saveScreenshot(screenshotsDir, id, dataUrl) {
  if (!dataUrl?.startsWith("data:image/")) return null;
  const commaIdx = dataUrl.indexOf(",");
  if (commaIdx < 0) return null;
  const header = dataUrl.slice(0, commaIdx);
  const data = dataUrl.slice(commaIdx + 1);
  let binary;
  let ext;
  if (header.includes(";base64")) {
    binary = Buffer.from(data, "base64");
    ext = header.includes("image/svg+xml") ? "svg" : "png";
  } else {
    binary = Buffer.from(decodeURIComponent(data), "utf-8");
    ext = "svg";
  }
  if (!binary.length) return null;
  const filename = `${id}.${ext}`;
  (0, import_node_fs.writeFileSync)((0, import_node_path.join)(screenshotsDir, filename), binary);
  return `screenshots/${filename}`;
}
function deleteScreenshot(storageDir, screenshotPath) {
  if (!screenshotPath) return;
  const filepath = (0, import_node_path.join)(storageDir, screenshotPath);
  try {
    (0, import_node_fs.unlinkSync)(filepath);
  } catch {
  }
}
function instruckt(options = {}) {
  const dirName = options.dir ?? ".instruckt";
  const useServer = options.server !== false;
  const endpointPrefix = options.endpoint ?? "/instruckt";
  let storageDir;
  let screenshotsDir;
  let annotationsFile;
  function ensureDirs() {
    (0, import_node_fs.mkdirSync)(screenshotsDir, { recursive: true });
    if (!(0, import_node_fs.existsSync)(annotationsFile)) {
      (0, import_node_fs.writeFileSync)(annotationsFile, "[]");
    }
  }
  function readAnnotations() {
    try {
      return JSON.parse((0, import_node_fs.readFileSync)(annotationsFile, "utf-8"));
    } catch {
      return [];
    }
  }
  function writeAnnotations(annotations) {
    (0, import_node_fs.writeFileSync)(annotationsFile, JSON.stringify(annotations, null, 2) + "\n");
  }
  function clientConfig() {
    const cfg = {
      endpoint: endpointPrefix
    };
    if (useServer) cfg.screenshotPath = `${dirName}/`;
    if (options.mcp) cfg.mcp = true;
    if (options.adapters) cfg.adapters = options.adapters;
    if (options.theme) cfg.theme = options.theme;
    if (options.position) cfg.position = options.position;
    if (options.colors) cfg.colors = options.colors;
    if (options.keys) cfg.keys = options.keys;
    return cfg;
  }
  const plugin = {
    name: "instruckt",
    apply: "serve",
    // Virtual module for non-SPA setups (e.g. Laravel) —
    // add `import 'virtual:instruckt'` to app.js
    resolveId(id) {
      if (id === "virtual:instruckt") return "\0virtual:instruckt";
    },
    load(id) {
      if (id === "\0virtual:instruckt") {
        const cfg = JSON.stringify(clientConfig());
        return [
          `if (!import.meta.env.SSR && import.meta.env.DEV) {`,
          `  const { init } = await import('instruckt');`,
          `  init(${cfg});`,
          `}`
        ].join("\n");
      }
    },
    // Inject instruckt client into SPA pages served by Vite
    transformIndexHtml(html) {
      const cfg = JSON.stringify(clientConfig());
      const script = `<script type="module">
import { init } from 'instruckt';
if (import.meta.env.DEV) init(${cfg});
</script>`;
      return html.replace("</body>", `${script}
</body>`);
    }
  };
  if (useServer) {
    plugin.configResolved = (config) => {
      storageDir = (0, import_node_path.resolve)(config.root, dirName);
      screenshotsDir = (0, import_node_path.join)(storageDir, "screenshots");
      annotationsFile = (0, import_node_path.join)(storageDir, "annotations.json");
      ensureDirs();
    };
    plugin.configureServer = (server) => {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        const prefix = endpointPrefix;
        if (url === `${prefix}/annotations` && req.method === "GET") {
          return json(res, readAnnotations());
        }
        if (url === `${prefix}/annotations` && req.method === "POST") {
          try {
            const data = await parseBody(req);
            const id = (0, import_node_crypto.randomUUID)();
            const screenshot = typeof data.screenshot === "string" ? saveScreenshot(screenshotsDir, id, data.screenshot) : null;
            const annotation = {
              ...data,
              id,
              screenshot,
              status: "pending",
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            };
            const annotations = readAnnotations();
            annotations.push(annotation);
            writeAnnotations(annotations);
            return json(res, annotation, 201);
          } catch {
            return json(res, { error: "Bad request" }, 400);
          }
        }
        const patchMatch = url.match(new RegExp(`^${prefix}/annotations/([^/]+)$`));
        if (patchMatch && req.method === "PATCH") {
          try {
            const id = patchMatch[1];
            const data = await parseBody(req);
            const annotations = readAnnotations();
            const idx = annotations.findIndex((a) => a.id === id);
            if (idx < 0) return json(res, { error: "Not found" }, 404);
            if (data.status === "resolved" || data.status === "dismissed") {
              deleteScreenshot(storageDir, annotations[idx].screenshot);
            }
            annotations[idx] = {
              ...annotations[idx],
              ...data,
              updated_at: (/* @__PURE__ */ new Date()).toISOString()
            };
            writeAnnotations(annotations);
            return json(res, annotations[idx]);
          } catch {
            return json(res, { error: "Bad request" }, 400);
          }
        }
        const ssMatch = url.match(new RegExp(`^${prefix}/screenshots/(.+)$`));
        if (ssMatch && req.method === "GET") {
          const filename = ssMatch[1];
          if (filename.includes("..") || filename.includes("/")) {
            return json(res, { error: "Bad request" }, 400);
          }
          const filepath = (0, import_node_path.join)(screenshotsDir, filename);
          if (!(0, import_node_fs.existsSync)(filepath)) return json(res, { error: "Not found" }, 404);
          const ext = filename.split(".").pop();
          res.setHeader("Content-Type", ext === "svg" ? "image/svg+xml" : "image/png");
          (0, import_node_fs.createReadStream)(filepath).pipe(res);
          return;
        }
        next();
      });
    };
  }
  return plugin;
}
//# sourceMappingURL=vite.cjs.js.map