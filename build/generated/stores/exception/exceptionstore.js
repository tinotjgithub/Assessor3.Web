"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
var exceptionHelper = require('../../components/utility/exception/exceptionhelper');
/**
 * Class for exception store.
 */
var ExceptionStore = (function (_super) {
    __extends(ExceptionStore, _super);
    /**
     * @constructor
     */
    function ExceptionStore() {
        var _this = this;
        _super.call(this);
        //to set exception associated with a response
        this._exceptions = undefined;
        /* Navigating from response to different view */
        this._navigatingFrom = enums.SaveAndNavigate.none;
        /* Navigating to `different view */
        this._navigatingTo = enums.SaveAndNavigate.none;
        //exception panel view action
        this._exceptionViewAction = enums.ExceptionViewAction.None;
        //exception panel previous view action
        this._previousExceptionViewAction = enums.ExceptionViewAction.None;
        //Set triggerPoint
        this._responseOpenTriggerPoint = enums.TriggerPoint.None;
        this._doNavigateResponse = false;
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.GET_EXCEPTION_ACTION:
                    _this._exceptions = action.exceptions;
                    _this.emit(ExceptionStore.GET_EXCEPTIONS);
                    if (_this._responseOpenTriggerPoint === enums.TriggerPoint.WorkListResponseExceptionIcon) {
                        _this._exceptions = _this.getExceptionData;
                        var exceptionItemId = _this.getFirstExceptionItemId;
                        if (exceptionItemId > 0) {
                            _this.emit(ExceptionStore.GET_LINKED_EXCEPTIONS, exceptionItemId, _this._exceptions.count());
                        }
                        _this._responseOpenTriggerPoint = enums.TriggerPoint.None;
                    }
                    break;
                case actionType.GET_EXCEPTION_TYPE_ACTION:
                    _this._exceptionTypes = action.exceptionTypes;
                    break;
                case actionType.EXCEPTION_ACTION:
                    var exceptionId = action.exceptionId;
                    _this._previousExceptionViewAction = _this.exceptionViewAction;
                    _this._exceptionViewAction = action.exceptionAction;
                    switch (_this.exceptionViewAction) {
                        case enums.ExceptionViewAction.Open:
                            _this._doNavigateResponse = false;
                            _this.emit(ExceptionStore.OPEN_EXCEPTION_WINDOW, exceptionId);
                            break;
                        case enums.ExceptionViewAction.Close:
                            if (_this._navigateFrom === enums.ResponseNavigation.markScheme) {
                                _this._doNavigateResponse = true;
                            }
                            else {
                                _this._doNavigateResponse = false;
                            }
                            _this.emit(ExceptionStore.CLOSE_EXCEPTION_WINDOW);
                            break;
                        case enums.ExceptionViewAction.NavigateAway:
                            // set the previous message view action in the case of navigate away
                            // we will check current message view action for showing discard message (open, minimised, maximised etc)
                            _this._exceptionViewAction = _this._previousExceptionViewAction;
                            var navigateTo = action.navigateTo;
                            _this.emit(ExceptionStore.EXCEPTION_NAVIGATE_EVENT, navigateTo);
                            break;
                        case enums.ExceptionViewAction.Minimize:
                            _this._doNavigateResponse = false;
                            _this.emit(ExceptionStore.MINIMIZE_EXCEPTION_WINDOW);
                            break;
                        case enums.ExceptionViewAction.Maximize:
                            // when the exception discard poup comes in the maximize will be triggered.
                            // so we need to set the falg to true on this case alone
                            _this._navigateFrom = action.responseNavigationFrom;
                            _this.emit(ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW);
                            break;
                        case enums.ExceptionViewAction.View:
                            _this.emit(ExceptionStore.VIEW_EXCEPTION_WINDOW);
                            break;
                    }
                    break;
                case actionType.POPUPDISPLAY_ACTION:
                    var popUpDisplayAction_1 = action;
                    var popupType = popUpDisplayAction_1.getPopUpType;
                    var popupActionType = popUpDisplayAction_1.getPopUpActionType;
                    _this._navigatingFrom = popUpDisplayAction_1.navigateFrom;
                    var popUpData = popUpDisplayAction_1.getPopUpData;
                    _this.emit(ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, popupType, popupActionType, popUpData);
                    break;
                case actionType.RAISE_EXCEPTION_ACTION:
                    _this._res = action.raiseExceptionResponse;
                    _this.emit(ExceptionStore.RAISE_EXCEPTION, _this._res);
                    break;
                case actionType.UPDATE_EXCEPTION_STATUS:
                    var updatedExceptionStatus = action;
                    var exceptionActionType = updatedExceptionStatus.exceptionActionType;
                    if (updatedExceptionStatus.exceptionId !== undefined &&
                        (exceptionActionType === enums.ExceptionActionType.Escalate
                            || exceptionActionType === enums.ExceptionActionType.Resolve)) {
                        _this.emit(ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED, updatedExceptionStatus.doNavigate, updatedExceptionStatus.updateStatusExceptionReturnErrorCode);
                    }
                    else if (updatedExceptionStatus.exceptionId !== undefined) {
                        _this.emit(ExceptionStore.CLOSE_EXCEPTION);
                    }
                    break;
                case actionType.OPEN_RESPONSE:
                    _this._exceptions = undefined;
                    var openAction = action;
                    _this._responseOpenTriggerPoint = openAction.triggerPoint;
                    break;
                case actionType.EXCEPTION_TYPE_SCROLL_RESET_ACTION:
                    _this.emit(ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION);
                    break;
                case actionType.EXCEPTION_STOP_NAVIGATE_RESPONSE:
                    _this._doNavigateResponse = false;
                    break;
                case actionType.EXCEPTION_POPUP_VISIBILITY_ACTION:
                    var actionExceptionPopupVisibility = action;
                    _this.emit(ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP, actionExceptionPopupVisibility.doVisiblePopup, actionExceptionPopupVisibility.exceptionActionType);
                    break;
                case actionType.SHOW_RESPONSE_NAVIGATION_FAILURE_REASON_ACTION:
                    _this._navigateFrom = action.navigatingFrom;
                    break;
                case actionType.EXCEPTION_PANEL_CLICKED_ACTION:
                    _this._isExceptonSidePanelOpen = action.isExceptionSidePanelOpen;
                    break;
            }
        });
    }
    Object.defineProperty(ExceptionStore.prototype, "hasExceptionsLoaded", {
        /**
         * Get the status whether the exceptions loaded against the response
         */
        get: function () {
            return this._exceptions !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "getExceptionData", {
        /*
        * returns the exception data
        */
        get: function () {
            if (this._exceptions !== undefined && this._exceptions !== null) {
                this._exceptions = exceptionHelper.orderExceptionList(this._exceptions);
                return this._exceptions;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns true if one type of exception is already raised
     * @param exceptionTypeId
     */
    ExceptionStore.prototype.isExceptionTypeRaisedAlready = function (exceptionTypeId) {
        var _this = this;
        var _isAlreadyRaised = false;
        if (this._exceptions) {
            this._exceptions.map(function (exceptionDetail, index) {
                _this._exceptionTypes.map(function (exceptionType, index) {
                    if (exceptionDetail.exceptionType === exceptionTypeId
                        && !(exceptionDetail.currentStatus === enums.ExceptionStatus.Closed ||
                            exceptionDetail.currentStatus === enums.ExceptionStatus.Resolved)) {
                        _isAlreadyRaised = true;
                    }
                });
            });
        }
        return _isAlreadyRaised;
    };
    Object.defineProperty(ExceptionStore.prototype, "getResolvedExceptionDataCount", {
        /*
        * returns the resolved exception data count
        */
        get: function () {
            var resolvedExceptionData = this._exceptions;
            var resolvedExceptionCount = 0;
            if (resolvedExceptionData) {
                resolvedExceptionCount = resolvedExceptionData.filter(function (x) {
                    return x.currentStatus === enums.ExceptionStatus.Resolved;
                }).count();
            }
            return resolvedExceptionCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "getOpenOrResolvedExceptionCount", {
        /*
         * returns open or resolved exception count.
         */
        get: function () {
            var exceptionData = this._exceptions;
            var openOrResolvedExceptionCount = 0;
            if (exceptionData) {
                openOrResolvedExceptionCount = exceptionData.filter(function (x) {
                    return x.currentStatus !== enums.ExceptionStatus.Closed;
                }).count();
            }
            return openOrResolvedExceptionCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "getExceptionTypes", {
        /**
         * Returns exception types
         */
        get: function () {
            return this._exceptionTypes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "exceptionViewAction", {
        /**
         * returns the current message view action
         */
        get: function () {
            return this._exceptionViewAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "isExceptionPanelActive", {
        /**
         * returns true if exception panel is open, minimized or maximized
         */
        get: function () {
            return this.exceptionViewAction === enums.ExceptionViewAction.Open ||
                this.exceptionViewAction === enums.ExceptionViewAction.Minimize ||
                this.exceptionViewAction === enums.ExceptionViewAction.Maximize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "isExceptionPanelVisible", {
        /**
         * returns true if exception panel is open or maximized
         */
        get: function () {
            return this.exceptionViewAction === enums.ExceptionViewAction.Open ||
                this.exceptionViewAction === enums.ExceptionViewAction.Maximize ||
                this.exceptionViewAction === enums.ExceptionViewAction.View;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns whether exception type is a blocker or not
     * @param excptionId
     */
    ExceptionStore.prototype.isExceptionBlocker = function (excptionId) {
        var exceptionData = this._exceptionTypes.filter(function (x) { return x.exceptionType === excptionId; });
        return exceptionData.size === 0 ? false : exceptionData.first().preventRIGSubmission
            || (exceptionHelper.isZoningException(excptionId) && exceptionHelper.isEbookMarking);
    };
    /**
     * Returns whether the raised exception has any blockers
     */
    ExceptionStore.prototype.hasExceptionBlockers = function () {
        var _this = this;
        var isBlocker = false;
        if (this._exceptions) {
            this._exceptions.map(function (exceptionDetail, index) {
                _this._exceptionTypes.map(function (exceptionType, index) {
                    if (exceptionDetail.exceptionType === exceptionType.exceptionType && exceptionType.preventRIGSubmission
                        && exceptionDetail.currentStatus !== enums.ExceptionStatus.Closed) {
                        isBlocker = true;
                    }
                });
            });
        }
        return isBlocker;
    };
    Object.defineProperty(ExceptionStore.prototype, "navigateFrom", {
        /**
         * Getting where from the navigation happening
         */
        get: function () {
            return this._navigatingFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "navigateTo", {
        /**
         * Getting where to the navigation happening
         */
        get: function () {
            return this._navigatingTo;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get exception item from the collection
     * @param itemID
     */
    ExceptionStore.prototype.getExceptionItem = function (itemID) {
        var exceptionData = this._exceptions.filter(function (x) { return x.uniqueId === itemID; });
        return exceptionData.first();
    };
    Object.defineProperty(ExceptionStore.prototype, "getFirstExceptionItemId", {
        /**
         * Get exception item Unique id from the collection
         */
        get: function () {
            return (this._exceptions.count() > 0) ? this._exceptions.first().uniqueId : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "doNavigateResponse", {
        /* return true if response navigation needs to be done */
        get: function () {
            return this._doNavigateResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionStore.prototype, "isExceptionSidePanelOpen", {
        /**
         * Get LHS exception panel open status
         */
        get: function () {
            return this._isExceptonSidePanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    //Emit when exceptions are retrived
    ExceptionStore.GET_EXCEPTIONS = 'getexceptionsforresponse';
    // Exception Panel Open Event
    ExceptionStore.OPEN_EXCEPTION_WINDOW = 'openexceptionwindow';
    // Exception Panel Close Event
    ExceptionStore.CLOSE_EXCEPTION_WINDOW = 'closeexceptionwindow';
    // Exception Panel Minimize Event
    ExceptionStore.MINIMIZE_EXCEPTION_WINDOW = 'minimizeexceptionwindow';
    // Exception Panel Maximize Event
    ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW = 'maximizeexceptionwindow';
    // Raise Exception Event
    ExceptionStore.RAISE_EXCEPTION = 'raiseexception';
    // Exception Discard Popup Display Event
    ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT = 'exceptiondiscardpopupdisplayevent';
    // exception section navigate away event
    ExceptionStore.EXCEPTION_NAVIGATE_EVENT = 'exceptionnavigateevent';
    //close exception event
    ExceptionStore.CLOSE_EXCEPTION = 'closeexception';
    // Response Linked Exception
    ExceptionStore.GET_LINKED_EXCEPTIONS = 'linkedexceptionevent';
    // setting scroll for exception type list
    ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION = 'exceptiontypescrollresetaction';
    // setting to show action exception popup
    ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP = 'showactionexceptionpopup';
    // setting update exception status received 
    ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED = 'updateexceptionstatusreceived';
    ExceptionStore.VIEW_EXCEPTION_WINDOW = 'viewexceptionwindow';
    return ExceptionStore;
}(storeBase));
var instance = new ExceptionStore();
module.exports = { ExceptionStore: ExceptionStore, instance: instance };
//# sourceMappingURL=exceptionstore.js.map