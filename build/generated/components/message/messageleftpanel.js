"use strict";
var React = require('react');
var MessagesForQig = require('./messagesforqig');
var classNames = require('classnames');
var Immutable = require('immutable');
var enums = require('../utility/enums');
var SearchPanel = require('../utility/search/searchpanel');
var localeStore = require('../../stores/locale/localestore');
var messageLeftPanel = function (props) {
    if ((props.messageGroupDetails === undefined || props.messageGroupDetails.messages === undefined || props.selectedMsg === undefined)
        && (props.searchData.isSearching === undefined || props.selectedTab !== enums.MessageFolderType.Inbox)) {
        return null;
    }
    return (React.createElement("div", {className: 'column-left', id: 'msg-left-panel'}, React.createElement("div", {className: 'tab-content-holder'}, React.createElement("div", {className: 'tab-content msg-inbox active', id: 'msgTab1'}, React.createElement(SearchPanel, {id: 'search-panel', key: 'search-panel-key', selectedLanguage: props.selectedLanguage, searchData: props.searchData, onSearch: props.onSearch, isSearchResultTextVisible: true, searchResultsFor: localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.search-result-for'), searchPlaceHolder: localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.search-by-sender-placeholder'), searchTooltip: localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.search-by-sender-tooltip'), searchCancel: localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.cancel-search-tooltip'), searchClassName: 'col-6-of-12 search-box-panel', searchWrapClass: 'msg-search-wrap'}), getMessageList()))));
    /**
     * Returns the message list section
     */
    function getMessageList() {
        if (props.messageGroupDetails === undefined || props.messageGroupDetails.messages === undefined ||
            props.selectedMsg === undefined) {
            return (React.createElement("div", {className: 'msg-listing-wrap', id: 'msg-list-container'}, React.createElement("ul", {className: 'msg-listing'})));
        }
        var messageList = Immutable.List();
        var mergedMessages;
        var selectedMsgId = props.selectedMsg.examinerMessageId;
        var groupedMessageObject = props.messageGroupDetails.MessageGroupObjects;
        // index variable for id
        var groupIndex = 0;
        var toRender = groupedMessageObject.map(function (messageObject) {
            groupIndex++;
            return (React.createElement(MessagesForQig, {qigId: messageObject.qigId, isOpen: messageObject.isOpen, onExpandOrCollapse: props.onExpandOrCollapse, qigName: messageObject.textToDisplay, messages: Immutable.List(messageObject.messages), selectedMsgId: selectedMsgId, unReadMessages: messageObject.unReadMessages, id: 'msg-grp-' + groupIndex, key: 'msg-grp-' + groupIndex, selectedLanguage: props.selectedLanguage, onSelectedMessageChanged: props.onSelectedMessageChanged}));
        });
        return (React.createElement("div", {className: 'msg-listing-wrap', id: 'msg-list-container'}, React.createElement("ul", {className: 'msg-listing'}, toRender)));
    }
};
module.exports = messageLeftPanel;
//# sourceMappingURL=messageleftpanel.js.map