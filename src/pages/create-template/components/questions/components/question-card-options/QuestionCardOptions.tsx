import { Badge, Box } from "@mui/material";

import {
  AddIcon,
  AttachmentLink,
  ChevronDown,
  Delete,
  DraggableDots,
  Setting,
} from "@/core/constants/icons";
import {
  QUESTION_CARD_ADDITIONAL_OPTIONS,
  QUESTION_CARD_COMPLIANT_OPTIONS,
  QUESTION_CARD_OPTION,
} from "@/pages/create-template/constants/questions";
import clsx from "@/utils/clsx";
import CTextField from "@/core/components/form/textfield/Textfield";
import CSvgIcon from "@/core/components/icon/Icon";
import CSelect from "@/core/components/select/Select";
import { CButton } from "@/core/components/button/button";
import { QUESTION_SECTION } from "@/pages/create-template/constants/constant";
import CIconButton from "@/core/components/button/IconButton";

import "./QuestionCardOptions.scss";

type QuestionCardOptionsProps = {
  isVisible?: boolean;
};

type QuestionCardOptionProps = {
  linkCount?: number;
};

const ComplientOptions = [
  QUESTION_CARD_COMPLIANT_OPTIONS.COMPLIANT,
  QUESTION_CARD_COMPLIANT_OPTIONS.NON_COMPLIANT,
  QUESTION_CARD_COMPLIANT_OPTIONS.NA,
];

const AdditionalOptions = [
  QUESTION_CARD_ADDITIONAL_OPTIONS.NO_ADDITIONAL_INFO,
  QUESTION_CARD_ADDITIONAL_OPTIONS.OPTIONAL_INFO,
  QUESTION_CARD_ADDITIONAL_OPTIONS.REQUIRED_INFO,
];

/**
 * @method QuestionCardOption
 * @description Renders a single question option with input field, dropdowns, and action buttons
 * @param {QuestionCardOptionProps} props - Component props
 * @param {number} [props.linkCount] - Number of attachments linked to this option
 * @return {React.ReactNode} Option row JSX element
 */
const QuestionCardOption = (props: QuestionCardOptionProps) => {
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
          placeholder={`${QUESTION_CARD_OPTION.optionPlaceholder}`}
        />
      </Box>

      <Box className="ques-card-options__dropdown">
        <CSelect
          options={ComplientOptions ?? []}
          optionLabelKey={"label"}
          optionValueKey={"value"}
          fullWidth
          allowFilter={false}
          value={QUESTION_CARD_COMPLIANT_OPTIONS.COMPLIANT.value}
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
          value={QUESTION_CARD_ADDITIONAL_OPTIONS.NO_ADDITIONAL_INFO.value}
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
          {QUESTION_SECTION.ACTION_ADD_OPTION}
        </CButton>
      </Box>
    </Box>
  );
};

export default QuestionCardOptionsComponent;
