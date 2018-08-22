import React = require('react');
import enums = require('../utility/enums');
import localestore = require('../../stores/locale/localestore');

interface MessagePriorityDescriptionProps extends PropsBase, LocaleSelectionBase {
    messagePriorityName: string;
}

/**
 * Priority Description for details
 * @param props
 */
const messagePriorityDescription: React.StatelessComponent<MessagePriorityDescriptionProps> = (props: MessagePriorityDescriptionProps) => {
    let messagePriorityName = props.messagePriorityName.toLowerCase();
    if (messagePriorityName !== enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard).toLocaleLowerCase()) {
        return (
            <div className='msg-alert grey msg-important' id = {props.id}>
                {localestore.instance.TranslateText('messaging.message-lists.message-detail.high-' + messagePriorityName + '-banner')}
            </div>
        );
    } else {
        return null;
    }
};

export = messagePriorityDescription;
