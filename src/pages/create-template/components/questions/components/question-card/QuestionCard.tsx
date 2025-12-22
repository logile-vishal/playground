import { Box } from "@mui/material";

import clsx from "@/utils/clsx";
import type { QuestionCardProps } from "@/pages/create-template/types/questions.type";

import QuestionCardCollapsed from "../question-card-collapsed/QuestionCardCollapsed";
import QuestionCardExpanded from "../question-card-expand/QuestionCardExpanded";
import "./QuestionCard.scss";

/**
 * @method QuestionCard
 * @description Renders either collapsed or expanded view of a question card based on expanded state
 * @param {QuestionCardProps} props - Component props
 * @param {QuestionProps} props.question - Question data object
 * @param {Record<string|number, boolean>} [props.expandedList] - Map of expanded question IDs
 * @param {Function} props.toggleExpand - Callback to toggle question expansion
 * @return {React.ReactNode} Question card container with collapsed or expanded view
 */
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  expandedList,
  toggleExpand,
}) => {
  return (
    <Box
      className={clsx({
        "ct-question-container": true,
      })}
    >
      {!expandedList ||
      !(question?.id in expandedList) ||
      !expandedList[question?.id] ? (
        <QuestionCardCollapsed
          question={question}
          toggleExpand={toggleExpand}
        />
      ) : (
        <QuestionCardExpanded
          question={question}
          toggleExpand={toggleExpand}
        />
      )}
    </Box>
  );
};

export default QuestionCard;
