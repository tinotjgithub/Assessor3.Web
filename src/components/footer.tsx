import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('./base/purerendercomponent');
import localeStore = require('../stores/locale/localestore');
import ConfirmationDialog = require('./utility/confirmationdialog');
import userOptionsHelper = require('../utility/useroption/useroptionshelper');
import userOptionsActionCreator = require('../actions/useroption/useroptionactioncreator');
import logoutArgument = require('../dataservices/authentication/logoutargument');
import logoutActionCreator = require('../actions/logout/logoutactioncreator');
import loginSession = require('../app/loginsession');
import loginStore = require('../stores/login/loginstore');
import useroptionKeys = require('../utility/useroption/useroptionkeys');
import userOptionStore = require('../stores/useroption/useroptionstore');
import markerOperationModeFactory = require('./utility/markeroperationmode/markeroperationmodefactory');
import enums = require('./utility/enums');
import marksAndAnnotationsSaveHelper = require('../utility/marking/marksandannotationssavehelper');
import markingStore = require('../stores/marking/markingstore');
import markingActionCreator = require('../actions/marking/markingactioncreator');
import worklistStore = require('../stores/worklist/workliststore');
import BusyIndicator = require('./utility/busyindicator/busyindicator');
import navigationHelper = require('./utility/navigation/navigationhelper');
import navigationStore = require('../stores/navigation/navigationstore');
import applicationActionCreator = require('../actions/applicationoffline/applicationactioncreator');
import GenericDialog = require('./utility/genericdialog');
import saveMarksAndAnnotationsNonRecoverableErrorDialogContents =
require('./utility/savemarksandannotations/savemarksandannotationsnonrecoverableerrordialogcontents');
import htmlUtilities = require('../utility/generic/htmlutilities');
import worklistActionCreator = require('../actions/worklist/worklistactioncreator');
import qigStore = require('../stores/qigselector/qigstore');
import keyDownHelper = require('../utility/generic/keydownhelper');
import qigActionCreator = require('../actions/qigselector/qigselectoractioncreator');
import messageStore = require('../stores/message/messagestore');
import exceptionStore = require('../stores/exception/exceptionstore');
import popUpDisplayActionCreator = require('../actions/popupdisplay/popupdisplayactioncreator');
import examinerStore = require('../stores/markerinformation/examinerstore');
import responseActionCreator = require('../actions/response/responseactioncreator');
import qualityFeedbackHelper = require('../utility/qualityfeedback/qualityfeedbackhelper');
import colouredAnnotationsHelper = require('../utility/stamppanel/colouredannotationshelper');
import submitStore = require('../stores/submit/submitstore');
import worklistComponentHelper = require('./worklist/worklistcomponenthelper');
import responseNavigation = require('./response/responsenavigation');
import submitHelper = require('./utility/submit/submithelper');
import allocateResponseHelper = require('./utility/responseallocation/allocateresponseshelper');
import targetHelper = require('../utility/target/targethelper');
import busyIndicatorActionCreator = require('../actions/busyindicator/busyindicatoractioncreator');
import busyIndicatorStore = require('../stores/busyindicator/busyindicatorstore');
import messagingActionCreator = require('../actions/messaging/messagingactioncreator');
import messageHelper = require('./utility/message/messagehelper');
import stdSetupPermissionHelper = require('../utility/standardisationsetup/standardisationsetuppermissionhelper');
import responseHelper = require('./utility/responsehelper/responsehelper');
import standardisationSetupFactory = require('../utility/standardisationsetup/standardisationsetupfactory');
import standardisationTargetDetail = require('../stores/standardisationsetup/typings/standardisationtargetdetail');

