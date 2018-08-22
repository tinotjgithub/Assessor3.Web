"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var enums = require('../utility/enums');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var messageStore = require('../../stores/message/messagestore');
var exceptionStore = require('../../stores/exception/exceptionstore');
var navigationHelper = require('../utility/navigation/navigationhelper');
var qigActionCreator = require('./../../actions/qigselector/qigselectoractioncreator');
var Logout = (function (_super) {
    __extends(Logout, _super);
    /**
     * Constructor Logout
     * @param props
     * @param state
     */
    function Logout(props, state) {
        _super.call(this, props, state);
        /**
         * if discard popup is displaying.
         */
        this.onPopUpDisplayEvent = function (popUpType, popUpActionType) {
            if ((popUpType === enums.PopUpType.DiscardMessageNavigateAway || popUpType === enums.PopUpType.DiscardExceptionNavigateAway)
                && popUpActionType === enums.PopUpActionType.Close) {
                qigActionCreator.getLocksInQigs(true);
            }
        };
        this.state = {
            isLogoutConfirmationIsDisplaying: false
        };
    }
    /**
     * Render component
     * @returns
     */
    Logout.prototype.render = function () {
        return (React.createElement("button", {onClick: navigationHelper.showLogoutConfirmation.bind(this), className: 'primary rounded logout-btn', id: 'logout-button'}, localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button')));
    };
    /**
     * Component did mount
     */
    Logout.prototype.componentDidMount = function () {
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
    };
    /**
     * Component will unmount
     */
    Logout.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
    };
    return Logout;
}(pureRenderComponent));
module.exports = Logout;
//# sourceMappingURL=logout.js.map