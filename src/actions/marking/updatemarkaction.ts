import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * The Action class for notifying mark updated event.
 */
class UpdateMarkAction extends dataRetrievalAction {

    private allocatedMark: AllocatedMark;

    /**
     * Initializing a new instance of mark updated action.
     * @param {string} mark
     * @param {boolean} success
     */
    constructor(allocatedMark: AllocatedMark, success: boolean) {
        super(action.Source.View, actionType.MARK_UPDATED, success);
        this.allocatedMark = allocatedMark;

        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.auditLog.logContent = this.auditLog.logContent.replace(/{mark}/g, this.allocatedMark.displayMark.toString());
    }

    /**
     * getting current mark of the selected item
     * @param {number} mark
     */
    public get currentMark(): AllocatedMark {
        return this.allocatedMark;
    }
}
export = UpdateMarkAction;