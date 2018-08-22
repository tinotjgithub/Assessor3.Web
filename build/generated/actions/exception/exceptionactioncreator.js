"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var exceptionDataService = require('../../dataservices/exception/exceptiondataservice');
var Promise = require('es6-promise');
var getExceptionAction = require('./getexceptionaction');
var getExceptionTypeAction = require('./exceptiontypeaction');
var exceptionWindowAction = require('./exceptionwindowaction');
var raiseExceptionAction = require('./raiseexceptionaction');
var enums = require('../../components/utility/enums');
var updateExceptionStatusAction = require('./updateexceptionstatusaction');
var exceptionTypeScrollResetAction = require('./exceptiontypescrollresetaction');
var stopNavigateResponseAction = require('./stopnavigateresponseaction');
var actionExceptionPopupVisibilityAction = require('./actionexceptionpopupvisibilityaction');
var base = require('../base/actioncreatorbase');
var exceptionPanelClickedAction = require('./exceptionpanelclickedaction');
var ExceptionActionCreator = (function (_super) {
    __extends(ExceptionActionCreator, _super);
    function ExceptionActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Get exceptions against the response
     * @param responseId
     * @param markschemeGroupId
     */
    ExceptionActionCreator.prototype.getExceptions = function (candidateScriptId, markGroupId, markschemeGroupId, isTeamManagementMode, exceptionicon) {
        if (exceptionicon === void 0) { exceptionicon = false; }
        exceptionDataService.getExceptionsForResponse(candidateScriptId, markGroupId, markschemeGroupId, isTeamManagementMode, function (success, exceptionList) {
            if (exceptionicon !== true) {
                dispatcher.dispatch(new getExceptionAction(success, exceptionList));
            }
        });
    };
    /**
     * Get exception types
     * @param exceptionArgs
     */
    ExceptionActionCreator.prototype.getExceptionTypes = function (exceptionArgs) {
        exceptionDataService.getExceptionTypes(exceptionArgs, function (success, exceptionType) {
            dispatcher.dispatch(new getExceptionTypeAction(success, exceptionType));
        });
    };
    /**
     * Exception window view action
     * @param viewAction
     * @param itemId
     * @param navigateTo
     * @param navigateFrom
     */
    ExceptionActionCreator.prototype.exceptionWindowAction = function (viewAction, itemId, navigateTo, navigateFrom, responseNavigationFrom) {
        if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
        if (navigateFrom === void 0) { navigateFrom = enums.SaveAndNavigate.none; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new exceptionWindowAction(viewAction, itemId, navigateTo, navigateFrom, responseNavigationFrom));
        }).catch();
    };
    /**
     * Raise an exception
     * @param raiseExceptionparams
     * @param currentMarkGroupId
     * @param currentMarkSchemeGroupId
     */
    ExceptionActionCreator.prototype.raiseExceptionAction = function (raiseExceptionparams, currentMarkGroupId, currentMarkSchemeGroupId) {
        var that = this;
        exceptionDataService.raiseException(raiseExceptionparams, function (success, raiseExceptionResponse) {
            if (that.validateCall(raiseExceptionResponse, false, true)) {
                dispatcher.dispatch(new raiseExceptionAction(success, raiseExceptionResponse));
            }
        }, currentMarkGroupId, currentMarkSchemeGroupId);
    };
    /**
     * Update exception status
     * @param exceptionActionParams
     */
    ExceptionActionCreator.prototype.updateExceptionStatus = function (exceptionActionParams, doNavigate) {
        if (doNavigate === void 0) { doNavigate = false; }
        var that = this;
        var warningMessageAction = enums.WarningMessageAction.None;
        if (exceptionActionParams.actionType === enums.ExceptionActionType.Escalate ||
            exceptionActionParams.actionType === enums.ExceptionActionType.Resolve) {
            warningMessageAction = enums.WarningMessageAction.ExceptionAction;
        }
        exceptionDataService.updateExceptionStatus(exceptionActionParams, function (success, exceptionId, exceptionActionReturn, exceptionActionType) {
            // This will validate the call to find any network failure and is mandatory to add this.
            if (that.validateCall(exceptionActionReturn, false, true, enums.WarningMessageAction.ExceptionAction)) {
                dispatcher.dispatch(new updateExceptionStatusAction(exceptionActionReturn.success, exceptionId, exceptionActionType, doNavigate, exceptionActionParams.displayId, exceptionActionReturn.updateStatusExceptionReturnErrorCode));
            }
        });
    };
    /**
     * Reset scroll position of exception type
     * @param scrollTop
     */
    ExceptionActionCreator.prototype.setScrollForExceptionType = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new exceptionTypeScrollResetAction());
        }).catch();
    };
    /**
     * navigate response or not
     */
    ExceptionActionCreator.prototype.stopNavigateResponse = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stopNavigateResponseAction());
        }).catch();
    };
    /**
     * Method to show or hide exception action popup.
     * @param isVisible
     */
    ExceptionActionCreator.prototype.doVisibleExceptionActionPopup = function (isVisible, exceptionActionType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new actionExceptionPopupVisibilityAction(isVisible, exceptionActionType));
        }).catch();
    };
    /**
     * Method to set Lhs exception panel open status
     * @param {boolean} panelOpen
     * @memberof ExceptionActionCreator
     */
    ExceptionActionCreator.prototype.isExceptionSidePanelOpen = function (panelOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new exceptionPanelClickedAction(panelOpen));
        }).catch();
    };
    return ExceptionActionCreator;
}(base));
var exceptionActionCreator = new ExceptionActionCreator();
module.exports = exceptionActionCreator;
//# sourceMappingURL=exceptionactioncreator.js.map