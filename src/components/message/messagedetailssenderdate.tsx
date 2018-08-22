import React = require('react');
import enums = require('../utility/enums');
import messageHelper = require('../utility/message/messagehelper');
import localeStore = require('../../stores/locale/localestore');
import messageTranslationHelper = require('../utility/message/messagetranslationhelper');
import qigStore = require('../../stores/qigselector/qigstore');

interface MessageDetailsSenderDateProps extends PropsBase {
    displayDate: string;
}

/**
 * Message Details Send Date section which contains date and time of send message.
 * @param props
 */
const messageDetailsSenderDate: React.StatelessComponent<MessageDetailsSenderDateProps> = (props: MessageDetailsSenderDateProps) => {

    // Get the date format
    let displayDate = messageHelper.getDateToDisplay(props.displayDate);

    return (
        <div className='col-6-of-12 msg-sender-info'>
            <div className='msg-time small-text dim-text' id={ props.id + '-date'} >{displayDate}</div>
        </div>
    );
};

export = messageDetailsSenderDate;