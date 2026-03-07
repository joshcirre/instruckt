/* instruckt v0.4.14 | MIT */
"use strict";var Instruckt=(()=>{var I=Object.defineProperty,Ut=Object.defineProperties,jt=Object.getOwnPropertyDescriptor,_t=Object.getOwnPropertyDescriptors,Dt=Object.getOwnPropertyNames,ct=Object.getOwnPropertySymbols;var dt=Object.prototype.hasOwnProperty,Vt=Object.prototype.propertyIsEnumerable;var lt=(n,t,e)=>t in n?I(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,O=(n,t)=>{for(var e in t||(t={}))dt.call(t,e)&&lt(n,e,t[e]);if(ct)for(var e of ct(t))Vt.call(t,e)&&lt(n,e,t[e]);return n},q=(n,t)=>Ut(n,_t(t));var qt=(n,t)=>{for(var e in t)I(n,e,{get:t[e],enumerable:!0})},Wt=(n,t,e,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Dt(t))!dt.call(n,i)&&i!==e&&I(n,i,{get:()=>t[i],enumerable:!(o=jt(t,i))||o.enumerable});return n};var Kt=n=>Wt(I({},"__esModule",{value:!0}),n);var Ke={};qt(Ke,{Instruckt:()=>B,init:()=>We});function Nt(){let n=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return n?decodeURIComponent(n[1]):""}function W(){let n={"Content-Type":"application/json",Accept:"application/json","X-Requested-With":"XMLHttpRequest"},t=Nt();return t&&(n["X-XSRF-TOKEN"]=t),n}function L(n){let t={};for(let[e,o]of Object.entries(n)){let i=e.replace(/_([a-z])/g,(r,s)=>s.toUpperCase());t[i]=Array.isArray(o)?o.map(r=>r&&typeof r=="object"&&!Array.isArray(r)?L(r):r):o&&typeof o=="object"&&!Array.isArray(o)?L(o):o}return t}function K(n){let t={};for(let[e,o]of Object.entries(n)){let i=e.replace(/[A-Z]/g,r=>`_${r.toLowerCase()}`);t[i]=o&&typeof o=="object"&&!Array.isArray(o)?K(o):o}return t}var H=class{constructor(t){this.endpoint=t}async getAnnotations(){let t=await fetch(`${this.endpoint}/annotations`,{headers:W()});if(!t.ok)throw new Error(`instruckt: failed to load annotations (${t.status})`);return(await t.json()).map(o=>L(o))}async addAnnotation(t){let e=await fetch(`${this.endpoint}/annotations`,{method:"POST",headers:W(),body:JSON.stringify(K(t))});if(!e.ok)throw new Error(`instruckt: failed to add annotation (${e.status})`);return L(await e.json())}async updateAnnotation(t,e){let o=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:W(),body:JSON.stringify(K(e))});if(!o.ok)throw new Error(`instruckt: failed to update annotation (${o.status})`);return L(await o.json())}};var Xt=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,ut=`
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
`,N=`
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
`,Yt=`
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
`;function X(n){if(document.getElementById("instruckt-global"))return;let t=n?`:root {${n.default?` --ik-marker-default: ${n.default};`:""}${n.screenshot?` --ik-marker-screenshot: ${n.screenshot};`:""}${n.dismissed?` --ik-marker-dismissed: ${n.dismissed};`:""} }
`:"",e=document.createElement("style");e.id="instruckt-global",e.textContent=t+Xt+Yt,document.head.appendChild(e)}var k={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',clear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',minimize:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>',screenshot:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',logo:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>'},M=class{constructor(t,e,o){this.position=t;this.callbacks=e;this.fabBadge=null;this.annotateActive=!1;this.freezeActive=!1;this.minimized=!1;this.totalCount=0;this.dragging=!1;this.dragOffset={x:0,y:0};this.keys=o!=null?o:{},this.build(),this.setupDrag()}build(){var u,m,d,f,v;this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=ut,this.shadow.appendChild(t),this.toolbarEl=document.createElement("div"),this.toolbarEl.className="toolbar";let e=this.keys;this.annotateBtn=this.makeBtn(k.annotate,`Annotate elements (${((u=e.annotate)!=null?u:"A").toUpperCase()})`,()=>{let h=!this.annotateActive;this.setAnnotateActive(h),this.callbacks.onToggleAnnotate(h)}),this.freezeBtn=this.makeBtn(k.freeze,`Freeze page (${((m=e.freeze)!=null?m:"F").toUpperCase()})`,()=>{let h=!this.freezeActive;this.setFreezeActive(h),this.callbacks.onFreezeAnimations(h)});let o=this.makeBtn(k.screenshot,`Screenshot region (${((d=e.screenshot)!=null?d:"C").toUpperCase()})`,()=>{this.callbacks.onScreenshot()});this.copyBtn=this.makeBtn(k.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=k.check,setTimeout(()=>{this.copyBtn.innerHTML=k.copy},1200)});let i=document.createElement("div");i.className="clear-wrap";let r=this.makeBtn(k.clear,`Clear this page (${((f=e.clearPage)!=null?f:"X").toUpperCase()})`,()=>{var h,p;(p=(h=this.callbacks).onClearPage)==null||p.call(h)});r.classList.add("danger-btn");let s=this.makeBtn('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',"Delete all instructions.",()=>{var h,p;return(p=(h=this.callbacks).onClearAll)==null?void 0:p.call(h)});s.classList.add("danger-btn","clear-all-btn"),i.appendChild(r),i.appendChild(s);let a=this.makeBtn(k.minimize,"Minimize toolbar",()=>{this.setMinimized(!0)});a.classList.add("minimize-btn");let c=()=>{let h=document.createElement("div");return h.className="divider",h};this.toolbarEl.append(this.annotateBtn,o,c(),this.freezeBtn,c(),this.copyBtn,i,c(),a),this.shadow.appendChild(this.toolbarEl),this.fab=document.createElement("button"),this.fab.className="fab",this.fab.title="Open instruckt toolbar",this.fab.setAttribute("aria-label","Open instruckt toolbar"),this.fab.innerHTML=k.logo,this.fab.style.display="none",this.fab.addEventListener("click",h=>{h.stopPropagation(),this.setMinimized(!1)}),this.shadow.appendChild(this.fab),this.host.addEventListener("click",h=>h.stopPropagation()),this.host.addEventListener("mousedown",h=>h.stopPropagation()),this.host.addEventListener("pointerdown",h=>h.stopPropagation()),this.applyPosition(),((v=document.getElementById("instruckt-root"))!=null?v:document.body).appendChild(this.host)}makeBtn(t,e,o){let i=document.createElement("button");return i.className="btn",i.setAttribute("data-tooltip",e),i.setAttribute("aria-label",e),i.innerHTML=t,i.addEventListener("click",r=>{r.stopPropagation(),o()}),i}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{let e=t;if(e.target.closest(".btn")||e.target.closest(".fab"))return;this.dragging=!0;let o=this.host.getBoundingClientRect();this.dragOffset={x:e.clientX-o.left,y:e.clientY-o.top},e.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMinimized(t){var e,o;this.minimized=t,this.toolbarEl.style.display=t?"none":"",this.fab.style.display=t?"":"none",this.updateFabBadge(),(o=(e=this.callbacks).onMinimize)==null||o.call(e,t)}updateFabBadge(){var t;this.totalCount>0&&this.minimized?(this.fabBadge||(this.fabBadge=document.createElement("span"),this.fabBadge.className="fab-badge",this.fab.appendChild(this.fabBadge)),this.fabBadge.textContent=this.totalCount>99?"99+":String(this.totalCount)):((t=this.fabBadge)==null||t.remove(),this.fabBadge=null)}isMinimized(){return this.minimized}minimize(){this.minimized=!0,this.toolbarEl.style.display="none",this.fab.style.display="",this.updateFabBadge()}setAnnotateActive(t){this.annotateActive=t,this.annotateBtn.classList.toggle("active",t),document.body.classList.toggle("ik-annotating",t)}setFreezeActive(t){this.freezeActive=t,this.freezeBtn.classList.toggle("active",t)}setMode(t){this.setAnnotateActive(t==="annotating")}setAnnotationCount(t){let e=this.annotateBtn.querySelector(".badge");t>0?(e||(e=document.createElement("span"),e.className="badge",this.annotateBtn.appendChild(e)),e.textContent=t>99?"99+":String(t)):e==null||e.remove()}setTotalCount(t){this.totalCount=t,this.updateFabBadge()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var T=class{constructor(){var e;this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),((e=document.getElementById("instruckt-root"))!=null?e:document.body).appendChild(this.el)}show(t){let e=t.getBoundingClientRect();if(e.width===0&&e.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function ht(n,t){if(n.match(/^[a-z]+:\/\//i))return n;if(n.match(/^\/\//))return window.location.protocol+n;if(n.match(/^[a-z]+:/i))return n;let e=document.implementation.createHTMLDocument(),o=e.createElement("base"),i=e.createElement("a");return e.head.appendChild(o),e.body.appendChild(i),t&&(o.href=t),i.href=n,i.href}var pt=(()=>{let n=0,t=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(n+=1,`u${t()}${n}`)})();function w(n){let t=[];for(let e=0,o=n.length;e<o;e++)t.push(n[e]);return t}var E=null;function j(n={}){return E||(n.includeStyleProperties?(E=n.includeStyleProperties,E):(E=w(window.getComputedStyle(document.documentElement)),E))}function U(n,t){let o=(n.ownerDocument.defaultView||window).getComputedStyle(n).getPropertyValue(t);return o?parseFloat(o.replace("px","")):0}function Gt(n){let t=U(n,"border-left-width"),e=U(n,"border-right-width");return n.clientWidth+t+e}function Jt(n){let t=U(n,"border-top-width"),e=U(n,"border-bottom-width");return n.clientHeight+t+e}function Y(n,t={}){let e=t.width||Gt(n),o=t.height||Jt(n);return{width:e,height:o}}function mt(){let n,t;try{t=process}catch(o){}let e=t&&t.env?t.env.devicePixelRatio:null;return e&&(n=parseInt(e,10),Number.isNaN(n)&&(n=1)),n||window.devicePixelRatio||1}var y=16384;function ft(n){(n.width>y||n.height>y)&&(n.width>y&&n.height>y?n.width>n.height?(n.height*=y/n.width,n.width=y):(n.width*=y/n.height,n.height=y):n.width>y?(n.height*=y/n.width,n.width=y):(n.width*=y/n.height,n.height=y))}function A(n){return new Promise((t,e)=>{let o=new Image;o.onload=()=>{o.decode().then(()=>{requestAnimationFrame(()=>t(o))})},o.onerror=e,o.crossOrigin="anonymous",o.decoding="async",o.src=n})}async function Qt(n){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(n)).then(encodeURIComponent).then(t=>`data:image/svg+xml;charset=utf-8,${t}`)}async function gt(n,t,e){let o="http://www.w3.org/2000/svg",i=document.createElementNS(o,"svg"),r=document.createElementNS(o,"foreignObject");return i.setAttribute("width",`${t}`),i.setAttribute("height",`${e}`),i.setAttribute("viewBox",`0 0 ${t} ${e}`),r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("x","0"),r.setAttribute("y","0"),r.setAttribute("externalResourcesRequired","true"),i.appendChild(r),r.appendChild(n),Qt(i)}var g=(n,t)=>{if(n instanceof t)return!0;let e=Object.getPrototypeOf(n);return e===null?!1:e.constructor.name===t.name||g(e,t)};function Zt(n){let t=n.getPropertyValue("content");return`${n.cssText} content: '${t.replace(/'|"/g,"")}';`}function te(n,t){return j(t).map(e=>{let o=n.getPropertyValue(e),i=n.getPropertyPriority(e);return`${e}: ${o}${i?" !important":""};`}).join(" ")}function ee(n,t,e,o){let i=`.${n}:${t}`,r=e.cssText?Zt(e):te(e,o);return document.createTextNode(`${i}{${r}}`)}function vt(n,t,e,o){let i=window.getComputedStyle(n,e),r=i.getPropertyValue("content");if(r===""||r==="none")return;let s=pt();try{t.className=`${t.className} ${s}`}catch(c){return}let a=document.createElement("style");a.appendChild(ee(s,e,i,o)),t.appendChild(a)}function bt(n,t,e){vt(n,t,":before",e),vt(n,t,":after",e)}var yt="application/font-woff",wt="image/jpeg",ne={woff:yt,woff2:yt,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:wt,jpeg:wt,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function oe(n){let t=/\.([^./]*?)$/g.exec(n);return t?t[1]:""}function S(n){let t=oe(n).toLowerCase();return ne[t]||""}function ie(n){return n.split(/,/)[1]}function z(n){return n.search(/^(data:)/)!==-1}function J(n,t){return`data:${t};base64,${n}`}async function Q(n,t,e){let o=await fetch(n,t);if(o.status===404)throw new Error(`Resource "${o.url}" not found`);let i=await o.blob();return new Promise((r,s)=>{let a=new FileReader;a.onerror=s,a.onloadend=()=>{try{r(e({res:o,result:a.result}))}catch(c){s(c)}},a.readAsDataURL(i)})}var G={};function re(n,t,e){let o=n.replace(/\?.*/,"");return e&&(o=n),/ttf|otf|eot|woff2?/i.test(o)&&(o=o.replace(/.*\//,"")),t?`[${t}]${o}`:o}async function C(n,t,e){let o=re(n,t,e.includeQueryParams);if(G[o]!=null)return G[o];e.cacheBust&&(n+=(/\?/.test(n)?"&":"?")+new Date().getTime());let i;try{let r=await Q(n,e.fetchRequestInit,({res:s,result:a})=>(t||(t=s.headers.get("Content-Type")||""),ie(a)));i=J(r,t)}catch(r){i=e.imagePlaceholder||"";let s=`Failed to fetch resource: ${n}`;r&&(s=typeof r=="string"?r:r.message),s&&console.warn(s)}return G[o]=i,i}async function se(n){let t=n.toDataURL();return t==="data:,"?n.cloneNode(!1):A(t)}async function ae(n,t){if(n.currentSrc){let r=document.createElement("canvas"),s=r.getContext("2d");r.width=n.clientWidth,r.height=n.clientHeight,s==null||s.drawImage(n,0,0,r.width,r.height);let a=r.toDataURL();return A(a)}let e=n.poster,o=S(e),i=await C(e,o,t);return A(i)}async function ce(n,t){var e;try{if(!((e=n==null?void 0:n.contentDocument)===null||e===void 0)&&e.body)return await R(n.contentDocument.body,t,!0)}catch(o){}return n.cloneNode(!1)}async function le(n,t){return g(n,HTMLCanvasElement)?se(n):g(n,HTMLVideoElement)?ae(n,t):g(n,HTMLIFrameElement)?ce(n,t):n.cloneNode(kt(n))}var de=n=>n.tagName!=null&&n.tagName.toUpperCase()==="SLOT",kt=n=>n.tagName!=null&&n.tagName.toUpperCase()==="SVG";async function ue(n,t,e){var o,i;if(kt(t))return t;let r=[];return de(n)&&n.assignedNodes?r=w(n.assignedNodes()):g(n,HTMLIFrameElement)&&(!((o=n.contentDocument)===null||o===void 0)&&o.body)?r=w(n.contentDocument.body.childNodes):r=w(((i=n.shadowRoot)!==null&&i!==void 0?i:n).childNodes),r.length===0||g(n,HTMLVideoElement)||await r.reduce((s,a)=>s.then(()=>R(a,e)).then(c=>{c&&t.appendChild(c)}),Promise.resolve()),t}function he(n,t,e){let o=t.style;if(!o)return;let i=window.getComputedStyle(n);i.cssText?(o.cssText=i.cssText,o.transformOrigin=i.transformOrigin):j(e).forEach(r=>{let s=i.getPropertyValue(r);r==="font-size"&&s.endsWith("px")&&(s=`${Math.floor(parseFloat(s.substring(0,s.length-2)))-.1}px`),g(n,HTMLIFrameElement)&&r==="display"&&s==="inline"&&(s="block"),r==="d"&&t.getAttribute("d")&&(s=`path(${t.getAttribute("d")})`),o.setProperty(r,s,i.getPropertyPriority(r))})}function pe(n,t){g(n,HTMLTextAreaElement)&&(t.innerHTML=n.value),g(n,HTMLInputElement)&&t.setAttribute("value",n.value)}function me(n,t){if(g(n,HTMLSelectElement)){let o=Array.from(t.children).find(i=>n.value===i.getAttribute("value"));o&&o.setAttribute("selected","")}}function fe(n,t,e){return g(t,Element)&&(he(n,t,e),bt(n,t,e),pe(n,t),me(n,t)),t}async function ge(n,t){let e=n.querySelectorAll?n.querySelectorAll("use"):[];if(e.length===0)return n;let o={};for(let r=0;r<e.length;r++){let a=e[r].getAttribute("xlink:href");if(a){let c=n.querySelector(a),l=document.querySelector(a);!c&&l&&!o[a]&&(o[a]=await R(l,t,!0))}}let i=Object.values(o);if(i.length){let r="http://www.w3.org/1999/xhtml",s=document.createElementNS(r,"svg");s.setAttribute("xmlns",r),s.style.position="absolute",s.style.width="0",s.style.height="0",s.style.overflow="hidden",s.style.display="none";let a=document.createElementNS(r,"defs");s.appendChild(a);for(let c=0;c<i.length;c++)a.appendChild(i[c]);n.appendChild(s)}return n}async function R(n,t,e){return!e&&t.filter&&!t.filter(n)?null:Promise.resolve(n).then(o=>le(o,t)).then(o=>ue(n,o,t)).then(o=>fe(n,o,t)).then(o=>ge(o,t))}var xt=/url\((['"]?)([^'"]+?)\1\)/g,ve=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,be=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function ye(n){let t=n.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`,"g")}function we(n){let t=[];return n.replace(xt,(e,o,i)=>(t.push(i),e)),t.filter(e=>!z(e))}async function ke(n,t,e,o,i){try{let r=e?ht(t,e):t,s=S(t),a;if(i){let c=await i(r);a=J(c,s)}else a=await C(r,s,o);return n.replace(ye(t),`$1${a}$3`)}catch(r){}return n}function xe(n,{preferredFontFormat:t}){return t?n.replace(be,e=>{for(;;){let[o,,i]=ve.exec(e)||[];if(!i)return"";if(i===t)return`src: ${o};`}}):n}function Z(n){return n.search(xt)!==-1}async function _(n,t,e){if(!Z(n))return n;let o=xe(n,e);return we(o).reduce((r,s)=>r.then(a=>ke(a,s,t,e)),Promise.resolve(o))}async function P(n,t,e){var o;let i=(o=t.style)===null||o===void 0?void 0:o.getPropertyValue(n);if(i){let r=await _(i,null,e);return t.style.setProperty(n,r,t.style.getPropertyPriority(n)),!0}return!1}async function Ee(n,t){await P("background",n,t)||await P("background-image",n,t),await P("mask",n,t)||await P("-webkit-mask",n,t)||await P("mask-image",n,t)||await P("-webkit-mask-image",n,t)}async function Ae(n,t){let e=g(n,HTMLImageElement);if(!(e&&!z(n.src))&&!(g(n,SVGImageElement)&&!z(n.href.baseVal)))return;let o=e?n.src:n.href.baseVal,i=await C(o,S(o),t);await new Promise((r,s)=>{n.onload=r,n.onerror=t.onImageErrorHandler?(...c)=>{try{r(t.onImageErrorHandler(...c))}catch(l){s(l)}}:s;let a=n;a.decode&&(a.decode=r),a.loading==="lazy"&&(a.loading="eager"),e?(n.srcset="",n.src=i):n.href.baseVal=i})}async function Se(n,t){let o=w(n.childNodes).map(i=>tt(i,t));await Promise.all(o).then(()=>n)}async function tt(n,t){g(n,Element)&&(await Ee(n,t),await Ae(n,t),await Se(n,t))}function Et(n,t){let{style:e}=n;t.backgroundColor&&(e.backgroundColor=t.backgroundColor),t.width&&(e.width=`${t.width}px`),t.height&&(e.height=`${t.height}px`);let o=t.style;return o!=null&&Object.keys(o).forEach(i=>{e[i]=o[i]}),n}var At={};async function St(n){let t=At[n];if(t!=null)return t;let o=await(await fetch(n)).text();return t={url:n,cssText:o},At[n]=t,t}async function Ct(n,t){let e=n.cssText,o=/url\(["']?([^"')]+)["']?\)/g,r=(e.match(/url\([^)]+\)/g)||[]).map(async s=>{let a=s.replace(o,"$1");return a.startsWith("https://")||(a=new URL(a,n.url).href),Q(a,t.fetchRequestInit,({result:c})=>(e=e.replace(s,`url(${c})`),[s,c]))});return Promise.all(r).then(()=>e)}function Pt(n){if(n==null)return[];let t=[],e=/(\/\*[\s\S]*?\*\/)/gi,o=n.replace(e,""),i=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let c=i.exec(o);if(c===null)break;t.push(c[0])}o=o.replace(i,"");let r=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,s="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",a=new RegExp(s,"gi");for(;;){let c=r.exec(o);if(c===null){if(c=a.exec(o),c===null)break;r.lastIndex=a.lastIndex}else a.lastIndex=r.lastIndex;t.push(c[0])}return t}async function Ce(n,t){let e=[],o=[];return n.forEach(i=>{if("cssRules"in i)try{w(i.cssRules||[]).forEach((r,s)=>{if(r.type===CSSRule.IMPORT_RULE){let a=s+1,c=r.href,l=St(c).then(u=>Ct(u,t)).then(u=>Pt(u).forEach(m=>{try{i.insertRule(m,m.startsWith("@import")?a+=1:i.cssRules.length)}catch(d){console.error("Error inserting rule from remote css",{rule:m,error:d})}})).catch(u=>{console.error("Error loading remote css",u.toString())});o.push(l)}})}catch(r){let s=n.find(a=>a.href==null)||document.styleSheets[0];i.href!=null&&o.push(St(i.href).then(a=>Ct(a,t)).then(a=>Pt(a).forEach(c=>{s.insertRule(c,s.cssRules.length)})).catch(a=>{console.error("Error loading remote stylesheet",a)})),console.error("Error inlining remote css file",r)}}),Promise.all(o).then(()=>(n.forEach(i=>{if("cssRules"in i)try{w(i.cssRules||[]).forEach(r=>{e.push(r)})}catch(r){console.error(`Error while reading CSS rules from ${i.href}`,r)}}),e))}function Pe(n){return n.filter(t=>t.type===CSSRule.FONT_FACE_RULE).filter(t=>Z(t.style.getPropertyValue("src")))}async function Le(n,t){if(n.ownerDocument==null)throw new Error("Provided element is not within a Document");let e=w(n.ownerDocument.styleSheets),o=await Ce(e,t);return Pe(o)}function Lt(n){return n.trim().replace(/["']/g,"")}function Me(n){let t=new Set;function e(o){(o.style.fontFamily||getComputedStyle(o).fontFamily).split(",").forEach(r=>{t.add(Lt(r))}),Array.from(o.children).forEach(r=>{r instanceof HTMLElement&&e(r)})}return e(n),t}async function Mt(n,t){let e=await Le(n,t),o=Me(n);return(await Promise.all(e.filter(r=>o.has(Lt(r.style.fontFamily))).map(r=>{let s=r.parentStyleSheet?r.parentStyleSheet.href:null;return _(r.cssText,s,t)}))).join(`
`)}async function Tt(n,t){let e=t.fontEmbedCSS!=null?t.fontEmbedCSS:t.skipFonts?null:await Mt(n,t);if(e){let o=document.createElement("style"),i=document.createTextNode(e);o.appendChild(i),n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o)}}async function Te(n,t={}){let{width:e,height:o}=Y(n,t),i=await R(n,t,!0);return await Tt(i,t),await tt(i,t),Et(i,t),await gt(i,e,o)}async function ze(n,t={}){let{width:e,height:o}=Y(n,t),i=await Te(n,t),r=await A(i),s=document.createElement("canvas"),a=s.getContext("2d"),c=t.pixelRatio||mt(),l=t.canvasWidth||e,u=t.canvasHeight||o;return s.width=l*c,s.height=u*c,t.skipAutoScale||ft(s),s.style.width=`${l}`,s.style.height=`${u}`,t.backgroundColor&&(a.fillStyle=t.backgroundColor,a.fillRect(0,0,s.width,s.height)),a.drawImage(r,0,0,s.width,s.height),s}async function et(n,t={}){return(await ze(n,t)).toDataURL()}async function zt(n){try{return await et(n,{cacheBust:!0,pixelRatio:2,skipFonts:!0,filter:t=>{var e,o;if((e=t.getAttribute)!=null&&e.call(t,"data-instruckt"))return!1;if(t.tagName==="LINK"&&t.getAttribute("rel")==="stylesheet"){let i=(o=t.getAttribute("href"))!=null?o:"";if(i.startsWith("http")&&!i.startsWith(window.location.origin))return!1}return!0}})}catch(t){return null}}async function Rt(n){try{let t=await et(document.body,{cacheBust:!0,pixelRatio:2,skipFonts:!0,filter:e=>{var o,i;if((o=e.getAttribute)!=null&&o.call(e,"data-instruckt"))return!1;if(e.tagName==="LINK"&&e.getAttribute("rel")==="stylesheet"){let r=(i=e.getAttribute("href"))!=null?i:"";if(r.startsWith("http")&&!r.startsWith(window.location.origin))return!1}return!0}});return await Re(t,n)}catch(t){return null}}function Re(n,t){return new Promise((e,o)=>{let i=new Image;i.onload=()=>{let s=document.createElement("canvas");s.width=t.width*2,s.height=t.height*2,s.getContext("2d").drawImage(i,t.x*2,t.y*2,t.width*2,t.height*2,0,0,t.width*2,t.height*2),e(s.toDataURL("image/png"))},i.onerror=o,i.src=n})}function $t(){return new Promise(n=>{let t=document.createElement("div");Object.assign(t.style,{position:"fixed",inset:"0",zIndex:"2147483647",cursor:"crosshair",background:"rgba(0,0,0,0.1)"}),t.setAttribute("data-instruckt","region-select");let e=document.createElement("div");Object.assign(e.style,{position:"fixed",border:"2px dashed #6366f1",background:"rgba(99,102,241,0.08)",borderRadius:"4px",display:"none",pointerEvents:"none"}),t.appendChild(e);let o=0,i=0,r=!1,s=d=>{o=d.clientX,i=d.clientY,r=!0,e.style.display="block",c(d)},a=d=>{r&&c(d)},c=d=>{let f=Math.min(o,d.clientX),v=Math.min(i,d.clientY),h=Math.abs(d.clientX-o),p=Math.abs(d.clientY-i);Object.assign(e.style,{left:`${f}px`,top:`${v}px`,width:`${h}px`,height:`${p}px`})},l=d=>{if(!r)return;r=!1;let f=Math.min(o,d.clientX),v=Math.min(i,d.clientY),h=Math.abs(d.clientX-o),p=Math.abs(d.clientY-i);m(),h<10||p<10?n(null):n(new DOMRect(f,v,h,p))},u=d=>{d.key==="Escape"&&(m(),n(null))},m=()=>{t.remove(),document.removeEventListener("keydown",u,!0)};t.addEventListener("mousedown",s),t.addEventListener("mousemove",a),t.addEventListener("mouseup",l),document.addEventListener("keydown",u,!0),document.body.appendChild(t)})}function $e(n,t){return n?n.startsWith("data:")?n:`${t!=null?t:"/instruckt"}/${n}`:null}function x(n){return String(n!=null?n:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var D=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,e){var v,h;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let o=document.createElement("style");o.textContent=N,this.shadow.appendChild(o);let i=document.createElement("div");i.className="popup";let r=t.framework?`<div class="fw-badge">${x(t.framework.component)}</div>`:"",s=t.selectedText?`<div class="selected-text">"${x(t.selectedText.slice(0,80))}"</div>`:"",a=!!t.screenshot;i.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${x(t.elementPath)}">${x(t.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${r}${s}
      <div class="screenshot-slot">${a?`<div class="screenshot-preview"><img src="${t.screenshot}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`:'<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>'}</div>
      <textarea placeholder="${a?"Add a note (optional)":"What needs to change here?"}" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" ${a?"":"disabled"}>Add note</button>
      </div>
    `;let c=(v=t.screenshot)!=null?v:null,l=i.querySelector("textarea"),u=i.querySelector('[data-action="submit"]'),m=i.querySelector(".screenshot-slot"),d=()=>{u.disabled=!c&&l.value.trim().length===0},f=()=>{let p=m.querySelector('[data-action="capture"]');p==null||p.addEventListener("click",async()=>{p.textContent="Capturing...";let V=await zt(t.element);V?(c=V,m.innerHTML=`<div class="screenshot-preview"><img src="${V}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`,l.placeholder="Add a note (optional)",f(),d()):(p.textContent="Capture failed",setTimeout(()=>{p.parentElement&&(p.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot')},1500))});let b=m.querySelector(".screenshot-remove");b==null||b.addEventListener("click",()=>{c=null,m.innerHTML='<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>',l.placeholder="What needs to change here?",f(),d()})};f(),l.addEventListener("input",d),l.addEventListener("keydown",p=>{p.stopPropagation(),p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),u.disabled||u.click()),p.key==="Escape"&&(e.onCancel(),this.destroy())}),i.querySelector('[data-action="cancel"]').addEventListener("click",()=>{e.onCancel(),this.destroy()}),i.querySelector(".close-btn").addEventListener("click",()=>{e.onCancel(),this.destroy()}),u.addEventListener("click",()=>{let p=l.value.trim();!p&&!c||(e.onSubmit({comment:p||"(screenshot)",screenshot:c!=null?c:void 0}),this.destroy())}),this.shadow.appendChild(i),((h=document.getElementById("instruckt-root"))!=null?h:document.body).appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),l.focus()}showEdit(t,e,o){var p;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let i=document.createElement("style");i.textContent=N,this.shadow.appendChild(i);let r=document.createElement("div");r.className="popup";let s=t.framework?`<div class="fw-badge">${x(t.framework.component)}</div>`:"",a=$e(t.screenshot,o),c=a?`<div class="screenshot-preview screenshot-slot"><img src="${a}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`:"",l=t.comment==="(screenshot)"?"":t.comment;r.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${x(t.elementPath)}">${x(t.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${s}${c}
      <textarea rows="3">${x(l)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `,r.querySelector(".close-btn").addEventListener("click",()=>this.destroy());let u=r.querySelector(".screenshot-remove");u==null||u.addEventListener("click",()=>{e.onSave(t,t.comment);let b=r.querySelector(".screenshot-slot");b&&b.remove()});let m=r.querySelector("textarea"),d=r.querySelector('[data-action="save"]'),f=r.querySelector('[data-action="delete"]');m.addEventListener("keydown",b=>{b.stopPropagation(),b.key==="Enter"&&!b.shiftKey&&(b.preventDefault(),d.click()),b.key==="Escape"&&this.destroy()}),d.addEventListener("click",()=>{let b=m.value.trim();b&&(e.onSave(t,b),this.destroy())}),f.addEventListener("click",()=>{e.onDelete(t),this.destroy()}),this.shadow.appendChild(r),((p=document.getElementById("instruckt-root"))!=null?p:document.body).appendChild(this.host);let v=t.x/100*window.innerWidth,h=t.y-window.scrollY;this.positionHost(v,h),this.setupOutsideClick(),m.focus(),m.setSelectionRange(m.value.length,m.value.length)}stopHostPropagation(t){for(let e of["click","mousedown","pointerdown","keydown","keyup","keypress","submit"])t.addEventListener(e,o=>o.stopPropagation())}positionHost(t,e){if(this.host){this.host.setAttribute("popover","manual");try{this.host.showPopover()}catch(o){}Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var l,u;if(!this.host)return;let o=360,i=(u=(l=this.host.querySelector(".popup"))==null?void 0:l.getBoundingClientRect().height)!=null?u:300,r=window.innerWidth,s=window.innerHeight,a=Math.max(10,Math.min(t+10,r-o)),c=Math.max(10,Math.min(e+10,s-i-10));Object.assign(this.host.style,{left:`${a}px`,top:`${c}px`})})}}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var $=class{constructor(t){this.onClick=t;this.markers=new Map;var o;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),((o=document.getElementById("instruckt-root"))!=null?o:document.body).appendChild(this.container)}upsert(t,e){let o=this.markers.get(t.id);if(o){this.updateStyle(o.el,t);return}let i=document.createElement("div"),r=t.screenshot?" has-screenshot":"";i.className=`ik-marker ${this.statusClass(t.status)}${r}`,i.textContent=String(e),i.title=t.comment==="(screenshot)"?"Screenshot":t.comment.slice(0,60),i.style.pointerEvents="all",i.style.left=`${t.x/100*window.innerWidth}px`,i.style.top=`${t.y-window.scrollY}px`,i.addEventListener("click",s=>{s.stopPropagation(),this.onClick(t)}),this.container.appendChild(i),this.markers.set(t.id,{el:i,annotationId:t.id})}update(t){let e=this.markers.get(t.id);e&&this.updateStyle(e.el,t)}updateStyle(t,e){let o=e.screenshot?" has-screenshot":"";t.className=`ik-marker ${this.statusClass(e.status)}${o}`,t.title=e.comment==="(screenshot)"?"Screenshot":e.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":""}reposition(t){t.forEach(e=>{let o=this.markers.get(e.id);o&&(o.el.style.left=`${e.x/100*window.innerWidth}px`,o.el.style.top=`${e.y-window.scrollY}px`)})}remove(t){let e=this.markers.get(t);e&&(e.el.remove(),this.markers.delete(t))}setVisible(t){this.container.style.display=t?"":"none"}clear(){for(let{el:t}of this.markers.values())t.remove();this.markers.clear()}destroy(){this.container.remove(),this.markers.clear()}};function nt(n){if(n.id)return`#${CSS.escape(n.id)}`;let t=[],e=n;for(;e&&e!==document.documentElement;){let o=e.tagName.toLowerCase(),i=e.parentElement;if(!i){t.unshift(o);break}let r=Array.from(e.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(r.length>0){let a=`${o}.${r.map(CSS.escape).join(".")}`;if(i.querySelectorAll(a).length===1){t.unshift(a);break}}let s=Array.from(i.children).filter(a=>a.tagName===e.tagName);if(s.length===1)t.unshift(o);else{let a=s.indexOf(e)+1;t.unshift(`${o}:nth-of-type(${a})`)}e=i}return t.join(" > ")}function ot(n){let t=n.tagName.toLowerCase(),e=n.getAttribute("wire:model")||n.getAttribute("wire:click");if(e)return`${t}[wire:${e.split(".")[0]}]`;if(n.id)return`${t}#${n.id}`;let o=n.classList[0];return o?`${t}.${o}`:t}function it(n){let t=n.tagName.toLowerCase(),e=(n.textContent||"").trim().replace(/\s+/g," ").slice(0,40),o=[];n.id&&o.push(`id="${n.id}"`);let i=n.getAttribute("role");i&&o.push(`role="${i}"`);let r=n.getAttribute("wire:model")||n.getAttribute("wire:click");r&&o.push(`wire:${n.hasAttribute("wire:model")?"model":"click"}="${r}"`);let s=o.length?" "+o.join(" "):"",a=`<${t}${s}>`;return e?`${a} ${e}`:a}function rt(n){return(n.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function st(n){return Array.from(n.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function at(n){let t=n.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function Fe(){return typeof window.Livewire!="undefined"}function Be(n){let t=n;for(;t&&t!==document.documentElement;){if(t.getAttribute("wire:id"))return t;t=t.parentElement}return null}function Ft(n){var r,s;if(!Fe())return null;let t=Be(n);if(!t)return null;let e=t.getAttribute("wire:id"),o="Unknown",i=t.getAttribute("wire:snapshot");if(i)try{let a=JSON.parse(i);o=(s=(r=a==null?void 0:a.memo)==null?void 0:r.name)!=null?s:"Unknown"}catch(a){}return{framework:"livewire",component:o,wire_id:e}}function Oe(n){var e;let t=n;for(;t&&t!==document.documentElement;){let o=(e=t.__vueParentComponent)!=null?e:t.__vue__;if(o)return o;t=t.parentElement}return null}function Bt(n){var i,r,s,a,c,l,u,m;let t=Oe(n);if(!t)return null;let e=(m=(u=(c=(s=(i=t.$options)==null?void 0:i.name)!=null?s:(r=t.$options)==null?void 0:r.__name)!=null?c:(a=t.type)==null?void 0:a.name)!=null?u:(l=t.type)==null?void 0:l.__name)!=null?m:"Anonymous",o={};if(t.props&&Object.assign(o,t.props),t.setupState){for(let[d,f]of Object.entries(t.setupState))if(!d.startsWith("_")&&typeof f!="function")try{o[d]=JSON.parse(JSON.stringify(f))}catch(v){o[d]=String(f)}}return{framework:"vue",component:e,component_uid:t.uid!==void 0?String(t.uid):void 0,data:o}}function Ue(n){let t=n;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function It(n){var i,r,s,a;let t=Ue(n);if(!t)return null;let e=(r=(i=t.loc)==null?void 0:i.file)!=null?r:"";return{framework:"svelte",component:e&&(a=(s=e.split("/").pop())==null?void 0:s.replace(/\.svelte$/,""))!=null?a:"Unknown",data:e?{file:e}:void 0}}function _e(n){for(let t of Object.keys(n))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function De(n){let t=n;for(;t;){let{type:e}=t;if(typeof e=="function"&&e.name){let o=e.name;if(o[0]===o[0].toUpperCase()&&o.length>1)return o}if(typeof e=="object"&&e!==null&&e.displayName)return e.displayName;t=t.return}return"Component"}function Ve(n){var o,i;let t=(i=(o=n.memoizedProps)!=null?o:n.pendingProps)!=null?i:{},e={};for(let[r,s]of Object.entries(t))if(!(r==="children"||typeof s=="function"))try{e[r]=JSON.parse(JSON.stringify(s))}catch(a){e[r]=String(s)}return e}function Ot(n){let t=n;for(;t&&t!==document.documentElement;){let e=_e(t);if(e){let o=t[e];if(o){let i=De(o),r=Ve(o);return{framework:"react",component:i,data:r}}}t=t.parentElement}return null}function Ht(){return window.location.pathname}var F=class F{constructor(t){this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.frozenPopovers=[];this.rafId=null;this.pendingMouseTarget=null;this.highlightLocked=!1;this.pollTimer=null;this.boundReposition=()=>{var t;(t=this.markers)==null||t.reposition(this.annotations)};this.freezeBlockEvents=["click","mousedown","pointerdown","pointerup","mouseup","touchstart","touchend","auxclick"];this.freezePassiveEvents=["focusin","focusout","blur","pointerleave","mouseleave","mouseout"];this.boundFreezeClick=t=>{this.isInstruckt(t.target)||this.isAnnotating&&t.type==="click"||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation())};this.boundFreezeSubmit=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()};this.boundFreezePassive=t=>{t.stopPropagation(),t.stopImmediatePropagation()};this.boundMouseMove=t=>{this.highlightLocked||(this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var e,o;this.rafId=null,!this.highlightLocked&&(this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(e=this.highlight)==null||e.show(this.pendingMouseTarget):(o=this.highlight)==null||o.hide())})))};this.boundMouseLeave=()=>{var t;this.highlightLocked||(t=this.highlight)==null||t.hide()};this.boundAnnotateBlock=t=>{this.isInstruckt(t.target)||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation())};this.boundClick=t=>{var d,f,v;let e=t.target;if(this.isInstruckt(e))return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation();let o=((d=window.getSelection())==null?void 0:d.toString().trim())||void 0,i=nt(e),r=ot(e),s=it(e),a=st(e),c=rt(e)||void 0,l=at(e),u=(f=this.detectFramework(e))!=null?f:void 0;(v=this.highlight)==null||v.show(e),this.highlightLocked=!0;let m={element:e,elementPath:i,elementName:r,elementLabel:s,cssClasses:a,boundingBox:l,x:t.clientX,y:t.clientY,selectedText:o,nearbyText:c,framework:u};this.showAnnotationPopup(m)};this.config=O({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new H(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.init()}init(){X(this.config.colors),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new M(this.config.position,{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onScreenshot:()=>this.startRegionCapture(),onCopy:()=>this.copyToClipboard(!0),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:t=>this.onMinimize(t)},this.config.keys),this.highlight=new T,this.popup=new D,this.markers=new $(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown),window.addEventListener("scroll",this.boundReposition,{passive:!0}),window.addEventListener("resize",this.boundReposition,{passive:!0}),document.addEventListener("livewire:navigated",()=>this.reattach()),document.addEventListener("inertia:navigate",()=>this.syncMarkers()),window.addEventListener("popstate",()=>{setTimeout(()=>this.reattach(),0)}),this.loadAnnotations(),this.syncMarkers()}makeToolbarCallbacks(){return{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onScreenshot:()=>this.startRegionCapture(),onCopy:()=>this.copyToClipboard(!0),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:t=>this.onMinimize(t)}}reattach(){var r,s;let t=this.isAnnotating,e=this.isFrozen,o=(s=(r=this.toolbar)==null?void 0:r.isMinimized())!=null?s:!1;this.isAnnotating&&this.detachAnnotateListeners(),this.isFrozen&&this.setFrozen(!1),this.isAnnotating=!1,this.isFrozen=!1,document.querySelectorAll("[data-instruckt]").forEach(a=>a.remove()),this.toolbar=new M(this.config.position,this.makeToolbarCallbacks()),o&&this.toolbar.minimize(),this.markers=new $(a=>this.onMarkerClick(a)),this.highlight=new T,o&&this.markers.setVisible(!1);let i=document.getElementById("instruckt-global");i&&i.remove(),X(this.config.colors),this.syncMarkers(),t&&!o&&this.setAnnotating(!0)}onMinimize(t){var e,o,i,r,s;t?(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1),(e=this.toolbar)==null||e.setAnnotateActive(!1),(o=this.toolbar)==null||o.setFreezeActive(!1),(i=this.markers)==null||i.setVisible(!1),(r=this.popup)==null||r.destroy()):(s=this.markers)==null||s.setVisible(!0)}async loadAnnotations(){this.loadFromStorage();try{let t=await this.api.getAnnotations();if(t.length>0){let e=new Set(t.map(i=>i.id)),o=this.annotations.filter(i=>!e.has(i.id));this.annotations=[...t,...o],this.saveToStorage()}}catch(t){}this.syncMarkers()}saveToStorage(){try{localStorage.setItem(F.STORAGE_KEY,JSON.stringify(this.annotations))}catch(t){}}loadFromStorage(){try{let t=localStorage.getItem(F.STORAGE_KEY);t&&(this.annotations=JSON.parse(t))}catch(t){}}updatePolling(){let t=this.totalActiveCount()>0;t&&!this.pollTimer?this.pollTimer=setInterval(()=>this.pollForChanges(),3e3):!t&&this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}async pollForChanges(){try{let t=await this.api.getAnnotations(),e=!1;for(let o of t){let i=this.annotations.find(r=>r.id===o.id);i&&i.status!==o.status&&(i.status=o.status,i.resolvedAt=o.resolvedAt,i.resolvedBy=o.resolvedBy,e=!0)}e&&(this.saveToStorage(),this.syncMarkers())}catch(t){}}syncMarkers(){var o,i,r,s;(o=this.markers)==null||o.clear();let t=Ht(),e=0;for(let a of this.annotations)a.status==="resolved"||a.status==="dismissed"||this.annotationPageKey(a)===t&&(e++,(i=this.markers)==null||i.upsert(a,e));(r=this.toolbar)==null||r.setAnnotationCount(this.pageAnnotations().length),(s=this.toolbar)==null||s.setTotalCount(this.totalActiveCount()),this.updatePolling()}annotationPageKey(t){try{return new URL(t.url).pathname}catch(e){return t.url}}pageAnnotations(){let t=Ht();return this.annotations.filter(e=>this.annotationPageKey(e)===t&&e.status!=="resolved"&&e.status!=="dismissed")}totalActiveCount(){return this.annotations.filter(t=>t.status!=="resolved"&&t.status!=="dismissed").length}setAnnotating(t){var e,o;this.isAnnotating=t,(e=this.toolbar)==null||e.setAnnotateActive(t),t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(o=this.highlight)==null||o.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)),this.updateFreezeStyles()}setFrozen(t){var e,o;if(this.isFrozen=t,(e=this.toolbar)==null||e.setFreezeActive(t),t){this.updateFreezeStyles(),this.freezePopovers();for(let i of this.freezeBlockEvents)window.addEventListener(i,this.boundFreezeClick,!0);window.addEventListener("submit",this.boundFreezeSubmit,!0);for(let i of this.freezePassiveEvents)window.addEventListener(i,this.boundFreezePassive,!0)}else{(o=this.frozenStyleEl)==null||o.remove(),this.frozenStyleEl=null,this.unfreezePopovers();for(let i of this.freezeBlockEvents)window.removeEventListener(i,this.boundFreezeClick,!0);window.removeEventListener("submit",this.boundFreezeSubmit,!0);for(let i of this.freezePassiveEvents)window.removeEventListener(i,this.boundFreezePassive,!0)}}freezePopovers(){this.frozenPopovers=[];let t=":popover-open, .\\:popover-open";document.querySelectorAll("[popover]").forEach(e=>{var a;let o=e,i=(a=o.getAttribute("popover"))!=null?a:"",r=!1;try{r=o.matches(t)}catch(c){try{r=o.matches(".\\:popover-open")}catch(l){}}if(!r)return;let s=o.getBoundingClientRect();this.frozenPopovers.push({el:o,original:i}),o.removeAttribute("popover"),o.style.setProperty("display","block","important"),o.style.setProperty("position","fixed","important"),o.style.setProperty("z-index","2147483644","important"),o.style.setProperty("top",`${s.top}px`,"important"),o.style.setProperty("left",`${s.left}px`,"important"),o.style.setProperty("width",`${s.width}px`,"important"),o.classList.add(":popover-open")})}unfreezePopovers(){for(let{el:t,original:e}of this.frozenPopovers){for(let o of["display","position","z-index","top","left","width"])t.style.removeProperty(o);t.classList.remove(":popover-open"),t.setAttribute("popover",e||"auto")}this.frozenPopovers=[]}updateFreezeStyles(){var e;if(!this.isFrozen)return;(e=this.frozenStyleEl)==null||e.remove(),this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze";let t=this.isAnnotating?"":`
        a[href], a[wire\\:navigate], [wire\\:click], [wire\\:navigate],
        [x-on\\:click], [@click], [v-on\\:click], [onclick],
        button, input[type="submit"], select, [role="button"], [role="link"],
        [tabindex] {
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
      `;this.frozenStyleEl.textContent=`
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
        video { filter: none !important; }
        ${t}
      `,document.head.appendChild(this.frozenStyleEl)}showAnnotationPopup(t){var e;(e=this.popup)==null||e.showNew(t,{onSubmit:o=>{var i;this.highlightLocked=!1,(i=this.highlight)==null||i.hide(),this.submitAnnotation(t,o.comment,o.screenshot)},onCancel:()=>{var o;this.highlightLocked=!1,(o=this.highlight)==null||o.hide()}})}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave);for(let t of["mousedown","pointerdown"])window.addEventListener(t,this.boundAnnotateBlock,!0);window.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave);for(let t of["mousedown","pointerdown"])window.removeEventListener(t,this.boundAnnotateBlock,!0);window.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return!t||!(t instanceof Element)?!1:t.closest("[data-instruckt]")!==null}async startRegionCapture(){var c,l;let t=this.isAnnotating;t&&this.setAnnotating(!1);let e=await $t();if(!e){t&&this.setAnnotating(!0);return}let o=await Rt(e);if(!o){t&&this.setAnnotating(!0);return}let i=e.x+e.width/2,r=e.y+e.height/2,s=(c=document.elementFromPoint(i,r))!=null?c:document.body,a={element:s,elementPath:nt(s),elementName:ot(s),elementLabel:it(s),cssClasses:st(s),boundingBox:at(s),x:i,y:r,nearbyText:rt(s)||void 0,screenshot:o,framework:(l=this.detectFramework(s))!=null?l:void 0};this.showAnnotationPopup(a)}detectFramework(t){var o;let e=(o=this.config.adapters)!=null?o:[];if(e.includes("livewire")){let i=Ft(t);if(i)return i}if(e.includes("vue")){let i=Bt(t);if(i)return i}if(e.includes("svelte")){let i=It(t);if(i)return i}if(e.includes("react")){let i=Ot(t);if(i)return i}return null}async submitAnnotation(t,e,o){var s,a;let i={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:e,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,screenshot:o,intent:"fix",severity:"important",framework:t.framework,url:window.location.href},r;try{r=await this.api.addAnnotation(i)}catch(c){r=q(O({},i),{id:crypto.randomUUID(),status:"pending",createdAt:new Date().toISOString()})}this.annotations.push(r),this.saveToStorage(),this.syncMarkers(),(a=(s=this.config).onAnnotationAdd)==null||a.call(s,r),this.copyAnnotations()}onMarkerClick(t){var e;(e=this.popup)==null||e.showEdit(t,{onSave:async(o,i)=>{try{let r=await this.api.updateAnnotation(o.id,{comment:i});this.onAnnotationUpdated(r)}catch(r){this.onAnnotationUpdated(q(O({},o),{comment:i,updatedAt:new Date().toISOString()}))}},onDelete:async o=>{try{await this.api.updateAnnotation(o.id,{status:"dismissed"})}catch(i){}this.removeAnnotation(o.id)}},this.config.endpoint)}onAnnotationUpdated(t){let e=this.annotations.findIndex(o=>o.id===t.id);e>=0&&(this.annotations[e]=t),this.saveToStorage(),this.syncMarkers()}removeAnnotation(t){this.annotations=this.annotations.filter(e=>e.id!==t),this.saveToStorage(),this.syncMarkers()}async clearPage(){let t=this.pageAnnotations();for(let e of t)try{await this.api.updateAnnotation(e.id,{status:"dismissed"})}catch(o){}this.annotations=this.annotations.filter(e=>!t.includes(e)),this.saveToStorage(),this.syncMarkers()}async clearEverything(){let t=this.annotations.filter(e=>e.status!=="resolved"&&e.status!=="dismissed");for(let e of t)try{await this.api.updateAnnotation(e.id,{status:"dismissed"})}catch(o){}this.annotations=[],this.saveToStorage(),this.syncMarkers()}onKeydown(t){var r,s,a,c,l,u;if((r=this.toolbar)!=null&&r.isMinimized())return;let e=t.target;if(["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.closest('[contenteditable="true"]')||this.isInstruckt(e))return;let o=(s=this.config.keys)!=null?s:{},i=!t.metaKey&&!t.ctrlKey&&!t.altKey;t.key===((a=o.annotate)!=null?a:"a")&&i&&this.setAnnotating(!this.isAnnotating),t.key===((c=o.freeze)!=null?c:"f")&&i&&this.setFrozen(!this.isFrozen),t.key===((l=o.screenshot)!=null?l:"c")&&i&&this.startRegionCapture(),t.key===((u=o.clearPage)!=null?u:"x")&&i&&this.clearPage(),t.key==="Escape"&&(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1))}copyAnnotations(){this.copyToClipboard(!1)}copyToClipboard(t){let e=this.exportMarkdown();if(window.isSecureContext)navigator.clipboard.writeText(e).catch(()=>{});else if(t)try{let o=document.createElement("textarea");o.value=e,o.style.cssText="position:fixed;left:-9999px",document.body.appendChild(o),o.select(),document.execCommand("copy"),o.remove()}catch(o){}}exportMarkdown(){let t=this.annotations.filter(r=>r.status!=="resolved"&&r.status!=="dismissed");if(t.length===0)return`# UI Feedback

No open annotations.`;let e=new Map;for(let r of t){let s=this.annotationPageKey(r);e.has(s)||e.set(s,[]),e.get(s).push(r)}let o=e.size>1,i=[];o&&(i.push("# UI Feedback"),i.push(""));for(let[r,s]of e){o?i.push(`## ${r}`):i.push(`# UI Feedback: ${r}`),i.push("");let a=o?"###":"##";s.forEach((c,l)=>{var m,d,f;let u=(m=c.framework)!=null&&m.component?` in \`${c.framework.component}\``:"";i.push(`${a} ${l+1}. ${c.comment}`),i.push(`- Element: \`${c.element}\`${u}`),(f=(d=c.framework)==null?void 0:d.data)!=null&&f.file&&i.push(`- File: \`${c.framework.data.file}\``),c.cssClasses&&i.push(`- Classes: \`${c.cssClasses}\``),c.selectedText?i.push(`- Text: "${c.selectedText}"`):c.nearbyText&&i.push(`- Text: "${c.nearbyText.slice(0,100)}"`),c.screenshot&&(c.screenshot.startsWith("data:")?i.push("- Screenshot: attached"):i.push(`- Screenshot: \`storage/app/_instruckt/${c.screenshot}\``)),i.push("")})}return i.join(`
`).trim()}getAnnotations(){return[...this.annotations]}destroy(){var t,e,o,i;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),window.removeEventListener("scroll",this.boundReposition),window.removeEventListener("resize",this.boundReposition),(t=this.toolbar)==null||t.destroy(),(e=this.highlight)==null||e.destroy(),(o=this.popup)==null||o.destroy(),(i=this.markers)==null||i.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId),this.pollTimer!==null&&clearInterval(this.pollTimer)}};F.STORAGE_KEY="instruckt:annotations";var B=F;function We(n){return new B(n)}return Kt(Ke);})();
//# sourceMappingURL=instruckt.iife.js.map