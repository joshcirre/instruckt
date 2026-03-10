import type { Annotation, InstrucktConfig, PendingAnnotation } from './types'
import { InstrucktApi } from './api'
import type { AnnotationPayload } from './api'
import { Toolbar } from './ui/toolbar'
import { ElementHighlight } from './ui/highlight'
import { AnnotationPopup } from './ui/popup'
import { AnnotationMarkers } from './ui/markers'
import { injectGlobalStyles } from './ui/styles'
import { getElementSelector, getElementName, getElementLabel, getNearbyText, getCssClasses, getPageBoundingBox } from './selector'
import { captureElement, captureRegion, selectRegion, setPreferScreenCapture } from './ui/screenshot'
import * as livewireAdapter from './adapters/livewire'
import * as vueAdapter from './adapters/vue'
import * as svelteAdapter from './adapters/svelte'
import * as reactAdapter from './adapters/react'
import * as bladeAdapter from './adapters/blade'

// Re-export for api.ts consumers
export type { AnnotationPayload }

/** Normalize URL to pathname for page-scoping (ignore query/hash) */
function pageKey(): string {
  return window.location.pathname
}

export class Instruckt {
  private config: Required<Pick<InstrucktConfig, 'endpoint' | 'theme' | 'position'>> & InstrucktConfig
  private api: InstrucktApi
  private toolbar: Toolbar | null = null
  private highlight: ElementHighlight | null = null
  private popup: AnnotationPopup | null = null
  private markers: AnnotationMarkers | null = null
  private annotations: Annotation[] = []
  private isAnnotating = false
  private isFrozen = false
  private frozenStyleEl: HTMLStyleElement | null = null
  private frozenPopovers: { el: HTMLElement; original: string }[] = []
  private rafId: number | null = null
  private pendingMouseTarget: Element | null = null
  private highlightLocked = false
  private pollTimer: ReturnType<typeof setInterval> | null = null
  private initialLoadDone = false
  private boundKeydown: (e: KeyboardEvent) => void
  private boundReposition = (): void => {
    this.markers?.reposition(this.annotations)
  }

  constructor(config: InstrucktConfig) {
    this.config = {
      adapters: ['livewire', 'vue', 'svelte', 'react', 'blade'],
      theme: 'auto',
      position: 'bottom-right',
      ...config,
    }
    this.api = new InstrucktApi(config.endpoint)
    this.boundKeydown = this.onKeydown.bind(this)
    this.init()
  }

