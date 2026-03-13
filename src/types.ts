export type AnnotationIntent = 'fix' | 'change' | 'question' | 'approve'
export type AnnotationSeverity = 'blocking' | 'important' | 'suggestion'
export type AnnotationStatus = 'pending' | 'resolved' | 'dismissed'

export interface SourceFrame {
  filePath: string
  lineNumber: number | null
  columnNumber: number | null
  componentName: string | null
}

export interface FrameworkContext {
  framework: 'livewire' | 'vue' | 'svelte' | 'react' | 'blade'
  component: string
  data?: Record<string, unknown>
  // Source location (resolved client-side in dev mode, or server-side)
  source_file?: string
  source_line?: number
  source_column?: number
  // Full component stack from element-source
  component_stack?: SourceFrame[]
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

/** Set to false to hide a built-in toolbar tool. Omit or true to show. */
export interface ToolsConfig {
  annotate?: boolean
  screenshot?: boolean
  freeze?: boolean
  copy?: boolean
  clear_page?: boolean
  clear_all?: boolean
  minimize?: boolean
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
  /** Show or hide built-in toolbar tools. Set to false to hide. Default: all true. */
  tools?: ToolsConfig
  /** Path prefix for screenshots in markdown export. Default: 'storage/app/_instruckt/' */
  screenshotPath?: string
  /** Whether MCP tools (get_screenshot, resolve) are available. Default: false */
  mcp?: boolean
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
