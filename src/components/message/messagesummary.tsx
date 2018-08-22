import React = require('react');
import enums = require('../utility/enums');
let classNames = require('classnames');
import messageHelper = require('../utility/message/messagehelper');
import messageStore = require('../../stores/message/messagestore');
import pureRenderComponent = require('../base/purerendercomponent');
import messageTranslationHelper = require('../utility/message/messagetranslationhelper');
import localeStore = require('../../stores/locale/localestore');

interface Props extends PropsBase, LocaleSelectionBase {
    message: Message;
    selectedMsgId: number;
    onSelectedMessageChanged: Function;
    unReadMessages: number;
}

/**
 * Make the string as html.
 * @param messageContent
 */
const createMarkup = (messageContent: string) => {
    return {
        __html: messageContent
    };
};

/**
 * This component was a stateless component, But seems that it is rerendering even it is no changes in props and state.
 * This wont happen in pureRender => Child component wont re render if it is not having any props or state change.
 */
class MessageSummary extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);
    }

    private onMessageClick = (event: any) => {
        if (this.props.message.examinerMessageId !== this.props.selectedMsgId) {
            this.props.onSelectedMessageChanged(this.props.message);
        }

        // Fire Action, If Read status need to be updated. and update the.
        event.stopPropagation();
    };

    /**
     * append examiners
     */
    private appendExaminer(): string {

        let examiners: string = '';

        if (this.props.message && this.props.message.toExaminerDetails != null) {
            this.props.message.toExaminerDetails.map((item: Examiner) => {
                examiners += item.fullName + ';';
            });

            // removing last item semicolon
            return examiners.replace(/;$/, '');
        }

        return examiners;
    }

    /**
     * Render method
     */
    public render() {
        let messagePriority: JSX.Element;

        if (this.props.message.priorityName !== enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard)) {
            messagePriority = (
                <span
                    className = { classNames('sprite-icon',
                        {
                            'exclamtion-icon-red':
                            this.props.message.priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Important)
                        },
                        {
                            'star-icon-red':
                            this.props.message.priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory)
                        },
                        'black') } >
                </span>
            );
        }

        let isMessageRead = messageStore.instance.isMessageRead(this.props.message.examinerMessageId);
        let translatedMessageContents: TranslatedMessageContent = messageTranslationHelper.getTranslatedContent(this.props.message);
        let toRender: JSX.Element;

        if (this.props.message.messageFolderType === enums.MessageFolderType.Inbox) {
            toRender = (
                <div id ={'sender-' + this.props.id} className='msg-sender small-text'>
                    {messageTranslationHelper.getExaminerName(this.props.message) }
                </div>
            );
        } else {
            toRender = (
                <div id ={'sender-' + this.props.id} className='msg-sender small-text'>
                    {
                        !this.props.message.toTeam ? this.appendExaminer()
                            : localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team')
                    }
                </div>
            );
        }


        return (
            <li id ={'msg-item-' + this.props.id} onClick = { this.onMessageClick }
                className = { classNames('msg-item',
                    { 'unread': this.props.message.status === enums.MessageReadStatus.New && !isMessageRead },
                    { 'selected': this.props.message.examinerMessageId === this.props.selectedMsgId }) } >
                <a href='javascript:void(0)' className='msg-item-link'>
                    <div className='msg-meta' data-id = {this.props.message.examinerMessageId}>
                        <div className='meta-left'>
                            {toRender}
                            <div id ={'subject-' + this.props.id} className='msg-title'>
                                { translatedMessageContents.subject }
                            </div>
                        </div>
                        <div className='meta-right small-text'>
                            <div id ={'time-' + this.props.id} className='msg-time'>
                                {messageHelper.getDateToDisplay(this.props.message.displayDate) }
                            </div>
                            <div id ={'priority-' + this.props.id} className='msg-meta-icons'>
                                <div className = 'msg-importance' >
                                    {messagePriority}
                                </div>
                            </div>
                            <div className='msg-flag'>
                            </div>
                        </div>
                    </div>
                    <div id={'body-summary-' + this.props.id} className='msg-body small-text' >
                        <p className='summary-text' id='msg-first-line'
                            dangerouslySetInnerHTML={createMarkup(translatedMessageContents.firstLine)} />
                    </div>
                </a>
            </li>
        );
    }
}

export = MessageSummary;