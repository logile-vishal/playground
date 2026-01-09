import type { WildCardLabelProps } from "../../WildcardLabel";

export const defaultWildcardLabelProps: WildCardLabelProps = {
  label: "This is a test label",
};

export const wildcardLabelWithWildcard: WildCardLabelProps = {
  label: "This is %task_name% label",
};

export const wildcardLabelWithMultipleWildcards: WildCardLabelProps = {
  label: "%task_name% test %template_name% multiple",
};

export const wildcardLabelOnlyWildcard: WildCardLabelProps = {
  label: "%task_name%",
};

export const wildcardLabelEmpty: WildCardLabelProps = {
  label: "",
};

export const wildcardLabelWithSpecialChars: WildCardLabelProps = {
  label: "Test !@#$%^&*() special",
};

export const wildcardLabelLongText: WildCardLabelProps = {
  label:
    "This is a very long text with %task_name% wildcard in the middle of a very long sentence",
};

export const wildcardLabelMultipleSpaces: WildCardLabelProps = {
  label: "Multiple   spaces   between   words",
};

export const wildcardLabelStartWithWildcard: WildCardLabelProps = {
  label: "%task_name% starts with wildcard",
};

export const wildcardLabelEndWithWildcard: WildCardLabelProps = {
  label: "Ends with wildcard %task_name%",
};

export const wildcardLabelWithTruncateTrue: WildCardLabelProps = {
  label: "This is a label with truncate",
  truncate: true,
};

export const wildcardLabelWithTruncateFalse: WildCardLabelProps = {
  label: "This is a label without truncate",
  truncate: false,
};
