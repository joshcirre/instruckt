## Recommended Output Format for AI Annotation Feedback

### TL;DR Verdict

The current format has two core problems: **feedback is buried last** (agents should see the instruction first) and **noise drowns signal** (position data, escaped CSS selectors, runtime IDs don't help find code).

---

### What Actually Helps vs. Noise

**Keep:**
- `comment` — the instruction, should be the heading
- `framework.component` — this is how agents find the file, most valuable field
- `framework.data.file` (Svelte) — exact file path, even better
- element tag + readable classes — for grepping within the component
- `nearbyText` / `selectedText` — confirms correct element when classes are ambiguous
- page pathname — for grouping

**Drop:**
- `boundingBox`, `x`, `y` — pixel coordinates never help find code
- `elementPath` (full CSS selector) — fragile, unreadable with Tailwind (`div.\[\:where\(\&\)\]\:bg-white...`), the component name is almost always enough
- runtime IDs (`wire_id`, `component_uid`) — change per request, not in source
- `viewport` — irrelevant for code changes

---

### Recommended Format

```markdown
<!-- Instruckt UI feedback — review each item and make the requested code change -->

## /auth/login

**1. Make the login card have rounded corners**
- Component: `pages::auth.login`
- Element: `div` · classes: `bg-white bg-white/10 border`

**2. Change the submit button color to green**
- Component: `pages::auth.login`
- Element: `button.btn-primary` · text: "Submit Login"
```

For framework-specific context when a file path is available (Svelte, or React/Vue with source maps):

```markdown
**3. Increase product title font size**
- File: `/src/components/ProductCard.svelte`
- Element: `h2` · text: "Wireless Headphones"
```

For Livewire/Vue without a file path:

```markdown
**4. Add a loading spinner to the checkout button**
- Component: `CheckoutButton` (Livewire: `checkout-button`)
- Element: `button` · text: "Place Order"
```

Multi-page grouping:

```markdown
<!-- Instruckt UI feedback — work through one page at a time -->

## /dashboard

**1. Add hover state to sidebar links**
- Component: `layouts::app`
- Element: `a.nav-link`

---

## /settings/profile

**1. Add character counter below the bio textarea**
- Component: `settings::profile`
- Element: `textarea#bio` · text: "Tell us about yourself"
```

---

### Key Design Decisions

**Instruction as the heading.** Agents scan headings. `**1. Change button color to green**` is instantly actionable. `### 1. button.btn-primary` is not.

**Component before element.** The component name lets an agent `grep -r "OrderForm"` or open `pages::auth.login` immediately. Classes narrow within the file.

**Drop escaped CSS paths entirely.** `div.\[\:where\(\&\)\]\:bg-white.dark\:\[\:where\(\&\)\]\:bg-white\/10` is ungreppable. The component name + simplified classes serve the same purpose with zero noise.

**Separator between pages** (`---`) signals a context shift, prompting the agent to finish one page before moving on.

**One meta-instruction at the top** is enough. Don't over-instruct — agents handle the rest.

---

### The Single Most Impactful Change

Move the feedback comment from the last line to the **heading/title** of each item. Everything else is supporting context for finding the right line of code. The instruction is the point.
