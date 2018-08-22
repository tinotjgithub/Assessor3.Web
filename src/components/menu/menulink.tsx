import React = require('react');
import localeStore = require('../../stores/locale/localestore');
import historyItem = require('../../utility/breadcrumb/historyItem');
import historyItemHelper = require('../../utility/breadcrumb/historyitemhelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');

interface MenuLinkProps extends LocaleSelectionBase, PropsBase {
    isVisible?: boolean;
    onMenuLinkClick?: Function;
    onMyMarkingClick?: Function;
    onTeamManagementClick?: Function;
    onStandardisationSetupClick?: Function;
    menuString?: string;
    menuLinkName?: string;
    isRecentHistory?: boolean;
    recentItem?: historyItem;
}

/**
 * Returns menu link
 * @param props
 */
const menuLink: React.StatelessComponent<MenuLinkProps> = (props: MenuLinkProps) => {
    if (props.isRecentHistory) {
        let teamManagementLink = props.recentItem.team ? (<a href='javascript:void(0)'
            className='small-text'
            onClick={() => { props.onTeamManagementClick(props.recentItem, null, null, null); }}
            id={'menuLink_TeamManagement_' + props.recentItem.qigId}>
            {localeStore.instance.TranslateText('generic.navigation-menu.team-management')}
        </a>) : props.recentItem.isTeamManagementEnabled ? (<a href='javascript:void(0)'
            className='small-text'
            onClick={() => {
                props.onTeamManagementClick(
                    null,
                    props.recentItem.qigId,
                    props.recentItem.questionPaperPartId,
                    props.recentItem.examinerRoleId);
            }}
            id={'menuLink_TeamManagement_' + props.recentItem.qigId}>
            {localeStore.instance.TranslateText('generic.navigation-menu.team-management')}
        </a>) : null;
        let myMarkingLink = props.recentItem.myMarking ? (<a href='javascript:void(0)'
            className='small-text'
            onClick={() => { props.onMyMarkingClick(props.recentItem, null, null); }}
            id={'menuLink_' + props.recentItem.qigId}>
            {localeStore.instance.TranslateText('generic.navigation-menu.my-marking')}
        </a>) : props.recentItem.isMarkingEnabled ? (<a href='javascript:void(0)'
            className='small-text'
            onClick={() => {
                props.onMyMarkingClick(
                    null,
                    props.recentItem.qigId,
                    props.recentItem.questionPaperPartId);
            }}
            id={'menuLink_' + props.recentItem.qigId}>
            {localeStore.instance.TranslateText('generic.navigation-menu.my-marking')}
        </a>) : null;
        let standardisationSetupLink = props.recentItem.standardisationSetup ? (<a href='javascript:void(0)'
            className='small-text'
            onClick={() => { props.onStandardisationSetupClick(props.recentItem, null, null); }}
            id={'menuLink_StandardisationSetup_' + props.recentItem.qigId}>
            {historyItemHelper.getStandardisationSetupLinkText(props.recentItem.qigId)}
        </a>) : props.recentItem.isStandardisationSetupEnabled ? (<a href='javascript:void(0)'
            className='small-text'
                onClick={() => {
                    props.onStandardisationSetupClick(
                        null,
                        props.recentItem.qigId);
                }}
            id={'menuLink_StandardisationSetup_' + props.recentItem.qigId}>
            {historyItemHelper.getStandardisationSetupLinkText(props.recentItem.qigId)}
        </a>) : null;
        return (<li className='menu-items' id={'menuItem_' + props.recentItem.qigId}>
            <div className='recent-links-quig'>{props.menuString}</div>
            <div className='recent-links'>
                {myMarkingLink}
                {teamManagementLink}
                {standardisationSetupLink}
            </div>
        </li>);
    } else if (props.isVisible) {
        return (<li className='menu-items'>
            <a id={props.id} key={props.id} href='javascript:void(0)' onClick={() => { props.onMenuLinkClick(); }}>{props.menuLinkName}</a>
        </li>);
    } else {
        return null;
    }
};

export = menuLink;