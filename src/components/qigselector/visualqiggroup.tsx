/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import qigInformation = require('../../stores/qigselector/typings/qigsummary');
import Immutable = require('immutable');
import sortHelper = require('../../utility/sorting/sorthelper');
import QigGroup = require('./qiggroup');
import qigSelectorValidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
import enums = require('../utility/enums');
import AggregatedQig = require('./aggregatedqig');
import aggregatedQigValidationResult = require('../../stores/qigselector/aggregatedqigvalidationresult');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    containerPage?: enums.PageContainers;
    qigs: qigInformation[];
    setAnimationOnQigGroupExpandOrCollapse?: Function;
}

/**
 * Class for the visual Group.
 */
class VisualQigGroup extends pureRenderComponent<Props, any> {

    // Validation Helper class object.
    private qigSelectorValidationHelper: qigSelectorValidationHelper;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        // Allocate memory for the Helper class
        this.qigSelectorValidationHelper = new qigSelectorValidationHelper();
    }

    /**
     * Render method for Component Group.
     */
    public render() {

        let qigs = Immutable.List<qigInformation>(this.props.qigs);
        let firstQig: qigInformation = qigs.first();
        let hasAggregatedQigTargets: boolean = firstQig.isAggregateQIGTargetsON;

        // Qig groups.
        let qigGroupToRender: JSX.Element = null;
        // get the Validation Results
        let qigValidationResults: qigValidationResult[] = this.qigSelectorValidationHelper.getValidationResults(qigs);
        if (hasAggregatedQigTargets) {
            // get the aggregated qig validation results.
            let aggregatedQigValidationResult: aggregatedQigValidationResult =
                this.qigSelectorValidationHelper.getAggregatedQigValidationResult(qigs);
            qigGroupToRender = <AggregatedQig
                id='aggregatedQig'
                key='key_aggregatedQig'
                selectedLanguage={this.props.selectedLanguage}
                qigs={qigs}
                normalQigvalidationResults={qigValidationResults}
                aggregatedQigvalidationResult={aggregatedQigValidationResult}
                containerPage={this.props.containerPage}
                setAnimationOnQigGroupExpandOrCollapse={this.props.setAnimationOnQigGroupExpandOrCollapse} />;
        } else {
            qigGroupToRender = <div className='menu-item-content qig-menu-content'>
                <QigGroup qigs={qigs} validationResults={qigValidationResults}
                    selectedLanguage={this.props.selectedLanguage}
                    containerPage={this.props.containerPage}
                    id={'component_' + firstQig.markSchemeGroupId}
                    key={'componentGroup_' + firstQig.markSchemeGroupId} />
            </div>;
        }
        return (
            <div key={'componentGroup_' + firstQig.markSchemeGroupId} className='header-menu-item qig-group-holder'>
                <div className='menu-item-title qig-group-title padding-bottom-10 clearfix'>
                    <div className='qig-component shift-left'>
                        <h6 className='bolder' id={'componentName_' + firstQig.markSchemeGroupId}>
                            {this.getComponentNameFormat(hasAggregatedQigTargets, firstQig)}
                        </h6>
                    </div>
                    <div className='qig-session shift-right'>
                        <h6 id={'sessionName_' + firstQig.markSchemeGroupId}>{firstQig.sessionName}</h6>
                    </div>
                </div>
                {qigGroupToRender}
            </div>
        );
    }

    /**
     * Component Name Format for the Group Header.
     * @param hasAggregatedQigTargets 
     * @param qig 
     */
    private getComponentNameFormat(hasAggregatedQigTargets: boolean, qig: qigInformation): string {
        if (hasAggregatedQigTargets) {
            return qig.assessmentCode + ' - ' + qig.markSchemeGroupName;
        } else {
            return qig.assessmentCode + '/' + qig.componentId;
        }
    }
}

export = VisualQigGroup;
