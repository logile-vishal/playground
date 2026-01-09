import type { WildcardVariable } from "../types/rich-text-editor.type";

/**
 * @constant WILDCARD_LIST
 * @description Complete list of available wildcards for templates
 * Organized by category for better management
 */
export const WILDCARD_LIST: WildcardVariable[] = [
  { label: "Original Task Name", value: "%%original_task_name%%" },
  { label: "Completion Time", value: "%%completion_time%%" },
  { label: "Triggering Question", value: "%%triggering_question%%" },
  { label: "Triggering Answer", value: "%%triggering_answer%%" },
  { label: "Additional Information", value: "%%additional_information%%" },
  { label: "Triggering Temperature", value: "%%triggering_temperature%%" },
  { label: "Employee Name", value: "%%employee_name%%" },
  { label: "Triggering Numeric", value: "%%triggering_numeric%%" },
  { label: "Task Name", value: "%task_name%" },
  { label: "Template Name", value: "%template_name%" },
  { label: "Tracking Number", value: "%tracking_number%" },
  { label: "Task Score Percentage", value: "%task_score_percentage%" },
  { label: "Task Status", value: "%task_status%" },
  { label: "Assignee Store", value: "%assignee_store%" },
  { label: "Assignee Name", value: "%assignee_name%" },
  { label: "Assignee Position", value: "%assignee_position%" },
  { label: "Assignee Org Type", value: "%assignee_org_type%" },
  { label: "Question Number", value: "%question_number%" },
  { label: "Question Content", value: "%question_content%" },
  { label: "Answer Value", value: "%answer_value%" },
  { label: "Additional Info", value: "%additional_info%" },
  { label: "Audit", value: "%audit%" },
  { label: "Original Task Expiration", value: "%original_task_expiration%" },
  { label: "Barcode Item Name", value: "%barcode_item_name%" },
  { label: "Question 1 Content", value: "%question_1_content%" },
  {
    label: "Question 1 Relative Content",
    value: "%question_1_relative_content%",
  },
  { label: "Answer 1 Content", value: "%answer_1_content%" },
  { label: "Additional Info 1 Content", value: "%addlinfo_1_content%" },
  { label: "Question 1 Temperature", value: "%question_1_temperature%" },
  {
    label: "Question 1 Observation Time",
    value: "%question_1_observation_time%",
  },
  { label: "Question 1 Numeric", value: "%question_1_numeric%" },
  { label: "Photo 1 Link", value: "%photo_1_link%" },
  { label: "Attachment 1 Link", value: "%attachment_1_link%" },
];

/**
 * @constant WILDCARD_MAP
 * @description Map of wildcard values to their labels for quick lookup
 */
export const WILDCARD_MAP = new Map(
  WILDCARD_LIST.map(({ value, label }) => [value, label])
);
