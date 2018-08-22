import dispatcher = require('../../app/dispatcher');
import markerInformationAction = require('./markerinformationaction');
import markerInformationDataService = require('../../dataservices/markerinformation/markerinformationdataservice');
import Promise = require('es6-promise');
import enums = require('../../components/utility/enums');
import markerInformation = require('../../stores/markerinformation/typings/markerinformation');

/**
 * Class for populating logged in user's profile information.
 */
class MarkerInformationActionCreator {

    /**
     * Populate logged in user's profile information.
     * @param examinerRoleId
     * @param initiateDispatch - to handle wheteher we need to dispatch or not (dispatch  not needed for worklist initiation)
     */
    public GetMarkerInformation
        (examinerRoleID: number,
        markSchemeGroupId: number,
        initiateDispatch: boolean = true,
        useCache: boolean = false,
        currentApprovalStatus: enums.ExaminerApproval = enums.ExaminerApproval.None): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            markerInformationDataService.GetMarkerInformation(examinerRoleID,
                markSchemeGroupId,
                function (success: boolean, json: any, isResultFromCache: boolean) {
                    let markerDetails: markerInformation = JSON.parse(json);
                    markerDetails.examinerRoleId = examinerRoleID;
                    if (currentApprovalStatus > 0 && isResultFromCache) {
                        markerDetails.approvalStatus = currentApprovalStatus;
                    }
                if (initiateDispatch) {
                    dispatcher.dispatch(new markerInformationAction(success, markerDetails));
                }
                resolve(markerDetails);
            }, useCache,
            currentApprovalStatus);
        });
    }
}

let markerinformationactioncreator = new MarkerInformationActionCreator();
export = markerinformationactioncreator;