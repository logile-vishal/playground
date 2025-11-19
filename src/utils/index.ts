
/**
 * Validates if a field has a valid value based on its type.
 * @param {any} field - The field to validate (string, array, object, or number)
 * @returns {boolean} True if the field is valid, false otherwise
 */
export const isFieldValid = (field) => {
    let isValid = true;
    if(field === undefined || field === null) {
      return false;
    }
    else if(typeof field === "string") {
      isValid = field!==undefined && field!==null && field?.trim()?.length > 0;
    }
    else if(Array.isArray(field)) {
      isValid = field.length > 0;
    }
    else if(typeof field === "object") {
      isValid = Object.keys(field).length > 0;
    }
    else if(typeof field === "number") {
      isValid = field!==undefined && field!==null;
    }

    return isValid;
}