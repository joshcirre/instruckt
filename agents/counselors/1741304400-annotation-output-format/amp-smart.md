Here's my concrete, opinionated recommendation for instruckt's output format.

---

## Verdict: Your current format is close, but has specific waste and gaps

### 1. Essential vs Noise

| Field | Verdict | Why |
|---|---|---|
| **Comment** | ✅ Essential | The whole point |
| **URL path** | ✅ Essential | Routes agent to the right file/page |
| **Framework component name** | ✅ Essential | Best grep target (`SettingsForm`, `OrderForm`) |
| **File path** (Svelte has this) | ✅ Essential when available | Directly tells agent where to edit |
| **Element tag + id/testid/aria-label** | ✅ Essential | Stable, grep-able locators |
| **Selected text / nearby text** | ✅ Essential | Disambiguates duplicate elements |
| **CSS classes** | ⚠️ Conditional | Useful for Tailwind changes, noise otherwise. Cap at 5-6 classes |
| **Selector path** | ⚠️ Fallback only | Brittle, often ungrepable. Keep as secondary |
| **Bounding box / x,y / viewport** | ❌ Usually noise | Agents can't grep coordinates. Only include for layout/spacing feedback |
| **wire_id / Vue uid** | ❌ Noise | Runtime IDs, not in source code |
| **Full React/Vue props dump** | ❌ Noise + security risk | Token-heavy, may leak sensitive data. Include **keys only** if anything |

### 2. Format: Markdown + Fenced YAML blocks

Pure Markdown is the right outer format (universal across all agents). But add a **fenced YAML `locator` block** per annotation for structured machine parsing. This gives agents both human readability and reliable extraction.

### 3. CSS selector path: secondary, not primary

The full `body > main > div.container > ...` path is **brittle and rarely grepable**. Prioritize: `id` → `data-testid` → `aria-label` → `role+text` → short class selector. Keep the full path as a fallback only.

### 4. Viewport/position: off by default

Only include when the comment suggests a layout/spacing issue.

### 5. Framework context: thin

Component name + file path (when available). No full props/state dump.

### 6. Multi-page: summary table + grouped sections

### 7. Meta-instructions: yes, but 3 lines max

---

## Recommended Output Format

```markdown
# Instruckt Feedback

> Work page-by-page. Locate code by component/file first, then by selector/text.

**Pages:** /account/settings (2) · /checkout (1)

---

## Page: /account/settings

### 1. Change button label to "Save changes"

The button should say "Save changes" and be disabled while saving.

```yaml
locator:
  element: button
  id: save-btn
  testid: save-settings
  text: "Save"
  component: SettingsForm        # React
  file: null
  selector: "form > button.btn-primary"
  classes: "btn btn-primary"
```

### 2. Too much whitespace under email section

Reduce spacing between "Email notifications" heading and the toggle list on desktop.

```yaml
locator:
  element: section
  text: "Email notifications"
  component: Notifications       # Svelte
  file: /src/routes/settings/Notifications.svelte
  selector: "main > section:nth-of-type(3)"
  layout:                        # included because feedback is about spacing
    viewport: 1440x900
    box: { x: 120, y: 820, w: 1200, h: 260 }
```
```

### Key changes from your current format:

1. **Comment becomes the heading** — it's the most important thing. Currently it's buried at the bottom as `**Feedback:**`.
2. **Add `testid`/`id`/`aria-label` to selector.ts** — these are the most stable, grep-able locators and you don't currently extract them.
3. **Drop `boundingBox`/`viewport` by default** — only emit a `layout:` block when the comment contains spatial keywords.
4. **Drop `wire_id`/`component_uid`/full `data` dumps** — these are runtime IDs, not source code artifacts.
5. **Cap `cssClasses`** to 5-6 max to avoid Tailwind token explosions.
6. **Add a summary line** at the top listing pages + counts.
7. **3-line agent instruction** at the top telling agents to work page-by-page and prioritize component/file lookup.

The biggest single improvement is extracting `data-testid` / `data-test` / `data-cy` in `selector.ts` — those are the most reliable bridge between DOM and source code, and you're not capturing them today.
