import { Box } from "@mui/material";

import type { ColumnCardProps } from "@/pages/create-template/types/columns.type";

import ColumnCardCollapsed from "../column-card-collapsed/ColumnCardCollaspsed";
import ColumnCardExpanded from "../column-card-expand/ColumnCardExpanded";

/**
 * @method ColumnCard
 * @description Renders either collapsed or expanded view of a column card based on expanded state
 * @param {ColumnCardProps} props - Component props
 * @param {ColumnProps} props.column - Column data object
 * @param {Record<string|number, boolean>} [props.expandedList] - Map of expanded column IDs
 * @param {Function} props.toggleExpand - Callback to toggle column expansion
 * @return {React.ReactNode} Column card container with collapsed or expanded view
 */
const ColumnCard: React.FC<ColumnCardProps> = ({
  column,
  columnIndex,
  expandedList,
  toggleExpand,
  handleAddColumn,
  isNewColumnAllowed,
  walkMeIdPrefix,
}) => {
  return (
    <Box className="ct-column-container">
      {!expandedList ||
      !(column?.columnId in expandedList) ||
      !expandedList[column?.columnId] ? (
        <ColumnCardCollapsed
          column={column}
          columnIndex={columnIndex}
          toggleExpand={toggleExpand}
          handleAddColumn={handleAddColumn}
          isNewColumnAllowed={isNewColumnAllowed}
          walkMeIdPrefix={walkMeIdPrefix}
        />
      ) : (
        <ColumnCardExpanded
          column={column}
          columnIndex={columnIndex}
          toggleExpand={toggleExpand}
          handleAddColumn={handleAddColumn}
          isNewColumnAllowed={isNewColumnAllowed}
          walkMeIdPrefix={walkMeIdPrefix}
        />
      )}
    </Box>
  );
};

export default ColumnCard;
