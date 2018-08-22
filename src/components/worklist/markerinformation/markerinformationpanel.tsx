/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import SupervisorInformation = require('./supervisorinformation');
import PersonalInformation = require('./personalinformation');
import markerInformationActionCreator = require('../../../actions/markerinformation/markerinformationactioncreator');
import markerInformation = require('../../../stores/markerinformation/typings/markerinformation');
import ExaminerStateChangeButton = require('./examinerstatechangebutton');
import enums = require('../../utility/enums');
import configurablecharacteristicshelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurablecharacteristicsnames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import qigStore = require('../../../stores/qigselector/qigstore');
import targetsummarystore = require('../../../stores/worklist/targetsummarystore');
import MarkingCheckButton = require('./markingcheckbutton');
import worklistStore = require('../../../stores/worklist/workliststore');
import helpExaminersDataHelper = require('../../../utility/teammanagement/helpers/helpexaminersdatahelper');
import localeStore = require('../../../stores/locale/localestore');
import markingCheckActionCreator = require('../../../actions/markingcheck/markingcheckactioncreator');
import responseSearchHelper = require('../../../utility/responsesearch/responsesearchhelper');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import warningMessageStore = require('../../../stores/teammanagement/warningmessagestore');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    markerInformation: markerInformation;
    renderedOn: number;
    showMessagePopup: Function;
    isTeamManagementMode: boolean;
    showExaminerStateChangePopup: Function;
    showMessageLink: boolean;
}

/**
 * States of the component
 */
interface State {
    renderedOn?: number;
}

/**
 * React class for marker information panel.
 */
class MarkerInformationPanel extends pureRenderComponent<Props, State> {

    private markerInformationPanelElement: Element;

