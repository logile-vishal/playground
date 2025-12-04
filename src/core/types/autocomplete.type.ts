export type AutoCompleteOptionProps = {
  label: string;
  value: string | number;
  options?: AutoCompleteOptionProps[] | undefined;
  groupLabel?: string;
};

export type AutocompleteProps = {
  id?: string;
  label: string;
  options: AutoCompleteOptionProps[];
  defaultValue?: AutoCompleteOptionProps[];
  value: AutoCompleteOptionProps[] | undefined;
  placeholder?: string;
  handleChange?: (selectedValues: AutoCompleteOptionProps[]) => void;
};
