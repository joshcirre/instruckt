var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
    var _a, _b, _c, _d, _e;
    this.host = document.createElement("div");
    this.host.setAttribute("data-instruckt", "toolbar");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = TOOLBAR_CSS;
    this.shadow.appendChild(style);
    this.toolbarEl = document.createElement("div");
    this.toolbarEl.className = "toolbar";
    const k = this.keys;
    this.annotateBtn = this.makeBtn(ICONS.annotate, `Annotate elements (${((_a = k.annotate) != null ? _a : "A").toUpperCase()})`, () => {
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
      var _a2, _b2;
      (_b2 = (_a2 = this.callbacks).onClearPage) == null ? void 0 : _b2.call(_a2);
    });
    clearBtn.classList.add("danger-btn");
    const clearAllBtn = this.makeBtn(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      "Delete all instructions.",
      () => {
        var _a2, _b2;
        return (_b2 = (_a2 = this.callbacks).onClearAll) == null ? void 0 : _b2.call(_a2);
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
    var _a, _b;
    this.minimized = min;
    this.toolbarEl.style.display = min ? "none" : "";
    this.fab.style.display = min ? "" : "none";
    this.updateFabBadge();
    (_b = (_a = this.callbacks).onMinimize) == null ? void 0 : _b.call(_a, min);
  }
  updateFabBadge() {
    var _a;
    if (this.totalCount > 0 && this.minimized) {
      if (!this.fabBadge) {
        this.fabBadge = document.createElement("span");
        this.fabBadge.className = "fab-badge";
        this.fab.appendChild(this.fabBadge);
      }
      this.fabBadge.textContent = this.totalCount > 99 ? "99+" : String(this.totalCount);
    } else {
      (_a = this.fabBadge) == null ? void 0 : _a.remove();
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
    var _a;
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
    const root = (_a = document.getElementById("instruckt-root")) != null ? _a : document.body;
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

// node_modules/html-to-image/es/util.js
function resolveUrl(url, baseUrl) {
  if (url.match(/^[a-z]+:\/\//i)) {
    return url;
  }
  if (url.match(/^\/\//)) {
    return window.location.protocol + url;
  }
  if (url.match(/^[a-z]+:/i)) {
    return url;
  }
  const doc = document.implementation.createHTMLDocument();
  const base = doc.createElement("base");
  const a = doc.createElement("a");
  doc.head.appendChild(base);
  doc.body.appendChild(a);
  if (baseUrl) {
    base.href = baseUrl;
  }
  a.href = url;
  return a.href;
}
var uuid = /* @__PURE__ */ (() => {
  let counter = 0;
  const random = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => {
    counter += 1;
    return `u${random()}${counter}`;
  };
})();
function toArray(arrayLike) {
  const arr = [];
  for (let i = 0, l = arrayLike.length; i < l; i++) {
    arr.push(arrayLike[i]);
  }
  return arr;
}
var styleProps = null;
function getStyleProperties(options = {}) {
  if (styleProps) {
    return styleProps;
  }
  if (options.includeStyleProperties) {
    styleProps = options.includeStyleProperties;
    return styleProps;
  }
  styleProps = toArray(window.getComputedStyle(document.documentElement));
  return styleProps;
}
function px(node, styleProperty) {
  const win = node.ownerDocument.defaultView || window;
  const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
  return val ? parseFloat(val.replace("px", "")) : 0;
}
function getNodeWidth(node) {
  const leftBorder = px(node, "border-left-width");
  const rightBorder = px(node, "border-right-width");
  return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
  const topBorder = px(node, "border-top-width");
  const bottomBorder = px(node, "border-bottom-width");
  return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
  const width = options.width || getNodeWidth(targetNode);
  const height = options.height || getNodeHeight(targetNode);
  return { width, height };
}
function getPixelRatio() {
  let ratio;
  let FINAL_PROCESS;
  try {
    FINAL_PROCESS = process;
  } catch (e) {
  }
  const val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
  if (val) {
    ratio = parseInt(val, 10);
    if (Number.isNaN(ratio)) {
      ratio = 1;
    }
  }
  return ratio || window.devicePixelRatio || 1;
}
var canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
  if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
    if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
      if (canvas.width > canvas.height) {
        canvas.height *= canvasDimensionLimit / canvas.width;
        canvas.width = canvasDimensionLimit;
      } else {
        canvas.width *= canvasDimensionLimit / canvas.height;
        canvas.height = canvasDimensionLimit;
      }
    } else if (canvas.width > canvasDimensionLimit) {
      canvas.height *= canvasDimensionLimit / canvas.width;
      canvas.width = canvasDimensionLimit;
    } else {
      canvas.width *= canvasDimensionLimit / canvas.height;
      canvas.height = canvasDimensionLimit;
    }
  }
}
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      img.decode().then(() => {
        requestAnimationFrame(() => resolve(img));
      });
    };
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.src = url;
  });
}
async function svgToDataURL(svg) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(svg)).then(encodeURIComponent).then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.setAttribute("x", "0");
  foreignObject.setAttribute("y", "0");
  foreignObject.setAttribute("externalResourcesRequired", "true");
  svg.appendChild(foreignObject);
  foreignObject.appendChild(node);
  return svgToDataURL(svg);
}
var isInstanceOfElement = (node, instance) => {
  if (node instanceof instance)
    return true;
  const nodePrototype = Object.getPrototypeOf(node);
  if (nodePrototype === null)
    return false;
  return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
};

