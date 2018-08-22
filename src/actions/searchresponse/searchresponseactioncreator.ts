import dispatcher = require('../../app/dispatcher');
import action = require('../base/action');
import Promise = require('es6-promise');
import actionCreatorBase = require('../base/actioncreatorbase');
import searchResponseDataservice = require('../../dataservices/searchresponse/searchresponsedataservice');
import responseDataGetAction = require('../response/responsedatagetaction');
import enums = require('../../components/utility/enums');
import rignotfoundAction = require('./rignotfoundaction');
import loginSession = require('../../app/loginsession');

/**
 * class for Search Response Action Creator 
 */
class SearchResponseActionCreator extends actionCreatorBase {

    /**
     * parameter data
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param displayId
     */

    public getSearchedResponse(markSchemeGroupId: number, examinerRoleId: number, displayId: string): Promise<any> {

        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {

            let displayIdWithoutPrefix = parseInt(displayId.substring(1, displayId.length)); // Remove prfix '6'

            searchResponseDataservice.getSearchResponseDetail(markSchemeGroupId, examinerRoleId,  displayIdWithoutPrefix,
                function (success: boolean, resultData: SearchedResponseData, isResultFromCache: boolean) {

                    if (that.validateCall(resultData, false, true)) {

                        if (!success) {
                            resultData = undefined;
                        } else {
                            if (resultData.markGroupId === 0 && resultData.esMarkGroupId !== 0) {
                                resultData.markGroupId = resultData.esMarkGroupId;
                            }
                            resultData.triggerPoint = enums.TriggerPoint.DisplayIdSearch;
                            resultData.loggedInExaminerId = loginSession.EXAMINER_ID;
                            resultData.markSchemeGroupId = markSchemeGroupId;
                        }

                        dispatcher.dispatch(new responseDataGetAction(resultData, success, true));
                    }

                });
        });
    }

    /**
     * parameter data
     * @param show
     */

	public showOrHideRigNotFoundPopup(show: boolean){
		  new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new rignotfoundAction(show));
        }).catch();
	}
}
let searchResponseActionCreator = new SearchResponseActionCreator();
export = searchResponseActionCreator;