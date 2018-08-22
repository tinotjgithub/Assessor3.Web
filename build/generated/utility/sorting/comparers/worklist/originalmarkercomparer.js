"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
/**
 * This is a Original marker comparer class and method
 */
var OriginalMarkerComparer = (function () {
    function OriginalMarkerComparer() {
    }
    /** Comparer to sort the work list in ascending order of Original marker name */
    OriginalMarkerComparer.prototype.compare = function (a, b) {
        if (this.getFormattedName(a.originalMarkerInitials, a.originalMarkerSurname) >
            this.getFormattedName(b.originalMarkerInitials, b.originalMarkerSurname)) {
            return 1;
        }
        if (this.getFormattedName(a.originalMarkerInitials, a.originalMarkerSurname) <
            this.getFormattedName(b.originalMarkerInitials, b.originalMarkerSurname)) {
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
    OriginalMarkerComparer.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return OriginalMarkerComparer;
}());
module.exports = OriginalMarkerComparer;
//# sourceMappingURL=originalmarkercomparer.js.map