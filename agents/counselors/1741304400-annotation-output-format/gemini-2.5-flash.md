AI coding agents benefit most from structured, machine-readable data that precisely pinpoints code locations, along with clear, actionable feedback. The current markdown format is human-readable, but less ideal for programmatic parsing by an AI.

Here's an independent review and recommended output format:

---

### 1. Essential vs. Noise Fields

**Essential Fields (Highly valuable for code changes):**

*   **`page_url`**: Crucial for understanding the context and relating to routing or page-specific logic.
*   **`framework_context`**: **Critical.** This is often the primary identifier for component-based architectures.
    *   `type`: (e.g., `livewire`, `react`, `vue`, `svelte`, `blade`) – Helps target framework-specific search patterns.
    *   `component_name`: (e.g., `OrderForm`, `ProductCard`, `pages::auth.login`) – Direct hint to component file names or template paths.
    *   `component_file`: (e.g., `/src/components/Header.svelte`) – **Extremely valuable**, as it gives the exact file path to modify. This should be prioritized for Svelte and similar frameworks where it's easily obtained.
*   **`element_type`**: A concise, human-readable descriptor (e.g., "button.btn-primary"). Useful for quick scanning and initial grep.
*   **`css_selector`**: The full CSS selector path (e.g., `body > main > form > button.btn-primary`). Indispensable for precise targeting within HTML/template files, especially for generic elements or nested structures where component names might be absent or ambiguous.
*   **`context_text`**: This combines `selectedText` and `nearbyText`. Provides semantic context around the element, aiding in finding the correct code block, particularly for text-driven UI elements.
*   **`comment`**: The core user instruction. This must be clear and direct.

**Noise Fields (Less useful for code changes, better for visual debugging):**

*   **`boundingBox`, `x, y` coordinates, `Viewport` data**: These are visual layout details. An AI agent modifies code, not pixel positions. They are distracting and add unnecessary bulk.
*   **`css_classes`**: While sometimes useful, it can be very noisy, especially with utility-first CSS frameworks (e.g., `[:where(&)]:bg-white dark:[:where(&)]:bg-white/10 border`). If the `element_type` already captures the primary class, and the `framework_context` and `css_selector` are strong, the full list of classes often adds more cognitive load than benefit for an AI trying to find the specific code to change. *Recommendation: Omit unless specifically asked for highly granular CSS modifications.*
*   **Framework internal IDs (`wire_id`, `component_uid`)**: These are internal runtime identifiers and rarely map directly to static code files an AI would edit.

### 2. Ideal Format

**Markdown with Embedded YAML:** The optimal format is Markdown with embedded YAML blocks for each annotation.
*   **Why?** Markdown is natively understood in chat environments and is human-readable. YAML is machine-parseable, highly structured, and more human-readable than JSON for configuration-like data. This hybrid approach offers the best of both worlds: agents can reliably extract metadata, and humans can easily review the feedback.

### 3. Full CSS Selector Path vs. Component Name + Element

**Include Both.** The `component_name` (especially with `component_file`) is the primary target for framework-specific changes. However, the `css_selector` is crucial for:
1.  Generic HTML/Blade views without clear component boundaries.
2.  Ensuring specificity when multiple components might share a name or when targeting a specific element *within* a component.
3.  Acting as a robust fallback if framework context is incomplete or absent.

### 4. Viewport/Position Data Utility

**Noise.** Remove it. AI agents need file paths, component names, selectors, and semantic context to perform code changes, not screen coordinates.

### 5. Framework Context – How Much Component Data?

Prioritize fields that directly help locate the source code file:
*   `type`: (e.g., `livewire`, `react`, `vue`, `svelte`, `blade`)
*   `component_name`: (e.g., `OrderForm`, `ProductCard`, `pages::auth.login`)
*   `component_file`: **If available**, this is the most direct path to the code.

Exclude internal runtime IDs (`wire_id`, `component_uid`) and generic `data` objects unless there's a predefined schema that directly maps to code attributes.

### 6. Multiple Pages of Annotations

Group annotations by `page_url` using clear Markdown headings. This provides a logical structure for the AI to process the feedback page by page.

### 7. Meta-Instructions for the Agent

Yes, a concise preamble or concluding instruction helps set expectations and guide the agent's workflow.

---

### Recommended Output Format Example

```markdown
# UI Feedback for AI Coding Agent

This document contains UI feedback points for an AI coding agent to implement. Each feedback item includes structured metadata to help locate the relevant code and a user comment detailing the requested change. The agent should process these annotations sequentially.

---

## Page: /auth/login

```yaml
annotation_id: "001-login-card"
page_url: "/auth/login"
element_type: "div.bg-white"
css_selector: "div.[:where(&)]:bg-white.dark:[:where(&)]:bg-white/10.border"
framework_context:
  type: "blade"
  component_name: "pages::auth.login"
context_text: "" # or "Sign In" if that's nearby text
```
**Feedback:** Make this card have rounded corners. Add a `rounded-lg` Tailwind class to the main card `div`.

---

```yaml
annotation_id: "002-login-button"
page_url: "/auth/login"
element_type: "button.btn-primary"
css_selector: "body > main > form > button.btn-primary"
framework_context:
  type: "blade" # Or specific framework if auto-detected
  component_name: "pages::auth.login"
context_text: "Submit Login"
```
**Feedback:** Change the primary login button color to green. Update its styling to use a green background instead of blue, like `bg-green-500`.

---

## Page: /products/view/123

```yaml
annotation_id: "003-product-title"
page_url: "/products/view/123"
element_type: "h1.product-title"
css_selector: "#app > div.product-detail > ProductCard > h1.product-title"
framework_context:
  type: "vue"
  component_name: "ProductCard"
  component_file: "/resources/js/components/ProductCard.vue" # Example Vue component file path
context_text: "Amazing Product X"
```
**Feedback:** Increase the font size of the product title within this card. Make it `text-2xl` for better prominence.

---

```yaml
annotation_id: "004-add-to-cart-button"
page_url: "/products/view/123"
element_type: "button.add-to-cart"
css_selector: "#app > div.product-detail > ProductCard > div.actions > button.add-to-cart"
framework_context:
  type: "vue"
  component_name: "ProductCard"
  component_file: "/resources/js/components/ProductCard.vue"
context_text: "Add to Cart"
```
**Feedback:** Change this button to say "Pre-order Now" instead of "Add to Cart".

---
```
