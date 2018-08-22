import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import immutable = require('immutable');

/**
 * class for annotation tooltip set action against markSchemeIds
 */
class AnnotationToolTipSetAction extends dataRetrievalAction {
    /**
     * dictionary of tooltips with markschemeId key
     */
    private _toolTipInfo: immutable.Map<number, MarkSchemeInfo>;

    /**
     * @Constructor.
     * @param {boolean} success
     * @param {any} tooltipInfo
     */
    constructor(success: boolean, tooltipInfo: immutable.Map<number, MarkSchemeInfo>) {
        super(action.Source.View, actionType.SET_ANNOTATION_TOOLTIPS, success);
        this._toolTipInfo = tooltipInfo;
    }

    /**
     * Returns the annotation tooltip dictionary
     * @returns
     */
    public get toolTipInfo() : immutable.Map<number, MarkSchemeInfo> {
        return this._toolTipInfo;
    }
}

export = AnnotationToolTipSetAction;
