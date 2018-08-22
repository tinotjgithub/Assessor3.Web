import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class DeleteCommentAction extends action {

    /**
     * Initializing a new instance for both deleting and showing deleting dialog.
     * @param {boolean} isDelete
     */
    constructor(isDelete: boolean) {
    // this action used for both Deleting the comment and 
    // displaying confirmation dialog for deletion
        if (isDelete) {
        // this action type is used for deletion
            super(action.Source.View, actionType.DELETE_COMMENT);
        } else {
        // this action type is used for displaying confirmation dialog
            super(action.Source.View, actionType.DELETE_COMMENT_POPUP);
        }
    }
}
export = DeleteCommentAction;
