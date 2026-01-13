import type { DirectoryType } from "@/core/types/tree-view.type";
import { vi } from "vitest";

export const mockTreeNodeSimple: DirectoryType = {
  libraryId: 1,
  libraryName: "Root Folder",
  libraryType: "folder",
  librarySort: null,
  libraryLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportLibraryId: null,
  isExpanded: false,
  subLibrary: [],
};

export const mockTreeNodeWithChildren: DirectoryType = {
  libraryId: 2,
  libraryName: "Parent Folder",
  libraryType: "folder",
  librarySort: "alphabetical",
  libraryLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportLibraryId: null,
  isExpanded: true,
  subLibrary: [
    {
      libraryId: 3,
      libraryName: "Child Folder 1",
      libraryType: "folder",
      librarySort: null,
      libraryLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportLibraryId: null,
      isExpanded: false,
      subLibrary: [],
    },
    {
      libraryId: 4,
      libraryName: "Child Folder 2",
      libraryType: "folder",
      librarySort: null,
      libraryLevel: 2,
      isPublic: false,
      isPrivate: true,
      isHidden: false,
      isNoShow: false,
      reportLibraryId: 1,
      isExpanded: false,
      subLibrary: [],
    },
  ],
};

export const mockTreeNodeDeeplyNested: DirectoryType = {
  libraryId: 5,
  libraryName: "Level 1",
  libraryType: "folder",
  librarySort: null,
  libraryLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportLibraryId: null,
  isExpanded: true,
  subLibrary: [
    {
      libraryId: 6,
      libraryName: "Level 2",
      libraryType: "folder",
      librarySort: null,
      libraryLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportLibraryId: null,
      isExpanded: true,
      subLibrary: [
        {
          libraryId: 7,
          libraryName: "Level 3",
          libraryType: "folder",
          librarySort: null,
          libraryLevel: 3,
          isPublic: true,
          isPrivate: false,
          isHidden: false,
          isNoShow: false,
          reportLibraryId: null,
          isExpanded: false,
          subLibrary: [
            {
              libraryId: 8,
              libraryName: "Level 4",
              libraryType: "file",
              librarySort: null,
              libraryLevel: 4,
              isPublic: true,
              isPrivate: false,
              isHidden: false,
              isNoShow: false,
              reportLibraryId: 2,
              isExpanded: false,
              subLibrary: [],
            },
          ],
        },
      ],
    },
  ],
};

export const mockTreeNodeWithMixedExpansion: DirectoryType = {
  libraryId: 9,
  libraryName: "Mixed Expansion Root",
  libraryType: "folder",
  librarySort: null,
  libraryLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportLibraryId: null,
  isExpanded: true,
  subLibrary: [
    {
      libraryId: 10,
      libraryName: "Expanded Child",
      libraryType: "folder",
      librarySort: null,
      libraryLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportLibraryId: null,
      isExpanded: true,
      subLibrary: [
        {
          libraryId: 11,
          libraryName: "Nested Expanded",
          libraryType: "folder",
          librarySort: null,
          libraryLevel: 3,
          isPublic: true,
          isPrivate: false,
          isHidden: false,
          isNoShow: false,
          reportLibraryId: null,
          isExpanded: true,
          subLibrary: [],
        },
      ],
    },
    {
      libraryId: 12,
      libraryName: "Collapsed Child",
      libraryType: "folder",
      librarySort: null,
      libraryLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportLibraryId: null,
      isExpanded: false,
      subLibrary: [
        {
          libraryId: 13,
          libraryName: "Hidden Nested",
          libraryType: "folder",
          librarySort: null,
          libraryLevel: 3,
          isPublic: true,
          isPrivate: false,
          isHidden: false,
          isNoShow: false,
          reportLibraryId: null,
          isExpanded: false,
          subLibrary: [],
        },
      ],
    },
  ],
};

export const mockTreeNodeWithLongName: DirectoryType = {
  libraryId: 14,
  libraryName:
    "This is a very long folder name that should trigger text truncation functionality",
  libraryType: "folder",
  librarySort: null,
  libraryLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportLibraryId: null,
  isExpanded: false,
  subLibrary: [],
};

export const mockTreeNodeWithNullExpansion: DirectoryType = {
  libraryId: 15,
  libraryName: "Null Expansion Node",
  libraryType: "folder",
  librarySort: null,
  libraryLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportLibraryId: null,
  isExpanded: null,
  subLibrary: [],
};

export const mockTreeData: DirectoryType[] = [
  mockTreeNodeSimple,
  mockTreeNodeWithChildren,
];

export const mockTreeDataDeeplyNested: DirectoryType[] = [
  mockTreeNodeDeeplyNested,
];

export const mockTreeDataEmpty: DirectoryType[] = [];

export const mockTreeDataMultipleRoots: DirectoryType[] = [
  mockTreeNodeSimple,
  mockTreeNodeWithChildren,
  mockTreeNodeDeeplyNested,
  mockTreeNodeWithMixedExpansion,
];

export const mockHandleClick = vi.fn();
export const mockSetSelectedData = vi.fn();
