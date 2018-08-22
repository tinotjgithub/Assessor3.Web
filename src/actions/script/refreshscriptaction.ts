import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class RefreshScriptAction extends dataRetrievalAction {

    private candidateScriptId: number;
    private pageNo: number;
    private imageData: string;

    /**
     * Constructor RefreshScriptAction
     * @param userActionType
     * @param imageData
     */
    constructor(userActionType: string, imageData: string) {
        super(action.Source.View, userActionType, true);
        this.imageData = imageData;
    }
}
export = RefreshScriptAction;