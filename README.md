# instruckt

Visual feedback tool for AI coding agents. Click on any element in your app, leave a note, capture screenshots, and copy structured markdown to paste into your AI agent.

Framework-agnostic JS core with adapters for Livewire, Vue, Svelte, and React.

## Install

```bash
npm install instruckt
```

## Quick Start

### Vite Plugin

The easiest way to use instruckt is with the Vite plugin. It handles client injection and provides a built-in dev API server — no backend required.

```js
// vite.config.ts
import instruckt from 'instruckt/vite'

export default defineConfig({
  plugins: [instruckt()],
})
```

That's it for SPA apps (Vue, React, Svelte with Vite). The plugin auto-injects the client via `transformIndexHtml`.

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

### SSR Frameworks (SvelteKit, Nuxt, etc.)

For frameworks that don't use `index.html`, import the virtual module in your layout:

```js
// SvelteKit: src/routes/+layout.svelte
import 'virtual:instruckt'

// Nuxt: plugins/instruckt.client.ts
import 'virtual:instruckt'
```

The virtual module is SSR-safe — it only initializes in the browser.

### Astro

See **[instruckt-astro](https://github.com/sgasser/instruckt-astro)** for a community-maintained Astro integration.

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

## Manual Setup

If you're not using Vite, you can initialize instruckt directly:

```js
import { Instruckt } from 'instruckt'

const instruckt = new Instruckt({
  endpoint: '/instruckt',
})
```

### Framework-Specific Manual Setup

instruckt is a browser-only library. In SSR frameworks without the Vite plugin, make sure it only loads on the client.

<details>
<summary>SvelteKit</summary>

```svelte
<!-- src/lib/InstrucktProvider.svelte -->
<script>
  import { onMount } from 'svelte';

  onMount(async () => {
    const { Instruckt } = await import('instruckt');
    const instruckt = new Instruckt({
      endpoint: '/api/annotations',
      adapters: ['svelte'],
    });

    return () => instruckt.destroy();
  });
</script>
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { browser } from '$app/environment';

  let { children } = $props();
</script>

{#if browser}
  {#await import('$lib/InstrucktProvider.svelte') then { default: InstrucktProvider }}
    <InstrucktProvider />
  {/await}
{/if}

{@render children()}
```

</details>

<details>
<summary>Nuxt</summary>

```vue
<!-- plugins/instruckt.client.ts -->
<script>
// The .client.ts suffix ensures Nuxt only runs this in the browser
export default defineNuxtPlugin(async () => {
  const { Instruckt } = await import('instruckt')

  const instruckt = new Instruckt({
    endpoint: '/api/annotations',
    adapters: ['vue'],
  })
})
</script>
```

</details>

<details>
<summary>Next.js (App Router)</summary>

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

</details>

## How It Works

1. A floating toolbar appears in your app
2. Press **A** or click the annotate button to enter annotation mode
3. Hover over any element — instruckt highlights it and detects its framework component
4. Click to annotate — type your feedback, optionally capture a screenshot, and save
5. Annotations auto-copy as structured markdown to your clipboard (requires secure context — `https://` or `localhost`)
6. Paste into any AI coding agent (Claude Code, Cursor, Codex, Copilot, OpenCode, etc.)
7. The agent reads the markdown and makes the requested code changes

> **Note:** Auto-copy requires a secure context (`https://` or `localhost`). On `http://` domains (e.g. `.test`), use the copy button in the toolbar instead.

### Example Output

```markdown
# UI Feedback: /auth/login

## 1. Change the submit button color to green
- Element: `button.btn-primary` in `pages::auth.login`
- Classes: `btn btn-primary`
- Text: "Submit Login"
- Screenshot: `.instruckt/screenshots/01JWXYZ.png`

## 2. Make the login card have rounded corners
- Element: `div.bg-white` in `pages::auth.login`
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

- **Framework detection** — automatically identifies Livewire, Vue, Svelte, and React components
- **Screenshots** — capture element or region screenshots; uses DOM-to-image on standard apps, automatically falls back to Screen Capture API on shadow DOM frameworks (Flux UI, etc.)
- **Shadow DOM isolation** — all UI renders in shadow roots so it never conflicts with your styles
- **Copy as markdown** — annotations auto-copy as structured markdown optimized for AI agents
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

**[instruckt-laravel](https://github.com/joshcirre/instruckt-laravel)** — Laravel package with JSON file storage, MCP tools, Blade component, and API routes. Includes `artisan instruckt:install` which auto-configures the Vite plugin, MCP, and agent skills.

### Custom Backend

instruckt expects these endpoints:

```
GET    {endpoint}/annotations         → list annotations
POST   {endpoint}/annotations         → create annotation
PATCH  {endpoint}/annotations/{id}    → update annotation
```

## License

MIT
