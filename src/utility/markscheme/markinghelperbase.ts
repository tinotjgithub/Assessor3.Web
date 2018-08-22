import constants = require('../../components/utility/constants');

class MarkingHelperBase {

    /**
     * Find a match with the valid marks
     * @param {string} mark
     * @returns
     */
    protected isMatchAvailableMarks(mark: string, availableMarks: Immutable.List<AllocatedMark>): boolean {

        let isMatchFound: boolean = false;

        let length = availableMarks.count();
        availableMarks.forEach((item: AllocatedMark) => {

            if (parseFloat(item.displayMark.toString()) === parseFloat(mark)) {
                isMatchFound = true;
                return isMatchFound;
            }
        });

        return isMatchFound;
    }

    /**
     * Validating NR marks
     * @param {string} mark
     * @returns
     */
    protected validateNRMark(mark: string): boolean {

        if (mark.length > constants.NOT_ATTEMPTED.length) {
            return false;
        }

        // Validating whether NR has given using special keys.
        if (mark.indexOf('#') > -1 ||
            mark.indexOf('/') > -1) {
            return !(mark.toString().match(/^[#\/]$/) === null);
        }

        let isValid: boolean = true;
        for (let i = 0; i < mark.length; i++) {
            if (mark[i].toLowerCase() !== constants.NOT_ATTEMPTED[i].toLowerCase()) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }
}
export = MarkingHelperBase;