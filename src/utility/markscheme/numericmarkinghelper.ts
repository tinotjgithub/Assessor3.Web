import markingHelper = require('./markinghelper');
import markingHelperBase = require('./markinghelperbase');
import markSchemeHelper = require('./markschemehelper');

class NumericMarkingHelper extends markingHelperBase implements MarkingValidationHelper {

    // Indicating NR mark.
    private NR: string = 'nr';

    private markSchemeHelper = new markSchemeHelper();

    /**
     * Validating numeric marks.
     * @param {any} mark
     * @param {number} stepValue
     * @param {number[]} availableMarks
     * @returns
     */
    public validateMarks(mark: any, stepValue: number, availableMarks: Immutable.List<AllocatedMark>): boolean {

        let isValid: boolean = false;

        if (mark.toString() === '-' || mark.toString() === '') {
            return true;
        }

        // (1) validating whole numbers
        // (2) validating decimel numbers
        // (3) validating NR mark.
        if (mark.toString().match(/^-?\d+$/) != null) {
            isValid = this.isMatchAvailableMarks(this.formatMark(mark.toString(), availableMarks, stepValue).displayMark, availableMarks);
        } else if (mark.toString().match(/^-?\d+\.\d{0,2}$/) != null) {

            if (stepValue.toString().length > 2) {
                isValid = this.isMatchAvailableMarks(parseFloat(mark.toString()).toString(), availableMarks);
            } else {

                // Handle when the use has tried to input decimal number for a whole response marking
                // show the error popup.
                isValid = false;
            }
        } else if (mark.toString().match(/^[a-zA-Z0-9#\/]+$/) != null) {
            // Check whether the mark is NR only if NR marks is allowed for the item
            if (this.markSchemeHelper.isAllowNRDefinedForTheMarkScheme) {
                isValid = this.validateNRMark(mark.toLowerCase());
            }
        }
        return isValid;
    }

    /**
     * Format the mark string
     * @param {string} mark
     * @param {number} stepValue?
     * @returns
     */
    public formatMark(mark: string, availableMarks: Immutable.List<AllocatedMark>, stepValue?: number): AllocatedMark {

        if (stepValue === null || stepValue === undefined) {

            return {
                displayMark: '-',
                valueMark: null
            };
        }

        let result: string = '-';

        switch (stepValue.toString().length) {
            case 1:
            case 2:
                /* 1 or 10 */
                result = parseFloat(mark).toFixed(0).toString();
                break;

            case 3:
                /* 0.1 or 0.5 */
                result = parseFloat(mark).toFixed(1).toString();
                break;
            default:
                /* especially 0.25 or 0.01, but anything else too: show max precision */
                result = parseFloat(mark).toFixed(2).toString();
                break;
        }

        return {
            displayMark: result,
            valueMark: null
        };
    }
}
export = NumericMarkingHelper;