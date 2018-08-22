"use strict";
var WarningNR = (function () {
    function WarningNR() {
        this.allMarkedAsNR = false;
        this.atleastOneNRWithoutOptionality = false;
        this.atleastOneNRWithOptionalityUsedInTotal = false;
        this.atleastOneNRWithOptionalityNotUsedInTotal = false;
    }
    return WarningNR;
}());
module.exports = WarningNR;
//# sourceMappingURL=warningnr.js.map