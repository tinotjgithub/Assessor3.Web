import React = require('react');
import ReactDom = require('react-dom');
import enums = require('../utility/enums');
import classNames = require('classnames');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import pureRenderComponent = require('../base/purerendercomponent');
import MultiQigItem = require('./multiqigitem');
import localeStore = require('../../stores/locale/localestore');
import responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
import qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import Promise = require('es6-promise');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
import MultiQigNavigationConfirmationDialog = require('./multiqignavigationconfirmationdialog');
import applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
import domManager = require('../../utility/generic/domhelper');
interface Props extends PropsBase, LocaleSelectionBase {
    multiQigItemList: Immutable.List<qigDetails>;
}

interface State {
    renderedOn?: number;
    isBusy?: boolean;
}

/**
 * React wrapper component for multi qig drop down
 */
class MultiQigDropDown extends pureRenderComponent<Props, State> {

    private isShowingQigSelectionPopup: boolean;
    private selectedQig: qigDetails;
    private storageAdapterHelper = new storageAdapterHelper();
    private doShowMultiQigDropDown: boolean;
    protected _boundHandleOnClick: EventListenerObject = null;
    protected isSelectedItemClicked: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0,
            isBusy: false
        };
        this.isShowingQigSelectionPopup = false;
        this.doShowMultiQigDropDown = undefined;
        this.selectedQig = undefined;
        this._boundHandleOnClick = this.handleOnClick.bind(this);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let qigName: string = teamManagementStore.instance.multiQigSelectedDetail ?
            teamManagementStore.instance.multiQigSelectedDetail.qigName : localeStore.instance.
                TranslateText('team-management.multiqig-selecteditem-default-text');
        let multiQigItems: any;
        if (this.props.multiQigItemList) {
            let itemCount: number = 0;
            let that = this;
            multiQigItems = this.props.multiQigItemList.map(function (qigDetail: qigDetails) {
                itemCount++;
                return (
                    <MultiQigItem
                        id={'multiQig_Item_' + itemCount}
                        key={'multiQig_Item_Key_' + itemCount}
                        multiQigData={qigDetail}
                        onQigSelected={that.onClickMultiQigDropDown} />
                );
            });
        }

        let showPopUpOnMultiQigSelection = this.isShowingQigSelectionPopup ?
            (<MultiQigNavigationConfirmationDialog
                id='multiQigNavigationConfirmationDialog'
                key='multiQigNavigationConfirmationDialog-key'
                content={localeStore.instance.TranslateText('team-management.multi-qig.help-examiner-multi-qig-popup-content')}
                header={localeStore.instance.TranslateText('team-management.multi-qig.help-examiner-multi-qig-popup-header')}
                noButtonText={localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.no-button')}
                yesButtonText={localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.yes-button')}
                onYesClick={this.handlePopUpAction.bind(this, enums.PopUpActionType.Yes)}
                onNoClick={this.handlePopUpAction.bind(this, enums.PopUpActionType.No)}
            />) : null;

        let busyIndicator = (
            <BusyIndicator
                id='busyIndicator'
                key='busyIndicator'
                isBusy={this.state.isBusy}
                busyIndicatorInvoker={busyIndicatorStore.instance.getBusyIndicatorInvoker}
            />);

        let className: string = classNames(
            'dropdown-wrap m-qig-comp',
            { 'open': this.doShowMultiQigDropDown === true },
            { 'close': this.doShowMultiQigDropDown === false }
        );
        let tableStyle: React.CSSProperties = {};
        tableStyle = {
            width: '100%'
        };
        return (
            <div className='col-wrap grid-nav padding-bottom-15'>
                {showPopUpOnMultiQigSelection}
                {busyIndicator}
                <div className='col-3-of-12'>
                    <div
                        className={className}
                        id='multiqig-dropdown-helpexaminer-container'>
                        <a href='#' className='menu-button' onClick={this.toggleQigSelectionPopup} id='multiqig-dropdown-helpexaminer'>
                            <span className='markby-txt' id='multiqig-dropdown-default-item'>{qigName} </span>
                            <span className='sprite-icon menu-arrow-icon'></span></a>
                        <div className='menu'>
                            <table cellSpacing='0' cellPadding='0' style={tableStyle} className='grid-view-list'>
                                <thead>
                                    <tr className='row' id='multiqig-dropdown-item-header'>
                                        <td><div className='item'>{localeStore.instance.
                                            TranslateText('team-management.multiqig-name-header-text')}</div>
                                        </td>
                                        <td><div className='item'>{localeStore.instance.
                                            TranslateText('team-management.multiqig-examiner-lockcount-header-text')}</div></td>
                                        <td><div className='item'>{localeStore.instance.
                                            TranslateText('team-management.multiqig-examiner-stuckcount-header-text')}</div></td>
                                    </tr>
                                </thead>
                                <tbody id='multiqig-dropdown-item-content'>
                                    {multiQigItems}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * What happens when the component mounts
     */
    public componentDidMount() {
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        teamManagementStore.instance.addListener(
            teamManagementStore.TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN, this.onQigSelectedFromMuliQigDropDown);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.onHelpExaminersDataReceived);
        window.addEventListener('click', this._boundHandleOnClick);
        window.addEventListener('touchend', this._boundHandleOnClick);
    }

    /**
     * What happens when the component unmounts
     */
    public componentWillUnmount() {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQIGSelected);
        teamManagementStore.instance.removeListener(
            teamManagementStore.TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN, this.onQigSelectedFromMuliQigDropDown);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED,
            this.onHelpExaminersDataReceived);
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
    }

    /*
     * Invoked when the data received for Help Examiners tab.
     */
    private onHelpExaminersDataReceived = (isFromHistory: boolean = false) => {
        if (isFromHistory) {
            return;
        }
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
        this.setState({
            renderedOn: Date.now(),
            isBusy: false
        });
    };


    private onQigSelectedFromMuliQigDropDown = (): void => {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingQigDetailsFromMultiQig);

        this.storageAdapterHelper.clearTeamDataCache(
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        this.storageAdapterHelper.clearTeamDataCache(
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true);

        qigActionCreator.getQIGSelectorData(
            teamManagementStore.instance.multiQigSelectedDetail.qigId,
            true,
            false,
            false,
            false,
            true,
            true);
        this.doShowMultiQigDropDown = false;
        this.isShowingQigSelectionPopup = false;
        this.setState({
            renderedOn: Date.now(),
            isBusy: true
        });
    };

    /**
     * Method to be invoked when a QIG is selected/opened from the QIG Selector list
     */
    private onQIGSelected = (isDataFromSearch: boolean = false,
        isDataFromHistory: boolean = false,
        isFromLocksInPopUp: boolean = false): void => {
        if (!isFromLocksInPopUp && !isDataFromSearch && !isDataFromHistory) {
            // if the qig in user option is withdrawn then select the entire qig data.
            if (qigStore.instance.selectedQIGForMarkerOperation) {

                let markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, true);

                let openTeamManagementPromise = teamManagementActionCreator.openTeamManagement(
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    false,
                    false,
                    true);

                let that = this;
                Promise.Promise.all(
                    [
                        markSchemeGroupCCPromise,
                        openTeamManagementPromise
                    ]).
                    then(function (result: any) {
                        teamManagementActionCreator.GetHelpExminersData(
                            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                            false);
                    });
            }
        }
    };

    /**
     * Method for handle Qig selection.
     */
    private onClickMultiQigDropDown = (qigDetail: qigDetails): void => {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        this.selectedQig = qigDetail;
        if (qigDetail.examinerLockCount <= 0 && qigDetail.examinerStuckCount <= 0) {
            this.isShowingQigSelectionPopup = true;
            this.setState({
                renderedOn: Date.now()
            });
        } else {
            teamManagementActionCreator.qigSelectedFromMultiQigDropDown(qigDetail);
        }
    };

    /**
     * Method for handle toggle action in QIg selection.
     */
    private toggleQigSelectionPopup = (): void => {
        this.isSelectedItemClicked = true;
        this.doShowMultiQigDropDown = this.doShowMultiQigDropDown === undefined ? true :
            !this.doShowMultiQigDropDown;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * handle different popup actions
     */
    private handlePopUpAction = (popUpActionType: enums.PopUpActionType): void => {
        switch (popUpActionType) {
            case enums.PopUpActionType.Yes:
                teamManagementActionCreator.qigSelectedFromMultiQigDropDown(this.selectedQig);
                break;
            case enums.PopUpActionType.No:
                this.doShowMultiQigDropDown = !this.doShowMultiQigDropDown;
                this.isShowingQigSelectionPopup = false;
                this.setState({
                    renderedOn: Date.now()
                });
                break;
        }
    };

    /**
     * Handle click events on the window and collapse multi qig selection dropdown
     * @param {any} source - The source element
     */
    protected handleOnClick = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the multi qig list item. if not close the open window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any)
            { return el.id === 'multiqig-dropdown-helpexaminer-container'; }) == null) {
            if (!this.isSelectedItemClicked &&
                (this.doShowMultiQigDropDown !== undefined && this.doShowMultiQigDropDown)) {
                // collapse the multi qig dropdown
                this.doShowMultiQigDropDown = false;
                this.setState({ renderedOn: Date.now() });
            }
        } else { this.isSelectedItemClicked = false; }
    };
}

export = MultiQigDropDown;