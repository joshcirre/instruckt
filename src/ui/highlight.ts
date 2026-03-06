/** Hover highlight overlay — uses all inline styles, no CSS class needed */
export class ElementHighlight {
  private el: HTMLElement

  constructor() {
    this.el = document.createElement('div')
    // All styling inline to avoid any host-page CSS interference
    Object.assign(this.el.style, {
      position: 'fixed',
      pointerEvents: 'none', // MUST be none — prevents swallowing clicks
      zIndex: '2147483644',
      border: '2px solid rgba(99,102,241,0.7)',
      background: 'rgba(99,102,241,0.1)',
      borderRadius: '3px',
      transition: 'all 0.06s ease',
      display: 'none',
    })
    this.el.setAttribute('data-instruckt', 'highlight')
    const root = document.getElementById('instruckt-root') ?? document.body
    root.appendChild(this.el)
  }

  show(el: Element): void {
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      this.hide()
      return
    }
    Object.assign(this.el.style, {
      display: 'block',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })
  }

  hide(): void {
    this.el.style.display = 'none'
  }

  destroy(): void {
    this.el.remove()
  }
}
