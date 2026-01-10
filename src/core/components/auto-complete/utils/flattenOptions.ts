import type { AutoCompleteOptionProps } from "@/core/types/autocomplete.type";

export const flattenOptions = (
  options: AutoCompleteOptionProps[]
): AutoCompleteOptionProps[] => {
  const result: AutoCompleteOptionProps[] = [];
  options.forEach((opt) => {
    if (opt.options) {
      result.push(
        ...opt.options.map((child) => ({ ...child, groupLabel: opt.label }))
      );
    } else {
      result.push(opt);
    }
  });
  return result;
};
