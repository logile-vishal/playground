/* TODO: Need to remove static data for template preview */

export const sampleQuestion1 = {
    type: "Form",
    data: {
        fileName: "Prepared Food Services(PF01).pdf",
        fileSize: "2.5 MB",
    }
};

export const sampleQuestion2 = {
    type: "Spreadsheet",
    data: {
        fileName: "Prepared Food Services(PF01).xlsx",
        fileSize: "2.5 MB",
    }
};

export const templatePreviewData = {
    "data": {
        "templateId": 2382,
        "templateName": "userinput test",
        "templateType": "Checklist",
        "templateBaseType": "CHECKLIST",
        "checkListPreview":  {
                "questionId": 891734,
                "parentQuestionId": 0,
                "index": "1.",
                "questionTypeId": 1,
                "questionType": "Title",
                "attachments": [],
                "answers": [],
                "subQuestions": [
                    {
                    "questionId": 891740,
                    "parentQuestionId": 891734,
                    "index": "1.6.",
                    "questionTypeId": 2,
                    "questionType": "Dropdown",
                    "attachments": [
                        {
                            "attachmentType": "Photo",
                            "required": true,
                            "requiredType": "In compliance only"
                        },
                    ],
                    "answers": [
                        {
                            "value": "Produce",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Diary",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Text"
                            }
                        },
                        {
                            "value": "Meat",
                            "score": "0",
                            "isCompliant": false
                        },
                         {
                            "value": "Bakery",
                            "score": "0",
                            "isCompliant": false
                        },
                         {
                            "value": "Grocery",
                            "score": "0",
                            "isCompliant": true
                        }
                    ],
                    "subQuestions": [],
                    "qcontent": "Which department are you currently auditing?"
                },
            {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "Dropdown",
                "attachments": [
                        {
                            "attachmentType": "Temperature Probe",
                            "required": true,
                            "requiredType": "Out of compliance only"
                        },
                ],
                "answers": [
                        {
                            "value": "Soup",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": true,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Pizza",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Burrito",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                "subQuestions": [],
                "qcontent": "Choose the hot food item to check holding temperature."
            },
            {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "Dropdown",
                "attachments": [
                        {
                            "attachmentType": "Numeric",
                            "required": true,
                            "requiredType": "Always"
                        },
                ],
                "answers": [
                        {
                            "value": "Frozen",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                         {
                            "value": "Dairy",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Bakery",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Non-food",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                "subQuestions": [],
                "qcontent": "Select the damaged item category."
            },
            {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "Radio Button",
                "attachments": [
                        {
                            "attachmentType": "Attachment",
                            "required": true,
                            "requiredType": "Always"
                        },
                ],
                "answers": [
                        {
                            "value": "Yes",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "No",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                "subQuestions": [],
                "qcontent": "Is the entrance to the store tidy and unobstructed?"
            },
                        {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "Radio Button",
                "attachments": [
                        {
                            "attachmentType": "Photo",
                            "required": false,
                            "requiredType": "Always"
                        },
                ],
                "answers": [
                        {
                            "value": "Yes",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "No",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                "subQuestions": [],
                "qcontent": "Is the store entrance clean and free from unobstructions?"
            },
            {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "Checkbox",
                "attachments": [],
                "answers": [
                        {
                            "value": "Wet Floor",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Blocked Aisle",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Improper Storage",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Others",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": true,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                "subQuestions": [],
                "qcontent": "Which safety hazard did you observed?"
            },
            {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "User Input",
                "inputType": "Numeric",
                "attachments": [
                       {
                            "attachmentType": "Photo",
                            "required": true,
                            "requiredType": "Always"
                        },
                ],
                "answers": [],
                "subQuestions": [],
                "qcontent": "Enter the current freezer temprature (°F)?"
            },
            {
                    "questionId": 891736,
                    "parentQuestionId": 891734,
                    "index": "1.4.",
                    "questionTypeId": 6,
                    "questionType": "User Input",
                    "inputType": "Date & Time",
                    "attachments": [],
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "What date and time was the delivery received?"
                },
                {
                    "questionId": 891738,
                    "parentQuestionId": 891734,
                    "index": "1.5.",
                    "questionTypeId": 6,
                    "questionType": "User Input",
                    "inputType": "Date",
                    "attachments": [],
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "What date was cleaning completed?"
                },
                {
                    "questionId": 891738,
                    "parentQuestionId": 891734,
                    "index": "1.5.",
                    "questionTypeId": 6,
                    "questionType": "Long User Input",
                    "attachments": [],
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "Provide details of any incidents that occured during your shift"
                },
                {
                    "questionId": 891738,
                    "parentQuestionId": 891734,
                    "index": "1.5.",
                    "questionTypeId": 6,
                    "questionType": "Label",
                    "attachments": [],
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "Check the expiration dates on dairy products",
                    "tags": ["Answer 1 Content"]
                },
            {
            "questionId": 891734,
            "parentQuestionId": 0,
            "index": "1.",
            "questionTypeId": 1,
            "questionType": "Title",
            "attachments": [],
            "answers": [],
            "subQuestions": [
                {
                    "questionId": 891735,
                    "parentQuestionId": 891734,
                    "index": "1.2.",
                    "questionTypeId": 6,
                    "questionType": "Radio Button",
                    "attachments": [
                        {
                            "attachmentType": "Attachment",
                            "required": true,
                            "requiredType": "In compliance only"
                        }
                    ],
                    "answers": [
                        {
                            "value": "Very Clean",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "Clean",
                            "score": "0",
                            "isCompliant": true,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                    "subQuestions": [],
                    "qcontent": "How clean is the floor?"
                },
                {
                    "questionId": 891735,
                    "parentQuestionId": 891734,
                    "index": "1.2.",
                    "questionTypeId": 6,
                    "questionType": "Radio Button",
                    "attachments": [],
                    "answers": [
                        {
                            "value": "Yes",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "No",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                    "subQuestions": [],
                    "qcontent": "All knifes and blades stored properly?"
                }
            ],
            "qcontent": "Bakery"
        },
          {
                    "questionId": 891735,
                    "parentQuestionId": 891734,
                    "index": "1.2.",
                    "questionTypeId": 6,
                    "questionType": "Dropdown",
                    "attachments": [
                         {
                            "attachmentType": "Barcode",
                            "required": true,
                            "requiredType": "In compliance only"
                        },
                    ],
                    "answers": [
                        {
                            "value": "Yes",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "No",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": true,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                    "subQuestions": [],
                    "qcontent": "Scan the UPC of the item to confirm pricing."
         }
                ],
                "qcontent": "userinput test",
            },
    }
}

export const templateGridPreview = {
    "data": {
        "templateId": 2190,
        "templateName": "Grid Example",
        "templateBaseType": "GRID",
        "questionsPreview": null,
        "gridsPreview": {
            "columns": [
                {
                    "questionId": 33408,
                    "parentQuestionId": 33406,
                    "index": "2.",
                    "questionTypeId": 1,
                    "questionTypeDescription": "Title",
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "Data Point 1"
                },
                {
                    "questionId": 33409,
                    "parentQuestionId": 33406,
                    "index": "3.",
                    "questionTypeId": 1,
                    "questionTypeDescription": "Title",
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "Data Point 2"
                },
                {
                    "questionId": 33407,
                    "parentQuestionId": 33406,
                    "index": "1.",
                    "questionTypeId": 1,
                    "questionTypeDescription": "Title",
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "Data Point 3"
                },
                {
                    "questionId": 33407,
                    "parentQuestionId": 33406,
                    "index": "1.",
                    "questionTypeId": 1,
                    "questionTypeDescription": "Title",
                    "answers": [],
                    "subQuestions": [],
                    "qcontent": "Data Point 4"
                }
            ],
            "rows": [
                    {
                    "questionId": 891737,
                    "parentQuestionId": 891734,
                    "index": "1.3.",
                    "questionTypeId": 6,
                    "questionType": "Dropdown",
                    "attachments": [
                            {
                                "attachmentType": "Temperature Probe",
                                "required": true,
                                "requiredType": "Out of compliance only"
                            },
                    ],
                    "answers": [
                        {
                            "value": "Yes",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "No",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": true,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                "subQuestions": [],
                "qcontent": "Choose the hot food item to check holding temperature."
                },
                {
                    "questionId": 891735,
                    "parentQuestionId": 891734,
                    "index": "1.2.",
                    "questionTypeId": 6,
                    "questionType": "Radio Button",
                    "attachments": [
                        {
                            "attachmentType": "Photo",
                            "required": true,
                            "requiredType": "Always"
                        },
                    ],
                    "answers": [
                        {
                            "value": "Yes",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": false,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                        {
                            "value": "No",
                            "score": "0",
                            "isCompliant": false,
                            "additionalInfo": {
                                "required": true,
                                "additionalInfoFieldType": "Any"
                            }
                        },
                    ],
                    "subQuestions": [],
                    "qcontent": "How clean is the floor?"
                },
                {
                "questionId": 891737,
                "parentQuestionId": 891734,
                "index": "1.3.",
                "questionTypeId": 6,
                "questionType": "User Input",
                "inputType": "Numeric",
                "attachments": [
                       {
                            "attachmentType": "Photo",
                            "required": true,
                            "requiredType": "Always"
                        },
                ],
                "answers": [],
                "subQuestions": [],
                "qcontent": "Enter the current freezer temprature (°F)?"
            },
            ]
        }
    }
}