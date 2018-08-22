import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import allocateArgument = require('./allocateargument');
import retrieveMarksArgument = require('../../dataservices/response/retrievemarksargument');
import allocatedResponseData = require('../../stores/response/typings/allocatedresponsedata');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import enums = require('../../components/utility/enums');
import fileReadStatusReturn = require('./ecourseworkfilereadstatusreturn');

class ECourseworkDataService extends dataServiceBase {
    /**
     * Method which makes the AJAX call to change the file read status of ecoursework file.
     * @param pageId
     * @param markSchemeGroupId
     * @param callback
     */
    public changeFileReadStatus(fileReadStatusArgument: ECourseworkFileReadStatusArguments,
        callback: ((success: boolean, fileReadStatusReturn: fileReadStatusReturn) => void)) {
        let url = urls.CHANGE_ECOURSE_WORK_FILE_READ_STATUS_URL;
        let that = this;
        let changeFileReadStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(fileReadStatusArgument));
        changeFileReadStatusPromise.then(function (json: any) {
            if (callback) {
                let resultData: fileReadStatusReturn = JSON.parse(json);
                callback(true, resultData);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, undefined);
            }
        });
    }
}

let eCourseworkDataService = new ECourseworkDataService();
export = eCourseworkDataService;