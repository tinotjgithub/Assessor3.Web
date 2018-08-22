import React = require('react');
import enums = require('../../../utility/enums');
import messageHelper = require('../../../utility/message/messagehelper');
import localeStore = require('../../../../stores/locale/localestore');
import Immutable = require('immutable');
let classNames = require('classnames');
import MessagePrioritySection = require('./messageprioritysection');
import ExceptionStatusIndicator = require('./exceptionstatusindicator');


interface MesageorExceptionItemProps extends PropsBase, LocaleSelectionBase {
    itemId: number;
    selectedItemId: number;
    senderOrItem: string;
    timeToDisplay: string;
    subjectOrType: number | string;
    priorityOrStatus?: number | string;
    isUnreadOrUnactioned: boolean;
    isMessageItem: boolean;
    onMessageOrExceptionItemSelected: Function;
}


/**
 * List Item component to display the linked message or exception
 * @param props
 */
const messageOrExceptionItem: React.StatelessComponent<MesageorExceptionItemProps> = (props: MesageorExceptionItemProps) => {
    let renderStatus;

    if (props.isMessageItem) {
        renderStatus = (<MessagePrioritySection itemId = {props.itemId} priority= {props.priorityOrStatus.toString() } />);
    } else {

        renderStatus = (<ExceptionStatusIndicator exceptionTypeId = {+props.subjectOrType}  status={+props.priorityOrStatus} />);
    }


    const onClick = () => {
        props.onMessageOrExceptionItemSelected(props.isMessageItem, props.itemId);
    };

    let idPrefeix = props.isMessageItem ? props.id : props.itemId;

    return (
        <li id={ idPrefeix + '-item'} onClick={onClick}
            className={classNames('list-item',
                { 'resolved': !props.isMessageItem && props.isUnreadOrUnactioned },
                { 'unread': props.isUnreadOrUnactioned }, { 'selected': props.selectedItemId === props.itemId })}>
            <div id={props.id + '-item-holder'} className='list-item-holder'>
                <div className='list-item-row small-text clearfix'>
                    <div id={props.id + '-item-text'} className='list-item-data'>{props.senderOrItem}</div>
                    <div id={props.id + '-item-time'} className='status-date list-item-data dim-text'>
                        { messageHelper.getDateToDisplay(props.timeToDisplay) }
                    </div>
                </div><div className='list-item-row clearfix'>
                    <div className='exception-title list-item-data'>
                        <span id={props.id + '-item-content'} className='list-item-content'>
                            { props.isMessageItem ? props.subjectOrType : localeStore.
                                instance.
                                TranslateText('generic.exception-types.' + props.subjectOrType + '.name') }</span>
                    </div>
                    {renderStatus}
                </div>
            </div>
        </li>
    );

};

export = messageOrExceptionItem;