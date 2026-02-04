import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import {
  AddIcon,
  ChevronCollapse,
  ChevronExpanded,
} from "@/core/constants/icons";
import CIconButton from "@/core/components/button/IconButton";
import CNoData from "@/core/components/no-data/NoData";
import CSvgIcon from "@/core/components/icon/Icon";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { CButton } from "@/core/components/button/button";
import type { ColumnProps } from "@/pages/create-template/types/columns.type";
import useColumnListManager from "@/pages/create-template/hooks/useColumnListManager";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";

import ColumnCard from "./components/column-card/ColumnCard";
import "./Columns.scss";

const Columns: React.FC<{ walkMeIdPrefix?: string[] }> = ({
  walkMeIdPrefix,
}) => {
  const { COLUMNS } = useCreateTemplateTranslations();
  const [expandedList, setExpandedList] = useState({});
  const { watch, triggerValidation, formErrors } = useCreateTemplateForm();
  const { addNewColumn, addNewColumnAfter } = useColumnListManager();

  const columnList = watch("columns") as ColumnProps[];
  const [isAddColumnAllowed, setIsAddColumnAllowed] = useState(true);
  const toggleExpand = (id) => {
    setExpandedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const newExpandedList = {};
    columnList.forEach((column) => {
      newExpandedList[column.columnId] = true;
    });
    setExpandedList(newExpandedList);
  };

  const handleCollapseAll = () => {
    setExpandedList({});
  };

  /**
   * @method renderColumnHeader
   * @description Renders the header section with title and expand/collapse controls.
   * @returns {JSX.Element} Box element with header title and toggle buttons
   */
  const renderColumnHeader = () => {
    return (
      <Box className="ct-columns__header-wrapper">
        <Typography className="ct-columns__header">{COLUMNS.header}</Typography>
        {columnList?.length > 0 && (
          <Box className="ct-columns__all-cols-expand-container">
            <CIconButton
              variant="outline"
              size="medium"
              walkMeId={[...walkMeIdPrefix, "collapse-all-columns"]}
              onClick={handleCollapseAll}
            >
              <CSvgIcon
                component={ChevronCollapse}
                color="secondary"
              />
            </CIconButton>
            <CIconButton
              onClick={handleExpandAll}
              variant="outline"
              size="medium"
              walkMeId={[...walkMeIdPrefix, "expand-all-columns"]}
            >
              <CSvgIcon
                color="secondary"
                component={ChevronExpanded}
              />
            </CIconButton>
          </Box>
        )}
      </Box>
    );
  };

  const handleColumnClick = async (columnId?: string) => {
    const isValid =
      columnList?.length === 0 || (await triggerValidation("columns"));
    setIsAddColumnAllowed(isValid);
    if (isValid) {
      const newColumnId = columnId
        ? addNewColumnAfter(columnId)
        : addNewColumn();
      setExpandedList((prev) => ({ ...prev, [newColumnId]: true }));
    }

    return isValid;
  };

  useEffect(() => {
    if (
      (formErrors as { columns: ColumnProps[] })?.columns &&
      columnList?.length !== 0
    ) {
      setIsAddColumnAllowed(false);
    } else {
      setIsAddColumnAllowed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (formErrors as { columns: ColumnProps[] })?.columns,
    columnList,
  ]);

  /**
   * @method renderColumnAction
   * @description Renders action buttons for adding columns.
   * @returns {JSX.Element} Box element with action buttons
   */
  const renderColumnAction = () => {
    return (
      <Box className="ct-columns-cards-wrapper__action">
        <CButton
          className="ct-columns-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
          disabled={!isAddColumnAllowed}
          onClick={() => handleColumnClick()}
          walkMeId={[...walkMeIdPrefix, "add-column"]}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />
          {COLUMNS.addColumnButtonLabel}
        </CButton>
      </Box>
    );
  };

  return (
    <Box className="ct-columns">
      {renderColumnHeader()}
      <Box className="ct-columns-cards-wrapper">
        {columnList?.length === 0 ? (
          <CNoData
            title={COLUMNS.noColumnPlaceholder}
            variant="box"
          />
        ) : (
          <Box className="ct-columns-cards-wrapper__content">
            {columnList?.map((column, index) => {
              return (
                <ColumnCard
                  key={column.columnId}
                  column={column}
                  columnIndex={index + 1}
                  expandedList={expandedList}
                  toggleExpand={toggleExpand}
                  handleAddColumn={handleColumnClick}
                  isNewColumnAllowed={isAddColumnAllowed}
                  walkMeIdPrefix={walkMeIdPrefix}
                />
              );
            })}
          </Box>
        )}
        {renderColumnAction()}
      </Box>
    </Box>
  );
};

export default Columns;
