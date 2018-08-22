import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import enums = require('../../components/utility/enums');
import getExceptionAction = require('../../actions/exception/getexceptionaction');
import exceptionHelper = require('../../components/utility/exception/exceptionhelper');
import exceptionTypeAction = require('../../actions/exception/exceptiontypeaction');
import exceptionWindowAction = require('../../actions/exception/exceptionwindowaction');
import raiseExceptionAction = require('../../actions/exception/raiseexceptionaction');
import popUpDisplayAction = require('../../actions/popupdisplay/popupdisplayaction');
import updateExceptionStatusAction = require('../../actions/exception/updateexceptionstatusaction');
import exceptionTypeScrollResetAction = require('../../actions/exception/exceptiontypescrollresetaction');
import responseOpenAction = require('../../actions/response/responseopenaction');
import actionExceptionPopupVisibilityAction = require('../../actions/exception/actionexceptionpopupvisibilityaction');
import showResponseNavigationFailureReasonAction = require('../../actions/marking/showresponsenavigationfailurereasonsaction');
import exceptionPanelClickedAction = require('./../../actions/exception/exceptionpanelclickedaction');
/**
 * Class for exception store.
 */
class ExceptionStore extends storeBase {
    //Emit when exceptions are retrived
    public static GET_EXCEPTIONS = 'getexceptionsforresponse';
    // Exception Panel Open Event
    public static OPEN_EXCEPTION_WINDOW = 'openexceptionwindow';
    // Exception Panel Close Event
    public static CLOSE_EXCEPTION_WINDOW = 'closeexceptionwindow';
    // Exception Panel Minimize Event
    public static MINIMIZE_EXCEPTION_WINDOW = 'minimizeexceptionwindow';
    // Exception Panel Maximize Event
    public static MAXIMIZE_EXCEPTION_WINDOW = 'maximizeexceptionwindow';
    // Raise Exception Event
    public static RAISE_EXCEPTION = 'raiseexception';
    // Exception Discard Popup Display Event
    public static EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT = 'exceptiondiscardpopupdisplayevent';
    // exception section navigate away event
    public static EXCEPTION_NAVIGATE_EVENT = 'exceptionnavigateevent';
    //close exception event
    public static CLOSE_EXCEPTION = 'closeexception';
    // Response Linked Exception
    public static GET_LINKED_EXCEPTIONS = 'linkedexceptionevent';
    // setting scroll for exception type list
    public static EXCEPTION_TYPE_SCROLL_RESET_ACTION = 'exceptiontypescrollresetaction';
    // setting to show action exception popup
    public static SHOW_ACTION_EXCEPTION_POPUP = 'showactionexceptionpopup';
    // setting update exception status received 
    public static UPDATE_EXCEPTION_STATUS_RECEIVED = 'updateexceptionstatusreceived';

    public static VIEW_EXCEPTION_WINDOW = 'viewexceptionwindow';

    //to set exception associated with a response
    private _exceptions: Immutable.List<ExceptionDetails> = undefined;
    //to set exception types
    private _exceptionTypes: Immutable.List<ExceptionTypeDetails>;
    /* Navigating from response to different view */
    private _navigatingFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none;
    /* Navigating to `different view */
    private _navigatingTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none;
    //exception panel view action
    private _exceptionViewAction: enums.ExceptionViewAction = enums.ExceptionViewAction.None;
    //exception panel previous view action
    private _previousExceptionViewAction: enums.ExceptionViewAction = enums.ExceptionViewAction.None;
    //Set triggerPoint
    private _responseOpenTriggerPoint: enums.TriggerPoint = enums.TriggerPoint.None;

    private _res: any;

    private _doNavigateResponse: boolean = false;

    private _navigateFrom: enums.ResponseNavigation;

