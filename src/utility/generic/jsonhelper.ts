/**
 * helper class with utility methods for formatting json and other js objects
 */
class JsonHelper {
    /**
     * convert the given object's keys into camel case
     * @param objectToConvert - The object of which the keys to be converted into camel case
     */
    public static toCamelCase(objectToConvert: any) {

        let newObject: any;
        let origKey: any;
        let newKey: any;
        let value: any;

        if (objectToConvert instanceof Array) {
            newObject = [];
            for (origKey in objectToConvert) {
                if (origKey) {
                    value = objectToConvert[origKey];
                    if (typeof value === 'object') {
                        value = JsonHelper.toCamelCase(value);
                    }
                    newObject.push(value);
                }
            }
        } else {
            newObject = {};
            for (origKey in objectToConvert) {
                if (objectToConvert.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                    value = objectToConvert[origKey];
                    if (value !== null && (value.constructor === Object || value.constructor === Array)) {
                        value = JsonHelper.toCamelCase(value);
                    }
                    newObject[newKey] = value;
                }
            }
        }
        return newObject;
    }
}

export = JsonHelper;