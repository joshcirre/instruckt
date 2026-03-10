type AnnotationIntent = 'fix' | 'change' | 'question' | 'approve';
type AnnotationSeverity = 'blocking' | 'important' | 'suggestion';
type AnnotationStatus = 'pending' | 'resolved' | 'dismissed';
interface FrameworkContext {
    framework: 'livewire' | 'vue' | 'svelte' | 'react' | 'blade';
    component: string;
    data?: Record<string, unknown>;
    source_file?: string;
    source_line?: number;
    wire_id?: string;
    class_name?: string;
    render_line?: number;
    component_uid?: string;
}
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface Annotation {
    id: string;
    url: string;
    x: number;
    y: number;
    comment: string;
    element: string;
    elementPath: string;
    cssClasses: string;
    boundingBox: BoundingBox;
    selectedText?: string;
    nearbyText?: string;
    screenshot?: string;
    intent: AnnotationIntent;
    severity: AnnotationSeverity;
    status: AnnotationStatus;
    framework?: FrameworkContext;
    createdAt: string;
    updatedAt?: string;
    resolvedAt?: string;
    resolvedBy?: 'human' | 'agent';
}
interface MarkerColors {
    /** Default marker color. Default: '#6366f1' (indigo) */
    default?: string;
    /** Screenshot marker color. Default: '#22c55e' (green) */
    screenshot?: string;
    /** Dismissed marker color. Default: '#71717a' */
    dismissed?: string;
}
interface KeyBindings {
    /** Toggle annotate mode. Default: 'a' */
    annotate?: string;
    /** Toggle freeze. Default: 'f' */
    freeze?: string;
    /** Region screenshot. Default: 'c' */
    screenshot?: string;
    /** Clear page annotations. Default: 'x' */
    clearPage?: string;
}
interface InstrucktConfig {
    /** URL to POST annotations to. Default: '/instruckt' */
    endpoint: string;
    /** Framework adapters to activate. Default: auto-detect */
    adapters?: Array<'livewire' | 'vue' | 'svelte' | 'react' | 'blade'>;
    /** Theme preference. Default: 'auto' */
    theme?: 'light' | 'dark' | 'auto';
    /** Position of the toolbar. Default: 'bottom-right' */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** Customize marker pin colors */
    colors?: MarkerColors;
    /** Customize keyboard shortcuts */
    keys?: KeyBindings;
    /** Callbacks */
    onAnnotationAdd?: (annotation: Annotation) => void;
    onAnnotationResolve?: (annotation: Annotation) => void;
}

type AnnotationPayload = Omit<Annotation, 'id' | 'status' | 'thread' | 'createdAt'>;

declare class Instruckt {
    private config;
    private api;
    private toolbar;
    private highlight;
    private popup;
    private markers;
    private annotations;
    private isAnnotating;
    private isFrozen;
    private frozenStyleEl;
    private frozenPopovers;
    private rafId;
    private pendingMouseTarget;
    private highlightLocked;
    private pollTimer;
    private initialLoadDone;
    private boundKeydown;
    private boundReposition;
    constructor(config: InstrucktConfig);
    private init;
    private makeToolbarCallbacks;
    private reattach;
    private onMinimize;
    private static STORAGE_KEY;
    private loadAnnotations;
    private saveToStorage;
    private loadFromStorage;
    /** Start or stop polling based on whether there are active annotations */
    private updatePolling;
    /** Poll API for status changes (e.g. agent resolved via MCP) */
    private pollForChanges;
    private syncMarkers;
    private annotationPageKey;
    private pageAnnotations;
    private totalActiveCount;
    private setAnnotating;
    private setFrozen;
    /** Pull open popovers out of the top layer so the rest of the page is clickable */
    private freezePopovers;
    /** Restore popover attributes */
    private unfreezePopovers;
    private freezeBlockEvents;
    private freezePassiveEvents;
    /** Update freeze CSS — pointer-events only blocked when NOT annotating */
    private updateFreezeStyles;
    /** Block interactions on the page when frozen (except instruckt UI) */
    private boundFreezeClick;
    private boundFreezeSubmit;
    /** Block focus/hover events that JS dropdowns use to auto-close.
     *  Block ALL of these — even on instruckt elements — because frameworks
     *  like Flux check if focusin target is contained in the popover and
     *  close it if it's not (e.g. focus moved to our popup textarea). */
    private boundFreezePassive;
    private boundMouseMove;
    private boundMouseLeave;
    /** Block mousedown/pointerdown in annotation mode so SPA frameworks can't navigate */
    private boundAnnotateBlock;
    private boundClick;
    private showAnnotationPopup;
    private attachAnnotateListeners;
    private detachAnnotateListeners;
    private isInstruckt;
    private startRegionCapture;
    private detectFramework;
    private submitAnnotation;
    private onMarkerClick;
    private onAnnotationUpdated;
    private removeAnnotation;
    private clearPage;
    private clearEverything;
    private onKeydown;
    /** Auto-copy on annotation submit — only in secure contexts to avoid focus side-effects */
    private copyAnnotations;
    /** Copy to clipboard. With fallback=true, uses execCommand for non-secure contexts (user-initiated only). */
    private copyToClipboard;
    exportMarkdown(): string;
    getAnnotations(): Annotation[];
    destroy(): void;
}

/**
 * Initialize instruckt.
 *
 * @example
 * instruckt.init({ endpoint: '/instruckt' })
 *
 * @example CDN
 * <script src="instruckt.iife.js"></script>
 * <script>Instruckt.init({ endpoint: '/instruckt' })</script>
 */
declare function init(config: InstrucktConfig): Instruckt;

export { type Annotation, type AnnotationIntent, type AnnotationPayload, type AnnotationSeverity, type AnnotationStatus, type FrameworkContext, Instruckt, type InstrucktConfig, init };
