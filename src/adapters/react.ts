import type { FrameworkContext } from '../types'

interface DebugSource {
  fileName: string
  lineNumber: number
  columnNumber?: number
}

interface ReactFiber {
  type: unknown
  memoizedProps: Record<string, unknown> | null
  pendingProps: Record<string, unknown> | null
  return: ReactFiber | null
  key: string | null
  _debugSource?: DebugSource
  _debugOwner?: ReactFiber
}

interface ReactElement extends Element {
  [key: string]: unknown
}

function getFiberKey(el: Element): string | null {
  for (const key of Object.keys(el)) {
    if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
      return key
    }
  }
  return null
}

/** Check if a debug source points to user code (not node_modules) */
function isUserSource(source: DebugSource | undefined): boolean {
  if (!source) return false
  return !source.fileName.includes('node_modules')
}

/** Check if a fiber is a user-land component (not from a library) */
function isUserComponent(fiber: ReactFiber): boolean {
  const { type } = fiber
  if (typeof type !== 'function' && typeof type !== 'object') return false

  // If debug source is available, use it to check
  if (fiber._debugSource) {
    return isUserSource(fiber._debugSource)
  }

  return true
}

interface ComponentInfo {
  name: string
  source?: DebugSource
}

/**
 * Walk up the fiber tree to find the best component match.
 * Prefers user-land components (not from node_modules) over library components.
 * Falls back to the first named component if no user component is found.
 */
function findComponent(fiber: ReactFiber): ComponentInfo {
  let firstMatch: ComponentInfo | null = null
  let node: ReactFiber | null = fiber

  while (node) {
    const { type } = node
    let name: string | null = null

    if (typeof type === 'function' && (type as { name?: string }).name) {
      const n = (type as { name: string }).name
      if (n[0] === n[0].toUpperCase() && n.length > 1) name = n
    }
    if (!name && typeof type === 'object' && type !== null && (type as { displayName?: string }).displayName) {
      name = (type as { displayName: string }).displayName
    }

    if (name) {
      const info: ComponentInfo = { name, source: node._debugSource }

      // If this is a user-land component, return it immediately
      if (isUserSource(node._debugSource)) return info

      // Keep the first match as fallback
      if (!firstMatch) firstMatch = info
    }

    node = node.return
  }

  return firstMatch ?? { name: 'Component' }
}

function getProps(fiber: ReactFiber): Record<string, unknown> {
  const props = fiber.memoizedProps ?? fiber.pendingProps ?? {}
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children' || typeof v === 'function') continue
    try {
      result[k] = JSON.parse(JSON.stringify(v))
    } catch {
      result[k] = String(v)
    }
  }
  return result
}

export function isAvailable(): boolean {
  // React attaches fiber data to DOM nodes with __reactFiber$ prefix
  const root = document.getElementById('root') ?? document.getElementById('app') ?? document.body.firstElementChild
  if (!root) return false
  return getFiberKey(root) !== null
}

export function getContext(el: Element): FrameworkContext | null {
  let node: Element | null = el
  while (node && node !== document.documentElement) {
    const key = getFiberKey(node)
    if (key) {
      const fiber = (node as ReactElement)[key] as ReactFiber
      if (fiber) {
        const { name, source } = findComponent(fiber)
        const data = getProps(fiber)
        return {
          framework: 'react',
          component: name,
          source_file: source?.fileName,
          source_line: source?.lineNumber,
          data,
        }
      }
    }
    node = node.parentElement
  }
  return null
}
