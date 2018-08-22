"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var DeleteCommentAction = (function (_super) {
    __extends(DeleteCommentAction, _super);
    /**
     * Initializing a new instance for both deleting and showing deleting dialog.
     * @param {boolean} isDelete
     */
    function DeleteCommentAction(isDelete) {
        // this action used for both Deleting the comment and 
        // displaying confirmation dialog for deletion
        if (isDelete) {
            // this action type is used for deletion
            _super.call(this, action.Source.View, actionType.DELETE_COMMENT);
        }
        else {
            // this action type is used for displaying confirmation dialog
            _super.call(this, action.Source.View, actionType.DELETE_COMMENT_POPUP);
        }
    }
    return DeleteCommentAction;
}(action));
module.exports = DeleteCommentAction;
//# sourceMappingURL=deletecommentaction.js.map