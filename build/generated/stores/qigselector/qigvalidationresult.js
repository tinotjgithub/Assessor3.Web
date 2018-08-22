"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var qigValidationResultBase = require('./qigvalidationresultbase');
var QigValidationResult = (function (_super) {
    __extends(QigValidationResult, _super);
    function QigValidationResult() {
        _super.apply(this, arguments);
        this.isSimulationMode = false;
        this.isInStandardisationMode = false;
    }
    return QigValidationResult;
}(qigValidationResultBase));
module.exports = QigValidationResult;
//# sourceMappingURL=qigvalidationresult.js.map