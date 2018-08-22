import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import localeStore = require('../../stores/locale/localestore');
import TeamLink = require('./typings/teamlink');
import enums = require('../utility/enums');

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of TeamManagement Collapsible Panel
 */
interface TeamCollapsibleProps extends PropsBase, LocaleSelectionBase {
    availableTeamLinks: Array<TeamLink>;
    renderedOn?: number;
    onLinkClick: Function;
}

/**
 * Team Management Collapsible panel which contains the details of the links.
 * When Help Examiners link come the visibility can be checked though the available team links array
 * @param props
 */
const teamManagementCollapsiblePanel: React.StatelessComponent<TeamCollapsibleProps> = (props: TeamCollapsibleProps) => {

    /* tslint:disable:variable-name */
    /**
     * The stateless compoenent for the sublink to show the count
     * @param props
     */
    const SubLink: React.StatelessComponent<
        {
            teamManamentTabItem: enums.TeamManagement,
            sublinks: Array<TeamSubLink>,
            renderedOn?: number
        }>
        = (props:
            {
                teamManamentTabItem: enums.TeamManagement,
                sublinks: Array<TeamSubLink>,
                renderedOn?: number
            }) => {
            var items = props.sublinks.map((x) => {
                return (<li key={'subitem-key' + x.linkName}><span className='sub-panel-link'>
                    <span className='menu-text small-text' id={'sub_link_' + enums.TeamSubLink[x.linkName]}>
                        {getSubLinkText(x.Count, x.linkName)}
                    </span>
                </span></li>);
            });
            if (items.length > 0) {
                return (<ul className='sub-panel  panel-content'>{items} </ul>);
            } else {
                return null;
            }
        };

    /**  
     * Get the Side Panel Element
     * @param props
     */
    const Panel: React.StatelessComponent<
        {
            teamManagementTab: enums.TeamManagement,
            sublinks: Array<TeamSubLink>,
            renderedOn?: number,
            onLinkClick: Function
        }>
        = (props:
            {
                teamManagementTab: enums.TeamManagement,
                sublinks: Array<TeamSubLink>,
                renderedOn?: number,
                onLinkClick: Function
            }) => {

            return (
                <li id={getPanelClassName(props.teamManagementTab) + '_id'}
                    key={'collapsiblepanel-key' + props.teamManagementTab}
                    className={'panel ' + getPanelClassName(props.teamManagementTab) +
                        ' hand ' + getOpenCloseState(props.teamManagementTab)}
                    onClick={() => { props.onLinkClick(props.teamManagementTab); }} >
                    <a href='javascript:void(0);' className='left-menu-link panel-link' id={getPanelId(props.teamManagementTab)}>
                        <span className='menu-text large-text'>{getTextToDisplay(props.teamManagementTab)}</span>
                    </a>
                    <SubLink key={'sublink-key' + props.teamManagementTab} renderedOn={props.renderedOn}
                        teamManamentTabItem={props.teamManagementTab} sublinks={props.sublinks} />
                </li>
            );
        };

    /**
     * Get the Panel Holder with panels
     * @param props
     */
    const PanelItems: React.StatelessComponent<TeamCollapsibleProps> = (props: TeamCollapsibleProps) => {
        var items: JSX.Element[];
        if (props.availableTeamLinks !== undefined && props.availableTeamLinks !== null) {

            items = props.availableTeamLinks.map((x) => {
                if (x.isVisible) {
                    return <Panel key={'panel-key' + x.linkName}
                        renderedOn={props.renderedOn}
                        teamManagementTab={x.linkName}
                        onLinkClick={props.onLinkClick}
                        sublinks={x.subLinks} />;
                }
            });
        } else {
            items = null;
        }
        return <ul className='left-menu panel-group'> {items} </ul>;
    };

    /**
     * Get the panel.
     */
    return (
        <div className='column-left'>
            <div className='column-left-inner'>
                <div className='left-menu-holder'>
                    <PanelItems
                        id='panel-items'
                        key='panel-items-key'
                        renderedOn={props.renderedOn}
                        onLinkClick={props.onLinkClick}
                        availableTeamLinks={props.availableTeamLinks} />
                </div>
            </div>
        </div>
    );

    /**
     * Get the open close state for individual links
     * @param teamLinkType
     */
    function getOpenCloseState(teamLinkType: enums.TeamManagement): string {
        return props.availableTeamLinks.filter((x: TeamLink) => x.linkName === teamLinkType)[0].isSelected ? 'open' : 'close';
    }

    /**
     * Get the class for individual links
     * @param teamLinkType
     */
    function getPanelClassName(teamLinkType: enums.TeamManagement): string {
        let className: string = '';
        switch (teamLinkType) {
            case enums.TeamManagement.MyTeam:
                className = 'my-team-panel';
                break;
            case enums.TeamManagement.HelpExaminers:
                className = 'help-examiners-panel';
                break;
            case enums.TeamManagement.Exceptions:
                className = 'team-exception-panel';
                break;
        }
        return className;
    }

    /**
     * Get the text to be displayed for the sublinks
     * @param {number} sublinkcount
     * @param {enums.TeamSubLink} sublinkType
     * @returns
     */
    function getSubLinkText(sublinkcount: number, sublinkType: enums.TeamSubLink): string {
        let text: string = '';
        switch (sublinkType) {
            // If only 1 exception then sub-heading shall be displayed as
            //‘1 open exception’ and if 0 exceptions then ‘0 open exceptions
            case enums.TeamSubLink.Exceptions:
                text = sublinkcount + ' ' + localeStore.instance.TranslateText(sublinkcount === 1 ?
                    'team-management.left-panel.sublink-' + enums.TeamSubLink[sublinkType] :
                    'team-management.left-panel.sublink-multi-' + enums.TeamSubLink[sublinkType]);
                break;
            case enums.TeamSubLink.HelpExaminersLocked:
                text = sublinkcount + ' ' + localeStore.instance.TranslateText(
                    'team-management.left-panel.sublink-' + enums.TeamSubLink[sublinkType]
                );
                break;
            case enums.TeamSubLink.Stuck:
                text = sublinkcount + ' ' + localeStore.instance.TranslateText(
                    'team-management.left-panel.sublink-' + enums.TeamSubLink[sublinkType]
                );
                break;
            default:
                text = sublinkcount + ' ' + enums.TeamSubLink[sublinkType];
                break;
        }
        return text;
    }

    /**
     * Get the class for individual links
     * @param teamLinkType
     */
    function getPanelId(teamLinkType: enums.TeamManagement): string {
        let idString: string = '';
        switch (teamLinkType) {
            case enums.TeamManagement.MyTeam:
                idString = 'my-team-tab';
                break;
            case enums.TeamManagement.HelpExaminers:
                idString = 'help-examiners-tab';
                break;
            case enums.TeamManagement.Exceptions:
                idString = 'exception-tab';
                break;
        }
        return idString;
    }

    /**
     * get the Display Text
     * @param teamLinkType
     */
    function getTextToDisplay(teamLinkType: enums.TeamManagement): string {
        let text: string = '';
        switch (teamLinkType) {
            case enums.TeamManagement.MyTeam:
                text = 'my-team';
                break;
            case enums.TeamManagement.HelpExaminers:
                text = 'help-examiners';
                break;
            case enums.TeamManagement.Exceptions:
                text = 'exceptions';
                break;
        }

        return localeStore.instance.TranslateText('team-management.left-panel.' + text);
    }
};

export = teamManagementCollapsiblePanel;