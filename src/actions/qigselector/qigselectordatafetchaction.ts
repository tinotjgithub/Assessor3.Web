import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import overviewData = require('../../stores/qigselector/typings/overviewdata');

class QigSelectorDataFetchAction extends dataRetrievalAction {
    private qigOverviewData: overviewData;
    private qigToBeFetched: number;
    private _isDataForTheLoggedInUser: boolean;
    private _isDataFromSearch: boolean;
    private _isDataFromHistory: boolean;
    private _isFromLocksInPopUp: boolean;
    private _doEmit: boolean;
    private _isFromMultiQigDropDown: boolean;

    /**
     * Constructor of QigSelectorDataFetchAction
     * @param success
     * @param qigToBeFetched
     * @param isDataForTheLoggedInUser
     * @param json
     * @param isFromSearch
     * @param isFromHistory
     * @param doEmit
     */
    constructor(success: boolean, qigToBeFetched: number,
        isDataForTheLoggedInUser: boolean,
        json: overviewData,
        isFromSearch: boolean,
        isFromHistory: boolean,
        isFromLocksInPopUp: boolean,
        doEmit: boolean,
        isFromMultiQigDropDown: boolean) {
        super(action.Source.View, actionType.QIGSELECTOR, success, json);

        // Setting the QIG Selector data
        this.qigOverviewData = json;

        // Setting the QIG ID of the QIG's whose data are to be fetched
        this.qigToBeFetched = qigToBeFetched;

        this._isDataForTheLoggedInUser = isDataForTheLoggedInUser;
        this._isDataFromSearch = isFromSearch;
        this._isDataFromHistory = isFromHistory;
        this._isFromLocksInPopUp = isFromLocksInPopUp;
        this._doEmit = doEmit;
        this._isFromMultiQigDropDown = isFromMultiQigDropDown;

        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    // Returns the data for the QIG Selector
    public get getOverviewData(): overviewData {
        return this.qigOverviewData;
    }

    // Returns the QIG ID of the QIG whose data are to be fetched
    public get getQigToBeFetched(): number {
        return this.qigToBeFetched;
    }

    // Returns flag that, the QIG data loaded for the logged in user or not
    public get isDataForTheLoggedInUser(): boolean {
        return this._isDataForTheLoggedInUser;
    }

    // Returns flag that, the QIG data loaded for from search
    public get isDataFromSearch(): boolean {
        return this._isDataFromSearch;
    }

    // Property represents that, the QIG data loaded from menu history
    public get isDataFromHistory(): boolean {
        return this._isDataFromHistory;
    }

    public get isFromLocksInPopUp(): boolean {
        return this._isFromLocksInPopUp;
    }

    // Returns true if event to be emitted
    public get doEmit(): boolean {
        return this._doEmit;
    }

    // Returns true if this event is from multiqig drop down
    public get isFromMultiQigDropDown(): boolean {
        return this._isFromMultiQigDropDown;
    }
}

export = QigSelectorDataFetchAction;
