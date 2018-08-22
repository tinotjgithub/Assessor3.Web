import dispatcher = require('../../app/dispatcher');
import acetatesDataService = require('../../dataservices/acetates/acetatesdataservice');
import actionCreatorBase = require('../base/actioncreatorbase');
import Promise = require('es6-promise');
import loadAcetatesDataAction = require('./loadacetatesdataaction');
import addOrUpdateAcetateAction = require('./addorupdateacetateaction');
import enums = require('../../components/utility/enums');
import SaveAcetatesDataAction = require('./saveacetatesdataaction');
import removeAcetateDataAction = require('./removeacetatedataaction');
import shareAcetateDataAction = require('./shareacetatedataaction');
import acetatePositionUpdateAction = require('./acetatepositionupdateaction');
import acetatesMovingAction = require('./acetatemovingaction');
import acetateInGreyAreaAction = require('./acetateingreyareaaction');
import acetateContextMenuData = require('../../components/utility/contextmenu/acetatecontextmenudata');
import addPointToMultilineAction = require('./addpointtomultilineaction');
import shareConfirmationPopupAction = require('./shareconfirmationpopupaction');
import multilineStyleUpdateAction = require('./multilinestyleupdateaction');
import resetSharedAcetatesAction = require('./resetsharedacetatesaction');
import resetAcetateSaveInProgressStatusAction = require('./resetacetatesaveinprogressstatusaction');
import Immutable = require('immutable');

import qigStore = require('../../stores/qigselector/qigstore');
/**
 * Class for Acetates action creator
 */
class AcetatesActionCreator extends actionCreatorBase {

    /**
     * Called when loading acetates data
     * @param questionPaperId
     * @param markSchemeGroupId
     * @param includeRelatedQigs
     */
    public loadAcetatesData(questionPaperId: number,
        markSchemeGroupId: number, includeRelatedQigs: boolean): Promise<any> {
        if (qigStore.instance.getPreviousSelectedQigId !== markSchemeGroupId) {
            let that = this;
            return new Promise.Promise(function (resolve: any, reject: any) {
                acetatesDataService.loadAcetates(function (success: boolean, acetateList: Immutable.List<Acetate>) {
                    //This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(acetateList)) {
                        dispatcher.dispatch(new loadAcetatesDataAction(success, acetateList));
                        resolve(acetateList);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }, questionPaperId, markSchemeGroupId, includeRelatedQigs);
            });
        } else {
            return new Promise.Promise(function (resolve: any, reject: any) {
                resolve();
            });
        }
    }

    /**
     * Called when nadding or updating acetates
     * @param acetateData
     * @param markingOperation
     * @param clientToken
     * @param acetateContextMenuData
     */
    public addOrUpdateAcetate(acetate?: Acetate,
        markingOperation?: enums.MarkingOperation,
        clientToken?: string,
        acetateContextMenuData?: acetateContextMenuData) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new addOrUpdateAcetateAction(acetate,
                markingOperation, clientToken, acetateContextMenuData));
        }).catch();
    }


    /**
     * Called when saving acetates data
     * @param saveAcetatesArgs
     */
    public saveAcetates(saveAcetatesArgs: SaveAcetatesArguments): Promise<any> {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            acetatesDataService.saveAcetates(function (success: boolean, acetateList: Immutable.List<Acetate>) {
                //This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(acetateList)) {
                    dispatcher.dispatch(new SaveAcetatesDataAction(success, acetateList));
                    resolve(acetateList);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, saveAcetatesArgs);
        });
    }

    /**
     * Remove currently selected acetate from the marking screen
     * @param clientToken
     * @param contextMenuType
     */
    public removeAcetate(clientToken: string,
        toolType: enums.ToolType,
        multilineItem?: enums.MultiLineItems,
        acetateContextMenuData?: acetateContextMenuData){
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new removeAcetateDataAction(clientToken, toolType,
                multilineItem, acetateContextMenuData));
        }).catch();
    }

    /**
     * acetate position update action
     * @param acetate
     * @param acetateAction
     */
    public acetatePositionUpdateAction(acetate: Acetate, acetateAction: enums.AcetateAction) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new acetatePositionUpdateAction(acetate, acetateAction));
        }).catch();
    }

    /**
     * is acetates border showing action
     * @param clientToken
     * @param isMoving
     */
    public acetateMoving(clientToken: string, isMoving: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new acetatesMovingAction(clientToken, isMoving));
        }).catch();
    }

    /**
     * is acetates in grey area action
     * @param isInGreyArea
     * @param clientToken
     */
    public acetateInGreyArea(isInGreyArea: boolean, clientToken: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new acetateInGreyAreaAction(isInGreyArea, clientToken));
        }).catch();
    }

    /**
     * Share currently selected acetate from the marking screen
     * @param clientToken
     * @param shareMultiline
     */
    public shareAcetate(clientToken: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new shareAcetateDataAction(clientToken));
        }).catch();
    }

    /**
     * Show confirmation popup when share is turend off
     * @param clientToken
     * @param isShared
     */
    public shareConfirmationPopup(clientToken: string, isShared: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new shareConfirmationPopupAction(clientToken, isShared));
        }).catch();
    }

    /**
     * add point to multiline
     * @param acetateId
     * @param x
     * @param y
     */
    public addMultilineItems(
        clientToken: string,
        x: number,
        y: number,
        acetateContextMenuDetail: acetateContextMenuData,
        multilineItems: enums.MultiLineItems) {
        new Promise.Promise(function(resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new addPointToMultilineAction(clientToken, x, y, acetateContextMenuDetail, multilineItems));
        }).catch();
    }

    /**
     * updating style to multiline (both color and line type)
     * @param clientToken
     * @param x
     * @param y
     * @param acetateContextMenuDetail
     * @param multilineItems
     */
    public multiLineStyleUpdate(
        clientToken: string,
        x: number,
        y: number,
        acetateContextMenuDetail: acetateContextMenuData,
        multilineItems: enums.MultiLineItems) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new multilineStyleUpdateAction(clientToken, x, y, acetateContextMenuDetail, multilineItems));
        }).catch();
    }

    /**
     * Method to reset the shared acetates list.
     */
    public resetSharedAcetate() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetSharedAcetatesAction());
        }).catch();
    }

    /**
     * Method to reset the acetate save in progress status.
     */
    public resetAcetateSaveInProgressStatus(acetatesList: Immutable.List<Acetate>) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetAcetateSaveInProgressStatusAction(acetatesList));
        }).catch();
    }
}

let acetatesActionCreator = new AcetatesActionCreator();
export = acetatesActionCreator;