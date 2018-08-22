import React = require('react');
import ReactDom = require('react-dom');
import classNames = require('classnames');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import pureRenderComponent = require('../base/purerendercomponent');
import MultiQigLockItem = require('./multiqiglockitem');
import localeStore = require('../../stores/locale/localestore');
import GenericButton = require('../utility/genericbutton');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import GenericCheckbox = require('../utility/genericcheckbox');
import stringHelper = require('../../utility/generic/stringhelper');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import Immutable = require('immutable');
import enums = require('../utility/enums');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');

interface Props extends PropsBase, LocaleSelectionBase {
}

interface State {
    renderedOn?: number;
}

/**
 * React wrapper component for multi qig lock popup
 */
class MultiQigLockPopup extends pureRenderComponent<Props, State> {

    private isShowMultiLockPopup: boolean = false;
    private multiQigLockData: Immutable.List<MultiQigLockExaminer>;
    private selectedExaminerName: string;
    private selectedQigName: string;
    private isLockButtonEnabled: boolean;
    private isSelectedAll: boolean;
    private examinerDrillDownData: ExaminerDrillDownData;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0
        };
        this.isShowMultiLockPopup = false;
        this.isLockButtonEnabled = false;
        this.isSelectedAll = false;
        this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
        let multiQigLockItems: any;
        let multiQigLockPopup: any;
        let itemCount: number = 0;
        let that = this;
        let isMultiLockAvailable: boolean = this.multiQigLockData && this.multiQigLockData.count() > 0;
        if (isMultiLockAvailable) {
            // Sort multi qig lock data in the ascending order of Qig name it is similar to qig selector list.
            this.multiQigLockData = Immutable.List<MultiQigLockExaminer>(sortHelper.
                sort(this.multiQigLockData.toArray(), comparerList.MultiLockListComparer));
            multiQigLockItems = this.multiQigLockData.map(function(item: MultiQigLockExaminer) {
                itemCount++;
                return (
                    <MultiQigLockItem
                        id={'multi-qig-lock-item-' + itemCount}
                        key={'multi-qig-lock-item-key-' + itemCount}
                        multiQigLockData={item} />
                );
            });
        }

        multiQigLockPopup = isMultiLockAvailable ? (<div className={classNames('popup medium popup-overlay qig-lock fixed-hf',
            this.isShowMultiLockPopup ? 'open' : 'close')}
            id='qig-lock' role='dialog' aria-labelledby='popup4Title' aria-describedby='popup4Desc'>
            <div className='popup-wrap'>
                <div className='popup-header'>
                    <h4 id='popup4Title border-right: ;'>{localeStore.instance.
                        TranslateText('team-management.multilock-examiner-header-text')}</h4>
                </div>
                <div className='popup-content' id='popup14Desc'>
                    <p id='multi-qig-lock-selected-examiner'>
                        {this.selectedExaminerName}
                    </p>
                    <p id='multi-qig-lock-help-decription'>
                        {localeStore.instance.
                            TranslateText('team-management.multilock-examiner-help-description')}
                    </p>
                    <GenericCheckbox
                        id='multi-qig-lock-item-default'
                        key='multi-qig-lock-item-default-key'
                        containerClassName='padding-top-20'
                        className='text-middle checkbox'
                        disabled={true}
                        isChecked={true}
                        labelClassName='text-middle'
                        labelContent={this.selectedQigName} />
                    {multiQigLockItems}
                </div>
                <div className='popup-footer text-right padding-top-20'>
                    <GenericCheckbox
                        id='multi-qig-lock-item-select-all'
                        key='multi-qig-lock-item-select-key'
                        containerClassName='shift-left'
                        className='text-middle checkbox'
                        disabled={false}
                        isChecked={this.isSelectedAll}
                        labelClassName='text-middle lock-chk-all'
                        labelContent={localeStore.instance.TranslateText('team-management.multilock-examiner-select-all-text')}
                        onSelectionChange={this.updateMultiQigLockSelection.bind(this, 0, !this.isSelectedAll)} />
                    <div className='shift-right'>
                        <GenericButton
                            id={'button-rounded-cancel-button'}
                            key={'key_button rounded cancel-button'}
                            className={'button rounded close-button'}
                            title={localeStore.instance.TranslateText('team-management.multilock-examiner-cancel-button-text')}
                            content={localeStore.instance.TranslateText('team-management.multilock-examiner-cancel-button-text')}
                            disabled={false}
                            onClick={this.cancelMultiLockAction} />

                        <GenericButton
                            id={'button-primary-rounded-lock-button'}
                            key={'key_button primary rounded-lock-button'}
                            className={'button primary rounded'}
                            title={localeStore.instance.TranslateText('team-management.multilock-examiner-lock-button-text')}
                            content={localeStore.instance.TranslateText('team-management.multilock-examiner-lock-button-text')}
                            disabled={!this.isLockButtonEnabled}
                            onClick={this.executeMultiLockAction} />
                    </div>
                </div>
            </div>
        </div>) : null;
        return (
            multiQigLockPopup
        );
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED,
            this.onMultiLockDataLoad);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED,
            this.updateMultiLockQigSelectionReceived);
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED,
            this.onMultiLockDataLoad);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED,
            this.updateMultiLockQigSelectionReceived);
    }

    /**
     * Method to cancel the multi lock action and hide multi lock popup.
     */
    private cancelMultiLockAction = () => {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        this.isShowMultiLockPopup = false;

        // Invoke help examiner data retrieve action for getting refreshed data and update the store.
        teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);

        // Invoke team over view count.
        teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId);

        // Navigate to help examiner worklist after completed the lock operation.
        if (this.examinerDrillDownData) {
            teamManagementActionCreator.updateExaminerDrillDownData(this.examinerDrillDownData);
        }
        // Invoke method to clear the multi lock data.
        teamManagementActionCreator.resetMultiLockData();

        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingResponse);
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method to execute multi lock action and hide multi lock popup.
     */
    private executeMultiLockAction = () => {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        /* Execute multiple lock action */
        this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
        if (this.multiQigLockData) {
            let dataCollection: Array<ExaminerForSEPAction> = new Array<ExaminerForSEPAction>();
            this.multiQigLockData.map(function (item: MultiQigLockExaminer) {
                if (item.isChecked) {
                    let examinerSEPAction: ExaminerForSEPAction = {
                        examinerRoleId: item.examinerRoleId,
                        markSchemeGroupId: item.markSchemeGroupId,
                        requestedByExaminerRoleId: item.loggedInExaminerRoleId
                    };
                    dataCollection.push(examinerSEPAction);
                }
            });

            let examinerForSEPActions = Immutable.List<ExaminerForSEPAction>(dataCollection);
            let doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument = {
                actionIdentifier: enums.SEPAction.Lock,
                examiners: examinerForSEPActions
            };

            teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument, true);
            this.isShowMultiLockPopup = false;
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.loadingResponse);
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * update multi qig lock selection
     */
    private updateMultiQigLockSelection = (markSchemeGroupId: number, isSelectedAll: boolean) => {
        teamManagementActionCreator.updateMultiQigLockSelection(markSchemeGroupId, isSelectedAll);
    };

    /**
     * This method will call on multi lock data load
     */
    private onMultiLockDataLoad = (selectedExaminerId: number, selectedQigId: number,
        selectedExaminerRoleId: number, selectedQigName: string) => {
        if (teamManagementStore.instance.multiLockDataList &&
            teamManagementStore.instance.multiLockDataList.count() > 0) {
            // Get selected help examiner name.
            this.getSelectedExaminerName(selectedExaminerId, selectedQigName);
            let qigNames: string[] = [selectedQigName];
            // Format the selected Qig name.
            this.selectedQigName = stringHelper.format(localeStore.
                instance.TranslateText('team-management.multilock-examiner-lockby-text'), qigNames);
            this.isShowMultiLockPopup = true;
            this.examinerDrillDownData = { examinerId: selectedExaminerId, examinerRoleId: selectedExaminerRoleId};
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * This method will call on multi qig lock selection received
     */
    private updateMultiLockQigSelectionReceived = () => {
        this.multiQigLockData = teamManagementStore.instance.multiLockDataList;
        this.isLockButtonEnabled = false;
        this.isSelectedAll = false;
        if (this.multiQigLockData) {
            let selectedlockData: any = this.multiQigLockData.filter((item: MultiQigLockExaminer) =>
                item.isChecked === true);
            this.isLockButtonEnabled = selectedlockData && selectedlockData.count() > 0;
            this.isSelectedAll = selectedlockData && selectedlockData.count() > 0 &&
                this.multiQigLockData.count() === selectedlockData.count();
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Get the selecetd examiner name.
     */
    private getSelectedExaminerName(selectedExaminerId: number, selectedQigName: string) {
        if (teamManagementStore.instance.examinersForHelpExaminers) {
            let _helpExaminerData = teamManagementStore.instance.examinersForHelpExaminers;
            let examinerName: string;
            _helpExaminerData.map(function (item: ExaminerDataForHelpExaminer) {
                if (item.examinerId === selectedExaminerId) {
                    examinerName = stringFormatHelper.
                        getFormattedExaminerName(item.initials, item.surname);
                }
            });
            let examinerNames: string[] = [examinerName, selectedQigName];
            this.selectedExaminerName = stringHelper.format(localeStore.
                instance.TranslateText('team-management.multilock-examiner-help-text'), examinerNames);
        }
    }
}

export = MultiQigLockPopup;