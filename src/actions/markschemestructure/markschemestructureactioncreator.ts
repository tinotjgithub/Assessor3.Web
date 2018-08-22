import dispatcher = require('../../app/dispatcher');
import markSchemeStructureGetAction = require('./markschemestructuregetaction');
import markSchemeHeaderDropDownAction = require('./markschemeheaderdropdownaction');
import markSchemeStructureDataService = require('../../dataservices/markschemestructure/markschemestructuredataservice');
import annotationToolTipSetAction = require('./annotationtooltipsetaction');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');

/**
 * Class for markSchemeStructure actioncreator
 */
class MarkSchemeStructureActionCreator extends base {

    /**
     * Get the list of image zones of structured paper. If the selected marking method is other than structured clear the selection.
     * @param {number} questionPaperId
     * @param {boolean = true} useCache
     * @param {boolean = true} initiateDispatch
     */
	public getmarkSchemeStructureList(markSchemeGroupId: number, questionPaperId: number, useCache:
		boolean = true, initiateDispatch: boolean = true, examSessionId: number = 0, isAwarding: boolean = false): Promise<MarkSchemeStructure> {

        let that = this;

        //Get data from cache or online
        return new Promise.Promise(function (resolve: any, reject: any) {
            markSchemeStructureDataService.getMarkSchemeStructureDetails
                (function (success: boolean, jsonData: MarkSchemeStructure) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    // If the call is not depended on promise ensure dispatcer is dispatching.
                    if (that.validateCall(jsonData) && initiateDispatch) {
                        dispatcher.dispatch(new markSchemeStructureGetAction(success, jsonData));
                    }

                resolve(jsonData);
				}, markSchemeGroupId, questionPaperId, useCache, examSessionId, isAwarding);
        });
    }

    /**
     * This will update the annotation tooltip information against markSchemeIds
     * @param toolTipInfo annotation tooltips dictionary with markSchemeId as key
     */
    public updateAnnotationToolTip(toolTipInfo: Immutable.Map<number, MarkSchemeInfo>) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new annotationToolTipSetAction(true, toolTipInfo));
        }).catch();
    }

    /**
     * mark scheme header dropdown opened.
     */
    public markSchemeHeaderDropDown(isHeaderDropDownOpen: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markSchemeHeaderDropDownAction(isHeaderDropDownOpen));
        }).catch();
    }
}

let markSchemeStructureActionCreator = new MarkSchemeStructureActionCreator();
export = markSchemeStructureActionCreator;
