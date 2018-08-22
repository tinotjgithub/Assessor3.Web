"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var qigStore = require('../../../stores/qigselector/qigstore');
var enums = require('../../utility/enums');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var responseStore = require('../../../stores/response/responsestore');
var busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
var domManager = require('../../../utility/generic/domhelper');
var classNames = require('classnames');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var worklistStore = require('../../../stores/worklist/workliststore');
var simulationModeHelper = require('../../../utility/simulation/simulationmodehelper');
var Promise = require('es6-promise');
var qigSelectorActionCreator = require('../../../actions/qigselector/qigselectoractioncreator');
/**
 * GetNewResponses class, Returns Button based on the isEnabled value
 */
var AllocateResponseButton = (function (_super) {
    __extends(AllocateResponseButton, _super);
    /**
     * Constructor for Allocated response button
     * @param props
     */
    function AllocateResponseButton(props) {
        var _this = this;
        _super.call(this, props, null);
        this._boundHandleOnClick = null;
        /**
         * Method which handles the click event of window
         */
        this.handleOnClick = function (source) {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (source.target !== undefined &&
                domManager.searchParentNode(source.target, function (el) {
                    return el.id === 'getNewResponseButton_arrow';
                }) == null) {
                if (_this.state.isOpen !== undefined && _this.state.isOpen === true) {
                    /** Close the dropdown list */
                    _this.setState({
                        isOpen: false
                    });
                }
            }
        };
        /**
         * Method which gets invoked once response allocation is completed
         */
        this.onResponseAllocated = function (responseAllocationErrorCode) {
            _this.setState({
                isClicked: false
            });
        };
        this.state = {
            isClicked: false,
            isOpen: false,
            isAllocating: false,
            isClickedArrowButton: false
        };
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.onArrowButtonClick = this.onArrowButtonClick.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    AllocateResponseButton.prototype.render = function () {
        if (this.props.isEnabled && !this.state.isClicked && !this.state.isAllocating) {
            // Added pooled remark and simulation condition since for both,
            // allocation button's arrow need not be shown for allocating multiple responses
            if (this.props.worklistType === enums.WorklistType.pooledRemark || this.props.worklistType === enums.WorklistType.simulation) {
                return (React.createElement("button", {id: this.props.id, className: 'primary rounded large download-rsp-btn split-btn', onClick: this.onGetNewResponseButtonClick.bind(this, false, false)}, React.createElement("span", {id: this.props.id + '_mainText', className: 'padding-left-5 text-middle'}, this.props.buttonMainText)));
            }
            else {
                return (React.createElement("div", {className: classNames('split-button-wrap dropdown-wrap', {
                    ' open': this.state.isOpen && this.state.isClickedArrowButton,
                    ' close': !this.state.isOpen && this.state.isClickedArrowButton,
                    '': this.state.isClickedArrowButton
                })}, React.createElement("button", {id: this.props.id, className: 'primary rounded large download-rsp-btn split-btn', onClick: this.onGetNewResponseButtonClick.bind(this, true, false)}, React.createElement("span", {id: this.props.id + '_mainText', className: 'padding-left-5 text-middle'}, this.props.buttonMainText)), React.createElement("button", {id: this.props.id + '_arrow', className: 'primary rounded large split-btn split-btn-arrow menu-button', title: this.props.title, onClick: this.onArrowButtonClick}, React.createElement("span", {id: this.props.id + '_headerWithArrow', className: 'sprite-icon menu-arrow-m-white-icon text-middle'})), React.createElement("ul", {className: 'menu'}, React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_single', onClick: this.onGetNewResponseButtonClick.bind(this, false, false)}, this.props.buttonSingleResponseText, " ")), React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_concurrent', onClick: this.onGetNewResponseButtonClick.bind(this, true, false)}, this.props.buttonUpToOpenResponseLimitText, " ")), this.props.isWholeResponseButtonAvailable ?
                    React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_wholeresponse', onClick: this.onGetNewResponseButtonClick.bind(this, false, true)}, localeStore.instance.
                        TranslateText('marking.worklist.action-buttons.allocate-whole-response'), " ")) : null)));
            }
        }
        else if (this.state.isAllocating) {
            // Added pooled remark and simulation condition since for both,
            // allocation button's arrow need not be shown for allocating multiple responses
            if (this.props.worklistType === enums.WorklistType.pooledRemark || this.props.worklistType === enums.WorklistType.simulation) {
                return (React.createElement("button", {id: this.props.id, className: 'primary rounded large download-rsp-btn split-btn disabled', onClick: this.onGetNewResponseButtonClick.bind(this, false, false)}, React.createElement("span", {id: this.props.id + '_mainText', className: 'padding-left-5 text-middle'}, this.props.buttonMainText)));
            }
            else {
                return (React.createElement("div", {className: 'split-button-wrap dropdown-wrap'}, React.createElement("button", {id: this.props.id, className: 'primary rounded large download-rsp-btn split-btn disabled', title: this.props.title}, React.createElement("span", {id: this.props.id + '_mainText', className: 'padding-left-5 padding-right-10 text-middle'}, this.props.buttonMainText)), React.createElement("button", {className: 'primary rounded large split-btn split-btn-arrow menu-button disabled'}, React.createElement("span", {className: 'sprite-icon menu-arrow-icon text-middle'})), React.createElement("ul", {className: 'menu'}, React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_single'}, this.props.buttonSingleResponseText, " ")), React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_concurrent'}, this.props.buttonUpToOpenResponseLimitText, " ")), this.props.isWholeResponseButtonAvailable ?
                    React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_wholeresponse'}, localeStore.instance.
                        TranslateText('marking.worklist.action-buttons.allocate-whole-response'), " ")) : null)));
            }
        }
        else {
            // Added pooled remark and simulation condition since for both,
            // allocation button's arrow need not be shown for allocating multiple responses
            if (this.props.worklistType === enums.WorklistType.pooledRemark || this.props.worklistType === enums.WorklistType.simulation) {
                return (React.createElement("button", {id: this.props.id, className: 'primary rounded large download-rsp-btn split-btn disabled', title: this.props.title}, React.createElement("span", {id: this.props.id + '_mainText', className: 'padding-left-5 text-middle'}, this.props.buttonMainText), React.createElement("span", {id: this.props.id + '_subText', className: 'awaiting-feedback-msg text-middle small-text'}, this.props.buttonSubText)));
            }
            else {
                return (React.createElement("div", {className: 'split-button-wrap dropdown-wrap'}, React.createElement("button", {id: this.props.id, className: 'primary rounded large download-rsp-btn split-btn disabled', title: this.props.title}, React.createElement("span", {id: this.props.id + '_mainText', className: 'padding-left-5 text-middle'}, this.props.buttonMainText), React.createElement("span", {id: this.props.id + '_subText', className: 'awaiting-feedback-msg text-middle small-text'}, this.props.buttonSubText)), React.createElement("button", {className: 'primary rounded large split-btn split-btn-arrow menu-button disabled'}, React.createElement("span", {className: 'sprite-icon menu-arrow-icon text-middle'})), React.createElement("ul", {className: 'menu'}, React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_single'}, this.props.buttonSingleResponseText, " ")), React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_concurrent'}, this.props.buttonUpToOpenResponseLimitText, " ")), this.props.isWholeResponseButtonAvailable ?
                    React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)', id: this.props.id + '_wholeresponse'}, localeStore.instance.
                        TranslateText('marking.worklist.action-buttons.allocate-whole-response'), " ")) : null)));
            }
        }
    };
    /**
     * When component mounts
     */
    AllocateResponseButton.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    };
    /**
     * When component unmounts
     */
    AllocateResponseButton.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
    };
    /**
     * Method which handles the click event of Get New Response button
     */
    AllocateResponseButton.prototype.onGetNewResponseButtonClick = function (isConcurrentDownload, isWholeResponseDownload) {
        this.setState({
            isClicked: true,
            isAllocating: true
        });
        // Check for standardisation setup completion.
        var that = this;
        if (simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
            var promise = qigSelectorActionCreator.checkStandardisationSetupCompleted(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, enums.PageContainers.WorkList, enums.PageContainers.WorkList);
            Promise.Promise.all([promise]).then(function (data) {
                if (data[0] === false) {
                    that.continueOnGetNewResponseButtonClick(isConcurrentDownload, isWholeResponseDownload);
                }
            });
        }
        else {
            that.continueOnGetNewResponseButtonClick(isConcurrentDownload, isWholeResponseDownload);
        }
    };
    /**
     * Method which handles the click event of Get New Response button
     */
    AllocateResponseButton.prototype.continueOnGetNewResponseButtonClick = function (isConcurrentDownload, isWholeResponseDownload) {
        var isCandidatePrioritisationCCON = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.CandidatePrioritisation).toLowerCase() === 'true' ? true : false;
        var isQualityRemarkCCON = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.QualityRemark, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase()
            === 'true' ? true : false;
        responseActionCreator.allocateResponse(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, this.props.worklistType, isConcurrentDownload, qigStore.instance.selectedQIGForMarkerOperation.examSessionId, qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, examinerStore.instance.getMarkerInformation.examinerId, isCandidatePrioritisationCCON, isQualityRemarkCCON, worklistStore.instance.getRemarkRequestType, isWholeResponseDownload);
        // Invoking onBusy method
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
    };
    /**
     * Method which handles the click event of Arrow Button
     */
    AllocateResponseButton.prototype.onArrowButtonClick = function () {
        this.setState({
            isOpen: !this.state.isOpen,
            isClickedArrowButton: true
        });
    };
    return AllocateResponseButton;
}(pureRenderComponent));
module.exports = AllocateResponseButton;
//# sourceMappingURL=allocateresponsebutton.js.map