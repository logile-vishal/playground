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
import { CButton } from "@/core/components/button/button";
import CIconButton from "@/core/components/button/IconButton";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import TriggerModal from "@/pages/create-template/components/trigger-modal/TriggerModal";
import { TRIGGER_TYPE } from "@/pages/create-template/constants/constant";
import {
  followupSampleData,
  notificationSampleData,
} from "@/pages/create-template/constants/sampleData";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";
import { OPTION_TRIGGER_MENU_KEY } from "@/pages/create-template/constants/questions";
import type {
  QuestionCardOptionProps,
  QuestionCardOptionsProps,
  TriggerCardMenuProps,
} from "@/pages/create-template/types/questions.type";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import CSelect from "@/core/components/form/select";

import "./QuestionCardOptions.scss";

/**
 * @method QuestionCardOption
 * @description Renders a single question option with input field, dropdowns, and action buttons
 * @param {QuestionCardOptionProps} props - Component props
 * @param {number} [props.linkCount] - Number of attachments linked to this option
 * @return {React.ReactNode} Option row JSX element
 */
const QuestionCardOption = (props: QuestionCardOptionProps) => {
  const { QUESTION_OPTION, QUESTIONS } = useCreateTemplateTranslations();
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
  const [triggerCardMenu, setTriggerCardMenu] = useState<TriggerCardMenuProps>({
    anchor: null,
    status: false,
  });
  const [triggerCardModal, setTriggerCardModal] = useState({
    status: false,
    data: null,
    type: null,
  });

  const openTriggerCardMenu = (event: React.MouseEvent<HTMLElement>) => {
    setTriggerCardMenu({
      anchor: event.currentTarget,
      status: true,
    });
  };

  const closeTriggerCardMenu = () => {
    setTriggerCardMenu({
      anchor: null,
      status: false,
    });
  };

  const closeTriggerCardModal = () => {
    setTriggerCardModal({
      status: false,
      data: null,
      type: null,
    });
  };

  /**
   * @method renderTriggerCardMenu
   * @description Renders the trigger card menu with nested options
   * @return {React.ReactNode} Nested menu JSX element
   */
  const renderTriggerCardMenu = () => {
    const { anchor: anchorEl } = triggerCardMenu;
    return (
      // TODO: Need to add badge on menu items for count of triggers
      <CNestedMenu
        anchorEl={anchorEl}
        menuItems={QUESTIONS.OPTION_TRIGGER_MENU_OPTIONS as NestedMenuItem[]}
        onClose={closeTriggerCardMenu}
        showSearch={false}
        className="question-section__settings-menu"
        onSelect={(item) => {
          if (item?.value === OPTION_TRIGGER_MENU_KEY.Notification) {
            setTriggerCardModal({
              status: true,
              data: null,
              type: TRIGGER_TYPE.notification,
            });
          } else if (item?.value === OPTION_TRIGGER_MENU_KEY.FollowUp) {
            setTriggerCardModal({
              status: true,
              data: null,
              type: TRIGGER_TYPE.followup,
            });
          }
        }}
      />
    );
  };

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
      <CIconButton onClick={openTriggerCardMenu}>
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

      {renderTriggerCardMenu()}

      {/* TODO: Remove sample data after api integration */}
      <TriggerModal
        type={triggerCardModal.type}
        data={
          triggerCardModal.type === TRIGGER_TYPE.followup
            ? followupSampleData
            : notificationSampleData
        }
        showModal={triggerCardModal.status}
        handleCloseModal={closeTriggerCardModal}
        walkMeIdPrefix={[
          "create template",
          "question options",
          "trigger modal",
        ]}
      />
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
