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
}
declare function instruckt(options?: InstrucktPluginOptions): Plugin;

export { type InstrucktPluginOptions, instruckt as default };
