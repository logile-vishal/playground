// TODO: removed sample data after data is fetched from the API

export const notificationSampleData = [
  {
    id: 1,
    condition: "Task Completed",
    messageTemplate: {
      id: 1,
      subject: "Floors in %assignee_store% need to be clean",
    },
    recipients: ["Assignee", "Ad Hoc"],
  },
  {
    id: 2,
    condition: "Task Expired",
    messageTemplate: {
      id: 2,
      subject: "Low Compliance expired in %assignee_store%",
    },
    recipients: ["Supervisor"],
  },
];

export const notificationTriggerByAnswersSampleData = [
  {
    id: 3,
    index: "1",
    conditionQuestion: "Is the department clean and organized?",
    conditionAnswer: "No",
    messageTemplate: {
      id: 1,
      subject: "Please clean the department immediately",
    },
    recipients: ["Assignee"],
  },
  {
    id: 4,
    index: "2",
    conditionQuestion: "Is the shared display case in use?",
    conditionAnswer: "Yes",
    messageTemplate: {
      id: 2,
      subject: "Choose your favourite colour",
    },
    recipients: ["Manager", "Supervisor"],
  },
  {
    id: 5,
    index: "3.1",
    conditionQuestion:
      "Were you able to clean the floors according to expect and maintain proper hygiene standards throughout the entire facility as required by management and company policies?",
    conditionAnswer: "Yes",
    messageTemplate: {
      id: 3,
      subject: "Cleaning supplies needed",
    },
    recipients: ["Assignee"],
  },
];

export const followupSampleData = [
  {
    id: 1,
    condition: "Task Completed",
    triggertaskName: "Clean the floor in %assignee_store%",
    recipients: ["Assignee", "Ad Hoc"],
  },
  {
    id: 2,
    condition: "Task Expired",
    triggertaskName: "Low Compliance %task_name%",
    recipients: ["Supervisor"],
  },
];

export const followupTriggerByAnswersSampleData = [
  {
    id: 3,
    index: "1",
    conditionQuestion: "Is the department clean and organized?",
    conditionAnswer: "No",
    triggertaskName: "Clean the floor",
    recipients: ["Assignee"],
  },
  {
    id: 5,
    index: "3.1",
    conditionQuestion:
      "Were you able to clean the floors according to expectations and maintain proper hygiene standards throughout the entire facility as required by management and company policies?",
    conditionAnswer: "Yes",
    triggertaskName: "Cleaning supplies needed %assignee_store%",
    recipients: ["Assignee", "Ad Hoc", "Execution Manager"],
  },
  {
    id: 6,
    index: "3.2",
    conditionQuestion:
      "Did you successfully clean the floors in compliance with company hygiene policies and maintain proper sanitation standards throughout the entire facility?",
    conditionAnswer: "No",
    triggertaskName:
      "Store cleaning in %assignee_store% with proper time frame",
    recipients: ["Assignee", "Ad Hoc", "Execution Manager"],
  },
];

export const basicTagsSampleData = [
  {
    label: "Cleaning",
    value: "cleaning",
    parentAsItem: true,
    righticon: "arrowRightFill",
    subMenu: {
      width: "200px",

      items: [
        {
          label: "Floors",
          value: "cleaning_floors",
        },
        {
          label: "Sinks",
          value: "cleaning_sinks",
        },
        {
          label: "Shelves",
          value: "cleaning_shelves",
        },
        {
          label: "Displays",
          value: "cleaning_displays",
        },
      ],
    },
  },
  {
    label: "Cook",
    value: "cook",
    customSubMenu: [],
  },
  {
    label: "Corrective Actions",
    value: "corrective_actions",
    customSubMenu: [],
  },
  {
    label: "Merchandising",
    value: "merchandising",
    customSubMenu: [],
  },
  {
    label: "Promotion",
    value: "promotion",
    customSubMenu: [],
  },
  {
    label: "Reports",
    value: "reports",
    customSubMenu: [],
  },
  {
    label: "Safety",
    value: "safety",
    customSubMenu: [],
  },
];
