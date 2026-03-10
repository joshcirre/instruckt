"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Instruckt: () => Instruckt,
  init: () => init
});
module.exports = __toCommonJS(src_exports);

// src/api.ts
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
function headers() {
  const h = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest"
  };
  const csrf = getCsrfToken();
  if (csrf) h["X-XSRF-TOKEN"] = csrf;
  return h;
}
function toCamelCase(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = Array.isArray(v) ? v.map((item) => item && typeof item === "object" && !Array.isArray(item) ? toCamelCase(item) : item) : v && typeof v === "object" && !Array.isArray(v) ? toCamelCase(v) : v;
  }
  return out;
}
function toSnake(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    out[snake] = v && typeof v === "object" && !Array.isArray(v) ? toSnake(v) : v;
  }
  return out;
}
var InstrucktApi = class {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  async getAnnotations() {
    const res = await fetch(`${this.endpoint}/annotations`, {
      headers: headers()
    });
    if (!res.ok) throw new Error(`instruckt: failed to load annotations (${res.status})`);
    const raw = await res.json();
    return raw.map((r) => toCamelCase(r));
  }
  async addAnnotation(data) {
    const res = await fetch(`${this.endpoint}/annotations`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(toSnake(data))
    });
    if (!res.ok) throw new Error(`instruckt: failed to add annotation (${res.status})`);
    return toCamelCase(await res.json());
  }
  async updateAnnotation(annotationId, data) {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(toSnake(data))
    });
    if (!res.ok) throw new Error(`instruckt: failed to update annotation (${res.status})`);
    return toCamelCase(await res.json());
  }
};

// src/ui/styles.ts
var GLOBAL_CSS = (
  /* css */
  `
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`
);
var TOOLBAR_CSS = (
  /* css */
  `
:host {
  all: initial;
  display: block;
  position: fixed;
  z-index: 2147483646;
}

* { box-sizing: border-box; }

:host-context([data-instruckt-theme="dark"]),
@media (prefers-color-scheme: dark) {
  :host {
    --ik-bg: #1c1c1e; --ik-bg2: #2c2c2e; --ik-border: #38383a;
    --ik-text: #f4f4f5; --ik-muted: #a1a1aa;
    --ik-shadow: 0 8px 32px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06);
  }
}

:host {
  --ik-accent: #6366f1;
  --ik-accent-h: #4f46e5;
  --ik-bg: #ffffff;
  --ik-bg2: #f4f4f5;
  --ik-border: #e4e4e7;
  --ik-text: #18181b;
  --ik-muted: #a1a1aa;
  --ik-shadow: 0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04);
}

.toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--ik-bg);
  border-radius: 12px;
  padding: 6px;
  box-shadow: var(--ik-shadow);
  user-select: none;
  touch-action: none;
  cursor: grab;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.toolbar:active { cursor: grabbing; }

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--ik-muted);
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: background .15s ease, color .15s ease;
}
.btn svg { display: block; }
.btn:hover { background: var(--ik-bg2); color: var(--ik-text); }
.btn[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--ik-text);
  color: var(--ik-bg);
  pointer-events: none;
  opacity: 0;
  transition: opacity .1s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.btn[data-tooltip]:hover::before { opacity: 1; }
.btn.active { background: var(--ik-accent); color: #fff; }
.btn.active:hover { background: var(--ik-accent-h); }

.divider { width: 18px; height: 1px; background: var(--ik-border); margin: 3px 0; }

.badge {
  position: absolute;
  top: -3px; right: -3px;
  min-width: 16px; height: 16px;
  background: #ef4444;
  color: #fff;
  border-radius: 8px;
  font-size: 10px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.minimize-btn { color: var(--ik-muted); opacity: .6; }
.minimize-btn:hover { opacity: 1; }

.danger-btn { color: var(--ik-muted); opacity: .6; }
.danger-btn:hover { opacity: 1; color: #ef4444; }

.clear-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.clear-all-btn {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  background: var(--ik-bg);
  box-shadow: var(--ik-shadow);
  border-radius: 8px;
}
/* clear-all tooltip inherits from .btn[data-tooltip]::before */
/* Invisible bridge so hover doesn't break crossing the gap */
.clear-all-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 100%;
  width: 6px;
  height: 100%;
}
/* Clear-page tooltip shows above-left so it doesn't cover the clear-all button */
.clear-wrap > .btn:first-child[data-tooltip]::before {
  right: 0;
  left: auto;
  top: auto;
  bottom: calc(100% + 8px);
  transform: none;
}
.clear-wrap:hover .clear-all-btn { display: flex; align-items: center; justify-content: center; }

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--ik-bg);
  color: var(--ik-muted);
  box-shadow: var(--ik-shadow);
  cursor: pointer;
  padding: 0;
  transition: color .15s ease, transform .15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.fab:hover { color: var(--ik-accent); transform: scale(1.1); }
.fab { position: relative; }

.fab-badge {
  position: absolute;
  top: -4px; right: -4px;
  min-width: 16px; height: 16px;
  background: #6366f1;
  color: #fff;
  border-radius: 8px;
  font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
`
);
var POPUP_CSS = (
  /* css */
  `
:host {
  all: initial;
  display: block;
  position: fixed;
  z-index: 2147483647;
}

* { box-sizing: border-box; }

:host {
  --ik-accent: #6366f1;
  --ik-accent-h: #4f46e5;
  --ik-bg: #ffffff;
  --ik-bg2: #f8f8f8;
  --ik-border: #e4e4e7;
  --ik-text: #18181b;
  --ik-muted: #71717a;
  --ik-shadow: 0 4px 24px rgba(0,0,0,.12);
  --ik-radius: 10px;
  --ik-hl: rgba(99,102,241,.15);
}

@media (prefers-color-scheme: dark) {
  :host {
    --ik-bg: #1c1c1e; --ik-bg2: #2c2c2e; --ik-border: #3a3a3c;
    --ik-text: #f4f4f5; --ik-muted: #a1a1aa;
    --ik-shadow: 0 4px 24px rgba(0,0,0,.5);
    --ik-hl: rgba(99,102,241,.2);
  }
}

.popup {
  width: 340px;
  background: var(--ik-bg);
  border: 1px solid var(--ik-border);
  border-radius: var(--ik-radius);
  box-shadow: var(--ik-shadow);
  padding: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  color: var(--ik-text);
  animation: pop-in .12s ease;
}
@keyframes pop-in {
  from { opacity:0; transform: scale(.95) translateY(4px); }
  to   { opacity:1; transform: scale(1) translateY(0); }
}

.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.element-tag {
  font-size:11px; font-family:ui-monospace,monospace; color:var(--ik-muted);
  background:var(--ik-bg2); border-radius:4px; padding:2px 6px;
  max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.close-btn {
  background:none; border:none; color:var(--ik-muted);
  cursor:pointer; font-size:18px; line-height:1; padding:0;
}

.fw-badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  color:var(--ik-accent); background:var(--ik-hl); border-radius:4px;
  padding:2px 6px; margin-bottom:8px;
}
.selected-text {
  font-size:12px; color:var(--ik-muted); background:var(--ik-bg2);
  border-left:3px solid var(--ik-accent); padding:4px 8px;
  border-radius:0 4px 4px 0; margin-bottom:10px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}

.label {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:.05em; color:var(--ik-muted); margin-bottom:4px;
}
.row { display:flex; gap:6px; margin-bottom:10px; }
.chips { display:flex; gap:4px; flex-wrap:wrap; }

.chip {
  font-size:11px; padding:3px 8px; border-radius:12px;
  border:1px solid var(--ik-border); background:transparent;
  color:var(--ik-muted); cursor:pointer; transition:all .1s;
}
.chip:hover { border-color:var(--ik-accent); color:var(--ik-accent); }
.chip.sel { background:var(--ik-accent); border-color:var(--ik-accent); color:#fff; }
.chip.blocking.sel  { background:#ef4444; border-color:#ef4444; }
.chip.important.sel { background:#f97316; border-color:#f97316; }
.chip.suggestion.sel{ background:#22c55e; border-color:#22c55e; }

.screenshot-slot { margin-bottom: 10px; }

.btn-capture {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 10px;
  border: 1px dashed var(--ik-border);
  border-radius: 6px;
  background: var(--ik-bg2);
  color: var(--ik-muted);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color .15s, color .15s;
}
.btn-capture:hover {
  border-color: var(--ik-accent);
  color: var(--ik-accent);
}
.btn-capture svg { flex-shrink: 0; }

.screenshot-preview {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--ik-border);
  margin-bottom: 10px;
}
.screenshot-preview img {
  display: block;
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  background: var(--ik-bg2);
}
.screenshot-remove {
  position: absolute;
  top: 4px; right: 4px;
  width: 20px; height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,.6);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.screenshot-remove:hover { background: #ef4444; }

textarea {
  width:100%; min-height:80px; resize:vertical;
  border:1px solid var(--ik-border); border-radius:6px;
  background:var(--ik-bg2); color:var(--ik-text);
  font-family:inherit; font-size:13px; padding:8px 10px;
  outline:none; transition:border-color .15s; margin-bottom:10px;
}
textarea:focus { border-color:var(--ik-accent); }
textarea::placeholder { color:var(--ik-muted); }

.actions { display:flex; justify-content:flex-end; gap:6px; }

.btn-secondary {
  padding:6px 14px; border-radius:6px; border:1px solid var(--ik-border);
  background:transparent; color:var(--ik-muted); font-size:12px; cursor:pointer; transition:all .1s;
}
.btn-secondary:hover { border-color:var(--ik-muted); color:var(--ik-text); }

.btn-primary {
  padding:6px 14px; border-radius:6px; border:none;
  background:var(--ik-accent); color:#fff;
  font-size:12px; font-weight:700; cursor:pointer; transition:background .1s;
}
.btn-primary:hover { background:var(--ik-accent-h); }
.btn-primary:disabled { opacity:.5; cursor:not-allowed; }

.btn-danger {
  padding:6px 14px; border-radius:6px; border:1px solid #ef4444;
  background:transparent; color:#ef4444;
  font-size:12px; cursor:pointer; transition:all .1s;
}
.btn-danger:hover { background:#ef4444; color:#fff; }

/* Thread view */
.thread { margin-top:10px; border-top:1px solid var(--ik-border); padding-top:10px; }
.msg { margin-bottom:8px; }
.msg-role {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:.05em; margin-bottom:2px;
}
.msg-role.human { color:var(--ik-accent); }
.msg-role.agent { color:#22c55e; }
.msg-content { font-size:12px; line-height:1.5; }

.status-badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  border-radius:4px; padding:2px 6px;
}
.status-badge.pending      { background:rgba(99,102,241,.15); color:var(--ik-accent); }
.status-badge.resolved     { background:rgba(34,197,94,.15); color:#22c55e; }
.status-badge.dismissed    { background:var(--ik-bg2); color:var(--ik-muted); }
`
);
var MARKER_CSS = (
  /* css */
  `
.ik-marker {
  position: absolute;
  z-index: 2147483645;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--ik-marker-default, #6366f1);
  color: #fff;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--ik-marker-default, #6366f1) 40%, transparent);
  transition: transform .15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  pointer-events: all;
  user-select: none;
}
.ik-marker:hover { transform: scale(1.15); }
.ik-marker.has-screenshot { background: var(--ik-marker-screenshot, #22c55e); box-shadow: 0 2px 8px color-mix(in srgb, var(--ik-marker-screenshot, #22c55e) 40%, transparent); }
.ik-marker.dismissed { background: var(--ik-marker-dismissed, #71717a); box-shadow: 0 2px 8px rgba(0,0,0,.2); }
`
);
function injectGlobalStyles(colors) {
  if (document.getElementById("instruckt-global")) return;
  const vars = colors ? `:root {${colors.default ? ` --ik-marker-default: ${colors.default};` : ""}${colors.screenshot ? ` --ik-marker-screenshot: ${colors.screenshot};` : ""}${colors.dismissed ? ` --ik-marker-dismissed: ${colors.dismissed};` : ""} }
` : "";
  const style = document.createElement("style");
  style.id = "instruckt-global";
  style.textContent = vars + GLOBAL_CSS + MARKER_CSS;
  document.head.appendChild(style);
}

