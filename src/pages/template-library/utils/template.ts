import type { DirectoryType } from "@/core/types/tree-view.type";

export const getTargetDirectoryIdTrail = (
  directoryList: DirectoryType[],
  directoryId: number
): number[] => {
  const expandedIds: number[] = [];
  directoryList.forEach((dir) => {
    if (dir.libraryId === directoryId) {
      expandedIds.push(dir.libraryId);
    }
    if (dir.subLibrary) {
      const ids = getTargetDirectoryIdTrail(dir.subLibrary, directoryId);
      if (ids.length > 0) {
        expandedIds.push(...ids);
        expandedIds.push(dir.libraryId);
      }
    }
  });
  return expandedIds;
};
export const findDirectoryById = (
  directoryList: DirectoryType[],
  directoryId: number
): DirectoryType | null => {
  for (const dir of directoryList) {
    if (dir.libraryId === directoryId) {
      return dir;
    }
    if (dir.subLibrary) {
      const foundDir = findDirectoryById(dir.subLibrary, directoryId);
      if (foundDir) {
        return foundDir;
      }
    }
  }
  return null;
};
