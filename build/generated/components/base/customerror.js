"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Class for custom error
 */
var CustomError = (function (_super) {
    __extends(CustomError, _super);
    /**
     * Constructor CustomError
     * @param module
     * @param message
     * @param header
     * @param showErrorIcon
     */
    function CustomError(moduleName, message, header, showErrorIcon) {
        _super.call(this, message);
        this.moduleName = moduleName;
        this.message = message;
        this.headerText = header;
        this.showErrorIcon = showErrorIcon;
    }
    return CustomError;
}(Error));
module.exports = CustomError;
//# sourceMappingURL=customerror.js.map