// src/ui/toolbar.ts
var ICONS = {
  annotate: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
  freeze: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  minimize: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>`,
  screenshot: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  logo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`
};
var Toolbar = class {
  constructor(position, callbacks, keys) {
    this.position = position;
    this.callbacks = callbacks;
    this.fabBadge = null;
    this.annotateActive = false;
    this.freezeActive = false;
    this.minimized = false;
    this.totalCount = 0;
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.keys = keys != null ? keys : {};
    this.build();
    this.setupDrag();
  }
  build() {
    var _a2, _b, _c, _d, _e;
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "toolbar");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = TOOLBAR_CSS;
    this.shadow.appendChild(style);
    this.toolbarEl = document.createElement("div");
    this.toolbarEl.className = "toolbar";
    const k = this.keys;
    this.annotateBtn = this.makeBtn(ICONS.annotate, `Annotate elements (${((_a2 = k.annotate) != null ? _a2 : "A").toUpperCase()})`, () => {
      const next = !this.annotateActive;
      this.setAnnotateActive(next);
      this.callbacks.onToggleAnnotate(next);
    });
    this.freezeBtn = this.makeBtn(ICONS.freeze, `Freeze page (${((_b = k.freeze) != null ? _b : "F").toUpperCase()})`, () => {
      const next = !this.freezeActive;
      this.setFreezeActive(next);
      this.callbacks.onFreezeAnimations(next);
    });
    const screenshotBtn = this.makeBtn(ICONS.screenshot, `Screenshot region (${((_c = k.screenshot) != null ? _c : "C").toUpperCase()})`, () => {
      this.callbacks.onScreenshot();
    });
    this.copyBtn = this.makeBtn(ICONS.copy, "Copy annotations as markdown", () => {
      this.callbacks.onCopy();
      this.copyBtn.innerHTML = ICONS.check;
      setTimeout(() => {
        this.copyBtn.innerHTML = ICONS.copy;
      }, 1200);
    });
    const clearWrap = document.createElement("div");
    clearWrap.className = "clear-wrap";
    const clearBtn = this.makeBtn(ICONS.clear, `Clear this page (${((_d = k.clearPage) != null ? _d : "X").toUpperCase()})`, () => {
      var _a3, _b2;
      (_b2 = (_a3 = this.callbacks).onClearPage) == null ? void 0 : _b2.call(_a3);
    });
    clearBtn.classList.add("danger-btn");
    const clearAllBtn = this.makeBtn(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      "Delete all instructions.",
      () => {
        var _a3, _b2;
        return (_b2 = (_a3 = this.callbacks).onClearAll) == null ? void 0 : _b2.call(_a3);
      }
    );
    clearAllBtn.classList.add("danger-btn", "clear-all-btn");
    clearWrap.appendChild(clearBtn);
    clearWrap.appendChild(clearAllBtn);
    const minimizeBtn = this.makeBtn(ICONS.minimize, "Minimize toolbar", () => {
      this.setMinimized(true);
    });
    minimizeBtn.classList.add("minimize-btn");
    const mkDiv = () => {
      const d = document.createElement("div");
      d.className = "divider";
      return d;
    };
    this.toolbarEl.append(
      this.annotateBtn,
      screenshotBtn,
      mkDiv(),
      this.freezeBtn,
      mkDiv(),
      this.copyBtn,
      clearWrap,
      mkDiv(),
      minimizeBtn
    );
    this.shadow.appendChild(this.toolbarEl);
    this.fab = document.createElement("button");
    this.fab.className = "fab";
    this.fab.title = "Open instruckt toolbar";
    this.fab.setAttribute("aria-label", "Open instruckt toolbar");
    this.fab.innerHTML = ICONS.logo;
    this.fab.style.display = "none";
    this.fab.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setMinimized(false);
    });
    this.shadow.appendChild(this.fab);
    this.host.addEventListener("click", (e) => e.stopPropagation());
    this.host.addEventListener("mousedown", (e) => e.stopPropagation());
    this.host.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.applyPosition();
    const root = (_e = document.getElementById("instruckt-root")) != null ? _e : document.body;
    root.appendChild(this.host);
  }
  makeBtn(iconHtml, tooltip, onClick) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.setAttribute("data-tooltip", tooltip);
    btn.setAttribute("aria-label", tooltip);
    btn.innerHTML = iconHtml;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }
  applyPosition() {
    const m = "16px";
    Object.assign(this.host.style, {
      position: "fixed",
      zIndex: "2147483646",
      bottom: this.position.includes("bottom") ? m : "auto",
      top: this.position.includes("top") ? m : "auto",
      right: this.position.includes("right") ? m : "auto",
      left: this.position.includes("left") ? m : "auto"
    });
  }
  setupDrag() {
    this.shadow.addEventListener("mousedown", (evt) => {
      const e = evt;
      if (e.target.closest(".btn") || e.target.closest(".fab")) return;
      this.dragging = true;
      const rect = this.host.getBoundingClientRect();
      this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!this.dragging) return;
      Object.assign(this.host.style, {
        left: `${e.clientX - this.dragOffset.x}px`,
        top: `${e.clientY - this.dragOffset.y}px`,
        right: "auto",
        bottom: "auto"
      });
    });
    document.addEventListener("mouseup", () => {
      this.dragging = false;
    });
  }
  setMinimized(min) {
    var _a2, _b;
    this.minimized = min;
    this.toolbarEl.style.display = min ? "none" : "";
    this.fab.style.display = min ? "" : "none";
    this.updateFabBadge();
    (_b = (_a2 = this.callbacks).onMinimize) == null ? void 0 : _b.call(_a2, min);
  }
  updateFabBadge() {
    var _a2;
    if (this.totalCount > 0 && this.minimized) {
      if (!this.fabBadge) {
        this.fabBadge = document.createElement("span");
        this.fabBadge.className = "fab-badge";
        this.fab.appendChild(this.fabBadge);
      }
      this.fabBadge.textContent = this.totalCount > 99 ? "99+" : String(this.totalCount);
    } else {
      (_a2 = this.fabBadge) == null ? void 0 : _a2.remove();
      this.fabBadge = null;
    }
  }
  isMinimized() {
    return this.minimized;
  }
  /** Programmatically minimize without firing callback */
  minimize() {
    this.minimized = true;
    this.toolbarEl.style.display = "none";
    this.fab.style.display = "";
    this.updateFabBadge();
  }
  setAnnotateActive(active) {
    this.annotateActive = active;
    this.annotateBtn.classList.toggle("active", active);
    document.body.classList.toggle("ik-annotating", active);
  }
  setFreezeActive(active) {
    this.freezeActive = active;
    this.freezeBtn.classList.toggle("active", active);
  }
  // Keep for compatibility — resolves visual mode from instruckt.ts
  setMode(mode) {
    this.setAnnotateActive(mode === "annotating");
  }
  setAnnotationCount(count) {
    let badge = this.annotateBtn.querySelector(".badge");
    if (count > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "badge";
        this.annotateBtn.appendChild(badge);
      }
      badge.textContent = count > 99 ? "99+" : String(count);
    } else {
      badge == null ? void 0 : badge.remove();
    }
  }
  setTotalCount(count) {
    this.totalCount = count;
    this.updateFabBadge();
  }
  destroy() {
    this.host.remove();
    document.body.classList.remove("ik-annotating");
  }
};

// src/ui/highlight.ts
var ElementHighlight = class {
  constructor() {
    var _a2;
    this.el = document.createElement("div");
    Object.assign(this.el.style, {
      position: "fixed",
      pointerEvents: "none",
      // MUST be none — prevents swallowing clicks
      zIndex: "2147483644",
      border: "2px solid rgba(99,102,241,0.7)",
      background: "rgba(99,102,241,0.1)",
      borderRadius: "3px",
      transition: "all 0.06s ease",
      display: "none"
    });
    this.el.setAttribute("data-instruckt", "highlight");
    const root = (_a2 = document.getElementById("instruckt-root")) != null ? _a2 : document.body;
    root.appendChild(this.el);
  }
  show(el) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      this.hide();
      return;
    }
    Object.assign(this.el.style, {
      display: "block",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
  }
  hide() {
    this.el.style.display = "none";
  }
  destroy() {
    this.el.remove();
  }
};

