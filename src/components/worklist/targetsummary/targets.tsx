/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import markingTarget = require('../../../stores/qigselector/typings/markingtarget');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
import TargetDetails = require('./targetdetails');
import TargetItem = require('./targetitem');
import LiveOrPooledRemarkTargetItem = require('./liveorpooledremarktargetitem');
import ProgressIndicator = require('../../utility/progressindicator/circularprogressindicator');
import qigStore = require('../../../stores/qigselector/qigstore');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import localeHelper = require('../../../utility/locale/localehelper');
import worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import targetHelper = require('../../../utility/target/targethelper');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import Immutable = require('immutable');
import qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import worklistStore = require('../../../stores/worklist/workliststore');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    markingTargetsSummary: Immutable.List<markingTargetSummary>;
    liveTargetRenderedOn?: number;
    isTeamManagementMode: boolean;
    renderedOn?: number;
}

/**
 * State of a component
 */
interface State {
    currentlySelectedMarkingMode?: number;
    currentlySelectedremarkRequestTypeId?: number;
}

/**
 * Class for the Targts in the worklist.
 */
class Targets extends pureRenderComponent<Props, State> {

    private markingTargets: markingTarget[];
    private selectedMarkingMode?: number;

    /**
     * The constructor for the target component.
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
        this.selectedMarkingMode = enums.MarkingMode.None;
        this.state = {
            currentlySelectedMarkingMode: undefined,
            currentlySelectedremarkRequestTypeId: undefined
        };
        this.onTargetClick = this.onTargetClick.bind(this);
    }

    /**
     * Renders component
     * @returns
     */
    public render() {
        if (this.props.markingTargetsSummary === undefined || this.props.markingTargetsSummary.count() === 0) {
            return null;
        }
        this.selectedMarkingMode = targetHelper.getWorklistTargetToBeSelected(undefined, this.isSelectedWorklistTypeDisabled());

        let that = this;
        let previousTarget: markingTargetSummary;
        let standardisationSetupComplete: boolean = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete : false;
        // Loop through the marking targets
        let torender = this.props.markingTargetsSummary.map((markingTarget: markingTargetSummary) => {

            let idString = '_' + markingTarget.markingModeID;
            let isAggregateQIGTargetsON: boolean = qigStore.instance.isAggregatedQigCCEnabledForCurrentQig;
            let isTargetDisabled = that.isTargetDisabled(markingTarget, previousTarget);

            switch (markingTarget.markingModeID) {
                case enums.MarkingMode.LiveMarking:
                    previousTarget = markingTarget;

                    // Only closed tab is displaying in help examiners,
                    // update the open count with closed closed count, Also should not render progress bar component.
                    if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
                        markingTarget.examinerProgress.openResponsesCount = markingTarget.examinerProgress.closedResponsesCount;
                        return that.renderTargetItem(markingTarget, isTargetDisabled, idString);
                    }

                    return (<LiveOrPooledRemarkTargetItem target={markingTarget}
                        isOverAllTargetCompleted={(targetHelper.getExaminerQigStatus()
                            === enums.ExaminerQIGStatus.OverAllTargetCompleted) ? true : false}
                        isDisabled={isTargetDisabled}
                        isSelected={that.isSelectedTarget(markingTarget.markingModeID, undefined)}
                        onClickCallback={that.onTargetClick}
                        id={'target_id' + idString} key={'target_key' + idString}
                        selectedLanguage={this.props.selectedLanguage} renderedOn={this.props.liveTargetRenderedOn}
                        directedRemarkTarget={this.getDirectedRemarkTargets()}
                        remarkRequestTypeID={undefined}
                        isDirectedRemark={false}
                        isTeamManagementMode={this.props.isTeamManagementMode}
                        isAggregatedTargetsCCEnabled={isAggregateQIGTargetsON}
                    />);
                case enums.MarkingMode.Practice:
                case enums.MarkingMode.Approval:
                case enums.MarkingMode.ES_TeamApproval:
                    previousTarget = markingTarget;
                    if (markingTarget.maximumMarkingLimit > 0) {
                        return that.renderTargetItem(markingTarget, isTargetDisabled, idString);
                    }
                    break;
                case enums.MarkingMode.Remarking:
                    previousTarget = markingTarget;
                    if (markingTarget.examinerProgress.isDirectedRemark === false) {
                        return (<LiveOrPooledRemarkTargetItem target={markingTarget}
                            isDisabled={isTargetDisabled}
                            //Passing false since overall target completed is not applicable for pooled remark targets
                            isOverAllTargetCompleted={false}
                            isSelected={that.isSelectedTarget(markingTarget.markingModeID, markingTarget.remarkRequestTypeID)}
                            onClickCallback={that.onTargetClick}
                            selectedLanguage={this.props.selectedLanguage}
                            id={'target_id' + idString + enums.RemarkRequestType[markingTarget.remarkRequestTypeID]}
                            key={'target_key' + idString + enums.RemarkRequestType[markingTarget.remarkRequestTypeID]}
                            renderedOn={this.props.liveTargetRenderedOn}
                            remarkRequestTypeID={markingTarget.remarkRequestTypeID}
                            isDirectedRemark={markingTarget.examinerProgress.isDirectedRemark}
                            isTeamManagementMode={this.props.isTeamManagementMode}
                            isAggregatedTargetsCCEnabled={isAggregateQIGTargetsON}
                        />);
                    }
                    break;
                case enums.MarkingMode.Simulation:
                    previousTarget = markingTarget;
                    if (!standardisationSetupComplete) {
                        return that.renderTargetItem(markingTarget, false, idString);
                    }
                    break;
                default: return null;
            }
        });

