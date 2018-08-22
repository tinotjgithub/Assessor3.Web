/**
 * Helper class for sorting of an array of any objects
 */
class ComparerHelper {
    /**
     * Comparer method to sort integer numbers in ascending order 
     */
    public static integerSort(a: number, b: number) {
        if (+a > +b) {
            return 1;
        }
        if (+a < +b) {
            return -1;
        }
        return 0;
    }

    /**
     * Comparer method to sort integer numbers in decending order 
     */
    public static integerSortDesc(a: number, b: number) {
        if (+a > +b) {
            return -1;
        }
        if (+a < +b) {
            return 1;
        }
        return 0;
    }

    /**
     * Comparer method to sort Strings in ascending order 
     */
    public static stringSort(a: string, b: string) {
        if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
        }
        if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        }
        return 0;
    }

    /**
     * Comparer method to sort Strings in decending order 
     */
    public static stringSortDesc(a: string, b: string) {
        if (a.toLowerCase() > b.toLowerCase()) {
            return -1;
        }
        if (a.toLowerCase() < b.toLowerCase()) {
            return 1;
        }
        return 0;
    }
}
export = ComparerHelper;