// node_modules/html-to-image/es/clone-pseudos.js
function formatCSSText(style) {
  const content = style.getPropertyValue("content");
  return `${style.cssText} content: '${content.replace(/'|"/g, "")}';`;
}
function formatCSSProperties(style, options) {
  return getStyleProperties(options).map((name) => {
    const value = style.getPropertyValue(name);
    const priority = style.getPropertyPriority(name);
    return `${name}: ${value}${priority ? " !important" : ""};`;
  }).join(" ");
}
function getPseudoElementStyle(className, pseudo, style, options) {
  const selector = `.${className}:${pseudo}`;
  const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
  return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
  const style = window.getComputedStyle(nativeNode, pseudo);
  const content = style.getPropertyValue("content");
  if (content === "" || content === "none") {
    return;
  }
  const className = uuid();
  try {
    clonedNode.className = `${clonedNode.className} ${className}`;
  } catch (err) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
  clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode, options) {
  clonePseudoElement(nativeNode, clonedNode, ":before", options);
  clonePseudoElement(nativeNode, clonedNode, ":after", options);
}

// node_modules/html-to-image/es/mimes.js
var WOFF = "application/font-woff";
var JPEG = "image/jpeg";
var mimes = {
  woff: WOFF,
  woff2: WOFF,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: JPEG,
  jpeg: JPEG,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function getExtension(url) {
  const match = /\.([^./]*?)$/g.exec(url);
  return match ? match[1] : "";
}
function getMimeType(url) {
  const extension = getExtension(url).toLowerCase();
  return mimes[extension] || "";
}

// node_modules/html-to-image/es/dataurl.js
function getContentFromDataUrl(dataURL) {
  return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
  return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
  return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init2, process2) {
  const res = await fetch(url, init2);
  if (res.status === 404) {
    throw new Error(`Resource "${res.url}" not found`);
  }
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      try {
        resolve(process2({ res, result: reader.result }));
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(blob);
  });
}
var cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
  let key = url.replace(/\?.*/, "");
  if (includeQueryParams) {
    key = url;
  }
  if (/ttf|otf|eot|woff2?/i.test(key)) {
    key = key.replace(/.*\//, "");
  }
  return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
  const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
  if (cache[cacheKey] != null) {
    return cache[cacheKey];
  }
  if (options.cacheBust) {
    resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
  }
  let dataURL;
  try {
    const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
      if (!contentType) {
        contentType = res.headers.get("Content-Type") || "";
      }
      return getContentFromDataUrl(result);
    });
    dataURL = makeDataUrl(content, contentType);
  } catch (error) {
    dataURL = options.imagePlaceholder || "";
    let msg = `Failed to fetch resource: ${resourceUrl}`;
    if (error) {
      msg = typeof error === "string" ? error : error.message;
    }
    if (msg) {
      console.warn(msg);
    }
  }
  cache[cacheKey] = dataURL;
  return dataURL;
}

