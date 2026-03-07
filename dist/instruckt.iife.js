/* instruckt v0.4.18 | MIT */
"use strict";var Instruckt=(()=>{var V=Object.defineProperty,se=Object.defineProperties,ae=Object.getOwnPropertyDescriptor,le=Object.getOwnPropertyDescriptors,ce=Object.getOwnPropertyNames,q=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,yt=Object.prototype.propertyIsEnumerable;var wt=(e,t,n)=>t in e?V(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,E=(e,t)=>{for(var n in t||(t={}))Q.call(t,n)&&wt(e,n,t[n]);if(q)for(var n of q(t))yt.call(t,n)&&wt(e,n,t[n]);return e},L=(e,t)=>se(e,le(t));var kt=(e,t)=>{var n={};for(var o in e)Q.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(e!=null&&q)for(var o of q(e))t.indexOf(o)<0&&yt.call(e,o)&&(n[o]=e[o]);return n};var de=(e,t)=>{for(var n in t)V(e,n,{get:t[n],enumerable:!0})},ue=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of ce(t))!Q.call(e,r)&&r!==n&&V(e,r,{get:()=>t[r],enumerable:!(o=ae(t,r))||o.enumerable});return e};var he=e=>ue(V({},"__esModule",{value:!0}),e);var Jn={};de(Jn,{Instruckt:()=>H,init:()=>Gn});function pe(){let e=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return e?decodeURIComponent(e[1]):""}function tt(){let e={"Content-Type":"application/json",Accept:"application/json","X-Requested-With":"XMLHttpRequest"},t=pe();return t&&(e["X-XSRF-TOKEN"]=t),e}function I(e){let t={};for(let[n,o]of Object.entries(e)){let r=n.replace(/_([a-z])/g,(i,s)=>s.toUpperCase());t[r]=Array.isArray(o)?o.map(i=>i&&typeof i=="object"&&!Array.isArray(i)?I(i):i):o&&typeof o=="object"&&!Array.isArray(o)?I(o):o}return t}function et(e){let t={};for(let[n,o]of Object.entries(e)){let r=n.replace(/[A-Z]/g,i=>`_${i.toLowerCase()}`);t[r]=o&&typeof o=="object"&&!Array.isArray(o)?et(o):o}return t}var W=class{constructor(t){this.endpoint=t}async getAnnotations(){let t=await fetch(`${this.endpoint}/annotations`,{headers:tt()});if(!t.ok)throw new Error(`instruckt: failed to load annotations (${t.status})`);return(await t.json()).map(o=>I(o))}async addAnnotation(t){let n=await fetch(`${this.endpoint}/annotations`,{method:"POST",headers:tt(),body:JSON.stringify(et(t))});if(!n.ok)throw new Error(`instruckt: failed to add annotation (${n.status})`);return I(await n.json())}async updateAnnotation(t,n){let o=await fetch(`${this.endpoint}/annotations/${t}`,{method:"PATCH",headers:tt(),body:JSON.stringify(et(n))});if(!o.ok)throw new Error(`instruckt: failed to update annotation (${o.status})`);return I(await o.json())}};var me=`
body.ik-annotating,
body.ik-annotating * { cursor: crosshair !important; }
`,xt=`
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
`,nt=`
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
`,fe=`
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
`;function ot(e){if(document.getElementById("instruckt-global"))return;let t=e?`:root {${e.default?` --ik-marker-default: ${e.default};`:""}${e.screenshot?` --ik-marker-screenshot: ${e.screenshot};`:""}${e.dismissed?` --ik-marker-dismissed: ${e.dismissed};`:""} }
`:"",n=document.createElement("style");n.id="instruckt-global",n.textContent=t+me+fe,document.head.appendChild(n)}var A={annotate:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',freeze:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',copy:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',clear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',minimize:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"/><line x1="12" y1="6" x2="12" y2="18"/></svg>',screenshot:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',logo:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>'},$=class{constructor(t,n,o){this.position=t;this.callbacks=n;this.fabBadge=null;this.annotateActive=!1;this.freezeActive=!1;this.minimized=!1;this.totalCount=0;this.dragging=!1;this.dragOffset={x:0,y:0};this.keys=o!=null?o:{},this.build(),this.setupDrag()}build(){var l,h,d,m,g;this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","toolbar"),this.shadow=this.host.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=xt,this.shadow.appendChild(t),this.toolbarEl=document.createElement("div"),this.toolbarEl.className="toolbar";let n=this.keys;this.annotateBtn=this.makeBtn(A.annotate,`Annotate elements (${((l=n.annotate)!=null?l:"A").toUpperCase()})`,()=>{let p=!this.annotateActive;this.setAnnotateActive(p),this.callbacks.onToggleAnnotate(p)}),this.freezeBtn=this.makeBtn(A.freeze,`Freeze page (${((h=n.freeze)!=null?h:"F").toUpperCase()})`,()=>{let p=!this.freezeActive;this.setFreezeActive(p),this.callbacks.onFreezeAnimations(p)});let o=this.makeBtn(A.screenshot,`Screenshot region (${((d=n.screenshot)!=null?d:"C").toUpperCase()})`,()=>{this.callbacks.onScreenshot()});this.copyBtn=this.makeBtn(A.copy,"Copy annotations as markdown",()=>{this.callbacks.onCopy(),this.copyBtn.innerHTML=A.check,setTimeout(()=>{this.copyBtn.innerHTML=A.copy},1200)});let r=document.createElement("div");r.className="clear-wrap";let i=this.makeBtn(A.clear,`Clear this page (${((m=n.clearPage)!=null?m:"X").toUpperCase()})`,()=>{var p,f;(f=(p=this.callbacks).onClearPage)==null||f.call(p)});i.classList.add("danger-btn");let s=this.makeBtn('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',"Delete all instructions.",()=>{var p,f;return(f=(p=this.callbacks).onClearAll)==null?void 0:f.call(p)});s.classList.add("danger-btn","clear-all-btn"),r.appendChild(i),r.appendChild(s);let a=this.makeBtn(A.minimize,"Minimize toolbar",()=>{this.setMinimized(!0)});a.classList.add("minimize-btn");let c=()=>{let p=document.createElement("div");return p.className="divider",p};this.toolbarEl.append(this.annotateBtn,o,c(),this.freezeBtn,c(),this.copyBtn,r,c(),a),this.shadow.appendChild(this.toolbarEl),this.fab=document.createElement("button"),this.fab.className="fab",this.fab.title="Open instruckt toolbar",this.fab.setAttribute("aria-label","Open instruckt toolbar"),this.fab.innerHTML=A.logo,this.fab.style.display="none",this.fab.addEventListener("click",p=>{p.stopPropagation(),this.setMinimized(!1)}),this.shadow.appendChild(this.fab),this.host.addEventListener("click",p=>p.stopPropagation()),this.host.addEventListener("mousedown",p=>p.stopPropagation()),this.host.addEventListener("pointerdown",p=>p.stopPropagation()),this.applyPosition(),((g=document.getElementById("instruckt-root"))!=null?g:document.body).appendChild(this.host)}makeBtn(t,n,o){let r=document.createElement("button");return r.className="btn",r.setAttribute("data-tooltip",n),r.setAttribute("aria-label",n),r.innerHTML=t,r.addEventListener("click",i=>{i.stopPropagation(),o()}),r}applyPosition(){let t="16px";Object.assign(this.host.style,{position:"fixed",zIndex:"2147483646",bottom:this.position.includes("bottom")?t:"auto",top:this.position.includes("top")?t:"auto",right:this.position.includes("right")?t:"auto",left:this.position.includes("left")?t:"auto"})}setupDrag(){this.shadow.addEventListener("mousedown",t=>{let n=t;if(n.target.closest(".btn")||n.target.closest(".fab"))return;this.dragging=!0;let o=this.host.getBoundingClientRect();this.dragOffset={x:n.clientX-o.left,y:n.clientY-o.top},n.preventDefault()}),document.addEventListener("mousemove",t=>{this.dragging&&Object.assign(this.host.style,{left:`${t.clientX-this.dragOffset.x}px`,top:`${t.clientY-this.dragOffset.y}px`,right:"auto",bottom:"auto"})}),document.addEventListener("mouseup",()=>{this.dragging=!1})}setMinimized(t){var n,o;this.minimized=t,this.toolbarEl.style.display=t?"none":"",this.fab.style.display=t?"":"none",this.updateFabBadge(),(o=(n=this.callbacks).onMinimize)==null||o.call(n,t)}updateFabBadge(){var t;this.totalCount>0&&this.minimized?(this.fabBadge||(this.fabBadge=document.createElement("span"),this.fabBadge.className="fab-badge",this.fab.appendChild(this.fabBadge)),this.fabBadge.textContent=this.totalCount>99?"99+":String(this.totalCount)):((t=this.fabBadge)==null||t.remove(),this.fabBadge=null)}isMinimized(){return this.minimized}minimize(){this.minimized=!0,this.toolbarEl.style.display="none",this.fab.style.display="",this.updateFabBadge()}setAnnotateActive(t){this.annotateActive=t,this.annotateBtn.classList.toggle("active",t),document.body.classList.toggle("ik-annotating",t)}setFreezeActive(t){this.freezeActive=t,this.freezeBtn.classList.toggle("active",t)}setMode(t){this.setAnnotateActive(t==="annotating")}setAnnotationCount(t){let n=this.annotateBtn.querySelector(".badge");t>0?(n||(n=document.createElement("span"),n.className="badge",this.annotateBtn.appendChild(n)),n.textContent=t>99?"99+":String(t)):n==null||n.remove()}setTotalCount(t){this.totalCount=t,this.updateFabBadge()}destroy(){this.host.remove(),document.body.classList.remove("ik-annotating")}};var F=class{constructor(){var n;this.el=document.createElement("div"),Object.assign(this.el.style,{position:"fixed",pointerEvents:"none",zIndex:"2147483644",border:"2px solid rgba(99,102,241,0.7)",background:"rgba(99,102,241,0.1)",borderRadius:"3px",transition:"all 0.06s ease",display:"none"}),this.el.setAttribute("data-instruckt","highlight"),((n=document.getElementById("instruckt-root"))!=null?n:document.body).appendChild(this.el)}show(t){let n=t.getBoundingClientRect();if(n.width===0&&n.height===0){this.hide();return}Object.assign(this.el.style,{display:"block",left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`})}hide(){this.el.style.display="none"}destroy(){this.el.remove()}};function ge(e,t){return e[13]=1,e[14]=t>>8,e[15]=t&255,e[16]=t>>8,e[17]=t&255,e}var Lt=112,zt=72,Rt=89,Bt=115,rt;function ve(){let e=new Int32Array(256);for(let t=0;t<256;t++){let n=t;for(let o=0;o<8;o++)n=n&1?3988292384^n>>>1:n>>>1;e[t]=n}return e}function be(e){let t=-1;rt||(rt=ve());for(let n=0;n<e.length;n++)t=rt[(t^e[n])&255]^t>>>8;return t^-1}function we(e){let t=e.length-1;for(let n=t;n>=4;n--)if(e[n-4]===9&&e[n-3]===Lt&&e[n-2]===zt&&e[n-1]===Rt&&e[n]===Bt)return n-3;return 0}function ye(e,t,n=!1){let o=new Uint8Array(13);t*=39.3701,o[0]=Lt,o[1]=zt,o[2]=Rt,o[3]=Bt,o[4]=t>>>24,o[5]=t>>>16,o[6]=t>>>8,o[7]=t&255,o[8]=o[4],o[9]=o[5],o[10]=o[6],o[11]=o[7],o[12]=1;let r=be(o),i=new Uint8Array(4);if(i[0]=r>>>24,i[1]=r>>>16,i[2]=r>>>8,i[3]=r&255,n){let s=we(e);return e.set(o,s),e.set(i,s+13),e}else{let s=new Uint8Array(4);s[0]=0,s[1]=0,s[2]=0,s[3]=9;let a=new Uint8Array(54);return a.set(e,0),a.set(s,33),a.set(o,37),a.set(i,50),a}}var ke="AAlwSFlz",xe="AAAJcEhZ",Ee="AAAACXBI";function Se(e){let t=e.indexOf(ke);return t===-1&&(t=e.indexOf(xe)),t===-1&&(t=e.indexOf(Ee)),t}var It="[modern-screenshot]",C=typeof window!="undefined",Ae=C&&"Worker"in window,Ce=C&&"atob"in window,Te=C&&"btoa"in window,Mt,at=C?(Mt=window.navigator)==null?void 0:Mt.userAgent:"",$t=at.includes("Chrome"),K=at.includes("AppleWebKit")&&!$t,lt=at.includes("Firefox"),Pe=e=>e&&"__CONTEXT__"in e,Me=e=>e.constructor.name==="CSSFontFaceRule",Le=e=>e.constructor.name==="CSSImportRule",ze=e=>e.constructor.name==="CSSLayerBlockRule",S=e=>e.nodeType===1,U=e=>typeof e.className=="object",Ft=e=>e.tagName==="image",Re=e=>e.tagName==="use",N=e=>S(e)&&typeof e.style!="undefined"&&!U(e),Be=e=>e.nodeType===8,Ie=e=>e.nodeType===3,B=e=>e.tagName==="IMG",X=e=>e.tagName==="VIDEO",$e=e=>e.tagName==="CANVAS",Fe=e=>e.tagName==="TEXTAREA",Ne=e=>e.tagName==="INPUT",_e=e=>e.tagName==="STYLE",Oe=e=>e.tagName==="SCRIPT",Ue=e=>e.tagName==="SELECT",De=e=>e.tagName==="SLOT",je=e=>e.tagName==="IFRAME",He=(...e)=>console.warn(It,...e);function qe(e){var n;let t=(n=e==null?void 0:e.createElement)==null?void 0:n.call(e,"canvas");return t&&(t.height=t.width=1),!!t&&"toDataURL"in t&&!!t.toDataURL("image/webp").includes("image/webp")}var it=e=>e.startsWith("data:");function Nt(e,t){if(e.match(/^[a-z]+:\/\//i))return e;if(C&&e.match(/^\/\//))return window.location.protocol+e;if(e.match(/^[a-z]+:/i)||!C)return e;let n=Y().implementation.createHTMLDocument(),o=n.createElement("base"),r=n.createElement("a");return n.head.appendChild(o),n.body.appendChild(r),t&&(o.href=t),r.href=e,r.href}function Y(e){var t;return(t=e&&S(e)?e==null?void 0:e.ownerDocument:e)!=null?t:window.document}var G="http://www.w3.org/2000/svg";function Ve(e,t,n){let o=Y(n).createElementNS(G,"svg");return o.setAttributeNS(null,"width",e.toString()),o.setAttributeNS(null,"height",t.toString()),o.setAttributeNS(null,"viewBox",`0 0 ${e} ${t}`),o}function We(e,t){let n=new XMLSerializer().serializeToString(e);return t&&(n=n.replace(/[\u0000-\u0008\v\f\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu,"")),`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`}function Ke(e,t){return new Promise((n,o)=>{let r=new FileReader;r.onload=()=>n(r.result),r.onerror=()=>o(r.error),r.onabort=()=>o(new Error(`Failed read blob to ${t}`)),t==="dataUrl"?r.readAsDataURL(e):t==="arrayBuffer"&&r.readAsArrayBuffer(e)})}var Xe=e=>Ke(e,"dataUrl");function R(e,t){let n=Y(t).createElement("img");return n.decoding="sync",n.loading="eager",n.src=e,n}function _(e,t){return new Promise(n=>{let{timeout:o,ownerDocument:r,onError:i,onWarn:s}=t!=null?t:{},a=typeof e=="string"?R(e,Y(r)):e,c=null,u=null;function l(){n(a),c&&clearTimeout(c),u==null||u()}if(o&&(c=setTimeout(l,o)),X(a)){let h=a.currentSrc||a.src;if(!h)return a.poster?_(a.poster,t).then(n):l();if(a.readyState>=2)return l();let d=l,m=g=>{s==null||s("Failed video load",h,g),i==null||i(g),l()};u=()=>{a.removeEventListener("loadeddata",d),a.removeEventListener("error",m)},a.addEventListener("loadeddata",d,{once:!0}),a.addEventListener("error",m,{once:!0})}else{let h=Ft(a)?a.href.baseVal:a.currentSrc||a.src;if(!h)return l();let d=async()=>{if(B(a)&&"decode"in a)try{await a.decode()}catch(g){s==null||s("Failed to decode image, trying to render anyway",a.dataset.originalSrc||h,g)}l()},m=g=>{s==null||s("Failed image load",a.dataset.originalSrc||h,g),l()};if(B(a)&&a.complete)return d();u=()=>{a.removeEventListener("load",d),a.removeEventListener("error",m)},a.addEventListener("load",d,{once:!0}),a.addEventListener("error",m,{once:!0})}})}async function Ye(e,t){N(e)&&(B(e)||X(e)?await _(e,t):await Promise.all(["img","video"].flatMap(n=>Array.from(e.querySelectorAll(n)).map(o=>_(o,t)))))}var _t=(function(){let t=0,n=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${n()}${t}`)})();function Ot(e){return e==null?void 0:e.split(",").map(t=>t.trim().replace(/"|'/g,"").toLowerCase()).filter(Boolean)}var Et=0;function Ge(e){let t=`${It}[#${Et}]`;return Et++,{time:n=>e&&console.time(`${t} ${n}`),timeEnd:n=>e&&console.timeEnd(`${t} ${n}`),warn:(...n)=>e&&He(...n)}}function Je(e){return{cache:e?"no-cache":"force-cache"}}async function J(e,t){return Pe(e)?e:Ze(e,L(E({},t),{autoDestruct:!0}))}async function Ze(e,t){var m,g,p,f,v;let{scale:n=1,workerUrl:o,workerNumber:r=1}=t||{},i=!!(t!=null&&t.debug),s=(m=t==null?void 0:t.features)!=null?m:!0,a=(g=e.ownerDocument)!=null?g:C?window.document:void 0,c=(f=(p=e.ownerDocument)==null?void 0:p.defaultView)!=null?f:C?window:void 0,u=new Map,l=L(E({width:0,height:0,quality:1,type:"image/png",scale:n,backgroundColor:null,style:null,filter:null,maximumCanvasSize:0,timeout:3e4,progress:null,debug:i,fetch:E({requestInit:Je((v=t==null?void 0:t.fetch)==null?void 0:v.bypassingCache),placeholderImage:"data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",bypassingCache:!1},t==null?void 0:t.fetch),fetchFn:null,font:{},drawImageInterval:100,workerUrl:null,workerNumber:r,onCloneEachNode:null,onCloneNode:null,onEmbedNode:null,onCreateForeignObjectSvg:null,includeStyleProperties:null,autoDestruct:!1},t),{__CONTEXT__:!0,log:Ge(i),node:e,ownerDocument:a,ownerWindow:c,dpi:n===1?null:96*n,svgStyleElement:Ut(a),svgDefsElement:a==null?void 0:a.createElementNS(G,"defs"),svgStyles:new Map,defaultComputedStyles:new Map,workers:[...Array.from({length:Ae&&o&&r?r:0})].map(()=>{try{let w=new Worker(o);return w.onmessage=async b=>{var x,P,M,bt;let{url:y,result:k}=b.data;k?(P=(x=u.get(y))==null?void 0:x.resolve)==null||P.call(x,k):(bt=(M=u.get(y))==null?void 0:M.reject)==null||bt.call(M,new Error(`Error receiving message from worker: ${y}`))},w.onmessageerror=b=>{var k,x;let{url:y}=b.data;(x=(k=u.get(y))==null?void 0:k.reject)==null||x.call(k,new Error(`Error receiving message from worker: ${y}`))},w}catch(w){return l.log.warn("Failed to new Worker",w),null}}).filter(Boolean),fontFamilies:new Map,fontCssTexts:new Map,acceptOfImage:`${[qe(a)&&"image/webp","image/svg+xml","image/*","*/*"].filter(Boolean).join(",")};q=0.8`,requests:u,drawImageCount:0,tasks:[],features:s,isEnable:w=>{var b,y;return w==="restoreScrollPosition"?typeof s=="boolean"?!1:(b=s[w])!=null?b:!1:typeof s=="boolean"?s:(y=s[w])!=null?y:!0},shadowRoots:[]});l.log.time("wait until load"),await Ye(e,{timeout:l.timeout,onWarn:l.log.warn}),l.log.timeEnd("wait until load");let{width:h,height:d}=Qe(e,l);return l.width=h,l.height=d,l}function Ut(e){if(!e)return;let t=e.createElement("style"),n=t.ownerDocument.createTextNode(`
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`);return t.appendChild(n),t}function Qe(e,t){let{width:n,height:o}=t;if(S(e)&&(!n||!o)){let r=e.getBoundingClientRect();n=n||r.width||Number(e.getAttribute("width"))||0,o=o||r.height||Number(e.getAttribute("height"))||0}return{width:n,height:o}}async function tn(e,t){let{log:n,timeout:o,drawImageCount:r,drawImageInterval:i}=t;n.time("image to canvas");let s=await _(e,{timeout:o,onWarn:t.log.warn}),{canvas:a,context2d:c}=en(e.ownerDocument,t),u=()=>{try{c==null||c.drawImage(s,0,0,a.width,a.height)}catch(l){t.log.warn("Failed to drawImage",l)}};if(u(),t.isEnable("fixSvgXmlDecode"))for(let l=0;l<r;l++)await new Promise(h=>{setTimeout(()=>{c==null||c.clearRect(0,0,a.width,a.height),u(),h()},l+i)});return t.drawImageCount=0,n.timeEnd("image to canvas"),a}function en(e,t){let{width:n,height:o,scale:r,backgroundColor:i,maximumCanvasSize:s}=t,a=e.createElement("canvas");a.width=Math.floor(n*r),a.height=Math.floor(o*r),a.style.width=`${n}px`,a.style.height=`${o}px`,s&&(a.width>s||a.height>s)&&(a.width>s&&a.height>s?a.width>a.height?(a.height*=s/a.width,a.width=s):(a.width*=s/a.height,a.height=s):a.width>s?(a.height*=s/a.width,a.width=s):(a.width*=s/a.height,a.height=s));let c=a.getContext("2d");return c&&i&&(c.fillStyle=i,c.fillRect(0,0,a.width,a.height)),{canvas:a,context2d:c}}function Dt(e,t){if(e.ownerDocument)try{let i=e.toDataURL();if(i!=="data:,")return R(i,e.ownerDocument)}catch(i){t.log.warn("Failed to clone canvas",i)}let n=e.cloneNode(!1),o=e.getContext("2d"),r=n.getContext("2d");try{return o&&r&&r.putImageData(o.getImageData(0,0,e.width,e.height),0,0),n}catch(i){t.log.warn("Failed to clone canvas",i)}return n}function nn(e,t){var n;try{if((n=e==null?void 0:e.contentDocument)!=null&&n.body)return ct(e.contentDocument.body,t)}catch(o){t.log.warn("Failed to clone iframe",o)}return e.cloneNode(!1)}function on(e){let t=e.cloneNode(!1);return e.currentSrc&&e.currentSrc!==e.src&&(t.src=e.currentSrc,t.srcset=""),t.loading==="lazy"&&(t.loading="eager"),t}async function rn(e,t){if(e.ownerDocument&&!e.currentSrc&&e.poster)return R(e.poster,e.ownerDocument);let n=e.cloneNode(!1);n.crossOrigin="anonymous",e.currentSrc&&e.currentSrc!==e.src&&(n.src=e.currentSrc);let o=n.ownerDocument;if(o){let r=!0;if(await _(n,{onError:()=>r=!1,onWarn:t.log.warn}),!r)return e.poster?R(e.poster,e.ownerDocument):n;n.currentTime=e.currentTime,await new Promise(s=>{n.addEventListener("seeked",s,{once:!0})});let i=o.createElement("canvas");i.width=e.offsetWidth,i.height=e.offsetHeight;try{let s=i.getContext("2d");s&&s.drawImage(n,0,0,i.width,i.height)}catch(s){return t.log.warn("Failed to clone video",s),e.poster?R(e.poster,e.ownerDocument):n}return Dt(i,t)}return n}function sn(e,t){return $e(e)?Dt(e,t):je(e)?nn(e,t):B(e)?on(e):X(e)?rn(e,t):e.cloneNode(!1)}function an(e){let t=e.sandbox;if(!t){let{ownerDocument:n}=e;try{n&&(t=n.createElement("iframe"),t.id=`__SANDBOX__${_t()}`,t.width="0",t.height="0",t.style.visibility="hidden",t.style.position="fixed",n.body.appendChild(t),t.srcdoc='<!DOCTYPE html><meta charset="UTF-8"><title></title><body>',e.sandbox=t)}catch(o){e.log.warn("Failed to getSandBox",o)}}return t}var ln=["width","height","-webkit-text-fill-color"],cn=["stroke","fill"];function jt(e,t,n){let{defaultComputedStyles:o}=n,r=e.nodeName.toLowerCase(),i=U(e)&&r!=="svg",s=i?cn.map(p=>[p,e.getAttribute(p)]).filter(([,p])=>p!==null):[],a=[i&&"svg",r,s.map((p,f)=>`${p}=${f}`).join(","),t].filter(Boolean).join(":");if(o.has(a))return o.get(a);let c=an(n),u=c==null?void 0:c.contentWindow;if(!u)return new Map;let l=u==null?void 0:u.document,h,d;i?(h=l.createElementNS(G,"svg"),d=h.ownerDocument.createElementNS(h.namespaceURI,r),s.forEach(([p,f])=>{d.setAttributeNS(null,p,f)}),h.appendChild(d)):h=d=l.createElement(r),d.textContent=" ",l.body.appendChild(h);let m=u.getComputedStyle(d,t),g=new Map;for(let p=m.length,f=0;f<p;f++){let v=m.item(f);ln.includes(v)||g.set(v,m.getPropertyValue(v))}return l.body.removeChild(h),o.set(a,g),g}function Ht(e,t,n){var a;let o=new Map,r=[],i=new Map;if(n)for(let c of n)s(c);else for(let c=e.length,u=0;u<c;u++){let l=e.item(u);s(l)}for(let c=r.length,u=0;u<c;u++)(a=i.get(r[u]))==null||a.forEach((l,h)=>o.set(h,l));function s(c){let u=e.getPropertyValue(c),l=e.getPropertyPriority(c),h=c.lastIndexOf("-"),d=h>-1?c.substring(0,h):void 0;if(d){let m=i.get(d);m||(m=new Map,i.set(d,m)),m.set(c,[u,l])}t.get(c)===u&&!l||(d?r.push(d):o.set(c,[u,l]))}return o}function dn(e,t,n,o){var h,d,m,g;let{ownerWindow:r,includeStyleProperties:i,currentParentNodeStyle:s}=o,a=t.style,c=r.getComputedStyle(e),u=jt(e,null,o);s==null||s.forEach((p,f)=>{u.delete(f)});let l=Ht(c,u,i);l.delete("transition-property"),l.delete("all"),l.delete("d"),l.delete("content"),n&&(l.delete("margin-top"),l.delete("margin-right"),l.delete("margin-bottom"),l.delete("margin-left"),l.delete("margin-block-start"),l.delete("margin-block-end"),l.delete("margin-inline-start"),l.delete("margin-inline-end"),l.set("box-sizing",["border-box",""])),((h=l.get("background-clip"))==null?void 0:h[0])==="text"&&t.classList.add("______background-clip--text"),$t&&(l.has("font-kerning")||l.set("font-kerning",["normal",""]),(((d=l.get("overflow-x"))==null?void 0:d[0])==="hidden"||((m=l.get("overflow-y"))==null?void 0:m[0])==="hidden")&&((g=l.get("text-overflow"))==null?void 0:g[0])==="ellipsis"&&e.scrollWidth===e.clientWidth&&l.set("text-overflow",["clip",""]));for(let p=a.length,f=0;f<p;f++)a.removeProperty(a.item(f));return l.forEach(([p,f],v)=>{a.setProperty(v,p,f)}),l}function un(e,t){(Fe(e)||Ne(e)||Ue(e))&&t.setAttribute("value",e.value)}var hn=["::before","::after"],pn=["::-webkit-scrollbar","::-webkit-scrollbar-button","::-webkit-scrollbar-thumb","::-webkit-scrollbar-track","::-webkit-scrollbar-track-piece","::-webkit-scrollbar-corner","::-webkit-resizer"];function mn(e,t,n,o,r){let{ownerWindow:i,svgStyleElement:s,svgStyles:a,currentNodeStyle:c}=o;if(!s||!i)return;function u(l){var b;let h=i.getComputedStyle(e,l),d=h.getPropertyValue("content");if(!d||d==="none")return;r==null||r(d),d=d.replace(/(')|(")|(counter\(.+\))/g,"");let m=[_t()],g=jt(e,l,o);c==null||c.forEach((y,k)=>{g.delete(k)});let p=Ht(h,g,o.includeStyleProperties);p.delete("content"),p.delete("-webkit-locale"),((b=p.get("background-clip"))==null?void 0:b[0])==="text"&&t.classList.add("______background-clip--text");let f=[`content: '${d}';`];if(p.forEach(([y,k],x)=>{f.push(`${x}: ${y}${k?" !important":""};`)}),f.length===1)return;try{t.className=[t.className,...m].join(" ")}catch(y){o.log.warn("Failed to copyPseudoClass",y);return}let v=f.join(`
  `),w=a.get(v);w||(w=[],a.set(v,w)),w.push(`.${m[0]}${l}`)}hn.forEach(u),n&&pn.forEach(u)}var St=new Set(["symbol"]);async function At(e,t,n,o,r){if(S(n)&&(_e(n)||Oe(n))||o.filter&&!o.filter(n))return;St.has(t.nodeName)||St.has(n.nodeName)?o.currentParentNodeStyle=void 0:o.currentParentNodeStyle=o.currentNodeStyle;let i=await ct(n,o,!1,r);o.isEnable("restoreScrollPosition")&&fn(e,i),t.appendChild(i)}async function Ct(e,t,n,o){var i;let r=e.firstChild;S(e)&&e.shadowRoot&&(r=(i=e.shadowRoot)==null?void 0:i.firstChild,n.shadowRoots.push(e.shadowRoot));for(let s=r;s;s=s.nextSibling)if(!Be(s))if(S(s)&&De(s)&&typeof s.assignedNodes=="function"){let a=s.assignedNodes();for(let c=0;c<a.length;c++)await At(e,t,a[c],n,o)}else await At(e,t,s,n,o)}function fn(e,t){if(!N(e)||!N(t))return;let{scrollTop:n,scrollLeft:o}=e;if(!n&&!o)return;let{transform:r}=t.style,i=new DOMMatrix(r),{a:s,b:a,c,d:u}=i;i.a=1,i.b=0,i.c=0,i.d=1,i.translateSelf(-o,-n),i.a=s,i.b=a,i.c=c,i.d=u,t.style.transform=i.toString()}function gn(e,t){let{backgroundColor:n,width:o,height:r,style:i}=t,s=e.style;if(n&&s.setProperty("background-color",n,"important"),o&&s.setProperty("width",`${o}px`,"important"),r&&s.setProperty("height",`${r}px`,"important"),i)for(let a in i)s[a]=i[a]}var vn=/^[\w-:]+$/;async function ct(e,t,n=!1,o){var u,l,h,d;let{ownerDocument:r,ownerWindow:i,fontFamilies:s,onCloneEachNode:a}=t;if(r&&Ie(e))return o&&/\S/.test(e.data)&&o(e.data),r.createTextNode(e.data);if(r&&i&&S(e)&&(N(e)||U(e))){let m=await sn(e,t);if(t.isEnable("removeAbnormalAttributes")){let b=m.getAttributeNames();for(let y=b.length,k=0;k<y;k++){let x=b[k];vn.test(x)||m.removeAttribute(x)}}let g=t.currentNodeStyle=dn(e,m,n,t);n&&gn(m,t);let p=!1;if(t.isEnable("copyScrollbar")){let b=[(u=g.get("overflow-x"))==null?void 0:u[0],(l=g.get("overflow-y"))==null?void 0:l[0]];p=b.includes("scroll")||(b.includes("auto")||b.includes("overlay"))&&(e.scrollHeight>e.clientHeight||e.scrollWidth>e.clientWidth)}let f=(h=g.get("text-transform"))==null?void 0:h[0],v=Ot((d=g.get("font-family"))==null?void 0:d[0]),w=v?b=>{f==="uppercase"?b=b.toUpperCase():f==="lowercase"?b=b.toLowerCase():f==="capitalize"&&(b=b[0].toUpperCase()+b.substring(1)),v.forEach(y=>{let k=s.get(y);k||s.set(y,k=new Set),b.split("").forEach(x=>k.add(x))})}:void 0;return mn(e,m,p,t,w),un(e,m),X(e)||await Ct(e,m,t,w),await(a==null?void 0:a(m)),m}let c=e.cloneNode(!1);return await Ct(e,c,t),await(a==null?void 0:a(c)),c}function bn(e){if(e.ownerDocument=void 0,e.ownerWindow=void 0,e.svgStyleElement=void 0,e.svgDefsElement=void 0,e.svgStyles.clear(),e.defaultComputedStyles.clear(),e.sandbox){try{e.sandbox.remove()}catch(t){e.log.warn("Failed to destroyContext",t)}e.sandbox=void 0}e.workers=[],e.fontFamilies.clear(),e.fontCssTexts.clear(),e.requests.clear(),e.tasks=[],e.shadowRoots=[]}function wn(e){let a=e,{url:t,timeout:n,responseType:o}=a,r=kt(a,["url","timeout","responseType"]),i=new AbortController,s=n?setTimeout(()=>i.abort(),n):void 0;return fetch(t,E({signal:i.signal},r)).then(c=>{if(!c.ok)throw new Error("Failed fetch, not 2xx response",{cause:c});switch(o){case"arrayBuffer":return c.arrayBuffer();case"dataUrl":return c.blob().then(Xe);default:return c.text()}}).finally(()=>clearTimeout(s))}function O(e,t){let{url:n,requestType:o="text",responseType:r="text",imageDom:i}=t,s=n,{timeout:a,acceptOfImage:c,requests:u,fetchFn:l,fetch:{requestInit:h,bypassingCache:d,placeholderImage:m},font:g,workers:p,fontFamilies:f}=e;o==="image"&&(K||lt)&&e.drawImageCount++;let v=u.get(n);if(!v){d&&d instanceof RegExp&&d.test(s)&&(s+=(/\?/.test(s)?"&":"?")+new Date().getTime());let w=o.startsWith("font")&&g&&g.minify,b=new Set;w&&o.split(";")[1].split(",").forEach(P=>{f.has(P)&&f.get(P).forEach(M=>b.add(M))});let y=w&&b.size,k=E({url:s,timeout:a,responseType:y?"arrayBuffer":r,headers:o==="image"?{accept:c}:void 0},h);v={type:o,resolve:void 0,reject:void 0,response:null},v.response=(async()=>{if(l&&o==="image"){let x=await l(n);if(x)return x}return!K&&n.startsWith("http")&&p.length?new Promise((x,P)=>{p[u.size&p.length-1].postMessage(E({rawUrl:n},k)),v.resolve=x,v.reject=P}):wn(k)})().catch(x=>{if(u.delete(n),o==="image"&&m)return e.log.warn("Failed to fetch image base64, trying to use placeholder image",s),typeof m=="string"?m:m(i);throw x}),u.set(n,v)}return v.response}async function qt(e,t,n,o){if(!Vt(e))return e;for(let[r,i]of yn(e,t))try{let s=await O(n,{url:i,requestType:o?"image":"text",responseType:"dataUrl"});e=e.replace(kn(r),`$1${s}$3`)}catch(s){n.log.warn("Failed to fetch css data url",r,s)}return e}function Vt(e){return/url\((['"]?)([^'"]+?)\1\)/.test(e)}var Wt=/url\((['"]?)([^'"]+?)\1\)/g;function yn(e,t){let n=[];return e.replace(Wt,(o,r,i)=>(n.push([i,Nt(i,t)]),o)),n.filter(([o])=>!it(o))}function kn(e){let t=e.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`,"g")}var xn=["background-image","border-image-source","-webkit-border-image","-webkit-mask-image","list-style-image"];function En(e,t){return xn.map(n=>{let o=e.getPropertyValue(n);return!o||o==="none"?null:((K||lt)&&t.drawImageCount++,qt(o,null,t,!0).then(r=>{!r||o===r||e.setProperty(n,r,e.getPropertyPriority(n))}))}).filter(Boolean)}function Sn(e,t){if(B(e)){let n=e.currentSrc||e.src;if(!it(n))return[O(t,{url:n,imageDom:e,requestType:"image",responseType:"dataUrl"}).then(o=>{o&&(e.srcset="",e.dataset.originalSrc=n,e.src=o||"")})];(K||lt)&&t.drawImageCount++}else if(U(e)&&!it(e.href.baseVal)){let n=e.href.baseVal;return[O(t,{url:n,imageDom:e,requestType:"image",responseType:"dataUrl"}).then(o=>{o&&(e.dataset.originalSrc=n,e.href.baseVal=o||"")})]}return[]}function An(e,t){var a;let{ownerDocument:n,svgDefsElement:o}=t,r=(a=e.getAttribute("href"))!=null?a:e.getAttribute("xlink:href");if(!r)return[];let[i,s]=r.split("#");if(s){let c=`#${s}`,u=t.shadowRoots.reduce((l,h)=>l!=null?l:h.querySelector(`svg ${c}`),n==null?void 0:n.querySelector(`svg ${c}`));if(i&&e.setAttribute("href",c),o!=null&&o.querySelector(c))return[];if(u)return o==null||o.appendChild(u.cloneNode(!0)),[];if(i)return[O(t,{url:i,responseType:"text"}).then(l=>{o==null||o.insertAdjacentHTML("beforeend",l)})]}return[]}function Kt(e,t){let{tasks:n}=t;S(e)&&((B(e)||Ft(e))&&n.push(...Sn(e,t)),Re(e)&&n.push(...An(e,t))),N(e)&&n.push(...En(e.style,t)),e.childNodes.forEach(o=>{Kt(o,t)})}async function Cn(e,t){let{ownerDocument:n,svgStyleElement:o,fontFamilies:r,fontCssTexts:i,tasks:s,font:a}=t;if(!(!n||!o||!r.size))if(a&&a.cssText){let c=Pt(a.cssText,t);o.appendChild(n.createTextNode(`${c}
`))}else{let c=Array.from(n.styleSheets).filter(l=>{try{return"cssRules"in l&&!!l.cssRules.length}catch(h){return t.log.warn(`Error while reading CSS rules from ${l.href}`,h),!1}});await Promise.all(c.flatMap(l=>Array.from(l.cssRules).map(async(h,d)=>{if(Le(h)){let m=d+1,g=h.href,p="";try{p=await O(t,{url:g,requestType:"text",responseType:"text"})}catch(v){t.log.warn(`Error fetch remote css import from ${g}`,v)}let f=p.replace(Wt,(v,w,b)=>v.replace(b,Nt(b,g)));for(let v of Pn(f))try{l.insertRule(v,v.startsWith("@import")?m+=1:l.cssRules.length)}catch(w){t.log.warn("Error inserting rule from remote css import",{rule:v,error:w})}}})));let u=[];c.forEach(l=>{st(l.cssRules,u)}),u.filter(l=>{var h;return Me(l)&&Vt(l.style.getPropertyValue("src"))&&((h=Ot(l.style.getPropertyValue("font-family")))==null?void 0:h.some(d=>r.has(d)))}).forEach(l=>{let h=l,d=i.get(h.cssText);d?o.appendChild(n.createTextNode(`${d}
`)):s.push(qt(h.cssText,h.parentStyleSheet?h.parentStyleSheet.href:null,t).then(m=>{m=Pt(m,t),i.set(h.cssText,m),o.appendChild(n.createTextNode(`${m}
`))}))})}}var Tn=/(\/\*[\s\S]*?\*\/)/g,Tt=/((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi;function Pn(e){if(e==null)return[];let t=[],n=e.replace(Tn,"");for(;;){let i=Tt.exec(n);if(!i)break;t.push(i[0])}n=n.replace(Tt,"");let o=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,r=new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})","gi");for(;;){let i=o.exec(n);if(i)r.lastIndex=o.lastIndex;else if(i=r.exec(n),i)o.lastIndex=r.lastIndex;else break;t.push(i[0])}return t}var Mn=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Ln=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Pt(e,t){let{font:n}=t,o=n?n==null?void 0:n.preferredFormat:void 0;return o?e.replace(Ln,r=>{for(;;){let[i,,s]=Mn.exec(r)||[];if(!s)return"";if(s===o)return`src: ${i};`}}):e}function st(e,t=[]){for(let n of Array.from(e))ze(n)?t.push(...st(n.cssRules)):"cssRules"in n?st(n.cssRules,t):t.push(n);return t}async function zn(e,t){let n=await J(e,t);if(S(n.node)&&U(n.node))return n.node;let{ownerDocument:o,log:r,tasks:i,svgStyleElement:s,svgDefsElement:a,svgStyles:c,font:u,progress:l,autoDestruct:h,onCloneNode:d,onEmbedNode:m,onCreateForeignObjectSvg:g}=n;r.time("clone node");let p=await ct(n.node,n,!0);if(s&&o){let y="";c.forEach((k,x)=>{y+=`${k.join(`,
`)} {
  ${x}
}
`}),s.appendChild(o.createTextNode(y))}r.timeEnd("clone node"),await(d==null?void 0:d(p)),u!==!1&&S(p)&&(r.time("embed web font"),await Cn(p,n),r.timeEnd("embed web font")),r.time("embed node"),Kt(p,n);let f=i.length,v=0,w=async()=>{for(;;){let y=i.pop();if(!y)break;try{await y}catch(k){n.log.warn("Failed to run task",k)}l==null||l(++v,f)}};l==null||l(v,f),await Promise.all([...Array.from({length:4})].map(w)),r.timeEnd("embed node"),await(m==null?void 0:m(p));let b=Rn(p,n);return a&&b.insertBefore(a,b.children[0]),s&&b.insertBefore(s,b.children[0]),h&&bn(n),await(g==null?void 0:g(b)),b}function Rn(e,t){let{width:n,height:o}=t,r=Ve(n,o,e.ownerDocument),i=r.ownerDocument.createElementNS(r.namespaceURI,"foreignObject");return i.setAttributeNS(null,"x","0%"),i.setAttributeNS(null,"y","0%"),i.setAttributeNS(null,"width","100%"),i.setAttributeNS(null,"height","100%"),i.append(e),r.appendChild(i),r}async function Bn(e,t){var s;let n=await J(e,t),o=await zn(n),r=We(o,n.isEnable("removeControlCharacter"));n.autoDestruct||(n.svgStyleElement=Ut(n.ownerDocument),n.svgDefsElement=(s=n.ownerDocument)==null?void 0:s.createElementNS(G,"defs"),n.svgStyles.clear());let i=R(r,o.ownerDocument);return await tn(i,n)}async function In(e,t){let n=await J(e,t),{log:o,quality:r,type:i,dpi:s}=n,a=await Bn(n);o.time("canvas to data url");let c=a.toDataURL(i,r);if(["image/png","image/jpeg"].includes(i)&&s&&Ce&&Te){let[u,l]=c.split(","),h=0,d=!1;if(i==="image/png"){let b=Se(l);b>=0?(h=Math.ceil((b+28)/3)*4,d=!0):h=33/3*4}else i==="image/jpeg"&&(h=18/3*4);let m=l.substring(0,h),g=l.substring(h),p=window.atob(m),f=new Uint8Array(p.length);for(let b=0;b<f.length;b++)f[b]=p.charCodeAt(b);let v=i==="image/png"?ye(f,s,d):ge(f,s),w=window.btoa(String.fromCharCode(...v));c=[u,",",w,g].join("")}return o.timeEnd("canvas to data url"),c}async function dt(e,t){return In(await J(e,L(E({},t),{type:"image/png"})))}function Xt(e){var t;return!((t=e.getAttribute)!=null&&t.call(e,"data-instruckt"))}function $n(){if(document.querySelector("[data-flux], flux\\:button, flux\\:input"))return!0;for(let e of document.body.querySelectorAll("*"))if(e.shadowRoot&&!e.hasAttribute("data-instruckt"))return!0;return!1}var ut=null;function Yt(){return ut===null&&(ut=$n()),ut}var z=null;async function Gt(){return z&&z.active||(z=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser"},preferCurrentTab:!0}),z.getVideoTracks()[0].addEventListener("ended",()=>{z=null})),z}async function Fn(e){let t=document.createElement("video");t.srcObject=e,t.muted=!0,await t.play(),await new Promise(o=>requestAnimationFrame(()=>requestAnimationFrame(o)));let n=await createImageBitmap(t);return t.pause(),t.srcObject=null,n}function Jt(e,t){return Fn(e).then(n=>{let o=window.devicePixelRatio||1,r=document.createElement("canvas");return r.width=t.width*o,r.height=t.height*o,r.getContext("2d").drawImage(n,t.x*o,t.y*o,t.width*o,t.height*o,0,0,r.width,r.height),n.close(),r.toDataURL("image/png")})}async function Zt(e){if(!Yt())try{let t=await dt(e,{scale:2,filter:Xt});if(t)return t}catch(t){}try{let t=await Gt();return await Jt(t,e.getBoundingClientRect())}catch(t){return console.warn("[instruckt] captureElement failed:",t),null}}async function Qt(e){if(!Yt())try{let t=await dt(document.body,{scale:2,filter:Xt});if(t)return await Nn(t,e)}catch(t){}try{let t=await Gt();return await Jt(t,e)}catch(t){return console.warn("[instruckt] captureRegion failed:",t),null}}function Nn(e,t){return new Promise((n,o)=>{let r=new Image;r.onload=()=>{let s=document.createElement("canvas");s.width=t.width*2,s.height=t.height*2,s.getContext("2d").drawImage(r,t.x*2,t.y*2,t.width*2,t.height*2,0,0,t.width*2,t.height*2),n(s.toDataURL("image/png"))},r.onerror=o,r.src=e})}function te(){return new Promise(e=>{let t=document.createElement("div");Object.assign(t.style,{position:"fixed",inset:"0",zIndex:"2147483647",cursor:"crosshair",background:"rgba(0,0,0,0.1)"}),t.setAttribute("data-instruckt","region-select");let n=document.createElement("div");Object.assign(n.style,{position:"fixed",border:"2px dashed #6366f1",background:"rgba(99,102,241,0.08)",borderRadius:"4px",display:"none",pointerEvents:"none"}),t.appendChild(n);let o=0,r=0,i=!1,s=d=>{o=d.clientX,r=d.clientY,i=!0,n.style.display="block",c(d)},a=d=>{i&&c(d)},c=d=>{let m=Math.min(o,d.clientX),g=Math.min(r,d.clientY),p=Math.abs(d.clientX-o),f=Math.abs(d.clientY-r);Object.assign(n.style,{left:`${m}px`,top:`${g}px`,width:`${p}px`,height:`${f}px`})},u=d=>{if(!i)return;i=!1;let m=Math.min(o,d.clientX),g=Math.min(r,d.clientY),p=Math.abs(d.clientX-o),f=Math.abs(d.clientY-r);h(),p<10||f<10?e(null):e(new DOMRect(m,g,p,f))},l=d=>{d.key==="Escape"&&(h(),e(null))},h=()=>{t.remove(),document.removeEventListener("keydown",l,!0)};t.addEventListener("mousedown",s),t.addEventListener("mousemove",a),t.addEventListener("mouseup",u),document.addEventListener("keydown",l,!0),document.body.appendChild(t)})}function _n(e,t){return e?e.startsWith("data:")?e:`${t!=null?t:"/instruckt"}/${e}`:null}function T(e){return String(e!=null?e:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Z=class{constructor(){this.host=null;this.shadow=null;this.boundOutside=t=>{this.host&&!this.host.contains(t.target)&&this.destroy()}}showNew(t,n){var g,p;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let o=document.createElement("style");o.textContent=nt,this.shadow.appendChild(o);let r=document.createElement("div");r.className="popup";let i=t.framework?`<div class="fw-badge">${T(t.framework.component)}</div>`:"",s=t.selectedText?`<div class="selected-text">"${T(t.selectedText.slice(0,80))}"</div>`:"",a=!!t.screenshot;r.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${T(t.elementPath)}">${T(t.elementLabel)}</span>
        <button class="close-btn" title="Cancel (Esc)">\u2715</button>
      </div>
      ${i}${s}
      <div class="screenshot-slot">${a?`<div class="screenshot-preview"><img src="${t.screenshot}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`:'<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>'}</div>
      <textarea placeholder="${a?"Add a note (optional)":"What needs to change here?"}" rows="3"></textarea>
      <div class="actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="submit" ${a?"":"disabled"}>Add note</button>
      </div>
    `;let c=(g=t.screenshot)!=null?g:null,u=r.querySelector("textarea"),l=r.querySelector('[data-action="submit"]'),h=r.querySelector(".screenshot-slot"),d=()=>{l.disabled=!c&&u.value.trim().length===0},m=()=>{let f=h.querySelector('[data-action="capture"]');f==null||f.addEventListener("click",async()=>{f.textContent="Capturing...";let w=await Zt(t.element);w?(c=w,h.innerHTML=`<div class="screenshot-preview"><img src="${w}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`,u.placeholder="Add a note (optional)",m(),d()):(f.textContent="Capture failed",setTimeout(()=>{f.parentElement&&(f.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot')},1500))});let v=h.querySelector(".screenshot-remove");v==null||v.addEventListener("click",()=>{c=null,h.innerHTML='<button class="btn-capture" data-action="capture"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Capture screenshot</button>',u.placeholder="What needs to change here?",m(),d()})};m(),u.addEventListener("input",d),u.addEventListener("keydown",f=>{f.stopPropagation(),f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),l.disabled||l.click()),f.key==="Escape"&&(n.onCancel(),this.destroy())}),r.querySelector('[data-action="cancel"]').addEventListener("click",()=>{n.onCancel(),this.destroy()}),r.querySelector(".close-btn").addEventListener("click",()=>{n.onCancel(),this.destroy()}),l.addEventListener("click",()=>{let f=u.value.trim();!f&&!c||(n.onSubmit({comment:f||"(screenshot)",screenshot:c!=null?c:void 0}),this.destroy())}),this.shadow.appendChild(r),((p=document.getElementById("instruckt-root"))!=null?p:document.body).appendChild(this.host),this.positionHost(t.x,t.y),this.setupOutsideClick(),u.focus()}showEdit(t,n,o){var f;this.destroy(),this.host=document.createElement("div"),this.host.setAttribute("data-instruckt","popup"),this.stopHostPropagation(this.host),this.shadow=this.host.attachShadow({mode:"open"});let r=document.createElement("style");r.textContent=nt,this.shadow.appendChild(r);let i=document.createElement("div");i.className="popup";let s=t.framework?`<div class="fw-badge">${T(t.framework.component)}</div>`:"",a=_n(t.screenshot,o),c=a?`<div class="screenshot-preview screenshot-slot"><img src="${a}" alt="Screenshot" /><button class="screenshot-remove" title="Remove screenshot">\u2715</button></div>`:"",u=t.comment==="(screenshot)"?"":t.comment;i.innerHTML=`
      <div class="header">
        <span class="element-tag" title="${T(t.elementPath)}">${T(t.element)}</span>
        <button class="close-btn">\u2715</button>
      </div>
      ${s}${c}
      <textarea rows="3">${T(u)}</textarea>
      <div class="actions">
        <button class="btn-danger" data-action="delete">Remove</button>
        <button class="btn-primary" data-action="save">Save</button>
      </div>
    `,i.querySelector(".close-btn").addEventListener("click",()=>this.destroy());let l=i.querySelector(".screenshot-remove");l==null||l.addEventListener("click",()=>{n.onSave(t,t.comment);let v=i.querySelector(".screenshot-slot");v&&v.remove()});let h=i.querySelector("textarea"),d=i.querySelector('[data-action="save"]'),m=i.querySelector('[data-action="delete"]');h.addEventListener("keydown",v=>{v.stopPropagation(),v.key==="Enter"&&!v.shiftKey&&(v.preventDefault(),d.click()),v.key==="Escape"&&this.destroy()}),d.addEventListener("click",()=>{let v=h.value.trim();v&&(n.onSave(t,v),this.destroy())}),m.addEventListener("click",()=>{n.onDelete(t),this.destroy()}),this.shadow.appendChild(i),((f=document.getElementById("instruckt-root"))!=null?f:document.body).appendChild(this.host);let g=t.x/100*window.innerWidth,p=t.y-window.scrollY;this.positionHost(g,p),this.setupOutsideClick(),h.focus(),h.setSelectionRange(h.value.length,h.value.length)}stopHostPropagation(t){for(let n of["click","mousedown","pointerdown","keydown","keyup","keypress","submit"])t.addEventListener(n,o=>o.stopPropagation())}positionHost(t,n){if(this.host){this.host.setAttribute("popover","manual");try{this.host.showPopover()}catch(o){}Object.assign(this.host.style,{position:"fixed",zIndex:"2147483647",left:"-9999px",top:"0"}),requestAnimationFrame(()=>{var u,l;if(!this.host)return;let o=360,r=(l=(u=this.host.querySelector(".popup"))==null?void 0:u.getBoundingClientRect().height)!=null?l:300,i=window.innerWidth,s=window.innerHeight,a=Math.max(10,Math.min(t+10,i-o)),c=Math.max(10,Math.min(n+10,s-r-10));Object.assign(this.host.style,{left:`${a}px`,top:`${c}px`})})}}setupOutsideClick(){setTimeout(()=>document.addEventListener("mousedown",this.boundOutside),0)}destroy(){var t;(t=this.host)==null||t.remove(),this.host=null,this.shadow=null,document.removeEventListener("mousedown",this.boundOutside)}};var D=class{constructor(t){this.onClick=t;this.markers=new Map;var o;this.container=document.createElement("div"),Object.assign(this.container.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147483645"}),this.container.setAttribute("data-instruckt","markers"),((o=document.getElementById("instruckt-root"))!=null?o:document.body).appendChild(this.container)}upsert(t,n){let o=this.markers.get(t.id);if(o){this.updateStyle(o.el,t);return}let r=document.createElement("div"),i=t.screenshot?" has-screenshot":"";r.className=`ik-marker ${this.statusClass(t.status)}${i}`,r.textContent=String(n),r.title=t.comment==="(screenshot)"?"Screenshot":t.comment.slice(0,60),r.style.pointerEvents="all",r.style.left=`${t.x/100*window.innerWidth}px`,r.style.top=`${t.y-window.scrollY}px`,r.addEventListener("click",s=>{s.stopPropagation(),this.onClick(t)}),this.container.appendChild(r),this.markers.set(t.id,{el:r,annotationId:t.id})}update(t){let n=this.markers.get(t.id);n&&this.updateStyle(n.el,t)}updateStyle(t,n){let o=n.screenshot?" has-screenshot":"";t.className=`ik-marker ${this.statusClass(n.status)}${o}`,t.title=n.comment==="(screenshot)"?"Screenshot":n.comment.slice(0,60)}statusClass(t){return t==="resolved"?"resolved":t==="dismissed"?"dismissed":""}reposition(t){t.forEach(n=>{let o=this.markers.get(n.id);o&&(o.el.style.left=`${n.x/100*window.innerWidth}px`,o.el.style.top=`${n.y-window.scrollY}px`)})}remove(t){let n=this.markers.get(t);n&&(n.el.remove(),this.markers.delete(t))}setVisible(t){this.container.style.display=t?"":"none"}clear(){for(let{el:t}of this.markers.values())t.remove();this.markers.clear()}destroy(){this.container.remove(),this.markers.clear()}};function ht(e){if(e.id)return`#${CSS.escape(e.id)}`;let t=[],n=e;for(;n&&n!==document.documentElement;){let o=n.tagName.toLowerCase(),r=n.parentElement;if(!r){t.unshift(o);break}let i=Array.from(n.classList).filter(a=>!a.match(/^(hover|focus|active|visited|is-|has-)/)).slice(0,3);if(i.length>0){let a=`${o}.${i.map(CSS.escape).join(".")}`;if(r.querySelectorAll(a).length===1){t.unshift(a);break}}let s=Array.from(r.children).filter(a=>a.tagName===n.tagName);if(s.length===1)t.unshift(o);else{let a=s.indexOf(n)+1;t.unshift(`${o}:nth-of-type(${a})`)}n=r}return t.join(" > ")}function pt(e){let t=e.tagName.toLowerCase(),n=e.getAttribute("wire:model")||e.getAttribute("wire:click");if(n)return`${t}[wire:${n.split(".")[0]}]`;if(e.id)return`${t}#${e.id}`;let o=e.classList[0];return o?`${t}.${o}`:t}function mt(e){let t=e.tagName.toLowerCase(),n=(e.textContent||"").trim().replace(/\s+/g," ").slice(0,40),o=[];e.id&&o.push(`id="${e.id}"`);let r=e.getAttribute("role");r&&o.push(`role="${r}"`);let i=e.getAttribute("wire:model")||e.getAttribute("wire:click");i&&o.push(`wire:${e.hasAttribute("wire:model")?"model":"click"}="${i}"`);let s=o.length?" "+o.join(" "):"",a=`<${t}${s}>`;return n?`${a} ${n}`:a}function ft(e){return(e.textContent||"").trim().replace(/\s+/g," ").slice(0,120)}function gt(e){return Array.from(e.classList).filter(t=>!t.match(/^(instruckt-)/)).join(" ")}function vt(e){let t=e.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function On(){return typeof window.Livewire!="undefined"}function Un(e){let t=e;for(;t&&t!==document.documentElement;){if(t.getAttribute("wire:id"))return t;t=t.parentElement}return null}function ee(e){var i,s;if(!On())return null;let t=Un(e);if(!t)return null;let n=t.getAttribute("wire:id"),o="Unknown",r=t.getAttribute("wire:snapshot");if(r)try{let a=JSON.parse(r);o=(s=(i=a==null?void 0:a.memo)==null?void 0:i.name)!=null?s:"Unknown"}catch(a){}return{framework:"livewire",component:o,wire_id:n}}function jn(e){var n;let t=e;for(;t&&t!==document.documentElement;){let o=(n=t.__vueParentComponent)!=null?n:t.__vue__;if(o)return o;t=t.parentElement}return null}function ne(e){var r,i,s,a,c,u,l,h;let t=jn(e);if(!t)return null;let n=(h=(l=(c=(s=(r=t.$options)==null?void 0:r.name)!=null?s:(i=t.$options)==null?void 0:i.__name)!=null?c:(a=t.type)==null?void 0:a.name)!=null?l:(u=t.type)==null?void 0:u.__name)!=null?h:"Anonymous",o={};if(t.props&&Object.assign(o,t.props),t.setupState){for(let[d,m]of Object.entries(t.setupState))if(!d.startsWith("_")&&typeof m!="function")try{o[d]=JSON.parse(JSON.stringify(m))}catch(g){o[d]=String(m)}}return{framework:"vue",component:n,component_uid:t.uid!==void 0?String(t.uid):void 0,data:o}}function qn(e){let t=e;for(;t&&t!==document.documentElement;){if(t.__svelte_meta)return t.__svelte_meta;t=t.parentElement}return null}function oe(e){var r,i,s,a;let t=qn(e);if(!t)return null;let n=(i=(r=t.loc)==null?void 0:r.file)!=null?i:"";return{framework:"svelte",component:n&&(a=(s=n.split("/").pop())==null?void 0:s.replace(/\.svelte$/,""))!=null?a:"Unknown",data:n?{file:n}:void 0}}function Wn(e){for(let t of Object.keys(e))if(t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$"))return t;return null}function Kn(e){let t=e;for(;t;){let{type:n}=t;if(typeof n=="function"&&n.name){let o=n.name;if(o[0]===o[0].toUpperCase()&&o.length>1)return o}if(typeof n=="object"&&n!==null&&n.displayName)return n.displayName;t=t.return}return"Component"}function Xn(e){var o,r;let t=(r=(o=e.memoizedProps)!=null?o:e.pendingProps)!=null?r:{},n={};for(let[i,s]of Object.entries(t))if(!(i==="children"||typeof s=="function"))try{n[i]=JSON.parse(JSON.stringify(s))}catch(a){n[i]=String(s)}return n}function re(e){let t=e;for(;t&&t!==document.documentElement;){let n=Wn(t);if(n){let o=t[n];if(o){let r=Kn(o),i=Xn(o);return{framework:"react",component:r,data:i}}}t=t.parentElement}return null}function ie(){return window.location.pathname}var j=class j{constructor(t){this.toolbar=null;this.highlight=null;this.popup=null;this.markers=null;this.annotations=[];this.isAnnotating=!1;this.isFrozen=!1;this.frozenStyleEl=null;this.frozenPopovers=[];this.rafId=null;this.pendingMouseTarget=null;this.highlightLocked=!1;this.pollTimer=null;this.boundReposition=()=>{var t;(t=this.markers)==null||t.reposition(this.annotations)};this.freezeBlockEvents=["click","mousedown","pointerdown","pointerup","mouseup","touchstart","touchend","auxclick"];this.freezePassiveEvents=["focusin","focusout","blur","pointerleave","mouseleave","mouseout"];this.boundFreezeClick=t=>{this.isInstruckt(t.target)||this.isAnnotating&&t.type==="click"||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation())};this.boundFreezeSubmit=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()};this.boundFreezePassive=t=>{t.stopPropagation(),t.stopImmediatePropagation()};this.boundMouseMove=t=>{this.highlightLocked||(this.pendingMouseTarget=t.target,this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{var n,o;this.rafId=null,!this.highlightLocked&&(this.pendingMouseTarget&&!this.isInstruckt(this.pendingMouseTarget)?(n=this.highlight)==null||n.show(this.pendingMouseTarget):(o=this.highlight)==null||o.hide())})))};this.boundMouseLeave=()=>{var t;this.highlightLocked||(t=this.highlight)==null||t.hide()};this.boundAnnotateBlock=t=>{this.isInstruckt(t.target)||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation())};this.boundClick=t=>{var d,m,g;let n=t.target;if(this.isInstruckt(n))return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation();let o=((d=window.getSelection())==null?void 0:d.toString().trim())||void 0,r=ht(n),i=pt(n),s=mt(n),a=gt(n),c=ft(n)||void 0,u=vt(n),l=(m=this.detectFramework(n))!=null?m:void 0;(g=this.highlight)==null||g.show(n),this.highlightLocked=!0;let h={element:n,elementPath:r,elementName:i,elementLabel:s,cssClasses:a,boundingBox:u,x:t.clientX,y:t.clientY,selectedText:o,nearbyText:c,framework:l};this.showAnnotationPopup(h)};this.config=E({adapters:["livewire","vue","svelte","react"],theme:"auto",position:"bottom-right"},t),this.api=new W(t.endpoint),this.boundKeydown=this.onKeydown.bind(this),this.init()}init(){ot(this.config.colors),this.config.theme!=="auto"&&document.documentElement.setAttribute("data-instruckt-theme",this.config.theme),this.toolbar=new $(this.config.position,{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onScreenshot:()=>this.startRegionCapture(),onCopy:()=>this.copyToClipboard(!0),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:t=>this.onMinimize(t)},this.config.keys),this.highlight=new F,this.popup=new Z,this.markers=new D(t=>this.onMarkerClick(t)),document.addEventListener("keydown",this.boundKeydown),window.addEventListener("scroll",this.boundReposition,{passive:!0}),window.addEventListener("resize",this.boundReposition,{passive:!0}),document.addEventListener("livewire:navigated",()=>this.reattach()),document.addEventListener("inertia:navigate",()=>this.syncMarkers()),window.addEventListener("popstate",()=>{setTimeout(()=>this.reattach(),0)}),this.loadAnnotations(),this.syncMarkers()}makeToolbarCallbacks(){return{onToggleAnnotate:t=>{this.setAnnotating(t)},onFreezeAnimations:t=>{this.setFrozen(t)},onScreenshot:()=>this.startRegionCapture(),onCopy:()=>this.copyToClipboard(!0),onClearPage:()=>this.clearPage(),onClearAll:()=>this.clearEverything(),onMinimize:t=>this.onMinimize(t)}}reattach(){var i,s;let t=this.isAnnotating,n=this.isFrozen,o=(s=(i=this.toolbar)==null?void 0:i.isMinimized())!=null?s:!1;this.isAnnotating&&this.detachAnnotateListeners(),this.isFrozen&&this.setFrozen(!1),this.isAnnotating=!1,this.isFrozen=!1,document.querySelectorAll("[data-instruckt]").forEach(a=>a.remove()),this.toolbar=new $(this.config.position,this.makeToolbarCallbacks()),o&&this.toolbar.minimize(),this.markers=new D(a=>this.onMarkerClick(a)),this.highlight=new F,o&&this.markers.setVisible(!1);let r=document.getElementById("instruckt-global");r&&r.remove(),ot(this.config.colors),this.syncMarkers(),t&&!o&&this.setAnnotating(!0)}onMinimize(t){var n,o,r,i,s;t?(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1),(n=this.toolbar)==null||n.setAnnotateActive(!1),(o=this.toolbar)==null||o.setFreezeActive(!1),(r=this.markers)==null||r.setVisible(!1),(i=this.popup)==null||i.destroy()):(s=this.markers)==null||s.setVisible(!0)}async loadAnnotations(){this.loadFromStorage();try{let t=await this.api.getAnnotations();if(t.length>0){let n=new Set(t.map(r=>r.id)),o=this.annotations.filter(r=>!n.has(r.id));this.annotations=[...t,...o],this.saveToStorage()}}catch(t){}this.syncMarkers()}saveToStorage(){try{localStorage.setItem(j.STORAGE_KEY,JSON.stringify(this.annotations))}catch(t){}}loadFromStorage(){try{let t=localStorage.getItem(j.STORAGE_KEY);t&&(this.annotations=JSON.parse(t))}catch(t){}}updatePolling(){let t=this.totalActiveCount()>0;t&&!this.pollTimer?this.pollTimer=setInterval(()=>this.pollForChanges(),3e3):!t&&this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}async pollForChanges(){try{let t=await this.api.getAnnotations(),n=!1;for(let o of t){let r=this.annotations.find(i=>i.id===o.id);r&&r.status!==o.status&&(r.status=o.status,r.resolvedAt=o.resolvedAt,r.resolvedBy=o.resolvedBy,n=!0)}n&&(this.saveToStorage(),this.syncMarkers())}catch(t){}}syncMarkers(){var o,r,i,s;(o=this.markers)==null||o.clear();let t=ie(),n=0;for(let a of this.annotations)a.status==="resolved"||a.status==="dismissed"||this.annotationPageKey(a)===t&&(n++,(r=this.markers)==null||r.upsert(a,n));(i=this.toolbar)==null||i.setAnnotationCount(this.pageAnnotations().length),(s=this.toolbar)==null||s.setTotalCount(this.totalActiveCount()),this.updatePolling()}annotationPageKey(t){try{return new URL(t.url).pathname}catch(n){return t.url}}pageAnnotations(){let t=ie();return this.annotations.filter(n=>this.annotationPageKey(n)===t&&n.status!=="resolved"&&n.status!=="dismissed")}totalActiveCount(){return this.annotations.filter(t=>t.status!=="resolved"&&t.status!=="dismissed").length}setAnnotating(t){var n,o;this.isAnnotating=t,(n=this.toolbar)==null||n.setAnnotateActive(t),t?this.attachAnnotateListeners():(this.detachAnnotateListeners(),(o=this.highlight)==null||o.hide(),this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)),this.updateFreezeStyles()}setFrozen(t){var n,o;if(this.isFrozen=t,(n=this.toolbar)==null||n.setFreezeActive(t),t){this.updateFreezeStyles(),this.freezePopovers();for(let r of this.freezeBlockEvents)window.addEventListener(r,this.boundFreezeClick,!0);window.addEventListener("submit",this.boundFreezeSubmit,!0);for(let r of this.freezePassiveEvents)window.addEventListener(r,this.boundFreezePassive,!0)}else{(o=this.frozenStyleEl)==null||o.remove(),this.frozenStyleEl=null,this.unfreezePopovers();for(let r of this.freezeBlockEvents)window.removeEventListener(r,this.boundFreezeClick,!0);window.removeEventListener("submit",this.boundFreezeSubmit,!0);for(let r of this.freezePassiveEvents)window.removeEventListener(r,this.boundFreezePassive,!0)}}freezePopovers(){this.frozenPopovers=[];let t=":popover-open, .\\:popover-open";document.querySelectorAll("[popover]").forEach(n=>{var a;let o=n,r=(a=o.getAttribute("popover"))!=null?a:"",i=!1;try{i=o.matches(t)}catch(c){try{i=o.matches(".\\:popover-open")}catch(u){}}if(!i)return;let s=o.getBoundingClientRect();this.frozenPopovers.push({el:o,original:r}),o.removeAttribute("popover"),o.style.setProperty("display","block","important"),o.style.setProperty("position","fixed","important"),o.style.setProperty("z-index","2147483644","important"),o.style.setProperty("top",`${s.top}px`,"important"),o.style.setProperty("left",`${s.left}px`,"important"),o.style.setProperty("width",`${s.width}px`,"important"),o.classList.add(":popover-open")})}unfreezePopovers(){for(let{el:t,original:n}of this.frozenPopovers){for(let o of["display","position","z-index","top","left","width"])t.style.removeProperty(o);t.classList.remove(":popover-open"),t.setAttribute("popover",n||"auto")}this.frozenPopovers=[]}updateFreezeStyles(){var n;if(!this.isFrozen)return;(n=this.frozenStyleEl)==null||n.remove(),this.frozenStyleEl=document.createElement("style"),this.frozenStyleEl.id="instruckt-freeze";let t=this.isAnnotating?"":`
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
      `,document.head.appendChild(this.frozenStyleEl)}showAnnotationPopup(t){var n;(n=this.popup)==null||n.showNew(t,{onSubmit:o=>{var r;this.highlightLocked=!1,(r=this.highlight)==null||r.hide(),this.submitAnnotation(t,o.comment,o.screenshot)},onCancel:()=>{var o;this.highlightLocked=!1,(o=this.highlight)==null||o.hide()}})}attachAnnotateListeners(){document.addEventListener("mousemove",this.boundMouseMove),document.addEventListener("mouseleave",this.boundMouseLeave);for(let t of["mousedown","pointerdown"])window.addEventListener(t,this.boundAnnotateBlock,!0);window.addEventListener("click",this.boundClick,!0)}detachAnnotateListeners(){document.removeEventListener("mousemove",this.boundMouseMove),document.removeEventListener("mouseleave",this.boundMouseLeave);for(let t of["mousedown","pointerdown"])window.removeEventListener(t,this.boundAnnotateBlock,!0);window.removeEventListener("click",this.boundClick,!0)}isInstruckt(t){return!t||!(t instanceof Element)?!1:t.closest("[data-instruckt]")!==null}async startRegionCapture(){var c,u;let t=this.isAnnotating;t&&this.setAnnotating(!1);let n=await te();if(!n){t&&this.setAnnotating(!0);return}let o=await Qt(n);if(!o){t&&this.setAnnotating(!0);return}let r=n.x+n.width/2,i=n.y+n.height/2,s=(c=document.elementFromPoint(r,i))!=null?c:document.body,a={element:s,elementPath:ht(s),elementName:pt(s),elementLabel:mt(s),cssClasses:gt(s),boundingBox:vt(s),x:r,y:i,nearbyText:ft(s)||void 0,screenshot:o,framework:(u=this.detectFramework(s))!=null?u:void 0};this.showAnnotationPopup(a)}detectFramework(t){var o;let n=(o=this.config.adapters)!=null?o:[];if(n.includes("livewire")){let r=ee(t);if(r)return r}if(n.includes("vue")){let r=ne(t);if(r)return r}if(n.includes("svelte")){let r=oe(t);if(r)return r}if(n.includes("react")){let r=re(t);if(r)return r}return null}async submitAnnotation(t,n,o){var s,a;let r={x:t.x/window.innerWidth*100,y:t.y+window.scrollY,comment:n,element:t.elementName,elementPath:t.elementPath,cssClasses:t.cssClasses,boundingBox:t.boundingBox,selectedText:t.selectedText,nearbyText:t.nearbyText,screenshot:o,intent:"fix",severity:"important",framework:t.framework,url:window.location.href},i;try{i=await this.api.addAnnotation(r)}catch(c){i=L(E({},r),{id:crypto.randomUUID(),status:"pending",createdAt:new Date().toISOString()})}this.annotations.push(i),this.saveToStorage(),this.syncMarkers(),(a=(s=this.config).onAnnotationAdd)==null||a.call(s,i),this.copyAnnotations()}onMarkerClick(t){var n;(n=this.popup)==null||n.showEdit(t,{onSave:async(o,r)=>{try{let i=await this.api.updateAnnotation(o.id,{comment:r});this.onAnnotationUpdated(i)}catch(i){this.onAnnotationUpdated(L(E({},o),{comment:r,updatedAt:new Date().toISOString()}))}},onDelete:async o=>{try{await this.api.updateAnnotation(o.id,{status:"dismissed"})}catch(r){}this.removeAnnotation(o.id)}},this.config.endpoint)}onAnnotationUpdated(t){let n=this.annotations.findIndex(o=>o.id===t.id);n>=0&&(this.annotations[n]=t),this.saveToStorage(),this.syncMarkers()}removeAnnotation(t){this.annotations=this.annotations.filter(n=>n.id!==t),this.saveToStorage(),this.syncMarkers()}async clearPage(){let t=this.pageAnnotations();for(let n of t)try{await this.api.updateAnnotation(n.id,{status:"dismissed"})}catch(o){}this.annotations=this.annotations.filter(n=>!t.includes(n)),this.saveToStorage(),this.syncMarkers()}async clearEverything(){let t=this.annotations.filter(n=>n.status!=="resolved"&&n.status!=="dismissed");for(let n of t)try{await this.api.updateAnnotation(n.id,{status:"dismissed"})}catch(o){}this.annotations=[],this.saveToStorage(),this.syncMarkers()}onKeydown(t){var i,s,a,c,u,l;if((i=this.toolbar)!=null&&i.isMinimized())return;let n=t.target;if(["INPUT","TEXTAREA","SELECT"].includes(n.tagName)||n.closest('[contenteditable="true"]')||this.isInstruckt(n))return;let o=(s=this.config.keys)!=null?s:{},r=!t.metaKey&&!t.ctrlKey&&!t.altKey;t.key===((a=o.annotate)!=null?a:"a")&&r&&this.setAnnotating(!this.isAnnotating),t.key===((c=o.freeze)!=null?c:"f")&&r&&this.setFrozen(!this.isFrozen),t.key===((u=o.screenshot)!=null?u:"c")&&r&&this.startRegionCapture(),t.key===((l=o.clearPage)!=null?l:"x")&&r&&this.clearPage(),t.key==="Escape"&&(this.isAnnotating&&this.setAnnotating(!1),this.isFrozen&&this.setFrozen(!1))}copyAnnotations(){this.copyToClipboard(!1)}copyToClipboard(t){let n=this.exportMarkdown();if(window.isSecureContext)navigator.clipboard.writeText(n).catch(()=>{});else if(t)try{let o=document.createElement("textarea");o.value=n,o.style.cssText="position:fixed;left:-9999px",document.body.appendChild(o),o.select(),document.execCommand("copy"),o.remove()}catch(o){}}exportMarkdown(){let t=this.annotations.filter(i=>i.status!=="resolved"&&i.status!=="dismissed");if(t.length===0)return`# UI Feedback

No open annotations.`;let n=new Map;for(let i of t){let s=this.annotationPageKey(i);n.has(s)||n.set(s,[]),n.get(s).push(i)}let o=n.size>1,r=[];o&&(r.push("# UI Feedback"),r.push(""));for(let[i,s]of n){o?r.push(`## ${i}`):r.push(`# UI Feedback: ${i}`),r.push("");let a=o?"###":"##";s.forEach((c,u)=>{var h,d,m;let l=(h=c.framework)!=null&&h.component?` in \`${c.framework.component}\``:"";r.push(`${a} ${u+1}. ${c.comment}`),r.push(`- Element: \`${c.element}\`${l}`),(m=(d=c.framework)==null?void 0:d.data)!=null&&m.file&&r.push(`- File: \`${c.framework.data.file}\``),c.cssClasses&&r.push(`- Classes: \`${c.cssClasses}\``),c.selectedText?r.push(`- Text: "${c.selectedText}"`):c.nearbyText&&r.push(`- Text: "${c.nearbyText.slice(0,100)}"`),c.screenshot&&(c.screenshot.startsWith("data:")?r.push("- Screenshot: attached"):r.push(`- Screenshot: \`storage/app/_instruckt/${c.screenshot}\``)),r.push("")})}return r.join(`
`).trim()}getAnnotations(){return[...this.annotations]}destroy(){var t,n,o,r;this.setAnnotating(!1),this.setFrozen(!1),document.removeEventListener("keydown",this.boundKeydown),window.removeEventListener("scroll",this.boundReposition),window.removeEventListener("resize",this.boundReposition),(t=this.toolbar)==null||t.destroy(),(n=this.highlight)==null||n.destroy(),(o=this.popup)==null||o.destroy(),(r=this.markers)==null||r.destroy(),this.rafId!==null&&cancelAnimationFrame(this.rafId),this.pollTimer!==null&&clearInterval(this.pollTimer)}};j.STORAGE_KEY="instruckt:annotations";var H=j;function Gn(e){return new H(e)}return he(Jn);})();
//# sourceMappingURL=instruckt.iife.js.map