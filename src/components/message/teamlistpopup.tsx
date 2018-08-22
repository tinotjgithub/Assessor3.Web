import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import GenericButton = require('../utility/genericbutton');
import messageStore = require('../../stores/message/messagestore');
import MessageBase = require('./messagebase');
let classNames = require('classnames');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import TeamListTreeview = require('./teamlisttreeview');
import teamReturn = require('../../stores/message/typings/teamreturn');
import htmlUtilities = require('../../utility/generic/htmlutilities');

interface Props extends PropsBase, LocaleSelectionBase {
    isShowTeamListPopup: boolean;
}

interface State {
    renderedOn?: number;
    teamListScrollHeight?: number;
}

/**
 * TeamListPopup section contain team list
 * @param props
 * @param state
 */
class TeamListPopup extends pureRenderComponent<Props, State> {

    private isShowAddressPopup: boolean = false;
    private teamList: teamReturn;
    private isToTeamChecked: boolean = false;
    private prevPageY: number = 0;
    private allowUp: boolean = false;
    private allowDown: boolean = false;
    private teamListRef: HTMLDivElement;

    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0,
        };

        this.isShowAddressPopup = false;
        if (messageStore.instance.teamDetails && messageStore.instance.teamDetails.team.subordinates) {
            this.isShowAddressPopup = messageStore.instance.teamDetails.team.subordinates.length > 0 ? true : false;
        }

        this.teamList = messageStore.instance.teamDetails;
        this.isToTeamChecked = false;
        if (this.teamList) {
            this.isToTeamChecked = this.teamList.team.toTeam;
        }
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        this.teamList = messageStore.instance.teamDetails;
        let toTeamListPopup = this.teamList ? (
            <div>
                <div className={classNames('popup small msg-address-list-popup in-page-popout',
                    this.isShowAddressPopup ? 'popup-overlay open' : 'popup-overlay close') }
                    id='addressListPopUp' role='dialog' aria-describedby='addressList'>
                    <div className='popup-wrap'>
                        <div className='popup-content' id='popup1Desc' ref={(ele) => { this.teamListRef = ele; }}>
                            <div className='tree-view'>
                                <ul role='tree' id='addressList' onScroll={this.onScroll}>
                                    <li className='node highlighted' role='treeitem' aria-expanded='false' id = 'id_entire_team'>
                                        <input type='checkbox'
                                            className='text-middle checkbox'
                                            id='item1' checked={this.isToTeamChecked}
                                            onChange ={this.entireTeamClick} />
                                        <label htmlFor='item1' id = 'id_entire_team_label'>
                                            {localeStore.instance.TranslateText
                                                ('messaging.compose-message.recipient-selector.entire-team')}
                                        </label>
                                    </li>
                                    <li className='node expanded' role='treeitem' aria-expanded='true'>
                                        <input type='checkbox' className='text-middle checkbox'
                                            id='item2'
                                            checked={this.teamList && this.teamList.team.parent ?
                                                this.teamList.team.parent.isChecked : false}/>
                                        {this.teamList && this.teamList.team.parent ?
                                            <label htmlFor='item2'
                                                onClick={this.updateTeamListStatus.bind(
                                                    this,
                                                    this.teamList.team.parent.examinerRoleId,
                                                    false) }>
                                                {this.teamList.team.parent.fullName}
                                            </label> : null
                                        }
                                        <ul role='group' id ={this.props.id + '_TeamList'}>
                                            <li className='node expanded'
                                                role='treeitem'
                                                aria-expanded='true'
                                                id={'li_' + this.teamList.team.examinerRoleId}>
                                                <span className='sprite-icon user-icon-medium tree-icon'></span>
                                                <label className='text-middle' id='current_login_user'>
                                                    {this.teamList.team.fullName}
                                                </label>
                                                <TeamListTreeview id={'teamList'} key={'teamList_key'}
                                                    addressList ={this.teamList.team.subordinates}
                                                    renderedOn = {this.state.renderedOn} />
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='popup-footer text-right'>
                            <GenericButton
                                id={ 'button-rounded-close-button' }
                                key={'key_button rounded close-button' }
                                className={'button rounded close-button'}
                                title={localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.cancel-button') }
                                content={localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.cancel-button') }
                                disabled={false}
                                onClick={this.cancelTeamSelection}/>
                            <GenericButton
                                id={ 'button-primary-rounded-button' }
                                key={'key_button primary rounded-button' }
                                className={'button primary rounded'}
                                title={localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.ok-button') }
                                content={localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.ok-button') }
                                disabled={false}
                                onClick={this.saveSelectedTeamList}/>
                        </div>
                    </div>
                </div>
                </div>
        ) : null;
        return (
            toTeamListPopup
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {

        /* these events are used to implement custom 
           scrolling logic to handle the elastic scroll behavior of ipad */
        if (this.teamListRef && (htmlUtilities.isIPadDevice)) {
            this.teamListRef.addEventListener('touchstart', this.onTouchStart);
            this.teamListRef.addEventListener('touchmove', this.onTouchMove);
            this.teamListRef.addEventListener('touchend', this.onTouchEnd);
        }

        messageStore.instance.addListener(messageStore.MessageStore.TEAM_LIST_UPDATED, this.teamListUpdated);
    }

    /**
     * event handler for touch start
     */
    private onTouchStart = (event: any) => {

        this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
        let content = (this.teamListRef as HTMLElement);
        this.allowUp = (content.scrollTop > 0);
        this.allowDown = (content.scrollTop <= content.scrollHeight - content.clientHeight);
    };

    /**
     * event handler for touch move
     */
    private onTouchMove = (event: any) => {

        setTimeout(() => {
        event.preventDefault();
        let content = (this.teamListRef as HTMLElement);
        let pageY = event.changedTouches[0].pageY;
        var up = (pageY > this.prevPageY);
        var down = (pageY < this.prevPageY);
        let diff = Math.abs(this.prevPageY - event.pageY);

        this.prevPageY = event.pageY;

        if ((up && this.allowUp)) {
            content.scrollTop = (content.scrollTop - diff);
        } else if (down && this.allowDown) {
            content.scrollTop = (content.scrollTop + diff);
        }
        }, 0);
    };

    /**
     * event handler for touch end
     */
    private onTouchEnd = (event: any) => {
        this.prevPageY = 0;
    };

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.TEAM_LIST_UPDATED, this.teamListUpdated);
        this.teamListRef.removeEventListener('touchstart', this.onTouchStart);
        this.teamListRef.removeEventListener('touchmove', this.onTouchMove);
        this.teamListRef.removeEventListener('touchend', this.onTouchEnd);
    }

    /**
     * componentWillReceiveProps
     * @param nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        this.isShowAddressPopup = false;
        if (messageStore.instance.teamDetails && messageStore.instance.teamDetails.team.subordinates) {
            this.isShowAddressPopup = messageStore.instance.teamDetails.team.subordinates.length > 0 ? true : false;
        }
    }

    /**
     * Method to cancel team selection.
     */
    private cancelTeamSelection = () => {
        messagingActionCreator.updateSelectedTeamList(false);
    };

    /**
     * Method to save selected team list in the message store.
     */
    private saveSelectedTeamList = () => {
        messagingActionCreator.updateSelectedTeamList(true);
    };

    /**
     * Method for handling entire team click.
     */
    private entireTeamClick = (): void => {
        messagingActionCreator.entireTeamChecked(!this.teamList.team.toTeam);
    };

    /**
     * Method for update team list.
     */
    protected teamListUpdated = (isToTeamClick: boolean, isExpand: boolean): void => {
    // avoid EntireTeam's checked-status change while clicking Expand/Collapse button
        if (isExpand === undefined || !isExpand) {
            this.isToTeamChecked = isToTeamClick && messageStore.instance.teamDetails.team.toTeam ? true : false;
        }
        this.teamList = messageStore.instance.teamDetails;
        this.setState({ renderedOn: Date.now() });
    };

    /*
     * event handler for team list panel scroll.
     */
    private onScroll = () => {
        this.setState({
            renderedOn: this.state.renderedOn,
            teamListScrollHeight: this.getTeamListScrollHeight()
        });
    };

    /**
     * returns the team list scroll height
     */
    private getTeamListScrollHeight(): number {
        return (this.teamListRef) ? (this.teamListRef.clientHeight + this.teamListRef.scrollTop) : undefined;
    }

    /**
     * Clicking on check/uncheck of superviser
     */
    private updateTeamListStatus = (uniqueId: number, isExpand: boolean) => {
        messagingActionCreator.updateTeamListStatus(uniqueId, isExpand);
    };
}

export = TeamListPopup;