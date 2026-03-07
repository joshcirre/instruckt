# instruckt-laravel

Laravel package for [instruckt](https://github.com/joshcirre/instruckt) — visual feedback for AI coding agents. Provides the backend API, MCP tools, JSON file storage, and a Blade toolbar component.

Users annotate elements in the browser, annotations are copied as structured markdown, and your AI agent can also read them via MCP.

## Requirements

- PHP 8.2+
- Laravel 11 or 12
- [laravel/mcp](https://github.com/laravel/mcp) (optional, for MCP tool integration)

## Install

```bash
composer require joshcirre/instruckt-laravel --dev
```

```bash
php artisan instruckt:install
```

This publishes the config, copies the JS assets, and automatically configures MCP for any detected AI agents (Claude Code, Cursor, Codex, OpenCode, GitHub Copilot).

## Setup

### Livewire / Blade

Add the toolbar component to your layout (typically before `</body>`):

```blade
<x-instruckt-toolbar />
```

### Inertia (React / Vue / Svelte)

Add the import to your `resources/js/app.tsx` (or `.ts`, `.jsx`, `.js`):

```ts
import { Instruckt } from 'instruckt';
new Instruckt({ endpoint: '/instruckt' });
```

The install command auto-detects Inertia and adds this for you.

### Connect Your AI Agent

The install command automatically detects your AI agent and configures MCP. If you need to do it manually, add to `.mcp.json` (Claude Code):

```json
{
  "mcpServers": {
    "instruckt": {
      "command": "php",
      "args": ["artisan", "mcp:start", "instruckt"]
    }
  }
}
```

## Storage

Annotations are stored in `storage/app/_instruckt/annotations.json`. Screenshots are saved as PNGs in `storage/app/_instruckt/screenshots/`. No database migrations needed.

## MCP Tools

The package registers these MCP tools for your AI agent:

| Tool | Description |
|------|-------------|
| `instruckt.get_all_pending` | Get all pending annotations |
| `instruckt.get_screenshot` | Get the screenshot image for an annotation |
| `instruckt.resolve` | Mark an annotation as resolved (removes marker from browser) |

## Configuration

Publish the config file to customize:

```bash
php artisan vendor:publish --tag=instruckt-config
```

Published to `config/instruckt.php`:

```php
return [
    // Only enabled in local env by default
    'enabled' => (bool) env('INSTRUCKT_ENABLED', env('APP_ENV') === 'local'),

    // API route prefix
    'route_prefix' => env('INSTRUCKT_ROUTE_PREFIX', 'instruckt'),

    // Middleware applied to API routes
    'middleware' => explode(',', env('INSTRUCKT_MIDDLEWARE', 'api')),

    // Override JS source (e.g. pinned CDN version)
    'cdn_url' => env('INSTRUCKT_CDN_URL', null),

    // Marker pin colors (CSS color strings)
    'colors' => [
        // 'default'    => '#6366f1',  // indigo — standard annotations
        // 'screenshot' => '#22c55e',  // green — annotations with screenshots
        // 'dismissed'  => '#71717a',  // gray — dismissed
    ],

    // Keyboard shortcuts (single key characters)
    'keys' => [
        // 'annotate'   => 'a',  // toggle annotation mode
        // 'freeze'     => 'f',  // freeze page
        // 'screenshot' => 'c',  // region screenshot capture
        // 'clearPage'  => 'x',  // clear current page
    ],
];
```

## Toolbar Component

The `<x-instruckt-toolbar />` component accepts optional attributes:

```blade
<x-instruckt-toolbar
    theme="dark"
    position="bottom-left"
    :adapters="['livewire', 'vue']"
    :colors="['default' => '#6366f1', 'screenshot' => '#22c55e', 'dismissed' => '#71717a']"
    :keys="['annotate' => 'a', 'freeze' => 'f']"
/>
```

You can also set colors and keys globally via `config/instruckt.php` instead of passing them as component attributes.

## How It Works

1. The Blade component loads `instruckt.iife.js` and initializes the annotation UI
2. Users click elements and leave feedback — optionally capturing screenshots
3. Annotations auto-copy as structured markdown to the clipboard for pasting into AI agents
4. Annotations are persisted to `storage/app/_instruckt/` via API routes
5. On page reload (including Vite rebuilds), annotations are loaded from the API and markers reappear
6. AI agents can read pending annotations via MCP tools and resolve them after fixing

## API Routes

All routes are registered under the configured prefix (default: `/instruckt`):

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/instruckt/annotations` | List all annotations |
| POST | `/instruckt/annotations` | Create annotation |
| PATCH | `/instruckt/annotations/{id}` | Update annotation |

## Keyboard Shortcuts

Default shortcuts (customizable via `keys` config):

| Key | Action |
|-----|--------|
| `A` | Toggle annotation mode |
| `F` | Toggle freeze animations |
| `C` | Screenshot region capture |
| `X` | Clear annotations on current page |
| `Esc` | Exit annotation/freeze mode |

## Secure Context Note

`navigator.clipboard` requires a secure context (HTTPS or localhost). On `http://*.test` domains, auto-copy on annotation submit is skipped. Use the copy button in the toolbar which uses a fallback method.

## License

MIT
