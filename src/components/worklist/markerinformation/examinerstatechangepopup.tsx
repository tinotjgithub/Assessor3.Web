import React = require('react');
import localeStore = require('../../../stores/locale/localestore');
let classNames = require('classnames');
import GenericButton = require('../../utility/genericbutton');
import enums = require('../../utility/enums');
import ExaminerStateChangeOption = require('./examinerstatechangeoption');
import pureRenderComponent = require('../../base/purerendercomponent');
import qigStore = require('../../../stores/qigselector/qigstore');
import operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
import markerInformation = require('../../../stores/markerinformation/typings/markerinformation');
import helpExaminersDataHelper = require('../../../utility/teammanagement/helpers/helpexaminersdatahelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import stringHelper = require('../../../utility/generic/stringhelper');
import constants = require('../../utility/constants');
import Immutable = require('immutable');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');

let teamManagementActionCreator;
let examinerStatuseArguments;
let teamManagementStore;
let secondStandardisationArguments;
let qigActionCreator;
let worklistActionCreator;

interface Props extends LocaleSelectionBase, PropsBase {
    currentState: enums.ExaminerApproval;
    markerInformation: markerInformation;
}

interface State {
    renderedOn?: number;
}

/**
 * ExaminerStateChangePopup contain team change status options, ok and cancel buttons.
 * @param props
 * @param state
 */
class ExaminerStateChangePopup extends pureRenderComponent<Props, State> {

    private isApprovedChecked: boolean;
    private isSuspendedOptionChecked: boolean;
    private iscurrentStateChecked: boolean;
    private isSecondStandardisationAvailableChecked: boolean;
    private selectedExaminerStatus: enums.ChangeStatusOptions;
    private isSecondStandardisationOptionAvailable: boolean;
    private isShowPopup: boolean;
    private sepActions: Array<number>;
    private helpExaminersDataHelper: helpExaminersDataHelper;
    private defaultSelectedOption: enums.ChangeStatusOptions = enums.ChangeStatusOptions.None;
    private isReApprovedChecked: boolean;
    private isApprovedPendingReviewChecked: boolean;

    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0
        };

        this.saveChangeExaminerStateSelection = this.saveChangeExaminerStateSelection.bind(this);
        this.cancelExaminerStateChangeSelection = this.cancelExaminerStateChangeSelection.bind(this);
        this.isSecondStandardisationOptionAvailable = false;
        this.isShowPopup = false;
        this.toggleExaminerChangeStatusPopup = this.toggleExaminerChangeStatusPopup.bind(this);
        this.helpExaminersDataHelper = new helpExaminersDataHelper();
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {

        let approvedState: JSX.Element;
        let secondStandardisationState: JSX.Element;
        let aprovedPendingReviewState: JSX.Element;
        let currentSelectedState: JSX.Element = null;
        let reapprovedState: JSX.Element;
        let suspendedState: JSX.Element;
        let formattedString: string;
        if (this.sepActions && this.sepActions.length > 0) {
 // SEP OPTIONS
            this.sepActions.forEach((sepaction: number) => {
                if (sepaction === enums.SEPAction.ProvideSecondStandardisation) {
                    secondStandardisationState = (<ExaminerStateChangeOption
                        id ='changeStatusStnd'
                        key='changeStatusStnd'
                        isChecked = { this.isSecondStandardisationAvailableChecked }
                        stateText = {localeStore.instance.
                            TranslateText('team-management.examiner-worklist.change-status-sep.' +
                            enums.SEPAction[sepaction]) }
                        onSelectionChange = { this.onSelectionChange.bind(this, enums.ChangeStatusOptions.SendForSecondStandardisation) }
                        selectedLanguage = {this.props.selectedLanguage}/>);
                }
                if (sepaction === enums.SEPAction.Approve) {
                    approvedState = (<ExaminerStateChangeOption
                        id ='changeStatusApprove'
                        key='changeStatusApprove'
                        isChecked = { this.isApprovedChecked }
                        stateText = {localeStore.instance.
                            TranslateText('team-management.examiner-worklist.change-status-sep.' +
                            enums.SEPAction[sepaction]) }
                        onSelectionChange = { this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Approved) }
                        selectedLanguage = {this.props.selectedLanguage}/>);
                }
                if (sepaction === enums.SEPAction.Re_approve) {
                    reapprovedState = (<ExaminerStateChangeOption
                        id ='changeStatusReApprove'
                        key='changeStatusReApprove'
                        isChecked = { this.isReApprovedChecked }
                        stateText = {stringHelper.format(localeStore.instance.
                            TranslateText('team-management.examiner-worklist.change-status-sep.' +
                            enums.SEPAction[sepaction]), [constants.NONBREAKING_HYPHEN_UNICODE]) }
                        onSelectionChange = { this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Re_approve) }
                        selectedLanguage = {this.props.selectedLanguage}/>);
                }
            });
        } else {

            // NON SEP Options
            currentSelectedState = (<ExaminerStateChangeOption
                id='defaultSelectedState'
                key='defaultSelectedState'
                isChecked={this.iscurrentStateChecked}
                stateText={localeStore.instance.TranslateText('generic.approval-statuses.' +
                    enums.ExaminerApproval[this.props.currentState])}
                onSelectionChange={this.onSelectionChange.bind(this, this.defaultSelectedOption)}
                selectedLanguage={this.props.selectedLanguage} />);

            if (this.props.currentState === enums.ExaminerApproval.Approved){

                suspendedState = (<ExaminerStateChangeOption
                    id='changeStatusSuspend'
                    key='changeStatusSuspend'
                    isChecked={this.isSuspendedOptionChecked}
                    stateText={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.suspend')}
                    onSelectionChange={this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Suspended)}
                    selectedLanguage={this.props.selectedLanguage} />);
            }

            if (this.props.currentState === enums.ExaminerApproval.Suspended ||
                this.props.currentState === enums.ExaminerApproval.NotApproved) {

                approvedState = (<ExaminerStateChangeOption
                    id='changeStatusApprove'
                    key='changeStatusApprove'
                    isChecked={this.isApprovedChecked}
                    stateText={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.approve')}
                    onSelectionChange={this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Approved)}
                    selectedLanguage={this.props.selectedLanguage} />);

                aprovedPendingReviewState = (<ExaminerStateChangeOption
                    id='changeStatusApprovePendingReview'
                    key='changeStatusaprovedPendingReview'
                    isChecked={this.isApprovedPendingReviewChecked}
                    stateText={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.approve-pending-review')}
                    onSelectionChange={this.onSelectionChange.bind(this, enums.ChangeStatusOptions.AprovedPendingReview)}
                    selectedLanguage={this.props.selectedLanguage} />);
            }

            if (this.props.currentState === enums.ExaminerApproval.NotApproved) {

                secondStandardisationState = (this.isSecondStandardisationOptionAvailable ? <ExaminerStateChangeOption
                    id ='changeStatusStnd'
                    key='changeStatusStnd'
                    isChecked={this.isSecondStandardisationAvailableChecked}
                    stateText={localeStore.instance.
                        TranslateText('team-management.examiner-worklist.change-status.send-second-standardisation') }
                    onSelectionChange = { this.onSelectionChange.bind(this, enums.ChangeStatusOptions.SendForSecondStandardisation) }
                    selectedLanguage = {this.props.selectedLanguage}/> : null);
            }

            if (this.props.currentState === enums.ExaminerApproval.ApprovedReview) {
                approvedState = (<ExaminerStateChangeOption
                    id='changeStatusApprove'
                    key='changeStatusApprove'
                    isChecked={this.isApprovedChecked}
                    stateText={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.approve')}
                    onSelectionChange={this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Approved)}
                    selectedLanguage={this.props.selectedLanguage} />);

                suspendedState = (<ExaminerStateChangeOption
                    id='changeStatusSuspend'
                    key='changeStatusSuspend'
                    isChecked={this.isSuspendedOptionChecked}
                    stateText={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.suspend')}
                    onSelectionChange={this.onSelectionChange.bind(this, enums.ChangeStatusOptions.Suspended)}
                    selectedLanguage={this.props.selectedLanguage} />);
            }
        }

        return (
            <div className={classNames('popup small change-status popup-overlay ',
                { 'open': this.isShowPopup }) }
                id='changeStatus' role='dialog' aria-labelledby='popup1Title' aria-describedby='popup1Desc'>
                <div className='popup-wrap'>
                    <div className='popup-content' id='popup1Desc'>
                        {currentSelectedState}
                        {approvedState}
                        {aprovedPendingReviewState}
                        {reapprovedState}
                        {secondStandardisationState}
                        {suspendedState}
                    </div>
                     <div className='popup-footer text-right'>
                        <GenericButton
                            id={ 'button-rounded-close-button' }
                            key={'key_button rounded close-button' }
                            className={'button rounded close-button'}
                            title={localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button') }
                            content={localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button') }
                            disabled={false}
                            onClick={this.cancelExaminerStateChangeSelection}
                            selectedLanguage = {this.props.selectedLanguage}/>
                        <GenericButton
                            id={ 'button-primary-rounded-button' }
                            key={'key_button primary rounded-button' }
                            className={'button primary rounded'}
                            title={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button') }
                            content={localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button') }
                            disabled={false}
                            onClick={this.saveChangeExaminerStateSelection}
                            selectedLanguage = {this.props.selectedLanguage}/>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        this.loadDependencies();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        this.removeEventListeners();
    }

    /**
     *  This will load the dependencies for team management dynamically during component mount.
     */
    private loadDependencies() {
        require.ensure([
            '../../../actions/teammanagement/teammanagementactioncreator',
            '../../../dataservices/teammanagement/typings/setexaminerstatusearguments',
            '../../../stores/teammanagement/teammanagementstore',
            '../../../dataservices/teammanagement/typings/setsecondStandardisationarguments',
            '../../../actions/qigselector/qigselectoractioncreator',
            '../../../actions/worklist/worklistactioncreator'],

            function () {
                teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
                examinerStatuseArguments = require('../../../dataservices/teammanagement/typings/setexaminerstatusearguments');
                teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
                secondStandardisationArguments = require('../../../dataservices/teammanagement/typings/setsecondStandardisationarguments');
                qigActionCreator = require('../../../actions/qigselector/qigselectoractioncreator');
                worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');

                this.addEventListeners();

            }.bind(this));
    }

    /**
     * Hook all event listeners for team management here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    private addEventListeners() {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {

            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED,
                this.toggleExaminerChangeStatusPopup);
        }
    }

    /**
     * Remove all event listeners for team management here.
     */
    private removeEventListeners() {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {

            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED,
                this.toggleExaminerChangeStatusPopup);
        }
    }

    /**
     * Save examiner state change selection in to data base.
     */
   private saveChangeExaminerStateSelection = () => {

        this.isShowPopup = false;
        this.setState({ renderedOn: Date.now() });
        //On clicking OK button in change examiner status popup
        // Please check whether application is online.
        // If yes, proceed with saving the examiner status otherwise interrupt action.
        if (applicationStore.instance.isOnline) {

            // Save examiner status only if the selected approval status not equal to current status.
            // do save only if some other option is being selected

            if (this.selectedExaminerStatus !== this.defaultSelectedOption) {

                teamManagementActionCreator.setExaminerChangeStatusButtonBusy();

                if (this.sepActions && this.sepActions.length > 0) {

                    // SEP Action Execution
                    this.executeSEPApprovalManagementAction();

                } else {
                    if (this.selectedExaminerStatus === enums.ChangeStatusOptions.SendForSecondStandardisation) {

                        // Non SEP Send For Second STD
                        this.provideSecondStandardisation();

                    } else {

                        // Non SEP Status Change
                        this.changeExaminerStatus();
                    }
                }
            }
        } else {
            applicationActionCreator.checkActionInterrupted();
        }
    };

    /**
     * Save examiner state change selection in to data base.
     */
    private onSelectionChange = (changeStateOption: enums.ChangeStatusOptions) => {

        this.isApprovedChecked = false;
        this.iscurrentStateChecked = false;
        this.isSecondStandardisationAvailableChecked = false;
        this.isReApprovedChecked = false;
        this.isSuspendedOptionChecked = false;
        this.isApprovedPendingReviewChecked = false;
        switch (changeStateOption) {
            case this.defaultSelectedOption:
                this.iscurrentStateChecked = true;
                break;
            case enums.ChangeStatusOptions.Approved:
                this.isApprovedChecked = true;
                break;
            case enums.ChangeStatusOptions.Suspended:
                this.isSuspendedOptionChecked = true;
                break;
            case enums.ChangeStatusOptions.SendForSecondStandardisation:
                this.isSecondStandardisationAvailableChecked = true;
                break;
            case enums.ChangeStatusOptions.Re_approve:
                this.isReApprovedChecked = true;
                break;
            case enums.ChangeStatusOptions.AprovedPendingReview:
                this.isApprovedPendingReviewChecked = true;
                break;
        }

        this.selectedExaminerStatus = changeStateOption;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Cancel the examiner state change selection.
     */
    private cancelExaminerStateChangeSelection = () => {
        this.isShowPopup = false;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Verify second standardisation available or not.
     */
    private verifySecondStandardisationOptionAvailable() {
        if (qigStore && qigStore.instance.selectedQIGForMarkerOperation) {
            if (qigStore.instance.selectedQIGForMarkerOperation.hasSecondStandardisationResponseClassified) {
                if (!qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember) {
                    if (qigStore.instance.selectedQIGForMarkerOperation.markingTargets) {
                        this.isSecondStandardisationOptionAvailable = !this.isSecondStandardisationTargetAvailable();
                    }
                }
            }
        }
    }

    /**
     * Verify second standardisation target available or not.
     */
    private isSecondStandardisationTargetAvailable() {
        return qigStore.instance.selectedQIGForMarkerOperation.markingTargets.some((target: any) =>
            target.markingMode === enums.MarkingMode.ES_TeamApproval);
    }

    /**
     * Bind change status option.
     */
    private bindChangeStatusOption() {

        if (qigStore && qigStore.instance.selectedQIGForMarkerOperation) {
            this.sepActions = this.helpExaminersDataHelper.
                getSEPActions(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
        }

        this.iscurrentStateChecked = false;
        this.isApprovedChecked = false;
        this.isSecondStandardisationAvailableChecked = false;
        this.isReApprovedChecked = false;
        this.isSuspendedOptionChecked = false;
        this.isApprovedPendingReviewChecked = false;

        if (this.sepActions && this.sepActions.length > 0) {

            // For SEP Actions, the defaultSelectedOption is none as it should be.
            // New set of SEP actions will be displayed and
            // the first one in the list will be set as selected.

            this.sepActions.forEach((sepaction: enums.SEPAction) => {

                switch (sepaction) {

                    case enums.SEPAction.Approve:
                        this.isApprovedChecked = true;
                        this.selectedExaminerStatus = enums.ChangeStatusOptions.Approved;
                        return;

                    case enums.SEPAction.Re_approve:
                        this.isReApprovedChecked = true;
                        this.selectedExaminerStatus = enums.ChangeStatusOptions.Re_approve;
                        return;

                    case enums.SEPAction.ProvideSecondStandardisation:
                        this.isSecondStandardisationAvailableChecked = true;
                        this.selectedExaminerStatus = enums.ChangeStatusOptions.SendForSecondStandardisation;
                        return;
                }
            });
        } else {

            // For Non SEP, when the popup is loaded,
            // Selected Option and the Default Option must be the examiner approval status.

            switch (this.props.currentState) {
                case enums.ExaminerApproval.NotApproved:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.NotApproved;
                    break;
                case enums.ExaminerApproval.Suspended:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.Suspended;
                    break;
                case enums.ExaminerApproval.Approved:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.Approved;
                    break;
                case enums.ExaminerApproval.ApprovedReview:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.AprovedPendingReview;
                    break;
                default:
                    this.defaultSelectedOption = enums.ChangeStatusOptions.None;
                    break;
            }

            this.iscurrentStateChecked = true;

            this.selectedExaminerStatus = this.defaultSelectedOption;

            this.verifySecondStandardisationOptionAvailable();
        }
    }

    /**
     * Handles the action event for showing change status popup.
     */
    private toggleExaminerChangeStatusPopup = (isPopupVisible: boolean) => {
        this.bindChangeStatusOption();
        this.isShowPopup = isPopupVisible;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Method to change the examiner status in Non SEP.
     */
    private changeExaminerStatus() {

        let newStatus: enums.ExaminerApproval;

        switch (this.selectedExaminerStatus) {

            case enums.ChangeStatusOptions.Approved:
                newStatus = enums.ExaminerApproval.Approved;
                break;
            case enums.ChangeStatusOptions.NotApproved:
                newStatus = enums.ExaminerApproval.NotApproved;
                break;
            case enums.ChangeStatusOptions.Suspended:
                newStatus = enums.ExaminerApproval.Suspended;
                break;
            case enums.ChangeStatusOptions.AprovedPendingReview:
                newStatus = enums.ExaminerApproval.ApprovedReview;
                break;
        }

        examinerStatuseArguments = {
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerStatus: newStatus,
            questionPaperPartId: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            previousExaminerStatus: this.props.currentState,
            loggedInExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
            subordinateExaminerId: teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerId : 0
        };

        teamManagementActionCreator.changeExaminerStatus(examinerStatuseArguments);
    }

    /**
     * Method to provide second standardisation for an examiner.
     */
    private provideSecondStandardisation() {
        secondStandardisationArguments = {
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingModeId: enums.MarkingMode.Approval,
            loggedInExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
            subordinateExaminerId: teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerId : 0
        };

        teamManagementActionCreator.provideSecondStandardisation(secondStandardisationArguments);
    }

    /**
     * Method to execute SEP approval management action.
     */
    private executeSEPApprovalManagementAction() {

        let actionIdentifier: number;

        if (this.isApprovedChecked) {
            actionIdentifier = enums.SEPAction.Approve;
        } else if (this.isSecondStandardisationAvailableChecked) {
            actionIdentifier = enums.SEPAction.ProvideSecondStandardisation;
        } else if (this.isReApprovedChecked) {
            actionIdentifier = enums.SEPAction.Re_approve;
        }

        let dataCollection: Array<ExaminerForSEPAction> = new Array<ExaminerForSEPAction>();
        let examinerSEPAction: ExaminerForSEPAction = {
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            requestedByExaminerRoleId: operationModeHelper.authorisedExaminerRoleId
        };
        dataCollection.push(examinerSEPAction);
        let examinerSEPActions = Immutable.List<ExaminerForSEPAction>(dataCollection);

        let doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument = {
            actionIdentifier: actionIdentifier,
            examiners: examinerSEPActions
        };

        teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
    }
}

export = ExaminerStateChangePopup;