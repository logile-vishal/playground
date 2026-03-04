/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                    LOGILE PLAYGROUND                        ║
 * ║                                                              ║
 * ║  This is your sandbox. Use Claude Code to describe what      ║
 * ║  you want to build, and it will write the code here.        ║
 * ║                                                              ║
 * ║  EXAMPLE PROMPTS:                                            ║
 * ║  • "Show me all button variants side by side"               ║
 * ║  • "Create a form with Name, Department, and Role fields"   ║
 * ║  • "Build a table showing employee data with pagination"    ║
 * ║  • "Design a modal that confirms a deletion action"         ║
 * ║  • "Show me a page with a header, filters, and a table"     ║
 * ║  • "Import the FormsShowcase example"                       ║
 * ║                                                              ║
 * ║  AVAILABLE COMPONENTS (import from @/core/components/...):  ║
 * ║  CButton, CTextfield, CTextarea, CSelect, CCheckbox,        ║
 * ║  CRadio, CSwitch, CModal, CDataTable, CSvgIcon, CTabs,      ║
 * ║  CLoader, CDivider, CPagination, CMultiSelectWithChip,      ║
 * ║  CAutoComplete, CRichTextEditor, DragAndDrop                ║
 * ║                                                              ║
 * ║  LAYOUT (import from @/layouts/...):                        ║
 * ║  PageTemplate (.Header + .Content)                          ║
 * ║  PageHeading, HeaderTabs, PageTabs                          ║
 * ║                                                              ║
 * ║  ICONS (import from @/core/constants/icons):                ║
 * ║  AddIcon, Delete, Edit, Search, Download, Upload, Close,    ║
 * ║  Check, Settings, User, Calendar, Filter, Sort, and 130+    ║
 * ║                                                              ║
 * ║  DESIGN TOKENS (CSS variables):                              ║
 * ║  Colors: var(--logile-text-primary), var(--logile-bg-*)     ║
 * ║  Spacing: var(--space-xs) → var(--space-11xl)               ║
 * ║  Radius: var(--radius-xs) → var(--radius-full)              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { useState } from "react";

import PageTemplate from "@/layouts/page-template/PageTemplate";
import PageHeading from "@/core/components/page-heading/PageHeading";
import HeaderTabs from "@/core/components/header-tabs/HeaderTabs";
import { PageTabs } from "@/core/components/page-tabs/PageTabs";
import type { HeaderTabItem } from "@/core/types/header-tabs.type";
import type { PageTabItem } from "@/core/types/page-tabs.type";

const DEMO_BREADCRUMBS = [
  { label: "Home", onClick: () => console.log("Home") },
  { label: "Labour Model", onClick: () => console.log("Labour Model") },
  { label: "Playground", onClick: () => console.log("Playground") },
];

const HEADER_TABS: HeaderTabItem[] = [
  { key: "pg1", label: "Playground 1" },
  { key: "pg2", label: "Playground 2" },
  { key: "pg3", label: "Playground 3" },
];

const PAGE_TABS: PageTabItem[] = [
  { key: "overview", label: "Overview" },
  { key: "details", label: "Details" },
  { key: "history", label: "History" },
];

export default function PlaygroundCanvas() {
  const [headerTab, setHeaderTab] = useState("pg1");
  const [pageTab, setPageTab] = useState("overview");

  return (
    <PageTemplate>
      {/* ── Header: PageHeading + HeaderTabs ── */}
      <PageTemplate.Header>
        <PageHeading
          title="Playground"
          onBack={() => console.log("back")}
          onHelpClick={() => console.log("help")}
          breadcrumbs={DEMO_BREADCRUMBS}
        />
        <HeaderTabs
          items={HEADER_TABS}
          activeKey={headerTab}
          onChange={setHeaderTab}
          bordered
        />
      </PageTemplate.Header>

      {/* ── Content box: PageTabs + body ── */}
      <PageTemplate.Content>
        <PageTemplate.PageTabs>
          <PageTabs
            items={PAGE_TABS}
            activeKey={pageTab}
            onChange={setPageTab}
          />
        </PageTemplate.PageTabs>

        {/* START EXPERIMENTING BELOW ↓ */}
        {/* Replace this placeholder with your components */}
        <div
          style={{
            padding: "var(--space-xl) var(--space-xl)",
            color: "var(--logile-text-secondary)",
            fontSize: "var(--font-size-body)",
          }}
        >
          {PAGE_TABS.find((t) => t.key === pageTab)?.label} content — tell
          Claude what to build here.
        </div>
      </PageTemplate.Content>
    </PageTemplate>
  );
}
