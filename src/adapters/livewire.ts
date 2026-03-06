import type { FrameworkContext } from '../types'

declare global {
  interface Window {
    Livewire?: { find(id: string): unknown }
  }
}

export function isAvailable(): boolean {
  return typeof window.Livewire !== 'undefined'
}

/** Walk up the DOM from el to find the nearest wire:id ancestor */
export function detect(el: Element): Element | null {
  let node: Element | null = el
  while (node && node !== document.documentElement) {
    if (node.getAttribute('wire:id')) return node
    node = node.parentElement
  }
  return null
}

/** Get Livewire component context for an element */
export function getContext(el: Element): FrameworkContext | null {
  if (!isAvailable()) return null

  const wireEl = detect(el)
  if (!wireEl) return null

  const wireId = wireEl.getAttribute('wire:id')!

  // In Livewire v3, the component name lives in the wire:snapshot attribute
  let componentName = 'Unknown'
  const snapshotAttr = wireEl.getAttribute('wire:snapshot')
  if (snapshotAttr) {
    try {
      const snapshot = JSON.parse(snapshotAttr)
      componentName = snapshot?.memo?.name ?? 'Unknown'
    } catch {
      // malformed snapshot
    }
  }

  return {
    framework: 'livewire',
    component: componentName,
    wire_id: wireId,
  }
}
