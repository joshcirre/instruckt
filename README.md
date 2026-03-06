# instruckt

Visual feedback tool for AI coding agents. Click on any element in your app, leave an annotation, and your AI agent picks it up via MCP — no screenshots, no copy-pasting.

Framework-agnostic JS core with adapters for Livewire, Vue, Svelte, and React.

## Install

```bash
npm install instruckt
```

Or load via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/instruckt@0.1.0/dist/instruckt.iife.js"></script>
```

## Quick Start

```js
import { Instruckt } from 'instruckt'

const instruckt = new Instruckt({
  endpoint: '/instruckt',
})
```

Or with the IIFE build:

```html
<script src="/path/to/instruckt.iife.js"></script>
<script>
  Instruckt.init({ endpoint: '/instruckt' })
</script>
```

## How It Works

1. A floating toolbar appears in your app
2. Press **A** or click the annotate button to enter annotation mode
3. Hover over any element — instruckt highlights it and detects its framework component
4. Click to annotate — choose an intent (fix, change, question, approve) and severity
5. Your AI agent reads annotations via MCP tools and can reply, acknowledge, or resolve them
6. Real-time sync via SSE keeps both sides in sync

## Configuration

```js
new Instruckt({
  // Required — URL to your instruckt API (provided by the Laravel package or your own backend)
  endpoint: '/instruckt',

  // Framework adapters to activate (default: all)
  adapters: ['livewire', 'vue', 'svelte', 'react'],

  // Theme: 'light' | 'dark' | 'auto' (default: 'auto')
  theme: 'auto',

  // Toolbar position (default: 'bottom-right')
  position: 'bottom-right',

  // Callbacks
  onAnnotationAdd: (annotation) => {},
  onAnnotationResolve: (annotation) => {},
  onSessionCreate: (session) => {},
})
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `A` | Toggle annotation mode |
| `F` | Freeze animations |
| `Esc` | Exit annotation mode |

## Features

- **Framework detection** — automatically identifies Livewire, Vue, Svelte, and React components, including component names and state
- **Shadow DOM isolation** — all UI renders in shadow roots so it never conflicts with your styles
- **Annotation threads** — back-and-forth conversation between you and your AI agent on each annotation
- **Copy as markdown** — export all open annotations to clipboard for pasting into any context
- **MutationObserver** — markers reposition automatically when the DOM changes (Livewire re-renders, SPA navigation)
- **SSE real-time sync** — agent replies and status changes appear instantly

## Public API

```js
// Get all annotations
instruckt.getAnnotations()

// Get current session
instruckt.getSession()

// Export open annotations as markdown
instruckt.exportMarkdown()

// Clean up
instruckt.destroy()
```

## Backend

instruckt needs a backend to persist annotations and expose MCP tools. The official Laravel package provides this out of the box:

- **[instruckt-laravel](https://github.com/joshcirre/instruckt-laravel)** — Laravel package with MCP server, migrations, Blade component, and API routes

## License

MIT
