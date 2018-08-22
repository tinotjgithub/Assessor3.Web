import busyIndicatorParameter = require('./busyindicatorparameter');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../enums');
import BusyIndicatorStyles = require('./busyindicatorstyles');
/**
 * Helper class for busy indicator
 */
class BusyIndicatorHelper {

    /**
     * Method which returns the busy indicator parameter
     * @param busyIndicatorInvoker
     */
    public static getBusyIndicatorParameter(busyIndicatorInvoker: enums.BusyIndicatorInvoker, isOffline: boolean): busyIndicatorParameter {

        let busyIndicatorInvokerText: string = enums.BusyIndicatorInvoker[busyIndicatorInvoker];

        // Getting the busy indicator style
        let busyIndicatorStyle: string = BusyIndicatorStyles.NONE;

        switch (busyIndicatorInvoker) {
            case enums.BusyIndicatorInvoker.responseAllocation:
                busyIndicatorStyle = BusyIndicatorStyles.RESPONSE_ALLOCATION;
                break;
            case enums.BusyIndicatorInvoker.submit:
                busyIndicatorStyle = BusyIndicatorStyles.SUBMIT;
                break;
            case enums.BusyIndicatorInvoker.submitAll:
                busyIndicatorStyle = BusyIndicatorStyles.SUBMIT_ALL;
                break;
            case enums.BusyIndicatorInvoker.savingMarksAndAnnotations:
                busyIndicatorStyle = BusyIndicatorStyles.SAVING_MARKS_AND_ANNOTATIONS;
                if (isOffline) {
                    busyIndicatorInvokerText += '-offline';
                }
                break;
            case enums.BusyIndicatorInvoker.loadingModules:
                busyIndicatorStyle = BusyIndicatorStyles.LOADING_MODULES;
                break;
            case enums.BusyIndicatorInvoker.submitInResponseScreen:
                busyIndicatorStyle = BusyIndicatorStyles.SUBMIT_IN_RESPONSE_SCREEN;
                break;
            case enums.BusyIndicatorInvoker.none:
                busyIndicatorStyle = BusyIndicatorStyles.NONE;
                break;
        }

        // Getting the busy indicator text
        let busyIndicatorText: string = localeStore.instance.TranslateText('generic.busy-indicator.'
            + busyIndicatorInvokerText);

        // returning the parameter which defines the busy indicator
        return new busyIndicatorParameter(busyIndicatorText, busyIndicatorStyle);
    }

    /**
     * gets the class to add to busyindicator
     * @param {enums.ResponseMode} responseMode
     * @returns className
     */
    public static getResponseModeBusyClass(responseMode: enums.ResponseMode): string {
        let wrapperClass: string = '';
        switch (responseMode) {
            case enums.ResponseMode.open:
                wrapperClass = ' resp-open';
                break;
            case enums.ResponseMode.pending:
                wrapperClass = ' resp-grace';
                break;
            case enums.ResponseMode.closed:
                wrapperClass = ' resp-closed';
                break;
            default:
                break;
        }
        return wrapperClass;
    }
}

export = BusyIndicatorHelper;