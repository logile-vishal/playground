import type { WildcardVariable } from "../types/rich-text-editor.type";

/**
 * @constant WILDCARD_LIST
 * @description Complete list of available wildcards for templates
 * Organized by category for better management
 */
export const WILDCARD_LIST: WildcardVariable[] = [
  { name: "Original Task Name", value: "%%original_task_name%%" },
  { name: "Completion Time", value: "%%completion_time%%" },
  { name: "Triggering Question", value: "%%triggering_question%%" },
  { name: "Triggering Answer", value: "%%triggering_answer%%" },
  { name: "Additional Information", value: "%%additional_information%%" },
  { name: "Triggering Temperature", value: "%%triggering_temperature%%" },
  { name: "Employee Name", value: "%%employee_name%%" },
  { name: "Triggering Numeric", value: "%%triggering_numeric%%" },
  { name: "Task Name", value: "%task_name%" },
  { name: "Template Name", value: "%template_name%" },
  { name: "Tracking Number", value: "%tracking_number%" },
  { name: "Task Score Percentage", value: "%task_score_percentage%" },
  { name: "Task Status", value: "%task_status%" },
  { name: "Assignee Store", value: "%assignee_store%" },
  { name: "Assignee Name", value: "%assignee_name%" },
  { name: "Assignee Position", value: "%assignee_position%" },
  { name: "Assignee Org Type", value: "%assignee_org_type%" },
  { name: "Question Number", value: "%question_number%" },
  { name: "Question Content", value: "%question_content%" },
  { name: "Answer Value", value: "%answer_value%" },
  { name: "Additional Info", value: "%additional_info%" },
  { name: "Audit", value: "%audit%" },
  { name: "Original Task Expiration", value: "%original_task_expiration%" },
  { name: "Barcode Item Name", value: "%barcode_item_name%" },
  { name: "Question 1 Content", value: "%question_1_content%" },
  {
    name: "Question 1 Relative Content",
    value: "%question_1_relative_content%",
  },
  { name: "Answer 1 Content", value: "%answer_1_content%" },
  { name: "Additional Info 1 Content", value: "%addlinfo_1_content%" },
  { name: "Question 1 Temperature", value: "%question_1_temperature%" },
  {
    name: "Question 1 Observation Time",
    value: "%question_1_observation_time%",
  },
  { name: "Question 1 Numeric", value: "%question_1_numeric%" },
  { name: "Photo 1 Link", value: "%photo_1_link%" },
  { name: "Attachment 1 Link", value: "%attachment_1_link%" },
];

/**
 * @constant WILDCARD_MAP
 * @description Map of wildcard values to their labels for quick lookup
 */
export const WILDCARD_MAP = new Map(
  WILDCARD_LIST.map(({ value, name }) => [value, name])
);
