/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import stringHelper = require('../../utility/generic/stringhelper');
import enums = require('../utility/enums');
import keyCodes = require('../../utility/keyboardacess/keycodes');
import moduleKeyHandler = require('../../utility/generic/modulekeyhandler');
import modulekeys = require('../../utility/generic/modulekeys');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import markingStore = require('../../stores/marking/markingstore');
import worklistStore = require('../../stores/worklist/workliststore');
import constants = require('../utility/constants');
import qigStore = require('../../stores/qigselector/qigstore');
import markingHelper = require('../../utility/markscheme/markinghelper');
import popupHelper = require('../utility/popup/popuphelper');
import submitStore = require('../../stores/submit/submitstore');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import responseStore = require('../../stores/response/responsestore');
import navigationHelper = require('../utility/navigation/navigationhelper');
import qualityFeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
import Promise = require('es6-promise');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
import exceptionStore = require('../../stores/exception/exceptionstore');
import qualityfeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
import submitHelper = require('../utility/submit/submithelper');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import markByAnnotationHelper = require('../utility/marking/markbyannotationhelper');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import loginStore = require('../../stores/login/loginstore');
import responseHelper = require('../utility/responsehelper/responsehelper');
import TagList = require('./responsescreen/taglist');
import tagStore = require('../../stores/tags/tagstore');
import immutable = require('immutable');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import awardingStore = require('../../stores/awarding/awardingstore');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import classifiedResponseHeaderDetail = require('../../stores/standardisationsetup/typings/classifiedResponseHeaderDetail');

/**
 * Properties of Response navigation component.
 */
interface Props extends LocaleSelectionBase {
    responseId: string;
    currentResponse: number;
    totalResponses: number;
    isPreviousResponseAvailable: boolean;
    isNextResponseAvailable: boolean;
    moveCallback: Function;
    centreId: string;
    reRender: boolean;
}

/**
 * React component for Response navigation.
 */
class ResponseNavigation extends pureRenderComponent<Props, any> {

    private _boundHandleKeyDown: Function = null;
    /* The response navigation direction */
    private responseNavigationDirection: enums.ResponseNavigation;

