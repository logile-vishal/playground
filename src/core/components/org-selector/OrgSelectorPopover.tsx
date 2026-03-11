import { useState } from "react";
import { Popover } from "@mui/material";
import { SvgIcon } from "@mui/material";
import type { OrgSelectorPopoverProps, OrgLevel, OrgSelectBy, OrgNode } from "@/core/types/org-selector.type";
import { SegmentControl } from "@/core/components/segment-control/SegmentControl";
import { HierarchyTree } from "./HierarchyTree";
import { FlatList } from "./FlatList";
import { CButton } from "@/core/components/button/button";
import CSelect from "@/core/components/form/select/Select";
import CTextfield from "@/core/components/form/textfield/Textfield";

// Search icon component (used as startIcon in CTextfield)
const SearchIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 18, color: "var(--logile-text-tertiary, #888)" }}>
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </SvgIcon>
);

// Upload icon for import button
const UploadIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 16 }}>
    <path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
  </SvgIcon>
);

const ORG_LEVEL_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "Store", value: "Store" },
  { label: "Division", value: "Division" },
  { label: "Banner", value: "Banner" },
  { label: "Chain", value: "Chain" },
  { label: "--", value: "--" },
];

const SHOW_INACTIVE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "No", value: "No" },
  { label: "Yes", value: "Yes" },
];

const SELECT_BY_ITEMS = [
  { key: "Hierarchy", label: "Hierarchy" },
  { key: "List", label: "List" },
  { key: "Cluster", label: "Cluster" },
];

export function OrgSelectorPopover({
  open,
  anchorEl,
  onClose,
  selectBy,
  onSelectByChange,
  orgLevel,
  onOrgLevelChange,
  showInactive,
  onShowInactiveChange,
  showImport = false,
  nodes,
  selectedIds,
  onSelectedChange,
  onApply,
  onCancel,
}: OrgSelectorPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");

  function filterNodes(nodes: OrgNode[], query: string): OrgNode[] {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();
    return nodes
      .map((node) => {
        const matchesSelf = node.label.toLowerCase().includes(q);
        const filteredChildren = filterNodes(node.children || [], query);
        if (matchesSelf || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as OrgNode[];
  }

  const visibleNodes = filterNodes(nodes, searchQuery);

  // CSelect onChange adapter — CSelect internally fires a MUI SelectChangeEvent;
  // we extract the value through type casting since the prop types use a complex union.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOrgLevelChange = ((e: any) => {
    onOrgLevelChange((e.target?.value ?? e) as OrgLevel);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShowInactiveChange = ((e: any) => {
    onShowInactiveChange((e.target?.value ?? e) === "Yes");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ className: "org-selector__popover-paper" }}
    >
      <div className="org-selector__panel">

        {/* ── Selectors row ─────────────────────────────── */}
        <div className="org-selector__selectors">

          {/* Select By — uses our SegmentControl */}
          <div className="org-selector__select-by">
            <span className="org-selector__field-label">Select By</span>
            <SegmentControl
              type="secondary"
              size="md"
              items={SELECT_BY_ITEMS}
              activeKey={selectBy}
              onChange={(key) => onSelectByChange(key as OrgSelectBy)}
            />
          </div>

          {/* Org Level — uses the project's CSelect */}
          <div className="org-selector__select-field">
            <CSelect
              label="Org Level"
              value={orgLevel}
              options={ORG_LEVEL_OPTIONS}
              optionLabelKey="label"
              optionValueKey="value"
              onChange={handleOrgLevelChange}
              name="orgLevel"
              isInlineLabel={false}
            />
          </div>

          {/* Show Inactive — uses the project's CSelect */}
          <div className="org-selector__select-field">
            <CSelect
              label="Show Inactive"
              value={showInactive ? "Yes" : "No"}
              options={SHOW_INACTIVE_OPTIONS}
              optionLabelKey="label"
              optionValueKey="value"
              onChange={handleShowInactiveChange}
              name="showInactive"
              isInlineLabel={false}
            />
          </div>
        </div>

        {/* ── Search row ────────────────────────────────── */}
        <div className="org-selector__search-row">
          <div className="org-selector__search-wrapper">
            <CTextfield
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              startIcon={<SearchIcon />}
              fullWidth
              className="org-selector__search-textfield"
            />
          </div>
          {showImport && (
            <button type="button" className="org-selector__import-btn">
              <UploadIcon />
              <span>Import</span>
            </button>
          )}
        </div>

        {/* ── Org list ──────────────────────────────────── */}
        <div className="org-selector__list">
          {selectBy === "Hierarchy" ? (
            <HierarchyTree
              nodes={visibleNodes}
              selectedIds={selectedIds}
              onSelectedChange={onSelectedChange}
            />
          ) : (
            <FlatList
              nodes={visibleNodes}
              selectedIds={selectedIds}
              onSelectedChange={onSelectedChange}
            />
          )}
        </div>

        {/* ── Footer ────────────────────────────────────── */}
        <div className="org-selector__footer">
          <CButton severity="secondary" variant="outline" size="large" onClick={onCancel}>
            Cancel
          </CButton>
          <CButton severity="primary" variant="solid" size="large" onClick={onApply}>
            Save
          </CButton>
        </div>
      </div>
    </Popover>
  );
}
