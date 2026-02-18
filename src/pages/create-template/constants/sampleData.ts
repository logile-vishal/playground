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

export const followupSampleData = [
  {
    id: 1,
    condition: "Task Completed",
    triggerTaskName: "Clean the floor in %assignee_store%",
    recipients: ["Assignee", "Ad Hoc"],
  },
  {
    id: 2,
    condition: "Task Expired",
    triggerTaskName: "Low Compliance %task_name%",
    recipients: ["Supervisor"],
  },
];

export const followupTriggerByAnswersSampleData = [
  {
    id: 3,
    index: "1",
    conditionQuestion: "Is the department clean and organized?",
    conditionAnswer: "No",
    triggerTaskName: "Clean the floor",
    recipients: ["Assignee"],
  },
  {
    id: 5,
    index: "3.1",
    conditionQuestion:
      "Were you able to clean the floors according to expectations and maintain proper hygiene standards throughout the entire facility as required by management and company policies?",
    conditionAnswer: "Yes",
    triggerTaskName: "Cleaning supplies needed %assignee_store%",
    recipients: ["Assignee", "Ad Hoc", "Execution Manager"],
  },
  {
    id: 6,
    index: "3.2",
    conditionQuestion:
      "Did you successfully clean the floors in compliance with company hygiene policies and maintain proper sanitation standards throughout the entire facility?",
    conditionAnswer: "No",
    triggerTaskName:
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

export const orgLevelDropdownOptions = [
  {
    label: "Org Level - 1",
    value: 3101,
  },
  {
    label: "Org Level - 2",
    value: 3102,
  },
  {
    label: "Org Level - 3",
    value: 3103,
  },
];

export const orgDropdownOptions = [
  {
    label: "Org - 1",
    value: 101,
  },
  {
    label: "Org - 2",
    value: 102,
  },
  {
    label: "Org - 3",
    value: 101,
  },
  {
    label: "Org - 4",
    value: 102,
  },
];

export const orgTypeDropdownOptions = [
  {
    label: "Org Type - 1",
    value: 111,
  },
  {
    label: "Org Type - 2",
    value: 112,
  },
  {
    label: "Org Type - 3",
    value: 113,
  },
];

export const positionsOptions = [
  {
    label: "Position - 1",
    value: 2101,
  },
  {
    label: "Position - 2",
    value: 2102,
  },
  {
    label: "Position - 3",
    value: 2103,
  },
  {
    label: "Position - 4",
    value: 2104,
  },
];
