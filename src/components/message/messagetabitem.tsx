// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import NotificationCount = require('./notificationcount');
let classNames = require('classnames');
import enums = require('../utility/enums');

interface TabProps {
    unReadMessageCount: number;
    onTabSelected: Function;
    isSelected: boolean;
    messageFolderType: enums.MessageFolderType;
}

const messageTabItem = (props: TabProps) => {
    let folderType = enums.getEnumString(enums.MessageFolderType, props.messageFolderType).toLowerCase();

    /**
     * Handles the change event of the option button.
     * @param event
     */
    const handleTabClick = (event: any) => {
        props.onTabSelected(props.messageFolderType);
    };

    return (
        <li role='tab' aria-selected={props.isSelected}
            id={folderType + '-msg-tab'}
            className={classNames(folderType + '-msg-tab', { 'active': props.isSelected }) }>
            <a id={folderType + '-tab'} href='javascript: void(0);' data-tab-nav='msgTab1' aria-controls='msgTab1'
                onClick= {handleTabClick}>
                <span id={folderType + '-text'}>
                    {localeStore.instance.TranslateText('messaging.message-lists.top-panel.' + folderType + '-tab') }</span>
                <NotificationCount
                    unReadMessageCount = {props.unReadMessageCount}
                    id = {folderType + '-tab'}
                    key = {folderType + '-tab'}>
                </NotificationCount>
            </a>
        </li>
    );
};
export = messageTabItem;