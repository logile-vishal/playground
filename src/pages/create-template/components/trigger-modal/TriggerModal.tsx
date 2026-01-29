import type React from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import {
  AddIcon,
  Copy,
  Delete,
  Edit,
  QuickShift,
  TeamLine,
} from "@/core/constants/icons";
import {
  TRIGGER_ANSWER,
  TRIGGER_TYPE,
} from "@/pages/create-template/constants/constant";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import clsx from "@/utils/clsx";

import "./TriggerModal.scss";
import type { TriggerModalProps } from "../../types/questions.type";

const TriggerModal: React.FC<TriggerModalProps> = ({
  showModal,
  handleCloseModal,
  type,
  data,
  walkMeIdPrefix,
}) => {
  const { NOTIFICATIONS, FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const { generateId } = useWalkmeId();
  const dataConstant =
    type === TRIGGER_TYPE.notification ? NOTIFICATIONS : FOLLOWUP_TASKS;
  /**
   * @function renderListColumn
   * @description Renders a list column with title and content
   * @param {string} title - Column title
   * @param {React.ReactNode} value - Column content value
   * @param {string} className - CSS class name
   * @param {boolean} iconVisible - Whether to show icon
   * @param {React.ReactNode} icon - Icon component
   * @return {React.ReactNode} List column JSX
   */
  const renderListColumn = ({
    title,
    value,
    className,
    iconVisible,
    icon,
  }: {
    title: string;
    value: React.ReactNode;
    className: string;
    iconVisible?: boolean;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }): React.ReactNode => {
    return (
      <Box className={clsx({ [className]: true })}>
        <Box className="trigger-modal__list-title">
          {title}
          {iconVisible && icon ? (
            <CSvgIcon
              component={icon}
              size={16}
              color={"secondary"}
            />
          ) : null}
        </Box>
        <Box className="trigger-modal__list-content">{value}</Box>
      </Box>
    );
  };

  return (
    <CModal
      open={showModal}
      title={
        type === TRIGGER_TYPE.notification
          ? NOTIFICATIONS.heading
          : FOLLOWUP_TASKS.heading
      }
      onClose={handleCloseModal}
      size="large"
      showActions={false}
      containerClassName="trigger-modal"
    >
      <ModalBody>
        {data.length === 0 ? (
          <CNoData
            title={
              type === TRIGGER_TYPE.notification
                ? NOTIFICATIONS.noNotificationsPlaceholder
                : FOLLOWUP_TASKS.noFollowUpTasksPlaceholder
            }
            imageWidth={87}
          >
            <CButton
              variant="solid"
              severity="primary"
              size="small"
              data-walkme-id={generateId([
                ...walkMeIdPrefix,
                "trigger add button",
              ])}
            >
              <CSvgIcon
                size={15}
                component={AddIcon}
              />
              <Box ml="var(--space-xs)">
                {type === TRIGGER_TYPE.notification
                  ? NOTIFICATIONS.addNotificationButtonLabel
                  : FOLLOWUP_TASKS.addFollowUpTaskButtonLabel}
              </Box>
            </CButton>
          </CNoData>
        ) : (
          <Box>
            {data?.map((item) => {
              return (
                <Box className="trigger-modal__list">
                  <Box className="trigger-modal__list-content">
                    {renderListColumn({
                      title: dataConstant.CARD_COLUMN_HEADINGS.recipients,
                      value: (
                        <WildcardLabel
                          label={item.recipients.join(", ")}
                          truncate={false}
                        />
                      ),
                      className: "trigger-modal__list-content-recipients",
                      iconVisible: item.recipients.length > 0,
                      icon:
                        item.recipients.length > 1
                          ? TeamLine
                          : item.recipients[0] ===
                              TRIGGER_ANSWER.assigneeRecipient
                            ? QuickShift
                            : null,
                    })}

                    {renderListColumn({
                      title:
                        type === TRIGGER_TYPE.notification
                          ? NOTIFICATIONS.CARD_COLUMN_HEADINGS.messageSubject
                          : FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.taskName,
                      value: (
                        <WildcardLabel
                          label={
                            type === TRIGGER_TYPE.notification
                              ? item?.messageTemplate?.subject
                              : item?.triggerTaskName
                          }
                          truncate={false}
                        />
                      ),
                      className: "trigger-modal__list-content-message",
                    })}
                  </Box>
                  <Box className="trigger-modal__list-actions">
                    {/* TODO: Add action handler for below buttons */}
                    <CIconButton
                      size="medium"
                      walkMeId={[...walkMeIdPrefix, "trigger clone button"]}
                    >
                      <CSvgIcon component={Copy} />
                    </CIconButton>
                    <CIconButton
                      size="medium"
                      walkMeId={[...walkMeIdPrefix, "trigger edit button"]}
                    >
                      <CSvgIcon component={Edit} />
                    </CIconButton>
                    <CIconButton
                      size="medium"
                      severity="destructive"
                      walkMeId={[...walkMeIdPrefix, "trigger delete button"]}
                    >
                      <CSvgIcon component={Delete} />
                    </CIconButton>
                  </Box>
                </Box>
              );
            })}
            <Box className="trigger-modal__action-btn">
              <CButton
                variant="outline"
                severity="primary"
                size="small"
                data-walkme-id={generateId([
                  ...walkMeIdPrefix,
                  "trigger add button",
                ])}
              >
                <CSvgIcon
                  size={15}
                  component={AddIcon}
                />
                <Box ml="var(--space-xs)">
                  {type === TRIGGER_TYPE.notification
                    ? NOTIFICATIONS.addNotificationButtonLabel
                    : FOLLOWUP_TASKS.addFollowUpTaskButtonLabel}
                </Box>
              </CButton>
            </Box>
          </Box>
        )}
      </ModalBody>
    </CModal>
  );
};

export default TriggerModal;
