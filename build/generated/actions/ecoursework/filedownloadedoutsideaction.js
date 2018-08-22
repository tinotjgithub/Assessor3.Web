"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for file downloaded outside action
 */
var FileDownloadedOutsideAction = (function (_super) {
    __extends(FileDownloadedOutsideAction, _super);
    /**
     * constructor
     */
    function FileDownloadedOutsideAction() {
        _super.call(this, action.Source.View, actionType.FILE_DOWNLOADED_OUTSIDE_ACTION);
    }
    return FileDownloadedOutsideAction;
}(action));
module.exports = FileDownloadedOutsideAction;
//# sourceMappingURL=filedownloadedoutsideaction.js.map