// node_modules/modern-screenshot/dist/index.mjs
function changeJpegDpi(uint8Array, dpi) {
  uint8Array[13] = 1;
  uint8Array[14] = dpi >> 8;
  uint8Array[15] = dpi & 255;
  uint8Array[16] = dpi >> 8;
  uint8Array[17] = dpi & 255;
  return uint8Array;
}
var _P = "p".charCodeAt(0);
var _H = "H".charCodeAt(0);
var _Y = "Y".charCodeAt(0);
var _S = "s".charCodeAt(0);
var pngDataTable;
function createPngDataTable() {
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}
function calcCrc(uint8Array) {
  let c = -1;
  if (!pngDataTable)
    pngDataTable = createPngDataTable();
  for (let n = 0; n < uint8Array.length; n++) {
    c = pngDataTable[(c ^ uint8Array[n]) & 255] ^ c >>> 8;
  }
  return c ^ -1;
}
function searchStartOfPhys(uint8Array) {
  const length = uint8Array.length - 1;
  for (let i = length; i >= 4; i--) {
    if (uint8Array[i - 4] === 9 && uint8Array[i - 3] === _P && uint8Array[i - 2] === _H && uint8Array[i - 1] === _Y && uint8Array[i] === _S) {
      return i - 3;
    }
  }
  return 0;
}
function changePngDpi(uint8Array, dpi, overwritepHYs = false) {
  const physChunk = new Uint8Array(13);
  dpi *= 39.3701;
  physChunk[0] = _P;
  physChunk[1] = _H;
  physChunk[2] = _Y;
  physChunk[3] = _S;
  physChunk[4] = dpi >>> 24;
  physChunk[5] = dpi >>> 16;
  physChunk[6] = dpi >>> 8;
  physChunk[7] = dpi & 255;
  physChunk[8] = physChunk[4];
  physChunk[9] = physChunk[5];
  physChunk[10] = physChunk[6];
  physChunk[11] = physChunk[7];
  physChunk[12] = 1;
  const crc = calcCrc(physChunk);
  const crcChunk = new Uint8Array(4);
  crcChunk[0] = crc >>> 24;
  crcChunk[1] = crc >>> 16;
  crcChunk[2] = crc >>> 8;
  crcChunk[3] = crc & 255;
  if (overwritepHYs) {
    const startingIndex = searchStartOfPhys(uint8Array);
    uint8Array.set(physChunk, startingIndex);
    uint8Array.set(crcChunk, startingIndex + 13);
    return uint8Array;
  } else {
    const chunkLength = new Uint8Array(4);
    chunkLength[0] = 0;
    chunkLength[1] = 0;
    chunkLength[2] = 0;
    chunkLength[3] = 9;
    const finalHeader = new Uint8Array(54);
    finalHeader.set(uint8Array, 0);
    finalHeader.set(chunkLength, 33);
    finalHeader.set(physChunk, 37);
    finalHeader.set(crcChunk, 50);
    return finalHeader;
  }
}
var b64PhysSignature1 = "AAlwSFlz";
var b64PhysSignature2 = "AAAJcEhZ";
var b64PhysSignature3 = "AAAACXBI";
function detectPhysChunkFromDataUrl(dataUrl) {
  let b64index = dataUrl.indexOf(b64PhysSignature1);
  if (b64index === -1) {
    b64index = dataUrl.indexOf(b64PhysSignature2);
  }
  if (b64index === -1) {
    b64index = dataUrl.indexOf(b64PhysSignature3);
  }
  return b64index;
}
var PREFIX = "[modern-screenshot]";
var IN_BROWSER = typeof window !== "undefined";
var SUPPORT_WEB_WORKER = IN_BROWSER && "Worker" in window;
var SUPPORT_ATOB = IN_BROWSER && "atob" in window;
var SUPPORT_BTOA = IN_BROWSER && "btoa" in window;
var _a;
var USER_AGENT = IN_BROWSER ? (_a = window.navigator) == null ? void 0 : _a.userAgent : "";
var IN_CHROME = USER_AGENT.includes("Chrome");
var IN_SAFARI = USER_AGENT.includes("AppleWebKit") && !IN_CHROME;
var IN_FIREFOX = USER_AGENT.includes("Firefox");
var isContext = (value) => value && "__CONTEXT__" in value;
var isCssFontFaceRule = (rule) => rule.constructor.name === "CSSFontFaceRule";
var isCSSImportRule = (rule) => rule.constructor.name === "CSSImportRule";
var isLayerBlockRule = (rule) => rule.constructor.name === "CSSLayerBlockRule";
var isElementNode = (node) => node.nodeType === 1;
var isSVGElementNode = (node) => typeof node.className === "object";
var isSVGImageElementNode = (node) => node.tagName === "image";
var isSVGUseElementNode = (node) => node.tagName === "use";
var isHTMLElementNode = (node) => isElementNode(node) && typeof node.style !== "undefined" && !isSVGElementNode(node);
var isCommentNode = (node) => node.nodeType === 8;
var isTextNode = (node) => node.nodeType === 3;
var isImageElement = (node) => node.tagName === "IMG";
var isVideoElement = (node) => node.tagName === "VIDEO";
var isCanvasElement = (node) => node.tagName === "CANVAS";
var isTextareaElement = (node) => node.tagName === "TEXTAREA";
var isInputElement = (node) => node.tagName === "INPUT";
var isStyleElement = (node) => node.tagName === "STYLE";
var isScriptElement = (node) => node.tagName === "SCRIPT";
var isSelectElement = (node) => node.tagName === "SELECT";
var isSlotElement = (node) => node.tagName === "SLOT";
var isIFrameElement = (node) => node.tagName === "IFRAME";
var consoleWarn = (...args) => console.warn(PREFIX, ...args);
function supportWebp(ownerDocument) {
  var _a2;
  const canvas = (_a2 = ownerDocument == null ? void 0 : ownerDocument.createElement) == null ? void 0 : _a2.call(ownerDocument, "canvas");
  if (canvas) {
    canvas.height = canvas.width = 1;
  }
  return Boolean(canvas) && "toDataURL" in canvas && Boolean(canvas.toDataURL("image/webp").includes("image/webp"));
}
var isDataUrl = (url) => url.startsWith("data:");
function resolveUrl(url, baseUrl) {
  if (url.match(/^[a-z]+:\/\//i))
    return url;
  if (IN_BROWSER && url.match(/^\/\//))
    return window.location.protocol + url;
  if (url.match(/^[a-z]+:/i))
    return url;
  if (!IN_BROWSER)
    return url;
  const doc = getDocument().implementation.createHTMLDocument();
  const base = doc.createElement("base");
  const a = doc.createElement("a");
  doc.head.appendChild(base);
  doc.body.appendChild(a);
  if (baseUrl)
    base.href = baseUrl;
  a.href = url;
  return a.href;
}
function getDocument(target) {
  var _a2;
  return (_a2 = target && isElementNode(target) ? target == null ? void 0 : target.ownerDocument : target) != null ? _a2 : window.document;
}
var XMLNS = "http://www.w3.org/2000/svg";
function createSvg(width, height, ownerDocument) {
  const svg = getDocument(ownerDocument).createElementNS(XMLNS, "svg");
  svg.setAttributeNS(null, "width", width.toString());
  svg.setAttributeNS(null, "height", height.toString());
  svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
  return svg;
}
function svgToDataUrl(svg, removeControlCharacter) {
  let xhtml = new XMLSerializer().serializeToString(svg);
  if (removeControlCharacter) {
    xhtml = xhtml.replace(/[\u0000-\u0008\v\f\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu, "");
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xhtml)}`;
}
function readBlob(blob, type) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error(`Failed read blob to ${type}`));
    if (type === "dataUrl") {
      reader.readAsDataURL(blob);
    } else if (type === "arrayBuffer") {
      reader.readAsArrayBuffer(blob);
    }
  });
}
var blobToDataUrl = (blob) => readBlob(blob, "dataUrl");
function createImage(url, ownerDocument) {
  const img = getDocument(ownerDocument).createElement("img");
  img.decoding = "sync";
  img.loading = "eager";
  img.src = url;
  return img;
}
function loadMedia(media, options) {
  return new Promise((resolve) => {
    const { timeout, ownerDocument, onError: userOnError, onWarn } = options != null ? options : {};
    const node = typeof media === "string" ? createImage(media, getDocument(ownerDocument)) : media;
    let timer = null;
    let removeEventListeners = null;
    function onResolve() {
      resolve(node);
      timer && clearTimeout(timer);
      removeEventListeners == null ? void 0 : removeEventListeners();
    }
    if (timeout) {
      timer = setTimeout(onResolve, timeout);
    }
    if (isVideoElement(node)) {
      const currentSrc = node.currentSrc || node.src;
      if (!currentSrc) {
        if (node.poster) {
          return loadMedia(node.poster, options).then(resolve);
        }
        return onResolve();
      }
      if (node.readyState >= 2) {
        return onResolve();
      }
      const onLoadeddata = onResolve;
      const onError = (error) => {
        onWarn == null ? void 0 : onWarn(
          "Failed video load",
          currentSrc,
          error
        );
        userOnError == null ? void 0 : userOnError(error);
        onResolve();
      };
      removeEventListeners = () => {
        node.removeEventListener("loadeddata", onLoadeddata);
        node.removeEventListener("error", onError);
      };
      node.addEventListener("loadeddata", onLoadeddata, { once: true });
      node.addEventListener("error", onError, { once: true });
    } else {
      const currentSrc = isSVGImageElementNode(node) ? node.href.baseVal : node.currentSrc || node.src;
      if (!currentSrc) {
        return onResolve();
      }
      const onLoad = async () => {
        if (isImageElement(node) && "decode" in node) {
          try {
            await node.decode();
          } catch (error) {
            onWarn == null ? void 0 : onWarn(
              "Failed to decode image, trying to render anyway",
              node.dataset.originalSrc || currentSrc,
              error
            );
          }
        }
        onResolve();
      };
      const onError = (error) => {
        onWarn == null ? void 0 : onWarn(
          "Failed image load",
          node.dataset.originalSrc || currentSrc,
          error
        );
        onResolve();
      };
      if (isImageElement(node) && node.complete) {
        return onLoad();
      }
      removeEventListeners = () => {
        node.removeEventListener("load", onLoad);
        node.removeEventListener("error", onError);
      };
      node.addEventListener("load", onLoad, { once: true });
      node.addEventListener("error", onError, { once: true });
    }
  });
}
async function waitUntilLoad(node, options) {
  if (isHTMLElementNode(node)) {
    if (isImageElement(node) || isVideoElement(node)) {
      await loadMedia(node, options);
    } else {
      await Promise.all(
        ["img", "video"].flatMap((selectors) => {
          return Array.from(node.querySelectorAll(selectors)).map((el) => loadMedia(el, options));
        })
      );
    }
  }
}
var uuid = /* @__PURE__ */ (function uuid2() {
  let counter = 0;
  const random = () => `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4);
  return () => {
    counter += 1;
    return `u${random()}${counter}`;
  };
})();
function splitFontFamily(fontFamily) {
  return fontFamily == null ? void 0 : fontFamily.split(",").map((val) => val.trim().replace(/"|'/g, "").toLowerCase()).filter(Boolean);
}
var uid = 0;
function createLogger(debug) {
  const prefix = `${PREFIX}[#${uid}]`;
  uid++;
  return {
    // eslint-disable-next-line no-console
    time: (label) => debug && console.time(`${prefix} ${label}`),
    // eslint-disable-next-line no-console
    timeEnd: (label) => debug && console.timeEnd(`${prefix} ${label}`),
    warn: (...args) => debug && consoleWarn(...args)
  };
}
function getDefaultRequestInit(bypassingCache) {
  return {
    cache: bypassingCache ? "no-cache" : "force-cache"
  };
}
async function orCreateContext(node, options) {
  return isContext(node) ? node : createContext(node, __spreadProps(__spreadValues({}, options), { autoDestruct: true }));
}
async function createContext(node, options) {
  var _a2, _b, _c, _d, _e;
  const { scale = 1, workerUrl, workerNumber = 1 } = options || {};
  const debug = Boolean(options == null ? void 0 : options.debug);
  const features = (_a2 = options == null ? void 0 : options.features) != null ? _a2 : true;
  const ownerDocument = (_b = node.ownerDocument) != null ? _b : IN_BROWSER ? window.document : void 0;
  const ownerWindow = (_d = (_c = node.ownerDocument) == null ? void 0 : _c.defaultView) != null ? _d : IN_BROWSER ? window : void 0;
  const requests = /* @__PURE__ */ new Map();
  const context = __spreadProps(__spreadValues({
    // Options
    width: 0,
    height: 0,
    quality: 1,
    type: "image/png",
    scale,
    backgroundColor: null,
    style: null,
    filter: null,
    maximumCanvasSize: 0,
    timeout: 3e4,
    progress: null,
    debug,
    fetch: __spreadValues({
      requestInit: getDefaultRequestInit((_e = options == null ? void 0 : options.fetch) == null ? void 0 : _e.bypassingCache),
      placeholderImage: "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      bypassingCache: false
    }, options == null ? void 0 : options.fetch),
    fetchFn: null,
    font: {},
    drawImageInterval: 100,
    workerUrl: null,
    workerNumber,
    onCloneEachNode: null,
    onCloneNode: null,
    onEmbedNode: null,
    onCreateForeignObjectSvg: null,
    includeStyleProperties: null,
    autoDestruct: false
  }, options), {
    // InternalContext
    __CONTEXT__: true,
    log: createLogger(debug),
    node,
    ownerDocument,
    ownerWindow,
    dpi: scale === 1 ? null : 96 * scale,
    svgStyleElement: createStyleElement(ownerDocument),
    svgDefsElement: ownerDocument == null ? void 0 : ownerDocument.createElementNS(XMLNS, "defs"),
    svgStyles: /* @__PURE__ */ new Map(),
    defaultComputedStyles: /* @__PURE__ */ new Map(),
    workers: [
      ...Array.from({
        length: SUPPORT_WEB_WORKER && workerUrl && workerNumber ? workerNumber : 0
      })
    ].map(() => {
      try {
        const worker = new Worker(workerUrl);
        worker.onmessage = async (event) => {
          var _a3, _b2, _c2, _d2;
          const { url, result } = event.data;
          if (result) {
            (_b2 = (_a3 = requests.get(url)) == null ? void 0 : _a3.resolve) == null ? void 0 : _b2.call(_a3, result);
          } else {
            (_d2 = (_c2 = requests.get(url)) == null ? void 0 : _c2.reject) == null ? void 0 : _d2.call(_c2, new Error(`Error receiving message from worker: ${url}`));
          }
        };
        worker.onmessageerror = (event) => {
          var _a3, _b2;
          const { url } = event.data;
          (_b2 = (_a3 = requests.get(url)) == null ? void 0 : _a3.reject) == null ? void 0 : _b2.call(_a3, new Error(`Error receiving message from worker: ${url}`));
        };
        return worker;
      } catch (error) {
        context.log.warn("Failed to new Worker", error);
        return null;
      }
    }).filter(Boolean),
    fontFamilies: /* @__PURE__ */ new Map(),
    fontCssTexts: /* @__PURE__ */ new Map(),
    acceptOfImage: `${[
      supportWebp(ownerDocument) && "image/webp",
      "image/svg+xml",
      "image/*",
      "*/*"
    ].filter(Boolean).join(",")};q=0.8`,
    requests,
    drawImageCount: 0,
    tasks: [],
    features,
    isEnable: (key) => {
      var _a3, _b2;
      if (key === "restoreScrollPosition") {
        return typeof features === "boolean" ? false : (_a3 = features[key]) != null ? _a3 : false;
      }
      if (typeof features === "boolean") {
        return features;
      }
      return (_b2 = features[key]) != null ? _b2 : true;
    },
    shadowRoots: []
  });
  context.log.time("wait until load");
  await waitUntilLoad(node, { timeout: context.timeout, onWarn: context.log.warn });
  context.log.timeEnd("wait until load");
  const { width, height } = resolveBoundingBox(node, context);
  context.width = width;
  context.height = height;
  return context;
}
function createStyleElement(ownerDocument) {
  if (!ownerDocument)
    return void 0;
  const style = ownerDocument.createElement("style");
  const cssText = style.ownerDocument.createTextNode(`
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`);
  style.appendChild(cssText);
  return style;
}
function resolveBoundingBox(node, context) {
  let { width, height } = context;
  if (isElementNode(node) && (!width || !height)) {
    const box = node.getBoundingClientRect();
    width = width || box.width || Number(node.getAttribute("width")) || 0;
    height = height || box.height || Number(node.getAttribute("height")) || 0;
  }
  return { width, height };
}
async function imageToCanvas(image, context) {
  const {
    log,
    timeout,
    drawImageCount,
    drawImageInterval
  } = context;
  log.time("image to canvas");
  const loaded = await loadMedia(image, { timeout, onWarn: context.log.warn });
  const { canvas, context2d } = createCanvas(image.ownerDocument, context);
  const drawImage = () => {
    try {
      context2d == null ? void 0 : context2d.drawImage(loaded, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      context.log.warn("Failed to drawImage", error);
    }
  };
  drawImage();
  if (context.isEnable("fixSvgXmlDecode")) {
    for (let i = 0; i < drawImageCount; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          context2d == null ? void 0 : context2d.clearRect(0, 0, canvas.width, canvas.height);
          drawImage();
          resolve();
        }, i + drawImageInterval);
      });
    }
  }
  context.drawImageCount = 0;
  log.timeEnd("image to canvas");
  return canvas;
}
function createCanvas(ownerDocument, context) {
  const { width, height, scale, backgroundColor, maximumCanvasSize: max } = context;
  const canvas = ownerDocument.createElement("canvas");
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (max) {
    if (canvas.width > max || canvas.height > max) {
      if (canvas.width > max && canvas.height > max) {
        if (canvas.width > canvas.height) {
          canvas.height *= max / canvas.width;
          canvas.width = max;
        } else {
          canvas.width *= max / canvas.height;
          canvas.height = max;
        }
      } else if (canvas.width > max) {
        canvas.height *= max / canvas.width;
        canvas.width = max;
      } else {
        canvas.width *= max / canvas.height;
        canvas.height = max;
      }
    }
  }
  const context2d = canvas.getContext("2d");
  if (context2d && backgroundColor) {
    context2d.fillStyle = backgroundColor;
    context2d.fillRect(0, 0, canvas.width, canvas.height);
  }
  return { canvas, context2d };
}
function cloneCanvas(canvas, context) {
  if (canvas.ownerDocument) {
    try {
      const dataURL = canvas.toDataURL();
      if (dataURL !== "data:,") {
        return createImage(dataURL, canvas.ownerDocument);
      }
    } catch (error) {
      context.log.warn("Failed to clone canvas", error);
    }
  }
  const cloned = canvas.cloneNode(false);
  const ctx = canvas.getContext("2d");
  const clonedCtx = cloned.getContext("2d");
  try {
    if (ctx && clonedCtx) {
      clonedCtx.putImageData(
        ctx.getImageData(0, 0, canvas.width, canvas.height),
        0,
        0
      );
    }
    return cloned;
  } catch (error) {
    context.log.warn("Failed to clone canvas", error);
  }
  return cloned;
}
function cloneIframe(iframe, context) {
  var _a2;
  try {
    if ((_a2 = iframe == null ? void 0 : iframe.contentDocument) == null ? void 0 : _a2.body) {
      return cloneNode(iframe.contentDocument.body, context);
    }
  } catch (error) {
    context.log.warn("Failed to clone iframe", error);
  }
  return iframe.cloneNode(false);
}
function cloneImage(image) {
  const cloned = image.cloneNode(false);
  if (image.currentSrc && image.currentSrc !== image.src) {
    cloned.src = image.currentSrc;
    cloned.srcset = "";
  }
  if (cloned.loading === "lazy") {
    cloned.loading = "eager";
  }
  return cloned;
}
async function cloneVideo(video, context) {
  if (video.ownerDocument && !video.currentSrc && video.poster) {
    return createImage(video.poster, video.ownerDocument);
  }
  const cloned = video.cloneNode(false);
  cloned.crossOrigin = "anonymous";
  if (video.currentSrc && video.currentSrc !== video.src) {
    cloned.src = video.currentSrc;
  }
  const ownerDocument = cloned.ownerDocument;
  if (ownerDocument) {
    let canPlay = true;
    await loadMedia(cloned, { onError: () => canPlay = false, onWarn: context.log.warn });
    if (!canPlay) {
      if (video.poster) {
        return createImage(video.poster, video.ownerDocument);
      }
      return cloned;
    }
    cloned.currentTime = video.currentTime;
    await new Promise((resolve) => {
      cloned.addEventListener("seeked", resolve, { once: true });
    });
    const canvas = ownerDocument.createElement("canvas");
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    try {
      const ctx = canvas.getContext("2d");
      if (ctx)
        ctx.drawImage(cloned, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      context.log.warn("Failed to clone video", error);
      if (video.poster) {
        return createImage(video.poster, video.ownerDocument);
      }
      return cloned;
    }
    return cloneCanvas(canvas, context);
  }
  return cloned;
}
function cloneElement(node, context) {
  if (isCanvasElement(node)) {
    return cloneCanvas(node, context);
  }
  if (isIFrameElement(node)) {
    return cloneIframe(node, context);
  }
  if (isImageElement(node)) {
    return cloneImage(node);
  }
  if (isVideoElement(node)) {
    return cloneVideo(node, context);
  }
  return node.cloneNode(false);
}
function getSandBox(context) {
  let sandbox = context.sandbox;
  if (!sandbox) {
    const { ownerDocument } = context;
    try {
      if (ownerDocument) {
        sandbox = ownerDocument.createElement("iframe");
        sandbox.id = `__SANDBOX__${uuid()}`;
        sandbox.width = "0";
        sandbox.height = "0";
        sandbox.style.visibility = "hidden";
        sandbox.style.position = "fixed";
        ownerDocument.body.appendChild(sandbox);
        sandbox.srcdoc = '<!DOCTYPE html><meta charset="UTF-8"><title></title><body>';
        context.sandbox = sandbox;
      }
    } catch (error) {
      context.log.warn("Failed to getSandBox", error);
    }
  }
  return sandbox;
}
var ignoredStyles = [
  "width",
  "height",
  "-webkit-text-fill-color"
];
var includedAttributes = [
  "stroke",
  "fill"
];
function getDefaultStyle(node, pseudoElement, context) {
  const { defaultComputedStyles } = context;
  const nodeName = node.nodeName.toLowerCase();
  const isSvgNode = isSVGElementNode(node) && nodeName !== "svg";
  const attributes = isSvgNode ? includedAttributes.map((name) => [name, node.getAttribute(name)]).filter(([, value]) => value !== null) : [];
  const key = [
    isSvgNode && "svg",
    nodeName,
    attributes.map((name, value) => `${name}=${value}`).join(","),
    pseudoElement
  ].filter(Boolean).join(":");
  if (defaultComputedStyles.has(key))
    return defaultComputedStyles.get(key);
  const sandbox = getSandBox(context);
  const sandboxWindow = sandbox == null ? void 0 : sandbox.contentWindow;
  if (!sandboxWindow)
    return /* @__PURE__ */ new Map();
  const sandboxDocument = sandboxWindow == null ? void 0 : sandboxWindow.document;
  let root;
  let el;
  if (isSvgNode) {
    root = sandboxDocument.createElementNS(XMLNS, "svg");
    el = root.ownerDocument.createElementNS(root.namespaceURI, nodeName);
    attributes.forEach(([name, value]) => {
      el.setAttributeNS(null, name, value);
    });
    root.appendChild(el);
  } else {
    root = el = sandboxDocument.createElement(nodeName);
  }
  el.textContent = " ";
  sandboxDocument.body.appendChild(root);
  const computedStyle = sandboxWindow.getComputedStyle(el, pseudoElement);
  const styles = /* @__PURE__ */ new Map();
  for (let len = computedStyle.length, i = 0; i < len; i++) {
    const name = computedStyle.item(i);
    if (ignoredStyles.includes(name))
      continue;
    styles.set(name, computedStyle.getPropertyValue(name));
  }
  sandboxDocument.body.removeChild(root);
  defaultComputedStyles.set(key, styles);
  return styles;
}
function getDiffStyle(style, defaultStyle, includeStyleProperties) {
  var _a2;
  const diffStyle = /* @__PURE__ */ new Map();
  const prefixs = [];
  const prefixTree = /* @__PURE__ */ new Map();
  if (includeStyleProperties) {
    for (const name of includeStyleProperties) {
      applyTo(name);
    }
  } else {
    for (let len = style.length, i = 0; i < len; i++) {
      const name = style.item(i);
      applyTo(name);
    }
  }
  for (let len = prefixs.length, i = 0; i < len; i++) {
    (_a2 = prefixTree.get(prefixs[i])) == null ? void 0 : _a2.forEach((value, name) => diffStyle.set(name, value));
  }
  function applyTo(name) {
    const value = style.getPropertyValue(name);
    const priority = style.getPropertyPriority(name);
    const subIndex = name.lastIndexOf("-");
    const prefix = subIndex > -1 ? name.substring(0, subIndex) : void 0;
    if (prefix) {
      let map = prefixTree.get(prefix);
      if (!map) {
        map = /* @__PURE__ */ new Map();
        prefixTree.set(prefix, map);
      }
      map.set(name, [value, priority]);
    }
    if (defaultStyle.get(name) === value && !priority)
      return;
    if (prefix) {
      prefixs.push(prefix);
    } else {
      diffStyle.set(name, [value, priority]);
    }
  }
  return diffStyle;
}
function copyCssStyles(node, cloned, isRoot, context) {
  var _a2, _b, _c, _d;
  const { ownerWindow, includeStyleProperties, currentParentNodeStyle } = context;
  const clonedStyle = cloned.style;
  const computedStyle = ownerWindow.getComputedStyle(node);
  const defaultStyle = getDefaultStyle(node, null, context);
  currentParentNodeStyle == null ? void 0 : currentParentNodeStyle.forEach((_, key) => {
    defaultStyle.delete(key);
  });
  const style = getDiffStyle(computedStyle, defaultStyle, includeStyleProperties);
  style.delete("transition-property");
  style.delete("all");
  style.delete("d");
  style.delete("content");
  if (isRoot) {
    style.delete("margin-top");
    style.delete("margin-right");
    style.delete("margin-bottom");
    style.delete("margin-left");
    style.delete("margin-block-start");
    style.delete("margin-block-end");
    style.delete("margin-inline-start");
    style.delete("margin-inline-end");
    style.set("box-sizing", ["border-box", ""]);
  }
  if (((_a2 = style.get("background-clip")) == null ? void 0 : _a2[0]) === "text") {
    cloned.classList.add("______background-clip--text");
  }
  if (IN_CHROME) {
    if (!style.has("font-kerning"))
      style.set("font-kerning", ["normal", ""]);
    if ((((_b = style.get("overflow-x")) == null ? void 0 : _b[0]) === "hidden" || ((_c = style.get("overflow-y")) == null ? void 0 : _c[0]) === "hidden") && ((_d = style.get("text-overflow")) == null ? void 0 : _d[0]) === "ellipsis" && node.scrollWidth === node.clientWidth) {
      style.set("text-overflow", ["clip", ""]);
    }
  }
  for (let len = clonedStyle.length, i = 0; i < len; i++) {
    clonedStyle.removeProperty(clonedStyle.item(i));
  }
  style.forEach(([value, priority], name) => {
    clonedStyle.setProperty(name, value, priority);
  });
  return style;
}
function copyInputValue(node, cloned) {
  if (isTextareaElement(node) || isInputElement(node) || isSelectElement(node)) {
    cloned.setAttribute("value", node.value);
  }
}
var pseudoClasses = [
  "::before",
  "::after"
  // '::placeholder', TODO
];
var scrollbarPseudoClasses = [
  "::-webkit-scrollbar",
  "::-webkit-scrollbar-button",
  // '::-webkit-scrollbar:horizontal', TODO
  "::-webkit-scrollbar-thumb",
  "::-webkit-scrollbar-track",
  "::-webkit-scrollbar-track-piece",
  // '::-webkit-scrollbar:vertical', TODO
  "::-webkit-scrollbar-corner",
  "::-webkit-resizer"
];
function copyPseudoClass(node, cloned, copyScrollbar, context, addWordToFontFamilies) {
  const { ownerWindow, svgStyleElement, svgStyles, currentNodeStyle } = context;
  if (!svgStyleElement || !ownerWindow)
    return;
  function copyBy(pseudoClass) {
    var _a2;
    const computedStyle = ownerWindow.getComputedStyle(node, pseudoClass);
    let content = computedStyle.getPropertyValue("content");
    if (!content || content === "none")
      return;
    addWordToFontFamilies == null ? void 0 : addWordToFontFamilies(content);
    content = content.replace(/(')|(")|(counter\(.+\))/g, "");
    const klasses = [uuid()];
    const defaultStyle = getDefaultStyle(node, pseudoClass, context);
    currentNodeStyle == null ? void 0 : currentNodeStyle.forEach((_, key) => {
      defaultStyle.delete(key);
    });
    const style = getDiffStyle(computedStyle, defaultStyle, context.includeStyleProperties);
    style.delete("content");
    style.delete("-webkit-locale");
    if (((_a2 = style.get("background-clip")) == null ? void 0 : _a2[0]) === "text") {
      cloned.classList.add("______background-clip--text");
    }
    const cloneStyle = [
      `content: '${content}';`
    ];
    style.forEach(([value, priority], name) => {
      cloneStyle.push(`${name}: ${value}${priority ? " !important" : ""};`);
    });
    if (cloneStyle.length === 1)
      return;
    try {
      cloned.className = [cloned.className, ...klasses].join(" ");
    } catch (err) {
      context.log.warn("Failed to copyPseudoClass", err);
      return;
    }
    const cssText = cloneStyle.join("\n  ");
    let allClasses = svgStyles.get(cssText);
    if (!allClasses) {
      allClasses = [];
      svgStyles.set(cssText, allClasses);
    }
    allClasses.push(`.${klasses[0]}${pseudoClass}`);
  }
  pseudoClasses.forEach(copyBy);
  if (copyScrollbar)
    scrollbarPseudoClasses.forEach(copyBy);
}
var excludeParentNodes = /* @__PURE__ */ new Set([
  "symbol"
  // test/fixtures/svg.symbol.html
]);
async function appendChildNode(node, cloned, child, context, addWordToFontFamilies) {
  if (isElementNode(child) && (isStyleElement(child) || isScriptElement(child)))
    return;
  if (context.filter && !context.filter(child))
    return;
  if (excludeParentNodes.has(cloned.nodeName) || excludeParentNodes.has(child.nodeName)) {
    context.currentParentNodeStyle = void 0;
  } else {
    context.currentParentNodeStyle = context.currentNodeStyle;
  }
  const childCloned = await cloneNode(child, context, false, addWordToFontFamilies);
  if (context.isEnable("restoreScrollPosition")) {
    restoreScrollPosition(node, childCloned);
  }
  cloned.appendChild(childCloned);
}
async function cloneChildNodes(node, cloned, context, addWordToFontFamilies) {
  var _a2;
  let firstChild = node.firstChild;
  if (isElementNode(node)) {
    if (node.shadowRoot) {
      firstChild = (_a2 = node.shadowRoot) == null ? void 0 : _a2.firstChild;
      context.shadowRoots.push(node.shadowRoot);
    }
  }
  for (let child = firstChild; child; child = child.nextSibling) {
    if (isCommentNode(child))
      continue;
    if (isElementNode(child) && isSlotElement(child) && typeof child.assignedNodes === "function") {
      const nodes = child.assignedNodes();
      for (let i = 0; i < nodes.length; i++) {
        await appendChildNode(node, cloned, nodes[i], context, addWordToFontFamilies);
      }
    } else {
      await appendChildNode(node, cloned, child, context, addWordToFontFamilies);
    }
  }
}
function restoreScrollPosition(node, chlidCloned) {
  if (!isHTMLElementNode(node) || !isHTMLElementNode(chlidCloned))
    return;
  const { scrollTop, scrollLeft } = node;
  if (!scrollTop && !scrollLeft) {
    return;
  }
  const { transform } = chlidCloned.style;
  const matrix = new DOMMatrix(transform);
  const { a, b, c, d } = matrix;
  matrix.a = 1;
  matrix.b = 0;
  matrix.c = 0;
  matrix.d = 1;
  matrix.translateSelf(-scrollLeft, -scrollTop);
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  chlidCloned.style.transform = matrix.toString();
}
function applyCssStyleWithOptions(cloned, context) {
  const { backgroundColor, width, height, style: styles } = context;
  const clonedStyle = cloned.style;
  if (backgroundColor)
    clonedStyle.setProperty("background-color", backgroundColor, "important");
  if (width)
    clonedStyle.setProperty("width", `${width}px`, "important");
  if (height)
    clonedStyle.setProperty("height", `${height}px`, "important");
  if (styles) {
    for (const name in styles) clonedStyle[name] = styles[name];
  }
}
var NORMAL_ATTRIBUTE_RE = /^[\w-:]+$/;
async function cloneNode(node, context, isRoot = false, addWordToFontFamilies) {
  var _a2, _b, _c, _d;
  const { ownerDocument, ownerWindow, fontFamilies, onCloneEachNode } = context;
  if (ownerDocument && isTextNode(node)) {
    if (addWordToFontFamilies && /\S/.test(node.data)) {
      addWordToFontFamilies(node.data);
    }
    return ownerDocument.createTextNode(node.data);
  }
  if (ownerDocument && ownerWindow && isElementNode(node) && (isHTMLElementNode(node) || isSVGElementNode(node))) {
    const cloned2 = await cloneElement(node, context);
    if (context.isEnable("removeAbnormalAttributes")) {
      const names = cloned2.getAttributeNames();
      for (let len = names.length, i = 0; i < len; i++) {
        const name = names[i];
        if (!NORMAL_ATTRIBUTE_RE.test(name)) {
          cloned2.removeAttribute(name);
        }
      }
    }
    const style = context.currentNodeStyle = copyCssStyles(node, cloned2, isRoot, context);
    if (isRoot)
      applyCssStyleWithOptions(cloned2, context);
    let copyScrollbar = false;
    if (context.isEnable("copyScrollbar")) {
      const overflow = [
        (_a2 = style.get("overflow-x")) == null ? void 0 : _a2[0],
        (_b = style.get("overflow-y")) == null ? void 0 : _b[0]
      ];
      copyScrollbar = overflow.includes("scroll") || (overflow.includes("auto") || overflow.includes("overlay")) && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth);
    }
    const textTransform = (_c = style.get("text-transform")) == null ? void 0 : _c[0];
    const families = splitFontFamily((_d = style.get("font-family")) == null ? void 0 : _d[0]);
    const addWordToFontFamilies2 = families ? (word) => {
      if (textTransform === "uppercase") {
        word = word.toUpperCase();
      } else if (textTransform === "lowercase") {
        word = word.toLowerCase();
      } else if (textTransform === "capitalize") {
        word = word[0].toUpperCase() + word.substring(1);
      }
      families.forEach((family) => {
        let fontFamily = fontFamilies.get(family);
        if (!fontFamily) {
          fontFamilies.set(family, fontFamily = /* @__PURE__ */ new Set());
        }
        word.split("").forEach((text) => fontFamily.add(text));
      });
    } : void 0;
    copyPseudoClass(
      node,
      cloned2,
      copyScrollbar,
      context,
      addWordToFontFamilies2
    );
    copyInputValue(node, cloned2);
    if (!isVideoElement(node)) {
      await cloneChildNodes(
        node,
        cloned2,
        context,
        addWordToFontFamilies2
      );
    }
    await (onCloneEachNode == null ? void 0 : onCloneEachNode(cloned2));
    return cloned2;
  }
  const cloned = node.cloneNode(false);
  await cloneChildNodes(node, cloned, context);
  await (onCloneEachNode == null ? void 0 : onCloneEachNode(cloned));
  return cloned;
}
function destroyContext(context) {
  context.ownerDocument = void 0;
  context.ownerWindow = void 0;
  context.svgStyleElement = void 0;
  context.svgDefsElement = void 0;
  context.svgStyles.clear();
  context.defaultComputedStyles.clear();
  if (context.sandbox) {
    try {
      context.sandbox.remove();
    } catch (err) {
      context.log.warn("Failed to destroyContext", err);
    }
    context.sandbox = void 0;
  }
  context.workers = [];
  context.fontFamilies.clear();
  context.fontCssTexts.clear();
  context.requests.clear();
  context.tasks = [];
  context.shadowRoots = [];
}
function baseFetch(options) {
  const _a2 = options, { url, timeout, responseType } = _a2, requestInit = __objRest(_a2, ["url", "timeout", "responseType"]);
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : void 0;
  return fetch(url, __spreadValues({ signal: controller.signal }, requestInit)).then((response) => {
    if (!response.ok) {
      throw new Error("Failed fetch, not 2xx response", { cause: response });
    }
    switch (responseType) {
      case "arrayBuffer":
        return response.arrayBuffer();
      case "dataUrl":
        return response.blob().then(blobToDataUrl);
      case "text":
      default:
        return response.text();
    }
  }).finally(() => clearTimeout(timer));
}
function contextFetch(context, options) {
  const { url: rawUrl, requestType = "text", responseType = "text", imageDom } = options;
  let url = rawUrl;
  const {
    timeout,
    acceptOfImage,
    requests,
    fetchFn,
    fetch: {
      requestInit,
      bypassingCache,
      placeholderImage
    },
    font,
    workers,
    fontFamilies
  } = context;
  if (requestType === "image" && (IN_SAFARI || IN_FIREFOX)) {
    context.drawImageCount++;
  }
  let request = requests.get(rawUrl);
  if (!request) {
    if (bypassingCache) {
      if (bypassingCache instanceof RegExp && bypassingCache.test(url)) {
        url += (/\?/.test(url) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
      }
    }
    const canFontMinify = requestType.startsWith("font") && font && font.minify;
    const fontTexts = /* @__PURE__ */ new Set();
    if (canFontMinify) {
      const families = requestType.split(";")[1].split(",");
      families.forEach((family) => {
        if (!fontFamilies.has(family))
          return;
        fontFamilies.get(family).forEach((text) => fontTexts.add(text));
      });
    }
    const needFontMinify = canFontMinify && fontTexts.size;
    const baseFetchOptions = __spreadValues({
      url,
      timeout,
      responseType: needFontMinify ? "arrayBuffer" : responseType,
      headers: requestType === "image" ? { accept: acceptOfImage } : void 0
    }, requestInit);
    request = {
      type: requestType,
      resolve: void 0,
      reject: void 0,
      response: null
    };
    request.response = (async () => {
      if (fetchFn && requestType === "image") {
        const result = await fetchFn(rawUrl);
        if (result)
          return result;
      }
      if (!IN_SAFARI && rawUrl.startsWith("http") && workers.length) {
        return new Promise((resolve, reject) => {
          const worker = workers[requests.size & workers.length - 1];
          worker.postMessage(__spreadValues({ rawUrl }, baseFetchOptions));
          request.resolve = resolve;
          request.reject = reject;
        });
      }
      return baseFetch(baseFetchOptions);
    })().catch((error) => {
      requests.delete(rawUrl);
      if (requestType === "image" && placeholderImage) {
        context.log.warn("Failed to fetch image base64, trying to use placeholder image", url);
        return typeof placeholderImage === "string" ? placeholderImage : placeholderImage(imageDom);
      }
      throw error;
    });
    requests.set(rawUrl, request);
  }
  return request.response;
}
async function replaceCssUrlToDataUrl(cssText, baseUrl, context, isImage) {
  if (!hasCssUrl(cssText))
    return cssText;
  for (const [rawUrl, url] of parseCssUrls(cssText, baseUrl)) {
    try {
      const dataUrl = await contextFetch(
        context,
        {
          url,
          requestType: isImage ? "image" : "text",
          responseType: "dataUrl"
        }
      );
      cssText = cssText.replace(toRE(rawUrl), `$1${dataUrl}$3`);
    } catch (error) {
      context.log.warn("Failed to fetch css data url", rawUrl, error);
    }
  }
  return cssText;
}
function hasCssUrl(cssText) {
  return /url\((['"]?)([^'"]+?)\1\)/.test(cssText);
}
var URL_RE = /url\((['"]?)([^'"]+?)\1\)/g;
function parseCssUrls(cssText, baseUrl) {
  const result = [];
  cssText.replace(URL_RE, (raw, quotation, url) => {
    result.push([url, resolveUrl(url, baseUrl)]);
    return raw;
  });
  return result.filter(([url]) => !isDataUrl(url));
}
function toRE(url) {
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
}
var properties = [
  "background-image",
  "border-image-source",
  "-webkit-border-image",
  "-webkit-mask-image",
  "list-style-image"
];
function embedCssStyleImage(style, context) {
  return properties.map((property) => {
    const value = style.getPropertyValue(property);
    if (!value || value === "none") {
      return null;
    }
    if (IN_SAFARI || IN_FIREFOX) {
      context.drawImageCount++;
    }
    return replaceCssUrlToDataUrl(value, null, context, true).then((newValue) => {
      if (!newValue || value === newValue)
        return;
      style.setProperty(
        property,
        newValue,
        style.getPropertyPriority(property)
      );
    });
  }).filter(Boolean);
}
function embedImageElement(cloned, context) {
  if (isImageElement(cloned)) {
    const originalSrc = cloned.currentSrc || cloned.src;
    if (!isDataUrl(originalSrc)) {
      return [
        contextFetch(context, {
          url: originalSrc,
          imageDom: cloned,
          requestType: "image",
          responseType: "dataUrl"
        }).then((url) => {
          if (!url)
            return;
          cloned.srcset = "";
          cloned.dataset.originalSrc = originalSrc;
          cloned.src = url || "";
        })
      ];
    }
    if (IN_SAFARI || IN_FIREFOX) {
      context.drawImageCount++;
    }
  } else if (isSVGElementNode(cloned) && !isDataUrl(cloned.href.baseVal)) {
    const originalSrc = cloned.href.baseVal;
    return [
      contextFetch(context, {
        url: originalSrc,
        imageDom: cloned,
        requestType: "image",
        responseType: "dataUrl"
      }).then((url) => {
        if (!url)
          return;
        cloned.dataset.originalSrc = originalSrc;
        cloned.href.baseVal = url || "";
      })
    ];
  }
  return [];
}
function embedSvgUse(cloned, context) {
  var _a2;
  const { ownerDocument, svgDefsElement } = context;
  const href = (_a2 = cloned.getAttribute("href")) != null ? _a2 : cloned.getAttribute("xlink:href");
  if (!href)
    return [];
  const [svgUrl, id] = href.split("#");
  if (id) {
    const query = `#${id}`;
    const definition = context.shadowRoots.reduce(
      (res, root) => {
        return res != null ? res : root.querySelector(`svg ${query}`);
      },
      ownerDocument == null ? void 0 : ownerDocument.querySelector(`svg ${query}`)
    );
    if (svgUrl) {
      cloned.setAttribute("href", query);
    }
    if (svgDefsElement == null ? void 0 : svgDefsElement.querySelector(query))
      return [];
    if (definition) {
      svgDefsElement == null ? void 0 : svgDefsElement.appendChild(definition.cloneNode(true));
      return [];
    } else if (svgUrl) {
      return [
        contextFetch(context, {
          url: svgUrl,
          responseType: "text"
        }).then((svgData) => {
          svgDefsElement == null ? void 0 : svgDefsElement.insertAdjacentHTML("beforeend", svgData);
        })
      ];
    }
  }
  return [];
}
function embedNode(cloned, context) {
  const { tasks } = context;
  if (isElementNode(cloned)) {
    if (isImageElement(cloned) || isSVGImageElementNode(cloned)) {
      tasks.push(...embedImageElement(cloned, context));
    }
    if (isSVGUseElementNode(cloned)) {
      tasks.push(...embedSvgUse(cloned, context));
    }
  }
  if (isHTMLElementNode(cloned)) {
    tasks.push(...embedCssStyleImage(cloned.style, context));
  }
  cloned.childNodes.forEach((child) => {
    embedNode(child, context);
  });
}
async function embedWebFont(clone, context) {
  const {
    ownerDocument,
    svgStyleElement,
    fontFamilies,
    fontCssTexts,
    tasks,
    font
  } = context;
  if (!ownerDocument || !svgStyleElement || !fontFamilies.size) {
    return;
  }
  if (font && font.cssText) {
    const cssText = filterPreferredFormat(font.cssText, context);
    svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}
`));
  } else {
    const styleSheets = Array.from(ownerDocument.styleSheets).filter((styleSheet) => {
      try {
        return "cssRules" in styleSheet && Boolean(styleSheet.cssRules.length);
      } catch (error) {
        context.log.warn(`Error while reading CSS rules from ${styleSheet.href}`, error);
        return false;
      }
    });
    await Promise.all(
      styleSheets.flatMap((styleSheet) => {
        return Array.from(styleSheet.cssRules).map(async (cssRule, index) => {
          if (isCSSImportRule(cssRule)) {
            let importIndex = index + 1;
            const baseUrl = cssRule.href;
            let cssText = "";
            try {
              cssText = await contextFetch(context, {
                url: baseUrl,
                requestType: "text",
                responseType: "text"
              });
            } catch (error) {
              context.log.warn(`Error fetch remote css import from ${baseUrl}`, error);
            }
            const replacedCssText = cssText.replace(
              URL_RE,
              (raw, quotation, url) => raw.replace(url, resolveUrl(url, baseUrl))
            );
            for (const rule of parseCss(replacedCssText)) {
              try {
                styleSheet.insertRule(
                  rule,
                  rule.startsWith("@import") ? importIndex += 1 : styleSheet.cssRules.length
                );
              } catch (error) {
                context.log.warn("Error inserting rule from remote css import", { rule, error });
              }
            }
          }
        });
      })
    );
    const cssRules = [];
    styleSheets.forEach((sheet) => {
      unwrapCssLayers(sheet.cssRules, cssRules);
    });
    cssRules.filter((cssRule) => {
      var _a2;
      return isCssFontFaceRule(cssRule) && hasCssUrl(cssRule.style.getPropertyValue("src")) && ((_a2 = splitFontFamily(cssRule.style.getPropertyValue("font-family"))) == null ? void 0 : _a2.some((val) => fontFamilies.has(val)));
    }).forEach((value) => {
      const rule = value;
      const cssText = fontCssTexts.get(rule.cssText);
      if (cssText) {
        svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}
`));
      } else {
        tasks.push(
          replaceCssUrlToDataUrl(
            rule.cssText,
            rule.parentStyleSheet ? rule.parentStyleSheet.href : null,
            context
          ).then((cssText2) => {
            cssText2 = filterPreferredFormat(cssText2, context);
            fontCssTexts.set(rule.cssText, cssText2);
            svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText2}
`));
          })
        );
      }
    });
  }
}
var COMMENTS_RE = /(\/\*[\s\S]*?\*\/)/g;
var KEYFRAMES_RE = /((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi;
function parseCss(source) {
  if (source == null)
    return [];
  const result = [];
  let cssText = source.replace(COMMENTS_RE, "");
  while (true) {
    const matches = KEYFRAMES_RE.exec(cssText);
    if (!matches)
      break;
    result.push(matches[0]);
  }
  cssText = cssText.replace(KEYFRAMES_RE, "");
  const IMPORT_RE = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
  const UNIFIED_RE = new RegExp(
    // eslint-disable-next-line
    "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",
    "gi"
  );
  while (true) {
    let matches = IMPORT_RE.exec(cssText);
    if (!matches) {
      matches = UNIFIED_RE.exec(cssText);
      if (!matches) {
        break;
      } else {
        IMPORT_RE.lastIndex = UNIFIED_RE.lastIndex;
      }
    } else {
      UNIFIED_RE.lastIndex = IMPORT_RE.lastIndex;
    }
    result.push(matches[0]);
  }
  return result;
}
var URL_WITH_FORMAT_RE = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_RE = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function filterPreferredFormat(str, context) {
  const { font } = context;
  const preferredFormat = font ? font == null ? void 0 : font.preferredFormat : void 0;
  return preferredFormat ? str.replace(FONT_SRC_RE, (match) => {
    while (true) {
      const [src, , format] = URL_WITH_FORMAT_RE.exec(match) || [];
      if (!format)
        return "";
      if (format === preferredFormat)
        return `src: ${src};`;
    }
  }) : str;
}
function unwrapCssLayers(rules, out = []) {
  for (const rule of Array.from(rules)) {
    if (isLayerBlockRule(rule)) {
      out.push(...unwrapCssLayers(rule.cssRules));
    } else if ("cssRules" in rule) {
      unwrapCssLayers(rule.cssRules, out);
    } else {
      out.push(rule);
    }
  }
  return out;
}
async function domToForeignObjectSvg(node, options) {
  const context = await orCreateContext(node, options);
  if (isElementNode(context.node) && isSVGElementNode(context.node))
    return context.node;
  const {
    ownerDocument,
    log,
    tasks,
    svgStyleElement,
    svgDefsElement,
    svgStyles,
    font,
    progress,
    autoDestruct,
    onCloneNode,
    onEmbedNode,
    onCreateForeignObjectSvg
  } = context;
  log.time("clone node");
  const clone = await cloneNode(context.node, context, true);
  if (svgStyleElement && ownerDocument) {
    let allCssText = "";
    svgStyles.forEach((klasses, cssText) => {
      allCssText += `${klasses.join(",\n")} {
  ${cssText}
}
`;
    });
    svgStyleElement.appendChild(ownerDocument.createTextNode(allCssText));
  }
  log.timeEnd("clone node");
  await (onCloneNode == null ? void 0 : onCloneNode(clone));
  if (font !== false && isElementNode(clone)) {
    log.time("embed web font");
    await embedWebFont(clone, context);
    log.timeEnd("embed web font");
  }
  log.time("embed node");
  embedNode(clone, context);
  const count = tasks.length;
  let current = 0;
  const runTask = async () => {
    while (true) {
      const task = tasks.pop();
      if (!task)
        break;
      try {
        await task;
      } catch (error) {
        context.log.warn("Failed to run task", error);
      }
      progress == null ? void 0 : progress(++current, count);
    }
  };
  progress == null ? void 0 : progress(current, count);
  await Promise.all([...Array.from({ length: 4 })].map(runTask));
  log.timeEnd("embed node");
  await (onEmbedNode == null ? void 0 : onEmbedNode(clone));
  const svg = createForeignObjectSvg(clone, context);
  svgDefsElement && svg.insertBefore(svgDefsElement, svg.children[0]);
  svgStyleElement && svg.insertBefore(svgStyleElement, svg.children[0]);
  autoDestruct && destroyContext(context);
  await (onCreateForeignObjectSvg == null ? void 0 : onCreateForeignObjectSvg(svg));
  return svg;
}
function createForeignObjectSvg(clone, context) {
  const { width, height } = context;
  const svg = createSvg(width, height, clone.ownerDocument);
  const foreignObject = svg.ownerDocument.createElementNS(svg.namespaceURI, "foreignObject");
  foreignObject.setAttributeNS(null, "x", "0%");
  foreignObject.setAttributeNS(null, "y", "0%");
  foreignObject.setAttributeNS(null, "width", "100%");
  foreignObject.setAttributeNS(null, "height", "100%");
  foreignObject.append(clone);
  svg.appendChild(foreignObject);
  return svg;
}
async function domToCanvas(node, options) {
  var _a2;
  const context = await orCreateContext(node, options);
  const svg = await domToForeignObjectSvg(context);
  const dataUrl = svgToDataUrl(svg, context.isEnable("removeControlCharacter"));
  if (!context.autoDestruct) {
    context.svgStyleElement = createStyleElement(context.ownerDocument);
    context.svgDefsElement = (_a2 = context.ownerDocument) == null ? void 0 : _a2.createElementNS(XMLNS, "defs");
    context.svgStyles.clear();
  }
  const image = createImage(dataUrl, svg.ownerDocument);
  return await imageToCanvas(image, context);
}
async function domToDataUrl(node, options) {
  const context = await orCreateContext(node, options);
  const { log, quality, type, dpi } = context;
  const canvas = await domToCanvas(context);
  log.time("canvas to data url");
  let dataUrl = canvas.toDataURL(type, quality);
  if (["image/png", "image/jpeg"].includes(type) && dpi && SUPPORT_ATOB && SUPPORT_BTOA) {
    const [format, body] = dataUrl.split(",");
    let headerLength = 0;
    let overwritepHYs = false;
    if (type === "image/png") {
      const b64Index = detectPhysChunkFromDataUrl(body);
      if (b64Index >= 0) {
        headerLength = Math.ceil((b64Index + 28) / 3) * 4;
        overwritepHYs = true;
      } else {
        headerLength = 33 / 3 * 4;
      }
    } else if (type === "image/jpeg") {
      headerLength = 18 / 3 * 4;
    }
    const stringHeader = body.substring(0, headerLength);
    const restOfData = body.substring(headerLength);
    const headerBytes = window.atob(stringHeader);
    const uint8Array = new Uint8Array(headerBytes.length);
    for (let i = 0; i < uint8Array.length; i++) {
      uint8Array[i] = headerBytes.charCodeAt(i);
    }
    const finalArray = type === "image/png" ? changePngDpi(uint8Array, dpi, overwritepHYs) : changeJpegDpi(uint8Array, dpi);
    const base64Header = window.btoa(String.fromCharCode(...finalArray));
    dataUrl = [format, ",", base64Header, restOfData].join("");
  }
  log.timeEnd("canvas to data url");
  return dataUrl;
}
async function domToPng(node, options) {
  return domToDataUrl(
    await orCreateContext(node, __spreadProps(__spreadValues({}, options), { type: "image/png" }))
  );
}

// src/ui/screenshot.ts
function nodeFilter(node) {
  var _a2;
  if ((_a2 = node.getAttribute) == null ? void 0 : _a2.call(node, "data-instruckt")) return false;
  return true;
}
var activeStream = null;
async function getStream() {
  if (activeStream && activeStream.active) return activeStream;
  activeStream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: "browser" },
    preferCurrentTab: true
  });
  activeStream.getVideoTracks()[0].addEventListener("ended", () => {
    activeStream = null;
  });
  return activeStream;
}
async function grabFrame(stream) {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.muted = true;
  await video.play();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const bitmap = await createImageBitmap(video);
  video.pause();
  video.srcObject = null;
  return bitmap;
}
function captureRectFromStream(stream, rect) {
  return grabFrame(stream).then((bitmap) => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      bitmap,
      rect.x * dpr,
      rect.y * dpr,
      rect.width * dpr,
      rect.height * dpr,
      0,
      0,
      canvas.width,
      canvas.height
    );
    bitmap.close();
    return canvas.toDataURL("image/png");
  });
}
async function captureElement(el) {
  try {
    const dataUrl = await domToPng(el, {
      scale: 2,
      filter: nodeFilter
    });
    if (dataUrl) return dataUrl;
  } catch (e) {
  }
  try {
    const stream = await getStream();
    return await captureRectFromStream(stream, el.getBoundingClientRect());
  } catch (err) {
    console.warn("[instruckt] captureElement failed:", err);
    return null;
  }
}
async function captureRegion(rect) {
  try {
    const full = await domToPng(document.body, {
      scale: 2,
      filter: nodeFilter
    });
    if (full) return await cropImage(full, rect);
  } catch (e) {
  }
  try {
    const stream = await getStream();
    return await captureRectFromStream(stream, rect);
  } catch (err) {
    console.warn("[instruckt] captureRegion failed:", err);
    return null;
  }
}
function cropImage(dataUrl, rect) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = 2;
      const canvas = document.createElement("canvas");
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        rect.x * ratio,
        rect.y * ratio,
        rect.width * ratio,
        rect.height * ratio,
        0,
        0,
        rect.width * ratio,
        rect.height * ratio
      );
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
function selectRegion() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647",
      cursor: "crosshair",
      background: "rgba(0,0,0,0.1)"
    });
    overlay.setAttribute("data-instruckt", "region-select");
    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed",
      border: "2px dashed #6366f1",
      background: "rgba(99,102,241,0.08)",
      borderRadius: "4px",
      display: "none",
      pointerEvents: "none"
    });
    overlay.appendChild(box);
    let startX = 0, startY = 0, dragging = false;
    const onMouseDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      dragging = true;
      box.style.display = "block";
      updateBox(e);
    };
    const onMouseMove = (e) => {
      if (!dragging) return;
      updateBox(e);
    };
    const updateBox = (e) => {
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const w = Math.abs(e.clientX - startX);
      const h = Math.abs(e.clientY - startY);
      Object.assign(box.style, {
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`
      });
    };
    const onMouseUp = (e) => {
      if (!dragging) return;
      dragging = false;
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const w = Math.abs(e.clientX - startX);
      const h = Math.abs(e.clientY - startY);
      cleanup();
      if (w < 10 || h < 10) {
        resolve(null);
      } else {
        resolve(new DOMRect(x, y, w, h));
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        cleanup();
        resolve(null);
      }
    };
    const cleanup = () => {
      overlay.remove();
      document.removeEventListener("keydown", onKeyDown, true);
    };
    overlay.addEventListener("mousedown", onMouseDown);
    overlay.addEventListener("mousemove", onMouseMove);
    overlay.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKeyDown, true);
    document.body.appendChild(overlay);
  });
}

// src/ui/popup.ts
function screenshotUrl(screenshot, endpoint) {
  if (!screenshot) return null;
  if (screenshot.startsWith("data:")) return screenshot;
  const base = endpoint != null ? endpoint : "/instruckt";
  return `${base}/${screenshot}`;
}
function esc(s) {
  return String(s != null ? s : "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var AnnotationPopup = class {
  constructor() {
    this.host = null;
    this.shadow = null;
    this.boundOutside = (e) => {
      if (this.host && !this.host.contains(e.target)) {
        this.destroy();
      }
    };
  }
  // ── New annotation popup ──────────────────────────────────────
  showNew(pending, callbacks) {
    var _a2, _b;
    this.destroy();
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "popup");
    this.stopHostPropagation(this.host);
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = POPUP_CSS;
    this.shadow.appendChild(style);
    const popup = document.createElement("div");
    popup.className = "popup";
    const fwBadge = pending.framework ? `<div class="fw-badge">${esc(pending.framework.component)}</div>` : "";
    const selText = pending.selectedText ? `<div class="selected-text">"${esc(pending.selectedText.slice(0, 80))}"</div>` : "";
    const hasScreenshot = !!pending.screenshot;
    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(pending.elementPath)}">${esc(pending.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${fwBadge}${selText}
      <div class="screenshot-slot">${hasScreenshot ? `<div class="screenshot-preview"><img src="${pending.screenshot}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>` : `<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>`}</div>
      <textarea placeholder="${hasScreenshot ? "Add a note (optional)" : "What needs to change here?"}" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" ${hasScreenshot ? "" : "disabled"}>Add note</button>
      </div>
    `;
    let currentScreenshot = (_a2 = pending.screenshot) != null ? _a2 : null;
    const textarea = popup.querySelector("textarea");
    const submitBtn = popup.querySelector('[data-action="submit"]');
    const screenshotSlot = popup.querySelector(".screenshot-slot");
    const updateSubmitState = () => {
      submitBtn.disabled = !currentScreenshot && textarea.value.trim().length === 0;
    };
    const attachScreenshotEvents = () => {
      const captureBtn = screenshotSlot.querySelector('[data-action="capture"]');
      captureBtn == null ? void 0 : captureBtn.addEventListener("click", async () => {
        captureBtn.textContent = "Capturing...";
        const dataUrl = await captureElement(pending.element);
        if (dataUrl) {
          currentScreenshot = dataUrl;
          screenshotSlot.innerHTML = `<div class="screenshot-preview"><img src="${dataUrl}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`;
          textarea.placeholder = "Add a note (optional)";
          attachScreenshotEvents();
          updateSubmitState();
        } else {
          captureBtn.textContent = "Capture failed";
          setTimeout(() => {
            if (captureBtn.parentElement) captureBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot`;
          }, 1500);
        }
      });
      const removeBtn = screenshotSlot.querySelector(".screenshot-remove");
      removeBtn == null ? void 0 : removeBtn.addEventListener("click", () => {
        currentScreenshot = null;
        screenshotSlot.innerHTML = `<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>`;
        textarea.placeholder = "What needs to change here?";
        attachScreenshotEvents();
        updateSubmitState();
      });
    };
    attachScreenshotEvents();
    textarea.addEventListener("input", updateSubmitState);
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!submitBtn.disabled) submitBtn.click();
      }
      if (e.key === "Escape") {
        callbacks.onCancel();
        this.destroy();
      }
    });
    popup.querySelector('[data-action="cancel"]').addEventListener("click", () => {
      callbacks.onCancel();
      this.destroy();
    });
    popup.querySelector(".close-btn").addEventListener("click", () => {
      callbacks.onCancel();
      this.destroy();
    });
    submitBtn.addEventListener("click", () => {
      const comment = textarea.value.trim();
      if (!comment && !currentScreenshot) return;
      callbacks.onSubmit({ comment: comment || "(screenshot)", screenshot: currentScreenshot != null ? currentScreenshot : void 0 });
      this.destroy();
    });
    this.shadow.appendChild(popup);
    ((_b = document.getElementById("instruckt-root")) != null ? _b : document.body).appendChild(this.host);
    this.positionHost(pending.x, pending.y);
    this.setupOutsideClick();
    textarea.focus();
  }
  // ── Edit existing annotation ──────────────────────────────────
  showEdit(annotation, callbacks, endpoint) {
    var _a2;
    this.destroy();
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "popup");
    this.stopHostPropagation(this.host);
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = POPUP_CSS;
    this.shadow.appendChild(style);
    const popup = document.createElement("div");
    popup.className = "popup";
    const fwBadge = annotation.framework ? `<div class="fw-badge">${esc(annotation.framework.component)}</div>` : "";
    const ssUrl = screenshotUrl(annotation.screenshot, endpoint);
    const screenshotPreview = ssUrl ? `<div class="screenshot-preview screenshot-slot"><img src="${ssUrl}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>` : "";
    const commentText = annotation.comment === "(screenshot)" ? "" : annotation.comment;
    popup.innerHTML = `
      <div class="header">
        <span class="element-tag" title="${esc(annotation.elementPath)}">${esc(annotation.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${fwBadge}${screenshotPreview}
      <textarea rows="3">${esc(commentText)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `;
    popup.querySelector(".close-btn").addEventListener("click", () => this.destroy());
    const ssRemoveBtn = popup.querySelector(".screenshot-remove");
    ssRemoveBtn == null ? void 0 : ssRemoveBtn.addEventListener("click", () => {
      callbacks.onSave(annotation, annotation.comment);
      const slot = popup.querySelector(".screenshot-slot");
      if (slot) slot.remove();
    });
    const textarea = popup.querySelector("textarea");
    const saveBtn = popup.querySelector('[data-action="save"]');
    const deleteBtn = popup.querySelector('[data-action="delete"]');
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        saveBtn.click();
      }
      if (e.key === "Escape") this.destroy();
    });
    saveBtn.addEventListener("click", () => {
      const newComment = textarea.value.trim();
      if (!newComment) return;
      callbacks.onSave(annotation, newComment);
      this.destroy();
    });
    deleteBtn.addEventListener("click", () => {
      callbacks.onDelete(annotation);
      this.destroy();
    });
    this.shadow.appendChild(popup);
    ((_a2 = document.getElementById("instruckt-root")) != null ? _a2 : document.body).appendChild(this.host);
    const markerX = annotation.x / 100 * window.innerWidth;
    const markerY = annotation.y - window.scrollY;
    this.positionHost(markerX, markerY);
    this.setupOutsideClick();
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }
  // ── Helpers ───────────────────────────────────────────────────
  /** Prevent popup interactions from reaching page handlers (e.g. @click.outside, form submit) */
  stopHostPropagation(host) {
    for (const evt of ["click", "mousedown", "pointerdown", "keydown", "keyup", "keypress", "submit"]) {
      host.addEventListener(evt, (e) => e.stopPropagation());
    }
  }
  positionHost(x, y) {
    if (!this.host) return;
    this.host.setAttribute("popover", "manual");
    try {
      this.host.showPopover();
    } catch (e) {
    }
    Object.assign(this.host.style, { position: "fixed", zIndex: "2147483647", left: "-9999px", top: "0" });
    requestAnimationFrame(() => {
      var _a2, _b;
      if (!this.host) return;
      const w = 340 + 20;
      const h = (_b = (_a2 = this.host.querySelector(".popup")) == null ? void 0 : _a2.getBoundingClientRect().height) != null ? _b : 300;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const left = Math.max(10, Math.min(x + 10, vw - w));
      const top = Math.max(10, Math.min(y + 10, vh - h - 10));
      Object.assign(this.host.style, { left: `${left}px`, top: `${top}px` });
    });
  }
  setupOutsideClick() {
    setTimeout(() => document.addEventListener("mousedown", this.boundOutside), 0);
  }
  destroy() {
    var _a2;
    (_a2 = this.host) == null ? void 0 : _a2.remove();
    this.host = null;
    this.shadow = null;
    document.removeEventListener("mousedown", this.boundOutside);
  }
};

// src/ui/markers.ts
var AnnotationMarkers = class {
  constructor(onClick) {
    this.onClick = onClick;
    this.markers = /* @__PURE__ */ new Map();
    var _a2;
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "2147483645"
    });
    this.container.setAttribute("data-instruckt", "markers");
    const root = (_a2 = document.getElementById("instruckt-root")) != null ? _a2 : document.body;
    root.appendChild(this.container);
  }
  /** Add or update a marker for an annotation */
  upsert(annotation, index) {
    const existing = this.markers.get(annotation.id);
    if (existing) {
      this.updateStyle(existing.el, annotation);
      return;
    }
    const el = document.createElement("div");
    const ssClass = annotation.screenshot ? " has-screenshot" : "";
    el.className = `ik-marker ${this.statusClass(annotation.status)}${ssClass}`;
    el.textContent = String(index);
    el.title = annotation.comment === "(screenshot)" ? "Screenshot" : annotation.comment.slice(0, 60);
    el.style.pointerEvents = "all";
    el.style.left = `${annotation.x / 100 * window.innerWidth}px`;
    el.style.top = `${annotation.y - window.scrollY}px`;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onClick(annotation);
    });
    this.container.appendChild(el);
    this.markers.set(annotation.id, { el, annotationId: annotation.id });
  }
  /** Update an existing marker after its annotation status changed */
  update(annotation) {
    const marker = this.markers.get(annotation.id);
    if (!marker) return;
    this.updateStyle(marker.el, annotation);
  }
  updateStyle(el, annotation) {
    const ssClass = annotation.screenshot ? " has-screenshot" : "";
    el.className = `ik-marker ${this.statusClass(annotation.status)}${ssClass}`;
    el.title = annotation.comment === "(screenshot)" ? "Screenshot" : annotation.comment.slice(0, 60);
  }
  statusClass(status) {
    if (status === "resolved") return "resolved";
    if (status === "dismissed") return "dismissed";
    return "";
  }
  /** Reposition all markers (e.g. after scroll or resize) */
  reposition(annotations) {
    annotations.forEach((annotation) => {
      const marker = this.markers.get(annotation.id);
      if (!marker) return;
      marker.el.style.left = `${annotation.x / 100 * window.innerWidth}px`;
      marker.el.style.top = `${annotation.y - window.scrollY}px`;
    });
  }
  remove(annotationId) {
    const marker = this.markers.get(annotationId);
    if (!marker) return;
    marker.el.remove();
    this.markers.delete(annotationId);
  }
  /** Show or hide all markers */
  setVisible(visible) {
    this.container.style.display = visible ? "" : "none";
  }
  /** Remove all markers without destroying the container */
  clear() {
    for (const { el } of this.markers.values()) {
      el.remove();
    }
    this.markers.clear();
  }
  destroy() {
    this.container.remove();
    this.markers.clear();
  }
};

