import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for container ImageId finding action.
 */
class FindVisibleImageIdAction extends action {

    private _doEmit: boolean = false;
    private _fracsDataSource: enums.FracsDataSetActionSource = enums.FracsDataSetActionSource.None;

    /**
     * Constructor FindVisibleImageIdAction
     * @param doEmit
     */
    constructor(doEmit: boolean, fracsDataSource: enums.FracsDataSetActionSource) {
        super(action.Source.View, actionType.FIND_VISIBLE_IMAGE_ID);
        this._doEmit = doEmit;
        this._fracsDataSource = fracsDataSource;
    }

    /**
     * This method will return if this action need to emit or not.
     */
    public get doEmit(): boolean {
        return this._doEmit;
    }

    /**
     * This method will return the source of fracs data set action.
     */
    public get fracsDataSource(): enums.FracsDataSetActionSource {
        return this._fracsDataSource;
    }
}

export = FindVisibleImageIdAction;