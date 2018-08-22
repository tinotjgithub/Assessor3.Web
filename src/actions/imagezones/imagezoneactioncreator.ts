import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import imageZonesAction = require('./imagezonesaction');
import imageZoneDataService = require('../../dataservices/imagezones/imagezonesdataservice');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');

/**
 * Class for Imagezone actioncreator
 */
class ImageZoneActionCreator extends base {

    /**
     * Get the list of image zones of structured paper. If the selected marking method is other than structured clear the selection.
     * @param {number} questionPaperId
     * @param {enums.MarkingMethod} markingMethod
     */
    public getImagezoneList(
        questionPaperId: number,
        markSchemeGroupId: number,
        markingMethod: enums.MarkingMethod,
        useCache: boolean = true): void {

        // If not structured clear existing the imagezone collection
        if (markingMethod !== enums.MarkingMethod.Structured) {
            // Dummy promise to dispatch an action
            let promise = new Promise.Promise(function (resolve: any, reject: any) {
                resolve();
            });
            promise.then(() => {
                dispatcher.dispatch(new imageZonesAction(true, null, markingMethod, questionPaperId));
            }).catch();
        } else {

            let that = this;
            // Get data from cach or online
            imageZoneDataService.getImageZoneDetails(function (success: boolean, jsonData: ImageZoneList) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(jsonData)) {
                    dispatcher.dispatch(new imageZonesAction(success, jsonData, markingMethod, questionPaperId));
                }
            },
                questionPaperId,
                markSchemeGroupId,
                useCache);
        }
    }

}

let imageZoneActionCreator = new ImageZoneActionCreator();
export = imageZoneActionCreator;