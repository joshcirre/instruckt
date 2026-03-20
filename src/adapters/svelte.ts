import type { FrameworkContext } from '../types'

interface SvelteMeta {
  loc?: { file?: string }
  ctx?: unknown[]
}

interface SvelteElement extends Element {
  __svelte_meta?: SvelteMeta
  __svelte?: unknown
}

/** Walk up DOM to find nearest Svelte component element */
export function detect(el: Element): SvelteMeta | null {
  let node: SvelteElement | null = el as SvelteElement
  while (node && node !== document.documentElement) {
    if (node.__svelte_meta) return node.__svelte_meta
    node = node.parentElement as SvelteElement | null
  }
  return null
}

/** Get Svelte component context for an element */
export function getContext(el: Element): FrameworkContext | null {
  const meta = detect(el)
  if (!meta) return null

  // Extract component name from file path e.g. "/src/components/Button.svelte" → "Button"
  const filePath = meta.loc?.file ?? ''
  const component = filePath
    ? filePath.split('/').pop()?.replace(/\.svelte$/, '') ?? 'Unknown'
    : 'Unknown'

  return {
    framework: 'svelte',
    component,
    source_file: filePath || undefined,
    data: filePath ? { file: filePath } : undefined,
  }
}
