import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import markingTarget = require('../../stores/qigselector/typings/markingtarget');
import LinearProgressIndicator = require('../utility/progressindicator/linearprogressindicator');
import ResponseAvailabilityIndicator = require('./responseavailabilityindicator');
import TargetProgressCountIndicator = require('./targetprogresscountindicator');
import Immutable = require('immutable');
import RemarkIndicator = require('./remarkindicator');
import localeStore = require('../../stores/locale/localestore');
import StandardisationSetupButton = require('../standardisationsetup/standardisationsetupbutton');
import StandardisationSetupLink = require('../standardisationsetup/standardisationsetuplink');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import navigationHelper = require('../utility/navigation/navigationhelper');
import qigStore = require('../../stores/qigselector/qigstore');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    currentMarkingTarget: markingTarget;
    qigValidationResult: qigValidationResult;
    directedRemarkMarkingTargets?: Immutable.List<markingTarget>;
    markSchemeGroupId: number;
    examinerRoleId: number;
    isStandardisationSetupButtonVisible: boolean;
    isStandardisationSetupLinkVisible: boolean;
    questionPaperPartId: number;
    isAggregatedTarget: boolean;
    hasBrowsePermissionOnly?: boolean;
    standardisationInProgress?: boolean;
}

/**
 * Class for the Marking Target Section.
 */
class MarkingTarget extends pureRenderComponent<Props, any> {

    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for Marking Target Section.
     */
    public render() {

        return (
            <div key={this.props.id + '_markingTarget'} className='qig-col2 qig-col vertical-middle'>
                <div className='middle-content'>
                    {this.renderMarkingStatusIndicators()}
                    <LinearProgressIndicator id={this.props.id + '_progressIndicator'}
                        key={this.props.id + '_progressIndicator'}
                        currentMarkingTarget={this.props.currentMarkingTarget}
                        qigValidationResult={this.props.qigValidationResult}
                        directedRemarkMarkingTargets={this.props.directedRemarkMarkingTargets}
                        isAggregatedTarget={this.props.isAggregatedTarget} />
                    <RemarkIndicator
                        id={this.props.id + '_remarkindicator'}
                        key={this.props.id + '_remarkindicator'}
                        selectedLanguage={this.props.selectedLanguage}
                        qigValidationResult={this.props.qigValidationResult} />
                    {this.renderStandardisationSetupButton()}
                    {this.renderStandardisationSetupLink()}
                </div>
            </div>
        );
    }

    /**
     * Get the tooltip status descriptionwhen mouse pointer positioned over simulation.
     */
    private get getSimulationStatusTooltip() {
        if (this.props.qigValidationResult.isSimulationMode) {
            return localeStore.instance.TranslateText('home.qig-data.simulation-status-tooltip');
        }
    }

    /**
     * Display the open response count while in overallocation OR the target progress X / Y.
     */
    private renderTargetProgressCountOrOverAllocationOpenResponseCount() {
        // Display the open response count if the marker is in over allocation 
        // this count is only shown with the open response indicator and
        // if the openresponsecount is > 0. 
        // openresponsecount will have value only when there is an over allocation.
        if (this.props.qigValidationResult.displayOpenResponseIndicator
            && this.props.qigValidationResult.openResponsesCount > 0
            && !this.props.isAggregatedTarget) {
            return (
                <div className='over-allocation-holder small-text grey-text'>
                    <span className='open-text small-text' id='openResponseCountInOverAllocation' >
                        {this.props.qigValidationResult.openResponsesCount +
                            ' ' + localeStore.instance.TranslateText('home.qig-data.open-responses-in-over-allocation')}
                    </span>
                </div>
            );
        } else {
            // Display target progress based on this.props.qigValidationResult.displayTarget (Work Item 1235)
            return (
                <TargetProgressCountIndicator id={this.props.id + '_targetProgressCountIndicatorID'}
                    key={this.props.id + '_targetProgressCountIndicatorKey'}
                    selectedLanguage={this.props.selectedLanguage}
                    currentMarkingTarget={this.props.currentMarkingTarget}
                    qigValidationResult={this.props.qigValidationResult}
                    directedRemarkMarkingTargets={this.props.directedRemarkMarkingTargets}
                    isAggregatedQig={false}
                    isIncludedInAggregatedTarget={this.props.isAggregatedTarget}>
                </TargetProgressCountIndicator >
            );
        }
    }

    /**
     * On standardisation setup button click.
     */
    private navigateToStandardisationSetupPageOnClick = () => {

        // set the marker operation mode as StandardisationSetup
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.StandardisationSetup);

        // Invoke the action creator to Open the QIG
        qigSelectorActionCreator.openQIG(this.props.markSchemeGroupId);

        navigationHelper.loadStandardisationSetup();
    };

    /**
     * Render marking status indicators
     */
    private renderMarkingStatusIndicators(): JSX.Element {
        let childClassName: string = 'progress-title middle-content-left ';
        if (!this.props.qigValidationResult.displayProgressBar) {
            childClassName += 'align-middle ';
        }

        // isInStatndardisationMode is set when ExaminerQIGStatus is in WaitingStandardisation.
        return this.props.isStandardisationSetupButtonVisible ? null :
            this.props.hasBrowsePermissionOnly && this.props.standardisationInProgress ? null :
            (<div className={'middle-content-inner'}>
                <div id={this.props.id + '_currentMarkingMode'}
                    className={childClassName + this.props.qigValidationResult.statusColourClass}>
                    <span className='progress-title-text'
                        title={this.getSimulationStatusTooltip} >
                        {this.props.qigValidationResult.statusText}
                    </span>
                    <ResponseAvailabilityIndicator id={this.props.id + '_responseAvailabilityIndicatorID'}
                        key={this.props.id + '_responseAvailabilityIndicatorKey'}
                        qigValidationResult={this.props.qigValidationResult} />
                </div>
                {this.renderTargetProgressCountOrOverAllocationOpenResponseCount()}
            </div>);
    }

    /**
     * Render standardisation setup button element.
     */
    private renderStandardisationSetupButton(): JSX.Element {
        return this.props.isStandardisationSetupButtonVisible ?
            (<StandardisationSetupButton
                id={this.props.id + '_standardisationSetup'}
                key={this.props.id + '_standardisationSetup'}
                onStandardisationButtonClick={this.navigateToStandardisationSetupPageOnClick}
                isMarkedAsProvisional={qigStore.instance.isMarkedAsProvisional(this.props.markSchemeGroupId)}
            />) : null;
    }

    /**
     * Render standardisation setup link element.
     */
    private renderStandardisationSetupLink(): JSX.Element {
        return this.props.isStandardisationSetupLinkVisible ?
            (<StandardisationSetupLink
                id={this.props.id + '_standardisationSetupLink'}
                key={this.props.id + '_standardisationSetupLink'}
                onStandardisationLinkClick={this.navigateToStandardisationSetupPageOnClick}
                stdSetupPermission={qigStore.instance.getSSUPermissionsData(this.props.markSchemeGroupId).role.permissions}
                hasBrowsePermissionOnly = {this.props.hasBrowsePermissionOnly}
            />) : null;
    }
}

export = MarkingTarget;
