# Logile Playground

A local sandbox for PMs and Designers to prototype UIs using the Logile design system — no coding experience needed. You describe what you want, Claude Code writes the code, and your browser updates instantly.

---

## Prerequisites (one-time setup)

Before you start, make sure these are installed on your machine:

### 1. Node.js
Download and install from **https://nodejs.org** (choose the "LTS" version).
To verify: open Terminal and run `node -v` — you should see a version number.

### 2. Claude Code CLI
Claude Code is the AI assistant that writes code for you.

```bash
npm install -g @anthropic-ai/claude-code
```

Then run `claude` once to sign in with your Anthropic account.

---

## First-time setup (after cloning the repo)

```bash
# 1. Clone the repo
git clone git@github.com:logile-vishal/playground.git
cd playground

# 2. Install dependencies (only needed once)
npm install

# 3. Start the playground
npm run playground
```

Open **http://localhost:5174** in your browser.

---

## Daily use

```bash
# In one terminal tab — start the live preview
npm run playground

# In another terminal tab — start Claude Code (your AI assistant)
claude
```

Then just **type in the Claude Code terminal** what you want to build.

---

## Example prompts to try

Copy-paste any of these into Claude Code:

```
Show me all button variants side by side with labels

Replace the canvas with a form that has: Name, Email, Department (dropdown), and a Save button

Create a data table of store locations with columns: Name, Region, Status, Manager

Build a card grid with 3 metric cards showing Total Hours, Scheduled, and Overtime

Import the FullPageMockup example and render it

Add a date range filter above the current content

Make a confirmation modal that asks "Are you sure you want to delete this record?"
```

---

## How it works

1. You type a description in the Claude Code terminal
2. Claude edits `playground-app/src/PlaygroundCanvas.tsx`
3. Your browser refreshes automatically — no manual steps

---

## Example files

These are ready-made demos you can load at any time. Just tell Claude:
> "Import the FormsShowcase example and render it"

| File | What it shows |
|------|--------------|
| `ButtonsShowcase.tsx` | All button styles and sizes |
| `FormsShowcase.tsx` | Complete form with all input types |
| `TableShowcase.tsx` | Data table with search and pagination |
| `FullPageMockup.tsx` | Full realistic page layout |

---

## Component Quick Reference

### Buttons
```tsx
import { CButton } from "@/core/components/button/button";

<CButton severity="primary" variant="solid">Label</CButton>
<CButton severity="secondary" variant="outline">Label</CButton>
<CButton severity="destructive" variant="solid">Delete</CButton>

// severity: "primary" | "secondary" | "destructive"
// variant:  "solid" | "outline" | "text" | "ghost"
// size:     "compact" | "small" | "medium" | "large"
```

### Form Controls
```tsx
import CTextfield from "@/core/components/form/textfield/Textfield";
import CTextarea from "@/core/components/form/textarea/Textarea";
import CSelect from "@/core/components/form/select/Select";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import CRadio from "@/core/components/form/radio/Radio";
import CSwitch from "@/core/components/form/switch/Switch";

<CTextfield label="Name" placeholder="..." value={val} onChange={...} required error helperText="..." />
<CTextarea label="Notes" value={val} onChange={...} />
<CSelect label="Dept" options={[{label:"Eng", value:"eng"}]} value={val} onChange={...} walkMeIdPrefix={["x"]} />
<CCheckbox label="Agree" checked={val} onChange={...} size="small" />
<CRadio label="Option" value="x" checked={val} onChange={...} />
<CSwitch checked={val} onChange={...} size="medium" />
```

### Modal
```tsx
import CModal, { ModalBody } from "@/core/components/modal/Modal";

<CModal
  open={open}
  onClose={() => setOpen(false)}
  title="Title"
  size="medium"          // "small" | "medium" | "large" | "xlarge"
  showActions
  confirmText="Save"
  severity="primary"     // "primary" | "destructive"
  onConfirm={handleSave}
>
  <ModalBody>Content here</ModalBody>
</CModal>
```

### Data Table
```tsx
import { CDataTable } from "@/core/components/table/DataTable";
import type { MRT_ColumnDef } from "material-react-table";

const columns: MRT_ColumnDef<MyType>[] = [
  { accessorKey: "name", header: "Name", size: 200 },
  { accessorKey: "status", header: "Status" },
];

<CDataTable
  tableProps={{ columns, data, enableColumnActions: false, enableTopToolbar: false }}
  pagination={{ currentPage: 1, pageSize: 10, totalPages: 5, totalItems: 50 }}
  handlePaginationChange={setPagination}
  walkMeIdPrefix={["my-table"]}
/>
```

### Icons
```tsx
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, Delete, Edit, Search, Download, Check, Close, Filter } from "@/core/constants/icons";

<CSvgIcon component={AddIcon} size={20} color="brand-primary" />
// color: "primary" | "secondary" | "brand-primary" | "white" | "success" | "violation" | "warning"
```

### Layout
```tsx
import PageTemplate from "@/layouts/page-template/PageTemplate";

<PageTemplate>
  <PageTemplate.Header>
    <Typography>Page Title</Typography>
  </PageTemplate.Header>
  <PageTemplate.Content>
    {/* your content */}
  </PageTemplate.Content>
</PageTemplate>
```

---

## Design Tokens

```css
/* Colors */
var(--logile-bg-base)            /* Page background */
var(--logile-bg-container-1)     /* Card / surface background */
var(--logile-bg-primary)         /* Brand blue */
var(--logile-text-primary)       /* Main text */
var(--logile-text-secondary)     /* Secondary text */
var(--logile-border-secondary)   /* Subtle border */

/* Spacing */
var(--space-xs)   /* 4px  */
var(--space-m)    /* 8px  */
var(--space-l)    /* 12px */
var(--space-xl)   /* 16px */
var(--space-2xl)  /* 20px */
var(--space-3xl)  /* 24px */
var(--space-4xl)  /* 32px */

/* Border Radius */
var(--radius-xs)   /* 4px  */
var(--radius-m)    /* 8px  */
var(--radius-full) /* 1000px — pill shape */
```

---

## Tips

- **Iterate fast**: Ask Claude to make small changes one at a time
- **Start from an example**: "Start from the FormsShowcase and add a signature field"
- **Undo a change**: Tell Claude "revert the last change" or use `Cmd+Z` in your editor
- **Reset the canvas**: Tell Claude "reset PlaygroundCanvas to just a blank PageTemplate"
- **Dark mode**: The playground respects your system's color scheme
