import { oldTemplateIcons } from "@/core/constants/old-template-icons";

/**
  * @method stripVersionPrefix
  * @description strips version from icon name and convert it to lowercase eg: v15-Afternoon to afternoon
  * @param iconName original icon name
  * @returns string
*/
export const stripVersionPrefix = (iconName: string) => {
  return iconName?.trim()?.replace(/^v\d+-/i, "")?.toLowerCase();
};

/**
 * @method formatHexColor
 * @description Ensures that a given color value is in valid hex format by adding a leading "#" if it is missing (e.g., "fff", "#fff", "a1b2c3").
 * @param {string} iconColor - The input color value that may or may not start with "#".
 * @returns {string} A properly formatted hex color string beginning with "#".
*/
export const formatHexColor = (iconColor: string) => {
  if (!iconColor) return null;
  return iconColor?.trim()?.replace(/^#?/, '#');
} 

/**
  * @method getOldTemplateIcon
  * @description get template icons from the icon mapping
  * @param iconName icon name
  * @returns React.LazyExoticComponent<React.FunctionComponent<React.SVGProps<SVGSVGElement>
*/
export const getOldTemplateIcon = (iconName: string) => {
  if (!iconName) return null;
  return oldTemplateIcons[stripVersionPrefix(iconName)] ?? null;
};