  private init(): void {
    injectGlobalStyles(this.config.colors)

    // Livewire / Flux use shadow DOM which breaks DOM-to-image screenshot libs.
    // When Livewire is detected, go straight to Screen Capture API.
    const adapters = this.config.adapters ?? []
    if (adapters.includes('livewire') && livewireAdapter.isAvailable()) {
      setPreferScreenCapture(true)
    }

    if (this.config.theme !== 'auto') {
      document.documentElement.setAttribute('data-instruckt-theme', this.config.theme)
    }

    this.toolbar = new Toolbar(this.config.position, {
      onToggleAnnotate: (active) => {
        this.setAnnotating(active)
      },
      onFreezeAnimations: (frozen) => {
        this.setFrozen(frozen)
      },
      onScreenshot: () => this.startRegionCapture(),
      onCopy: () => this.copyToClipboard(true),
      onClearPage: () => this.clearPage(),
      onClearAll: () => this.clearEverything(),
      onMinimize: (min) => this.onMinimize(min),
    }, this.config.keys)

    this.highlight = new ElementHighlight()
    this.popup = new AnnotationPopup()
    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation))

    document.addEventListener('keydown', this.boundKeydown)
    window.addEventListener('scroll', this.boundReposition, { passive: true })
    window.addEventListener('resize', this.boundReposition, { passive: true })

    // Survive SPA navigation across frameworks
    document.addEventListener('livewire:navigated', () => this.reattach())
    document.addEventListener('inertia:navigate', () => this.syncMarkers())
    window.addEventListener('popstate', () => {
      setTimeout(() => this.reattach(), 0)
    })

    // Load persisted annotations from the backend (async — calls syncMarkers when done)
    this.loadAnnotations()
  }

  private makeToolbarCallbacks() {
    return {
      onToggleAnnotate: (active: boolean) => {
        this.setAnnotating(active)
      },
      onFreezeAnimations: (frozen: boolean) => {
        this.setFrozen(frozen)
      },
      onScreenshot: () => this.startRegionCapture(),
      onCopy: () => this.copyToClipboard(true),
      onClearPage: () => this.clearPage(),
      onClearAll: () => this.clearEverything(),
      onMinimize: (min: boolean) => this.onMinimize(min),
    }
  }

  private reattach(): void {
    const wasAnnotating = this.isAnnotating
    const wasFrozen = this.isFrozen
    const wasMinimized = this.toolbar?.isMinimized() ?? false

    // Detach current listeners before rebuilding
    if (this.isAnnotating) this.detachAnnotateListeners()
    if (this.isFrozen) this.setFrozen(false)
    this.isAnnotating = false
    this.isFrozen = false

    // Remove any stale instruckt DOM (Livewire caches and restores old HTML on back nav)
    document.querySelectorAll('[data-instruckt]').forEach(el => el.remove())

    // Rebuild everything fresh
    this.toolbar = new Toolbar(this.config.position, this.makeToolbarCallbacks())
    if (wasMinimized) this.toolbar.minimize()

    this.markers = new AnnotationMarkers((annotation) => this.onMarkerClick(annotation))
    this.highlight = new ElementHighlight()

    if (wasMinimized) this.markers.setVisible(false)

    // Re-inject global styles (Livewire may have swapped <head> content)
    const existing = document.getElementById('instruckt-global')
    if (existing) existing.remove()
    injectGlobalStyles(this.config.colors)

    this.syncMarkers()

    // Restore active modes
    if (wasAnnotating && !wasMinimized) this.setAnnotating(true)
  }

  // ── Minimize ────────────────────────────────────────────────────

  private onMinimize(minimized: boolean): void {
    if (minimized) {
      // Deactivate everything when minimized
      if (this.isAnnotating) this.setAnnotating(false)
      if (this.isFrozen) this.setFrozen(false)
      this.toolbar?.setAnnotateActive(false)
      this.toolbar?.setFreezeActive(false)
      this.markers?.setVisible(false)
      this.popup?.destroy()
    } else {
      // Show markers again when restored
      this.markers?.setVisible(true)
    }
  }

  // ── Persistence ─────────────────────────────────────────────────

  private static STORAGE_KEY = `instruckt:${window.location.origin}:annotations`

  private async loadAnnotations(): Promise<void> {
    // Always load localStorage first as baseline
    this.loadFromStorage()

    try {
      const remote = await this.api.getAnnotations()
      // Merge: remote is source of truth, but keep any local-only annotations
      const remoteIds = new Set(remote.map(a => a.id))
      const localOnly = this.annotations.filter(a => !remoteIds.has(a.id))
      this.annotations = [...remote, ...localOnly]
      this.saveToStorage()
    } catch {
      // No backend — localStorage already loaded above
    }
    this.initialLoadDone = true
    this.syncMarkers()
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(Instruckt.STORAGE_KEY, JSON.stringify(this.annotations))
    } catch { /* storage full or unavailable */ }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(Instruckt.STORAGE_KEY)
      if (raw) this.annotations = JSON.parse(raw)
    } catch { /* corrupt or unavailable */ }
  }

  /** Start or stop polling based on whether there are active annotations */
  private updatePolling(): void {
    // Don't start polling until the initial backend fetch has completed —
    // stale localStorage may show phantom active annotations.
    if (!this.initialLoadDone) return

    const hasActive = this.totalActiveCount() > 0
    if (hasActive && !this.pollTimer) {
      this.pollTimer = setInterval(() => this.pollForChanges(), 3000)
    } else if (!hasActive && this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }
  }

  /** Poll API for status changes (e.g. agent resolved via MCP) */
  private async pollForChanges(): Promise<void> {
    try {
      const remote = await this.api.getAnnotations()
      let changed = false
      for (const r of remote) {
        const local = this.annotations.find(a => a.id === r.id)
        if (local && local.status !== r.status) {
          local.status = r.status
          local.resolvedAt = r.resolvedAt
          local.resolvedBy = r.resolvedBy
          changed = true
        }
      }
      if (changed) {
        this.saveToStorage()
      }
      // Always re-evaluate polling — even if no status changed, the active
      // count may have dropped to zero (e.g. after loadAnnotations merged).
      this.syncMarkers()
    } catch { /* no backend or network error — skip */ }
  }

  // ── Page-scoped markers ─────────────────────────────────────────

  private syncMarkers(): void {
    this.markers?.clear()
    const current = pageKey()
    let idx = 0
    for (const a of this.annotations) {
      if (a.status === 'resolved' || a.status === 'dismissed') continue
      if (this.annotationPageKey(a) === current) {
        idx++
        this.markers?.upsert(a, idx)
      }
    }
    this.toolbar?.setAnnotationCount(this.pageAnnotations().length)
    this.toolbar?.setTotalCount(this.totalActiveCount())
    this.updatePolling()
  }

  private annotationPageKey(a: Annotation): string {
    try {
      return new URL(a.url).pathname
    } catch {
      return a.url
    }
  }

  private pageAnnotations(): Annotation[] {
    const current = pageKey()
    return this.annotations.filter(a =>
      this.annotationPageKey(a) === current &&
      a.status !== 'resolved' && a.status !== 'dismissed'
    )
  }

  private totalActiveCount(): number {
    return this.annotations.filter(a => a.status !== 'resolved' && a.status !== 'dismissed').length
  }

  // ── Annotate mode ─────────────────────────────────────────────

  private setAnnotating(active: boolean): void {
    this.isAnnotating = active
    this.toolbar?.setAnnotateActive(active)
    if (active) {
      this.attachAnnotateListeners()
    } else {
      this.detachAnnotateListeners()
      this.highlight?.hide()
      if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null }
    }
    // When frozen, toggle pointer-events based on annotate state
    this.updateFreezeStyles()
  }

  // ── Freeze mode ──────────────────────────────────────────────

  private setFrozen(frozen: boolean): void {
    this.isFrozen = frozen
    this.toolbar?.setFreezeActive(frozen)
    if (frozen) {
      this.updateFreezeStyles()
      this.freezePopovers()
      // Use window (not document) so we intercept before Livewire/Alpine handlers
      // on document. Capture on window fires before capture on document.
      for (const evt of this.freezeBlockEvents) {
        window.addEventListener(evt, this.boundFreezeClick, true)
      }
      window.addEventListener('submit', this.boundFreezeSubmit, true)
      // Block events that close dropdowns/popovers (window capture to beat frameworks)
      for (const evt of this.freezePassiveEvents) {
        window.addEventListener(evt, this.boundFreezePassive, true)
      }
    } else {
      this.frozenStyleEl?.remove()
      this.frozenStyleEl = null
      this.unfreezePopovers()
      for (const evt of this.freezeBlockEvents) {
        window.removeEventListener(evt, this.boundFreezeClick, true)
      }
      window.removeEventListener('submit', this.boundFreezeSubmit, true)
      for (const evt of this.freezePassiveEvents) {
        window.removeEventListener(evt, this.boundFreezePassive, true)
      }
    }
  }

  /** Pull open popovers out of the top layer so the rest of the page is clickable */
  private freezePopovers(): void {
    this.frozenPopovers = []
    const openSelector = ':popover-open, .\\:popover-open'
    document.querySelectorAll('[popover]').forEach((el) => {
      const htmlEl = el as HTMLElement
      const val = htmlEl.getAttribute('popover') ?? ''
      let isOpen = false
      try { isOpen = htmlEl.matches(openSelector) } catch {
        try { isOpen = htmlEl.matches('.\\:popover-open') } catch { /* ignore */ }
      }
      if (!isOpen) return
      // Save position before removing popover attribute
      const rect = htmlEl.getBoundingClientRect()
      this.frozenPopovers.push({ el: htmlEl, original: val })
      // Remove popover attribute — pulls element out of top layer
      htmlEl.removeAttribute('popover')
      // Keep it visible with inline styles
      htmlEl.style.setProperty('display', 'block', 'important')
      htmlEl.style.setProperty('position', 'fixed', 'important')
      htmlEl.style.setProperty('z-index', '2147483644', 'important')
      htmlEl.style.setProperty('top', `${rect.top}px`, 'important')
      htmlEl.style.setProperty('left', `${rect.left}px`, 'important')
      htmlEl.style.setProperty('width', `${rect.width}px`, 'important')
      // Add the polyfill class so Flux thinks it's still open
      htmlEl.classList.add(':popover-open')
    })
  }

  /** Restore popover attributes */
  private unfreezePopovers(): void {
    for (const { el, original } of this.frozenPopovers) {
      // Remove inline overrides
      for (const prop of ['display', 'position', 'z-index', 'top', 'left', 'width']) {
        el.style.removeProperty(prop)
      }
      el.classList.remove(':popover-open')
      el.setAttribute('popover', original || 'auto')
    }
    this.frozenPopovers = []
  }

  private freezeBlockEvents = ['click', 'mousedown', 'pointerdown', 'pointerup', 'mouseup', 'touchstart', 'touchend', 'auxclick'] as const
  private freezePassiveEvents = ['focusin', 'focusout', 'blur', 'pointerleave', 'mouseleave', 'mouseout'] as const

  /** Update freeze CSS — pointer-events only blocked when NOT annotating */
  private updateFreezeStyles(): void {
    if (!this.isFrozen) return
    this.frozenStyleEl?.remove()
    this.frozenStyleEl = document.createElement('style')
    this.frozenStyleEl.id = 'instruckt-freeze'
    const pointerBlock = this.isAnnotating ? '' : `
        a[href], a[wire\\:navigate], [wire\\:click], [wire\\:navigate],
        [x-on\\:click], [@click], [v-on\\:click], [onclick],
        button, input[type="submit"], select, [role="button"], [role="link"],
        [tabindex] {
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
      `
    this.frozenStyleEl.textContent = `
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
        video { filter: none !important; }
        ${pointerBlock}
      `
    document.head.appendChild(this.frozenStyleEl)
  }

  /** Block interactions on the page when frozen (except instruckt UI) */
  private boundFreezeClick = (e: Event): void => {
    if (this.isInstruckt(e.target)) return
    // When annotating, only let 'click' through (annotate handler needs it).
    // Always block mousedown/pointerdown/touchstart to prevent framework
    // handlers (Alpine @click.outside, Livewire wire:navigate) from firing.
    if (this.isAnnotating && e.type === 'click') return
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  private boundFreezeSubmit = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  /** Block focus/hover events that JS dropdowns use to auto-close.
   *  Block ALL of these — even on instruckt elements — because frameworks
   *  like Flux check if focusin target is contained in the popover and
   *  close it if it's not (e.g. focus moved to our popup textarea). */
  private boundFreezePassive = (e: Event): void => {
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  // ── Event listeners ───────────────────────────────────────────

  private boundMouseMove = (e: MouseEvent): void => {
    if (this.highlightLocked) return
    this.pendingMouseTarget = e.target as Element
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null
        if (this.highlightLocked) return
        if (this.pendingMouseTarget && !this.isInstruckt(this.pendingMouseTarget)) {
          this.highlight?.show(this.pendingMouseTarget)
        } else {
          this.highlight?.hide()
        }
      })
    }
  }

  private boundMouseLeave = (): void => {
    if (this.highlightLocked) return
    this.highlight?.hide()
  }

  /** Block mousedown/pointerdown in annotation mode so SPA frameworks can't navigate */
  private boundAnnotateBlock = (e: Event): void => {
    if (this.isInstruckt(e.target)) return
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  private boundClick = (e: MouseEvent): void => {
    const target = e.target as Element
    if (this.isInstruckt(target)) return
    // Always block clicks in annotation mode — prevents SPA navigation
    // from changing the page before the user can finish their note.
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    const selectedText = window.getSelection()?.toString().trim() || undefined
    const elementPath = getElementSelector(target)
    const elementName = getElementName(target)
    const elementLabel = getElementLabel(target)
    const cssClasses = getCssClasses(target)
    const nearbyText = getNearbyText(target) || undefined
    const boundingBox = getPageBoundingBox(target)
    const framework = this.detectFramework(target) ?? undefined

    this.highlight?.show(target)
    this.highlightLocked = true

    const pending: PendingAnnotation = {
      element: target,
      elementPath,
      elementName,
      elementLabel,
      cssClasses,
      boundingBox,
      x: e.clientX,
      y: e.clientY,
      selectedText,
      nearbyText,
      framework,
    }

    this.showAnnotationPopup(pending)
  }

  private showAnnotationPopup(pending: PendingAnnotation): void {
    this.popup?.showNew(pending, {
      onSubmit: (result) => {
        this.highlightLocked = false
        this.highlight?.hide()
        this.submitAnnotation(pending, result.comment, result.screenshot)
      },
      onCancel: () => {
        this.highlightLocked = false
        this.highlight?.hide()
      },
    })
  }

  private attachAnnotateListeners(): void {
    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseleave', this.boundMouseLeave)
    // Block mousedown/pointerdown first — SPA frameworks (Livewire wire:navigate,
    // Inertia) intercept these before click fires
    for (const evt of ['mousedown', 'pointerdown'] as const) {
      window.addEventListener(evt, this.boundAnnotateBlock, true)
    }
    // Use window capture to fire before framework handlers on document
    window.addEventListener('click', this.boundClick, true)
  }

  private detachAnnotateListeners(): void {
    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseleave', this.boundMouseLeave)
    for (const evt of ['mousedown', 'pointerdown'] as const) {
      window.removeEventListener(evt, this.boundAnnotateBlock, true)
    }
    window.removeEventListener('click', this.boundClick, true)
  }

  private isInstruckt(el: EventTarget | null): boolean {
    if (!el || !(el instanceof Element)) return false
    return el.closest('[data-instruckt]') !== null
  }

  // ── Region screenshot ────────────────────────────────────────

  private async startRegionCapture(): Promise<void> {
    // Temporarily exit annotation mode so the crosshair doesn't interfere
    const wasAnnotating = this.isAnnotating
    if (wasAnnotating) this.setAnnotating(false)

    const rect = await selectRegion()
    if (!rect) {
      if (wasAnnotating) this.setAnnotating(true)
      return
    }

    const screenshot = await captureRegion(rect)
    if (!screenshot) {
      if (wasAnnotating) this.setAnnotating(true)
      return
    }

    // Find the element at the center of the selected region
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    const target = document.elementFromPoint(centerX, centerY) ?? document.body

    const pending: PendingAnnotation = {
      element: target,
      elementPath: getElementSelector(target),
      elementName: getElementName(target),
      elementLabel: getElementLabel(target),
      cssClasses: getCssClasses(target),
      boundingBox: getPageBoundingBox(target),
      x: centerX,
      y: centerY,
      nearbyText: getNearbyText(target) || undefined,
      screenshot,
      framework: this.detectFramework(target) ?? undefined,
    }

    this.showAnnotationPopup(pending)
  }

  // ── Framework detection ───────────────────────────────────────

  private detectFramework(el: Element) {
    const adapters = this.config.adapters ?? []
    if (adapters.includes('livewire')) {
      const ctx = livewireAdapter.getContext(el)
      if (ctx) return ctx
    }
    if (adapters.includes('vue')) {
      const ctx = vueAdapter.getContext(el)
      if (ctx) return ctx
    }
    if (adapters.includes('svelte')) {
      const ctx = svelteAdapter.getContext(el)
      if (ctx) return ctx
    }
    if (adapters.includes('react')) {
      const ctx = reactAdapter.getContext(el)
      if (ctx) return ctx
    }
    // Blade is last — it's a fallback when no JS framework claims the element
    if (adapters.includes('blade')) {
      const ctx = bladeAdapter.getContext(el)
      if (ctx) return ctx
    }
    return null
  }

  // ── Submit ────────────────────────────────────────────────────

  private async submitAnnotation(pending: PendingAnnotation, comment: string, screenshot?: string): Promise<void> {
    const payload: AnnotationPayload = {
      x: (pending.x / window.innerWidth) * 100,
      y: pending.y + window.scrollY,
      comment,
      element: pending.elementName,
      elementPath: pending.elementPath,
      cssClasses: pending.cssClasses,
      boundingBox: pending.boundingBox,
      selectedText: pending.selectedText,
      nearbyText: pending.nearbyText,
      screenshot,
      intent: 'fix',
      severity: 'important',
      framework: pending.framework,
      url: window.location.href,
    }

    let annotation: Annotation
    try {
      annotation = await this.api.addAnnotation(payload)
    } catch {
      // No backend — create a local-only annotation
      annotation = {
        ...payload,
        id: crypto.randomUUID(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    }
    this.annotations.push(annotation)
    this.saveToStorage()
    this.syncMarkers()
    this.config.onAnnotationAdd?.(annotation)
    this.copyAnnotations()
  }

  // ── Marker click — edit or delete ─────────────────────────────

  private onMarkerClick(annotation: Annotation): void {
    this.popup?.showEdit(annotation, {
      onSave: async (a, newComment) => {
        try {
          const updated = await this.api.updateAnnotation(a.id, { comment: newComment })
          this.onAnnotationUpdated(updated)
        } catch {
          // No backend — update locally
          this.onAnnotationUpdated({ ...a, comment: newComment, updatedAt: new Date().toISOString() })
        }
      },
      onDelete: async (a) => {
        try {
          await this.api.updateAnnotation(a.id, { status: 'dismissed' })
        } catch { /* no backend — just remove locally */ }
        this.removeAnnotation(a.id)
      },
    }, this.config.endpoint)
  }

  private onAnnotationUpdated(updated: Annotation): void {
    const idx = this.annotations.findIndex(a => a.id === updated.id)
    if (idx >= 0) {
      this.annotations[idx] = updated
    }
    this.saveToStorage()
    this.syncMarkers()
  }

  private removeAnnotation(id: string): void {
    this.annotations = this.annotations.filter(a => a.id !== id)
    this.saveToStorage()
    this.syncMarkers()
  }

  // ── Clear ───────────────────────────────────────────────────────

  private async clearPage(): Promise<void> {
    const page = this.pageAnnotations()
    for (const a of page) {
      try {
        await this.api.updateAnnotation(a.id, { status: 'dismissed' })
      } catch { /* best effort */ }
    }
    this.annotations = this.annotations.filter(a => !page.includes(a))
    this.saveToStorage()
    this.syncMarkers()
  }

  private async clearEverything(): Promise<void> {
    const active = this.annotations.filter(a => a.status !== 'resolved' && a.status !== 'dismissed')
    for (const a of active) {
      try {
        await this.api.updateAnnotation(a.id, { status: 'dismissed' })
      } catch { /* best effort */ }
    }
    this.annotations = []
    this.saveToStorage()
    this.syncMarkers()
  }

  // ── Keyboard ──────────────────────────────────────────────────

  private onKeydown(e: KeyboardEvent): void {
    if (this.toolbar?.isMinimized()) return
    const target = e.target as HTMLElement
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (target.closest('[contenteditable="true"]')) return
    // Shadow DOM retargets e.target to the host element — check if a popup is open
    if (this.isInstruckt(target)) return

    const keys = this.config.keys ?? {}
    const noMod = !e.metaKey && !e.ctrlKey && !e.altKey
    if (e.key === (keys.annotate ?? 'a') && noMod) {
      this.setAnnotating(!this.isAnnotating)
    }
    if (e.key === (keys.freeze ?? 'f') && noMod) {
      this.setFrozen(!this.isFrozen)
    }
    if (e.key === (keys.screenshot ?? 'c') && noMod) {
      this.startRegionCapture()
    }
    if (e.key === (keys.clearPage ?? 'x') && noMod) {
      this.clearPage()
    }
    if (e.key === 'Escape') {
      if (this.isAnnotating) this.setAnnotating(false)
      if (this.isFrozen) this.setFrozen(false)
    }
  }

  // ── Copy / export ─────────────────────────────────────────────

  /** Auto-copy on annotation submit — only in secure contexts to avoid focus side-effects */
  private copyAnnotations(): void {
    this.copyToClipboard(false)
  }

  /** Copy to clipboard. With fallback=true, uses execCommand for non-secure contexts (user-initiated only). */
  private copyToClipboard(fallback: boolean): void {
    const md = this.exportMarkdown()
    if (window.isSecureContext) {
      navigator.clipboard.writeText(md).catch(() => { /* unavailable */ })
    } else if (fallback) {
      try {
        const el = document.createElement('textarea')
        el.value = md
        el.style.cssText = 'position:fixed;left:-9999px'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        el.remove()
      } catch { /* unavailable */ }
    }
  }

  exportMarkdown(): string {
    const pending = this.annotations.filter(a => a.status !== 'resolved' && a.status !== 'dismissed')
    if (pending.length === 0) {
      return `# UI Feedback\n\nNo open annotations.`
    }

    // Group by page
    const byPage = new Map<string, Annotation[]>()
    for (const a of pending) {
      const key = this.annotationPageKey(a)
      if (!byPage.has(key)) byPage.set(key, [])
      byPage.get(key)!.push(a)
    }

    const multiPage = byPage.size > 1
    const lines: string[] = []

    if (multiPage) {
      lines.push(`# UI Feedback`)
      lines.push('')
    }

    for (const [path, annotations] of byPage) {
      if (multiPage) {
        lines.push(`## ${path}`)
      } else {
        lines.push(`# UI Feedback: ${path}`)
      }
      lines.push('')

      const hPrefix = multiPage ? '###' : '##'

      annotations.forEach((a, i) => {
        // Feedback-first heading with element context
        const componentSuffix = a.framework?.component ? ` in \`${a.framework.component}\`` : ''
        lines.push(`${hPrefix} ${i + 1}. ${a.comment}`)
        lines.push(`- ID: \`${a.id}\``)
        lines.push(`- Element: \`${a.element}\`${componentSuffix}`)

        // Source file path (resolved server-side or from framework dev mode)
        if (a.framework?.source_file) {
          const loc = a.framework.source_line ? `${a.framework.source_file}:${a.framework.source_line}` : a.framework.source_file
          lines.push(`- Source: \`${loc}\``)
        } else if (a.framework?.data?.file) {
          lines.push(`- File: \`${a.framework.data.file}\``)
        }

        if (a.cssClasses) {
          lines.push(`- Classes: \`${a.cssClasses}\``)
        }
        if (a.selectedText) {
          lines.push(`- Text: "${a.selectedText}"`)
        } else if (a.nearbyText) {
          lines.push(`- Text: "${a.nearbyText.slice(0, 100)}"`)
        }
        if (a.screenshot) {
          // If stored as a relative path (from backend), show the full path
          if (!a.screenshot.startsWith('data:')) {
            lines.push(`- Screenshot: \`storage/app/_instruckt/${a.screenshot}\``)
          } else {
            lines.push(`- Screenshot: attached`)
          }
        }
        lines.push('')
      })
    }

    // Add MCP instructions when a backend is configured
    const hasScreenshots = pending.some(a => a.screenshot && !a.screenshot.startsWith('data:'))
    lines.push('---')
    lines.push('')
    if (hasScreenshots) {
      lines.push('Use the `instruckt.get_screenshot` MCP tool to view screenshots. After making changes, use `instruckt.resolve` to mark each annotation as resolved.')
    } else {
      lines.push('After making changes, use the `instruckt.resolve` MCP tool to mark each annotation as resolved.')
    }

    return lines.join('\n').trim()
  }

  // ── Public API ────────────────────────────────────────────────

  getAnnotations(): Annotation[] { return [...this.annotations] }

  destroy(): void {
    this.setAnnotating(false)
    this.setFrozen(false)
    document.removeEventListener('keydown', this.boundKeydown)
    window.removeEventListener('scroll', this.boundReposition)
    window.removeEventListener('resize', this.boundReposition)
    this.toolbar?.destroy()
    this.highlight?.destroy()
    this.popup?.destroy()
    this.markers?.destroy()
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    if (this.pollTimer !== null) clearInterval(this.pollTimer)
  }
}
