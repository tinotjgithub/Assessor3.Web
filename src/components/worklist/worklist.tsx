/* tslint:disable:no-unused-variable */
/** Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import enums = require('../utility/enums');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import Immutable = require('immutable');
import Header = require('../header');
import allocateResponseHelper = require('../utility/responseallocation/allocateresponseshelper');
import markerprogressdata = require('../../stores/worklist/typings/markerprogressdata');
import markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
declare let config: any;
import navigationHelper = require('../utility/navigation/navigationhelper');
import Promise = require('es6-promise');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import useroptionKeys = require('../../utility/useroption/useroptionkeys');
import userOptionsStore = require('../../stores/useroption/useroptionstore');
import stringHelper = require('../../utility/generic/stringhelper');
import markerInformation = require('../../stores/markerinformation/typings/markerinformation');
import getExceptionTypesArguments = require('../../dataservices/exception/getexceptiontypesarguments');
import ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import submitHelper = require('../utility/submit/submithelper');
import MarkingInstructionPanel = require('./markerinformation/markinginstructionpanel');
import urls = require('../../dataservices/base/urls');
import MultiOptionConfirmationDialog = require('../utility/multioptionconfirmationdialog');
import atypicalResponseSearchResult = require('../../dataservices/response/atypicalresponsesearchresult');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import allocatedResponseData = require('../../stores/response/typings/allocatedresponsedata');
import responseHelper = require('../utility/responsehelper/responsehelper');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import dataServiceHelper = require('../../utility/generic/dataservicehelper');
import workListDataHelper = require('../../utility/worklist/worklistdatahelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import teamManagementAuditHelper = require('../utility/teammanagement/teammanagementlogginghelper');
import loggerConstants = require('../utility/loggerhelperconstants');
import ecourseworkfilestore = require('../../stores/response/digital/ecourseworkfilestore');
import scriptImageDownloadRequest = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloadrequest');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import loadMessageArguments = require('../../dataservices/messaging/loadmessagesarguments');
import allocatedResponse = require('../../stores/response/typings/allocatedresponse');
import htmlviewerhelper = require('../utility/responsehelper/htmlviewerhelper');
import markingInstructionStore = require('../../stores/markinginstruction/markinginstructionstore');
import MarkingInstructionFilePanel = require('./markerinformation/markinginstructionfilepanel');
import domManager = require('../../utility/generic/domhelper');
import markingInstructioActionCreator = require('../../actions/markinginstructions/markinginstructionactioncreator');
import markingInstructionArg = require('../../dataservices/markinginstructions/markinginstrcutionargument');
import responseSearchhelper = require('../../utility/responsesearch/responsesearchhelper');
/** Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor */

/* tslint:disable:variable-name */
let MarkerInformationPanel;
let localeStore;
let userOptionActionCreator;
let qigStore;
let examinerstore;
let WorkListMessage;
let ConfirmationDialog;
let MarkingProgress;
let stampStore;
let responseSearchHelper;
let Targets;
let overviewData;
let qigInfo;
let markingTarget;
let targetSummaryStore;
let markingTargetSummary;
let userOptionStore;
let WorkListContainer;
let worklistStore;
let markSchemeStructureStore;
let responseStore;
let worklistActionCreator;
let GenericDialog;
let responseAllocationValidationHelper;
let responseAllocationValidationParameter;
let classNames;
let busyIndicatorStore;
let submitStore;
let worklistComponentHelper;
let submitActionCreator;
let busyIndicatorActionCreator;
let scriptImageDownloadHelper;
let scriptActionCreator;
let scriptStore;
let scriptImageDownloader;
let targetHelper;
let userInfoStore;
let backgroundPulseHelper;
let Footer;
let gaHelper;
let stampActionCreator;
let configurableCharacteristicsStore;
let configurableCharacteristicsActionCreator;
let qigActionCreator;
let exceptionActionCreator;
let exceptionStore;
let MessagePopup;
let messageHelper;
let messagingActionCreator;
let messageStore;
let MarkingCheckPopup;
let stringFormatHelper;
let htmlUtilities;
let loadContainerActionCreator;
let operationModeHelper;
let teamManagementActionCreator;
let MarkCheckExaminers;
let markingCheckActionCreator;
let userInfoActionCreator;
let ExaminerStateChangePopup;
let helpExaminersDataHelper;
let warningMessageStore;
let warningMessageNavigationHelper;
let markingInstructionActionCreator;

/* tslint:enable:variable-name */

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    downloadUrl: string;
    isFromMenu: boolean;
    renderedOn?: number;
}
/* tslint:disable:no-empty-interfaces */

/**
 * State of a component
 */
interface State {
    isLogoutConfirmationPopupDisplaying?: boolean;
    isWorkListUpdated?: boolean;
    renderedOn?: number;
    targetRenderedOn?: number;
    enableNavigationPanelVisibility?: boolean;
    isResponseAllocationErrorDialogDisplaying?: boolean;
    errorDialogHeaderText?: string;
    errorDialogContentText?: string;
    isBusy?: boolean;
    modulesLoaded?: boolean;
    isAtypicalSearchResultPopupDisplaying?: boolean;
    isAtypicalSearchFailurePopupDisplaying?: boolean;
    isMarkingInstructionPanelOpen?: boolean;
    isMarkingInstructionPanelClicked?: boolean;
    markingInstructionPanelRenderedOn?: number;
}

interface Item {
    id: number;
    name: string;
    parentExaminerDisplayName: string;
    parentExaminerId: number;
    questionPaperPartId: number;
}
/**
 * React component for Worklist/Landing
 */
class WorkList extends pureRenderComponent<Props, State> {

