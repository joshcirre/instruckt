import type { FrameworkContext } from '../types'

interface BladeViewEntry {
  name: string
  file: string
}

/** Check if the server injected Blade view tracking data */
export function isAvailable(): boolean {
  return document.getElementById('instruckt-views') !== null
}

/** Get all tracked Blade views from the server-injected script tag */
function getTrackedViews(): BladeViewEntry[] {
  const el = document.getElementById('instruckt-views')
  if (!el) return []

  try {
    return JSON.parse(el.textContent ?? '[]')
  } catch {
    return []
  }
}

/**
 * Get Blade view context for an element.
 *
 * Since Blade templates compile to flat HTML (no component boundaries in the DOM),
 * we use the server-injected view list to identify the most likely template.
 * The heuristic: the last non-layout view is usually the page-level template
 * that rendered the element.
 */
export function getContext(_el: Element): FrameworkContext | null {
  const views = getTrackedViews()
  if (views.length === 0) return null

  // Pick the most specific view (last one that isn't a layout/component partial)
  // Layouts are typically first, page views come after
  const pageView = views.length > 1
    ? views.find(v => !v.name.startsWith('layouts.') && !v.name.startsWith('components.')) ?? views[views.length - 1]
    : views[0]

  return {
    framework: 'blade',
    component: pageView.name,
    source_file: pageView.file,
    data: { views: views.map(v => v.file) },
  }
}
