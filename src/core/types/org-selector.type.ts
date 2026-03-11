
export type OrgLevel = "Store" | "Division" | "Banner" | "Chain" | "--";
export type OrgSelectBy = "Hierarchy" | "List" | "Cluster";

export interface OrgNode {
  id: string;
  label: string;
  children?: OrgNode[];
}

export interface OrgSelectorProps {
  /** Label shown above the trigger */
  label?: string;
  /** Text shown inside the trigger */
  value?: string;
  /** Currently selected org level */
  orgLevel?: OrgLevel;
  onOrgLevelChange?: (level: OrgLevel) => void;
  /** Current select-by mode */
  selectBy?: OrgSelectBy;
  onSelectByChange?: (mode: OrgSelectBy) => void;
  /** Show Inactive filter */
  showInactive?: boolean;
  onShowInactiveChange?: (val: boolean) => void;
  /** Whether to show the Import button in the search row */
  showImport?: boolean;
  /** Org hierarchy nodes for tree/list display */
  nodes?: OrgNode[];
  /** Currently selected node IDs */
  selectedIds?: string[];
  onApply?: (selectedIds: string[]) => void;
  onCancel?: () => void;
  /** Renders the label inline to the left of the trigger instead of above */
  horizontalLabel?: boolean;
  className?: string;
  placeholder?: string;
}

export interface OrgSelectorPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectBy: OrgSelectBy;
  onSelectByChange: (mode: OrgSelectBy) => void;
  orgLevel: OrgLevel;
  onOrgLevelChange: (level: OrgLevel) => void;
  showInactive: boolean;
  onShowInactiveChange: (val: boolean) => void;
  showImport?: boolean;
  nodes: OrgNode[];
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
  onApply: () => void;
  onCancel: () => void;
}

export interface HierarchyTreeProps {
  nodes: OrgNode[];
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
  depth?: number;
}

export interface FlatListProps {
  nodes: OrgNode[];
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
}
