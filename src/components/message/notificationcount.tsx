import React = require('react');

interface NotificationCountProps extends PropsBase {
    unReadMessageCount: number;
}

/**
 * This is the count displays in red round in the Inbox Tab header and against QIG Name
 * @param props
 */
const messageTab: React.StatelessComponent<NotificationCountProps> = (props: NotificationCountProps) => {
    if (props.unReadMessageCount > 0) {
        return (
            <span className='notification-count notification circle' id = {'unread-' + props.id} >
                {props.unReadMessageCount}
            </span>
        );
    } else {
        return null;
    }
};

export = messageTab;