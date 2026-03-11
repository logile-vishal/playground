import { useState, useRef } from "react";
import classNames from "classnames";
import { SvgIcon } from "@mui/material";
import type { OrgSelectorProps, OrgLevel, OrgSelectBy, OrgNode } from "@/core/types/org-selector.type";
import { OrgSelectorPopover } from "./OrgSelectorPopover";
import "./org-selector.scss";

// Chevron icons using MUI SvgIcon
const ChevronDownIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 18 }}>
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </SvgIcon>
);

const ChevronUpIcon = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 18 }}>
    <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
  </SvgIcon>
);

// Sample/default nodes for demo
const DEFAULT_NODES: OrgNode[] = [
  {
    id: "logile-markets",
    label: "LOGILE MARKETS",
    children: [
      { id: "banner-011", label: "Banner 011" },
      {
        id: "convenience",
        label: "CONVENIENCE",
        children: [
          { id: "convenience-division", label: "CONVENIENCE DIVISION", children: [
            { id: "060-hackberry", label: "(060) HACKBERRY" },
            { id: "136-eustace", label: "(136) EUSTACE" },
            { id: "137-arp", label: "(137) ARP" },
            { id: "168-rice", label: "(168) RICE" },
          ]},
        ],
      },
      {
        id: "general-retail",
        label: "GENERAL RETAIL",
      },
      {
        id: "grocery-retail",
        label: "GROCERY RETAIL",
      },
      {
        id: "specialty-retail",
        label: "SPECIALTY RETAIL",
      },
    ],
  },
];

function filterNodesByDepth(nodes: OrgNode[], currentDepth: number, maxDepth: number): OrgNode[] {
  if (currentDepth >= maxDepth) {
    return nodes.map(node => ({ ...node, children: undefined }));
  }
  return nodes.map(node => ({
    ...node,
    children: node.children ? filterNodesByDepth(node.children, currentDepth + 1, maxDepth) : undefined
  }));
}

export const OrgSelector: React.FC<OrgSelectorProps> = ({
  label = "Org Selector",
  value = "(149) Cumings",
  orgLevel: orgLevelProp = "Store",
  onOrgLevelChange,
  selectBy: selectByProp = "Hierarchy",
  onSelectByChange,
  showInactive: showInactiveProp = false,
  onShowInactiveChange,
  showImport = false,
  nodes = DEFAULT_NODES,
  selectedIds: selectedIdsProp = [],
  onApply,
  onCancel,
  horizontalLabel = false,
  className,
  placeholder,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Internal state (controlled if props are provided)
  const [orgLevel, setOrgLevel] = useState<OrgLevel>(orgLevelProp);
  const [selectBy, setSelectBy] = useState<OrgSelectBy>(selectByProp);
  const [showInactive, setShowInactive] = useState(showInactiveProp);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedIdsProp);
  const [drafted, setDrafted] = useState<string[]>(selectedIdsProp);

  const handleOpen = () => {
    setDrafted(selectedIds);
    setOpen(true);
  };

  const handleCancel = () => {
    setDrafted(selectedIds);
    setOpen(false);
    onCancel?.();
  };

  const handleApply = () => {
    setSelectedIds(drafted);
    setOpen(false);
    onApply?.(drafted);
  };

  const handleOrgLevelChange = (level: OrgLevel) => {
    setOrgLevel(level);
    onOrgLevelChange?.(level);
  };

  const handleSelectByChange = (mode: OrgSelectBy) => {
    setSelectBy(mode);
    onSelectByChange?.(mode);
  };

  const handleShowInactiveChange = (val: boolean) => {
    setShowInactive(val);
    onShowInactiveChange?.(val);
  };

  const displayValue = placeholder && !value ? placeholder : value;

  const maxDepth = {
    "Chain": 1,
    "Banner": 2,
    "Division": 3,
    "Store": 4,
    "--": 4
  }[orgLevel] || 4;

  const derivedNodes = filterNodesByDepth(nodes, 1, maxDepth);

  return (
    <div
      className={classNames("org-selector", { "org-selector--horizontal": horizontalLabel }, className)}
    >
      {label && (
        <span className="org-selector__label">{label}</span>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        className={classNames("org-selector__trigger", { "org-selector__trigger--open": open })}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="org-selector__trigger-value">{displayValue}</span>
        <span className="org-selector__trigger-chevron">
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>

      {/* Popover */}
      <OrgSelectorPopover
        open={open}
        anchorEl={triggerRef.current}
        onClose={handleCancel}
        selectBy={selectBy}
        onSelectByChange={handleSelectByChange}
        orgLevel={orgLevel}
        onOrgLevelChange={handleOrgLevelChange}
        showInactive={showInactive}
        onShowInactiveChange={handleShowInactiveChange}
        showImport={showImport}
        nodes={derivedNodes}
        selectedIds={drafted}
        onSelectedChange={setDrafted}
        onApply={handleApply}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default OrgSelector;
