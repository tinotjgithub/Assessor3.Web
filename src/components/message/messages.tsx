import React = require('react');
import enums = require('../utility/enums');
import messageHelper = require('../utility/message/messagehelper');
import MessageSummary = require('./messagesummary');

interface MessagesForQIGProps extends LocaleSelectionBase, PropsBase {
    messages: Immutable.List<Message>;
    selectedMsgId: number;
    onSelectedMessageChanged: Function;
    unReadMessages: number;
}

const messages: React.StatelessComponent<MessagesForQIGProps> = (props: MessagesForQIGProps) => {

    let toRender = props.messages.map((message: Message) => {
        let msgIndex = props.messages.indexOf(message) + 1;

        return (
            <MessageSummary
                    message = { message }
                    selectedMsgId = {props.selectedMsgId}
                    id = { 'msg-' + msgIndex + '-' + props.id }
                    key = { 'msg-' + msgIndex + '-' + props.id }
                    selectedLanguage={props.selectedLanguage}
                    unReadMessages={props.unReadMessages}
                    onSelectedMessageChanged = { props.onSelectedMessageChanged } >
                </MessageSummary>
            );
        });

        return (
            <ul className='msg-listing'>
                { toRender }
            </ul>
        );
    };

export = messages;