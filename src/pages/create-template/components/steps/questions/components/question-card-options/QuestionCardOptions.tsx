import { useState } from "react";
import { Badge, Box } from "@mui/material";

import {
  AddIcon,
  AttachmentLink,
  ChevronDown,
  Delete,
  DraggableDots,
  Setting,
} from "@/core/constants/icons";
import clsx from "@/utils/clsx";
import CTextField from "@/core/components/form/textfield/Textfield";
import CSvgIcon from "@/core/components/icon/Icon";
import CSelect from "@/core/components/select/Select";
import { CButton } from "@/core/components/button/button";
import CIconButton from "@/core/components/button/IconButton";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./QuestionCardOptions.scss";

type QuestionCardOptionsProps = {
  isVisible?: boolean;
};

type QuestionCardOptionProps = {
  linkCount?: number;
};

/**
 * @method QuestionCardOption
 * @description Renders a single question option with input field, dropdowns, and action buttons
 * @param {QuestionCardOptionProps} props - Component props
 * @param {number} [props.linkCount] - Number of attachments linked to this option
 * @return {React.ReactNode} Option row JSX element
 */
const QuestionCardOption = (props: QuestionCardOptionProps) => {
  const { QUESTION_OPTION } = useCreateTemplateTranslations();
  const [isCompliant, setIsCompliant] = useState(
    QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.COMPLIANT.value
  );
  const CompliantOptions = Object.values(
    QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS
  );
  const AdditionalOptions = [
    QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.NO_ADDITIONAL_INFO,
    QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO,
    QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO,
  ];
  return (
    <Box className="ques-card-options">
      <Box className="ques-card-options__dnd">
        <CSvgIcon
          size={24}
          component={DraggableDots}
        />
      </Box>

      <Box className="ques-card-options__textbox">
        <CTextField
          required={false}
          placeholder={`${QUESTION_OPTION.optionInputPlaceholder}`}
        />
      </Box>

      <Box className="ques-card-options__dropdown">
        <CSelect
          options={CompliantOptions ?? []}
          optionLabelKey={"label"}
          optionValueKey={"value"}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsCompliant(e.target.value);
          }}
          allowFilter={false}
          value={isCompliant}
          IconComponent={(sel) => (
            <Box
              className={clsx({
                [sel?.className]: !!sel.className,
              })}
            >
              <CSvgIcon
                component={ChevronDown}
                size={18}
                color="secondary"
              />
            </Box>
          )}
        />
      </Box>

      <Box className="ques-card-options__dropdown">
        <CSelect
          options={AdditionalOptions ?? []}
          fullWidth
          optionLabelKey={"label"}
          optionValueKey={"value"}
          allowFilter={false}
          value={
            QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.NO_ADDITIONAL_INFO.value
          }
          IconComponent={(sel) => (
            <Box
              className={clsx({
                [sel?.className]: !!sel.className,
              })}
            >
              <CSvgIcon
                component={ChevronDown}
                size={18}
                color="secondary"
              />
            </Box>
          )}
        />
      </Box>
      <CIconButton>
        <Badge
          className="attachment-badge"
          badgeContent={props.linkCount}
          color="info"
          overlap="rectangular"
        >
          <CSvgIcon
            className={clsx({
              "ques-card-options__active-icon":
                props.linkCount && props.linkCount > 0,
              "ques-card-options__disabled-icon":
                !props.linkCount || props.linkCount === 0,
            })}
            component={AttachmentLink}
            size={22}
          />
        </Badge>
      </CIconButton>
      <CIconButton>
        <CSvgIcon
          size={22}
          component={Setting}
        />
      </CIconButton>
      <CIconButton>
        <CSvgIcon
          className="ques-card-options__delete-icon"
          component={Delete}
          size={22}
        />
      </CIconButton>
    </Box>
  );
};

/**
 * @method QuestionCardOptionsComponent
 * @description Renders a list of question options with add option button
 * @param {QuestionCardOptionsProps} props - Component props
 * @param {boolean} [props.isVisible] - Controls visibility of options container
 * @return {React.ReactNode} Options container JSX element
 */
const QuestionCardOptionsComponent = (props: QuestionCardOptionsProps) => {
  const { QUESTION_OPTION } = useCreateTemplateTranslations();
  return (
    <Box
      className={clsx({
        "ques-card-options-component": true,
        "ques-card-options-component__option-collapsed": !props.isVisible,
      })}
    >
      <QuestionCardOption linkCount={1} />
      <QuestionCardOption />
      <QuestionCardOption />
      <Box className="ct-questions-cards-wrapper__action">
        <CButton
          className="ct-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />
          {QUESTION_OPTION.addOptionButtonLabel}
        </CButton>
      </Box>
    </Box>
  );
};

export default QuestionCardOptionsComponent;
