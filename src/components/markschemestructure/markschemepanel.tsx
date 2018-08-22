import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import TreeView = require('../utility/treeview/treeview');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import treeViewDataHelper = require('../../utility/treeviewhelpers/treeviewdatahelper');
import Immutable = require('immutable');
import enums = require('../utility/enums');
import SelectedQuestionItem = require('./selectedquestionitem');
import localeStore = require('../../stores/locale/localestore');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import MarkSchemeTotalMark = require('./markschemetotalmark');
import MarkingProgressIndicator = require('./markingprogressindicator');
import markingStore = require('../../stores/marking/markingstore');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import mark = require('../utility/marking/mark');
import marksManagementHelper = require('../utility/marking/marksmanagementhelper');
import qualityfeedbackhelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import ReactDom = require('react-dom');
import annotationHelper = require('../../components/utility/annotation/annotationhelper');
import annotation = require('../../stores/response/typings/annotation');
import constants = require('../utility/constants');
import markingHelper = require('../../utility/markscheme/markinghelper');
import stringHelper = require('../../utility/generic/stringhelper');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import deviceHelper = require('../../utility/touch/devicehelper');
import messageStore = require('../../stores/message/messagestore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import exceptionStore = require('../../stores/exception/exceptionstore');
import exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
import MarkschemepanelHeaderDropdown = require('./markschemepanelheaderdropdown');
import domManager = require('../../utility/generic/domhelper');
import marksandannotationsvisibilityinfo = require('../utility/annotation/marksandannotationsvisibilityinfo');
import ToggleButton = require('../utility/togglebutton');
import colouredAnnotationsHelper = require('../../utility/stamppanel/colouredannotationshelper');
import marksAndAnnotationsVisibilityInfo = require('../utility/annotation/marksandannotationsvisibilityinfo');
import QualityFeedbackButton = require('./qualityfeedbackbutton');
import qigStore = require('../../stores/qigselector/qigstore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import SubmitResponse = require('../worklist/shared/submitresponse');
import submitHelper = require('../utility/submit/submithelper');
import AccuracyIndicator = require('../worklist/shared/accuracyindicator');
import examinerMarksAndAnnotation = require('../../stores/response/typings/examinermarksandannotation');
import GenericButton = require('../utility/genericbutton');
import ccHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import PanelResizer = require('../utility/panelresizer/panelresizer');
let classNames = require('classnames');
import copyPreviousMarksAndAnnotationsHelper = require('../utility/annotation/copypreviousmarksandannotationshelper');
import eventManagerBase = require('../base/eventmanager/eventmanagerbase');
import eventTypes = require('../base/eventmanager/eventtypes');
import direction = require('../base/eventmanager/direction');
import MarkChangeReason = require('./markchangereason');
import markChangeReasonHelper = require('../utility/markchangereason/markchangereasonhelper');
import responseHelper = require('../utility/responsehelper/responsehelper');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import marksAndAnnotationsVisibilityHelper = require('../utility/marking/marksandannotationsvisibilityhelper');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import MarkByOption = require('./markbyoption');
import navigationHelper = require('../utility/navigation/navigationhelper');
import scrollHelper = require('../../utility/markscheme/markschemescrollhelper');
import SetAsReviewedButton = require('./setasreviewedbutton');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import markByAnnotationHelper = require('../utility/marking/markbyannotationhelper');
import numericMarkingHelper = require('../../utility/markscheme/numericmarkinghelper');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import Sampling = require('../teammanagement/sampling/sampling');
import SupervisorMarkDecision = require('./supervisormarkdecision');
import accuracyRuleFactory = require('../../utility/markcalculationrules/accuracyrulefactory');
import targetSummarytStore = require('../../stores/worklist/targetsummarystore');
import warningNR = require('../response/typings/warningnr');
import loggingHelper = require('../utility/marking/markingauditlogginghelper');
import loggerConstants = require('../utility/loggerhelperconstants');
import enhancedOffPageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import enhancedOffPageCommentActionCreator = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
import EnhancedOffPageComment = require('../../stores/response/typings/enhancedoffpagecomment');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
import enhancedOffPageCommentHelper = require('../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
import toolbarStore = require('../../stores/toolbar/toolbarstore');
import acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
import stampStore = require('../../stores/stamp/stampstore');
import examinerMarksAndAnnotations = require('../../stores/response/typings/examinermarksandannotation');
import GenericBlueHelper = require('../utility/banner/genericbluehelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import configurableCharacteristicsValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import stdSetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import ClassifyResponse = require('../../components/standardisationsetup/shared/classifyresponse');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import awardingStore = require('../../stores/awarding/awardingstore');
import MyJudgementButton = require('./myjudgementbutton');
import qigSelectorValidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
import ReuseButton = require('../../components/standardisationsetup/shared/reusebutton');

const SWIPE_MOVE_FACTOR = 0.6;
const MOVE_FACTOR_PIXEL = 40;

/**
 * Properties of TreeNode component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    loadMarkSchemePanel: number;
    onValidateMarkEntry: Function;
    onResetConfirm: Function;
    showMbCConfirmationDialog: Function;
    allPagesNotAnnotatedDialog: Function;
    onMarkSchemeStructureLoaded: Function;
    showCompleteButtonDialog: Function;
    isResponseEditable: boolean;
    showAcceptQualityConfirmationDialog: Function;
    getMarkSchemePanelWidth: Function;
    ismarkEntryPopupVisible: boolean;
    doEnableMouseWheelEvent: boolean;
    invokeReviewBusyIndicator?: Function;
    onEnhancedOffPageCommentVisibilityChanged?: Function;
    hideAnnotationToggleButton?: boolean;
    setResponseNavigationFlag: Function;
    isPreviousMarksAndAnnotationCopied: boolean;
}

interface State {
    renderedOn?: number;
    offSet?: string;
    renderedOnMarksAndAnnotationVisibility?: number;
    renderedOnMarksColumnVisibilitySwitched?: number;
    width?: string;
    panelClassName?: string;
    renderedOnMarkChangeReason?: number;
    refreshMarkschemePanelResizer?: number;
    supervisorRemarkDecisionRenderedOn?: number;
}

class MarkSchemePanel extends eventManagerBase {
    // Node collection.
    private treeNodes: treeViewItem;
    // helper class
    private markSchemeHelper: markSchemeHelper;
    private isFirstNodeSelected: boolean;
    private isLastNodeSelected: boolean;

    /* Is the treeview re rendering by moving from response or navigation with in the mark scheme panel */
    private isNavigationInsideTree: boolean;
    private isFirstLoad: boolean;
    private currentQuestionItem: treeViewItem;
    private marksManagementHelper: MarksAndAnnotationsManagementBase;
    private mark: AllocatedMark;
    private _initialMarkingProgress: number;
    private treeViewHelper: treeViewDataHelper;
    private isNRclicked: boolean = false;

    // Holds the current mark.
    // This will have collection of original marks which
    // are either not been updated/added by the user. This will not contain any dirty mark.
    private originalMarkList: Array<mark>;
    private pageYCordinateStart: number;
    private pageYCordinateMoveStart: number;
    private pageYCordinateEnd: number;
    private touchStart: number;
    private touchEnd: number;

    private firstMarkSchemeIndex: number;
    private isResponseChanged: number;

    /* next node for markscheme navigation */
    private nextNode: treeViewItem;

    private isMbCConfirmationDialogDisplaying: boolean;
    private isAllPageNotAnnotatedVisible: boolean;

    // for logging in google analytics.
    private markByKeyboardCount: number = 0;

    // for logging in google analytics.
    private markByButtonCount: number = 0;

    // This is to reload the markscheme structure everytime,
    // When the panel rerender.
    private reloadTreeview: number = 0;

    // Individual rendering flag to rerender mark entry textbox
    private selectedQuestionItemRenderedOn: number;

    //Boolean value for disabling the submit button
    private isSubmitDisabled: boolean = false;

    //Boolean value for enabling submit button
    private isSubmitVisible: boolean = false;

    // variable to set callback function
    private onValidateMarkEntry: Function;

    // Indicates if the response is dirty (any marks/annotations edited/added)
    private isResponseDirty: boolean;

    // This is currently setting to false, Later this variable needs to be set by the user options
    private hasAutoNavigation: boolean = false;

    // mark change reason visibility
    private isMarkChangeReasonVisible: boolean = false;

    private resizePanelClassName: string;

    private resizedPanelWidth: string;

    private markScheme: HTMLElement = null;

    private containerWidth: number;
    private selectedQuestionItemResetScroll: boolean;

    private reRenderSubmitAndProgress: number;

    private isMouseWheelOnProgress: boolean;

    private markSchemePanelTransition: any;

    private scrollHelper: scrollHelper;

    private doTriggerResponseNavigation: boolean = true;

    private isKeyActionOnProgress: boolean;

    private markByAnnotationHelper: markByAnnotationHelper;

    private storageAdapterHelper = new storageAdapterHelper();

    private isMBaCCOn: boolean;

    private previousDeltaY: number = 0;
    private isMarksColumnVisibilitySwitched: boolean = false;

    private accuracyIndicator: enums.AccuracyIndicatorType = undefined;
    private remarkDecision: enums.SupervisorRemarkDecisionType;
    private absoluteMarkDifference: number;
    private totalMarkDifference: number;
    private logger: loggingHelper;
    private selectedReviewCommentId: enums.SetAsReviewedComment = enums.SetAsReviewedComment.None;
    private isStampPanedBeyondBoundaries: boolean = false;
    private samplingRenderedOn: number;
    private previousTreeNodeBIndex: number = 0;
    private linkedItemsUniqueIds: Immutable.List<number>;

    /**
     * Get the original mark of the current item.
     */
    private get originalMark(): AllocatedMark {
        // initialising with default mark, incase to revert,
        // if there are no valid mark available.
        let mark: AllocatedMark = {
            displayMark: '-',
            valueMark: null
        };

        this.originalMarkList.map((item: mark) => {
            // Filter only the marks which are saved in to database.
            // we dont need to take the mark which are just saved in this context.
            if (this.currentQuestionItem.uniqueId === item.markSchemeId && item.markId !== 0) {
                mark = item.mark;
            }
        });
        return mark;
    }

    /**
     * @Constrctor
     * @param {Props} props
     * @param {any} state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.markSchemeHelper = new markSchemeHelper();
        this.markByAnnotationHelper = new markByAnnotationHelper();
        this.isMBaCCOn = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
        this.logger = new loggingHelper();
        this.state = {
            renderedOn: Date.now(),
            offSet: this.markSchemeHelper.defaultCSSTranslate, // This to set start the translate from the middle.
            renderedOnMarksAndAnnotationVisibility: Date.now(),
            renderedOnMarkChangeReason: Date.now(),
            renderedOnMarksColumnVisibilitySwitched: Date.now(),
            refreshMarkschemePanelResizer: Date.now(),
            supervisorRemarkDecisionRenderedOn: Date.now()
        };
        this.isNavigationInsideTree = false;
        this.scrollHelper = new scrollHelper(
            this.movePrev.bind(this),
            this.moveNext.bind(this),
            this.handleMarkSchemeNavigation.bind(this)
        );
        if (markingStore.instance.initialMarkingProgress) {
            this._initialMarkingProgress = markingStore.instance.initialMarkingProgress;
        }
        this.isMbCConfirmationDialogDisplaying = false;
        this.isAllPageNotAnnotatedVisible = false;
        this.selectedQuestionItemRenderedOn = 0;
        this.isResponseDirty = false;
        this.moveNext = this.moveNext.bind(this);
        this.movePrev = this.movePrev.bind(this);
        this.updateMark = this.updateMark.bind(this);
        this.onCompleteButtonClick = this.onCompleteButtonClick.bind(this);
        this.handleMarkSchemeNavigation = this.handleMarkSchemeNavigation.bind(this);
        this.logMarkingBehaviour = this.logMarkingBehaviour.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.navigateToMarkScheme = this.navigateToMarkScheme.bind(this);
        this.onMarkSchemeSelected = this.onMarkSchemeSelected.bind(this);
        this.onValidateMarkEntry = this.props.onValidateMarkEntry.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.onSwipe = this.onSwipe.bind(this);
        this.markChangeReasonUpdate = this.markChangeReasonUpdate.bind(this);
        this.showAcceptQualityConfirmationDialog = this.showAcceptQualityConfirmationDialog.bind(
            this
        );
        this.selectedQuestionItemResetScroll = false;
        this.checkIsSubmitVisible = this.checkIsSubmitVisible.bind(this);
        this.reRenderSubmitAndProgress = Date.now();
        this.isMouseWheelOnProgress = false;
        this.isKeyActionOnProgress = false;
        this.onReviewButtonClick = this.onReviewButtonClick.bind(this);
        this.onNRButtonClick = this.onNRButtonClick.bind(this);
        this.onRemarkDecisionChange = this.onRemarkDecisionChange.bind(this);
        this.calculateAccuracy = this.calculateAccuracy.bind(this);
        this.logMarkEntry = this.logMarkEntry.bind(this);
        this.logSaveMarksAction = this.logSaveMarksAction.bind(this);
        this.linkedItemsUniqueIds = Immutable.List<number>();
        this.reuseButton = this.reuseButton.bind(this);
    }

    /**
     * refs
     */
    public refs: {
        [key: string]: Element;
        markScheme: HTMLInputElement;
    };

    /** render method */
    public render(): JSX.Element {
        let selectedQuestionItem = null;
        let reuseResponseButton: JSX.Element = null;

        /* No need to re build the tree view if the naviagtion is with in the panel */
        if (this.isNavigationInsideTree === false) {
            // Initialise markscheme structre on loading the panle.
            this.loadMarkSchemeStructure();
            this.getLinkedItems(this.treeNodes, true);
            // Pass the last markscheme id to the parent.
            this.props.onMarkSchemeStructureLoaded(this.treeViewHelper.lastMarkSchemeId);
            this.checkMarkChangeReason();
            /* If a response open from an exception page and the selected exception has an associated question,
               corresponding question should be selected by default in marking panel.
             */
            if (
                teamManagementStore.instance.isRedirectFromException &&
                (responseStore.instance.imageZonesAgainstPageNumber === undefined &&
                    markingStore.instance.currentQuestionItemInfo === undefined)
            ) {
                let selectedException = teamManagementStore.instance.selectedException;
                if (selectedException) {
                    let sequenceNo = selectedException.sequenceNo;
                    if (sequenceNo !== 0) {
                        let selectedNode = this.markSchemeHelper.searchTreeViewBySequenceNo(
                            this.treeNodes,
                            sequenceNo
                        );
                        if (selectedNode) {
                            this.navigateToMarkScheme(selectedNode, true);
                        }
                    }
                }
            }
        }

        this.currentQuestionItem = this.markSchemeHelper.selectedNodeGet;
        if (this.currentQuestionItem != null) {
            this.setSelectedNodeTypes();
            selectedQuestionItem = (
                <SelectedQuestionItem
                    selectedQuestionItem={this.currentQuestionItem}
                    id={'active_question_' + this.props.id}
                    key={'active_question_key_' + this.props.id}
                    onMoveNext={this.moveNext}
                    onMovePrev={this.movePrev}
                    isUpArrowDisabled={this.isFirstNodeSelected}
                    isDownArrowDisabled={this.isLastNodeSelected}
                    updateMark={this.updateMark}
                    onValidateMarkEntry={this.onValidateMarkEntry}
                    originalMark={this.currentQuestionItem.allocatedMarks}
                    responseChanged={this.isResponseChanged}
                    onEnterKeyPress={this.handleMarkSchemeNavigation}
                    onResetConfirm={this.props.onResetConfirm}
                    logKeyUsageValues={this.logMarkingBehaviour}
                    renderedOn={this.selectedQuestionItemRenderedOn}
                    selectedLanguage={this.props.selectedLanguage}
                    isResponseEditable={this.props.isResponseEditable}
                    isResetScroll={this.selectedQuestionItemResetScroll}
                    isNonNumeric={this.treeViewHelper.isNonNumeric}
                    markingProgress={this.treeViewHelper.totalMarkAndProgress.markingProgress}
                    treeNodes={this.treeNodes}
                    isLastNode={this.isLastNodeSelected}
                    onNRButtonClick={this.onNRButtonClick}
                    logMarkEntry={this.logMarkEntry}
                    scrollHelperInstance={this.scrollHelper}
                    setResponseNavigationFlag={this.setResponseNavigationFlag}
                />
            );
        }

        this.selectedQuestionItemResetScroll = false;

        let responsedetails: ResponseBase = markerOperationModeFactory.operationMode.openedResponseDetails(
            responseStore.instance.selectedDisplayId.toString()
        );

        let reusableResponseData = standardisationSetupStore.instance.getReusableResponseDetails
                (responseStore.instance.selectedDisplayId.toString());

        let isBlockerException = exceptionStore.instance.hasExceptionBlockers();

        this.checkIsSubmitVisible();

        let markChangeReason: string = null;
        if (this.isMarkChangeReasonVisible) {
            markChangeReason = markingStore.instance.getMarkChangeReason(
                markingStore.instance.currentMarkGroupId
            );
        }
        let markingProgressIndicator = null;
        let submitresponsebutton = null;
        let updatedTotalMarks = this.treeViewHelper.totalMarkAndProgress.totalMark;

        let isReusableResponseView = standardisationSetupStore.instance.isSelectedResponsePreviousSessionWorklist;

        reuseResponseButton = isReusableResponseView ? this.reuseButton(reusableResponseData.reUsedQIG,
            responseStore.instance.selectedDisplayId,
            responseStore.instance.selectedDisplayId.toString()) : null;

        // Marking progress indicator will be hidden for a classfied response as its
        // functionality will be implemented later.
        if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
            && !isReusableResponseView
            && standardisationSetupStore.instance.selectedStandardisationSetupWorkList !== enums.StandardisationSetup.ClassifiedResponse) {
            markingProgressIndicator = (
                <MarkingProgressIndicator
                    id='progressIndicator'
                    key='progressIndicator'
                    progressPercentage={this.treeViewHelper.totalMarkAndProgress.markingProgress}
                    isVisible={this.isSubmitVisible ? false : true}
                    checkIsSubmitVisible={this.checkIsSubmitVisible}
                    renderedOn={this.reRenderSubmitAndProgress}
                />
            );

            // Null check added to avoid unexpected error occur if responsedetails is null.
            if (responsedetails) {
                let isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
                submitresponsebutton = (
                    <SubmitResponse
                        isSubmitAll={false}
                        id='submitSingleResponse'
                        key='submitSingleResponse_key'
                        selectedLanguage={this.props.selectedLanguage}
                        isDisabled={this.isSubmitDisabled}
                        markGroupId={isStandardisationSetupMode ? responsedetails.esMarkGroupId : responsedetails.markGroupId}
                        fromMarkScheme={true}
                        isVisible={this.isSubmitVisible}
                        checkIsSubmitVisible={this.checkIsSubmitVisible}
                        standardisationSetupType={standardisationSetupStore.instance.selectedStandardisationSetupWorkList}
                        stdResponseDetails={standardisationSetupStore.instance.fetchStandardisationResponseData()}
                        updatedTotalMarks={updatedTotalMarks}
                        renderedOn={this.reRenderSubmitAndProgress}
                    />
                );
            }
        }

        // Render Quality Feedback button if QualityFeedbackOutstanding
        let qualityFeedbackButton = this.isAcceptQualityFeedbackButtonVisible() ? (
            <QualityFeedbackButton
                id='qualityFeedback'
                key='qualityFeedback'
                onClick={this.showAcceptQualityConfirmationDialog}
                selectedLanguage={this.props.selectedLanguage}
            />
        ) : null;

        let setAsReviewedButton = markerOperationModeFactory.operationMode.allowReviewResponse ? (
            <SetAsReviewedButton
                id='setAsReviewedButton'
                key='setAsReviewedButton'
                isDisabled={responsedetails.isReviewed}
                setAsReviewedComment={responsedetails.setAsReviewedCommentId}
                selectedLanguage={this.props.selectedLanguage}
                onReviewButtonClick={this.onReviewButtonClick}
            />
		) : null;

		let myJudgementButton;
		if (markerOperationModeFactory.operationMode.isAwardingMode) {
			let awardingJudementCC = (configurableCharacteristicsHelper.getExamSessionCCValue(
				configurableCharacteristicsNames.AwardingJudgements,
				awardingStore.instance.selectedSession.examSessionId).toLowerCase() === 'true');

			let doDisableJudgementButton: boolean = awardingJudementCC &&
				awardingStore.instance.selectedSession.sampleStatus === 1;

			myJudgementButton =
				<MyJudgementButton
					id='myJudgementButton'
					key='keyJudgementButton'
					isDisabled={!doDisableJudgementButton} />;
		} else {
			myJudgementButton = null;
		}

        let _doShowSamplingButton: boolean =
            !teamManagementStore.instance.isRedirectFromException &&
            markerOperationModeFactory.operationMode.doShowSamplingButton(
                this.treeViewHelper.totalMarkAndProgress.markingProgress,
                worklistStore.instance.currentWorklistType
            );

        let samplingButton = _doShowSamplingButton ? (
            <Sampling
                id='sampling'
                key='sampling'
                selectedLanguage={this.props.selectedLanguage}
                samplingRenderedOn={this.samplingRenderedOn}
            />
        ) : null;

        //get the default mark scheme panel width
        let defaultMarkSchemePanelWidth = markingStore.instance.getDefaultPanelWidth();
        let defaultPanelWidthAfterColumnIsUpdated = markingStore.instance.getDefaultPanelWidthAfterColumnIsUpdated();

        defaultMarkSchemePanelWidth = defaultPanelWidthAfterColumnIsUpdated
            ? defaultPanelWidthAfterColumnIsUpdated
            : defaultMarkSchemePanelWidth;

        // get the saved mark scheme panel width from useroptions
        let examinerRoleId: number = markerOperationModeFactory.operationMode.isTeamManagementMode
            ? teamManagementStore.instance.selectedExaminerRoleId
            : qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;

        let markingSchemePanelWidth: string = userOptionsHelper.getUserOptionByName(
            userOptionKeys.MARKSCHEME_PANEL_WIDTH,
            examinerRoleId
        );

        let markDetails = this.treeViewHelper.totalMarkAndProgress;
        let stylePanel: React.CSSProperties = {};

        if (this.resizedPanelWidth || defaultMarkSchemePanelWidth) {
            stylePanel = {
                width: this.resizedPanelWidth
                    ? this.resizedPanelWidth
                    : markingSchemePanelWidth
                        ? markingSchemePanelWidth + '%'
                        : defaultMarkSchemePanelWidth,
                maxWidth: defaultMarkSchemePanelWidth
            };
        }

        let _markChangeReason = (
        <MarkChangeReason
            id='markChangeReason'
            key='markChangeReason'
            selectedLanguage={this.props.selectedLanguage}
            isInResponse={true}
            isResponseEditable={this.props.isResponseEditable}
            markChangeReason={markChangeReason}
            />
        );

        let markdecision: JSX.Element = null;

        if (this.showRemarkDecisionButton()) {
            this.remarkDecision = markingStore.instance.convertSupervisorRemarkDecisionType();

            markdecision = (
                <SupervisorMarkDecision
                    amd={this.absoluteMarkDifference}
                    tmd={this.totalMarkDifference}
                    accuracy={this.accuracyIndicator}
                    onRemarkDecisionChange={this.onRemarkDecisionChange}
                    selectedLanguage={this.props.selectedLanguage}
                    id={'remarkdecision'}
                    key={'remarkdecision'}
                    calculateAccuracy={this.calculateAccuracy}
                    supervisorRemarkDecisionType={this.remarkDecision}
                />
            );
        }

        let hasPreviousColumn: boolean = this.treeViewHelper.canRenderPreviousMarks();

        /**
         * Standardisation setup 'Select to mark' provisional response condition.
         * Show 'Select to mark button
         */
        let totalMarkHolder: JSX.Element = null;
        // standardisation setup - select response screen
        if (standardisationSetupStore.instance.isSelectResponsesWorklist ||
            (standardisationSetupStore.instance.isUnClassifiedWorklist &&
                standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives)) {
            if (this.isSelectResponsesButtonVisible) {
                let buttonText: string = standardisationSetupStore.instance.isSelectResponsesWorklist ?
                    localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-button') :
                    localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-button');
                let blueHelperMessage: string = standardisationSetupStore.instance.isSelectResponsesWorklist ?
                    localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-blue-banner') :
                    localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-blue-banner');
                let markSchemeTotalMark: JSX.Element = null;
                let buttonWithHelperMessage: JSX.Element = null;
                let displayButtonWithHelperMessage: boolean = true;
                let className: string = standardisationSetupStore.instance.isUnClassifiedWorklist ?
                    'total-panel-holder' : '';
                let buttonId: string = standardisationSetupStore.instance.isUnClassifiedWorklist ?
                    'markAsDefinitiveButton' : 'selecttomarkbutton';
                let helperMessageId: string = standardisationSetupStore.instance.isUnClassifiedWorklist ?
                    'markAsDefinitiveHelperMessage' : 'selectResponsesButtonMessage';
                let classifyResponseButton: JSX.Element = null;
                let showMarkingProgressIndicator = null;
                let classifyButtonHelper: submitHelper = new submitHelper();

                markSchemeTotalMark = (this.isUnclassifiedWorklistSelected) ?
                    <MarkSchemeTotalMark
                        id='totalMarks'
                        key='totalMarks'
                        selectedLanguage={this.props.selectedLanguage}
                        actualMark={markDetails.totalMark}
                        maximumMark={markDetails.maximumMark}
                        previousMarksColumnTotals={this.treeNodes.previousMarks}
                        renderedOn={this.state.renderedOn}
                        markingProgress={markDetails.markingProgress}
                        isNonNumeric={this.treeViewHelper.isNonNumeric}
                    /> : null;
                displayButtonWithHelperMessage = (this.isUnclassifiedWorklistSelected &&
                    standardisationSetupStore.instance.fetchStandardisationResponseData(
                        responseStore.instance.selectedDisplayId).hasDefinitiveMark === true) ? false : true;

                // In unclassified worklist Show 'marking progress indicator',
                // when the definitive marking started for the current response.
                // If there are any blocking conditions(not all SLAOs annotated, etc) and the progress is 100%,
                // then show 100% itself, else show the classify button
                if (this.isUnclassifiedWorklistSelected && markingStore.instance.isDefinitiveMarking) {

                    let unclassifiedResponseData: ResponseBase = standardisationSetupStore.instance.getResponseDetails
                        (responseStore.instance.selectedDisplayId.toString());

                    // Classify button enabling/disabling in unclassified worklist
                    let responseStatuses = classifyButtonHelper.submitButtonValidate(
                        unclassifiedResponseData, this.treeViewHelper.totalMarkAndProgress.markingProgress, true, false);

                    if (responseStatuses
                        && responseStatuses.contains(enums.ResponseStatus.readyToSubmit)
                        && this.treeViewHelper.totalMarkAndProgress.markingProgress === 100) {
                            classifyResponseButton = (
                                <ClassifyResponse
                                    id='responseScreenClassifyButton'
                                    key='responseScreenClassifyButton'
                                    isDisabled={false}
                                    renderedOn={this.state.renderedOn}
                                    buttonTextResourceKey={'standardisation-setup.right-container.classify-button'}
                                    esMarkGroupId={markingStore.instance.currentMarkGroupId}
                                    onClickAction={this.classifyMultiOptionPopUpOpen}
                                />
                            );
                    } else {
                        // Show 'marking progress indicator'
                        showMarkingProgressIndicator = markingProgressIndicator;
                    }
                }

                buttonWithHelperMessage = displayButtonWithHelperMessage ?
                    (<div className='submit-holder def-mark show-message-bottom'><GenericButton
                    id={buttonId}
                    key={buttonId}
                    className={'rounded primary popup-nav std-selectmark-btn'}
                    onClick={this.onClickToShowPopup}
                    content={buttonText}/>
                    <GenericBlueHelper
						id={helperMessageId}
						key={helperMessageId + responseStore.instance.selectedDisplayId.toString()}
                        message={blueHelperMessage}
                        selectedLanguage={this.props.selectedLanguage}
                        role={'tooltip'}
                        isAriaHidden={false}
                        bannerType={enums.BannerType.HelperMessageWithClose}
                        header={null}
                        isVisible={standardisationSetupStore.instance.isSelectToMarkHelperVisible}
                        onCloseClick={this.onClosingBlueHelperMessage}
                    />
                    </div>) : null;
                totalMarkHolder = (
                    <div className={className}>
                        {buttonWithHelperMessage}
                        {showMarkingProgressIndicator}
                        {classifyResponseButton}
                        {markSchemeTotalMark}
                    </div>
                );
            }
        } else {
            // normal marking flow - total marks and progress
            totalMarkHolder = (
                <div className={this.totalPanelClassName}>
                    {this.showReClassifyResponseButton}
                    {this.showAccuracyPanel}
                    {markingProgressIndicator}
                    {submitresponsebutton}
                    {reuseResponseButton}
                    {markdecision}
                    {_markChangeReason}
                    <MarkSchemeTotalMark
                        id='totalMarks'
                        key='totalMarks'
                        selectedLanguage={this.props.selectedLanguage}
                        actualMark={markDetails.totalMark}
                        maximumMark={markDetails.maximumMark}
                        previousMarksColumnTotals={this.treeNodes.previousMarks}
                        renderedOn={this.state.renderedOn}
                        markingProgress={markDetails.markingProgress}
                        isNonNumeric={this.treeViewHelper.isNonNumeric}/>
                </div>
            );
        }

        return (
            <div
                id='markSchemePanel'
                className={this.getMarkSchemePanelWrapperClassName()}
                ref='markScheme'
                style={stylePanel}
                onClick={this.onClickHandler}>
                <PanelResizer
                    id='panel-resizer'
                    key='panel-resizer'
                    hasPreviousColumn={hasPreviousColumn}
                    renderedOn={this.state.renderedOnMarksColumnVisibilitySwitched}
                    resizerType={enums.ResizePanelType.MarkSchemePanel}
                />
                <div className='question-panel-holder'>
                    {this.getPreviousMarksColumns()}
                    {this.getMarkSchemePanelHeader()}
                    <div
                        className='question-panel'
                        onTouchMove={this.onTouchMove}
                        onWheel={this.onMouseWheel}>
                        {selectedQuestionItem}
                        <TreeView
                            id={this.props.id}
                            key={'key_' + this.props.id}
                            treeNodes={this.treeNodes}
                            offset={this.state.offSet}
                            navigateToMarkScheme={this.navigateToMarkScheme}
                            onMarkSchemeSelected={this.onMarkSchemeSelected}
                            reload={this.reloadTreeview}
                            selectedLanguage={this.props.selectedLanguage}
                            isNonNumeric={this.treeViewHelper.isNonNumeric}
                            selectedMarkSchemeGroupId={
                                this.markSchemeHelper.selectedNodeGet ? (
                                    this.markSchemeHelper.selectedNodeGet.markSchemeGroupId
                                ) : undefined
                            }
                            isWholeResponse={this.treeViewHelper.isWholeResponse}
                            visibleTreeNodeCount={this.treeViewHelper.currentlyVisibleElementCount}
                            isResponseEditable={this.props.isResponseEditable}
                            linkedItems={this.linkedItemsUniqueIds}
                        />
                    </div>
                    <div
                        className={classNames('total-panel', {
                            'supervisor-sampling-status': _doShowSamplingButton ||
                            markerOperationModeFactory.operationMode.isAwardingMode
                        })}>
                        {this.completeButton()}
                        {totalMarkHolder}
                        {setAsReviewedButton}
                        {myJudgementButton}
                        {qualityFeedbackButton}
                        {samplingButton}
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Reuse button return 
     * @param isDisabled
     * @param id
     * @param displayId
     */
    private reuseButton(isDisabled: boolean, id: number, displayId: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            isDisabled: isDisabled,
            id: id,
            renderedOn: Date.now(),
            displayId: displayId
        };
        return React.createElement(ReuseButton, componentProps);
    }

    /**
     * checking submit button visibility
     */
    public checkIsSubmitVisible(): boolean {
        let submitresponse: submitHelper = new submitHelper();

        let responsedetails: ResponseBase = markerOperationModeFactory.operationMode.openedResponseDetails(
            responseStore.instance.selectedDisplayId.toString()
        );
        if (responsedetails === null) {
            // Should be removed in Release 3.
            return false;
        }
        let markDetails = this.treeViewHelper.totalMarkAndProgress;
        let isBlockerException = exceptionStore.instance.hasExceptionBlockers();
        // If the exceptions data loaded, Get the status from exceptions store, other wise set as true for disable the button.
        // Or if the worklist is simulation, then no blocking exceptions.
        let hasBlockingExceptions: boolean =
            exceptionStore.instance.hasExceptionsLoaded ||
                worklistStore.instance.currentWorklistType === enums.WorklistType.simulation
                || markerOperationModeFactory.operationMode.isStandardisationSetupMode
                ? isBlockerException
                : true;
        submitresponse.submitButtonValidate(
            responsedetails,
            markDetails.markingProgress,
            true,
            hasBlockingExceptions
        );
        this.isSubmitVisible =
            responsedetails.isSubmitEnabled &&
            markerOperationModeFactory.operationMode.isSubmitVisible;
        let isSubmitDisabled: boolean =
            (markerOperationModeFactory.operationMode.isSubmitDisabled(
                worklistStore.instance.currentWorklistType
            ) ||
                isBlockerException) &&
            markerOperationModeFactory.operationMode.isSubmitDisabled(
                worklistStore.instance.currentWorklistType
            );
        this.isSubmitVisible = isSubmitDisabled ? false : this.isSubmitVisible;
        let markChangeReason: string = null;
        if (markDetails.markingProgress === 100 && this.isMarkChangeReasonVisible) {
            markChangeReason = markingStore.instance.getMarkChangeReason(
                markingStore.instance.currentMarkGroupId
            );
            if (
                (!markChangeReason || markChangeReason.length <= 0) &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !worklistStore.instance.isMarkingCheckMode
            ) {
                this.isSubmitVisible = false;
            }
        }

        if (
            this.showRemarkDecisionButton() &&
            this.remarkDecision === enums.SupervisorRemarkDecisionType.none
        ) {
            this.isSubmitVisible = false;
        }

        /* For ecoursework component, Submit button only available if all pages are viewed
           Submit button not available for team management or marking check mode.
        */
        if (eCourseworkHelper.isECourseworkComponent) {
            if (!eCourseWorkFileStore.instance.checkIfAllFilesViewed(responsedetails.markGroupId)) {
                this.isSubmitVisible = false;
            }
        }

        this.reRenderSubmitAndProgress = Date.now();

        return this.isSubmitVisible;
    }

    /**
     * OnClickHandler
     * @param event
     */
    private onClickHandler(event: any) {
        stampActionCreator.showOrHideComment(false);
    }

    /**
     * show accept quality feedback confirmation dialog
     */
    private showAcceptQualityConfirmationDialog(): void {
        this.props.showAcceptQualityConfirmationDialog();
    }

    /**
     * Clicking complete button
     */
    private onCompleteButtonClick(): void {
        this.props.showCompleteButtonDialog();
    }

    /**
     * Set As Review Button Click
     */
    private onReviewButtonClick(reviewComment: enums.SetAsReviewedComment) {
        let navigatePossible: boolean = true;
        this.selectedReviewCommentId = reviewComment;
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
                enums.SaveAndNavigate.toSetAsReviewed,
                enums.SaveAndNavigate.toSetAsReviewed
            );
        } else {
            this.props.invokeReviewBusyIndicator();
            teamManagementActionCreator.setResponseAsReviewed(
                this.currentResponseDetails.markGroupId,
                teamManagementStore.instance.selectedExaminerRoleId, // The logged in examiner role id
                responseHelper.isClosedLiveSeed,
                teamManagementStore.instance.examinerDrillDownData.examinerRoleId, // The role id of the examiner who was selected from TM
                teamManagementStore.instance.examinerDrillDownData.examinerId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                this.selectedReviewCommentId
            ); //The selected review comment
        }
    }

    /**
     * returns mark by option component
     */
    private markByOptionComponent(): any {
        let markByOption;
        if (
            markerOperationModeFactory.operationMode.hasMarkByOption &&
            !responseHelper.isAtypicalResponse()
        ) {
            markByOption = (
                <MarkByOption
                    id={this.props.id + '-mark-by-option'}
                    key={this.props.id + '-mark-by-option'}
                    selectedLanguage={this.props.selectedLanguage}
                />
            );
        } else {
            markByOption = <div className='mark-by-holder' />;
        }
        return markByOption;
    }

    /**
     * Returns enhanced off-page comments toggle button component
     * @private
     * @returns {JSX.Element}
     * @memberof MarkSchemePanel
     */
    private commentsToggleButtonComponent(style: React.CSSProperties): JSX.Element {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            let isEnhancedOffPageCommentVisible: boolean =
                enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentsPanelVisible;
            return (
                <div className='toggle-comment-holder'>
                    <div className='comment-toggle-label' id='comment-toggle-label'>
                        {localeStore.instance.TranslateText(
                            'marking.response.mark-scheme-panel.comments-switch-label'
                        )}
                    </div>
                    <ToggleButton
                        id={this.props.id + '_toggle_button_comments'}
                        key={this.props.id + '_toggle_button_comments'}
                        isChecked={isEnhancedOffPageCommentVisible}
                        index={1}
                        onChange={this.onCommentsToggleChange}
                        style={style}
                        title={
                            isEnhancedOffPageCommentVisible ? (
                                localeStore.instance.TranslateText(
                                    'marking.response.mark-scheme-panel.comments-switch-tooltip-hide'
                                )
                            ) : (
                                    localeStore.instance.TranslateText(
                                        'marking.response.mark-scheme-panel.comments-switch-tooltip-show'
                                    )
                                )
                        }
                        onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                        offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}
                    />
                </div>
            );
        }
    }

    /**
     * get mark scheme panel header.
     */
    private getMarkSchemePanelHeader() {
        let allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        let marksAndAnnotationVisibilityDetails: Immutable.Map<
            number,
            Immutable.Map<number, marksAndAnnotationsVisibilityInfo>
            > =
            markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let markByOption = this.markByOptionComponent();

        if (allMarksAndAnnotations) {
            let allMarksAndAnnotationsCollectionLength = allMarksAndAnnotations.length;
            let defaultColor: string = colouredAnnotationsHelper.createAnnotationStyle(
                null,
                enums.DynamicAnnotation.None
            ).fill;
            let enhancedOffPageCommentToggleButton: JSX.Element = this.commentsToggleButtonComponent(
                this.getEnhancedOffpageCommentToggleButtonColor(
                    allMarksAndAnnotations,
                    defaultColor
                )
            );
            if (
                this.treeViewHelper.canRenderPreviousMarks() &&
                allMarksAndAnnotationsCollectionLength > 1
            ) {
                return (
                    <div className='question-panel-header'>
                        {enhancedOffPageCommentToggleButton}
                        {markByOption}
                        <MarkschemepanelHeaderDropdown
                            id={this.props.id + '-remark-dropdown'}
                            key={this.props.id + '-remark-dropdown'}
                            selectedLanguage={this.props.selectedLanguage}
                            renderedOnMarksAndAnnotationVisibility={
                                this.state.renderedOnMarksAndAnnotationVisibility
                            }
                            hideAnnotationToggleButton={this.props.hideAnnotationToggleButton}
                        />
                        <div className='pre-mark-title-holder'>
                            {this.getPreviousMarksColumnHeadings()}
                        </div>
                    </div>
                );
            } else {
                let _style: React.CSSProperties = {};
                let _isCurrentAnnotationVisible = marksAndAnnotationsVisibilityHelper.isCurrentAnnotaionsVisible(
                    marksAndAnnotationVisibilityDetails,
                    markingStore.instance.currentMarkGroupId
                );
                _style.color = marksAndAnnotationsVisibilityHelper.getLiveClosedAnnotationToggleButtonColor(
                    allMarksAndAnnotations,
                    defaultColor,
                    markingStore.instance.currentResponseMode
                );
                return (
                    <div className='question-panel-header'>
                        {enhancedOffPageCommentToggleButton}
                        {markByOption}
                        {this.annotationToggleButton(_isCurrentAnnotationVisible, _style)}
                    </div>
                );
            }
        }
    }

    /**
     * returns the annotation toggle button based on the visbility
     */
    private annotationToggleButton = (
        _isCurrentAnnotationVisible: boolean,
        _style: React.CSSProperties
    ): JSX.Element => {
        return this.props.hideAnnotationToggleButton ? null : (
            <div className='annotation-toggle'>
                <div className='annotation-toggle-label'>
                    {localeStore.instance.TranslateText(
                        'marking.response.mark-scheme-panel.annotations-switch-label'
                    )}
                </div>
                <ToggleButton
                    id={this.props.id + '_toggle_button'}
                    key={this.props.id + '_toggle_button'}
                    isChecked={_isCurrentAnnotationVisible}
                    index={0}
                    onChange={this.onToggleChange}
                    style={_style}
                    title={
                        _isCurrentAnnotationVisible ? (
                            localeStore.instance.TranslateText(
                                'marking.response.mark-scheme-panel.annotations-switch-tooltip-hide'
                            )
                        ) : (
                                localeStore.instance.TranslateText(
                                    'marking.response.mark-scheme-panel.annotations-switch-tooltip-show'
                                )
                            )
                    }
                    onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                    offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}
                />
            </div>
        );
    };

    /**
     *  Callback function for toggle button change
     */
    private onToggleChange = (index: number, isChecked: boolean): void => {
        this.isNavigationInsideTree = true;
        let marksAndAnnotationVisibilityDetails =
            markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let _marksAndAnnotationsVisibilityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotaionVisibilityByIndex(
            index,
            marksAndAnnotationVisibilityDetails,
            markingStore.instance.currentMarkGroupId
        );
        _marksAndAnnotationsVisibilityInfo.isAnnotationVisible = isChecked;
        let isEnchancedOffpageCommentVisible =
            markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
        markingActionCreator.updateMarksAndAnnotationVisibility(
            index,
            _marksAndAnnotationsVisibilityInfo,
            isEnchancedOffpageCommentVisible
        );
    };

    /**
     *  Callback function for comments toggle button change
     */
    private onCommentsToggleChange = (index: number, isChecked: boolean): void => {
        // If the comment is edited we can update the toggle button otherwise we need to show the popup
        if (enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited === false) {
            enhancedOffPageCommentActionCreator.updateEnhancedOffPageCommentsVisibility(isChecked);
        } else {
            this.props.onEnhancedOffPageCommentVisibilityChanged(
                enums.EnhancedOffPageCommentAction.Visibility,
                null,
                isChecked
            );
        }
    };

    /**
     * get previous marks column headings
     */
    private getPreviousMarksColumnHeadings() {
        let allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        // to get the previous column count removing the current marking
        let allMarksAndAnnotationsCount: number = allMarksAndAnnotations.length - 1;
        let marksAndAnnotationVisibilityDetails =
            markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let visiblityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(
            marksAndAnnotationVisibilityDetails,
            markingStore.instance.currentMarkGroupId
        );
        let responseMode = responseStore.instance.selectedResponseMode;
        let counter = -1;
        let description;
        let header;
        let remarkBaseColor = colouredAnnotationsHelper.getRemarkBaseColor(
            enums.DynamicAnnotation.None
        ).fill;
        let items = allMarksAndAnnotations.map(
            (item: Immutable.List<examinerMarksAndAnnotation>) => {
                counter++;
                let examinerMarksAgainstResponse: Array<examinerMarkData> =
                    markingStore.instance.getExaminerMarksAgainstResponse;
                let allMarksAndAnnotation =
                    examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                        .examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId]
                        .allMarksAndAnnotations[counter];
                let previousRemarkBaseColor: string = colouredAnnotationsHelper.getPreviousRemarkBaseColor(
                    examinerMarksAgainstResponse
                );

                if (visiblityInfo.get(counter).isMarkVisible === true) {
                    let markSchemeHeaderItems: Immutable.Map<
                        string,
                        any
                        > = marksAndAnnotationsVisibilityHelper.getMarkSchemePanelColumnHeaderAttributes(
                            counter,
                            item,
                            allMarksAndAnnotationsCount,
                            visiblityInfo,
                            responseHelper.isClosedEurSeed,
                            responseHelper.isClosedLiveSeed,
                            remarkBaseColor,
                            responseMode,
                            responseHelper.getCurrentResponseSeedType(),
                            markingStore.instance.currentMarkGroupId,
                            worklistStore.instance.currentWorklistType,
                            allMarksAndAnnotation,
                            previousRemarkBaseColor,
                            markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup
                        );
                    if (counter === 0) {
                        return null;
                    }
                    return (
                        <div key={'pre-mark-title-' + counter.toString()}
                            className='pre-mark-title' title={markSchemeHeaderItems.get('label')}>
                            {markSchemeHeaderItems.get('header')}
                        </div>
                    );
                }
            }
        );
        return items;
    }

    /**
     * get previous marks columns
     */
    private getPreviousMarksColumns() {
        if (this.treeViewHelper.canRenderPreviousMarks()) {
            let marksAndAnnotationVisibilityDetails =
                markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            let visiblityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(
                marksAndAnnotationVisibilityDetails,
                markingStore.instance.currentMarkGroupId
            );
            let allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
            let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
            let counter = -1;
            if (allMarksAndAnnotations === undefined || allMarksAndAnnotations === null) {
                return null;
            }
            let items = allMarksAndAnnotations.map((item: any) => {
                counter++;
                // check the index for the allMarksAndAnnotations collection and see if column need to be rendered
                if (visiblityInfo && visiblityInfo.get(counter).isMarkVisible === true) {
                    if (counter === 0) {
                        return null;
                    } else {
                        return (
                            <div key={'previous-column-' + counter.toString()}
                                className='pre-mark-col-bg'
                                style={this.getPreviousMarksColumnMarkSchemeColor(
                                    counter, currentMarkGroupId)} />
                        );
                    }
                }
            });

            return items !== null ? (
                <div className='mark-bg-holder'>
                    <div className='fader' />
                    {items}
                </div>
            ) : (
                    items
                );
        }
    }

    /**
     * Return the panel classname
     */
    private getMarkSchemePanelWrapperClassName(): string {
        let questionPanelClass = 'marking-question-panel';
        let qualityFeedbackButton = markerOperationModeFactory.operationMode
            .isQualityFeedbackOutstanding
            ? ' allow-feedback'
            : '';

        if (this.resizePanelClassName) {
            questionPanelClass += ' ' + this.resizePanelClassName;
        } else {
            questionPanelClass = 'marking-question-panel';
        }

        if (this.isCompleteButtonVisible()) {
            questionPanelClass = questionPanelClass + ' allow-complete';
        }
        if (this.showRemarkDecisionButton()) {
            questionPanelClass = questionPanelClass + ' allow-reason';
        }

        // appending allow-set-as-review class for set as review button.
        if (markerOperationModeFactory.operationMode.allowReviewResponse) {
            questionPanelClass += ' allow-set-as-review';
        }

        if (this.treeViewHelper.canRenderPreviousMarks()) {
            let marksAndAnnotationVisibilityDetails =
                markingStore.instance.getMarksAndAnnotationVisibilityDetails;

            // appending previous mark scheme column count.
            questionPanelClass +=
                ' mark-col-' +
                marksAndAnnotationsVisibilityHelper
                    .getMarksAndAnnotationVisibilityInfo(
                    marksAndAnnotationVisibilityDetails,
                    markingStore.instance.currentMarkGroupId
                    )
                    .filter((x: marksandannotationsvisibilityinfo) => x.isMarkVisible === true)
                    .count();

            // appending allow-reason class for total marks alignment.
            questionPanelClass += this.isMarkChangeReasonVisible ? ' allow-reason' : '';

            // appending allow-feedback class for quality feedback button alignment.
            questionPanelClass += markerOperationModeFactory.operationMode
                .isQualityFeedbackOutstanding
                ? ' allow-feedback'
                : '';

            return questionPanelClass;
        } else {
            return questionPanelClass + ' mark-col-1';
        }
    }

    /**
     * Get previous marks column mark scheme color.
     * @param index
     * @param markGroupId
     */
    private getPreviousMarksColumnMarkSchemeColor(
        index: number,
        markGroupId: number
    ): React.CSSProperties {
        let examinerMarksAgainstResponse: Array<examinerMarkData> =
            markingStore.instance.getExaminerMarksAgainstResponse;
        let allMarksAndAnnotation =
            examinerMarksAgainstResponse[markGroupId].examinerMarkGroupDetails[markGroupId]
                .allMarksAndAnnotations[index];

        let previousRemarkBaseColor = colouredAnnotationsHelper.getPreviousRemarkBaseColor(
            allMarksAndAnnotation
        );
        let color = marksAndAnnotationsVisibilityHelper.getPreviousMarksColumnMarkSchemeColor(
            index,
            worklistStore.instance.currentWorklistType,
            worklistStore.instance.getResponseMode,
            responseHelper.getCurrentResponseSeedType(),
            markingStore.instance.currentMarkGroupId,
            allMarksAndAnnotation,
            previousRemarkBaseColor,
            markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup
        );
        return {
            background: color
        };
    }

    /**
     * handling the transition when mark by candidate is selected
     */
    public handleMarkSchemeNavigation = (): void => {
        /* if the response was already marked 100%, it should not navigate to the next response */
        if (this.isFullyMarked() && this._initialMarkingProgress !== 100) {
            /* getting the next response id from store */
            let responseId = parseInt(
                markerOperationModeFactory.operationMode.nextResponseId(
                    responseStore.instance.selectedDisplayId.toString()
                )
            );
            let responseNavigationFailureReasons: Array<
                enums.ResponseNavigateFailureReason
                > = markingHelper.canNavigateAwayFromCurrentResponse(
                    this.treeViewHelper.totalMarkAndProgress.markingProgress
                );
            this.isAllPageNotAnnotatedVisible =
                responseNavigationFailureReasons.indexOf(
                    enums.ResponseNavigateFailureReason.AllPagesNotAnnotated
                ) !== -1
                    ? true
                    : false;
            /* if next response is available then move to the next response */
            if (responseId) {
                if (this.hasAutoNavigation) {
                    if (this.isAllPageNotAnnotatedVisible) {
                        markingActionCreator.showAllPageNotAnnotatedMessage(
                            enums.SaveAndNavigate.toResponse
                        );
                    } else if (messageStore.instance.isMessagePanelActive) {
                        messagingActionCreator.messageAction(
                            enums.MessageViewAction.NavigateAway,
                            enums.MessageType.None,
                            enums.SaveAndNavigate.toResponse
                        );
                    } else if (exceptionStore.instance.isExceptionPanelActive) {
                        exceptionActionCreator.exceptionWindowAction(
                            enums.ExceptionViewAction.NavigateAway,
                            null,
                            enums.SaveAndNavigate.toResponse
                        );
                    } else {
                        this.triggerSave(false, true);
                    }
                } else {
                    /*if the response is 100% marked and hasAutoNavigation is flase the move to next markscheme if exist*/
                    this.moveNext();
                }
            } else {
                // This block is last response in worklist. Display worklist navigation popup based on the Autonavigation
                this.isMbCConfirmationDialogDisplaying = this.hasAutoNavigation;
                /*if next response not available then move to next markscheme*/
                this.moveNext();
            }
        } else {
            /* if the response is not 100% marked then move to the next markscheme */
            this.moveNext();
        }
    };

    /**
     * checking whether the current response is fully marked or not
     */
    private isFullyMarked(): boolean {
        if (this.treeViewHelper.totalMarkAndProgress.markingProgress === 100) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        let isRenderMarkschemePanel = false;
        /* checking whether selectedNode exist or not, if not exist then point to the first markableitem */
        if (!this.markSchemeHelper.selectedNodeGet) {
            /** getting the first markable node and setting it as selected */
            let selectedNode = this.getNextMarkableItem();
            this.navigateToMarkScheme(selectedNode, true, false, true);
        } else {
            this.isFirstLoad = false;
            // markschemepanel was not rendering correctly when it is in simulation mode( Reason : excption and message icon removed)
            // isSelected value of selected question item became true after rerendering.
            if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
                isRenderMarkschemePanel = true;
            }
            this.navigateToMarkScheme(
                this.markSchemeHelper.selectedNodeGet,
                true,
                false,
                isRenderMarkschemePanel
            );
        }

        // When the use switches back from the full responseview,
        // we should update the current update in selected questionitem.
        this.isResponseChanged = Date.now();
        this.reloadTreeview = Date.now();
        markingStore.instance.addListener(
            markingStore.MarkingStore.SAVE_AND_NAVIGATE_EVENT,
            this.saveAndNavigate
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION,
            this.resetMarksAndAnnotation
        );

        // Update the mark scheme panel on annotation add/remove.
        markingStore.instance.addListener(
            markingStore.MarkingStore.ANNOTATION_ADDED,
            this.refreshMarkSchemePanelOnAddAnnotation
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.REMOVE_ANNOTATION,
            this.refreshMarkSchemePanelOnRemoveAnnotation
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARK_SCHEME_NAVIGATION,
            this.initiateTransition
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS,
            this.enterNRForUnMarkedItems
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.onQuestionItemChanged
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.handleMarksAndAnnotationsVisibility
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.ANNOTATION_UPDATED,
            this.refreshMarkSchemePanelOnUpdateAnnotation
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARK_CHANGE_REASON_UPDATED,
            this.markChangeReasonUpdate
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED,
            this.supervisorRemarkDecisionUpdate
        );

        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }

        // if message panel is visible then we don't need to activate keyDownHelper
        if (
            !messageStore.instance.isMessagePanelVisible &&
            !exceptionStore.instance.isExceptionPanelVisible
        ) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        }

        markingStore.instance.addListener(
            markingStore.MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME,
            this.panelClassName
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.PANEL_WIDTH,
            this.onPanelResize
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.GET_EXCEPTIONS,
            this.onExceptionChange
        );
        exceptionStore.instance.addListener(
            exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW,
            this.onExceptionChange
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.UPDATE_PANEL_WIDTH,
            this.onUpdatePanelWidth
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT,
            this.reRenderMarkChangeReason
        );
        this.markSchemePanelTransition = document
            .getElementsByClassName('marking-question-panel')
            .item(0);
        if (this.markSchemePanelTransition) {
            this.markSchemePanelTransition.addEventListener('transitionend', this.onAnimationEnd);
        }
        markingStore.instance.addListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.navigateAwayFromResponse
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.NOTIFY_MARK_UPDATED,
            this.notifyMarkUpdated
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.ADD_MARK_BY_ANNOTATION,
            this.doStampAnnotation
        );
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.RESPONSE_REVIEWED,
            this.setResponseAsReviewed
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.REMOVE_MARKS_BY_ANNOTATION,
            this.removeAnnotationMark
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.RETRIEVE_MARKS_EVENT,
            this.marksRetrieved
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
            this.handleEnhancedOffPageCommentsVisibility
        );
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA,
            this.enableToggleButtonOnEnhancedCommentUpdate
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.ALL_FILES_VIEWED_CHECK,
			this.updateFileReadStatusonNavigation
		);
        toolbarStore.instance.addListener(
            toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA,
            this.onStampPanToDeleteArea
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.navigateToQigInWholeResponse
        );
        stampStore.instance.addListener(
            stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT,
            this.handleEnhancedOffPageCommentsVisibility
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED,
            this.onPreviousMarksAnnotationCopied
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED,
            this.onExceptionChange
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE,
            this.onCopyMarksAndAnnotationAsDefinitive
        );
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SAVE_AND_NAVIGATE_EVENT,
            this.saveAndNavigate
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION,
            this.resetMarksAndAnnotation
        );

        markingStore.instance.removeListener(
            markingStore.MarkingStore.ANNOTATION_ADDED,
            this.refreshMarkSchemePanelOnAddAnnotation
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.REMOVE_ANNOTATION,
            this.refreshMarkSchemePanelOnRemoveAnnotation
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS,
            this.enterNRForUnMarkedItems
        );
        /*  Removed  -- This add the markgroup to gueue with isDirty as true, result in unwanted save
        When user clicks on back button, we will have to save the currently entered mark
        if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed) {
            this.triggerSave(false);
        }*/

        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_SCHEME_NAVIGATION,
            this.initiateTransition
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.onQuestionItemChanged
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.handleMarksAndAnnotationsVisibility
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.ANNOTATION_UPDATED,
            this.refreshMarkSchemePanelOnUpdateAnnotation
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_CHANGE_REASON_UPDATED,
            this.markChangeReasonUpdate
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED,
            this.supervisorRemarkDecisionUpdate
        );

        if (deviceHelper.isTouchDevice()) {
            this.unRegisterEvents();
        }

        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME,
            this.panelClassName
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.PANEL_WIDTH,
            this.onPanelResize
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.GET_EXCEPTIONS,
            this.onExceptionChange
        );
        exceptionStore.instance.removeListener(
            exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW,
            this.onExceptionChange
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.UPDATE_PANEL_WIDTH,
            this.onUpdatePanelWidth
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT,
            this.reRenderMarkChangeReason
        );
        this.markSchemePanelTransition.removeEventListener('transitionend', this.onAnimationEnd);
        markingStore.instance.removeListener(
            markingStore.MarkingStore.READY_TO_NAVIGATE,
            this.navigateAwayFromResponse
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.NOTIFY_MARK_UPDATED,
            this.notifyMarkUpdated
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.ADD_MARK_BY_ANNOTATION,
            this.doStampAnnotation
        );
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.RESPONSE_REVIEWED,
            this.setResponseAsReviewed
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.REMOVE_MARKS_BY_ANNOTATION,
            this.removeAnnotationMark
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.RETRIEVE_MARKS_EVENT,
            this.marksRetrieved
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
            this.handleEnhancedOffPageCommentsVisibility
        );
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore
                .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA,
            this.enableToggleButtonOnEnhancedCommentUpdate
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.ALL_FILES_VIEWED_CHECK,
			this.updateFileReadStatusonNavigation
		);
        toolbarStore.instance.removeListener(
            toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA,
            this.onStampPanToDeleteArea
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.navigateToQigInWholeResponse
        );
        stampStore.instance.removeListener(
            stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT,
            this.handleEnhancedOffPageCommentsVisibility
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED,
            this.onPreviousMarksAnnotationCopied
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED,
            this.onExceptionChange
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE,
            this.onCopyMarksAndAnnotationAsDefinitive
		);
    }

    private notifyMarkUpdated = (): void => {
        if (!this.isMBaCCOn || this.isNRclicked) {
            if (this.canNavigateMbQSingleDigitMark) {
                this.navigateMbQSingleDigitMarkScheme();
            } else if (this.isMbaNRClicked) {
                this.navigateMbaNRClick();
            }
            this.doTriggerResponseNavigation = true;
            this.isNRclicked = false;
        }
    };

    /**
     * Determines MBQ single digit markscheme navigation is needed.
     * @param isMbQSelected
     */
    private get canNavigateMbQSingleDigitMark(): boolean {
        let isSingleDigitMarkWithoutEnter =
            userOptionsHelper.getUserOptionByName(
                userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER
            ) === 'true'
                ? true
                : false;
        if (
            this.doTriggerResponseNavigation &&
            this.currentQuestionItem.isSingleDigitMark &&
            !this.props.ismarkEntryPopupVisible &&
            responseHelper.isMbQSelected &&
            isSingleDigitMarkWithoutEnter
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Markscheme navigation while MBA NR button click.
     * @param isMbQSelected
     */
    private navigateMbaNRClick = (): void => {
        if (!this.currentQuestionItem.isSingleDigitMark && responseHelper.isMbQSelected) {
            this.scrollHelper.navigateMarkSchemeOnDemand(true);
        } else {
            this.handleMarkSchemeNavigation();
        }
    };

    /**
     * Markscheme navigation MBQ single digit markscheme.
     */
    private navigateMbQSingleDigitMarkScheme(): void {
        if (this.markSchemeHelper.isLastResponseLastQuestion) {
            this.scrollHelper.navigateMarkSchemeOnDemand(true);
            return;
        }

        if (!markSchemeHelper.isNextResponseAvailable) {
            this.setNextMarkSchemeItem();
        }
        this.scrollHelper.navigateMarkSchemeOnDemand(true);
    }

    /**
     * Returns MBA NR button clicked.
     * @param isMbaCCActive
     */
    private get isMbaNRClicked(): boolean {
        return this.isMBaCCOn && this.isNRclicked;
    }

    /**
     * Go to another response after saving mark if there is any
     */
    private navigateAwayFromResponse = (navigationFrom: enums.ResponseNavigation): void => {
        if (
            responseHelper.isMbQSelected === true &&
            navigationFrom &&
            navigationFrom === enums.ResponseNavigation.markScheme &&
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toResponse
        ) {
            let responseNavigation = undefined;
            let responseId = responseStore.instance.selectedDisplayId.toString();
            if (
                !markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseId) ||
                !markerOperationModeFactory.operationMode.isNextResponseAvailable(responseId)
            ) {
                responseNavigation = enums.ResponseNavigation.markScheme;
            }
            navigationHelper.responseNavigation(responseNavigation);
        } else if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toSetAsReviewed) {
            this.props.invokeReviewBusyIndicator();

            teamManagementActionCreator.setResponseAsReviewed(
                this.currentResponseDetails.markGroupId,
                teamManagementStore.instance.selectedExaminerRoleId, // The logged in examiner role id
                responseHelper.isClosedLiveSeed,
                teamManagementStore.instance.examinerDrillDownData.examinerRoleId,
                teamManagementStore.instance.examinerDrillDownData.examinerId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                this.selectedReviewCommentId
            );
        }
    };

    /**
     * Rerender mark change reason if needed
     */
    private reRenderMarkChangeReason = () => {
        this.checkMarkChangeReason();
    };

    /**
     * Called once panel is resized to left/right
     * param - width
     * param - className
     */
    private onPanelResize = (width: string, className: string): void => {
        if (width) {
            /* To remove text selection while resizing */
            window.getSelection().removeAllRanges();
            this.resizedPanelWidth = width;
            this.resizePanelClassName = className;
            this.setState({ width: width });
        }
    };

    /**
     * Called to update panel width once column list is updated
     * param - width
     */
    private onUpdatePanelWidth = (width: string): void => {
        if (width) {
            this.resizedPanelWidth =
                userOptionsHelper.getUserOptionByName(
                    userOptionKeys.MARKSCHEME_PANEL_WIDTH,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId
                ) + '%';
        }
    };

    /**
     * Called once panel resizing classname is updated
     * param - className
     */
    private panelClassName = (className: string): void => {
        this.resizePanelClassName = className ? className : '';
        if (this.resizePanelClassName === '') {
            this.setState({ refreshMarkschemePanelResizer: Date.now() });
        }
    };

    /**
     * conditions where the select Response to mark button in SSU centre script is visible.
     */
    private get isSelectResponsesButtonVisible(): boolean {
        let isPEOrAPE =
            qigStore.instance.selectedQIGForMarkerOperation.role ===
            enums.ExaminerRole.principalExaminer ||
            qigStore.instance.selectedQIGForMarkerOperation.role ===
            enums.ExaminerRole.assistantPrincipalExaminer;
        /**
         * select to mark button shown under below conditions
         * 1. Script in 'Available' status
         * 2. logged-in marker has browse permission (STM member)
         * 3. In case the Standardisation setup is complete, the button shall be visible only if the logged-in marker is a PE/APE.
         * 4. ExaminerCentreExclusivity CC is enabled and Standardisation setup has been completed - not shown for PE as well.
         *
         * In following scenario's the "Select to mark" button will not appear
         * The Standardisation setup is ON for that component.
         * The Standardisation is in the 'In progress'/'Complete' status.
         * Examiner (Standardisation Team Member) has a browser permission 'B' set for that particular QIG /
         * Examiner has browser permission 'BM' but that respective user role doesn't have
         * <ViewDefinitive> or <ManageDefinitive> permission within the StandardisationSetupPermission CC.
         * isQigHasBrowseScriptPermissionOnly(qig) is implemented in this method to check against the above scenario
         */
        let isSelectResponseButtonVisible: boolean = standardisationSetupStore.instance.selectedScriptAvailable &&
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

        if (standardisationSetupStore.instance.isUnClassifiedWorklist) {
            return (standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives === true);
        } else if ((qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete && !isPEOrAPE) ||
            (configurableCharacteristicsValues.examinerCentreExclusivity
                && qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)
            || qigStore.instance.isQigHasBrowseScriptPermissionOnly(qigStore.instance.selectedQIGForMarkerOperation)) {
            isSelectResponseButtonVisible = false;
        }

        return isSelectResponseButtonVisible;
    }

    /**
     * markChangeReasonUpdate
     */
    private markChangeReasonUpdate = (): void => {
        this.isResponseDirty = true;
        this.isNavigationInsideTree = true;
        // rerender the markschemepanel only if deleting all content or if entering atleast one character to show or hide submit button
        let markChangeReasonLength = markingStore.instance.getMarkChangeReason(
            markingStore.instance.currentMarkGroupId
        ).length;
        if (markChangeReasonLength === 0 || markChangeReasonLength === 1) {
            this.setState({
                renderedOnMarkChangeReason: Date.now()
            });
        }
    };

    /**
     * supervisor remark decision update
     */
    private supervisorRemarkDecisionUpdate = (): void => {
        this.isResponseDirty = true;
        this.isNavigationInsideTree = true;
        this.setState({
            supervisorRemarkDecisionRenderedOn: Date.now()
        });
    };

    /**
     * handleMarksAndAnnotationsVisibility
     */
    private handleMarksAndAnnotationsVisibility = (
        isMarksColumnVisibilitySwitched: boolean
    ): void => {
        this.isNavigationInsideTree = true;
        this.isMarksColumnVisibilitySwitched = isMarksColumnVisibilitySwitched;
        this.reloadTreeview = Date.now();
        this.setState({
            renderedOnMarksAndAnnotationVisibility: Date.now(),
            renderedOnMarksColumnVisibilitySwitched:
            isMarksColumnVisibilitySwitched === true
                ? Date.now()
                : this.state.renderedOnMarksColumnVisibilitySwitched,
            renderedOn: Date.now()
        });
    };

    /**
     * Called an exception is raised or when exception panel is closed
     */
    private onExceptionChange = () => {
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        this.isNavigationInsideTree =
            this.props.loadMarkSchemePanel === nextProps.loadMarkSchemePanel;
        // avoid any additional rendering of the markscheme panel/ treeview while resizing
        if (!this.resizePanelClassName) {
            this.samplingRenderedOn = Date.now();
            this.reloadTreeview = Date.now();
        }
        // Sometimes Copying mark and annotations are happening before the mark scheme panel is rendered.
        // Due to this marking progress is not turned to 100 while navigating to worklist. So while initialising mark scheme panel
        // check the dirty flag needs to be set for the progress based on isPreviousMarksAndAnnotationCopied.
        if (
            !this.props.isPreviousMarksAndAnnotationCopied &&
            nextProps.isPreviousMarksAndAnnotationCopied
        ) {
            this.isResponseDirty = true;
        }
    }

    /**
     * This function gets invoked when the component is about to be updated
     */
    public componentDidUpdate() {
        /* Navigate to first node only if response is changed . Managing this using the first load flag (setting true initialy)*/
        if (this.isFirstLoad === true) {
            let markDetails: MarkDetails = this.treeViewHelper.totalMarkAndProgress;
            /* if a new response is opened then the initial marking progress should be updated to the marking store */
            markingActionCreator.updateInitialMarkingProgress(markDetails.markingProgress);
            this._initialMarkingProgress = markDetails.markingProgress;

            ///* if a new response is opened then the initial marking progress should be updated to the marking store */
            //markingActionCreator.updateInitialMarkingProgress(this.markDetails.markingProgress);
            /** resetting after first use */
            this.isFirstLoad = false;
            let selectedNode = this.getNextMarkableItem();
            this.navigateToMarkScheme(selectedNode, true, false, true);
            // Reload the selected item to reflect the actual mark
            // mark entry textbox.
            this.isResponseChanged = Date.now();
        }
        this.markScheme = ReactDom.findDOMNode(this.refs.markScheme) as HTMLElement;
        if (this.markScheme) {
            this.containerWidth = this.markScheme.getBoundingClientRect().width;
            this.props.getMarkSchemePanelWidth(this.containerWidth);
        }
    }

    /**
     * This function will return the node item for setting it as selected in markscheme .
     * If it is fully marked,not mrakscheme navigtion,then the first question item shall be selected by default.
     * If the response not fully marked then examiner shall be taken to the first unmarked question item of that response.
     * In team management mode, the first question item shall be selected by default.
     */
    private getNextMarkableItem(): treeViewItem {
        let selectedNode;
        /*set the selectedNode as unmarked item when it is 100% marked and navigation is not through markscheme.*/
        if (
            this.treeNodes.markingProgress < 100 &&
            markingStore.instance.isNavigationThroughMarkScheme !==
            enums.ResponseNavigation.markScheme &&
            markerOperationModeFactory.operationMode.isGetFirstUnmarkedItem
        ) {
            selectedNode = navigationHelper.getFirstUnmarkedItem(this.treeNodes, true);
        } else {
            let uniqueId: number = 0;
            if (
                this.treeNodes.bIndex !== this.previousTreeNodeBIndex &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode
            ) {
                uniqueId = worklistStore.instance.selectedQuestionItemUniqueId;
            }
            selectedNode = this.markSchemeHelper.getMarkableItem(
                this.treeNodes,
                this.getSelectedQuestionItemBIndex,
                undefined,
                uniqueId
            );
        }
        return selectedNode;
    }

    /* trigger markscheme transition after mark confirmation */
    private initiateTransition = (): void => {
        if (this.isMbCConfirmationDialogDisplaying) {
            if (this.isAllPageNotAnnotatedVisible) {
                markingActionCreator.showAllPageNotAnnotatedMessage(
                    enums.SaveAndNavigate.lastResponse
                );
            } else {
                this.isMbCConfirmationDialogDisplaying = false;
                this.props.showMbCConfirmationDialog();
            }
        } else if (markingStore.instance.isNextResponse && this.hasAutoNavigation) {
            let responseId = parseInt(
                markerOperationModeFactory.operationMode.nextResponseId(
                    responseStore.instance.selectedDisplayId.toString()
                )
            );
            let openedResponseDetails = worklistStore.instance.getResponseDetails(
                responseId.toString()
            );
            /* opening next response */
            responseHelper.openResponse(
                responseId,
                enums.ResponseNavigation.next,
                worklistStore.instance.getResponseMode,
                openedResponseDetails.markGroupId,
                responseStore.instance.selectedResponseViewMode
            );

            // Ideally marking mode should be read from the opened response,
            // since multiple marking modes won't come in the same worklist now this will work.
            let selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(
                worklistStore.instance.currentWorklistType
            );

            /* get the marks for the selected response */
            markSchemeHelper.getMarks(responseId, selectedMarkingMode);
        } else if (this.nextNode) {
            this.treeNodes.treeViewItemList = this.markSchemeHelper.navigateToMarkScheme(
                this.nextNode,
                this.treeNodes
            );
            /* this.treeNodes.treeViewItemList = this.markingHelper.navigateToMarkScheme(this.nextNode, this.treeNodes.treeViewItemList);
            setting true when navigation with in the panel */
            this.isNavigationInsideTree = true;

            // This to reset the 'isNavigating' flag in the mark entry text box (selectedquestionitem component)
            this.isResponseChanged = Date.now();
            this.reloadTreeview = Date.now();
            this.setState({ renderedOn: Date.now() });
        }

        //if message panel is visible then we don't need to activate keyDownHelper
        if (
            !messageStore.instance.isMessagePanelVisible &&
            !exceptionStore.instance.isExceptionPanelVisible &&
            responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured
        ) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
        }
    };

    /**
     * Invoked when the markscheme got selected.
     * @param {number} uniqueId
     * @param isMarkUpdatedWithoutNavigation
     */
    private navigateToMarkScheme(
        node: treeViewItem,
        isInitialLoading: boolean = false,
        isMarkUpdatedWithoutNavigation: boolean = false,
        forceRender: boolean = false
    ): void {
        if (node) {
            // If navigation is happening from one qig to another and there is an enhanced off page comment edited,
            // then show the discard comment popup and prevent navigation to next question item.
            if (
                this.markSchemeHelper.selectedNodeGet &&
                this.markSchemeHelper.selectedNodeGet.markSchemeGroupId !==
                node.markSchemeGroupId &&
                enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited
            ) {
                this.props.onEnhancedOffPageCommentVisibilityChanged(
                    enums.EnhancedOffPageCommentAction.MarkSchemeNavigation,
                    null,
                    true,
                    node
                );
                return;
            }

            //For Single Qig,MarkschemeGroupid will come as null so setting it to markschemegroupid
            //of selected qig
            if (node.markSchemeGroupId === 0) {
                node.markSchemeGroupId = markerOperationModeFactory.operationMode.isAwardingMode ?
                    awardingStore.instance.selectedSession.markSchemeGroupId :
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            }

            if (!isInitialLoading && markingStore.instance.isMarkingInProgress) {
                this.nextNode = node;
                this.triggerSave(isMarkUpdatedWithoutNavigation);
            } else {
                this.treeNodes.treeViewItemList = this.markSchemeHelper.navigateToMarkScheme(
                    node,
                    this.treeNodes,
                    forceRender
                );
                /* setting true when navigation with in the panel */
                this.isNavigationInsideTree = true;
            }
        } else if (markingStore.instance.isMarkingInProgress) {
            this.triggerSave(true);
            if (this.isLastNodeSelected) {
                // fix for defect : #38482 - usually the activation happens as the image load occurs in response.
                // container but for the last markscheme the image load wont happen and so the keydown helper
                // will be in deactive state. so to move up activating the keydownhelper.
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
            }
        }

        /* For a team member other than PE should be able to edit or remove the shared overlay.
           But it should be reappear next the response navigation.
           And also the overlay changes should not be saved in the database.
           Reset shared acetates only for structured response. */
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            acetatesActionCreator.resetSharedAcetate();
        }
    }

    /**
     * Select the navigated markscheme on the UI
     * @param index
     * @param elementHeight
     */
    private onMarkSchemeSelected(index: number, elementHeight: number): void {
        // TODO need to select the highligter offset from store once the component has been created.
        let y = (0 -
            (this.markSchemeHelper.selectedPanelOffSet + (index - 1) * elementHeight)).toString();
        if (this.state.offSet !== y) {
            /* setting true when navigation with in the panel */
            this.isNavigationInsideTree = true;
            this.reloadTreeview = Date.now();
            this.setState({ offSet: y });
        }
    }
    /**
     * Loading marking scheme structure
     */
    private loadMarkSchemeStructure(): void {
        // Defect 66311 fix - Don't reset isResponseDirty flag, setting on copying marks and annotations
        if (!this.props.isPreviousMarksAndAnnotationCopied) {
            this.isResponseDirty = false;
        }
        this.treeViewHelper = new treeViewDataHelper();
        this.previousTreeNodeBIndex = this.treeNodes ? this.treeNodes.bIndex : 0;
        this.treeNodes = this.treeViewHelper.getMarkSchemeStructureNodeCollection();
        if (this.treeViewHelper.isWholeResponse) {
            this.navigateToQigInWholeResponse(
                markingStore.instance.selectedQIGMarkSchemeGroupId,
                undefined
            );
        }
        /* update the annotation tooltips information */
        this.markSchemeHelper.updateAnnotationToolTips(this.treeViewHelper.toolTipInfo);

        /* If the user is navigating from full response view then the selected item should updated from the new treeNodes instance
         * Otherwise the reference will change */
        if (!this.markSchemeHelper.selectedNodeGet) {
            // If user navigating from full response view using mark this page option then we have to find and navigate to the
            // corresponding mark scheme in structured response
            if (responseStore.instance.imageZonesAgainstPageNumber) {
                this.markSchemeHelper.updateSelectedNode(
                    this.markSchemeHelper.getFirstMarkableItemFromImageZones(
                        this.treeNodes,
                        responseStore.instance.imageZonesAgainstPageNumber,
                        responseStore.instance.linkedAnnotationAgainstPageNumber
                    )
                );
            } else if (markingStore.instance.currentQuestionItemInfo) {
                this.markSchemeHelper.updateSelectedNode(
                    this.markSchemeHelper.getMarkableItem(
                        this.treeNodes,
                        markingStore.instance.currentQuestionItemInfo.bIndex
                    )
                );
            } else if (markerOperationModeFactory.operationMode.isAwardingMode) {
                this.markSchemeHelper.updateSelectedNode(
                    this.markSchemeHelper.getMarkableItem(
                        this.treeNodes,
                        1
                    )
                );
            }
        }

        /* marks management helper object */
        this.marksManagementHelper = new marksManagementHelper();
        this.originalMarkList = this.treeViewHelper.originalMarks;

        this.checkMarkChangeReason();

        /** selecting the index of first markable item (used for swipe node calculation) */
        this.firstMarkSchemeIndex = this.markSchemeHelper.getMarkableItem(
            this.treeNodes,
            this.getSelectedQuestionItemBIndex
        ).index;

        /** initialy the first node is selected and setting the flag which indicates that selection */
        this.isFirstNodeSelected = true;
        if (
            this.markSchemeHelper.selectedNodeGet &&
            this.markSchemeHelper.selectedNodeGet.nextIndex === 0
        ) {
            this.isLastNodeSelected = true;
        } else {
            this.isLastNodeSelected = false;
        }

        markingActionCreator.isLastNodeSelected(this.isLastNodeSelected);
        /** Setting the first load flag true on initial loading */
        this.isFirstLoad = true;

        if (this.treeViewHelper.canRenderPreviousMarks()) {
            this.treeViewHelper.traverseMarkSchemeTree(this.treeNodes);
        }

        if (this.showRemarkDecisionButton()) {
            // Reset the accuracy on load/response navigation and then calculate the accuracy again.
            this.accuracyIndicator = undefined;
            this.remarkDecision = markingStore.instance.convertSupervisorRemarkDecisionType();
            this.calculateAccuracy();
        }
    }

    /**
     * Downward movment of tree on down arrow click
     */
    public moveNext(): void {
        // Defect 29988 fix - this.isKeyActionOnProgress check is only for closed response worklist( fix for defect 34003),
        // no need to block the move in other response modes
        if (
            worklistStore.instance.getResponseMode !== enums.ResponseMode.closed ||
            this.isKeyActionOnProgress === false
        ) {
            if (!this.isLastNodeSelected) {
                this.isKeyActionOnProgress = true;
            }

            let nextNode = this.getNextMarkScheme;

            if (nextNode) {
                this.navigateToMarkScheme(nextNode);
            } else {
                /** if the selected mark scheme is the last one then no further move is allowed
                 * eventhough move next will be called when on enter key press or mark buttons press
                 * in order to save the entered mark for the last mark scheme, trigger navigate to mark scheme
                 */
                this.navigateToMarkScheme(nextNode, undefined, true);
            }

            // persist rotation if the image clustre id is same
            if (markingHelper.isImageClusterChanged()) {
                responseActionCreator.updateDisplayAngleOfResponse(true);
            }
        }
    }

    /**
     * Upward movment of tree on up arrow click
     */
    public movePrev(): void {
        // Defect 29988 fix - this.isKeyActionOnProgress check is only for closed response worklist( fix for defect 34003),
        // no need to block the move in other response modes
        if (
            worklistStore.instance.getResponseMode !== enums.ResponseMode.closed ||
            this.isKeyActionOnProgress === false
        ) {
            if (!this.isFirstNodeSelected) {
                this.isKeyActionOnProgress = true;
            }

            let prevNode = this.getPreviousMarkScheme;

            if (prevNode) {
                this.navigateToMarkScheme(prevNode);
            }

            // persist rotation if the image clustre id is same
            if (markingHelper.isImageClusterChanged()) {
                responseActionCreator.updateDisplayAngleOfResponse(true);
            }
        }
    }

    /**
     * To set the variables which describes whether the first node /last node is currently selected.
     */
    private setSelectedNodeTypes(): void {
        this.isLastNodeSelected = false;
        this.isFirstNodeSelected = false;
        // If the selected node is the only one in the markscheme
        if (
            this.markSchemeHelper.selectedNodeGet.previousIndex === 0 &&
            this.markSchemeHelper.selectedNodeGet.nextIndex === 0
        ) {
            this.isFirstNodeSelected = true;
            this.isLastNodeSelected = true;
        } else if (this.markSchemeHelper.selectedNodeGet.previousIndex === 0) {
            // The current markscheme has previous markscheme.
            this.isFirstNodeSelected = true;
        }

        if (this.markSchemeHelper.selectedNodeGet.nextIndex === 0) {
            this.isLastNodeSelected = true;
        }
        markingActionCreator.isLastNodeSelected(this.isLastNodeSelected);
    }

    /**
     * Update mark to the client.
     * @param {string} allocatedMark
     */
    public updateMark(): void {
        let previousMarkingProgress = this.treeNodes.markingProgress;
        let warningNR: warningNR;
        /* calculating total mark, cluster total and marking progress */
        this.treeNodes = this.treeViewHelper.updateMarkDetails(
            this.treeNodes,
            this.currentQuestionItem.bIndex,
            this.marksManagementHelper
        );
        /* retrieving newly calculated mark details */
        let markDetails: MarkDetails = this.treeViewHelper.totalMarkAndProgress;
        this.isResponseDirty = true;
        this.isNavigationInsideTree = true;

        // Update current selected markscheme mark in selection.
        this.markSchemeHelper.updateSelectedQuestionMark(this.currentQuestionItem);

        this.checkMarkChangeReason(this.currentQuestionItem.allocatedMarks.displayMark);

        if (previousMarkingProgress === 100 && this.treeNodes.markingProgress !== 100) {
            this.resetDecision();
        }

        let hasComplexOptionality: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ComplexOptionality,
            markingStore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;

        if (hasComplexOptionality) {
            markSchemeHelper.clearComplexOptionality(this.treeNodes);
        }
        /* call set states with new mark details */
        this.selectedQuestionItemRenderedOn = Date.now();
        this.reloadTreeview = Date.now();
        this.setState({
            renderedOn: Date.now(),
            renderedOnMarkChangeReason: Date.now()
        });
        // if the response is 100 % marked ,then check the NR warning condition based on CC
        // and optionality applyed for that  question paper.
        if (this.treeNodes.markingProgress === 100) {
            warningNR = markingHelper.getWarningNRDetails(this.treeNodes);
        }

        // Update the marking button to reflect the change
        markingActionCreator.notifyMarkUpdated(markDetails.markingProgress, warningNR);
    }

    /**
     * Checking mark change reason
     * @param {string} allocatedMark
     */
    private checkMarkChangeReason(allocatedMark: string = undefined) {
        let allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        if (allMarksAndAnnotations) {
            let allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(
                (x: any) => x.isDefault === true
            );
            if (
                allMarksAndAnnotationsWithIsDefault.length === 0 &&
                allMarksAndAnnotations[1] !== undefined
            ) {
                allMarksAndAnnotationsWithIsDefault =
                    allMarksAndAnnotations[1].examinerMarksCollection;
            }

            // Check whether previous marks are empty or not
            if (allMarksAndAnnotationsWithIsDefault.length > 0) {
                if (
                    worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark
                ) {
                    let isMarkChangeReasonVisible: boolean = undefined;
                    if (this.treeViewHelper.totalMarkAndProgress.markingProgress === 100) {
                        if (allocatedMark) {
                            isMarkChangeReasonVisible = markChangeReasonHelper.isMarkChangeReasonVisible(
                                this.currentQuestionItem.uniqueId,
                                allocatedMark
                            );
                        } else {
                            isMarkChangeReasonVisible = markChangeReasonHelper.isMarkChangeReasonVisible();
                        }
                        this.isMarkChangeReasonVisible = isMarkChangeReasonVisible;
                        markingActionCreator.setMarkChangeReasonVisibility(
                            this.isMarkChangeReasonVisible
                        );
                    } else {
                        this.isMarkChangeReasonVisible = false;
                        markingActionCreator.setMarkChangeReasonVisibility(
                            this.isMarkChangeReasonVisible
                        );
                    }
                }
            } else {
                this.isMarkChangeReasonVisible = false;
                markingActionCreator.setMarkChangeReasonVisibility(this.isMarkChangeReasonVisible);
            }
        }
    }

    /**
     * Trigger on touch move.
     */
    private onTouchMove(event: any) {
        /** To prevent the default flickering behavior of ipad safari */
        event.preventDefault();
    }

    /**
     * Trigger on swipe move.
     */
    private onSwipe(event: EventCustom) {
        if (this.resizePanelClassName) {
            event.preventDefault();
            return;
        }

        //to prevent infinate render
        if (this.props.doEnableMouseWheelEvent) {
            event.preventDefault();
            this.eventHandler.stopPropagation(event);

            let displacement: number = event.deltaY;
            let timeTaken: number = event.deltaTime;

            this.moveOnSwipeAndPan(true, displacement, timeTaken);
        } else {
            event.preventDefault();
        }
    }

    /**
     * Trigger on touch move.
     */
    private onPanMove(event: EventCustom) {
        if (this.resizePanelClassName) {
            event.preventDefault();
            return;
        }

        //to prevent infinate render
        if (this.props.doEnableMouseWheelEvent) {
            event.preventDefault();
            this.eventHandler.stopPropagation(event);
            let displacement: number = event.deltaY;
            let timeTaken: number = event.deltaTime;

            if (
                Math.abs(displacement) - this.previousDeltaY > MOVE_FACTOR_PIXEL &&
                event.velocity !== 0
            ) {
                this.moveOnSwipeAndPan(false, displacement, timeTaken);
                this.previousDeltaY = Math.abs(event.deltaY);
            }
        } else {
            event.preventDefault();
        }
    }

    /**
     * Trigger on touch end.
     */
    private onPanEnd(event: EventCustom) {
        if (this.resizePanelClassName) {
            event.preventDefault();
            return;
        }
        this.previousDeltaY = 0;
    }

    /**
     * to handle the navigation on mouse wheel
     */
    private onMouseWheel(event: any) {
        // If stamp paned beyoned the boundries then disable the mouse wheel event to fix the browser gets stuck issue.
        if (
            this.doEnableMouseWheel() &&
            this.props.doEnableMouseWheelEvent &&
            !this.isStampPanedBeyondBoundaries
        ) {
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);

            let delta = event.deltaY;
            if (delta > 0) {
                if (!this.isLastNodeSelected) {
                    this.isMouseWheelOnProgress = true;
                    this.moveNext();
                }
            } else {
                if (!this.isFirstNodeSelected) {
                    this.isMouseWheelOnProgress = true;
                    this.movePrev();
                }
            }
        } else {
            event.preventDefault();
        }
    }

    /**
     * disable mouse scroll for IE11 on windows10
     * @return false if IE11 windows10
     */
    private doEnableMouseWheel(): boolean {
        if (
            (htmlUtilities.getUserDevice().userDevice === 'windows' &&
                htmlUtilities.getUserDevice().osVersion === '10' &&
                htmlUtilities.isIE11) ||
            this.isMouseWheelOnProgress
        ) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * moving mark scheme tree nodes on swipe based on velocity of swipe.
     * @param isSwipe - Is triggered from swipe or not
     * @param displacement - displacement on swiping/rolling.
     */
    private moveOnSwipeAndPan(isSwipe: boolean, displacement: number, timeTaken: number): void {
        let numberOfNodesToMove = this.calculateNumberOfNodesToMove(
            Math.abs(displacement),
            timeTaken,
            isSwipe
        );
        /* getting the next markable node after numberOfNodesToMove  and setting it as selectd */
        if (numberOfNodesToMove > 0) {
            let isBackward = displacement > 0 ? true : false;
            let currentIndex = this.getCurrentIndexOnSwipe(numberOfNodesToMove, isBackward);

            /* taking the next node of the tree based on the index calculated and navigating to that */
            let nextNode = this.markSchemeHelper.getMarkableItem(
                this.treeNodes,
                currentIndex,
                true
            );
            if (nextNode) {
                this.navigateToMarkScheme(nextNode);
            }
        }
    }

    /**
     * Calculating the number of nodes to move based on the velocity of swipe
     * @param displacement - displacement on swiping.
     * @param time - time taken for swiping.
     * @param isVelocityBased - Whether the number of node calculation is velocity based (for swipe) or not(for pan).
     * @retrn number - number of nodes to be moved.
     */
    private calculateNumberOfNodesToMove(
        displacement: number,
        time: number,
        isVelocityBased: boolean
    ): number {
        let velocity: number;
        let numberOfNodes: number = 0;

        velocity = displacement / time;
        if (isVelocityBased) {
            numberOfNodes = Math.floor(velocity * SWIPE_MOVE_FACTOR);
            numberOfNodes = numberOfNodes === 0 ? 1 : numberOfNodes;
        } else {
            /** Setting this to 1 for roll (touch and move). To move to next node on every touch move event */
            numberOfNodes = 1;
        }

        return numberOfNodes;
    }

    /**
     * return the index just before the next movable node of tree based on the numberOfNodesToMove
     * @param numberOfNodesToMove
     * @param isBackward - whether the movment is backward or forward (up/down)
     */
    private getCurrentIndexOnSwipe(numberOfNodesToMove: number, isBackward: boolean): number {
        let selectedBIndex = this.markSchemeHelper.selectedNodeGet.bIndex;

        let direction = isBackward
            ? enums.MarkSchemeNavigationDirection.Backward
            : enums.MarkSchemeNavigationDirection.Forward;

        for (let i = 0; i < numberOfNodesToMove; i++) {
            let node: treeViewItem;
            //if (isBackward) {
            node = this.markSchemeHelper.getMarkableItemByDirection(
                this.treeNodes,
                selectedBIndex,
                direction
            );

            // If there are no more node to travel, quit and set the previous as selected
            //if (this.isLastOrFirstNode(node.index) === false) {
            if (!isBackward && node.bIndex === this.treeViewHelper.lastBIndex) {
                selectedBIndex = this.treeViewHelper.lastBIndex;
                return selectedBIndex;
            } else {
                selectedBIndex = isBackward ? node.previousIndex : node.nextIndex;
            }
        }

        return selectedBIndex;
    }

    /**
     * Indicating whether the node is last or first
     * @param {number} index
     * @return
     */
    private isLastOrFirstNode(index: number): boolean {
        return index === this.firstMarkSchemeIndex ||
            index === this.treeViewHelper.getLastNodeIndex()
            ? true
            : false;
    }

    /**
     * Tirgger save
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     */
    private triggerSave(
        isMarkUpdatedWithoutNavigation: boolean,
        isNextResponse: boolean = false
    ): void {
        let isAllPagesAnnotated: boolean = markingHelper.isAllPageAnnotated();
        let markDetailsForSelectedQIG: MarkDetails = this.treeViewHelper.totalMarkAndProgress;
        let overallMarkingProgress: number = markDetailsForSelectedQIG.markingProgress;
        if (this.currentQuestionItem) {
            // in case of a whole response, assign markDetails based on selected QIG in Markschemepanel.
            if (this.treeViewHelper.isWholeResponse) {
                markDetailsForSelectedQIG = this.treeViewHelper.getSelectedQigMarkingProgressDetails(
                    this.treeNodes,
                    markingStore.instance.selectedQIGMarkSchemeGroupId
                );
            }
			keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.TriggerSave);

			// If SSU Definitive marking, Update the Mark and Annotation collection when multiple markers are 
			// marking the same response before classify.
			if (markingStore.instance.isDefinitiveMarking && !markingStore.instance.isDefinitiveMarkCollectionUpdated) {
				let that = this;
				copyPreviousMarksAndAnnotationsHelper.updateDefinitiveMarkCollectionForDifferentMarkers(
					function () {
						that.callBackProcessmark(that.currentQuestionItem, markDetailsForSelectedQIG,
							isMarkUpdatedWithoutNavigation,
							isNextResponse,
							isAllPagesAnnotated,
							overallMarkingProgress,
							that.treeNodes.markSchemeCount,
							that.logSaveMarksAction);
					}
				);

			} else {
				/* Trigger save mark for the current selected item just before navigating to the next mark scheme */
				this.marksManagementHelper.processMark(
					this.currentQuestionItem.allocatedMarks,
					this.currentQuestionItem.uniqueId,
					markDetailsForSelectedQIG.markingProgress,
					markDetailsForSelectedQIG.totalMarkedMarkSchemes,
					parseFloat(markDetailsForSelectedQIG.totalMark),
					markDetailsForSelectedQIG.isAllNR,
					isMarkUpdatedWithoutNavigation,
					isNextResponse,
					this.currentQuestionItem.usedInTotal,
					isAllPagesAnnotated,
					this.currentQuestionItem.markSchemeGroupId,
					false,
					true,
					overallMarkingProgress,
					this.treeNodes.markSchemeCount,
					this.logSaveMarksAction
				);
			}
        }

        if (this.treeViewHelper.isWholeResponse) {
            // in case of whole response, have to update isAllPagesAnnotated flag for all the related QIGs.
            this.updateIsAllPageAnnotatedForWholeResponse(isAllPagesAnnotated);
        }
    }

	/**
	 * Call back function to execute process mark after the mark and annotation collection updation
	 * when different markers marking definitive response.
	 * @param currentQuestionItem
	 * @param markDetailsForSelectedQIG
	 * @param isMarkUpdatedWithoutNavigation
	 * @param isNextResponse
	 * @param isAllPagesAnnotated
	 * @param overallMarkingProgress
	 * @param markSchemeCount
	 * @param logSaveMarksAction
	 */
	private callBackProcessmark(currentQuestionItem, markDetailsForSelectedQIG,
		isMarkUpdatedWithoutNavigation,
		isNextResponse,
		isAllPagesAnnotated,
		overallMarkingProgress,
		markSchemeCount,
		logSaveMarksAction: Function
	) {
		/* Trigger save mark for the current selected item just before navigating to the next mark scheme */
		this.marksManagementHelper.processMark(
			currentQuestionItem.allocatedMarks,
			currentQuestionItem.uniqueId,
			markDetailsForSelectedQIG.markingProgress,
			markDetailsForSelectedQIG.totalMarkedMarkSchemes,
			parseFloat(markDetailsForSelectedQIG.totalMark),
			markDetailsForSelectedQIG.isAllNR,
			isMarkUpdatedWithoutNavigation,
			isNextResponse,
			currentQuestionItem.usedInTotal,
			isAllPagesAnnotated,
			currentQuestionItem.markSchemeGroupId,
			false,
			true,
			overallMarkingProgress,
			markSchemeCount,
			logSaveMarksAction);
	}

    /**
     * Updates isAllPagesAnnotated flag, for all the related QIGs.
     * @param isAllPagesAnnotated
     */
    private updateIsAllPageAnnotatedForWholeResponse(isAllPagesAnnotated: boolean) {
        let markDetails: MarkDetails;
        let relatedQIGMarkSchemeGroupIds: number[] = markingStore.instance.getRelatedWholeResponseQIGIds();
        relatedQIGMarkSchemeGroupIds.forEach((markSchemeGroupdId: number) => {
            markDetails = this.treeViewHelper.getSelectedQigMarkingProgressDetails(
                this.treeNodes,
                markSchemeGroupdId
            );

            markingActionCreator.updateMarkingDetails(
                markDetails,
                isAllPagesAnnotated,
                markingStore.instance.getMarkGroupIdQIGtoRIGMap(markSchemeGroupdId)
            );
        });
    }

    /**
     * Enter NR for the unmarked mark schemes.
     */
    private enterNRForUnMarkedItems = (): void => {
        this.processNRForUnMarkedItems(this.treeNodes);
        this.isNavigationInsideTree = true;
        this.checkIsSubmitVisible();
        this.reloadTreeview = Date.now();
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Process NR for the unmarked mark schemes.
     */
    private processNRForUnMarkedItems(nodes: treeViewItem) {
        let nodeDetails = nodes.treeViewItemList;
        let isAllPagesAnnotated = markingHelper.isAllPageAnnotated();
        nodeDetails.forEach((node: treeViewItem) => {
            if (
                node.itemType === enums.TreeViewItemType.marksScheme &&
                (node.allocatedMarks.displayMark === constants.NOT_MARKED ||
                    node.allocatedMarks.displayMark === constants.NO_MARK)
            ) {
                // Log complete button marking process
                this.logMarkEntry(
                    loggerConstants.MARKENTRY_REASON_TEXT_CHANGED,
                    loggerConstants.MARKENTRY_ACTION_TYPE_COMPLETE_NR,
                    node.allocatedMarks.displayMark,
                    constants.NOT_ATTEMPTED,
                    node.uniqueId
                );

                node.allocatedMarks = {
                    displayMark: constants.NOT_ATTEMPTED,
                    valueMark: null
                };

                this.treeNodes = this.treeViewHelper.updateMarkDetails(
                    this.treeNodes,
                    node.bIndex,
                    this.marksManagementHelper
                );
                let markDetails: MarkDetails = this.treeViewHelper.totalMarkAndProgress;

                /* Trigger save mark for the currently updated item */
                this.marksManagementHelper.processMark(
                    node.allocatedMarks,
                    node.uniqueId,
                    markDetails.markingProgress,
                    markDetails.totalMarkedMarkSchemes,
                    parseFloat(markDetails.totalMark),
                    markDetails.isAllNR,
                    true,
                    false,
                    node.usedInTotal,
                    isAllPagesAnnotated,
                    node.markSchemeGroupId,
                    true, // passing the isUpdateUsedInTotalOnly flag to true to avoid emitting of SAVE_MARK event.
                    true,
					markDetails.markingProgress,
					markDetails.markSchemeCount,
                    this.logSaveMarksAction
                );
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                this.processNRForUnMarkedItems(node);
            }
        });
    }

    /**
     * Triggered when moving away from response
     */
    private saveAndNavigate = (): void => {
        // Logging the marking style into google analytics.
        this.logger.logActiveMarkingActionCount(
            this.markByKeyboardCount,
            this.markByButtonCount,
            responseStore.instance.selectedDisplayId.toString()
        );

        if (this.markByKeyboardCount > 0 || this.markByButtonCount > 0) {
            // Resetting the marking key usage values after saving
            // into google analytics.
            this.markByKeyboardCount = 0;
            this.markByButtonCount = 0;
        }

        if (this.isResponseDirty) {
            this.triggerSave(false);
            this.isResponseDirty = false;
        } else {

            // Prevent immediate response navigation for enter key
            // when MBQ selects as user wants to see the mark confirmation.
            if (markingStore.instance.KeyCode !== enums.KeyCode.enter) {
                // If the response is not dirty, no need to show the mark confirmation but instead
                // perform the required navigation alone
                let responseNavigation = undefined;
                if (responseHelper.isMbQSelected) {
                    let responseId = responseStore.instance.selectedDisplayId.toString();
                    if (
                        !markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseId) ||
                        !markerOperationModeFactory.operationMode.isNextResponseAvailable(responseId)
                    ) {
                        responseNavigation = enums.ResponseNavigation.markScheme;
                    }
                }
                // Checking whether we need to show mbq confirmation popup.
                navigationHelper.checkForMbqConfirmationPopup(responseNavigation);
            }
        }
    };

    /**
     * avoid navigation when mark value is '-'
     */
    private setResponseNavigationFlag = () => {
        this.doTriggerResponseNavigation = false;
    };

    /**
     * reset annotaion associated to current markscheme
     * @param {boolean} resetMark
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    private resetMarksAndAnnotation = (
        resetMark: boolean,
        resetAnnotation: boolean,
        previousMark: AllocatedMark = { displayMark: '', valueMark: '' }
    ): void => {
        // Avoid navigation while resetting marks and annotation
        this.doTriggerResponseNavigation = false;
        // Delete the mark if reset mark is on
        if (resetMark === true) {
            this.logMarkEntry(
                loggerConstants.MARKENTRY_TEXT_CHANGED_REASON_RESET,
                loggerConstants.MARKENTRY_ACTION_TYPE_RESET,
                this.currentQuestionItem.allocatedMarks.displayMark,
                '-'
            );

            this.currentQuestionItem.allocatedMarks = { displayMark: '-', valueMark: '-' };

            // This to reset the mark entry text box
            this.isResponseChanged = Date.now();
            this.updateMark();
        }

        // reset the annotations if user selected to reset it.
        if (resetAnnotation === true) {
            // Get all annotations associated to the current mark group
            // Filter the list with the current markscheme and mark it as deleted and update the store.
            // Avoid linked annotation from removing.
            let annotations = Immutable.List(annotationHelper.getCurrentMarkGroupAnnotation());
            let deleteAnnotationCount: number = 0;
            let filteredAnnotations: any = annotations.map((annotation: annotation) => {
                if (
                    annotation.markSchemeId ===
                    markingStore.instance.currentQuestionItemInfo.uniqueId &&
                    annotation.stamp !== constants.LINK_ANNOTATION &&
                    !annotation.addedBySystem
                ) {
                    deleteAnnotationCount++;
                    return annotation.clientToken;
                }
            });

            let enhancedOffPageComments = Immutable.List(
                markingStore.instance.enhancedOffPageCommentsAgainstCurrentResponse()
            );
            let filteredEnhancedOffPageComments: any = enhancedOffPageComments.map(
                (enhancedOffPageComment: EnhancedOffPageComment) => {
                    if (
                        enhancedOffPageComment.markSchemeId ===
                        markingStore.instance.currentQuestionItemInfo.uniqueId
                    ) {
                        return enhancedOffPageComment.clientToken;
                    }
                }
            );

            // logg count of annotations that are going to be deleted.
            this.logMarkEntryAnnotationUpdate(
                loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
                loggerConstants.MARKENTRY_TYPE_ANNOTATION_RESET,
                deleteAnnotationCount
            );

            if (filteredAnnotations.count() > 0) {
                let isMarkByAnnotation: boolean;
                isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
                // we are enabled the image container rerender
                // by this method call for refreshing the annotation as part of the defect #69932
                markingActionCreator.removeAnnotation(filteredAnnotations.toArray(), isMarkByAnnotation, false);
            }

            if (filteredEnhancedOffPageComments.count() > 0) {
                enhancedOffPageCommentActionCreator.saveEnhancedOffpageComments(
                    filteredEnhancedOffPageComments.toArray(),
                    enums.MarkingOperation.deleted
                );
            }
        }

        // this will re-assign the value after clicking the NO button in
        // reset confirmation popup
        if (!resetMark && !resetAnnotation && previousMark.displayMark !== '') {
            this.currentQuestionItem.allocatedMarks = previousMark;
            // reset the markshemepanel
            this.updateMark();
        }
    };

    /**
     * While adding annotation refresh the screen and markscheme panel reset button
     * to enable and disable.
     */
    private refreshMarkSchemePanelOnAddAnnotation = (
        stampId: number,
        addAnnotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string,
        annotation: annotation
	): void => {
		// If SSU Definitive marking, Update the Mark and Annotation collection when multiple markers are 
		// marking the same response before classify.
		if (markingStore.instance.isDefinitiveMarking && !markingStore.instance.isDefinitiveMarkCollectionUpdated) {
			copyPreviousMarksAndAnnotationsHelper.updateDefinitiveMarkCollectionForDifferentMarkers();
		}

        // updating marks from annotation to collection --- Mark By Annotation.
        if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
            this.addAnnotationMark(stampId, addAnnotationAction, annotationOverlayId, annotation);
        }
        // clear the old linked items and get new items if added annotation is link. this is needed when we are clicking the view
        // whole page button. Also we need to recalculate linked items if previous marks and annotations are there, as we need
        // to link page linked by previous marker to current marker if current marker adds annotation to page linked by previous marker
        if (stampId === constants.LINK_ANNOTATION || this.treeViewHelper.canRenderPreviousMarks()) {
            this.getLinkedItems(this.treeNodes, true);
        }
        this.isResponseDirty = true;
        this.refreshSelectedMarkingItemPanel();
    };

    /**
     * Adding annotation numeric marks to collection.
     * @param stampId
     * @param addAnnotationAction
     * @param annotationOverlayId
     * @param annotation
     */
    private addAnnotationMark(
        stampId: number,
        addAnnotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string,
        annotation: annotation
    ) {
        let numericValuedAnnotation: boolean = this.markByAnnotationHelper.hasNumericValue(
            annotation
        );

        // allows only when the annotation have a valid mark
        // The numeric value of annotation was undefined when we copying previous marks and annotation so excluded .
        if (numericValuedAnnotation) {
            let newMark: number = this.markByAnnotationHelper.getAggregateMarks(annotation);
            this.updateAnnotationMark(
                loggerConstants.MARKENTRY_TYPE_ANNOTATION_ADDED,
                newMark.toString()
            );
        }
    }

    /*
     * Removing marks from the collection
     */
    private removeAnnotationMark = (removedAnnotation: annotation): void => {
        let numericValuedAnnotation: boolean = this.markByAnnotationHelper.hasNumericValue(
            removedAnnotation
        );
        if (removedAnnotation && numericValuedAnnotation) {
            let examinerMarksAgainstResponse: Array<examinerMarkData> =
                markingStore.instance.getExaminerMarksAgainstResponse;
            let allAnnotations: any =
                examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                    .examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId]
                    .allMarksAndAnnotations[0].annotations;

            // verifying any value annotations left in current question item.
            let hasNumericAnnotationLeft: boolean = this.markByAnnotationHelper.doCheckValueAnnotationLeft(
                allAnnotations,
                removedAnnotation
            );
            let newMark: string = this.markByAnnotationHelper.removeAnnotationMarks(
                allAnnotations,
                removedAnnotation,
                this.currentQuestionItem
            );
            markingActionCreator.markEdited(true);
            let displayMark: string = hasNumericAnnotationLeft ? newMark : constants.NOT_MARKED;
            this.updateAnnotationMark(
                loggerConstants.MARKENTRY_TYPE_ANNOTATION__REMOVED,
                displayMark
            );
        }
    };

    /*
     * Updating  new marks to collection.
     */
    private updateAnnotationMark = (
        updateReason: string,
        newDisplayMark: string,
        valueMark?: string
    ): void => {
        if (
            this.currentQuestionItem.allocatedMarks.displayMark !== newDisplayMark ||
            newDisplayMark === constants.NOT_ATTEMPTED
        ) {
            // Log MBA old and display value
            this.logMarkEntry(
                loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
                updateReason,
                this.currentQuestionItem.allocatedMarks.displayMark,
                newDisplayMark
            );

            markingActionCreator.markEdited(true);
            this.currentQuestionItem.allocatedMarks = {
                displayMark: newDisplayMark,
                valueMark: valueMark ? valueMark : null
            };
            this.refreshSelectedMarkingItemPanel();
            this.updateMark();
        }
    };

    /*
     * Determines whether annotation is to be stamped.
     */
    private doStampAnnotation = (
        newlyAddedAnnotation: annotation,
        action: enums.AddAnnotationAction,
        annotationOverlayID: string
    ): void => {
        let isValid = this.markByAnnotationHelper.isMarkValid(
            this.currentQuestionItem,
            newlyAddedAnnotation
        );
        if (isValid) {
            markingActionCreator.validatedAndContinue(
                newlyAddedAnnotation,
                action,
                annotationOverlayID
            );
        } else {
            this.onValidateMarkEntry(
                this.currentQuestionItem.minimumNumericMark,
                this.currentQuestionItem.maximumNumericMark,
                false,
                true
            );
        }
    };

    /*
    * NR button for mark by annotation mode.
    */
    private onNRButtonClick = (): void => {
        let displayMark = 'NR';
        this.updateAnnotationMark(loggerConstants.MARKENTRY_TYPE_APPLIED_NR, displayMark);
        this.doTriggerResponseNavigation = true;
        this.isResponseDirty = true;
        this.isNRclicked = true;
        markingActionCreator.markEdited(true);
    };

    /**
     * While removing annotation refresh the screen and markscheme panel reset button
     * to enable and disable.
     */
	private refreshMarkSchemePanelOnRemoveAnnotation = (removedAnnotation?: annotation): void => {
		// If SSU Definitive marking, Update the Mark and Annotation collection when multiple markers are 
		// marking the same response before classify.
		if (markingStore.instance.isDefinitiveMarking && !markingStore.instance.isDefinitiveMarkCollectionUpdated) {
			copyPreviousMarksAndAnnotationsHelper.updateDefinitiveMarkCollectionForDifferentMarkers();
		}

        this.isResponseDirty = true;
        // mark by annotation cc check
        if (removedAnnotation) {
            this.logger.logAnnotationModifiedAction(
                'DisplayId -' +
                responseStore.instance.selectedDisplayId +
                '-' +
                loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
                loggerConstants.MARKENTRY_TYPE_ANNOTATION_REMOVED,
                removedAnnotation,
                markingStore.instance.currentMarkGroupId,
                markingStore.instance.currentMarkSchemeId
            );

            if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
                markingActionCreator.removeMarksByAnnotation(removedAnnotation);
            }
        }
        this.refreshSelectedMarkingItemPanel();
    };

    /**
     * While updating annotation position refresh the screen and markscheme panel reset button
     * to enable and disable.
     */
    private refreshMarkSchemePanelOnUpdateAnnotation = (
        clientToken: string,
        isPositionUpdated: boolean
    ): void => {
		if (isPositionUpdated) {
            this.isResponseDirty = true;
            // commenting this since too many renders in markschemepanel while annotation updates.
            // this.refreshSelectedMarkingItemPanel();
        }
    };

    /**
     * Refreshing the selected marking panel.
     */
    private refreshSelectedMarkingItemPanel() {
        // This will prevent the navigation and reloading the response screen
        // for structued images.
        this.isNavigationInsideTree = true;

        // This to reset the mark entry text box
        this.isResponseChanged = Date.now();
        this.reloadTreeview = Date.now();
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this);

        if (element && !this.eventHandler.isInitialized) {
            this.eventHandler.initEvents(element);
            this.eventHandler.get(eventTypes.SWIPE, {
                direction: direction.DirectionOptions.DIRECTION_VERTICAL,
                threshold: 5
            });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipe);
            this.eventHandler.get(eventTypes.PAN, {
                direction: direction.DirectionOptions.DIRECTION_VERTICAL,
                threshold: 15
            });
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
        }
    }

    /**
     * unsubscribing hammer touch events and handlers
     */
    private unRegisterEvents() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * Logging the marking behavior (key or mark button used) on marking
     * @param {boolean} isMarkByKeyboard
     */
    private logMarkingBehaviour(isMarkByKeyboard: boolean): void {
        isMarkByKeyboard === true ? this.markByKeyboardCount++ : this.markByButtonCount++;
    }

    // Refresh the markscheme panel when navigated to next markscheme.
    // this will ensure current markgroup details are updated in store.
    private onQuestionItemChanged = (bIndex: number, forceUpdate: boolean = false): void => {
        // following condition is checked to prevent the markscheme panel getting refreshed everytime, while
        // we resizing the panel
        if (markingStore.instance.getResizedPanelClassName()) {
            return;
        }
        this.reloadTreeview = Date.now();
        this.isMouseWheelOnProgress = false;
        this.isKeyActionOnProgress = false;
        // Rerender selectedquestionitem once marking store is
        // been updated with selected value.
        if (
            (this.currentQuestionItem && bIndex !== this.currentQuestionItem.bIndex) ||
            forceUpdate
        ) {
            this.selectedQuestionItemRenderedOn = Date.now();
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * Displaying the accuracy indicator
     * @returns
     */
    private get showAccuracyPanel(): JSX.Element {
        if (this.isAccuracyIndicatorRequired && this.currentResponseDetails) {
            return (
                <AccuracyIndicator
                    id={'markscheme-panel-accuracy-indicator'}
                    key={'markscheme-panel-accuracy-indicator-key'}
                    accuracyIndicator={this.currentResponseDetails.accuracyIndicatorTypeID}
                    selectedLanguage={this.props.selectedLanguage}
                    isTileView={false}
                    isInMarkSchemePanel={true}
                />
            );
        }
        return null;
    }

    /**
     * Returns the current response details.
     */
    private get currentResponseDetails(): ResponseBase {
        return worklistStore.instance.getResponseDetails(
            responseStore.instance.selectedDisplayId.toString()
        );
    }

    /**
     * Get the panel class name based on accuracy
     */
    private get totalPanelClassName(): string {
        let accuracyTypeName = '';

        // showing accuracy only for closed pracrice response
        if (this.isAccuracyIndicatorRequired) {
            accuracyTypeName = this.getAccuracy(
                this.currentResponseDetails.accuracyIndicatorTypeID
            );
        }
        return accuracyTypeName === ''
            ? 'total-panel-holder'
            : 'total-panel-holder ' + accuracyTypeName;
    }

    /**
     * Returns a value indicating whether Accuracy Indicator Required.
     * @returns true if Accuracy Indicator Required or viceversa
     */
    private get isAccuracyIndicatorRequired(): boolean {

        if (worklistStore.instance.isMarkingCheckMode || markerOperationModeFactory.operationMode.isAwardingMode) {
            return false;
        }

        let isShowStandardisationDefinitiveMarksIsOn =
            ccHelper
                .getCharacteristicValue(
                ccNames.ShowStandardisationDefinitiveMarks,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                )
                .toLowerCase() === 'true'
                ? true
                : false;
        let isClosedResponse: boolean =
            worklistStore.instance.getResponseMode === enums.ResponseMode.closed ? true : false;

        return (
            (worklistStore.instance.currentWorklistType === enums.WorklistType.practice &&
                isClosedResponse) ||
            (worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation &&
                isShowStandardisationDefinitiveMarksIsOn &&
                isClosedResponse) ||
            (worklistStore.instance.currentWorklistType ===
                enums.WorklistType.secondstandardisation &&
                isShowStandardisationDefinitiveMarksIsOn &&
                isClosedResponse) ||
            (worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
                markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn &&
                isClosedResponse) ||
            (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark &&
                markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn &&
                isClosedResponse &&
                responseHelper.getCurrentResponseSeedType() === enums.SeedType.EUR)
        );
    }

    /**
     * Returns the accuracy name of given accuracy type
     * @param {enums.AccuracyIndicatorType} type
     * @returns
     */
    private getAccuracy(accuracyIndicatorType: enums.AccuracyIndicatorType): string {
        let accuracyTypeName = '';
        switch (accuracyIndicatorType) {
            case enums.AccuracyIndicatorType.Accurate:
            case enums.AccuracyIndicatorType.AccurateNR:
                accuracyTypeName = 'accurate';
                break;
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                accuracyTypeName = 'inaccurate';
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                accuracyTypeName = 'intolerance';
                break;
        }
        return accuracyTypeName;
    }

    /**
     * return whether the complete button is to be visible or not (based on the CC value).
     */
    private isCompleteButtonVisible(): boolean {
        return markerOperationModeFactory.operationMode.isCompleteButtonVisible(
            this.treeViewHelper.totalMarkAndProgress.markingProgress,
            this.treeNodes.hasSimpleOptionality
        );
    }

    /**
     * returns whether the complete button is enabled or not (based on the checkminmark CC value and optionality).
     */
    private isCompleteButtonDisabled(): boolean {
        let checkMinMarksOnCompleteCC = ccHelper.getCharacteristicValue(
            ccNames.CheckMinMarksOnComplete,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
        );

        if (checkMinMarksOnCompleteCC === 'true' && this.treeNodes.hasSimpleOptionality === true) {
            return !this.treeViewHelper.hasAllOptionalMarkSchemesMarked;
        } else {
            return false;
        }
    }

    /**
     * returns the jsx element of complete button
     */
    private completeButton(): JSX.Element {
        let completeButton: JSX.Element = null;
        let title: string;

        if (this.isCompleteButtonVisible()) {
            let isCompleteButtonDisabled = this.isCompleteButtonDisabled();

            if (isCompleteButtonDisabled) {
                title = localeStore.instance.TranslateText(
                    'marking.response.mark-scheme-panel.complete-button-tooltip-when-disabled'
                );
            } else {
                title = localeStore.instance.TranslateText(
                    'marking.response.mark-scheme-panel.complete-button-tooltip-when-enabled'
                );
            }

            let className = 'button primary rounded complete-button';

            completeButton = (
                <div className={'complete-button-holder'}>
                    <GenericButton
                        id={'complete_button'}
                        key={'key_complete_button'}
                        onClick={this.onCompleteButtonClick}
                        disabled={isCompleteButtonDisabled}
                        content={localeStore.instance.TranslateText(
                            'marking.response.mark-scheme-panel.complete-button'
                        )}
                        className={className}
                        title={title}
                    />
                </div>
            );
        }

        return completeButton;
    }

    /**
     * Triggers when markschemepanel transition is over
     * @param {Event} event
     */
    private onAnimationEnd = (event: Event) => {
        this.markScheme = ReactDom.findDOMNode(this.refs.markScheme) as HTMLElement;
        if (this.markScheme) {
            this.containerWidth = this.markScheme.getBoundingClientRect().width;
            this.props.getMarkSchemePanelWidth(this.containerWidth);
        }
    };

    /* return the b index of the selected question item based on the MbC/MbQ */
    private get getSelectedQuestionItemBIndex(): number {
        /* return selectedQuestionItemBIndex when the response is markby question,structured/ebookmarking
        and navigation is through markscheme */
        if (
            responseHelper.isMbQSelected &&
            (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                || responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject
                || responseHelper.isEbookMarking === true) &&
            markingStore.instance.isNavigationThroughMarkScheme === enums.ResponseNavigation.markScheme
        ) {
            return worklistStore.instance.selectedQuestionItemBIndex;
            /* return selectedQuestionItemBIndex when the response is mbq/mbc,fully marked ,structured/ebookmarking
              and navigation is through response.*/
        } else if (
            (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                || responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject
                || responseHelper.isEbookMarking === true) &&
            !responseHelper.isAtypicalResponse() &&
            this.treeNodes.markingProgress === 100 &&
            (markingStore.instance.currentNavigation === enums.SaveAndNavigate.toResponse ||
                markingStore.instance.currentNavigation === enums.SaveAndNavigate.submit)
        ) {
            return worklistStore.instance.selectedQuestionItemBIndex;
        } else {
            //if MbC or MBQ is enabled , fully marked then select first question ,navigation is not  through markscheme or response .
            return 1;
        }
    }

    /* get the next markscheme */
    private get getNextMarkScheme(): treeViewItem {
        let nextNode =
            this.markSchemeHelper.selectedNodeGet.nextIndex > 0
                ? this.markSchemeHelper.getMarkableItemByDirection(
                    this.treeNodes,
                    this.markSchemeHelper.selectedNodeGet.nextIndex,
                    enums.MarkSchemeNavigationDirection.Forward
                )
                : null;
        return nextNode;
    }

    /**
     * sets the next mark scheme item in the store
     */
    private setNextMarkSchemeItem(): void {
        markingActionCreator.setSelectedQuestionItemIndex(
            this.getNextMarkScheme.bIndex,
            this.getNextMarkScheme.uniqueId
        );
    }

    /**
     * Sets the review response button as reviewed button
     */
    private setResponseAsReviewed = (reviewResponseDetails: ReviewedResponseDetails): void => {
        if (reviewResponseDetails.reviewResponseResult === enums.SetAsReviewResult.Success) {
            // Re render markshemepanel as worklist store has been updated with correct review status
            this.setState({ renderedOn: Date.now() });

            // Clear My Team List Cache to reflect the Response To Review Count
            this.storageAdapterHelper.clearTeamDataCache(
                teamManagementStore.instance.selectedExaminerRoleId,
                teamManagementStore.instance.selectedMarkSchemeGroupId
            );

            // Navigate to next response if avaialble or navigate to worklist
            let responseId = responseStore.instance.selectedDisplayId.toString();
            if (worklistStore.instance.isNextResponseAvailable(responseId)) {
                navigationHelper.responseNavigation(enums.ResponseNavigation.next);
            } else {
                navigationHelper.loadWorklist();
            }
        }
    };

    /**
     * Marks retrieval event.
     */
    private marksRetrieved = (markGroupId: string): void => {
        if (markingStore.instance.currentMarkGroupId.toString() === markGroupId.toString()) {
            this.isNavigationInsideTree = false;
            // Re render markshemepanel as marks retrived.
            this.reloadTreeview = Date.now();
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * Check whether the accept quality feedback button is visible or not
     */
    private isAcceptQualityFeedbackButtonVisible(): boolean {
        if (
            markerOperationModeFactory.operationMode.isQualityFeedbackOutstanding &&
            (worklistStore.instance.currentWorklistType === enums.WorklistType.live ||
                worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) &&
            worklistStore.instance.getResponseMode === enums.ResponseMode.closed
        ) {
            return true;
        }

        return false;
    }

    /**
     * return whether to display the showremakdecision buton or not
     */
    private showRemarkDecisionButton(): boolean {

        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            return false;
        }

        let isCCOn =
            ccHelper
                .getCharacteristicValue(
                ccNames.SupervisorRemarkDecision,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                )
                .toLowerCase() === 'true'
                ? true
                : false;

        return (
            isCCOn &&
            this.isFullyMarked() &&
            worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark
        );
    }

    /**
     * callback function for markchange decision changes.
     */
    private onRemarkDecisionChange(remarkDecision: enums.SupervisorRemarkDecisionType) {
        this.remarkDecision = remarkDecision;
        markingActionCreator.supervisorRemarkDecisionChange(this.accuracyIndicator, remarkDecision);
    }

    /**
     * callback function for markchange decision changes.
     */
    private resetDecision() {
        this.remarkDecision = enums.SupervisorRemarkDecisionType.none;
        markingActionCreator.supervisorRemarkDecisionChange(
            this.accuracyIndicator,
            this.remarkDecision
        );
    }

    /**
     * function to calculate and set the accuracy indaicator based on accuracy rules.
     */
    private calculateAccuracy(): any {
        let accuracy: any = [];
        if (this.isFullyMarked()) {
            let markingMode = targetSummarytStore.instance.getCurrentMarkingMode();

            if (
                worklistStore.instance.getRemarkRequestType ===
                enums.RemarkRequestType.SupervisorRemark
            ) {
                let accuracyCalcObj = accuracyRuleFactory.getAccuracyRule(
                    enums.AccuracyRuleType.default,
                    enums.MarkingMode.Remarking,
                    markingStore.instance.currentMarkGroupId
                );

                let comparingDetails: AccuracyCalcCharacteristics = {
                    isDefinitive: false,
                    isRemark: true,
                    isSupervisorRemark: true
                };

                accuracy = accuracyCalcObj.CalculateRigTotalAndAccuracy(
                    this.treeNodes,
                    comparingDetails
                );
                if (this.isAccuracyChanged(this.accuracyIndicator, accuracy[0])) {
                    if (this.accuracyIndicator) {
                        this.resetDecision();
                    }
                    this.accuracyIndicator = accuracy[0];
                    this.absoluteMarkDifference = accuracy[1];
                    this.totalMarkDifference = accuracy[2];
                }
            }
        }

        return accuracy;
    }

    /**
     * Whether the accuracy has been changed or not , by considering Accurate And AccurateNR as same.
     * @param currentAccuracy
     * @param newAccuracy
     */
    private isAccuracyChanged(
        currentAccuracy: enums.AccuracyIndicatorType,
        newAccuracy: enums.AccuracyIndicatorType
    ): boolean {
        let accuracyChanged: boolean = false;
        if (currentAccuracy) {
            if (
                currentAccuracy === enums.AccuracyIndicatorType.Accurate ||
                currentAccuracy === enums.AccuracyIndicatorType.AccurateNR
            ) {
                accuracyChanged =
                    newAccuracy !== enums.AccuracyIndicatorType.Accurate &&
                    newAccuracy !== enums.AccuracyIndicatorType.AccurateNR;
            } else if (
                currentAccuracy === enums.AccuracyIndicatorType.OutsideTolerance ||
                currentAccuracy === enums.AccuracyIndicatorType.OutsideToleranceNR
            ) {
                accuracyChanged =
                    newAccuracy !== enums.AccuracyIndicatorType.OutsideTolerance &&
                    newAccuracy !== enums.AccuracyIndicatorType.OutsideToleranceNR;
            } else if (
                currentAccuracy === enums.AccuracyIndicatorType.WithinTolerance ||
                currentAccuracy === enums.AccuracyIndicatorType.WithinToleranceNR
            ) {
                accuracyChanged =
                    newAccuracy !== enums.AccuracyIndicatorType.WithinTolerance &&
                    newAccuracy !== enums.AccuracyIndicatorType.WithinToleranceNR;
            }
        } else {
            accuracyChanged = true;
        }
        return accuracyChanged;
    }

    /**
     * Log marking text changed values.
     * @param reason
     * @param activity
     * @param oldMark
     * @param newMark
     */
    private logMarkEntry(
        reason: string,
        activity: string,
        oldMark: string,
        newMark: string,
        markSchemeId?: number
    ): void {
        this.logger.logMarkEntryAction(
            reason,
            activity,
            markingStore.instance.currentMarkGroupId,
            oldMark,
            newMark,
            !markSchemeId ? this.currentQuestionItem.uniqueId : markSchemeId,
            this.treeViewHelper.isNonNumeric,
            responseHelper.isMbQSelected
        );
    }

    /**
     * Log annotation update actions based on the reset and assigining mark using MBA.
     * @param reason
     * @param activity
     * @param annotationCount
     */
    private logMarkEntryAnnotationUpdate(
        reason: string,
        activity: string,
        annotationCount: number
    ): void {
        this.logger.logMarkEntryAnnotationUpateAction(
            reason,
            activity,
            markingStore.instance.currentMarkGroupId,
            this.currentQuestionItem.uniqueId,
            this.treeViewHelper.isNonNumeric,
            responseHelper.isMbQSelected,
            annotationCount
        );
    }

    /**
     * Log saving marks action
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     * @param isUpdateUsedInTotalOnly
     * @param isUpdateMarkingProgress
     * @param markDetails
     */
    private logSaveMarksAction(
        isMarkUpdatedWithoutNavigation: boolean,
        isNextResponse: boolean,
        isUpdateUsedInTotalOnly: boolean,
        isUpdateMarkingProgress: boolean,
        markDetails: any
    ): void {
        this.logger.logMarkSaveAction(
            loggerConstants.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION,
            loggerConstants.MARKENTRY_ACTION_TYPE_SAVE_MARK,
            isMarkUpdatedWithoutNavigation,
            isNextResponse,
            isUpdateUsedInTotalOnly,
            isUpdateMarkingProgress,
            markDetails
        );
    }

    /**
     * Refresh comments toggle button state.
     * @private
     * @memberof MarkSchemePanel
     */
    private handleEnhancedOffPageCommentsVisibility = (
        isVisible: boolean,
        markSchemeToNavigate: treeViewItem
    ) => {
        this.setState({ renderedOn: Date.now() });
        // For navigating to next question of another qig on yes click of discard comment popup.
        if (markSchemeToNavigate) {
            this.navigateToMarkScheme(markSchemeToNavigate);
        }
    };

    /**
     * Returns Background color for Enhanced offpage comment toggle button.
     * @param allMarksAndAnnotations
     */
    private getEnhancedOffpageCommentToggleButtonColor(
        allMarksAndAnnotations: any,
        defaultColor: string
    ): React.CSSProperties {
        let _enhancedOffpageCommentColor: React.CSSProperties = {};
        let selectedMarkgroupid: number = markingStore.instance.currentMarkGroupId;
        // isMarksColumnVisibilitySwitched, set as true when checkbox aganist current selected comments is unticked.
        // if isMarksColumnVisibilitySwitched true, index changed to current marks.
        let allMarksAndAnnotationsCollectionLength = allMarksAndAnnotations.length;
        let index: number = enhancedOffPageCommentHelper.getEnhancedOffPageCommentIndex(
            this.isMarksColumnVisibilitySwitched,
            allMarksAndAnnotations.length
        );

        // for remark responses.
        if (
            this.treeViewHelper.canRenderPreviousMarks() &&
            allMarksAndAnnotationsCollectionLength > 1
        ) {
            // getting previous markscheme color.
            _enhancedOffpageCommentColor.color = this.getPreviousMarksColumnMarkSchemeColor(
                index,
                selectedMarkgroupid
            ).background;

            // getting color for current marking.
            if (index === 0) {
                if (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
                    _enhancedOffpageCommentColor.color = colouredAnnotationsHelper.getRemarkBaseColor(
                        enums.DynamicAnnotation.None
                    ).fill;
                }
            }
        } else {
            // Live marking
            _enhancedOffpageCommentColor.color = marksAndAnnotationsVisibilityHelper.getLiveClosedAnnotationToggleButtonColor(
                allMarksAndAnnotations,
                defaultColor,
                markingStore.instance.currentResponseMode
            );
        }
        return _enhancedOffpageCommentColor;
    }

    /**
     * Enables toggle buttons on Enhanced offpage comment data update.
     *
     * @private
     * @memberof MarkSchemePanel
     */
    private enableToggleButtonOnEnhancedCommentUpdate = () => {
        let commentIndex: number =
            enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        this.onCommentsToggleChange(commentIndex, true);
    };

    /**
     * reset isreponsedirty to trigger save navigation FRV.
     *
     * @private
     * @memberof MarkSchemePanel
     */
	private updateFileReadStatusonNavigation = () => {
        this.isResponseDirty = true;
    };

    /**
     * Invoked on stamp pan to an area where deletion of the annotation dragged is possible
     */
    private onStampPanToDeleteArea = (canDelete: boolean): void => {
        this.isStampPanedBeyondBoundaries = canDelete;
    };

    /**
     * sets the visibility and recalculates the index value, on navigating to different QIGs in Whole response.
     * @private
     * @memberof markSchemeGroupId
     */
    private navigateToQigInWholeResponse = (
        currentMarkSchemeGroupId: number,
        previousMarkSchemeGroupId: number
    ) => {
        if (this.treeViewHelper.isWholeResponse === true) {
            // following condition is checked to prevent the markscheme panel getting refreshed everytime, while
            // we resizing the panel
            if (markingStore.instance.getResizedPanelClassName()) {
                return;
            }

            this.treeNodes = this.treeViewHelper.navigateToQigInWholeResponse(
                this.treeNodes,
                currentMarkSchemeGroupId,
                previousMarkSchemeGroupId
            );
            this.reloadTreeview = Date.now();
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /* gets the previous markscheme */
    private get getPreviousMarkScheme(): treeViewItem {
        let previousNode =
            this.markSchemeHelper.selectedNodeGet.previousIndex > 0
                ? this.markSchemeHelper.getMarkableItemByDirection(
                    this.treeNodes,
                    this.markSchemeHelper.selectedNodeGet.previousIndex,
                    enums.MarkSchemeNavigationDirection.Backward
                )
                : null;
        return previousNode;
    }

    /**
     * return all the linked items against current markscheme Id.
     * @param tree
     * @param doClear
     */
    public getLinkedItems(tree: treeViewItem, doClear: boolean = false) {
        if (!responseHelper.isEResponse) {
            if (doClear || !this.linkedItemsUniqueIds) {
                this.linkedItemsUniqueIds = Immutable.List<number>();
            }
            let annotation: annotation[] = [];
            let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
            let allMarksAndAnnotations: any = markingStore.instance.allMarksAndAnnotationAgainstResponse(
                currentMarkGroupId
            );
            let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
            let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ?
                    annotationHelper.showDefMarkAndAnnotation() : false;
            let allLinkAnnotations: annotation[] = [];
            if (allMarksAndAnnotations) {
                // get all the link annotations against qig(s)
                allMarksAndAnnotations.map((marksAndAnnotations: any) => {
                    let annotations: annotation[] = marksAndAnnotations.annotations;
                    if (annotations) {
                        allLinkAnnotations = allLinkAnnotations.concat(
                            annotations.filter(
                                (item) =>
                                    item.stamp === constants.LINK_ANNOTATION &&
                                    item.markingOperation !== enums.MarkingOperation.deleted &&
                                    item.isPrevious !== true &&
                                    (isSelectedTabEligibleForDefMarks ? item.definitiveMark === showDefAnnotationsOnly : true)
                            )
                        );
                    }
                });
                let nodes = tree.treeViewItemList;
                if (nodes) {
                    nodes.map((node: treeViewItem) => {
                        let uniqueId = markSchemeHelper.getLinkableMarkschemeId(node, tree);
                        let linkAnnotation = allLinkAnnotations.filter(
                            (item) => item.markSchemeId === node.uniqueId
                        );
                        if (linkAnnotation.length > 0) {
                            this.linkedItemsUniqueIds = this.linkedItemsUniqueIds.set(
                                this.linkedItemsUniqueIds.count() + 1,
                                uniqueId
                            );
                        }
                        if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                            this.getLinkedItems(node);
                        }
                    });
                }
            }
        }
    }

    /**
     * set isreponsedirty to trigger save on copying completed.
     */
    private onPreviousMarksAnnotationCopied = () => {
        this.isResponseDirty = true;
    };

    /**
     * on click the 'Select to mark' OR 'Mark as definitive' button.
     */
    private onClickToShowPopup = () => {
        let popupType: enums.PopUpType = (standardisationSetupStore.instance.isUnClassifiedWorklist) ?
            enums.PopUpType.MarkAsDefinitive : enums.PopUpType.SelectToMarkAsProvisional;
		// show the mark now/ mark later popup/ mark as definitive
		stdSetupActionCreator.selectStandardisationResponsePopupOpen(popupType, standardisationSetupStore.instance.selectedResponseId);
    }

    /**
     * Open classify multi option pop with unclassified response details
     */
    private classifyMultiOptionPopUpOpen = (esMarkGroupId: number) => {
        stdSetupActionCreator.reclassifyMultiOptionPopupOpen(esMarkGroupId, true);
    }

    /**
     * On closing the blue helper message.
     */
    private onClosingBlueHelperMessage = () => {
        stdSetupActionCreator.updateSelectToMarkHelperMessageVisibility(false);
    }

    /**
     * Displaying the Re-classify response button
     * @returns
     */
    private get showReClassifyResponseButton(): JSX.Element {
        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            let currentworklist = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            let isClassifiedResponseWorklist = currentworklist === enums.StandardisationSetup.ClassifiedResponse;
            let isStandardisationSetUpComplete = qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete;
            if (isClassifiedResponseWorklist && !isStandardisationSetUpComplete && this.hasClassifyPermission) {
                return (<ClassifyResponse
                    id={this.props.id}
                    key={this.props.key}
                    isDisabled={false}
                    esMarkGroupId={markingStore.instance.currentMarkGroupId}
                    buttonTextResourceKey={'standardisation-setup.right-container.reclassify-button'}
                    onClickAction={this.reclassifyMultiOptionPopUpOpen}
                />);
            }
        }
        return null;
    }

    /**
     * Get the classify permission of the markers role in std setup permission CC
     * @returns
     */
    private get hasClassifyPermission(): boolean {
        if (standardisationSetupStore.instance.stdSetupPermissionCCData) {
            return standardisationSetupStore.instance.stdSetupPermissionCCData.
                role.permissions.classify;
        }
        return false;
    }

    /**
     * Return true if the selected standardisation tab is unclassified
     */
    private get isUnclassifiedWorklistSelected(): boolean {
        return standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse;
    }

    /**
     * Open reclassify multi option pop with classified response details
     */
    private reclassifyMultiOptionPopUpOpen = (esMarkGroupId: number) => {
	    stdSetupActionCreator.reclassifyMultiOptionPopupOpen(esMarkGroupId);
    }

    /**
     * Called an exception is raised or when exception panel is closed
     */
    private onCopyMarksAndAnnotationAsDefinitive = () => {
        // we need to recreate the tree as copy of previous marks are done after initial tree creation
        this.treeNodes = this.treeViewHelper.getMarkSchemeStructureNodeCollection();
        this.isNavigationInsideTree = false;
        this.setState({ renderedOn: Date.now() });
	};
}

export = MarkSchemePanel;