declare let config: any;
/* tslint:disable:variable-name */
const IdleTimer = require('react-idle-timer').default;
/* tslint:enable:variable-name */
import timerHelper = require('../utility/generic/timerhelper');
import applicationStore = require('../stores/applicationoffline/applicationstore');
import submitActionCreator = require('../actions/submit/submitactioncreator');
import responseStore = require('../stores/response/responsestore');
import customError = require('./base/customerror');
import storageAdapterHelper = require('../dataservices/storageadapters/storageadapterhelper');
import teamManagementStore = require('../stores/teammanagement/teammanagementstore');
import userInfoActionCreator = require('../actions/userinfo/userinfoactioncreator');
import loadContainerActionCreator = require('../actions/navigation/loadcontaineractioncreator');
import operationModeHelper = require('./utility/userdetails/userinfo/operationmodehelper');
import worklistHistoryInfo = require('../utility/breadcrumb/worklisthistoryinfo');
import teamManagementHistoryInfo = require('../utility/breadcrumb/teammanagementhistoryinfo');
import historyItem = require('../utility/breadcrumb/historyitem');
import teamManagementActionCreator = require('../actions/teammanagement/teammanagementactioncreator');
import qigInfo = require('../stores/qigselector/typings/qigsummary');
import markingCheckActionCreator = require('../actions/markingcheck/markingcheckactioncreator');
import rememberQig = require('../stores/useroption/typings/rememberqig');
import userOptionKeys = require('../utility/useroption/useroptionkeys');
import WarningMessagePopup = require('./teammanagement/warningmessagepopup');
import LocksInQigPopup = require('./qigselector/locksinqigpopup');
import responseSearchHelper = require('./../utility/responsesearch/responsesearchhelper');
import ccActionCreator = require('../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import Promise = require('es6-promise');
import networkChangeAuditHelper = require('./utility/zoom/networkchangeaudithelper');
import loggerConstants = require('./utility/loggerhelperconstants');
import stringHelper = require('../utility/generic/stringhelper');
import simulationModeExitedQigList = require('../stores/qigselector/typings/simulationmodeexitedqiglist');
import Immutable = require('immutable');
import simulationModeHelper = require('../utility/simulation/simulationmodehelper');
import stringFormatHelper = require('../utility/stringformat/stringformathelper');
import ccStore = require('../stores/configurablecharacteristics/configurablecharacteristicsstore');
import ecourseworkHelper = require('./utility/ecoursework/ecourseworkhelper');
import ecourseworkFileStore = require('../stores/response/digital/ecourseworkfilestore');
import overlayHelper = require('./utility/overlay/overlayhelper');
import acetatesActionCreator = require('../actions/acetates/acetatesactioncreator');
import configurableCharacteristicHelper = require('../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicNames = require('../utility/configurablecharacteristic/configurablecharacteristicsnames');
import targetSummaryStore = require('../stores/worklist/targetsummarystore');
import imageZoneStore = require('../stores/imagezones/imagezonestore');
import auditLoggingHelper = require('./utility/auditlogger/auditlogginghelper');
import qigSummary = require('../stores/qigselector/typings/qigsummary');
import standardisationSetupStore = require('../stores/standardisationsetup/standardisationsetupstore');
import MultiOptionConfirmationDialog = require('./utility/multioptionconfirmationdialog');
import standardisationActionCreator = require('../actions/standardisationsetup/standardisationactioncreator');
import userinfostore = require('../stores/userinfo/userinfostore');
import genericRadioButtonItems = require('./utility/genericradiobuttonitems');
import GenericPopupWithRadioButton = require('./utility/genericpopupwithradiobuttons');
import updateESMarkGroupMarkingModeData = require('../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');
import ssuStmClassificationRestriction = require('../stores/standardisationsetup/typings/ssustmclassificationrestriction');
import genericCheckBoxItems = require('./utility/genericcheckboxitems');
import GenericPopupWithCheckBoxes = require('./utility/genericpopupwithcheckboxes');
import awardingHelper = require('./utility/awarding/awardinghelper');
import awardingStore = require('../stores/awarding/awardingstore');
import standardisationSetupCCData = require('../stores/standardisationsetup/typings/standardisationsetupccdata');
import standardisationSetupHistoryInfo = require('../utility/breadcrumb/standardisationsetuphistoryinfo');
import standardisationSetupHelper = require('../utility/standardisationsetup/standardisationsetuphelper');
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    footerType: enums.FooterType;
    isLogoutConfirmationPopupDisplaying: boolean;
    resetLogoutConfirmationSatus: Function;
    isCompleteStandardisation?: boolean;
    OnClickingCancelofStdSetupPopup?: Function;
}

interface State {
    doShowSavingMarksAndAnnotationsIndicator?: boolean;
    isNonRecoverableErrorPopupVisible?: boolean;
    isDisplayingGraceResponseLessthan100PercentageError?: boolean;
    isDisplayingGraceResponseExpiredError?: boolean;
    isDisplayingResponseRemovedError?: boolean;
    isWithdrawnResponseError?: boolean;
    popUpType?: enums.PopUpType;
    isOnline?: boolean;
    isBusy?: boolean;
    isApplicationOffline?: boolean;
    isSubmitConfirmationPopupDisplaying?: boolean;
    nonRecoverableSaveMarksAndAnnotationsErrorMessage?: boolean;
    doShowMandatoryMessageValidationPopup?: boolean;
    doShowNoMarkingCheckAvailableMessage?: boolean;
    isMarkingCheckCompleteConfirmationPopupDisplaying?: boolean;
    doShowPopup?: boolean;
    reRenderLocksInQigPopUp?: boolean;
    isResponseSearchFailed?: boolean;
    showSimulationResponseSubmitConfirmationPopup?: boolean;
    showSimulationExitedPopup?: boolean;
    showAllSimulationExitedQigs?: boolean;
    renderedOn?: number;
    isSubmitErrorPopDisplaying?: boolean;
    isShared?: boolean;
    doShowShareConfirmationPopup?: boolean;
    isAutozonedMessagePopupDisplaying?: boolean;
    isQigsessionClosedError?: boolean;
    isCompleteStandardisation?: boolean;
    isNoteTimeStampChangedPopupVisible: boolean;
    isResponseModifiedPopupVisibile: boolean;
    doShowReclassifyResponseBusyIndicator?: boolean;
    unClassifiedScriptinStmUnavailableVisible: boolean;
    showRigNotFoundPopUp: boolean;
    provisionalMarkingType?: enums.ProvisionalMarkingType;
    isSaveEmailMessageDisplaying?: boolean;
    isShareResponsePopupDisplaying: boolean;
    doShowReuseRigActionBusyIndicator?: boolean;
    isShareResponsePopupDisplayingForPE: boolean;
    doShowClassifyResponseBusyIndicator?: boolean;
}

class Footer extends pureRenderComponent<Props, State> {
    // Indicates if logout has been triggered
    private _onLogoutTriggered: boolean = false;
    // Event listener object for holding online status setting method.
    private _boundOnlineStatusEvent: EventListenerObject;
    private _failureReason: enums.ResponseNavigateFailureReason = enums
        .ResponseNavigateFailureReason.None;
    private _shareResponseDetails: StandardisationResponseDetails;
    private _isSharedFromMarkScheme: boolean;
    private _showShareLoadingIndicator: boolean;
    private _showShareLoadingIndicatorForPE: boolean;
    private _classifyResponseDetails: updateESMarkGroupMarkingModeData;
    private expiredMarkGroupId: number = 0;

    private currentSaveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint = undefined;
    // variable for save marks and annotations dialog contents
    private saveMarksAndAnnotationsErrorDialogContents: saveMarksAndAnnotationsNonRecoverableErrorDialogContents =
        new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(
            false
        );
    // variable to save examiner Approval status
    private examinerApprovalStatus: enums.SaveMarksAndAnnotationErrorCode = enums
        .SaveMarksAndAnnotationErrorCode.None;
    //variable to know where the reponse is navigated to
    private navigateReponse: enums.SaveAndNavigate = enums.SaveAndNavigate.none;

    // Holds the Pop data for displaying the contents of popup
    private popUpData: PopUpData = {};
    private messageNavigationArguments: MessageNavigationArguments;

    // Indicates if logout has been triggered through Idle TimeOut
    private _isAutoLogOut: boolean = false;

    // Holds the idle time out value in milli seconds -- default:10 mins
    private _idleTimeOut: number = 600000;

    private timer: timerHelper;
    //  This will hold the mandatory message checking trigger points
    private mandatoryMessageTriggeringPoint: enums.TriggerPoint = enums.TriggerPoint.None;

    private onYesClickOfLogoutConfirmationAutoLogout: Function;

    private submitConfirmationDialogueContent: string;

    private submitConfirmationDialogueHeader: string;

    private isConcurrentSessionActive: boolean = false;

    private storageAdapterHelper = new storageAdapterHelper();

    private simulationResponseSubmitConfirmationDialogueContent: string;

    private simulationResponseSubmitConfirmationDialogueHeader: string;

    private messageDetails: InformationMessageDetails = { messageHeader: '', messageString: '' };

    private triggerPointAfterClose: number = 0;

    private offlineErrorMessage: string = null;

    private shareConfirmationClientToken: string;

    private submitMessageErrorPopupContent: SubmitResponseErrorMessageArguments = undefined;

    private copyMarksAsDefinitiveSelected: boolean = true;

    private classifyResponseDetails: StandardisationResponseDetails = undefined;

    private reclassifyResponseDetails: StandardisationResponseDetails = undefined;

    private reuseResponseDetails: Immutable.List<StandardisationResponseDetails> = undefined;

    private items: Array<genericRadioButtonItems>;

    private reuseUnclassifyItem: Array<genericRadioButtonItems>;

    private isClassifyResponseOkButtonDisabled: boolean = true;

    private previousMarkingMode: enums.MarkingMode;

    private currentMarkingMode: enums.MarkingMode;

    private displayId: string;

    private multiQigCheckboxItems: Array<genericCheckBoxItems>;

    private concurrentSaveFailArea: enums.PageContainers = enums.PageContainers.None;

    private reuseRIGSelectedDisplayId: string;

    private responseDetails: updateESMarkGroupMarkingModeData;

    private standardisationSetupHelper: standardisationSetupHelper;

    private _shareResponseArgument: SubmitResponseArgument;

    /**
     * Constructor
     * @param {Props} props
     * @param {State} state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            doShowSavingMarksAndAnnotationsIndicator: false,
            isNonRecoverableErrorPopupVisible: false,
            isDisplayingGraceResponseLessthan100PercentageError: false,
            isDisplayingGraceResponseExpiredError: false,
            isDisplayingResponseRemovedError: false,
            isOnline: applicationStore.instance.isOnline,
            isBusy: false,
            isApplicationOffline: false,
            nonRecoverableSaveMarksAndAnnotationsErrorMessage: false,
            isMarkingCheckCompleteConfirmationPopupDisplaying: false,
            doShowPopup: false,
            showSimulationResponseSubmitConfirmationPopup: false,
            showSimulationExitedPopup: false,
            showAllSimulationExitedQigs: false,
            renderedOn: 0,
            isShared: false,
            doShowShareConfirmationPopup: false,
            isQigsessionClosedError: false,
            popUpType: enums.PopUpType.None,
            isNoteTimeStampChangedPopupVisible: false,
            isResponseModifiedPopupVisibile: false,
            unClassifiedScriptinStmUnavailableVisible: false,
            showRigNotFoundPopUp: false,
            provisionalMarkingType: enums.ProvisionalMarkingType.None,
            isSaveEmailMessageDisplaying: false,
            isShareResponsePopupDisplaying: false,
            isShareResponsePopupDisplayingForPE: false
        };

        this.onYesClickOfLogoutConfirmation = this.onYesClickOfLogoutConfirmation.bind(this);
        this.onYesClickOfLogoutConfirmationAutoLogout = this.onYesClickOfLogoutConfirmation.bind(
            this,
            true
        );
        this.onNoClickOfLogoutConfirmation = this.onNoClickOfLogoutConfirmation.bind(this);
        this.onOkClickOfNonRecoverableErrorMessage = this.onOkClickOfNonRecoverableErrorMessage.bind(
            this
        );
        this.userActionInterrupted = this.userActionInterrupted.bind(this);
        this.onOkClickMandatoryMessageValidationPopup = this.onOkClickMandatoryMessageValidationPopup.bind(
            this
        );
        this.onPopupOkClick = this.onPopupOkClick.bind(this);
        this.ShowSupervisorSamplingCommentValidationPopup = this.ShowSupervisorSamplingCommentValidationPopup.bind(
            this
        );
        this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage =
            this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage.bind(
                this
            );
        /* setting submit confirmation yes/no functions to initialize. */
        this.onYesClickOfSubmitButton = this.onYesClickOfSubmitButton.bind(this);
        this.onNoClickOfSubmitButton = this.onNoClickOfSubmitButton.bind(this);
        this.onYesClickOfShareConfirmationPopup = this.onYesClickOfShareConfirmationPopup.bind(
            this
        );
        this.onNoClickOfShareConfirmationPopup = this.onNoClickOfShareConfirmationPopup.bind(this);
        this.OnOkClickOfMarkingCheckCompleteConfirmation = this.OnOkClickOfMarkingCheckCompleteConfirmation.bind(
            this
        );
        this.OnCancelClickOfMarkingCheckCompleteConfirmation = this.OnCancelClickOfMarkingCheckCompleteConfirmation.bind(
            this
        );
        this._boundOnlineStatusEvent = this.updateOnlineStatus.bind(this);
        this.isAutozonedMessagePopupVisible = this.isAutozonedMessagePopupVisible.bind(this);
        this.onSelectStdSetupResponseToMark = this.onSelectStdSetupResponseToMark.bind(
            this
        );
        this.onCompleteStandardisationSetup = this.onCompleteStandardisationSetup.bind(this);
        this.onOkClickofStandardisationSetupValidate = this.onOkClickofStandardisationSetupValidate.bind(this);
        this.resetBusyIndicatorStdSetupNotComplete = this.resetBusyIndicatorStdSetupNotComplete.bind(this);
        this.OnCancelClickOfCompleteStandardisationConfirmation = this.OnCancelClickOfCompleteStandardisationConfirmation.bind(this);
        this.OnOkClickOfCompleteStandardisationConfirmation = this.OnOkClickOfCompleteStandardisationConfirmation.bind(this);
        this.onResponseDataRecievedAfterRefresh = this.onResponseDataRecievedAfterRefresh.bind(this);
        this.onNoteTimeStampChangedPopupClose = this.onNoteTimeStampChangedPopupClose.bind(this);
        this.displayNoteSaveFailedPopup = this.displayNoteSaveFailedPopup.bind(this);
        this.reRenderUnclassifiedWorklist = this.reRenderUnclassifiedWorklist.bind(this);
        this.reRenderOnClassifiedResponseReceived = this.reRenderOnClassifiedResponseReceived.bind(this);
        this.shareResponse = this.shareResponse.bind(this);
        this.onOKClickOfReuseRigpopup = this.onOKClickOfReuseRigpopup.bind(this);
        this.populateReuseUnclassifyPopupItem = this.populateReuseUnclassifyPopupItem.bind(this);
        this.onReuseItemCheckedChange = this.onReuseItemCheckedChange.bind(this);
        this.onCancelClickOfReuseRigPopup = this.onCancelClickOfReuseRigPopup.bind(this);
        this.onCheckedChange = this.onCheckedChange.bind(this);
        this.shareResponsePopupOpen = this.shareResponsePopupOpen.bind(this);
        this.onSubmitResponseCompleted = this.onSubmitResponseCompleted.bind(this);
        this.reRenderProvionalWorklist = this.reRenderProvionalWorklist.bind(this);
        this.submitResponseFromMarkscheme = this.submitResponseFromMarkscheme.bind(this);
        if (config.general.IDLE_TIMEOUT) {
            this._idleTimeOut = config.general.IDLE_TIMEOUT;
        }

        // One Issue noticed that the footer compoent is taking time to load sometimes. 
        // Because of this, some of the events are already passed. Recheck for the first time for one of the event.
        if (qigStore.instance.getOverviewData === undefined) {
            this.onSimulationExitedQigsAndLocksInQigsRecieved(false);
        }

    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        let isAskOnLogOutEnabled: boolean;
        let confirmationDialog: JSX.Element;
        let busyIndicator: JSX.Element;

        let submitConfirmationDialog = (
            <ConfirmationDialog
                content={this.submitConfirmationDialogueContent}
                header={this.submitConfirmationDialogueHeader}
                displayPopup={this.state.isSubmitConfirmationPopupDisplaying}
                isCheckBoxVisible={false}
                noButtonText={localeStore.instance.TranslateText('generic.logout-dialog.no-button')}
                yesButtonText={localeStore.instance.TranslateText(
                    'generic.logout-dialog.yes-button'
                )}
                onYesClick={this.onYesClickOfSubmitButton}
                onNoClick={this.onNoClickOfSubmitButton}
                isKeyBoardSupportEnabled={true}
                dialogType={enums.PopupDialogType.LogoutConfirmation}
            />
        );

        let shareConfirmationPopup = this.state.isShared ? (
            <ConfirmationDialog
                content={localeStore.instance.TranslateText(
                    'marking.response.share-confirmation-popup.content'
                )}
                header={null}
                displayPopup={this.state.doShowShareConfirmationPopup}
                isCheckBoxVisible={false}
                noButtonText={localeStore.instance.TranslateText(
                    'marking.response.share-confirmation-popup.no-button'
                )}
                yesButtonText={localeStore.instance.TranslateText(
                    'marking.response.share-confirmation-popup.yes-button'
                )}
                onYesClick={this.onYesClickOfShareConfirmationPopup.bind(this)}
                onNoClick={this.onNoClickOfShareConfirmationPopup.bind(this)}
                dialogType={enums.PopupDialogType.ShareConfirmationPopup}
                isKeyBoardSupportEnabled={true}
            />
        ) : null;

        let mandatoryMessageValidationPopup = (
            <GenericDialog
                content={localeStore.instance.TranslateText(
                    'messaging.compose-message.mandatory-message-warning-dialog.body'
                )}
                header={localeStore.instance.TranslateText(
                    'messaging.compose-message.mandatory-message-warning-dialog.header'
                )}
                displayPopup={this.state.doShowMandatoryMessageValidationPopup}
                okButtonText={localeStore.instance.TranslateText(
                    'messaging.compose-message.recipient-selector.ok-button'
                )}
                onOkClick={this.onOkClickMandatoryMessageValidationPopup.bind(this)}
                id='mandatoryMessageValidationPopup'
                key='mandatoryMessageValidationPopup'
                popupDialogType={enums.PopupDialogType.none}
            />
        );

        let supervisorSamplingCommentValidationPopup = (
            <GenericDialog
                content={this.messageDetails.messageString}
                header={this.messageDetails.messageHeader}
                displayPopup={this.state.doShowPopup}
                okButtonText={localeStore.instance.TranslateText(
                    'messaging.compose-message.recipient-selector.ok-button'
                )}
                onOkClick={this.onPopupOkClick.bind(this)}
                id='supervisorSamplingCommentValidationPopup'
                key='supervisorSamplingCommentValidationPopup'
                popupDialogType={enums.PopupDialogType.GenericMessage}
            />);

        let noteTimeStampChangedPopup = (
            <GenericDialog
                content={this.messageDetails.messageString}
                header={this.messageDetails.messageHeader}
                displayPopup={this.state.isNoteTimeStampChangedPopupVisible}
                okButtonText={localeStore.instance.TranslateText(
                    'messaging.compose-message.recipient-selector.ok-button'
                )}
                onOkClick={this.onNoteTimeStampChangedPopupClose.bind(this)}
                id='noteTimeStampChangedPopup'
                key='noteTimeStampChangedPopup'
                popupDialogType={enums.PopupDialogType.GenericMessage}
            />
        );
        let responseModifiedPopup = (
            <GenericDialog
                content={this.messageDetails.messageString}
                header={this.messageDetails.messageHeader}
                displayPopup={this.state.isResponseModifiedPopupVisibile}
                okButtonText={localeStore.instance.TranslateText(
                    'messaging.compose-message.recipient-selector.ok-button'
                )}
                onOkClick={this.onResponseModifiedPopupClose.bind(this)}
                id='responseMOdifiedPopup'
                key='responseMOdifiedPopup'
                popupDialogType={enums.PopupDialogType.GenericMessage}
            />
        );

        let simulationResponseSubmitConfirmationPopup = (
            <ConfirmationDialog
                content={this.simulationResponseSubmitConfirmationDialogueContent}
                header={this.simulationResponseSubmitConfirmationDialogueHeader}
                displayPopup={this.state.showSimulationResponseSubmitConfirmationPopup}
                isCheckBoxVisible={false}
                noButtonText={localeStore.instance.TranslateText('generic.logout-dialog.no-button')}
                yesButtonText={localeStore.instance.TranslateText(
                    'generic.logout-dialog.yes-button'
                )}
                onYesClick={this.onYesClickOfSimulationResponseSubmitButton.bind(this)}
                onNoClick={this.onNoClickOfSimulationResponseSubmitButton.bind(this)}
                dialogType={enums.PopupDialogType.SimulationResponseSubmitConfirmation}
                isKeyBoardSupportEnabled={true}
            />
        );

        /** Getting Ask On LogOut value from user option */
        isAskOnLogOutEnabled =
            userOptionsHelper.getUserOptionByName(useroptionKeys.ASK_ON_LOG_OUT) === 'true'
                ? true
                : false;

        /** this.props.isConfirmationPopupDisplaying check included here, in the initial load its value
         *    will be false
         */
        if (
            !isAskOnLogOutEnabled &&
            this.props.isLogoutConfirmationPopupDisplaying &&
            !this.state.doShowSavingMarksAndAnnotationsIndicator &&
            !this._onLogoutTriggered
        ) {
            this.onYesClickOfLogoutConfirmation();

            /**this.props.isConfirmationPopupDisplaying check included here, if it is true will load the confirmation dialog
             * content into confirmationDialog
             */
        } else if (
            this.props.isLogoutConfirmationPopupDisplaying &&
            !this.state.doShowSavingMarksAndAnnotationsIndicator &&
            !this._onLogoutTriggered
        ) {
            confirmationDialog = (
                <ConfirmationDialog
                    content={localeStore.instance.TranslateText('generic.logout-dialog.body')}
                    header={localeStore.instance.TranslateText('generic.logout-dialog.header')}
                    displayPopup={this.props.isLogoutConfirmationPopupDisplaying}
                    isCheckBoxVisible={true}
                    noButtonText={localeStore.instance.TranslateText(
                        'generic.logout-dialog.no-button'
                    )}
                    yesButtonText={localeStore.instance.TranslateText(
                        'generic.logout-dialog.yes-button'
                    )}
                    onYesClick={this.onYesClickOfLogoutConfirmation}
                    onNoClick={this.onNoClickOfLogoutConfirmation}
                    dialogType={enums.PopupDialogType.LogoutConfirmation}
                />
            );
        }

        if (this.state.isBusy) {
            switch (busyIndicatorStore.instance.getBusyIndicatorInvoker) {
                case enums.BusyIndicatorInvoker.submitInResponseScreen:
                    busyIndicator = (
                        <BusyIndicator
                            id={
                                'response_' +
                                enums.BusyIndicatorInvoker.submitInResponseScreen.toString()
                            }
                            isBusy={this.state.isBusy}
                            key={
                                'response_' +
                                enums.BusyIndicatorInvoker.submitInResponseScreen.toString()
                            }
                            isMarkingBusy={false}
                            busyIndicatorInvoker={enums.BusyIndicatorInvoker.submitInResponseScreen}
                            showBackgroundScreen={false}
                            isOffline={!this.state.isOnline}
                        />
                    );
                    break;
                case enums.BusyIndicatorInvoker.loadingHistoryDetails:
                    busyIndicator = (
                        <BusyIndicator
                            id={
                                'history_' +
                                enums.BusyIndicatorInvoker.loadingHistoryDetails.toString()
                            }
                            isBusy={this.state.isBusy}
                            key={
                                'history_' +
                                enums.BusyIndicatorInvoker.loadingHistoryDetails.toString()
                            }
                            isMarkingBusy={false}
                            busyIndicatorInvoker={enums.BusyIndicatorInvoker.loadingHistoryDetails}
                            showBackgroundScreen={false}
                            isOffline={!this.state.isOnline}
                        />
                    );
                    break;
                case enums.BusyIndicatorInvoker.validateStandardisationSetup:
                    busyIndicator = (
                        <BusyIndicator
                            id={
                                'std_' +
                                enums.BusyIndicatorInvoker.validateStandardisationSetup.toString()
                            }
                            isBusy={this.state.isBusy}
                            key={
                                'std_' +
                                enums.BusyIndicatorInvoker.validateStandardisationSetup.toString()
                            }
                            isMarkingBusy={false}
                            busyIndicatorInvoker={enums.BusyIndicatorInvoker.validateStandardisationSetup}
                            showBackgroundScreen={false}
                            isOffline={!this.state.isOnline}
                        />
                    );
                    break;
            }
        }
        if (this.state.isCompleteStandardisation && this.state.isBusy === true) {
            busyIndicator = (
                <BusyIndicator
                    id={
                        'std_' +
                        enums.BusyIndicatorInvoker.completingStandardisationSetup.toString()
                    }
                    isBusy={this.state.isBusy}
                    key={
                        'std_' +
                        enums.BusyIndicatorInvoker.completingStandardisationSetup.toString()
                    }
                    isMarkingBusy={false}
                    busyIndicatorInvoker={enums.BusyIndicatorInvoker.completingStandardisationSetup}
                    showBackgroundScreen={false}
                    isOffline={!this.state.isOnline}
                />
            );
        }
        if (this.state.isBusy === true && (this._showShareLoadingIndicator || this._showShareLoadingIndicatorForPE)) {
            busyIndicator = (
                <BusyIndicator
                    id={
                        'std_' +
                        enums.BusyIndicatorInvoker.completingStandardisationSetup.toString()
                    }
                    isBusy={this.state.isBusy}
                    key={
                        'std_' +
                        enums.BusyIndicatorInvoker.completingStandardisationSetup.toString()
                    }
                    isMarkingBusy={false}
                    busyIndicatorInvoker={enums.BusyIndicatorInvoker.completingStandardisationSetup}
                    showBackgroundScreen={false}
                    isOffline={!this.state.isOnline}
                />
            );
        }

        if (this.state.doShowSavingMarksAndAnnotationsIndicator) {
            busyIndicator = (
                <BusyIndicator
                    id={
                        'response_' +
                        enums.BusyIndicatorInvoker.savingMarksAndAnnotations.toString()
                    }
                    isBusy={this.state.doShowSavingMarksAndAnnotationsIndicator}
                    key={
                        'response_' +
                        enums.BusyIndicatorInvoker.savingMarksAndAnnotations.toString()
                    }
                    isMarkingBusy={false}
                    busyIndicatorInvoker={enums.BusyIndicatorInvoker.savingMarksAndAnnotations}
                    showBackgroundScreen={false}
                    isOffline={!this.state.isOnline}
                />
            );
        }

        if (this.state.doShowReclassifyResponseBusyIndicator) {
            busyIndicator = (
                <BusyIndicator
                    id={
                        'response_' +
                        enums.BusyIndicatorInvoker.reclassifyResponse.toString()
                    }
                    isBusy={this.state.doShowReclassifyResponseBusyIndicator}
                    key={
                        'response_' +
                        enums.BusyIndicatorInvoker.reclassifyResponse.toString()
                    }
                    isMarkingBusy={false}
                    busyIndicatorInvoker={enums.BusyIndicatorInvoker.reclassifyResponse}
                    showBackgroundScreen={false}
                    isOffline={!this.state.isOnline}
                />
            );
        }

        if (this.state.doShowReuseRigActionBusyIndicator) {
            busyIndicator = (
                <BusyIndicator
                    id={
                        'response_' +
                        enums.BusyIndicatorInvoker.reuseResponse.toString()
                    }
                    isBusy={this.state.doShowReuseRigActionBusyIndicator}
                    key={
                        'response_' +
                        enums.BusyIndicatorInvoker.reuseResponse.toString()
                    }
                    isMarkingBusy={false}
                    busyIndicatorInvoker={enums.BusyIndicatorInvoker.reuseResponse}
                    showBackgroundScreen={false}
                    isOffline={!this.state.isOnline}
                />
            );
        }

        if (this.state.doShowClassifyResponseBusyIndicator) {
            if (this.isUnclassifiedWorklistSelected()) {
                busyIndicator = (
                    <BusyIndicator
                        id={
                            'response_' +
                            enums.BusyIndicatorInvoker.classifyResponse.toString()
                        }
                        isBusy={this.state.doShowClassifyResponseBusyIndicator}
                        key={
                            'response_' +
                            enums.BusyIndicatorInvoker.classifyResponse.toString()
                        }
                        isMarkingBusy={false}
                        busyIndicatorInvoker={enums.BusyIndicatorInvoker.classifyResponse}
                        showBackgroundScreen={false}
                        isOffline={!this.state.isOnline}
                    />
                );
            }
        }

        let nonRecoverableErrorMessage = (
            <GenericDialog
                content={this.saveMarksAndAnnotationsErrorDialogContents.content}
                header={this.saveMarksAndAnnotationsErrorDialogContents.header}
                multiLineContent={this.saveMarksAndAnnotationsErrorDialogContents.tableContent}
                displayPopup={this.state.isNonRecoverableErrorPopupVisible}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfNonRecoverableErrorMessage}
                id='nonRecoverableErrorMessge'
                key='marksAndAnnotationsErrorMessge'
                popupDialogType={enums.PopupDialogType.NonRecoverableDetailedError}
            />
        );

        let nonRecoverableSaveMarksAndAnnotationsErrorMessage = (
            <GenericDialog
                content={localeStore.instance.TranslateText(
                    'marking.worklist.response-submission-error-dialog.body-single-response-not-submitted'
                )}
                header={localeStore.instance.TranslateText(
                    'marking.worklist.response-submission-error-dialog.header'
                )}
                displayPopup={this.state.nonRecoverableSaveMarksAndAnnotationsErrorMessage}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfNonRecoverableErrorMessage}
                id='nonRecoverableSaveMarksAndAnnotationErrorMessge'
                key='saveMarksAndAnnotationsErrorMessge'
                popupDialogType={enums.PopupDialogType.AllPageNotAnnotated}
            />
        );

        let gracePeriodResponseUnmarkedDialog = this.state
            .isDisplayingGraceResponseLessthan100PercentageError ? this._failureReason ===
                enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse ? (
                    <GenericDialog
                        content={localeStore.instance.TranslateText(
                            'marking.response.saving-marks-error-dialog.body-cannot-leave-response-partially-marked-in-grace'
                        )}
                        header={localeStore.instance.TranslateText(
                            'marking.response.leaving-response-warning-dialog.header')}
                        displayPopup={this.state.isDisplayingGraceResponseLessthan100PercentageError}
                        okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                        onOkClick={this.onOkClickOfResponseInGraceMessage.bind(this)}
                        id='responseInGraceMessage'
                        key='responseInGraceMessageMessge'
                        popupDialogType={enums.PopupDialogType.GracePeriodWarning}
                    />
                ) : (
                    <GenericDialog
                        content={localeStore.instance.TranslateText(
                            'marking.response.saving-marks-error-dialog.body-must-annotate-all-pages-in-grace'
                        )}
                        header={localeStore.instance.TranslateText(
                            'marking.response.saving-marks-error-dialog.header-must-annotate-all-pages-in-grace'
                        )}
                        displayPopup={this.state.isDisplayingGraceResponseLessthan100PercentageError}
                        okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                        onOkClick={this.onOkClickOfResponseInGraceMessage.bind(this)}
                        id='responseInGraceMessage'
                        key='responseInGraceMessageMessge'
                        popupDialogType={enums.PopupDialogType.none}
                    />
                ) : null;

        let gracePeriodExpiredErrorDialog = this.state.isDisplayingGraceResponseExpiredError ? (
            <GenericDialog
                content={this.getGracePeriodExpiredMessageBody()}
                header={localeStore.instance.TranslateText(
                    'marking.response.saving-marks-error-dialog.header-grace-period-expired'
                )}
                displayPopup={this.state.isDisplayingGraceResponseExpiredError}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage}
                id='responseInGraceMessage'
                key='responseInGraceMessageMessge'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;

        let responseRemovedErrorDialog = this.state.isDisplayingResponseRemovedError ? (
            <GenericDialog
                content={this.getResponseRemovedErrorDialogMessageBody()}
                header={localeStore.instance.TranslateText(
                    'marking.response.saving-marks-error-dialog.header-response-removed-from-worklist'
                )}
                displayPopup={this.state.isDisplayingResponseRemovedError}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage}
                id='response-removed-error-message'
                key='key-response-removed-error-message'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;

        let confirmationDialogContent: string;
        if (this.state.popUpType === enums.PopUpType.DiscardMessage) {
            confirmationDialogContent = localeStore.instance.TranslateText(
                'messaging.compose-message.discard-message-dialog.body-discard'
            );
        } else if (this.state.popUpType === enums.PopUpType.DiscardMessageNavigateAway) {
            if (this.popUpData.popupContent) {
                confirmationDialogContent = this.popUpData.popupContent;
            } else {
                confirmationDialogContent = localeStore.instance.TranslateText(
                    'messaging.compose-message.discard-message-dialog.body-navigated-away'
                );
            }
        } else {
            confirmationDialogContent = localeStore.instance.TranslateText(
                'messaging.compose-message.discard-message-dialog.body-start-new-message-while-composing'
            );
        }

        let discardMessageDialog =
            this.state.popUpType === enums.PopUpType.DiscardMessage ||
                this.state.popUpType === enums.PopUpType.DiscardMessageNavigateAway ||
                this.state.popUpType === enums.PopUpType.DiscardOnNewMessageButtonClick ? (
                    <ConfirmationDialog
                        content={
                            this.popUpData.popupContent ? (
                                this.popUpData.popupContent
                            ) : (
                                    confirmationDialogContent
                                )
                        }
                        header={localeStore.instance.TranslateText(
                            'messaging.compose-message.discard-message-dialog.header'
                        )}
                        displayPopup={true}
                        isCheckBoxVisible={false}
                        noButtonText={localeStore.instance.TranslateText(
                            'messaging.compose-message.discard-message-dialog.no-button'
                        )}
                        yesButtonText={localeStore.instance.TranslateText(
                            'messaging.compose-message.discard-message-dialog.yes-button'
                        )}
                        onYesClick={this.handlePopUpAction.bind(
                            this,
                            this.state.popUpType,
                            enums.PopUpActionType.Yes
                        )}
                        onNoClick={this.handlePopUpAction.bind(
                            this,
                            this.state.popUpType,
                            enums.PopUpActionType.No
                        )}
                        dialogType={enums.PopupDialogType.Message}
                        isKeyBoardSupportEnabled={true}
                    />
                ) : null;

        let confirmationHeaderContent: string;

        switch (this.state.popUpType) {
            case enums.PopUpType.DiscardMessageOnNewException:
            case enums.PopUpType.DiscardMessageOnViewExceptionButtonClick:
                confirmationHeaderContent = localeStore.instance.TranslateText(
                    'messaging.compose-message.discard-message-dialog.header'
                );
                break;
            case enums.PopUpType.DiscardExceptionNavigateAway:
                confirmationHeaderContent = localeStore.instance.TranslateText(
                    'marking.response.discard-exception-dialog.header'
                );
                confirmationDialogContent = localeStore.instance.TranslateText(
                    'marking.response.discard-exception-dialog.body-navigate-away'
                );
                break;
            case enums.PopUpType.CloseException:
                confirmationHeaderContent = localeStore.instance.TranslateText(
                    'marking.response.close-exception-dialog.header'
                );
                break;
            default:
                confirmationHeaderContent = localeStore.instance.TranslateText(
                    'marking.response.discard-exception-dialog.header'
                );
                confirmationDialogContent = localeStore.instance.TranslateText(
                    'marking.response.discard-exception-dialog.body-raise-new'
                );
                break;
        }

        let discardExceptionDialog =
            this.state.popUpType === enums.PopUpType.DiscardException ||
                this.state.popUpType === enums.PopUpType.DiscardExceptionNavigateAway ||
                this.state.popUpType === enums.PopUpType.DiscardOnNewExceptionButtonClick ||
                this.state.popUpType === enums.PopUpType.DiscardMessageOnViewExceptionButtonClick ||
                this.state.popUpType === enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick ||
                this.state.popUpType === enums.PopUpType.DiscardExceptionOnViewMessage ||
                this.state.popUpType === enums.PopUpType.DiscardMessageOnNewException ||
                this.state.popUpType === enums.PopUpType.DiscardExceptionOnNewMessage ||
                this.state.popUpType === enums.PopUpType.CloseException ? (
                    <ConfirmationDialog
                        content={
                            this.popUpData.popupContent ? (
                                this.popUpData.popupContent
                            ) : (
                                    confirmationDialogContent
                                )
                        }
                        header={confirmationHeaderContent}
                        displayPopup={true}
                        isCheckBoxVisible={false}
                        noButtonText={localeStore.instance.TranslateText(
                            'marking.response.discard-exception-dialog.no-button'
                        )}
                        yesButtonText={localeStore.instance.TranslateText(
                            'marking.response.discard-exception-dialog.yes-button'
                        )}
                        onYesClick={this.handlePopUpAction.bind(
                            this,
                            this.state.popUpType,
                            enums.PopUpActionType.Yes
                        )}
                        onNoClick={this.handlePopUpAction.bind(
                            this,
                            this.state.popUpType,
                            enums.PopUpActionType.No
                        )}
                        dialogType={enums.PopupDialogType.Exception}
                        isKeyBoardSupportEnabled={true}
                    />
                ) : null;

        let mandatoryMessageDialog =
            this.state.popUpType === enums.PopUpType.MandatoryMessage ? (
                <GenericDialog
                    content={localeStore.instance.TranslateText(
                        'messaging.mandatory-message-dialog.body'
                    )}
                    header={localeStore.instance.TranslateText(
                        'messaging.mandatory-message-dialog.header'
                    )}
                    displayPopup={true}
                    okButtonText={localeStore.instance.TranslateText(
                        'generic.error-dialog.ok-button'
                    )}
                    onOkClick={this.handlePopUpAction.bind(
                        this,
                        this.state.popUpType,
                        enums.PopUpActionType.Ok
                    )}
                    id='id_mandatory_message_dialog'
                    key='key_mandatory_message_dialog'
                    popupDialogType={enums.PopupDialogType.none}
                />
            ) : null;

        let withdrawErrorDialog = this.state.isWithdrawnResponseError ? (
            <GenericDialog
                content={this.getWithdrawnResponseErrorMessage()}
                header={localeStore.instance.TranslateText(
                    'marking.worklist.response-allocation-error-dialog.response-allocation-error-header-withdrawnMarker'
                )}
                displayPopup={this.state.isWithdrawnResponseError}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfWithDrawErrorMessage.bind(this)}
                id='withdrawResponseMessage'
                key='withdrawResponseMessageMessage'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;
        let sessionClosedErrorDilaog = this.state.isQigsessionClosedError ? (
            <GenericDialog
                content={this.getSessionClosedErrorMessage()}
                header={localeStore.instance.TranslateText(
                    'marking.worklist.request-marking-check-error-dialog.header-session-closed'
                )}
                displayPopup={this.state.isQigsessionClosedError}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfWithDrawErrorMessage.bind(this)}
                id='sessionClosedResponseMessage'
                key='sessionClosedResponseMessageMessage'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;
        let responseSearchFailedErrorDialog = this.state.isResponseSearchFailed ? (
            <GenericDialog
                content={this.getResponseSearchFailedErrorMessage()}
                header={localeStore.instance.TranslateText('generic.error-dialog.header')}
                displayPopup={this.state.isResponseSearchFailed}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOkClickOfResponseSearchFailedErrorMessage.bind(this)}
                id='removedResponseMessage'
                key='removedResponseMessageMessage'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;

        let applicationOffLineErrorMessage = this.state.isApplicationOffline ? (
            <GenericDialog
                content={this.offlineErrorMessage}
                header={localeStore.instance.TranslateText('generic.offline-dialog.header')}
                displayPopup={this.state.isApplicationOffline}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onApplicationErrorMessagePopUpClicked.bind(this)}
                id='offlineErrorMessge'
                key='offlineErrorMessge'
                popupDialogType={enums.PopupDialogType.OffLineWarning}
            />
        ) : null;

        let idleTimer = this.state.isOnline ? (
            <IdleTimer
                idleAction={this.onYesClickOfLogoutConfirmationAutoLogout}
                timeout={this._idleTimeOut}
            />
        ) : null;

        let noMarkingCheckAvailableMessage =
            this.state.popUpType === enums.PopUpType.NoMarkingCheckRequestPossible ? (
                <GenericDialog
                    content={localeStore.instance.TranslateText(
                        'marking.worklist.request-marking-check-error-dialog.body-no-examiners-available'
                    )}
                    header={localeStore.instance.TranslateText(
                        'marking.worklist.request-marking-check-error-dialog.header-no-examiners-available'
                    )}
                    displayPopup={this.state.doShowNoMarkingCheckAvailableMessage}
                    okButtonText={localeStore.instance.TranslateText(
                        'team-management.examiner-worklist.change-status.ok-button'
                    )}
                    onOkClick={this.handlePopUpAction.bind(
                        this,
                        this.state.popUpType,
                        enums.PopUpActionType.Ok
                    )}
                    id='id_no_marking_check_message'
                    key='key_no_marking_check_message'
                    popupDialogType={enums.PopupDialogType.none}
                />
            ) : null;

        let markingCheckCompleteConfirmationPopup = this.state
            .isMarkingCheckCompleteConfirmationPopupDisplaying ? (
                <ConfirmationDialog
                    content={localeStore.instance
                        .TranslateText(
                        'marking.worklist.perform-marking-check-confirmation-dialog.body'
                        )
                        .replace(
                        '{0}',
                        worklistStore.instance.selectedMarkingCheckExaminer.toExaminer.fullName
                        )}
                    header={localeStore.instance.TranslateText(
                        'marking.worklist.perform-marking-check-confirmation-dialog.header'
                    )}
                    displayPopup={true}
                    isCheckBoxVisible={false}
                    noButtonText={localeStore.instance.TranslateText(
                        'generic.user-menu.profile-section.cancel-email-button'
                    )}
                    yesButtonText={localeStore.instance.TranslateText(
                        'team-management.examiner-worklist.change-status.ok-button'
                    )}
                    onYesClick={this.OnOkClickOfMarkingCheckCompleteConfirmation}
                    onNoClick={this.OnCancelClickOfMarkingCheckCompleteConfirmation}
                    dialogType={enums.PopupDialogType.CompleteMarkingCheck}
                    isKeyBoardSupportEnabled={true}
                />
            ) : null;

        let warningMessagePopup = (
            <WarningMessagePopup
                id='id_warning_message_popup'
                key='key_warning_message_popup'
                buttonText={localeStore.instance.TranslateText(
                    'team-management.examiner-worklist.change-status.ok-button'
                )}
            />
        );

        let submitErrorPopup = this.state.isSubmitErrorPopDisplaying ? (
            <GenericDialog
                content={localeStore.instance.TranslateText(
                    this.submitMessageErrorPopupContent.messageContent
                )}
                header={localeStore.instance.TranslateText(
                    this.submitMessageErrorPopupContent.messageHeader
                )}
                displayPopup={this.state.isSubmitErrorPopDisplaying}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onSubmitResponseErrorPopupOkClick}
                id='submitErrorMessge'
                key='submitErrorMessge'
                popupDialogType={enums.PopupDialogType.SubmitResponseError}
            />
        ) : null;

        //Pop up for displaying warning message on opening a QIG in an autozoned question paper
        let autozonedWarningMessage = this.state.isAutozonedMessagePopupDisplaying ? (
            <GenericDialog
                content={localeStore.instance.TranslateText(
                    'marking.worklist.autozoned-warning-dialog.body'
                )}
                header={localeStore.instance.TranslateText(
                    'marking.worklist.autozoned-warning-dialog.header'
                )}
                displayPopup={this.state.isAutozonedMessagePopupDisplaying}
                okButtonText={localeStore.instance.TranslateText(
                    'marking.worklist.autozoned-warning-dialog.ok-button'
                )}
                onOkClick={this.onAutozonedWarningMessageOkClick}
                id='id_autozonedWarningMessage'
                key='key_autozonedWarningMessage'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;

        // popup when clicked on the select responses in Std setup - select to mark button
        let selecttoMarkProvisionalDialog =
            this.state.popUpType === enums.PopUpType.SelectToMarkAsProvisional ? (
                <MultiOptionConfirmationDialog
                    content={this.getSelectToMarkProvisionalPopupContent}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-header'
                    )}
                    displayPopup={true}
                    onCancelClick={this.onCancelClickOfSelectResponseToMarkasProvisional}
                    onYesClick={this.selectProvisionalMarkNowClick}
                    onNoClick={this.selectProvisionalMarkLaterClick}
                    isKeyBoardSupportEnabled={true}
                    selectedLanguage={this.props.selectedLanguage}
                    popupSize={enums.PopupSize.Medium}
                    popupType={enums.PopUpType.SelectToMarkAsProvisional}
                    buttonCancelText={localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-button1'
                    )}
                    buttonNoText={localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-button2'
                    )}
                    buttonYesText={localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-button3'
                    )}
                    displayNoButton={true}
                />
            ) : null;

        let completeStandardisationPopup =
            this.props.isCompleteStandardisation && !this.state.isCompleteStandardisation ? (
                <ConfirmationDialog
                    content={localeStore.instance.TranslateText(
                        'standardisation-setup.left-panel.complete-standardisation-popup-body'
                    )}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.left-panel.complete-standardisation-popup-header'
                    )}
                    displayPopup={true}
                    isCheckBoxVisible={false}
                    noButtonText={localeStore.instance.TranslateText('generic.logout-dialog.no-button')}
                    yesButtonText={localeStore.instance.TranslateText(
                        'generic.logout-dialog.yes-button'
                    )}
                    onYesClick={this.OnOkClickOfCompleteStandardisationConfirmation}
                    onNoClick={this.OnCancelClickOfCompleteStandardisationConfirmation}
                    dialogType={enums.PopupDialogType.none}
                    isKeyBoardSupportEnabled={true}
                />
            ) : null;

        let completeStandardisationSetupPopup =
            this.state.popUpType === enums.PopUpType.CompleteStandardisationValidate ? (
                <GenericDialog
                    content={localeStore.instance.TranslateText(
                        'standardisation-setup.left-panel.complete-standardisation-validate-body'
                    )}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.left-panel.complete-standardisation-validate-header'
                    )}
                    displayPopup={this.state.popUpType === enums.PopUpType.CompleteStandardisationValidate ? true : false}
                    okButtonText={localeStore.instance.TranslateText(
                        'marking.worklist.autozoned-warning-dialog.ok-button'
                    )}
                    onOkClick={this.onOkClickofStandardisationSetupValidate}
                    id='id_standardisationsetupvalidate'
                    key='key_autozonedWarningMessage'
                    popupDialogType={enums.PopupDialogType.none}
                />
            ) : null;

        let markAsDefinitiveDialog =
            this.state.popUpType === enums.PopUpType.MarkAsDefinitive ? (
                <MultiOptionConfirmationDialog
                    content={this.getMarkAsDefinitivePopupContent}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-header'
                    )}
                    displayPopup={true}
                    onCancelClick={this.onCancelClickOnMarkAsDefinitivePopUp}
                    onYesClick={this.submitClickOnMarkAsDefinitivePopUp}
                    isKeyBoardSupportEnabled={true}
                    selectedLanguage={this.props.selectedLanguage}
                    popupSize={enums.PopupSize.Medium}
                    popupType={enums.PopUpType.MarkAsDefinitive}
                    buttonCancelText={localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-button1'
                    )}
                    buttonYesText={localeStore.instance.TranslateText(
                        'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-submit-button'
                    )}
                    displayNoButton={false}
                />
            ) : null;

        let header = this.isUnclassifiedWorklistSelected() ?
            'standardisation-setup.standardisation-setup-worklist.classify-multioption-popup.header' :
            'standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.header';

        let reusepopupHeader = 'standardisation-setup.previous-session.reuse-action-popup.header';

        let reuseRigActionMultiOptionDialog =
            this.state.popUpType === enums.PopUpType.ReuseRigAction ? (
                <MultiOptionConfirmationDialog
                    content={this.getReUseActionMultiOptionPopupContent}
                    header={localeStore.instance.TranslateText(reusepopupHeader)}
                    displayPopup={true}
                    isClassifyResponseOkButtonDisabled={false}
                    onCancelClick={this.onCancelClickOfReuseRigPopup}
                    onYesClick={this.onOKClickOfReuseRigpopup}
                    isKeyBoardSupportEnabled={true}
                    selectedLanguage={this.props.selectedLanguage}
                    popupSize={enums.PopupSize.Medium}
                    popupType={enums.PopUpType.ReuseRigAction}
                    buttonCancelText={localeStore.instance.TranslateText(
                        'standardisation-setup.previous-session.reuse-action-popup.cancel-button'
                    )}
                    buttonYesText={localeStore.instance.TranslateText(
                        'standardisation-setup.previous-session.reuse-action-popup.ok-button'
                    )}
                    displayNoButton={false}
                    key='key_reuseRigActionMultiOptionDialog'
                />
            ) : null;
        // Popup when clicked on unclassified worklsit 'classify' or classified worklsit 'reclassify' of a response
        let reclassifyResponseMultiOptionDialog =
            this.state.popUpType === enums.PopUpType.ReclassifyMultiOption ? (
                <MultiOptionConfirmationDialog
                    content={this.getReclassificationMultiOptionPopupContent}
                    header={localeStore.instance.TranslateText(header)}
                    displayPopup={true}
                    isClassifyResponseOkButtonDisabled={this.isUnclassifiedWorklistSelected() ?
                        this.isClassifyResponseOkButtonDisabled : false}
                    onCancelClick={this.onCancelClickOfReclassifyMultiOptionPopUp}
                    onYesClick={this.onReclassifyResponse}
                    isKeyBoardSupportEnabled={true}
                    selectedLanguage={this.props.selectedLanguage}
                    popupSize={enums.PopupSize.Medium}
                    popupType={enums.PopUpType.ReclassifyMultiOption}
                    buttonCancelText={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.cancel-button'
                    )}
                    buttonYesText={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.ok-button'
                    )}
                    displayNoButton={false}
                    key='key_reclassifyResponseMultiOptionDialog'
                />
            ) : null;

        // Popup Dialog to notify user above reclassify failure.
        let reclassifyErrorPopupDialog =
            (this.state.popUpType === enums.PopUpType.ReclassifyError ?

                <GenericDialog
                    content={this.getReclassifyErrorPopupContent()}
                    multiLineContent={null}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.reclassifyerror-popup.header'
                    )}
                    secondaryContent={null}
                    displayPopup={true}
                    okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                    onOkClick={this.onReclassifyErrorMessageOkClick}
                    id='reclassifyError'
                    key='reclassifyErrorMessage'
                    popupDialogType={enums.PopupDialogType.ReclassifyError}
                    footerContent={null}
                /> : null
            );

        // Popup Dialog to notify user above concurrent save fail.
        let concurrentSaveFailPopup =
            (this.state.popUpType === enums.PopUpType.ConcurrentSaveFail ?
                <GenericDialog
                    content={this.classifyOrReclassifySaveFailPopUpContent}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.concurrent-esmarkingmode-save-fail-popup.header'
                    )}
                    secondaryContent={null}
                    displayPopup={true}
                    okButtonText={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.concurrent-esmarkingmode-save-fail-popup.ok-button')}
                    onOkClick={this.onConcurrentSaveFailPopupOkClick}
                    id='concurrentSaveFailError'
                    key='concurrentSaveFailErrorMessage'
                    popupDialogType={enums.PopupDialogType.ConcurrentSaveFail}
                    footerContent={null}
                /> : null
            );

        // Popup dialog to notify user that the current response has already been discarded.
        let discardResponseFailPopup =
            (this.state.popUpType === enums.PopUpType.DiscardResponseFail ?
                <GenericDialog
                    content={this.discardResponseFailPopUpContent}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.response-already-discarded-popup.header'
                    )}
                    secondaryContent={null}
                    displayPopup={true}
                    okButtonText={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.response-already-discarded-popup.ok-button')}
                    onOkClick={this.onDiscardResponseFailPopupOkClick}
                    id='discardResponseFailError'
                    key='concurrentSaveFailErrorMessage'
                    popupDialogType={enums.PopupDialogType.DiscardResponse}
                    footerContent={null}
                /> : null
            );

        // Popup Dialog to notify user above concurrent save fail.
        let unClassifiedScriptinStmUnavailablePopup =
            (this.state.unClassifiedScriptinStmUnavailableVisible === true ?
                <GenericDialog
                    content={stringHelper.format(localeStore.instance.TranslateText
                        ('standardisation-setup.unclassified-script-unavailable-popup.content'),
                        [responseStore.instance.selectedDisplayId.toString()])}
                    header={localeStore.instance.TranslateText('standardisation-setup.unclassified-script-unavailable-popup.header')}
                    secondaryContent={null}
                    okButtonText={localeStore.instance.TranslateText(
                        'standardisation-setup.unclassified-script-unavailable-popup.ok-button')}
                    onOkClick={this.okClickOnUnavailablePopUp}
                    displayPopup={this.state.unClassifiedScriptinStmUnavailableVisible}
                    id='unclassifiedscriptunavailable'
                    key='unclassifiedscriptunavailableKey'
                    popupDialogType={enums.PopupDialogType.none}
                    footerContent={null} /> : null
            );

        let rigNotFoundDialog = this.state.showRigNotFoundPopUp ? (
            <GenericDialog
                content={localeStore.instance.TranslateText('search-response.search-rig-not-found-content')}
                header={localeStore.instance.TranslateText('search-response.search-rig-not-found-title')}
                displayPopup={this.state.showRigNotFoundPopUp}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onRigNotFoundOkClick}
                id='rigNotFoundPopup'
                key='rigNotFoundPopup'
                popupDialogType={enums.PopupDialogType.none}
            />
        ) : null;

        let saveEmailMessage = stringHelper.format(
            localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.body'),
            [String(String.fromCharCode(179))]);
        let emailSaveMessage = (
            <GenericDialog content={saveEmailMessage}
                header={localeStore.instance.TranslateText('generic.user-menu.email-address-saved-dialog.header')}
                displayPopup={this.state.isSaveEmailMessageDisplaying}
                okButtonText={localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.ok-button')}
                onOkClick={this.onOkClickOfEmailSucessMessage}
                id='emailSaveMessage'
                key='emailSaveMessage'
                popupDialogType={enums.PopupDialogType.ResponseAllocationError} />
        );
        let shareResponsePopup =
            this.state.isShareResponsePopupDisplayingForPE || this.state.isShareResponsePopupDisplaying ? (
                <MultiOptionConfirmationDialog
                    content={this.state.isShareResponsePopupDisplayingForPE ?
                        this.getShareResponsePopupContentForPE : this.getShareResponsePopupContent()}
                    header={localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.share-response-popup.header')}
                    displayPopup={true}
                    onCancelClick={this.shareResponsePopupClose}
                    onYesClick={this.shareResponse}
                    onNoClick={null}
                    isKeyBoardSupportEnabled={true}
                    selectedLanguage={this.props.selectedLanguage}
                    popupSize={enums.PopupSize.Medium}
                    popupType={enums.PopUpType.ShareResponse}
                    buttonCancelText={localeStore.instance
                        .TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.cancel-button')}
                    buttonYesText={localeStore.instance
                        .TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.share-button')}
                    buttonNoText={null}
                    displayNoButton={false}
                />) : null;

        return (
            <div>
                {selecttoMarkProvisionalDialog}
                {markAsDefinitiveDialog}
                {completeStandardisationPopup}
                {completeStandardisationSetupPopup}
                {autozonedWarningMessage}
                {submitConfirmationDialog}
                {mandatoryMessageValidationPopup}
                {confirmationDialog}
                {busyIndicator}
                {nonRecoverableErrorMessage}
                {gracePeriodResponseUnmarkedDialog}
                {responseRemovedErrorDialog}
                {gracePeriodExpiredErrorDialog}
                {discardMessageDialog}
                {discardExceptionDialog}
                {withdrawErrorDialog}
                {mandatoryMessageDialog}
                {idleTimer}
                {nonRecoverableSaveMarksAndAnnotationsErrorMessage}
                {noMarkingCheckAvailableMessage}
                {markingCheckCompleteConfirmationPopup}
                {supervisorSamplingCommentValidationPopup}
                {warningMessagePopup}
                {this.renderSimulationExitedQigsPopup()}
                {this.renderLocksInQigPopUp()}
                {applicationOffLineErrorMessage}
                {responseSearchFailedErrorDialog}
                {simulationResponseSubmitConfirmationPopup}
                {submitErrorPopup}
                {shareConfirmationPopup}
                {sessionClosedErrorDilaog}
                {reclassifyResponseMultiOptionDialog}
                {reclassifyErrorPopupDialog}
                {concurrentSaveFailPopup}
                {noteTimeStampChangedPopup}
                {responseModifiedPopup}
                {unClassifiedScriptinStmUnavailablePopup}
                {rigNotFoundDialog}
                {emailSaveMessage}
                {shareResponsePopup}
                {reuseRigActionMultiOptionDialog}
                {discardResponseFailPopup}
            </div>
        );
    }

    /**
     * componentDidMount
     */
    public componentDidMount() {
        userOptionStore.instance.addListener(
            userOptionStore.UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT,
            this.updateUserSession
        );
        loginStore.instance.addListener(
            loginStore.LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT,
            this.clearSession
        );
        loginStore.instance.addListener(
            loginStore.LoginStore.CONCURRENT_SESSION_ACTIVE,
            this.onConcurrentSessionActive
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT,
            this.onSaveMarksAndAnnotations
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.navigateAwayFromResponse
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT,
            this.onSaveMarksAndAnnotationsTriggered
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT,
            this.onSetHasNonRecoverableError
        );
        window.addEventListener('online', this._boundOnlineStatusEvent);
        window.addEventListener('offline', this._boundOnlineStatusEvent);
        window.addEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
        window.addEventListener('resize', this.scrollIntoViewOnEditingTextForAndroid);

        submitStore.instance.addListener(
            submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED,
            this.onSubmitResponseCompleted
        );
        submitStore.instance.addListener(
            submitStore.SubmitStore.SHARE_AND_CLASSIFY_RESPONSE_COMPLETED,
            this.reRenderProvionalWorklist
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT,
            this.onMessagePanelEdited
        );

        markingStore.instance.addListener(
            markingStore.MarkingStore.MARKINGMODE_CHANGED_IN_PROVISIONAL_RESPONSE_EVENT,
            this.unClassifiedScriptinStmUnavailable
        );

        markingStore.instance.addListener(
            markingStore.MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE,
            this.showResponseInGraceNotFullyMarkedMessage
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent
        );
        qigStore.instance.addListener(
            qigStore.QigStore.ACCEPT_QUALITY_ACTION_COMPLETED,
            this.onAcceptQualityFeedbackActionCompleted
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.RETRIEVE_MARKS_EVENT,
            this.marksRetrieved
        );
        busyIndicatorStore.instance.addListener(
            busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR,
            this.setBusyIndicator
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED,
            this.showMandatoryMessagePopup
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT,
            this.onUpdateNotification
        );
        applicationStore.instance.addListener(
            applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT,
            this.userActionInterrupted
        );
        submitStore.instance.addListener(
            submitStore.SubmitStore.SUBMIT_RESPONSE_STARTED,
            this.onSubmitResponseStarted
        );
        examinerStore.instance.addListener(
            examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT,
            this.updateMarkerInformationPanel
        );
        examinerStore.instance.addListener(
            examinerStore.ExaminerStore.QIG_SESSION_CLOSED_EVENT,
            this.updateQigForSessionClose
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT,
            this.onResponseDataReceived
        );
        navigationStore.instance.addListener(
            navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT,
            this.refreshState
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT,
            this.mandatoryMessageValidationPopupVisibility
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT,
            this.messagePriorityUpdate
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
            this.addToRecentHistory
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
            this.resetBusyIndicator
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE,
            this.showNoMarkingCheckAvailableMessage
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT,
            this.onTeamManagementOpen
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.isAutozonedMessagePopupVisible
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.isAutozonedMessagePopupVisible
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.isAutozonedMessagePopupVisible
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.ADD_TO_HISTORY_EVENT,
            this.addToRecentHistory
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT,
            this.markCheckCompleteButtonEvent
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.MARKING_CHECK_COMPLETED_EVENT,
            this.markCheckCompletedEvent
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT,
            this.ShowSupervisorSamplingCommentValidationPopup
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED,
            this.addToRecentHistory
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.FAILURE_WHILE_FETCHING_TEAM_DATA_EVENT,
            this.handleErrorNavigationTeamManagement
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.resetBusyIndicator
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.resetBusyIndicator
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.resetBusyIndicator
        );
        qigStore.instance.addListener(
            qigStore.QigStore.SHOW_LOCKS_IN_QIG_POPUP,
            this.onShowLocksInQigsPopup
        );
        qigStore.instance.addListener(
            qigStore.QigStore.QIG_SELECTED_FROM_LOCKED_LIST,
            this.onQigSelectedFromLockedList
        );
        qigStore.instance.addListener(
            qigStore.QigStore.QIG_SELECTED_EVENT,
            this.navigateToQigFromLockedList
        );
        qigStore.instance.addListener(
            qigStore.QigStore.LOCKS_IN_QIG_DATA_RETRIEVED,
            this.doLogoutPopup
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT,
            this.onResponseDataReceivedFailed
        );
        submitStore.instance.addListener(
            submitStore.SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT,
            this.onshowSimulationResponseSubmitConfirmationPopup
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND,
            this.onStandardisationSetupCompletionInBackground
        );
        qigStore.instance.addListener(
            qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED,
            this.onSimulationExitedQigsAndLocksInQigsRecieved
        );
        qigStore.instance.addListener(
            qigStore.QigStore.SIMULATION_TARGET_COMPLETED,
            this.onSimulationTargetCompletion
        );
        qigStore.instance.addListener(
            qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT,
            this.onStandardisationSetupCompletion
        );
        qigStore.instance.addListener(
            qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED,
            this.onSimulationExitedQigsRecieved
        );
        ccStore.instance.addListener(
            ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.onExamBodyCCLoaded
        );
        ecourseworkFileStore.instance.addListener(
            ecourseworkFileStore.ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT,
            this.onEcourseworkFileDataCleared
        );
        qigStore.instance.addListener(
            qigStore.QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED,
            this.resetAcetateSaveInProgressStatus
        );
        qigStore.instance.addListener(
            qigStore.QigStore.SHARE_CONFIRMATION_EVENT,
            this.shareConfirmationPopup
        );
        qigStore.instance.addListener(
            qigStore.QigStore.RESET_SHARED_ACETATES_COMPLETED,
            this.resetAcetateSaveInProgressStatus
        );
        qigStore.instance.addListener(
            qigStore.QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED,
            this.onResetAcetatesSaveInProgressReceived
        );
        targetSummaryStore.instance.addListener(
            targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED,
            this.isAutozonedMessagePopupVisible
        );
        imageZoneStore.instance.addListener(
            imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT,
            this.isAutozonedMessagePopupVisible
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT,
            this.onSelectStdSetupResponseToMark
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .STANDARDISATION_RIG_CREATED_EVENT,
            this.onStandardisationRigCreated
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .COMPLETE_STANDARDISATION_SETUP_EVENT,
            this.onCompleteStandardisationSetup
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .GET_STANDARDISATION_TARGET_DETAILS_EVENT,
            this.resetBusyIndicatorStdSetupNotComplete
        );
        userinfostore.instance.addListener(
            userinfostore.UserInfoStore.SWITCH_USER_BUTTON_CLICK,
            this.switchUserButtonClick
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.onResponseDataRecievedAfterRefresh
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .GET_STANDARDISATION_CENTRE_DETAILS_EVENT,
            this.onResponseDataRecievedAfterRefresh
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
            this.reclassifyMultiOptionPopupOpen);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT,
            this.addToRecentHistory);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
            this.reclassifyPopupOpen);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT,
            this.reclassifyErrorPopupOpen);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore
                .CONCURRENT_SAVE_FAIL_EVENT,
            this.concurrentSaveFailPopup);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.CLASSIFY_RESPONSE_EVENT,
            this.reRenderUnclassifiedWorklist);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.SAVE_NOTE_COMPLETED_ACTION_EVENT,
            this.displayNoteSaveFailedPopup);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT,
            this.reRenderOnClassifiedResponseReceived);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT,
            this.reRenderOnClassifiedResponseReceived);
        responseStore.instance.addListener(
            responseStore.ResponseStore.RIG_NOT_FOUND_EVENT,
            this.showOrHideRigNotFoundPopup);
        userinfostore.instance.addListener(userinfostore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY,
            this.shareResponsePopupOpen);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_POPUP_DISPLAY_ACTION_EVENT,
            this.reuseRigActionPopupOpen);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.RESPONSE_ALREADY_DISCARDED_EVENT,
            this.discardResponseFailPopup);
        markingStore.instance.addListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.submitResponseFromMarkscheme);
    }


    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.submitResponseFromMarkscheme);

        userOptionStore.instance.removeListener(
            userOptionStore.UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT,
            this.updateUserSession
        );
        loginStore.instance.removeListener(
            loginStore.LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT,
            this.clearSession
        );
        loginStore.instance.removeListener(
            loginStore.LoginStore.CONCURRENT_SESSION_ACTIVE,
            this.onConcurrentSessionActive
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT,
            this.onSaveMarksAndAnnotations
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.navigateAwayFromResponse
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT,
            this.onSaveMarksAndAnnotationsTriggered
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT,
            this.onSetHasNonRecoverableError
        );

        markingStore.instance.addListener(
            markingStore.MarkingStore.MARKINGMODE_CHANGED_IN_PROVISIONAL_RESPONSE_EVENT,
            this.unClassifiedScriptinStmUnavailable
        );

        window.removeEventListener('online', this._boundOnlineStatusEvent);
        window.removeEventListener('offline', this._boundOnlineStatusEvent);
        window.removeEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
        window.removeEventListener('resize', this.scrollIntoViewOnEditingTextForAndroid);

        markingStore.instance.removeListener(
            markingStore.MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE,
            this.showResponseInGraceNotFullyMarkedMessage
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.RETRIEVE_MARKS_EVENT,
            this.marksRetrieved
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.ACCEPT_QUALITY_ACTION_COMPLETED,
            this.onAcceptQualityFeedbackActionCompleted
        );
        submitStore.instance.removeListener(
            submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED,
            this.onSubmitResponseCompleted
        );
        submitStore.instance.removeListener(
            submitStore.SubmitStore.SHARE_AND_CLASSIFY_RESPONSE_COMPLETED,
            this.reRenderProvionalWorklist
        );
        busyIndicatorStore.instance.removeListener(
            busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR,
            this.setBusyIndicator
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED,
            this.showMandatoryMessagePopup
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT,
            this.onUpdateNotification
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT,
            this.onMessagePanelEdited
        );
        applicationStore.instance.removeListener(
            applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT,
            this.userActionInterrupted
        );
        submitStore.instance.removeListener(
            submitStore.SubmitStore.SUBMIT_RESPONSE_STARTED,
            this.onSubmitResponseStarted
        );
        examinerStore.instance.removeListener(
            examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT,
            this.updateMarkerInformationPanel
        );
        examinerStore.instance.removeListener(
            examinerStore.ExaminerStore.QIG_SESSION_CLOSED_EVENT,
            this.updateQigForSessionClose
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT,
            this.onResponseDataReceived
        );
        navigationStore.instance.removeListener(
            navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT,
            this.refreshState
        );
        //timerHelper.clearInterval();
        messageStore.instance.removeListener(
            messageStore.MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT,
            this.mandatoryMessageValidationPopupVisibility
        );

        messageStore.instance.removeListener(
            messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT,
            this.messagePriorityUpdate
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
            this.addToRecentHistory
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
            this.resetBusyIndicator
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE,
            this.showNoMarkingCheckAvailableMessage
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT,
            this.onTeamManagementOpen
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.isAutozonedMessagePopupVisible
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.isAutozonedMessagePopupVisible
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.isAutozonedMessagePopupVisible
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.ADD_TO_HISTORY_EVENT,
            this.addToRecentHistory
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT,
            this.markCheckCompleteButtonEvent
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.MARKING_CHECK_COMPLETED_EVENT,
            this.markCheckCompletedEvent
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT,
            this.ShowSupervisorSamplingCommentValidationPopup
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED,
            this.addToRecentHistory
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.FAILURE_WHILE_FETCHING_TEAM_DATA_EVENT,
            this.handleErrorNavigationTeamManagement
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT,
            this.resetBusyIndicator
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT,
            this.resetBusyIndicator
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.resetBusyIndicator
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.SHOW_LOCKS_IN_QIG_POPUP,
            this.onShowLocksInQigsPopup
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.QIG_SELECTED_FROM_LOCKED_LIST,
            this.onQigSelectedFromLockedList
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.QIG_SELECTED_EVENT,
            this.navigateToQigFromLockedList
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.LOCKS_IN_QIG_DATA_RETRIEVED,
            this.doLogoutPopup
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT,
            this.onResponseDataReceivedFailed
        );
        submitStore.instance.removeListener(
            submitStore.SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT,
            this.onshowSimulationResponseSubmitConfirmationPopup
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND,
            this.onStandardisationSetupCompletionInBackground
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED,
            this.onSimulationExitedQigsAndLocksInQigsRecieved
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.SIMULATION_TARGET_COMPLETED,
            this.onSimulationTargetCompletion
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT,
            this.onStandardisationSetupCompletion
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED,
            this.onSimulationExitedQigsRecieved
        );
        ccStore.instance.removeListener(
            ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.onExamBodyCCLoaded
        );
        ecourseworkFileStore.instance.removeListener(
            ecourseworkFileStore.ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT,
            this.onEcourseworkFileDataCleared
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED,
            this.resetAcetateSaveInProgressStatus
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.SHARE_CONFIRMATION_EVENT,
            this.shareConfirmationPopup
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.RESET_SHARED_ACETATES_COMPLETED,
            this.resetAcetateSaveInProgressStatus
        );
        qigStore.instance.removeListener(
            qigStore.QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED,
            this.onResetAcetatesSaveInProgressReceived
        );
        targetSummaryStore.instance.removeListener(
            targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED,
            this.isAutozonedMessagePopupVisible
        );
        imageZoneStore.instance.removeListener(
            imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT,
            this.isAutozonedMessagePopupVisible
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT,
            this.onSelectStdSetupResponseToMark
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .STANDARDISATION_RIG_CREATED_EVENT,
            this.onStandardisationRigCreated
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .COMPLETE_STANDARDISATION_SETUP_EVENT,
            this.onCompleteStandardisationSetup
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .GET_STANDARDISATION_TARGET_DETAILS_EVENT,
            this.resetBusyIndicatorStdSetupNotComplete
        );
        userinfostore.instance.removeListener(
            userinfostore.UserInfoStore.SWITCH_USER_BUTTON_CLICK,
            this.switchUserButtonClick
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.onResponseDataRecievedAfterRefresh
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .GET_STANDARDISATION_CENTRE_DETAILS_EVENT,
            this.onResponseDataRecievedAfterRefresh
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
            this.reclassifyMultiOptionPopupOpen);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT,
            this.addToRecentHistory);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
            this.reclassifyPopupOpen);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT,
            this.reclassifyErrorPopupOpen);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore
                .CONCURRENT_SAVE_FAIL_EVENT,
            this.concurrentSaveFailPopup);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.CLASSIFY_RESPONSE_EVENT,
            this.reRenderUnclassifiedWorklist);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.SAVE_NOTE_COMPLETED_ACTION_EVENT,
            this.displayNoteSaveFailedPopup);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT,
            this.reRenderOnClassifiedResponseReceived);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT,
            this.reRenderOnClassifiedResponseReceived);
        responseStore.instance.removeListener(
            responseStore.ResponseStore.RIG_NOT_FOUND_EVENT,
            this.showOrHideRigNotFoundPopup);
        userinfostore.instance.removeListener(userinfostore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY,
            this.shareResponsePopupOpen);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_POPUP_DISPLAY_ACTION_EVENT,
            this.reuseRigActionPopupOpen);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.RESPONSE_ALREADY_DISCARDED_EVENT,
            this.discardResponseFailPopup);
	}

	/**
	 * Fires after email save
	 */
    private userInfoSaved = (): void => {
        this.setState({
            isSaveEmailMessageDisplaying: true
        });
    };

	/**
	 * Email save success message ok click
	 */
    private onOkClickOfEmailSucessMessage = () => {
        this.setState({
            isSaveEmailMessageDisplaying: false
        });
    }

    /**
     * Method to be invoked when a ExamBody CC is loaded.
     */
    private onExamBodyCCLoaded = (): void => {
        // show locks and simulation exited popup if it is not already shown and exambodycc is loaded
        this.setState({
            reRenderLocksInQigPopUp:
                this.state.reRenderLocksInQigPopUp && ccStore.instance.isExamBodyCCLoaded,
            renderedOn: Date.now(),
            showSimulationExitedPopup: this.state.showSimulationExitedPopup && ccStore.instance.isExamBodyCCLoaded
        });
    };

    /**
     * Updates the Marker information panel.
     */
    private updateMarkerInformationPanel = (): void => {
        // Check the Marker got with drawn from the QIG, If So show the message
        if (
            examinerStore.instance.getMarkerInformation.approvalStatus ===
            enums.ExaminerApproval.Withdrawn
        ) {
            if (qigStore.instance.getOverviewData) {
                let currentQig = qigStore.instance.getOverviewData.qigSummary
                    .filter(
                    (qig: qigInfo) =>
                        qig.examinerRoleId ===
                        examinerStore.instance.getMarkerInformation.examinerRoleId
                    )
                    .first();

                // removing entry from recent history
                teamManagementActionCreator.removeHistoryItem(
                    currentQig ? currentQig.markSchemeGroupId : 0
                );
            }
            this.setState({ isWithdrawnResponseError: true, isBusy: false });
        }
    };

    /**
     * Updates qig selector if the examiner session is closed for the qig.
     */
    private updateQigForSessionClose = (): void => {
        // Check the Marker got with drawn from the QIG, If So show the message
        this.setState({ isQigsessionClosedError: true, isBusy: false });
    };

    /**
     * On response submission started
     */
    private onSubmitResponseStarted = (): void => {
        /**
         * for submit all the markgroup id will always be zero
         */
        if (submitStore.instance.getMarkGroupId > 0) {
            this.submitConfirmationDialogueContent = localeStore.instance.TranslateText(
                'marking.worklist.submit-response-dialog.body'
            );
            this.submitConfirmationDialogueHeader = localeStore.instance.TranslateText(
                'marking.worklist.submit-response-dialog.header'
            );
        } else {
            this.submitConfirmationDialogueContent = localeStore.instance.TranslateText(
                'marking.worklist.submit-all-responses-dialog.body'
            );
            this.submitConfirmationDialogueHeader = localeStore.instance.TranslateText(
                'marking.worklist.submit-all-responses-dialog.header'
            );
        }

        this.setConfirmationDialogueState(true);
    };

    /**
     * Set the confirmation dialogue state
     * @param stateValue The state value
     */
    private setConfirmationDialogueState(stateValue: boolean) {
        this.setState({
            isSubmitConfirmationPopupDisplaying: stateValue
        });
    }

    /**
     * On yes click of submit response confirmation pop up
     */
    private onYesClickOfSubmitButton() {
        this.setConfirmationDialogueState(false);
        this.submitResponse();
    }

    /**
     * submit response/s
     */
    private submitResponse() {
        let busyIndicatorInvoker: enums.BusyIndicatorInvoker;
        let submitResponseArgument: SubmitResponseArgument;
        /**
         * if markgroupid is greater than zero, then its single response submit
         */
        busyIndicatorInvoker =
            submitStore.instance.getMarkGroupId > 0
                ? enums.BusyIndicatorInvoker.submit
                : enums.BusyIndicatorInvoker.submitAll;
        /**
         * Show busy indicator on submitting response
         */
        busyIndicatorActionCreator.setBusyIndicatorInvoker(busyIndicatorInvoker);
        /**
         * Submitting  responses initiated
         * Select the mark group list based on the current response mode
         */
        let markGroupIdList: Array<
            Number
            > = worklistComponentHelper.getMarkgroupIdCollectionForSubmit(
                targetHelper.getSelectedQigMarkingMode()
            );
        let qiglist: Immutable.Iterable<number, qigSummary> = qigStore.instance.relatedQigList;
        let examinerRoleIdList: Array<number> = new Array<number>();
        qiglist
            ? qiglist.map((x: qigSummary) => {
                examinerRoleIdList.push(x.examinerRoleId);
            })
            : (examinerRoleIdList = null);
        let markSchemeGroupIds: Array<number> = new Array<number>();
        qiglist
            ? qiglist.map((x: qigSummary) => {
                markSchemeGroupIds.push(x.markSchemeGroupId);
            })
            : (markSchemeGroupIds = null);
        /**
         * mapping  values on submit argument
         */
        submitResponseArgument = {
            markGroupIds: markGroupIdList,
            markingMode: targetHelper.getSelectedQigMarkingMode(),
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerApproval: examinerStore.instance.getMarkerInformation.approvalStatus,
            isAdminRemarker: loginStore.instance.isAdminRemarker
        };

        let worklistType = worklistStore.instance.currentWorklistType;
        let remarkRequestType: enums.RemarkRequestType = worklistComponentHelper.getRemarkRequestType(
            worklistType
        );

        /**
         * calling to send data to server
         */
        let displayId = submitStore.instance.isSubmitFromMarkScheme
            ? responseStore.instance.selectedDisplayId.toString()
            : undefined;
        submitActionCreator.submitResponse(
            submitResponseArgument,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            worklistType,
            remarkRequestType,
            submitStore.instance.isSubmitFromMarkScheme,
            displayId,
            examinerRoleIdList,
            markSchemeGroupIds
        );
    }

    /**
     * On no click of submit response confirmation pop up
     */
    private onNoClickOfSubmitButton() {
        this.setConfirmationDialogueState(false);
    }

    /**
     * Show busy indicator when submit is clicked in live open worklist
     */
    private setBusyIndicator = (): void => {
        this.setState({
            isBusy:
                busyIndicatorStore.instance.getBusyIndicatorInvoker ===
                    enums.BusyIndicatorInvoker.none
                    ? false
                    : true
        });
    };

    /**
     * hiding busy indicator
     */
    private resetBusyIndicator = (): void => {
        this.setState({
            isBusy:
                busyIndicatorStore.instance.getBusyIndicatorInvoker !==
                    enums.BusyIndicatorInvoker.none
                    ? false
                    : true
        });
    };

    /**
     * hiding busy indicator on ok click of validation of std setup
     */
    private resetBusyIndicatorStdSetupNotComplete = (): void => {
        if (standardisationSetupStore.instance.iscompleteStandardisationSuccess === false) {
            this.setState({
                isBusy:
                    busyIndicatorStore.instance.getBusyIndicatorInvoker ===
                    enums.BusyIndicatorInvoker.none
            });
        }
    };

    /**
     * Marks retrieval event.
     */
    private marksRetrieved = (markGroupId: number): void => {
        if (
            (markingStore.instance.currentResponseMode === enums.ResponseMode.open ||
                markingStore.instance.currentResponseMode === enums.ResponseMode.pending) &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode
        ) {
            let isColourUpdated = colouredAnnotationsHelper.updateAnnotationColourIfNeeded(
                markGroupId
            );
            if (isColourUpdated) {
                // Updating the queue to let know the background process to save the dirty marks and annotations
                marksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue();
            }
        }
    };

    /**
     * this function is called on "yes" click of logout confirmation popup. This will trigger logout.
     */
    public onYesClickOfLogoutConfirmation(isAutoLogOut: boolean = false) {
        /**
         * Setting to true as the logout has been triggered
         */
        this._onLogoutTriggered = true;

        /**
         * Setting the value to identify whether it is from idle timeout
         */
        this._isAutoLogOut = isAutoLogOut;

        switch (navigationStore.instance.containerPage) {
            case enums.PageContainers.QigSelector:
            case enums.PageContainers.Message:
            case enums.PageContainers.Reports:
                let _rememberQig: rememberQig = new rememberQig();
                _rememberQig.qigId = 0;
                _rememberQig.area = enums.QigArea.QigSelector;
                userOptionsHelper.save(
                    userOptionKeys.REMEMBER_PREVIOUS_QIG,
                    JSON.stringify(_rememberQig)
                );
                break;
        }

        /**
         * Saving changed user options if any of them changed
         */
        if (userOptionsHelper.hasUserOptionsChanged) {
            userOptionsHelper.InitiateSaveUserOption(true);
        } else {
            this.updateUserSession();
        }
    }

    /**
     * to update message priority
     */
    private onOkClickMandatoryMessageValidationPopup() {
        messagingActionCreator.updateMessagePriority();
    }

    /**
     * Return true if the selected standardisation tab is unclassified
     */
    private isUnclassifiedWorklistSelected() {
        return standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse;
    }

    /**
     * hides the popup
     */
    private onPopupOkClick() {
        this.setState({ doShowPopup: false });

        // If the object has the mark group Id, Call navigate method for completing actions.
        if (
            this.messageDetails.submittedMarkGroupIds &&
            this.messageDetails.submittedMarkGroupIds.length > 0
        ) {
            this.navigateAfterSubmit(
                this.messageDetails.submittedMarkGroupIds,
                this.messageDetails.displayId,
                this.messageDetails.isFromMarkScheme
            );
            this.messageDetails.submittedMarkGroupIds = [];
        }
    }

    /**
     * shows the popup
     */
    private ShowSupervisorSamplingCommentValidationPopup(
        supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn
    ) {
        if (supervisorSamplingCommentReturn.isSampled) {
            this.messageDetails = {
                messageHeader: localeStore.instance.TranslateText(
                    'team-management.response.sampling-error-dialog-already-sampled.body'
                ),
                messageString: localeStore.instance.TranslateText(
                    'team-management.response.sampling-error-dialog-already-sampled.header'
                )
            };
            this.setState({ doShowPopup: true });
        }
    }

    /**
     * Handles the action event while message priority updation.
     */
    private messagePriorityUpdate = () => {
        this.setState({ doShowMandatoryMessageValidationPopup: false });
    };

    /**
     * this function is called on 'No' click of logout confirmation popup.This will call a method in the container.
     */
    private onNoClickOfLogoutConfirmation() {
        this.props.resetLogoutConfirmationSatus();
    }

    /**
     * Updates user session data by changing the logged_out status to 1.
     * logged_out status 1 means user logged out properly by clicking on the
     * log out button.
     */
    private updateUserSession = (): void => {
        /**
         * Trigger save mark for the currently selected item when logging out
         */
        if (markingStore.instance.isMarkingInProgress) {
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toLogout);
        } else {
            /**
             * navigating from a response which is in view mode doesn't require to call save marks
             */
            let logoutData = new logoutArgument();
            logoutData.MarkingSessionTrackingId = parseInt(
                loginSession.MARKING_SESSION_TRACKING_ID
            );
            logoutActionCreator.updateUserSession(logoutData);
        }
    };

    /**
     * setting login invalid state.
     */
    private onConcurrentSessionActive = (): void => {
        this.isConcurrentSessionActive = true;
        this.clearSession();
    };

    /**
     * Clears the session after user option saved and logged_out status updated.
     */
    private clearSession = (): void => {
        window.removeEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);

        /* tslint:disable:no-string-literal */
        if (this.isConcurrentSessionActive) {
            window.sessionStorage['invaliduser'] = 'true';
        } else if (this._isAutoLogOut) {
            window.sessionStorage['autologout'] = 'true';
        }
        /* tslint:enable:no-string-literal */

        userOptionsHelper.resetTokensAndRedirect();
        navigationHelper.loadLoginPage();
    };

    /**
     *  clear marks and annotations queue entry and update isDirty fields
     */
    private onSaveMarksAndAnnotations = (
        markGroupId: number,
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        queueOperation: enums.MarksAndAnnotationsQueueOperation,
        isnetworkerror: boolean
    ): void => {
        let saveErrorCode: enums.SaveMarksAndAnnotationErrorCode = markingStore.instance.getSaveMarksAndAnnotationErrorCode(
            markGroupId
        );
        // selectedQIGForMarkerOperation become undefined when the marker is withdrawn from the selected qig.
        // so added undefined check as part of bug 57226.
        if (
            qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget.markingMode ===
            enums.MarkingMode.Simulation &&
            qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete
        ) {
            this.triggerPointAfterClose = saveMarksAndAnnotationTriggeringPoint;

            if (
                this.triggerPointAfterClose ===
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit
            ) {
                this.triggerPointAfterClose =
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse;
            }

            saveMarksAndAnnotationTriggeringPoint =
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker;
            saveErrorCode = enums.SaveMarksAndAnnotationErrorCode.None;
            marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(
                markGroupId,
                enums.MarksAndAnnotationsQueueOperation.Remove
            );

            this.setState({
                showSimulationExitedPopup: true
            });
        }

        if (
            saveMarksAndAnnotationTriggeringPoint !==
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None
        ) {
            // reset the saveinprogress flag when savingmarks has been completed
            marksAndAnnotationsSaveHelper.resetSaveInProgress();
            /**
             * set the current marks and annotations save triggering point.
             */
            this.currentSaveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;

            if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.ResponseRemoved) {
                worklistActionCreator.getWorklistMarkerProgressData(
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation
                        .isElectronicStandardisationTeamMember
                );
                this.expiredMarkGroupId = markGroupId;
                marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(
                    markGroupId,
                    queueOperation
                );
                this.setState({
                    isDisplayingResponseRemovedError:
                        markingStore.instance.currentResponseMode === enums.ResponseMode.pending,
                    doShowSavingMarksAndAnnotationsIndicator: false
                });
            } else if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.ClosedResponse) {
                worklistActionCreator.getWorklistMarkerProgressData(
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation
                        .isElectronicStandardisationTeamMember
                );
                this.expiredMarkGroupId = markGroupId;
                marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(
                    markGroupId,
                    queueOperation
                );
                this.setState({
                    isDisplayingGraceResponseExpiredError:
                        markingStore.instance.currentResponseMode === enums.ResponseMode.pending,
                    doShowSavingMarksAndAnnotationsIndicator: false
                });
            } else if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse) {
                /**
                 * Calling the helper method to update the marks and annotations queue
                 */
                marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(
                    markGroupId,
                    queueOperation
                );
                this.onWithdrawnResponse(
                    enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse,
                    markingStore.instance.navigateTo
                );
            } else if (
                saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.UnallocatedResponse ||
                saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.MarksAndAnnotationsOutOfDate
            ) {
                /**
                 * Calling the helper method to update the marks and annotations queue
                 */
                marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(
                    markGroupId,
                    queueOperation
                );

                if (
                    saveMarksAndAnnotationTriggeringPoint ===
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit
                ) {
                    /**
                     * When there are errors in saving marks and annotations we have to hide the busy indicator
                     */
                    busyIndicatorActionCreator.setBusyIndicatorInvoker(
                        enums.BusyIndicatorInvoker.none
                    );
                    this.setState({
                        doShowSavingMarksAndAnnotationsIndicator: false,
                        nonRecoverableSaveMarksAndAnnotationsErrorMessage: true
                    });
                } else {

                    if (saveMarksAndAnnotationTriggeringPoint ===
                        enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse) {
                        this.saveMarksAndAnnotationsWithNonRecoverableError(
                            saveMarksAndAnnotationTriggeringPoint, markGroupId, queueOperation);
                    } else {
                        // hide the saving marks and annotations busy indicator
                        if (this.state.doShowSavingMarksAndAnnotationsIndicator) {
                            this.setState({
                                doShowSavingMarksAndAnnotationsIndicator: false
                            });
                        }
                        navigationHelper.loadContainerIfNeeded(
                            enums.PageContainers.WorkList,
                            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse
                        );
                        this.initiateContentRefresh();
                    }
                }
            } else {
                this.saveMarksAndAnnotationsWithNonRecoverableError(
                    saveMarksAndAnnotationTriggeringPoint, markGroupId, queueOperation);
            }
        }

        this.setState({
            isOnline: !isnetworkerror
        });
    };

    /**
     * show the error message when a marker is withdrawn from background
     */
    private onWithdrawnResponse = (
        saveMarksAndAnnotationErrorCode: enums.SaveMarksAndAnnotationErrorCode,
        navigatingTo: enums.SaveAndNavigate
    ): void => {
        this.examinerApprovalStatus = saveMarksAndAnnotationErrorCode;
        this.navigateReponse = navigatingTo;
        let currentQig = qigStore.instance.getOverviewData.qigSummary
            .filter(
            (qig: qigInfo) =>
                qig.examinerRoleId ===
                examinerStore.instance.getMarkerInformation.examinerRoleId
            )
            .first();

        // removes entry from recent history
        teamManagementActionCreator.removeHistoryItem(
            currentQig ? currentQig.markSchemeGroupId : 0
        );

        this.setState({
            doShowSavingMarksAndAnnotationsIndicator: false,
            isWithdrawnResponseError: true,
            isBusy: false
        });
    };

    /**
     *  This will remove the item from marksAndAnnotations save processing queue.
     */
    private onSetHasNonRecoverableError = (markGroupId: number): void => {
        // Calling the helper method to update the marks and annotations queue
        let queueOperation: enums.MarksAndAnnotationsQueueOperation =
            enums.MarksAndAnnotationsQueueOperation.Remove;
        marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
    };

    /**
     * Method to show the busy indicator on triggering saving of marks and annotations
     */
    private onSaveMarksAndAnnotationsTriggered = (
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint
    ): void => {
        if (
            saveMarksAndAnnotationTriggeringPoint !==
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None &&
            saveMarksAndAnnotationTriggeringPoint !==
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker
        ) {
            this.setState({
                doShowSavingMarksAndAnnotationsIndicator: true
            });
        }
    };

    /**
     * Go to logout after saving mark if there is any
     */
    private navigateAwayFromResponse = (): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toLogout) {
            let logoutData = new logoutArgument();
            logoutData.MarkingSessionTrackingId = parseInt(
                loginSession.MARKING_SESSION_TRACKING_ID
            );
            logoutActionCreator.updateUserSession(logoutData);
        } else {
            // reset mark entry deactivators on navigating away from response.
            keyDownHelper.instance.resetMarkEntryDeactivators();
            // we are deactivating the keydown helper while message panel or exception panel is open. We are disabling that
            // during the corresponding panel is close. If user is navigate away from response screen without closing the message panel
            // then we've to activate the keydown helper
            if (messageStore.instance.isMessagePanelVisible) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
            } else if (exceptionStore.instance.isExceptionPanelVisible) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            } else if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toMenu) {
                markingActionCreator.removeMarkEntrySelection();
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Menu);
            }
            this.copyMarksAsDefinitiveSelected = true;
        }
    };

    /**
     * Method to show the busy indicator on triggering saving of marks and annotations
     */
    private refreshState = (): void => {
        switch (navigationStore.instance.containerPage) {
            case enums.PageContainers.Login:
                this.clearSession();
                break;
        }
    };

    /*
     * On Accept Quality Feedback Action completedF
     */
    private onAcceptQualityFeedbackActionCompleted = (): void => {
        let responseModeBasedOnQualityFeedback: enums.ResponseMode = qualityFeedbackHelper.getResponseModeBasedOnQualityFeedback();
        if (responseModeBasedOnQualityFeedback !== enums.ResponseMode.closed) {
            let responseMode =
                responseModeBasedOnQualityFeedback !== undefined
                    ? responseModeBasedOnQualityFeedback
                    : enums.ResponseMode.open;
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                worklistActionCreator.notifyWorklistTypeChange(
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                    worklistStore.instance.currentWorklistType,
                    responseMode,
                    worklistStore.instance.getRemarkRequestType,
                    worklistStore.instance.isDirectedRemark,
                    qigStore.instance.selectedQIGForMarkerOperation
                        .isElectronicStandardisationTeamMember
                );
            }
        }
    };

    /**
     * Non-Recoverable marks and annotation save error message ok click
     */
    private onOkClickOfNonRecoverableErrorMessage() {
        // close the non-recoverable error popup on submit if it is already open.
        if (this.state.nonRecoverableSaveMarksAndAnnotationsErrorMessage) {
            this.setState({
                nonRecoverableSaveMarksAndAnnotationsErrorMessage: false
            });
        }

        // close the non-recoverable error popup.
        if (this.state.isNonRecoverableErrorPopupVisible) {
            this.setState({
                isNonRecoverableErrorPopupVisible: false
            });
        }

        // This will clear the marks and annotations with non-recoverable error from store collection.
        // This will reload by background call or while opening the response.
        marksAndAnnotationsSaveHelper.clearMarksAndAnnotationsForNonRecoverableErrors();

        // Calling the processBasedOnSaveMarksAndAnnotationTriggeringPoint on Submit will make the DB call.
        // refresh and navigate to worklist if there is an error.
        if (
            this.currentSaveMarksAndAnnotationTriggeringPoint ===
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit
        ) {
            navigationHelper.loadContainerIfNeeded(
                enums.PageContainers.WorkList,
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse
            );
            this.initiateContentRefresh();
        } else {
            this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(
                this.currentSaveMarksAndAnnotationTriggeringPoint
            );
        }
    }

    /**
     * This method will handle the navigation based on the triggering point.
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param markGroupId
     */
    private processBasedOnSaveMarksAndAnnotationTriggeringPoint(
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        markGroupId?: number
    ) {
        switch (saveMarksAndAnnotationTriggeringPoint) {
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse:
                navigationHelper.loadContainerIfNeeded(
                    navigationStore.instance.containerPage,
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse,
                    this.context
                );
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox:
                navigationHelper.loadContainerIfNeeded(
                    navigationStore.instance.containerPage,
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox,
                    this.context
                );
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Logout:
                /* Trigger save mark for the currently selected item when logging out */
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toLogout);
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit:
                submitHelper.saveAndSubmitResponse(
                    markGroupId ? markGroupId : submitStore.instance.getMarkGroupId
                );
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Classify:
                // Update MarkGroupRowVersion after save
                this._classifyResponseDetails.esMarkGroupRowVersion = markingStore.instance.getUpdatedRowVersionOnSaveAndClassify;

                // Trigger classify response action with updated MarkGroupRowVersion
                standardisationActionCreator.classifyResponse(this._classifyResponseDetails,
                    navigationStore.instance.containerPage);
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.ShareAndClassify:
                submitActionCreator.shareAndClassifyResponse
                    (this._shareResponseArgument,
                    this._isSharedFromMarkScheme,
                    this._shareResponseDetails.displayId);
                break;
        }
    }

    /**
     * Method to get Grace Period Expired Message Body
     * @returns
     */
    private getGracePeriodExpiredMessageBody() {
        let errorBody: string = localeStore.instance.TranslateText(
            'marking.response.saving-marks-error-dialog.body-grace-period-expired-changes-not-saved'
        );
        return errorBody.replace(
            '{0}',
            worklistStore.instance.displayIdOfMarkGroup(this.expiredMarkGroupId)
        );
    }

    /**
     * Method to get Response removed error dialog Message Body
     * @returns
     */
    private getResponseRemovedErrorDialogMessageBody() {
        let errorBody: string = localeStore.instance.TranslateText(
            'marking.response.saving-marks-error-dialog.body-response-removed-from-worklist'
        );
        return errorBody.replace(
            '{0}',
            worklistStore.instance.displayIdOfMarkGroup(this.expiredMarkGroupId)
        );
    }

    /**
     * Show response in grace not fully marked message.
     */
    private showResponseInGraceNotFullyMarkedMessage = (
        failureReason: enums.ResponseNavigateFailureReason
    ): void => {
        this._failureReason = failureReason;
        this.setState({ isDisplayingGraceResponseLessthan100PercentageError: true });
    };

    /**
     * Just hide the response in grace message on ok click.
     */
    private onOkClickOfResponseInGraceMessage() {
        this.setState({
            isDisplayingGraceResponseLessthan100PercentageError: false
        });
        if (
            this._failureReason === enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace
        ) {
            // Closing the user information panel, if the popup is triggered due to logout button action.
            // moving to full response view.
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            this._failureReason = enums.ResponseNavigateFailureReason.None;
        }
    }

    /**
     * Just hide the response in grace message on ok click.
     */
    private onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage() {
        if (
            this.currentSaveMarksAndAnnotationTriggeringPoint ===
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Logout
        ) {
            this.updateUserSession();
        } else {
            // This will clear the marks and annotations with mark save errors
            // This will reload by background call or while opening the response.
            marksAndAnnotationsSaveHelper.clearMarksAndAnnotationsForMarkSaveErrors();
            navigationHelper.loadWorklist();
        }
    }

    /**
     * Get the error message that has to be shown while a marker is withdrawn in the background
     */
    private getWithdrawnResponseErrorMessage() {
        let errorBody: string = localeStore.instance.TranslateText(
            'marking.worklist.response-allocation-error-dialog.response-allocation-error-withdrawnMarker'
        );
        return errorBody;
    }

    /**
     * Get the error message that has to be shown while a marker is withdrawn in the background
     */
    private getSessionClosedErrorMessage() {
        let errorBody: string = localeStore.instance.TranslateText(
            'marking.worklist.request-marking-check-error-dialog.body-session-closed'
        );
        return errorBody;
    }

    /**
     * On cliking Ok button of the response trigger close response
     */
    private onOkClickOfWithDrawErrorMessage() {
        if (this.props.footerType === enums.FooterType.Response) {
            if (this.navigateReponse === enums.SaveAndNavigate.toInboxMessagePage) {
                this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox
                );
                navigationHelper.loadMessagePage();
            } else {
                let updateNavigationPromise = markingActionCreator.updateNavigation(
                    enums.SaveAndNavigate.toQigSelector,
                    false
                );
                let that = this;
                Promise.Promise.all([updateNavigationPromise]).then(function (result: any) {
                    that.processBasedOnSaveMarksAndAnnotationTriggeringPoint(
                        enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse
                    );
                    if (that.navigateReponse === enums.SaveAndNavigate.toLogout) {
                        that.navigateAwayFromResponse();
                    }
                });
            }
        } else {
            this.setState({ isWithdrawnResponseError: false, isBusy: false });
            this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');

            if (qigStore.instance.getOverviewData) {
                let currentQig = qigStore.instance.getOverviewData.qigSummary
                    .filter(
                    (qig: qigInfo) =>
                        qig.examinerRoleId ===
                        examinerStore.instance.getMarkerInformation.examinerRoleId
                    )
                    .first();

                teamManagementActionCreator.removeHistoryItem(
                    currentQig ? currentQig.markSchemeGroupId : 0
                );
            }
            qigActionCreator.getQIGSelectorData(0);
            loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
        }
    }

    /**
     * Show mandatory message popup
     */
    private showMandatoryMessagePopup = (
        isUnreadMandatoryMessagePresent: boolean,
        triggerPoint: enums.TriggerPoint
    ): void => {
        if (isUnreadMandatoryMessagePresent) {
            this.mandatoryMessageTriggeringPoint = triggerPoint;
            this.onPopUpDisplayEvent(
                enums.PopUpType.MandatoryMessage,
                enums.PopUpActionType.Show,
                null
            );
        }
    };

    /**
     * Display the corresponding popups
     */
    private onPopUpDisplayEvent = (
        popUpType: enums.PopUpType,
        popUpActionType: enums.PopUpActionType,
        popUpData: PopUpData
    ): void => {
        this.popUpData = popUpData;
        if (popUpActionType === enums.PopUpActionType.Show) {
            this.setState({ popUpType: popUpType });
        }
    };

    /**
     * handle different popup actions
     */
    private handlePopUpAction = (
        popUpType: enums.PopUpType,
        popUpActionType: enums.PopUpActionType
    ): void => {
        switch (popUpActionType) {
            case enums.PopUpActionType.Show:
                break;
            case enums.PopUpActionType.Yes:
                // when navigated from message panel the navigate action is called
                if (this.messageNavigationArguments) {
                    this.messageNavigationArguments.canNavigate = true;
                    messagingActionCreator.canMessageNavigate(this.messageNavigationArguments);
                    this.messageNavigationArguments = undefined;
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    this.setState({ popUpType: undefined });
                } else {
                    popUpDisplayActionCreator.popUpDisplay(
                        popUpType,
                        popUpActionType,
                        messageStore.instance.navigateFrom,
                        {}
                    );
                    this.setState({ popUpType: undefined });
                }
                break;
            case enums.PopUpActionType.No:
                this.messageNavigationArguments = undefined;
                popUpDisplayActionCreator.popUpDisplay(
                    popUpType,
                    popUpActionType,
                    messageStore.instance.navigateFrom,
                    {}
                );
                this.setState({ popUpType: undefined });
                break;
            case enums.PopUpActionType.Ok:
                if (
                    popUpType === enums.PopUpType.MandatoryMessage &&
                    this.props.footerType !== enums.FooterType.Message
                ) {
                    //Response displayed in Atypical worklist even after changing the response to 'On hold' in AI Image Management
                    //so do refresh worklist content when mandatory message popup appears
                    //This will affect all response types except live.
                    this.storageAdapterHelper.clearStorageArea('worklist');
                    // redirecting to inbox screen, if user currently not in the message screen
                    navigationHelper.loadMessagePage();
                } else if (
                    popUpType === enums.PopUpType.MandatoryMessage &&
                    this.props.footerType === enums.FooterType.Message &&
                    this.mandatoryMessageTriggeringPoint !== enums.TriggerPoint.MessageStore
                ) {
                    // we don't need to refresh inbox tab if we found mandatory messages are available during message loading action
                    // refresh the inbox tab with selected mandatory message
                    messagingActionCreator.refreshMessageFolder(enums.MessageFolderType.Inbox);
                }
                this.mandatoryMessageTriggeringPoint = enums.TriggerPoint.None;
                this.setState({ popUpType: undefined });
                break;
        }
    };

    /**
     * On response submission completed
     */
    private onSubmitResponseCompleted = (
        fromMarkScheme: boolean,
        submittedMarkGroupIds: Array<number>,
        selectedDisplayId: string
    ): void => {
        if (!this._showShareLoadingIndicatorForPE) {
            this.submitMessageErrorPopupContent = worklistComponentHelper.showMessageOnSubmitResponse(
                submitStore.instance.getSubmittedResponsesCount()
            );
        }
        //updating provisional response collection and navigating after sharing Provisional Response
        if (this._showShareLoadingIndicator && fromMarkScheme) {
            let stdWorklistView: enums.STDWorklistViewType =
                standardisationSetupStore.instance.isTotalMarksViewSelected ? enums.STDWorklistViewType.ViewTotalMarks :
                    enums.STDWorklistViewType.ViewMarksByQuestion;
            let isNextResponseAvailable = standardisationSetupStore.instance.isNextResponseAvailable(selectedDisplayId);
            let nextResponseId =
                markerOperationModeFactory.operationMode.nextResponseId(responseStore.instance.selectedDisplayId.toString());
            if (isNextResponseAvailable) {
                let responseData = standardisationSetupStore.instance.getResponseDetails
                    (responseStore.instance.selectedDisplayId.toString());

                // remove shared response from provisional response worklist collection.
                standardisationActionCreator.updateStandardisationResponseCollection(
                    responseData.esMarkGroupId,
                    enums.StandardisationSetup.ProvisionalResponse
                );
                this.setState({
                    isBusy: false
                });
                navigationHelper.responseNavigation(enums.ResponseNavigation.next, false, parseInt(nextResponseId));
            } else {
                // if next response is not available then load worklist.
                navigationHelper.loadStandardisationSetup();
            }
            return;
        }

        /* Logging event in google analytics or application insights based on the configuration */
        new auditLoggingHelper().logHelper.logEventOnSubmitResponse(
            submitStore.instance.getSubmittedResponsesCount(),
            submittedMarkGroupIds
        );

        let messageKey: string = '';
        let messageHeaderKey: string = undefined;

        // If No validation Error, Check the whether to display the Quality Feedback Message
        if (worklistComponentHelper.shouldShowQualityFeedbackMessage()) {
            messageKey = localeStore.instance.TranslateText(
                'marking.worklist.quality-feedback-dialog.body'
            );
            messageHeaderKey = localeStore.instance.TranslateText(
                'marking.worklist.quality-feedback-dialog.header'
            );
        } else if (
            submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation ||
            submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation
        ) {
            if (
                submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus ===
                enums.ExaminerApproval.Approved
            ) {
                messageKey = localeStore.instance.TranslateText(
                    worklistComponentHelper.getAutoApprovalSecondaryContent(
                        submittedMarkGroupIds.length
                    )
                );
                messageHeaderKey = localeStore.instance.TranslateText(
                    'marking.worklist.auto-approved-dialog.header'
                );
            }
        }

        if (messageKey !== '') {
            this.messageDetails = {
                messageHeader: messageHeaderKey,
                messageString: messageKey,
                submittedMarkGroupIds: submittedMarkGroupIds,
                displayId: selectedDisplayId,
                isFromMarkScheme: fromMarkScheme
            };
            this.setState({
                doShowSavingMarksAndAnnotationsIndicator: false,
                isBusy: false,
                doShowPopup: true
            });
        } else if (this.submitMessageErrorPopupContent !== undefined) {
            this.setState({
                isSubmitErrorPopDisplaying: true,
                isBusy: false,
                doShowSavingMarksAndAnnotationsIndicator: false
            });
        } else {
            this.navigateAfterSubmit(submittedMarkGroupIds, selectedDisplayId, fromMarkScheme);
        }
    };

    /**
     * Navigate after the submit
     */
    private navigateAfterSubmit = (
        submittedMarkGroupIds: Array<number>,
        displayId: string,
        fromMarkScheme: boolean
    ) => {
        // Inform response navigation module.
        responseActionCreator.navigateAfterSubmit(submittedMarkGroupIds, displayId, fromMarkScheme);

        // Navigate to corresponding worklist even if not in QualityFeedbackOutstanding,
        // to ensure that the navigation happens correctly at the time of submition.
        qualityFeedbackHelper.forceNavigationToWorklist(
            submitStore.instance.getSubmitResponseReturn.hasQualityFeedbackOutstanding
        );

        // Refresh the worklist
        this.initiateContentRefresh();

        // Clear the marks and annotations if needed for Reloading the DefinitiveMarks
        submitHelper.clearMarksAndAnnotations(submittedMarkGroupIds);
    };

    /**
     * Start the content refresh
     */
    private initiateContentRefresh() {
        // Clear worklist cache and do content refresh
        let markingMode = worklistStore.instance.getMarkingModeByWorkListType(
            worklistStore.instance.currentWorklistType
        );

        if (qigStore.instance.selectedQIGForMarkerOperation) {
            this.storageAdapterHelper.clearCache(
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                markingMode,
                worklistStore.instance.getRemarkRequestType,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                worklistStore.instance.currentWorklistType
            );
            // Load the marking progress
            worklistActionCreator.getWorklistMarkerProgressData(
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation
                    .isElectronicStandardisationTeamMember
            );
        }
    }

    /**
     * This will display the unread mandatory message popup while user in message screen using background pulse
     */
    private onUpdateNotification = (
        unreadMessageCount: number,
        isMessageReadCountChanged: boolean,
        unreadMandatoryMessageCount: number
    ): void => {
        // display unread mandatory messages are available popup while user in message screen and not composing a message
        if (
            unreadMandatoryMessageCount > 0 &&
            this.props.footerType === enums.FooterType.Message &&
            !messageStore.instance.isMessagePanelVisible
        ) {
            this.mandatoryMessageTriggeringPoint = enums.TriggerPoint.BackgroundPulse;
            this.onPopUpDisplayEvent(
                enums.PopUpType.MandatoryMessage,
                enums.PopUpActionType.Show,
                null
            );
        }
    };

    /**
     * Show pop up if the message panel is edited on navigation
     */
    private onMessagePanelEdited = (
        messageNavigationArgument: MessageNavigationArguments
    ): void => {
        if (
            messageNavigationArgument.hasMessageContainsDirtyValue &&
            !messageNavigationArgument.navigationConfirmed
        ) {
            this.messageNavigationArguments = messageNavigationArgument;
            this.messageNavigationArguments.navigationConfirmed = true;
            if (
                messageNavigationArgument.navigateTo === enums.MessageNavigation.newException ||
                messageNavigationArgument.navigateTo ===
                enums.MessageNavigation.exceptionWithInResponse
            ) {
                this.popUpData.popupContent = localeStore.instance.TranslateText(
                    'marking.response.discard-exception-dialog.body-open-another'
                );
            } else if (
                messageNavigationArgument.navigateTo === enums.MessageNavigation.ChangeStatus
            ) {
                this.popUpData.popupContent = localeStore.instance.TranslateText(
                    'messaging.compose-message.discard-message-dialog.body-start-new-message-while-composing'
                );
            } else {
                this.popUpData.popupContent = localeStore.instance.TranslateText(
                    'messaging.compose-message.discard-message-dialog.body-navigated-away'
                );
            }

            this.setState({ popUpType: enums.PopUpType.DiscardMessageNavigateAway });
        }
    };

    /**
     * Show mandatory message validation popup
     */
    private mandatoryMessageValidationPopupVisibility = (): void => {
        this.setState({ doShowMandatoryMessageValidationPopup: true });
    };

    /**
     * setting the timeout of application online check
     * @param {type} interval
     */
    private triggerApplicationOnlinePoll(forceStartPoll: boolean = false): void {
        // If the application status has been changed update the call
        if (forceStartPoll || this.state.isOnline !== applicationStore.instance.isOnline) {
            if (userOptionsHelper.hasUserOptionsChanged) {
                userOptionsHelper.InitiateSaveUserOption(false);
            }
        }
    }

    /**
     * Closing application error poup message
     */
    private onApplicationErrorMessagePopUpClicked(): void {
        this.setState({
            isApplicationOffline: false
        });
    }

    /**
     * User action has been interrupted
     */
    private userActionInterrupted(_isFromLogout: boolean): void {
        if (_isFromLogout) {
            this.offlineErrorMessage = localeStore.instance.TranslateText(
                'generic.offline-dialog.body-user-options-changed'
            );
            this.props.resetLogoutConfirmationSatus();
            this._onLogoutTriggered = false;
        } else {
            this.offlineErrorMessage = stringHelper.format(
                localeStore.instance.TranslateText('generic.offline-dialog.body'),
                [String(String.fromCharCode(179))]
            );
        }
        /*Hiding the busy indicator if the application is offline and the busy indicator was showing at the time of being offline*/
        if (this.state.isBusy && !applicationStore.instance.isOnline) {
            this.setState({
                isApplicationOffline: !applicationStore.instance.isOnline,
                isBusy: false
            });
        } else {
            this.setState({ isApplicationOffline: !applicationStore.instance.isOnline });
        }
    }

    /**
     * Check the QIG got withdrwan
     */
    private onResponseDataReceived = (searchedResponseData: SearchedResponseData): void => {
        if (searchedResponseData.approvalStatusId === enums.ExaminerApproval.Withdrawn) {
            teamManagementActionCreator.removeHistoryItem(searchedResponseData.markSchemeGroupId);
            this.setState({ isWithdrawnResponseError: true, isBusy: false });
        }
    };

    /**
     * show error popup on response search failed
     */
    private onResponseDataReceivedFailed = (serviceFailed: boolean): void => {
        // If this service failed then we dont know whether the response is available or not
        if (!serviceFailed) {
            return;
        }

        this.setState({ isResponseSearchFailed: true, isBusy: false });
    };

    private handleErrorNavigationTeamManagement = (
        failureCode: enums.FailureCode,
        markSchemeGroupId: number = 0
    ) => {
        switch (failureCode) {
            case enums.FailureCode.SubordinateExaminerWithdrawn:
            case enums.FailureCode.HierarchyChanged:
                navigationHelper.loadTeamManagement();
                userInfoActionCreator.changeMenuVisibility(false);
                break;
            case enums.FailureCode.Withdrawn:
                this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                navigationHelper.loadQigSelector();
                userInfoActionCreator.changeMenuVisibility(false);
                teamManagementActionCreator.removeHistoryItem(markSchemeGroupId);
                break;
        }
    };

    /**
     * Adding current items to history based upon the user's action
     */
    private addToRecentHistory = () => {
        if (!worklistStore.instance.isMarkingCheckMode) {
            this.addSelectedQigDetailsToUserOption();
        }
        // If the container page is response we dont want to add that to the history
        if (
            !qigStore.instance.selectedQIGForMarkerOperation ||
            worklistStore.instance.isMarkingCheckMode ||
            navigationStore.instance.containerPage === enums.PageContainers.Response
        ) {
            return;
        }
        let _historyItem: historyItem = new historyItem();

        // QIG Name based on string format CC
        _historyItem.qigName = stringFormatHelper.formatAwardingBodyQIG(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName,
            qigStore.instance.selectedQIGForMarkerOperation.assessmentCode,
            qigStore.instance.selectedQIGForMarkerOperation.sessionName,
            qigStore.instance.selectedQIGForMarkerOperation.componentId,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperName,
            qigStore.instance.selectedQIGForMarkerOperation.assessmentName,
            qigStore.instance.selectedQIGForMarkerOperation.componentName,
            stringFormatHelper.getOverviewQIGNameFormat()
        );

        _historyItem.qigId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        _historyItem.timeStamp = Date.now();

        // adding to history item based on Marker Operation Mode
        if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
            let _teamManagementHistoryInfo: teamManagementHistoryInfo = new teamManagementHistoryInfo();
            _teamManagementHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
            _teamManagementHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
            _teamManagementHistoryInfo.remarkRequestType =
                worklistStore.instance.getRemarkRequestType;
            _teamManagementHistoryInfo.subordinateExaminerRoleID =
                navigationStore.instance.containerPage !== enums.PageContainers.TeamManagement
                    ? teamManagementStore.instance.examinerDrillDownData
                        ? teamManagementStore.instance.examinerDrillDownData.examinerRoleId
                        : 0
                    : 0;
            _teamManagementHistoryInfo.subordinateExaminerID =
                navigationStore.instance.containerPage !== enums.PageContainers.TeamManagement
                    ? teamManagementStore.instance.examinerDrillDownData
                        ? teamManagementStore.instance.examinerDrillDownData.examinerId
                        : 0
                    : 0;
            _teamManagementHistoryInfo.supervisorExaminerRoleID = teamManagementStore.instance
                .selectedExaminerRoleId
                ? teamManagementStore.instance.selectedExaminerRoleId
                : operationModeHelper.examinerRoleId;
            _teamManagementHistoryInfo.selectedTab = teamManagementStore.instance
                .selectedTeamManagementTab
                ? teamManagementStore.instance.selectedTeamManagementTab
                : enums.TeamManagement.MyTeam;
            _teamManagementHistoryInfo.currentContainer = navigationStore.instance.containerPage;
            _historyItem.team = _teamManagementHistoryInfo;
        } else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            let _standardisationSetupHistoryInfo: standardisationSetupHistoryInfo = new standardisationSetupHistoryInfo();
            _standardisationSetupHistoryInfo.standardisationSetupWorklistType =
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            _standardisationSetupHistoryInfo.timeStamp = Date.now();
            _historyItem.standardisationSetup = _standardisationSetupHistoryInfo;
        } else {
            let _worklistHistoryInfo: worklistHistoryInfo = new worklistHistoryInfo();
            _worklistHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
            _worklistHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
            _worklistHistoryInfo.remarkRequestType = worklistStore.instance.getRemarkRequestType;
            _historyItem.myMarking = _worklistHistoryInfo;
        }

        let _isMarkingEnabled: boolean =
            qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.isMarkingEnabled;

        _historyItem.markingMethodId =
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod;
        _historyItem.isElectronicStandardisationTeamMember =
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

        // used for showing/hiding marking link in menu's histroy list under menu tab
        _historyItem.isMarkingEnabled =
            _isMarkingEnabled &&
            qigStore.instance.selectedQIGForMarkerOperation.examinerQigStatus !==
            enums.ExaminerQIGStatus.WaitingStandardisation &&
            qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget != null;

        // used for showing/hiding teammanagement link in menu's histroy list under menu tab
        _historyItem.isTeamManagementEnabled =
            qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.isTeamManagementEnabled;

        // used for showing/hiding standardisation setup link in menu's history list under menu tab.
        _historyItem.isStandardisationSetupEnabled =
            (qigStore.instance.isStandardisationSetupButtonVisible(qigStore.instance.selectedQIGForMarkerOperation) ||
                qigStore.instance.isStandardisationSetupLinkVisible(qigStore.instance.selectedQIGForMarkerOperation));

        _historyItem.questionPaperPartId =
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        _historyItem.examinerRoleId = operationModeHelper.examinerRoleId;

        loadContainerActionCreator.addToRecentHistory(_historyItem);
    };

    /**
     * Adding current qig details to user option.
     */
    private addSelectedQigDetailsToUserOption() {
        let _rememberQig: rememberQig = new rememberQig();
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            _rememberQig.qigId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            _rememberQig.worklistType = worklistStore.instance.currentWorklistType;
            _rememberQig.remarkRequestType = worklistStore.instance.getRemarkRequestType;
            _rememberQig.questionPaperPartId =
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                _rememberQig.area = enums.QigArea.TeamManagement;
                if (
                    teamManagementStore.instance.selectedTeamManagementTab ===
                    enums.TeamManagement.MyTeam
                ) {
                    if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                        _rememberQig.subordinateExaminerRoleID = teamManagementStore.instance
                            .examinerDrillDownData
                            ? teamManagementStore.instance.examinerDrillDownData.examinerRoleId
                            : 0;
                        _rememberQig.subordinateExaminerID = teamManagementStore.instance
                            .examinerDrillDownData
                            ? teamManagementStore.instance.examinerDrillDownData.examinerId
                            : 0;
                    } else {
                        _rememberQig.subordinateExaminerRoleID = 0;
                        _rememberQig.subordinateExaminerID = 0;
                    }
                }
                _rememberQig.examinerRoleId = teamManagementStore.instance.selectedExaminerRoleId
                    ? teamManagementStore.instance.selectedExaminerRoleId
                    : operationModeHelper.examinerRoleId;
                _rememberQig.tab = enums.TeamManagement.MyTeam;
            } else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                _rememberQig.area = enums.QigArea.StandardisationSetup;
                _rememberQig.standardisationSetupWorklistType = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            } else {
                _rememberQig.area = enums.QigArea.Marking;
            }

            userOptionsHelper.save(
                userOptionKeys.REMEMBER_PREVIOUS_QIG,
                JSON.stringify(_rememberQig)
            );
        }
    }

    /**
     * Show No Marking Check Available Popup
     */
    private showNoMarkingCheckAvailableMessage = (
        popUpType: enums.PopUpType,
        popUpActionType: enums.PopUpActionType,
        popUpData: PopUpData
    ): void => {
        if (
            popUpActionType === enums.PopUpActionType.Show &&
            popUpType === enums.PopUpType.NoMarkingCheckRequestPossible
        ) {
            this.setState({
                popUpType: popUpType,
                doShowNoMarkingCheckAvailableMessage: true
            });
        }
    };

    /**
     * Navigate to team management
     */
    private onTeamManagementOpen = (isFromHistory: boolean = false) => {
        navigationHelper.loadTeamManagement(isFromHistory);
    };

    /**
     * Action when the cancel button for Marking Check is clicked
     * Cancel the popup
     */
    private OnCancelClickOfMarkingCheckCompleteConfirmation() {
        this.setState({ isMarkingCheckCompleteConfirmationPopupDisplaying: false });
    }

    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    private OnOkClickOfMarkingCheckCompleteConfirmation() {
        /* on marking check confirmation is clicked Send two messages
           First Message to the marker so that it will appear in the inbox
           the  second message with sysytem message priority so that the
           marking check will be considered as complete*/
        this.setState({ isMarkingCheckCompleteConfirmationPopupDisplaying: false });
        let systemMessagePriority: number = 255;
        let markingCheckToList: Array<number> = [
            worklistStore.instance.selectedMarkingCheckExaminer.fromExaminerID
        ];

        let questionPaperId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        messagingActionCreator.sendExaminerMessage(
            markingCheckToList,
            '',
            '',
            questionPaperId,
            null,
            enums.MessagePriority.Important,
            markSchemeGroupId,
            null,
            -1,
            -1,
            false,
            null,
            enums.SystemMessage.MarksChecked
        );

        messagingActionCreator.sendExaminerMessage(
            markingCheckToList,
            '',
            '',
            questionPaperId,
            null,
            systemMessagePriority,
            markSchemeGroupId,
            null,
            -1,
            -1,
            false,
            null,
            enums.SystemMessage.MarksChecked
        );
    }

    /**
     * Marking Check Complete Button Clicked
     */
    private markCheckCompleteButtonEvent = (): void => {
        this.setState({ isMarkingCheckCompleteConfirmationPopupDisplaying: true });
    };

    /**
     *  Marking Check Completed Event
     */
    private markCheckCompletedEvent = (): void => {
        markingCheckActionCreator.getMarkCheckExaminers(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
        );
    };

    /**
     * Scroll view when focus comes to text box in android like in ipad
     * Firefox is exclueded, scrollIntoViewIfNeeded is not supporting by browser #49184.
     */
    private scrollIntoViewOnEditingTextForAndroid = (): void => {
        let activeElement: Element = document.activeElement;
        if (
            htmlUtilities.isAndroidDevice &&
            !htmlUtilities.isAndroidFirefox &&
            (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')
        ) {
            let that = this;
            setTimeout(function () {
                let el: any = $(activeElement)[0];
                el.scrollIntoViewIfNeeded(true);
            }, 0);
        }
    };

    /**
     * Show locks in qig popup
     */
    private onShowLocksInQigsPopup = (_locksInQigDetailsList: any) => {
        if (
            qigStore.instance.doShowLocksInQigPopUp &&
            _locksInQigDetailsList.locksInQigDetailsList &&
            _locksInQigDetailsList.locksInQigDetailsList.count()
        ) {
            this.setState({
                reRenderLocksInQigPopUp: true
            });
        }
    };

    /**
     * This method will render the pop up with no of locks and qig name
     */
    private renderLocksInQigPopUp = () => {
        // If Exam body CC's not loaded yet, then do not show the locks popup
        let locksPopup = ccStore.instance.isExamBodyCCLoaded ? (
            <LocksInQigPopup
                showLocksInQigPopUp={this.state.reRenderLocksInQigPopUp}
                fromLogout={qigStore.instance.isShowLocksFromLogout}
                onCancelClickOfLocksInQigPopup={this.onCancelClickOfLocksInQigPopup}
                onLogoutClickOfLocksInQigPopup={this.onLogoutClickOfLocksInQigPopup}
                id='LocksInQigPopup'
                key='LocksInQigPopup_key'
            />
        ) : null;
        return locksPopup;
    };

    /**
     * Locks in qig list recieved event
     */
    private onQigSelectedFromLockedList = (qigId: number) => {
        if (loginStore.instance.isAdminRemarker) {
            // Invoking the action creator to retrieve the Admin remarkers QIG details.
            qigActionCreator.getAdminRemarkerQIGSelectorData(true);
        } else {
            // Invoking the action creator to retrieve the QIG list for the QIG Selector
            qigActionCreator.getQIGSelectorData(qigId, true, false, false, true);
        }
    };
    /**
     * Cancel click on locks in qig popup
     * @private
     *
     * @memberof Footer
     */
    private onCancelClickOfLocksInQigPopup = () => {
        this.setState({
            reRenderLocksInQigPopUp: false
        });
    };

    private onLogoutClickOfLocksInQigPopup = () => {
        this.onYesClickOfLogoutConfirmation(false);
        this.setState({
            reRenderLocksInQigPopUp: false
        });
    };

    private navigateToQigFromLockedList = (
        isDataFromSearch: boolean = false,
        isDataFromHistory: boolean = false,
        isFromLocksInPopUp: boolean = false
    ) => {
        if (isFromLocksInPopUp) {
            let changeOperationModePromise = userInfoActionCreator.changeOperationMode(
                enums.MarkerOperationMode.TeamManagement
            );

            let markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId
            );
            let openQIGPromise;
            if (qigStore.instance.getOverviewData) {
                openQIGPromise = qigActionCreator.openQIG(
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    false
                );
            } else {
                openQIGPromise = qigActionCreator.getQIGSelectorData(
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                );
            }
            let that = this;
            Promise.Promise
                .all([changeOperationModePromise, markSchemeGroupCCPromise, openQIGPromise])
                .then(function (result: any) {
                    teamManagementActionCreator.openTeamManagement(
                        qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                        qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        false,
                        true
                    );
                });
        }
        this.setState({
            reRenderLocksInQigPopUp: false
        });
    };

    private doLogoutPopup = (isFromLogout: boolean, _locksInQigDetailsList: any): void => {
        if (isFromLogout) {
            if (
                _locksInQigDetailsList.locksInQigDetailsList &&
                _locksInQigDetailsList.locksInQigDetailsList.count() > 0
            ) {
                qigActionCreator.showLocksInQigPopup(true, true);
            } else {
                userInfoActionCreator.showLogoutPopup();
            }
        }
    };

    /**
     * On cliking Ok button of the response search failed popup
     */
    private onOkClickOfResponseSearchFailedErrorMessage() {
        this.setState({ isResponseSearchFailed: false });
        this.storageAdapterHelper.clearStorageArea('messaging');
        messagingActionCreator.refreshMessageFolder(enums.MessageFolderType.Inbox);
    }

    /**
     * Get the error message that has to be shown on response search failed while a response is deallocated in the background
     */
    private getResponseSearchFailedErrorMessage() {
        let searchResponseData: SearchedResponseData = messageStore.instance.searchResponseData;
        let questionGroup: string = messageHelper.getDisplayText(
            messageStore.instance.getMessageData(searchResponseData.messageId)
        );
        let errorBodyParameter: string[] = [searchResponseData.displayId, questionGroup];

        let errorBody: string = stringHelper.format(
            localeStore.instance.TranslateText('generic.error-dialog.body-response-removed'),
            errorBodyParameter
        );
        return errorBody;
    }

    /**
     * show confirmation popup on submiting simulation response
     */
    private onshowSimulationResponseSubmitConfirmationPopup = (): void => {
        /**
         * for submit all the markgroup id will always be zero
         */
        if (submitStore.instance.getMarkGroupId > 0) {
            this.simulationResponseSubmitConfirmationDialogueContent = localeStore.instance.TranslateText(
                'marking.worklist.submit-response-dialog.body-simulation'
            );
            this.simulationResponseSubmitConfirmationDialogueHeader = localeStore.instance.TranslateText(
                'marking.worklist.submit-response-dialog.header'
            );
        } else {
            this.simulationResponseSubmitConfirmationDialogueContent = localeStore.instance.TranslateText(
                'marking.worklist.submit-all-responses-dialog.body-simulation'
            );
            this.simulationResponseSubmitConfirmationDialogueHeader = localeStore.instance.TranslateText(
                'marking.worklist.submit-all-responses-dialog.header'
            );
        }
        this.setState({ showSimulationResponseSubmitConfirmationPopup: true });
    };

    /**
     * on clicking yes button of simulation response submit confirmation popup
     */
    private onYesClickOfSimulationResponseSubmitButton() {
        this.setState({ showSimulationResponseSubmitConfirmationPopup: false });
        if (submitStore.instance.isSubmitFromMarkScheme) {
            simulationModeHelper.checkStandardisationSetupCompletion(
                enums.PageContainers.None,
                enums.PageContainers.None
            );
            busyIndicatorActionCreator.setBusyIndicatorInvoker(
                enums.BusyIndicatorInvoker.submitInResponseScreen
            );
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
        } else {
            // If simulation response submission happens from worklist, then submission
            // needs to be blocked if standardisation setup is completed
            let that = this;
            if (!qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete) {
                let promise = qigActionCreator.checkStandardisationSetupCompleted(
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                    enums.PageContainers.WorkList,
                    enums.PageContainers.WorkList
                );
                Promise.Promise.all([promise]).then(function (data: any) {
                    if (data[0] === true) {
                        this.setState({
                            showSimulationExitedPopup: true,
                            showAllSimulationExitedQigs: false
                        });
                    } else {
                        that.submitResponse();
                    }
                });
            } else {
                that.submitResponse();
            }
        }
    }

    /**
     * on clicking no button of simulation response submit confirmation popup
     */
    private onNoClickOfSimulationResponseSubmitButton() {
        this.setState({ showSimulationResponseSubmitConfirmationPopup: false });
    }

    /**
     * call when share toggle button is turned off
     */
    private shareConfirmationPopup = (clientToken: string, showSharePopup: boolean): void => {
        this.shareConfirmationClientToken = clientToken;
        markingActionCreator.showOrHideRemoveContextMenu(false);
        this.setState({
            isShared: showSharePopup,
            doShowShareConfirmationPopup: true
        });
    };

    /**
     * on clicking yes button of share confirmation popup
     */
    private onYesClickOfShareConfirmationPopup() {
        this.setState({ doShowShareConfirmationPopup: false });
        acetatesActionCreator.shareAcetate(this.shareConfirmationClientToken);
        this.shareConfirmationClientToken = undefined;
    }

    /**
     * on clicking no button of share confirmation popup
     */
    private onNoClickOfShareConfirmationPopup() {
        this.setState({ doShowShareConfirmationPopup: false });
        this.shareConfirmationClientToken = undefined;
    }

    /**
     * Render simulation exited qigs in popup
     */
    private renderSimulationExitedQigsPopup = () => {
        let secondaryContent: string = null;
        let footerContent: string = null;
        if (this.state.showAllSimulationExitedQigs) {
            secondaryContent = localeStore.instance.TranslateText(
                'marking.worklist.exited-simulation-dialog.subheader-multiple-qigs'
            );
            footerContent = localeStore.instance.TranslateText(
                'marking.worklist.exited-simulation-dialog.body-multiple-qigs'
            );
        } else {
            secondaryContent = localeStore.instance.TranslateText(
                'marking.worklist.exited-simulation-dialog.subheader-single-qig'
            );
            footerContent = localeStore.instance.TranslateText(
                'marking.worklist.exited-simulation-dialog.body-single-qig'
            );
        }

        // If Exam body CC's not loaded yet, then do not show the simulation exited qigs popup
        let simulationExitedQigsPopup = ccStore.instance.isExamBodyCCLoaded ? (
            <GenericDialog
                content={null}
                multiLineContent={this.getSimulationModeExitedQigs()}
                header={localeStore.instance.TranslateText(
                    'marking.worklist.exited-simulation-dialog.header'
                )}
                secondaryContent={secondaryContent}
                displayPopup={this.state.showSimulationExitedPopup}
                okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                onOkClick={this.onOKClickOfSimulationExitedQigsPopup.bind(this)}
                id='moveSimulation'
                key='moveSimulationMessage'
                popupDialogType={enums.PopupDialogType.SimulationExited}
                footerContent={footerContent}
            />
        ) : null;

        return simulationExitedQigsPopup;
    };

    /**
     * Gets the name of simulation mode exited qigs
     */
    private getSimulationModeExitedQigs(): Array<string> {
        let qigNames: Array<string> = new Array<string>();

        if (this.state.showSimulationExitedPopup) {
            // If all qigs need to be shown then. When navigating to qigselector.
            if (this.state.showAllSimulationExitedQigs) {
                let simulationModeExitedQigList: Immutable.List<
                    SimulationModeExitedQig
                    > = Immutable.List<SimulationModeExitedQig>();
                simulationModeExitedQigList =
                    qigStore.instance.getSimulationModeExitedQigList === undefined
                        ? undefined
                        : qigStore.instance.getSimulationModeExitedQigList.qigList;
                if (simulationModeExitedQigList) {
                    simulationModeExitedQigList.map(
                        (_simulationModeExitedQig: SimulationModeExitedQig) => {
                            let qigNameToDisplay = stringFormatHelper.formatAwardingBodyQIG(
                                _simulationModeExitedQig.markSchemeGroupName,
                                _simulationModeExitedQig.assessmentCode,
                                _simulationModeExitedQig.sessionName,
                                _simulationModeExitedQig.componentId,
                                _simulationModeExitedQig.questionPaperName,
                                '', // TO DO: have to retrive ComponentName and AssessmentName on simulationQIg details.
                                '',
                                stringFormatHelper.getOverviewQIGNameFormat()
                            );
                            qigNames.push(qigNameToDisplay);
                        }
                    );
                }
            } else {
                // Otherwise show only the currrent qig. When navigating from worklist/response to area other than
                // qigselector
                let qigData = qigStore.instance.getSelectedQIGForTheLoggedInUser;
                let qigNameToDisplay = stringFormatHelper.formatAwardingBodyQIG(
                    qigData.markSchemeGroupName,
                    qigData.assessmentCode,
                    qigData.sessionName,
                    qigData.componentId,
                    qigData.questionPaperName,
                    '', // TO DO: have to retrive ComponentName and AssessmentName on simulationQIg details.
                    '',
                    stringFormatHelper.getOverviewQIGNameFormat()
                );
                qigNames.push(qigNameToDisplay);
            }
        }
        return qigNames;
    }

    /**
     * On Ok button click of simulation exited qigs popup
     */
    private onOKClickOfSimulationExitedQigsPopup = () => {
        let currentContainer = navigationStore.instance.containerPage;
        // When the popup is displayed in the qigselector
        if (
            this.state.showAllSimulationExitedQigs &&
            currentContainer === enums.PageContainers.QigSelector
        ) {
            simulationModeHelper.clearCacheBeforBeforeSimulationTargetCompletion();
            simulationModeHelper.handleSimulationTargetCompletion(true);
        } else {
            // When only the current qig is shown in the popup
            if (!this.state.showAllSimulationExitedQigs) {
                simulationModeHelper.clearCacheBeforBeforeSimulationTargetCompletion();
                simulationModeHelper.handleSimulationTargetCompletion(false);
            }
        }

        this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(this.triggerPointAfterClose);
        this.triggerPointAfterClose = 0;
    };

    /**
     * When standardisation setup is completed in background
     */
    private onStandardisationSetupCompletionInBackground = () => {
        if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
            this.setState({
                showSimulationExitedPopup: true,
                showAllSimulationExitedQigs: false
            });
        }
    };

    /**
     * On simulation target completion
     */
    private onSimulationTargetCompletion = () => {
        let navigateTo = qigStore.instance.navigateToAfterStdSetupCheck;
        this.setState({
            showSimulationExitedPopup: false
        });
        if (!this.state.showAllSimulationExitedQigs) {
            if (navigateTo === enums.PageContainers.Message) {
                navigationHelper.loadMessagePage();
            } else if (navigateTo === enums.PageContainers.WorkList) {
                navigationHelper.loadWorklist();
            } else if (navigateTo === enums.PageContainers.TeamManagement) {
                navigationHelper.loadTeamManagement();
            }
        }
    };

    /**
     * On getting the simulation exited qigs and locks in qigs data
     */
    private onSimulationExitedQigsAndLocksInQigsRecieved = (isFromLogout: any) => {
        if (simulationModeHelper.isSimulationExitedQigDataAvailable) {
            // If there are simulation exited qigs then show the popup
            this.setState({
                showSimulationExitedPopup: true,
                showAllSimulationExitedQigs: true
            });
        } else if (simulationModeHelper.isLockInQigsDataAvailable) {
            // Show locks if there is no simulation
            qigActionCreator.showLocksInQigPopup(true, isFromLogout);
        }
    };

    /**
     * On standardisation setup completion
     */
    private onStandardisationSetupCompletion = () => {
        if (
            qigStore.instance.isStandardisationsetupCompletedForTheQig &&
            qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete
        ) {
            this.setState({
                showSimulationExitedPopup: true,
                showAllSimulationExitedQigs: false
            });
        } else if (qigStore.instance.navigateToAfterStdSetupCheck === enums.PageContainers.Login) {
            // Checking whether there are any locked examiners currently, if the standardisation setup was not completed
            // and the user was trying to logout.
            qigActionCreator.getLocksInQigs(true);
        }
    };

    /**
     * On getting the simulation exited qigs data
     */
    private onSimulationExitedQigsRecieved = () => {
        if (simulationModeHelper.isSimulationExitedQigDataAvailable) {
            this.setState({
                showSimulationExitedPopup: true,
                showAllSimulationExitedQigs: true
            });
        }
    };

    /**
     * Method to be invoked when browser is online.
     */
    private updateOnlineStatus = (): void => {
        // sends ping to validate network is offline
        applicationActionCreator.validateNetWorkStatus(true);
    };

    /**
     * On ok click of submit response error popup
     */
    private onSubmitResponseErrorPopupOkClick = (): void => {
        this.setState({ isSubmitErrorPopDisplaying: false });
        this.initiateContentRefresh();
        if (ecourseworkHelper.isECourseworkComponent) {
            ecourseworkHelper.clearEcourseworkFileData();
        } else {
            navigationHelper.loadWorklist();
        }
    };

    /**
     * On OK click of Autozoned message popup
     */
    private onAutozonedWarningMessageOkClick = (): void => {
        //change the state to false to close the popup
        this.setState({ isAutozonedMessagePopupDisplaying: false });
    };

    /**
     * On Ecoursework File data cleared
     */
    private onEcourseworkFileDataCleared = (): void => {
        ecourseworkHelper.fetchECourseWorkCandidateScriptMetadata(null, true);
        navigationHelper.loadWorklist();
    };

    /**
     * Method to reset the acetate save inprogress status.
     */
    private resetAcetateSaveInProgressStatus() {
        // checking whether any addded/modified acetates are found in the acetatelist from store.
        let modifiedAcetatesList: Immutable.List<
            Acetate
            > = qigStore.instance.getModifiedAcetatesList();
        if (modifiedAcetatesList && modifiedAcetatesList.size > 0) {
            // Invoke action creator to set saveInProgress status to true before calling acetate save process.
            acetatesActionCreator.resetAcetateSaveInProgressStatus(modifiedAcetatesList);
        }
    }

    /**
     * Reset acetates saveInProgress status received callback event.
     */
    private onResetAcetatesSaveInProgressReceived(modifiedAcetatesList: Immutable.List<Acetate>) {
        let saveacetatesarguments: SaveAcetatesArguments = {
            Tools: modifiedAcetatesList
        };
        // db call for saving the acetate list in database.
        acetatesActionCreator.saveAcetates(saveacetatesarguments);
    }

    /**
     * Complete Standardisation received callback event.
     */
    private onCompleteStandardisationSetup() {
        if (!standardisationSetupStore.instance.iscompleteStandardisationSuccess) {
            this.setState({ popUpType: enums.PopUpType.CompleteStandardisationValidate, isBusy: false });
        }
    }

    /**
     * Checks whether the autozoned message should be displayed.
     */
    private isAutozonedMessagePopupVisible() {
        if (this.props.footerType !== enums.FooterType.Message) {

            let selectedAwardingCandidateData: AwardingCandidateDetails;
            let examSessionID: number;

            if (markerOperationModeFactory.operationMode.isAwardingMode) {
                selectedAwardingCandidateData = awardingHelper.awardingSelectedCandidateData();
                examSessionID = selectedAwardingCandidateData.responseItemGroups[0].examSessionID;
            }

            //Checking the CC values
            let isAutozoned =
                configurableCharacteristicHelper
                    .getExamSessionCCValue(
                    configurableCharacteristicNames.AutoZoning,
                    markerOperationModeFactory.operationMode.isAwardingMode
                        ? examSessionID
                        : qigStore.instance.selectedQIGForMarkerOperation.examSessionId
                    )
                    .toLowerCase() === 'true' &&
                configurableCharacteristicHelper
                    .getExamSessionCCValue(
                    configurableCharacteristicNames.DisplayAutozonedResponsesWarning,
                    markerOperationModeFactory.operationMode.isAwardingMode
                        ? examSessionID
                        : qigStore.instance.selectedQIGForMarkerOperation.examSessionId
                    )
                    .toLowerCase() === 'true';
            //getting the saved userOption value
            let userOptionAutozonedValue =
                userOptionsHelper.getUserOptionByName(
                    userOptionKeys.AUTOZONED_WARNING_MESSAGE,
                    markerOperationModeFactory.operationMode.isAwardingMode
                        ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerRoleId
                        : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
                ) === 'true';
            //set state to display Autozoned message popup
            if (isAutozoned && userOptionAutozonedValue !== true) {
                this.setState({
                    isAutozonedMessagePopupDisplaying: true
                });
                //saving useroption for autozoned message popup
                userOptionsHelper.save(
                    userOptionKeys.AUTOZONED_WARNING_MESSAGE,
                    JSON.stringify(true),
                    true,
                    true,
                    false,
                    true,
                    markerOperationModeFactory.operationMode.isAwardingMode
                        ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerRoleId
                        : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
                );
            }
        }
    }

    /**
     * on click select to mark popup in Std setup centre script
     */
    private onSelectStdSetupResponseToMark = (popupType: enums.PopUpType,
        provisionalQigDetails: Immutable.List<ProvisionalQIGDetailsReturn>) => {
        let provisionalMarkingType: enums.ProvisionalMarkingType = enums.ProvisionalMarkingType.None;
        if (popupType === enums.PopUpType.SelectToMarkAsProvisional && this.isCommonProvisionalStandardisationCcOn()) {
            provisionalMarkingType = enums.ProvisionalMarkingType.AllocateToAll;
        }
        if (provisionalQigDetails) {
            this.populateCreateMultiQIGProvisionalsPopUpData(provisionalQigDetails);
        }
        this.setState({ popUpType: popupType, provisionalMarkingType: provisionalMarkingType });
    };

    /**
     * on cancel click of the select response to mark as provisional popup
     */
    private onCancelClickOfSelectResponseToMarkasProvisional = () => {
        this.setState({ popUpType: enums.PopUpType.None });
    };

    /**
     * cancel click on mark as definitive popup.
     */
    private onCancelClickOnMarkAsDefinitivePopUp = () => {
        this.setState({ popUpType: enums.PopUpType.None });
        this.copyMarksAsDefinitiveSelected = true;
    };

    /**
     * submit click on mark as definitive popup.
     */
    private submitClickOnMarkAsDefinitivePopUp = () => {
        this.setState({ popUpType: enums.PopUpType.None });

        let standardisationResponseDataExaminerRoleId = 0;
        let currentExaminerRoleId = 0;
        let standardisationResponseData = standardisationSetupStore.instance.fetchStandardisationResponseData();
        if (standardisationResponseData) {
            standardisationResponseDataExaminerRoleId = standardisationResponseData.examinerRoleId;
            currentExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        }

        standardisationActionCreator.copyMarksAndAnnotationsAsDefinitive(this.copyMarksAsDefinitiveSelected,
            standardisationResponseDataExaminerRoleId !== currentExaminerRoleId, responseHelper.hasAdditionalObject);
    };

    /**
     * on mark later clicked for select responses popup to move as provisional
     */
    private selectProvisionalMarkLaterClick = () => {
        let markSchemeGroupIds = Array<Number>();
        if (this.multiQigCheckboxItems && this.multiQigCheckboxItems.length > 1) {
            this.multiQigCheckboxItems.map((item: genericCheckBoxItems) => {
                if (item.isChecked) {
                    markSchemeGroupIds.push(item.id);
                }
            });
        } else {
            markSchemeGroupIds.push(standardisationSetupStore.instance.markSchemeGroupId);
        }
        standardisationActionCreator.createStandardisationRig(standardisationSetupStore.instance.examinerRoleId,
            standardisationSetupStore.instance.selectedResponseId,
            markSchemeGroupIds,
            enums.MarkingMode.PreStandardisation, false, this.state.provisionalMarkingType);
    };

	/**
	 * on mark now clicked for select responses popup to move as provisional
	 */
    private selectProvisionalMarkNowClick = () => {
        let markSchemeGroupIds = Array<Number>();
        if (this.multiQigCheckboxItems && this.multiQigCheckboxItems.length > 1) {
            this.multiQigCheckboxItems.map((item: genericCheckBoxItems) => {
                if (item.isChecked) {
                    markSchemeGroupIds.push(item.id);
                }
            });
        } else {
            markSchemeGroupIds.push(standardisationSetupStore.instance.markSchemeGroupId);
        }
        standardisationActionCreator.createStandardisationRig(standardisationSetupStore.instance.examinerRoleId,
            standardisationSetupStore.instance.selectedResponseId,
            markSchemeGroupIds,
            enums.MarkingMode.PreStandardisation, true, this.state.provisionalMarkingType);
    };

    /**
     * navigate to standardisation setup screen on mark later
     */
    private onStandardisationRigCreated = (errorInRigCreation: boolean, doMarkNow: boolean) => {
        this.setState({ popUpType: enums.PopUpType.None });
        if (!errorInRigCreation) {
            navigationHelper.loadStandardisationSetup();
            // promise to get standardisation target details
            let getStandardisationTargetDetails = standardisationActionCreator.getStandardisationTargetDetails
                (standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);

            getStandardisationTargetDetails.then(function (item: any) {
                // load select Responses details on coming from response
                let standardisationworlist = standardisationActionCreator.standardisationSetupWorkListSelection
                    (doMarkNow ? enums.StandardisationSetup.ProvisionalResponse : enums.StandardisationSetup.SelectResponse,
                    standardisationSetupStore.instance.markSchemeGroupId,
                    standardisationSetupStore.instance.examinerRoleId);
            });
        }
    };

    /**
     * Reload unclassified worklist
     */
    private reRenderUnclassifiedWorklist = (isFromResponse: boolean) => {
        // Update standardisation target details
        this.copyMarksAsDefinitiveSelected = true;
        let getStandardisationTargetDetails = standardisationActionCreator.getStandardisationTargetDetails
            (standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);

        // Update unclassified worklist details
        let standardisationWorklist = standardisationActionCreator.standardisationSetupWorkListSelection
            (enums.StandardisationSetup.UnClassifiedResponse,
            standardisationSetupStore.instance.markSchemeGroupId,
            standardisationSetupStore.instance.examinerRoleId);

        // Response id in the unclassified worklist to which, the navigation should happen after classify action
        let nextResponseId =
            markerOperationModeFactory.operationMode.nextResponseId(responseStore.instance.selectedDisplayId.toString());

        // For classify actions from response scren
        if (nextResponseId && isFromResponse) {
            // Remember unclassified worklist view to go back after classify action
            let stdWorklistView: enums.STDWorklistViewType =
                standardisationSetupStore.instance.isTotalMarksViewSelected ?
                    enums.STDWorklistViewType.ViewTotalMarks :
                    enums.STDWorklistViewType.ViewMarksByQuestion;

            let unclassifiedResponsesPromise = standardisationActionCreator.getUnClassifiedResponseDetails(
                standardisationSetupStore.instance.examinerRoleId,
                loginSession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                false, stdWorklistView).then(function (item: any) {
                    // On classifying response from response screen, navigate to next available response in the unclassified worklist
                    navigationHelper.responseNavigation(enums.ResponseNavigation.next, false, parseInt(nextResponseId));
                });

            Promise.Promise.all([standardisationWorklist, unclassifiedResponsesPromise]).
                then(() => {
                    this.setState({ doShowClassifyResponseBusyIndicator: false });
                });
        } else {
            Promise.Promise.all([standardisationWorklist]).
                then(() => {
                    this.setState({ doShowClassifyResponseBusyIndicator: false });
                });

            // On classifying last response from response screen, navigate back to unclassified worklist.
            navigationHelper.loadStandardisationSetup();
        }
    }


    /**
     * Reload provional worklist
     */
    private reRenderProvionalWorklist = (fromMarkScheme: boolean) => {
        if (this._showShareLoadingIndicatorForPE && fromMarkScheme) {
            let stdWorklistView: enums.STDWorklistViewType =
                standardisationSetupStore.instance.isTotalMarksViewSelected ? enums.STDWorklistViewType.ViewTotalMarks :
                    enums.STDWorklistViewType.ViewMarksByQuestion;
            let nextResponseId =
                markerOperationModeFactory.operationMode.nextResponseId(this._shareResponseDetails.displayId.toString());
            if (nextResponseId) {
                let responseData = standardisationSetupStore.instance.getResponseDetails
                    (responseStore.instance.selectedDisplayId.toString());

                // remove shared response from provisional response worklist collection.
                standardisationActionCreator.updateStandardisationResponseCollection(
                    responseData.esMarkGroupId,
                    enums.StandardisationSetup.ProvisionalResponse
                );
                this.setState({
                    isBusy: false
                });
                navigationHelper.responseNavigation(enums.ResponseNavigation.next, false, parseInt(nextResponseId));
            } else {
                // if next response is not available then load worklist.
                navigationHelper.loadStandardisationSetup();
            }
            return;
        }
    }

	/**
	 * Action when the ok button for Marking Check confirmation is clicked
	 */
    private OnOkClickOfCompleteStandardisationConfirmation() {
        this.setState({ isBusy: true, isCompleteStandardisation: true });
        standardisationActionCreator.completeStandardisationSetup(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
    }

    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    private OnCancelClickOfCompleteStandardisationConfirmation() {
        this.props.OnClickingCancelofStdSetupPopup(true);
    }

    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    private onOkClickofStandardisationSetupValidate() {
        this.setState({
            popUpType: enums.PopUpType.None,
            isCompleteStandardisation: false
        });
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.validateStandardisationSetup);
        standardisationActionCreator.getStandardisationTargetDetails(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);

        // get the worklist view type.
        let stdWorklistViewType: enums.STDWorklistViewType = userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_VIEW_OPTION)
            === 'false' ? enums.STDWorklistViewType.ViewMarksByQuestion : enums.STDWorklistViewType.ViewTotalMarks;

        // Refresh the grid with latest changes.
        standardisationActionCreator.getClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
            loginSession.EXAMINER_ID, standardisationSetupStore.instance.markSchemeGroupId,
            false, stdWorklistViewType);
    }

    /**
     * pop up content on clicking select response to mark button
     */
    private get getSelectToMarkProvisionalPopupContent(): JSX.Element[] {
        let content: JSX.Element[] = [];
        let scriptData: StandardisationScriptDetails = standardisationSetupStore.instance.fetchSelectedScriptDetails(
            standardisationSetupStore.instance.selectedResponseId
        );
        let showMultiQigPopup: boolean = this.isMultiQigMarkingAvailable();
        let centreCandidateDetails: string = stringHelper.format(
            localeStore.instance.TranslateText(
                'standardisation-setup.select-response.select-to-mark-popup-content-line2'
            ),
            [
                String(scriptData.candidateScriptId),
                scriptData.centreNumber,
                scriptData.centreCandidateNumber.toUpperCase()
            ]
        );

        let isCommonProvisionalStandardisationCcOn: boolean = configurableCharacteristicHelper.getCharacteristicValue(
            configurableCharacteristicNames.CommonProvisionalStandardisation,
            standardisationSetupStore.instance.markSchemeGroupId).toLowerCase() === 'true';

        if (showMultiQigPopup) {
            content.push(<p key='select-to-mark-popup-content-line2'
                className='dim-text padding-bottom-10'>{centreCandidateDetails}</p>);

            content.push(<p key='select-to-mark-popup-content-line2'>{localeStore.instance.TranslateText(
                'standardisation-setup.select-response.select-to-mark-multiqig-popup-content-line'
            )}</p>);
            content.push(
                <GenericPopupWithCheckBoxes
                    className='qig-item'
                    id='popup-createprovisional-multiqig'
                    items={this.multiQigCheckboxItems}
                    selectedLanguage={this.props.selectedLanguage}
                    onChecked={this.onChecked}
                    key='popup-createprovisional-multiqig' />);
        } else {
            content.push(
                <p key='select-to-mark-popup-content-line1'>
                    {isCommonProvisionalStandardisationCcOn ? localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-content-line1-provisional')
                        : localeStore.instance.TranslateText(
                            'standardisation-setup.select-response.select-to-mark-popup-content-line1')
                    }
                </p>
            );
            content.push(<p key='select-to-mark-popup-content-line2'
                className='dim-text padding-top-10'>{centreCandidateDetails}</p>);
        }

        if (this.isCommonProvisionalStandardisationCcOn()) {
            content.push(
                <div className='option-holder padding-top-10'>
                    <ul className='options'>
                        <li className='padding-top-10'>
                            <input
                                type='radio'
                                value='selected'
                                id='STMAllocate1'
                                name='selectProvisionalSTM'
                                checked={this.state.provisionalMarkingType === enums.ProvisionalMarkingType.AllocateToAll ?
                                    true : false}></input>
                            <label htmlFor='STMAllocate1' onClick=
                                {this.onOptionButtonClick.bind(this, enums.ProvisionalMarkingType.AllocateToAll)}>
                                <span className='radio-ui'></span>
                                <span className='label-text'>{localeStore.instance.TranslateText(
                                    'standardisation-setup.select-response.select-to-mark-popup-option-allocate-all'
                                )}</span>
                            </label>
                        </li>
                        <li className='padding-top-10'>
                            <input type='radio' value='selected' id='STMAllocate2' name='selectProvisionalSTM'
                                checked={this.state.provisionalMarkingType === enums.ProvisionalMarkingType.AllocatedToMe ?
                                    true : false}></input>
                            <label htmlFor='STMAllocate2' onClick=
                                {this.onOptionButtonClick.bind(this, enums.ProvisionalMarkingType.AllocatedToMe)}>
                                <span className='radio-ui'></span>
                                <span className='label-text'>{localeStore.instance.TranslateText(
                                    'standardisation-setup.select-response.select-to-mark-popup-option-allocate-me'
                                )}</span>
                            </label>
                        </li>
                    </ul>
                    <p className='padding-top-20' key='select-to-mark-popup-content-line3'>{localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-content-line3'
                    )}</p>
                </div>);
        } else {
            content.push(
                <p className='padding-top-10' key='select-to-mark-popup-content-line3'>
                    {localeStore.instance.TranslateText(
                        'standardisation-setup.select-response.select-to-mark-popup-content-line3'
                    )}
                </p>
            );
        }
        return content;
    }

    /**
     * Method to handle option button click
     * @param isAllocateToMe
     */
    private onOptionButtonClick(_provisionalMarkingType: enums.ProvisionalMarkingType) {
        this.setState({
            renderedOn: Date.now(),
            provisionalMarkingType: _provisionalMarkingType
        });
    }

    /**
     * get mark as definitive popup content
     */
    private get getMarkAsDefinitivePopupContent(): JSX.Element[] {
        let content: JSX.Element[] = [];
        let responseData: StandardisationResponseDetails = standardisationSetupStore.instance.fetchStandardisationResponseData(
            standardisationSetupStore.instance.selectedResponseId
        );
        let markAsDefinitiveResponse: string = stringHelper.format(
            localeStore.instance.TranslateText(
                'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-content-line2'
            ),
            [
                String(responseData.displayId),
                String(responseData.totalMarkValue)
            ]
        );
        content.push(
            <p key='mark-as-definitive-popup-content-line1'>
                {localeStore.instance.TranslateText(
                    'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-content-line1'
                )}
            </p>
        );
        content.push(<p key='select-to-mark-popup-content-line2'
            className='dim-text padding-top-20'>{markAsDefinitiveResponse}</p>);
        content.push(
            <p className='padding-top-20' key='select-to-mark-popup-content-line3'>
                {localeStore.instance.TranslateText(
                    'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-content-line3'
                )}
            </p>
        );
        let radioButtonText: JSX.Element = (<div className='option-holder padding-top-10'>
            <ul className='options'>
                <li className='padding-top-10' onClick={this.onMarkAsDefinitiveContentClick.bind(this, true)}>
                    <input type='radio' value='selected' id='copyasDefinitive'
                        defaultChecked={true}
                        name='markasdefinitive' /* checked={this.copyMarksAsDefinitiveSelected === false ? false : true}*/ />
                    <label htmlFor='copyasDefinitive'>
                        <span className='radio-ui'></span>
                        <span className='label-text' id='markAsDefinitivePopupRadioButton1'>{localeStore.instance.TranslateText(
                            'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-1'
                        )}</span>
                    </label>
                </li>
                <p className='padding-top-10 option-content'>{localeStore.instance.TranslateText(
                    'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-1-desc'
                )}</p>
                <li className='padding-top-20' onClick={this.onMarkAsDefinitiveContentClick.bind(this, false)}>
                    <input type='radio' value='' id='clearAllMark'
                        name='markasdefinitive' /* checked={this.copyMarksAsDefinitiveSelected === false ? true : false} */ />
                    <label htmlFor='clearAllMark'>
                        <span className='radio-ui'></span>
                        <span className='label-text' id='markAsDefinitivePopupRadioButton2'>{localeStore.instance.TranslateText(
                            'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-2'
                        )}</span>
                    </label>
                </li>
                <p className='padding-top-10 padding-bottom-5 option-content'>
                    {localeStore.instance.TranslateText(
                        'standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-2-desc'
                    )}
                </p>
            </ul>
        </div>);
        content.push(radioButtonText);
        return content;
    }

    /**
     * Updates the copyMarksAsDefinitiveSelected flag, on Mark as definitve popup option click.
     * @param isCopyMarksAndAnnotation
     */
    private onMarkAsDefinitiveContentClick(isCopyMarksAndAnnotation: boolean) {
        this.copyMarksAsDefinitiveSelected = isCopyMarksAndAnnotation;
    }

    /**
     * conditions where the multiqig popup to be shown while select to mark button is clicked
     */
    private isMultiQigMarkingAvailable(): boolean {

        // The multiqig response pop will only show when the following conditions are true
        // 1. WholeResponseProvisionalMarking should be ON.
        // 2. Available QIGs for Provisional marking is more than one
        let wholeResponseProvisionalMarking: boolean = configurableCharacteristicHelper.getExamSessionCCValue(
            configurableCharacteristicNames.WholeResponseProvisionalMarking,
            markerOperationModeFactory.operationMode.isAwardingMode
                ? awardingStore.instance.selectedSession.examSessionId
                : qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true' ? true : false;

        if (wholeResponseProvisionalMarking && this.multiQigCheckboxItems !== undefined && this.multiQigCheckboxItems.length > 1) {
            return true;
        }
        return false;
    }

    /**
     * switch user button click
     */
    private switchUserButtonClick() {
        window.removeEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
        /* tslint:disable:no-string-literal */
        window.sessionStorage['adminsupport'] = 'true';
        /* tslint:enable:no-string-literal */
        window.open('?', '_self');
    }

    /**
     * Complete Standardisation received callback event.
     */
    private onResponseDataRecievedAfterRefresh() {
        /*
          Setting busy indicator to false on Standardisation Setup refresh on
          completing standardisation setup
        */
        this.setState({ isBusy: false });
    }

	/**
	 * Populate recassify multioption popUp data
	 */
    private populateRecassifyMultiOptionPopUpData(selectedMarkingModeId: number = 0) {
        this.items = new Array<genericRadioButtonItems>();
        let markSchemeGroupId = standardisationSetupStore.instance.markSchemeGroupId;
        let ssuStmClassificationRestriction: ssuStmClassificationRestriction
            = stdSetupPermissionHelper.getSsuClassificationRestrictionByMarkSchemeGroupId(markSchemeGroupId);
        let restictedText: string = localeStore.instance.TranslateText(
            'standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.restricted');
        this.standardisationSetupHelper = standardisationSetupFactory.
            getStandardisationSetUpWorklistHelper(standardisationSetupStore.instance.selectedStandardisationSetupWorkList);

        let restrictedTargets = this.standardisationSetupHelper.getRestrictedSSUTarget(markSchemeGroupId);

        // Once std setup is completed, then show only 'seed' radio button in classify options
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
            if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.Practice)) {
                this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Practice, 1, selectedMarkingModeId
                    , ssuStmClassificationRestriction.isPracticeRestrictedForAnyStm, restictedText));
            }

            if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.ES_TeamApproval)) {
                this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.ES_TeamApproval, 2, selectedMarkingModeId
                    , ssuStmClassificationRestriction.isStmStandardisationeRestrictedForAnyStm, restictedText));
            }

            if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.Approval)) {
                this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Approval, 3, selectedMarkingModeId
                    , ssuStmClassificationRestriction.isStandardisationRestrictedForAnyStm, restictedText));
            }

            if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.Seeding)) {
                this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Seeding, 4, selectedMarkingModeId
                    , ssuStmClassificationRestriction.isSeedingRestrictedForAnyStm, restictedText));
            }
        } else {

            /* #75081 : On classifying a response from Provisional/Unclassified worklist after SSU complete,
             the Classification pop- up shall list only those targets which are not met OR 
            (where the target is met AND the type is not included in “RestrictStandardisationSetupTargets”). */
            if (this.canListTargetInClassificationPopUp(enums.MarkingMode.Practice, restrictedTargets)) {
                if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.Practice)) {
                    this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Practice, 1, selectedMarkingModeId
                        , ssuStmClassificationRestriction.isPracticeRestrictedForAnyStm, restictedText));
                }
            }
            if (this.canListTargetInClassificationPopUp(enums.MarkingMode.ES_TeamApproval, restrictedTargets)) {
                if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.ES_TeamApproval)) {
                    this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.ES_TeamApproval, 2, selectedMarkingModeId
                        , ssuStmClassificationRestriction.isStmStandardisationeRestrictedForAnyStm, restictedText));
                }
            }
            if (this.canListTargetInClassificationPopUp(enums.MarkingMode.Approval, restrictedTargets)) {
                if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.Approval)) {
                    this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Approval, 3, selectedMarkingModeId
                        , ssuStmClassificationRestriction.isStandardisationRestrictedForAnyStm, restictedText));
                }
            }
            if (this.canListTargetInClassificationPopUp(enums.MarkingMode.Seeding, restrictedTargets)) {
                if (standardisationSetupStore.instance.checkMarkingModeTargetExistForThisQIG(enums.MarkingMode.Seeding)) {
                    this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Seeding, 4, selectedMarkingModeId
                        , ssuStmClassificationRestriction.isSeedingRestrictedForAnyStm, restictedText));
                }
            }
        }
    }

    /**
     * To check whether the target can be displayed in Classification popup On
     * classifying a response from Provisional/Unclassified worklist after SSU complete
     */
    private canListTargetInClassificationPopUp(target: enums.MarkingMode, restrictedTargets: Immutable.List<enums.MarkingMode>): boolean {
        let standardisationTargetDetailList = standardisationSetupStore.instance.classificationSummaryTargetDetails;
        if (standardisationTargetDetailList) {
            let selectedTarget = standardisationTargetDetailList.
                    filter((x: standardisationTargetDetail) => x.markingModeId === target).first();
            if (selectedTarget.count < selectedTarget.target ||
                       (!restrictedTargets.contains(target) && selectedTarget.target <= selectedTarget.count)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Create Generic Radio Button Item
     * @param markingModeId
     * @param sequenceNo
     * @param selectedMarkingModeId
     * @param isMarkingModeRestrictedForAnyStm
     */
    private createGenericRadioButtonItem(markingModeId: enums.MarkingMode, sequenceNo: number,
        selectedMarkingModeId: number, isMarkingModeRestrictedForAnyStm: boolean, restictedText: string): genericRadioButtonItems {
        let obj = new genericRadioButtonItems();
        obj.sequenceNo = sequenceNo;
        obj.id = markingModeId;
        obj.isChecked = obj.id === selectedMarkingModeId ? true : false;
        obj.name = localeStore.instance.TranslateText(
            'standardisation-setup.standardisation-setup-worklist.classification-type.' + enums.MarkingMode[markingModeId]);
        obj.errorText = (isMarkingModeRestrictedForAnyStm ? ' - ' + restictedText : '');
        return obj;
    }

    /**
     * Create radio button for Reuse action popup
     */
    private createReuseGenericRadioButtonItem(inputid: number, sequenceNo: number): genericRadioButtonItems {
        let radioButonForPE = new genericRadioButtonItems();
        radioButonForPE.sequenceNo = sequenceNo;
        radioButonForPE.id = inputid;
        radioButonForPE.isChecked = true;
        radioButonForPE.name = 'Create copy and move to unclassified list';
        radioButonForPE.errorText = '';
        return radioButonForPE;
    }

	/**
	 * on cancel click of reclassify multi option popup
	 */
    private onCancelClickOfReclassifyMultiOptionPopUp = () => {
        this.reclassifyResponseDetails = undefined;

        // Disable classify response 'OK button' while clicking on classify multi option popup 'cancel button'
        if (this.isUnclassifiedWorklistSelected()) {
            this.isClassifyResponseOkButtonDisabled = true;
        }

        this.populateRecassifyMultiOptionPopUpData();
        this.setState({ popUpType: enums.PopUpType.None });
    };

    /**
     * On cancel click of Reuse Rig action popup
     */
    private onCancelClickOfReuseRigPopup = () => {
        this.reuseRIGSelectedDisplayId = undefined;
        this.populateRecassifyMultiOptionPopUpData();
        this.populateReuseUnclassifyPopupItem();
        this.setState({ popUpType: enums.PopUpType.None });
    }

    /**
     * On Ok mclick of ReuseRIG action popup
     */
    private onOKClickOfReuseRigpopup = () => {
        let openedResponseDetails = standardisationSetupStore.instance.getReusableResponseDetails
            (this.reuseRIGSelectedDisplayId.toString());
        if (this.reuseUnclassifyItem.filter(i => i.isChecked === true)[0] === undefined) {
            this.currentMarkingMode = this.items.filter(i => i.isChecked === true)[0].id;
        } else {
            this.currentMarkingMode = enums.MarkingMode.PreStandardisation;
        }

        let documentId = openedResponseDetails.documentId;
        let markGroupId = openedResponseDetails.esMarkGroupId;
        let markSchemeGroupId = openedResponseDetails.markSchemeGroupId;

        standardisationActionCreator.reuseRigAction(markGroupId,
            documentId,
            markSchemeGroupId,
            this.currentMarkingMode);
        this.setState({
            popUpType: enums.PopUpType.None,
            doShowReuseRigActionBusyIndicator: true
        });
    }

	/**
	 * reclassify response to selected marking mode in popup
	 */
    private onReclassifyResponse = () => {

        // Fetch markSchemeGroupId
        let markSchemeGroupId = standardisationSetupStore.instance.markSchemeGroupId;

        // rig order update is not required for classify action
        let rigOrderUpdateRequired: boolean = this.isUnclassifiedWorklistSelected() ? false : true;

        // Fetch the new marking mode id selected for reclassification
        this.currentMarkingMode = this.items.filter(i => i.isChecked === true)[0].id;
        this.previousMarkingMode = this.reclassifyResponseDetails.markingModeId;
        this.displayId = this.reclassifyResponseDetails.displayId;

        // Construct the model for reclassifyResponseAction
        let responseDetails: updateESMarkGroupMarkingModeData = {
            candidateScriptId: this.reclassifyResponseDetails.candidateScriptId,
            esCandidateScriptMarkSchemeGroupId: this.reclassifyResponseDetails.esCandidateScriptMarkSchemeGroupId,
            markSchemeGroupId: markSchemeGroupId,
            markingModeId: this.currentMarkingMode,
            previousMarkingModeId: this.reclassifyResponseDetails.markingModeId,
            rigOrder: null,
            isRigOrderUpdateRequired: rigOrderUpdateRequired,
            displayId: this.reclassifyResponseDetails.displayId,
            totalMarkValue: this.reclassifyResponseDetails.totalMarkValue,
            oldRigOrder: this.reclassifyResponseDetails.rigOrder,
            assignNextRigOrder: this.currentMarkingMode !== enums.MarkingMode.Seeding ? true : false,
            esMarkGroupRowVersion: this.reclassifyResponseDetails.esMarkGroupRowVersion
        };

        if (this.isUnclassifiedWorklistSelected()) {
            this._classifyResponseDetails = responseDetails;
            this.isClassifyResponseOkButtonDisabled = true;
            this.setState({
                popUpType: enums.PopUpType.None,
                doShowClassifyResponseBusyIndicator: true
            });
            submitHelper.saveAndClassifyResponse(responseStore.instance.selectedMarkGroupId, this._classifyResponseDetails);
        } else if (responseDetails.previousMarkingModeId !== responseDetails.markingModeId) {
            // No need to call classify action if there are no changes in marking mode 
            // This reclassify action is being called when reclassify a response from response screen 
            standardisationActionCreator.reclassifyResponse(responseDetails, enums.PageContainers.Response);
        }

        // reset state 
        this.reclassifyResponseDetails = undefined;
        this.populateRecassifyMultiOptionPopUpData();
        let isBusy: boolean = !this.isUnclassifiedWorklistSelected() ?
            responseDetails.previousMarkingModeId !== responseDetails.markingModeId : false;
        this.setState({
            popUpType: enums.PopUpType.None,
            doShowReclassifyResponseBusyIndicator: isBusy
        });
    };

	/**
	 * Set the state of multi option popup type to Classify or Reclassify
	 */
    private reclassifyMultiOptionPopupOpen = (esMarkGroupId: number): void => {
        this.reclassifyResponseDetails =
            standardisationSetupStore.instance.getResponseDetailsByEsMarkGroupIdBasedOnPermission(esMarkGroupId);
        this.populateRecassifyMultiOptionPopUpData(this.reclassifyResponseDetails.markingModeId);
        this.setState({ popUpType: enums.PopUpType.ReclassifyMultiOption });
    }

    /**
     * Populate radio button item for ReuseRIG pop up
     */
    private populateReuseUnclassifyPopupItem() {
        this.reuseUnclassifyItem = new Array<genericRadioButtonItems>();
        this.reuseUnclassifyItem.push(this.createReuseGenericRadioButtonItem(enums.MarkingMode.PreStandardisation, 1));
    }

    /**
     * get Reuse RIG popup action 
     */
    private get getReUseActionMultiOptionPopupContent(): JSX.Element[] {
        let content: JSX.Element[] = [];
        let openedResponseDetails = standardisationSetupStore.instance.
            getReusableResponseDetails(this.reuseRIGSelectedDisplayId.toString());

        let reuseRIGSelectedCentreId = openedResponseDetails.centreNumber.toString();
        let reuseRIGSelectedCandidateNo = openedResponseDetails.centreCandidateNumber.toString();
        let reuseRIGSelectedScriptID = openedResponseDetails.candidateScriptId.toString();
        content.push(
            <span>
                <p>
                    {localeStore.instance.TranslateText
                        ('standardisation-setup.previous-session.reuse-action-popup.reuse-content')}
                </p>
                <p className='dim-text padding-top-10'>
                    <span>{localeStore.instance.TranslateText
                        ('standardisation-setup.previous-session.reuse-action-popup.script-id')}
                        <span id='reusescriptid'>{': 1' + reuseRIGSelectedScriptID + ', '}</span>
                    </span>
                    <span>{localeStore.instance.TranslateText
                        ('standardisation-setup.previous-session.reuse-action-popup.Centre')}
                        <span id='reusecentreid'>{': ' + reuseRIGSelectedCentreId + ', '}</span>
                    </span>
                    <span>{localeStore.instance.TranslateText
                        ('standardisation-setup.previous-session.reuse-action-popup.Candidate')}
                        <span id='reusecandidateid'>{': ' + reuseRIGSelectedCandidateNo}</span>
                    </span>
                </p>
                <div className='option-holder padding-top-10'>
                    <GenericPopupWithRadioButton
                        className='options'
                        id='popup-reuserig-option-holder'
                        items={this.reuseUnclassifyItem}
                        selectedLanguage={this.props.selectedLanguage}
                        onCheckedChange={this.onReuseItemCheckedChange}
                        renderedOn={this.state.renderedOn}
                        liClassName={'padding-top-10'}
                        key='popup-reuse-unclassify-option'
                    />
                </div>
                <p className='padding-top-10'>
                    {localeStore.instance.TranslateText
                        ('standardisation-setup.previous-session.reuse-action-popup.reuse-classify-option')}
                </p>
                <div className='classify-options-holder padding-top-10 clearfix'>
                    <GenericPopupWithRadioButton
                        className='option-items'
                        id='popup-reclassify-multioption'
                        items={this.items}
                        selectedLanguage={this.props.selectedLanguage}
                        onCheckedChange={this.onCheckedChange}
                        renderedOn={this.state.renderedOn}
                        liClassName={'padding-top-10'}
                        key='popup-reuse-classify-option' />
                </div>
            </span>);
        return content;
    }

	/**
	 * get reclassification Multi Option Popup Content
	 */
    private get getReclassificationMultiOptionPopupContent(): JSX.Element[] {
        let content: JSX.Element[] = [];

        content.push(<span><p className='dim-text'>
            <span>
                {localeStore.instance.TranslateText
                    ('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.response-id')}
                <span className='responseID'>{' ' + this.reclassifyResponseDetails.displayId}</span>
            </span>,
		<span>
                {' ' + localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.total-mark')}
                <span className='total-mark'>{' ' + this.reclassifyResponseDetails.totalMarkValue}</span>
            </span>
        </p>
            <p className='padding-top-10'>
                {localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.body'
                )}
            </p>
            <p className='padding-top-10'>
                {localeStore.instance.TranslateText(qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete ?
                    'standardisation-setup.standardisation-setup-worklist.classify-multioption-popup.body-complete-setup-message' :
                    'standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.body-complete-setup-message'
                )}
            </p>
            <div className='classify-options-holder padding-top-10 clearfix'>
                <GenericPopupWithRadioButton
                    className='option-items'
                    id='popup-reclassify-multioption'
                    items={this.items}
                    selectedLanguage={this.props.selectedLanguage}
                    onCheckedChange={this.onCheckedChange}
                    renderedOn={this.state.renderedOn}
                    liClassName={'padding-top-10'}
                    key='popup-reclassify-multioption' />
            </div>
        </span>);
        return content;
    }

	/**
	 * On clicking items in radio button popup
	 * @param item
	 */
    private onCheckedChange = (itemToBeUpdated: genericRadioButtonItems) => {
        // set the isChecked property of the checked item to true
        this.items.map((i: genericRadioButtonItems) => {
            i.isChecked = i.id === itemToBeUpdated.id ? true : false;
        });

        // Enable classify response OK button on selecting any of the classify response radio button options
        if (this.isUnclassifiedWorklistSelected) {
            this.isClassifyResponseOkButtonDisabled = false;
        }

        // If reuse popup then unchecked unclassify option when select classification
        if (this.reuseUnclassifyItem !== undefined) {
            this.reuseUnclassifyItem.map((i: genericRadioButtonItems) => {
                i.isChecked = false;
            });
        }

        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * On clicking items in radio buton popup
     */
    private onReuseItemCheckedChange = (itemToBeUpdated: genericRadioButtonItems) => {
        this.reuseUnclassifyItem.map((i: genericRadioButtonItems) => {
            i.isChecked = i.id === itemToBeUpdated.id ? true : false;
        });

        // set the isChecked property of the not checked item to false
        this.items.map((i: genericRadioButtonItems) => {
            i.isChecked = false;
        });

        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Method called when reclassify popup open.
     * @param reclassifiedResponseDetails
     */
    private reclassifyPopupOpen = (reclassifiedResponseDetails: updateESMarkGroupMarkingModeData): void => {

        // Set the previous, current marking mode plus display id when we try to reclassify from worklist
        // or within response.
        this.previousMarkingMode = reclassifiedResponseDetails.previousMarkingModeId;
        this.currentMarkingMode = reclassifiedResponseDetails.markingModeId;
        this.displayId = reclassifiedResponseDetails.displayId;
    }

    /**
     * ReuseRIG action popup open 
     */
    private reuseRigActionPopupOpen = (displayId: string) => {
        this.reuseRIGSelectedDisplayId = displayId;
        this.populateRecassifyMultiOptionPopUpData();
        this.populateReuseUnclassifyPopupItem();

        let openedResponseDetails = standardisationSetupStore.instance.
            getReusableResponseDetails(this.reuseRIGSelectedDisplayId.toString());

        this.setState({
            popUpType: enums.PopUpType.ReuseRigAction
        });
    }

    /**
     * ReuseRIG action completed event
     */
    private reuseRigActionCompletedEvent = () => {
        this.reuseRIGSelectedDisplayId = undefined;

        this.populateRecassifyMultiOptionPopUpData();
        this.populateReuseUnclassifyPopupItem();
        this.setState({
            popUpType: enums.PopUpType.None,
            doShowReuseRigActionBusyIndicator: false
        });
    }

    /**
     * Method to open Reclassify error popup
     * whenever a fail in reclassify action.
     */
    private reclassifyErrorPopupOpen = () => {
        this.setState({
            popUpType: enums.PopUpType.ReclassifyError, doShowReclassifyResponseBusyIndicator: false
        });
    }

    /**
     * Method to get the reclassified response error popup content.
     */
    private getReclassifyErrorPopupContent() {
        let previousMarkingMode: string = (localeStore.instance.TranslateText
            ('standardisation-setup.standardisation-setup-worklist.classification-type.'
            + enums.MarkingMode[this.previousMarkingMode]));
        let currentMarkingMode: string = (localeStore.instance.TranslateText
            ('standardisation-setup.standardisation-setup-worklist.classification-type.'
            + enums.MarkingMode[this.currentMarkingMode]));

        return stringHelper.format(
            localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.reclassifyerror-popup.body'
            ),
            [this.displayId,
                previousMarkingMode,
                currentMarkingMode
            ]
        );
    }

    /**
     * Method to get the share response popup content.
     */
    private getShareResponsePopupContent() {
        let popUpContent: JSX.Element[] = [];
        popUpContent.push(<p>
            {localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.body')}
        </p>);
        popUpContent.push(<p className='dim-text padding-top-10'>
            <span>
                {localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.share-response-popup.response-id')}
                <span className='responseID'>{this._shareResponseDetails.displayId}</span>
            </span>,
            <span>
                {localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.share-response-popup.total-mark')}
                <span className='total-mark'>{this._shareResponseDetails.totalMarkValue}</span>
            </span>
        </p>);
        popUpContent.push(<p className='padding-top-10'>
            {localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.share-response-popup.confirmation-text')}
        </p>);
        return popUpContent;
    }

    /**
     * get Share Response Popup Content For PE
     */
    private get getShareResponsePopupContentForPE(): JSX.Element[] {
        let content: JSX.Element[] = [];

        content.push(
            <span>
                <p id='chose-message'>
                    {localeStore.instance.TranslateText
                        ('standardisation-setup.standardisation-setup-worklist.share-response-popup.chose-message')}
                </p>
                <p className='dim-text padding-top-10'>
                    <span>
                        {localeStore.instance.TranslateText
                            ('standardisation-setup.standardisation-setup-worklist.share-response-popup.response-id')}
                        <span className='responseID'>{this._shareResponseDetails.displayId}</span>
                    </span>,
                    <span>
                        {localeStore.instance.TranslateText(
                            'standardisation-setup.standardisation-setup-worklist.share-response-popup.total-mark')}
                        <span className='total-mark'>{this._shareResponseDetails.totalMarkValue}</span>
                    </span>
                </p>
                <div className='option-holder padding-top-10'>
                    <GenericPopupWithRadioButton
                        className='options'
                        id='popup-share-response-option-holder'
                        items={this.reuseUnclassifyItem}
                        selectedLanguage={this.props.selectedLanguage}
                        onCheckedChange={this.onReuseItemCheckedChange}
                        renderedOn={this.state.renderedOn}
                        liClassName={'padding-top-10'}
                        key='popup-reuse-unclassify-option'
                    />
                </div>
                <p id='share-note' className='padding-top-10 option-content'>{localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.share-response-popup.share-note')}</p>
                <p id='classify-now' className='padding-top-10'><label><span className='label-text'>{localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.share-response-popup.classify-now')}</span></label></p>
                <p id='annotation-note' className='padding-top-10'>{localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.share-response-popup.annotation-note')}</p>
                <div className='classify-options-holder padding-top-10 clearfix'>
                    <GenericPopupWithRadioButton
                        className='option-items'
                        id='popup-reclassify-multioption'
                        items={this.items}
                        selectedLanguage={this.props.selectedLanguage}
                        onCheckedChange={this.onCheckedChange}
                        renderedOn={this.state.renderedOn}
                        liClassName={'padding-top-10'}
                        key='popup-reuse-classify-option' />
                </div>
            </span>);
        return content;
    }

    /**
     * Populate radio button item for Share and Classify pop up for PE
     */
    private populateShareForPEclassifyPopupItem() {
        this.reuseUnclassifyItem = new Array<genericRadioButtonItems>();
        this.reuseUnclassifyItem.push(this.creatShareForPEGenericRadioButtonItem(enums.MarkingMode.PreStandardisation, 1));
    }

    /**
     * Create radio button for Share and Classify
     */
    private creatShareForPEGenericRadioButtonItem(inputid: number, sequenceNo: number): genericRadioButtonItems {
        let radioButtonForSharePE = new genericRadioButtonItems();
        radioButtonForSharePE.sequenceNo = sequenceNo;
        radioButtonForSharePE.id = inputid;
        radioButtonForSharePE.isChecked = radioButtonForSharePE.id === inputid ? true : false;
        radioButtonForSharePE.name = localeStore.instance.TranslateText(
            'standardisation-setup.standardisation-setup-worklist.share-response-popup.share-mark');
        radioButtonForSharePE.errorText = '';
        return radioButtonForSharePE;
    }

    /**
     * Method to hide Reclassify error popup on ok click.
     */
    private onReclassifyErrorMessageOkClick = () => {
        this.setState({
            popUpType: enums.PopUpType.None
        });
    }

    /**
     * Method to show the concurrent save fail popup
     * while updating the same response marking mode by different user.
     */
    private concurrentSaveFailPopup = (area: enums.PageContainers) => {
        this.concurrentSaveFailArea = area;
        this.setState({
            popUpType: enums.PopUpType.ConcurrentSaveFail,
            doShowReclassifyResponseBusyIndicator: false,
            doShowClassifyResponseBusyIndicator: false
        });
    }


    /**
     * Method to show the discard response fail popup while discarding the same response by different user.
     */
    private discardResponseFailPopup = () => {
        this.setState({
            popUpType: enums.PopUpType.DiscardResponseFail
        });
    }

    /**
     * Method to hide Concurrent Save Fail Popup on ok click.
     */
    private onConcurrentSaveFailPopupOkClick = () => {

        // get the worklist view type.
        let stdWorklistViewType: enums.STDWorklistViewType = userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_VIEW_OPTION)
            === 'false' ? enums.STDWorklistViewType.ViewMarksByQuestion : enums.STDWorklistViewType.ViewTotalMarks;

        if (this.concurrentSaveFailArea === enums.PageContainers.Response) {
            // when concurreny error occurs from response, navigate to ssu
            navigationHelper.loadStandardisationSetup();
        } else {
            if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                === enums.StandardisationSetup.ClassifiedResponse) {
                // Refresh the Classified worklist grid with latest changes.
                standardisationActionCreator.getClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                    loginSession.EXAMINER_ID, standardisationSetupStore.instance.markSchemeGroupId,
                    false, stdWorklistViewType);
            } else {
                // Refresh the UnClassified worklist grid with latest changes.
                standardisationActionCreator.getUnClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                    loginSession.EXAMINER_ID, standardisationSetupStore.instance.markSchemeGroupId,
                    false, stdWorklistViewType);
            }
        }

        // Reset concurrent Save Fail Area
        this.concurrentSaveFailArea = enums.PageContainers.None;

        this.setState({
            popUpType: enums.PopUpType.None
        });
    }

    /**
     * Method to hide discard response fail popup and navigate back to unclassified worklist with refreshed data.
     */
    private onDiscardResponseFailPopupOkClick = () => {

        // get the worklist view type.
        let stdWorklistViewType: enums.STDWorklistViewType = userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_VIEW_OPTION)
            === 'false' ? enums.STDWorklistViewType.ViewMarksByQuestion : enums.STDWorklistViewType.ViewTotalMarks;

        // Refresh the UnClassified worklist grid with latest data.
        standardisationActionCreator.getUnClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
            loginSession.EXAMINER_ID, standardisationSetupStore.instance.markSchemeGroupId,
            false, stdWorklistViewType);

        navigationHelper.loadStandardisationSetup();

        this.setState({
            popUpType: enums.PopUpType.None
        });
    }

	/**
	 * Populate recassify multioption popUp data
	 */
    private populateCreateMultiQIGProvisionalsPopUpData(provisionalQigdetails: Immutable.List<ProvisionalQIGDetailsReturn>) {
        this.multiQigCheckboxItems = new Array<genericCheckBoxItems>();
        provisionalQigdetails.map((item: ProvisionalQIGDetailsReturn) => {
            // Only show the QIGs which have MultiQIGProvisionalPermisson in the StandardisationSetupPermissions CC is ON
            let standardisationSetupCCData: standardisationSetupCCData = stdSetupPermissionHelper.generateSTDSetupPermissionData(
                item.stdSetupPermissionCCData, item.role);
            if (standardisationSetupCCData && standardisationSetupCCData.role.permissions.multiQIGProvisionals) {
                this.multiQigCheckboxItems.push(this.createGenericCheckBoxItem(item,
                    item.markSchemeGroupId === standardisationSetupStore.instance.markSchemeGroupId));
            }
        });
    }

	/**
	 * Create Generic Check Box Item
	 * @param provisionalQigDetail
	 */
    private createGenericCheckBoxItem(provisionalQigDetail: ProvisionalQIGDetailsReturn, ischecked: boolean): genericCheckBoxItems {
        let obj = new genericCheckBoxItems();
        obj.id = provisionalQigDetail.markSchemeGroupId;
        obj.isChecked = ischecked;
        obj.disabled = ischecked;
        obj.labelContent = provisionalQigDetail.markSchemeGroupName;
        obj.containerClassName = 'padding-top-10';
        obj.className = 'text-middle checkbox';
        obj.labelClassName = 'text-middle';
        return obj;
    }

	/**
	 * On clicking items in check box popup
	 * @param item
	 */
    private onChecked = (itemToBeUpdated: genericCheckBoxItems) => {
        //// set the isChecked property of the checked item to true
        this.multiQigCheckboxItems.map((item: genericCheckBoxItems) => {
            item.isChecked = item.id === itemToBeUpdated.id ? (item.isChecked ? false : true) : item.isChecked;
        });

        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * display note modified in background popup
     */
    protected displayNoteSaveFailedPopup(saveNoteErrorCode: enums.SaveNoteError) {
        if (saveNoteErrorCode === enums.SaveNoteError.TimeStampChanged) {
            this.messageDetails = {
                messageHeader: localeStore.instance.TranslateText(
                    'standardisation-setup.left-panel.note-save-error-popup-header'
                ),
                messageString: localeStore.instance.TranslateText(
                    'standardisation-setup.left-panel.note-timestamp-changed-popup-body'
                )
            };
            this.setState({ isNoteTimeStampChangedPopupVisible: true });
        } else if (saveNoteErrorCode === enums.SaveNoteError.MarkingModeChanged) {
            this.messageDetails = {
                messageHeader: localeStore.instance.TranslateText(
                    'standardisation-setup.left-panel.note-save-error-popup-header'
                ),
                messageString: localeStore.instance.TranslateText(
                    'standardisation-setup.left-panel.note-response-modified-popup-body'
                )
            };
            this.setState({ isResponseModifiedPopupVisibile: true });
        }
    }

    /**
     * Popup element for note timestamp changed popup.
     */
    private onNoteTimeStampChangedPopupClose = () => {
        this.setState({ isNoteTimeStampChangedPopupVisible: false });
    }

    /**
     * Popup element for response modified popup.
     */
    private onResponseModifiedPopupClose = () => {
        this.setState({ isResponseModifiedPopupVisibile: false });
        navigationHelper.loadStandardisationSetup();
    }

    /**
     *  Rerender classified worklist on declassify/reclassify scenario
     */
    private reRenderOnClassifiedResponseReceived() {
        // Fetch the STDWorklistViewType from user options
        let isStdTotalMarkView: boolean = userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_VIEW_OPTION)
            === 'false' ? false : true;
        let gridType: enums.STDWorklistViewType = isStdTotalMarkView ?
            enums.STDWorklistViewType.ViewTotalMarks : enums.STDWorklistViewType.ViewMarksByQuestion;

        // refresh the summary targets.
        let getStandardisationTargetDetails =
            standardisationActionCreator.getStandardisationTargetDetails(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);

        getStandardisationTargetDetails.
            then(() => {
                // refresh the classification grid once we reclassify/declassify a response.
                let getClassifiedResponseDetails =
                    standardisationActionCreator.getClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                        loginSession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        false, gridType);
                getClassifiedResponseDetails.
                    then(() => {
                        this.setState({ doShowReclassifyResponseBusyIndicator: false });
                    });
            });
    }

    /**
     * Sets the visibility of UnClassified response unavailable popup.
     */
    private unClassifiedScriptinStmUnavailable = () => {
        this.setState({
            unClassifiedScriptinStmUnavailableVisible: true
        });
    }

    /**
     * Ok click action, on UnClassified unavailable popup.
     */
    private okClickOnUnavailablePopUp = () => {
        this.setState({
            unClassifiedScriptinStmUnavailableVisible: false
        });

        navigationHelper.loadStandardisationSetup();
    }

    /**
     * save Marks And Annotations With Non Recoverable Error
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param markGroupId
     * @param queueOperation
     */
    private saveMarksAndAnnotationsWithNonRecoverableError(
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        markGroupId: number, queueOperation: enums.MarksAndAnnotationsQueueOperation) {
        // Calling the helper method to update the marks and annotations queue
        marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(
            markGroupId,
            queueOperation
        );

        // If the queue is processed completely, have to hide the save marks and annotations busy indicator
        if (marksAndAnnotationsSaveHelper.isQueueProcessedCompletely) {
            if (
                marksAndAnnotationsSaveHelper.markGroupItemsWithNonRecoverableErrors
                    .length > 0
            ) {
                //When there are errors in saving marks and annotations we have to hide the busy indicator
                busyIndicatorActionCreator.setBusyIndicatorInvoker(
                    enums.BusyIndicatorInvoker.none
                );
                // set appropriate error dialog contents
                this.saveMarksAndAnnotationsErrorDialogContents = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(
                    true
                );

                if (this.state.doShowSavingMarksAndAnnotationsIndicator) {
                    //logic for displaying error popup.
                    this.setState({
                        doShowSavingMarksAndAnnotationsIndicator: false,
                        isNonRecoverableErrorPopupVisible: true
                    });
                }
            } else {
                this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(
                    saveMarksAndAnnotationTriggeringPoint,
                    markGroupId
                );
            }

            // Last Invoked Trigger point is stored in marking Store. Reset the variable after 'ALL Completed Save'
            if (marksAndAnnotationsSaveHelper.count === 0) {
                responseActionCreator.triggerSavingMarksAndAnnotations(
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None
                );
            }

            // hide the saving marks and annotations busy indicator
            if (this.state.doShowSavingMarksAndAnnotationsIndicator) {
                this.setState({
                    doShowSavingMarksAndAnnotationsIndicator: false
                });
            }
        }
    }

    /**
     *  Rerender rig not found pop up.
     */
    private showOrHideRigNotFoundPopup = (showOrHideRigNotFound: boolean): void => {
        this.setState({ showRigNotFoundPopUp: showOrHideRigNotFound });
    }

    /**
     *  Rerender Rig not found popup
     */
    private onRigNotFoundOkClick = () => {
        this.setState({ showRigNotFoundPopUp: false });
    }

    /**
     *  Display confirmation dialog to share the response.
     */
    private shareResponsePopupOpen = (shareResponseDetails: StandardisationResponseDetails, isSharedFromMarkScheme: boolean): void => {
        // Set flag to display shareResponse Popup Or not.
        this._shareResponseDetails = shareResponseDetails;
        this._isSharedFromMarkScheme = isSharedFromMarkScheme;
        this._showShareLoadingIndicator = true;

        this.populateRecassifyMultiOptionPopUpData();
        this.populateShareForPEclassifyPopupItem();

        if (standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.classify) {
            this._showShareLoadingIndicatorForPE = true;
            this.setState(
                {
                    isShareResponsePopupDisplayingForPE: true,
                    isBusy: false
                }
            );
        } else {
            this.setState(
                {
                    isShareResponsePopupDisplaying: true,
                    isBusy: false
                }
            );
        }
    }

    /**
     *  Close Share Response dialog after clicking Cancel.
     */
    private shareResponsePopupClose = (): void => {
        // Set flag to display shareResponse Popup Or not.
        this._showShareLoadingIndicator = false;
        this.setState(
            {
                isShareResponsePopupDisplaying: false,
                isShareResponsePopupDisplayingForPE: false
            }
        );
    }

    /**
     * share Provisional Response
     */
    private shareResponse = (): void => {
        this.setState(
            {
                isShareResponsePopupDisplaying: false,
                isShareResponsePopupDisplayingForPE: false,
                isBusy: true
            }
        );

        let markingMode: number;

        // Fetch markSchemeGroupId
        let markSchemeGroupId = standardisationSetupStore.instance.markSchemeGroupId;

        if (this.IsShareAndClassifyOptionNeeded) {
            markingMode = this.items.filter(i => i.isChecked === true)[0].id;
        } else {
            markingMode = this._shareResponseDetails.markingModeId;
        }

        /**
         * mapping values on submit argument
         */
        this._shareResponseArgument = {
            markGroupIds: [this._shareResponseDetails.esMarkGroupId],
            markingMode: markingMode,
            examinerRoleId: standardisationSetupStore.instance.examinerRoleId,
            markSchemeGroupId: standardisationSetupStore.instance.markSchemeGroupId,
            examinerApproval: examinerStore.instance.getMarkerInformation.approvalStatus,
            isAdminRemarker: false
        };

        if (this.IsShareAndClassifyOptionNeeded){
            if (this._isSharedFromMarkScheme){
            //invoke save and navigate Provisional Response
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.shareAndClassify);
            } else {
                submitActionCreator.shareAndClassifyResponse
                (this._shareResponseArgument,
                this._isSharedFromMarkScheme,
                this._shareResponseDetails.displayId);
            }
        } else {
            if (this._isSharedFromMarkScheme) {
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
            } else {
                submitActionCreator.submitResponse(
                    this._shareResponseArgument,
                    standardisationSetupStore.instance.markSchemeGroupId,
                    enums.WorklistType.none,
                    enums.RemarkRequestType.Unknown,
                    this._isSharedFromMarkScheme,
                    this._shareResponseDetails.displayId);
            }
        }
    }

    /**
     * Return IsShareAndClassifyOptionNeeded value
     */
    private get IsShareAndClassifyOptionNeeded(): boolean {
        return standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.classify &&
            this.reuseUnclassifyItem.filter(i => i.isChecked === true)[0] === undefined;
    }

    /**
     * Returns the currentSaveFailPopUp content.
     */
    private get classifyOrReclassifySaveFailPopUpContent(): string {

        return this.isUnclassifiedWorklistSelected ?
            stringHelper.format(
                localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.concurrent-esmarkingmode-save-fail-popup.body-with-response-id'
                ), [this.displayId]) :
            localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.concurrent-esmarkingmode-save-fail-popup.body');
    }

    /**
     * Returns isCommonProvisionalStandardisationCcOn.
     */
    private isCommonProvisionalStandardisationCcOn(): boolean {

        return configurableCharacteristicHelper.getCharacteristicValue(
            configurableCharacteristicNames.CommonProvisionalStandardisation,
            standardisationSetupStore.instance.markSchemeGroupId).toLowerCase() === 'true';
    }

    /**
     * submitResponseFromMarkscheme will be called when the response is ready to navigate
     */
    private submitResponseFromMarkscheme = (): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.shareAndClassify) {
            submitHelper.saveAndShareAndClassifyResponse(
                this._shareResponseArgument,
                this._isSharedFromMarkScheme,
                this._shareResponseDetails.displayId);
        }
    };

    /**
     * Returns the discard response fail popup content with displayId.
     */
    private get discardResponseFailPopUpContent(): string {

        return stringHelper.format(
            localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.response-already-discarded-popup.body-with-response-id'
            ), [responseStore.instance.selectedDisplayId.toString()]);
    }
}

export = Footer;