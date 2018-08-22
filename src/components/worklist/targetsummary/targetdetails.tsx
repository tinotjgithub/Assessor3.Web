/* tslint:disable:no-unused-variable */
﻿import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import WorklistType = require('./worklisttype');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import sortHelper = require('../../../utility/sorting/sorthelper');
import comparerList = require('../../../utility/sorting/sortbase/comparerlist');
import Immutable = require('immutable');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    markingTargetsSummary: markingTargetSummary;
    renderdOn: number;
    directedRemarkTarget?: Immutable.List<markingTargetSummary>;
    isTeamManagementMode: boolean;
}

/**
 * Class for the Target Details => Progress Graph, Marking Name + Target section and the worklist items for the target.
 */
class TargetDetails extends pureRenderComponent<Props, any> {

    /**
     * Constructor for Target Details
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     */
    public render() {

        return (
            <div className='panel-content clearfix' aria-hidden='true'>
                {this.renderWorklistTypes() }
            </div>
        );
    }

    /**
     * Render worklist types
     */
    private renderWorklistTypes() {
        if (this.props.markingTargetsSummary.markingModeID === enums.MarkingMode.LiveMarking) {
            let directedRemarkRequestRenderer = this.renderDirectedRemarkWorklistType();

            return (
                <ul className='shift-right'>
                    <WorklistType id='worklist_live'
                        key={'worklist_live'}
                        targetCount={this.props.markingTargetsSummary.examinerProgress.openResponsesCount }
                        worklistType={enums.WorklistType.live}
                        remarkRequestType={enums.RemarkRequestType.Unknown}
                        isDirectedRemark ={false}
                        selectedLanguage={this.props.selectedLanguage}
                        isTeamManagementMode = {this.props.isTeamManagementMode}>
                        </WorklistType>
                    <WorklistType id='worklist_atypical'
                        key={'worklist_atypical'}
                        targetCount={this.props.markingTargetsSummary.examinerProgress.atypicalOpenResponsesCount}
                        worklistType={enums.WorklistType.atypical}
                        remarkRequestType={enums.RemarkRequestType.Unknown}
                        isDirectedRemark ={false}
                        selectedLanguage={this.props.selectedLanguage}
                        isTeamManagementMode = {this.props.isTeamManagementMode}>
                        </WorklistType>
                    { directedRemarkRequestRenderer }
                </ul>
            );
        } else {
            return (
                <ul className='shift-right'>
                    <WorklistType id={'worklist_' + this.props.id}
                        key={'worklist_key_' + this.props.id}
                        targetCount={this.props.markingTargetsSummary.examinerProgress.openResponsesCount }
                        worklistType={this.props.markingTargetsSummary.markingModeID}
                        remarkRequestType={enums.RemarkRequestType.Unknown}
                        isDirectedRemark ={false}
                        selectedLanguage={this.props.selectedLanguage}
                        isTeamManagementMode = {this.props.isTeamManagementMode}>
                    </WorklistType>
                </ul>
            );
        }
    }

    /**
     * Render directed remark worklist type
     */
    private renderDirectedRemarkWorklistType() {
        let directedRemarkTargets = this.props.directedRemarkTarget;

        if (directedRemarkTargets != null && directedRemarkTargets !== undefined) {

            if (directedRemarkTargets !== undefined && directedRemarkTargets.count() > 0) {

                // Sort the directed remark target based on their locale string
                directedRemarkTargets = Immutable.List<any>(sortHelper.sort(directedRemarkTargets.toArray(),
                    comparerList.remarkRequestTypeComparer));

                let directedRemarkTargetsList = directedRemarkTargets.map((markingTarget: markingTargetSummary) => {

                    // Get the total response count
                    let responseCount = markingTarget.examinerProgress.openResponsesCount
                        + markingTarget.examinerProgress.pendingResponsesCount
                        + markingTarget.examinerProgress.closedResponsesCount;

                    // Only if open + closed + pending response count is > 0 then display the remark request type
                    if (responseCount > 0) {

                        return (<WorklistType
                            id= { 'worklist_directed_remark_' + enums.RemarkRequestType[markingTarget.remarkRequestTypeID]}
                            key= { 'worklist_directed_remark_' + enums.RemarkRequestType[markingTarget.remarkRequestTypeID]}
                            targetCount={markingTarget.examinerProgress.openResponsesCount}
                            remarkRequestType={markingTarget.remarkRequestTypeID}
                            worklistType={enums.WorklistType.directedRemark}
                            isDirectedRemark ={true}
                            selectedLanguage={this.props.selectedLanguage}
                            isTeamManagementMode = {this.props.isTeamManagementMode}>
                        </WorklistType>);
                    }
                });

                return directedRemarkTargetsList;
            }
        }

        return null;
    }
}

export = TargetDetails;