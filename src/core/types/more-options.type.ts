export interface TableColumn {
  id: string;
  label: string;
  frozen: boolean;
  visible: boolean;
}

export interface MoreOptionsProps {
  /** Additional CSS class names */
  className?: string;

  /** Visibility toggles state */
  compactView?: boolean;
  rowStriping?: boolean;
  columnGridlines?: boolean;

  /** Toggle handlers */
  onCompactViewChange?: (checked: boolean) => void;
  onRowStripingChange?: (checked: boolean) => void;
  onColumnGridlinesChange?: (checked: boolean) => void;

  /** Show export tools */
  showPrint?: boolean;
  showPdf?: boolean;
  showExcel?: boolean;
  showCsv?: boolean;

  /** Export handlers */
  onPrint?: () => void;
  onPdf?: () => void;
  onExcel?: () => void;
  onCsv?: () => void;

  /** Manage Column Panel */
  showManageColumn?: boolean;
  columns?: TableColumn[];
  onColumnsChange?: (columns: TableColumn[]) => void;
}

export interface MoreOptionsPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onManageColumnClick: () => void;
  
  compactView: boolean;
  rowStriping: boolean;
  columnGridlines: boolean;
  onCompactViewChange?: (checked: boolean) => void;
  onRowStripingChange?: (checked: boolean) => void;
  onColumnGridlinesChange?: (checked: boolean) => void;

  showPrint: boolean;
  showPdf: boolean;
  showExcel: boolean;
  showCsv: boolean;

  onPrint?: () => void;
  onPdf?: () => void;
  onExcel?: () => void;
  onCsv?: () => void;

  manageColumnProps: {
    visible: boolean;
  };
}

export interface ManageColumnsPanelProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onBack: () => void;
  
  columns: TableColumn[];
  onColumnsChange?: (columns: TableColumn[]) => void;
}