// src/selector.ts
function getElementSelector(el) {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }
  const path = [];
  let current = el;
  while (current && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (!parent) {
      path.unshift(tag);
      break;
    }
    const classes = Array.from(current.classList).filter((c) => !c.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0, 3);
    if (classes.length > 0) {
      const classSelector = `${tag}.${classes.map(CSS.escape).join(".")}`;
      const matches = parent.querySelectorAll(classSelector);
      if (matches.length === 1) {
        path.unshift(classSelector);
        break;
      }
    }
    const siblings = Array.from(parent.children).filter((c) => c.tagName === current.tagName);
    if (siblings.length === 1) {
      path.unshift(tag);
    } else {
      const index = siblings.indexOf(current) + 1;
      path.unshift(`${tag}:nth-of-type(${index})`);
    }
    current = parent;
  }
  return path.join(" > ");
}
function getElementName(el) {
  const tag = el.tagName.toLowerCase();
  const wireModel = el.getAttribute("wire:model") || el.getAttribute("wire:click");
  if (wireModel) return `${tag}[wire:${wireModel.split(".")[0]}]`;
  if (el.id) return `${tag}#${el.id}`;
  const firstClass = el.classList[0];
  if (firstClass) return `${tag}.${firstClass}`;
  return tag;
}
function getElementLabel(el) {
  const tag = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  const attrs = [];
  if (el.id) attrs.push(`id="${el.id}"`);
  const role = el.getAttribute("role");
  if (role) attrs.push(`role="${role}"`);
  const wireAttr = el.getAttribute("wire:model") || el.getAttribute("wire:click");
  if (wireAttr) attrs.push(`wire:${el.hasAttribute("wire:model") ? "model" : "click"}="${wireAttr}"`);
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  const openTag = `<${tag}${attrStr}>`;
  if (text) return `${openTag} ${text}`;
  return openTag;
}
function getNearbyText(el) {
  const text = (el.textContent || "").trim().replace(/\s+/g, " ");
  return text.slice(0, 120);
}
function getCssClasses(el) {
  return Array.from(el.classList).filter((c) => !c.match(/^(instruckt-)/)).join(" ");
}
function getPageBoundingBox(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height
  };
}