        // Render the marking targets to the wrapper
        return (
            <div className='left-menu-holder'>
                <ul id='left_menu_panel_group' className='left-menu panel-group'>
                    {torender}
                </ ul>
            </ div>
        );
    }

    /**
     * render the targetItemElement
     */
    private renderTargetItem = (markingTarget: markingTargetSummary, isTargetDisabled: boolean, idString: string) => {
        return (
            <TargetItem target={markingTarget}
                isDisabled={isTargetDisabled}
                isOverAllTargetCompleted={(targetHelper.getExaminerQigStatus()
                    === enums.ExaminerQIGStatus.OverAllTargetCompleted) ? true : false}
                isSelected={this.isSelectedTarget(markingTarget.markingModeID, undefined)}
                onClickCallback={this.onTargetClick}
                selectedLanguage={this.props.selectedLanguage}
                id={'target_id' + idString} key={'target_key' + idString}
                renderedOn={this.props.liveTargetRenderedOn}
                remarkRequestTypeID={undefined}
                isDirectedRemark={false}
                isTeamManagementMode={this.props.isTeamManagementMode}
            />);
    };

    /**
     * This will set state currently selected marking mode
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        if (this.props.markingTargetsSummary === undefined || this.props.markingTargetsSummary.count() === 0) {
            return;
        }

        this.setState({ currentlySelectedMarkingMode: undefined, currentlySelectedremarkRequestTypeId: undefined });
    }

    /**
     * This will return the selection status.
     * @param markingModeId
     */
    private isSelectedTarget(markingModeId: enums.MarkingMode, remarkRequestTypeId: enums.RemarkRequestType): boolean {
        if (this.state.currentlySelectedMarkingMode === undefined) {
            if (this.selectedMarkingMode === enums.MarkingMode.Remarking) {
                return targetHelper.getCurrentRemarkRequestType() === remarkRequestTypeId;
            } else {
                return this.selectedMarkingMode === markingModeId;
            }
        } else if (remarkRequestTypeId !== undefined) {
            return this.state.currentlySelectedremarkRequestTypeId === remarkRequestTypeId;
        } else {
            return this.state.currentlySelectedMarkingMode === markingModeId;
        }
    }

    /**
     * On target clicked
     * @param markingModeId
     */
    private onTargetClick(markingModeId: enums.MarkingMode, remarkRequestTypeId: enums.RemarkRequestType, isDirectedRemark: boolean) {

        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            let worklistType: enums.WorklistType;
            switch (markingModeId) {
                case enums.MarkingMode.Practice:
                    worklistType = enums.WorklistType.practice;
                    break;
                case enums.MarkingMode.LiveMarking:
                    worklistType = enums.WorklistType.live;
                    break;
                case enums.MarkingMode.Approval:
                    worklistType = enums.WorklistType.standardisation;
                    break;
                case enums.MarkingMode.ES_TeamApproval:
                    worklistType = enums.WorklistType.secondstandardisation;
                    break;
                case enums.MarkingMode.Remarking:
                    worklistType = enums.WorklistType.pooledRemark;
                    break;
                case enums.MarkingMode.Simulation:
                    worklistType = enums.WorklistType.simulation;
                    break;
            }

            let isTargetCompleted: boolean;
            isTargetCompleted = false;
            let responseMode: enums.ResponseMode;
            responseMode = enums.ResponseMode.open;
            if (markingModeId === enums.MarkingMode.Practice || markingModeId === enums.MarkingMode.Remarking) {
                this.props.markingTargetsSummary.map(function (markingTarget: any) {
                    if (markingTarget.markingModeID === markingModeId) {
                        if (markingTarget.isTargetCompleted) {
                            isTargetCompleted = true;
                        }
                    }
                });
            } else if (markingModeId === enums.MarkingMode.Approval ||
                markingModeId === enums.MarkingMode.ES_TeamApproval) {
                isTargetCompleted = targetHelper.isESTargetCompleted(markingModeId);

            }
            if (isTargetCompleted) {
                responseMode = enums.ResponseMode.closed;
            }
            if (qigStore.instance.selectedQIGForMarkerOperation) {

                responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedback(responseMode, markingModeId,
                    remarkRequestTypeId);

                worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                    worklistType,
                    responseMode,
                    remarkRequestTypeId,
                    isDirectedRemark,
                    qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
            }
            this.setState({ currentlySelectedMarkingMode: markingModeId, currentlySelectedremarkRequestTypeId: remarkRequestTypeId });
        }
    }

    /**
     * This method will determine whether a target in disabled state or not
     * @param target - target
     * @param previousTarget - previous target
     */
    private isTargetDisabled(target: markingTargetSummary, previousTarget: markingTargetSummary) {
        // Determine if the item is shown in a disabled status here.
        // In the future state the item is disabled.
        //When the marker has quality feedback outstanding, the remarking tab should be disabled
        return markerOperationModeFactory.operationMode.isTargetDisabled(target, previousTarget);
    }

    /**
     * Check is ES Team Approval Status
     */
    private isESTeamApprovalStatus() {
        if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true
            || (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false
                && this.isSecondStandardisation() === true)) {
            return true;
        }

        return false;
    }

    /**
     * Check if Second Standardisation
     */
    private isSecondStandardisation() {
        let secondStandardisationTarget = this.props.markingTargetsSummary.filter((target: markingTargetSummary) =>
            target.markingModeID === enums.MarkingMode.ES_TeamApproval).first();

        if (secondStandardisationTarget !== undefined) {
            return true;
        }

        return false;
    }

    /**
     * Get directed remark targets
     */
    private getDirectedRemarkTargets() {
        let filteredDirectedRemarkTargets = this.props.markingTargetsSummary.filter((markingTarget: markingTargetSummary) =>
            markingTarget.examinerProgress.isDirectedRemark === true);

        return Immutable.List<markingTargetSummary>(filteredDirectedRemarkTargets);
    }

    /**
     * Get selected worklist type disabled.
     */
    private isSelectedWorklistTypeDisabled = (): boolean => {
        let isDisabledtarget: boolean = false;
        let markingModeByWorklistType: enums.MarkingMode =
            targetHelper.getMarkingModeByWorklistType(worklistStore.instance.currentWorklistType);
        if (markingModeByWorklistType) {
            let targetByWorklistType: any =
                this.props.markingTargetsSummary.filter(target => target.markingModeID === markingModeByWorklistType).first();
            // The markingTargetsSummary will not be get refreshed soon when we switching through recent history link.
            if (targetByWorklistType) {
                isDisabledtarget = markerOperationModeFactory.operationMode.isTargetDisabled(targetByWorklistType, undefined);
            }
        }
        return isDisabledtarget;
    }
}

export = Targets;