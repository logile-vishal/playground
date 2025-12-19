// TODO: removed sample data after data is fetched from the API

export const notificationSampleData = [
  {
    id: 1,
    condition: "Task Completed",
    messageSubject: "Floors in %assignee_store% need to be clean",
    recipients: ["Assignee", "Ad Hoc"],
  },
  {
    id: 2,
    condition: "Task Expired",
    messageSubject: "Low Compliance expired in %assignee_store%",
    recipients: ["Supervisor"],
  },
];

export const notificationTriggerByAnswersSampleData = [
  {
    id: 3,
    index: "1",
    conditionQuestion: "Is the department clean and organized?",
    conditionAnswer: "No",
    messageSubject: "Floors not clean in bakery section",
    recipients: ["Assignee"],
  },
  {
    id: 4,
    index: "2",
    conditionQuestion: "Is the shared display case in use?",
    conditionAnswer: "Yes",
    messageSubject: "Choose your favourite colour",
    recipients: ["Manager", "Supervisor"],
  },
  {
    id: 5,
    index: "3.1",
    conditionQuestion:
      "Were you able to clean the floors according to expect and maintain proper hygiene standards throughout the entire facility as required by management and company policies?",
    conditionAnswer: "Yes",
    messageSubject: "Cleaning supplies needed",
    recipients: ["Assignee"],
  },
];

export const followupSampleData = [
  {
    id: 1,
    condition: "Task Completed",
    taskName: "Clean the floor in %assignee_store%",
    recipients: ["Assignee", "Ad Hoc"],
  },
  {
    id: 2,
    condition: "Task Expired",
    taskName: "Low Compliance %task_name%",
    recipients: ["Supervisor"],
  },
];

export const followupTriggerByAnswersSampleData = [
  {
    id: 3,
    index: "1",
    conditionQuestion: "Is the department clean and organized?",
    conditionAnswer: "No",
    taskName: "Clean the floor",
    recipients: ["Assignee"],
  },
  {
    id: 5,
    index: "3.1",
    conditionQuestion:
      "Were you able to clean the floors according to expectations and maintain proper hygiene standards throughout the entire facility as required by management and company policies?",
    conditionAnswer: "Yes",
    taskName: "Cleaning supplies needed %assignee_store%",
    recipients: ["Assignee", "Ad Hoc", "Execution Manager"],
  },
];