    private markerInformation: markerInformation;
    private markingTargetsSummary: Immutable.List<any>;
    private worklistType: enums.WorklistType;
    private responseMode: enums.ResponseMode;
    private worklistTabDetails: Array<WorklistTabDetails>;
    private remarkRequestType: enums.RemarkRequestType;
    private isDirectedRemark: boolean;
    /** flag to show busy indicator in worklist tabs */
    private isRefreshing: boolean = false;
    /* has data refresh started */
    private isContentRefreshStarted: boolean;
    /* has all the data refresh call succeeded set true initially it need only for standardization*/
    private isContentRefreshSucceeded = {
        isMarkingProgressCompleted: false,
        isWorklistRefreshCompleted: false
    };
    /* variable to identify whether the exam body CC is loaded or not */
    private isExamBodyCCLoaded: boolean = false;
    private isSubmitCompleted: boolean;
    private isAllocationCompleted: boolean;
    // this variable will hold the message panel visiblity status.
    private isMessagePopupVisible: boolean = false;
    private subject: string = '';
    private priorityDropdownSelectedItem: enums.MessagePriority = enums.MessagePriority.Standard;
    private selectedQigItemId: number;
    private messageBody: string;
    private qigListItems: Array<Item> = new Array<Item>();
    private isTouchStarted: boolean = false;
    private isMouseHovered: boolean = false;
    private isSecondStandardisationTargetReceived: boolean;
    private atypicalPopupContent: string;
    private storageAdapterHelper = new storageAdapterHelper();
    private _warningMessageNavigationHelper;
    private failureCode: enums.FailureCode = enums.FailureCode.None;
    private warningMessageAction: enums.WarningMessageAction = enums.WarningMessageAction.None;
    private isSelectedMenuTargetCompleted: boolean = false;
    private hasTargetFound: boolean = true;
    private columnLeftScrollWidth: number = 0;
    private _boundHandleOnClick: EventListenerObject = null;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.worklistType = enums.WorklistType.none;
        /* binding the parent(current) context to showLogoutConfirmation which is passed as prop to child and executing inside child */
        /* On navigating to worklist from response screen, prevent animation of the expand/collapse if we have user options loaded */
        let isMarkerInfoPanelExpanded: boolean = true;
        if (userOptionsStore.instance.isLoaded) {
            isMarkerInfoPanelExpanded = userOptionsHelper.getUserOptionByName
                (useroptionKeys.MARKER_INFO_PANEL_EXPANDED) === 'false' ? false : true;
        }
        this.state = {
            isLogoutConfirmationPopupDisplaying: false,
            isWorkListUpdated: false,
            renderedOn: this.props.renderedOn,
            enableNavigationPanelVisibility: isMarkerInfoPanelExpanded,
            isResponseAllocationErrorDialogDisplaying: false,
            errorDialogHeaderText: '',
            errorDialogContentText: '',
            isBusy: false,
            modulesLoaded: false,
            isAtypicalSearchResultPopupDisplaying: false,
            isAtypicalSearchFailurePopupDisplaying: false,
            isMarkingInstructionPanelOpen: false,
            isMarkingInstructionPanelClicked: false,
            markingInstructionPanelRenderedOn: this.props.renderedOn

        };
        this.onOkClickOfResponseAllocationErrorDialog = this.onOkClickOfResponseAllocationErrorDialog.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.switchTab = this.switchTab.bind(this);
        this.showExaminerStateChangePopup = this.showExaminerStateChangePopup.bind(this);
        this.examinerChangeStatusReceived = this.examinerChangeStatusReceived.bind(this);
        this.secondStandardisationReceived = this.secondStandardisationReceived.bind(this);
        this.refreshTargetProgress = this.refreshTargetProgress.bind(this);
        this.onMarkInstructionFileClick = this.onMarkInstructionFileClick.bind(this);
        this.onMarkInstructionPanelClick = this.onMarkInstructionPanelClick.bind(this);
        this.isSecondStandardisationTargetReceived = false;
        this._boundHandleOnClick = this.onMarkingInstructonClickHandler.bind(this);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        if (this.state.modulesLoaded) {
            let responseAllocationErrorDialog = (
                <GenericDialog content={this.state.errorDialogContentText}
                    header={this.state.errorDialogHeaderText}
                    displayPopup={this.state.isResponseAllocationErrorDialogDisplaying}
                    okButtonText={localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button')}
                    onOkClick={this.onOkClickOfResponseAllocationErrorDialog}
                    id='responseallocationerrordialog'
                    key='responseallocationerrordialog'
                    popupDialogType={enums.PopupDialogType.ResponseAllocationError} />
            );
            let popUpContent: JSX.Element[] = [];
            popUpContent.push(<p>{this.atypicalPopupContent}</p>);
            let atypicalSearchDialog = (this.state.isAtypicalSearchFailurePopupDisplaying) ?
                (<GenericDialog
                    content={this.atypicalPopupContent}
                    header={localeStore.instance.TranslateText('marking.worklist.worklist-headers.atypical')}
                    displayPopup={this.state.isAtypicalSearchFailurePopupDisplaying}
                    okButtonText={localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button')}
                    onOkClick={this.atypicalSearchfailureClick}
                    id='atypicalresponseallocationerrordialog'
                    key='atypicalresponseallocationerrordialog'
                    popupDialogType={enums.PopupDialogType.ResponseAllocationError} />)
                : (<MultiOptionConfirmationDialog
                    content={popUpContent}
                    header={localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.header')}
                    displayPopup={this.state.isAtypicalSearchResultPopupDisplaying}
                    onCancelClick={this.atypicalSearchCancelClick}
                    onYesClick={this.atypicalSearchMarkNowClick}
                    onNoClick={this.atypicalSearchMoveToClick}
                    isKeyBoardSupportEnabled={true}
                    selectedLanguage={this.props.selectedLanguage}
                    popupSize={enums.PopupSize.Medium}
                    popupType={enums.PopUpType.AtypicalSearch}
                    buttonCancelText={localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.cancel')}
                    buttonYesText={localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.mark-now')}
                    buttonNoText={localeStore.instance.TranslateText('marking.worklist.atypical-allocation-dialog.move-to-worklist')}
                    displayNoButton={true}
                />);

            let busyIndicator = (
                <BusyIndicator
                    id='busyIndicator'
                    key='busyIndicator'
                    isBusy={this.state.isBusy}
                    busyIndicatorInvoker={busyIndicatorStore.instance.getBusyIndicatorInvoker}
                />);
            let header = (
                <Header selectedLanguage={this.props.selectedLanguage} containerPage={enums.PageContainers.WorkList}
                    isInTeamManagement={markerOperationModeFactory.operationMode.isTeamManagementMode}
                    examinerName={this.markerInformation ? this.markerInformation.formattedExaminerName : ''} />
            );

            let footer = (<Footer selectedLanguage={this.props.selectedLanguage}
                footerType={enums.FooterType.Worklist}
                isLogoutConfirmationPopupDisplaying={this.state.isLogoutConfirmationPopupDisplaying}
                resetLogoutConfirmationSatus={this.resetLogoutConfirmationSatus} />);

            let examinerStateChangePopup;
            if (ExaminerStateChangePopup) {
                examinerStateChangePopup = ((markerOperationModeFactory.operationMode.isTeamManagementMode &&
                    qigStore.instance.selectedQIGForMarkerOperation && this.markerInformation) ?
                    <ExaminerStateChangePopup
                        id='change_examiner_status_popup'
                        key='change_examiner_status_popup'
                        selectedLanguage={this.props.selectedLanguage}
                        currentState={this.markerInformation.approvalStatus}
                        markerInformation={this.markerInformation} /> : null);
            }

            let markingCheckPopup = (<MarkingCheckPopup />);

            return (
                <div className={classNames('worklist-wrapper', { 'loading': this.state.renderedOn !== 0 && this.state.isBusy },
                    { 'hide-left': !this.state.enableNavigationPanelVisibility })}>
                    {examinerStateChangePopup}
                    {markingCheckPopup}
                    {busyIndicator}
                    {responseAllocationErrorDialog}
                    {atypicalSearchDialog}
                    {header}
                    {footer}
                    {this.renderDetails()}
                </div>

            );

        } else {
            return (<BusyIndicator
                id='modulesLoadingBusyIndicator'
                key='modulesLoadingBusyIndicator'
                isBusy={true}
                busyIndicatorInvoker={enums.BusyIndicatorInvoker.loadingModules} />);
        }
    }

    /**
     * Render the details for the worklist.
     */
    private renderDetails() {

        let _isMarkingCheckMode: boolean = worklistStore.instance.isMarkingCheckMode;

        // Message popup
        let messagePopup: JSX.Element;
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode && this.isExamBodyCCLoaded) {
            messagePopup = (<MessagePopup isOpen={this.isMessagePopupVisible}
                closeMessagePanel={this.onCloseMessagePopup}
                messageType={enums.MessageType.WorklistCompose}
                selectedLanguage={this.props.selectedLanguage}
                selectedQigItemId={qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId}
                selectedQigItem={messageHelper.getCurrentQIGName()}
                qigItemsList={this.qigListItems}
                supervisorId={this.markerInformation ? this.markerInformation.supervisorExaminerId : 0}
                qigName={messageHelper.getCurrentQIGName()}
                supervisorName={this.markerInformation ? this.markerInformation.formattedSupervisorName : ''}
                subject={this.subject}
                priorityDropDownSelectedItem={this.priorityDropdownSelectedItem}
                onQigItemSelected={qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId}
                messageBody={this.messageBody}
                questionPaperPartId={qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId}
            />);
        }

        let leftPanel: JSX.Element;
        if (_isMarkingCheckMode) {
            if (worklistStore.instance.markingCheckExaminersList && worklistStore.instance.markingCheckExaminersList.first().toExaminer) {
                leftPanel = (<MarkCheckExaminers
                    selectedLanguage={this.props.selectedLanguage}
                    markCheckExaminers={worklistStore.instance.markingCheckExaminersList}
                    id={'markCheckExaminers'}
                    key={'key_markCheckExaminers'}
                    onExaminerClick={this.onMarkingCheckRequesterExaminerClick}
                />);
            }

        } else {
            leftPanel = (<div className='column-left-inner'>
                <MarkerInformationPanel renderedOn={this.state.renderedOn} markerInformation={this.markerInformation}
                    selectedLanguage={this.props.selectedLanguage}
                    showMessagePopup={this.onSendMessageClicked}
                    isTeamManagementMode={markerOperationModeFactory.operationMode.isTeamManagementMode}
                    showExaminerStateChangePopup={this.showExaminerStateChangePopup}
                    showMessageLink={this.isSendMessageLinkVisible()} />
                {this.getMarkingInstructionLinkVisible()}
                <Targets renderedOn={this.state.renderedOn} markingTargetsSummary={this.markingTargetsSummary}
                    selectedLanguage={this.props.selectedLanguage}
                    liveTargetRenderedOn={this.state.targetRenderedOn}
                    isTeamManagementMode={markerOperationModeFactory.operationMode.isTeamManagementMode}>
                </Targets>
            </div>);
        }

        // Render all components for the worklist
        return (
            <div className={
                classNames('content-wrapper',
                    { 'relative': !_isMarkingCheckMode },
                    { 'check-marking': _isMarkingCheckMode }
                )} >
                {this.markingInstructionFileListPanle}
                <div id='column-left'
                    onMouseOver={() => { this.onMouseHoverOrMouseLeave(true); }}
                    onMouseLeave={() => { this.onMouseHoverOrMouseLeave(false); }}
                    className={classNames('column-left',
                        { 'hovered': this.isMouseHovered },
                        { 'check-examiner-info': _isMarkingCheckMode }
                    )} >
                    {leftPanel}
                </div>
                <WorkListContainer id={'worklistcontainer_' + this.props.id}
                    key={'worklistcontainer_key_' + this.props.id}
                    selectedLanguage={this.props.selectedLanguage}
                    worklistType={this.worklistType}
                    responseMode={this.responseMode}
                    remarkRequestType={this.remarkRequestType}
                    isDirectedRemark={this.isDirectedRemark}
                    worklistTabDetails={this.worklistTabDetails}
                    toggleLeftPanel={this.toggleLeftPanel}
                    switchTab={this.switchTab}
                    isRefreshing={this.isRefreshing}
                    selectedTab={this.responseMode}
                    isMarkingCheckWorklistAccessPresent={worklistStore.instance.isMarkingCheckWorklistAccessPresent}
                    isTeamManagementMode={markerOperationModeFactory.operationMode.isTeamManagementMode}
                    isMarkingCheckMode={_isMarkingCheckMode}
                    hasTargetFound={this.hasTargetFound}
                />
                {messagePopup}
            </div>
        );
    }

    /**
     * Show the markinginstruction panel only when pdf uploaded against that QIG.
     */
    private getMarkingInstructionLinkVisible() {
        if ((markerOperationModeFactory.operationMode.isMarkingInstructionLinkVisible) && !(this.markerInformation == null) &&
            markingInstructionStore.instance.markingInstructionList &&
            markingInstructionStore.instance.markingInstructionList.size > 0) {
            return (<MarkingInstructionPanel
                id='marking-instruction-holder'
                key='marking-instruction-holder'
                onMarkInstructionFileClick={this.onMarkInstructionFileClick}
                onMarkInstructionPanelClick={this.onMarkInstructionPanelClick}
                onMarkingInstructonClickHandler={this.onMarkingInstructonClickHandler}
                renderedOn={this.state.markingInstructionPanelRenderedOn}>
            </MarkingInstructionPanel>);
        }
    }
    /**
     * Switch tab before data service call to get the data
     * @param responseMode
     */
    private switchTab(responseMode: enums.ResponseMode) {
        worklistActionCreator.responseModeChanged(responseMode, worklistStore.instance.isMarkingCheckMode);
        if (responseMode !== this.responseMode && applicationStore.instance.isOnline) {
            this.responseMode = responseMode;
            /** set this to true to show loadinng indicator */
            this.isRefreshing = true;
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * Subscribe to language change event
     */
    public componentDidMount() {
        this.loadDependencies();
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
    }

	/**
	 * Subscribing component updated event.
	 */
    public componentDidUpdate() {
        if (!this.state.modulesLoaded || this.state.isBusy || this.worklistType === enums.WorklistType.none) {
            this.props.setOfflineContainer(true);
        }
    }

    /**
     * Hook all event listeners here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    private addEventListeners() {
        configurableCharacteristicsActionCreator.getExamBodyCCs(configurableCharacteristicsStore.instance.isExamBodyCCLoaded);
        examinerstore.instance.addListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT,
            this.updateMarkerInformationPanel);
        targetSummaryStore.instance.addListener(targetSummaryStore.TargetSummaryStore.MARKING_PROGRESS_EVENT,
            this.refreshTargetProgress);
        /* subscribing to worklist marking mode change event */
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
        // TODO need to remove. This is added to test the store as part of user story.
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        submitStore.instance.addListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.onSubmitResponseCompleted);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved
        );
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_COUNT_CHANGE, this.updateResponseCount);
        userOptionsStore.instance.addListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT,
            this.onQigSelection);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onCloseMessagePopup);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        stampStore.instance.addListener
            (stampStore.StampStore.STAMPS_LOADED_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.onExamBodyCCLoaded);
        responseStore.instance.addListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.atypicalSearchClick);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED,
            this.getMarkingCheckWorklistForSelectedExaminer);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED,
            this.markCheckExaminersDataRetrived);
        targetSummaryStore.instance.addListener
            (targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED,
            this.worklistInitialisationCompleted);
        warningMessageStore.instance.addListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT,
            warningMessageNavigationHelper.handleWarningMessageNavigation);
        worklistStore.instance.addListener(worklistStore.WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT,
            this.onSimulationTargetCompletion);
        markingInstructionStore.instance.addListener(markingInstructionStore.MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT,
            this.onMarkingInstructionsLoaded);
        markingInstructionStore.instance.addListener(markingInstructionStore.MarkingInstructionStore.MARKINGINSTRUCTION_PANEL_CLOSED_EVENT,
            this.onMarkingInstrucionPanleClosed);
    }

    /**
     * Hook all event listeners for team management here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    private addEventListenersForTeamManagement() {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode) {
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED,
                this.examinerChangeStatusReceived);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED,
                this.secondStandardisationReceived);
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                this.onApprovalManagementActionExecuted);
        }
    }

    /**
     * Remove all event listeners for team management here.
     */
    private removeEventListenersForTeamManagement() {
        if (markerOperationModeFactory && markerOperationModeFactory.operationMode.isTeamManagementMode && teamManagementStore) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED,
                this.examinerChangeStatusReceived);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED,
                this.secondStandardisationReceived);
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                this.onApprovalManagementActionExecuted);
        }
    }

    /**
     * Unsubscribe language change event
     */
    public componentWillUnmount() {
        examinerstore.instance.removeListener(examinerstore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        targetSummaryStore.instance.removeListener(
            targetSummaryStore.TargetSummaryStore.MARKING_PROGRESS_EVENT,
            this.refreshTargetProgress
        );
        /* unsubscribing to worklist marking mode change event */
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
        submitStore.instance.removeListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.onSubmitResponseCompleted);
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        scriptStore.instance.removeListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved
        );
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_COUNT_CHANGE, this.updateResponseCount);
        userOptionsStore.instance.removeListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT,
            this.onQigSelection);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onCloseMessagePopup);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessageNavigation);
        stampStore.instance.removeListener
            (stampStore.StampStore.STAMPS_LOADED_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.onExamBodyCCLoaded);

        this.removeEventListenersForTeamManagement();
        responseStore.instance.removeListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT,
            this.atypicalSearchClick);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED,
            this.getMarkingCheckWorklistForSelectedExaminer);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED,
            this.markCheckExaminersDataRetrived);
        targetSummaryStore.instance.removeListener
            (targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED,
            this.worklistInitialisationCompleted);
        warningMessageStore.instance.removeListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT,
            warningMessageNavigationHelper.handleWarningMessageNavigation);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT,
            this.onSimulationTargetCompletion);
        markingInstructionStore.instance.removeListener(
            markingInstructionStore.MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT,
            this.onMarkingInstructionsLoaded);
        markingInstructionStore.instance.removeListener(markingInstructionStore.MarkingInstructionStore.
            MARKINGINSTRUCTION_PANEL_CLOSED_EVENT,
            this.onMarkingInstrucionPanleClosed);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
    }

    /**
     * component will receive props
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props !== nextProps) {
            this.setState({
                renderedOn: nextProps.renderedOn
            });
        }
    }

    /**
     * Prepare work list after initialising worklist data
     */
    private worklistInitialisationCompleted = (): void => {
        // load stamps defined for the selected mark scheme groupId
        stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            stampStore.instance.stampIdsForSelectedQIG,
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
            responseHelper.isEbookMarking,
            true);
        if (worklistStore.instance.isMarkingCheckMode) {
            this.worklistInitialisationCompletedForMarkingCheck();
        } else {
            workListDataHelper.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC(
                markerOperationModeFactory.operationMode.isTeamManagementMode);
        }
    };

    /**
     * Handles the action when making check worklist is first loaded on 'here' link click
     */
    private markCheckExaminersDataRetrived = (): void => {
        if (!worklistStore.instance.markingCheckExaminersList ||
            worklistStore.instance.markingCheckExaminersList.count() === 0) {
            navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
        } else if (!responseStore.instance.isSearchResponse) {
            this.isRefreshing = true;
            responseSearchHelper.openQIGDetails(
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID,
                false,
                examinerstore.instance.examinerApprovalStatus(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId),
                qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
        }
    };

    /**
     * Sets the corresponding marking check requester as selected in worklist store
     * calls getMarkingCheckWorklistForSelectedExaminer after updating selected examiner
     */
    private onMarkingCheckRequesterExaminerClick = (examinerId: number): void => {
        worklistActionCreator.onMarkingCheckRequesterExaminerSelected(examinerId);
    };

    /**
     * Selects the corresponding worklist for selected marking check requester examiner
     * when selected examiner in the store is updated
     */
    private getMarkingCheckWorklistForSelectedExaminer = (): void => {

        this.markCheckExaminersDataRetrived();
    };

    /**
     * Prepare work list after initialising worklist data
     */
    private worklistInitialisationCompletedForMarkingCheck = (): void => {

        let selectedTab: enums.ResponseMode = (
            worklistStore.instance.selectedMarkingCheckExaminer.selectedTab !== null &&
            worklistStore.instance.selectedMarkingCheckExaminer.selectedTab !== undefined &&
            worklistStore.instance.selectedMarkingCheckExaminer.selectedTab !== enums.ResponseMode.none) ?
            worklistStore.instance.selectedMarkingCheckExaminer.selectedTab :
            targetSummaryStore.instance.currentResponseModeForMarkingCheck;

        worklistActionCreator.notifyWorklistTypeChange(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            worklistStore.instance.selectedMarkingCheckExaminer.examinerRoleID,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            enums.WorklistType.live,
            selectedTab,
            enums.RemarkRequestType.Unknown,
            worklistStore.instance.isDirectedRemark,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
            false,
            worklistStore.instance.isMarkingCheckMode);
    };

    /**
     * Method to be invoked when a ExamBody CC is loaded.
     */
    private onExamBodyCCLoaded = (): void => {
        this.isExamBodyCCLoaded = true;
    };

    /**
     * Called after saving the user options
     */
    private onUserOptionsLoaded = (): void => {
        let isMarkerInfoPanelExpanded: boolean;
        isMarkerInfoPanelExpanded = userOptionsHelper.getUserOptionByName
            (useroptionKeys.MARKER_INFO_PANEL_EXPANDED) === 'false' ? false : true;
        if (worklistStore.instance.isMarkingCheckMode) {
            this.markCheckExaminersDataRetrived();
        } else {
            simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.WorkList, enums.PageContainers.WorkList);

            let isMultiQig: boolean = markerOperationModeFactory.operationMode.isTeamManagementMode ?
                teamManagementStore.instance.multiQigSelectedDetail &&
                    teamManagementStore.instance.multiQigSelectedDetail.qigId ? true : false : false;

            qigActionCreator.getQIGSelectorData(markerOperationModeFactory.operationMode.getQigId, false, false, false, false, true,
                isMultiQig);
        }
        this.setState({ enableNavigationPanelVisibility: isMarkerInfoPanelExpanded });
    };

    /**
     * refresh target progress for Examiner
     */
    private refreshTargetProgress = (): void => {
        this.worklistTabDetails = [];

        /** Getting  markingTargetsSummary from worklist store,
         * it will be updated if the worklist response collection changes
         */
        this.markingTargetsSummary = targetHelper.getExaminerMarkingTargetProgress;

        let currentTarget: any = targetSummaryStore.instance.getCurrentTarget();

        // If the current target is simulation for the marker  then clear the simulation exited qigs cache
        // Since, on each home click while in simulation the simulation target completed qig list needs to be shown,
        // whenever the current target is simulation the cache is cleared.
        if (currentTarget.markingModeID === enums.MarkingMode.Simulation) {
            this.storageAdapterHelper.clearCacheByKey('simulationexitedqigs', 'qigdata');
        }

        this.worklistTabDetails = worklistComponentHelper.getWorklistTabDetails
            (worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType), true);

        if (this.isContentRefreshStarted) {
            this.isContentRefreshSucceeded.isMarkingProgressCompleted = true;
        }
        this.checkIfContentRefreshCompleted();

        // Checks whether the current worklist type is disabled.
        let isTargetDisabled: boolean = this.isSelectedWorklistTypeDisabled();
        if (isTargetDisabled) {
            this.notifyWorklistTypeChange(
                allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode()), enums.ResponseMode.open);
        }
        let _worklistType: enums.WorklistType = worklistStore.instance.currentWorklistType && !isTargetDisabled ?
            worklistStore.instance.currentWorklistType :
            allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
        let isWorklistTypeChanged: boolean = false;
        let remarkRequestType: enums.RemarkRequestType = worklistComponentHelper.getRemarkRequestType(_worklistType);

        // While submiting practice response allocate next target automatically.
        if (this.isSubmitCompleted && allocateResponseHelper.isAllocationNeeded()) {
            /* Allocate the practise/standardisation responses */
            allocateResponseHelper.allocateQualificationResponses();
            _worklistType = allocateResponseHelper.getWorkListTypeByMarkingMode(
                targetHelper.getSelectedQigMarkingMode());
        } else if (this.isSubmitCompleted || this.isAllocationCompleted || this.isSecondStandardisationTargetReceived) {
            /** Call to get response details to show in worklist */
            _worklistType = allocateResponseHelper.getWorkListTypeByMarkingMode(
                targetHelper.getSelectedQigMarkingMode());
            isWorklistTypeChanged = true;
        }

        let responseMode: enums.ResponseMode = targetSummaryStore.instance.getCurrentResponseMode
            (targetHelper.getMarkingModeByWorklistType(_worklistType), _worklistType, currentTarget.markingModeID);

        this.isSelectedMenuTargetCompleted = targetHelper.isSelectedMenuCompleted(
            (worklistStore.instance.getMarkingModeByWorkListType(
                worklistStore.instance.currentWorklistType)));
        // Reset responseMode only if current responsemode is not none and submitted response is not in QualityFeedbackOutstanding
        if (responseMode === enums.ResponseMode.none || qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) {
            this.responseMode = this.responseMode === undefined ? enums.ResponseMode.open : this.responseMode;
        } else {
            this.responseMode = responseMode;
        }
        /*
         * Sets the response mode based on quality feedback.
         */

        this.responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedbackForWorklist(this.responseMode,
            targetHelper.getMarkingModeByWorklistType(_worklistType),
            remarkRequestType);

        if (this.props.isFromMenu) {

            if ((_worklistType === enums.WorklistType.practice || _worklistType === enums.WorklistType.standardisation ||
                _worklistType === enums.WorklistType.secondstandardisation) &&
                this.isSelectedMenuTargetCompleted) {
                if (targetHelper.getExaminerQigStatus() === enums.ExaminerQIGStatus.LiveMarking) {
                    isWorklistTypeChanged = true;
                    this.responseMode = enums.ResponseMode.closed;
                }
            }
            if (_worklistType === enums.WorklistType.simulation) {
                simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.WorkList, enums.PageContainers.WorkList
                    , true);
            }
        }
        /**
         * isWorklistTypeChanged is set on scenarios after Submit and Allocation when Worklist needs refresh.
         * worklist call NOT needed in QIG selection where isWorklistTypeChanged will be False.
         */
        if (isWorklistTypeChanged === true) {
            this.notifyWorklistTypeChange(_worklistType, this.responseMode);
        }

        /** resetting the allocation,submit completed flag after loading the worklist */
        this.isAllocationCompleted = false;
        this.isSubmitCompleted = false;

        // If the marker is in live marking and does not have the limit specified, no need to set the worklist. Avoid busy indicator.
        if (_worklistType === undefined &&
            currentTarget.markingModeID === enums.MarkingMode.LiveMarking &&
            currentTarget.maximumMarkingLimit === 0) {
            this.hasTargetFound = false;
        }

        this.setState({
            targetRenderedOn: Date.now(),
            renderedOn: Date.now()
        });
    };

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private showLogoutConfirmation = (): void => {
        this.setState({ isLogoutConfirmationPopupDisplaying: true });
    };

    /**
     * Handles the action event while atypical search is triggered.
     */
    private atypicalSearchClick = (result: atypicalResponseSearchResult): void => {
        let messageKey: string = '';
        let messageHeaderKey: string = '';
        this.atypicalPopupContent = localeStore.instance.
            TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' + result.searchResultCode);
        if (result.searchResultCode === enums.SearchResultCode.AllocatedToAnotherMarker) {
            this.atypicalPopupContent = stringHelper.format(localeStore.instance.
                TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' +
                    enums.SearchResultCode.AllocationPossible),
                [String(result.centreNumber),
                String(result.candidateNumber),
                String(result.candidateName).toUpperCase()]);
            this.setState({ isAtypicalSearchResultPopupDisplaying: true });
        } else if (result.searchResultCode === enums.SearchResultCode.AllocationPossible) {
            this.atypicalPopupContent = stringHelper.format(localeStore.instance.
                TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' + result.searchResultCode),
                [String(result.centreNumber),
                String(result.candidateNumber),
                String(result.candidateName).toUpperCase()]);
            this.setState({ isAtypicalSearchResultPopupDisplaying: true });
        } else if (result.searchResultCode === enums.SearchResultCode.MarkerNotApproved ||
            result.searchResultCode === enums.SearchResultCode.MarkerSuspended) {
            markerInformationActionCreator.
                GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    true,
                    false,
                    examinerstore.instance.getMarkerInformation.approvalStatus);

            this.setState({
                isResponseAllocationErrorDialogDisplaying: true,
                renderedOn: Date.now(),
                errorDialogHeaderText: localeStore.instance.
                    TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-header'),
                errorDialogContentText:
                    localeStore.instance.TranslateText('marking.worklist.approval-status-changed-dialog.body'),
                isBusy: false
            });
        } else if (result.searchResultCode === enums.SearchResultCode.MarkerWithdrawn) {
            this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            markerInformationActionCreator.
                GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    true,
                    false,
                    examinerstore.instance.getMarkerInformation.approvalStatus);
        } else {
            this.setState({ isAtypicalSearchFailurePopupDisplaying: true });
        }
    };

    /**
     * This function is called on 'Cancel' click of atypical response search dialog.
     * This will close the popup.
     */
    private atypicalSearchCancelClick = () => {
        this.setState({ isAtypicalSearchResultPopupDisplaying: false });
    };

    /**
     * This function is called on 'Ok' click of atypical response search failure dialog.
     * This will close the popup.
     */
    private atypicalSearchfailureClick = () => {
        this.setState({ isAtypicalSearchFailurePopupDisplaying: false });
    };

    /**
     * This function is called on 'MoveToWorklist' click of atypical response search dialog.
     */
    private atypicalSearchMoveToClick = () => {
        this.setState({ isAtypicalSearchResultPopupDisplaying: false });
        if (responseStore.instance._atypicalSearchResult.searchResultCode !== enums.SearchResultCode.AllocatedToAnotherMarker) {
            let isCandidatePrioritisationCCON = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.CandidatePrioritisation).toLowerCase() === 'true' ? true : false;
            responseActionCreator.moveAtypicalResponseToWorklist(
                responseStore.instance._atypicalSearchResult.examinerRoleId,
                responseStore.instance._atypicalSearchResult.markSchemeGroupId,
                enums.WorklistType.atypical,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.examSessionId,
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                examinerstore.instance.getMarkerInformation.examinerId,
                isCandidatePrioritisationCCON,
                worklistStore.instance.getRemarkRequestType,
                true,
                responseStore.instance._atypicalSearchResult.candidateScriptId);
            // Invoking onBusy method
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
        } else {
            this.atypicalPopupContent = localeStore.instance.
                TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' +
                    enums.SearchResultCode.AllocatedToAnotherMarker);
            this.setState({ isAtypicalSearchFailurePopupDisplaying: true });
        }

    };

    /**
     * This function is called on 'MarkNow' click of atypical response search dialog.
     */
    private atypicalSearchMarkNowClick = () => {
        this.setState({ isAtypicalSearchResultPopupDisplaying: false });
        if (responseStore.instance._atypicalSearchResult.searchResultCode !== enums.SearchResultCode.AllocatedToAnotherMarker) {
            let isCandidatePrioritisationCCON = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.CandidatePrioritisation).toLowerCase() === 'true' ? true : false;
            responseActionCreator.markNowAtypicalResponse(
                responseStore.instance._atypicalSearchResult.examinerRoleId,
                responseStore.instance._atypicalSearchResult.markSchemeGroupId,
                enums.WorklistType.atypical,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.examSessionId,
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                examinerstore.instance.getMarkerInformation.examinerId,
                isCandidatePrioritisationCCON,
                worklistStore.instance.getRemarkRequestType,
                true,
                responseStore.instance._atypicalSearchResult.candidateScriptId);
            // Invoking onBusy method
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
        } else {
            this.atypicalPopupContent = localeStore.instance.
                TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-' +
                    enums.SearchResultCode.AllocatedToAnotherMarker);
            this.setState({ isAtypicalSearchFailurePopupDisplaying: true });
        }
    };

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    private resetLogoutConfirmationSatus(): void {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    }

    /**
     * Updates the Marker information panel.
     */
    private updateMarkerInformationPanel = (): void => {
        // if marker information is updated through background pulse
        this.markerInformation = examinerstore.instance.getMarkerInformation;
        if (this.doRenderMarkerInformationPanel()) {
            this.setState({ renderedOn: Date.now(), isBusy: false });
        }

        // Update the Marking Check Access status
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.RequestMarkingCheck,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true') {
            worklistActionCreator.getMarkingCheckWorklistAccessStatus(
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        }
        this.checkIfContentRefreshCompleted();
    };

    /**
     * This method will toggle side panel for devices.
     */
    private toggleLeftPanel() {
        let panelToggleState: boolean = !this.state.enableNavigationPanelVisibility;
        this.setState({ enableNavigationPanelVisibility: panelToggleState });
        userOptionsHelper.save(useroptionKeys.MARKER_INFO_PANEL_EXPANDED, String(panelToggleState));
    }

    /**
     * Load all messages to sync with worklist
     */
    private forceLoadInboxMessages(): void {

        let args: loadMessageArguments = {
            recentMessageTime: null,
            messageFolderType: enums.MessageFolderType.Inbox,
            forceLoadMessages: true,
            candidateResponseId: null,
            isTeamManagementView: markerOperationModeFactory.operationMode.isTeamManagementMode,
            hiddenQigList: qigStore.instance.HiddenQIGs
        };

        messagingActionCreator.getMessages(args, false);
    }

    /**
     * When live/atypical/supervisor remark selected
     * If we open a response and close that then we need to take the response mode from response store( selected response mode)
     * otherwise It will take the response mode from worklist store.
     */
    private markingModeChanged = (markSchemeGroupId: number, questionPaperPartId: number): void => {
        if (!responseStore.instance.isSearchResponse) {
            if (worklistStore.instance.getSuccess) {
                this.worklistType = worklistStore.instance.currentWorklistType;
                this.responseMode = responseStore.instance.selectedResponseMode !== undefined
                    ? responseStore.instance.selectedResponseMode
                    : worklistStore.instance.getResponseMode;

                // load inbox messages to sync with worklist data
                this.forceLoadInboxMessages();

                if (markerOperationModeFactory.operationMode.isTeamManagementMode) {

                    // resetting responsemode while target has been dynamically changed through backend (AI)
                    // case : standardisation target has been completed by examiner(subordinate) and waiting for review
                    // and then supervisor logged in and navigates through Myteam -> subordinate's worklist (closed worklist)
                    // which is yet to be reviewed now target has been changed through AI and the supervisor opens the response and
                    // clicking set as reviewed and then it autonavigates
                    // to worklist.In this scenario response mode need to be resetted to closed.
                    this.responseMode = targetHelper.doResetResponseMode(
                        (worklistStore.instance.getMarkingModeByWorkListType(
                            worklistStore.instance.currentWorklistType)), this.responseMode);
                }
                this.remarkRequestType = worklistStore.instance.getRemarkRequestType;
                this.isDirectedRemark = worklistStore.instance.isDirectedRemark;

                // set candidate script info collection.
                worklistStore.instance.setCandidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(
                    worklistStore.instance.getCurrentWorklistResponseBaseDetails().toArray()
                );

                let isMarkByQuestionModeSet: boolean = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';

                let isEbookMarking: boolean = (configurableCharacteristicsHelper.getExamSessionCCValue
                    (configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                    .toLowerCase() === 'true');

                // initial call for fetching candidate script meta data.
                let candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(
                    worklistStore.instance.getCandidateScriptInfoCollection,
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    !isMarkByQuestionModeSet,
                    false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
                    false,
                    eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false,
                    isEbookMarking,
                    enums.StandardisationSetup.None,
                    false,
                    false,
                    qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
                );

                let that = this;
                Promise.Promise.all([candidateScriptMetadataPromise]).
                    then(function (resultList: any) {
                        that.unloadWorklistRefreshIndicatorToShowWorklist();
                    });

                // Set interval for background pulse
                backgroundPulseHelper.setInterval(
                    config.general.SCRIPT_METADATA_LOAD_TIMER_INTERVAL as number,
                    backgroundPulseHelper.handleCandidateScriptMetaDataLoad,
                    null
                );

                //set background call for processing save marks and annotations queue.
                backgroundPulseHelper.setInterval(
                    config.marksandannotationsconfig.MARKS_AND_ANNOTATIONS_SAVE_TIMER_INTERVAL,
                    backgroundPulseHelper.processMarksAndAnnotationsQueue,
                    null
                );

                if (eCourseworkHelper.isECourseworkComponent) {
                    backgroundPulseHelper.handleECourseWorkFileMetaDataLoad();
                    backgroundPulseHelper.setInterval(
                        config.general.ECOURSEFILE_METADATA_LOAD_TIMER_INTERVAL,
                        backgroundPulseHelper.handleECourseWorkFileMetaDataLoad,
                        null
                    );
                }

                if (markerOperationModeFactory.operationMode.canInitiateMarkAndAnnotationsBackgroundDownload(this.responseMode)) {
                    backgroundPulseHelper.handleCandidateMarksAndAnnotationsDataLoad();
                    // Set interval for background pulse
                    backgroundPulseHelper.setInterval(
                        config.marksandannotationsconfig.MARKS_AND_ANNOTATIONS_LOAD_TIMER_INTERVAL,
                        backgroundPulseHelper.handleCandidateMarksAndAnnotationsDataLoad,
                        null
                    );
                }

                // Logic to load image zones if ebookmarking component.
                // This will happen after Marks and Annoattion Load
                if (isEbookMarking) {
                    backgroundPulseHelper.handleEbookMarkingImageZoneLoad();
                    backgroundPulseHelper.setInterval(
                        config.general.SCRIPT_METADATA_LOAD_TIMER_INTERVAL,
                        backgroundPulseHelper.handleEbookMarkingImageZoneLoad,
                        null
                    );
                }

                // This will load the favorite stamps against selected Qig.
                responseSearchHelper.loadFavoriteStampForSelectedQig();

                /* Logging tab swith in google analytics */
                gaHelper.logEventOnTabSwitch(this.worklistType,
                    worklistStore.instance.getResponseMode,
                    qigStore.instance.qigName,
                    qigStore.instance.isTeamManagemement,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId
                );

            } else {
                this.unloadWorklistRefreshIndicatorToShowWorklist();
            }


            /** set this to true to show loadinng indicator */
            this.isRefreshing = true;
            if (this.doRenderMarkerInformationPanel()) {
                this.setState({
                    targetRenderedOn: Date.now(),
                    renderedOn: Date.now()
                });
            }
        } else {
            responseSearchhelper.onWorkListSelected(markSchemeGroupId, questionPaperPartId);
        }
    };

    /**
     * return true if we need to render the personal information panel
     */
    private doRenderMarkerInformationPanel(): boolean {
        if (this.markerInformation === undefined) {
            return false;
        }

        return this.markerInformation.approvalStatus !== enums.ExaminerApproval.None
            && this.markerInformation.markerRoleID !== enums.ExaminerRole.none;
    }

    /**
     * Method to unload the refresh indicator inorder to show the worklist
     */
    private unloadWorklistRefreshIndicatorToShowWorklist() {

        /** Resetting the refresh variable to show actual data instead of loading indicator */
        this.isRefreshing = false;
        if (this.isContentRefreshStarted) {
            this.isContentRefreshSucceeded.isWorklistRefreshCompleted = true;
        }
        this.checkIfContentRefreshCompleted();
        this.worklistTabDetails = worklistComponentHelper.getWorklistTabDetails
            (worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType));
        this.setState({ renderedOn: Date.now() });

        if (responseStore.instance._openAtypicalResponse) {
            let allocatedResponseItems = responseStore.instance.responseData.allocatedResponseItems;
            let responseData: allocatedResponse = undefined;
            if (allocatedResponseItems) {
                // identify the markgroup for which display id can be found
                // this is required for whole response atypical mark now, which creates multiple markgroupids
                // among which only one can find the display id from the worklist data.
                allocatedResponseItems.forEach((item: allocatedResponse) => {
                    if (responseData === undefined &&
                        worklistStore.instance.getResponseDetailsByMarkGroupId(item.markGroupId) &&
                        worklistStore.instance.getResponseDetailsByMarkGroupId(item.markGroupId).displayId) {
                        responseData = item;
                    }
                });
            }

            if (responseData) {
                responseHelper.openResponse(parseInt('6' + responseData.displayID.toString()),
                    enums.ResponseNavigation.specific,
                    worklistStore.instance.getResponseMode,
                    responseData.markGroupId,
                    enums.ResponseViewMode.zoneView);
                markSchemeHelper.getMarks(parseInt('6' + responseData.displayID.toString()),
                    enums.MarkingMode.LiveMarking);
                responseStore.instance.resetOpenAtypicalFlag();
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseData.displayID);
            }
        }
    }

    /**
     * This will open the response item
     */
    private openResponse = (): void => {
        // Check for standardisation setup completion.
        simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.WorkList, enums.PageContainers.WorkList);
        navigationHelper.loadResponsePage();
    };

    /**
     * This function is called on 'OK' click of response allocation error dialog.
     * This will close the popup.
     */
    private onOkClickOfResponseAllocationErrorDialog() {
        if (examinerstore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Withdrawn) {
            qigActionCreator.getQIGSelectorData(0);
            loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
        }

        this.setState({
            isResponseAllocationErrorDialogDisplaying: false,
            renderedOn: Date.now()
        });
    }

    /**
     * Gets called once the response allocation request is completed
     */
    private onResponseAllocated = (responseAllocationErrorCode: enums.ResponseAllocationErrorCode,
        allocatedResponseCount: number,
        success: boolean,
        approvalStatus: enums.ExaminerApproval,
        openAtypicalResponse: boolean,
        responseData: allocatedResponseData): void => {

        // Check the Marker approval status is with drawn, If so display the withdrawn message
        if (approvalStatus === enums.ExaminerApproval.Withdrawn) {
            this.handleWithDrawnError();
            return;
        }

        if (success) {
            this.initiateContentRefresh();
            this.isAllocationCompleted = true;
        }


        if (responseAllocationErrorCode !== enums.ResponseAllocationErrorCode.none) {
            let responseAllocationValidationParameter: any;
            responseAllocationValidationParameter = responseAllocationValidationHelper.Validate(responseAllocationErrorCode,
                allocatedResponseCount,
                approvalStatus);
            gaHelper.logEventOnResponseAllocation(true);
            this.setState({
                isResponseAllocationErrorDialogDisplaying: true,
                renderedOn: Date.now(),
                errorDialogHeaderText: responseAllocationValidationParameter.ErrorDialogHeaderText,
                errorDialogContentText: responseAllocationValidationParameter.ErrorDialogContentText,
                isBusy: false
            });
        } else {
            gaHelper.logEventOnResponseAllocation(false, allocatedResponseCount);
            this.setState({ isBusy: false, renderedOn: Date.now() });
        }
    };

    /**
     * Show busy indicator when submit is clicked in live open worklist
     */
    private setBusyIndicator = (): void => {
        /* if any error occurs set the variable to false and content refresh has started */
        if (busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none &&
            this.isContentRefreshStarted) {
            this.resetContentRefreshStatuses();
        }

        this.setState({
            isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none ? false : true
        });
    };

    /**
     * if data refresh is completed, hide busy indicator
     */
    private checkIfContentRefreshCompleted() {
        if (this.isContentRefreshSucceeded &&
            this.isContentRefreshSucceeded.isMarkingProgressCompleted &&
            this.isContentRefreshSucceeded.isWorklistRefreshCompleted) {
            this.resetContentRefreshStatuses();

            /* Reset the busy indicator */
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);

            /** if WorklistType is standardisation, approval status may change on response submission */
            /*
            if ((submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation
                || submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation)
                && this.isSubmitCompleted) {
                this.isSubmitCompleted = false;
                this.markerInformation = examinerstore.instance.getMarkerInformation;
                if (this.markerInformation.approvalStatus === enums.ExaminerApproval.Approved) {
                    this.setState(
                        {
                            renderedOn: Date.now(),
                            isAutoApprovalDialogDisplaying: true
                        }
                    );
                } else if (this.markerInformation.approvalStatus === enums.ExaminerApproval.Suspended) {
                    this.markerInformation = examinerstore.instance.getMarkerInformation;
                    this.setState({ renderedOn: Date.now() });
                }
            }
            */
        }
    }

    /**
     * Reset content refresh statuses
     */
    private resetContentRefreshStatuses() {
        this.isContentRefreshSucceeded.isMarkingProgressCompleted = false;
        this.isContentRefreshSucceeded.isWorklistRefreshCompleted = false;
        this.isContentRefreshStarted = false;
    }

    /**
     * On response submission completed
     */
    private onSubmitResponseCompleted = (fromMarkScheme: boolean, submittedMarkGroupIds: Array<number>): void => {


        this.isSubmitCompleted = true;
        /* start the data refresh */
        this.isContentRefreshStarted = true;

        this.setState({ isBusy: false });
    };

    /**
     * Handle the Withdrwan popup
     */
    private handleWithDrawnError() {
        this.setState({
            isResponseAllocationErrorDialogDisplaying: true,
            renderedOn: Date.now(),
            errorDialogHeaderText:
                localeStore.instance.TranslateText
                    ('marking.worklist.response-allocation-error-dialog.response-allocation-error-header-withdrawnMarker'),
            errorDialogContentText:
                localeStore.instance.TranslateText
                    ('marking.worklist.response-allocation-error-dialog.response-allocation-error-withdrawnMarker'),
            isBusy: false
        });
    }

    /**
     * Start the content refresh
     */
    private initiateContentRefresh() {
        let _worklistType = allocateResponseHelper.getWorkListTypeByMarkingMode(
            targetHelper.getSelectedQigMarkingMode());
        // Load the marking progress
        worklistActionCreator.getWorklistMarkerProgressData(
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);

        // Load marking instructions 
        if (markerOperationModeFactory.operationMode.isMarkingInstructionLinkVisible) {
            markingInstructionActionCreator.getMarkingInstructionsActionCreator(
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                configurableCharacteristicsHelper.markingInstructionCCValue, false);
        }
    }

    /**
     *  This will load the dependencies dynamically during component mount.
     */
    private loadDependencies() {
        require.ensure(['./markerinformation/markerinformationpanel', '../../stores/locale/localestore',
            '../../stores/qigselector/qigstore', '../../stores/markerinformation/examinerstore', './shared/worklistmessage',
            '../utility/confirmationdialog',
            './shared/markingprogress',
            './targetsummary/targets', '../../stores/qigselector/typings/overviewdata', '../../stores/qigselector/typings/qigsummary',
            '../../stores/qigselector/typings/markingtarget', '../../stores/worklist/targetsummarystore',
            '../../stores/worklist/typings/markingtargetsummary',
            './worklistcontainer', '../../stores/worklist/workliststore',
            '../../stores/response/responsestore',
            '../../actions/worklist/worklistactioncreator', '../utility/genericdialog',
            '../utility/responseallocation/responseallocationvalidationhelper',
            '../utility/responseallocation/responseallocationvalidationparameter', 'classnames',
            '../../stores/busyindicator/busyindicatorstore', '../../stores/submit/submitstore',
            './worklistcomponenthelper', '../../actions/submit/submitactioncreator',
            '../../actions/busyindicator/busyindicatoractioncreator', '../utility/backgroundworker/scriptimagedownloadhelper',
            '../../actions/script/scriptactioncreator', '../../stores/script/scriptstore',
            '../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader',
            '../../utility/backgroundpulse/backgroundpulsehelper', '../footer', '../../utility/googleanalytics/gahelper',
            '../../actions/stamp/stampactioncreator', '../../stores/configurablecharacteristics/configurablecharacteristicsstore',
            '../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator',
            '../../actions/qigselector/qigselectoractioncreator', '../../stores/stamp/stampstore',
            '../../actions/exception/exceptionactioncreator',
            '../../stores/exception/exceptionstore',
            '../message/messagepopup', '../utility/message/messagehelper', '../../actions/messaging/messagingactioncreator',
            '../../stores/message/messagestore', '../../utility/stringformat/stringformathelper',
            './markerinformation/markingcheckpopup',
            '../../utility/responsesearch/responsesearchhelper',
            '../utility/exception/exceptionhelper', '../../utility/generic/htmlutilities',
            '../../actions/navigation/loadcontaineractioncreator',
            '../utility/userdetails/userinfo/operationmodehelper',
            './markcheck/markcheckexaminers',
            '../../actions/markingcheck/markingcheckactioncreator',
            '../../actions/userinfo/userinfoactioncreator',
            '../../utility/teammanagement/helpers/helpexaminersdatahelper',
            '../../stores/teammanagement/warningmessagestore',
            '../../utility/teammanagement/helpers/warningmessagenavigationhelper',
            '../../actions/markinginstructions/markinginstructionactioncreator'],

            function () {
                MarkerInformationPanel = require('./markerinformation/markerinformationpanel');
                localeStore = require('../../stores/locale/localestore');
                qigStore = require('../../stores/qigselector/qigstore');
                examinerstore = require('../../stores/markerinformation/examinerstore');
                WorkListMessage = require('./shared/worklistmessage');
                ConfirmationDialog = require('../utility/confirmationdialog');
                Targets = require('./targetsummary/targets');
                overviewData = require('../../stores/qigselector/typings/overviewdata');
                qigInfo = require('../../stores/qigselector/typings/qigsummary');
                markingTarget = require('../../stores/qigselector/typings/markingtarget');
                targetSummaryStore = require('../../stores/worklist/targetsummarystore');
                markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
                WorkListContainer = require('./worklistcontainer');
                worklistStore = require('../../stores/worklist/workliststore');
                markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
                responseStore = require('../../stores/response/responsestore');
                worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
                GenericDialog = require('../utility/genericdialog');
                responseAllocationValidationHelper = require('../utility/responseallocation/responseallocationvalidationhelper');
                responseAllocationValidationParameter = require('../utility/responseallocation/responseallocationvalidationparameter');
                classNames = require('classnames');
                busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
                submitStore = require('../../stores/submit/submitstore');
                worklistComponentHelper = require('./worklistcomponenthelper');
                submitActionCreator = require('../../actions/submit/submitactioncreator');
                busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
                scriptImageDownloadHelper = require('../utility/backgroundworker/scriptimagedownloadhelper');
                scriptActionCreator = require('../../actions/script/scriptactioncreator');
                scriptStore = require('../../stores/script/scriptstore');
                scriptImageDownloader = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader');
                targetHelper = require('../../utility/target/targethelper');
                userInfoStore = require('../../stores/userinfo/userinfostore');
                backgroundPulseHelper = require('../../utility/backgroundpulse/backgroundpulsehelper');
                Footer = require('../footer');
                gaHelper = require('../../utility/googleanalytics/gahelper');
                stampActionCreator = require('../../actions/stamp/stampactioncreator');
                configurableCharacteristicsStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
                configurableCharacteristicsActionCreator =
                    require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
                qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
                stampStore = require('../../stores/stamp/stampstore');
                exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
                exceptionStore = require('../../stores/exception/exceptionstore');
                MessagePopup = require('../message/messagepopup');
                messageHelper = require('../utility/message/messagehelper');
                messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
                messageStore = require('../../stores/message/messagestore');
                MarkingCheckPopup = require('./markerinformation/markingcheckpopup');
                stringFormatHelper = require('../../utility/stringformat/stringformathelper');
                responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
                htmlUtilities = require('../../utility/generic/htmlutilities');
                loadContainerActionCreator = require('../../actions/navigation/loadcontaineractioncreator');
                operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
                MarkCheckExaminers = require('./markcheck/markcheckexaminers');
                markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
                userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
                helpExaminersDataHelper = require('../../utility/teammanagement/helpers/helpexaminersdatahelper');
                warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
                warningMessageNavigationHelper = require('../../utility/teammanagement/helpers/warningmessagenavigationhelper');
                markingInstructionActionCreator = require('../../actions/markinginstructions/markinginstructionactioncreator');

                this._warningMessageNavigationHelper = new warningMessageNavigationHelper();

                // ensuring that all the dependencies are loaded at the begining
                this.loadDependenciesForTeamManagement();
                this.addEventListeners();

                /* Load the unread mandatory message status for displaying mandatory messages */
                messagingActionCreator.getUnreadMandatoryMessageStatus(enums.TriggerPoint.Worklist);
                this.setState({ modulesLoaded: true, selectedLanguage: localeStore.instance ? localeStore.instance.Locale : '' });

            }.bind(this));
    }

    /**
     *  This will load the dependencies for team management dynamically during component mount.
     */
    private loadDependenciesForTeamManagement() {
        require.ensure([
            '../../actions/teammanagement/teammanagementactioncreator',
            './markerinformation/examinerstatechangepopup'],

            function () {
                teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
                ExaminerStateChangePopup = require('./markerinformation/examinerstatechangepopup');
                this.addEventListenersForTeamManagement();
            }.bind(this));
    }

    /**
     * Gets called on retrieval of candidate response metadata which aids for the Script background download
     * No need to fetch the Suppressed pages
     */
    private onCandidateResponseMetadataRetrieved = (isAutoRefresh: boolean): void => {
        // TO DO: We have to remove the isTeamManagementMode check while doing the responses opening from team management story.
        if (!responseStore.instance.isSearchResponse) {
            if (((isAutoRefresh && scriptStore.instance.filteredCandidateResponseMetadata.scriptImageList.size > 0)
                || (!isAutoRefresh)) && !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                // Checks if the background download of images can be initiated based on the current
                //selected worklist type and response mode
                if (scriptImageDownloadHelper.canInitiateScriptImageBackgroundDownload(this.worklistType, this.responseMode)) {

                    // Populating the request objects for performing background download of script images
                    let scriptImageDownloadRequests = scriptImageDownloadHelper.populateBackgroundScriptImageDownloadRequests(
                        isAutoRefresh ? scriptStore.instance.filteredCandidateResponseMetadata :
                            scriptStore.instance.getCandidateResponseMetadata
                    );

                    // Initiating the background download of images based on the config
                    if (config.backgroundworkerrefreshconfig.BACKGROUND_IMAGES_DOWNLOAD_ENABLED === true
                        && !htmlviewerhelper.isHtmlComponent) {
                        new scriptImageDownloader().initiateBackgroundImageDownload(scriptImageDownloadRequests);
                    }
                }
            }
        } else {
            responseSearchHelper.openResponse();
        }
    };

    /**
     * This method will be called if count of responses in the
     * Worklist is not equal to the count showing in Tab header and Live Progress status
     */
    private updateResponseCount = (): void => {
        this.markingTargetsSummary =
            worklistStore.instance.getExaminerMarkingTargetProgress
                (markerOperationModeFactory.operationMode.isSelectedExaminerPEOrAPE);
        this.setState({ targetRenderedOn: Date.now() });
    };

    /**
     * Set busy indicator when a QIG is selected
     */
    private onQigSelection = (isDataFromSearch: boolean = false,
        isDataFromHistory: boolean = false): void => {
        this.isRefreshing = true;
        if (isDataFromHistory) {
            return;
        }
        responseSearchHelper.openQIGDetails(
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            dataServiceHelper.canUseCache(),
            examinerstore.instance.examinerApprovalStatus(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId),
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
            false,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);

        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Callback function for message panel close
     */
    private onCloseMessagePopup = (navigateTo: enums.SaveAndNavigate) => {
        this.isMessagePopupVisible = false;
        this.resetvariables();
        /* Defect:24608 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad */
        if (htmlUtilities.isIPadDevice) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
        //We need to call the close action when navigating to inbox and when the close button is clicked
        // in other scenarios the close action is called from messagebase
        if (!navigateTo || navigateTo === enums.SaveAndNavigate.toInboxMessagePage) {
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
        }
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Event fired on clicking send message.
     */
    private onSendMessageClicked = () => {
        // On clicking Send message button from  information MarkerInformationPanel
        // Please check whether application is online.
        // If yes, proceed with composing Message otherwise interrupt action.
        if (applicationStore.instance.isOnline) {
            if (!markerOperationModeFactory.operationMode.isTeamManagementMode) {
                this.isMessagePopupVisible = true;
                this.setState({ renderedOn: Date.now() });
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.WorklistCompose);
            } else {
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.TeamCompose);
            }
        } else {
            applicationActionCreator.checkActionInterrupted();
        }
    };

    /**
     * Reset private variables
     */
    private resetvariables = () => {
        this.subject = '';
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        this.selectedQigItemId = undefined;
        this.messageBody = '';
    };

    /**
     * Method to show examiner state change popup.
     */
    private showExaminerStateChangePopup = () => {
        // Check message is active, If so check for dirty content else proceed
        if (!messageStore.instance.isMessagePanelActive) {
            teamManagementActionCreator.doVisibleChangeStatusPopup(true);
        } else {
            let messageNavigationArguments: MessageNavigationArguments = {
                responseId: undefined,
                canNavigate: false,
                navigateTo: enums.MessageNavigation.ChangeStatus,
                navigationConfirmed: false,
                hasMessageContainsDirtyValue: undefined,
                triggerPoint: enums.TriggerPoint.None
            };
            messagingActionCreator.canMessageNavigate(messageNavigationArguments);
        }
    };

    /**
     * Handles the action event on examiner change status received.
     */
    private examinerChangeStatusReceived = () => {
        let examinerChangeStatus = teamManagementStore.instance.examinerStatusDetails;
        if (examinerChangeStatus) {
            if (examinerChangeStatus.approvalOutcome === enums.ApprovalOutcome.Success) {
                this.setState({ renderedOn: Date.now() });
            }
        }

        // Log examiner status change data.
        new teamManagementAuditHelper().logSubordinateStatusChange(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION,
            loggerConstants.TEAMMANAGEMENT_TYPE_SUBOORDINATES_STATUS_CHANGED_ACTION,
            examinerChangeStatus);
    };

    /**
     * This method will call on mouse hover and leave for setting hovered class.
     */
    private onMouseHoverOrMouseLeave = (isMouseHover: boolean) => {
        // condition to re-render only if change present. avoid renders on every mouse move.
        if (this.isMouseHovered !== isMouseHover) {
            this.isMouseHovered = isMouseHover;
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * Handles the action event on second standardisation received.
     */
    private secondStandardisationReceived = () => {
        let secondStandardisationReturn = teamManagementStore.instance.secondStandardisationReturn;
        if (secondStandardisationReturn) {
            qigActionCreator.getQIGSelectorData(operationModeHelper.markSchemeGroupId);
            this.isSecondStandardisationTargetReceived = true;
            worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);

            // Log examiner status change data.
            new teamManagementAuditHelper().logSubordinateStatusChange(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION,
                loggerConstants.TEAMMANAGEMENT_TYPE_SECONDSTANDARDISATION,
                secondStandardisationReturn);
        }
    };

    /**
     * SEP Action return callback.
     */
    private onApprovalManagementActionExecuted = (actionIdentifier: number, sepApprovalManagementActionResults:
        Immutable.List<DoSEPApprovalManagementActionResult>) => {
        let sepApprovalManagementActionResult: DoSEPApprovalManagementActionResult;
        sepApprovalManagementActionResult = sepApprovalManagementActionResults.first();
        if (actionIdentifier !== enums.SEPAction.ViewResponse &&
            actionIdentifier !== enums.SEPAction.SendMessage) {
            navigationHelper.loadTeamManagement();

            // Log examiner set sep.
            new teamManagementAuditHelper().logSubordinateStatusChange(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION,
                loggerConstants.TEAMMANAGEMENT_TYPE_SEP_MANAGEMENT,
                sepApprovalManagementActionResult);
        }
    };

    /**
     * Method called when the message navigation is confirmed by the user
     * @param messageNavigationArguments
     */
    private onMessageNavigation = (messageNavigationArguments: MessageNavigationArguments) => {
        if (messageNavigationArguments.canNavigate && messageNavigationArguments.navigateTo === enums.MessageNavigation.ChangeStatus) {
            teamManagementActionCreator.doVisibleChangeStatusPopup(true);
        }
    };

    /**
     * In help examiners view the message link has to be shown based on the SEP action items
     */
    private isSendMessageLinkVisible(): boolean {
        if (markerOperationModeFactory.operationMode.isHelpExaminersView && qigStore.instance.selectedQIGForMarkerOperation) {
            let sepActions = new helpExaminersDataHelper().getSEPActions(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            if (sepActions && (sepActions.indexOf(enums.SEPAction.SendMessage) > -1)) {
                return true;
            }
            return false;
        }
        return true;
    }

    /**
     * rendering worklist
     */
    private onSimulationTargetCompletion = (): void => {

        // Invoke the action creator to Open the QIG
        qigSelectorActionCreator.openQIG(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
    }

    /**
     * notify worklist type change.
     */
    private notifyWorklistTypeChange(worklistType: enums.WorklistType, responseMode: enums.ResponseMode) {
        worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            worklistType,
            responseMode,
            worklistComponentHelper.getRemarkRequestType(worklistType),
            worklistComponentHelper.getIsDirectedRemark(worklistType),
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
            false);
    }

    /**
     * Get selected worklist type disabled.
     */
    private isSelectedWorklistTypeDisabled = (): boolean => {
        let isTargetDisabled: boolean = false;
        let markingModeByWorklistType: enums.MarkingMode =
            targetHelper.getMarkingModeByWorklistType(worklistStore.instance.currentWorklistType);
        if (markingModeByWorklistType) {
            let targetByWorklistType: any =
                this.markingTargetsSummary.filter(target => target.markingModeID === markingModeByWorklistType).first();
            isTargetDisabled = markerOperationModeFactory.operationMode.isTargetDisabled(targetByWorklistType, undefined);
        }
        return isTargetDisabled;
    }

    /**
     * On MarkInstruction File
     * @param {any} source - The source element
     */
    public onMarkInstructionFileClick(documentId: number) {
        let questionPaperId: number = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        let msgId: number = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let markingInstructionLevel: number = configurableCharacteristicsHelper.markingInstructionCCValue;
        let markingInstruction: MarkingInstruction =
		markingInstructionStore.instance.markingInstructionList.find(x => x.documentId === documentId);
        let markingInstructionReadStatus: boolean = markingInstruction.readStatus;
        let markingInstructionId: number = markingInstruction.markingInstructionId;
        let arg: markingInstructionArg =
            new markingInstructionArg(documentId, questionPaperId, msgId, markingInstructionLevel,
                markingInstructionId, markingInstructionReadStatus);

        markingInstructioActionCreator.updateMarkingInstruction(documentId, markingInstructionReadStatus);

        window.open(urls.MARKING_INSTRUCTION_GET_URL + '?' + $.param(arg));
    }

    /**
     * On Mark InstructionPanel Click
     * @param {any} source - The source element
     */
    public onMarkInstructionPanelClick() {
        if (markingInstructionStore.instance.markingInstructionList &&
            markingInstructionStore.instance.markingInstructionList.count() === 1) {
            this.onMarkInstructionFileClick(markingInstructionStore.instance.markingInstructionList.first().documentId);
        } else {
            if (!this.state.isMarkingInstructionPanelOpen) {
                // calculate scroll width of column-let while opening the marking instruction popup, to set the margin-left
                this.columnLeftScrollWidth = htmlUtilities.getElementById('column-left') ?
                    htmlUtilities.getElementById('column-left').offsetWidth - htmlUtilities.getElementById('column-left').clientWidth
                    : 0;
            }
            markingInstructioActionCreator.markingInstructionPanelOpenActionCreator(!this.state.isMarkingInstructionPanelOpen);
            if (!this.state.isMarkingInstructionPanelOpen) {
                let markinInstructionMenu = document.getElementById('marking-instruction-menu');
                if (markinInstructionMenu) {
                    // reset the scroll position when popup is opened
                    markinInstructionMenu.scrollTop = 0;
                }
            }
            this.setState({
                markingInstructionPanelRenderedOn: Date.now(),
                isMarkingInstructionPanelOpen: !this.state.isMarkingInstructionPanelOpen,
                isMarkingInstructionPanelClicked: true
            });
        }
    }

    /**
     * on click or touch evnet
     */
    private onMarkingInstructonClickHandler = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the user details list item. if not close the open window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any) {
                return el.id === 'markinginstructionlink' || el.id === 'markingInstructionMenu';
            }) == null) {
            if (this.state.isMarkingInstructionPanelOpen !== undefined && this.state.isMarkingInstructionPanelOpen) {
                this.setState({ isMarkingInstructionPanelOpen: false });
                markingInstructioActionCreator.markingInstructionPanelOpenActionCreator(false);
            }
        }
    };

    /**
     * rendering worklist
     */
    private onMarkingInstructionsLoaded = (): void => {
        this.setState({
            markingInstructionPanelRenderedOn: Date.now()
        });
    }

    /**
     * Gets the marking instruction file list panel,
     * render in worklist instead of marking instruction component to handle jerking/hovering issues in worklist
     */
    private get markingInstructionFileListPanle() {
        // list of marking instruction files element
        let fileList = (markingInstructionStore.instance.markingInstructionList ?
            markingInstructionStore.instance.markingInstructionList.map(
                (markingInstruction: MarkingInstruction, index: number) => {
                    let liClass: string = 'marking-instruction-item';
                    if (markingInstruction.readStatus === false) {
                        liClass = 'marking-instruction-item unread';
                    }
                    return (
                        <li id={'marking-instruction-item_' + markingInstruction.documentName} className={liClass}>
                            <MarkingInstructionFilePanel id={'id_markinginstructionlink_' + markingInstruction.documentId}
                                key={'key_markinginstructionlink_' + markingInstruction.documentId}
                                documentId={markingInstruction.documentId}
                                documentName={markingInstruction.documentName}
                                onMarkInstructionFileClick={this.onMarkInstructionFileClick.bind(this)}
                                renderedOn={this.state.markingInstructionPanelRenderedOn}>
                            </MarkingInstructionFilePanel>
                        </li>);
                }) : null);

        // gets the top of marking instruction holder
        let markingInstructionHolder = htmlUtilities.getElementById('markinginstructionlink');
        let markingInstructionHolderTop = markingInstructionHolder ? markingInstructionHolder.getBoundingClientRect().top : 0;

        // css style for marking instruction file menu and set top with top of marking instruction holder
        // consider scroll width  of column left while setting margin left 
        let markingInstructionFileListStyle: React.CSSProperties = {
            top: markingInstructionHolderTop + 'px',
            marginLeft: (-1 * this.columnLeftScrollWidth) + 'px'
        };

        // set the height of drop down        
        let markingInstructionDropDownHeight = window.innerHeight - markingInstructionHolderTop;
        let markingInstructionMenuStyle: React.CSSProperties = {
            maxHeight: markingInstructionDropDownHeight + 'px'
        };

        // marking instruction files list panel
        let markingInstructionFileList =
            (<div className={
                classNames('dropdown-wrap  marking-instruction-menu left-column-menu',
                    {
                        'open': this.state.isMarkingInstructionPanelOpen && this.state.isMarkingInstructionPanelClicked,
                        'close': !this.state.isMarkingInstructionPanelOpen && this.state.isMarkingInstructionPanelClicked,
                        '': !this.state.isMarkingInstructionPanelClicked
                    })}
                style={markingInstructionFileListStyle}
                id='markingInstructionMenu'>
                <ul id='marking-instruction-menu'
                    className='menu'
                    style={markingInstructionMenuStyle}>
                    {fileList}
                </ul >
            </div>);

        return markingInstructionFileList;
    }

    /**
     * refresh on closing marking instruction panel by clicking on worklist type
     */
    private onMarkingInstrucionPanleClosed = (): void => {
        if (this.state.isMarkingInstructionPanelOpen) {
            this.setState({
                isMarkingInstructionPanelOpen: false
            });
        }
    }
}

export = WorkList;
