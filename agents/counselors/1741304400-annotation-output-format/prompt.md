# Review Request

## Question

What is the optimal structured output format for a visual annotation/feedback tool that helps AI coding agents locate and act on UI feedback from humans?

The tool lets users click on elements in their browser, add a note, and then copy structured markdown to paste into an AI coding agent. The agent needs enough context to find the exact element in the codebase and understand what change is requested.

The tool is **framework-agnostic** — it works with Livewire, Vue, React, Svelte, and plain Blade/HTML. It is NOT React-only.

## Context

### What data we capture per annotation
- **element**: Short element name (e.g. "button.btn-primary", "div.card-header")
- **elementPath**: Full CSS selector path (e.g. "body > main > div.container > button.btn-primary")
- **cssClasses**: All CSS classes on the element
- **nearbyText**: Visible text content near the element
- **selectedText**: Any text the user highlighted before annotating
- **boundingBox**: `{ x, y, width, height }` pixel position/size
- **x, y**: Click coordinates (x as % of viewport, y as px from top)
- **comment**: The user's feedback/instruction
- **framework**: Framework-specific context when available:
  - Livewire: `{ framework: "livewire", component: "OrderForm", wire_id: "abc123" }`
  - Vue: `{ framework: "vue", component: "ProductCard", component_uid: "42", data: { ... } }`
  - React: `{ framework: "react", component: "CheckoutButton", data: { ... } }`
  - Svelte: `{ framework: "svelte", component: "Header", data: { file: "/src/components/Header.svelte" } }`
- **url**: The page URL where the annotation was made

### Current output format (matches agentation's "standard" level)
```markdown
## Page Feedback: /auth/login
**Viewport:** 1440×900

### 1. div.[:where(&)]:bg-white
**Location:** div.\[\:where\(\&\)\]\:bg-white.dark\:\[\:where\(\&\)\]\:bg-white\/10.border
**Component:** pages::auth.login
**Classes:** [:where(&)]:bg-white dark:[:where(&)]:bg-white/10 border
**Position:** 440px, 310px (120×40px)
**Feedback:** Make this card have rounded corners

### 2. button.btn-primary
**Location:** body > main > form > button.btn-primary
**Component:** pages::auth.login
**Context:** Submit Login
**Feedback:** Change button color to green
```

### Annotations can span multiple pages
When annotating across pages, output groups by page pathname.

### How it's used
1. Human clicks elements in browser, types feedback
2. Feedback is auto-copied to clipboard as markdown
3. Human pastes into AI coding agent (Claude Code, Cursor, Codex, Copilot, OpenCode, etc.)
4. Agent reads the markdown and makes the requested code changes

## Instructions

You are providing an independent review of what structured output format works best for AI coding agents to act on visual UI feedback. Consider:

1. **What fields are essential vs noise?** Which data points actually help an agent find the right code to change? Which are distracting?
2. **What's the ideal format?** Markdown? JSON? YAML? Something else? Consider that this gets pasted into chat with an agent.
3. **Should we include the full CSS selector path, or is the component name + element enough?**
4. **Is viewport/position data useful, or just noise for code changes?**
5. **What about framework context — how much component data should we include?**
6. **When there are multiple pages of annotations, how should they be grouped/structured?**
7. **Should we include any meta-instructions for the agent (e.g. "work through these one page at a time")?**

Be direct and opinionated. Give a concrete recommended format with a real example. Think about what actually helps an agent grep for the right file, find the right component, and make the right change.
