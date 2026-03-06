## Optimal Annotation Format for AI Coding Agents

The primary goal of this format is **immediate grep-ability**. An agent should be able to read one line of your output and know exactly which file to open and where to look.

### 1. What's Essential vs. Noise
*   **Essential (The Signal):**
    *   **Feedback/Comment:** This should be the **Heading**. It is the "Task" the agent must perform.
    *   **Component Name:** The #1 locator. Agents grep for component names to find files.
    *   **Text Context (Nearby/Selected):** The #1 disambiguator. If there are four `button.btn-primary` elements, the text "Place Order" is the only thing that helps the agent find the right line.
    *   **CSS Classes (Unescaped):** Critical for finding elements in templates, especially with Tailwind.
    *   **Framework Type:** Helps the agent know if it's looking for a `.blade.php`, `.tsx`, or `.vue` file.
*   **Noise (The Distraction):**
    *   **Full CSS Selector Path:** `body > main > div > ...` is fragile, unreadable, and doesn't map to source code. It is useless for code changes.
    *   **Position Data (Bounding Box, x/y, Viewport):** Pixel coordinates mean nothing to a code agent. Unless the bug is specifically "This element overlaps another at 1440px", this is pure noise.
    *   **Runtime IDs:** `wire:id="abc123"` changes every time the page loads. It is never in the source code. Drop it.

### 2. The Recommended Format
Use **Markdown** with a clear hierarchy. It is the native language of LLMs and remains readable for the human who is pasting it.

#### Concrete Example

```markdown
# UI Feedback: Project Name

## /auth/login

### 1. Make the login card have rounded corners
- **Component:** `pages::auth.login` (Livewire)
- **Element:** `div` with classes `bg-white border shadow-sm`
- **Context:** "Login to your account"

### 2. Change submit button color to emerald green
- **Component:** `pages::auth.login` (Livewire)
- **Element:** `button.btn-primary`
- **Selected Text:** "Submit Login"

---

## /dashboard

### 3. Add a loading spinner to the search bar
- **Component:** `GlobalSearch` (React)
- **Source:** `/src/components/GlobalSearch.tsx`
- **Element:** `input.search-input`
```

### 3. Design Principles & Rationale

1.  **Instruction as Heading:** Agents (like Claude or GPT-4o) scan headings to build a task list. Placing the feedback in the `###` heading makes the entire output a checklist.
2.  **Component Before Element:** The hierarchy of discovery is `File -> Component -> Element`. Lead with the component name so the agent knows which file to `grep` first.
3.  **Unescaped Classes:** Never output escaped CSS selectors like `div.\[\:where\(\&\)\]\:bg-white`. The agent needs the raw class names (`bg-white`) because that is what exists in the template.
4.  **Disambiguate with Text:** If `selectedText` is available, prioritize it. If not, use `nearbyText`. This is the single most reliable way for an agent to find the exact line in a large file.
5.  **Grouping by Path:** Grouping by URL pathname (`/auth/login`) helps the agent understand the routing context without needing full URLs.
6.  **Meta-Instructions:** Do not include "work through these one at a time" or other fluff. The structure should be self-evident. A single header like `<!-- Instruckt UI Feedback -->` is enough to set the context.

### 4. Implementation Notes for `instruckt`
*   **Drop `elementPath`** entirely from the markdown export. It's great for internal tracking but toxic for agent context.
*   **Condense Metadata:** If the `Framework` adapter provides a file path (like Svelte does), make it the primary "Location" field.
*   **Cleanup Classes:** Filter out state classes (`hover:`, `focus:`) and tool-specific classes (`instruckt-highlight`) to reduce noise.
