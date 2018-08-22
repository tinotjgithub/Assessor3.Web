"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var GenericButton = require('../utility/genericbutton');
var enums = require('../utility/enums');
var pureRenderComponent = require('../base/purerendercomponent');
var exceptionStore = require('../../stores/exception/exceptionstore');
var qigStore = require('../../stores/qigselector/qigstore');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var exceptionactionCreator = require('../../actions/exception/exceptionactioncreator');
var operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
var warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var keyDownHelper = require('../../utility/generic/keydownhelper');
/**
 * ActionException contain an area for adding exception comments, ok and cancel buttons.
 * @param props
 * @param state
 */
var ActionException = (function (_super) {
    __extends(ActionException, _super);
    /**
     * Constructor ActionException
     * @param props
     * @param state
     */
    function ActionException(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isActionExceptionButtonClicked = false;
        /**
         * Handles the action event for showing action exception popup.
         */
        this.showActionExceptionPopup = function (doVisiblePopup, exceptionActionType) {
            _this.isShowPopup = doVisiblePopup;
            // deactivating the keydown helper while action exception panel(Resolve or escalate poup) is open
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            _this.exceptionActionType = exceptionActionType;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Cancel the exception action.
         */
        this.cancelExceptionAction = function () {
            _this.isActionExceptionButtonClicked = false;
            _this.isShowPopup = false;
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            _this.setState({
                exceptionComment: '',
                isActionExceptionButtonDisabled: true,
                renderedOn: Date.now()
            });
        };
        /**
         *  This will call on update exception status received
         */
        this.onUpdateExceptionStatusReceived = function (doNaviageteToTeamManagement) {
            if (doNaviageteToTeamManagement === void 0) { doNaviageteToTeamManagement = false; }
            if (!doNaviageteToTeamManagement) {
                _this.isActionExceptionButtonClicked = false;
                _this.isShowPopup = false;
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
                _this.setState({
                    exceptionComment: '',
                    isActionExceptionButtonDisabled: true,
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Render the exception comment box.
         * @param- event
         */
        this.commentChanged = function (event) {
            var exceptionComment = event.target.value;
            _this.setState({
                isActionExceptionButtonDisabled: _this.isValidException(exceptionComment),
                exceptionComment: exceptionComment
            });
        };
        /**
         * This method will validate whether or not the exception comment section edited
         * @param- exceptionComment
         */
        this.isValidException = function (exceptionComment) {
            return !(exceptionComment.trim().length > 0);
        };
        /**
         * update exception status escalate or resolved.
         */
        this.updateExceptionStatus = function () {
            // To avoid double click a variable is set check whether the button is already clicked or not
            if (_this.props.exceptionDetails && !_this.isActionExceptionButtonClicked) {
                _this.isActionExceptionButtonClicked = true;
                var exceptionDetails = _this.props.exceptionDetails;
                var comments = [{
                        comment: _this.state.exceptionComment,
                        uniqueId: 0,
                        examinerID: _this.props.exceptionDetails.ownerExaminerId,
                        escalationPoint: _this.props.exceptionDetails.ownerEscalationPoint,
                        authorIsGroup: false,
                        exceptionId: _this.props.exceptionDetails.uniqueId,
                        updatedBy: ''
                    }];
                var exceptionParams = {
                    uniqueId: _this.props.exceptionDetails.uniqueId,
                    exceptionType: _this.props.exceptionDetails.exceptionType,
                    currentStatus: _this.props.exceptionDetails.currentStatus,
                    exceptionComments: comments,
                    markSchemeID: _this.props.exceptionDetails.markSchemeID,
                    ownerEscalationPoint: _this.props.exceptionDetails.ownerEscalationPoint,
                    ownerExaminerId: _this.props.exceptionDetails.ownerExaminerId,
                    markGroupId: _this.props.exceptionDetails.markGroupId,
                    candidateScriptID: _this.props.exceptionDetails.candidateScriptID,
                    markSchemeGroupID: _this.props.exceptionDetails.markSchemeGroupID,
                    questionPaperPartID: _this.props.exceptionDetails.questionPaperPartID,
                    originatorExaminerId: _this.props.exceptionDetails.originatorExaminerId,
                    isEBookMarking: _this.props.exceptionDetails.iseBookMarking
                };
                var exceptionActionParams = {
                    exception: exceptionParams,
                    actionType: _this.exceptionActionType,
                    requestedByExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
                    qigId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                };
                exceptionactionCreator.updateExceptionStatus(exceptionActionParams, teamManagementStore.instance.isRedirectFromException);
            }
        };
        /**
         * Method to handle the exception action failure.
         */
        this.handleExceptionActionFailure = function (failureCode, warningMessageAction) {
            if (failureCode !== enums.FailureCode.None
                && warningMessageAction === enums.WarningMessageAction.ExceptionAction) {
                _this.isShowPopup = false;
                _this.setState({
                    exceptionComment: '',
                    isActionExceptionButtonDisabled: true,
                    renderedOn: Date.now()
                });
            }
        };
        // Set the default states
        this.state = {
            renderedOn: 0,
            isActionExceptionButtonDisabled: true,
            exceptionComment: ''
        };
        this.isShowPopup = false;
        this.exceptionActionType = enums.ExceptionActionType.Escalate;
        this.showActionExceptionPopup = this.showActionExceptionPopup.bind(this);
        this.commentChanged = this.commentChanged.bind(this);
        this.onActionInterruption = this.onActionInterruption.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    ActionException.prototype.render = function () {
        return (React.createElement("div", {className: classNames('popup medium popup-overlay close-button escalate-exception-popup ', { 'open': this.isShowPopup }), id: 'EscalateException', role: 'dialog', "aria-labelledby": 'popup7Title', "aria-describedby": 'popup7Desc'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-header'}, React.createElement("h4", {id: 'popup7Title'}, localeStore.instance.
            TranslateText('generic.response.' +
            enums.ExceptionActionType[this.exceptionActionType].toLowerCase() + '-exception-dialog.header'))), React.createElement("div", {className: 'popup-content', id: 'popup7Desc'}, React.createElement("p", null, localeStore.instance.
            TranslateText('generic.response.' +
            enums.ExceptionActionType[this.exceptionActionType].toLowerCase() + '-exception-dialog.body')), React.createElement("textarea", {className: 'escalate-comment', id: 'exception_action_comment', "aria-label": 'exception_action_comment', onChange: this.commentChanged, value: this.state.exceptionComment})), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement(GenericButton, {id: 'cancel-exception-action-button', key: 'key_cancel-exception-action-button', className: 'button  close-button rounded', title: localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button'), content: localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button'), onClick: this.cancelExceptionAction, disabled: false, selectedLanguage: this.props.selectedLanguage}), React.createElement(GenericButton, {id: 'exception-action-button', key: 'key_exception-action-button', className: 'button rounded primary', onClick: this.updateExceptionStatus, title: localeStore.instance.
            TranslateText('generic.response.view-exception-panel.' +
            enums.ExceptionActionType[this.exceptionActionType]), content: localeStore.instance.
            TranslateText('generic.response.view-exception-panel.' +
            enums.ExceptionActionType[this.exceptionActionType]), disabled: this.state.isActionExceptionButtonDisabled, selectedLanguage: this.props.selectedLanguage})))));
    };
    /**
     * Component did mount
     */
    ActionException.prototype.componentDidMount = function () {
        this.addEventListeners();
    };
    /**
     * Component will unmount
     */
    ActionException.prototype.componentWillUnmount = function () {
        this.removeEventListeners();
    };
    /**
     * Add all event listeners for action exception here
     */
    ActionException.prototype.addEventListeners = function () {
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP, this.showActionExceptionPopup);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED, this.onUpdateExceptionStatusReceived);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.handleExceptionActionFailure);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT, this.onActionInterruption);
    };
    /**
     * Remove all event listeners for action exception here.
     */
    ActionException.prototype.removeEventListeners = function () {
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.SHOW_ACTION_EXCEPTION_POPUP, this.showActionExceptionPopup);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED, this.onUpdateExceptionStatusReceived);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.handleExceptionActionFailure);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT, this.onActionInterruption);
    };
    /**
     * On user action interruption
     */
    ActionException.prototype.onActionInterruption = function () {
        // When the application is offline and the escalate or resolve exception popu is present
        if (!applicationStore.instance.isOnline) {
            this.isShowPopup = false;
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            this.setState({
                exceptionComment: '',
                isActionExceptionButtonDisabled: true,
                renderedOn: Date.now()
            });
        }
    };
    return ActionException;
}(pureRenderComponent));
module.exports = ActionException;
//# sourceMappingURL=actionexception.js.map