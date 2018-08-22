import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class PopUpDisplayAction extends action {

    private _popUpType: enums.PopUpType;
    private _popUpActionType: enums.PopUpActionType;
    private _navigateFrom: enums.SaveAndNavigate;
    private _popUpData: PopUpData;
    private _actionFromCombinedPopup: boolean;
    private _navigateTo: enums.SaveAndNavigate;

    /**
     * Constructor
     * @param popUpType
     * @param popUpActionType
     * @param navigateFrom
     * @param popUpData
     */
    constructor(popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType,
        navigateFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none, popUpData: PopUpData,
        actionFromCombinedPopup: boolean = false,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none) {
        super(action.Source.View, actionType.POPUPDISPLAY_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{popUp}/g, popUpType.toString());

        this._popUpType = popUpType;
        this._popUpActionType = popUpActionType;
        this._navigateFrom = navigateFrom;
        this._popUpData = popUpData;
        this._actionFromCombinedPopup = actionFromCombinedPopup;
        this._navigateTo = navigateTo;
    }

    /**
     * get the popup type
     */
    public get getPopUpType(): enums.PopUpType {
        return this._popUpType;
    }

    /**
     * get the popup action type
     */
    public get getPopUpActionType(): enums.PopUpActionType {
        return this._popUpActionType;
    }

    /**
     * get the navigate from
     */
    public get navigateFrom(): enums.SaveAndNavigate {
        return this._navigateFrom;
    }

    /*
     * Get the details of popup.
     */
    public get getPopUpData(): PopUpData {
        return this._popUpData;
    }

    /**
     * get if the action is from combined warning message popup 
     */
    public get actionFromCombinedPopup() {
        return this._actionFromCombinedPopup;
    }

    /**
     * get the navigate to
     */
    public get navigateTo(): enums.SaveAndNavigate {
        return this._navigateTo;
    }
}

export = PopUpDisplayAction;