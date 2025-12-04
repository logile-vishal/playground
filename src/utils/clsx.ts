/**
 *
 * @method clsx - utility to conditionally join classNames
 * @param classes - object with key as classname and values as boolean
 * @returns a single string with all the classes based on below rules:
 * - if the value is an object, only the keys with truthy values are included
 *
 * Example usage:
 * clsx( { 'class2': true, 'class3': false }) // returns 'class2'
 */

export default function clsx(classes: Record<string, boolean>): string {
  return Object.keys(classes)
    .filter((key) => classes[key])
    .join(" ");
}
