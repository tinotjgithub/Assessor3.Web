"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for updating all files viewed status
 */
var UpdateAllFilesViewedStatusAction = (function (_super) {
    __extends(UpdateAllFilesViewedStatusAction, _super);
    /**
     * constructor
     */
    function UpdateAllFilesViewedStatusAction() {
        _super.call(this, action.Source.View, actionType.UPDATE_ALL_FILES_VIEWED_STATUS);
    }
    return UpdateAllFilesViewedStatusAction;
}(action));
module.exports = UpdateAllFilesViewedStatusAction;
//# sourceMappingURL=updateallfilesviewedstatusaction.js.map