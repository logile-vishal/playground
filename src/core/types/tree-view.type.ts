export type DirectoryType = {
  libraryId: number;
  libraryName: string;
  libraryType: string;
  librarySort: string | null;
  libraryLevel: number;
  isPublic: boolean;
  isPrivate: boolean;
  isHidden: boolean;
  isNoShow: boolean;
  reportLibraryId?: number | null;
  isExpanded: boolean | null;
  subLibrary: DirectoryType[];
};

export type FolderTreeResponse = {
  success: boolean;
  message: string;
  data: DirectoryType[];
};
