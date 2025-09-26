export interface DirectoryType {
  tagId: number;
  tagName: string;
  tagType: string;
  tagSort: string | number | null;
  tagLevel: number;
  isPublic: boolean;
  isPrivate: boolean;
  isHidden: boolean;
  isNoShow: boolean;
  reportType: number | string | null;
  isExpanded: boolean | null;
  children: DirectoryType[];
}

export interface TemplateType {
    templateId: number,
    tagId: number,
    templateName: string,
    tagType: string,
    status: string,
    createdTime: string,
    lastModifiedTime: string,
    iconName: string,
    iconColour: string,
}

export interface ReportType {
    templateId: number,
    displayTime: boolean,
    enabled?: null,
    level?: null,
    savedDate: string,
    savedUser: string,
    name: string,
    isPublic: boolean,
    createPosition: number,
    createOrgType: null,
    createOrg: number,
    isDashboard: boolean,
    showTmptNameInTitle: boolean
}
