import { Box, Typography } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import type { ColumnCardProps } from "@/pages/create-template/types/columns.type";
import clsx from "@/utils/clsx";
import { CSortableItem } from "@/core/components/drag-drop";
import { useFormFieldError } from "@/pages/create-template/hooks/useCreateTemplateFormError";

import "./ColumnCardCollapsed.scss";

const ColumnCardCollapsed: React.FC<ColumnCardProps> = ({
  column,
  columnIndex,
  toggleExpand,
  columnFormPath,
}) => {
  const { hasError } = useFormFieldError(columnFormPath);

  return (
    <CSortableItem
      id={column.columnId}
      enableCustomDragHandle
    >
      {(dragHandleContext) => {
        return (
          <Box
            className={clsx({
              "col-card-collapsed": true,
              "col-card-collapsed--error": hasError,
            })}
          >
            <Box className="col-card-collapsed__info">
              <Box
                className="col-card-collapsed__dnd"
                {...dragHandleContext.attributes}
                {...dragHandleContext.listeners}
              >
                <CSvgIcon
                  size={24}
                  component={DraggableDots}
                />
              </Box>
              <Box className="col-card-collapsed__order-index">
                <Typography>{`${columnIndex}.`}</Typography>
              </Box>
              <Box className="col-card-collapsed__label">
                <Typography>{column.title}</Typography>
              </Box>
            </Box>
            <Box
              onClick={() => toggleExpand(column.columnId)}
              className="col-card-collapsed__chevron-down"
            >
              <CSvgIcon
                component={ChevronDown}
                color="secondary"
              />
            </Box>
          </Box>
        );
      }}
    </CSortableItem>
  );
};

export default ColumnCardCollapsed;
