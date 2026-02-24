import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { Download, Excel, Pdf } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import { TEMPLATE_TYPE } from "../../constants/constant";
import { getQuestionTypes } from "../template-libarary-config/TemplatePreviewConfig";
import {
  RenderDropdownQues,
  RenderRadioQues,
  RenderUserInputQues,
} from "./PreviewQuesType";
import RenderSection from "./SectionQuesType";

/**
 * @method renderAnswer
 * @description Renders the appropriate answer component based on the question type.
 * @param {Object} question - The question object containing metadata.
 * @param {boolean} isDesktopPreview - isDesktopPreview for desktop view.
 * @param {string} templateType - templateType for various question type.
 * @returns {ReactNode} The rendered answer component or null for unknown types.
 */
export const renderAnswer = (
  question,
  isDesktopPreview,
  templateType,
  QUESTION_TYPES,
  DATE_INPUT_TYPE,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG
) => {
  const { DROPDOWN, CHECKBOX, RADIO_BUTTON, LONG_USER_INPUT, USER_INPUT } =
    getQuestionTypes(QUESTION_TYPES);
  const type = question?.questionType;
  switch (type) {
    case DROPDOWN.value:
    case CHECKBOX.value:
      return (
        <RenderDropdownQues
          question={question}
          isDesktopPreview={isDesktopPreview}
          templateBaseType={templateType}
          QUESTION_TYPES={QUESTION_TYPES}
          QUESTION_ATTACHMENT={QUESTION_ATTACHMENT}
          ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
        />
      );
    case RADIO_BUTTON.value:
      return (
        <RenderRadioQues
          question={question}
          isDesktopPreview={isDesktopPreview}
          templateBaseType={templateType}
          QUESTION_TYPES={QUESTION_TYPES}
          QUESTION_ATTACHMENT={QUESTION_ATTACHMENT}
          ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
        />
      );
    case USER_INPUT.value:
      return (
        <RenderUserInputQues
          question={question}
          isDesktopPreview={isDesktopPreview}
          templateBaseType={templateType}
          QUESTION_TYPES={QUESTION_TYPES}
          QUESTION_ATTACHMENT={QUESTION_ATTACHMENT}
          ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
          DATE_INPUT_TYPE={DATE_INPUT_TYPE}
        />
      );
    case LONG_USER_INPUT.value:
      return (
        <RenderUserInputQues
          question={question}
          isDesktopPreview={isDesktopPreview}
          templateBaseType={templateType}
          QUESTION_TYPES={QUESTION_TYPES}
          QUESTION_ATTACHMENT={QUESTION_ATTACHMENT}
          ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
          DATE_INPUT_TYPE={DATE_INPUT_TYPE}
        />
      );
    default:
      return null;
  }
};

/**
 * @method renderQuestionTitle
 * @description Renders the question title row, including mandatory indicator and tags.
 * @param {Object} question - The question object.
 * @param {number} index - Display index of the question.
 * @param {boolean} isQuestionTagsVisible - Whether to show question tags.
 * @returns {ReactNode} JSX for the question title.
 */
const renderQuestionTitle = (question, index, isDesktopPreview) => {
  const isQuesMandatory = question?.isMandatory;
  return (
    <Box
      className={clsx({
        "template-preview-modal__question-title": true,
        "template-preview-modal__question-title--mobile": !isDesktopPreview,
      })}
    >
      <Box className="template-preview-modal__question-item__title-wrapper">
        {isQuesMandatory && (
          <Typography
            component="span"
            className="question-item__required"
          >
            *
          </Typography>
        )}
        <Box>{index}</Box>
        <WildcardLabel
          label={question?.qcontent || ""}
          truncate={true}
        />
      </Box>
    </Box>
  );
};

/**
 * @method renderChecklistComponent
 * @description Wraps question title and answer inside a layout container.
 * @param {Object} question - The question object.
 * @param {number|string} index - Display index of the question.
 * @returns {ReactNode} A container including question title and rendered answer.
 */
