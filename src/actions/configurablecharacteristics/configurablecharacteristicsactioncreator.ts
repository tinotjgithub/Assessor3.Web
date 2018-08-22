import dispatcher = require('../../app/dispatcher');
import ccAction = require('./configurablecharacteristicsaction');
import ccDataServices = require('../../dataservices/configurablecharacteristics/configurablecharacteristicsdataservice');
import enums = require('../../components/utility/enums');
import ccData = require('../../stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');

/**
 * Configurable Charcteristics Action Creator helper class
 */
class ConfigurableCharacteristicsActionCreator extends base {

	/**
	 * Method which retrieves the ExamBody level CCs
	 */
    public getExamBodyCCs(useCache: boolean = false): void {

        let that = this;
        ccDataServices.getExamBodyCCs(function (success: boolean, ccData: ccData) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(ccData)) {

                dispatcher.dispatch(new ccAction(success, enums.ConfigurableCharacteristicLevel.ExamBody, 0, ccData));
            }
        },
        useCache);
    }

    /**
     * Method which retrieves the MarkSchemeGroup level CCs for the current QIG
     * @param {number} markSchemeGroupId
     * @param {number} questionPaperId
     * @param {boolean = true} initiateDispatch
     */
    public getMarkSchemeGroupCCs(markSchemeGroupId: number,
        questionPaperId: number, initiateDispatch: boolean = true, isFromHistory: boolean = false): Promise<any> {

        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {

            ccDataServices.getMarkSchemeGroupCCs(markSchemeGroupId,
                questionPaperId,
                function (success: boolean, ccData: ccData) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(ccData)) {

                        // Dispatch only if the indicator is on and the indicator will set only if its an individual call
                        // and if promise is using we have to wait for other service call as well.
                        if (initiateDispatch) {
                            dispatcher.dispatch(new ccAction(success,
                                enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, markSchemeGroupId, ccData));
                        }

                        resolve(ccData);
                    } else {

                        // This will stop promise.all from exec
                        reject(null);
                    }
                });
        });
    }
}

let configurableCharacteristicsActionCreator = new ConfigurableCharacteristicsActionCreator();
export = configurableCharacteristicsActionCreator;