// node_modules/html-to-image/es/clone-node.js
async function cloneCanvasElement(canvas) {
  const dataURL = canvas.toDataURL();
  if (dataURL === "data:,") {
    return canvas.cloneNode(false);
  }
  return createImage(dataURL);
}
async function cloneVideoElement(video, options) {
  if (video.currentSrc) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL2 = canvas.toDataURL();
    return createImage(dataURL2);
  }
  const poster = video.poster;
  const contentType = getMimeType(poster);
  const dataURL = await resourceToDataURL(poster, contentType, options);
  return createImage(dataURL);
}
async function cloneIFrameElement(iframe, options) {
  var _a;
  try {
    if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
      return await cloneNode(iframe.contentDocument.body, options, true);
    }
  } catch (_b) {
  }
  return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
  if (isInstanceOfElement(node, HTMLCanvasElement)) {
    return cloneCanvasElement(node);
  }
  if (isInstanceOfElement(node, HTMLVideoElement)) {
    return cloneVideoElement(node, options);
  }
  if (isInstanceOfElement(node, HTMLIFrameElement)) {
    return cloneIFrameElement(node, options);
  }
  return node.cloneNode(isSVGElement(node));
}
var isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
var isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SVG";
async function cloneChildren(nativeNode, clonedNode, options) {
  var _a, _b;
  if (isSVGElement(clonedNode)) {
    return clonedNode;
  }
  let children = [];
  if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
    children = toArray(nativeNode.assignedNodes());
  } else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
    children = toArray(nativeNode.contentDocument.body.childNodes);
  } else {
    children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
  }
  if (children.length === 0 || isInstanceOfElement(nativeNode, HTMLVideoElement)) {
    return clonedNode;
  }
  await children.reduce((deferred, child) => deferred.then(() => cloneNode(child, options)).then((clonedChild) => {
    if (clonedChild) {
      clonedNode.appendChild(clonedChild);
    }
  }), Promise.resolve());
  return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode, options) {
  const targetStyle = clonedNode.style;
  if (!targetStyle) {
    return;
  }
  const sourceStyle = window.getComputedStyle(nativeNode);
  if (sourceStyle.cssText) {
    targetStyle.cssText = sourceStyle.cssText;
    targetStyle.transformOrigin = sourceStyle.transformOrigin;
  } else {
    getStyleProperties(options).forEach((name) => {
      let value = sourceStyle.getPropertyValue(name);
      if (name === "font-size" && value.endsWith("px")) {
        const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
        value = `${reducedFont}px`;
      }
      if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
        value = "block";
      }
      if (name === "d" && clonedNode.getAttribute("d")) {
        value = `path(${clonedNode.getAttribute("d")})`;
      }
      targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
    });
  }
}
function cloneInputValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) {
    clonedNode.innerHTML = nativeNode.value;
  }
  if (isInstanceOfElement(nativeNode, HTMLInputElement)) {
    clonedNode.setAttribute("value", nativeNode.value);
  }
}
function cloneSelectValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
    const clonedSelect = clonedNode;
    const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute("value"));
    if (selectedOption) {
      selectedOption.setAttribute("selected", "");
    }
  }
}
function decorate(nativeNode, clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    cloneCSSStyle(nativeNode, clonedNode, options);
    clonePseudoElements(nativeNode, clonedNode, options);
    cloneInputValue(nativeNode, clonedNode);
    cloneSelectValue(nativeNode, clonedNode);
  }
  return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
  const uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
  if (uses.length === 0) {
    return clone;
  }
  const processedDefs = {};
  for (let i = 0; i < uses.length; i++) {
    const use = uses[i];
    const id = use.getAttribute("xlink:href");
    if (id) {
      const exist = clone.querySelector(id);
      const definition = document.querySelector(id);
      if (!exist && definition && !processedDefs[id]) {
        processedDefs[id] = await cloneNode(definition, options, true);
      }
    }
  }
  const nodes = Object.values(processedDefs);
  if (nodes.length) {
    const ns = "http://www.w3.org/1999/xhtml";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("xmlns", ns);
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.overflow = "hidden";
    svg.style.display = "none";
    const defs = document.createElementNS(ns, "defs");
    svg.appendChild(defs);
    for (let i = 0; i < nodes.length; i++) {
      defs.appendChild(nodes[i]);
    }
    clone.appendChild(svg);
  }
  return clone;
}
async function cloneNode(node, options, isRoot) {
  if (!isRoot && options.filter && !options.filter(node)) {
    return null;
  }
  return Promise.resolve(node).then((clonedNode) => cloneSingleNode(clonedNode, options)).then((clonedNode) => cloneChildren(node, clonedNode, options)).then((clonedNode) => decorate(node, clonedNode, options)).then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}

