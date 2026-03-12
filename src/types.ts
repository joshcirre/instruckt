export type AnnotationIntent = 'fix' | 'change' | 'question' | 'approve'
export type AnnotationSeverity = 'blocking' | 'important' | 'suggestion'
export type AnnotationStatus = 'pending' | 'resolved' | 'dismissed'

export interface FrameworkContext {
  framework: 'livewire' | 'vue' | 'svelte' | 'react' | 'blade'
  component: string
  data?: Record<string, unknown>
  // Source location (resolved client-side in dev mode, or server-side)
  source_file?: string
  source_line?: number
  // Livewire-specific
  wire_id?: string
  class_name?: string
  render_line?: number
  // Vue-specific
  component_uid?: string
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Annotation {
  id: string
  url: string
  x: number
  y: number
  comment: string
  element: string
  elementPath: string
  cssClasses: string
  boundingBox: BoundingBox
  selectedText?: string
  nearbyText?: string
  screenshot?: string
  intent: AnnotationIntent
  severity: AnnotationSeverity
  status: AnnotationStatus
  framework?: FrameworkContext
  createdAt: string
  updatedAt?: string
  resolvedAt?: string
  resolvedBy?: 'human' | 'agent'
}

export interface MarkerColors {
  /** Default marker color. Default: '#6366f1' (indigo) */
  default?: string
  /** Screenshot marker color. Default: '#22c55e' (green) */
  screenshot?: string
  /** Dismissed marker color. Default: '#71717a' */
  dismissed?: string
}

export interface KeyBindings {
  /** Toggle annotate mode. Default: 'a' */
  annotate?: string
  /** Toggle freeze. Default: 'f' */
  freeze?: string
  /** Region screenshot. Default: 'c' */
  screenshot?: string
  /** Clear page annotations. Default: 'x' */
  clearPage?: string
}

export interface InstrucktConfig {
  /** URL to POST annotations to. Default: '/instruckt' */
  endpoint: string
  /** Framework adapters to activate. Default: auto-detect */
  adapters?: Array<'livewire' | 'vue' | 'svelte' | 'react' | 'blade'>
  /** Theme preference. Default: 'auto' */
  theme?: 'light' | 'dark' | 'auto'
  /** Position of the toolbar. Default: 'bottom-right' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Customize marker pin colors */
  colors?: MarkerColors
  /** Customize keyboard shortcuts */
  keys?: KeyBindings
  /** Path prefix for screenshots in markdown export. Default: 'storage/app/_instruckt/' */
  screenshotPath?: string
  /** Callbacks */
  onAnnotationAdd?: (annotation: Annotation) => void
  onAnnotationResolve?: (annotation: Annotation) => void
}

export interface PendingAnnotation {
  element: Element
  elementPath: string
  elementName: string
  elementLabel: string
  cssClasses: string
  boundingBox: BoundingBox
  x: number
  y: number
  selectedText?: string
  nearbyText?: string
  screenshot?: string
  framework?: FrameworkContext
}
