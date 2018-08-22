import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Class for setting fracs data for structured Images
 */
class StructuredFracsDataSetAction extends action {
    private _fracsDataSource: enums.FracsDataSetActionSource;

    /**
     * Initializing a new instance of set fracs data for structured images
     */
    constructor(source: enums.FracsDataSetActionSource) {
        super(action.Source.View, actionType.STRUCTURED_FRACS_DATA_SET);
        this.auditLog.logContent = this.auditLog.logContent;
        this._fracsDataSource = source;
    }

    /**
     * This will return the source of fracs data set action.
     */
    public get fracsDataSource(): enums.FracsDataSetActionSource {
        return this._fracsDataSource;
    }
}
export = StructuredFracsDataSetAction;
