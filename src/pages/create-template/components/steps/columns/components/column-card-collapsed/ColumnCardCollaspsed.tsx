import { Box, Typography } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import type { ColumnCardProps } from "@/pages/create-template/types/columns.type";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import clsx from "@/utils/clsx";

import "./ColumnCardCollapsed.scss";

const ColumnCardCollapsed: React.FC<ColumnCardProps> = ({
  column,
  columnIndex,
  toggleExpand,
}) => {
  const { formErrors } = useCreateTemplateForm();
  const columnErrors = formErrors["column"]?.[columnIndex - 1];

  return (
    <Box
      className={clsx({
        "col-card-collapsed": true,
        "col-card-collapsed--error": !!columnErrors?.title,
      })}
    >
      <Box className="col-card-collapsed__info">
        <Box className="col-card-collapsed__dnd">
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
};

export default ColumnCardCollapsed;
