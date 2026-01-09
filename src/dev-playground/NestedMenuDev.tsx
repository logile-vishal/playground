import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";

import clsx from "@/utils/clsx";

const basicTagsSampleData = [
  {
    label: "Cleaning",
    value: "cleaning",
    parentAsItem: true,
    righticon: "arrowRightFill",
    subMenu: {
      width: "200px",

      items: [
        {
          label: "Floors",
          value: "cleaning_floors",
        },
        {
          label: "Sinks",
          value: "cleaning_sinks",
        },
        {
          label: "Shelves",
          value: "cleaning_shelves",
        },
        {
          label: "Displays",
          value: "cleaning_displays",
        },
      ],
    },
  },
  {
    label: "Cook",
    value: "cook",
    parentAsItem: true,
    customSubMenu: [],
    subMenu: {
      width: "200px",
      items: [
        {
          label: "Floors",
          value: "cleaning_floors",
        },
        {
          label: "Sinks",
          value: "cleaning_sinks",
        },
        {
          label: "Shelves",
          value: "cleaning_shelves",
        },
        {
          label: "Displays",
          value: "cleaning_displays",
        },
      ],
    },
  },
  {
    label: "Corrective Actions",
    value: "corrective_actions",
    customSubMenu: [],
  },
  {
    label: "Merchandising",
    value: "merchandising",
    customSubMenu: [],
  },
  {
    label: "Promotion",
    value: "promotion",
    customSubMenu: [],
  },
  {
    label: "Reports",
    value: "reports",
    customSubMenu: [],
  },
  {
    label: "Safety",
    value: "safety",
    customSubMenu: [],
  },
];

const NestedMenuDev = () => {
  return (
    <CMultiSelectWithChip
      name="tags"
      options={basicTagsSampleData}
      placeholder={"Tags"}
      onDelete={() => {}}
      onChange={() => {}}
      isInputVisible={false}
      className={clsx({
        "ct-basic-info__row-item-tags-dropdown": true,
      })}
      width="100%"
      menuWidth={"300px"}
    />
  );
};
export default NestedMenuDev;