    private _isExceptonSidePanelOpen: boolean;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.GET_EXCEPTION_ACTION:
                    this._exceptions = (action as getExceptionAction).exceptions;
                    let getLinkedExceptions: boolean = (action as getExceptionAction).getLinkedExceptions;
                    this.emit(ExceptionStore.GET_EXCEPTIONS);
                    if (this._responseOpenTriggerPoint === enums.TriggerPoint.WorkListResponseExceptionIcon || getLinkedExceptions) {
                        this._exceptions = this.getExceptionData;
                        let exceptionItemId: number = this.getFirstExceptionItemId;
                        if (exceptionItemId > 0) {
                            this.emit(ExceptionStore.GET_LINKED_EXCEPTIONS, exceptionItemId, this._exceptions.count());
                        }
                        this._responseOpenTriggerPoint = enums.TriggerPoint.None;
                    }
                    break;
                case actionType.GET_EXCEPTION_TYPE_ACTION:
                    this._exceptionTypes = (action as exceptionTypeAction).exceptionTypes;
                    break;
                case actionType.EXCEPTION_ACTION:
                    let exceptionId = (action as exceptionWindowAction).exceptionId;
                    this._previousExceptionViewAction = this.exceptionViewAction;
                    this._exceptionViewAction = (action as exceptionWindowAction).exceptionAction;
                    switch (this.exceptionViewAction) {
                        case enums.ExceptionViewAction.Open:
                            this._doNavigateResponse = false;
                            this.emit(ExceptionStore.OPEN_EXCEPTION_WINDOW, exceptionId);
                            break;
                        case enums.ExceptionViewAction.Close:
                            if (this._navigateFrom === enums.ResponseNavigation.markScheme) {
                                this._doNavigateResponse = true;
                            } else {
                                this._doNavigateResponse = false;
                            }
                            this.emit(ExceptionStore.CLOSE_EXCEPTION_WINDOW);
                            break;
                        case enums.ExceptionViewAction.NavigateAway:
                            // set the previous message view action in the case of navigate away
                            // we will check current message view action for showing discard message (open, minimised, maximised etc)
                            this._exceptionViewAction = this._previousExceptionViewAction;
                            let navigateTo: enums.SaveAndNavigate = (action as exceptionWindowAction).navigateTo;
                            this.emit(ExceptionStore.EXCEPTION_NAVIGATE_EVENT, navigateTo);
                            break;
                        case enums.ExceptionViewAction.Minimize:
                            this._doNavigateResponse = false;
                            this.emit(ExceptionStore.MINIMIZE_EXCEPTION_WINDOW);
                            break;
                        case enums.ExceptionViewAction.Maximize:
                            // when the exception discard poup comes in the maximize will be triggered.
                            // so we need to set the falg to true on this case alone
                            this._navigateFrom = (action as exceptionWindowAction).responseNavigationFrom;
                            this.emit(ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW);
                            break;
                        case enums.ExceptionViewAction.View:
                            this.emit(ExceptionStore.VIEW_EXCEPTION_WINDOW);
                            break;
                    }
                    break;
                case actionType.POPUPDISPLAY_ACTION:
                    let popUpDisplayAction = (action as popUpDisplayAction);
                    let popupType = popUpDisplayAction.getPopUpType;
                    let popupActionType = popUpDisplayAction.getPopUpActionType;
                    this._navigatingFrom = popUpDisplayAction.navigateFrom;
                    let popUpData = popUpDisplayAction.getPopUpData;
                    this.emit(ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, popupType, popupActionType, popUpData);
                    break;
                case actionType.RAISE_EXCEPTION_ACTION:
                    this._res = (action as raiseExceptionAction).raiseExceptionResponse;
                    this.emit(ExceptionStore.RAISE_EXCEPTION, this._res);
                    break;
                case actionType.UPDATE_EXCEPTION_STATUS:
                    let updatedExceptionStatus = (action as updateExceptionStatusAction);
                    let exceptionActionType = updatedExceptionStatus.exceptionActionType;
                    if (updatedExceptionStatus.exceptionId !== undefined &&
                        (exceptionActionType === enums.ExceptionActionType.Escalate
                            || exceptionActionType === enums.ExceptionActionType.Resolve)) {
                        this.emit(ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED, updatedExceptionStatus.doNavigate,
                            updatedExceptionStatus.updateStatusExceptionReturnErrorCode);
                    } else if (updatedExceptionStatus.exceptionId !== undefined) {
                        this.emit(ExceptionStore.CLOSE_EXCEPTION);
                    }
                    break;

