import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');

/**
 * Action class for enhanced off-page comments visibility change
 * 
 * @class EnhancedOffPageCommentsVisibilityAction
 * @extends {action}
 */
class EnhancedOffPageCommentsVisibilityAction extends action {

    /**
     * local variable to hold visibility
     * 
     * @private
     * @type {boolean}
     * @memberof EnhancedOffPageCommentsVisibilityAction
     */
    private _isVisible: boolean;
    private _markSchemeToNavigate: treeViewItem;

    /**
     * Creates an instance of EnhancedOffPageCommentsVisibilityAction.
     * @param {boolean} isVisible 
     * @memberof EnhancedOffPageCommentsVisibilityAction
     */
    constructor(isVisible: boolean, markSchemeToNavigate: treeViewItem) {
        super(action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY);
        this.auditLog.logContent =
            this.auditLog.logContent.replace('{isVisible}', isVisible.toString());
        this._isVisible = isVisible;
        this._markSchemeToNavigate = markSchemeToNavigate;
    }

    /**
     * Returns isVisible value
     * @readonly
     * @type {boolean}
     * @memberof EnhancedOffPageCommentsVisibilityAction
     */
    public get isVisible(): boolean {
        return this._isVisible;
    }

    /**
     * Returns the the markscheme to navigate to if any.
     */
    public get markSchemeToNavigate(): treeViewItem {
        return this._markSchemeToNavigate;
    }
}

export = EnhancedOffPageCommentsVisibilityAction;
