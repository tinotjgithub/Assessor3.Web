"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
var qigStore = require('../../../stores/qigselector/qigstore');
var worklistStore = require('../../../stores/worklist/workliststore');
var stringHelper = require('../../../utility/generic/stringhelper');
var constants = require('../../utility/constants');
var qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
var targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var classNames = require('classnames');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var markingInstructioActionCreator = require('../../../actions/markinginstructions/markinginstructionactioncreator');
var markingInstructionStore = require('../../../stores/markinginstruction/markinginstructionstore');
var WorklistType = (function (_super) {
    __extends(WorklistType, _super);
    /**
     * Constructor for WorklistType
     * @param props
     * @param state
     */
    function WorklistType(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isActive = false;
        this.isDisabled = false;
        /**
         * When live/atypical/supervisor remark selected
         * If we open a response and close that then we need to take the response mode from response store( selected response mode)
         * otherwise It will take the response mode from worklist store.
         */
        this.markingModeChanged = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = { renderedOn: 0 };
        this.handleMarkingModeClick = this.handleMarkingModeClick.bind(this);
    }
    /**
     * Subscribe to events
     */
    WorklistType.prototype.componentDidMount = function () {
        /* subscribing to worklist marking mode change event */
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
    };
    /**
     * Unsubscribe events
     */
    WorklistType.prototype.componentWillUnmount = function () {
        /* subscribing to worklist marking mode change event */
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.markingModeChanged);
    };
    /**
     * Render componets
     * @returns formated html result
     */
    WorklistType.prototype.render = function () {
        this.isActive = worklistStore.instance.currentWorklistType === this.props.worklistType
            && worklistStore.instance.getRemarkRequestType === this.props.remarkRequestType;
        this.isDisabled = qualityFeedbackHelper.isWorklistDisabledBasedOnQualityFeedback(this.props.worklistType, this.props.remarkRequestType);
        var targetCount = this.props.targetCount;
        var worklistTypeName;
        if (this.props.worklistType === enums.WorklistType.directedRemark) {
            worklistTypeName = stringHelper.format(localeStore.instance.TranslateText(this.getDirectedRemarkLocaleKey(this.props.remarkRequestType)), [constants.NONBREAKING_HYPHEN_UNICODE]);
        }
        else {
            worklistTypeName = localeStore.instance.TranslateText(this.getMarkingModeLocalekey(this.props.worklistType));
        }
        // Render output
        return (React.createElement("li", {className: classNames('', { 'active': this.isActive }, { 'disabled': this.isDisabled })}, React.createElement("a", {id: 'worklistType' + this.props.id, href: 'javascript:void(0)', title: worklistTypeName, className: 'left-submenu-item', onClick: this.handleMarkingModeClick}, React.createElement("span", {className: 'menu-count'}, targetCount), worklistTypeName)));
    };
    /**
     * Notify the worklist change selected event
     * @param event
     */
    WorklistType.prototype.handleMarkingModeClick = function (event) {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        }
        else {
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
                    var markingMode = worklistStore.instance.getMarkingModeByWorkListType(this.props.worklistType);
                    var responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedback(enums.ResponseMode.open, markingMode, this.props.remarkRequestType, this.props.worklistType);
                    if (qigStore.instance.selectedQIGForMarkerOperation) {
                        worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, this.props.worklistType, responseMode, this.props.remarkRequestType, this.props.isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, !(targetSummaryStore.instance.isSupervisorRemarkCreated ||
                            // disable cache if a supervisor remark created or 
                            // if whole responses are present. as changes can be made in a different QIG
                            // and mainly in atypical responses which behave as whole response
                            (qigStore.instance.relatedQigList && qigStore.instance.relatedQigList.count() > 1)));
                    }
                }
            }
            event.stopPropagation();
        }
    };
    /**
     * Get the marking mode locale key according to the marking mode selection.
     * @param {enums.WorklistType} worklistType
     * @returns marking mode key
     */
    WorklistType.prototype.getMarkingModeLocalekey = function (worklistType) {
        return 'marking.worklist.worklist-type.' + enums.WorklistType[worklistType];
    };
    /**
     * Get the directed remark locale key according to the directed remark request type.
     * @param {enums.RemarkRequestType} remarkRequestType
     * @returns remark request key
     */
    WorklistType.prototype.getDirectedRemarkLocaleKey = function (remarkRequestType) {
        return 'generic.remark-types.long-names.' + enums.RemarkRequestType[remarkRequestType];
    };
    return WorklistType;
}(pureRenderComponent));
module.exports = WorklistType;
//# sourceMappingURL=worklisttype.js.map