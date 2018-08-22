import React = require('react');
import MessagePriorityItem = require('./messagepriorityitem');

/**
 * Message Priority Section holds the priority Indicator
 * @param props
 */
const messagePrioritySection:
    React.StatelessComponent<{ itemId: number, priority: string }> = (props: { itemId: number, priority: string }) => {
    return (
        <div id={props.itemId + '-item-icon'} className='msg-meta-icons'>
            <MessagePriorityItem priority= {props.priority} />
        </div>
    );
    };

export = messagePrioritySection;