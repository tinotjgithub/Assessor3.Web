import React = require('react');
import enums = require('../../../utility/enums');
let classNames = require('classnames');

/**
 * Priority Indicator for Message
 * @param props
 */
const messagePriorityItem: React.StatelessComponent<{ priority: string }> = (props: { priority: string }) => {
    if (props.priority !== enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard)) {
        return (
            <div className='msg-importance'>
                <span className={classNames('sprite-icon black',
                    {
                        'exclamtion-icon-red':
                        props.priority === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Important)
                    },
                    {
                        'star-icon-red':
                        props.priority === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory)
                    }) }>
                </span>
            </div>
        );
    } else {
        return null;
    }
};

export = messagePriorityItem;