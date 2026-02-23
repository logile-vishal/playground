import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import CModal, { ModalBody, ModalHeader } from "@/core/components/modal/Modal";
import { Close, Desktop, MoreOption, Phone } from "@/core/constants/icons";
import clsx from "@/utils/clsx";
import { templatePreviewExportData } from "@/utils/generate-export-data";

import { TEMPLATE_TYPE } from "../../constants/constant";
import { spreadSheetSampleData } from "../../sampleQuestion";
import {
  renderChecklistComponent,
  renderFormContainer,
  renderGridContainer,
} from "./PreviewTemplateType";
import RenderExportMenu from "../export-menubar/ExportMenu";
import "./PreviewModal.scss";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import {
  renderTemplatePreviewMobileSkeleton,
  renderTemplatePreviewSkeleton,
} from "../skeleton/Skeleton";

const PreviewModal = ({
  previewModal,
  onClose,
  isPreviewLoading,
  hasTemplatePreviewError,
}) => {
  const {
    TEMPLATE_PREVIEW_GRID_HEADER,
    QUESTION_TYPES,
    DATE_INPUT_TYPE,
    QUESTION_ATTACHMENT,
    ATTACHMENT_BUTTON_CONFIG,
  } = useTemplateLibraryTranslations();
  const [isDesktopPreview, setIsDesktopPreview] = React.useState<boolean>(true);
  const [templateType, setTemplateType] = React.useState<string>();
  const [isQuestionView, setQuestionView] = React.useState<boolean>(true);
  const templatePreviewRef = useRef<HTMLDivElement>(null);
  const printContentRef = useRef<HTMLDivElement>(null);

  // Local export menu state for preview modal
  const [previewExportMenu, setPreviewExportMenu] = React.useState<{
    anchorEl: null | HTMLElement;
    status: boolean;
  }>({
    anchorEl: null,
    status: false,
  });

  const handlePreviewExportMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setPreviewExportMenu({
      anchorEl: event.currentTarget,
      status: true,
    });
  };

  const handlePreviewExportMenuClose = () => {
    setPreviewExportMenu({
      anchorEl: null,
      status: false,
    });
  };

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
                      templateType,
                      TEMPLATE_PREVIEW_GRID_HEADER,
                      QUESTION_TYPES,
                      DATE_INPUT_TYPE,
                      QUESTION_ATTACHMENT,
                      ATTACHMENT_BUTTON_CONFIG
                    )
                  : // Checklist template preview
                    previewModal?.data?.checkListPreview?.subQuestions?.map(
                      (question, index) =>
                        renderChecklistComponent(
                          question,
                          `${index + 1}.`,
                          isDesktopPreview,
                          templateType,
                          QUESTION_TYPES,
                          DATE_INPUT_TYPE,
                          QUESTION_ATTACHMENT,
                          ATTACHMENT_BUTTON_CONFIG
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
    <Box ref={templatePreviewRef}>
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
              "template-preview-modal__title-wrapper--mobile":
                !isDesktopPreview,
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
                  size="medium"
                  walkMeId={[
                    "template-library",
                    "template-table",
                    "preview",
                    "mobile-view",
                  ]}
                  className={clsx({
                    "template-preview-modal__outline-icon--mobile":
                      !isDesktopPreview,
                  })}
                >
                  <CSvgIcon component={Phone} />
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
                  size="medium"
                  walkMeId={[
                    "template-library",
                    "template-table",
                    "preview",
                    "more-options",
                  ]}
                  onClick={(event) => handlePreviewExportMenuOpen(event)}
                >
                  <CSvgIcon
                    className={clsx({
                      "template-preview-modal__outline-icon--mobile":
                        !isDesktopPreview,
                    })}
                    component={MoreOption}
                  />
                </CIconButton>
              )}
              {/* close icon */}
              <CIconButton
                onClick={onClose}
                size="medium"
                className={clsx({
                  "template-preview-modal__outline-icon--mobile":
                    !isDesktopPreview,
                })}
                severity={!isDesktopPreview ? "primary" : "secondary"}
                variant={!isDesktopPreview ? "solid" : "text"}
                walkMeId={[
                  "template-library",
                  "template-table",
                  "preview",
                  "close",
                ]}
              >
                <CSvgIcon component={Close} />
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
            ref={printContentRef}
          >
            <div className="template-preview-modal__print-header">
              <h1>{previewModal?.data?.templateName}</h1>
            </div>
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
            exportMenu={previewExportMenu}
            handleExportMenuClose={handlePreviewExportMenuClose}
            ref={printContentRef}
            exportData={previewModal?.data}
            exportMethod={templatePreviewExportData}
          />
        </ModalBody>
      </CModal>
    </Box>
  );
};

export default PreviewModal;
