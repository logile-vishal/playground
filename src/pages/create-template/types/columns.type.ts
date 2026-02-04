export type ColumnProps = {
  columnId: string;
  title: string;
};

export type ColumnCardProps = {
  key?: string;
  column: ColumnProps;
  columnIndex: number;
  expandedList?: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  handleAddColumn: (columnId?: string) => Promise<boolean>;
  isNewColumnAllowed: boolean;
  walkMeIdPrefix: string[];
};
