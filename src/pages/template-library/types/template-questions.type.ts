/* Answer Type */
export type AnswerType = {
  value: string;
  score: string;
  isCompliant: boolean | null;
  additionalInfo?: {
    required: boolean;
    requiredType: string;
  };
};

/* Attachment Type */
export type AttachmentType = {
  attachmentType: string;
  required: boolean;
  requiredType: string;
};

/* Question Type */
export type QuestionType = {
  questionId: number;
  parentQuestionId: number | null;
  index: string;
  qcontent: string;
  questionTypeId: number;
  questionType: string;
  questionTypeDescription: string;
  inputType: string;
  answers: AnswerType[];
  attachments: AttachmentType[] | [];
  subQuestions?: QuestionType[] | [] | null;
};

/* Question Type - Grid */
export type GridPreviewType = {
  columns: QuestionType[];
  rows: QuestionType[];
};

/* Question Type */
export type TemplatePreviewType = {
  name?: string;
  templateId: number;
  templateName?: string;
  templateBaseType?: string;
  checkListPreview?: QuestionType | null;
  gridsPreview?: GridPreviewType[] | null;
};
