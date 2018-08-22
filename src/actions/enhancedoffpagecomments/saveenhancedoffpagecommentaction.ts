import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');


/**
 * The Action class to save enhancedOffpage comments.
 */
class SaveEnhancedOffPageCommentAction extends action {

    private _enhancedOffPageClientTokens: Array<string>;
    private _markingOperation: enums.MarkingOperation;
    private _commentText: string;
    private _selectedMarkSchemeId: number;
    private _selectedFileId: number;

    constructor(enhancedOffPageClientTokensToBeDeleted: Array<string>, markingOperation: enums.MarkingOperation,
        commentText: string, selectedMarkSchemeId: number, selectedFileId: number) {
        super(action.Source.View, actionType.SAVE_ENHANCED_OFFPAGE_COMMENTS_ACTION);

        this._enhancedOffPageClientTokens = enhancedOffPageClientTokensToBeDeleted;
        this._markingOperation = markingOperation;
        this._commentText = commentText;
        this._selectedMarkSchemeId = selectedMarkSchemeId;
        this._selectedFileId = selectedFileId;

        // If the marking operation is none we dont have to log the action
        if (markingOperation !== enums.MarkingOperation.none) {
            let enhancedOffPageCommentsClientTokensString: string = '';
            this._enhancedOffPageClientTokens.forEach((item: string) => {
                enhancedOffPageCommentsClientTokensString = item + '|';
            });

            this.auditLog.logContent = this.auditLog.logContent.replace('{0}', enhancedOffPageCommentsClientTokensString
                .replace('{1}', this._markingOperation.toString())
                .replace('{2}', this._selectedMarkSchemeId ? this._selectedMarkSchemeId.toString() : '')
                .replace('{3}', this.selectedFileId ? this._selectedFileId.toString() : ''));
        }
    }

    /**
     * Get the enhanced off page comment details to save
     */
    public get enhancedOffPageClientTokensToBeDeleted(): Array<string> {
        return this._enhancedOffPageClientTokens;
    }

    /**
     * Get the marking operation which have to be saved
     */
    public get markingOperation(): enums.MarkingOperation {
        return this._markingOperation;
    }

    /**
     * Get the comment text
     */
    public get commentText(): string {
        return this._commentText;
    }

    /**
     * Get the selected markscheme id
     */
    public get selectedMarkSchemeId(): number {
        return this._selectedMarkSchemeId;
    }

    /**
     * Returns the selected file id
     */
    public get selectedFileId(): number {
        return this._selectedFileId;
    }
}

export = SaveEnhancedOffPageCommentAction;