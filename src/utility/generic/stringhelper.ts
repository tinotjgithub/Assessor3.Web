/**
 * helper class with utilty methods for formatting strings
 */
class StringHelper {
    public static COMMA_SEPARATOR: string = ',';

   /**
    * returns a string which is formated using the replacement parameters. Similar to String.format in c#
    * @param stringArg - The string to be formated and which contains place holders.
    * @param replacements - Array of strings to be replaced by each place holders
    */
    public static format(stringArg: string, replacements: string[]): string {
        return stringArg.replace(/{(\d+)}/g, function (match: string, index: any) {
            return typeof replacements[index] !== 'undefined' ? replacements[index] : match;
        });
    }

    /**
     * Split string
     * @param stringArg
     * @param separator
     */
    public static split(stringArg: string, separator: string): string[] {
        return stringArg.split(separator);
    }
}

export = StringHelper;