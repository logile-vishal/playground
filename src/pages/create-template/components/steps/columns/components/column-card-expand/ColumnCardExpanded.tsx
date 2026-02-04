import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

import type {
  ColumnCardProps,
  ColumnProps,
} from "@/pages/create-template/types/columns.type";
import {
  AddIcon,
  ChevronUpLarge,
  Copy,
  Delete,
  DraggableDots,
} from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import CTextarea from "@/core/components/form/textarea/Textarea";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useColumnListManager from "@/pages/create-template/hooks/useColumnListManager";

import "./ColumnCardExpanded.scss";

const ColumnCardExpanded: React.FC<ColumnCardProps> = ({
  column,
  columnIndex,
  toggleExpand,
  handleAddColumn,
  isNewColumnAllowed,
  walkMeIdPrefix,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { control, watch, formErrors } = useCreateTemplateForm();
  const { removeColumn, copyExistingColumn } = useColumnListManager();

  const watchColumnList = watch("columns") as ColumnProps[];

  const handleAddAfterCurrent = async (): Promise<void> => {
    await handleAddColumn(column.columnId);
  };

  const handleDeleteColumn = (): void => {
    removeColumn(column.columnId);
  };

  const handleCopyColumn = () => {
    const newColumnId = copyExistingColumn(column.columnId);
    toggleExpand(newColumnId);
  };

  /**
   * @method renderHeader
   * @description Renders the expanded column card header with controls
   * @return {React.ReactNode} Header JSX element
   */
  const renderHeader = () => {
    return (
      <Box className="ct-column-card-expanded__header">
        <Box className="ct-column-card-expanded__header-left-content">
          <Box className="ct-column-card-expanded__dnd">
            <CSvgIcon
              size={24}
              component={DraggableDots}
            />
          </Box>
          <Box className="ct-column-card-expanded__order-index">
            <Typography>{`${columnIndex}.`}</Typography>
          </Box>
        </Box>
        <Box className="ct-column-card-expanded__header-right-content">
          <Box className="ct-column-card-expanded__actions-icons">
            <CIconButton
              disabled={!isNewColumnAllowed}
              onClick={handleAddAfterCurrent}
              size="medium"
              walkMeId={[...walkMeIdPrefix, "card-expanded", "add"]}
            >
              <CSvgIcon component={AddIcon} />
            </CIconButton>
            <CIconButton
              size="medium"
              disabled={!isNewColumnAllowed}
              onClick={handleCopyColumn}
              walkMeId={[...walkMeIdPrefix, "card-expanded", "copy"]}
            >
              <CSvgIcon component={Copy} />
            </CIconButton>
            {watchColumnList.length > 1 && (
              <CIconButton
                size="medium"
                disabled={
                  (formErrors as { columns?: unknown }).columns &&
                  !(formErrors as { columns?: unknown }).columns?.[
                    columnIndex - 1
                  ]
                }
                severity="destructive"
                walkMeId={[...walkMeIdPrefix, "card-expanded", "delete"]}
                onClick={handleDeleteColumn}
              >
                <CSvgIcon component={Delete} />
              </CIconButton>
            )}
            <CIconButton
              size="medium"
              walkMeId={[...walkMeIdPrefix, "card-expanded", "collapse"]}
              onClick={() => toggleExpand(column.columnId)}
            >
              <CSvgIcon component={ChevronUpLarge} />
            </CIconButton>
          </Box>
        </Box>
      </Box>
    );
  };

  /**
   * @method renderBody
   * @description Renders the tab container with basic and advance tabs
   * @return {React.ReactNode} Body JSX element with tabs
   */
  const renderBody = () => {
    return (
      <Box className="ct-column-card-expanded__body">
        <Controller
          name={`columns.${columnIndex - 1}.title` as const}
          control={control}
          render={({ field, fieldState }) => (
            <CTextarea
              {...field}
              required={true}
              placeholder={QUESTIONS.QUESTION_CARD.QUESTION_TITLE_PLACEHOLDER}
              value={field.value || ""}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>
    );
  };

  return (
    <Box className="ct-column-card-expanded">
      {renderHeader()}
      {renderBody()}
    </Box>
  );
};

export default ColumnCardExpanded;
