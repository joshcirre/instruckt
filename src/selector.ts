/**
 * CSS selector and element path generation.
 * Produces unique, grep-able selectors for any DOM element.
 */

/** Build a unique CSS selector for an element */
export function getElementSelector(el: Element): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`
  }

  const path: string[] = []
  let current: Element | null = el

  while (current && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase()
    const parent: Element | null = current.parentElement

    if (!parent) {
      path.unshift(tag)
      break
    }

    // Try unique class combo
    const classes = Array.from(current.classList)
      .filter(c => !c.match(/^(hover|focus|active|visited|is-|has-)/)) // skip state classes
      .slice(0, 3)

    if (classes.length > 0) {
      const classSelector = `${tag}.${classes.map(CSS.escape).join('.')}`
      const matches = parent.querySelectorAll(classSelector)
      if (matches.length === 1) {
        path.unshift(classSelector)
        break
      }
    }

    // Fall back to nth-child
    const siblings = Array.from(parent.children).filter((c: Element) => c.tagName === current!.tagName)
    if (siblings.length === 1) {
      path.unshift(tag)
    } else {
      const index = siblings.indexOf(current) + 1
      path.unshift(`${tag}:nth-of-type(${index})`)
    }

    current = parent
  }

  return path.join(' > ')
}

/** Human-readable element name for display in the popup */
export function getElementName(el: Element): string {
  // Prefer component-level labels
  const wireModel = el.getAttribute('wire:model') || el.getAttribute('wire:click')
  if (wireModel) return `wire:${wireModel.split('.')[0]}`

  const ariaLabel = el.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  const id = el.id
  if (id) return `#${id}`

  const tag = el.tagName.toLowerCase()
  const role = el.getAttribute('role')
  if (role) return `${tag}[${role}]`

  const firstClass = el.classList[0]
  if (firstClass) return `${tag}.${firstClass}`

  return tag
}

/** Get nearby readable text for context */
export function getNearbyText(el: Element): string {
  const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
  return text.slice(0, 120)
}

/** CSS classes as a space-separated string, filtering noise */
export function getCssClasses(el: Element): string {
  return Array.from(el.classList)
    .filter(c => !c.match(/^(instruckt-)/)) // exclude our own classes
    .join(' ')
}

/** Get bounding box relative to the page */
export function getPageBoundingBox(el: Element): { x: number; y: number; width: number; height: number } {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  }
}