// src/adapters/livewire.ts
function isAvailable() {
  return typeof window.Livewire !== "undefined";
}
function detect(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    if (node.getAttribute("wire:id")) return node;
    node = node.parentElement;
  }
  return null;
}
function getContext(el) {
  var _a2, _b, _c, _d, _e;
  if (!isAvailable()) return null;
  const wireEl = detect(el);
  if (!wireEl) return null;
  const wireId = wireEl.getAttribute("wire:id");
  let componentName = "Unknown";
  let className;
  const snapshotAttr = wireEl.getAttribute("wire:snapshot");
  if (snapshotAttr) {
    try {
      const snapshot = JSON.parse(snapshotAttr);
      componentName = (_b = (_a2 = snapshot == null ? void 0 : snapshot.memo) == null ? void 0 : _a2.name) != null ? _b : "Unknown";
      className = (_e = (_c = snapshot == null ? void 0 : snapshot.memo) == null ? void 0 : _c.path) != null ? _e : (_d = snapshot == null ? void 0 : snapshot.memo) == null ? void 0 : _d.name;
    } catch (e) {
    }
  }
  return {
    framework: "livewire",
    component: componentName,
    wire_id: wireId,
    class_name: className
  };
}

// src/adapters/vue.ts
function isUserFile(file) {
  if (!file) return false;
  return !file.includes("node_modules");
}
function getInstanceFile(instance) {
  var _a2, _b, _c;
  return (_c = (_a2 = instance.type) == null ? void 0 : _a2.__file) != null ? _c : (_b = instance.$options) == null ? void 0 : _b.__file;
}
function getInstanceName(instance) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  return (_h = (_g = (_e = (_c = (_a2 = instance.$options) == null ? void 0 : _a2.name) != null ? _c : (_b = instance.$options) == null ? void 0 : _b.__name) != null ? _e : (_d = instance.type) == null ? void 0 : _d.name) != null ? _g : (_f = instance.type) == null ? void 0 : _f.__name) != null ? _h : "Anonymous";
}
function detect2(el) {
  var _a2;
  let firstMatch = null;
  let node = el;
  while (node && node !== document.documentElement) {
    const instance = (_a2 = node.__vueParentComponent) != null ? _a2 : node.__vue__;
    if (instance) {
      const file = getInstanceFile(instance);
      if (isUserFile(file)) return instance;
      if (!firstMatch) firstMatch = instance;
    }
    node = node.parentElement;
  }
  if (firstMatch == null ? void 0 : firstMatch.parent) {
    let instance = firstMatch.parent;
    while (instance) {
      const file = getInstanceFile(instance);
      if (isUserFile(file)) return instance;
      instance = instance.parent;
    }
  }
  return firstMatch;
}
function getContext2(el) {
  const instance = detect2(el);
  if (!instance) return null;
  const name = getInstanceName(instance);
  const data = {};
  if (instance.props) {
    Object.assign(data, instance.props);
  }
  if (instance.setupState) {
    for (const [key, value] of Object.entries(instance.setupState)) {
      if (!key.startsWith("_") && typeof value !== "function") {
        try {
          data[key] = JSON.parse(JSON.stringify(value));
        } catch (e) {
          data[key] = String(value);
        }
      }
    }
  }
  const file = getInstanceFile(instance);
  return {
    framework: "vue",
    component: name,
    source_file: file,
    component_uid: instance.uid !== void 0 ? String(instance.uid) : void 0,
    data
  };
}