// node_modules/html-to-image/es/embed-resources.js
var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
}
function parseURLs(cssText) {
  const urls = [];
  cssText.replace(URL_REGEX, (raw, quotation, url) => {
    urls.push(url);
    return raw;
  });
  return urls.filter((url) => !isDataUrl(url));
}
async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
  try {
    const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
    const contentType = getMimeType(resourceURL);
    let dataURL;
    if (getContentFromUrl) {
      const content = await getContentFromUrl(resolvedURL);
      dataURL = makeDataUrl(content, contentType);
    } else {
      dataURL = await resourceToDataURL(resolvedURL, contentType, options);
    }
    return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
  } catch (error) {
  }
  return cssText;
}
function filterPreferredFontFormat(str, { preferredFontFormat }) {
  return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, (match) => {
    while (true) {
      const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
      if (!format) {
        return "";
      }
      if (format === preferredFontFormat) {
        return `src: ${src};`;
      }
    }
  });
}
function shouldEmbed(url) {
  return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
  if (!shouldEmbed(cssText)) {
    return cssText;
  }
  const filteredCSSText = filterPreferredFontFormat(cssText, options);
  const urls = parseURLs(filteredCSSText);
  return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}

// node_modules/html-to-image/es/embed-images.js
async function embedProp(propName, node, options) {
  var _a;
  const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
  if (propValue) {
    const cssString = await embedResources(propValue, null, options);
    node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
    return true;
  }
  return false;
}
async function embedBackground(clonedNode, options) {
  ;
  await embedProp("background", clonedNode, options) || await embedProp("background-image", clonedNode, options);
  await embedProp("mask", clonedNode, options) || await embedProp("-webkit-mask", clonedNode, options) || await embedProp("mask-image", clonedNode, options) || await embedProp("-webkit-mask-image", clonedNode, options);
}
async function embedImageNode(clonedNode, options) {
  const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
  if (!(isImageElement && !isDataUrl(clonedNode.src)) && !(isInstanceOfElement(clonedNode, SVGImageElement) && !isDataUrl(clonedNode.href.baseVal))) {
    return;
  }
  const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
  const dataURL = await resourceToDataURL(url, getMimeType(url), options);
  await new Promise((resolve, reject) => {
    clonedNode.onload = resolve;
    clonedNode.onerror = options.onImageErrorHandler ? (...attributes) => {
      try {
        resolve(options.onImageErrorHandler(...attributes));
      } catch (error) {
        reject(error);
      }
    } : reject;
    const image = clonedNode;
    if (image.decode) {
      image.decode = resolve;
    }
    if (image.loading === "lazy") {
      image.loading = "eager";
    }
    if (isImageElement) {
      clonedNode.srcset = "";
      clonedNode.src = dataURL;
    } else {
      clonedNode.href.baseVal = dataURL;
    }
  });
}
async function embedChildren(clonedNode, options) {
  const children = toArray(clonedNode.childNodes);
  const deferreds = children.map((child) => embedImages(child, options));
  await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    await embedBackground(clonedNode, options);
    await embedImageNode(clonedNode, options);
    await embedChildren(clonedNode, options);
  }
}

