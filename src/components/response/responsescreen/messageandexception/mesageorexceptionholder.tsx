import React = require('react');
import messageHelper = require('../../../utility/message/messagehelper');
import localeStore = require('../../../../stores/locale/localestore');
import Immutable = require('immutable');
import MessageOrExceptionItem = require('./messageorexceptionitem');
import exceptionHelper = require('../../../utility/exception/exceptionhelper');
let classNames = require('classnames');
import responseStore = require('../../../../stores/response/responsestore');
import enums = require('../../../utility/enums');
import markingOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');

interface MesageOrExceptionHolderProps extends PropsBase, LocaleSelectionBase {
    isMessageHolder: boolean;
    selectedItemId?: number;
    messages: Immutable.List<Message | ExceptionDetails>;
    onNewMessageOrExceptionClick: Function;
    onMessageOrExceptionItemSelected: Function;
    isNewMessageButtonHidden: boolean;
    canRaiseException?: boolean;
    onRejectRigClick?: Function;
    doShowExceptionPanel?: boolean;
    doShowRejectThisResponse?: boolean;
}

/**
 * this component is used to Render the message / exceptions items inside the response screen
 * Messages and Exceptions associated with the response should pass to the component and cunstruct the new entity here.
 * Make the changes in the class without affecting both messages and Exception.
 * @param props
 */
const mesageOrExceptionHolder: React.StatelessComponent<MesageOrExceptionHolderProps> = (props: MesageOrExceptionHolderProps) => {
    if (!props.messages && !props.doShowExceptionPanel) {
        return null;
    }

    let isTeamManagement: boolean = markingOperationModeFactory.operationMode.isTeamManagementMode;

    let idPrefix: string;
    let messageOrExceptionLinkedItems: Immutable.List<MessageOrExceptionLinkedItem>;
    let renderHeader;

    if (props.isMessageHolder) {
        idPrefix = 'message-';

        messageOrExceptionLinkedItems = messageHelper.getMessageLinkedItems(props.messages as Immutable.List<Message>);
        renderHeader = (<use xlinkHref='#new-message-icon'></use>);

    } else if (props.messages) {
        idPrefix = 'exception-';
        messageOrExceptionLinkedItems = exceptionHelper.getExceptionLinkedItems(props.messages as Immutable.List<ExceptionDetails>,
                                                                                isTeamManagement);
        renderHeader = props.canRaiseException ? (<use xlinkHref='#new-exception-icon'></use>) :
            (<use xlinkHref='#exception-icon'></use>);
    }

    let toRender: Array<any> = [];
    if (props.messages) {
        messageOrExceptionLinkedItems.map((messageOrExceptionLinkedItem: MessageOrExceptionLinkedItem, index: number) => {
            toRender.push(
                (
                    <MessageOrExceptionItem
                        id = { idPrefix + index }
                        key = { idPrefix + index }
                        selectedItemId = {props.selectedItemId}
                        itemId = {messageOrExceptionLinkedItem.itemId}
                        senderOrItem = {messageOrExceptionLinkedItem.senderOrItem }
                        priorityOrStatus = {messageOrExceptionLinkedItem.priorityOrStatus}
                        subjectOrType = {messageOrExceptionLinkedItem.subjectOrType}
                        onMessageOrExceptionItemSelected = { props.onMessageOrExceptionItemSelected }
                        timeToDisplay = {messageOrExceptionLinkedItem.timeToDisplay}
                        isUnreadOrUnactioned={messageOrExceptionLinkedItem.isUnreadOrUnactioned }
                        isMessageItem={props.isMessageHolder}
                    />
                ));
        });
    }

    // Pass Click to the parent for raising new exception or message
    const onClick = (event: any) => {
        props.onNewMessageOrExceptionClick(props.isMessageHolder);
    };

    // set title text for the panel
    let createNewText = props.isMessageHolder ? messageHelper.getCreateNewMessageText :
        (props.canRaiseException) ? localeStore.instance.TranslateText('marking.response.exception-list-panel.raise-new-exception') :
            localeStore.instance.TranslateText('assessor3.exceptions.title_editable_tab');

    // render reject rig element
    let showRejectRig = props.doShowRejectThisResponse ? (<div id='reject-rig'
        className='list-menu-footer'
        onClick={() => { props.onRejectRigClick(); }}>
        <a href='#'>
            <span className='svg-icon'>
                <svg viewBox='0 0 32 32' className='reject-rig-icon'>
                    <use xlinkHref='#reject-rig-icon'></use>
                </svg>
            </span>
            <span className='rject-repsone-text' id='reject-rig-Text'>
                {localeStore.instance.TranslateText('marking.response.exception-list-panel.reject-rig') }
            </span>
        </a>
    </div>) : null;

    // render exception contents.
    let showMenuContent = props.messages && props.messages.size > 0 ? (<div id={idPrefix + 'contents'} className='list-menu-content'>
        <ul id={idPrefix + 'contents-holder'} className='list-menu-item-holder'>
            {toRender}
        </ul>
    </div>) : null;

    // set the new item header for the panel
    let renderNewItemHeader = (props.isMessageHolder && props.isNewMessageButtonHidden) ||
        (!props.isMessageHolder && !props.canRaiseException) ?
        null : (
            <div id={idPrefix + 'header'} onClick={(props.canRaiseException && !props.isMessageHolder) ||
                props.isMessageHolder ? onClick : null} className='list-menu-header'>
                <a id={idPrefix + 'create-new-item'} className='create-new-list-item' >
                    <span id={idPrefix + 'create-new-icon'} className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='marking-exception-icon'>
                            {renderHeader}
                        </svg>
                    </span>
                    < span id={idPrefix + 'create-new-label'} className='new-message-label' >
                        {createNewText}
                    </span >
                </a >
            </div>);

    return (
        <div className={classNames('tool-option-menu list-menu menu', { 'message-menu': props.isMessageHolder },
            { 'exception-menu': !props.isMessageHolder })}
            id={idPrefix + 'holder'}>
                {renderNewItemHeader}
            {showMenuContent}
            {showRejectRig}
        </div>
    );
};

export = mesageOrExceptionHolder;