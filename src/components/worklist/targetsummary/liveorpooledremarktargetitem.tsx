/* tslint:disable:no-unused-variable */
﻿import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import TargetDetails = require('./targetdetails');
import TargetItem = require('./targetitem');
import ProgressIndicator = require('../../utility/progressindicator/circularprogressindicator');
import enums = require('../../utility/enums');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
let classNames = require('classnames');
import Immutable = require('immutable');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    target: markingTargetSummary;
    isDisabled: boolean;
    isSelected: boolean;
    renderedOn: number;
    onClickCallback: Function;
    directedRemarkTarget?: Immutable.List<markingTargetSummary>;
    isOverAllTargetCompleted: boolean;
    remarkRequestTypeID: enums.RemarkRequestType;
    isDirectedRemark: boolean;
    isTeamManagementMode: boolean;
    isAggregatedTargetsCCEnabled: boolean;
}

class LiveOrPooledRemarkTargetItem extends TargetItem {

    private markingModeName: string;

    /**
     * variable for holding functions
     */
    private onTargetClickFun: any;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onTargetClickFun = this.onTargetClick.bind(
            this,
            this.props.target.markingModeID,
            this.props.remarkRequestTypeID,
            this.props.isDirectedRemark);

        let markingModeName;
        if (this.props.target.markingModeID === enums.MarkingMode.Remarking) {
            this.markingModeName = enums.RemarkRequestType[this.props.remarkRequestTypeID];
        } else {
            this.markingModeName = enums.MarkingMode[this.props.target.markingModeID];
        }
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let idString = this.props.id;
        //If the maximum remarking target is 0, then we don't have to show the particular remark tab
        if (this.props.target.maximumMarkingLimit === 0 && this.props.remarkRequestTypeID !== undefined) {
            return null;
        } else {
            return (
                <li id= {'target_' + this.markingModeName} className={ classNames('panel',
                    {
                        'completed': (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted),
                        'disabled': this.props.isDisabled, 'open': this.props.isSelected
                    }) }
                    onClick={ this.onTargetClickFun }>
                    {!this.props.isAggregatedTargetsCCEnabled ? this.renderTargetIndicator() :
                        <span className={'menu-count'}><span className={'sprite-icon pencil-icon'}></span></span>}

                    {/* Progress indicator with target summary*/}
                    {this.renderProgressIndicatorSection(idString)}

                    {/* target summary in the Graph*/}
                    {this.renderTickSection() }
                    <a href='javascript:void(0)' id={this.markingModeName + '_title'} className='left-menu-link panel-link'
                        title={this.markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
                            localeStore.instance.TranslateText('generic.marking-modes.Marking') :
                            localeStore.instance.TranslateText('generic.marking-modes.' + this.markingModeName)}>
                        <span id={ this.markingModeName + '_menutext'} className='menu-text large-text'>
                            {this.markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
                                localeStore.instance.TranslateText('generic.marking-modes.Marking') :
                                localeStore.instance.TranslateText('generic.marking-modes.' + this.markingModeName)}
                        </span>
                        {this.renderRemaingDaysSection() }
                        <div className='menu-text-small small-text'>
                            <span id={ this.markingModeName + '_target_date'} className='menu-label'>
                                {localeStore.instance.TranslateText('marking.worklist.left-panel.target' +
                                    ((this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted)
                                        ? '-completed-date-label' : '-date-label')) }
                            </span>
                            <span id={ this.markingModeName + '_targetCompleteDate'} className='date-text'>
                                { this.getFormattedMarkingCompletionDate() }</span>
                        </div>
                    </a>
                    {this.renderTargetDetails() }
                </li>
            );
        }
    }

    /**
     * Render Target details
     */
    private renderTargetDetails() {
        if (this.props.target.markingModeID === enums.MarkingMode.LiveMarking) {
            return (
                <TargetDetails id={this.props.id}
                    key={this.props.id}
                    markingTargetsSummary={this.props.target}
                    selectedLanguage={this.props.selectedLanguage} renderdOn = { this.props.renderedOn }
                    directedRemarkTarget={this.props.directedRemarkTarget}
                    isTeamManagementMode = { this.props.isTeamManagementMode }>
                </TargetDetails>
            );
        }
    }

    /**
     * Render the Target Status section, If target is not completed then display open response count for progress wheel animation
     */
    private renderTargetIndicator() {
        if ((this.props.target.isCurrentTarget || this.props.target.markingModeID === enums.MarkingMode.Remarking)
            && !this.props.isDisabled && (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted)) {
            return <span id={this.markingModeName + '_status'} className= 'menu-count graph-transition'>
                { this.getTotalOpenResponsesCount() }</span>;
        } else if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return (<span id={this.markingModeName + '_status'} className= 'menu-count'>
                <span id={this.markingModeName + '_dotindicator'} className= 'sprite-icon dot-dot-dot-icon'></span></span>);
        }
    }

    /**
     * Render the tick section
     * @returns
     */
    private renderTickSection() {
        if (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return (<span id={this.markingModeName + '_status'} className='menu-count-completed'>
                <span className='sprite-icon tick-circle-icon'></span>
            </span>);
        }
    }

    /**
     * Renders the progress indicator section
     * @param idString
     */
    private renderProgressIndicatorSection(idString: string) {

        if (
            !this.props.isOverAllTargetCompleted &&
            !this.props.target.isTargetCompleted &&
            this.props.isSelected &&
            !this.props.isAggregatedTargetsCCEnabled
        ) {
            return (<div className='radial-progress-holder animated' id={this.markingModeName + '_progress'}>
                { this.renderProgressIndicator() }

                {/* Section :=> Target Name,No. Of Days Remaining, Target Completion Date*/}
                { this.renderProgressIndicatorContents(idString) }
            </div>);
        }
    }

    /**
     * Render the progress indicator contents, If target is completed no need to display this section
     */
    private renderProgressIndicatorContents(idString: string) {
        let directedRemarkResponseCountList: Array<number> = this.getDirectedRemarkRequestProgress();

        let totalResponsesCount: number = this.props.target.examinerProgress.closedResponsesCount +
            + this.props.target.examinerProgress.pendingResponsesCount
            + this.props.target.examinerProgress.openResponsesCount
            + (isNaN(this.props.target.examinerProgress.atypicalOpenResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalOpenResponsesCount)
            + (isNaN(this.props.target.examinerProgress.atypicalPendingResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalPendingResponsesCount)
            + (isNaN(this.props.target.examinerProgress.atypicalClosedResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalClosedResponsesCount)
            + directedRemarkResponseCountList[0]
            + directedRemarkResponseCountList[1]
            + directedRemarkResponseCountList[2];

        // Rendering over allocation
        let overAllocationIndicator = this.renderOverAllocationIndicator(this.props.target, totalResponsesCount);

        if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return <div className='inset-text'>
                {overAllocationIndicator}
                <div id={'targetSummaryCount' + idString} className='large-text'>
                    {this.props.target.examinerProgress.closedResponsesCount
                        + this.props.target.examinerProgress.pendingResponsesCount
                        + (isNaN(this.props.target.examinerProgress.atypicalPendingResponsesCount) ?
                            0 : this.props.target.examinerProgress.atypicalPendingResponsesCount)
                        + (isNaN(this.props.target.examinerProgress.atypicalClosedResponsesCount) ?
                            0 : this.props.target.examinerProgress.atypicalClosedResponsesCount)
                        + directedRemarkResponseCountList[1]
                        + directedRemarkResponseCountList[2]}
                    /
                    {(this.props.target.maximumMarkingLimit) }
                </div>
                <div className='small-text' id ={ 'submitted-text' + idString }>
                    {localeStore.instance.TranslateText('marking.worklist.left-panel.submitted-count-label') }</div>
            </div>;
        }
    }

    /**
     * Renders the over allocation indicator in the progress summary
     * @param target
     * @param totalResponsesCount
     */
    private renderOverAllocationIndicator(target: markingTargetSummary, totalResponsesCount: number): JSX.Element {

        let currentlyInOverAllocation: boolean = target.overAllocationCount > 0 ?
            totalResponsesCount >= target.maximumMarkingLimit : false;

        return currentlyInOverAllocation ?
            <span className='sprite-icon lock-open-icon'
                title={localeStore.instance.TranslateText('marking.worklist.left-panel.over-allocation-tooltip') }/> : null;
    }

    /**
     * Render the progress indicator, If target is completed no need to display this section
     */
    private renderProgressIndicator() {
        if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return <ProgressIndicator size={104} startDegree={0} endDegree={360}
                trackWidth={6}
                trackStyle='target-track-style'
                progress={ this.getProgressDetails() }>
            </ProgressIndicator>;
        }
    }

    /**
     * Get the remaining days section, If target is completed no need to display the section
     * @param markingTarget
     */
    private renderRemaingDaysSection() {
        if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return <span id={ this.markingModeName + '_targetremainingDays'}
                className='menu-highlight-text'>
                {this.remainingDaysForMarkingCompletion() }
                {' ' + localeStore.instance.TranslateText('marking.worklist.left-panel.days-until-target') }
            </span>;
        } else {
            return <span id={this.markingModeName + '_targetremainingDays'}
                        className='menu-highlight-text'>
                            {localeStore.instance.TranslateText('marking.worklist.left-panel.target-completed')}
                   </span>;
        }
    }

    /**
     * Method will return an array of progress items.
     */
    private getProgressDetails(): Array<any> {

        let progressItems: Array<any> = new Array<any>();
        let directedRemarkResponseCountList: Array<number> = this.getDirectedRemarkRequestProgress();
        let total: number = this.props.target.maximumMarkingLimit;

        // If there are any responses, then colour should be applied to the progress wheel
        if (total > 0) {

            let closedResponsesCount: number = 0;
            let inGraceResponsesCount: number = 0;
            let openResponsesCount: number = 0;

            // Determining the closed responses count
            closedResponsesCount = this.props.target.examinerProgress.closedResponsesCount
                + (isNaN(this.props.target.examinerProgress.atypicalClosedResponsesCount) ?
                    0 : this.props.target.examinerProgress.atypicalClosedResponsesCount)
                + directedRemarkResponseCountList[2];

            // If closed responses count doesn't meet the actual marking target, then determine the in-grace responses count
            if (closedResponsesCount < total) {

                // Determining the in-grace responses count
                inGraceResponsesCount = this.props.target.examinerProgress.pendingResponsesCount
                    + (isNaN(this.props.target.examinerProgress.atypicalPendingResponsesCount) ?
                        0 : this.props.target.examinerProgress.atypicalPendingResponsesCount)
                    + directedRemarkResponseCountList[1];

                // If the in-grace + closed responses count doesn't meet the actual marking target,
                // then determine the open responses count
                if ((inGraceResponsesCount + closedResponsesCount) < total) {

                    // Determining the open responses count
                    openResponsesCount = this.props.target.examinerProgress.openResponsesCount
                        + (isNaN(this.props.target.examinerProgress.atypicalOpenResponsesCount) ?
                            0 : this.props.target.examinerProgress.atypicalOpenResponsesCount)
                        + directedRemarkResponseCountList[0];

                    // If the open + in-grace + closed responses count crosses the actual marking target,
                    // then the open responses count should be the difference between the marking target limit
                    // and the sum of closed and in-grace responses
                    if ((openResponsesCount + inGraceResponsesCount + closedResponsesCount) > total) {
                        openResponsesCount = total - (closedResponsesCount + inGraceResponsesCount);
                    }
                } else {

                    // If the in-grace + closed responses count crosses the actual marking target,
                    // then the in-grace responses count should be the difference between the marking target limit
                    // and the count of closed responses
                    inGraceResponsesCount = total - closedResponsesCount;
                }
            } else {

                // If the closed responses count crosses the actual marking target,
                // then the closed responses count should be the set as the marking target limit
                closedResponsesCount = total;
            }

            // Determining the closed responses percentage
            let closedPercentage: number = 100 / total * closedResponsesCount;

            // Determining the pending responses percentage
            let inGracePercentage: number = 100 / total * inGraceResponsesCount;

            // Determining the open responses percentage
            let openPercentage: number = 100 / total * openResponsesCount;

            if (closedPercentage > 0) {
                progressItems.push({ progress: closedPercentage, className: 'target-progress-style' });
            }

            if (inGracePercentage > 0) {
                progressItems.push({ progress: inGracePercentage, className: 'target-progress-style2' });
            }

            if (openPercentage > 0) {
                progressItems.push({ progress: openPercentage, className: 'target-progress-style1' });
            }
        }

        return progressItems;
    }

    /**
     * Get directed remark request progress count
     */
    private getDirectedRemarkRequestProgress(): Array<number> {
        let directedRemarkTargets = this.props.directedRemarkTarget;
        let directedRemarkResponseCountList: Array<number> = [];
        let open: number = 0;
        let closed: number = 0;
        let inGrace: number = 0;

        if (directedRemarkTargets != null && directedRemarkTargets !== undefined) {

            let directedRemarkTargetsList = directedRemarkTargets.map((markingTarget: markingTargetSummary) => {

                if (markingTarget.markingModeID === enums.MarkingMode.Remarking
                    && markingTarget.examinerProgress.isDirectedRemark === true) {
                    open += markingTarget.examinerProgress.openResponsesCount;
                    inGrace += markingTarget.examinerProgress.pendingResponsesCount;
                    closed += markingTarget.examinerProgress.closedResponsesCount;
                }
            });
        }

        directedRemarkResponseCountList.push(open);
        directedRemarkResponseCountList.push(inGrace);
        directedRemarkResponseCountList.push(closed);

        return directedRemarkResponseCountList;
    }

    /**
     * Method to return the total open responses count
     */
    private getTotalOpenResponsesCount() {
        let directedRemarkResponseCountList: Array<number> = this.getDirectedRemarkRequestProgress();
        let openResponseCount = 0;

        openResponseCount += this.props.target.examinerProgress.openResponsesCount
            + (isNaN(this.props.target.examinerProgress.atypicalOpenResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalOpenResponsesCount)
            + directedRemarkResponseCountList[0];

        return openResponseCount;
    }
}

export = LiveOrPooledRemarkTargetItem;