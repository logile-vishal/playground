import { Box } from "@mui/material";
import { Controller, type Control, type FieldValues } from "react-hook-form";

import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import clsx from "@/utils/clsx";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { CSortableItem } from "@/core/components/drag-drop";
import type { DragHandleProps } from "@/core/components/drag-drop/types/DragAndDrop.type";

export type SectionCollapsedProps = {
  sectionId: string;
  title: string;
  questionFormPath: string;
  hasError?: boolean;
  onToggleCollapse: () => void;
};

export const SectionCollapsed = ({
  sectionId,
  title,
  questionFormPath,
  hasError,
  onToggleCollapse,
}: SectionCollapsedProps) => {
  const { control } = useCreateTemplateForm();

  return (
    <CSortableItem
      key={sectionId}
      id={sectionId}
    >
      {(dragHandleContext: DragHandleProps) => (
        <Box
          className={clsx({
            "question-section__collapsed": true,
            "question-section__collapsed--error": hasError,
          })}
        >
          <Box className="question-section__collapsed-content">
            <Box
              className="question-section__collapsed-content-dnd"
              {...dragHandleContext.listeners}
              {...dragHandleContext.attributes}
            >
              <CSvgIcon
                size={24}
                component={DraggableDots}
              />
            </Box>
            <Box className="question-section__collapsed-content-title">
              {title}
            </Box>
          </Box>

          <Box
            className={clsx({
              "question-section__collapsed-content": true,
              "question-section__collapsed-content--right": true,
            })}
          >
            <Box className="question-section__collapsed-content-label">
              <Controller
                name={`${questionFormPath}`}
                control={control as unknown as Control<FieldValues>}
                render={({ field }) => {
                  return (
                    <>{field.value?.subQuestions?.length || 0} Questions</>
                  );
                }}
              />
            </Box>
            <Box
              className="question-section__collapsed-content-icon"
              onClick={onToggleCollapse}
            >
              <CSvgIcon
                component={ChevronDown}
                color="secondary"
              />
            </Box>
          </Box>
        </Box>
      )}
    </CSortableItem>
  );
};
