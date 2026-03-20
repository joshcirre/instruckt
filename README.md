# instruckt

Visual feedback tool for AI coding agents. Click on any element in your app, leave a note, capture screenshots, and copy structured markdown to paste into your AI agent.

Framework-agnostic JS core with adapters for Livewire, Vue, Svelte, and React.

## Install

```bash
npm install instruckt
```

## Quick Start

> **Pick your framework below** -- each section is self-contained.

| Framework | Setup |
|-----------|-------|
| [SPA (Vue, React, Svelte)](#spa-vue-react-svelte-with-vite) | Vite plugin only |
| [SvelteKit](#sveltekit) | Vite plugin + virtual import |
| [Nuxt](#nuxt) | Vite plugin + virtual import |
| [Next.js](#nextjs) | Client component |
| [Laravel](#laravel) | Composer package |
| [Astro](#astro) | Community integration |
| [Tauri](#tauri) | Rust plugin + MCP server |

---

### SPA (Vue, React, Svelte with Vite)

Add the Vite plugin — it handles client injection and provides a built-in dev API server. No backend required.

```js
// vite.config.ts
import instruckt from 'instruckt/vite'

export default defineConfig({
  plugins: [instruckt()],
})
```

That's it. The plugin auto-injects the client via `transformIndexHtml`.

---

### SvelteKit

Two steps — add the Vite plugin, then import the virtual module in your layout:

```js
// vite.config.ts
import instruckt from 'instruckt/vite'

export default defineConfig({
  plugins: [sveltekit(), instruckt()],
})
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import 'virtual:instruckt'
</script>
```

The virtual module is SSR-safe — it only initializes in the browser.

---

### Nuxt

Same idea — add the Vite plugin, then import the virtual module in a client plugin:

```js
// nuxt.config.ts — add the Vite plugin
import instruckt from 'instruckt/vite'

export default defineNuxtConfig({
  vite: {
    plugins: [instruckt()],
  },
})
```

```ts
// plugins/instruckt.client.ts
import 'virtual:instruckt'
```

---

### Next.js

Next.js doesn't use Vite, so initialize instruckt directly in a client component:

```tsx
// components/InstrucktProvider.tsx
'use client'

import { useEffect } from 'react'

export function InstrucktProvider() {
  useEffect(() => {
    let instruckt: any

    import('instruckt').then(({ Instruckt }) => {
      instruckt = new Instruckt({
        endpoint: '/api/annotations',
        adapters: ['react'],
      })
    })

    return () => instruckt?.destroy()
  }, [])

  return null
}
```

```tsx
// app/layout.tsx
import { InstrucktProvider } from '@/components/InstrucktProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <InstrucktProvider />
      </body>
    </html>
  )
}
```

---

### Laravel

Use the **[instruckt-laravel](https://github.com/joshcirre/instruckt-laravel)** package — it provides the backend API, MCP tools, JSON file storage, and handles install/uninstall automatically:

```bash
composer require joshcirre/instruckt-laravel --dev
php artisan instruckt:install
```

The install command adds the Vite plugin to your `vite.config.js` with `server: false` (Laravel owns the backend), configures MCP for your AI agent, and adds the virtual import to your JS entry point.

```js
// vite.config.js (added automatically by install command)
import instruckt from 'instruckt/vite'

export default defineConfig({
  plugins: [
    laravel({ input: ['resources/js/app.js'] }),
    instruckt({
      server: false,
      adapters: ['livewire', 'blade'],
      mcp: true,
    }),
  ],
})
```

---

### Astro

See **[instruckt-astro](https://github.com/sgasser/instruckt-astro)** for a community-maintained Astro integration.

---

### Tauri

Use the **[tauri-plugin-instruckt](https://github.com/Naoray/instruckt-rust)** crate — a Tauri v2 plugin that provides a Rust backend with JSON file storage, MCP tools, and IPC commands. Dev-only by default.

Add the plugin to your Tauri app:

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri-plugin-instruckt = "0.1"
```

```rust
// src-tauri/src/lib.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_instruckt::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Then add the Vite plugin to your frontend with `server: false` (Tauri owns the backend):

```js
// vite.config.ts
import instruckt from 'instruckt/vite'

export default defineConfig({
  plugins: [
    instruckt({
      server: false,
      mcp: true,
    }),
  ],
})
```

The plugin intercepts fetch requests to the instruckt API and routes them through Tauri IPC. Annotations and screenshots are stored in the OS app data directory. Includes a standalone MCP server binary (`instruckt-mcp`) that AI agents can connect to via stdio.

---

## Vite Plugin Options

```js
instruckt({
  // Framework adapters to activate (default: auto-detect)
  adapters: ['svelte'],

  // Theme: 'light' | 'dark' | 'auto' (default: 'auto')
  theme: 'auto',

  // Toolbar position (default: 'bottom-right')
  position: 'bottom-right',

  // Customize marker pin colors
  colors: { default: '#6366f1', screenshot: '#22c55e', dismissed: '#71717a' },

  // Customize keyboard shortcuts
  keys: { annotate: 'a', freeze: 'f', screenshot: 'c', clearPage: 'x' },

  // Storage directory for annotations + screenshots (default: '.instruckt')
  dir: '.instruckt',

  // API endpoint prefix (default: '/instruckt')
  endpoint: '/instruckt',

  // Enable built-in dev API server (default: true)
  // Set to false when your framework provides its own backend (e.g. Laravel)
  server: true,

  // Show MCP tool instructions in clipboard markdown (default: false)
  // Set to true when using with a backend that registers MCP tools
  mcp: false,
})
```

## How It Works

1. A floating toolbar appears in your app
2. Press **A** or click the annotate button to enter annotation mode
3. Hover over any element — instruckt highlights it and detects its framework component
4. Click to annotate — type your feedback, optionally capture a screenshot, and save
5. Annotations auto-copy as structured markdown to your clipboard (requires secure context — `https://` or `localhost`)
6. Paste into any AI coding agent (Claude Code, Cursor, Codex, Copilot, OpenCode, etc.) — or press the **Run** button to send annotations directly to a configured local CLI agent
7. The agent reads the markdown and makes the requested code changes

> **Note:** Auto-copy requires a secure context (`https://` or `localhost`). On `http://` domains (e.g. `.test`), use the copy button in the toolbar instead.

### Example Output

```markdown
# UI Feedback: /dashboard

## 1. Change the submit button color to green
- Element: `button.btn-primary` in `LoginForm`
- Source: `src/components/LoginForm.tsx:42:5`
- Component stack:
  - LoginForm `src/components/LoginForm.tsx:42:5`
  - AuthPage `src/pages/AuthPage.tsx:18:3`
  - App `src/App.tsx:8:7`
- Classes: `btn btn-primary`
- Text: "Submit Login"
- Screenshot: `.instruckt/screenshots/01JWXYZ.png`

## 2. Make the login card have rounded corners
- Element: `div.bg-white` in `LoginCard`
- Source: `src/components/LoginCard.tsx:15:3`
- Classes: `bg-white dark:bg-white/10 border`
```

## Configuration

```js
new Instruckt({
  // Required — URL to your instruckt API (provided by the Vite plugin, Laravel package, or your own backend)
  endpoint: '/instruckt',

  // Framework adapters to activate (default: all)
  adapters: ['livewire', 'vue', 'svelte', 'react'],

  // Theme: 'light' | 'dark' | 'auto' (default: 'auto')
  theme: 'auto',

  // Toolbar position (default: 'bottom-right')
  position: 'bottom-right',

  // Customize marker pin colors
  colors: {
    default: '#6366f1',     // indigo — standard annotations
    screenshot: '#22c55e',  // green — annotations with screenshots
    dismissed: '#71717a',   // gray — dismissed annotations
  },

  // Customize keyboard shortcuts
  keys: {
    annotate: 'a',    // toggle annotation mode
    freeze: 'f',      // freeze page
    screenshot: 'c',  // region screenshot capture
    clearPage: 'x',   // clear annotations on this page
  },

  // Whether MCP tools are available (default: false)
  // Set to true when using with Laravel or another backend that registers MCP tools
  mcp: false,

  // Callbacks
  onAnnotationAdd: (annotation) => {},
})
```

## Keyboard Shortcuts

Default shortcuts (customizable via `keys` config):

| Key | Action |
|-----|--------|
| `A` | Toggle annotation mode |
| `F` | Freeze page (pause animations, block navigation) |
| `C` | Screenshot region capture |
| `X` | Clear all annotations on this page |
| `Esc` | Exit annotation/freeze mode |

## Features

- **Framework detection** — automatically identifies Livewire, Vue, Svelte, and React components with full component stacks and precise source locations (file:line:column) via [element-source](https://github.com/aidenybai/element-source)
- **Screenshots** — capture element or region screenshots; uses DOM-to-image on standard apps, automatically falls back to Screen Capture API on shadow DOM frameworks (Flux UI, etc.)
- **Shadow DOM isolation** — all UI renders in shadow roots so it never conflicts with your styles
- **Copy as markdown** — annotations auto-copy as structured markdown optimized for AI agents
- **Run button** — send annotations directly to a configured local CLI agent (e.g. `cursor-agent`, `claude`, `codex`) with one click; supports in-process execution or a host listener for Docker/Sail
- **Freeze mode** — pause animations, freeze popovers/dropdowns, and block all navigation
- **Annotation persistence** — annotations survive page reloads via localStorage; with a backend (Vite plugin or Laravel), annotations are stored on disk as JSON
- **Minimize** — collapse to a small floating button with annotation count badge
- **Page-scoped markers** — annotation pins reposition on scroll/resize and only appear on the page where they were created
- **Clear controls** — clear current page (`X` key or trash icon), or clear all pages via flyout
- **SPA navigation** — survives `wire:navigate`, Inertia, Vue Router, React Router, and browser back/forward

## Public API

```js
// Get all annotations
instruckt.getAnnotations()

// Export open annotations as markdown
instruckt.exportMarkdown()

// Clean up
instruckt.destroy()
```

## Backend

### Vite Plugin (Built-in)

The Vite plugin includes a dev API server that saves annotations and screenshots to disk (`.instruckt/` directory). No external backend needed. Screenshots are saved as files instead of base64, keeping clipboard markdown small.

### Laravel

**[instruckt-laravel](https://github.com/joshcirre/instruckt-laravel)** — Laravel package with JSON file storage, MCP tools, Blade component, and API routes. Includes `artisan instruckt:install` which auto-configures the Vite plugin, MCP, and agent skills. Supports a **Run button** that pipes annotations directly to a configured CLI agent (or to a host listener for Docker/Sail environments).

### Tauri

**[tauri-plugin-instruckt](https://github.com/Naoray/instruckt-rust)** — Tauri v2 plugin with Rust backend, JSON file storage in OS app data directory, IPC commands, and a standalone MCP server binary for AI agent integration.

### Custom Backend

instruckt expects these endpoints:

```
GET    {endpoint}/annotations         → list annotations
POST   {endpoint}/annotations         → create annotation
PATCH  {endpoint}/annotations/{id}    → update annotation
POST   {endpoint}/run                 → trigger configured CLI agent run (optional, for Run button)
```

## License

MIT
