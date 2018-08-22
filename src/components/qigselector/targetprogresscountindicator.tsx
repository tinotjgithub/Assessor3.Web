/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import markingTarget = require('../../stores/qigselector/typings/markingtarget');
import localeStore = require('../../stores/locale/localestore');
import Immutable = require('immutable');
import qigvalidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
import qigValidationResultBase = require('../../stores/qigselector/qigvalidationresultbase');
import aggregatedQigValidationResult = require('../../stores/qigselector/aggregatedqigvalidationresult');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');

let classNames = require('classnames');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    qigValidationResult: qigValidationResultBase;
    currentMarkingTarget?: markingTarget;
    directedRemarkMarkingTargets?: Immutable.List<markingTarget>;
    isAggregatedQig: boolean;
    isIncludedInAggregatedTarget: boolean;
}

/**
 * Class for the Target Submit section
 */
class TargetProgressCountIndicator extends pureRenderComponent<Props, any> {

    private qigHelper: qigvalidationHelper;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.qigHelper = new qigvalidationHelper();
    }

    /**
     * Render method for Qig group.
     */
    public render() {
        if (this.props.qigValidationResult.displayTarget) {
            let closedResponsesCount: number = 0;
            let maximumMarkingLimit: number = 0;
            let openResponsesCount: number = 0;
            if (this.props.isAggregatedQig) {
                let validationResult = this.props.qigValidationResult as aggregatedQigValidationResult;
                // For the aggregated qig display the aggregated counts.
                closedResponsesCount = validationResult.aggregatedSubmittedResponsesCount;
                maximumMarkingLimit = validationResult.aggregatedMaxMarkingLimit;
            } else {
                let responseCount: [number, number, number] = this.qigHelper.findResponseCountInWorklist(
                    this.props.directedRemarkMarkingTargets, this.props.currentMarkingTarget);
                openResponsesCount = responseCount[0];
                maximumMarkingLimit = this.props.currentMarkingTarget.maximumMarkingLimit;
                closedResponsesCount = this.qigHelper.findSubmittedResponsesCount(
                    this.props.directedRemarkMarkingTargets, this.props.currentMarkingTarget);
            }

            // Class names for the parent and children
            let parentClassName: string = 'small-text middle-content-right';
            parentClassName = this.props.isIncludedInAggregatedTarget ? parentClassName :
                'submitted-holder ' + parentClassName;
            let firstChildClassName: string = this.props.isAggregatedQig || this.props.isIncludedInAggregatedTarget ? 'grey-text' : null;
            let secondChildClassName: string = this.props.isIncludedInAggregatedTarget ? 'open-text' : null;
            // Data to show in the children 'span'.
            let firstChildText: string = this.props.isIncludedInAggregatedTarget ?
                closedResponsesCount + ' ' + localeStore.instance.TranslateText('home.qig-data.submitted-text') :
                localeStore.instance.TranslateText('marking.worklist.left-panel.submitted-count-label') + ' ';
            let secondChildText: string = this.props.isIncludedInAggregatedTarget ?
                openResponsesCount + ' ' + localeStore.instance.TranslateText('home.qig-data.in-worklist-text') :
                closedResponsesCount + '/' + maximumMarkingLimit;

            return (
                <div key={this.props.id + '_submittedTargetSection'} className={parentClassName}>
                    <span id={this.props.id + '_submittedTargetText'} className={firstChildClassName}>
                        {firstChildText}
                    </span>
                    <span id={this.props.id + '_submittedTargetValue'} className={secondChildClassName}>
                        {secondChildText}
                    </span>
                </div >
            );
        } else {
            return null;
        }
    }
}

export = TargetProgressCountIndicator;
