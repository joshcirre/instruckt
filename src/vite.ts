import type { Plugin, ViteDevServer } from 'vite'
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'

export interface InstrucktPluginOptions {
  /** Framework adapters to activate. Default: auto-detect */
  adapters?: Array<'livewire' | 'vue' | 'svelte' | 'react' | 'blade'>
  /** Theme preference. Default: 'auto' */
  theme?: 'light' | 'dark' | 'auto'
  /** Toolbar position. Default: 'bottom-right' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Customize marker pin colors */
  colors?: { default?: string; screenshot?: string; dismissed?: string }
  /** Customize keyboard shortcuts */
  keys?: { annotate?: string; freeze?: string; screenshot?: string; clearPage?: string }
  /** Storage directory relative to project root. Default: '.instruckt' */
  dir?: string
  /**
   * API endpoint prefix for the client. Default: '/instruckt'
   * Set this to match your backend's route prefix (e.g. '/instruckt' for Laravel).
   */
  endpoint?: string
  /**
   * Enable the built-in dev API server for annotations and screenshots.
   * Set to false when your framework provides its own backend (e.g. Laravel).
   * Default: true
   */
  server?: boolean
  /**
   * Whether MCP tools (get_screenshot, resolve) are available.
   * Set to true when using with a backend that registers MCP tools (e.g. Laravel).
   * Default: false
   */
  mcp?: boolean
}

/** Parse JSON body from an incoming request */
function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => { body += chunk.toString() })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) }
      catch { reject(new Error('Invalid JSON')) }
    })
  })
}

/** Send JSON response */
function json(res: ServerResponse, data: unknown, status = 200): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

/** Save a data URL screenshot to disk, return relative path */
function saveScreenshot(screenshotsDir: string, id: string, dataUrl: string): string | null {
  if (!dataUrl?.startsWith('data:image/')) return null

  const commaIdx = dataUrl.indexOf(',')
  if (commaIdx < 0) return null

  const header = dataUrl.slice(0, commaIdx)
  const data = dataUrl.slice(commaIdx + 1)

  let binary: Buffer
  let ext: string

  if (header.includes(';base64')) {
    binary = Buffer.from(data, 'base64')
    ext = header.includes('image/svg+xml') ? 'svg' : 'png'
  } else {
    // URL-encoded (e.g. SVG data URLs)
    binary = Buffer.from(decodeURIComponent(data), 'utf-8')
    ext = 'svg'
  }

  if (!binary.length) return null

  const filename = `${id}.${ext}`
  writeFileSync(join(screenshotsDir, filename), binary)
  return `screenshots/${filename}`
}

/** Delete a screenshot file */
function deleteScreenshot(storageDir: string, screenshotPath: string | null): void {
  if (!screenshotPath) return
  const filepath = join(storageDir, screenshotPath)
  try { unlinkSync(filepath) } catch { /* already gone */ }
}