// src/adapters/svelte.ts
function detect3(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    if (node.__svelte_meta) return node.__svelte_meta;
    node = node.parentElement;
  }
  return null;
}
function getContext3(el) {
  var _a2, _b, _c, _d;
  const meta = detect3(el);
  if (!meta) return null;
  const filePath = (_b = (_a2 = meta.loc) == null ? void 0 : _a2.file) != null ? _b : "";
  const component = filePath ? (_d = (_c = filePath.split("/").pop()) == null ? void 0 : _c.replace(/\.svelte$/, "")) != null ? _d : "Unknown" : "Unknown";
  return {
    framework: "svelte",
    component,
    source_file: filePath || void 0,
    data: filePath ? { file: filePath } : void 0
  };
}

// src/adapters/react.ts
function getFiberKey(el) {
  for (const key of Object.keys(el)) {
    if (key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")) {
      return key;
    }
  }
  return null;
}
function isUserSource(source) {
  if (!source) return false;
  return !source.fileName.includes("node_modules");
}
function findComponent(fiber) {
  let firstMatch = null;
  let node = fiber;
  while (node) {
    const { type } = node;
    let name = null;
    if (typeof type === "function" && type.name) {
      const n = type.name;
      if (n[0] === n[0].toUpperCase() && n.length > 1) name = n;
    }
    if (!name && typeof type === "object" && type !== null && type.displayName) {
      name = type.displayName;
    }
    if (name) {
      const info = { name, source: node._debugSource };
      if (isUserSource(node._debugSource)) return info;
      if (!firstMatch) firstMatch = info;
    }
    node = node.return;
  }
  return firstMatch != null ? firstMatch : { name: "Component" };
}
function getProps(fiber) {
  var _a2, _b;
  const props = (_b = (_a2 = fiber.memoizedProps) != null ? _a2 : fiber.pendingProps) != null ? _b : {};
  const result = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === "children" || typeof v === "function") continue;
    try {
      result[k] = JSON.parse(JSON.stringify(v));
    } catch (e) {
      result[k] = String(v);
    }
  }
  return result;
}
function getContext4(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const key = getFiberKey(node);
    if (key) {
      const fiber = node[key];
      if (fiber) {
        const { name, source } = findComponent(fiber);
        const data = getProps(fiber);
        return {
          framework: "react",
          component: name,
          source_file: source == null ? void 0 : source.fileName,
          source_line: source == null ? void 0 : source.lineNumber,
          data
        };
      }
    }
    node = node.parentElement;
  }
  return null;
}

