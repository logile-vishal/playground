const baseURL = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
    templateLibrary : {
        getAllDirectories : `${baseURL}/tag-library/all`,
        getTemplateByTagId : `${baseURL}/tag-library/templates/{tagId}`,
        getReportByReportType: `${baseURL}/tag-library/reports/{reportType}`,
    }
}