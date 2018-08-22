"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var acetatesDataService = require('../../dataservices/acetates/acetatesdataservice');
var actionCreatorBase = require('../base/actioncreatorbase');
var Promise = require('es6-promise');
var loadAcetatesDataAction = require('./loadacetatesdataaction');
var addOrUpdateAcetateAction = require('./addorupdateacetateaction');
var SaveAcetatesDataAction = require('./saveacetatesdataaction');
var removeAcetateDataAction = require('./removeacetatedataaction');
var shareAcetateDataAction = require('./shareacetatedataaction');
var acetatePositionUpdateAction = require('./acetatepositionupdateaction');
var acetatesMovingAction = require('./acetatemovingaction');
var acetateInGreyAreaAction = require('./acetateingreyareaaction');
var addPointToMultilineAction = require('./addpointtomultilineaction');
var shareConfirmationPopupAction = require('./shareconfirmationpopupaction');
var multilineStyleUpdateAction = require('./multilinestyleupdateaction');
var resetSharedAcetatesAction = require('./resetsharedacetatesaction');
var resetAcetateSaveInProgressStatusAction = require('./resetacetatesaveinprogressstatusaction');
var qigStore = require('../../stores/qigselector/qigstore');
/**
 * Class for Acetates action creator
 */
var AcetatesActionCreator = (function (_super) {
    __extends(AcetatesActionCreator, _super);
    function AcetatesActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Called when loading acetates data
     * @param questionPaperId
     * @param markSchemeGroupId
     * @param includeRelatedQigs
     */
    AcetatesActionCreator.prototype.loadAcetatesData = function (questionPaperId, markSchemeGroupId, includeRelatedQigs) {
        if (qigStore.instance.getPreviousSelectedQigId !== markSchemeGroupId) {
            var that_1 = this;
            return new Promise.Promise(function (resolve, reject) {
                acetatesDataService.loadAcetates(function (success, acetateList) {
                    //This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that_1.validateCall(acetateList)) {
                        dispatcher.dispatch(new loadAcetatesDataAction(success, acetateList));
                        resolve(acetateList);
                    }
                    else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }, questionPaperId, markSchemeGroupId, includeRelatedQigs);
            });
        }
        else {
            return new Promise.Promise(function (resolve, reject) {
                resolve();
            });
        }
    };
    /**
     * Called when nadding or updating acetates
     * @param acetateData
     * @param markingOperation
     * @param clientToken
     * @param acetateContextMenuData
     */
    AcetatesActionCreator.prototype.addOrUpdateAcetate = function (acetate, markingOperation, clientToken, acetateContextMenuData) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new addOrUpdateAcetateAction(acetate, markingOperation, clientToken, acetateContextMenuData));
        }).catch();
    };
    /**
     * Called when saving acetates data
     * @param saveAcetatesArgs
     */
    AcetatesActionCreator.prototype.saveAcetates = function (saveAcetatesArgs) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            acetatesDataService.saveAcetates(function (success, acetateList) {
                //This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(acetateList)) {
                    dispatcher.dispatch(new SaveAcetatesDataAction(success, acetateList));
                    resolve(acetateList);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, saveAcetatesArgs);
        });
    };
    /**
     * Remove currently selected acetate from the marking screen
     * @param clientToken
     * @param contextMenuType
     */
    AcetatesActionCreator.prototype.removeAcetate = function (clientToken, toolType, multilineItem, acetateContextMenuData) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new removeAcetateDataAction(clientToken, toolType, multilineItem, acetateContextMenuData));
        }).catch();
    };
    /**
     * acetate position update action
     * @param acetate
     * @param acetateAction
     */
    AcetatesActionCreator.prototype.acetatePositionUpdateAction = function (acetate, acetateAction) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new acetatePositionUpdateAction(acetate, acetateAction));
        }).catch();
    };
    /**
     * is acetates border showing action
     * @param clientToken
     * @param isMoving
     */
    AcetatesActionCreator.prototype.acetateMoving = function (clientToken, isMoving) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new acetatesMovingAction(clientToken, isMoving));
        }).catch();
    };
    /**
     * is acetates in grey area action
     * @param isInGreyArea
     * @param clientToken
     */
    AcetatesActionCreator.prototype.acetateInGreyArea = function (isInGreyArea, clientToken) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new acetateInGreyAreaAction(isInGreyArea, clientToken));
        }).catch();
    };
    /**
     * Share currently selected acetate from the marking screen
     * @param clientToken
     * @param shareMultiline
     */
    AcetatesActionCreator.prototype.shareAcetate = function (clientToken) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new shareAcetateDataAction(clientToken));
        }).catch();
    };
    /**
     * Show confirmation popup when share is turend off
     * @param clientToken
     * @param isShared
     */
    AcetatesActionCreator.prototype.shareConfirmationPopup = function (clientToken, isShared) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new shareConfirmationPopupAction(clientToken, isShared));
        }).catch();
    };
    /**
     * add point to multiline
     * @param acetateId
     * @param x
     * @param y
     */
    AcetatesActionCreator.prototype.addMultilineItems = function (clientToken, x, y, acetateContextMenuDetail, multilineItems) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new addPointToMultilineAction(clientToken, x, y, acetateContextMenuDetail, multilineItems));
        }).catch();
    };
    /**
     * updating style to multiline (both color and line type)
     * @param clientToken
     * @param x
     * @param y
     * @param acetateContextMenuDetail
     * @param multilineItems
     */
    AcetatesActionCreator.prototype.multiLineStyleUpdate = function (clientToken, x, y, acetateContextMenuDetail, multilineItems) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new multilineStyleUpdateAction(clientToken, x, y, acetateContextMenuDetail, multilineItems));
        }).catch();
    };
    /**
     * Method to reset the shared acetates list.
     */
    AcetatesActionCreator.prototype.resetSharedAcetate = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new resetSharedAcetatesAction());
        }).catch();
    };
    /**
     * Method to reset the acetate save in progress status.
     */
    AcetatesActionCreator.prototype.resetAcetateSaveInProgressStatus = function (acetatesList) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new resetAcetateSaveInProgressStatusAction(acetatesList));
        }).catch();
    };
    return AcetatesActionCreator;
}(actionCreatorBase));
var acetatesActionCreator = new AcetatesActionCreator();
module.exports = acetatesActionCreator;
//# sourceMappingURL=acetatesactioncreator.js.map