

export type TreeViewNodeDataType = {
  tagId: number;
  tagName: string;
  tagType: string;
  tagSort: string | null;
  tagLevel: number;
  isPublic: boolean;
  isPrivate: boolean;
  isHidden: boolean;
  isNoShow: boolean;
  reportType: number | null;
  isExpanded: boolean | null;
  subLibrary: TreeViewNodeDataType[];
}

export type FolderTreeResponse = {
  success: boolean;
  message: string;
  data: TreeViewNodeDataType[];
}