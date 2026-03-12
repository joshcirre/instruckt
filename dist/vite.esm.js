// src/vite.ts
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join, resolve } from "path";
import { randomUUID } from "crypto";
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
  writeFileSync(join(screenshotsDir, filename), binary);
  return `screenshots/${filename}`;
}
function deleteScreenshot(storageDir, screenshotPath) {
  if (!screenshotPath) return;
  const filepath = join(storageDir, screenshotPath);
  try {
    unlinkSync(filepath);
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
    mkdirSync(screenshotsDir, { recursive: true });
    if (!existsSync(annotationsFile)) {
      writeFileSync(annotationsFile, "[]");
    }
  }
  function readAnnotations() {
    try {
      return JSON.parse(readFileSync(annotationsFile, "utf-8"));
    } catch {
      return [];
    }
  }
  function writeAnnotations(annotations) {
    writeFileSync(annotationsFile, JSON.stringify(annotations, null, 2) + "\n");
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
      storageDir = resolve(config.root, dirName);
      screenshotsDir = join(storageDir, "screenshots");
      annotationsFile = join(storageDir, "annotations.json");
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
            const id = randomUUID();
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
          const filepath = join(screenshotsDir, filename);
          if (!existsSync(filepath)) return json(res, { error: "Not found" }, 404);
          const ext = filename.split(".").pop();
          res.setHeader("Content-Type", ext === "svg" ? "image/svg+xml" : "image/png");
          createReadStream(filepath).pipe(res);
          return;
        }
        next();
      });
    };
  }
  return plugin;
}
export {
  instruckt as default
};
//# sourceMappingURL=vite.esm.js.map