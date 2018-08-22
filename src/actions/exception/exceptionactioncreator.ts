import dispatcher = require('../../app/dispatcher');
import exceptionDataService = require('../../dataservices/exception/exceptiondataservice');
import Promise = require('es6-promise');
import getExceptionAction = require('./getexceptionaction');
import getExceptionTypeArguments = require('../../dataservices/exception/getexceptiontypesarguments');
import getExceptionTypeAction = require('./exceptiontypeaction');
import exceptionWindowAction = require('./exceptionwindowaction');
import raiseExceptionAction = require('./raiseexceptionaction');
import enums = require('../../components/utility/enums');
import updateExceptionStatusAction = require('./updateexceptionstatusaction');
import exceptionTypeScrollResetAction = require('./exceptiontypescrollresetaction');
import stopNavigateResponseAction = require('./stopnavigateresponseaction');
import actionExceptionPopupVisibilityAction = require('./actionexceptionpopupvisibilityaction');
import base = require('../base/actioncreatorbase');
import exceptionPanelClickedAction = require('./exceptionpanelclickedaction');

class ExceptionActionCreator extends base {
    /**
     * Get exceptions against the response
     * @param responseId
     * @param markschemeGroupId
     */
    public getExceptions(candidateScriptId: number, markGroupId: number, markschemeGroupId: number, isTeamManagementMode: boolean,
        exceptionicon: boolean = false, getLinkedExceptions: boolean): void {
        exceptionDataService.getExceptionsForResponse(candidateScriptId, markGroupId, markschemeGroupId, isTeamManagementMode,
            function (success: boolean, exceptionList: ExceptionList) {
                if (exceptionicon !== true) {
                    dispatcher.dispatch(new getExceptionAction(success, exceptionList, getLinkedExceptions));
                }
            });
    }
    /**
     * Get exception types
     * @param exceptionArgs
     */
    public getExceptionTypes(exceptionArgs: getExceptionTypeArguments) {
        exceptionDataService.getExceptionTypes(exceptionArgs, function (success: boolean, exceptionType: ExceptionTypes) {
            dispatcher.dispatch(new getExceptionTypeAction(success, exceptionType));
        });
    }
    /**
     * Exception window view action
     * @param viewAction
     * @param itemId
     * @param navigateTo
     * @param navigateFrom
     */
    public exceptionWindowAction(viewAction: enums.ExceptionViewAction, itemId?: number,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none,
        navigateFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none,
        responseNavigationFrom?: enums.ResponseNavigation) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new exceptionWindowAction(viewAction, itemId, navigateTo, navigateFrom, responseNavigationFrom));
        }).catch();
    }

    /**
     * Raise an exception
     * @param raiseExceptionparams
     * @param currentMarkGroupId
     * @param currentMarkSchemeGroupId
     */
    public raiseExceptionAction(raiseExceptionparams?: RaiseExceptionParams,
        currentMarkGroupId?: number, currentMarkSchemeGroupId?: number) {
        let that = this;
        exceptionDataService.raiseException(raiseExceptionparams, function (success: boolean,
            raiseExceptionResponse: RaiseExceptionResponse) {
            if (that.validateCall(raiseExceptionResponse, false, true)) {
                dispatcher.dispatch(new raiseExceptionAction(success, raiseExceptionResponse));
            }
        }, currentMarkGroupId, currentMarkSchemeGroupId);
    }

    /**
     * Update exception status
     * @param exceptionActionParams
     */
    public updateExceptionStatus(exceptionActionParams: ExceptionActionParams, doNavigate: boolean = false) {
        let that = this;
        let warningMessageAction: enums.WarningMessageAction = enums.WarningMessageAction.None;
        if (exceptionActionParams.actionType === enums.ExceptionActionType.Escalate ||
            exceptionActionParams.actionType === enums.ExceptionActionType.Resolve) {
            warningMessageAction = enums.WarningMessageAction.ExceptionAction;
        }
        exceptionDataService.updateExceptionStatus(exceptionActionParams, function (
            success: boolean, exceptionId: number, exceptionActionReturn: ExceptionActionReturn,
            exceptionActionType: enums.ExceptionActionType) {

            // This will validate the call to find any network failure and is mandatory to add this.
            if (that.validateCall(exceptionActionReturn, false, true,
                enums.WarningMessageAction.ExceptionAction)) {
                dispatcher.dispatch(new updateExceptionStatusAction(exceptionActionReturn.success,
                    exceptionId, exceptionActionType, doNavigate, exceptionActionParams.displayId,
                    exceptionActionReturn.updateStatusExceptionReturnErrorCode));
            }
        });
    }

    /**
     * Reset scroll position of exception type
     * @param scrollTop
     */
    public setScrollForExceptionType() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new exceptionTypeScrollResetAction());
        }).catch();
    }

    /**
     * navigate response or not
     */
    public stopNavigateResponse() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stopNavigateResponseAction());
        }).catch();
    }

    /**
     * Method to show or hide exception action popup.
     * @param isVisible
     */
    public doVisibleExceptionActionPopup(isVisible: boolean, exceptionActionType: enums.ExceptionActionType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new actionExceptionPopupVisibilityAction(isVisible, exceptionActionType));
        }).catch();
    }

    /**
     * Method to set Lhs exception panel open status
     * @param {boolean} panelOpen 
     * @memberof ExceptionActionCreator
     */
    public isExceptionSidePanelOpen(panelOpen: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new exceptionPanelClickedAction(panelOpen));
        }).catch();
    }
}

let exceptionActionCreator = new ExceptionActionCreator();
export = exceptionActionCreator;