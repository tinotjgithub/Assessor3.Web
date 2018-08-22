"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var navigationStore = require('../../stores/navigation/navigationstore');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var enums = require('../utility/enums');
/* tslint:disable:variable-name */
var MessagePopup;
/* tslint:enable:variable-name */
var qigStore;
var messagingActionCreator;
var htmlUtilities;
var messageHelper;
var messageStore;
var operationModeHelper;
var examinerStore;
var ccActionCreator;
var MessageComposeWrapper = (function (_super) {
    __extends(MessageComposeWrapper, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function MessageComposeWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isMessagePopupVisible = false;
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        this.isOnline = false;
        this.isDependenciesLoaded = false;
        /**
         * Invoked while changing the container
         */
        this.onContainerChange = function () {
            // If team management is loaded, load the modules if not loaded
            if (messageStore === undefined && (navigationStore.instance.containerPage === enums.PageContainers.TeamManagement
                || navigationStore.instance.containerPage === enums.PageContainers.WorkList
                || navigationStore.instance.containerPage === enums.PageContainers.StandardisationSetup)) {
                _this.loadDependencies();
            }
            // Container changed. close the message panel
            if (_this.isMessagePopupVisible) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                _this.isMessagePopupVisible = false;
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * This method will call on message open
         */
        this.onMessagePanelOpen = function (messageType) {
            if (messageType === enums.MessageType.TeamCompose) {
                _this.isMessagePopupVisible = true;
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * Callback function for message panel close
         */
        this.onCloseMessagePopup = function (messageNavigationArguments) {
            _this.isMessagePopupVisible = false;
            _this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            _this.setState({ renderedOn: Date.now() });
        };
        this.loadDependencies = this.loadDependencies.bind(this);
        this.networkStatusChanged = this.networkStatusChanged.bind(this);
    }
    /**
     * render method
     */
    MessageComposeWrapper.prototype.render = function () {
        if (!this.isMessagePopupVisible) {
            return null;
        }
        return (React.createElement(MessagePopup, {isOpen: true, closeMessagePanel: this.onCloseMessagePopup, messageType: enums.MessageType.TeamCompose, selectedLanguage: this.props.selectedLanguage, selectedQigItemId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, selectedQigItem: messageHelper.getCurrentQIGName(), qigItemsList: new Array(), supervisorId: operationModeHelper.subExaminerId, qigName: messageHelper.getCurrentQIGName(), supervisorName: examinerStore.instance.getMarkerInformation.formattedExaminerName, priorityDropDownSelectedItem: this.priorityDropdownSelectedItem, onQigItemSelected: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, messageBody: messageHelper.getMessageContent(enums.MessageType.TeamCompose), questionPaperPartId: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId}));
    };
    /**
     * componentDidMount
     */
    MessageComposeWrapper.prototype.componentDidMount = function () {
        navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.onContainerChange);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    };
    /**
     * componentWillUnmount
     */
    MessageComposeWrapper.prototype.componentWillUnmount = function () {
        navigationStore.instance.removeListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.onContainerChange);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
        if (messageStore) {
            messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
        }
    };
    /**
     * Load required classess for the component
     */
    MessageComposeWrapper.prototype.loadDependencies = function (retryWhenOnline) {
        var _this = this;
        if (retryWhenOnline === void 0) { retryWhenOnline = false; }
        var ensurePromise = require.ensure([
            './messagepopup',
            '../../stores/qigselector/qigstore',
            '../../actions/messaging/messagingactioncreator',
            '../../utility/generic/htmlutilities',
            '../utility/message/messagehelper',
            '../../stores/message/messagestore',
            '../utility/userdetails/userinfo/operationmodehelper',
            '../../stores/markerinformation/examinerstore',
            '../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator'
        ], function () {
            MessagePopup = require('./messagepopup');
            qigStore = require('../../stores/qigselector/qigstore');
            messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
            htmlUtilities = require('../../utility/generic/htmlutilities');
            messageHelper = require('../utility/message/messagehelper');
            messageStore = require('../../stores/message/messagestore');
            operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
            examinerStore = require('../../stores/markerinformation/examinerstore');
            ccActionCreator =
                require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
            // Offline Team management Scenario - when back online , load the failed call after bundle load
            if (retryWhenOnline && qigStore.instance.selectedQIGForMarkerOperation) {
                ccActionCreator.getMarkSchemeGroupCCs(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
            }
            _this.addEventListeners();
            _this.isDependenciesLoaded = true;
        });
        ensurePromise.catch(function (e) {
            _this.isDependenciesLoaded = false;
        });
    };
    /**
     * Add event Listeners
     */
    MessageComposeWrapper.prototype.addEventListeners = function () {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
    };
    /**
     * network status changed callback
     */
    MessageComposeWrapper.prototype.networkStatusChanged = function () {
        this.isOnline = applicationStore.instance.isOnline;
        if (this.isOnline) {
            if (!this.isDependenciesLoaded) {
                this.loadDependencies(true);
            }
            else if (qigStore.instance.selectedQIGForMarkerOperation) {
                ccActionCreator.getMarkSchemeGroupCCs(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
            }
        }
    };
    return MessageComposeWrapper;
}(pureRenderComponent));
module.exports = MessageComposeWrapper;
//# sourceMappingURL=messagecomposewrapper.js.map