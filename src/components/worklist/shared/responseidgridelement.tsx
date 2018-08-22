/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import stringHelper = require('../../../utility/generic/stringhelper');
import openResponseActionCreator = require('../../../actions/response/responseactioncreator');
import worklistStore = require('../../../stores/worklist/workliststore');
import responseStore = require('../../../stores/response/responsestore');
import markingStore = require('../../../stores/marking/markingstore');
import qigStore = require('../../../stores/qigselector/qigstore');
import enums = require('../../utility/enums');
import targetHelper = require('../../../utility/target/targethelper');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import messageStore = require('../../../stores/message/messagestore');
import messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import Immutable = require('immutable');

/**
 * Properties of response id column
 */
interface Props extends LocaleSelectionBase, PropsBase {
    displayId?: string;
    displayText?: string;
    isClickable?: boolean;
    isTileView?: boolean;
    isReusableResponseView?: boolean;
    candidateScriptId?: string;
}

/**
 * React component class for response id
 */
class ResponseIdGridElement extends pureRenderComponent<Props, any> {
    private classNameText: string = '';
    private actualDisplayId: string;
    private selectedMarkingMode: any;

    /**
     * Constructor for ResponseIdGridElement
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.handleResponseClick = this.handleResponseClick.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let title = (this.props.isReusableResponseView) ?
        stringHelper.format(localeStore.instance.
            TranslateText('standardisation-setup.standardisation-setup-worklist.response-data.script-id-tooltip'),
        [String(this.props.candidateScriptId)])
        : stringHelper.format(localeStore.instance.TranslateText('marking.worklist.response-data.response-id-tooltip'),
            [(this.props.displayText) ? String(this.props.displayText) : String(this.props.displayId)]);

        (this.props.isTileView) ? this.classNameText = 'resp-id response-display-id' :
            this.classNameText = 'response-display-id resp-id';

        return (
            <div className={this.classNameText}>
                <a href='javascript:void(0)' id={'res_' + this.props.id}
                    key={'res_key_' + this.props.id}
                    title={title}
                    className={(this.props.isTileView) ? 'dark-link large-text' : ''}
                    onClick={this.handleResponseClick}>
                    {(this.props.isReusableResponseView) ? String(this.props.candidateScriptId)
                        : (this.props.displayText) ? String(this.props.displayText) : String(this.props.displayId)}</a>
            </div>
        );
    }
    /**     
     * Componet did mount
     */
    public componentDidMount() {
        teamManagementStore.instance.setMaxListeners(0);
        if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
            teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                this.onApprovalManagementActionExecuted);
        }
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT,
            this.validateExaminerStatus);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
            teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                this.onApprovalManagementActionExecuted);
        }
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT,
            this.validateExaminerStatus);
    }

    /**
     * This will initiate open response action
     */
    private handleResponseClick = () => {
        //TO DO Remove this on enabling response click.
        if (!this.props.isClickable) {
            return;
        }
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            // Ideally marking mode should be read from the opened response,
            // since multiple marking modes won't come in the same worklist now this will work.
            this.selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

            this.actualDisplayId = this.props.displayId.toString();

            if (!messageStore.instance.isMessagePanelActive) {
                if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
                    let dataCollection: Array<ExaminerForSEPAction> = new Array<ExaminerForSEPAction>();
                    let examinerSEPAction: ExaminerForSEPAction = {
                        examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                        markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                        requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
                    };
                    dataCollection.push(examinerSEPAction);
                    let examinerSEPActions = Immutable.List<ExaminerForSEPAction>(dataCollection);

                    let doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument = {
                        actionIdentifier: enums.SEPAction.ViewResponse,
                        examiners: examinerSEPActions
                    };
                    teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
                } else if (worklistStore.instance.isMarkingCheckMode) {
                    teamManagementActionCreator.teamManagementExaminerValidation(
                        qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                        qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, 0,
                        worklistStore.instance.selectedMarkingCheckExaminer.fromExaminerID,
                        enums.ExaminerValidationArea.MarkCheckWorklist,
                        false, this.actualDisplayId, this.selectedMarkingMode);
                } else {
                    this.openResponse(this.actualDisplayId, this.selectedMarkingMode);
                }
            } else {
                let messageNavigationArguments: MessageNavigationArguments = {
                    responseId: parseInt(this.actualDisplayId),
                    canNavigate: false,
                    navigateTo: enums.MessageNavigation.toResponse,
                    navigationConfirmed: false,
                    hasMessageContainsDirtyValue: undefined,
                    triggerPoint: enums.TriggerPoint.None
                };
                messagingActionCreator.canMessageNavigate(messageNavigationArguments);
            }
        }
    }

    /**
     * This will open the response
     * @param actualDisplayId contains the actual display id
     * @param selectedMarkingMode contains the selected marking mode
     */
    private openResponse(actualDisplayId: string, selectedMarkingMode: any) {
        let openedResponseDetails =
            markerOperationModeFactory.operationMode.openedResponseDetails(actualDisplayId);

        responseHelper.openResponse(parseInt(actualDisplayId),
            enums.ResponseNavigation.specific,
            markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse &&
                    standardisationSetupStore.instance.selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession) ?
                    enums.ResponseMode.closed : enums.ResponseMode.open :
                worklistStore.instance.getResponseMode,
            markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId,
            enums.ResponseViewMode.zoneView,
            enums.TriggerPoint.None,
            openedResponseDetails.sampleReviewCommentId,
            openedResponseDetails.sampleReviewCommentCreatedBy);

        markSchemeHelper.getMarks(parseInt(actualDisplayId), selectedMarkingMode, false, true);

        eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(actualDisplayId));
    }

    /**
     * This will initiate the SEP action while opening a response
     */
    private onApprovalManagementActionExecuted = (actionIdentifier: number) => {
        if (actionIdentifier === enums.SEPAction.ViewResponse) {
            if (this.actualDisplayId && this.selectedMarkingMode) {
                this.openResponse(this.actualDisplayId, this.selectedMarkingMode);
            }
        }
    };

    /**
     * Method to open response if the loggined examiner is valid.
     */
    private validateExaminerStatus = (displayId: string, markingMode: enums.MarkingMode) => {
        if (displayId && markingMode !== enums.MarkingMode.None) {
            this.openResponse(displayId, markingMode);
        }
    };
}

export = ResponseIdGridElement;