"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for display file name
 */
var DisplayFileNameAction = (function (_super) {
    __extends(DisplayFileNameAction, _super);
    /**
     * Constructor for Display File Name Action
     * @param {string} fileName
     */
    function DisplayFileNameAction(fileName) {
        _super.call(this, action.Source.View, actionType.DISPLAY_FILE_NAME_ACTION);
        this._fileName = fileName;
    }
    Object.defineProperty(DisplayFileNameAction.prototype, "fileName", {
        /**
         * Returns file name of selected file
         * @returns
         */
        get: function () {
            return this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    return DisplayFileNameAction;
}(action));
module.exports = DisplayFileNameAction;
//# sourceMappingURL=filenamedisplayaction.js.map