"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * The class holds user profile information.
 * @param {boolean} success
 */
var MarkerInformationAction = (function (_super) {
    __extends(MarkerInformationAction, _super);
    /**
     * Initializing a new instance of marker information action.
     * @param {boolean} success
     */
    function MarkerInformationAction(success, profileInfo) {
        _super.call(this, action.Source.View, actionType.MARKERINFO, success);
        this.markerInfo = profileInfo;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(MarkerInformationAction.prototype, "markerInformation", {
        /**
         * Gets the marker's profile information.
         * @returns The profile information.
         */
        get: function () {
            return this.markerInfo;
        },
        enumerable: true,
        configurable: true
    });
    return MarkerInformationAction;
}(dataRetrievalAction));
module.exports = MarkerInformationAction;
//# sourceMappingURL=markerinformationaction.js.map