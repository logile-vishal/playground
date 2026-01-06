import React, { useEffect } from "react";
import { Box } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import CModal, { ModalBody, ModalHeader } from "@/core/components/modal/Modal";
import { Close, Desktop, MoreOption, Phone } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import type { PreviewModalProps } from "../../types/template-library.type";
import { TEMPLATE_TYPE } from "../../constants/constant";
import { spreadSheetSampleData } from "../../sampleQuestion";
import {
  renderChecklistComponent,
  renderFormContainer,
  renderGridContainer,
} from "./PreviewTemplateType";
import RenderExportMenu from "../export-menubar/ExportMenu";
import "./PreviewModal.scss";
import {
  renderTemplatePreviewMobileSkeleton,
  renderTemplatePreviewSkeleton,
} from "../skeleton/Skeleton";

const PreviewModal: React.FC<PreviewModalProps> = ({
  previewModal,
  onClose,
  isPreviewLoading,
  hasTemplatePreviewError,
  exportMenu,
  handleExportMenuClose,
  handleExportMenuOpen,
}) => {
  const [isDesktopPreview, setIsDesktopPreview] = React.useState<boolean>(true);
  const [templateType, setTemplateType] = React.useState<string>();
  const [isQuestionView, setQuestionView] = React.useState<boolean>(true);

  useEffect(() => {
    setIsDesktopPreview(true);
    const tagType = previewModal?.data?.templateBaseType?.toUpperCase();
    setTemplateType(tagType);
    setQuestionView(
      tagType === TEMPLATE_TYPE.CHECKLIST || tagType === TEMPLATE_TYPE.GRID
    );
  }, [previewModal]);

  /**
   * @method switchPopupLayout
   * @description Toggles preview mode between desktop and mobile view.
   * @returns {void}
   */
  const switchPopupLayout = () => {
    setIsDesktopPreview(!isDesktopPreview);
  };

  /**
   * @method renderTemplatePreview
   * @description Renders the template preview based on the template type and view mode.
   * @returns {void}
   */
  const renderTemplatePreview = () => {
    return (
      <>
        {
          // Form and Spreadsheet templates preview
          templateType === TEMPLATE_TYPE.FORM ||
          templateType === TEMPLATE_TYPE.SPREADSHEET ? (
            <div>
              {renderFormContainer(spreadSheetSampleData.data, templateType)}
            </div>
          ) : (
            <div
              className={clsx({
                "template-preview-modal__questions-wrapper": true,
                "template-preview-modal__questions-wrapper--mobile":
                  !isDesktopPreview,
              })}
            >
              {
                // Grid template preview
                templateType === TEMPLATE_TYPE.GRID &&
                previewModal?.data?.gridsPreview
                  ? renderGridContainer(
                      previewModal?.data?.gridsPreview,
                      isDesktopPreview,
                      templateType
                    )
                  : // Checklist template preview
                    previewModal?.data?.checkListPreview?.subQuestions?.map(
                      (question, index) =>
                        renderChecklistComponent(
                          question,
                          `${index + 1}.`,
                          isDesktopPreview,
                          templateType
                        )
                    )
              }
            </div>
          )
        }
      </>
    );
  };

  return (
    <CModal
      open={previewModal?.status}
      onClose={onClose}
      size={isDesktopPreview ? "large" : "small"}
      showActions={false}
      className={"template-preview-modal"}
      containerClassName={clsx({
        "template-preview-modal__container": true,
        "template-preview-modal__container--mobile": !isDesktopPreview,
      })}
    >
      <ModalHeader
        headerClassName={clsx({
          "template-preview-modal__header": true,
          "template-preview-modal__header--mobile": !isDesktopPreview,
        })}
      >
        <div
          className={clsx({
            "template-preview-modal__title-wrapper": true,
            "template-preview-modal__title-wrapper--mobile": !isDesktopPreview,
          })}
        >
          <div
            className={clsx({
              "template-preview-modal__title": true,
              "template-preview-modal__title--mobile": !isDesktopPreview,
            })}
          >
            {previewModal?.data?.templateName || ""}
          </div>
          <div className="template-preview-modal__action-wrapper">
            {/* modify template viewport icon */}
            {isQuestionView && isDesktopPreview ? (
              <CIconButton
                onClick={switchPopupLayout}
                variant="outline"
                className={clsx({
                  "template-preview-modal__outline-icon--mobile":
                    !isDesktopPreview,
                })}
              >
                <CSvgIcon
                  component={Phone}
                  color={"secondary"}
                  size={22}
                />
              </CIconButton>
            ) : isQuestionView ? (
              <Box
                onClick={switchPopupLayout}
                className={clsx({
                  "template-preview-modal__cursor": true,
                  "template-preview-modal__desktop-icon": !isDesktopPreview,
                })}
              >
                <CSvgIcon
                  component={Desktop}
                  fill={"transparent"}
                  size={32}
                />
              </Box>
            ) : (
              ""
            )}
            {/* more action icon */}
            {isDesktopPreview && isQuestionView && (
              <CIconButton
                variant="outline"
                onClick={(event) => handleExportMenuOpen(event)}
              >
                <CSvgIcon
                  className={clsx({
                    "template-preview-modal__outline-icon--mobile":
                      !isDesktopPreview,
                  })}
                  component={MoreOption}
                  size={22}
                />
              </CIconButton>
            )}
            {/* close icon */}
            <CIconButton
              onClick={onClose}
              className={clsx({
                "template-preview-modal__outline-icon--mobile":
                  !isDesktopPreview,
              })}
            >
              <CSvgIcon
                component={Close}
                fill={
                  !isDesktopPreview
                    ? "var(--logile-base-white)"
                    : "var(--logile-icon-secondary)"
                }
                size={30}
              />
            </CIconButton>
          </div>
        </div>
      </ModalHeader>

      <ModalBody
        containerClassName={clsx({
          "template-preview-modal__container": true,
          "template-preview-modal__container--mobile": !isDesktopPreview,
        })}
      >
        <div
          className={clsx({
            "template-preview-modal__content": true,
            "template-preview-modal__content--mobile": !isDesktopPreview,
            "template-preview-modal__content-form": !isQuestionView,
          })}
        >
          {isPreviewLoading || hasTemplatePreviewError ? (
            isDesktopPreview ? (
              <Box className="template-preview-modal__loading-wrapper">
                {" "}
                {renderTemplatePreviewSkeleton()}
              </Box>
            ) : (
              <Box className="template-preview-modal__loading-wrapper-mobile">
                {renderTemplatePreviewMobileSkeleton()}
              </Box>
            )
          ) : (
            renderTemplatePreview()
          )}
        </div>

        <RenderExportMenu
          exportMenu={exportMenu}
          handleExportMenuClose={handleExportMenuClose}
        />
      </ModalBody>
    </CModal>
  );
};

export default PreviewModal;
