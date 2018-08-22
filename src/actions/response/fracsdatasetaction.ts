import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for setting fracs data.
 */
class FracsDataSetAction extends dataRetrievalAction {
    // private variable for holding fracs data.
    private _fracsData: FracsData;

    private _triggerScrollEvent: boolean = false;

    private _structuredFracsDataLoaded: boolean = false;

    private _fracsDataSource: enums.FracsDataSetActionSource = enums.FracsDataSetActionSource.None;

    /**
     * Constructor FracsDataSetAction
     * @param success
     * @param fracsData
     */
    constructor(success: boolean, fracsData: FracsData, triggerScrollEvent: boolean = false, structuredFracsDataLoaded: boolean = false,
        fracsDataSource: enums.FracsDataSetActionSource) {
        super(action.Source.View, actionType.FRACS_DATA_SET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._fracsData = fracsData;
        this._triggerScrollEvent = triggerScrollEvent;
        this._structuredFracsDataLoaded = structuredFracsDataLoaded;
        this._fracsDataSource = fracsDataSource;
    }

    /**
     * This will return the fracs data.
     */
    public get fracsData(): FracsData {
        return this._fracsData;
    }

    public get triggerScrollEvent() {
        return this._triggerScrollEvent;
    }

    public get structuredFracsDataLoaded() {
        return this._structuredFracsDataLoaded;
    }

    /**
     * This will return the source of fracs data set action
     */
    public get fracsDataSource(): enums.FracsDataSetActionSource {
        return this._fracsDataSource;
    }
}

export = FracsDataSetAction;