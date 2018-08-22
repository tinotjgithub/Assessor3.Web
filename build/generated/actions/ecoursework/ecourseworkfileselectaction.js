"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for getting the selected courseworkfile
 */
var EcourseworkFileSelectAction = (function (_super) {
    __extends(EcourseworkFileSelectAction, _super);
    /**
     * constructor
     * @param success
     * @param selected
     */
    function EcourseworkFileSelectAction(selectedECourseWorkFile, doAutoPlay, doSetIndexes, isInFullResponseView) {
        _super.call(this, action.Source.View, actionType.ECOURSEWORK_FILE_SELECT_ACTION);
        this.auditLog.logContent =
            this.auditLog.logContent.replace('{docstorePageID}', selectedECourseWorkFile.docPageID.toString());
        this._selectedECourseWorkFile = selectedECourseWorkFile;
        this._doAutoPlay = doAutoPlay;
        this._doSetIndexes = doSetIndexes;
        this._isInFullResponseView = isInFullResponseView;
    }
    Object.defineProperty(EcourseworkFileSelectAction.prototype, "selectedECourseWorkFile", {
        /**
         * return selected  ECoursework File
         */
        get: function () {
            return this._selectedECourseWorkFile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcourseworkFileSelectAction.prototype, "doAutoPlay", {
        /**
         * return the auto play status of media player
         */
        get: function () {
            return this._doAutoPlay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcourseworkFileSelectAction.prototype, "doSetIndexes", {
        /**
         * return the reset status of file list indexes
         */
        get: function () {
            return this._doSetIndexes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcourseworkFileSelectAction.prototype, "isInFullResponseView", {
        /**
         * return whether in full response view
         */
        get: function () {
            return this._isInFullResponseView;
        },
        enumerable: true,
        configurable: true
    });
    return EcourseworkFileSelectAction;
}(action));
module.exports = EcourseworkFileSelectAction;
//# sourceMappingURL=ecourseworkfileselectaction.js.map