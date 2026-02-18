import type { QuestionSectionProps } from "@/pages/create-template/types/questions.type";
import { useFormFieldError } from "@/pages/create-template/hooks/useCreateTemplateFormError";

import { SectionCollapsed } from "./SectionCollapsed";
import { SectionExpanded } from "./SectionExpanded";

import "./Section.scss";

const QuestionSection = (props: QuestionSectionProps) => {
  const { hasError } = useFormFieldError(props.questionFormPath);

  const toggleSectionCollapse = () => {
    props.toggleExpand(props.sectionId);
  };

  if (!props.isExpanded) {
    return (
      <SectionCollapsed
        key={props.sectionId}
        sectionId={props.sectionId}
        title={props.title}
        questionFormPath={props.questionFormPath}
        hasError={hasError}
        onToggleCollapse={toggleSectionCollapse}
      />
    );
  }

  return (
    <SectionExpanded
      key={props.sectionId}
      sectionId={props.sectionId}
      title={props.title}
      index={props.index}
      data={props.data}
      questionFormPath={props.questionFormPath}
      expandedList={props.expandedList}
      toggleExpand={props.toggleExpand}
      handleQuestionAdd={props.handleQuestionAdd}
      isAddQuestionAllowed={props.isAddQuestionAllowed}
      walkMeIdPrefix={props.walkMeIdPrefix}
      onToggleCollapse={toggleSectionCollapse}
    />
  );
};

export default QuestionSection;
