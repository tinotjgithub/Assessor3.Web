"use strict";
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../../components/utility/enums');
/**
 * This is a Remark request comparer class and method
 */
var RemarkRequestComparer = (function () {
    function RemarkRequestComparer() {
        this.localeKey = 'generic.remark-types.long-names.';
    }
    /** Comparer to sort the remark request based on locale text */
    RemarkRequestComparer.prototype.compare = function (a, b) {
        var firstRemarkRequestType;
        var secondRemarkRequestType;
        if (a.remarkRequestType !== undefined) {
            firstRemarkRequestType = a.remarkRequestType;
            secondRemarkRequestType = b.remarkRequestType;
        }
        else {
            firstRemarkRequestType = a.remarkRequestTypeID;
            secondRemarkRequestType = b.remarkRequestTypeID;
        }
        if (this.getRemarkRequestLocaleText(firstRemarkRequestType) > this.getRemarkRequestLocaleText(secondRemarkRequestType)) {
            return 1;
        }
        if (this.getRemarkRequestLocaleText(firstRemarkRequestType) < this.getRemarkRequestLocaleText(secondRemarkRequestType)) {
            return -1;
        }
        return 0;
    };
    /**
     * Get remark request locale text
     * @param remarkRequestType
     */
    RemarkRequestComparer.prototype.getRemarkRequestLocaleText = function (remarkRequestType) {
        return localeStore.instance.TranslateText(this.localeKey + enums.RemarkRequestType[remarkRequestType]);
    };
    return RemarkRequestComparer;
}());
module.exports = RemarkRequestComparer;
//# sourceMappingURL=remarkrequesttypecomparer.js.map