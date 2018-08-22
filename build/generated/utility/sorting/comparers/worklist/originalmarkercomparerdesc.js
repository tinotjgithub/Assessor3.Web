"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
/**
 * This is a Original marker comparer class and method
 */
var OriginalMarkerComparerDesc = (function () {
    function OriginalMarkerComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Original marker name */
    OriginalMarkerComparerDesc.prototype.compare = function (a, b) {
        if (this.getFormattedName(a.originalMarkerInitials, a.originalMarkerSurname) >
            this.getFormattedName(b.originalMarkerInitials, b.originalMarkerSurname)) {
            return -1;
        }
        if (this.getFormattedName(a.originalMarkerInitials, a.originalMarkerSurname) <
            this.getFormattedName(b.originalMarkerInitials, b.originalMarkerSurname)) {
            return 1;
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
    OriginalMarkerComparerDesc.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return OriginalMarkerComparerDesc;
}());
module.exports = OriginalMarkerComparerDesc;
//# sourceMappingURL=originalmarkercomparerdesc.js.map