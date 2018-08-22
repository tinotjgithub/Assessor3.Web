import React = require('react');
import ReactDom = require('react-dom');
import classNames = require('classnames');
import pureRenderComponent = require('../base/purerendercomponent');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import Immutable = require('immutable');
import MultiQigLockResultItem = require('./multiQigLockResultItem');
import GenericButton = require('../utility/genericbutton');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');

interface Props extends PropsBase, LocaleSelectionBase {
}

interface State {
    renderedOn?: number;
}

/**
 * React wrapper component for multi qig lock result popup
 */
class MultiQigLockResultPopup extends pureRenderComponent<Props, State> {

    private isShowMultiLockResultPopup: boolean = false;
    private multiLockResults: Immutable.List<MultiLockResult>;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0
        };
        this.multiLockResults = teamManagementStore.instance.multiLockResults;
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        this.multiLockResults = teamManagementStore.instance.multiLockResults;
        let successfullyLockedQigs: any;
        let lockFailedQigs: any;
        let multiLockResultPopup: any;
        let itemCount: number = 0;
        let className: string = classNames(
            'popup medium popup-overlay qig-lock fixed-hf',
            { 'open': this.isShowMultiLockResultPopup === true },
            { 'close': this.isShowMultiLockResultPopup === false }
        );

        let multiLockAvailable = this.multiLockResults && this.multiLockResults.count() > 0;
        if (multiLockAvailable) {

            // Fetch successfully locked multi Qig list
            let successLockList = this.multiLockResults.filter((item: MultiLockResult) =>
                item.failureCode === enums.FailureCode.None).toList();

            // Fetch failed multi Qig lock list
            let failureLockList = this.multiLockResults.filter((item: MultiLockResult) =>
                item.failureCode !== enums.FailureCode.None).toList();

            // Bind successfully locked multi Qig list
            if (successLockList && successLockList.count() > 0) {
                let successfullock = successLockList.map(function (item: MultiLockResult) {
                    itemCount++;
                    return (
                        <MultiQigLockResultItem
                            id={'multi-qig-lock-result-success-item' + itemCount}
                            key={'multi-qig-lock-result-success-item-key-' + itemCount}
                            className={itemCount === 1 ? 'padding-top-20' : 'padding-top-10'}
                            multiQigLockResult={item} />
                    );
                });

                successfullyLockedQigs = (<div className='padding-bottom-20' id='multi-qig-lock-result-success-item-list'>
                    <p id='multilock-examiner-lock-execution-sucess'>{localeStore.instance.
                        TranslateText('team-management.multilock-examiner-lock-execution-sucess-header-text')}</p>
                    {successfullock}
                </div>);
            }

            // Bind failed multi Qig lock list
            itemCount = 0;
            if (failureLockList && failureLockList.count() > 0) {
                let lockFailedQigItems = failureLockList.map(function (item: MultiLockResult) {
                    itemCount++;
                    return (
                        <MultiQigLockResultItem
                            id={'multi-qig-lock-result-failed-item-' + itemCount}
                            key={'multi-qig-lock-result-failed-item-key-' + itemCount}
                            className={itemCount === 1 ? 'padding-top-20' : 'padding-top-10'}
                            multiQigLockResult={item} />
                    );
                });

                lockFailedQigs = (<div className='padding-bottom-20' id='multi-qig-lock-result-failed-item-list'>
                    <p id='multilock-examiner-lock-execution-failure-header'>{localeStore.instance.
                        TranslateText('team-management.multilock-examiner-lock-execution-failure-header-text')}</p>
                    {lockFailedQigItems}
                </div>);
            }
        }

        multiLockResultPopup = multiLockAvailable ?
            (<div className={className}
                id='qig-lock-status' role='dialog' aria-labelledby='popup4Title'
                aria-describedby='popup4Desc'>
                <div className='popup-wrap'>
                    <div className='popup-header'>
                        <h4 id='multilock-examiner-lock-execution-header'>{localeStore.instance.
                            TranslateText('team-management.multilock-examiner-lock-execution-header-text')}</h4>
                    </div>
                    <div className='popup-content' id='popup14Desc'>
                        {successfullyLockedQigs}
                        {lockFailedQigs}
                    </div>
                    <div className='popup-footer text-right'>
                        <div className='shift-right'>
                            <div className='shift-right'>
                                <GenericButton
                                    id={'button-primary-rounded-lock-result-ok-button'}
                                    key={'key-button-primary-rounded-lock-result-ok-button'}
                                    className={'button primary rounded'}
                                    title={localeStore.instance.
                                        TranslateText('team-management.multilock-examiner-lock-execution-ok-button-text')}
                                    content={localeStore.instance.
                                        TranslateText('team-management.multilock-examiner-lock-execution-ok-button-text')}
                                    disabled={false}
                                    onClick={this.okOnClick} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>) : null;

        return (
             multiLockResultPopup
            );
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED,
            this.onMultiQigLockResultLoad);
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED,
            this.onMultiQigLockResultLoad);
    }

    /**
     * This method will call on multi qig lock result load
     */
    private onMultiQigLockResultLoad = (multiLockResults: Immutable.List<MultiLockResult>) => {
        if (teamManagementStore.instance.multiLockResults
            && teamManagementStore.instance.multiLockResults.count() > 0) {
            this.multiLockResults = multiLockResults;
            this.isShowMultiLockResultPopup = true;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * This method will call on ok click
     */
    private okOnClick = () => {
        // Invoke help examiner data retrieve action for getting refreshed data and update the store.
        teamManagementActionCreator.GetHelpExminersData(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId, !teamManagementStore.instance.isHelpExaminersDataChanged);

        // Invoke team over view count.
        teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId,
            teamManagementStore.instance.selectedMarkSchemeGroupId);
        if (teamManagementStore.instance.multiLockExaminerDrillDownData) {
            let examinerDrillDownData: ExaminerDrillDownData = teamManagementStore.instance.multiLockExaminerDrillDownData;
            // Navigate to help examiner worklist after completed the lock operation.
            teamManagementActionCreator.updateExaminerDrillDownData(examinerDrillDownData);
        }

        // Invoke method to clear the multi lock data.
        teamManagementActionCreator.resetMultiLockData();

        this.isShowMultiLockResultPopup = false;
        this.setState({
            renderedOn: Date.now()
        });
    };
}

export = MultiQigLockResultPopup;