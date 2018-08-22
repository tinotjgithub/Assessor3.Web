/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import markingStore = require('../../stores/marking/markingstore');
import worklistStore = require('../../stores/worklist/workliststore');
let classNames = require('classnames');
import constants = require('../utility/constants');
import enums = require('../utility/enums');
import marksAndAnnotationsVisibilityHelper = require('../../components/utility/marking/marksandannotationsvisibilityhelper');
import responseStore = require('../../stores/response/responsestore');
import responseHelper = require('../utility/responsehelper/responsehelper');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import qigStore = require('../../stores/qigselector/qigstore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import awardingStore = require('../../stores/awarding/awardingstore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    actualMark: string;
    maximumMark: number;
    previousMarksColumnTotals?: Array<any>;
    renderedOn: number;
    markingProgress: number;
    isNonNumeric: boolean;
}

/**
 * Total mark component.
 * @param {Props} props
 * @returns
 */
class MarkSchemeTotalMark extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render method
     */
    public render() {
        if (this.props.isNonNumeric !== true) {
            let setComplexOptionalityCC = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.ComplexOptionality,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            let totalMark = (this.props.markingProgress !== 100 ||
                !(parseInt(this.props.actualMark) >= 0)) &&
                setComplexOptionalityCC
                ? (<span className='mark-version cur'>
                    <span id='progressing-mark-id' className='progressing-mark'
                        title={localeStore.instance.TranslateText('marking.response.mark-scheme-panel.total-marks-cbt')} />
                </span>)
                : (<span className='mark-version cur'>
                    <span className='marks-obtained'>{this.props.actualMark}
                    </span>
                    <span className='total-marks-slash'>/</span>
                    <span className='max-marks'>{(this.props.maximumMark) ? this.props.maximumMark : 0}</span>
                </span>);
            return (<div className='total-mark-holder'>
                <span className='total-marks-label'>
                    {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.total-marks')}
                </span>
                <span className='total-marks'>
                    {totalMark}
                    {this.renderPreviousMarksColumnTotals()}
                </span>
            </div>);
        } else {
            return null;
        }
    }

    /**
     * Method to render previous marks column totals.
     */
    private renderPreviousMarksColumnTotals() {
        if (this.props.previousMarksColumnTotals != null) {
            let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            let visiblityInfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
                    markingStore.instance.currentMarkGroupId);
            let counter = 0;
            let that = this;
            let previousMarkTotals = this.props.previousMarksColumnTotals.map((previousMark: PreviousMark) => {
                counter++;
                // render the mark only if the isMarkVisible is true
                if (visiblityInfo.get(counter).isMarkVisible === true && that.props.isNonNumeric !== true) {
                    return (
                        <span key={'previous-marks-total-' + counter.toString()} className={classNames('mark-version',
                            {
                                'highlight': that.doesTotalMarkDiffer(previousMark.mark.displayMark)
                                    && !responseStore.instance.isWholeResponse
                            })}>
                            <span className='marks-obtained'>
                                <span className={classNames(
                                    { 'strike-out': (previousMark.usedInTotal === false && that.props.isNonNumeric === false) })}>
                                    {!(responseStore.instance.isWholeResponse && responseHelper.isAtypicalResponse()) ?
                                        previousMark.mark.displayMark : ''}
                                </span>
                            </span>
                        </span>
                    );
                }
            });

            return previousMarkTotals;
        }
    }

    /**
     * returns whether the previous total mark differs from the current total mark
     * @param previousMark
     */
    private doesTotalMarkDiffer(previousMark: string): boolean {

        if ((worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.live ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) &&
            this.props.markingProgress === 100) {
            let actualMark: string = this.props.actualMark === undefined ||
                this.props.actualMark == null ? constants.NOT_MARKED : this.props.actualMark.trim();
            let previousMarkValue = previousMark.trim();

            if (actualMark === constants.NOT_MARKED) {
                return false;
            }

            if (actualMark === constants.NOT_ATTEMPTED) {
                return actualMark !== previousMarkValue;
            }

            return parseFloat(actualMark) !== parseFloat(previousMarkValue);
        }

        return false;
    }
}

export = MarkSchemeTotalMark;