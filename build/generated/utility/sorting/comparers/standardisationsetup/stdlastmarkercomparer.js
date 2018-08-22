"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
/**
 * This is a last marker comparer class and method
 */
var LastMarkerComparer = (function () {
    function LastMarkerComparer() {
    }
    /** Comparer to sort the work list in ascending order of last marker name */
    LastMarkerComparer.prototype.compare = function (a, b) {
        if (this.getFormattedName(a.lastMarkerInitials, a.lastMarkerSurname) >
            this.getFormattedName(b.lastMarkerInitials, b.lastMarkerSurname)) {
            return 1;
        }
        if (this.getFormattedName(a.lastMarkerInitials, a.lastMarkerSurname) <
            this.getFormattedName(b.lastMarkerInitials, b.lastMarkerSurname)) {
            return -1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    LastMarkerComparer.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return LastMarkerComparer;
}());
module.exports = LastMarkerComparer;
//# sourceMappingURL=stdlastmarkercomparer.js.map