export const renderChecklistComponent = (
  question,
  index,
  isDesktopPreview,
  templateType,
  QUESTION_TYPES,
  DATE_INPUT_TYPE,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG
) => {
  return (
    <Box
      className={clsx({
        "template-preview-modal__question-wrapper": true,
        "template-preview-modal__question-wrapper--mobile": !isDesktopPreview,
        "template-preview-modal__section-accordion--mobile":
          question?.subQuestions?.length > 0 && !isDesktopPreview,
      })}
    >
      {question?.subQuestions?.length > 0 ? (
        <RenderSection
          question={question}
          parentIndex={index}
          isDesktopPreview={isDesktopPreview}
          templateBaseType={templateType}
          renderChecklistComponent={renderChecklistComponent}
          QUESTION_TYPES={QUESTION_TYPES}
          DATE_INPUT_TYPE={DATE_INPUT_TYPE}
          QUESTION_ATTACHMENT={QUESTION_ATTACHMENT}
          ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
        />
      ) : (
        <>
          {question?.questionType !==
            getQuestionTypes(QUESTION_TYPES).TITLE.value &&
            renderQuestionTitle(
              question,
              index,

              isDesktopPreview
            )}
          {renderAnswer(
            question,
            isDesktopPreview,
            templateType,
            QUESTION_TYPES,
            DATE_INPUT_TYPE,
            QUESTION_ATTACHMENT,
            ATTACHMENT_BUTTON_CONFIG
          )}
        </>
      )}
    </Box>
  );
};

/**
 * @method renderFormContainer
 * @description Renders a preview container for template type Form and Spreadsheet (PDF or Excel display).
 * @param {Object} question - The question object containing file info.
 * @param {string} type - Template type identifier.
 * @returns {ReactNode} The rendered form container.
 */
export const renderFormContainer = (question, type) => {
  return (
    <Box className="template-preview-modal__form-wrapper">
      <Box className="template-preview-modal__form-title">
        {type === TEMPLATE_TYPE.FORM ? (
          <CSvgIcon
            component={Pdf}
            size={26}
            color="violation"
          />
        ) : (
          <CSvgIcon
            component={Excel}
            size={26}
            color="success"
          />
        )}
        <Box>
          <Box>{question.fileName}</Box>
          <Box className="template-preview-modal__form-sub-text">
            {question.fileSize}
          </Box>
        </Box>
      </Box>
      <CIconButton
        variant="outline"
        size="small"
        walkMeId={["template-library", "template-table", "preview", "download"]}
        className="template-preview-modal__download-icon"
      >
        <CSvgIcon component={Download} />
      </CIconButton>
    </Box>
  );
};

/**
 * @method gridHeader
 * @description Renders the header row for grid-type questions.
 * @param {Object[]} list - Array of column question objects.
 * @returns {ReactNode} Table header JSX.
 */
const gridHeader = (list, TEMPLATE_PREVIEW_GRID_HEADER) => (
  <TableHead className="template-preview-modal__grid-table-header">
    <TableRow>
      <TableCell>{TEMPLATE_PREVIEW_GRID_HEADER.title}</TableCell>
      {list.map((item) => (
        <TableCell>{item?.qcontent}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

/**
 * @method renderGridContainer Renders a grid container where each row contains a question and multiple answer cells.
 * @param {Object} quesData - Grid metadata including columns and rows.
 * @param {Object[]} quesData.columns - Column definitions.
 * @param {Object[]} quesData.rows - Row questions.
 * @returns {ReactNode} The rendered grid table.
 */
export const renderGridContainer = (
  quesData,
  isDesktopPreview,
  templateType,
  TEMPLATE_PREVIEW_GRID_HEADER,
  QUESTION_TYPES,
  DATE_INPUT_TYPE,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG
) => {
  return (
    <TableContainer>
      <Table
        className={clsx({
          "template-preview-modal__grid-table": true,
          "template-preview-modal__grid-table--mobile": !isDesktopPreview,
        })}
        data-responsive="true"
      >
        {gridHeader(quesData.columns, TEMPLATE_PREVIEW_GRID_HEADER)}
        <TableBody>
          {quesData.rows.map((question, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="template-preview-modal__grid-question-container">
                  {renderQuestionTitle(
                    question,
                    `${index + 1}.`,

                    isDesktopPreview
                  )}
                </TableCell>
                {quesData?.columns?.map((col, colIdx) => (
                  <TableCell
                    data-label={col?.qcontent}
                    key={colIdx}
                  >
                    {renderAnswer(
                      question,
                      isDesktopPreview,
                      templateType,
                      QUESTION_TYPES,
                      DATE_INPUT_TYPE,
                      QUESTION_ATTACHMENT,
                      ATTACHMENT_BUTTON_CONFIG
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
