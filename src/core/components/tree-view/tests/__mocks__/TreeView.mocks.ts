import type { TreeViewNodeDataType } from "@/core/types/tree-view.type";
import { vi } from "vitest";

export const mockTreeNodeSimple: TreeViewNodeDataType = {
  tagId: 1,
  tagName: "Root Folder",
  tagType: "folder",
  tagSort: null,
  tagLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportType: null,
  isExpanded: false,
  subLibrary: [],
};

export const mockTreeNodeWithChildren: TreeViewNodeDataType = {
  tagId: 2,
  tagName: "Parent Folder",
  tagType: "folder",
  tagSort: "alphabetical",
  tagLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportType: null,
  isExpanded: true,
  subLibrary: [
    {
      tagId: 3,
      tagName: "Child Folder 1",
      tagType: "folder",
      tagSort: null,
      tagLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportType: null,
      isExpanded: false,
      subLibrary: [],
    },
    {
      tagId: 4,
      tagName: "Child Folder 2",
      tagType: "folder",
      tagSort: null,
      tagLevel: 2,
      isPublic: false,
      isPrivate: true,
      isHidden: false,
      isNoShow: false,
      reportType: 1,
      isExpanded: false,
      subLibrary: [],
    },
  ],
};

export const mockTreeNodeDeeplyNested: TreeViewNodeDataType = {
  tagId: 5,
  tagName: "Level 1",
  tagType: "folder",
  tagSort: null,
  tagLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportType: null,
  isExpanded: true,
  subLibrary: [
    {
      tagId: 6,
      tagName: "Level 2",
      tagType: "folder",
      tagSort: null,
      tagLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportType: null,
      isExpanded: true,
      subLibrary: [
        {
          tagId: 7,
          tagName: "Level 3",
          tagType: "folder",
          tagSort: null,
          tagLevel: 3,
          isPublic: true,
          isPrivate: false,
          isHidden: false,
          isNoShow: false,
          reportType: null,
          isExpanded: false,
          subLibrary: [
            {
              tagId: 8,
              tagName: "Level 4",
              tagType: "file",
              tagSort: null,
              tagLevel: 4,
              isPublic: true,
              isPrivate: false,
              isHidden: false,
              isNoShow: false,
              reportType: 2,
              isExpanded: false,
              subLibrary: [],
            },
          ],
        },
      ],
    },
  ],
};

export const mockTreeNodeWithMixedExpansion: TreeViewNodeDataType = {
  tagId: 9,
  tagName: "Mixed Expansion Root",
  tagType: "folder",
  tagSort: null,
  tagLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportType: null,
  isExpanded: true,
  subLibrary: [
    {
      tagId: 10,
      tagName: "Expanded Child",
      tagType: "folder",
      tagSort: null,
      tagLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportType: null,
      isExpanded: true,
      subLibrary: [
        {
          tagId: 11,
          tagName: "Nested Expanded",
          tagType: "folder",
          tagSort: null,
          tagLevel: 3,
          isPublic: true,
          isPrivate: false,
          isHidden: false,
          isNoShow: false,
          reportType: null,
          isExpanded: true,
          subLibrary: [],
        },
      ],
    },
    {
      tagId: 12,
      tagName: "Collapsed Child",
      tagType: "folder",
      tagSort: null,
      tagLevel: 2,
      isPublic: true,
      isPrivate: false,
      isHidden: false,
      isNoShow: false,
      reportType: null,
      isExpanded: false,
      subLibrary: [
        {
          tagId: 13,
          tagName: "Hidden Nested",
          tagType: "folder",
          tagSort: null,
          tagLevel: 3,
          isPublic: true,
          isPrivate: false,
          isHidden: false,
          isNoShow: false,
          reportType: null,
          isExpanded: false,
          subLibrary: [],
        },
      ],
    },
  ],
};

export const mockTreeNodeWithLongName: TreeViewNodeDataType = {
  tagId: 14,
  tagName:
    "This is a very long folder name that should trigger text truncation functionality",
  tagType: "folder",
  tagSort: null,
  tagLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportType: null,
  isExpanded: false,
  subLibrary: [],
};

export const mockTreeNodeWithNullExpansion: TreeViewNodeDataType = {
  tagId: 15,
  tagName: "Null Expansion Node",
  tagType: "folder",
  tagSort: null,
  tagLevel: 1,
  isPublic: true,
  isPrivate: false,
  isHidden: false,
  isNoShow: false,
  reportType: null,
  isExpanded: null,
  subLibrary: [],
};

export const mockTreeData: TreeViewNodeDataType[] = [
  mockTreeNodeSimple,
  mockTreeNodeWithChildren,
];

export const mockTreeDataDeeplyNested: TreeViewNodeDataType[] = [
  mockTreeNodeDeeplyNested,
];

export const mockTreeDataEmpty: TreeViewNodeDataType[] = [];

export const mockTreeDataMultipleRoots: TreeViewNodeDataType[] = [
  mockTreeNodeSimple,
  mockTreeNodeWithChildren,
  mockTreeNodeDeeplyNested,
  mockTreeNodeWithMixedExpansion,
];

export const mockHandleClick = vi.fn();
export const mockSetSelectedData = vi.fn();
