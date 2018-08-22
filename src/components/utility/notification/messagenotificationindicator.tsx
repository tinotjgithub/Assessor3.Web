/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import enums = require('../enums');
import navigationHelper = require('../../utility/navigation/navigationhelper');
import markingStore = require('../../../stores/marking/markingstore');
import markingHelper = require('../../../utility/markscheme/markinghelper');
import popupHelper = require('../popup/popuphelper');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import responseStore = require('../../../stores/response/responsestore');
import userInfoActionCreator = require('../../../actions/userinfo/userinfoactioncreator');
import navigationStore = require('../../../stores/navigation/navigationstore');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import simulationModeHelper = require('../../../utility/simulation/simulationmodehelper');
import qigStore = require('../../../stores/qigselector/qigstore');

/**
 * Properties of message notification indicator component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    messageNotificationCount?: number;
}

/**
 * Represents the message notification indicator component
 */
class MessageNotificationIndicator extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(properties: Props, state: any) {
        super(properties, state);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        return (
            <li role='menuitem'>
                <a id={this.props.id}
                    href='javascript:void(0)'
                    className='relative'
                    onClick = {this.handleOnClick }
                    title= {localeStore.instance.TranslateText('generic.navigation-bar.inbox-tooltip') }>
                    <span className='relative'>
                        <span className='sprite-icon notification-icon'>
                            {localeStore.instance.TranslateText('generic.navigation-bar.inbox-tooltip') }
                        </span>
                        { this.getMessageCountRenderer() }
                        <span className = 'nav-text'>{localeStore.instance.TranslateText('generic.navigation-bar.inbox') }</span>
                    </span>
                </a>
            </li>
        );
    }

    /**
     * Component mounted
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        qigStore.instance.addListener(qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, this.onStandardisationSetupCompletion);
    }

    /**
     * Component unmounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        qigStore.instance.removeListener(qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, this.onStandardisationSetupCompletion);
    }

    /**
     * Handles the click
     * @param {any} source
     * @returns
     */
    private handleOnClick = (source: any): any => {

        // If  application is not online and will not be able to navihge, should show message
        // to let the user know that the connection problem
        if (!applicationActionCreator.checkActionInterrupted()) {
            return;
        }


        if (navigationStore.instance.containerPage === enums.PageContainers.WorkList &&
            simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
            simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.Message, enums.PageContainers.Message);
        } else {
            this.LoadMessage();
        }


    };

    /**
     * Get's the message count span div if unread message is available for the logged in examiner
     */
    private getMessageCountRenderer() {
        if (this.props.messageNotificationCount > 0) {
            return <span className='notification-count notification circle' id='id_notification_count'>
                {(this.props.messageNotificationCount).toLocaleString(localeStore.instance.Locale)}
            </span>;
        }
    }
    /**
     * Go to Load message inbox page after saving mark if there is any
     */
    private LoadMessage() {
        let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
            markingHelper.canNavigateAwayFromCurrentResponse();
        if (responseNavigationFailureReasons.length > 0) {
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toInboxMessagePage);
        } else {
            if (markingStore.instance.isMarkingInProgress ||
                responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
                /* Save the selected mark scheme mark to the mark collection on response move */
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toInboxMessagePage);
            } else {
                // set the marker operation mode as Marking
                userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
                navigationHelper.loadMessagePage();
            }
        }
    }
    /**
     * Go to message inbox page after saving mark if there is any
     */
    private navigateAwayFromResponse = (): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toInboxMessagePage) {
            if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                // set the marker operation mode as Marking
                userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
            }
            navigationHelper.loadContainerIfNeeded(
                navigationStore.instance.containerPage,
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox,
                this.context);
        }
    };

    /**
     * On standardisation setup completion
     */
    private onStandardisationSetupCompletion = () => {
        if (qigStore.instance.navigateToAfterStdSetupCheck === enums.PageContainers.Message &&
            !qigStore.instance.isStandardisationsetupCompletedForTheQig &&
            !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
            if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                this.LoadMessage();
            } else {
                navigationHelper.loadMessagePage();
            }
        }
    }
}

export = MessageNotificationIndicator;