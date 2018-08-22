import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');
import markChangeDetails = require('./markchangedetails');
/**
 * The Action class to save mark.
 */
class SaveMarkAction extends action {
    /* The mark details that is getting saved*/
    private markDetails: markChangeDetails;

    /* flag to indicate that the mark updated and the selected item is not changed.
     * so we need to rerender the mark buttons to reflect the change */
    private _isMarkUpdatedWithoutNavigation: boolean;

    /* flag to indicate next response should be opened after save */
    private _isNextResponse: boolean;

    /* flag to indicate whether it is a usedintotal update only */
    private _isUpdateUsedInTotalOnly: boolean;

    /* flag to indicate whether to update marking progress */
    private _isUpdateMarkingProgress: boolean;

    /**
     * Initializing a new instance of save mark action.
     * @param saveMarkDetails
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse - - flag is to indicate next response should be opened after save
     * @param isUpdateUsedInTotalOnly - flag to indicate whether it is a usedintotal update only.
     */
    constructor(saveMarkDetails: markChangeDetails, isMarkUpdatedWithoutNavigation: boolean,
        isNextResponse: boolean, isUpdateUsedInTotalOnly: boolean, isUpdateMarkingProgress: boolean) {

        super(action.Source.View, actionType.SAVE_MARK);

        this.markDetails = saveMarkDetails;
        this._isMarkUpdatedWithoutNavigation = isMarkUpdatedWithoutNavigation;
        this._isNextResponse = isNextResponse;
        this._isUpdateUsedInTotalOnly = isUpdateUsedInTotalOnly;
        this._isUpdateMarkingProgress = isUpdateMarkingProgress;

        this.auditLog.logContent = this.auditLog.logContent.replace(/{mark}/g, saveMarkDetails.mark.displayMark).
            replace(/{markSchemeId}/g, saveMarkDetails.markSchemeId.toString()).
            replace(/{markingOperation}/g, saveMarkDetails.markingOperation.toString()).
            replace(/{isDirty}/g, saveMarkDetails.isDirty.toString()).
            replace(/{candidateScriptId}/g, saveMarkDetails.candidateScriptId.toString()).
            replace(/{markingProgress}/g, saveMarkDetails.markingProgress.toString()).
            replace(/{totalMark}/g, saveMarkDetails.totalMark.toString()).
            replace(/{totalMarkedMarkSchemes}/g, saveMarkDetails.totalMarkedMarkSchemes.toString()).
            replace(/{isAllNR}/g, saveMarkDetails.isAllNR.toString());
    }

    /**
     * Get the save mark details
     */
    public get saveMarkDetails(): markChangeDetails {
        return this.markDetails;
    }

    /**
     * Get if mark updated without navigation
     */
    public get isMarkUpdatedWithoutNavigation(): boolean {
        return this._isMarkUpdatedWithoutNavigation;
    }

    /**
     * Get to indicate next response need to be opened after save
     */
    public get isNextResponse(): boolean {
        return this._isNextResponse;
    }

    /**
     * Gets the flag to indicate whether it is a usedintotal update only.
     */
    public get isUpdateUsedInTotalOnly(): boolean {
        return this._isUpdateUsedInTotalOnly;
    }

    /**
     * Gets the flag to indicate whether to update marking progress.
     */
    public get isUpdateMarkingProgress(): boolean {
        return this._isUpdateMarkingProgress;
    }
}
export = SaveMarkAction;