                case actionType.OPEN_RESPONSE:
                    this._exceptions = undefined;
                    let openAction: responseOpenAction = action as responseOpenAction;
                    this._responseOpenTriggerPoint = openAction.triggerPoint;
                    break;
                case actionType.EXCEPTION_TYPE_SCROLL_RESET_ACTION:
                    this.emit(ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION);
                    break;
                case actionType.EXCEPTION_STOP_NAVIGATE_RESPONSE:
                    this._doNavigateResponse = false;
                    break;
                case actionType.EXCEPTION_POPUP_VISIBILITY_ACTION:
                    let actionExceptionPopupVisibility = (action as actionExceptionPopupVisibilityAction);
                    this.emit(ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP,
                        actionExceptionPopupVisibility.doVisiblePopup, actionExceptionPopupVisibility.exceptionActionType);
                    break;
                case actionType.SHOW_RESPONSE_NAVIGATION_FAILURE_REASON_ACTION:
                    this._navigateFrom = (action as showResponseNavigationFailureReasonAction).navigatingFrom;
                    break;
                case actionType.EXCEPTION_PANEL_CLICKED_ACTION:
                    this._isExceptonSidePanelOpen = (action as exceptionPanelClickedAction).isExceptionSidePanelOpen;
                    break;
            }
        });
    }

    /**
     * Get the status whether the exceptions loaded against the response
     */
    public get hasExceptionsLoaded(): boolean {
        return this._exceptions !== undefined;
    }

    /*
    * returns the exception data
    */
    public get getExceptionData() {
        if (this._exceptions !== undefined && this._exceptions !== null) {
            this._exceptions = exceptionHelper.orderExceptionList(this._exceptions);
            return this._exceptions;
        } else {
            return null;
        }
    }

    /**
     * Returns true if one type of exception is already raised
     * @param exceptionTypeId
     */
    public isExceptionTypeRaisedAlready(exceptionTypeId: number): boolean {
        let _isAlreadyRaised = false;
        if (this._exceptions) {
            this._exceptions.map((exceptionDetail: ExceptionDetails, index: number) => {
                this._exceptionTypes.map((exceptionType: ExceptionTypeDetails, index: number) => {
                    if (exceptionDetail.exceptionType === exceptionTypeId
                        && !(exceptionDetail.currentStatus === enums.ExceptionStatus.Closed ||
                            exceptionDetail.currentStatus === enums.ExceptionStatus.Resolved)) {
                        _isAlreadyRaised = true;
                    }
                });
            });
        }
        return _isAlreadyRaised;
    }

    /*
    * returns the resolved exception data count
    */
    public get getResolvedExceptionDataCount() {
        let resolvedExceptionData = this._exceptions;
        let resolvedExceptionCount: number = 0;
        if (resolvedExceptionData) {
            resolvedExceptionCount = resolvedExceptionData.filter((x: ExceptionDetails) =>
                x.currentStatus === enums.ExceptionStatus.Resolved).count();
        }
        return resolvedExceptionCount;
    }

    /*
     * returns open or resolved exception count.
     */
    public get getOpenOrResolvedExceptionCount() {
        let exceptionData = this._exceptions;
        let openOrResolvedExceptionCount: number = 0;
        if (exceptionData) {
            openOrResolvedExceptionCount = exceptionData.filter((x: ExceptionDetails) =>
                x.currentStatus !== enums.ExceptionStatus.Closed).count();
        }
        return openOrResolvedExceptionCount;
    }

    /**
     * Returns exception types
     */
    public get getExceptionTypes() {
        return this._exceptionTypes;
    }

    /**
     * returns the current message view action
     */
    public get exceptionViewAction() {
        return this._exceptionViewAction;
    }

    /**
     * returns true if exception panel is open, minimized or maximized
     */
    public get isExceptionPanelActive(): boolean {
        return this.exceptionViewAction === enums.ExceptionViewAction.Open ||
            this.exceptionViewAction === enums.ExceptionViewAction.Minimize ||
            this.exceptionViewAction === enums.ExceptionViewAction.Maximize;
    }

    /**
     * returns true if exception panel is open or maximized
     */
    public get isExceptionPanelVisible(): boolean {
        return this.exceptionViewAction === enums.ExceptionViewAction.Open ||
            this.exceptionViewAction === enums.ExceptionViewAction.Maximize ||
            this.exceptionViewAction === enums.ExceptionViewAction.View;
    }


    /**
     * Returns whether exception type is a blocker or not
     * @param excptionId
     */
    public isExceptionBlocker(excptionId: number): boolean {
        let exceptionData = this._exceptionTypes.filter((x: ExceptionTypeDetails) => x.exceptionType === excptionId);
        return exceptionData.size === 0 ? false : exceptionData.first().preventRIGSubmission
            || (exceptionHelper.isZoningException(excptionId) && exceptionHelper.isEbookMarking);
    }

    /**
     * Returns whether the raised exception has any blockers
     */
    public hasExceptionBlockers(): boolean {
        let isBlocker: boolean = false;

        if (this._exceptions) {
            this._exceptions.map((exceptionDetail: ExceptionDetails, index: number) => {
                this._exceptionTypes.map((exceptionType: ExceptionTypeDetails, index: number) => {
                    if (exceptionDetail.exceptionType === exceptionType.exceptionType && exceptionType.preventRIGSubmission
                        && exceptionDetail.currentStatus !== enums.ExceptionStatus.Closed) {
                        isBlocker = true;
                    }
                });
            });
        }

        return isBlocker;
    }

    /**
     * Getting where from the navigation happening
     */
    public get navigateFrom(): number {
        return this._navigatingFrom;
    }

    /**
     * Getting where to the navigation happening
     */
    public get navigateTo(): number {
        return this._navigatingTo;
    }

    /**
     * Get exception item from the collection
     * @param itemID
     */
    public getExceptionItem(itemID: number): ExceptionDetails {
        let exceptionData = this._exceptions.filter((x: ExceptionDetails) => x.uniqueId === itemID);
        return exceptionData.first();
    }

    /**
     * Get exception item Unique id from the collection
     */
    private get getFirstExceptionItemId(): number {
        return (this._exceptions.count() > 0) ? this._exceptions.first().uniqueId : 0;
    }

    /* return true if response navigation needs to be done */
    public get doNavigateResponse(): boolean {
        return this._doNavigateResponse;
    }

    /**
     * Get LHS exception panel open status
     */
    public get isExceptionSidePanelOpen(): boolean {
        return this._isExceptonSidePanelOpen;
    }
}

let instance = new ExceptionStore();

export = { ExceptionStore, instance };