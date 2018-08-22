import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import Immutable = require('immutable');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;

/**
 * Class for Getting MarkingInstructions details
 */
class MarkingInstructionsDataService extends dataServiceBase {
    /**
     * Converts markinginstructionreturn collection to an immutable list
     * @param data
     */
    private getImmutableMarkingInstructions(data: any): Immutable.List<MarkingInstruction> {
        return Immutable.List<MarkingInstruction>(data.markingInstructions);
    }

    /**
     * Call Api to get the MarkingInstructionsDetails
     * @param callback
     * @param markSchemeGroupId
     * @param markingInstructionCCValue
     */
    public getmarkinginstructions(callback: ((success: boolean, json: Immutable.List<MarkingInstruction>) => void),
        markSchemeGroupId: number, markingInstructionCCValue: number, useCache: boolean ) {

        let that = this;

        if (useCache) {
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('markingInstruction',
                'markingInstruction' + markSchemeGroupId,
                true,
                config.
                    cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                that.getmarkinginstructionData(markSchemeGroupId, markingInstructionCCValue, callback);
            });
        } else {
            that.getmarkinginstructionData(markSchemeGroupId, markingInstructionCCValue, callback);
        }
    }

    /**
     * get marking instruction data
     * 
     * @private
     * @param {number} markSchemeGroupId
     * @param {number} markingInstructionCCValue
     * @param {Function} callback 
     * @memberof MarkingInstructionsDataService
     */
    private getmarkinginstructionData(markSchemeGroupId: number, markingInstructionCCValue: number, callback: Function) {
        let that = this;
        let url = urls.MARKING_INSTRUCTIONS_DETAILS_GET_URL + '/' + markSchemeGroupId + '/' + markingInstructionCCValue;
        /** Makes AJAX call to get MarkingInstructionsDetails   */
        let getmarkingInstructionsPromise = that.makeAJAXCall('GET', url, '', false, false);

        getmarkingInstructionsPromise.then(function (data: any) {
            let markingInstructionsList = that.getImmutableMarkingInstructions(JSON.parse(data));
            if (callback) {
                storageAdapterFactory.getInstance().storeData('markingInstruction',
                    'markingInstruction' + markSchemeGroupId, markingInstructionsList, true)
                    .then(function () {
                        callback(true, markingInstructionsList);
                    }).catch();
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, data);
            }
        });
    }
}

let markinginstructionDataservice = new MarkingInstructionsDataService();
export = markinginstructionDataservice;