// node_modules/html-to-image/es/apply-style.js
function applyStyle(node, options) {
  const { style } = node;
  if (options.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  if (options.width) {
    style.width = `${options.width}px`;
  }
  if (options.height) {
    style.height = `${options.height}px`;
  }
  const manual = options.style;
  if (manual != null) {
    Object.keys(manual).forEach((key) => {
      style[key] = manual[key];
    });
  }
  return node;
}

// node_modules/html-to-image/es/embed-webfonts.js
var cssFetchCache = {};
async function fetchCSS(url) {
  let cache2 = cssFetchCache[url];
  if (cache2 != null) {
    return cache2;
  }
  const res = await fetch(url);
  const cssText = await res.text();
  cache2 = { url, cssText };
  cssFetchCache[url] = cache2;
  return cache2;
}
async function embedFonts(data, options) {
  let cssText = data.cssText;
  const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
  const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
  const loadFonts = fontLocs.map(async (loc) => {
    let url = loc.replace(regexUrl, "$1");
    if (!url.startsWith("https://")) {
      url = new URL(url, data.url).href;
    }
    return fetchAsDataURL(url, options.fetchRequestInit, ({ result }) => {
      cssText = cssText.replace(loc, `url(${result})`);
      return [loc, result];
    });
  });
  return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
  if (source == null) {
    return [];
  }
  const result = [];
  const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
  let cssText = source.replace(commentsRegex, "");
  const keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  while (true) {
    const matches = keyframesRegex.exec(cssText);
    if (matches === null) {
      break;
    }
    result.push(matches[0]);
  }
  cssText = cssText.replace(keyframesRegex, "");
  const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
  const combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
  const unifiedRegex = new RegExp(combinedCSSRegex, "gi");
  while (true) {
    let matches = importRegex.exec(cssText);
    if (matches === null) {
      matches = unifiedRegex.exec(cssText);
      if (matches === null) {
        break;
      } else {
        importRegex.lastIndex = unifiedRegex.lastIndex;
      }
    } else {
      unifiedRegex.lastIndex = importRegex.lastIndex;
    }
    result.push(matches[0]);
  }
  return result;
}
async function getCSSRules(styleSheets, options) {
  const ret = [];
  const deferreds = [];
  styleSheets.forEach((sheet) => {
    if ("cssRules" in sheet) {
      try {
        toArray(sheet.cssRules || []).forEach((item, index) => {
          if (item.type === CSSRule.IMPORT_RULE) {
            let importIndex = index + 1;
            const url = item.href;
            const deferred = fetchCSS(url).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
              try {
                sheet.insertRule(rule, rule.startsWith("@import") ? importIndex += 1 : sheet.cssRules.length);
              } catch (error) {
                console.error("Error inserting rule from remote css", {
                  rule,
                  error
                });
              }
            })).catch((e) => {
              console.error("Error loading remote css", e.toString());
            });
            deferreds.push(deferred);
          }
        });
      } catch (e) {
        const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
        if (sheet.href != null) {
          deferreds.push(fetchCSS(sheet.href).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
            inline.insertRule(rule, inline.cssRules.length);
          })).catch((err) => {
            console.error("Error loading remote stylesheet", err);
          }));
        }
        console.error("Error inlining remote css file", e);
      }
    }
  });
  return Promise.all(deferreds).then(() => {
    styleSheets.forEach((sheet) => {
      if ("cssRules" in sheet) {
        try {
          toArray(sheet.cssRules || []).forEach((item) => {
            ret.push(item);
          });
        } catch (e) {
          console.error(`Error while reading CSS rules from ${sheet.href}`, e);
        }
      }
    });
    return ret;
  });
}
function getWebFontRules(cssRules) {
  return cssRules.filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).filter((rule) => shouldEmbed(rule.style.getPropertyValue("src")));
}
async function parseWebFontRules(node, options) {
  if (node.ownerDocument == null) {
    throw new Error("Provided element is not within a Document");
  }
  const styleSheets = toArray(node.ownerDocument.styleSheets);
  const cssRules = await getCSSRules(styleSheets, options);
  return getWebFontRules(cssRules);
}
function normalizeFontFamily(font) {
  return font.trim().replace(/["']/g, "");
}
function getUsedFonts(node) {
  const fonts = /* @__PURE__ */ new Set();
  function traverse(node2) {
    const fontFamily = node2.style.fontFamily || getComputedStyle(node2).fontFamily;
    fontFamily.split(",").forEach((font) => {
      fonts.add(normalizeFontFamily(font));
    });
    Array.from(node2.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child);
      }
    });
  }
  traverse(node);
  return fonts;
}
async function getWebFontCSS(node, options) {
  const rules = await parseWebFontRules(node, options);
  const usedFonts = getUsedFonts(node);
  const cssTexts = await Promise.all(rules.filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily))).map((rule) => {
    const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
    return embedResources(rule.cssText, baseUrl, options);
  }));
  return cssTexts.join("\n");
}
async function embedWebFonts(clonedNode, options) {
  const cssText = options.fontEmbedCSS != null ? options.fontEmbedCSS : options.skipFonts ? null : await getWebFontCSS(clonedNode, options);
  if (cssText) {
    const styleNode = document.createElement("style");
    const sytleContent = document.createTextNode(cssText);
    styleNode.appendChild(sytleContent);
    if (clonedNode.firstChild) {
      clonedNode.insertBefore(styleNode, clonedNode.firstChild);
    } else {
      clonedNode.appendChild(styleNode);
    }
  }
}

