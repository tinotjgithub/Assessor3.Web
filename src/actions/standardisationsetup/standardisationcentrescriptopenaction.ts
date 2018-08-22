import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class StandardisationCentreScriptOpenAction extends action {
    private _selectedCandidateScriptId: number;
    private _scriptAvailable : boolean;
    /**
     * Constructor
     * @param candidateScriptId
     */
    constructor(candidateScriptId: number, scriptAvailable: boolean) {
        super(action.Source.View, actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN);
        this._selectedCandidateScriptId = candidateScriptId;
        this._scriptAvailable = scriptAvailable;
    }

    /**
     * returns the selected candidate script id.
     */
    public get selectedCandidateScriptId(): number {
        return this._selectedCandidateScriptId;
    }

    /**
     * get if the selected script is available or not.
     */
    public get scriptAvailable() : boolean {
        return this._scriptAvailable;
    }
}
export = StandardisationCentreScriptOpenAction;
