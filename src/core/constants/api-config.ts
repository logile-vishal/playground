const baseURL = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
  user: {
    // User profile APIs
    getUserDetails: `${baseURL}/users`,
  },
  templateLibrary: {
    // Template Library APIs
    getAllDirectories: `${baseURL}/template-libraries`,
    getTemplateByTagId: `${baseURL}/template-libraries/tag-id/{tagId}/templates`,
    getReportByReportType: `${baseURL}/template-libraries/report-types/{reportTypeId}/reports`,
    getTaskTypes: `${baseURL}/template-libraries/advance/task-types`,
    getTaskTags: `${baseURL}/template-libraries/advance/task-tags`,
    getQuestionTags: `${baseURL}/template-libraries/advance/question-tags`,
    filterTemplates: `${baseURL}/template-libraries/advance/search/templates`,
    getTemplatePreviewById: `${baseURL}/template-libraries/template/{templateId}/templatePreview`,
    getReportPreviewById: `${baseURL}/template-libraries/template/{reportTypeId}/reportPreview`,
    deleteTemplateById: `${baseURL}/template-libraries/template/{templateId}`,
  },
};
