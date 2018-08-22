import comparerInterface = require('../../sortbase/comparerinterface');
import stringFormatHelper = require('../../../stringformat/stringformathelper');

/**
 * This is a last marker comparer class and method
 */
class LastMarkerComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in ascending order of last marker name */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        if (this.getFormattedName(a.lastMarkerInitials, a.lastMarkerSurname) >
            this.getFormattedName(b.lastMarkerInitials, b.lastMarkerSurname)) {
            return -1;
        }
        if (this.getFormattedName(a.lastMarkerInitials, a.lastMarkerSurname) <
            this.getFormattedName(b.lastMarkerInitials, b.lastMarkerSurname)) {
            return 1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    }

    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    private getFormattedName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);

        return formattedString;
    }
}

export = LastMarkerComparerDesc;