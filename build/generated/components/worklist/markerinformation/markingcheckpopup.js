"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var pureRenderComponent = require('../../base/purerendercomponent');
var worklistStore = require('../../../stores/worklist/workliststore');
var enums = require('../../utility/enums');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
var markingCheckActionCreator = require('../../../actions/markingcheck/markingcheckactioncreator');
var qigStore = require('../../../stores/qigselector/qigstore');
var popupDisplayActionCreator = require('../../../actions/popupdisplay/popupdisplayactioncreator');
var constants = require('../../utility/constants');
var classNames = require('classnames');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var MarkingCheckPopup = (function (_super) {
    __extends(MarkingCheckPopup, _super);
    /**
     * Constructor MarkingCheckPopup
     * @param markingCheckProps
     * @param markingCheckstate
     */
    function MarkingCheckPopup(markingCheckProps, markingCheckstate) {
        var _this = this;
        _super.call(this, markingCheckProps, markingCheckstate);
        /**
         * Gets the marker label to be shown in marking check popup
         * @param marker
         */
        this.getMarkerLabel = function (marker) {
            var labelText = marker.fullname;
            if (!marker.isEligibleForMarkingCheck) {
                if (marker.approvalStatus === enums.ExaminerApproval.Suspended && marker.hasActiveMarkingCheck) {
                    labelText += ' (' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.Suspended') +
                        '-' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.CheckRequested') + ')';
                }
                else if (marker.approvalStatus === enums.ExaminerApproval.Suspended ||
                    marker.approvalStatus === enums.ExaminerApproval.NotApproved) {
                    labelText += ' (' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.' +
                        enums.ExaminerApproval[marker.approvalStatus]) + ')';
                }
            }
            else if (marker.hasActiveMarkingCheck) {
                labelText += ' (' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.CheckRequested') + ')';
            }
            return labelText;
        };
        /**
         * Toggles the marking check popup
         */
        this.toggleMarkingCheckPopup = function () {
            _this.setState({ isMarkingCheckPopupVisible: !_this.state.isMarkingCheckPopupVisible });
        };
        /**
         * Initiates the popup with latest data
         */
        this.markingCheckButtonClicked = function () {
            _this.markingCheckToList = new Array();
            _this.recipientList = worklistStore.instance.markingCheckRecipientList;
            if (_this.recipientList && _this.recipientList.count() > 0) {
                _this.toggleMarkingCheckPopup();
            }
            else {
                markingCheckActionCreator.toggleRequestMarkingCheckButton(false);
                if (applicationStore.instance.isOnline) {
                    popupDisplayActionCreator.popUpDisplay(enums.PopUpType.NoMarkingCheckRequestPossible, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, { popupContent: '' });
                }
            }
        };
        /**
         * Indicates whether the OK button is enabled
         */
        this.isOkButtonEnabled = function () {
            return _this.recipientList ?
                _this.recipientList.some(function (marker) { return marker.isChecked; }) : false;
        };
        /**
         * On Popup ok click
         */
        this.onCheckBoxClick = function (examinerId, currentState) {
            _this.recipientList.find(function (marker) {
                return marker.examinerId === examinerId;
            }).isChecked = !currentState;
            _this.setState({ reRenderPopup: Date.now() });
        };
        /**
         * On Popup ok click
         */
        this.okClick = function () {
            _this.toggleMarkingCheckPopup();
            var that = _this;
            var systemMessagePriority = constants.SYSTEM_MESSAGE;
            _this.recipientList.map(function (marker) {
                if (marker.isChecked) {
                    that.markingCheckToList.push(marker.examinerId);
                }
            });
            var questionPaperId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            messagingActionCreator.sendExaminerMessage(_this.markingCheckToList, '', '', questionPaperId, null, enums.MessagePriority.Important, markSchemeGroupId, null, -1, -1, false, null, enums.SystemMessage.CheckMyMarks);
            messagingActionCreator.sendExaminerMessage(_this.markingCheckToList, '', '', questionPaperId, null, systemMessagePriority, markSchemeGroupId, null, -1, -1, false, null, enums.SystemMessage.CheckMyMarks);
        };
        /**
         * On Popup cancel click
         */
        this.cancelClick = function () {
            _this.toggleMarkingCheckPopup();
            markingCheckActionCreator.toggleRequestMarkingCheckButton(false);
        };
        this.state = {
            isMarkingCheckPopupVisible: false,
            isOkButtonEnabled: false,
            reRenderPopup: 0
        };
    }
    /**
     * Component did mount
     */
    MarkingCheckPopup.prototype.componentDidMount = function () {
        this.addEventListeners();
    };
    /**
     * Component will unmount
     */
    MarkingCheckPopup.prototype.componentWillUnmount = function () {
        this.removeEventListeners();
    };
    /**
     * Component render
     */
    MarkingCheckPopup.prototype.render = function () {
        var that = this;
        var markCheckButtonOffset;
        var markingCheckButton = htmlUtilities.getElementById('marking_check_button_id');
        if (markingCheckButton) {
            markCheckButtonOffset = markingCheckButton.getBoundingClientRect().top;
        }
        var popupContentHeight = {
            maxHeight: 'calc(100vh - ' + markCheckButtonOffset + 'px - 70px)' // 70px is the border padding
        };
        var popupWrapTop = {
            top: markCheckButtonOffset + 'px'
        };
        var PE = null;
        if (this.recipientList) {
            var pe_1 = this.recipientList.filter(function (marker) { return marker.isPrincipalExaminer; }).toArray();
            if (pe_1 && pe_1.length > 0) {
                PE = (React.createElement("div", {className: 'approval-options'}, React.createElement("input", {id: 'examiner_' + pe_1[0].examinerId, className: 'checkbox show-remark', type: 'checkbox', disabled: pe_1[0].hasActiveMarkingCheck || !pe_1[0].isEligibleForMarkingCheck, checked: pe_1[0].hasActiveMarkingCheck || pe_1[0].isChecked, onChange: function () { that.onCheckBoxClick(pe_1[0].examinerId, pe_1[0].isChecked); }}), React.createElement("label", {className: 'remark-label', htmlFor: 'examiner_' + pe_1[0].examinerId}, that.getMarkerLabel(pe_1[0]))));
            }
        }
        var MARKERS = this.recipientList ?
            this.recipientList.map(function (marker) {
                if (!marker.isPrincipalExaminer) {
                    return (React.createElement("div", {className: 'approval-options'}, React.createElement("input", {id: 'examiner_' + marker.examinerId, className: 'checkbox show-remark', type: 'checkbox', disabled: marker.hasActiveMarkingCheck || !marker.isEligibleForMarkingCheck, checked: marker.hasActiveMarkingCheck || marker.isChecked, onChange: function () { that.onCheckBoxClick(marker.examinerId, marker.isChecked); }}), React.createElement("label", {className: 'remark-label', htmlFor: 'examiner_' + marker.examinerId}, that.getMarkerLabel(marker))));
                }
            }) : null;
        return (React.createElement("div", {id: 'RequestMarkingCheckPopupOverlay', className: classNames('popup small request-marking-check popup-overlay', { 'open': this.state.isMarkingCheckPopupVisible }), role: 'dialog'}, React.createElement("div", {className: 'popup-wrap', id: 'RequestMarkingCheckPopupId', style: popupWrapTop}, React.createElement("div", {id: 'popup1Desc', className: 'popup-content', style: popupContentHeight}, React.createElement("p", {id: 'despt_id', className: 'despt'}, localeStore.instance.TranslateText('marking.worklist.request-marking-check-menu.header')), PE, MARKERS), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("button", {className: 'button rounded close-button', title: 'Cancel', onClick: this.cancelClick}, localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button')), React.createElement("button", {className: 'button primary rounded', title: 'Ok', onClick: this.okClick, disabled: !this.isOkButtonEnabled()}, localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button'))))));
    };
    /**
     * Add all event listeners here
     */
    MarkingCheckPopup.prototype.addEventListeners = function () {
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED, this.markingCheckButtonClicked);
    };
    /**
     * Remove all event listeners here.
     */
    MarkingCheckPopup.prototype.removeEventListeners = function () {
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED, this.markingCheckButtonClicked);
    };
    return MarkingCheckPopup;
}(pureRenderComponent));
module.exports = MarkingCheckPopup;
//# sourceMappingURL=markingcheckpopup.js.map