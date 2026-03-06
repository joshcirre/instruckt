Based on your requirements, here is a recommended structured output format designed for clarity, precision, and efficient processing by AI coding agents.

The optimal format is **Markdown with embedded JSON context blocks**. This approach combines human readability with machine-readable precision. The AI agent gets clear instructions and unambiguous technical data to locate the correct code, while a human can still easily read and verify the request.

### Core Principles

1.  **Signal over Noise:** The agent needs clues to find code, not to paint a picture.
    *   **Essential:** File path hints, framework component names, short element selectors, and nearby text are the strongest signals for `grep` and semantic code search.
    *   **Noise:** Viewport dimensions, bounding boxes, and click coordinates (`x`, `y`) are irrelevant for code modification and should be omitted. They describe the rendered output, not the source code, and provide no actionable information for an agent editing files.

2.  **Machine-Readable Context is Key:** Relying on the AI to parse free-form Markdown (e.g., `**Component:** MyComponent`) is brittle. A structured `json` block provides an unambiguous "fact sheet" for the agent, separating data from instruction.

3.  **Prioritize Component & File Location:** The full CSS selector path is a fragile, last-resort fallback. The primary identifiers should be the framework component name and a best-effort guess at the source file path. This is far more direct. For example, locating `src/components/ProductCard.jsx` and then finding `<button class="btn-primary">` is much more reliable than parsing `body > div#app > main > div:nth-child(2) > ... > button`.

4.  **Structure for Clarity:** Grouping feedback by page and providing a clear preamble gives the agent a logical workflow to follow.

---

### Recommended Format Template

````markdown
As an AI coding assistant, your task is to implement the following UI feedback. Each item includes a user request and a JSON block with technical context to help you locate the relevant code. Work through the items for each page.

## Page: [Page URL, e.g., /auth/login]

### 1. [Short, descriptive title of the change]

> [The user's raw feedback/instruction as a blockquote.]

```json
{
  "file_path_hint": "[Best-effort guess at the file path, e.g., 'resources/views/auth/login.blade.php']",
  "component": {
    "framework": "[e.g., 'livewire', 'react', 'none']",
    "name": "[Component name, e.g., 'auth.login', 'LoginButton']"
  },
  "element": {
    "tag": "[e.g., 'button', 'div']",
    "selector": "[Short, specific selector, e.g., 'button.btn-primary', 'div.card-header']",
    "text_content": "[Visible text inside the element, if any]",
    "nearby_text": "[Visible text near the element for context]"
  },
  "url": "[The full URL where the annotation was made]"
}
```
---

### 2. [Next feedback item...]

> ...

```json
{
  ...
}
```

## Page: [Next Page URL, e.g., /products/123]

### 1. [Feedback item for the new page...]
````

---

### Concrete Example

Here is a real-world example applying this format to feedback spanning two different pages and frameworks.

As an AI coding assistant, your task is to implement the following UI feedback. Each item includes a user request and a JSON block with technical context to help you locate the relevant code. Work through the items for each page.

## Page: /auth/login

### 1. Add rounded corners to the login card

> The login card is too sharp. Can we make it have rounded corners, like `rounded-lg` in Tailwind?

```json
{
  "file_path_hint": "resources/views/livewire/pages/auth/login.blade.php",
  "component": {
    "framework": "livewire",
    "name": "pages::auth.login"
  },
  "element": {
    "tag": "div",
    "selector": "div.dark:bg-white\\/10",
    "text_content": null,
    "nearby_text": "Sign in to your account"
  },
  "url": "https://example.com/auth/login"
}
```
---

### 2. Change primary button color

> The main "Sign in" button should be green to match our new branding.

```json
{
  "file_path_hint": "resources/views/livewire/pages/auth/login.blade.php",
  "component": {
    "framework": "livewire",
    "name": "pages::auth.login"
  },
  "element": {
    "tag": "button",
    "selector": "button[type='submit']",
    "text_content": "Sign in",
    "nearby_text": "Forgot password?"
  },
  "url": "https://example.com/auth/login"
}
```

## Page: /products/p-c4a5b-deluxe-widget

### 1. Fix text overflow on product card

> The product title is breaking out of the card on mobile. It should wrap to a new line.

```json
{
  "file_path_hint": "src/components/ProductCard.jsx",
  "component": {
    "framework": "react",
    "name": "ProductCard"
  },
  "element": {
    "tag": "h3",
    "selector": "h3.product-title",
    "text_content": "The Amazing Deluxe Widget with Extra Features and a Really Long Name",
    "nearby_text": "$99.99"
  },
  "url": "https://example.com/products/p-c4a5b-deluxe-widget"
}
```
