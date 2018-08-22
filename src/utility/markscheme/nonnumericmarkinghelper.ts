import markingHelper = require('./markinghelper');
import markingHelperBase = require('./markinghelperbase');
import Immutable = require('immutable');

class NonNumericMarkingHelper extends markingHelperBase implements MarkingValidationHelper  {

    /**
     * Validating numeric marks.
     * @param {any} mark
     * @param {number} stepValue
     * @param {number[]} availableMarks
     * @returns
     */
    public validateMarks(mark: any, stepValue: number, availableMarks: Immutable.List<AllocatedMark>) : boolean {

        let isValid: boolean = false;
        let isValidNR: boolean = false;

        if (mark.toString() === '-' || mark.toString() === '') {
            return true;
        }

        // parseFloat function gives the result as 1 for value '1-'. So validate whether it is actually a number.
        if (!isNaN(mark.toString())) {
            //Check whether the entered character is in available marks
            isValid = this.isMatchAvailableMarks(parseFloat(mark.toString()).toString(), availableMarks);
        }

        if (isValid === true) {
            return isValid;
        } else {
            //Check whether the NR mark is entered
            isValidNR = this.validateNRMark(mark.toLowerCase());

            return isValidNR;
        }
    }

    /**
     * Format the mark string
     * @param {string} mark
     * @param {number} stepValue?
     * @returns
     */
    public formatMark(mark: string, availableMarks: Immutable.List<AllocatedMark>, stepValue?: number): AllocatedMark {

        let formattedMark: AllocatedMark = { displayMark: '-', valueMark: null };

        availableMarks.forEach((item: AllocatedMark) => {
            if (item.displayMark.toLowerCase() === mark.toLowerCase()) {
                formattedMark = {
                    displayMark: item.displayMark,
                    valueMark: item.valueMark
                };

                return formattedMark;
            }
        });
        return formattedMark;
    }

    /**
     * Find a match with the valid marks
     * @param {string} mark
     * @returns
     */
    protected isMatchAvailableMarks(mark: string, availableMarks: Immutable.List<AllocatedMark>): boolean {

        let isMatchFound: boolean = false;

        availableMarks.forEach((item: AllocatedMark) => {

            if ((item.displayMark.toString() === mark)
                || (mark.length < item.displayMark.length
                    && mark === item.displayMark.substr(0, mark.length))) {

                isMatchFound = true;
                return isMatchFound;
            }
        });

        return isMatchFound;
    }
}
export = NonNumericMarkingHelper;