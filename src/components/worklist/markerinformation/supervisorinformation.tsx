/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import stringHelper = require('../../../utility/generic/stringhelper');
import SendMessageLink = require('./sendmessagelink');
let classNames = require('classnames');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    supervisorName: string;
    isSupervisorOnline: boolean;
    supervisorLogoutDiffInMinutes: number;
    showMessagePopup: Function;
    isTeamManagementMode: boolean;
    showMessageLink: boolean;
}

/**
 * React class for supervisor information.
 */
class SupervisorInformation extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for supervisor information.
     */
    public render() {
        if (this.props.isTeamManagementMode || this.props.supervisorName === '') {
            return (<div></div>);
        }
        let sendMessageLink = this.props.showMessageLink ?
            (<SendMessageLink onClick={this.props.showMessagePopup} id='sendMsg' key='sendMsg' />) : null;
        return (<div id='supervisor_info_panel' className='supervisor-info relative clearfix padding-bottom-30'>
            <div className='user-photo-holder user-medium-icon sprite-icon'>
                <span className={classNames('online-status-bubble', { 'online': this.props.isSupervisorOnline })} />
            </div>
            <div className='hierarchy-line' />
            <div className='user-details-holder'>
                <div className='online-status small-text'>{this.getSupervisorOnlineStatusText()}</div>
                <div id='supervisor_name' className='user-name large-text'>{this.props.supervisorName}</div>
                <div id='supervisor_designation' className='designation small-text'>
                    {localeStore.instance.TranslateText('marking.worklist.left-panel.my-supervisor')}
                </div>
                {sendMessageLink}
            </div>
        </div>);
    }

    /**
     * This method will return the localised text for supervisor online status.
     */
    private getSupervisorOnlineStatusText(): string {
        let offlineHours = Math.floor(this.props.supervisorLogoutDiffInMinutes / 60);
        let offlineDays: number = 0;
        if (this.props.isSupervisorOnline) {
            return localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-online');
        } else {

            if (this.props.supervisorLogoutDiffInMinutes === -1) {
                return localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline');
            } else if (offlineHours === 0) {
                return localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-less-than-1-hour');
            } else if (offlineHours === 1) {
                return stringHelper.format(
                    localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-hour'),
                    [String(offlineHours)]);
            } else if (offlineHours > 1 && offlineHours < 24) {
                return stringHelper.format(
                    localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-hours'),
                    [String(offlineHours)]);
            } else if (offlineHours < 48) {
                offlineDays = Math.floor(offlineHours / 24);
                return stringHelper.format(
                    localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-day'),
                    [String(offlineDays)]);
            } else if (offlineHours >= 48) {
                offlineDays = Math.floor(offlineHours / 24);
                return stringHelper.format(
                    localeStore.instance.TranslateText('marking.worklist.left-panel.supervisor-offline-days'),
                    [String(offlineDays)]);
            }
        }

    }
}

export = SupervisorInformation;