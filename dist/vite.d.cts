import { Plugin } from 'vite';

interface InstrucktPluginOptions {
    /** Framework adapters to activate. Default: auto-detect */
    adapters?: Array<'livewire' | 'vue' | 'svelte' | 'react' | 'blade'>;
    /** Theme preference. Default: 'auto' */
    theme?: 'light' | 'dark' | 'auto';
    /** Toolbar position. Default: 'bottom-right' */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** Customize marker pin colors */
    colors?: {
        default?: string;
        screenshot?: string;
        dismissed?: string;
    };
    /** Customize keyboard shortcuts */
    keys?: {
        annotate?: string;
        freeze?: string;
        screenshot?: string;
        clearPage?: string;
    };
    /** Storage directory relative to project root. Default: '.instruckt' */
    dir?: string;
    /**
     * API endpoint prefix for the client. Default: '/instruckt'
     * Set this to match your backend's route prefix (e.g. '/instruckt' for Laravel).
     */
    endpoint?: string;
    /**
     * Enable the built-in dev API server for annotations and screenshots.
     * Set to false when your framework provides its own backend (e.g. Laravel).
     * Default: true
     */
    server?: boolean;
    /**
     * Whether MCP tools (get_screenshot, resolve) are available.
     * Set to true when using with a backend that registers MCP tools (e.g. Laravel).
     * Default: false
     */
    mcp?: boolean;
}
declare function instruckt(options?: InstrucktPluginOptions): Plugin;

export { type InstrucktPluginOptions, instruckt as default };
