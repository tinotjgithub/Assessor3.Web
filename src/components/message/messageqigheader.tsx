import React = require('react');
import NotificationCount = require('./notificationcount');
import localeStore = require('../../stores/locale/localestore');

interface MessageQIGHeaderProps extends LocaleSelectionBase, PropsBase {
    qigName: string;
    unReadMessages: number;
    headerClick: Function;
}

const messageQIGHeader: React.StatelessComponent<MessageQIGHeaderProps> = (props: MessageQIGHeaderProps) => {
    return (
        <a href='javascript:void(0)' className='msg-group-head' onClick={() => { props.headerClick(); }}
            title={localeStore.instance.TranslateText('messaging.message-lists.message-summaries.qig-group-tooltip')}>
            <span className='sprite-icon menu-arrow-icon' id={'icon-' + props.id}></span>
                <span className='msg-group-head-name' id={'qig-header-text-' + props.id} >
                    { props.qigName}
                    <NotificationCount
                    unReadMessageCount = { props.unReadMessages }
                    id = {'qig-header-' + props.id}
                    key = {'qig-header-' + props.id} />
                </span>
        </a>
    );
};

export = messageQIGHeader;