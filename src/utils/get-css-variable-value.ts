/**
 * Utility to fetch the current value of a CSS variable from the DOM.
 *
 * @param varName - The CSS variable name (with the `--` prefix)
 *
 * @returns The computed value of the CSS variable as a trimmed string, or an empty string if not found.
 *
 * @example
 * // Example 1: Basic usage
 * const primaryColor = getCssVarValue('--color-primary');
 */
export default function getCssVarValue(varName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}
