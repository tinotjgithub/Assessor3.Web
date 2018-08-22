import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');

class UpdateSeenAnnotationAction extends action {
    private _isAllPagesAnnotated: boolean;
    private _treeViewItem: any;

    /**
     * Constructor
     * @param isAllPagesAnnotated
     * @param treeViewItem
     */
    constructor(isAllPagesAnnotated: boolean, treeViewItem: any) {
        super(action.Source.View, actionType.UPDATE_SEEN_ANNOTATION);
        this._isAllPagesAnnotated = isAllPagesAnnotated;
        this._treeViewItem = treeViewItem;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isAllPagesAnnotated}/g, isAllPagesAnnotated.toString());
    }

    /**
     * Check if all pages of the response are annotated.
     */
    public get isAllPagesAnnotated(): boolean {
        return this._isAllPagesAnnotated;
    }

    /*
     * get tree view item 
     */
    public get getTreeViewItem(): any {
        return this._treeViewItem;
    }
}

export = UpdateSeenAnnotationAction;