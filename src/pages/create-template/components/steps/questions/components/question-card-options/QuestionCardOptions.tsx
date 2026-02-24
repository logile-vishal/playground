import { useState } from "react";
import { Badge, Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { FieldValues, Control } from "react-hook-form";

import {
  AddIcon,
  AttachmentLink,
  ChevronDown,
  Delete,
  DraggableDots,
  Setting,
} from "@/core/constants/icons";
import { isNonEmptyValue } from "@/utils/index";
import clsx from "@/utils/clsx";
import CTextField from "@/core/components/form/textfield/Textfield";
import CSvgIcon from "@/core/components/icon/Icon";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";
import { CButton } from "@/core/components/button/button";
import CIconButton from "@/core/components/button/IconButton";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import TriggerModal from "@/pages/create-template/components/trigger-modal/TriggerModal";
import { TRIGGER_TYPE } from "@/pages/create-template/constants/constant";
import {
  followupSampleData,
  notificationSampleData,
} from "@/pages/create-template/constants/sampleData";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useQuestionListManager from "@/pages/create-template/hooks/useQuestionListManager";
import type {
  QuestionCardOptionProps,
  QuestionCardOptionsProps,
  QuestionProps,
  TriggerCardMenuProps,
} from "@/pages/create-template/types/questions.type";
import CSelect from "@/core/components/form/select";
import { useNotification } from "@/core/services/notification.service";
import { Severity } from "@/core/types/severity.type";
import type {
  DragHandleProps,
  ExtendedDragEndEvent,
} from "@/core/components/drag-drop/types/DragAndDrop.type";
import {
  CDragAndDrop,
  CSortableItem,
  CSortableContainer,
} from "@/core/components/drag-drop";

import "./QuestionCardOptions.scss";
import TriggerMenu from "../trigger-menu/TriggerMenu";

/**
 * @method QuestionCardOption
 * @description Renders a single question option with input field, dropdowns, and action buttons
 * @param {QuestionCardOptionProps} props - Component props
 * @return {React.ReactNode} Option row JSX element
 */
const QuestionCardOption = (props: QuestionCardOptionProps) => {
  const { QUESTION_OPTION } = useCreateTemplateTranslations();
  const { DELETE_CONFIRMATION } = useCommonTranslation();
  const { deleteOption } = useQuestionListManager();
  const { control, setFormValue, getFormValues, watch } =
    useCreateTemplateForm();

  const CompliantOptions = Object.values(
    QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS
  ) as { label: string; value: boolean | null }[];
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
  const [
    deleteQuestionOptionConfirmationModal,
    setDeleteQuestionOptionConfirmationModal,
  ] = useState<boolean>(false);
  const [deletedOption, setDeletedOption] = useState<number | null>(null);

  const watchNotificationForm = watch("notifications");
  const watchFollowUpTaskForm = watch("followUpTasks");

  const handleDeleteOptionClick = (idx: number): void => {
    setDeleteQuestionOptionConfirmationModal(true);
    setDeletedOption(idx);
  };

  const handleCloseDeleteModal = (): void => {
    setDeleteQuestionOptionConfirmationModal(false);
  };

  const handleConfirmDelete = (): void => {
    deleteOption(props.question.qId, deletedOption);
    setDeleteQuestionOptionConfirmationModal(false);
  };

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
      <TriggerMenu
        anchorEl={anchorEl}
        closeTriggerCardMenu={closeTriggerCardMenu}
        setTriggerCardModal={setTriggerCardModal}
        notificationCount={watchNotificationForm?.length}
        followUpCount={watchFollowUpTaskForm?.length}
      />
    );
  };

  const getIsCompliantValue = (isCompliant) => {
    if (isCompliant === undefined || isCompliant === null) {
      return QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.NA.label;
    } else if (isCompliant) {
      return QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.COMPLIANT.label;
    }
    return QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.NON_COMPLIANT.label;
  };

  const handleCompliantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = e.target.value;
    const questionList = getFormValues("questions") as QuestionProps[];
    questionList.forEach((question) => {
      if (question.qId === props.question.qId) {
        question.questionBasicData.response[props.idx].isCompliant =
          selectedOption !== null ? Boolean(selectedOption) : null;
      }
    });
    setFormValue("questions", questionList);
  };

  const getAdditionalInfoValue = (requiredType: string) => {
    switch (requiredType) {
      case QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO.value:
        return QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO.label;
      case QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO.value:
        return QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO.label;
      default:
        return QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.NO_ADDITIONAL_INFO
          .label;
    }
  };

  const handleAdditionalInfoChange = (selectedOption: string) => {
    const questionList = getFormValues("questions") as QuestionProps[];
    questionList.forEach((question) => {
      if (question.qId === props.question.qId) {
        question.questionBasicData.response[
          props.idx
        ].additionalInfo.requiredType = selectedOption;
      }
    });
    setFormValue("questions", questionList);
  };
  return (
    <CSortableItem
      id={String(props.idx)}
      enableCustomDragHandle={true}
    >
      {(dragHandleContext: DragHandleProps) => (
        <Box className="ques-card-options">
          <Box
            className="ques-card-options__dnd"
            {...dragHandleContext.attributes}
            {...dragHandleContext.listeners}
          >
            <CSvgIcon
              size={24}
              component={DraggableDots}
            />
          </Box>

          <Box className="ques-card-options__textbox">
            {control && (
              <Controller
                name={`${props?.questionFormPath}.${props?.idx}.title`}
                control={control as unknown as Control<FieldValues>}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <CTextField
                      required={false}
                      placeholder={`${QUESTION_OPTION.optionInputPlaceholder}`}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      {...field}
                    />
                  );
                }}
              />
            )}
          </Box>

          <Box className="ques-card-options__dropdown">
            <Controller
              name={`${props?.questionFormPath}.${props?.idx}.isCompliant`}
              control={control as unknown as Control<FieldValues>}
              render={({ field }) => {
                return (
                  <CSelect
                    options={(CompliantOptions as []) ?? []}
                    optionLabelKey={"label"}
                    optionValueKey="value"
                    {...field}
                    onChange={handleCompliantChange}
                    templates={{
                      inputValueTemplate: () =>
                        getIsCompliantValue(field?.value),
                    }}
                    value={getIsCompliantValue(field?.value)}
                    allowFilter={false}
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
                );
              }}
            />
          </Box>

          <Box className="ques-card-options__dropdown">
            <Controller
              name={`${props?.questionFormPath}.${props?.idx}.additionalInfo.requiredType`}
              control={control as unknown as Control<FieldValues>}
              render={({ field }) => {
                return (
                  <CSelect
                    options={AdditionalOptions ?? []}
                    optionLabelKey={"label"}
                    optionValueKey={"value"}
                    allowFilter={false}
                    {...field}
                    templates={{
                      inputValueTemplate: () =>
                        getAdditionalInfoValue(field?.value),
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleAdditionalInfoChange(e.target.value as string);
                    }}
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
                );
              }}
            />
          </Box>
          <CIconButton
            onClick={openTriggerCardMenu}
            size="medium"
            walkMeId={["questions", "options-list", "attachment-link"]}
          >
            <Badge
              className="attachment-badge"
              badgeContent={
                (watchNotificationForm?.length || 0) +
                  (watchFollowUpTaskForm?.length || 0) || 0
              }
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
              />
            </Badge>
          </CIconButton>
          <CIconButton
            size="medium"
            walkMeId={["questions", "options-list", "option-settings"]}
            onClick={() => props?.onAnswerOptionSettingsOpen(props?.idx)}
          >
            <CSvgIcon component={Setting} />
          </CIconButton>
          {props?.question?.questionBasicData?.response?.length > 1 && (
            <CIconButton
              onClick={() => handleDeleteOptionClick(props?.idx)}
              size="medium"
              severity="destructive"
              walkMeId={["questions", "options-list", "option-delete"]}
            >
              <CSvgIcon
                className="ques-card-options__delete-icon"
                component={Delete}
              />
            </CIconButton>
          )}

          {triggerCardMenu?.anchor && renderTriggerCardMenu()}

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
            walkMeIdPrefix={["question options", "trigger modal"]}
          />
          <CModal
            open={deleteQuestionOptionConfirmationModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title={
              DELETE_CONFIRMATION.QUESTION_OPTION.title + " " + (props.idx + 1)
            }
            severity={BUTTON_SEVERITY.destructive}
            size="medium"
            confirmText={DELETE_CONFIRMATION.QUESTION_OPTION.confirmLabel}
            walkMeIdPrefix={[
              ...props.walkMeIdPrefix,
              "delete",
              "option",
              "confirmation-modal",
            ]}
          >
            <ModalBody>
              <Box className="template-delete__modal-body">
                <Typography>
                  {DELETE_CONFIRMATION.QUESTION_OPTION.first_part_message}
                </Typography>
                <Typography>
                  {DELETE_CONFIRMATION.QUESTION_OPTION.second_part_message}
                </Typography>

                <Typography>
                  {DELETE_CONFIRMATION.QUESTION_OPTION.third_part_message}
                </Typography>
              </Box>
            </ModalBody>
          </CModal>
        </Box>
      )}
    </CSortableItem>
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
  const { EDITOR_ERROR } = useCommonTranslation();
  const { triggerValidation } = useCreateTemplateForm();
  const { addNewOption } = useQuestionListManager();
  const { notify } = useNotification();
  const { onDragMoveOption } = useQuestionListManager();

  const handleAddOption = async () => {
    const isValid = await triggerValidation("questions");
    if (!isValid) {
      notify({
        title: EDITOR_ERROR.REQUIRED_FIELD,
        config: {
          severity: Severity.ERROR,
        },
      });
      return;
    }
    if (props.question?.questionBasicData?.response)
      addNewOption(props.question?.qId);
  };

  const handleDragEnd = (event: ExtendedDragEndEvent) => {
    const questionId = props.question?.qId;
    const activeId = event.active.id as number;
    const overId = event.over.id as number;
    const dropPosition = event.dropPosition;
    onDragMoveOption(questionId, activeId, overId, dropPosition);
  };
  const optionsData = props?.question?.questionBasicData?.response;

  return (
    <CDragAndDrop
      callbacks={{
        onDragEnd: handleDragEnd,
      }}
      restrictToVertical={true}
    >
      <CSortableContainer
        sortableIds={optionsData?.map((_q, idx) => String(idx))} //TODO: REPLACE WITH ID POST DISCUSSIONS
        id={props.question.qId}
      >
        <Box
          className={clsx({
            "ques-card-options-component": true,
            "ques-card-options-component__option-collapsed": !props.isVisible,
          })}
        >
          {optionsData?.length === 0 && (
            <Box className="ques-card-options--error">
              {QUESTION_OPTION.errorTextNoOptions}
            </Box>
          )}
          {isNonEmptyValue(optionsData)
            ? props?.question?.questionBasicData?.response?.map((_, idx) => (
                <QuestionCardOption
                  key={props?.question.qId + "_option_" + idx}
                  idx={idx}
                  questionFormPath={props.questionFormPath}
                  question={props.question}
                  linkCount={0}
                  onAnswerOptionSettingsOpen={props.onAnswerOptionSettingsOpen}
                  walkMeIdPrefix={props.walkMeIdPrefix}
                />
              ))
            : ""}

          {/* <QuestionCardOption /> */}
          <Box className="ct-questions-cards-wrapper__action">
            <CButton
              className="ct-questions-cards-wrapper__action-item"
              variant="outline"
              severity="primary"
              size="small"
              onClick={handleAddOption}
            >
              <CSvgIcon
                size={15}
                component={AddIcon}
              />
              {QUESTION_OPTION.addOptionButtonLabel}
            </CButton>
          </Box>
        </Box>
      </CSortableContainer>
    </CDragAndDrop>
  );
};

export default QuestionCardOptionsComponent;
