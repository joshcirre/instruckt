# Review: Optimal Annotation Output Format for AI Coding Agents

## Direct Assessment

The current format is **close but slightly over-engineered**. Here's my opinionated take:

### Essential vs Noise

**Essential:**
- Component/file location (how the agent finds the code)
- Element selector (what to change)
- User comment (why to change it)
- Framework context (Livewire vs Vue vs React matters for how you edit)

**Useful but secondary:**
- CSS classes (helps verify the right element)
- Nearby text (human verification that we grabbed the right thing)

**Noise:**
- Full CSS selector path (duplicates component + element info)
- Viewport dimensions (not actionable for code changes)
- Pixel position/bounding box (rarely helps an agent find code)

### Recommended Format

**Markdown is correct** — it's readable, pasteable, and naturally hierarchical.

**But simplify it:**

```markdown
## Page: /auth/login

### 1. LoginForm component → button.btn-primary
**Location:** pages/auth/login.blade.php (or components/LoginForm.vue, etc.)
**Element:** button.btn-primary
**Context:** "Submit Login" button
**Feedback:** Change button color to green

### 2. Div with white background
**Location:** pages/auth/login.blade.php
**Element:** div[class*="bg-white"]
**Feedback:** Add rounded corners to this card
```

### Key Changes from Current Format

1. **Lead with component + element** on the heading — that's what the agent needs first
2. **Drop the full CSS selector path** — it's redundant with component + element
3. **Consolidate position data** — keep just "nearby visible text" for human verification
4. **Keep CSS classes if they're stable** (not Tailwind arbitrary stuff like `[:where(&)]`)
5. **Framework context should be minimal** — just the file path, not deep data inspection
6. **One annotation per section** — number them for easy reference

### Answers to Your Questions

| Question | Answer |
|----------|--------|
| Essential fields? | Component/file path, element selector, user comment. CSS classes if stable/readable. |
| Format? | Markdown. It's human-readable and agents parse it naturally. |
| Full CSS selector or component+element? | Component + element is more useful. Full selector is noise. |
| Viewport/position useful? | No. Drop pixel coordinates entirely. Keep only nearby text for verification. |
| Framework context? | Yes, but minimal. Just the file path is enough; deep component inspection is overkill. |
| Multi-page structure? | Group by page pathname (you have this right). |
| Meta-instructions? | Not necessary. Agents handle multiple pages fine without coaching. |

### Example with Real Data

```markdown
## Page: /products/checkout

### 1. Cart Summary Card
**Location:** components/CartSummary.vue
**Element:** div.card-header
**Classes:** card-header border-bottom
**Feedback:** Move the "Edit Items" button to the right side of this header

### 2. Checkout Button  
**Location:** components/CheckoutButton.jsx
**Element:** button.btn-primary
**Feedback:** Add loading spinner while processing payment
```

This gives agents exactly what they need: where to look, what to find, what to change. No noise.
