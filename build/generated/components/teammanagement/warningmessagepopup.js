"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var enums = require('../utility/enums');
var pureRenderComponent = require('../base/purerendercomponent');
var GenericDialog = require('../utility/genericdialog');
var warningMessagePopupHelper = require('../../utility/teammanagement/helpers/warningmessagepopuphelper');
var warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
/**
 * WarningMessagePopup contain message content and ok button.
 * @param props
 * @param state
 */
var WarningMessagePopup = (function (_super) {
    __extends(WarningMessagePopup, _super);
    /**
     * Constructor WarningMessagePopup
     * @param props
     * @param state
     */
    function WarningMessagePopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Method to handle the warning message actions.
         */
        this.handleWarningMessageActions = function (failureCode, warningMessageAction, args) {
            _this.failureCode = failureCode;
            _this.warningMessageAction = warningMessageAction;
            _this._warningMessagePopupHelper.bindWarningMessagePopupContent(failureCode);
            _this.setState({ doShowWarningPopup: true });
        };
        // Set the default states
        this.state = {
            doShowWarningPopup: false
        };
        this._warningMessagePopupHelper = new warningMessagePopupHelper();
        this.onOkButtonClick = this.onOkButtonClick.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    WarningMessagePopup.prototype.render = function () {
        var genericWarningPopup = this.state.doShowWarningPopup ? (React.createElement(GenericDialog, {content: this._warningMessagePopupHelper.warningPopupContent, header: this._warningMessagePopupHelper.warningPopupTitle, displayPopup: this.state.doShowWarningPopup, okButtonText: this.props.buttonText, onOkClick: this.onOkButtonClick, id: this.props.id, key: this.props.id, popupDialogType: enums.PopupDialogType.none})) : null;
        return (React.createElement("div", null, genericWarningPopup));
    };
    /**
     * Component did mount
     */
    WarningMessagePopup.prototype.componentDidMount = function () {
        this.addEventListeners();
    };
    /**
     * Component will unmount
     */
    WarningMessagePopup.prototype.componentWillUnmount = function () {
        this.removeEventListeners();
    };
    /**
     * Add all event listeners for warning message.
     */
    WarningMessagePopup.prototype.addEventListeners = function () {
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.handleWarningMessageActions);
    };
    /**
     * Remove all event listeners for warning message.
     */
    WarningMessagePopup.prototype.removeEventListeners = function () {
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.handleWarningMessageActions);
    };
    /**
     * Ok button click event to handle the failure action navigation.
     */
    WarningMessagePopup.prototype.onOkButtonClick = function () {
        if (this.failureCode === enums.FailureCode.Withdrawn) {
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                teamManagementActionCreator.removeHistoryItem(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            }
        }
        teamManagementActionCreator.warningMessageNavigation(this.failureCode, this.warningMessageAction);
        this.setState({ doShowWarningPopup: false });
    };
    return WarningMessagePopup;
}(pureRenderComponent));
module.exports = WarningMessagePopup;
//# sourceMappingURL=warningmessagepopup.js.map