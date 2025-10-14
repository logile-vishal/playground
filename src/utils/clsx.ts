
/**
 * 
 * @param classes - array of strings or objects with boolean values 
 * @returns a single string with all the classes based on below rules:
 * - if the value is an object, only the keys with truthy values are included
 * Example usage:
 * clsx( { 'class2': true, 'class3': false }) // returns 'class2'
 */

export default function clsx(classes: {[key:string]:boolean}) { 
        if(typeof classes === 'object') {
            return Object.keys(classes).filter((key)=>classes[key]).join(' ');
        }else{
            throw Error("Input type invalid")
        }
    }