/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
import worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
import qigStore = require('../../../stores/qigselector/qigstore');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import worklistStore = require('../../../stores/worklist/workliststore');
import stringHelper = require('../../../utility/generic/stringhelper');
import constants = require('../../utility/constants');
import qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
let classNames = require('classnames');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import markingInstructioActionCreator = require('../../../actions/markinginstructions/markinginstructionactioncreator');
import markingInstructionStore = require('../../../stores/markinginstruction/markinginstructionstore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    targetCount: number;
    worklistType: enums.WorklistType;
    remarkRequestType: enums.RemarkRequestType;
    isDirectedRemark: boolean;
    isTeamManagementMode: boolean;
}

interface State {
    renderedOn: number;
}

class WorklistType extends pureRenderComponent<Props, State> {

    private isActive: boolean = false;
    private isDisabled: boolean = false;

    /**
     * Constructor for WorklistType
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = { renderedOn: 0 };
        this.handleMarkingModeClick = this.handleMarkingModeClick.bind(this);
    }

    /**
     * Subscribe to events
     */
    public componentDidMount() {
        /* subscribing to worklist marking mode change event */
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        /* subscribing to worklist marking mode change event */
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
    }

    /**
     * Render componets
     * @returns formated html result
     */
    public render() {

        this.isActive = worklistStore.instance.currentWorklistType === this.props.worklistType
            && worklistStore.instance.getRemarkRequestType === this.props.remarkRequestType;

        this.isDisabled = qualityFeedbackHelper.isWorklistDisabledBasedOnQualityFeedback
            (this.props.worklistType, this.props.remarkRequestType);

        let targetCount = this.props.targetCount;
        let worklistTypeName;

        if (this.props.worklistType === enums.WorklistType.directedRemark) {
            worklistTypeName = stringHelper.format(localeStore.instance.TranslateText(
                this.getDirectedRemarkLocaleKey(this.props.remarkRequestType)), [constants.NONBREAKING_HYPHEN_UNICODE]);
        } else {
            worklistTypeName = localeStore.instance.TranslateText(this.getMarkingModeLocalekey(this.props.worklistType));
        }
        // Render output
        return (
            <li className={classNames('', { 'active': this.isActive }, { 'disabled': this.isDisabled }) }>
                <a id={'worklistType' + this.props.id} href='javascript:void(0)'
                    title={worklistTypeName}
                    className='left-submenu-item'
                    onClick={this.handleMarkingModeClick}>
                    <span className='menu-count'>{targetCount}</span>
                    {worklistTypeName}
                </a>
            </li>
        );
    }

    /**
     * Notify the worklist change selected event
     * @param event
     */
    private handleMarkingModeClick(event: any): void {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            if (markingInstructionStore.instance.isMarkingInstructionPanelOpen) {
                // if the marking instruction panel is opened then close it on clicking the worklist type, 
                // this click event is not propagating to worklist since it is stoped from here
                markingInstructioActionCreator.markingInstructionPanelOpenActionCreator(false);
            }
            if (this.isDisabled !== true) {
                /*The “Atypical” label should not be clickable for now(sprint4)*/
                if (this.props.worklistType === enums.WorklistType.live ||
                    this.props.worklistType === enums.WorklistType.atypical ||
                    this.props.worklistType === enums.WorklistType.directedRemark) {

                    let markingMode: enums.MarkingMode = worklistStore.instance.getMarkingModeByWorkListType(this.props.worklistType);

                    let responseMode: enums.ResponseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedback(
                        enums.ResponseMode.open, markingMode, this.props.remarkRequestType, this.props.worklistType);

                    if (qigStore.instance.selectedQIGForMarkerOperation) {
                        worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                            this.props.worklistType,
                            responseMode,
                            this.props.remarkRequestType,
                            this.props.isDirectedRemark,
                            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                            !(targetSummaryStore.instance.isSupervisorRemarkCreated ||
                                // disable cache if a supervisor remark created or 
                                // if whole responses are present. as changes can be made in a different QIG
                                // and mainly in atypical responses which behave as whole response
                                (qigStore.instance.relatedQigList && qigStore.instance.relatedQigList.count() > 1)));
                    }
                }
            }
            event.stopPropagation();
        }
    }

    /**
     * Get the marking mode locale key according to the marking mode selection.
     * @param {enums.WorklistType} worklistType
     * @returns marking mode key
     */
    private getMarkingModeLocalekey(worklistType: enums.WorklistType): string {
        return 'marking.worklist.worklist-type.' + enums.WorklistType[worklistType];
    }

    /**
     * Get the directed remark locale key according to the directed remark request type.
     * @param {enums.RemarkRequestType} remarkRequestType
     * @returns remark request key
     */
    private getDirectedRemarkLocaleKey(remarkRequestType: enums.RemarkRequestType): string {
        return 'generic.remark-types.long-names.' + enums.RemarkRequestType[remarkRequestType];
    }

    /**
     * When live/atypical/supervisor remark selected
     * If we open a response and close that then we need to take the response mode from response store( selected response mode)
     * otherwise It will take the response mode from worklist store.
     */
    private markingModeChanged = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };
}
export = WorklistType;