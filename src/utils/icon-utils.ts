import { oldTemplateIcons } from "@/core/constants/old-template-icons";

/**
  * @method stripVersionPrefix
  * @description strips version from icon name and convert it to lowercase eg: v15-Afternoon to afternoon
  * @param iconName original icon name
  * @returns string
*/
export const stripVersionPrefix = (iconName: string) => {
  return iconName?.replace(/^v\d+-/, "")?.toLowerCase();
};

/**
  * @method getOldTemplateIcon
  * @description get template icons from the icon mapping
  * @param iconName icon name
  * @returns React.LazyExoticComponent<React.FunctionComponent<React.SVGProps<SVGSVGElement>
*/
export const getOldTemplateIcon = (iconName: string) => {
  if (!iconName) return null;
  const timmedIconName = stripVersionPrefix(iconName);
  return oldTemplateIcons[timmedIconName];
};
