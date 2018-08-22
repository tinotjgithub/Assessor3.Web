"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var DownloadApplicationModuleAction = (function (_super) {
    __extends(DownloadApplicationModuleAction, _super);
    /**
     * Initialize a new instance of DownloadApplicationModule.
     * @param {string} moduleName
     */
    function DownloadApplicationModuleAction(moduleName) {
        _super.call(this, action.Source.View, actionType.DOWNLOAD_APPLICATION_MODULE_ACTION);
        this._moduleName = moduleName;
    }
    Object.defineProperty(DownloadApplicationModuleAction.prototype, "moduleName", {
        /**
         * Gets a value indicating the module name
         * @returns
         */
        get: function () {
            return this._moduleName;
        },
        enumerable: true,
        configurable: true
    });
    return DownloadApplicationModuleAction;
}(action));
module.exports = DownloadApplicationModuleAction;
//# sourceMappingURL=downloadapplicationmoduleaction.js.map