import type { Annotation } from '../types'

type MarkerClickHandler = (annotation: Annotation) => void

interface MarkerEl {
  el: HTMLElement
  annotationId: string
}

/** Manages numbered annotation pins rendered directly on the page */
export class AnnotationMarkers {
  private container: HTMLElement
  private markers: Map<string, MarkerEl> = new Map()

  constructor(private readonly onClick: MarkerClickHandler) {
    // Fixed-position container over the page, pointer-events passthrough
    this.container = document.createElement('div')
    Object.assign(this.container.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483645',
    })
    this.container.setAttribute('data-instruckt', 'markers')
    const root = document.getElementById('instruckt-root') ?? document.body
    root.appendChild(this.container)
  }

  /** Add or update a marker for an annotation */
  upsert(annotation: Annotation, index: number): void {
    const existing = this.markers.get(annotation.id)

    if (existing) {
      this.updateStyle(existing.el, annotation)
      return
    }

    const el = document.createElement('div')
    el.className = `ik-marker ${this.statusClass(annotation.status)}`
    el.textContent = String(index)
    el.title = annotation.comment.slice(0, 60)
    el.style.pointerEvents = 'all'

    // Position: annotation.x is % of viewport width, annotation.y is px from top (scroll-adjusted)
    // Convert back to viewport-relative for fixed positioning
    el.style.left = `${(annotation.x / 100) * window.innerWidth}px`
    el.style.top = `${annotation.y - window.scrollY}px`

    el.addEventListener('click', (e) => {
      e.stopPropagation()
      this.onClick(annotation)
    })

    this.container.appendChild(el)
    this.markers.set(annotation.id, { el, annotationId: annotation.id })
  }

  /** Update an existing marker after its annotation status changed */
  update(annotation: Annotation): void {
    const marker = this.markers.get(annotation.id)
    if (!marker) return
    this.updateStyle(marker.el, annotation)
  }

  private updateStyle(el: HTMLElement, annotation: Annotation): void {
    el.className = `ik-marker ${this.statusClass(annotation.status)}`
    el.title = annotation.comment.slice(0, 60)
  }

  private statusClass(status: string): string {
    if (status === 'resolved') return 'resolved'
    if (status === 'dismissed') return 'dismissed'
    if (status === 'acknowledged') return 'acknowledged'
    return ''
  }

  /** Reposition all markers (e.g. after scroll or resize) */
  reposition(annotations: Annotation[]): void {
    annotations.forEach(annotation => {
      const marker = this.markers.get(annotation.id)
      if (!marker) return
      marker.el.style.left = `${(annotation.x / 100) * window.innerWidth}px`
      marker.el.style.top = `${annotation.y - window.scrollY}px`
    })
  }

  remove(annotationId: string): void {
    const marker = this.markers.get(annotationId)
    if (!marker) return
    marker.el.remove()
    this.markers.delete(annotationId)
  }

  /** Show or hide all markers */
  setVisible(visible: boolean): void {
    this.container.style.display = visible ? '' : 'none'
  }

  /** Remove all markers without destroying the container */
  clear(): void {
    for (const { el } of this.markers.values()) {
      el.remove()
    }
    this.markers.clear()
  }

  destroy(): void {
    this.container.remove()
    this.markers.clear()
  }
}
