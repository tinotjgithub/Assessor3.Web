import serviceErrorReturn = require('../../dataservices/base/serviceerrorreturn');
import concurrentSessionErrorReturn = require('../../dataservices/base//concurrentsessionerrorreturn');
import enums = require('../../components/utility/enums');
import applicationActionCreator = require('../applicationoffline/applicationactioncreator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import Promise = require('es6-promise');
import dispatcher = require('../../app/dispatcher');
import browserOnlineStatusUpdationAction = require('../applicationoffline/browseronlinestatusupdationaction');
import applicationDS = require('../../dataservices/applicationoffline/applicationdataservice');
import actonInterruptedAction = require('../applicationoffline/actoninterruptedaction');
import notifyConcurrentSessionActive = require('../../actions/login/notifyconcurrentsessionactive');
import validationAction = require('../teammanagement/validationaction');

/**
 * Class for holding common activities of action creator.
 */
class ActionCreatorBase {

    /**
     * Indicating whether the dataservice call is from network error.
     * then update the ping poll interval to check when the network comes online.
     * @param {any} resultData
     */
    protected validateCall(resultData: any, allowNavigation: boolean = false, showMsgOnFailure: boolean = false,
        warningmessageaction: enums.WarningMessageAction = enums.WarningMessageAction.None,
        isFromLogout: boolean = false, isFromMyTeam: boolean = false): boolean {

        let isValid: boolean = true;

        if (resultData && resultData instanceof concurrentSessionErrorReturn) {

            this.informConcurrentSessionActive();
            isValid = false;
            // If returned the error result
        } else if (resultData &&
            resultData instanceof serviceErrorReturn &&
            resultData.errorType === enums.DataServiceRequestErrorType.NetworkError) {

            isValid = false;
            //applicationActionCreator.updateOnlineStatus(true);
            this.invokeOnlineStatusUpdate(true, allowNavigation, showMsgOnFailure, isFromLogout);
        } else if (resultData && resultData.failureCode &&
            resultData.failureCode !== enums.FailureCode.None &&
            warningmessageaction !== enums.WarningMessageAction.None) {
            isValid = false;
            // If any failure code return it will invoke failure status update to handle warning message.
            this.invokeFailureStatusUpdate(resultData.failureCode, warningmessageaction);
        } else if (isFromMyTeam && resultData.length === 0) {
            //If myteamData is null due to heirachy change it will invoke a warning message.
            this.invokeFailureStatusUpdate(enums.FailureCode.NotTeamLead, enums.WarningMessageAction.MyTeamAction);
        }

        return isValid;
    }

    /**
     * Gets a value indicating whether the application is online.
     */
    protected get isOnline(): boolean {
        return applicationStore.instance.isOnline;
    }

    /**
     * updates the online status
     * @param {boolean = false} isError
     * @param {boolean = false} showMsgOnFailure
     */
    public invokeOnlineStatusUpdate(isError: boolean = false, allowNavigation: boolean = false, showMsgOnFailure: boolean = false,
        isFromLogout: boolean = false): void {
        // If any other dataservice call has been falied due to network error
        // straight away set the flag to false, else allow ping method to execute
        if (isError) {
            new Promise.Promise(function (resolve: any, reject: any) {
                resolve();
            }).then(() => {
                dispatcher.dispatch(new browserOnlineStatusUpdationAction(false));
            }).then(() => {
                if (showMsgOnFailure) {
                    dispatcher.dispatch(new actonInterruptedAction(allowNavigation, isFromLogout));
                }
            });
        } else {
            this.validateNetWorkStatus();
        }
    }

    /**
     * updates the failure code status
     * @param {failurecode}
     * @param {warningmessageaction}
     */
    public invokeFailureStatusUpdate(failureCode: enums.FailureCode, warningMessageAction: enums.WarningMessageAction): void {
        dispatcher.dispatch(new validationAction(failureCode, warningMessageAction));
    }

    /**
     * Gets application dataservice instance
     * @returns application dataservice instance
     */
    protected get serviceInstance(): any {
        return applicationDS;
    }

    /**
     * inform whether the current session is active or not.
     */
    public informConcurrentSessionActive(): void {
        dispatcher.dispatch(new notifyConcurrentSessionActive());
    }

	/**
	 * Check we have an open network
	 */
    public validateNetWorkStatus(forceEmit: boolean = false) {
		applicationDS.ping((success: boolean, json: any) => {
			if (json && json instanceof concurrentSessionErrorReturn) {
				this.informConcurrentSessionActive();
            } else {
                dispatcher.dispatch(new browserOnlineStatusUpdationAction(success, forceEmit));
			}
		});
	}
}
export = ActionCreatorBase;