// node_modules/html-to-image/es/index.js
async function toSvg(node, options = {}) {
  const { width, height } = getImageSize(node, options);
  const clonedNode = await cloneNode(node, options, true);
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  const datauri = await nodeToDataURL(clonedNode, width, height);
  return datauri;
}
async function toCanvas(node, options = {}) {
  const { width, height } = getImageSize(node, options);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const ratio = options.pixelRatio || getPixelRatio();
  const canvasWidth = options.canvasWidth || width;
  const canvasHeight = options.canvasHeight || height;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  if (!options.skipAutoScale) {
    checkCanvasDimensions(canvas);
  }
  canvas.style.width = `${canvasWidth}`;
  canvas.style.height = `${canvasHeight}`;
  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
async function toPng(node, options = {}) {
  const canvas = await toCanvas(node, options);
  return canvas.toDataURL();
}

// src/ui/screenshot.ts
async function captureElement(el) {
  try {
    return await toPng(el, {
      cacheBust: true,
      pixelRatio: 2,
      skipFonts: true,
      filter: (node) => {
        var _a, _b;
        if ((_a = node.getAttribute) == null ? void 0 : _a.call(node, "data-instruckt")) return false;
        if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
          const href = (_b = node.getAttribute("href")) != null ? _b : "";
          if (href.startsWith("http") && !href.startsWith(window.location.origin)) return false;
        }
        return true;
      }
    });
  } catch (e) {
    return null;
  }
}
async function captureRegion(rect) {
  try {
    const full = await toPng(document.body, {
      cacheBust: true,
      pixelRatio: 2,
      skipFonts: true,
      filter: (node) => {
        var _a, _b;
        if ((_a = node.getAttribute) == null ? void 0 : _a.call(node, "data-instruckt")) return false;
        if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
          const href = (_b = node.getAttribute("href")) != null ? _b : "";
          if (href.startsWith("http") && !href.startsWith(window.location.origin)) return false;
        }
        return true;
      }
    });
    return await cropImage(full, rect);
  } catch (e) {
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
    var _a, _b;
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
    let currentScreenshot = (_a = pending.screenshot) != null ? _a : null;
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
    var _a;
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
    ((_a = document.getElementById("instruckt-root")) != null ? _a : document.body).appendChild(this.host);
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
      var _a, _b;
      if (!this.host) return;
      const w = 340 + 20;
      const h = (_b = (_a = this.host.querySelector(".popup")) == null ? void 0 : _a.getBoundingClientRect().height) != null ? _b : 300;
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
    var _a;
    (_a = this.host) == null ? void 0 : _a.remove();
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
    var _a;
    this.container = document.createElement("div");
    Object.assign(this.container.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "2147483645"
    });
    this.container.setAttribute("data-instruckt", "markers");
    const root = (_a = document.getElementById("instruckt-root")) != null ? _a : document.body;
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
  var _a, _b;
  if (!isAvailable()) return null;
  const wireEl = detect(el);
  if (!wireEl) return null;
  const wireId = wireEl.getAttribute("wire:id");
  let componentName = "Unknown";
  const snapshotAttr = wireEl.getAttribute("wire:snapshot");
  if (snapshotAttr) {
    try {
      const snapshot = JSON.parse(snapshotAttr);
      componentName = (_b = (_a = snapshot == null ? void 0 : snapshot.memo) == null ? void 0 : _a.name) != null ? _b : "Unknown";
    } catch (e) {
    }
  }
  return {
    framework: "livewire",
    component: componentName,
    wire_id: wireId
  };
}

