"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
var loginSession = require('../../../../app/loginsession');
/**
 * This is a ReviewedBy comparer class and method
 */
var ReviewedByComparerDesc = (function () {
    function ReviewedByComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of ReviewedBy */
    ReviewedByComparerDesc.prototype.compare = function (a, b) {
        var userNameA = this.getUserName(a);
        var userNameB = this.getUserName(b);
        if (userNameA > userNameB) {
            return -1;
        }
        if (userNameA < userNameB) {
            return 1;
        }
        return 0;
    };
    /**
     * Get username
     * @param object
     * @returns UserName
     */
    ReviewedByComparerDesc.prototype.getUserName = function (a) {
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
    ReviewedByComparerDesc.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return ReviewedByComparerDesc;
}());
module.exports = ReviewedByComparerDesc;
//# sourceMappingURL=reviewedbycomparerdesc.js.map