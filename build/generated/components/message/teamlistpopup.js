"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var GenericButton = require('../utility/genericbutton');
var messageStore = require('../../stores/message/messagestore');
var classNames = require('classnames');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var TeamListTreeview = require('./teamlisttreeview');
var htmlUtilities = require('../../utility/generic/htmlutilities');
/**
 * TeamListPopup section contain team list
 * @param props
 * @param state
 */
var TeamListPopup = (function (_super) {
    __extends(TeamListPopup, _super);
    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    function TeamListPopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isShowAddressPopup = false;
        this.isToTeamChecked = false;
        this.prevPageY = 0;
        this.allowUp = false;
        this.allowDown = false;
        /**
         * event handler for touch start
         */
        this.onTouchStart = function (event) {
            _this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
            var content = _this.teamListRef;
            _this.allowUp = (content.scrollTop > 0);
            _this.allowDown = (content.scrollTop <= content.scrollHeight - content.clientHeight);
        };
        /**
         * event handler for touch move
         */
        this.onTouchMove = function (event) {
            setTimeout(function () {
                event.preventDefault();
                var content = _this.teamListRef;
                var pageY = event.changedTouches[0].pageY;
                var up = (pageY > _this.prevPageY);
                var down = (pageY < _this.prevPageY);
                var diff = Math.abs(_this.prevPageY - event.pageY);
                _this.prevPageY = event.pageY;
                if ((up && _this.allowUp)) {
                    content.scrollTop = (content.scrollTop - diff);
                }
                else if (down && _this.allowDown) {
                    content.scrollTop = (content.scrollTop + diff);
                }
            }, 0);
        };
        /**
         * event handler for touch end
         */
        this.onTouchEnd = function (event) {
            _this.prevPageY = 0;
        };
        /**
         * Method to cancel team selection.
         */
        this.cancelTeamSelection = function () {
            messagingActionCreator.updateSelectedTeamList(false);
        };
        /**
         * Method to save selected team list in the message store.
         */
        this.saveSelectedTeamList = function () {
            messagingActionCreator.updateSelectedTeamList(true);
        };
        /**
         * Method for handling entire team click.
         */
        this.entireTeamClick = function () {
            messagingActionCreator.entireTeamChecked(!_this.teamList.team.toTeam);
        };
        /**
         * Method for update team list.
         */
        this.teamListUpdated = function (isToTeamClick, isExpand) {
            // avoid EntireTeam's checked-status change while clicking Expand/Collapse button
            if (isExpand === undefined || !isExpand) {
                _this.isToTeamChecked = isToTeamClick && messageStore.instance.teamDetails.team.toTeam ? true : false;
            }
            _this.teamList = messageStore.instance.teamDetails;
            _this.setState({ renderedOn: Date.now() });
        };
        /*
         * event handler for team list panel scroll.
         */
        this.onScroll = function () {
            _this.setState({
                renderedOn: _this.state.renderedOn,
                teamListScrollHeight: _this.getTeamListScrollHeight()
            });
        };
        /**
         * Clicking on check/uncheck of superviser
         */
        this.updateTeamListStatus = function (uniqueId, isExpand) {
            messagingActionCreator.updateTeamListStatus(uniqueId, isExpand);
        };
        // Set the default states
        this.state = {
            renderedOn: 0,
        };
        this.isShowAddressPopup = false;
        if (messageStore.instance.teamDetails && messageStore.instance.teamDetails.team.subordinates) {
            this.isShowAddressPopup = messageStore.instance.teamDetails.team.subordinates.length > 0 ? true : false;
        }
        this.teamList = messageStore.instance.teamDetails;
        this.isToTeamChecked = false;
        if (this.teamList) {
            this.isToTeamChecked = this.teamList.team.toTeam;
        }
    }
    /**
     * Render component
     * @returns
     */
    TeamListPopup.prototype.render = function () {
        var _this = this;
        this.teamList = messageStore.instance.teamDetails;
        var toTeamListPopup = this.teamList ? (React.createElement("div", null, React.createElement("div", {className: classNames('popup small msg-address-list-popup in-page-popout', this.isShowAddressPopup ? 'popup-overlay open' : 'popup-overlay close'), id: 'addressListPopUp', role: 'dialog', "aria-describedby": 'addressList'}, React.createElement("div", {className: 'popup-wrap'}, React.createElement("div", {className: 'popup-content', id: 'popup1Desc', ref: function (ele) { _this.teamListRef = ele; }}, React.createElement("div", {className: 'tree-view'}, React.createElement("ul", {role: 'tree', id: 'addressList', onScroll: this.onScroll}, React.createElement("li", {className: 'node highlighted', role: 'treeitem', "aria-expanded": 'false', id: 'id_entire_team'}, React.createElement("input", {type: 'checkbox', className: 'text-middle checkbox', id: 'item1', checked: this.isToTeamChecked, onChange: this.entireTeamClick}), React.createElement("label", {htmlFor: 'item1', id: 'id_entire_team_label'}, localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team'))), React.createElement("li", {className: 'node expanded', role: 'treeitem', "aria-expanded": 'true'}, React.createElement("input", {type: 'checkbox', className: 'text-middle checkbox', id: 'item2', checked: this.teamList && this.teamList.team.parent ?
            this.teamList.team.parent.isChecked : false}), this.teamList && this.teamList.team.parent ?
            React.createElement("label", {htmlFor: 'item2', onClick: this.updateTeamListStatus.bind(this, this.teamList.team.parent.examinerRoleId, false)}, this.teamList.team.parent.fullName) : null, React.createElement("ul", {role: 'group', id: this.props.id + '_TeamList'}, React.createElement("li", {className: 'node expanded', role: 'treeitem', "aria-expanded": 'true', id: 'li_' + this.teamList.team.examinerRoleId}, React.createElement("span", {className: 'sprite-icon user-icon-medium tree-icon'}), React.createElement("label", {className: 'text-middle', id: 'current_login_user'}, this.teamList.team.fullName), React.createElement(TeamListTreeview, {id: 'teamList', key: 'teamList_key', addressList: this.teamList.team.subordinates, renderedOn: this.state.renderedOn}))))))), React.createElement("div", {className: 'popup-footer text-right'}, React.createElement(GenericButton, {id: 'button-rounded-close-button', key: 'key_button rounded close-button', className: 'button rounded close-button', title: localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.cancel-button'), content: localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.cancel-button'), disabled: false, onClick: this.cancelTeamSelection}), React.createElement(GenericButton, {id: 'button-primary-rounded-button', key: 'key_button primary rounded-button', className: 'button primary rounded', title: localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.ok-button'), content: localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.ok-button'), disabled: false, onClick: this.saveSelectedTeamList})))))) : null;
        return (toTeamListPopup);
    };
    /**
     * Component did mount
     */
    TeamListPopup.prototype.componentDidMount = function () {
        /* these events are used to implement custom
           scrolling logic to handle the elastic scroll behavior of ipad */
        if (this.teamListRef && (htmlUtilities.isIPadDevice)) {
            this.teamListRef.addEventListener('touchstart', this.onTouchStart);
            this.teamListRef.addEventListener('touchmove', this.onTouchMove);
            this.teamListRef.addEventListener('touchend', this.onTouchEnd);
        }
        messageStore.instance.addListener(messageStore.MessageStore.TEAM_LIST_UPDATED, this.teamListUpdated);
    };
    /**
     * Component will unmount
     */
    TeamListPopup.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.TEAM_LIST_UPDATED, this.teamListUpdated);
        this.teamListRef.removeEventListener('touchstart', this.onTouchStart);
        this.teamListRef.removeEventListener('touchmove', this.onTouchMove);
        this.teamListRef.removeEventListener('touchend', this.onTouchEnd);
    };
    /**
     * componentWillReceiveProps
     * @param nextProps
     */
    TeamListPopup.prototype.componentWillReceiveProps = function (nextProps) {
        this.isShowAddressPopup = false;
        if (messageStore.instance.teamDetails && messageStore.instance.teamDetails.team.subordinates) {
            this.isShowAddressPopup = messageStore.instance.teamDetails.team.subordinates.length > 0 ? true : false;
        }
    };
    /**
     * returns the team list scroll height
     */
    TeamListPopup.prototype.getTeamListScrollHeight = function () {
        return (this.teamListRef) ? (this.teamListRef.clientHeight + this.teamListRef.scrollTop) : undefined;
    };
    return TeamListPopup;
}(pureRenderComponent));
module.exports = TeamListPopup;
//# sourceMappingURL=teamlistpopup.js.map