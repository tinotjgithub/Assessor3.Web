import React = require('react');
import MessagesForQig = require('./messagesforqig');
import messageHelper = require('../utility/message/messagehelper');
let classNames = require('classnames');
import Immutable = require('immutable');
import enums = require('../utility/enums');
import SearchPanel = require('../utility/search/searchpanel');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import localeStore = require('../../stores/locale/localestore');
import qigStore = require('../../stores/qigselector/qigstore');

/**
 * Props for the Left Panel
 */
interface MessageLeftPanelProps extends LocaleSelectionBase, PropsBase {
    selectedTab: enums.MessageFolderType;
    selectedMsg: Message;
    onSelectedMessageChanged: Function;
    messageGroupDetails: MessageGroupDetails;
    searchData: SearchData;
    onSearch: Function;
    onExpandOrCollapse: Function;
    isMessageClicked?: boolean;
}

const messageLeftPanel = (props : MessageLeftPanelProps) => {
    if ((props.messageGroupDetails === undefined || props.messageGroupDetails.messages === undefined || props.selectedMsg === undefined)
            && (props.searchData.isSearching === undefined || props.selectedTab !== enums.MessageFolderType.Inbox)) {
                return null;
            }

    return (
        <div className='column-left' id='msg-left-panel'>
            <div className='tab-content-holder'>
                <div className='tab-content msg-inbox active' id='msgTab1'>
                    <SearchPanel
						id='search-panel'
						key='search-panel-key'
						selectedLanguage={props.selectedLanguage}
						searchData={props.searchData}
						onSearch={props.onSearch}
						isSearchResultTextVisible={true}
						searchResultsFor={localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.search-result-for')}
						searchPlaceHolder={localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.search-by-sender-placeholder')}
						searchTooltip={localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.search-by-sender-tooltip')}
						searchCancel={localeStore.instance.TranslateText('messaging.message-lists.search-by-sender.cancel-search-tooltip')}
						searchClassName={'col-6-of-12 search-box-panel'}
						searchWrapClass={'msg-search-wrap'} />
                    { getMessageList() }
                </div>
            </div>
        </div>
    );

    /**
     * Returns the message list section
     */
    function getMessageList() {

        if (props.messageGroupDetails === undefined || props.messageGroupDetails.messages === undefined ||
            props.selectedMsg === undefined) {
            return (
                <div className='msg-listing-wrap' id='msg-list-container'>
                    <ul className='msg-listing'></ul>
                </div>
            );
        }

        let messageList : Immutable.List < Message > = Immutable.List < Message > ();
        let mergedMessages;
        let selectedMsgId : number = props.selectedMsg.examinerMessageId;
        let groupedMessageObject : MessageGroupData[] = props.messageGroupDetails.MessageGroupObjects;

        // index variable for id
        let groupIndex : number = 0;

        let toRender = groupedMessageObject.map((messageObject : MessageGroupData) => {
            groupIndex++;
            return (
                !qigStore.instance.isQIGHidden(messageObject.messages[0].markSchemeGroupId) || props.isMessageClicked ? <MessagesForQig
                    qigId = {messageObject.qigId}
                    isOpen= {messageObject.isOpen}
                    onExpandOrCollapse = {props.onExpandOrCollapse}
                    qigName={messageObject.textToDisplay}
                    messages={Immutable.List(messageObject.messages)}
                    selectedMsgId={selectedMsgId}
                    unReadMessages={messageObject.unReadMessages}
                    id={'msg-grp-' + groupIndex}
                    key={'msg-grp-' + groupIndex}
                    selectedLanguage={props.selectedLanguage}
                    onSelectedMessageChanged={props.onSelectedMessageChanged}></MessagesForQig > : null
            );
        });

        return (
            <div className='msg-listing-wrap' id='msg-list-container'>
                <ul className='msg-listing'>
                    {toRender}
                </ul>
            </div>
        );

    }
};

export = messageLeftPanel;