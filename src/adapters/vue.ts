import type { FrameworkContext } from '../types'

interface VueInstance {
  $options?: { name?: string; __name?: string; __file?: string }
  type?: { name?: string; __name?: string; __file?: string }
  uid?: number
  props?: Record<string, unknown>
  setupState?: Record<string, unknown>
  parent?: VueInstance
}

interface VueElement extends Element {
  __vue__?: VueInstance
  __vueParentComponent?: VueInstance
  _vei?: unknown
}

export function isAvailable(): boolean {
  // Vue 3: mounts with data-v-app attribute; Vue 2: exposes global Vue constructor
  return !!(document.querySelector('[data-v-app]') || (window as unknown as Record<string, unknown>)['Vue'])
}

/** Check if a Vue instance's file path points to user code */
function isUserFile(file: string | undefined): boolean {
  if (!file) return false
  return !file.includes('node_modules')
}

function getInstanceFile(instance: VueInstance): string | undefined {
  return instance.type?.__file ?? instance.$options?.__file
}

function getInstanceName(instance: VueInstance): string {
  return (
    instance.$options?.name ??
    instance.$options?.__name ??
    instance.type?.name ??
    instance.type?.__name ??
    'Anonymous'
  )
}

/**
 * Walk up the DOM to find the best Vue component.
 * Prefers user-land components (not from node_modules) over library components.
 */
export function detect(el: Element): VueInstance | null {
  let firstMatch: VueInstance | null = null
  let node: VueElement | null = el as VueElement

  while (node && node !== document.documentElement) {
    const instance = node.__vueParentComponent ?? node.__vue__
    if (instance) {
      const file = getInstanceFile(instance)

      // If this is a user component, return immediately
      if (isUserFile(file)) return instance

      // Keep the first match as fallback
      if (!firstMatch) firstMatch = instance
    }
    node = node.parentElement as VueElement | null
  }

  // If no user component found via DOM walk, try walking the Vue parent chain
  // from the first match (reaches components that don't own a DOM element)
  if (firstMatch?.parent) {
    let instance: VueInstance | undefined = firstMatch.parent
    while (instance) {
      const file = getInstanceFile(instance)
      if (isUserFile(file)) return instance
      instance = instance.parent
    }
  }

  return firstMatch
}

/** Get Vue component context for an element */
export function getContext(el: Element): FrameworkContext | null {
  const instance = detect(el)
  if (!instance) return null

  const name = getInstanceName(instance)

  const data: Record<string, unknown> = {}

  // Vue 3 props
  if (instance.props) {
    Object.assign(data, instance.props)
  }

  // Vue 3 setup state (public reactive refs)
  if (instance.setupState) {
    for (const [key, value] of Object.entries(instance.setupState)) {
      if (!key.startsWith('_') && typeof value !== 'function') {
        try {
          data[key] = JSON.parse(JSON.stringify(value))
        } catch {
          data[key] = String(value)
        }
      }
    }
  }

  const file = getInstanceFile(instance)

  return {
    framework: 'vue',
    component: name,
    source_file: file,
    component_uid: instance.uid !== undefined ? String(instance.uid) : undefined,
    data,
  }
}