export default function instruckt(options: InstrucktPluginOptions = {}): Plugin {
  const dirName = options.dir ?? '.instruckt'
  const useServer = options.server !== false
  const endpointPrefix = options.endpoint ?? '/instruckt'

  let storageDir: string
  let screenshotsDir: string
  let annotationsFile: string

  function ensureDirs(): void {
    mkdirSync(screenshotsDir, { recursive: true })
    if (!existsSync(annotationsFile)) {
      writeFileSync(annotationsFile, '[]')
    }
  }

  function readAnnotations(): Record<string, unknown>[] {
    try {
      return JSON.parse(readFileSync(annotationsFile, 'utf-8'))
    } catch {
      return []
    }
  }

  function writeAnnotations(annotations: Record<string, unknown>[]): void {
    writeFileSync(annotationsFile, JSON.stringify(annotations, null, 2) + '\n')
  }

  /** Build the client config object passed to instruckt.init() */
  function clientConfig(): Record<string, unknown> {
    const cfg: Record<string, unknown> = {
      endpoint: endpointPrefix,
    }
    // Only set screenshotPath for the built-in server (backends manage their own paths)
    if (useServer) cfg.screenshotPath = `${dirName}/`
    if (options.mcp) cfg.mcp = true
    if (options.adapters) cfg.adapters = options.adapters
    if (options.theme) cfg.theme = options.theme
    if (options.position) cfg.position = options.position
    if (options.colors) cfg.colors = options.colors
    if (options.keys) cfg.keys = options.keys
    return cfg
  }

  const plugin: Plugin = {
    name: 'instruckt',
    apply: 'serve',

    // Virtual module for non-SPA setups (e.g. Laravel) —
    // add `import 'virtual:instruckt'` to app.js
    resolveId(id: string) {
      if (id === 'virtual:instruckt') return '\0virtual:instruckt'
    },

    load(id: string) {
      if (id === '\0virtual:instruckt') {
        const cfg = JSON.stringify(clientConfig())
        return [
          `if (!import.meta.env.SSR && import.meta.env.DEV) {`,
          `  const { init } = await import('instruckt');`,
          `  init(${cfg});`,
          `}`,
        ].join('\n')
      }
    },

    // Inject instruckt client into SPA pages served by Vite
    transformIndexHtml(html: string) {
      const cfg = JSON.stringify(clientConfig())
      const script = `<script type="module">
import { init } from 'instruckt';
if (import.meta.env.DEV) init(${cfg});
</script>`
      return html.replace('</body>', `${script}\n</body>`)
    },
  }

  // Only add the API server + storage when server is enabled
  if (useServer) {
    plugin.configResolved = (config) => {
      storageDir = resolve(config.root, dirName)
      screenshotsDir = join(storageDir, 'screenshots')
      annotationsFile = join(storageDir, 'annotations.json')
      ensureDirs()
    }

    plugin.configureServer = (server: ViteDevServer) => {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        const prefix = endpointPrefix

        // ── GET /instruckt/annotations ──────────────────────────
        if (url === `${prefix}/annotations` && req.method === 'GET') {
          return json(res, readAnnotations())
        }

        // ── POST /instruckt/annotations ─────────────────────────
        if (url === `${prefix}/annotations` && req.method === 'POST') {
          try {
            const data = await parseBody(req)
            const id = randomUUID()
            const screenshot = typeof data.screenshot === 'string'
              ? saveScreenshot(screenshotsDir, id, data.screenshot)
              : null

            const annotation: Record<string, unknown> = {
              ...data,
              id,
              screenshot,
              status: 'pending',
              created_at: new Date().toISOString(),
            }

            const annotations = readAnnotations()
            annotations.push(annotation)
            writeAnnotations(annotations)
            return json(res, annotation, 201)
          } catch {
            return json(res, { error: 'Bad request' }, 400)
          }
        }

        // ── PATCH /instruckt/annotations/:id ────────────────────
        const patchMatch = url.match(new RegExp(`^${prefix}/annotations/([^/]+)$`))
        if (patchMatch && req.method === 'PATCH') {
          try {
            const id = patchMatch[1]
            const data = await parseBody(req)
            const annotations = readAnnotations()
            const idx = annotations.findIndex(a => a.id === id)
            if (idx < 0) return json(res, { error: 'Not found' }, 404)

            // Clean up screenshot file on resolve/dismiss
            if (data.status === 'resolved' || data.status === 'dismissed') {
              deleteScreenshot(storageDir, annotations[idx].screenshot as string | null)
            }

            annotations[idx] = {
              ...annotations[idx],
              ...data,
              updated_at: new Date().toISOString(),
            }
            writeAnnotations(annotations)
            return json(res, annotations[idx])
          } catch {
            return json(res, { error: 'Bad request' }, 400)
          }
        }

        // ── GET /instruckt/screenshots/:filename ────────────────
        const ssMatch = url.match(new RegExp(`^${prefix}/screenshots/(.+)$`))
        if (ssMatch && req.method === 'GET') {
          const filename = ssMatch[1]
          // Prevent path traversal
          if (filename.includes('..') || filename.includes('/')) {
            return json(res, { error: 'Bad request' }, 400)
          }
          const filepath = join(screenshotsDir, filename)
          if (!existsSync(filepath)) return json(res, { error: 'Not found' }, 404)
          const ext = filename.split('.').pop()
          res.setHeader('Content-Type', ext === 'svg' ? 'image/svg+xml' : 'image/png')
          createReadStream(filepath).pipe(res)
          return
        }

        next()
      })
    }
  }

  return plugin
}
