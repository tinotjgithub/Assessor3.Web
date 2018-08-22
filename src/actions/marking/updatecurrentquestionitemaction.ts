import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import currentQuestionItemInfo = require('./currentquestioniteminfo');

/**
 * Class for UdateCurrentQuestionItem Action
 */
class UpdateCurrentQuestionItemAction extends dataRetrievalAction {
    /**
     * holds current question details
     */
    private _currentQuestionItemInfo: currentQuestionItemInfo;

    // Indicating whether the current markscheme changed/modifying the exists.
    private _isCurrentQuestionItemChanged: boolean;

    // Indicating whether markscheme is in initial loading(from worklist).
    private _forceUpdate: boolean;

    private _isAwardingMode: boolean;

    /**
     * @Constructor.
     * @param {boolean} success
     * @param {treeViewItem} node
     */
    constructor(success: boolean,
        selectedNodeInfo: currentQuestionItemInfo,
        isCurrentQuestionItemChanged: boolean,
        forceUpdate: boolean,
        isAwardingMode: boolean) {
        super(action.Source.View, actionType.UPDATE_SELECTED_QUESTION_ITEM, success);
        this._currentQuestionItemInfo = selectedNodeInfo;
        this._isCurrentQuestionItemChanged = isCurrentQuestionItemChanged;
        this._forceUpdate = forceUpdate;
        this._isAwardingMode = isAwardingMode;
    }

    /**
     * Returns the current question item.
     * @returns
     */
    public get currentQuestionInfo() {
        return this._currentQuestionItemInfo;
    }

    /**
     * Gets value indicating whether current markscheme has been changed.
     * @returns
     */
    public get isCurrentQuestionItemChanged(): boolean {
        return this._isCurrentQuestionItemChanged;
    }

    /**
     * Gets markscheme is loading status .
     */
    public get isForceUpdate(): boolean {
        return this._forceUpdate;
    }

    public get isAwardingMode(): boolean {
        return this._isAwardingMode;
    }
}

export = UpdateCurrentQuestionItemAction;
