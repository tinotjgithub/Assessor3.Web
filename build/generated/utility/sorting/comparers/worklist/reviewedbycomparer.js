"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
var loginSession = require('../../../../app/loginsession');
/**
 * This is ReviewedBy comparer class and method
 */
var ReviewedByComparer = (function () {
    function ReviewedByComparer() {
    }
    /** Comparer to sort the work list in ascending order of ReviewedBy */
    ReviewedByComparer.prototype.compare = function (a, b) {
        var userNameA = this.getUserName(a);
        var userNameB = this.getUserName(b);
        if (userNameA > userNameB) {
            return 1;
        }
        if (userNameA < userNameB) {
            return -1;
        }
        return 0;
    };
    /**
     * Get username
     * @param object
     * @returns UserName
     */
    ReviewedByComparer.prototype.getUserName = function (a) {
        if (a.reviewedById > 0) {
            if (loginSession.EXAMINER_ID === a.reviewedById) {
                return '0';
            }
            else {
                return this.getFormattedName(a.reviewedByInitials, a.reviewedBySurname);
            }
        }
        else {
            return ' ';
        }
    };
    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    ReviewedByComparer.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return ReviewedByComparer;
}());
module.exports = ReviewedByComparer;
//# sourceMappingURL=reviewedbycomparer.js.map