    private isSeniorExaminerPoolEnabledCC: boolean;
    private doDisableRequestMakingCheckButton: boolean;
    private markingTargetsSummary: Immutable.List<any>;
    private sepActions: Array<number>;
    private helpExaminersDataHelper: helpExaminersDataHelper;
    private isExaminerChangeStatusInProgress: boolean;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.helpExaminersDataHelper = new helpExaminersDataHelper();
        this.getMarkCheckInfo = this.getMarkCheckInfo.bind(this);
        this.renderMarkingCheckDetails = this.renderMarkingCheckDetails.bind(this);
        this.doDisableRequestMakingCheckButton = false;
        this.isExaminerChangeStatusInProgress = false;
        this.state = { renderedOn: Date.now() };
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {

        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_STATUS_UPDATED, this.renderMarkingCheckDetails);
        worklistStore.instance.addListener(worklistStore.WorkListStore.DO_GET_MARKING_CHECK_INFO, this.getMarkCheckInfo);
        worklistStore.instance.addListener(worklistStore.WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT,
            this.renderMarkingCheckDetails);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);

        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {

            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY,
                this.setExaminerStateChangeButtonAsBusy);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED,
                this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED,
                this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.addListener(
                teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                this.resetExaminerChangeStatusButtonBusyStatus);
            warningMessageStore.instance.addListener(
                warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
                this.resetExaminerChangeStatusButtonBusyStatus);
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {

        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_STATUS_UPDATED, this.renderMarkingCheckDetails);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.DO_GET_MARKING_CHECK_INFO, this.getMarkCheckInfo);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT,
            this.renderMarkingCheckDetails);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);

        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY,
                this.setExaminerStateChangeButtonAsBusy);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED,
                this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED,
                this.resetExaminerChangeStatusButtonBusyStatus);
            teamManagementStore.instance.removeListener(
                teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                this.resetExaminerChangeStatusButtonBusyStatus);
            warningMessageStore.instance.removeListener(
                warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
                this.resetExaminerChangeStatusButtonBusyStatus);
        }
    }

    /**
     * Change Examiner Change Status Button In Progress Status
     */
    private resetExaminerChangeStatusButtonBusyStatus = () => {
        this.isExaminerChangeStatusInProgress = false;
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Set the examiner state change button as busy
     */
    private setExaminerStateChangeButtonAsBusy = () => {
        this.isExaminerChangeStatusInProgress = true;
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Render component
     */
    public render() {
        if (this.props.markerInformation == null) {
            return (<div>
                <span className='loader darker text-middle'>
                    <span className='dot'></span><span className='dot'></span><span className='dot'></span>
                </span>
            </div>);
        }

        let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;

        this.isSeniorExaminerPoolEnabledCC = configurablecharacteristicshelper.getCharacteristicValue(
            configurablecharacteristicsnames.SeniorExaminerPool, markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        let isChangeStatusButtonDisabled: boolean;

        if (this.props.isTeamManagementMode && !this.isSeniorExaminerPoolEnabledCC) {

            let isSubordinateApproved: boolean = (this.props.markerInformation.approvalStatus === enums.ExaminerApproval.Approved);

            // Disable change status button if required targets are not met.
            isChangeStatusButtonDisabled = !this.isRequiredTargetsMetForChangeStatus();

            // If subordinate examiner is approved, the targets need not be considered for enabling the button
            isChangeStatusButtonDisabled = isSubordinateApproved ? false : isChangeStatusButtonDisabled;
        }

        let examinerStateChangeButton: JSX.Element;

        if (!this.isSeniorExaminerPoolEnabledCC &&
            this.props.isTeamManagementMode &&
            this.props.markerInformation.currentExaminerApprovalStatus === enums.ExaminerApproval.Approved) {
            examinerStateChangeButton = <ExaminerStateChangeButton
                id='change_examiner_status'
                key='key_change_examiner_status'
                showExaminerStateChangePopup={this.props.showExaminerStateChangePopup}
                selectedLanguage={this.props.selectedLanguage}
                isDisabled={(this.isExaminerChangeStatusInProgress || isChangeStatusButtonDisabled) &&
                    applicationStore.instance.isOnline} />;
        }

        // If senior examiner pool is enabled then invoke a method to get the SEP actions.
        if (this.isSeniorExaminerPoolEnabledCC &&
            this.props.isTeamManagementMode &&
            qigStore.instance.selectedQIGForMarkerOperation) {
            this.sepActions = this.helpExaminersDataHelper.
                getSEPActions(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            if (this.sepActions) {
                // We dont want to include the Message action to show the Change status button
                let sendMessageIndex = this.sepActions.indexOf(enums.SEPAction.SendMessage);
                if (sendMessageIndex > -1) {
                    this.sepActions.splice(sendMessageIndex, 1);
                }
                if (this.sepActions.length > 0) {
                    examinerStateChangeButton = <ExaminerStateChangeButton
                        id='change_examiner_status'
                        key='key_change_examiner_status'
                        showExaminerStateChangePopup={this.props.showExaminerStateChangePopup}
                        selectedLanguage={this.props.selectedLanguage}
                        isDisabled={this.isExaminerChangeStatusInProgress && applicationStore.instance.isOnline} />;
                }
            }
        }

        let markingCheckButton: JSX.Element = this.isMarkingCheckAvialable ?
            <MarkingCheckButton
                id='marking_check_button'
                key='marking_check_button'
                disable={this.doDisableRequestMakingCheckButton}
                onMarkingCheckButtonClick={this.onMarkingCheckButtonClick}
                selectedLanguage={this.props.selectedLanguage} /> : null;

		let supervisor = null;

		// Hide supervisor information from lefthand side if the current user is a Admin Remarker.
		if (this.props.markerInformation.markerRoleID !== enums.ExaminerRole.adminRemarker) {
			supervisor = (<SupervisorInformation supervisorName={this.props.markerInformation.formattedSupervisorName}
				selectedLanguage={this.props.selectedLanguage} isSupervisorOnline={this.props.markerInformation.supervisorLoginStatus}
				supervisorLogoutDiffInMinutes={this.props.markerInformation.supervisorLogoutDiffInMinute}
                showMessagePopup={this.props.showMessagePopup} isTeamManagementMode={this.props.isTeamManagementMode}
                showMessageLink={this.props.showMessageLink} />);
		}

		return (<div className='profile-info'>
			{supervisor}
            <PersonalInformation
                examinerName={this.props.markerInformation.formattedExaminerName}
                approvalStatus={this.props.markerInformation.approvalStatus}
                qualityFeedbackStatus={this.props.markerInformation.hasQualityFeedbackOutstanding}
                examinerRole={this.props.markerInformation.markerRoleID}
                selectedLanguage={this.props.selectedLanguage}
                isTeamManagementMode={this.props.isTeamManagementMode}
                showMessagePopup={this.props.showMessagePopup}
                markingCheckStatus={this.getMarkingCheckStatus()} />
            {examinerStateChangeButton}
            {markingCheckButton}
        </div>);
    }

    /**
     * gets a value indicating whether marking check button is available
     */
    private get isMarkingCheckAvialable(): boolean {
        // worklistStore.instance.isMarkingCheckAvailable will be true
        // only when all the required conditions are met and a gateway call
        // from reponsearchhelper.ts : openQIGDetails() updates the worklist store.
        // this value will be reset when a new QIG is selected.
        return worklistStore.instance.isMarkingCheckAvailable;
    }

    /**
     * Rerender the marking check button
     */
    private renderMarkingCheckDetails = (): void => {
        this.doDisableRequestMakingCheckButton = false;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * getting mark check info
     */
    private getMarkCheckInfo = (): void => {
        // fix to ensure the RequestMakingCheckButton doesn't stay disabled when going offline
        this.doDisableRequestMakingCheckButton = true;
        markingCheckActionCreator.getMarkingCheckInfo(responseSearchHelper.isMarkingCheckAvailable(),
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
    };

    /**
     * Returns a value indicating the examiner marking check status
     */
    private getMarkingCheckStatus(): string {
        if (this.isMarkingCheckAvialable) {
            return localeStore.instance.TranslateText('marking.worklist.marking-check-status.' +
                enums.MarkingCheckStatus[worklistStore.instance.markingCheckStatus]);
        }
    }

    /**
     * Actions to be done when marking check button is clicked
     */
    private onMarkingCheckButtonClick = (): void => {
        markingCheckActionCreator.getMarkingCheckRecipients(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
    }

    /**
     *  This will check whether the required targets are met so that the change status button will be enabled.
     */
    private isRequiredTargetsMetForChangeStatus(): boolean {

        // All Standardisation / 2nd Standardisation / STM Standardisation (in Submitted-Closed)
        // need to be 'Set as Reviewed' for 'Change status' button to be enabled.
        let isMarkingTargetReviewed: boolean = true;
        this.markingTargetsSummary = targetsummarystore.instance.getExaminerMarkingTargetProgress();
        if (this.markingTargetsSummary) {
            this.markingTargetsSummary.some((summary: any) => {
                if (summary.markingModeID === enums.MarkingMode.Approval ||
                    summary.markingModeID === enums.MarkingMode.ES_TeamApproval) {
                    isMarkingTargetReviewed =
                        (summary.closedResponsesCount >= summary.maximumMarkingLimit &&
                            summary.reviewedResponsesCount === summary.closedResponsesCount);

                    // If atleast one target is not reviewed exit the loop.
                    if (!isMarkingTargetReviewed) {
                        return true;
                    }
                }
            });
        }

        // Finally return the status.
        return isMarkingTargetReviewed;
    }

    /**
     * Actions to be done when online status changed
     */
    private onOnlineStatusChanged = (): void => {
        this.isExaminerChangeStatusInProgress = false;
    }
}

export = MarkerInformationPanel;