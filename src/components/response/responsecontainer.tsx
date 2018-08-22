/** Add new dependencies in loadDependenciesAndAddEventListeners() method unless your dependencies are not using in constructor */
import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import responseHelper = require('../utility/responsehelper/responsehelper');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import scriptStore = require('../../stores/script/scriptstore');
import Immutable = require('immutable');
import enums = require('../utility/enums');
import loginSession = require('../../app/loginsession');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import qigStore = require('../../stores/qigselector/qigstore');
import timerHelper = require('../../utility/generic/timerhelper');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import zoomPanelActionCreator = require('../../actions/zoompanel/zoompanelactioncreator');
import navigationHelper = require('../utility/navigation/navigationhelper');
import saveMarksAndAnnotationsNonRecoverableErrorDialogContents
= require('../utility/savemarksandannotations/savemarksandannotationsnonrecoverableerrordialogcontents');
declare let config: any;
import marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
import worklistStore = require('../../stores/worklist/workliststore');
import exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
import popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
let classNames = require('classnames');
import constants = require('../utility/constants');
import messageArgument = require('../../dataservices/messaging/messageargument');
import $ = require('jquery');
import acceptQualityFeedbackActionCreator = require('../../actions/response/acceptqualityfeedbackactioncreator');
import annotationHelper = require('../utility/annotation/annotationhelper');
import treeViewDataHelper = require('../../utility/treeviewhelpers/treeviewdatahelper');
import onPageCommentHelper = require('../utility/annotation/onpagecommenthelper');
import ccHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import pageLinkHelper = require('./responsescreen/linktopage/pagelinkhelper');
import annotation = require('../../stores/response/typings/annotation');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import responseStore = require('../../stores/response/responsestore');
import markinghelper = require('../../utility/markscheme/markinghelper');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import htmlutilities = require('../../utility/generic/htmlutilities');
import warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
import warningMessageNavigationHelper = require('../../utility/teammanagement/helpers/warningmessagenavigationhelper');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import loggerConstants = require('../utility/loggerhelperconstants');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import enhancedOffPageCommentActionCreator = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import responseContainerPopupHelper = require('../utility/responsehelper/responsecontainerpopuphelper');
import domManager = require('../../utility/generic/domhelper');
import exceptionsStore = require('../../stores/exception/exceptionstore');
import imageZoneStore = require('../../stores/imagezones/imagezonestore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import scriptHelper = require('../../utility/script/scripthelper');
import toolbarActionCreator = require('../../actions/toolbar/toolbaractioncreator');
import copyPreviousMarksAndAnnotationsHelper = require('../utility/annotation/copypreviousmarksandannotationshelper');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
import htmlviewerhelper = require('../utility/responsehelper/htmlviewerhelper');
import standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import awardingStore = require('../../stores/awarding/awardingstore');
import awardingHelper = require('../utility/awarding/awardinghelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import returnToMarkerArguments = require('../../dataservices/teammanagement/typings/returntomarkerarguments');
import markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');

/* Add new dependencies in loadDependenciesAndAddEventListeners() method unless your dependencies are not using in constructor */

/* tslint:disable:variable-name */
let localeStore;
let worklistActionCreator;
let userInfoStore;
let markingStore;
let markSchemeStructureStore;
let Message;
let htmlUtilities;
let messageStore;
let keyDownHelper;
let messagingActionCreator;
let markingHelper;
let popupHelper;
let Exception;
let exceptionStore;
let stampStore;
let responseSearchHelper;
let messageHelper;
let exceptionHelper;
let operationModeHelper;
let userInfoActionCreator;
let qigSelectorActionCreator;
let stringFormatHelper;
let loggingHelper;
let responseScreenAuditHelper;
let urls;
let enhancedOffPageCommentStore;
let standardisationActionCreator;

/* tslint:disable:no-empty-interfaces */

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase { }

/* tslint:disable:no-empty-interfaces */

/* tslint:enable:variable-name */

interface State {
    modulesLoaded?: boolean;
    imagesLoaded?: boolean;
    selectedViewMode?: enums.ResponseViewMode;
    renderedOn?: number;
    isConfirmationPopupDisplaying?: boolean;
    isBusy?: boolean;
    ismarkEntryPopupVisible?: boolean;
    isNonRecoverableErrorPopupVisible?: boolean;
    fullResponseViewOption?: enums.FullResponeViewOption;
    isResetMarkPopupVisible?: boolean;
    isAllPageNotAnnotatedVisible?: boolean;
    isCompleteButtonDialogVisible?: boolean;
    isMbQConfirmationDialogDispalying?: boolean;
    isDeleteCommentPopupVisible?: boolean;
    refreshImageContainer?: number;
    isDeleteMessagePopupVisible?: boolean;
    isSaveIndicatorVisible?: boolean;
    isDisplayingMarkChangeReasonNeededError?: boolean;
    isExceptionPanelVisible?: boolean;
    isAcceptQualityConfirmationPopupDisplaying?: boolean;
    isCommentsSideViewEnabled?: boolean;
    isLinkToPagePopupShowing?: boolean;
    linkToPageButtonLeft?: number;
    isLinkToPageErrorShowing?: boolean;
    isImagesLoaded?: boolean;
    isUnManagedSLAOPopupVisible?: boolean;
    isUnManagedImageZonePopUpVisible?: boolean;
    showUnmanagedSLAOFlagAsSeenPopUp?: boolean;
    isAllSLAOManagedConfirmationPopupVisible?: boolean;
    isAllUnknownContentManagedConfirmationPopupVisible?: boolean;
    isRejectRigPopUpVisible?: boolean;
    isConfirmReviewOfSLAOPopupShowing?: boolean;
    isConfirmReviewOfMangedSLAOPopupShowing?: boolean;
    isCombinedWarningMessagePopupVisible?: boolean;
    isResponseReviewFailedPopupVisible?: boolean;
    renderedOnECourseWorkFiles?: number;
    scriptLoaded?: boolean;
    isEnhancedOffPageCommentPopUpVisible?: boolean;
    hasMultipleToolbarColumns?: boolean;
    crmFeedConfirmationPopupVisible?: boolean;
    hasElementsToRenderInFRV?: boolean;
    renderedOnEnhancedOffpageComments: number;
    isZoningExceptionWarningPopupVisible: boolean;
    isPlayerLoaded?: boolean;
    showUnKnownContentFlagAsSeenPopUp?: boolean;
    doShowExceptionWarningPopUp: boolean;
    isMarkingOverlayVisible: number;
    isConfirmReviewOfUnknownContentPopupShowing?: boolean;
    isWholeResponseRemarkConfirmationPopupVisible?: boolean;
    isUnManagedImageZoneInRemarkPopUpVisible?: boolean;
    isMessageSendErrorPopupVisible?: boolean;
    sessionClosedErrorPopupVisible?: boolean;
    isPromoteToSeedButtonClicked: boolean;
    isStandardisationAdditionalPagePopUpVisible?: boolean;
    isScriptUnavailablePopUpVisible: boolean;
    isDiscardStandardisationPopupVisible: boolean;
    isReturnResponseToMarkerPopUpVisible?: boolean;
    returnResponseResult?: enums.ReturnToMarkerResult;
}

/**
 * Properties for save indicator component
 * @param {Props} props
 */
interface SavingIndicatorProps {
    style: string;
}

/* tslint:disable:variable-name */
const SaveIndicator = (props: SavingIndicatorProps) => (
    <div id='saveIndicator' className={props.style}>
        {localeStore.instance.TranslateText('marking.response.save-indicator.saving-marks')}
    </div>
);
/* tslint:enable:variable-name */

/**
 * React component class for Response
 */
class ResponseContainer extends pureRenderComponent<Props, State> {
    protected responseContainerProperty: any;
    protected responseContainerHelper: any;
    protected popupHelper: responseContainerPopupHelper;
    private autoSaveTimeInterval: number = 0;
    private isNetworkError = true;
    private isUnknownContentMangedFromFRV: boolean = false;
    private isStdsetupAdditionalpageSeen: boolean = false;
    public doUnMount: boolean = false;
    protected direction: enums.ResponseNavigation;

    /* Please DO NOT add any private variables here - Add corresponding property in the response container property base
        or its child and use the same instead of private variable**/

    /**
     * Constructor for the Response component
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
    }

    /**
     * setting  the initail state and other variables
     */
    protected initialize() {
        /** Getting the user option, if saved in the DB */
        if (
            !isNaN(
                parseInt(
                    userOptionsHelper.getUserOptionByName(userOptionKeys.FULL_RESPONSE_VIEW_OPTION)
                )
            )
        ) {
            this.responseContainerProperty.fullResponseOptionValue = parseInt(
                userOptionsHelper.getUserOptionByName(userOptionKeys.FULL_RESPONSE_VIEW_OPTION)
            );
        }
        // Set the default states
        this.state = {
            modulesLoaded: false,
            imagesLoaded: false,
            isBusy: applicationStore.instance.isOnline,
            isConfirmationPopupDisplaying: false,
            ismarkEntryPopupVisible: false,
            isNonRecoverableErrorPopupVisible: false,
            fullResponseViewOption: this.responseContainerProperty.fullResponseOptionValue,
            isResetMarkPopupVisible: false,
            isAllPageNotAnnotatedVisible: false,
            isCompleteButtonDialogVisible: false,
            isMbQConfirmationDialogDispalying: false,
            refreshImageContainer: 0,
            isSaveIndicatorVisible: false,
            isDisplayingMarkChangeReasonNeededError: false,
            isExceptionPanelVisible: false,
            isCommentsSideViewEnabled:
                userOptionsHelper.getUserOptionByName(userOptionKeys.COMMENTS_SIDE_VIEW) === 'true' &&
                    !markerOperationModeFactory.operationMode.isAwardingMode
                    ? true
                    : false,
            renderedOn: Date.now(),
            isLinkToPagePopupShowing: null,
            linkToPageButtonLeft: 0,
            isLinkToPageErrorShowing: false,
            isImagesLoaded: false,
            isUnManagedSLAOPopupVisible: false,
            isUnManagedImageZonePopUpVisible: false,
            showUnmanagedSLAOFlagAsSeenPopUp: false,
            isAllSLAOManagedConfirmationPopupVisible: false,
            isAllUnknownContentManagedConfirmationPopupVisible: false,
            isRejectRigPopUpVisible: false,
            isConfirmReviewOfSLAOPopupShowing: false,
            isCombinedWarningMessagePopupVisible: false,
            isConfirmReviewOfMangedSLAOPopupShowing: false,
            renderedOnECourseWorkFiles: Date.now(),
            scriptLoaded: false,
            isEnhancedOffPageCommentPopUpVisible: false,
            crmFeedConfirmationPopupVisible: false,
            hasMultipleToolbarColumns: false,
            hasElementsToRenderInFRV: false,
            isZoningExceptionWarningPopupVisible: false,
            renderedOnEnhancedOffpageComments: Date.now(),
            doShowExceptionWarningPopUp: true,
            isMarkingOverlayVisible: Date.now(),
            isConfirmReviewOfUnknownContentPopupShowing: false,
            isUnManagedImageZoneInRemarkPopUpVisible: false,
            isWholeResponseRemarkConfirmationPopupVisible: false,
            isPromoteToSeedButtonClicked: false,
            isStandardisationAdditionalPagePopUpVisible: false,
            isScriptUnavailablePopUpVisible: false,
            isDiscardStandardisationPopupVisible: false,
            isReturnResponseToMarkerPopUpVisible: false,
            returnResponseResult: enums.ReturnToMarkerResult.None
        };
        this.popupHelper = new responseContainerPopupHelper(
            this.responseContainerProperty,
            this.state.renderedOn,
            this.props.selectedLanguage,
            this.state.selectedViewMode
        );
        this.responseContainerProperty.markSchemeRenderedOn = Date.now();
        this.onResetMarkYesButtonClick = this.onResetMarkYesButtonClick.bind(this);
        this.onResetMarkNoButtonClick = this.onResetMarkNoButtonClick.bind(this);
        this.responseClosed = this.responseClosed.bind(this);

        // Re-render the mark buttons
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.responseContainerProperty.linkAnnotations = Immutable.Map<number, annotation>();
        this.responseContainerProperty.linkAnnotationsToRemove = [];
        this.responseContainerProperty.itemsWhichCantUnlink = [];
        this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked = false;
        // additional object will exist only in structured component
        this.responseContainerProperty.isSLAOManaged =
            responseStore.instance.markingMethod === enums.MarkingMethod.Structured ? false : true;
        // Unknown content exist only in ebookmarking
        this.responseContainerProperty.isUnknownContentManaged = markerOperationModeFactory.operationMode.isAwardingMode ? true :
            responseHelper.isEbookMarking
                ? false
                : true;
        this.getMessagePanelRightPosition = this.getMessagePanelRightPosition.bind(this);
        this.addTransitionEventListeners = this.addTransitionEventListeners.bind(this);
        this.onCommentConfirmationYesButtonClicked = this.onCommentConfirmationYesButtonClicked.bind(
            this
        );
        this.onCommentConfirmationNoButtonClicked = this.onCommentConfirmationNoButtonClicked.bind(
            this
        );
        this.onOkClickOfManageSLAOMessage = this.onOkClickOfManageSLAOMessage.bind(this);
        this.onOkClickOfManageUnknownContentMessage = this.onOkClickOfManageUnknownContentMessage.bind(
            this
        );
        this.handlePromoteToSeedErrors = this.handlePromoteToSeedErrors.bind(this);
        this.imageLoaded = this.imageLoaded.bind(this);
        this.hasElementsToRenderInFRViewMode = this.hasElementsToRenderInFRViewMode.bind(this);
        this.questionChanged = this.questionChanged.bind(this);
        this.onYesClickAllSLAOsManagedConfirmationPopup = this.onYesClickAllSLAOsManagedConfirmationPopup.bind(
            this
        );
        this.onNoClickAllSLAOsManagedConfirmationPopup = this.onNoClickAllSLAOsManagedConfirmationPopup.bind(
            this
        );
        this.onCreateNewExceptionClicked = this.onCreateNewExceptionClicked.bind(this);
        this.onLinkToPageOkClick = this.onLinkToPageOkClick.bind(this);
        this.onLinkToPageCancelClick = this.onLinkToPageCancelClick.bind(this);
        this.onLinkToPageButtonClick = this.onLinkToPageButtonClick.bind(this);
        this.addLinkAnnotation = this.addLinkAnnotation.bind(this);
        this.removeLinkAnnotation = this.removeLinkAnnotation.bind(this);
        this.onMarkThisPageCallback = this.onMarkThisPageCallback.bind(this);
        this.onOkClickOfNonRecoverableErrorMessage = this.onOkClickOfNonRecoverableErrorMessage.bind(
            this
        );
        this.onOkClickRemarkCreationSuccessPopup = this.onOkClickRemarkCreationSuccessPopup.bind(
            this
        );
        this.onYesButtonClick = this.onYesButtonClick.bind(this);
        this.onNoButtonClick = this.onNoButtonClick.bind(this);
        this.onOkClickOfResponseReviewFailedMessage = this.onOkClickOfResponseReviewFailedMessage.bind(
            this
        );
        this.onOnlineStatusChanged = this.onOnlineStatusChanged.bind(this);
        this.onYesClickAllUnknownContentManagedConfirmationPopup = this.onYesClickAllUnknownContentManagedConfirmationPopup.bind(
            this
        );
        this.onNoClickAllUnknownContentManagedConfirmationPopup = this.onNoClickAllUnknownContentManagedConfirmationPopup.bind(
            this
        );
        this.onOkClickOfManageUnknownContentMessageInRemark = this.onOkClickOfManageUnknownContentMessageInRemark.bind(
            this
        );
        this.onMessageSendingErroPopupClose = this.onMessageSendingErroPopupClose.bind(this);
        this.onYesClickOfReturnResponseToMarkerConfirmation = this.onYesClickOfReturnResponseToMarkerConfirmation.bind(this);
        this.onNoClickOfReturnResponseToMarkerConfirmation = this.onNoClickOfReturnResponseToMarkerConfirmation.bind(this);
        this.onReturnResponseFailurePopUpOkClick = this.onReturnResponseFailurePopUpOkClick.bind(this);
    }

    /**
     * to set the initial values after authorization
     */
    protected setInitialValuesAfterAuthorize() {
        this.responseContainerProperty.treeViewHelper = new treeViewDataHelper();
        this.responseContainerProperty.markHelper = new markSchemeHelper();
        // This will reset the current scroll position and currently visible image
        responseActionCreator.resetScrollData();

        // Setting the busy indicator properties
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
        // If bundle already downloaded, // Copy the favorites stamps.
        if (responseSearchHelper !== undefined) {
            responseSearchHelper.loadFavoriteStampForSelectedQig();
        }

        this.responseContainerProperty.promoteToSeedErrorPopupData = {
            id: '',
            key: '',
            header: '',
            popupContent: ''
        };
    }

    /**
     * refs
     */
    public refs: {
        [key: string]: Element;
        markSheetContainer: HTMLInputElement;
    };

    /**
     * the mark schem, tool bar panel and the markbutton componets
     */
    protected getMarkschemeAndToolbarComponents(): JSX.Element[] {
        let markSchemePanel: JSX.Element;
        let markButtonContainer: JSX.Element;

        // Checking whether marks and markschemes are loaded for showing markscheme.
        if (
            this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()
        ) {
            markSchemePanel = this.responseContainerHelper.markschemePanel(
                this.onEnhancedOffPageActionButtonsClicked,
                this.onValidateMarkEntry,
                this.onResetMarkConfirm,
                this.showMbQConfirmation,
                this.checkIfAllPagesAreAnnotated,
                this.showCompleteButtonDialog,
                this.onMarkSchemeStructureLoaded,
                this.showAcceptQualityConfirmationDialog,
                this.invokeReviewBusyIndicator,
                this.state.ismarkEntryPopupVisible,
                this.state.imagesLoaded,
                this.state.isPlayerLoaded,
                this.responseContainerProperty.isPreviousMarksAndAnnotationCopied
            );

            // Check isMarkbyAnnotation CC is enabled or not.
            this.responseContainerProperty.isMarkbyAnnotation = responseHelper.isMarkByAnnotation(
                responseHelper.currentAtypicalStatus
            );

            markButtonContainer = this.responseContainerHelper.markButtonsContainer();
        }
        return [markSchemePanel, markButtonContainer];
    }

    /**
     * the other common elements for render both digital and non digital containers
     */
    protected commonElements(): JSX.Element[] {
        let elements: JSX.Element[] = [];

        elements.push(this.getMessagePanel());
        elements.push(
            this.responseContainerHelper.markentryValidation(
                this.state.ismarkEntryPopupVisible,
                this.onValidationMarkUpSucessMessage
            )
        );
        elements.push(
            this.popupHelper.remarkSuccessMessage(this.onOkClickRemarkCreationSuccessPopup)
        );
        elements.push(
            this.popupHelper.resetMarkMessage(
                this.onResetMarkYesButtonClick,
                this.onResetMarkNoButtonClick
            )
        );
        elements.push(
            this.popupHelper.mbCConfirmationDialog(
                this.state.isMbQConfirmationDialogDispalying,
                this.onYesButtonClick,
                this.onNoButtonClick
            )
        );
        elements.push(
            this.popupHelper.combinedWarningPopupMessage(
                this.state.isCombinedWarningMessagePopupVisible,
                this.onCombinedWarningPopupPrimaryButtonClick,
                this.onCombinedWarningPopupSecondaryButtonClick
            )
        );
        elements.push(
            this.popupHelper.deleteCommentMessage(
                this.state.isDeleteCommentPopupVisible,
                this.onYesButtonDeleteCommentClick,
                this.onNoButtonDeleteCommentClick
            )
        );
        elements.push(
            this.popupHelper.completeButtonDialog(
                this.state.isCompleteButtonDialogVisible,
                this.onYesClickOnCompleteDialog,
                this.onNoClickOnCompleteDialog
            )
        );
        elements.push(
            this.popupHelper.nonRecoverableErrorMessage(
                this.onOkClickOfNonRecoverableErrorMessage,
                this.state.isNonRecoverableErrorPopupVisible
            )
        );
        elements.push(
            this.popupHelper.getMarkChangeReasonWarning(
                this.state.isDisplayingMarkChangeReasonNeededError,
                markingStore.instance.currentResponseMode,
                this.onStayInResponseClick,
                this.onLeaveResponseClick
            )
        );
        elements.push(
            this.popupHelper.acceptQualityConfirmation(
                this.state.isAcceptQualityConfirmationPopupDisplaying,
                this.onAcceptQualityYesButtonClick,
                this.onAcceptQualityNoButtonClick
            )
        );
        elements.push(
            this.popupHelper.promoteToSeedConfirmationMessage(
                this.onOkClickPromoteToSeedConfirmationPopup,
                this.onNoClickPromoteToSeedConfirmationPopup
            )
        );
        elements.push(
            this.popupHelper.promoteToReuseBucketConfirmationMessage(
                this.onYesClickPromoteToReuseBucketConfirmationPopup,
                this.onNoClickPromoteToReuseBucketConfirmationPopup
            )
        );
        elements.push(
            this.popupHelper.promoteToSeedErrorMessage(this.onOkClickPromoteToSeedErrorPopup)
        );
        elements.push(
            this.popupHelper.manageSLAOMessage(
                this.onOkClickOfManageSLAOMessage,
                this.state.isUnManagedSLAOPopupVisible
            )
        );
        elements.push(
            this.popupHelper.unKnownContentDialog(
                this.onOkClickOfManageUnknownContentMessage,
                this.state.isUnManagedImageZonePopUpVisible
            )
        );
        elements.push(
            this.popupHelper.responseRevieweFailedMessage(
                this.state.isResponseReviewFailedPopupVisible,
                this.onOkClickOfResponseReviewFailedMessage
            )
        );
        elements.push(
            this.popupHelper.flagAsSeenPopUp(
                this.unManagedSLAOFlagAsSeenPopUpOKButtonClick,
                this.unManagedSLAOFlagAsSeenPopUpCancelButtonClick,
                this.state.showUnmanagedSLAOFlagAsSeenPopUp
            )
        );
        elements.push(
            this.popupHelper.allSLAOsManagedMessage(
                this.onYesClickAllSLAOsManagedConfirmationPopup,
                this.onNoClickAllSLAOsManagedConfirmationPopup,
                this.state.isAllSLAOManagedConfirmationPopupVisible
            )
        );
        elements.push(
            this.popupHelper.allUnmanagedContentManagedMessage(
                this.onYesClickAllUnknownContentManagedConfirmationPopup,
                this.onNoClickAllUnknownContentManagedConfirmationPopup,
                this.state.isAllUnknownContentManagedConfirmationPopupVisible
            )
        );
        elements.push(
            this.popupHelper.reviewOfMangedSLAOMessage(
                this.state.isConfirmReviewOfMangedSLAOPopupShowing,
                this.onConfirmReviewOfMangedSLAOPopupOkButtonClick
            )
        );
        elements.push(
            this.popupHelper.rejectRigPopUp(
                this.onRejectRigOkButtonClick,
                this.onRejectRigCancelButtonClick,
                this.state.isRejectRigPopUpVisible
            )
        );
        elements.push(
            this.popupHelper.deleteEnhancedOffPageCommentMessage(
                this.state.isEnhancedOffPageCommentPopUpVisible,
                this.onCommentConfirmationYesButtonClicked,
                this.onCommentConfirmationNoButtonClicked
            )
        );
        elements.push(
            this.popupHelper.crmFeedConfirmationMessage(this.onConfirmCRMFeedPopupOkButtonClick)
        );
        elements.push(
            this.popupHelper.creatExceptionReturnWithdrwnResponseErrorPopup(
                this.onConfirmationWithdrwnResponsePopupClick
            )
        );
        elements.push(
            this.popupHelper.withdrwnResponseErrorPopup(this.onWithdrwnResponseErrorPopup)
        );
        elements.push(
            this.popupHelper.sessionClosedErrorPopup(
                this.state.sessionClosedErrorPopupVisible,
                this.onSessionClosedErrorPopup
            )
        );
        elements.push(
            this.popupHelper.flagAsSeenForEBookmarkingPopUp(
                this.unKnownContentFlagAsSeenPopUpOKButtonClick,
                this.unKnownContentFlagAsSeenPopUpCancelButtonClick,
                this.state.showUnKnownContentFlagAsSeenPopUp
            )
        );
        elements.push(
            this.popupHelper.zoningExceptionWarning(
                this.state.isZoningExceptionWarningPopupVisible,
                this.closeZoningExceptionWarningPopup
            )
        );
        elements.push(
            this.popupHelper.unKnownContentPopupInRemark(
                this.onOkClickOfManageUnknownContentMessageInRemark,
                this.state.isUnManagedImageZoneInRemarkPopUpVisible
            )
        );
        elements.push(
            this.popupHelper.messageSendErrorPopup(
                this.state.isMessageSendErrorPopupVisible,
                this.onMessageSendingErroPopupClose
            )
        );
        elements.push(
            this.popupHelper.withdrawScriptInStmErrorPopup(
                this.onConfirmationWithdrwnScriptInStmPopupClick
            )
        );
        elements.push(this.popupHelper.standardisationAdditionalPageMessage(
            this.onStandardisationAdditionalPagePopupOkButtonClick,
            this.state.isStandardisationAdditionalPagePopUpVisible));

        elements.push(this.popupHelper.scriptUnavaliablePopUp(
            this.okClickOnUnavailablePopUp,
            this.state.isScriptUnavailablePopUpVisible,
            responseStore.instance.selectedDisplayId.toString()));

        elements.push(
            this.popupHelper.returnResponseConfirmationPopUp(
                this.onYesClickOfReturnResponseToMarkerConfirmation,
                this.onNoClickOfReturnResponseToMarkerConfirmation,
                this.state.isReturnResponseToMarkerPopUpVisible,
                responseStore.instance.selectedDisplayId.toString()
            )
        );

        elements.push(
            this.popupHelper.returnResponseFailurePopUp(
                (this.state.returnResponseResult !== enums.ReturnToMarkerResult.None &&
                    this.state.returnResponseResult !== enums.ReturnToMarkerResult.Success),
                this.state.returnResponseResult,
                this.onReturnResponseFailurePopUpOkClick
            )
        );

        return elements;
    }

    /**
     * the popup components for both digital and non digital.
     */
    protected getPopupComponents(): JSX.Element[] {
        let elements: JSX.Element[] = [];

        elements.push(
            this.popupHelper.linkToPagePopup(
                pageLinkHelper.doShowLinkToQuestion,
                this.onLinkToPageCancelClick,
                this.onLinkToPageOkClick,
                this.state.isLinkToPagePopupShowing,
                this.state.linkToPageButtonLeft,
                this.addLinkAnnotation,
                this.removeLinkAnnotation
            )
        );

        elements.push(
            this.popupHelper.linkToPageErrorDialog(
                pageLinkHelper.doShowLinkToQuestion,
                this.onLinkToPageErrorDialogOkClick,
                this.state.isLinkToPageErrorShowing
            )
        );

        elements.push(
            this.popupHelper.isConfirmReviewOfSLAOPopup(
                this.onConfirmReviewOfSLAOPopupOkButtonClick,
                this.onConfirmReviewOfSLAOPopupCancelButtonClick,
                this.state.isConfirmReviewOfSLAOPopupShowing
            )
        );

        elements.push(
            this.popupHelper.isConfirmReviewOfUnknownContentPopup(
                this.onConfirmReviewOfUnknownContentPopupOkButtonClick,
                this.onConfirmReviewOfUnknownContentPopupCancelButtonClick,
                this.state.isConfirmReviewOfUnknownContentPopupShowing
            )
        );

        elements.push(
            this.popupHelper.wholeResponseRemarkConfirmationPopup(
                this.onWholeResponseRemarkConfirmationYesClick,
                this.onWholeResponseRemarkConfirmationNoClick,
                this.state.isWholeResponseRemarkConfirmationPopupVisible
            )
        );
        let message = '';
        if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse) {
            message = 'standardisation-setup.standardisation-setup-worklist.discard-response-popup.unclassified-body';
        } else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
            === enums.StandardisationSetup.ClassifiedResponse) {
            message = 'standardisation-setup.standardisation-setup-worklist.discard-response-popup.classified-body';
        } else {
            message = 'standardisation-setup.standardisation-setup-worklist.discard-response-popup.provisional-body';
        }
        let discardResponsePopUpContent: JSX.Element[] = [];
        discardResponsePopUpContent.push(<p className='popup-content'>
            <span>
                {localeStore.instance.TranslateText(message)}
                {localeStore.instance.
                    TranslateText('standardisation-setup.standardisation-setup-worklist.discard-response-popup.confirmation-text')}
            </span>
        </p>
        );

        elements.push(
            this.popupHelper.discardStandardisationResponsePopup(
                this.onDiscardStandardardisationResponsePopupOkClick,
                this.onDiscardStandardisationResponsePopupNoClicked,
                this.state.isDiscardStandardisationPopupVisible,
                discardResponsePopUpContent
            )
        );

        return elements;
    }

    /**
     * Footer and MessageException components
     */
    protected getMessageExceptionComponents(): JSX.Element[] {
        let elements: JSX.Element[] = [];

        elements.push(
            this.popupHelper.deleteMessage(
                this.state.isDeleteMessagePopupVisible,
                this.onYesButtonDeleteMessageClick,
                this.onNoButtonDeleteMessageClick
            )
        );
        elements.push(this.popupHelper.actionExceptionPopup());

        return elements;
    }

    /**
     * Save indicator component
     */
    protected saveIndicator(): JSX.Element {
        let saveIndicatorStyle: string = classNames('saving-response', {
            show: this.state.isSaveIndicatorVisible
        });
        return <SaveIndicator style={saveIndicatorStyle} />;
    }

    /**
     * Message on click handler function
     */
    protected messageOnClickHandler(event: any) {
        stampActionCreator.showOrHideComment(false);
    }

    /**
     * This method will validate whether or not the Exception Panel is edited
     */
    protected validateException = (isValid?: boolean): void => {
        this.responseContainerProperty.isExceptionPanelEdited = !isValid;
    };

    /**
     * This method will display messaging panel
     */
    protected onMessageButtonClick = (): void => {
        // Hide annotation toolbar on opening the message panel.
        this.responseContainerProperty.isToolBarPanelVisible = false;
        // activating the keydown helper in case exception deactivated previously.
        keyDownHelper.instance.resetMarkEntryDeactivators();
        // deactivating the keydown helper on message section open.
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        this.responseContainerProperty.isMessagePanelVisible = true;
        this.responseContainerProperty.isMessagePanelMinimized = false;
        this.responseContainerProperty.isExceptionPanelEdited = false;
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        this.setState({
            renderedOn: Date.now(),
            isExceptionPanelVisible: false
        });
    };

    /**
     * Will display mbc confirmation dialog
     */
    protected showMbQConfirmation = (): void => {
        if (markerOperationModeFactory.operationMode.showMbQConfirmation) {
            this.setState({
                isMbQConfirmationDialogDispalying: true,
                renderedOn: Date.now()
            });
            this.responseContainerProperty.doNavigateResponse =
                this.responseContainerProperty.markHelper.isLastResponseLastQuestion &&
                responseHelper.isMbQSelected;
        }
    };

    /**
     * Will display Delete Comment confirmation dialog
     */
    protected showDeleteCommentPopUp = (): void => {
        // display dialog box
        this.setState({ isDeleteCommentPopupVisible: true });
    };

    /**
     * Delete comment confirmation dialog Yes click
     */
    protected onYesButtonDeleteCommentClick = () => {
        // this will hide the comment box
        stampActionCreator.showOrHideComment(false);
        // deleting comment
        stampActionCreator.deleteComment(true);
        // hiding confirmation dialog
        this.setState({ isDeleteCommentPopupVisible: false });
    };

    /**
     * Delete comment confirmation dialog No click
     */
    protected onNoButtonDeleteCommentClick = () => {
        // this will display the comment box and set focus on it
        stampActionCreator.showOrHideComment(true);
        // hiding confirmation dialog
        this.setState({ isDeleteCommentPopupVisible: false });
    };

    /**
     * Mbc confirmation dialog Yes click
     */
    protected onYesButtonClick = () => {
        this.setState({ isMbQConfirmationDialogDispalying: false });
        this.responseContainerHelper.navigationOnMbqConfirmationYesButtonClick();
    };

    /**
     * Mbc confirmation dialog No click
     */
    protected onNoButtonClick = () => {
        this.setState({ isMbQConfirmationDialogDispalying: false });
        /** to set the selection back to mark entry text box */
        markingActionCreator.setMarkEntrySelected();
    };

    /**
     * switch on/off mark validation popup
     * @param {number} minMark
     * @param {number} maxMark
     */
    protected onValidateMarkEntry = (
        minMark: number,
        maxMark: number,
        isNonNumeric: boolean = false
    ): void => {
        this.responseContainerProperty.minimumNumericMark = minMark;
        this.responseContainerProperty.maximumNumericMark = maxMark;
        this.responseContainerProperty.isNonNumeric = isNonNumeric;
        this.setState({ ismarkEntryPopupVisible: true });
    };

    /**
     * set on all images loaded completely
     */
    protected onAllImagesLoaded = (): void => {
        this.setState({ isImagesLoaded: true });
    };

    /**
     * Load image
     * @param doUpdateAngleOfResponse
     */
    protected loadScriptImages = (doUpdateAngleOfResponse: boolean = true) => {
        let allimageURLs: string[] = this.responseContainerHelper.setImagesToLoad(
            doUpdateAngleOfResponse
        );
        // Get the images for rendering.
        this.loadImages(allimageURLs);
    };

    /**
     * load the modules required for Response
     */
    protected addCommonEventListners() {
        if (this.state == null) {
            return;
        }

        this.loadDependenciesAndAddEventListeners();
        if (!this.state.modulesLoaded) {
            this.props.setOfflineContainer(true);
        }
    }

    /**
     * adds transition change event listeners
     */
    protected addTransitionEventListeners(): void {
        this.responseContainerProperty.messagingPanel = document
            .getElementsByClassName('messaging-panel')
            .item(0);
        if (
            this.responseContainerProperty.messagingPanel &&
            this.responseContainerProperty.messagePanelTransitionListenerActive === false
        ) {
            this.responseContainerProperty.messagingPanel.addEventListener(
                'transitionend',
                this.onAnimationEnd
            );
            this.responseContainerProperty.messagePanelTransitionListenerActive = true;
        }
    }

    /**
     * Event on animation end
     * @param event
     */
    protected onAnimationEnd = (event: Event): void => {
        // If any child element has triggered the transion-end ignore it
        let element: any = event.srcElement || event.target;
        if (element.id !== 'messaging-panel') {
            return;
        }
        if (this.state.isCommentsSideViewEnabled === true) {
            stampActionCreator.renderSideViewComments();
        }
    };

    /**
     * Hook all event listeners here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    protected addEventListeners() {
        responseStore.instance.addListener(
            responseStore.ResponseStore.RESPONSE_CHANGED,
            this.responseChanged
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.RETRIEVE_MARKS_EVENT,
            this.marksRetrieved
        );
        this.checkIfMarkSchemeAndMarksAreLoaded();
        markingStore.instance.addListener(
            markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.questionChanged
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.NOTIFY_MARK_UPDATED,
            this.notifyMarkUpdated
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT,
            this.onCloseMessagePanel
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_OPEN_EVENT,
            this.onMessageButtonClick
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.DELETE_COMMENT_POPUP,
            this.showDeleteCommentPopUp
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT,
            this.onMinimizeMessagePanel
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT,
            this.onMaximizeMessagePanel
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT,
            this.onCustomZoomUpdated
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.ANNOTATION_ADDED,
            this.onAnnotationAdded
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT,
            this.onResponseZoomUpdated
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED,
            this.onMessageDetailsReceived
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT,
            this.onMessageReadStatusRequireUpdation
        );

        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW,
            this.onMinimizeExceptionPanel
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW,
            this.onMaximizeExceptionPanel
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.RESPONSE_MESSAGE,
            this.onMessagesReceived
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_DELETE_CLICK_EVENT,
            this.showDeleteMessagePopUp
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_DELETE_EVENT,
            this.onMessageDeleted
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT,
            this.onSaveAndNavigateInitiated
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS,
            this.onSaveMarksAndAnnotationsTriggered
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.EXCEPTION_NAVIGATE_EVENT,
            this.onNavigateAwayFromResponse
        );
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('orientationchange', this.onChangeDeviceOrientation);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        markingStore.instance.addListener(
            markingStore.MarkingStore.PANEL_WIDTH,
            this.onPanelResize
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.FRACS_DATA_LOADED,
            this.onFracsDataLoaded
        );
        stampStore.instance.addListener(
            stampStore.StampStore.STAMPS_LOADED_EVENT,
            responseSearchHelper.loadFavoriteStampForSelectedQig
        );
        stampStore.instance.addListener(
            stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT,
            this.toggleCommentsSideView
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.REMOVE_ANNOTATION,
            this.removeAnnotation
        );

        worklistStore.instance.addListener(
            worklistStore.WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION,
            this.showMbQConfirmation
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.RESPONSE_CLOSED,
            this.responseClosed
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.SUPERVISOR_REMARK_SUCCESS,
            this.showRemarkCreationSuccessPopup
        );
        responseSearchHelper.addResponseSearchEvents();
        responseStore.instance.addListener(
            responseStore.ResponseStore.RESPONSE_OPENED,
            this.responseChanged
        );
        userInfoStore.instance.addListener(
            userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT,
            this.showLogoutConfirmation
        );
        warningMessageStore.instance.addListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
            this.setResponseAsReviewedFailureReceived
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.GET_EXCEPTIONS,
            this.getExceptionData
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.onSupervisorRemarkSubmitOrPromoteToSeed
        );

        markingStore.instance.addListener(
            markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.handleMarksAndAnnotationsVisibility
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT,
            this.onPromoteToSeed
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.REJECT_RIG_COMPLETED_EVENT,
            this.handleNavigationOnRejectResponse
        );

        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW,
            this.onExceptionPanelClose
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT,
            this.onPromoteToSeedCheckRemark
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED,
            this.onUpdateExceptionStatusReceived
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT,
            this.showCombinedPopupMessage
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT,
            this.resetWarningFlagsOnResponseReject
        );
        warningMessageStore.instance.addListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT,
            warningMessageNavigationHelper.handleWarningMessageNavigation
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.onFullresponseViewStayInResponseClick
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.RESPONSE_REVIEWED,
            this.setResponseAsReviewed
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED,
            this.onPreviousMarksAnnotationCopied
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED,
            this.structuredFracsDataLoaded
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.MESSAGE_CLOSE_EVENT,
            this.closeResponseMessageDetails
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
            this.examinerValidated
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
            this.handleEnhancedOffPageCommentsVisibility
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT,
            this.clearCommentDetailsOnResponseChanged
        );
        responseStore.instance.addListener(
            responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT,
            this.onPromoteToReuseCompleted
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.UPDATE_PANEL_WIDTH,
            this.onUpdatepreviousMarkSelection
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA,
            this.renderedOnEnhancedOffpageComments
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE,
            this.renderedOnEnhancedOffpageComments
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH,
            this.showEnhancedOffPageCommentDiscardPopup
        );
        applicationStore.instance.addListener(
            applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT,
            this.onOnlineStatusChanged
        );
        imageZoneStore.instance.addListener(
            imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT,
            this.onEbookMarkingZonesLoaded
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.WITHDRAWN_RESPONSE_EVENT,
            this.withdrawnResponse
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARKINGMODE_CHANGED_IN_PROVISIONAL_RESPONSE_EVENT,
            this.unClassifiedScriptinStmUnavailable
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT,
            this.sessionClosedForMarker
        );
        stampStore.instance.addListener(
            stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT,
            this.renderedOnEnhancedOffpageComments
        );
        exceptionsStore.instance.addListener(
            exceptionStore.ExceptionStore.VIEW_EXCEPTION_WINDOW,
            this.onExceptionInViewMode
        );
        messageStore.instance.addListener(
            messageStore.MessageStore.SEND_MESSAGE_ERROR_EVENT,
            this.showMessageSendErrorPopup
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT,
            this.showScriptUnavailablePopUp
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT,
            this.reRender
        );
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT,
            this.onDiscardActionCompleted
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.COPY_MARKS_FOR_DEFINITIVE_EVENT,
            this.reRender
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.RETURNED_RESPONSE_TO_WORKLIST_EVENT,
            this.onResponseReturned
        );
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.RETURN_RESPONSE_TO_MARKER_BUTTON_CLCIKED,
            this.returnResponseToMarkerButtonClicked);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
            this.fetchCandidateScriptMetaData
        );
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public removeCommonEventListners() {
        if (this.state == null || !this.state.modulesLoaded) {
            return;
        }

        if (this.props.isOnline) {
            // response is getting closed, inform modules.
            worklistActionCreator.responseClosed(true);
            teamManagementActionCreator.resetSelectedException(true);
        }

        responseStore.instance.removeListener(
            responseStore.ResponseStore.RESPONSE_CHANGED,
            this.responseChanged
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.RETRIEVE_MARKS_EVENT,
            this.marksRetrieved
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.questionChanged
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.NOTIFY_MARK_UPDATED,
            this.notifyMarkUpdated
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT,
            this.onCloseMessagePanel
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_OPEN_EVENT,
            this.onMessageButtonClick
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.DELETE_COMMENT_POPUP,
            this.showDeleteCommentPopUp
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT,
            this.onMinimizeMessagePanel
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT,
            this.onMaximizeMessagePanel
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT,
            this.onCustomZoomUpdated
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.ANNOTATION_ADDED,
            this.onAnnotationAdded
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT,
            this.onResponseZoomUpdated
        );
        // clear Interval while moving out from response container
        timerHelper.clearInterval(this.autoSaveTimeInterval);

        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED,
            this.onMessageDetailsReceived
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT,
            this.onMessageReadStatusRequireUpdation
        );

        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW,
            this.onMinimizeExceptionPanel
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW,
            this.onMaximizeExceptionPanel
        );

        messageStore.instance.removeListener(
            messageStore.MessageStore.RESPONSE_MESSAGE,
            this.onMessagesReceived
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_DELETE_CLICK_EVENT,
            this.showDeleteMessagePopUp
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_DELETE_EVENT,
            this.onMessageDeleted
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS,
            this.onSaveMarksAndAnnotationsTriggered
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT,
            this.onSaveAndNavigateInitiated
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.EXCEPTION_NAVIGATE_EVENT,
            this.onNavigateAwayFromResponse
        );
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('orientationchange', this.onChangeDeviceOrientation);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mouseup', this.onMouseUp);
        responseStore.instance.removeListener(
            responseStore.ResponseStore.FRACS_DATA_LOADED,
            this.onFracsDataLoaded
        );
        stampStore.instance.removeListener(
            stampStore.StampStore.STAMPS_LOADED_EVENT,
            responseSearchHelper.loadFavoriteStampForSelectedQig
        );
        stampStore.instance.removeListener(
            stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT,
            this.toggleCommentsSideView
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.PANEL_WIDTH,
            this.onPanelResize
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.REMOVE_ANNOTATION,
            this.removeAnnotation
        );

        this.responseContainerProperty.imagesToRender = null;
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION,
            this.showMbQConfirmation
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.RESPONSE_CLOSED,
            this.responseClosed
        );
        if (this.responseContainerProperty.messagingPanel) {
            this.responseContainerProperty.messagingPanel.removeEventListener(
                'transitionend',
                this.onAnimationEnd
            );
        }
        responseStore.instance.removeListener(
            responseStore.ResponseStore.SUPERVISOR_REMARK_SUCCESS,
            this.showRemarkCreationSuccessPopup
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.RESPONSE_OPENED,
            this.responseChanged
        );
        responseSearchHelper.removeResponseSearchEvents();
        userInfoStore.instance.removeListener(
            userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT,
            this.showLogoutConfirmation
        );
        warningMessageStore.instance.removeListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT,
            this.setResponseAsReviewedFailureReceived
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.GET_EXCEPTIONS,
            this.getExceptionData
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.onSupervisorRemarkSubmitOrPromoteToSeed
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.handleMarksAndAnnotationsVisibility
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT,
            this.onPromoteToSeed
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.REJECT_RIG_COMPLETED_EVENT,
            this.handleNavigationOnRejectResponse
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW,
            this.onExceptionPanelClose
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT,
            this.onPromoteToSeedCheckRemark
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED,
            this.onUpdateExceptionStatusReceived
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT,
            this.showCombinedPopupMessage
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT,
            this.resetWarningFlagsOnResponseReject
        );
        warningMessageStore.instance.removeListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT,
            warningMessageNavigationHelper.handleWarningMessageNavigation
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.onFullresponseViewStayInResponseClick
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.RESPONSE_REVIEWED,
            this.setResponseAsReviewed
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED,
            this.onPreviousMarksAnnotationCopied
        );
        responseStore.instance.removeListener(
            responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED,
            this.structuredFracsDataLoaded
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.MESSAGE_CLOSE_EVENT,
            this.closeResponseMessageDetails
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
            this.examinerValidated
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
            this.handleEnhancedOffPageCommentsVisibility
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT,
            this.clearCommentDetailsOnResponseChanged
        );
        // resetting ui dropdown panel values.
        this.resetUIDropdownStatus();
        // activate keydown helper incase if the mouseup event was not triggered
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Annotation);
        responseStore.instance.removeListener(
            responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT,
            this.onPromoteToReuseCompleted
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.UPDATE_PANEL_WIDTH,
            this.onUpdatepreviousMarkSelection
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA,
            this.renderedOnEnhancedOffpageComments
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE,
            this.renderedOnEnhancedOffpageComments
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH,
            this.showEnhancedOffPageCommentDiscardPopup
        );
        applicationStore.instance.removeListener(
            applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT,
            this.onOnlineStatusChanged
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.WITHDRAWN_RESPONSE_EVENT,
            this.withdrawnResponse
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT,
            this.sessionClosedForMarker
        );
        imageZoneStore.instance.removeListener(
            imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT,
            this.onEbookMarkingZonesLoaded
        );
        stampStore.instance.removeListener(
            stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT,
            this.renderedOnEnhancedOffpageComments
        );
        exceptionsStore.instance.removeListener(
            exceptionStore.ExceptionStore.VIEW_EXCEPTION_WINDOW,
            this.onExceptionInViewMode
        );
        messageStore.instance.removeListener(
            messageStore.MessageStore.SEND_MESSAGE_ERROR_EVENT,
            this.showMessageSendErrorPopup
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT,
            this.showScriptUnavailablePopUp
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT,
            this.reRender
        );
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT,
            this.onDiscardActionCompleted
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.COPY_MARKS_FOR_DEFINITIVE_EVENT,
            this.reRender
        );

        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARKINGMODE_CHANGED_IN_PROVISIONAL_RESPONSE_EVENT,
            this.unClassifiedScriptinStmUnavailable
        );

        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.RETURNED_RESPONSE_TO_WORKLIST_EVENT,
            this.onResponseReturned
        );
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.RETURN_RESPONSE_TO_MARKER_BUTTON_CLCIKED,
            this.returnResponseToMarkerButtonClicked);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
            this.fetchCandidateScriptMetaData
        );

        scriptStore.instance.removeListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved);
        // This will reset the meta tag for android.
        htmlUtilities.updateMetaTagForAndroid(false);
    }

    /**
     * invoked on Mark as definitive button click on unclassified response.
     */
    private reRender = (copymarksasdef: boolean): void => {
        if (copymarksasdef) {
            copyPreviousMarksAndAnnotationsHelper.copyMarksAndAnnotationForUnClassified
                (markingStore.instance.currentMarkGroupId, true);
            this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = true;
            this.responseContainerProperty.isPreviousMarksAndAnnotationCopying = false;
		}
		if (!copymarksasdef) {
			 //If the current marker choose the clear option from Mark as Definitive Popup, 
			 //then delete the provisional marks if the current marker is same as Provisional Marker.
			copyPreviousMarksAndAnnotationsHelper.deleteProvisionalMarksIfSameExaminer();
			let selectedViewMode: enums.ResponseViewMode = responseHelper.hasAdditionalObject ?
				enums.ResponseViewMode.fullResponseView : enums.ResponseViewMode.zoneView;
			this.responseContainerProperty.isSLAOManaged = false;
			this.responseContainerProperty.markSchemeRenderedOn = Date.now();
			this.setState({
				renderedOn: Date.now(),
				selectedViewMode: selectedViewMode,
				isUnManagedSLAOPopupVisible: this.isUnManagedSLAOPopUpVisible(selectedViewMode)
			});
		}
    }

    /**
     * ReuseRIG action completed event
     */
    protected reuseRigActionCompletedEvent = () => {
        navigationHelper.loadStandardisationSetup();
    }

    /**
     * invoked when the response is closed
     */
    protected responseClosed = (): void => {
        this.responseContainerProperty.doShowResposeLoadingDialog = true;
        // reset current question item bindex when response is closed
        this.responseContainerProperty.currentQuestionItemBIndex = -1;
    };

    /**
     * invoked when the message is discarded while click mark now in supervisor remark tab
     */
    protected onSupervisorRemarkSubmitOrPromoteToSeed = (): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toSupervisorRemark) {
            this.confirmSupervisorRemarkCreation(true);
        } else if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toPromoteToSeed) {
            if (markingStore.instance.currentResponseMarkingProgress === 100) {
                this.responseContainerHelper.showPromoteToSeedConfirmationPopup();
            } else {
                // if current responses marking progress is not 100% then display the promote to seed declined message.
                this.handlePromoteToSeedErrors(enums.PromoteToSeedErrorCode.NotFullyMarked);
            }
        }
    };

    /**
     * This method is used to fetch exception data
     */
    protected getExceptionData = () => {
        this.responseContainerProperty.exceptionData = exceptionStore.instance.getExceptionData;
    };

    /**
     * invoked in window resize
     */
    protected onWindowResize = () => {
        this.responseContainerProperty.responseContainerHeight = Reactdom.findDOMNode(
            this
        ).clientHeight;
        this.getMessagePanelRightPosition();
    };

    /**
     * This method will update the meta tag for Android, for handling fit height issue
     * while virtual keyboard is open
     */
    protected onChangeDeviceOrientation = () => {
        /* Set the response container height */
        this.responseContainerProperty.responseContainerHeight = Reactdom.findDOMNode(
            this
        ).clientHeight;
        stampActionCreator.showOrHideComment(false);
        // Close Bookmark Name Entry Box
        stampActionCreator.showOrHideBookmarkNameBox(false);
        htmlUtilities.updateMetaTagForAndroid(true);

        this.getMessagePanelRightPosition();
    };

    /**
     * This method will close OnPageComment while mouse wheel click
     */
    protected onMouseDown = (e: any) => {
        // closing the comment while mouse wheel click
        if (e.which === 2) {
            let isCommentBoxOpen =
                stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
            if (isCommentBoxOpen) {
                stampActionCreator.showOrHideComment(false);
            }
            let isBookmarkBoxOpen = markingStore.instance.selectedBookmarkClientToken !== undefined;
            if (isBookmarkBoxOpen) {
                // Close Bookmark Name Entry Box
                stampActionCreator.showOrHideBookmarkNameBox(false);
            }
        }
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Annotation);
    };

    /*
     * mouseup event for response container
     */
    protected onMouseUp = (e: any) => {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Annotation);
    };

    /**
     * Navigate away from current response.
     */
    protected onNavigateAwayFromResponse = (navigateTo: enums.SaveAndNavigate) => {
        if (!this.responseContainerProperty.doNavigateResponse) {
            this.responseContainerProperty.navigateTo = navigateTo;
        }
        if (this.responseContainerProperty.isExceptionPanelEdited) {
            exceptionActionCreator.exceptionWindowAction(
                enums.ExceptionViewAction.Maximize,
                undefined,
                undefined,
                undefined,
                enums.ResponseNavigation.markScheme
            );
            popUpDisplayActionCreator.popUpDisplay(
                enums.PopUpType.DiscardExceptionNavigateAway,
                enums.PopUpActionType.Show,
                enums.SaveAndNavigate.none,
                {
                    popupContent: localeStore.instance.TranslateText(
                        'marking.response.discard-exception-dialog.body-navigate-away'
                    )
                }
            );
        } else {
            this.responseContainerProperty.isMessagePanelVisible = false;
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            if (navigateTo !== enums.SaveAndNavigate.toLogout) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
            }

            if (
                this.responseContainerProperty.navigateTo !== undefined &&
                this.responseContainerProperty.navigateTo !== enums.SaveAndNavigate.none
            ) {
                popupHelper.navigateAway(this.responseContainerProperty.navigateTo);
                this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
            }

            if (navigateTo !== enums.SaveAndNavigate.toLogout) {
                this.setState({
                    isExceptionPanelVisible: false
                });
            }
        }
    };

    /**
     * selected question changed
     */
    protected questionChanged = (bIndex: number): void => {
        // following condition is checked to prevent the responsecontainer getting refreshed every time, while
        // we resizing the panel. we don't need to fire this event if the currentQuestionItemBindex is same a bIndex
        // as we will only need to fire this event once when the selected question item change.
        if (
            markingStore.instance.getResizedPanelClassName() ||
            this.responseContainerProperty.currentQuestionItemBIndex === bIndex
        ) {
            // resetting flag on navigate to same qestion from FRV, to avoid reloading on next question item change fo reBookMarking
            this.isUnknownContentMangedFromFRV = false;
            return;
        }

        if (responseHelper.hasUnManagedSLAOInMarkingMode || this.responseContainerHelper.hasUnManagedImageZone() === true ||
            (responseHelper.hasAdditionalPageInStdSetUpSelectResponses && !this.isStdsetupAdditionalpageSeen)) {
            this.changeResponseViewMode();
            return;
        }

        this.responseContainerProperty.currentQuestionItemBIndex = bIndex;
        this.responseContainerProperty.responseContainerHeight = Reactdom.findDOMNode(
            this
        ).clientHeight;
        // to re-render the mark buttons on next question
        this.responseContainerProperty.markButtonRenderedOn = Date.now();

        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured || responseHelper.isEbookMarking) {
            if (markingStore.instance.currentlyLinkedZonePageNumber > 0) {
                markingStore.instance.resetLinkedZonePageNumber();
            }
        }

        if (
            (((markingStore.instance.currentQuestionItemImageClusterId > 0 &&
                markingHelper.isImageClusterChanged()) ||
                /*For an ebook marking response with unmanaged contents, after managing from FRV and navigate to response screen.
              In this scenarion we cannot able to navigate again from FRV.
              So below condition added to load script images to fix the issue.  */
                (responseHelper.isEbookMarking &&
                    this.responseContainerProperty.isUnknownContentManaged &&
                    this.isUnknownContentMangedFromFRV)) &&
                !responseHelper.isAtypicalResponse()) ||
            markingHelper.hasDifferentLinkedPages() ||
            (!this.responseContainerHelper.isECourseworkComponent() &&
                (responseHelper.isEbookMarking && markingHelper.hasQuestionTagIdChanged()))
        ) {
            this.responseContainerProperty.scriptHelper.setMarkSchemeID(
                markingStore.instance.currentQuestionItemInfo.uniqueId
            );
            this.responseContainerProperty.scriptHelper.setImageClusterID(
                markingStore.instance.currentQuestionItemImageClusterId
            );
            this.loadScriptImages();
            // Setting the busy indicator properties
            this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
            this.setState({
                imagesLoaded: false,
                isBusy: true,
                renderedOn: Date.now(),
                selectedViewMode:
                    this.responseContainerHelper.hasUnManagedImageZone() ||
                        this.canChangeToFRVonRemarkUnknownContent()
                        ? enums.ResponseViewMode.fullResponseView
                        : enums.ResponseViewMode.zoneView
            });
            // Reset the flag.
            this.isUnknownContentMangedFromFRV = false;
        } else {
            // we need to activate the markentry deactivator as this is deactivated from the markscheme navigation
            // and only activating after the image is loaded.
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
            /* setting state in order to render available marks for the selected item
            *  even though there are no images to display
            */

            if (markingStore.instance.previousAnswerItemId !== markingStore.instance.currentQuestionItemInfo.answerItemId) {
                this.doUnMount = true;
            }
            this.setState({
                renderedOn: Date.now(),
                selectedViewMode: this.responseContainerHelper.hasUnManagedImageZone()
                    ? enums.ResponseViewMode.fullResponseView
                    : enums.ResponseViewMode.zoneView
            });

            // ToDo we need to revert this fix and check
            // is this issue exisist or not when the react new version comes
            // fix for the annotation rendering issue in favarate panel for the IE11 for the whole response
            let that = this;
            if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari' && this.doUnMount) {
                setTimeout(() => {
                    that.doUnMount = false;
                    that.setState({
                        renderedOn: Date.now()
                    });
                }, 100);
            }
        }

        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            onPageCommentHelper.resetSideViewCollections();
        }

        // hide the busy indicator while navigating inside the markscheme
        this.responseContainerProperty.doShowResposeLoadingDialog = false;

        // This will reset the current scroll position and currently visible image
        responseActionCreator.resetScrollData();
    };

    /**
     * Method which sets the busy indicator properties
     * @param busyIndicatorInvoker
     * @param showBackgroundScreenOnBusy
     */
    protected setBusyIndicatorProperties(
        busyIndicatorInvoker: enums.BusyIndicatorInvoker,
        showBackgroundScreenOnBusy: boolean
    ) {
        this.responseContainerProperty.busyIndicatorInvoker = busyIndicatorInvoker;
        this.responseContainerProperty.showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    }

    /**
     * This will open the response item
     */
    protected responseChanged = (): void => {
        this.setBackgroundSaveTimeInterval();
        this.isStdsetupAdditionalpageSeen = false;
        this.responseContainerProperty.renderedImageViewerCount = 0;
        this.responseContainerProperty.markSchemeRenderedOn = Date.now();
        // Rerender the mark buttons on next response loaded
        this.responseContainerProperty.markButtonRenderedOn = Date.now();

        // This will reset the current scroll position and currently visible image
        responseActionCreator.resetScrollData();

        // Setting the busy indicator properties
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
        this.responseContainerHelper.openResponse(this.loadScriptImages);
        // Display Warning Popup when navigating to Response having an open zoning exception
        this.displayZoningExceptionWarningPopup();
        this.loadMessageFortheResponse();
        // Marks need to be reloaded on response change
        this.checkIfMarkSchemeAndMarksAreLoaded();
        this.responseContainerProperty.selectedMsg = undefined;

        this.setState({
            imagesLoaded: false,
            isBusy: true,
            renderedOn: Date.now(),
            isExceptionPanelVisible: false,
            isPromoteToSeedButtonClicked: false
        });

        messagingActionCreator.messageAction(enums.MessageViewAction.Close);

        this.responseContainerHelper.resetVariablesOnResponseChanged();

        // hasUnManagedSLAOInMarkingMode was getting  incorrect behavior since the examinerMarksAgainstResponse undefined.
        // so changing ResponseViewMode  only when markscheme loaded && hasUnManagedSLAOInMarkingMode became true.
        if (
            (responseHelper.hasUnManagedSLAOInMarkingMode ||
                this.responseContainerHelper.hasUnManagedImageZone() === true ||
                this.canChangeToFRVonRemarkUnknownContent()) &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()
        ) {
            this.changeResponseViewMode();
        }
    };

    /**
     * Load the images.
     * If the script url is directly access the server. It will give Authorisation errror [Since the header does not contains security data]
     * So in order to avoid this issue, access the image using the Security (ie, data access class). Hence url will be cached.
     * After the all success calls, render the images.
     * @param imagesToRender
     */
    protected loadImages(allimageURLS: string[]) {
        // assigning imageurls length to the protected variable which is
        // used for setting scroll position on paritally supressed page
        if (this.responseContainerHelper.doExcludeSuppressedPage) {
            // for e-coursework component we are not including the suppressed page so we
            // can directly assign the variable 'this.imagesToRender' which holds non-suppressed images
            this.responseContainerProperty.totalImagesWithOutSuppression = this.responseContainerHelper.returnImageToRenderLength(
                this.responseContainerProperty.imagesToRender
            );
        } else {
            this.responseContainerProperty.totalImagesWithOutSuppression
                = this.responseContainerProperty.scriptHelper.getPagesCountExcludingSuppressed();
        }

        // Call All images for the data.
        let imagePromises: Promise<any>[] = scriptActionCreator.getImages(allimageURLS);
        let that = this;
        // If all calls are done, render the method.
        Promise.all(imagePromises)
            .then(() => {
                this.setState({
                    modulesLoaded: this.state.modulesLoaded,
                    imagesLoaded: true
                });

                // #40995 : set the mark entry box as selected after all the images has been loaded.
                // only allow the text change of the markentry box after images are loaded completely.
                // # 58935 this needs to be implemented for unstructured component also.
                markingActionCreator.setMarkEntrySelected(false);

                this.checkIfMarkSchemeAndMarksAreLoaded();
            })
            .catch(() => {
                // navigationHelper.navigateBack();
            });
    }

    /**
     *  This will load the dependencies dynamically during component mount.
     */
    protected loadDependenciesAndAddEventListeners() {
        this.isNetworkError = true;
        let ensurePromise: any = require.ensure(
            [
                '../../stores/locale/localestore',
                '../../actions/worklist/worklistactioncreator',
                '../../stores/userinfo/userinfostore',
                '../../stores/marking/markingstore',
                '../../stores/markschemestructure/markschemestructurestore',
                '../message/message',
                '../../utility/generic/htmlutilities',
                '../../stores/message/messagestore',
                '../../utility/generic/keydownhelper',
                '../../actions/messaging/messagingactioncreator',
                '../../utility/markscheme/markinghelper',
                '../utility/popup/popuphelper',
                '../exception/exception',
                '../../stores/exception/exceptionstore',
                '../../stores/stamp/stampstore',
                '../../utility/responsesearch/responsesearchhelper',
                '../utility/message/messagehelper',
                '../utility/exception/exceptionhelper',
                '../utility/userdetails/userinfo/operationmodehelper',
                '../../actions/userinfo/userinfoactioncreator',
                '../../actions/qigselector/qigselectoractioncreator',
                '../../utility/stringformat/stringformathelper',
                '../utility/marking/markingauditlogginghelper',
                '../utility/responsehelper/responsescreenauditlogginghelper',
                '../../dataservices/base/urls',
                '../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore',
                '../../actions/standardisationsetup/standardisationactioncreator'
            ],
            function () {
                localeStore = require('../../stores/locale/localestore');
                worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
                userInfoStore = require('../../stores/userinfo/userinfostore');
                markingStore = require('../../stores/marking/markingstore');
                markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
                Message = require('../message/message');
                Exception = require('../exception/exception');
                htmlUtilities = require('../../utility/generic/htmlutilities');
                messageStore = require('../../stores/message/messagestore');
                keyDownHelper = require('../../utility/generic/keydownhelper');
                messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
                markingHelper = require('../../utility/markscheme/markinghelper');
                exceptionHelper = require('../utility/exception/exceptionhelper');
                popupHelper = require('../utility/popup/popuphelper');
                exceptionStore = require('../../stores/exception/exceptionstore');
                stampStore = require('../../stores/stamp/stampstore');
                responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
                messageHelper = require('../utility/message/messagehelper');
                operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
                userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
                qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
                stringFormatHelper = require('../../utility/stringformat/stringformathelper');
                loggingHelper = require('../utility/marking/markingauditlogginghelper');
                responseScreenAuditHelper = require('../utility/responsehelper/responsescreenauditlogginghelper');
                urls = require('../../dataservices/base/urls');
                enhancedOffPageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
                standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');

                // modules has been loaded so setting the variable as false;
                this.isNetworkError = false;

                this.loadMessageFortheResponse();

                // Copy the favourites stamps.
                responseSearchHelper.loadFavoriteStampForSelectedQig();

                // hook all event listeners.
                this.addEventListeners();

                //to identify mobile device and identification class to body
                if (htmlUtilities.isTabletOrMobileDevice) {
                    htmlUtilities.addClassToBody('touch-device');
                }

                if (htmlUtilities.isAndroidDevice) {
                    // find the window size for android
                    htmlUtilities.findWindowSize();
                    // This will update the meta tag for android
                    // we have added this for handling fit height issue in android devices while on-screen keyboard is active
                    htmlUtilities.updateMetaTagForAndroid(true);
                }

                // Check whether to show Annotation toolbar panel if Message//Exception window open inside Response View.
                // This will happen only after loading the message store.
                this.responseContainerProperty.isToolBarPanelVisible = !(
                    messageStore.instance.responseOpenTriggerPoint ===
                    enums.TriggerPoint.WorkListResponseMessageIcon ||
                    messageStore.instance.responseOpenTriggerPoint ===
                    enums.TriggerPoint.AssociatedDisplayIDFromMessage ||
                    messageStore.instance.responseOpenTriggerPoint ===
                    enums.TriggerPoint.WorkListResponseExceptionIcon
                );

                this.loadTinyMCE();

                // Start re-rendering. We have loaded everything.
                this.setState({
                    modulesLoaded: true,
                    imagesLoaded: htmlviewerhelper.isHtmlComponent ? true : this.state.imagesLoaded
                });
            }.bind(this)
        );

        ensurePromise.catch((e) => {
            // assuming that if modulesLoaded state is true, then the error wont be a network failure.
            // so we need to throw custom error message
            if (this.isNetworkError) {
                this.props.setOfflineContainer(true, true);
            } else {
                this.setState({
                    isBusy: false
                });
                window.onerror(e, '', null, null, new Error(e));
            }
        });
    }

    /**
     * Callback function for mark this page click.
     */
    protected onMarkThisPageCallback = (scrollPosition: number): void => {
        if (!markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            // Updating the latest exception list
            exceptionHelper.getNewExceptions(
                markerOperationModeFactory.operationMode.isTeamManagementMode,
                markerOperationModeFactory.operationMode.isAwardingMode
            );
        }
        this.responseContainerProperty.markThisPageScrollPosition = scrollPosition;
        this.changeResponseViewMode();
        //Resetting for mark this page click
        this.responseContainerProperty.scrollToSuppressArea = false;
        // reset the book mark previous scroll data while navigating to a page by 'Mark This Page' click
        responseActionCreator.setBookmarkPreviousScrollData(undefined);
    };

    /**
     * getLinkedAnnotationCount
     */
    protected getLinkedAnnotationCount() {
        let linkedAnnotationsCount = 0;
        if (
            this.responseContainerProperty.imageZonesCollection &&
            (responseStore.instance.markingMethod === enums.MarkingMethod.Structured ||
                responseHelper.isEbookMarking) &&
            !responseHelper.isAtypicalResponse()
        ) {
            linkedAnnotationsCount = pageLinkHelper.getLinkedPagesCountExcludingPagesUsedInImageZones(
                markingStore.instance.currentMarkSchemeId
            );
        }
        return linkedAnnotationsCount;
    }

    /**
     * setting fracs data for image loaded
     */
    protected onMarkThisPageLoaded(): void {
        responseActionCreator.setFracsDataForImageLoaded();
    }

    /**
     * Handles the action event after fracs data loaded
     */
    protected onFracsDataLoaded = () => {
        this.responseContainerHelper.fracsDataLoaded(this.state.selectedViewMode);
    };

    /**
     * Handles the action event after structured fracs data loaded.
     */
    protected structuredFracsDataLoaded = (fracsSource: enums.FracsDataSetActionSource) => {
        if (fracsSource !== enums.FracsDataSetActionSource.Acetate) {
            this.responseContainerHelper.structuredFracsDataLoaded();
        }
    };

    /**
     * Method to handle the response view mode change.
     * If Current Mode is Zone View and all images are not loaded, Load All the images and render the component.
     * If Current Mode is Zone View and all images are loaded. render to full response view
     * If current mode is full response view, render to zone view since default mode is zone view.
     */
    protected changeResponseViewMode(): void {
        let hasUnManagedSLAO = responseHelper.hasUnManagedSLAOInMarkingMode;
        let hasUnmanagedImageZone = this.responseContainerHelper.hasUnManagedImageZone();
        let hasAdditionalPageStdSetupSelectResponse = responseHelper.hasAdditionalPageInStdSetUpSelectResponses;
        if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView || hasUnManagedSLAO ||
            (hasAdditionalPageStdSetupSelectResponse && !this.isStdsetupAdditionalpageSeen) || hasUnmanagedImageZone) {
            if (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize
                || this.responseContainerProperty.isExceptionPanelMinimized === true) {
                this.responseContainerProperty.cssMessageStyle = { right: this.responseContainerProperty.scrollBarWidth };
            }
            if (
                this.responseContainerProperty.fileMetadataList === undefined ||
                this.responseContainerProperty.fileMetadataList == null
            ) {
                // Setting the busy indicator properties
                this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
                responseActionCreator.changeResponseViewMode(
                    enums.ResponseViewMode.fullResponseView,
                    false
                );
                new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(
                    enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]
                );

                //  Switch the state to show 'Loading..' text
                this.setState({
                    imagesLoaded: false,
                    isBusy: true,
                    selectedViewMode: enums.ResponseViewMode.fullResponseView
                });

                // Get all image urls.
                this.responseContainerProperty.fileMetadataList = this.responseContainerHelper.getFileMetadata();
                let imgUrls = [];
                this.responseContainerProperty.fileMetadataList.forEach(
                    (metadata: FileMetadata) => {
                        imgUrls.push(metadata.url);
                    }
                );

                // Call the API for images and render to UI.
                this.loadImages(imgUrls);
            } else {
                responseActionCreator.changeResponseViewMode(
                    enums.ResponseViewMode.fullResponseView,
                    false
                );
                new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(
                    enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]
                );
                // Images are already loaded. Just switch the state,
                // fix for 68601: Additional page pop up will not show initially if the image loading takes time.
                // show the Additional page pop up if needed after loading images
                this.setState({
                    selectedViewMode: enums.ResponseViewMode.fullResponseView,
                    isStandardisationAdditionalPagePopUpVisible:
                        this.isStdSetUpSelectResponsesAdditionalPagePopUpVisible(enums.ResponseViewMode.fullResponseView)
                });

                /* If zoom panel is open, the user clicks the FRV button and then navigate to FRV,
                   in that case zoom option variable is not set to false.
                   Drag annotation possible only if the zoom option variable value is false.
                   Hence in that case the user was not able to drag annotation after navigate back to response screen.
                   So reset the zoom option variable before navigate to FRV if zoom panel is open.
                */
                this.responseContainerHelper.hideZoomPanel();
            }

            if (hasUnManagedSLAO || hasUnmanagedImageZone || hasAdditionalPageStdSetupSelectResponse) {
                // moving to full response view.
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            }
        } else if (
            !hasUnmanagedImageZone &&
            this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView
        ) {
            this.changeResponseModeIntoFRV();
        }
    }

    /**
     * get executed on response mode changed into FRV
     */
    protected changeResponseModeIntoFRV() {
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.responseContainerProperty.cssMessageStyle = {
            right: this.responseContainerProperty.resizedWidth
        };
        // Switch view to Zone state
        this.responseContainerProperty.renderedImageViewerCount = 0;
        if (this.responseContainerProperty.isMessagePanelVisible) {
            // deactivating the keydown helper.
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        }
        responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.zoneView, false);
        new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(
            enums.ResponseViewMode[enums.ResponseViewMode.zoneView]
        );
        this.loadScriptImages(false);
        //Set if navigate from FRV with unknown content managed.
        this.isUnknownContentMangedFromFRV = (this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView);
        this.setState({ selectedViewMode: enums.ResponseViewMode.zoneView });
    }

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    protected showLogoutConfirmation = (): void => {
        this.setState({ isConfirmationPopupDisplaying: true, renderedOn: Date.now() });
    };

    /**
     * Marks retrieval event.
     */
    protected marksRetrieved = (): void => {
        this.checkIfMarkSchemeAndMarksAreLoaded();
    };

    /**
     * Confirmation poup for withdrawnResponse.
     */
    protected withdrawnResponse = (isStandardisationSetup: boolean): void => {
        if (isStandardisationSetup) {
            this.responseContainerProperty.withdrawScriptInStmErrorPopUpVisible = true;
        } else {
            this.responseContainerProperty.withdrwnResponseErrorPopupVisible = true;
        }
    };

    /**
     * Confirmation poup for session closed Response.
     */
    protected sessionClosedForMarker = (): void => {
        this.setState({
            sessionClosedErrorPopupVisible: true
        });
    };

    /**
     * Markscheme load event.
     */
    protected markSchemeLoaded = (): void => {
        this.checkIfMarkSchemeAndMarksAreLoaded();
    };

    /**
     * Complete button dialog, yes click.
     */
    protected onYesClickOnCompleteDialog = () => {
        this.setState({
            isCompleteButtonDialogVisible: false
        });

        /** to enter NR for unmarked mark schemes */
        markingActionCreator.updateMarkAsNRForUnmarkedItem();
    };

    /**
     * Complete button dialog, No click.
     */
    protected onNoClickOnCompleteDialog = () => {
        this.setState({
            isCompleteButtonDialogVisible: false
        });

        /** to set the selection back to mark entry text box */
        markingActionCreator.setMarkEntrySelected();
    };

    /**
     * Not all page annotated message leave response click
     */
    protected onLeaveResponseClick = (warningType?: enums.WarningType) => {
        if (enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited) {
            enhancedOffPageCommentActionCreator.updateEnhancedOffPageComment(false);
        }

        if (this.responseContainerProperty.navigateTo === enums.SaveAndNavigate.toLogout) {
            this.showLogoutConfirmation();
        } else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
            === enums.StandardisationSetup.ProvisionalResponse && warningType === enums.WarningType.SubmitResponse) {
            //ActionCreator for showing Share Response Popup
            standardisationsetupActionCreator.displayShareResponsePopup(
                standardisationSetupStore.instance.fetchStandardisationResponseData(), true);
        } else {
            markingActionCreator.saveAndNavigate(this.responseContainerProperty.navigateTo);
        }

        this.responseContainerProperty.isExceptionPanelEdited = false;
        this.responseContainerProperty.isOnLeaveResponseClick = true;
        this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
    };

    /**
     * Not all page annotated message stay in response click
     */
    protected onStayInResponseClick = () => {
        this.responseContainerHelper.onStayInResponseClick();
    };

    /**
     * Method invoked on validation markup success message
     */
    protected onValidationMarkUpSucessMessage = () => {
        this.setState({
            ismarkEntryPopupVisible: false
        });
        /** to set the selection back to mark entry text box */
        markingActionCreator.setMarkEntrySelected();
    };

    /**
     *  Go to the corresponding element if all images rendered.
     *  This will works for structured responses only. Scroll setting logic for unstructured is implemented in onFracsDataLoaded() method
     * @param {number} pageNumber
     * @param {number} offsetTop?
     */
    protected imageLoaded = (
        pageNumber: number,
        offsetTop?: number,
        hasImagesToRender?: boolean
    ): void => {
        this.responseContainerHelper.imageLoaded(
            this.state.isConfirmReviewOfMangedSLAOPopupShowing,
            offsetTop,
            hasImagesToRender
        );
    };

    /**
     * Full response view stay in response button click.
     */
    protected onFullresponseViewStayInResponseClick = (): void => {
        if (
            responseStore.instance.markingMethod === enums.MarkingMethod.Structured &&
            responseStore.instance.selectedResponseViewMode ===
            enums.ResponseViewMode.fullResponseView &&
            markingHelper.hasUnAnnotatedSlao &&
            this.responseContainerProperty.isStayInResponseFRViewModeTriggered
        ) {
            this.responseContainerProperty.isStayInResponseFRViewModeTriggered = false;
            let slaoFirstPageNumber: number = responseHelper.firstSLAOPageNumber;
            this.responseContainerHelper.scrollToPageInFRView(slaoFirstPageNumber);
        }
    };

    /**
     * returns visibility of unmanaged slao popup
     */
    protected isUnManagedSLAOPopUpVisible(currentViewMode: enums.ResponseViewMode): boolean {
        return !this.responseContainerProperty.isUnManagedSLAOPopupRendered &&
            currentViewMode === enums.ResponseViewMode.fullResponseView &&
            responseHelper.hasUnManagedSLAOInMarkingMode &&
            !this.responseContainerProperty.isPreviousMarksAndAnnotationCopying
            ? true
            : this.state.isUnManagedSLAOPopupVisible;
    }

    /**
     * returns visibility of additional page popup
     */
    protected isStdSetUpSelectResponsesAdditionalPagePopUpVisible(currentViewMode: enums.ResponseViewMode): boolean {
        return currentViewMode === enums.ResponseViewMode.fullResponseView
            && responseHelper.hasAdditionalPageInStdSetUpSelectResponses && !this.isStdsetupAdditionalpageSeen;
    }

    /**
     * returns visibility of unmanaged slao popup
     */
    protected isUnManagedImageZonePopUpVisible(currentViewMode: enums.ResponseViewMode): boolean {
        return !this.responseContainerProperty.isUnManagedImageZonePopupRendered &&
            currentViewMode === enums.ResponseViewMode.fullResponseView &&
            (worklistStore.instance.getResponseMode === enums.ResponseMode.open ||
                worklistStore.instance.getResponseMode === enums.ResponseMode.pending) &&
            this.responseContainerHelper.hasUnManagedImageZone() &&
            !this.responseContainerProperty.isPreviousMarksAndAnnotationCopying
            ? true
            : this.state.isUnManagedImageZonePopUpVisible;
    }

    /**
     * Checking whether markschemes and marks are loaded
     */
    protected checkIfMarkSchemeAndMarksAreLoaded() {
        // Checking whether mark, Mark scheme and images are loaded to remove busy indicator
        if (markSchemeHelper.isMarksAndMarkSchemesAreLoaded() && this.state.imagesLoaded) {
            // Copying previous marks and annotation when isStartWithEmptyMarkGroup is set as zero .
            if (!this.responseContainerHelper.hasUnManagedImageZone()) {
                this.responseContainerHelper.copyPrevMarksAndAnnotations();
            }

            if (this.responseContainerHelper.doAddLinkToSLAO) {
                let displayId = responseStore.instance.selectedDisplayId.toString();

                let examinerMarksAgainstResponse: Array<
                    examinerMarkData
                    > = this.responseContainerHelper.getExaminerMarksAgainstResponse(displayId);
                markinghelper.addLinksToAnnotatedSLAOs(displayId, false);
            }

            let currentViewMode: enums.ResponseViewMode =
                responseHelper.hasUnManagedSLAOInMarkingMode ||
                    this.responseContainerHelper.hasUnManagedImageZone() === true
                    ? enums.ResponseViewMode.fullResponseView
                    : this.state.selectedViewMode;

            if (currentViewMode !== responseStore.instance.selectedResponseViewMode) {
                responseActionCreator.changeResponseViewMode(currentViewMode, false);
                new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(
                    enums.ResponseViewMode[currentViewMode]
                );
            }

            let showConfirmReviewOfMangedSLAOPopup =
                currentViewMode !== enums.ResponseViewMode.zoneView &&
                    this.responseContainerHelper.isPreviousMarksAndAnnotationCopiedInSLAOMode &&
                    !responseHelper.hasUnManagedSLAOInMarkingMode
                    ? true
                    : false;

            this.setState({
                isBusy: this.responseContainerProperty.isPreviousMarksAndAnnotationCopying,
                isUnManagedSLAOPopupVisible: this.isUnManagedSLAOPopUpVisible(currentViewMode),
                isStandardisationAdditionalPagePopUpVisible: this.isStdSetUpSelectResponsesAdditionalPagePopUpVisible(currentViewMode),
                isUnManagedImageZonePopUpVisible: this.isUnManagedImageZonePopUpVisible(currentViewMode)
                    && !markerOperationModeFactory.operationMode.hasZoningExceptionWarningPopup,
                selectedViewMode: currentViewMode,
                isConfirmReviewOfMangedSLAOPopupShowing: showConfirmReviewOfMangedSLAOPopup
            });

            if (
                !this.state.isBusy &&
                markingStore &&
                markingStore.instance.currentMarkGroupItemHasNonRecoverableErrors &&
                !this.responseContainerProperty.hasNonRecoverableErrorPopupShown
            ) {
                this.responseContainerProperty.hasNonRecoverableErrorPopupShown = true;
                this.responseContainerProperty.saveMarksAndAnnotationsErrorDialogContents
                    = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(
                        false
                    );
                this.setState({
                    isNonRecoverableErrorPopupVisible: true
                });
            }
        } else if (
            !markSchemeHelper.isMarksAndMarkSchemesAreLoaded() &&
            !markingStore.instance.isMarksAndMarkSchemesLoadedFailed
        ) {
            markSchemeHelper.loadMarksAndAnnotation();
        }

        if (!htmlviewerhelper.isHtmlComponent) {
            let candidateScriptId: number;
            candidateScriptId = standardisationSetupStore.instance.isSelectResponsesWorklist
                ? responseStore.instance.selectedDisplayId // Returns candaidateScriptId for StandardisationSetUp tab
                : Number(markerOperationModeFactory.operationMode.openedResponseDetails
                    (responseStore.instance.selectedDisplayId.toString()).candidateScriptId);

            let questionPaperId: number = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            let selectedCandidateData: AwardingCandidateDetails = awardingStore.instance.selectedCandidateData;

            if (selectedCandidateData && markerOperationModeFactory.operationMode.isAwardingMode) {
                selectedCandidateData.responseItemGroups.map((x: ResponseItemGroup) => {
                    if (
                        x.candidateScriptId &&
                        imageZoneStore.instance.candidateScriptImageZoneList.get(x.candidateScriptId) ===
                        undefined
                    ) {
                        this.getCandidateScriptImageZones(x.candidateScriptId, x.questionPaperId);
                    }
                });
            } else {
                if (
                    candidateScriptId &&
                    imageZoneStore.instance.candidateScriptImageZoneList.get(candidateScriptId) ===
                    undefined
                ) {
                    this.getCandidateScriptImageZones(candidateScriptId, questionPaperId);
                }
            }
        }
    }

    /**
     * method to fetch the candidate script image zones
     */
    private getCandidateScriptImageZones(candidateScriptId: number, questionPaperId: number) {
        scriptActionCreator.getCandidateScriptImageZones(
            candidateScriptId,
            enums.Priority.First,
            questionPaperId
        );
    }

    /**
     * Check to move to FRV if unknown content in Remark.
     */
    protected canChangeToFRVonRemarkUnknownContent = (): boolean => {
        return (
            this.responseContainerHelper.hasUnManagedImageZoneInRemark() &&
            !this.responseContainerHelper.hasUnManagedImageZone() &&
            !this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked &&
            this.responseContainerProperty.isPreviousMarksAndAnnotationCopied
        );
    };

    /**
     * click no button of accept quality feedback confirmation popup
     */
    protected onAcceptQualityNoButtonClick = (): void => {
        this.setState({ isAcceptQualityConfirmationPopupDisplaying: false });
    };

    /**
     * click yes button of accept quality feedback confirmation popup
     */
    protected onAcceptQualityYesButtonClick = (): void => {
        this.setState({ isAcceptQualityConfirmationPopupDisplaying: false });
        let openedResponseDetails = worklistStore.instance.getResponseDetails(
            responseStore.instance.selectedDisplayId.toString()
        );
        acceptQualityFeedbackActionCreator.acceptQualityFeedback(
            openedResponseDetails.markGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            enums.SaveAndNavigate.toWorklist,
            worklistStore.instance.currentWorklistType
        );
    };

    /**
     * show accept quality feedback confirmation popup
     */
    protected showAcceptQualityConfirmationDialog = (): void => {
        this.setState({ isAcceptQualityConfirmationPopupDisplaying: true });
    };

    /**
     * Checking whether Not all page annotated popup should be visible.
     */
    protected checkIfAllPagesAreAnnotated = (navigateTo: enums.SaveAndNavigate): void => {
        this.setState({ isAllPageNotAnnotatedVisible: true });
        if (!this.responseContainerProperty.doNavigateResponse) {
            this.responseContainerProperty.navigateTo = navigateTo;
        }
    };

    /**
     * Checking whether complete popup should be visible.
     */
    protected showCompleteButtonDialog = (): void => {
        this.setState({ isCompleteButtonDialogVisible: true });
    };

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    protected resetLogoutConfirmationSatus = (): void => {
        this.setState({ isConfirmationPopupDisplaying: false, renderedOn: Date.now() });
    };

    /**
     * Reseting to login page
     * @param context
     */
    protected resetToLoginPage(context: any) {
        // This will clear the memory.
        navigationHelper.loadLoginPage();
        window.location.replace(config.general.SERVICE_BASE_URL);
    }

    /**
     * Check whether the login session authenticated.
     * @param context
     */
    protected isLoginSessionAuthenticated() {
        if (!loginSession.IS_AUTHENTICATED) {
            this.resetToLoginPage(this.context);
            return false;
        }

        return true;
    }

    /**
     * Get the last mark scheme id after loading the mark scheme structure.
     */
    protected onMarkSchemeStructureLoaded = (lastMarkSchemeId: number): void => {
        this.responseContainerProperty.lastMarkSchemeId = lastMarkSchemeId;
    };

    /**
     * On changing the response view, Saving the user option and re-rendering
     * the marking view button.
     * @param {enums.fullResponeViewOption} fullResponseOption
     */
    protected onChangeResponseViewClick = (fullResponseOption: enums.FullResponeViewOption) => {
        /** Updating the useroption */
        userOptionsHelper.save(
            userOptionKeys.FULL_RESPONSE_VIEW_OPTION,
            fullResponseOption.toString(),
            true
        );

        /** Setting state for re-rendering the FullResponseImageViewer component */
        this.setState({ fullResponseViewOption: fullResponseOption });

        // call full response view option changed action.
        responseActionCreator.fullResponseViewOptionChanged(fullResponseOption);
        /** Rerendering Wavy Annotations to persist thickness and pattern */
        responseActionCreator.updateWavyAnnotationsViewModeChanged();
    };

    /**
     * Invokes when the user changed the status of the button.
     */
    protected onShowAnnotatedPagesOptionChanged = (isShowAnnotatedPagesOption: boolean) => {
        this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected = isShowAnnotatedPagesOption;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Invokes when the user changed the status of 'Only show unannotated additional pages' button.
     */
    protected onShowUnAnnotatedAdditionalPagesOptionChanged = (
        isShowUnAnnotatedAdditionalPagesOption: boolean
    ) => {
        this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = isShowUnAnnotatedAdditionalPagesOption;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Invokes when the user changed the status of the button.
     */
    protected onShowAllPagesOfScriptOptionChanged = (isShowAnnotatedPagesOption: boolean) => {
        this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected = isShowAnnotatedPagesOption;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Callback function for full response view option changed
     * @param fullResponseViewOption - response view option
     * @param offsetTop - offsetTop value
     */
    protected onFullResponseViewOptionChangedCallback = (
        fullResponseViewOption: enums.FullResponeViewOption,
        offsetTop: number
    ): void => {
        // Scroll to the element
        $('.marksheet-container').scrollTop(offsetTop);
    };

    /**
     * On mouse move handler
     * @param event
     */
    protected onMouseMove = (event: any) => {
        let elementClassName = event.target.className;
        // check for 'annotation' string in the element's class name, this is
        // to skip the annotation overlay and other annotation elements
        if (
            elementClassName &&
            typeof elementClassName === 'string' &&
            (elementClassName.indexOf('annotation') === -1 &&
                elementClassName.indexOf('svg-icon') === -1 &&
                elementClassName.indexOf('txt-icon') === -1)
        ) {
            responseActionCreator.setMousePosition(-1, -1);
        }
    };

    /**
     * On mouse click event handler
     * @param event
     */
    protected onClickHandler = (event: any) => {
        // This is to prevent event handling issue in firefox.
        // when new annotation is stamping we are not sending the event to
        // prevent the comment from removing. once it stamped revoke the value so
        // that in another click will hide the comment box.
        let isClickOutsideScript: boolean = false;
        let outsideClickClasses: string[] = [
            'marksheet-content-holder',
            'marksheet-holder',
            'marksheet-zoom-holder',
            'comments-bg'
        ];
        // if clicked outside the script, close the open comment
        if (event.target.classList !== undefined) {
            isClickOutsideScript = outsideClickClasses.indexOf(event.target.classList[0]) !== -1;
        }

        if (
            (!this.responseContainerProperty.isOnPageCommentStamped &&
                !onPageCommentHelper.commentMoveInSideView &&
                (stampStore.instance.SelectedSideViewCommentToken !== undefined ||
                    stampStore.instance.SelectedOnPageCommentClientToken !== undefined)) ||
            isClickOutsideScript
        ) {
            stampActionCreator.showOrHideComment(false);
        } else {
            this.responseContainerProperty.isOnPageCommentStamped = false;
            onPageCommentHelper.commentMoveInSideView = false;
        }

        if (
            markingStore.instance.selectedBookmarkClientToken &&
            event.target !== undefined &&
            domManager.searchParentNode(event.target, function (el: any) {
                return el.id === 'bookmark-entry';
            }) == null
        ) {
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
        }

        let element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
        if (!element) {
            return;
        }

        let clientToken = element.getAttribute('data-token');
        // this check is to call preventDefault if the click is over the remove annotation context menu
        if (
            !clientToken &&
            element &&
            ((typeof element.className === 'string' &&
                element.className.indexOf('remove-annotation') === -1) ||
                // handle click on collapsed file list panel, where the element class name is svg type
                typeof element.className === 'object')
        ) {
            markingActionCreator.showOrHideRemoveContextMenu(false);
        }
        if (htmlUtilities.isIPadDevice && messageStore.instance.isMessagePanelVisible && element.id !== 'message-subject') {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
    };

    /**
     * Non-Recoverable marks and annotation save error message ok click
     */
    protected onOkClickOfNonRecoverableErrorMessage = () => {
        // close the non-recoverable error popup.
        this.setState({
            isNonRecoverableErrorPopupVisible: false
        });
    };

    /**
     * switch on/off mark validation popup
     * @param {number} minMark
     * @param {number} maxMark
     */
    protected onResetMarkConfirm = (
        isResetButtonClick: boolean,
        previousMark: AllocatedMark
    ): void => {
        this.responseContainerProperty.isResetActionByClick = isResetButtonClick;
        this.responseContainerProperty.previousMark = previousMark;
        if (htmlviewerhelper.isHtmlComponent && !isResetButtonClick) {
            this.onResetMarkYesButtonClick();
        } else {
            isResetButtonClick
                ? htmlviewerhelper.isHtmlComponent ?
                    this.setConfirmationDialogContent(
                        localeStore.instance.TranslateText(
                            'marking.response.reset-mark-dialog.body-when-reset-button-clicked-cbt'
                        )
                    )
                    : this.setConfirmationDialogContent(
                        localeStore.instance.TranslateText(
                            'marking.response.reset-mark-dialog.body-when-reset-button-clicked'
                        )
                    )
                : this.setConfirmationDialogContent(
                    localeStore.instance.TranslateText(
                        'marking.response.reset-mark-dialog.body-when-mark-deleted'
                    )
                );
            this.setState({ isResetMarkPopupVisible: true });
            this.responseContainerProperty.isResetMarkPopupShown = true;
            this.responseContainerProperty.isMarkChangeReasonShown = false;
        }
    };

    /**
     * Set confirmation dialogue props
     * @param content Confirmation dialogue content
     */
    protected setConfirmationDialogContent(content: string) {
        this.responseContainerProperty.confirmationDialogueHeader = htmlviewerhelper.isHtmlComponent
            ? localeStore.instance.TranslateText(
                'marking.response.reset-mark-dialog.header-cbt'
            )
            : localeStore.instance.TranslateText(
                'marking.response.reset-mark-dialog.header'
            );
        this.responseContainerProperty.confirmationDialogueContent = content;
    }

    /**
     * Reset mark Yes click
     */
    protected onResetMarkYesButtonClick = () => {
        // If reset triggered delete both mark and annotation.
        markingActionCreator.resetMarksAndAnnotation(true, true);
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.responseContainerProperty.isResetMarkPopupShown = false;
        this.setState({
            isResetMarkPopupVisible: false
        });
        /** to set the selection back to mark entry text box */
        markingActionCreator.setMarkEntrySelected();
    };

    /**
     * Reset mark No click
     */
    protected onResetMarkNoButtonClick = () => {
        // If reset action by click then we dont need to update anything.
        if (this.responseContainerProperty.isResetActionByClick === false) {
            // If reset triggered delete both mark and annotation.
            markingActionCreator.resetMarksAndAnnotation(true, false);
        } else if (
            this.responseContainerProperty.previousMark &&
            this.responseContainerProperty.previousMark.displayMark !== ''
        ) {
            // this is to re-assign the value to the markscheme text box
            markingActionCreator.resetMarksAndAnnotation(
                false,
                false,
                this.responseContainerProperty.previousMark
            );
        }

        // Hide the popup
        this.setState({
            isResetMarkPopupVisible: false
        });

        this.responseContainerProperty.isResetMarkPopupShown = false;

        /** to set the selection back to mark entry text box */
        markingActionCreator.setMarkEntrySelected();
    };

    /**
     * on resetting mark and annotation completed
     * this will trigger even a single keyboard entry on markascheme panel.
     */
    protected notifyMarkUpdated = (): void => {
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method fired to minimize the exception panel.
     */
    protected onMinimizeExceptionPanel = (): void => {
        // Show annotation toolbar on minimizing the exception panel.
        this.responseContainerProperty.isToolBarPanelVisible = true;
        this.responseContainerHelper.setCssStyle();
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
        this.responseContainerProperty.isExceptionPanelMinimized = true;
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Method fired to maximize the exception panel.
     */
    protected onMaximizeExceptionPanel = (): void => {
        // Hide annotation toolbar on maximizing the exception panel.
        this.responseContainerProperty.isToolBarPanelVisible = false;
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Method fired to close the message panel.
     */
    protected onCloseMessagePanel = (
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none
    ): void => {
        // If Message is sent, get force reload the list for new data
        if (
            this.responseContainerProperty.isMessagePanelVisible &&
            messageStore.instance.isMessageDataRequireUpdation &&
            navigateTo !== enums.SaveAndNavigate.messageWithInResponse
        ) {
            this.loadMessageFortheResponse();
        }
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        // Defect fix: #48317
        if (this.responseContainerProperty.messageType !== enums.MessageType.ResponseDetails) {
            this.responseContainerProperty.messageType = enums.MessageType.ResponseCompose;
        }

        switch (navigateTo) {
            case enums.SaveAndNavigate.messageWithInResponse:
                this.openMessage(this.responseContainerProperty.messageIdToSelect);
                break;
            case enums.SaveAndNavigate.toNewResponseMessageCompose:
                // close the existing message panel that will clear the message editor contents.
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                // compose new message window
                this.createNewMessage();
                break;
            case enums.SaveAndNavigate.newExceptionButtonClick:
            case enums.SaveAndNavigate.exceptionWithInResponse:
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                markingHelper.canNavigateAwayFromCurrentResponse();

                this.responseContainerProperty.isExceptionPanelEdited = false;
                this.responseContainerProperty.isMessagePanelVisible = false;

                if (navigateTo === enums.SaveAndNavigate.newExceptionButtonClick) {
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                    this.onCreateNewExceptionClicked();
                } else {
                    this.onExceptionSelected(this.responseContainerProperty.exceptionId);
                }
                break;
            case enums.SaveAndNavigate.newExceptionFromMediaErrorDialog:
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                markingHelper.canNavigateAwayFromCurrentResponse();

                this.responseContainerProperty.isExceptionPanelEdited = false;
                this.responseContainerProperty.isMessagePanelVisible = false;
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                this.onCreateNewExceptionClicked(
                    this.responseContainerProperty.isFromMediaErrorDialog,
                    this.responseContainerProperty.errorViewmoreContent
                );
                break;
            default:
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                break;
        }
        this.setState({
            renderedOn: Date.now(),
            isExceptionPanelVisible:
                navigateTo === enums.SaveAndNavigate.newExceptionButtonClick
                    ? true
                    : this.state.isExceptionPanelVisible
        });
    };

    /**
     * Method fired to minimize the message panel.
     */
    protected onMinimizeMessagePanel = (): void => {
        // Show annotation toolbar on minimizing the message panel.
        this.responseContainerProperty.isToolBarPanelVisible = true;
        this.responseContainerProperty.isMessagePanelMinimized = true;
        this.responseContainerHelper.setCssStyle();
        /* Defect:24608 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad */
        if (htmlUtilities.isIPadDevice) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Method fired to maximize the message panel.
     */
    protected onMaximizeMessagePanel = (): void => {
        // Hide annotation toolbar on minimizing the message panel.
        this.responseContainerProperty.isToolBarPanelVisible = false;
        this.responseContainerProperty.isMessagePanelMinimized = false;
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Remove the fit height setting before zooming
     */
    protected onCustomZoomUpdated = (
        zoomType: enums.ZoomType,
        switchTo: enums.ResponseViewSettings
    ): void => {
        switch (switchTo) {
            case enums.ResponseViewSettings.CustomZoom:
                zoomPanelActionCreator.HandleZoomPanelActions(
                    enums.ResponseViewSettings.CustomZoom,
                    zoomType
                );
                break;
            case enums.ResponseViewSettings.FitToWidth:
                zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.FitToWidth);
                break;
            case enums.ResponseViewSettings.FitToHeight:
                zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.FitToHeight);
                break;
        }
    };

    /**
     * this is called when an annotation is added for setting on page comment related flag
     * @param {number} stampId StamptypeID
     */
    protected onAnnotationAdded = (
        stampId: number,
        addAnnotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string,
        annotation: annotation,
        isStitched: boolean,
        isPageLinkedByPreviousMarker: boolean
    ): void => {
        // Check if all pages are annotated - included since clicking 'Flag as Seen' button
        // from full response view was not reflecting in worklist home screen
        let isAllPagesAnnotated = markingHelper.isAllPageAnnotated();
        if (isAllPagesAnnotated) {
            let treeViewItem = this.responseContainerProperty.treeViewHelper.treeViewItem();
            markingActionCreator.updateSeenAnnotation(isAllPagesAnnotated, treeViewItem);
        }
        // Perform only for onpage comment to open comment box
        // for firefox.
        if (stampId === enums.DynamicAnnotation.OnPageComment) {
            this.responseContainerProperty.isOnPageCommentStamped = true;
            this.setState({
                renderedOn: Date.now()
            });
            // No need to load the image again when currentmarker adding an annotation (first time) on page linked by previous marker.
        } else if (
            stampId === constants.LINK_ANNOTATION &&
            this.state.selectedViewMode === enums.ResponseViewMode.zoneView &&
            !isPageLinkedByPreviousMarker
        ) {
            this.loadScriptImages(false);
            // Setting the busy indicator properties
            this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
            this.setState({
                imagesLoaded: false,
                isBusy: true,
                renderedOn: Date.now(),
                selectedViewMode: enums.ResponseViewMode.zoneView
            });
        }
    };

    /**
     * Load Messages Related To the Response
     */
    protected loadMessageFortheResponse() {
        if (!standardisationSetupStore.instance.isSelectResponsesWorklist
            && !markerOperationModeFactory.operationMode.isAwardingMode) {
            let isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
            let responseBase: ResponseBase = this.responseContainerProperty.responseData;
            messagingActionCreator.getMessages({
                recentMessageTime: null,
                messageFolderType: 0,
                qigId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                forceLoadMessages: messageStore.instance.isMessageDataRequireUpdation,
                candidateResponseId: responseBase.candidateScriptId,
                markGroupId: isStandardisationSetupMode ? responseBase.esMarkGroupId : responseBase.markGroupId,
                isStandardisationResponse: isStandardisationSetupMode ? true :
                    worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
                    worklistStore.instance.currentWorklistType ===
                    enums.WorklistType.standardisation ||
                    worklistStore.instance.currentWorklistType ===
                    enums.WorklistType.secondstandardisation,
                isTeamManagementView: markerOperationModeFactory.operationMode.isTeamManagementMode,
                isWholeResponse: responseBase.isWholeResponse,
                currentWorklistType: worklistStore.instance.currentWorklistType,
                hiddenQigList: qigStore.instance.HiddenQIGs
            });
        }
    }

    /**
     * Get the selected message for the response.
     * @param msgId
     */
    protected onMessageSelected = (msgId: number) => {
        // Defect 69750 Fix - reset the selected message details on clicking the linked message,
        // and this will updated with correct message details from onMessageDetailsReceived
        this.responseContainerProperty.selectedMsgDetails = undefined;
        this.getMessagePanelRightPosition();
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        // deactivating the keydown helper on message section open.
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        this.responseContainerProperty.messageIdToSelect = msgId;
        this.responseContainerProperty.messageId = msgId;
        if (
            this.responseContainerProperty.isMessagePanelVisible &&
            (this.responseContainerProperty.messageType === enums.MessageType.ResponseCompose ||
                this.responseContainerProperty.messageType === enums.MessageType.ResponseForward ||
                this.responseContainerProperty.messageType === enums.MessageType.ResponseReply)
        ) {
            let responseNavigationFailureReasons: Array<
                enums.ResponseNavigateFailureReason
                > = markingHelper.canNavigateAwayFromCurrentResponse();
            popupHelper.navigateAwayFromResponse(
                responseNavigationFailureReasons,
                enums.SaveAndNavigate.messageWithInResponse
            );
        } else if (this.responseContainerProperty.isExceptionPanelEdited) {
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
            popUpDisplayActionCreator.popUpDisplay(
                enums.PopUpType.DiscardExceptionOnViewMessage,
                enums.PopUpActionType.Show,
                enums.SaveAndNavigate.none,
                {
                    popupContent: localeStore.instance.TranslateText(
                        'marking.response.discard-message-or-exception-dialog.body'
                    )
                }
            );
        } else {
            this.openMessage(this.responseContainerProperty.messageIdToSelect);
        }
        this.addTransitionEventListeners();
    };

    /**
     * Handles the action event on Message Details Received.
     */
    protected onMessageDetailsReceived = (msgId: number): void => {
        // Check the selection got changed while receives the message
        if (this.responseContainerProperty.selectedMsg.examinerMessageId === msgId) {
            this.responseContainerProperty.selectedMsgDetails = messageStore.instance.getMessageDetails(
                msgId
            );
            this.responseContainerProperty.exceptionDetails = undefined;
            this.responseContainerProperty.isMessagePanelVisible = true;
            if (this.responseContainerProperty.selectedMsg.status === enums.MessageReadStatus.New) {
                this.updateReadStatus();
            }
            this.responseContainerProperty.isNewException = false;

            this.setState({
                isExceptionPanelVisible: false,
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Open and Render the Message
     * @param msgId
     */
    protected openMessage(msgId: number) {
        // deactivating the keydown helper on message section open.
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        if (msgId !== 0) {
            messagingActionCreator.getMessageBodyDetails(msgId, enums.MessageFolderType.None);
            this.responseContainerProperty.selectedMsg = messageStore.instance.getMessageData(
                msgId
            );
            // if the exception panel is visible then need to set as close
            // for arranging the panel visiblity in correct position when we minimizing
            if (exceptionStore.instance.isExceptionPanelVisible) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
            }
            messagingActionCreator.calculateRecipientCount();
        } else {
            messagingActionCreator.messageAction(enums.MessageViewAction.Open);
        }
        this.responseContainerProperty.messageType = enums.MessageType.ResponseDetails;
        this.responseContainerProperty.isExceptionPanelEdited = false;
    }

    /**
     * Click Handler of Create new message
     */
    protected onCreateNewMessageSelected = () => {
        this.getMessagePanelRightPosition();
        if (
            this.responseContainerProperty.isFromMediaErrorDialog &&
            this.state.isExceptionPanelVisible
        ) {
            this.responseContainerProperty.isExceptionPanelEdited = true;
        }
        this.responseContainerProperty.messageIdToSelect = 0;
        if (
            this.responseContainerProperty.isMessagePanelVisible &&
            (this.responseContainerProperty.messageType === enums.MessageType.ResponseCompose ||
                this.responseContainerProperty.messageType === enums.MessageType.ResponseForward ||
                this.responseContainerProperty.messageType === enums.MessageType.ResponseReply)
        ) {
            this.responseContainerProperty.isExceptionPanelEdited = false;
            let responseNavigationFailureReasons: Array<
                enums.ResponseNavigateFailureReason
                > = markingHelper.canNavigateAwayFromCurrentResponse();
            popupHelper.navigateAwayFromResponse(
                responseNavigationFailureReasons,
                messageHelper.getNavigateAwayType(this.responseContainerProperty.messageType)
            );
        } else if (this.responseContainerProperty.isExceptionPanelEdited) {
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
            popUpDisplayActionCreator.popUpDisplay(
                enums.PopUpType.DiscardExceptionOnNewMessage,
                enums.PopUpActionType.Show,
                enums.SaveAndNavigate.none,
                {
                    popupContent: localeStore.instance.TranslateText(
                        'marking.response.discard-message-or-exception-dialog.body'
                    )
                }
            );
        } else {
            // check online status before proceed
            this.checkOnlineStatusComposeMessage();
        }
        this.addTransitionEventListeners();
    };

    /**
     *  create new message code moved to a common method
     */
    protected createNewMessage() {
        this.responseContainerProperty.isMessagePanelVisible = true;
        this.setState({
            isExceptionPanelVisible: false
        });
        // deactivating the keydown helper on message section open.
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        messagingActionCreator.messageAction(
            enums.MessageViewAction.Open,
            enums.MessageType.ResponseCompose
        );
        this.responseContainerHelper.setMessagePanelvariables();
        exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
        this.responseContainerProperty.isExceptionPanelMinimized = false;
    }

    /**
     * Update the Read Status to database
     */
    protected updateReadStatus() {
        // If the message is currently in un read status and also make sure it is not made as read already
        if (
            this.responseContainerProperty.selectedMsg &&
            (this.responseContainerProperty.selectedMsg.status === enums.MessageReadStatus.New &&
                !messageStore.instance.isMessageRead(
                    this.responseContainerProperty.selectedMsg.examinerMessageId
                ))
        ) {
            // action for updating read status for the newly selected response.
            messagingActionCreator.updateMessageStatus({
                messageId: this.responseContainerProperty.selectedMsg.examinerMessageId,
                messageDistributionIds: this.responseContainerProperty.selectedMsg
                    .messageDistributionIds,
                examinerMessageStatusId: enums.MessageReadStatus.Read
            });
        }
    }

    /**
     * Invoked once the message read status changed in UI
     * OR there is a total count mismatch in the Total Unread count for all components
     */
    protected onMessageReadStatusRequireUpdation = (
        totalUnreadMessageCount: number,
        isMessageReadCountChanged: boolean
    ) => {
        this.responseContainerProperty.unReadMessageCount =
            totalUnreadMessageCount > 0
                ? totalUnreadMessageCount
                : messageStore.instance.getUnreadMessageCount;

        if (isMessageReadCountChanged) {
            this.loadMessageFortheResponse();
        }

        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Invoked when the zoom has been  completed and if we need to navigate to any
     * page setting stored scrollTop.
     */
    protected onResponseZoomUpdated = () => {
        // to get actual number of images which has been currently loaded
        let noOfImagesLoaded = $('.marksheet-view-holder img').length;

        // setting scroll position only when all the images gets loaded
        if (noOfImagesLoaded === this.responseContainerProperty.totalImagesWithOutSuppression) {
            if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView) {
                setTimeout(() => {
                    this.onMarkThisPageLoaded();
                }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
            }
            if (
                this.responseContainerProperty.scrollToTopOf !== undefined ||
                this.responseContainerProperty.scrollToSuppressArea
            ) {
                let that = this;
                setTimeout(() => {
                    // When the user tries to navigate from the response before specified time, the image container is undefined
                    if ($('.marksheet-container').get(0) !== undefined) {
                        $('.marksheet-container').scrollTop(
                            that.responseContainerHelper.getScrollPosition()
                        );
                        that.responseContainerProperty.scrollToTopOf = undefined;
                    }
                }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
            }
        }
    };

    /**
     * Get the selected exception for the response.
     * @param exceptionId
     */
    protected onExceptionSelected = (exceptionId?: number) => {
        this.getMessagePanelRightPosition();
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        this.responseContainerProperty.exceptionId = exceptionId;

        if (messageStore.instance.isMessagePanelActive) {
            this.responseContainerHelper.triggerMessageNavigationAction(
                enums.MessageNavigation.exceptionWithInResponse
            );
        } else if (this.responseContainerProperty.isExceptionPanelEdited) {
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
            popUpDisplayActionCreator.popUpDisplay(
                enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick,
                enums.PopUpActionType.Show,
                enums.SaveAndNavigate.none,
                {
                    popupContent: localeStore.instance.TranslateText(
                        'marking.response.discard-exception-dialog.body-open-another'
                    )
                }
            );
        } else {
            if (exceptionId !== undefined) {
                this.responseContainerProperty.isMessagePanelVisible = false;
                this.responseContainerProperty.isNewException = false;
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);

                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.View);

                if (!this.responseContainerProperty.isNewException) {
                    if (
                        teamManagementStore &&
                        teamManagementStore.instance.isRedirectFromException &&
                        teamManagementStore.instance.selectedException
                    ) {
                        this.responseContainerProperty.exceptionDetails = exceptionStore.instance.getExceptionItem(
                            teamManagementStore.instance.selectedException.exceptionId
                        );
                    } else {
                        this.responseContainerProperty.exceptionDetails = exceptionStore.instance.getExceptionItem(
                            exceptionId
                        );
                    }
                }
                this.setState({
                    isExceptionPanelVisible: true,
                    renderedOn: Date.now()
                });
            }
        }
        this.addTransitionEventListeners();
    };

    /**
     * Click Handler of Create new exception
     */
    protected onCreateNewExceptionClicked = (
        isFromMediaErrorDialog: boolean = false,
        errorViewmoreContent: string = ''
    ) => {
        this.responseContainerHelper.onCreateNewExceptionClicked(
            isFromMediaErrorDialog,
            errorViewmoreContent,
            this.state.isExceptionPanelVisible,
            this.getMessagePanelRightPosition,
            () => {
                this.setState({ isExceptionPanelVisible: true, renderedOn: Date.now() });
            },
            this.addTransitionEventListeners
        );
    };

    /**
     * Method fired to close the exception panel.
     */
    protected onCloseExceptionPanel = (
        isSubmitAndClose?: boolean,
        createExceptionReturnErrorCode?: enums.ReturnErrorCode
    ): void => {
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        if (
            this.responseContainerProperty.isFromMediaErrorDialog &&
            this.state.isExceptionPanelVisible
        ) {
            this.responseContainerProperty.isExceptionPanelEdited = true;
        }
        if (isSubmitAndClose) {
            this.responseContainerProperty.isExceptionPanelEdited = false;
        }

        if (this.responseContainerProperty.isExceptionPanelEdited) {
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
            popUpDisplayActionCreator.popUpDisplay(
                enums.PopUpType.DiscardException,
                enums.PopUpActionType.Show,
                enums.SaveAndNavigate.none,
                {
                    popupContent: localeStore.instance.TranslateText(
                        'marking.response.discard-exception-dialog.body-raise-new'
                    )
                }
            );
        } else {
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
        }

        // if the reponse is withdrawn ,then show a poup that indicating response has withdrwan.
        if (createExceptionReturnErrorCode === enums.ReturnErrorCode.WithdrawnResponse) {
            this.responseContainerProperty.creatExceptionReturnWithdrwnResponseErrorPopupVisible = true;
        }

        // if the reponse is deallocated ,then show a poup
        if (createExceptionReturnErrorCode === enums.ReturnErrorCode.DeallocatedResponse) {
            this.setState({ isMessageSendErrorPopupVisible: true });
        }
    };

    /**
     *  This will call on exception close
     */
    protected onExceptionPanelClose = () => {
        // Show annotation toolbar on closing the exception panel.
        this.responseContainerProperty.isToolBarPanelVisible = true;
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.setState({
            isExceptionPanelVisible: false,
            renderedOn: Date.now()
        });
        this.responseContainerProperty.isExceptionPanelEdited = false;
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
    };

    /**
     * This method is handling the various popup events.
     */
    protected onPopUpDisplayEvent = (
        popUpType: enums.PopUpType,
        popUpActionType: enums.PopUpActionType
    ) => {
        switch (popUpType) {
            case enums.PopUpType.DiscardOnNewExceptionButtonClick:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        this.responseContainerProperty.isMessagePanelVisible = false;
                        this.responseContainerProperty.isExceptionPanelEdited = false;
                        this.responseContainerProperty.isNewException = true;
                        exceptionActionCreator.exceptionWindowAction(
                            enums.ExceptionViewAction.Open
                        );
                        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                        break;
                    case enums.PopUpActionType.No:
                        break;
                }
                break;
            case enums.PopUpType.DiscardException:
            case enums.PopUpType.DiscardExceptionNavigateAway:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        exceptionActionCreator.exceptionWindowAction(
                            enums.ExceptionViewAction.Close
                        );
                        this.responseContainerProperty.isMessagePanelVisible = false;
                        this.responseContainerProperty.isExceptionPanelEdited = false;
                        if (
                            this.responseContainerProperty.navigateTo !== undefined &&
                            this.responseContainerProperty.navigateTo !== enums.SaveAndNavigate.none
                        ) {
                            popupHelper.navigateAway(this.responseContainerProperty.navigateTo);
                            this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
                        }
                        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
                        this.setState({
                            renderedOn: Date.now(),
                            isExceptionPanelVisible: false
                        });
                        break;
                    case enums.PopUpActionType.No:
                        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                        this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
                        break;
                }
                break;
            case enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        exceptionActionCreator.exceptionWindowAction(
                            enums.ExceptionViewAction.Open
                        );
                        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                        this.responseContainerProperty.isExceptionPanelEdited = false;
                        this.responseContainerProperty.isMessagePanelVisible = false;
                        this.setState({
                            isExceptionPanelVisible: true
                        });
                        this.onExceptionSelected(this.responseContainerProperty.exceptionId);
                        break;
                    case enums.PopUpActionType.No:
                        break;
                }
                break;
            case enums.PopUpType.DiscardExceptionOnNewMessage:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        this.createNewMessage();
                        break;
                    case enums.PopUpActionType.No:
                        break;
                }
                break;
            case enums.PopUpType.DiscardExceptionOnViewMessage:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        this.openMessage(this.responseContainerProperty.messageId);
                        exceptionActionCreator.exceptionWindowAction(
                            enums.ExceptionViewAction.Close
                        );
                        this.responseContainerProperty.isExceptionPanelEdited = false;
                        this.responseContainerProperty.isMessagePanelVisible = true;
                        this.setState({
                            isExceptionPanelVisible: false
                        });
                        break;
                    case enums.PopUpActionType.No:
                        break;
                }
                break;
        }
    };

    /**
     * Messages Loaded. Display the Message Panel details if required
     */
    protected onMessagesReceived = (
        isMessageReadCountChanged: boolean,
        selectedMessageId: number
    ) => {
        if (selectedMessageId > 0) {
            let msgs: Immutable.List<Message> = messageStore.instance.messages;
            this.responseContainerProperty.selectedMsg = msgs.find(
                (x: Message) => x.examinerMessageId === selectedMessageId
            );
            this.onMessageSelected(selectedMessageId);

            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * show saving indicator whil background save has triggered while marking same response for long time
     */
    protected onSaveMarksAndAnnotationsTriggered = () => {
        // This will show the save indicator only for background save.
        // this will prevent showing multiple save indicator while save and navigate
        // to next/previous response.
        if (this.responseContainerProperty.autoSaveTriggered) {
            this.showAndHideSavingIndicator(false);
            this.responseContainerProperty.autoSaveTriggered = false;
        }
    };

    /**
     * Saving started on navigating responses.
     */
    protected onSaveAndNavigateInitiated = (processSave?: boolean) => {
        this.showAndHideSavingIndicator(processSave === false ? false : true);
    };

    /**
     * Show or hide the save indicator.
     * @param {type} processSave
     */
    protected showAndHideSavingIndicator(processSave: boolean = false) {
        if (
            markingStore.instance.isResponseDirty(
                markingStore.instance.currentMarkGroupId,
                markingStore.instance.selectedQIGMarkGroupId
            )
        ) {
            this.setState({ isSaveIndicatorVisible: true });

            let that = this;

            // we have increased timeout to 2100 coz to let the fadeout show before
            // seting display to none
            setTimeout(() => {
                // Make sure QIG is still accessible. If it got withdrawn during save, Rendering will make problem
                // Added nonrecoverable error check due to blank screen display in background  while naviagtion.
                // if it has any non recoverable errors ,then no need to render response container again.
                // render of response container will cause the unmount of footer.
                let hasNonRecoverableErrors: boolean = markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(
                    markingStore.instance.currentMarkGroupId
                );
                if (qigStore.instance.selectedQIGForMarkerOperation && !hasNonRecoverableErrors) {
                    that.setState({ isSaveIndicatorVisible: false });
                }
            }, 2100);
        }
        if (processSave) {
            markingActionCreator.processSaveAndNavigation();
        }
    }

    /**
     * Will display delete message confirmation dialog
     */
    protected showDeleteMessagePopUp = (): void => {
        this.setState({ isDeleteMessagePopupVisible: true });
    };

    /**
     * Delete message confirmation dialog Yes click
     */
    protected onYesButtonDeleteMessageClick = (): void => {
        this.deleteMessage();
        this.responseContainerProperty.isDeleteMessageYesClicked = true;
        // hiding confirmation dialog
        this.setState({ isDeleteMessagePopupVisible: false });
    };

    /**
     * Delete message confirmation dialog No click
     */
    protected onNoButtonDeleteMessageClick = (): void => {
        // hiding confirmation dialog
        this.setState({ isDeleteMessagePopupVisible: false });
    };

    /**
     * Delete message.
     */
    protected deleteMessage() {
        let examinerList: number[] = [];
        examinerList[0] = 0;
        let args: messageArgument = {
            messageId: this.responseContainerProperty.selectedMsg.examinerMessageId,
            messageDistributionIds: this.responseContainerProperty.selectedMsg
                .messageDistributionIds,
            examinerMessageStatusId: enums.MessageReadStatus.Closed
        };

        // action for updating read status for the newly selected response.
        messagingActionCreator.updateMessageStatus(args);
    }

    /**
     * Load response on message deletion.
     */
    protected onMessageDeleted = (): void => {
        this.loadMessageFortheResponse();
        this.onCloseMessagePanel();
    };

    /**
     * Close message panel
     */
    protected onMessagePanelClose = (): void => {
        this.responseContainerProperty.selectedMsg = undefined;
        this.responseContainerProperty.isMessagePanelVisible = false;
        this.responseContainerProperty.isMessagePanelMinimized = false;
        // Show annotation toolbar on closing the message panel.
        this.responseContainerProperty.isToolBarPanelVisible = true;
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Update Previous Mark Selection
     */
    protected onUpdatepreviousMarkSelection = (): void => {
        this.responseContainerProperty.isPrevMarkListUnChecked = !markingStore.instance
            .previousMarkListColumnVisible;
    };

    /**
     * Called once panel is resized to left/right
     */
    protected onPanelResize = (): void => {
        this.getMessagePanelRightPosition();
        this.responseContainerProperty.cssMessageStyle = {
            right: this.responseContainerProperty.resizedWidth
        };
        this.setState({ renderedOn: Date.now() });
    };

    /*
     * Get the message panel position- including the clientwidth, left border, right border and scrollbar width
     */
    protected getMessagePanelRightPosition = (): void => {
        this.responseContainerProperty.markSchemeWidth = this.responseContainerHelper.getMarkSchemeWidth();

        let scrollBarWidth: number = this.responseContainerHelper.getscrollbarWidth();
        if (scrollBarWidth) {
            this.responseContainerProperty.scrollBarWidth = scrollBarWidth + 'px';
        } else {
            this.responseContainerProperty.scrollBarWidth = '0px';
        }
        this.responseContainerProperty.resizedWidth =
            this.responseContainerProperty.markButtonWidth +
            this.responseContainerProperty.markSchemeWidth +
            this.responseContainerProperty.scrollBarWidth;
    };

    /* Response Message section ends */

    /* on page comments - side view */
    protected toggleCommentsSideView = (
        enableSideView: boolean,
        disableOnDevices: boolean = false
    ): void => {
        this.responseContainerProperty.isOnPageCommentStamped = false;
        if (!disableOnDevices && !markerOperationModeFactory.operationMode.isAwardingMode) {
            userOptionsHelper.save(userOptionKeys.COMMENTS_SIDE_VIEW, String(enableSideView), true);
        }
        this.setState({
            isCommentsSideViewEnabled: enableSideView,
            renderedOn: Date.now()
        });

        // Log the comment side view state changes
        new loggingHelper().logCommentSideViewStateChanges(
            loggerConstants.MARKENTRY_REASON_COMMENT_SIDE_VIEW_CHANGED,
            loggerConstants.MARKENTRY_TYPE_COMMENT_SIDE_VIEW_CHANGED,
            enableSideView,
            markingStore.instance.currentMarkGroupId
        );
    };

    /**
     * Called when comment is removed from view (deleted or visibility changed)
     */
    protected handleMarksAndAnnotationsVisibility = (
        isMarksColumnVisibilitySwitched: boolean = false
    ): void => {
        if (isMarksColumnVisibilitySwitched) {
            this.responseContainerProperty.isPrevMarkListColumnVisible =
                markingStore.instance.previousMarkListColumnVisible;
        } else {
            this.responseContainerProperty.isPrevMarkListColumnVisible = false;
        }

        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * called when an annotation is removed
     */
    protected removeAnnotation = (): void => {
        //don't check for side view here as changes need to reflect in on page mode as well
        onPageCommentHelper.resetSideViewCollections();
        if (this.state.isCommentsSideViewEnabled) {
            stampActionCreator.renderSideViewComments();
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method called when remark now button is clicked
     */
    protected onRemarkNowButtonClicked = (): void => {
        let navigatePossible: boolean = true;
        let responseNavigationFailureReasons: Array<
            enums.ResponseNavigateFailureReason
            > = markingHelper.canNavigateAwayFromCurrentResponse();
        if (
            responseNavigationFailureReasons.indexOf(
                enums.ResponseNavigateFailureReason.UnSentMessage
            ) !== -1
        ) {
            // we have to display discard message warning if failure condition is unsendmessage only.
            // if multiple failure reasons are there then we will handle on that messages
            messagingActionCreator.messageAction(
                enums.MessageViewAction.NavigateAway,
                enums.MessageType.ResponseCompose,
                enums.SaveAndNavigate.toSupervisorRemark,
                enums.SaveAndNavigate.toSupervisorRemark
            );
        } else {
            this.confirmSupervisorRemarkCreation(true);
        }
    };

    /**
     * On discard response popup ok click
     */
    protected onDiscardStandardisationResponseIconClicked = (): void => {
        this.setState({
            isDiscardStandardisationPopupVisible: true
        });
    };

    /**
     * Method called when remark later button is clicked
     */
    protected onRemarkLaterButtonClicked = (): void => {
        this.confirmSupervisorRemarkCreation(false);
    };

    /**
     * Get Confirmation for supervisor remark for whole responses
     */
    private confirmSupervisorRemarkCreation = (isMarkNow: boolean): void => {
        let isWholeResponseRemark: boolean = responseStore.instance.isWholeResponse;
        this.responseContainerProperty.IsWholeResponseRemarkMarkNow = isMarkNow;

        if (isWholeResponseRemark) {
            this.setState({
                isWholeResponseRemarkConfirmationPopupVisible: true
            });
        } else {
            this.responseContainerHelper.createSupervisorRemark(isWholeResponseRemark, isMarkNow);
        }
    };

    /**
     * Method called when whole response remark confirmation yes button is clicked
     */
    protected onWholeResponseRemarkConfirmationYesClick = (): void => {
        this.setState({
            isWholeResponseRemarkConfirmationPopupVisible: false
        });
        this.responseContainerHelper.createSupervisorRemark(
            responseStore.instance.isWholeResponse,
            this.responseContainerProperty.IsWholeResponseRemarkMarkNow
        );
    };

    /**
     * Method called when whole response remark confirmation no button is clicked
     */
    protected onWholeResponseRemarkConfirmationNoClick = (): void => {
        this.setState({
            isWholeResponseRemarkConfirmationPopupVisible: false
        });
    };

    /**
     * On discard response popup ok click
     */
    protected onDiscardStandardardisationResponsePopupOkClick = (): void => {
        let responseData = undefined;
        if (responseStore.instance.selectedDisplayId) {
            responseData = standardisationSetupStore.instance.getResponseDetails
                (responseStore.instance.selectedDisplayId.toString());
        }
        let provRigIds: Array<Number> = new Array();
        provRigIds.push(responseData.esMarkGroupId);
        let candScriptids: Array<Number> = new Array();
        candScriptids.push(responseData.candidateScriptId);
        standardisationsetupActionCreator.discardStandardisationResponse(provRigIds, false,
            standardisationSetupStore.instance.examinerRoleId,
            standardisationSetupStore.instance.markSchemeGroupId, candScriptids, false,
            responseStore.instance.selectedDisplayId);
        this.setState({ isDiscardStandardisationPopupVisible: false });
    }

    /**
     * On Discard Action completed
     */
    protected onDiscardActionCompleted(isNextResponseAvailable: boolean) {
        if (isNextResponseAvailable) {
            let responseData = undefined;
            if (responseStore.instance.selectedDisplayId) {
                responseData = standardisationSetupStore.instance.getResponseDetails
                    (responseStore.instance.selectedDisplayId.toString());
            }
            // Refresh the grid once we updated the data.
            let stdWorklistView: enums.STDWorklistViewType =
                standardisationSetupStore.instance.isTotalMarksViewSelected ? enums.STDWorklistViewType.ViewTotalMarks :
                    enums.STDWorklistViewType.ViewMarksByQuestion;
            let selectedStandardisationSetupWorkList = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            let nextResponseId = markerOperationModeFactory.operationMode.nextResponseId(
                responseStore.instance.selectedDisplayId.toString());
            switch (selectedStandardisationSetupWorkList) {
                case enums.StandardisationSetup.ClassifiedResponse:
                    // refresh the worklist once reordered.
                    standardisationActionCreator.getClassifiedResponseDetails(
                        standardisationSetupStore.instance.examinerRoleId,
                        loginSession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        false, stdWorklistView).then(function (item: any) {
                            navigationHelper.responseNavigation(enums.ResponseNavigation.next, false, parseInt(nextResponseId));
                        });
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    let responseData = undefined;
                    if (responseStore.instance.selectedDisplayId) {
                        responseData = standardisationSetupStore.instance.getResponseDetails
                            (responseStore.instance.selectedDisplayId.toString());
                    }
                    // remove discard response from standardisation response worklist collection.
                    standardisationActionCreator.updateStandardisationResponseCollection(
                        responseData.esMarkGroupId,
                        standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                    );
                    navigationHelper.responseNavigation(enums.ResponseNavigation.next, false, parseInt(nextResponseId));
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    standardisationActionCreator.getUnClassifiedResponseDetails(
                        standardisationSetupStore.instance.examinerRoleId,
                        loginSession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        false, stdWorklistView).then(function (item: any) {
                            navigationHelper.responseNavigation(enums.ResponseNavigation.next, false, parseInt(nextResponseId));
                        });
                    break;
            }
        } else {
            // if next response is not available then load worklist.
            navigationHelper.loadStandardisationSetup();
        }
    }

    /**
     * On discard response popup cancel click
     */
    protected onDiscardStandardisationResponsePopupNoClicked = (): void => {
        this.setState({ isDiscardStandardisationPopupVisible: false });
    }

    /**
     * This Method will call when the remark later button is clicked
     */
    protected onPromoteToSeedButtonClicked = (): void => {
        let responseNavigationFailureReasons: Array<
            enums.ResponseNavigateFailureReason
            > = markingHelper.canNavigateAwayFromCurrentResponse();
        if (
            responseNavigationFailureReasons.indexOf(
                enums.ResponseNavigateFailureReason.UnSentMessage
            ) !== -1
        ) {
            // we have to display discard message warning if failure condition is unsendmessage only.
            // if multiple failure reasons are there then we will handle on that messages
            messagingActionCreator.messageAction(
                enums.MessageViewAction.NavigateAway,
                enums.MessageType.ResponseCompose,
                enums.SaveAndNavigate.toPromoteToSeed,
                enums.SaveAndNavigate.toPromoteToSeed
            );
        } else {
            if (markingStore.instance.currentResponseMarkingProgress === 100) {
                this.responseContainerHelper.showPromoteToSeedConfirmationPopup();
            } else {
                // if current responses marking progress is not 100% then display the promote to seed declined message.
                this.handlePromoteToSeedErrors(enums.PromoteToSeedErrorCode.NotFullyMarked);
            }
        }
    };

    /**
     * show Confirmation Dialog for promote to reuse button.
     */
    protected onPromoteToReuseButtonClicked = (): void => {
        // handling offline scenarios
        if (!applicationActionCreator.checkActionInterrupted()) {
            return;
        }

        if (markerOperationModeFactory.operationMode.isCRMConfirmationPopupVisible) {
            this.responseContainerProperty.crmFeedConfirmationPopupVisible = true;
        } else {
            this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible = true;
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This will promote selected response to reuse bucket.
     */
    protected onYesClickPromoteToReuseBucketConfirmationPopup = (): void => {
        let promoteToReuseBucketArguments: PromoteToReuseBucketArguments = {
            markGroupId: responseStore.instance.selectedMarkGroupId
        };

        responseActionCreator.promoteToReuseBucket(promoteToReuseBucketArguments);
    };

    /**
     * This will close the promote to reusebucket declined message.
     */
    protected onNoClickPromoteToReuseBucketConfirmationPopup = (): void => {
        this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible = false;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Re-rendering the to hide the pop up when promote to reusebutton button is clicked .
     */
    protected onPromoteToReuseCompleted = (): void => {
        this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible = false;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /*
    * Confirm review of managed slao popup OK button click
    */
    protected onConfirmCRMFeedPopupOkButtonClick = () => {
        this.responseContainerProperty.crmFeedConfirmationPopupVisible = false;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /*
    * Confirm standardisation additionpage popup OK button click
    */
    protected onStandardisationAdditionalPagePopupOkButtonClick = () => {
        this.isStdsetupAdditionalpageSeen = true;
        this.setState({
            isStandardisationAdditionalPagePopUpVisible: false
        });
    }

    /*
     * Confirm Withdrwn response popup ok button Click
     */
    protected onConfirmationWithdrwnResponsePopupClick = () => {
        this.responseContainerProperty.creatExceptionReturnWithdrwnResponseErrorPopupVisible = false;
        // if response is withrawn then navigate to worklist.
        navigationHelper.loadWorklist();
    };

    /*
     * Ok click action, of script unavailable popup.
     */
    protected okClickOnUnavailablePopUp = () => {
        this.setState({
            isScriptUnavailablePopUpVisible: false
        });

        navigationHelper.loadStandardisationSetup();

        // promise to get standardisation target details
        let getStandardisationTargetDetails = standardisationActionCreator.getStandardisationTargetDetails
            (standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);

        getStandardisationTargetDetails.then(function (item: any) {
            // load select Responses details on coming from response
            standardisationActionCreator.standardisationSetupTabSelection
                (enums.StandardisationSetup.SelectResponse,
                standardisationSetupStore.instance.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId);
        });
    }

    /*
    * Confirm Withdrwn response popup ok button Click
    */
    protected onConfirmationWithdrwnScriptInStmPopupClick = () => {
        this.responseContainerProperty.withdrawScriptInStmErrorPopUpVisible = false;
        // if response is withrawn then navigate to worklist.
        navigationHelper.loadStandardisationSetup();

        let centreId: number = standardisationSetupStore.instance.selectedCentreId;
        if (centreId) {
            let centrePartId: number = standardisationSetupStore.instance.standardisationSetupSelectedCentrePartId(
                centreId
            );

            standardisationActionCreator.standardisationSetupTabSelection(
                enums.StandardisationSetup.SelectResponse,
                standardisationSetupStore.instance.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId,
                true
            );

            standardisationActionCreator.getScriptsOfSelectedCentre(
                standardisationSetupStore.instance.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                centrePartId,
                false,
                standardisationSetupStore.instance.examinerRoleId,
                centreId
            );
        }
    };

    /**
     * This will close the promote to seed error message.
     */
    protected onOkClickPromoteToSeedErrorPopup = (): void => {
        this.responseContainerProperty.isPromoteToSeedErrorDialogVisible = false;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This will close the promote to seed declined message.
     */
    protected onOkClickPromoteToSeedConfirmationPopup = (): void => {
        if (!this.state.isPromoteToSeedButtonClicked) {
            let promoteToSeedArguments: PromoteToSeedArguments = {
                markGroupId: responseStore.instance.selectedMarkGroupId,
                examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                authorisedExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
                markSchemeGroupId:
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                responseMode: worklistStore.instance.getResponseMode,
                ignoreRemarks: true,
                isSTMSeed: false,
                examinerId: 0
            };

            this.setState({ isPromoteToSeedButtonClicked: true });
            responseActionCreator.promoteToSeed(promoteToSeedArguments);
        }
    };

    /**
     * This will close the promote to seed declined message.
     */
    protected onNoClickPromoteToSeedConfirmationPopup = (): void => {
        this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = false;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     *  On promote response to seed return
     */
    protected onPromoteToSeed = (errorCode: enums.PromoteToSeedErrorCode) => {
        this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = false;

        // Log response promoted as seed
        new responseScreenAuditHelper().logResponsePromotToSeedAction(
            loggerConstants.RESPONSESCREEN_REASON_RESPONSE_SCREEN_ACTION,
            loggerConstants.RESPONSESCREEN_TYPE_PROMOTE_TO_SEED,
            responseStore.instance.selectedDisplayId
        );

        if (errorCode === enums.PromoteToSeedErrorCode.None) {
            // Clear My Team List Cache to reflect the Target progress Count
            this.responseContainerProperty.storageAdapterHelper.clearTeamDataCache(
                teamManagementStore.instance.selectedExaminerRoleId,
                teamManagementStore.instance.selectedMarkSchemeGroupId
            );
            // we want to display the promoted seed response in closed worklist if ExaminerCenterExclusivity CC is on
            if (markerOperationModeFactory.operationMode.isRemoveResponseFromWorklistDetails) {
                let selectedDisplayId: string = responseStore.instance.selectedDisplayId.toString();
                // move to next response on promote to seed successful callback
                if (worklistStore.instance.isNextResponseAvailable(selectedDisplayId)) {
                    let responseMode: enums.ResponseMode = worklistStore.instance.getResponseMode;
                    let currentWorklistType: enums.WorklistType =
                        worklistStore.instance.currentWorklistType;
                    // Remove the current worklist item from collection to update Response navigation count on header.
                    worklistActionCreator.removeResponseFromWorklist(
                        currentWorklistType,
                        responseMode,
                        selectedDisplayId
                    );
                    navigationHelper.responseNavigation(enums.ResponseNavigation.next);
                } else {
                    // if next response is not available then load worklist.
                    navigationHelper.loadWorklist();
                }
                // When the response is not removed from worklist there is no need to navigate from the response
            } else {
                this.setState({
                    renderedOn: Date.now(),
                    isPromoteToSeedButtonClicked: false
                });
            }
        } else {
            // hide the popup
            this.setState({
                renderedOn: Date.now(),
                isPromoteToSeedButtonClicked: false
            });

            this.handlePromoteToSeedErrors(errorCode);
        }
    };

    /**
     * handle promote to seed errors.
     * @param {enums.PromoteToSeedErrorCode} errorCode
     */
    protected handlePromoteToSeedErrors = (errorCode: enums.PromoteToSeedErrorCode): void => {
        this.responseContainerHelper.setPromoteToSeedErrorVariables(errorCode);
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method to show pop up the create success popup
     * @param {number} markGroupId
     * @param {boolean} isMarkNowButtonClicked
     */
    protected showRemarkCreationSuccessPopup = (
        markGroupIds: Array<number>,
        isMarkNowButtonClicked: boolean
    ): void => {
        if (!isMarkNowButtonClicked) {
            this.responseContainerProperty.isRemarkCreatedPopUpVisible = true;
            this.setState({
                renderedOn: Date.now()
            });
        } else {
            this.openSuperVisorRemarkResponseFromSubordinatesWorklist(markGroupIds);
        }
    };

    /**
     * Method clicked when ok popup success
     */
    protected onOkClickRemarkCreationSuccessPopup = (): void => {
        this.responseContainerProperty.isRemarkCreatedPopUpVisible = false;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * open Super Visor Remark Response From Subordinate's Worklist
     * @markGroupId - Mark Group Id
     */
    protected openSuperVisorRemarkResponseFromSubordinatesWorklist = (
        markGroupIds: Array<number>
    ) => {
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let questionPaperId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        let authorisedExaminerRoleId = operationModeHelper.authorisedExaminerRoleId;
        let markingMethodId = qigStore.instance.selectedQIGForMarkerOperation.markingMethod;
        let isElectronicStandardisationTeamMember =
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
        let loggedInExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        let selectedExaminerId = operationModeHelper.subExaminerId;

        // Supervisor Remark is going to open, CHange the mode
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);

        // Get the QIG selector data
        qigSelectorActionCreator.getQIGSelectorData(markSchemeGroupId, true, true);

        // Construct the entity for Opening the response
        let searchedResponseData: SearchedResponseData = {
            approvalStatusId: enums.ExaminerApproval.Approved,
            displayId: null,
            markSchemeGroupId: markSchemeGroupId,
            examinerRoleId: authorisedExaminerRoleId,
            markingModeId: enums.MarkingMode.Remarking,
            responseMode: enums.ResponseMode.open,
            markGroupId: markGroupIds[0],
            esMarkGroupId: null,
            questionPaperId: questionPaperId,
            markingMethodId: markingMethodId,
            remarkRequestType: enums.RemarkRequestType.SupervisorRemark,
            messageId: 0,
            hasQualityFeedbackOutstanding: false,
            isDirectedRemark: true,
            isAtypical: false,
            loggedInExaminerId: loginSession.EXAMINER_ID,
            loggedInExaminerRoleId: loggedInExaminerRoleId,
            examinerId: selectedExaminerId,
            isElectronicStandardisationTeamMember: isElectronicStandardisationTeamMember,
            navigateToHelpExaminer: false,
            triggerPoint: enums.TriggerPoint.SupervisorRemark,
            isTeamManagement: false,
            wholeresponseMarkGroupIds: Immutable.fromJS(markGroupIds),
            isStandardisationSetup: false,
            standardisationSetupWorklistType: enums.StandardisationSetup.None
        };

        // Set the Response details in store
        responseActionCreator.setResponseDetails(searchedResponseData);

        // Load the data for QIG/worklist/Script etc
        responseSearchHelper.initiateSerachResponse(searchedResponseData);
    };

    /**
     * Show a popup informing the user that the response review has failed
     */
    protected setResponseAsReviewedFailureReceived = (
        failureCode: enums.FailureCode,
        warningMessageAction: enums.WarningMessageAction
    ): void => {
        if (
            failureCode !== enums.FailureCode.None &&
            warningMessageAction === enums.WarningMessageAction.SetAsReviewed
        ) {
            this.setState({ isBusy: false });
        }
    };

    /**
     * on clicking ok button of manage slao popup
     */
    protected onOkClickOfManageSLAOMessage() {
        this.setState({ isUnManagedSLAOPopupVisible: false });
    }

    /**
     * on clicking ok button of manage slao popup
     */
    protected onOkClickOfManageUnknownContentMessage() {
        this.setState({ isUnManagedImageZonePopUpVisible: false });
    }

    /**
     * on clicking ok button of manage unknown content popup in remark
     */
    protected onOkClickOfManageUnknownContentMessageInRemark() {
        this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked = true;
        this.setState({ isUnManagedImageZoneInRemarkPopUpVisible: false });
        responseActionCreator.setPageScrollInFRV();
    }

    /**
     * on clicking yes button of all slao managed confirmation popup
     */
    protected onYesClickAllSLAOsManagedConfirmationPopup() {
        this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = true;
        let that = this;
        // Reset the current stamp banner type before navigate to response.
        let resetBannerTypePromise = stampActionCreator.resetStampBannerType();
        Promise.all([resetBannerTypePromise]).then(() => {
            that.setState({ isAllSLAOManagedConfirmationPopupVisible: false });
            that.changeResponseViewMode();
        });
    }

    /**
     * on clicking no button of all slao managed confirmation popup
     */
    protected onNoClickAllSLAOsManagedConfirmationPopup() {
        this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = true;
        this.setState({ isAllSLAOManagedConfirmationPopupVisible: false });
        stampActionCreator.resetStampBannerType();
    }

    /**
     * on clicking yes button of all unknown content managed confirmation popup
     */
    protected onYesClickAllUnknownContentManagedConfirmationPopup() {
        this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked = true;
        let that = this;
        // Reset the current stamp banner type before navigate to response.
        let resetBannerTypePromise = stampActionCreator.resetStampBannerType();
        Promise.all([resetBannerTypePromise]).then(() => {
            that.setState({ isAllUnknownContentManagedConfirmationPopupVisible: false });
            that.changeResponseViewMode();
        });
    }

    /**
     * on clicking no button of all unknown content managed confirmation popup
     */
    protected onNoClickAllUnknownContentManagedConfirmationPopup() {
        this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked = true;
        this.setState({ isAllUnknownContentManagedConfirmationPopupVisible: false });
        stampActionCreator.resetStampBannerType();
    }

    /**
     * callback function for on all slaos managed
     */
    protected onAllSLAOManaged = (): void => {
        let treeItem = this.responseContainerProperty.treeViewHelper.treeViewItem();
        if (!this.responseContainerProperty.isPreviousMarksAndAnnotationCopying) {
            this.responseContainerProperty.isAllSLAOManagedConfirmationPopupRendered = true;
            this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = false;
            this.setState({ isAllSLAOManagedConfirmationPopupVisible: true });
        }
        this.responseContainerProperty.markHelper.updateAnnotationToolTips(
            this.responseContainerProperty.treeViewHelper.toolTipInfo
        );
    };

    /**
     * callback function for on all slaos managed
     */
    protected onAllUnknownContentManaged = (): void => {
        let treeItem = this.responseContainerProperty.treeViewHelper.treeViewItem();
        if (!this.responseContainerProperty.isPreviousMarksAndAnnotationCopying) {
            this.responseContainerProperty.isUnknownContentManagedConfirmationPopupRendered = true;
            this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked = false;
            this.setState({ isAllUnknownContentManagedConfirmationPopupVisible: true });
        }
        this.responseContainerProperty.markHelper.updateAnnotationToolTips(
            this.responseContainerProperty.treeViewHelper.toolTipInfo
        );
    };

    /**
     * Callback function for on link button click.
     */
    protected onLinkToPageButtonClick = (event: any, pageNumber: number): void => {
        let screenWidth = screen.width;
        let element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
        let popupContent = document.getElementById('popupcontent');
        if (popupContent) {
            // reset the scroll position when popup is opened
            popupContent.style.overflow = 'hidden';
            popupContent.scrollTop = 0;
            popupContent.style.overflow = 'auto';
        }
        this.responseContainerProperty.currentPageNumber = pageNumber;

        // get all the linked annotations and set to the global collection.
        let linkedAnnotations = pageLinkHelper.getAllLinkedItemsAgainstPage(
            this.responseContainerProperty.currentPageNumber
        );

        if (linkedAnnotations) {
            linkedAnnotations.map((annotation: annotation) => {
                let linkAnnotation = JSON.parse(JSON.stringify(annotation));
                this.responseContainerProperty.linkAnnotations = this.responseContainerProperty.linkAnnotations.set(
                    linkAnnotation.markSchemeId,
                    linkAnnotation
                );
            });
        }

        htmlUtilities.addClassToBody('popup-open');
        this.setState({
            isLinkToPagePopupShowing: true,
            linkToPageButtonLeft: element.getBoundingClientRect().left
        });
    };

    /* cancel button click for link to question popup */
    protected onLinkToPageCancelClick = (): void => {
        // clear the list when cancel button is clicked
        this.responseContainerProperty.linkAnnotations = Immutable.Map<number, annotation>();
        this.responseContainerProperty.linkAnnotationsToRemove = [];

        htmlUtilities.removeClassFromBody(' popup-open');
        this.setState({
            isLinkToPagePopupShowing: false
        });
    };

    /* ok button click for link to question popup */
    protected onLinkToPageOkClick = (): void => {
        // check if we need to show the popup before any unlink operation
        let doShowPopup: boolean = false;
        let numberOfLinks: number = pageLinkHelper.numberOfLinks(
            this.responseContainerProperty.currentPageNumber
        );
        this.responseContainerProperty.itemsWhichCantUnlink = [];
        doShowPopup = this.responseContainerHelper.doShowLinkToPageOkClickPopup(doShowPopup);

        if (doShowPopup) {
            this.setState({
                isLinkToPageErrorShowing: true
            });
            return;
        }

        this.responseContainerHelper.updateMarkingOperationOfAnnotation();

        this.responseContainerProperty.linkAnnotations.map(
            (annotation: annotation, markSchemeId: number) => {
                if (
                    annotation.isDirty &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    !pageLinkHelper.isLinkAnnotationAlreadyAdded(annotation.clientToken)
                ) {
                    numberOfLinks++;
                } else if (annotation.markingOperation === enums.MarkingOperation.deleted) {
                    numberOfLinks--;
                }
            }
        );

        /* if trying to unmanaging a SLAO by removing the last, then show a confirmation popup */
        if (this.canShowConfirmReviewOfSLAOPopup(numberOfLinks)) {
            this.setState({
                isConfirmReviewOfSLAOPopupShowing: true
            });

            return;
        }

        /* if trying to unmanaging a unknown content in Ebookmarking by removing the last link, then show a confirmation popup */
        if (this.canShowConfirmReviewOfUnknownContentPopup(numberOfLinks)
            && responseHelper.isUnkNownContentPage(this.responseContainerProperty.currentPageNumber)) {

            this.setState({
                isConfirmReviewOfUnknownContentPopupShowing: true
            });

            return;
        }
        // add or remove the annotation based on the marking operation
        this.addOrRemoveLinkAnnotation();

        // clear the lists after all the operations
        this.responseContainerProperty.linkAnnotations = Immutable.Map<number, annotation>();
        this.responseContainerProperty.linkAnnotationsToRemove = [];

        htmlUtilities.removeClassFromBody(' popup-open');
        this.setState({
            isLinkToPagePopupShowing: false
        });
    };

    /**
     * Add or remove link annotation
     */
    private addOrRemoveLinkAnnotation() {
        this.responseContainerProperty.linkAnnotations.map(
            (annotation: annotation, markSchemeId: number) => {
                if (
                    annotation.isDirty &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    !pageLinkHelper.isLinkAnnotationAlreadyAdded(annotation.clientToken)
                ) {
                    pageLinkHelper.addLinkAnnotation(
                        annotation,
                        undefined,
                        false,
                        this.responseContainerHelper.logAnnoataionModificationAction
                    );
                } else if (annotation.markingOperation === enums.MarkingOperation.deleted) {
                    pageLinkHelper.removeLinkAnnotation(
                        annotation,
                        this.responseContainerHelper.logAnnoataionModificationAction
                    );
                }
            }
        );
    }

    /**
     * Check whether review of unknown content popup displayable
     * @param numberOfLinks
     */
    private canShowConfirmReviewOfUnknownContentPopup(numberOfLinks: number): boolean {
        return (
            numberOfLinks === 0 &&
            (!responseHelper.hasUnManagedImageZone() ||
                (this.responseContainerProperty.isUnknownContentManagedConfirmationPopupRendered &&
                    this.responseContainerProperty
                        .isUnknownContentManagedConfirmationPopupButtonClicked)) &&
            !annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(
                this.responseContainerProperty.currentPageNumber,
                true
            ) &&
            responseHelper.isEbookMarking
        );
    }

    /**
     * Check whether review of SLAO popup displayable
     * @param numberOfLinks
     */
    private canShowConfirmReviewOfSLAOPopup(numberOfLinks: number): boolean {
        return (
            numberOfLinks === 0 &&
            (!responseHelper.hasUnManagedSLAOInMarkingMode ||
                (this.responseContainerProperty.isAllSLAOManagedConfirmationPopupRendered &&
                    this.responseContainerProperty
                        .isAllSLAOManagedConfirmationPopupButtonClicked)) &&
            scriptStore.instance.getAdditionalObjectFlagValue(
                this.responseContainerProperty.currentPageNumber
            ) &&
            !annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(
                this.responseContainerProperty.currentPageNumber,
                true
            )
        );
    }

    /**
     * add link annotation to the collection
     * @param markSchemeId
     * @param annotation
     */
    protected addLinkAnnotation = (
        node: treeViewItem,
        childNodes: Immutable.List<treeViewItem>,
        isChildrenSkipped: boolean,
        annotation: annotation
    ): void => {
        this.responseContainerHelper.addLinkAnnotation(
            node,
            childNodes,
            isChildrenSkipped,
            annotation
        );
    };

    /* remove link annotation from the collection */
    protected removeLinkAnnotation = (
        node: treeViewItem,
        childNodes: Immutable.List<treeViewItem>,
        isChildrenSkipped: boolean
    ): void => {
        if (isChildrenSkipped && childNodes) {
            // find the children of the node and add those to the remove link annotation collection
            childNodes.map((item: treeViewItem) => {
                this.addItemToLinkAnnotationLocalCollection(item);
            });
        }
        this.addItemToLinkAnnotationLocalCollection(node);
    };

    /**
     * add item to the remove link annotation collection
     * @param node
     */
    protected addItemToLinkAnnotationLocalCollection(node: treeViewItem) {
        if (this.responseContainerProperty.linkAnnotationsToRemove.indexOf(node.uniqueId) === -1) {
            this.responseContainerProperty.linkAnnotationsToRemove.push(node.uniqueId);
        }
    }

    /**
     * on click of link to page error dialog
     */
    protected onLinkToPageErrorDialogOkClick = () => {
        this.setState({
            isLinkToPageErrorShowing: false
        });
    };

    /**
     * get the message panel
     */
    protected getMessagePanel() {
        // show the message panel on complete image load and having message details to render
        // or on compose new message
        // or on new exception
        // or on having exception details to render
        if (
            (this.state.isImagesLoaded && this.responseContainerProperty.selectedMsgDetails) ||
            this.responseContainerProperty.messageType === enums.MessageType.ResponseCompose ||
            (this.responseContainerProperty.exceptionDetails ||
                this.responseContainerProperty.isNewException) ||
            (responseHelper.hasUnmanagedSLAO ||
                this.responseContainerHelper.hasUnManagedImageZone())
        ) {
            return (
                <div
                    id='messaging-panel'
                    key='messaging-panel'
                    style={this.responseContainerProperty.cssMessageStyle}
                    className={classNames(
                        'messaging-panel',
                        { 'show-exception': this.state.isExceptionPanelVisible },
                        { 'show-message': this.responseContainerProperty.isMessagePanelVisible }
                    )}
                    onClick={this.messageOnClickHandler}>
                    <Message
                        messageType={this.responseContainerProperty.messageType}
                        closeMessagePanel={this.onCloseMessagePanel}
                        selectedLanguage={this.props.selectedLanguage}
                        responseId={responseStore.instance.selectedDisplayId}
                        supervisorId={this.responseContainerProperty.examinerIdForSendMessage}
                        supervisorName={this.responseContainerProperty.examinerNameForSendMessage}
                        selectedMessage={this.responseContainerProperty.selectedMsg}
                        selectedMsgDetails={this.responseContainerProperty.selectedMsgDetails}
                        onMessageMenuActionClickCallback={this.onMessageMenuActionClick}
                        onMessageClose={this.onMessagePanelClose}
                        isMessagePanelVisible={this.responseContainerProperty.isMessagePanelVisible}
                    />
                    <Exception
                        closeExceptionPanel={this.onCloseExceptionPanel}
                        isNewException={this.responseContainerProperty.isNewException}
                        exceptionDetails={this.responseContainerProperty.exceptionDetails}
                        isExceptionPanelEdited={
                            this.responseContainerProperty.isExceptionPanelEdited
                        }
                        validateException={this.validateException}
                        selectedLanguage={this.props.selectedLanguage}
                        exceptionData={this.responseContainerProperty.exceptionData}
                        isExceptionPanelVisible={this.state.isExceptionPanelVisible}
                        hasUnManagedSLAO={
                            responseStore.instance.markingMethod ===
                                enums.MarkingMethod.Unstructured || responseStore.instance.markingMethod ===
                                enums.MarkingMethod.MarkFromObject ? (
                                    false
                                ) : (
                                    !this.responseContainerProperty.isSLAOManaged
                                )
                        }
                        currentQuestionItemInfo={markingStore.instance.currentQuestionItemInfo}
                        isFromMediaErrorDialog={
                            this.responseContainerProperty.isFromMediaErrorDialog
                        }
                        exceptionBody={this.responseContainerProperty.errorViewmoreContent}
                        hasUnmanagedImageZone={this.responseContainerHelper.hasUnManagedImageZone()}
                    />
                </div>
            );
        }
    }

    /**
     * Callback function for message menu action click
     * @param messageMenuActionType
     */
    protected onMessageMenuActionClick = (messageMenuActionType: enums.MessageAction) => {
        if (
            !messageStore.instance.isMessagePanelActive ||
            this.responseContainerProperty.messageType === enums.MessageType.ResponseDetails
        ) {
            this.setvariablesforReplyForward(messageMenuActionType);
        } else {
            let responseNavigationFailureReasons: Array<
                enums.ResponseNavigateFailureReason
                > = markingHelper.canNavigateAwayFromCurrentResponse();
            if (messageMenuActionType === enums.MessageAction.Reply) {
                popupHelper.navigateAwayFromResponse(
                    responseNavigationFailureReasons,
                    enums.SaveAndNavigate.toReplyMessage
                );
            } else if (messageMenuActionType === enums.MessageAction.Forward) {
                popupHelper.navigateAwayFromResponse(
                    responseNavigationFailureReasons,
                    enums.SaveAndNavigate.toForwardMessage
                );
            }
        }
        if (messageMenuActionType === enums.MessageAction.Delete) {
            messagingActionCreator.messageAction(
                enums.MessageViewAction.Delete,
                enums.MessageType.ResponseDelete
            );
        }
    };

    /**
     * This method will set variables for Reply and Forward
     */
    protected setvariablesforReplyForward = (messageMenuActionType: enums.MessageAction) => {
        if (messageMenuActionType !== enums.MessageAction.Delete) {
            this.responseContainerHelper.setVariablesForReplyForward(messageMenuActionType);
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * Invokes the busy indicator of response review operation
     */
    protected invokeReviewBusyIndicator =
        (busyIndicatorInvoker: enums.BusyIndicatorInvoker = enums.BusyIndicatorInvoker.loadingModules) => {
            this.setBusyIndicatorProperties(busyIndicatorInvoker, false);
            this.setState({ isBusy: applicationStore.instance.isOnline });
        };

    /**
     * shows the confirmation popup on logout based on the ask on logout value.
     * @param pageNumber
     */
    protected showUnManagedSLAOFlagAsSeenPopUP = (pageNumber: number) => {
        this.setState({ showUnmanagedSLAOFlagAsSeenPopUp: true });
        this.responseContainerProperty.slaoFlagAsSeenClickedPageNumber = pageNumber;
    };

    /**
     * on clicking ok button of unmanaged slao popup
     */
    protected unManagedSLAOFlagAsSeenPopUpOKButtonClick = () => {
        this.setState({ showUnmanagedSLAOFlagAsSeenPopUp: false });
        responseActionCreator.doStampFlagAsSeenAnnotation(
            this.responseContainerProperty.slaoFlagAsSeenClickedPageNumber
        );
    };

    /**
     * on clicking cancel button of unmanaged slao popup
     */
    protected unManagedSLAOFlagAsSeenPopUpCancelButtonClick = () => {
        this.setState({ showUnmanagedSLAOFlagAsSeenPopUp: false });
    };

    /**
     * shows the flag as seen popup in unknown content management
     * @param pageNumber
     */
    protected showUnKnownContentFlagAsSeenPopUP = (pageNumber: number) => {
        this.setState({ showUnKnownContentFlagAsSeenPopUp: true });
        this.responseContainerProperty.unKnownContentFlagAsSeenClickedPageNumber = pageNumber;
    };

    /**
     * on clicking ok button of unknown content flag as seen popup
     */
    protected unKnownContentFlagAsSeenPopUpOKButtonClick = () => {
        this.setState({ showUnKnownContentFlagAsSeenPopUp: false });
        responseActionCreator.doStampFlagAsSeenAnnotation(
            this.responseContainerProperty.unKnownContentFlagAsSeenClickedPageNumber
        );
    };

    /**
     * on clicking cancel button of unknown content flag as seen popup
     */
    protected unKnownContentFlagAsSeenPopUpCancelButtonClick = () => {
        this.setState({ showUnKnownContentFlagAsSeenPopUp: false });
    };

    /**
     *
     */
    protected showRejectRigConfirmationPopUp = () => {
        markingActionCreator.removeMarkEntrySelection();
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.RejectRigConfirmationPopUp);
        this.setState({ isRejectRigPopUpVisible: true });
    };

    /**
     * reject response ok button click
     */
    protected onRejectRigOkButtonClick = () => {
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, true);
        this.responseClosed();
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.RejectRigConfirmationPopUp);
        markingActionCreator.setMarkEntrySelected(false);
        this.setState({
            isRejectRigPopUpVisible: false,
            isBusy: true
        });
        responseActionCreator.doRejectResponse(responseStore.instance.selectedDisplayId);

        // Log response rejected action.
        new responseScreenAuditHelper().logResponseRejectAction(
            loggerConstants.RESPONSESCREEN_REASON_RESPONSE_SCREEN_ACTION,
            loggerConstants.RESPONSESCREEN_TYPE_REJECT_RIG,
            responseStore.instance.selectedDisplayId
        );
    };

    /**
     * Reject response cancel button click
     */
    protected onRejectRigCancelButtonClick = () => {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.RejectRigConfirmationPopUp);
        markingActionCreator.setMarkEntrySelected(false);
        this.setState({ isRejectRigPopUpVisible: false });
    };

    /**
     *
     */
    protected handleNavigationOnRejectResponse = (isNextResponseAvailable: boolean) => {
        if (isNextResponseAvailable) {
            // remove rejected response from worklist collection.
            responseActionCreator.updateResponseCollection(
                responseStore.instance.selectedMarkGroupId,
                worklistStore.instance.currentWorklistType
            );
            navigationHelper.responseNavigation(enums.ResponseNavigation.next);
        } else {
            // if next response is not available then load worklist.
            navigationHelper.loadWorklist();
        }
    };

    /**
     * Display the popup
     */
    protected onPromoteToSeedCheckRemark = () => {
        this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = true;
        if (
            responseStore.instance.promoteseedremarkrequestreturn.promoteToSeedError ===
            enums.PromoteToSeedErrorCode.ResponseHasRemarks
        ) {
            this.responseContainerProperty.promoteToSeedDialogType =
                enums.PopupDialogType.PromoteToSeedRemarkConfirmation;
        } else if (
            responseStore.instance.promoteseedremarkrequestreturn.promoteToSeedError ===
            enums.PromoteToSeedErrorCode.None
        ) {
            this.responseContainerProperty.promoteToSeedDialogType =
                enums.PopupDialogType.PromoteToSeedConfirmation;
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     *  This will call on update exception status received
     */
    protected onUpdateExceptionStatusReceived = (
        doNavigateToTeamManagement: boolean = false,
        updateExceptionStatusErrorCode: enums.ReturnErrorCode
    ) => {
        // if the reponse is deallocated ,then show a poup that indicating response has withdrwan.
        if (updateExceptionStatusErrorCode === enums.ReturnErrorCode.DeallocatedResponse ||
            updateExceptionStatusErrorCode === enums.ReturnErrorCode.WithdrawnResponse) {
            this.responseContainerProperty.withdrwnResponseErrorPopupVisible = true;
            this.setState({
                renderedOn: Date.now()
            });
        } else {
            if (doNavigateToTeamManagement) {
                teamManagementActionCreator.getTeamManagementOverviewCounts(
                    teamManagementStore.instance.selectedExaminerRoleId,
                    teamManagementStore.instance.selectedMarkSchemeGroupId);
                teamManagementActionCreator.getUnactionedExceptions(
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                navigationHelper.loadTeamManagement();
            } else {
                exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode,
                    markerOperationModeFactory.operationMode.isAwardingMode);
                this.onCloseExceptionPanel(true);
            }
        }
    }

    /*
     * Confirm review of slao popup OK button click
     */
    protected onConfirmReviewOfSLAOPopupOkButtonClick = () => {
        this.responseContainerHelper.onConfirmReviewOfSLAOPopupOkButtonClick();
        this.setState({
            isConfirmReviewOfSLAOPopupShowing: false,
            isLinkToPagePopupShowing: false
        });
    };

    /*
     * Confirm review of unknown content popup OK button click
     */
    protected onConfirmReviewOfUnknownContentPopupOkButtonClick = () => {
        this.responseContainerHelper.onConfirmReviewOfUnknownContentPopupOkButtonClick();
        this.setState({
            isConfirmReviewOfUnknownContentPopupShowing: false,
            isLinkToPagePopupShowing: false
        });
    };

    /*
    * Confirm review of managed slao popup OK button click
    */
    protected onConfirmReviewOfMangedSLAOPopupOkButtonClick = () => {
        this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = false;
        this.setState({
            isConfirmReviewOfMangedSLAOPopupShowing: false
        });
    };

    /*
     * Confirm review of slao popup Cancel button click
     */
    protected onConfirmReviewOfSLAOPopupCancelButtonClick = (): void => {
        this.setState({
            isConfirmReviewOfSLAOPopupShowing: false
        });
    };

    /*
     * Confirm review of slao popup Cancel button click
     */
    protected onConfirmReviewOfUnknownContentPopupCancelButtonClick = (): void => {
        this.setState({
            isConfirmReviewOfUnknownContentPopupShowing: false
        });
    };

    /**
     * Checking whether Not all page annotated popup should be visible.
     */
    protected showCombinedPopupMessage = (navigateTo: enums.SaveAndNavigate): void => {
        this.responseContainerHelper.showCombinedPopupMessage(
            navigateTo,
            this.showCombinedMessagePopup
        );
    };

    /**
     * set state to hide combined message popup
     */
    protected showCombinedMessagePopup = () => {
        this.setState({ isCombinedWarningMessagePopupVisible: true });
    };

    /**
     * set state to show combined message popup
     */
    protected hideCombinedMessagePopup = () => {
        this.setState({ isCombinedWarningMessagePopupVisible: false });
    };

    /**
     * reset Warning flags on reject rig.
     */
    protected resetWarningFlagsOnResponseReject = () => {
        this.responseContainerProperty.isExceptionPanelEdited = false;
    };

    /**
     * on click of combined warning message popup primary button
     */
    public onCombinedWarningPopupPrimaryButtonClick = (warningType?: enums.WarningType) => {
        this.responseContainerHelper.onCombinedWarningPopupPrimaryButtonClick(
            this.onLeaveResponseClick,
            this.hideCombinedMessagePopup,
            warningType
        );
    };

    /**
     * on click of combined warning message popup primary button
     */
    public onCombinedWarningPopupSecondaryButtonClick = () => {
        this.responseContainerHelper.onCombinedWarningPopupSecondaryButtonClick(
            this.hideCombinedMessagePopup
        );
    };

    /**
     * Show a popup informing the user that the response review has failed
     */
    protected setResponseAsReviewed = (reviewResponseDetails: ReviewedResponseDetails): void => {
        this.setState({ isBusy: false });

        switch (reviewResponseDetails.reviewResponseResult) {
            case enums.SetAsReviewResult.AlreadyReviewedBySomeone:
                this.responseContainerProperty.reviewPopupTitle = localeStore.instance.TranslateText(
                    'team-management.response.already-reviewed-dialog.header'
                );
                this.responseContainerProperty.reviewPopupContent = localeStore.instance.TranslateText(
                    'team-management.response.already-reviewed-dialog.body'
                );
                this.responseContainerProperty.reviewPopupDialogType =
                    enums.PopupDialogType.ResponseAlreadyReviewed;
                this.setState({ isResponseReviewFailedPopupVisible: true });
                break;
        }
    };

    /**
     * on clicking OK button for response reviewed failed message popup
     */
    protected onOkClickOfResponseReviewFailedMessage() {
        this.responseContainerProperty.markSchemeRenderedOn = Date.now();
        this.setState({ isResponseReviewFailedPopupVisible: false });
    }

    /**
     * set variables on previous marks and annotations are copied
     */
    protected onPreviousMarksAnnotationCopied = (): void => {
        this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = true;
        this.responseContainerProperty.isPreviousMarksAndAnnotationCopying = false;

        this.setState({
            isBusy: false,
            isUnManagedSLAOPopupVisible: this.isUnManagedSLAOPopUpVisible(
                this.state.selectedViewMode
            ),
            isUnManagedImageZonePopUpVisible: this.isUnManagedImageZonePopUpVisible(
                this.state.selectedViewMode
            ),
            isConfirmReviewOfMangedSLAOPopupShowing:
                this.responseContainerHelper.isPreviousMarksAndAnnotationCopiedInSLAOMode &&
                !responseHelper.hasUnManagedSLAOInMarkingMode,
            isUnManagedImageZoneInRemarkPopUpVisible: this.canChangeToFRVonRemarkUnknownContent(),
            selectedViewMode: this.canChangeToFRVonRemarkUnknownContent()
                ? enums.ResponseViewMode.fullResponseView
                : this.state.selectedViewMode
        });

        // moving to full response view.
        if (this.canChangeToFRVonRemarkUnknownContent()) {
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
        }
    };

    /**
     * This method this called on message panel close.
     */
    protected closeResponseMessageDetails = () => {
        // Defect fix: #48317 we will call onMessagePanelClose() if messageType is ResponseDetails other wise onMessagePanelClose()
        // will call as a callback function from Subject
        if (this.responseContainerProperty.messageType === enums.MessageType.ResponseDetails) {
            // Show annotation toolbar on closing the message panel.
            this.responseContainerProperty.isToolBarPanelVisible = true;
            this.onMessagePanelClose();
        }
    };

    /**
     * resets all ui dropdown panel values
     */
    protected resetUIDropdownStatus = () => {
        messagingActionCreator.isMessageSidePanelOpen(false);
        exceptionActionCreator.isExceptionSidePanelOpen(false);
        zoomPanelActionCreator.zoomOptionClicked(false);
        userInfoActionCreator.userInfoClicked(false);
        markSchemeStructureActionCreator.markSchemeHeaderDropDown(false);
    };

    /**
     * Load Tyny MCE
     * @protected
     * @memberof MessageContainer
     */
    protected loadTinyMCE() {
        let url: string = htmlUtilities.getFullUrl(urls.TINYMCE_URL);
        // If tinyMCE script is not loaded then load that
        if (!htmlUtilities.isScriptLoaded(url)) {
            const script = document.createElement('script');
            script.src = url;
            //script.async = true;
            script.onload = this.dependenciesLoaded.bind(this);
            document.body.appendChild(script);
        } else {
            this.dependenciesLoaded();
        }
    }

    /**
     * Method to load dependencies
     */
    protected dependenciesLoaded() {
        this.setState({ scriptLoaded: true });
    }

    /**
     * We will load worklist after the validation - Defect fix #49590
     */
    protected examinerValidated(
        failureCode: enums.FailureCode = enums.FailureCode.None,
        examinerDrillDownData: ExaminerDrillDownData,
        examinerValidationArea: enums.ExaminerValidationArea
    ) {
        if (
            failureCode === enums.FailureCode.None &&
            (examinerValidationArea === enums.ExaminerValidationArea.TeamWorklist ||
                examinerValidationArea === enums.ExaminerValidationArea.HelpExaminer)
        ) {
            navigationHelper.loadWorklist();
        }
    }

    /**
     * Self destruct loading indicator
     */
    protected autoKillLoadingIndicator = () => {
        this.responseContainerProperty.isLoadingResponseScreen = false;
        this.setState({ isBusy: false });
    };

    /**
     * on enhanced off page comment delete button Clicked
     * @protected
     */
    protected onEnhancedOffPageActionButtonsClicked = (
        buttonAction: enums.EnhancedOffPageCommentAction,
        clientToken?: string,
        isCommentVisible?: boolean,
        markSchemeToNavigate?: treeViewItem
    ) => {
        this.responseContainerHelper.onEnhancedOffPageActionButtonsClicked(
            buttonAction,
            this.enhancedOffPageCommentPopUpReRender,
            clientToken,
            isCommentVisible,
            markSchemeToNavigate
        );
    };

    /**
     * to ren render the enhancedOffPageCommentPopUp
     */
    protected enhancedOffPageCommentPopUpReRender = () => {
        this.setState({ isEnhancedOffPageCommentPopUpVisible: true });
    };

    /**
     * On Confirmation No Button clicked for enhanced off page comment action
     */
    protected onCommentConfirmationNoButtonClicked = () => {
        if (this.responseContainerProperty.enhancedOffPageCommentDetails.isDetailViewEnabled) {
            htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
        }
        this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow = false;
        this.responseContainerProperty.enhancedOffPageButtonAction = undefined;
        this.setState({ isEnhancedOffPageCommentPopUpVisible: false });
    };

    /**
     * On Confirmation Yes Button clicked for enhanced off page comment action
     */
    protected onCommentConfirmationYesButtonClicked = () => {
        // If button action is visibility change we need to fire the visibility action
        if (
            this.responseContainerProperty.enhancedOffPageButtonAction ===
            enums.EnhancedOffPageCommentAction.Visibility
        ) {
            this.responseContainerProperty.enhancedOffPageButtonAction = undefined;
            enhancedOffPageCommentActionCreator.updateEnhancedOffPageCommentsVisibility(
                this.responseContainerProperty.isEnhancedOffPageCommentVisible
            );
        } else if (
            this.responseContainerProperty.enhancedOffPageButtonAction ===
            enums.EnhancedOffPageCommentAction.MarkSchemeNavigation
        ) {
            this.responseContainerProperty.enhancedOffPageButtonAction = undefined;
            enhancedOffPageCommentActionCreator.updateEnhancedOffPageCommentsVisibility(
                this.responseContainerProperty.isEnhancedOffPageCommentVisible,
                this.responseContainerProperty.enhancedOffPageCommentMarkSchemeToNavigate
            );
        } else if (this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow) {
            this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow = false;
            enhancedOffPageCommentActionCreator.switchEnhancedOffPageComments();
        }
        enhancedOffPageCommentActionCreator.saveEnhancedOffpageComments(
            this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated,
            this.responseContainerProperty.enhancedOffPageCommentMarkingOperation
        );
        this.setState({ isEnhancedOffPageCommentPopUpVisible: false });
    };

    /**
     * This call back method will update the enhanced off page comment details
     * @protected
     * @memberof ImageContainer
     */
    protected updateEnhancedOffPageCommentDetails = (
        enhancedOffPageCommentDetailView: EnhancedOffPageCommentDetailViewDetails
    ) => {
        this.responseContainerProperty.enhancedOffPageCommentDetails = enhancedOffPageCommentDetailView;
    };

    /**
     * This method will call on Enhanced off-page comments visibility is changed.
     * @protected
     * @memberof ImageContainer
     */
    protected handleEnhancedOffPageCommentsVisibility = (isVisible: boolean) => {
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Set favorite toolbar column count status.
     */
    protected setHasMultipleToolbarColumns = (hasMultipleColumns: boolean) => {
        this.setState({ hasMultipleToolbarColumns: hasMultipleColumns });
    };

    /**
     * set hasElementsToRenderInFRV
     * @param hasElementsToRender
     */
    protected hasElementsToRenderInFRViewMode = (hasElement: boolean): void => {
        this.setState({ hasElementsToRenderInFRV: hasElement });
    };

    /**
     * Clear the enhanced off page comment data response is changed
     */
    protected clearCommentDetailsOnResponseChanged = (): void => {
        this.responseContainerProperty.enhancedOffPageCommentDetails = undefined;
    };

    /**
     * reRender for appending current marks classname for enhanced offpage comments.
     */
    protected renderedOnEnhancedOffpageComments = (): void => {
        this.setState({ renderedOnEnhancedOffpageComments: Date.now() });
    };

    /**
     * This will show discard popup while switching between comments from MarkSchemePanel header dropdown
     * @protected
     * @memberof MarkSchemePanel
     */
    protected showEnhancedOffPageCommentDiscardPopup = () => {
        this.responseContainerProperty.confirmationDialogueContent = localeStore.instance.TranslateText(
            'marking.response.discard-enhanced-off-page-comment-other-set-confirmation-dialog.body'
        );
        this.responseContainerProperty.confirmationDialogueHeader = localeStore.instance.TranslateText(
            'marking.response.discard-enhanced-off-page-comment-other-set-confirmation-dialog.header'
        );
        this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow = true;
        this.setState({ isEnhancedOffPageCommentPopUpVisible: true });
    };

    /**
     * Actions to be done when online status changed
     */
    private onOnlineStatusChanged = () => {
        let isBusy = this.state.isBusy;
        if (!applicationStore.instance.isOnline) {
            // close promote to seed confirmation popup if it is showing.
            if (this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible) {
                this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = false;
            }

            // if online status updated while clicking on create new message, then show offline popup and isCreateNewMessageSelected
            if (this.responseContainerProperty.isCreateNewMessageSelected) {
                this.responseContainerProperty.isCreateNewMessageSelected = false;
                applicationActionCreator.checkActionInterrupted();
            }

            if (this.state.isBusy) {
                /*In offline scenario the loading indicator comes with the offline popup on set as reviewed button click
                Hiding the loading indicator to handle this. */
                isBusy = false;
            }
            /*In offline scenario when response is opened by clicking on the linked message icon annotation panel will be
            blank and message will not be loaded, so loading the close event of message panel to show annotation panel */
            if (
                this.responseContainerProperty.messageType === enums.MessageType.ResponseDetails &&
                this.responseContainerProperty.selectedMsgDetails === undefined &&
                !this.responseContainerProperty.isMessagePanelVisible
            ) {
                this.onMessagePanelClose();
            }

            this.setState({
                isBusy: isBusy,
                renderedOn: Date.now()
            });
        } else {
            // Updating the latest Message list when comes to online Defect #58997
            if (
                messageStore.instance.messages === null ||
                messageStore.instance.messages === undefined
            ) {
                this.loadMessageFortheResponse();
            }
            // Updating the latest exception list when comes to online Defect #58997
            if (
                (exceptionsStore.instance.getExceptionData === null ||
                    exceptionStore.instance.getExceptionData === undefined) &&
                !markerOperationModeFactory.operationMode.isStandardisationSetupMode
            ) {
                exceptionHelper.getNewExceptions(
                    markerOperationModeFactory.operationMode.isTeamManagementMode,
                    markerOperationModeFactory.operationMode.isAwardingMode
                );
            }

            if (this.responseContainerProperty.isCreateNewMessageSelected) {
                // if online status updated while clicking on create new message and the system is in online mode,
                // then proceed to create new message and reset isCreateNewMessageSelected

                this.createNewMessage();
                this.responseContainerProperty.isCreateNewMessageSelected = false;
            }
            if (!this.state.imagesLoaded) {
                // in offline scenario if the images are not loaded and modules are loaded, then never load the image container.
                // So load images if it is not loaded already
                this.loadScriptImages();
            }
        }
    };

    /**
     * check online status
     */
    private checkOnlineStatusComposeMessage() {
        /* Will request tinymce font when open a compose message panel first time
        (ie, when render message right panel component first time). If open the panel in offline mode,
        then the font request will get failed and thus the font family buttons are not visible.
        Since this request is happens only once, the font family buttons are not visible during that session.
        So we first do a ping and check the network status and if the system is in online,
        then proceed the message compose action. If the system is in offline mode,
        then shows offline popup and don’t proceed the message action.*/
        if (applicationStore.instance.isOnline) {
            /*Each time Create New Message is clicked a ping is sent to validate the network status ,
            to avoid this calling createnewmessage based on a variable in message store*/
            if (messageStore.instance.isMessagePanelOpened) {
                this.createNewMessage();
            } else {
                this.responseContainerProperty.isCreateNewMessageSelected = true;
                applicationActionCreator.validateNetWorkStatus(true);
            }
        } else {
            applicationActionCreator.checkActionInterrupted();
        }
    }

    /**
     * Set background save time interval for responses
     */
    protected setBackgroundSaveTimeInterval = () => {
        //set background call for saving marks and annotations to queue.
        if (
            worklistStore.instance.getResponseMode !== enums.ResponseMode.closed ||
            !markerOperationModeFactory.operationMode.isTeamManagementMode
        ) {
            // if the value mentioned in config file then consider that value
            // else take the default value
            if (
                config.marksandannotationsconfig.AUTOSAVE_MARKS_AND_ANNOTATIONS_IN_RESPONSE_INTERVAL
            ) {
                this.responseContainerProperty.autoSaveTimerInterval =
                    config.marksandannotationsconfig.AUTOSAVE_MARKS_AND_ANNOTATIONS_IN_RESPONSE_INTERVAL;
            }
            this.autoSaveTimeInterval = timerHelper.setInterval(
                this.responseContainerProperty.autoSaveTimerInterval,
                () => {
                    if (markinghelper.isAutoSaveMarksAndAnnotation()) {
                        marksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue(true);
                        this.responseContainerProperty.autoSaveTriggered = true;
                    }
                },
                this.autoSaveTimeInterval
            );
        }
    };

    /**
     * Display Warning Popup if Response has an open zoning exception
     * (Zoning Error Missing Content, Zoning Error Other Content) raised
     */
    protected displayZoningExceptionWarningPopup = (): void => {
        if (markerOperationModeFactory.operationMode.hasZoningExceptionWarningPopup) {
            this.setState({ isZoningExceptionWarningPopupVisible: true });
        }

        this.setState({ doShowExceptionWarningPopUp: false });
    };

    /**
     * Close Zoning Exception Warning Popup after clicking OK button
     */
    protected closeZoningExceptionWarningPopup = (): void => {
        this.setState({
            isZoningExceptionWarningPopupVisible: false,
            isUnManagedImageZonePopUpVisible: this.isUnManagedImageZonePopUpVisible(
                this.state.selectedViewMode
            )
        });
    };

    /*
     * Confirm of Withdrwn response popup ok button Click
     */
    protected onWithdrwnResponseErrorPopup = () => {
        this.responseContainerProperty.withdrwnResponseErrorPopupVisible = false;
        // If the exception is actioned from Exception through temamanagement
        // then load the teammanagement for refresh
        if (teamManagementStore.instance.isRedirectFromException) {
            navigationHelper.loadTeamManagement();
        } else if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
            /* Clear cache of current worklist  */
            this.responseContainerProperty.storageAdapterHelper.clearCache
                (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType),
                worklistStore.instance.getRemarkRequestType,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                worklistStore.instance.currentWorklistType);
            // if we deallocate a response which is in the directed remark worklist
            // then target summary store will get update accordingly
            // but the worklist type will  be remain same as directed remark even if it has no response in the remark worklist
            // so directly assigning the worklist type to live irrespevtive of the directed remark response count.
            worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                enums.WorklistType.live,
                enums.ResponseMode.open,
                enums.RemarkRequestType.Unknown,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                false);
            // if response is withrawn then navigate to worklist.
            navigationHelper.loadWorklist();
        } else {
            // if response is withrawn then navigate to worklist.
            navigationHelper.loadWorklist();
        }
    };

    /*
    * Confirm of session closed response popup ok button Click
    */
    protected onSessionClosedErrorPopup = () => {
        this.setState({
            sessionClosedErrorPopupVisible: false
        });
        // clear cache qigselector data after session close popup button click.
        this.responseContainerProperty.storageAdapterHelper.clearCacheByKey(
            'qigselector',
            'overviewdata'
        );
        // if response is session closed then navigate to qig selector.
        navigationHelper.loadQigSelector();
    };

    /**
     * Reload image zone collection when navigate from message inbox, overview.
     */
    private onEbookMarkingZonesLoaded = (): void => {
        // Need render the nondigitalContainer once the imagezone collection is loaded
        this.setState({
            imagesLoaded: false
        });
        this.responseContainerProperty.scriptHelper.resetImageZoneCollection();
        this.loadScriptImages();
    };

    /**
     * Rerenders on marking overlay visiblity change.
     */
    protected doDisableMarkingOverlay = () => {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarkingOverlay);
        toolbarActionCreator.setMarkingOverlayVisiblity(false);
        this.setState({ isMarkingOverlayVisible: Date.now() });
    };

    /**
     * Marking overlay.
     */
    protected markingOverlay = () => {
        let overlayElement: JSX.Element = null;
        if (this.responseContainerHelper.doShowMarkingOverlay() &&
            this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView) {
            overlayElement = (
                <div
                    id='preventMarkingOverlay'
                    className='prevent-marking-overlay show'
                    onTouchMove={this.onTouchMove}>
                    {' '}
                </div>
            );
            toolbarActionCreator.setMarkingOverlayVisiblity(true);
        }
        return overlayElement;
    };

    /**
     * On viewing Exception in view mode.
     */
    protected onExceptionInViewMode = () => {
        if (
            stampStore.instance.isFavouriteToolbarEmpty &&
            stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner
        ) {
            this.setState({ isMarkingOverlayVisible: Date.now() });
        }
    };

    /**
     * On moving in touch.
     */
    private onTouchMove(event: any) {
        /**
         * To prevent the scrolling in ipad.
         */
        event.preventDefault();
    }

    /**
     * Popup element for handled erros on sending message
     */
    private showMessageSendErrorPopup = () => {
        this.setState({ isMessageSendErrorPopupVisible: true });
    };

    /**
     * Close the generic send error message popups.
     */
    private onMessageSendingErroPopupClose = () => {
        this.setState({ isMessageSendErrorPopupVisible: false });
        // Navigate to worklist after closing the error popup.
        navigationHelper.loadWorklist();
    };

    /**
     * Popup element for script unavailable popup.
     */
    private showScriptUnavailablePopUp = (errorInRigCreation: boolean) => {
        if (errorInRigCreation) {
            this.setState({ isScriptUnavailablePopUpVisible: true });
        }
    };

    /**
     * On Script unavailable.
     */
    private unClassifiedScriptinStmUnavailable = () => {
        this.setState({
            isBusy: false
        });
    }

	/**
	 * Action when the yes button of return response to marker confirmation is clicked
	 */
    protected onYesClickOfReturnResponseToMarkerConfirmation() {
        this.invokeReviewBusyIndicator(enums.BusyIndicatorInvoker.returnResponse);
        this.setState({ isReturnResponseToMarkerPopUpVisible: false });
        let returnToMarkerArgs: returnToMarkerArguments = {
            currentExaminerRoleId: teamManagementStore.instance.selectedExaminerRoleId,
            selectedExaminerRoleId: operationModeHelper.examinerRoleId,
            markGroupId: markingStore.instance.currentMarkGroupId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingModeId: worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType),
            selectedExaminerId: operationModeHelper.subExaminerId
        };
        teamManagementActionCreator.returnResponseToMarkerWorklist(returnToMarkerArgs);
    }

	/**
	 * Action when the no button of return response to marker confirmation is clicked
	 */
    protected onNoClickOfReturnResponseToMarkerConfirmation() {
        this.setState({ isReturnResponseToMarkerPopUpVisible: false });
    }

    /**
     * show or hide the return response confirmation popup
     */
    private returnResponseToMarkerButtonClicked = (): void => {
        this.setState({ isReturnResponseToMarkerPopUpVisible: true });
    }

    /**
     * on completing returning response to marker worklist
     */
    private onResponseReturned = (returnResponseResult: enums.ReturnToMarkerResult) => {
        this.setState({ isBusy: false });

        if (returnResponseResult === enums.ReturnToMarkerResult.Success) {
            if (markSchemeHelper.isNextResponseAvailable) {

                // refresh worklist data from server and the navigate to next response
                worklistActionCreator.notifyWorklistTypeChange
                    (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                    worklistStore.instance.currentWorklistType,
                    enums.ResponseMode.closed,
                    enums.RemarkRequestType.Unknown,
                    false,
                    qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                    false).then(
                        navigationHelper.responseNavigation(enums.ResponseNavigation.next, false));
            } else {
                let responseMode = enums.ResponseMode.closed;
                // reset the response mode to Open. to show the Open tab selected, when returning the single response
                // should navigate to open worklist because the closed response count will become zero
                if (new markSchemeHelper().isSingleResponse) {
                    responseMode = enums.ResponseMode.open;
                    worklistActionCreator.responseModeChanged(responseMode);
                }
                // clear all cashe before moving to worklist to update the data from server
                this.responseContainerProperty.storageAdapterHelper.clearCache(
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType),
                    enums.RemarkRequestType.Unknown,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    worklistStore.instance.currentWorklistType);
                navigationHelper.loadWorklist();
            }
        } else {
            if (returnResponseResult === enums.ReturnToMarkerResult.SupervisorApprovalStatusChanged) {
                // get latest marker info from db if the marker approval status changed
                markerInformationActionCreator.
                    GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                        qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        true,
                        false,
                        enums.ExaminerApproval.Approved);
            }

            this.setState({ returnResponseResult: returnResponseResult });
        }
    }

    /**
     * on ok button click of return response failure reason popup
     */
    protected onReturnResponseFailurePopUpOkClick() {
        if (this.state.returnResponseResult === enums.ReturnToMarkerResult.SupervisorHierarchyChanged) {
            this.responseContainerProperty.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            navigationHelper.loadQigSelector();
        }
        // hide failure reason popup
        this.setState({ returnResponseResult: enums.ReturnToMarkerResult.None });
    }

    /**
     * Fetch candidateScriptMeta data of the newly selected centre, while navigating between centre's in Selected response tab.
     * @param isNavigation
     */
    protected fetchCandidateScriptMetaData = (isNavigation: boolean): void => {
        if (isNavigation) {
            // Show loading indicator.
            this.responseContainerProperty.doShowResposeLoadingDialog = true;

            let isEbookMarking: boolean =
                ccHelper.getExamSessionCCValue(
                    ccNames.eBookmarking,
                    qigStore.instance.selectedQIGForMarkerOperation.examSessionId
                    )
                    .toLowerCase() === 'true';

            let candidateScriptInfoCollection = [];

            // Get candidateScriptId and documentyId of all scripts in the currently selected centre
            candidateScriptInfoCollection = standardisationSetupStore.instance.getCandidateScriptDetailsAgainstCentreOnNavigation;
            if (candidateScriptInfoCollection) {
                scriptActionCreator.fetchCandidateScriptMetadata(
                    Immutable.List<candidateScriptInfo>(candidateScriptInfoCollection),
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, // MarkSchemeGroupId
                    false,
                    false,
                    false,
                    eCourseworkHelper.isECourseworkComponent,
                    isEbookMarking,
                    enums.StandardisationSetup.SelectResponse,
                    false,
                    false,
                    qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
                );
            }

            this.setState({
                renderedOn: Date.now(),
                isBusy: true
            });
        }
    }

    /**
     * open the last/first response of the selected centre, based of the script navigation direction.
     */
    protected onCandidateResponseMetadataRetrieved = (): void => {

        if (standardisationSetupStore.instance.scriptNavigationBetweenCentresDirection !== enums.ResponseNavigation.none) {
            // open the last/first response of the selected centre, based of the script navigation direction.
            navigationHelper.responseNavigation(standardisationSetupStore.instance.scriptNavigationBetweenCentresDirection);
            this.setState({ renderedOn: Date.now()});
        }
    }
}

export = ResponseContainer;
