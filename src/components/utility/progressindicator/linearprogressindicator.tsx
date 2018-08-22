/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import markingTarget = require('../../../stores/qigselector/typings/markingtarget');
import localeStore = require('../../../stores/locale/localestore');
import stringHelper = require('../../../utility/generic/stringhelper');
import Immutable = require('immutable');
import qigvalidationHelper = require('../qigselector/qigselectorvalidationhelper');
import qigValidationResultBase = require('../../../stores/qigselector/qigvalidationresultbase');
import aggregatedQigValidationResult = require('../../../stores/qigselector/aggregatedqigvalidationresult');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    qigValidationResult: qigValidationResultBase;
    currentMarkingTarget?: markingTarget;
    directedRemarkMarkingTargets?: Immutable.List<markingTarget>;
    isAggregatedTarget: boolean;
}

/**
 * Class for the Linear Progress Indicator.
 */
class LinearProgressIndicator extends pureRenderComponent<Props, any> {

    private _openResponseCount: number = 0;
    private _pendingResponseCount: number = 0;
    private _closedResponseCount: number = 0;
    private qigHelper: qigvalidationHelper = new qigvalidationHelper();

    /**
     * Render method for Linear Progress Indicator.
     */
    public render() {

        if (this.props.qigValidationResult.displayProgressBar) {
            // The maximum marking limit.
            let maximumMarkingLimit: number = 0;
            if (this.props.isAggregatedTarget) {
                let validationResult = this.props.qigValidationResult as aggregatedQigValidationResult;
                // If the qigs is included in the aggregated a target, used aggregated counts.
                this._openResponseCount = validationResult.aggregatedOpenResponsesCount;
                this._pendingResponseCount = validationResult.aggregatedPendingResponsesCount;
                this._closedResponseCount = validationResult.aggregatedClosedResponsesCount;
                maximumMarkingLimit = validationResult.aggregatedMaxMarkingLimit;
            } else {
                // Invoking the method to find the response count in open/pending/closed worklist.
                let responseCounts: [number, number, number] = this.qigHelper.findResponseCountInWorklist(
                    this.props.directedRemarkMarkingTargets, this.props.currentMarkingTarget);
                this._openResponseCount = responseCounts[0];
                this._pendingResponseCount = responseCounts[1];
                this._closedResponseCount = responseCounts[2];

                // For Correcting the progress values, If the target is 0
                maximumMarkingLimit = this.props.currentMarkingTarget.maximumMarkingLimit === 0 ? 1
                    : this.props.currentMarkingTarget.maximumMarkingLimit;
            }

            // Total response count.
            let totalResponsesCount: number = this._closedResponseCount + this._pendingResponseCount + this._openResponseCount;

            // Get the closed response count. It can be more than 1, If so limit to 100 for progress representation
            let closedValue = this._closedResponseCount / maximumMarkingLimit;
            let pendingValue = 0;
            let openValue = 0;
            if (closedValue > 1) {
                closedValue = 1;
            } else {
                // Get the pending response count. If it exceeds 1, calculate the closed as well as pending for progress representation
                pendingValue = (this._closedResponseCount + this._pendingResponseCount) / maximumMarkingLimit;
                if (pendingValue > 1) {
                    pendingValue = 1;
                } else {
                    // Get the open response count.
                    // If it exceeds 1, calculate the closed, pending as well as pending for progress representation
                    openValue = totalResponsesCount / maximumMarkingLimit;
                    if (openValue > 1) {
                        openValue = 1;
                    }
                }
            }

            // Convert the value to percentage.
            let openResponsePercentage = (openValue * 100) + '%';
            let pendingResponsePercentage = (pendingValue * 100) + '%';
            let closedResponsePercentage = (closedValue * 100) + '%';

            if (totalResponsesCount > maximumMarkingLimit) {
                return (
                    <div id={this.props.id + '_progress'} className='linear-progress-holder'>
                        <div className='progress progress1 open'
                            style={{ width: openResponsePercentage }}
                            id={this.props.id + '_openProgress'}></div>
                        <div className='progress progress2 ingrace'
                            style={{ width: pendingResponsePercentage }}
                            id={this.props.id + '_pendingProgress'}></div>
                        <div className='progress progress3 closed'
                            style={{ width: closedResponsePercentage }} id={this.props.id + '_closedProgress'}></div>
                        <div className='progress-track' id={this.props.id + '_progressTrack'}></div>
                    </div>
                );
            } else {
                let progressIndicatorTooltip: string = stringHelper.format(
                    localeStore.instance.TranslateText('home.qig-data.marking-progress-tooltip'),
                    [String(this._closedResponseCount),
                    String(this._pendingResponseCount),
                    String(this._openResponseCount)]);

                return (
                    <div title={progressIndicatorTooltip} id={this.props.id + '_progress'} className='linear-progress-holder'>
                        <div className='progress progress1 open'
                            style={{ width: openResponsePercentage }}
                            id={this.props.id + '_openProgress'}></div>
                        <div className='progress progress2 ingrace'
                            style={{ width: pendingResponsePercentage }}
                            id={this.props.id + '_pendingProgress'}></div>
                        <div className='progress progress3 closed'
                            style={{ width: closedResponsePercentage }} id={this.props.id + '_closedProgress'}></div>
                        <div className='progress-track' id={this.props.id + '_progressTrack'}></div>
                    </div>
                );
            }
        } else {
            return null;
        }
    }
}

export = LinearProgressIndicator;