// src/adapters/blade.ts
function getTrackedViews() {
  var _a2;
  const el = document.getElementById("instruckt-views");
  if (!el) return [];
  try {
    return JSON.parse((_a2 = el.textContent) != null ? _a2 : "[]");
  } catch (e) {
    return [];
  }
}
function getContext5(_el) {
  var _a2;
  const views = getTrackedViews();
  if (views.length === 0) return null;
  const pageView = views.length > 1 ? (_a2 = views.find((v) => !v.name.startsWith("layouts.") && !v.name.startsWith("components."))) != null ? _a2 : views[views.length - 1] : views[0];
  return {
    framework: "blade",
    component: pageView.name,
    source_file: pageView.file,
    data: { views: views.map((v) => v.file) }
  };
}

// src/instruckt.ts
function pageKey() {
  return window.location.pathname;
}
var _Instruckt = class _Instruckt {
  constructor(config) {
    this.toolbar = null;
    this.highlight = null;
    this.popup = null;
    this.markers = null;
    this.annotations = [];
    this.isAnnotating = false;
    this.isFrozen = false;
    this.frozenStyleEl = null;
    this.frozenPopovers = [];
    this.rafId = null;
    this.pendingMouseTarget = null;
    this.highlightLocked = false;
    this.pollTimer = null;
    this.boundReposition = () => {
      var _a2;
      (_a2 = this.markers) == null ? void 0 : _a2.reposition(this.annotations);
    };
    this.freezeBlockEvents = ["click", "mousedown", "pointerdown", "pointerup", "mouseup", "touchstart", "touchend", "auxclick"];
    this.freezePassiveEvents = ["focusin", "focusout", "blur", "pointerleave", "mouseleave", "mouseout"];
    /** Block interactions on the page when frozen (except instruckt UI) */
    this.boundFreezeClick = (e) => {
      if (this.isInstruckt(e.target)) return;
      if (this.isAnnotating && e.type === "click") return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    this.boundFreezeSubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    /** Block focus/hover events that JS dropdowns use to auto-close.
     *  Block ALL of these — even on instruckt elements — because frameworks
     *  like Flux check if focusin target is contained in the popover and
     *  close it if it's not (e.g. focus moved to our popup textarea). */
    this.boundFreezePassive = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    // ── Event listeners ───────────────────────────────────────────
    this.boundMouseMove = (e) => {
      if (this.highlightLocked) return;
      this.pendingMouseTarget = e.target;
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => {
          var _a2, _b;
          this.rafId = null;
          if (this.highlightLocked) return;
          if (this.pendingMouseTarget && !this.isInstruckt(this.pendingMouseTarget)) {
            (_a2 = this.highlight) == null ? void 0 : _a2.show(this.pendingMouseTarget);
          } else {
            (_b = this.highlight) == null ? void 0 : _b.hide();
          }
        });
      }
    };
    this.boundMouseLeave = () => {
      var _a2;
      if (this.highlightLocked) return;
      (_a2 = this.highlight) == null ? void 0 : _a2.hide();
    };
    /** Block mousedown/pointerdown in annotation mode so SPA frameworks can't navigate */
    this.boundAnnotateBlock = (e) => {
      if (this.isInstruckt(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    this.boundClick = (e) => {
      var _a2, _b, _c;
      const target = e.target;
      if (this.isInstruckt(target)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const selectedText = ((_a2 = window.getSelection()) == null ? void 0 : _a2.toString().trim()) || void 0;
      const elementPath = getElementSelector(target);
      const elementName = getElementName(target);
      const elementLabel = getElementLabel(target);
      const cssClasses = getCssClasses(target);
      const nearbyText = getNearbyText(target) || void 0;
      const boundingBox = getPageBoundingBox(target);
      const framework = (_b = this.detectFramework(target)) != null ? _b : void 0;
      (_c = this.highlight) == null ? void 0 : _c.show(target);
      this.highlightLocked = true;
      const pending = {
        element: target,
        elementPath,
        elementName,
        elementLabel,
        cssClasses,
        boundingBox,
        x: e.clientX,
        y: e.clientY,
        selectedText,
        nearbyText,
        framework
      };
      this.showAnnotationPopup(pending);
    };
    this.config = __spreadValues({
      adapters: ["livewire", "vue", "svelte", "react", "blade"],
      theme: "auto",
      position: "bottom-right"
    }, config);
    this.api = new InstrucktApi(config.endpoint);
    this.boundKeydown = this.onKeydown.bind(this);
    this.init();
  }
  init() {
    injectGlobalStyles(this.config.colors);
    if (this.config.theme !== "auto") {
      document.documentElement.setAttribute("data-instruckt-theme", this.config.theme);
    }
    this.toolbar = new Toolbar(this.config.position, {
      onToggleAnnotate: (active) => {
        this.setAnnotating(active);
      },
      onFreezeAnimations: (frozen) => {
        this.setFrozen(frozen);
      },
      onScreenshot: () => this.startRegionCapture(),
      onCopy: () => this.copyToClipboard(true),
      onClearPage: () => this.clearPage(),
      onClearAll: () => this.clearEverything(),
      onMinimize: (min) => this.onMinimize(min)
    }, this.config.keys);
    this.highlight = new ElementHighlight();
    this.popup = new AnnotationPopup();
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation));
    document.addEventListener("keydown", this.boundKeydown);
    window.addEventListener("scroll", this.boundReposition, { passive: true });
    window.addEventListener("resize", this.boundReposition, { passive: true });
    document.addEventListener("livewire:navigated", () => this.reattach());
    document.addEventListener("inertia:navigate", () => this.syncMarkers());
    window.addEventListener("popstate", () => {
      setTimeout(() => this.reattach(), 0);
    });
    this.loadAnnotations();
  }
  makeToolbarCallbacks() {
    return {
      onToggleAnnotate: (active) => {
        this.setAnnotating(active);
      },
      onFreezeAnimations: (frozen) => {
        this.setFrozen(frozen);
      },
      onScreenshot: () => this.startRegionCapture(),
      onCopy: () => this.copyToClipboard(true),
      onClearPage: () => this.clearPage(),
      onClearAll: () => this.clearEverything(),
      onMinimize: (min) => this.onMinimize(min)
    };
  }
  reattach() {
    var _a2, _b;
    const wasAnnotating = this.isAnnotating;
    const wasFrozen = this.isFrozen;
    const wasMinimized = (_b = (_a2 = this.toolbar) == null ? void 0 : _a2.isMinimized()) != null ? _b : false;
    if (this.isAnnotating) this.detachAnnotateListeners();
    if (this.isFrozen) this.setFrozen(false);
    this.isAnnotating = false;
    this.isFrozen = false;
    document.querySelectorAll("[data-instruckt]").forEach((el) => el.remove());
    this.toolbar = new Toolbar(this.config.position, this.makeToolbarCallbacks());
    if (wasMinimized) this.toolbar.minimize();
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation));
    this.highlight = new ElementHighlight();
    if (wasMinimized) this.markers.setVisible(false);
    const existing = document.getElementById("instruckt-global");
    if (existing) existing.remove();
    injectGlobalStyles(this.config.colors);
    this.syncMarkers();
    if (wasAnnotating && !wasMinimized) this.setAnnotating(true);
  }
  // ── Minimize ────────────────────────────────────────────────────
  onMinimize(minimized) {
    var _a2, _b, _c, _d, _e;
    if (minimized) {
      if (this.isAnnotating) this.setAnnotating(false);
      if (this.isFrozen) this.setFrozen(false);
      (_a2 = this.toolbar) == null ? void 0 : _a2.setAnnotateActive(false);
      (_b = this.toolbar) == null ? void 0 : _b.setFreezeActive(false);
      (_c = this.markers) == null ? void 0 : _c.setVisible(false);
      (_d = this.popup) == null ? void 0 : _d.destroy();
    } else {
      (_e = this.markers) == null ? void 0 : _e.setVisible(true);
    }
  }
  async loadAnnotations() {
    this.loadFromStorage();
    try {
      const remote = await this.api.getAnnotations();
      const remoteIds = new Set(remote.map((a) => a.id));
      const localOnly = this.annotations.filter((a) => !remoteIds.has(a.id));
      this.annotations = [...remote, ...localOnly];
      this.saveToStorage();
    } catch (e) {
    }
    this.syncMarkers();
  }
  saveToStorage() {
    try {
      localStorage.setItem(_Instruckt.STORAGE_KEY, JSON.stringify(this.annotations));
    } catch (e) {
    }
  }
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(_Instruckt.STORAGE_KEY);
      if (raw) this.annotations = JSON.parse(raw);
    } catch (e) {
    }
  }
  /** Start or stop polling based on whether there are active annotations */
  updatePolling() {
    const hasActive = this.totalActiveCount() > 0;
    if (hasActive && !this.pollTimer) {
      this.pollTimer = setInterval(() => this.pollForChanges(), 3e3);
    } else if (!hasActive && this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  /** Poll API for status changes (e.g. agent resolved via MCP) */
  async pollForChanges() {
    try {
      const remote = await this.api.getAnnotations();
      let changed = false;
      for (const r of remote) {
        const local = this.annotations.find((a) => a.id === r.id);
        if (local && local.status !== r.status) {
          local.status = r.status;
          local.resolvedAt = r.resolvedAt;
          local.resolvedBy = r.resolvedBy;
          changed = true;
        }
      }
      if (changed) {
        this.saveToStorage();
      }
      this.syncMarkers();
    } catch (e) {
    }
  }
  // ── Page-scoped markers ─────────────────────────────────────────
  syncMarkers() {
    var _a2, _b, _c, _d;
    (_a2 = this.markers) == null ? void 0 : _a2.clear();
    const current = pageKey();
    let idx = 0;
    for (const a of this.annotations) {
      if (a.status === "resolved" || a.status === "dismissed") continue;
      if (this.annotationPageKey(a) === current) {
        idx++;
        (_b = this.markers) == null ? void 0 : _b.upsert(a, idx);
      }
    }
    (_c = this.toolbar) == null ? void 0 : _c.setAnnotationCount(this.pageAnnotations().length);
    (_d = this.toolbar) == null ? void 0 : _d.setTotalCount(this.totalActiveCount());
    this.updatePolling();
  }
  annotationPageKey(a) {
    try {
      return new URL(a.url).pathname;
    } catch (e) {
      return a.url;
    }
  }
  pageAnnotations() {
    const current = pageKey();
    return this.annotations.filter(
      (a) => this.annotationPageKey(a) === current && a.status !== "resolved" && a.status !== "dismissed"
    );
  }
  totalActiveCount() {
    return this.annotations.filter((a) => a.status !== "resolved" && a.status !== "dismissed").length;
  }
  // ── Annotate mode ─────────────────────────────────────────────
  setAnnotating(active) {
    var _a2, _b;
    this.isAnnotating = active;
    (_a2 = this.toolbar) == null ? void 0 : _a2.setAnnotateActive(active);
    if (active) {
      this.attachAnnotateListeners();
    } else {
      this.detachAnnotateListeners();
      (_b = this.highlight) == null ? void 0 : _b.hide();
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
    this.updateFreezeStyles();
  }
  // ── Freeze mode ──────────────────────────────────────────────
  setFrozen(frozen) {
    var _a2, _b;
    this.isFrozen = frozen;
    (_a2 = this.toolbar) == null ? void 0 : _a2.setFreezeActive(frozen);
    if (frozen) {
      this.updateFreezeStyles();
      this.freezePopovers();
      for (const evt of this.freezeBlockEvents) {
        window.addEventListener(evt, this.boundFreezeClick, true);
      }
      window.addEventListener("submit", this.boundFreezeSubmit, true);
      for (const evt of this.freezePassiveEvents) {
        window.addEventListener(evt, this.boundFreezePassive, true);
      }
    } else {
      (_b = this.frozenStyleEl) == null ? void 0 : _b.remove();
      this.frozenStyleEl = null;
      this.unfreezePopovers();
      for (const evt of this.freezeBlockEvents) {
        window.removeEventListener(evt, this.boundFreezeClick, true);
      }
      window.removeEventListener("submit", this.boundFreezeSubmit, true);
      for (const evt of this.freezePassiveEvents) {
        window.removeEventListener(evt, this.boundFreezePassive, true);
      }
    }
  }
  /** Pull open popovers out of the top layer so the rest of the page is clickable */
  freezePopovers() {
    this.frozenPopovers = [];
    const openSelector = ":popover-open, .\\:popover-open";
    document.querySelectorAll("[popover]").forEach((el) => {
      var _a2;
      const htmlEl = el;
      const val = (_a2 = htmlEl.getAttribute("popover")) != null ? _a2 : "";
      let isOpen = false;
      try {
        isOpen = htmlEl.matches(openSelector);
      } catch (e) {
        try {
          isOpen = htmlEl.matches(".\\:popover-open");
        } catch (e2) {
        }
      }
      if (!isOpen) return;
      const rect = htmlEl.getBoundingClientRect();
      this.frozenPopovers.push({ el: htmlEl, original: val });
      htmlEl.removeAttribute("popover");
      htmlEl.style.setProperty("display", "block", "important");
      htmlEl.style.setProperty("position", "fixed", "important");
      htmlEl.style.setProperty("z-index", "2147483644", "important");
      htmlEl.style.setProperty("top", `${rect.top}px`, "important");
      htmlEl.style.setProperty("left", `${rect.left}px`, "important");
      htmlEl.style.setProperty("width", `${rect.width}px`, "important");
      htmlEl.classList.add(":popover-open");
    });
  }
  /** Restore popover attributes */
  unfreezePopovers() {
    for (const { el, original } of this.frozenPopovers) {
      for (const prop of ["display", "position", "z-index", "top", "left", "width"]) {
        el.style.removeProperty(prop);
      }
      el.classList.remove(":popover-open");
      el.setAttribute("popover", original || "auto");
    }
    this.frozenPopovers = [];
  }
  /** Update freeze CSS — pointer-events only blocked when NOT annotating */
  updateFreezeStyles() {
    var _a2;
    if (!this.isFrozen) return;
    (_a2 = this.frozenStyleEl) == null ? void 0 : _a2.remove();
    this.frozenStyleEl = document.createElement("style");
    this.frozenStyleEl.id = "instruckt-freeze";
    const pointerBlock = this.isAnnotating ? "" : `
        a[href], a[wire\\:navigate], [wire\\:click], [wire\\:navigate],
        [x-on\\:click], [@click], [v-on\\:click], [onclick],
        button, input[type="submit"], select, [role="button"], [role="link"],
        [tabindex] {
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
      `;
    this.frozenStyleEl.textContent = `
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
        video { filter: none !important; }
        ${pointerBlock}
      `;
    document.head.appendChild(this.frozenStyleEl);
  }
  showAnnotationPopup(pending) {
    var _a2;
    (_a2 = this.popup) == null ? void 0 : _a2.showNew(pending, {
      onSubmit: (result) => {
        var _a3;
        this.highlightLocked = false;
        (_a3 = this.highlight) == null ? void 0 : _a3.hide();
        this.submitAnnotation(pending, result.comment, result.screenshot);
      },
      onCancel: () => {
        var _a3;
        this.highlightLocked = false;
        (_a3 = this.highlight) == null ? void 0 : _a3.hide();
      }
    });
  }
  attachAnnotateListeners() {
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseleave", this.boundMouseLeave);
    for (const evt of ["mousedown", "pointerdown"]) {
      window.addEventListener(evt, this.boundAnnotateBlock, true);
    }
    window.addEventListener("click", this.boundClick, true);
  }
  detachAnnotateListeners() {
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseleave", this.boundMouseLeave);
    for (const evt of ["mousedown", "pointerdown"]) {
      window.removeEventListener(evt, this.boundAnnotateBlock, true);
    }
    window.removeEventListener("click", this.boundClick, true);
  }
  isInstruckt(el) {
    if (!el || !(el instanceof Element)) return false;
    return el.closest("[data-instruckt]") !== null;
  }
  // ── Region screenshot ────────────────────────────────────────
  async startRegionCapture() {
    var _a2, _b;
    const wasAnnotating = this.isAnnotating;
    if (wasAnnotating) this.setAnnotating(false);
    const rect = await selectRegion();
    if (!rect) {
      if (wasAnnotating) this.setAnnotating(true);
      return;
    }
    const screenshot = await captureRegion(rect);
    if (!screenshot) {
      if (wasAnnotating) this.setAnnotating(true);
      return;
    }
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const target = (_a2 = document.elementFromPoint(centerX, centerY)) != null ? _a2 : document.body;
    const pending = {
      element: target,
      elementPath: getElementSelector(target),
      elementName: getElementName(target),
      elementLabel: getElementLabel(target),
      cssClasses: getCssClasses(target),
      boundingBox: getPageBoundingBox(target),
      x: centerX,
      y: centerY,
      nearbyText: getNearbyText(target) || void 0,
      screenshot,
      framework: (_b = this.detectFramework(target)) != null ? _b : void 0
    };
    this.showAnnotationPopup(pending);
  }
  // ── Framework detection ───────────────────────────────────────
  detectFramework(el) {
    var _a2;
    const adapters = (_a2 = this.config.adapters) != null ? _a2 : [];
    if (adapters.includes("livewire")) {
      const ctx = getContext(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("vue")) {
      const ctx = getContext2(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("svelte")) {
      const ctx = getContext3(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("react")) {
      const ctx = getContext4(el);
      if (ctx) return ctx;
    }
    if (adapters.includes("blade")) {
      const ctx = getContext5(el);
      if (ctx) return ctx;
    }
    return null;
  }
  // ── Submit ────────────────────────────────────────────────────
  async submitAnnotation(pending, comment, screenshot) {
    var _a2, _b;
    const payload = {
      x: pending.x / window.innerWidth * 100,
      y: pending.y + window.scrollY,
      comment,
      element: pending.elementName,
      elementPath: pending.elementPath,
      cssClasses: pending.cssClasses,
      boundingBox: pending.boundingBox,
      selectedText: pending.selectedText,
      nearbyText: pending.nearbyText,
      screenshot,
      intent: "fix",
      severity: "important",
      framework: pending.framework,
      url: window.location.href
    };
    let annotation;
    try {
      annotation = await this.api.addAnnotation(payload);
    } catch (e) {
      annotation = __spreadProps(__spreadValues({}, payload), {
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    this.annotations.push(annotation);
    this.saveToStorage();
    this.syncMarkers();
    (_b = (_a2 = this.config).onAnnotationAdd) == null ? void 0 : _b.call(_a2, annotation);
    this.copyAnnotations();
  }
  // ── Marker click — edit or delete ─────────────────────────────
  onMarkerClick(annotation) {
    var _a2;
    (_a2 = this.popup) == null ? void 0 : _a2.showEdit(annotation, {
      onSave: async (a, newComment) => {
        try {
          const updated = await this.api.updateAnnotation(a.id, { comment: newComment });
          this.onAnnotationUpdated(updated);
        } catch (e) {
          this.onAnnotationUpdated(__spreadProps(__spreadValues({}, a), { comment: newComment, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }));
        }
      },
      onDelete: async (a) => {
        try {
          await this.api.updateAnnotation(a.id, { status: "dismissed" });
        } catch (e) {
        }
        this.removeAnnotation(a.id);
      }
    }, this.config.endpoint);
  }
  onAnnotationUpdated(updated) {
    const idx = this.annotations.findIndex((a) => a.id === updated.id);
    if (idx >= 0) {
      this.annotations[idx] = updated;
    }
    this.saveToStorage();
    this.syncMarkers();
  }
  removeAnnotation(id) {
    this.annotations = this.annotations.filter((a) => a.id !== id);
    this.saveToStorage();
    this.syncMarkers();
  }
  // ── Clear ───────────────────────────────────────────────────────
  async clearPage() {
    const page = this.pageAnnotations();
    for (const a of page) {
      try {
        await this.api.updateAnnotation(a.id, { status: "dismissed" });
      } catch (e) {
      }
    }
    this.annotations = this.annotations.filter((a) => !page.includes(a));
    this.saveToStorage();
    this.syncMarkers();
  }
  async clearEverything() {
    const active = this.annotations.filter((a) => a.status !== "resolved" && a.status !== "dismissed");
    for (const a of active) {
      try {
        await this.api.updateAnnotation(a.id, { status: "dismissed" });
      } catch (e) {
      }
    }
    this.annotations = [];
    this.saveToStorage();
    this.syncMarkers();
  }
  // ── Keyboard ──────────────────────────────────────────────────
  onKeydown(e) {
    var _a2, _b, _c, _d, _e, _f;
    if ((_a2 = this.toolbar) == null ? void 0 : _a2.isMinimized()) return;
    const target = e.target;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    if (target.closest('[contenteditable="true"]')) return;
    if (this.isInstruckt(target)) return;
    const keys = (_b = this.config.keys) != null ? _b : {};
    const noMod = !e.metaKey && !e.ctrlKey && !e.altKey;
    if (e.key === ((_c = keys.annotate) != null ? _c : "a") && noMod) {
      this.setAnnotating(!this.isAnnotating);
    }
    if (e.key === ((_d = keys.freeze) != null ? _d : "f") && noMod) {
      this.setFrozen(!this.isFrozen);
    }
    if (e.key === ((_e = keys.screenshot) != null ? _e : "c") && noMod) {
      this.startRegionCapture();
    }
    if (e.key === ((_f = keys.clearPage) != null ? _f : "x") && noMod) {
      this.clearPage();
    }
    if (e.key === "Escape") {
      if (this.isAnnotating) this.setAnnotating(false);
      if (this.isFrozen) this.setFrozen(false);
    }
  }
  // ── Copy / export ─────────────────────────────────────────────
  /** Auto-copy on annotation submit — only in secure contexts to avoid focus side-effects */
  copyAnnotations() {
    this.copyToClipboard(false);
  }
  /** Copy to clipboard. With fallback=true, uses execCommand for non-secure contexts (user-initiated only). */
  copyToClipboard(fallback) {
    const md = this.exportMarkdown();
    if (window.isSecureContext) {
      navigator.clipboard.writeText(md).catch(() => {
      });
    } else if (fallback) {
      try {
        const el = document.createElement("textarea");
        el.value = md;
        el.style.cssText = "position:fixed;left:-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        el.remove();
      } catch (e) {
      }
    }
  }
  exportMarkdown() {
    const pending = this.annotations.filter((a) => a.status !== "resolved" && a.status !== "dismissed");
    if (pending.length === 0) {
      return `# UI Feedback

No open annotations.`;
    }
    const byPage = /* @__PURE__ */ new Map();
    for (const a of pending) {
      const key = this.annotationPageKey(a);
      if (!byPage.has(key)) byPage.set(key, []);
      byPage.get(key).push(a);
    }
    const multiPage = byPage.size > 1;
    const lines = [];
    if (multiPage) {
      lines.push(`# UI Feedback`);
      lines.push("");
    }
    for (const [path, annotations] of byPage) {
      if (multiPage) {
        lines.push(`## ${path}`);
      } else {
        lines.push(`# UI Feedback: ${path}`);
      }
      lines.push("");
      const hPrefix = multiPage ? "###" : "##";
      annotations.forEach((a, i) => {
        var _a2, _b, _c, _d;
        const componentSuffix = ((_a2 = a.framework) == null ? void 0 : _a2.component) ? ` in \`${a.framework.component}\`` : "";
        lines.push(`${hPrefix} ${i + 1}. ${a.comment}`);
        lines.push(`- ID: \`${a.id}\``);
        lines.push(`- Element: \`${a.element}\`${componentSuffix}`);
        if ((_b = a.framework) == null ? void 0 : _b.source_file) {
          const loc = a.framework.source_line ? `${a.framework.source_file}:${a.framework.source_line}` : a.framework.source_file;
          lines.push(`- Source: \`${loc}\``);
        } else if ((_d = (_c = a.framework) == null ? void 0 : _c.data) == null ? void 0 : _d.file) {
          lines.push(`- File: \`${a.framework.data.file}\``);
        }
        if (a.cssClasses) {
          lines.push(`- Classes: \`${a.cssClasses}\``);
        }
        if (a.selectedText) {
          lines.push(`- Text: "${a.selectedText}"`);
        } else if (a.nearbyText) {
          lines.push(`- Text: "${a.nearbyText.slice(0, 100)}"`);
        }
        if (a.screenshot) {
          if (!a.screenshot.startsWith("data:")) {
            lines.push(`- Screenshot: \`storage/app/_instruckt/${a.screenshot}\``);
          } else {
            lines.push(`- Screenshot: attached`);
          }
        }
        lines.push("");
      });
    }
    const hasScreenshots = pending.some((a) => a.screenshot && !a.screenshot.startsWith("data:"));
    lines.push("---");
    lines.push("");
    if (hasScreenshots) {
      lines.push("Use the `instruckt.get_screenshot` MCP tool to view screenshots. After making changes, use `instruckt.resolve` to mark each annotation as resolved.");
    } else {
      lines.push("After making changes, use the `instruckt.resolve` MCP tool to mark each annotation as resolved.");
    }
    return lines.join("\n").trim();
  }
  // ── Public API ────────────────────────────────────────────────
  getAnnotations() {
    return [...this.annotations];
  }
  destroy() {
    var _a2, _b, _c, _d;
    this.setAnnotating(false);
    this.setFrozen(false);
    document.removeEventListener("keydown", this.boundKeydown);
    window.removeEventListener("scroll", this.boundReposition);
    window.removeEventListener("resize", this.boundReposition);
    (_a2 = this.toolbar) == null ? void 0 : _a2.destroy();
    (_b = this.highlight) == null ? void 0 : _b.destroy();
    (_c = this.popup) == null ? void 0 : _c.destroy();
    (_d = this.markers) == null ? void 0 : _d.destroy();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.pollTimer !== null) clearInterval(this.pollTimer);
  }
};
// ── Persistence ─────────────────────────────────────────────────
_Instruckt.STORAGE_KEY = "instruckt:annotations";
var Instruckt = _Instruckt;

// src/index.ts
function init(config) {
  return new Instruckt(config);
}
//# sourceMappingURL=instruckt.cjs.js.map