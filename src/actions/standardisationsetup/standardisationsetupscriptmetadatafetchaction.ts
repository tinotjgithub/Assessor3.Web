import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for StandardisationSetupScriptMetadataFetchAction 
 */
class StandardisationSetupScriptMetadataFetchAction extends action {

    private _markSchemeGroupId: number;
    private _questionPaperPartId: number;

    constructor(markSchemeGroupId: number, questionPaperPartId: number) {
        super(action.Source.View, actionType.STANDARDISATION_SETUP_SCRIPT_METADATA_FETCH_ACTION);
        this._markSchemeGroupId = markSchemeGroupId;
        this._questionPaperPartId = questionPaperPartId;
        this.auditLog.logContent = this.auditLog.logContent
            .replace(/{markSchemeGroupId}/g, markSchemeGroupId.toString())
            .replace(/{questionPaperPartId}/g, markSchemeGroupId.toString());
    }

    /**
     * gets markscheme group id.
     */
    public get getMarkschemeGroupId() {
        return this._markSchemeGroupId;
    }

    /**
     * gets question paper ID.
     */
    public get getQuestionPaperPartId() {
        return this._questionPaperPartId;
    }
}

export = StandardisationSetupScriptMetadataFetchAction;
