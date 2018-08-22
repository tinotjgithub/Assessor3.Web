/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import MarksDifference = require('./marksdifference');
import AccuracyIndicator = require('./accuracyindicator');
import worklistStore = require('../../../stores/worklist/workliststore');
import enums = require('../../utility/enums');
import qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    absoluteMarksDifference?: number;
    totalMarksDifference?: number;
    accuracyIndicator?: number;
    isTileView?: boolean;
    showAccuracyIndicator: boolean;
    markSchemeGroupId: number;
}

class MarksDifferenceColumn extends PureRenderComponent<Props, any> {
    private classNameAmd: string = 'amd small-text';
    private classNameTmd: string = 'tmd small-text';
    private titleAmd: string = markerOperationModeFactory.operationMode.absoluteMarkDifferenceTitle;
    private titleTmd: string = markerOperationModeFactory.operationMode.totalMarkDifferenceTitle;
    private marksDifferenceTextAmd: string = 'marking.worklist.tile-view-labels.amd';
    private marksDifferenceTextTmd: string = 'marking.worklist.tile-view-labels.tmd';
    private absoluteMarksDifference: number = 0;
    private totalMarksDifference: number = 0;

    /**
     * Constructor for MarksDiffrenceColumn
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {

        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;

        let _isShowStandardisationDefinitiveMarks = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks,
            this.props.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        this.absoluteMarksDifference = this.props.absoluteMarksDifference;
        this.totalMarksDifference = this.props.totalMarksDifference;

        let showAccuracyIndicator: boolean = true;
        let showAMDTMD: boolean = true;
        let className: string = 'col wl-tolerance';

        if (!this.props.isTileView) {
            showAccuracyIndicator = false;
            className = 'col wl-amdtmd';
            if (this.props.accuracyIndicator === enums.AccuracyIndicatorType.Accurate
                || this.props.accuracyIndicator === enums.AccuracyIndicatorType.AccurateNR || this.props.accuracyIndicator === 0) {
                showAMDTMD = false;
            }
        } else {
            if (this.props.showAccuracyIndicator) {
                if (this.props.accuracyIndicator === enums.AccuracyIndicatorType.Accurate
                    || this.props.accuracyIndicator === enums.AccuracyIndicatorType.AccurateNR
                    || this.props.accuracyIndicator === 0) {
                    showAccuracyIndicator = true;
                    showAMDTMD = false;
                }
            } else {
                showAccuracyIndicator = false;
                showAMDTMD = false;
            }
        }

        // render only if AMD value is set
        let amdMarksDifference: JSX.Element = showAMDTMD ? (<MarksDifference
            id={this.props.id + '_amd'}
            key={'key_amd_' + this.props.id}
            className={this.classNameAmd}
            title={this.titleAmd}
            marksDifferenceText={this.marksDifferenceTextAmd}
            marksDifference={this.props.absoluteMarksDifference}
            selectedLanguage={this.props.selectedLanguage}
            marksDifferenceType = {enums.MarksDifferenceType.AbsoluteMarksDifference}
            isTileView={this.props.isTileView}
            />) : null;

        // render only if TMD value is set
        let tmdMarksDifference: JSX.Element = showAMDTMD ? (<MarksDifference
            id={this.props.id + '_tmd'}
            key={'key_tmd_' + this.props.id}
            className={this.classNameTmd}
            title={this.titleTmd}
            marksDifferenceText={this.marksDifferenceTextTmd}
            marksDifference={this.props.totalMarksDifference}
            selectedLanguage={this.props.selectedLanguage}
            marksDifferenceType = {enums.MarksDifferenceType.TotalMarksDifference}
            isTileView={this.props.isTileView}
            />) : null;

        let accuracy: JSX.Element = showAccuracyIndicator ? (<AccuracyIndicator
            id={this.props.id} key={this.props.id} accuracyIndicator={this.props.accuracyIndicator} isTileView={this.props.isTileView}
            selectedLanguage={this.props.selectedLanguage}/>) : null;

        // do not render if both flags are false.
        let markWithAccuracy: JSX.Element = (showAccuracyIndicator || showAMDTMD) ? (
            <div className='worklist-tile-footer'>
                <div className={className} id={this.props.id + '_marksDifference'}>
                    <div className='col-inner'>
                        {accuracy}
                        {amdMarksDifference}
                        {tmdMarksDifference}
                    </div>
                </div>
            </div>) : null;

        return (
            markWithAccuracy
        );
    }
}

export = MarksDifferenceColumn;