// src/adapters/vue.ts
function detect2(el) {
  var _a;
  let node = el;
  while (node && node !== document.documentElement) {
    const instance = (_a = node.__vueParentComponent) != null ? _a : node.__vue__;
    if (instance) return instance;
    node = node.parentElement;
  }
  return null;
}
function getContext2(el) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const instance = detect2(el);
  if (!instance) return null;
  const name = (_h = (_g = (_e = (_c = (_a = instance.$options) == null ? void 0 : _a.name) != null ? _c : (_b = instance.$options) == null ? void 0 : _b.__name) != null ? _e : (_d = instance.type) == null ? void 0 : _d.name) != null ? _g : (_f = instance.type) == null ? void 0 : _f.__name) != null ? _h : "Anonymous";
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
  return {
    framework: "vue",
    component: name,
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
  var _a, _b, _c, _d;
  const meta = detect3(el);
  if (!meta) return null;
  const filePath = (_b = (_a = meta.loc) == null ? void 0 : _a.file) != null ? _b : "";
  const component = filePath ? (_d = (_c = filePath.split("/").pop()) == null ? void 0 : _c.replace(/\.svelte$/, "")) != null ? _d : "Unknown" : "Unknown";
  return {
    framework: "svelte",
    component,
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
function getComponentName(fiber) {
  let node = fiber;
  while (node) {
    const { type } = node;
    if (typeof type === "function" && type.name) {
      const name = type.name;
      if (name[0] === name[0].toUpperCase() && name.length > 1) return name;
    }
    if (typeof type === "object" && type !== null && type.displayName) {
      return type.displayName;
    }
    node = node.return;
  }
  return "Component";
}
function getProps(fiber) {
  var _a, _b;
  const props = (_b = (_a = fiber.memoizedProps) != null ? _a : fiber.pendingProps) != null ? _b : {};
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
        const component = getComponentName(fiber);
        const data = getProps(fiber);
        return { framework: "react", component, data };
      }
    }
    node = node.parentElement;
  }
  return null;
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
      var _a;
      (_a = this.markers) == null ? void 0 : _a.reposition(this.annotations);
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
          var _a, _b;
          this.rafId = null;
          if (this.highlightLocked) return;
          if (this.pendingMouseTarget && !this.isInstruckt(this.pendingMouseTarget)) {
            (_a = this.highlight) == null ? void 0 : _a.show(this.pendingMouseTarget);
          } else {
            (_b = this.highlight) == null ? void 0 : _b.hide();
          }
        });
      }
    };
    this.boundMouseLeave = () => {
      var _a;
      if (this.highlightLocked) return;
      (_a = this.highlight) == null ? void 0 : _a.hide();
    };
    /** Block mousedown/pointerdown in annotation mode so SPA frameworks can't navigate */
    this.boundAnnotateBlock = (e) => {
      if (this.isInstruckt(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    this.boundClick = (e) => {
      var _a, _b, _c;
      const target = e.target;
      if (this.isInstruckt(target)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const selectedText = ((_a = window.getSelection()) == null ? void 0 : _a.toString().trim()) || void 0;
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
      adapters: ["livewire", "vue", "svelte", "react"],
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
    this.syncMarkers();
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
    var _a, _b;
    const wasAnnotating = this.isAnnotating;
    const wasFrozen = this.isFrozen;
    const wasMinimized = (_b = (_a = this.toolbar) == null ? void 0 : _a.isMinimized()) != null ? _b : false;
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
    var _a, _b, _c, _d, _e;
    if (minimized) {
      if (this.isAnnotating) this.setAnnotating(false);
      if (this.isFrozen) this.setFrozen(false);
      (_a = this.toolbar) == null ? void 0 : _a.setAnnotateActive(false);
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
      if (remote.length > 0) {
        const remoteIds = new Set(remote.map((a) => a.id));
        const localOnly = this.annotations.filter((a) => !remoteIds.has(a.id));
        this.annotations = [...remote, ...localOnly];
        this.saveToStorage();
      }
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
        this.syncMarkers();
      }
    } catch (e) {
    }
  }
  // ── Page-scoped markers ─────────────────────────────────────────
  syncMarkers() {
    var _a, _b, _c, _d;
    (_a = this.markers) == null ? void 0 : _a.clear();
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
    var _a, _b;
    this.isAnnotating = active;
    (_a = this.toolbar) == null ? void 0 : _a.setAnnotateActive(active);
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
    var _a, _b;
    this.isFrozen = frozen;
    (_a = this.toolbar) == null ? void 0 : _a.setFreezeActive(frozen);
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
      var _a;
      const htmlEl = el;
      const val = (_a = htmlEl.getAttribute("popover")) != null ? _a : "";
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
    var _a;
    if (!this.isFrozen) return;
    (_a = this.frozenStyleEl) == null ? void 0 : _a.remove();
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
    var _a;
    (_a = this.popup) == null ? void 0 : _a.showNew(pending, {
      onSubmit: (result) => {
        var _a2;
        this.highlightLocked = false;
        (_a2 = this.highlight) == null ? void 0 : _a2.hide();
        this.submitAnnotation(pending, result.comment, result.screenshot);
      },
      onCancel: () => {
        var _a2;
        this.highlightLocked = false;
        (_a2 = this.highlight) == null ? void 0 : _a2.hide();
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
    var _a, _b;
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
    const target = (_a = document.elementFromPoint(centerX, centerY)) != null ? _a : document.body;
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
    var _a;
    const adapters = (_a = this.config.adapters) != null ? _a : [];
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
    return null;
  }
  // ── Submit ────────────────────────────────────────────────────
  async submitAnnotation(pending, comment, screenshot) {
    var _a, _b;
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
    (_b = (_a = this.config).onAnnotationAdd) == null ? void 0 : _b.call(_a, annotation);
    this.copyAnnotations();
  }
  // ── Marker click — edit or delete ─────────────────────────────
  onMarkerClick(annotation) {
    var _a;
    (_a = this.popup) == null ? void 0 : _a.showEdit(annotation, {
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
    var _a, _b, _c, _d, _e, _f;
    if ((_a = this.toolbar) == null ? void 0 : _a.isMinimized()) return;
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
        var _a, _b, _c;
        const componentSuffix = ((_a = a.framework) == null ? void 0 : _a.component) ? ` in \`${a.framework.component}\`` : "";
        lines.push(`${hPrefix} ${i + 1}. ${a.comment}`);
        lines.push(`- Element: \`${a.element}\`${componentSuffix}`);
        if ((_c = (_b = a.framework) == null ? void 0 : _b.data) == null ? void 0 : _c.file) {
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
    return lines.join("\n").trim();
  }
  // ── Public API ────────────────────────────────────────────────
  getAnnotations() {
    return [...this.annotations];
  }
  destroy() {
    var _a, _b, _c, _d;
    this.setAnnotating(false);
    this.setFrozen(false);
    document.removeEventListener("keydown", this.boundKeydown);
    window.removeEventListener("scroll", this.boundReposition);
    window.removeEventListener("resize", this.boundReposition);
    (_a = this.toolbar) == null ? void 0 : _a.destroy();
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
export {
  Instruckt,
  init
};
//# sourceMappingURL=instruckt.esm.js.map