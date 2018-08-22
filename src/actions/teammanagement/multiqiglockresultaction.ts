import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');

/**
 * Action class for retrieving Multi Qig Lock Result.
 */
class MultiQigLockResultAction extends action {

    private _multiLockResults: Immutable.List<MultiLockResult>;

    constructor(multiLockResults: Immutable.List<MultiLockResult>) {
        super(action.Source.View, actionType.MULTI_QIG_LOCK_RESULT);
        this._multiLockResults = multiLockResults;
    }

    /**
     * Returns Multi qig lock result
     */
    public get multiQigLockResult(): Immutable.List<MultiLockResult> {
        return this._multiLockResults;
    }
}

export = MultiQigLockResultAction;