    /** variable for holding functions */
    private handlePreviousResponseNavigation: any;
    private handleNextResponseNavigation: any;
    private isWorkListDataRefreshedAfterSubmit: boolean;
    private isResponseNavigationArrowClicked: boolean = false;
    private markByAnnotationHelper: markByAnnotationHelper;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this._boundHandleKeyDown = this.handleResponseNavigation.bind(this, null);
        this.handlePreviousResponseNavigation = this.handleResponseNavigation.bind(this, enums.ResponseNavigation.previous);
        this.handleNextResponseNavigation = this.handleResponseNavigation.bind(this, enums.ResponseNavigation.next);
        this.workListDataChanged = this.workListDataChanged.bind(this);
        this.markByAnnotationHelper = new markByAnnotationHelper();
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let tags: immutable.List<Tag> = tagStore.instance.tags;
        let selectedTag = markerOperationModeFactory.operationMode.getTagId(responseStore.instance.selectedDisplayId.toString());
        return (
            <div className='response-header'>
                <div className='response-header-inner'>
                    {this.renderResponseNavigationButton(enums.ResponseNavigation.previous)}
                    <div className='response-title'>
                        <div id='header1' className='response-id'>
                            <h1 className='reponse-id-label'>{this.setResponseHeaderText()}</h1>
                            {
                                (selectedTag === undefined) ? null :
                                    <TagList selectedTagId={selectedTag}
                                        tagList={tags}
                                        selectedLanguage={this.props.selectedLanguage}
                                        id={'tags'} key={'tag_key'}
                                        renderedOn={Date.now()}
                                        isESResponse={markerOperationModeFactory.operationMode.isStandardisationSetupMode}
                                        markingMode={markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                                            enums.MarkingMode.Pre_ES_TeamStandardisation : undefined}
                                    />
                            }
                        </div>
                        {!teamManagementStore.instance.isRedirectFromException ?
                            <div id='header2' className='response-position'>
                                {this.setResponseSubHeaderText()}
                            </div> : null
                        }
                    </div>
                    {this.renderResponseNavigationButton(enums.ResponseNavigation.next)}
                </div>
            </div>
        );
    }

	/**
	 * Method to set the Response sub header text as per the worklist type
	 */
    private setResponseSubHeaderText() {
        let responseHeader: string;

        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            responseHeader = stringHelper.format(localeStore.instance.TranslateText('awarding.response-data.candidateno'),
                [awardingStore.instance.selectedCandidateData.centreCandidateNo]);
        } else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {

            switch (standardisationSetupStore.instance.selectedStandardisationSetupWorkList) {
                case enums.StandardisationSetup.SelectResponse:
                    if (standardisationSetupStore.instance.selectedTabInSelectResponse
                        === enums.StandardisationSessionTab.CurrentSession) {
                        responseHeader = stringHelper.format(localeStore.instance.TranslateText
                            ('marking.response.navigation-bar.script-position'),
                            [this.props.currentResponse.toString(), this.props.totalResponses.toString(), this.props.centreId]);
                    } else {
                        responseHeader = stringHelper.format(localeStore.instance.TranslateText
                            ('marking.response.navigation-bar.response-position-in-worklist'),
                            [this.props.currentResponse.toString(), this.props.totalResponses.toString()]);
                    }
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    let responseHeaderDetail: classifiedResponseHeaderDetail =
                        standardisationSetupStore.instance.getClassifiedResponseHeaderDetail(this.props.responseId);

                    responseHeader = stringHelper.format(localeStore.instance.TranslateText
                        ('marking.response.navigation-bar.classified-response-position-in-worklist'),
                        [responseHeaderDetail.currentPosition.toString(),
                        responseHeaderDetail.classifiedWorklistCountByMarkingMode.toString()]);
                    break;
                default:
                    responseHeader = stringHelper.format(localeStore.instance.TranslateText
                        ('marking.response.navigation-bar.response-position-in-worklist'),
                        [this.props.currentResponse.toString(), this.props.totalResponses.toString()]);
                    break;
            }
        } else {
            responseHeader = stringHelper.format(localeStore.instance.TranslateText
                ('marking.response.navigation-bar.response-position-in-worklist'),
                [this.props.currentResponse.toString(), this.props.totalResponses.toString()]);
        }

        return responseHeader;
    }

    /**
     * Method to set the Response header text as per the worklist type
     */
    private setResponseHeaderText() {
        let workListType = worklistStore.instance.currentWorklistType;
        let markingMode = worklistStore.instance.getMarkingModeByWorkListType(workListType);

        if (standardisationSetupStore.instance.isSelectResponsesWorklist
            || standardisationSetupStore.instance.isSelectedResponsePreviousSessionWorklist) {
            return ((localeStore.instance.TranslateText
                ('marking.worklist.response-data.stm-setup-response-tittle')) + ' 1' +
                this.props.responseId);
        }

        // Set response header text for classified response
        if (markerOperationModeFactory.operationMode.isStandardisationSetupMode &&
            standardisationSetupStore.instance.isClassifiedWorklist) {
            let responseHeaderDetail: classifiedResponseHeaderDetail =
                standardisationSetupStore.instance.getClassifiedResponseHeaderDetail(this.props.responseId);
            let responseHeader: string;
            responseHeader = (localeStore.instance.TranslateText
                ('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[responseHeaderDetail.markingModeId]));
            responseHeader = responseHeaderDetail.rigOrder && responseHeaderDetail.rigOrder !== 0 ?
                responseHeader + ' ' + responseHeaderDetail.rigOrder.toString() : responseHeader;
            return responseHeader;
        }

        if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true) {
                return ((localeStore.instance.TranslateText
                    ('marking.worklist.response-data.stm-standardisation-response-title')) + ' ' +
                    this.props.responseId);
            } else {
                return ((localeStore.instance.TranslateText
                    ('marking.worklist.response-data.second-standardisation-response-title')) + ' ' +
                    this.props.responseId);
            }
        } else if (workListType === enums.WorklistType.practice) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title')) + ' ' +
                this.props.responseId);
        } else if (workListType === enums.WorklistType.standardisation) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title')) + ' ' +
                this.props.responseId);
        } else if (workListType === enums.WorklistType.secondstandardisation) {
            return ((localeStore.instance.TranslateText
                ('marking.worklist.response-data.second-standardisation-response-title')) + ' ' +
                this.props.responseId);
        } else if ((worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark
            || (worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark)
            && worklistStore.instance.getRemarkRequestType !== enums.RemarkRequestType.Unknown)
            && worklistStore.instance.getRemarkRequestType !== enums.RemarkRequestType.QualityRemark) {

            // If Atypical response get the remark string append to atypical indicator
            if (responseHelper.isAtypicalResponse()) {
                return this.atypicalRemarkHeader;
            }

            // Creates string as RemarkRequestType &nbsp; Response Id
            if (loginStore.instance.isAdminRemarker) {
                return (localeStore.instance.TranslateText
                    ('generic.remark-types.long-names.AdminRemark')) + ' ' +
                    this.props.responseId;
            } else {
                return stringHelper.format(localeStore.instance.TranslateText(
                    this.getDirectedRemarkLocaleKey(worklistStore.instance.getRemarkRequestType)),
                    [constants.NONBREAKING_HYPHEN_UNICODE])
                    + constants.NONBREAKING_WHITE_SPACE + this.props.responseId;
            }
        } else if (worklistStore.instance.currentWorklistType === enums.WorklistType.atypical) {
            return ((localeStore.instance.TranslateText
                ('marking.response.navigation-bar.atypical-response-id-label')) + ' ' +
                this.props.responseId);
            /* Response identifier in the top bar shall appear as "Simulation response",
            with response ID if the worklist type is simulation.*/
        } else if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
            return ((localeStore.instance.TranslateText
                ('marking.response.navigation-bar.simulation-response-id-label')) + ' ' +
                this.props.responseId);
        } else if (markerOperationModeFactory.operationMode.isAwardingMode) {
            return (stringHelper.format(localeStore.instance.TranslateText('awarding.response-data.centrename'),
                [awardingStore.instance.selectedCandidateData.centreNumber]));
        } else {
            return ((localeStore.instance.TranslateText('marking.response.navigation-bar.response-id-label')) + ' ' +
                this.props.responseId);
        }
    }

    // Gets the atypical remark header text.
    private get atypicalRemarkHeader(): string {
        if (loginStore.instance.isAdminRemarker) {
            return localeStore.instance.TranslateText
                ('marking.response.navigation-bar.atypical-remark-response-id-label') + ' ' +
                (localeStore.instance.TranslateText
                    ('generic.remark-types.long-names.AdminRemark')) + ' ' +
                this.props.responseId;
        } else {
            return stringHelper.format(
                (localeStore.instance.TranslateText
                    ('marking.response.navigation-bar.atypical-remark-response-id-label')) + ' ' +
                localeStore.instance.TranslateText(
                    this.getDirectedRemarkLocaleKey(worklistStore.instance.getRemarkRequestType)),
                [constants.NONBREAKING_HYPHEN_UNICODE])
                + constants.NONBREAKING_WHITE_SPACE + this.props.responseId;
        }
    }

    /**
     * This method will render response navigation buttons.
     * @param button : navigation button
     */
    private renderResponseNavigationButton(button: enums.ResponseNavigation) {

        if (qualityfeedbackHelper.isResponseNavigationBlocked()) {
            return null;
        } else {
            if (this.props.isPreviousResponseAvailable && button === enums.ResponseNavigation.previous) {
                return (
                    <a href='javascript:void(0);' onClick={this.handlePreviousResponseNavigation}
                        className='response-nav response-nav-prev'
                        title={localeStore.instance.TranslateText('marking.response.navigation-bar.previous-response-button-tooltip')}>
                        <span className='sprite-icon left-arrow-light'>
                            {localeStore.instance.TranslateText('marking.response.navigation-bar.previous-response-button-tooltip')}
                        </span>
                    </a>
                );
            } else if (this.props.isNextResponseAvailable && button === enums.ResponseNavigation.next) {
                return (
                    <a href='javascript:void(0);' onClick={this.handleNextResponseNavigation}
                        className='response-nav response-nav-next' title={
                            localeStore.instance.TranslateText('marking.response.navigation-bar.next-response-button-tooltip')}>
                        <span className='sprite-icon right-arrow-light'>
                            {localeStore.instance.TranslateText('marking.response.navigation-bar.next-response-button-tooltip')}
                        </span>
                    </a>
                );
            }
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        responseActionCreator.reRenderBreadCrumbAfterLoadingResponseID();
        /*Adding global handler */
        let scrollHandler: moduleKeyHandler = new moduleKeyHandler(
            modulekeys.RESPONSE_NAVIGATION,
            enums.Priority.Third, true,
            this._boundHandleKeyDown,
            enums.KeyMode.down);
        keyDownHelper.instance.mountKeyDownHandler(scrollHandler);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        submitStore.instance.addListener(submitStore.SubmitStore.NAVIGATE_AFTER_SUBMIT, this.navigateToNextResponseAfterSubmit);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.workListDataChanged);
    }

    /**
     * This function gets invoked when the component is updating
     */
    public componentDidUpdate() {
        responseActionCreator.reRenderBreadCrumbAfterLoadingResponseID();
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        keyDownHelper.instance.unmountKeyHandler(modulekeys.RESPONSE_NAVIGATION);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        submitStore.instance.removeListener(submitStore.SubmitStore.NAVIGATE_AFTER_SUBMIT, this.navigateToNextResponseAfterSubmit);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.workListDataChanged);
    }

    /**
     * This method will handle click events and keyboard events
     */
    private handleResponseNavigation(direction: enums.ResponseNavigation, keyEvent: KeyboardEvent) {
        /* If pressed key is not right arrow or left arrow it will skip */
        if (keyEvent.keyCode !== undefined && keyEvent.keyCode === keyCodes.LEFT_KEY) {
            direction = enums.ResponseNavigation.previous;
        } else if (keyEvent.keyCode !== undefined && (keyEvent.keyCode === keyCodes.RIGHT_KEY)) {
            direction = enums.ResponseNavigation.next;
        } else if (keyEvent.charCode !== undefined) {
            this.responseNavigationDirection = enums.ResponseNavigation.next;
            return;
        }

        this.isResponseNavigationArrowClicked = true;
        this.navigateResponse(direction, false);
    }

    /**
     * This method will handle the navigation
     * @param direction
     * @param isAfterSubmit
     */
    private navigateResponse(direction: enums.ResponseNavigation, isAfterSubmit) {

        //set the isNavigationThroughMarkScheme variable as none since it is not navigating from the markscheme
        markingActionCreator.setNavigationThroughMarkscheme(enums.ResponseNavigation.none);
        if (navigationHelper.navigationAllowed(direction, this.props.isNextResponseAvailable,
            this.props.isPreviousResponseAvailable)) {
            this.responseNavigationDirection = direction;
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                new Array<enums.ResponseNavigateFailureReason>();
            if (!isAfterSubmit) {
                responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            }
            // If there is any navigation failure reason available then we will show respective popups.
            if (responseNavigationFailureReasons.length > 0) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toResponse);
            } else {
                if (markingStore.instance.isMarkingInProgress) {
                    // if marking progressing and responseNavigationFailureReason contain none only
                    markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toResponse);
                } else if (!markingStore.instance.isMarkingInProgress) {
                    busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
                    /** navigating from a response which is in view mode doesn't require save marks */
                    this.props.moveCallback(this.responseNavigationDirection, isAfterSubmit);
                }
            }
        }
    }

    /**
     * Go to another response after saving mark if there is any
     */
    private navigateAwayFromResponse = (navigationFrom: enums.ResponseNavigation): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toResponse) {
            /** For response auto navigation when a response gets 100% marked, the responseNavigationDirection will get undefined  */
            if (markingStore.instance.currentResponseMarkingProgress === 100 && this.responseNavigationDirection === undefined
                && navigationFrom !== enums.ResponseNavigation.markScheme) {
                this.props.moveCallback(enums.ResponseNavigation.next);
            } else {
                if (!this.isResponseNavigationArrowClicked) {
                    /** If it is navigating from markscheme then ,set the isNavigationThroughMarkScheme as markScheme  */
                    markingActionCreator.setNavigationThroughMarkscheme(enums.ResponseNavigation.markScheme);
                    if (navigationFrom === enums.ResponseNavigation.markScheme &&
                        !markSchemeHelper.isNextResponseAvailable) {
                        this.responseNavigationDirection = enums.ResponseNavigation.first;
                    } else if (navigationFrom === enums.ResponseNavigation.markScheme) {
                        this.responseNavigationDirection = enums.ResponseNavigation.next;
                    }
                } else {
                    this.isResponseNavigationArrowClicked = false;
                }
                this.props.moveCallback(this.responseNavigationDirection);
            }
        } else {
            //reset the isResponseNavigationArrowClicked when navigate to current response view
            this.isResponseNavigationArrowClicked = false;
            /** Set the isNavigationThroughMarkScheme as None ,when we navigate to (inbox,worklist,etc) other than response. */
            markingActionCreator.setNavigationThroughMarkscheme(enums.ResponseNavigation.none);
        }
    };

    /**
     * Get the directed remark locale key according to the directed remark request type.
     * @param {enums.RemarkRequestType} remarkRequestType
     * @returns remark request key
     */
    private getDirectedRemarkLocaleKey(remarkRequestType: enums.RemarkRequestType): string {
        return 'generic.remark-types.long-names.' + enums.RemarkRequestType[remarkRequestType];
    }

    /**
     * Navigation of the response after submitting the response from markscheme
     */
    private navigateToNextResponseAfterSubmit = (submittedMarkGroupIds: Array<number>,
        selectedDisplayId: string,
        isFromMarkScheme: boolean): void => {
        // If Marker got withdrawn during the actions. Skip the activities.
        if (qigStore.instance.selectedQIGForMarkerOperation === undefined) {
            return;
        }

        let worklistNavigationRequired = false;
        this.isWorkListDataRefreshedAfterSubmit = false;
        if (isFromMarkScheme) {
            if (submitStore.instance.getSubmitResponseReturn.hasQualityFeedbackOutstanding) {
                worklistNavigationRequired = true;
            } else {
                let worklistType = submitStore.instance.getCurrentWorklistType;
                if ((submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation
                    || submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation)) {
                    if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus === enums.ExaminerApproval.Approved) {
                        // Marker Got Approved during submission. Message is displayed from worklist component helper.
                        // Set The new worklist type as Live and navigate
                        worklistType = enums.WorklistType.live;
                        worklistNavigationRequired = true;
                    }
                }

                // Clear the marks and annotations if needed for Reloading the DefinitiveMarks
                submitHelper.clearMarksAndAnnotations(submittedMarkGroupIds);

                // If the marker having more than 1 responses in his worklist and he got approved with the first std response,
                // Publish new marking mode event. To change marking mode to live
                if (worklistNavigationRequired ||
                    worklistStore.instance.isNextResponseAvailable(selectedDisplayId)
                    && !submitStore.instance.isExaminerApprovalStatusChanged) {
                    let responseMode = enums.ResponseMode.open;
                    let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                    let examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
                    let questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
                    let remarkRequestType = worklistStore.instance.getRemarkRequestType;
                    let isDirectedRemark = worklistStore.instance.isDirectedRemark;
                    worklistActionCreator.notifyWorklistTypeChange
                        (markSchemeGroupId, examinerRoleId, questionPaperPartId, worklistType, responseMode, remarkRequestType,
                        isDirectedRemark,
                        qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                        false);
                    this.isWorkListDataRefreshedAfterSubmit = true;
                } else {
                    worklistNavigationRequired = true;
                }
            }

            if (worklistNavigationRequired) {
                navigationHelper.loadWorklist();
            }
        }
    };

    /**
     * Worklist data changed.
     */
    private workListDataChanged = (): void => {
        if (this.isWorkListDataRefreshedAfterSubmit) {
            this.isWorkListDataRefreshedAfterSubmit = false;
            this.navigateResponse(enums.ResponseNavigation.next, true);
        }
    };

}
export = ResponseNavigation;
