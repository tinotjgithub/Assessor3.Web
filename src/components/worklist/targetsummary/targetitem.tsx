/* tslint:disable:no-unused-variable */
﻿import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import qiqStore = require('../../../stores/qigselector/qigstore');
let classNames = require('classnames');
import Immutable = require('immutable');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');

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
    isAggregatedTargetsCCEnabled?: boolean;
}

class TargetItem extends pureRenderComponent<Props, any> {

    /**
     * variable for holding functions
     */
    private onTargetClickFn: any;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onTargetClickFn = this.onTargetClick.bind(
            this,
            this.props.target.markingModeID,
            this.props.remarkRequestTypeID,
            this.props.isDirectedRemark);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let markingModeName;
        if (this.props.target.markingModeID === enums.MarkingMode.Remarking) {
            markingModeName = enums.RemarkRequestType[this.props.remarkRequestTypeID];

        } else {
            markingModeName = enums.MarkingMode[this.props.target.markingModeID];
        }

        if (this.props.target.markingModeID === enums.MarkingMode.ES_TeamApproval &&
            qiqStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false) {
            markingModeName = 'SecondStandardisation';
        }
        return (
            <li id={'target_' + markingModeName} className={classNames('panel',
                {
                    'completed': (this.props.target.isTargetCompleted
                        || this.props.isOverAllTargetCompleted), 'disabled': this.props.isDisabled, 'open': this.props.isSelected,
                        'active': markingModeName === 'Simulation'
                })}
                onClick={this.onTargetClickFn}>

                <span id={markingModeName + '_status'} className={this.determineMenuClass()}>
                    <span id={markingModeName + '_indicator'} className={this.determineStatusClass()}></span>
                    {this.getOpenResponsesCount()}
                </span>
                <a href='javascript:void(0)' id={markingModeName + '_title'}
                    title={markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
                        localeStore.instance.TranslateText('generic.marking-modes.Marking') :
                        localeStore.instance.TranslateText('generic.marking-modes.' + markingModeName)}
                    className='left-menu-link panel-link'>
                    <span id={markingModeName + '_menutext'} className='menu-text large-text'>
                        {markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
                            localeStore.instance.TranslateText('generic.marking-modes.Marking') :
                            localeStore.instance.TranslateText('generic.marking-modes.' + markingModeName)}
                    </span>
                    {this.renderHighlightedCompletedText()}
                    {this.renderRemainingDaysSection()}
                    {this.renderMarkingCompletionDate(markingModeName)}
                </a>
            </li>
        );
    }

    /**
     * Handle the click event in the Target.
     * @param selectedMarkingModeID
     */
    public onTargetClick(selectedMarkingModeID: number, remarkRequestTypeId: enums.RemarkRequestType, isDirectedRemark: boolean) {
        if (!this.props.isDisabled && !this.props.isSelected) {
            this.props.onClickCallback(selectedMarkingModeID, remarkRequestTypeId, isDirectedRemark);
        }
    }

    /**
     * Method which gets the formatted date to be shown in the UI
     * @param markingCompletionDate
     */
    public getFormattedMarkingCompletionDate() {
        let targetCompletedDateString = (this.props.target.isTargetCompleted
            || this.props.isOverAllTargetCompleted) ? this.props.target.targetCompletedDate.toString() :
            this.props.target.markingTargetDate.toString();
        let targetCompletedDate = new Date(targetCompletedDateString);
        return localeHelper.toLocaleDateString(targetCompletedDate);
    }

    /**
     * Get the remaining days for the completion date. Shouldn't be negetive.
     * If target is met return the value as 0.
     * @param markingCompletionDate
     */
    public remainingDaysForMarkingCompletion(): any {
        let today = new Date();
        let markingDate = new Date(this.props.target.markingTargetDate.toString());

        // Converting milli seconds to 1 day.
        let oneDay = 1000 * 60 * 60 * 24;

        let noOfDays = (Math.ceil((markingDate.getTime() - today.getTime()) / (oneDay)));

        if (noOfDays < 0) {
            return 0;
        } else {
            return noOfDays;
        }
    }

    /**
     * Deteremines the menu class
     */
    private determineMenuClass() {
        return (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) ? 'menu-count-completed' : 'menu-count';
    }

    /**
     * Renders the highlighted completed text
     * @returns
     */
    private renderHighlightedCompletedText() {
        if (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return (
                <span className='menu-highlight-text'>{localeStore.instance.TranslateText
                    ('marking.worklist.left-panel.target-completed')}</span>);
        }
    }

    /**
     * Renders the remaining day section
     */
    private renderRemainingDaysSection() {
        if (this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return null;
        }
        if (!this.props.target.isCurrentTarget || this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return null;
        }

        let style = {
            'display': 'block'
        };

        return (
            <span className='menu-highlight-text' style={style}>
                <span id={enums.MarkingMode[this.props.target.markingModeID] + '_days_until_target_date'}
                    className='remaining-date'>
                    {this.remainingDaysForMarkingCompletion()} </span>
                {localeStore.instance.TranslateText('marking.worklist.left-panel.days-until-target')}
            </span>
        );

    }

    /**
     * Method to render marking completion date.
     * @param markingModeName
     */
    private renderMarkingCompletionDate(markingModeName: string) {
        if (this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return null;
        }

        return (
            <div id={markingModeName + '_target_date'} className='menu-text-small small-text'>
                <span className='menu-label'>
                    {localeStore.instance.TranslateText('marking.worklist.left-panel.target' +
                        ((this.props.target.isTargetCompleted
                        || this.props.isOverAllTargetCompleted) ? '-completed-date-label' : '-date-label'))}
                </span>
                <span id={markingModeName + '_datetext'} className='date-text'>
                    {this.getFormattedMarkingCompletionDate()}
                </span>
            </div>);
    }

    /**
     * Method to determine the status class to apply for the item.
     */
    private determineStatusClass() {
        // Determine the Status of the target item. tick/dots/pencil.
        // TargetComplete = tick, Current = pencil, Future = dots.
        if (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return 'sprite-icon tick-circle-icon menu-count-completed';
        } else if (this.props.target.isCurrentTarget && this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return '';
        } else if (this.props.target.isCurrentTarget || this.props.target.markingModeID === enums.MarkingMode.Remarking
            && targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.LiveMarking) {
            return this.props.target.markingModeID === enums.MarkingMode.LiveMarking
                || this.props.target.markingModeID === enums.MarkingMode.Remarking ? '' : 'sprite-icon pencil-icon';
        } else {
            return 'sprite-icon dot-dot-dot-icon';
        }
    }

    /**
     * This method will return the open responses count
     */
    private getOpenResponsesCount() {
        if (this.props.target.isCurrentTarget &&
            this.props.target.markingModeID === enums.MarkingMode.LiveMarking && !this.props.target.isTargetCompleted
            || (this.props.target.markingModeID === enums.MarkingMode.Remarking && !this.props.target.isTargetCompleted
                && targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.LiveMarking)
            || this.props.target.isCurrentTarget && this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return this.props.target.examinerProgress.openResponsesCount;
        }
    }
}

export = TargetItem;