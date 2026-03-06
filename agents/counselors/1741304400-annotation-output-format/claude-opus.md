## Review: Optimal Annotation Output Format for AI Coding Agents

### What's essential vs noise

**Essential (keeps):**
- **Component name** — This is the #1 signal. An agent can grep for `OrderForm`, `ProductCard`, or `pages::auth.login` and land in the right file immediately.
- **Element** — Short selector like `button.btn-primary` gives enough context to find the element within the component.
- **Nearby/selected text** — Critical disambiguator. If there are three `button.btn-primary` elements, "Submit Login" tells the agent which one.
- **Comment** — Obviously.
- **CSS classes** — Useful when the change is about styling.
- **Page URL** (pathname only) — Groups annotations and gives routing context.

**Noise (drop or demote):**
- **Full CSS selector path** — Agents don't grep for `body > main > div.container > button`. It's long, brittle, and doesn't map to source code. The component name + short element + text context is strictly better for code location.
- **Bounding box / x,y coordinates** — Useless for code changes. An agent can't do anything with "440px, 310px". Drop entirely.
- **Viewport dimensions** — Same. Drop.
- **wire_id / component_uid** — Runtime IDs that don't appear in source code. Drop.

**Conditional:**
- **Framework-specific data** (component file path, reactive data keys) — Include only when it adds locator value. Svelte's `file: "/src/components/Header.svelte"` is gold. Vue/React component names are useful. Wire IDs are not.

### Format: Markdown, but tighter

Markdown is the right call. It's what every AI coding agent expects in chat. JSON/YAML would work but adds visual noise and framing overhead for a human pasting into a conversation. Keep it markdown, but make it more structured and scannable.

### Recommended Format

```markdown
# UI Feedback: /auth/login

## 1. Card container — `div.bg-white` in `pages::auth.login`
**Classes:** `[:where(&)]:bg-white dark:[:where(&)]:bg-white/10 border`
> Make this card have rounded corners

## 2. Submit button — `button.btn-primary` in `pages::auth.login`
**Text:** "Submit Login"
> Change button color to green
```

Multi-page example:

```markdown
# UI Feedback

## /auth/login

### 1. Submit button — `button.btn-primary` in `pages::auth.login`
**Text:** "Submit Login"
> Change button color to green

### 2. Password field — `input.form-control` in `pages::auth.login`
**Text:** "Password"
> Add a show/hide password toggle

## /dashboard

### 3. Stats card — `div.stat-card` in `DashboardStats`
**Classes:** `stat-card bg-blue-500 rounded-lg`
> Make this card match the design system — use `bg-primary` instead of `bg-blue-500`
```

### Key design decisions

**1. Component name in the heading, not a separate field.** The heading `button.btn-primary in pages::auth.login` gives the agent both pieces of locator info in one scannable line. No need to read three fields to understand what to find.

**2. Blockquote for the user's feedback.** Using `>` makes the instruction visually distinct from the metadata. Agents parse this naturally as "the thing to do."

**3. Text content as the disambiguator.** Only include `**Text:**` when there's nearby/selected text. Skip it when the element is unique enough (a single card container doesn't need it).

**4. Classes only when relevant.** If the feedback is about styling, include classes. If it's about behavior ("add a toggle"), classes are noise. In practice, always including them is fine — agents are good at ignoring irrelevant context. But if you want to optimize, make it conditional.

**5. Drop position data entirely.** No viewport, no bounding box, no coordinates. Zero value for code changes.

**6. Framework file paths when available.** For Svelte, the file path is the most useful piece of data you have. Include it:
```markdown
### 1. Header nav — `nav.main-nav` in `Header` (`/src/components/Header.svelte`)
```

**7. No meta-instructions for the agent.** Don't add "work through these one at a time" — it's patronizing and every agent handles multi-step differently. The format should be self-evident. If an agent can't figure out how to process a numbered list, a meta-instruction won't save it.

**8. Page grouping by heading level.** Single page: `# UI Feedback: /path` with `##` per annotation. Multiple pages: `#` title, `##` per page path, `###` per annotation. Clean hierarchy, natural markdown.

### One more thing: escaped selectors

Your current format has this:

```
div.\[\:where\(\&\)\]\:bg-white.dark\:\[\:where\(\&\)\]\:bg-white\/10.border
```

That's the full escaped CSS selector, and it's unreadable. The agent needs the *class names as written in source code*, not the escaped CSS selector form. Output `[:where(&)]:bg-white` in the classes field — that's what appears in the HTML/template and what the agent will grep for. The escaped selector path should be dropped entirely.

### Summary

| Field | Verdict |
|---|---|
| Component name | **Keep** — primary locator |
| Short element selector | **Keep** — in heading |
| CSS classes | **Keep** — as written in source, not escaped |
| Nearby/selected text | **Keep** — disambiguator |
| User comment | **Keep** — as blockquote |
| Page URL (pathname) | **Keep** — for grouping |
| Framework file path | **Keep when available** |
| Full CSS selector path | **Drop** — doesn't map to source code |
| Bounding box | **Drop** |
| Coordinates | **Drop** |
| Viewport | **Drop** |
| Runtime IDs (wire_id, uid) | **Drop** |
| Agent meta-instructions | **Drop** |
