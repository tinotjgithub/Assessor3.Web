import dispatcher = require('../../app/dispatcher');
import action = require('../base/action');
import Promise = require('es6-promise');
import actionCreatorBase = require('../base/actioncreatorbase');
import markinginstructionDataservice = require('../../dataservices/markinginstructions/markinginstructionsdataservice');
import loadMarkingInstructionsDataAction = require('./loadmarkinginstructionsdataaction');
import Immutable = require('immutable');
import markingInstructionPnaleClickAction = require('./markinginstructionpanelclickaction');
import markingInstructionUpdatedAction = require('./markinginstructionupdatedaction');

/**
 * class for Marking Instructions Action Creator 
 */
class MarkingInstructionActionCreator extends actionCreatorBase {

    /**
     * parameter data
     * @param markSchemeGroupId 
     */
    public getMarkingInstructionsActionCreator(markSchemeGroupId: number, markingInstructionCCValue: number,
        useCache: boolean = true): Promise<any> {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            markinginstructionDataservice.getmarkinginstructions(
                function (success: boolean, markingInstructionsList: Immutable.List<MarkingInstruction>) {

                if (that.validateCall(markingInstructionsList)) {
                    dispatcher.dispatch(new loadMarkingInstructionsDataAction(success, markingInstructionsList));
                    resolve(markingInstructionsList);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
                }, markSchemeGroupId, markingInstructionCCValue, useCache);
        });
    }

    /**
     * On opening or closing marking instruction file panel
     * @param isMarkingInstructionPanelOpen
     */
    public markingInstructionPanelOpenActionCreator(isMarkingInstructionPanelOpen: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markingInstructionPnaleClickAction(isMarkingInstructionPanelOpen));
        }).catch();
    }

   /**
    * Update the marking instruction list
    */
    public updateMarkingInstruction(documentId: number, readStatus: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markingInstructionUpdatedAction(documentId, readStatus));
        }).catch();
    }
}

let markingInstructionActionCreator = new MarkingInstructionActionCreator();
export = markingInstructionActionCreator;
