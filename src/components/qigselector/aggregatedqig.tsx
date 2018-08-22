import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import qigInformation = require('../../stores/qigselector/typings/qigsummary');
import Immutable = require('immutable');
import QigGroup = require('./qiggroup');
import enums = require('../utility/enums');
import LinearProgressIndicator = require('../utility/progressindicator/linearprogressindicator');
import RemarkIndicator = require('./remarkindicator');
import QigVersionsLink = require('./qigversionslink');
import ResponseAvailabilityIndicator = require('./responseavailabilityindicator');
import TargetProgressCountIndicator = require('./targetprogresscountindicator');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');
import aggregatedQigValidationResult = require('../../stores/qigselector/aggregatedqigvalidationresult');
import qigselectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import qigStore = require('../../stores/qigselector/qigstore');

let classNames = require('classnames');
const QIG_MAX_HEIGHT: number = 125;

/**
 * Properties of the component.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    qigs: Immutable.List<qigInformation>;
    aggregatedQigvalidationResult: aggregatedQigValidationResult;
    normalQigvalidationResults: qigValidationResult[];
    containerPage?: enums.PageContainers;
    setAnimationOnQigGroupExpandOrCollapse?: Function;
}

/**
 * States of the component.
 */
interface State {
    isOpen: boolean;
}

/**
 * Component for showing the aggregated Qig .
 */
class AggregatedQig extends pureRenderComponent<Props, State> {
    private aggregatedQig: qigInformation;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.aggregatedQig = this.props.qigs.first();
        this.state = {
            isOpen: qigStore.instance.qigStatus(this.aggregatedQig.groupId)
        };
        this.onQigVersionLinkClick = this.onQigVersionLinkClick.bind(this);
    }

    /**
     * Render method.
     */
    public render() {
        let classNameToUse: string = classNames('menu-item-content qig-menu-content panel', this.state.isOpen ? 'open' : 'close');
        let style: React.CSSProperties = {
            maxHeight: QIG_MAX_HEIGHT * this.props.normalQigvalidationResults.length + 'px'
        };
        let firstQig: qigInformation = this.aggregatedQig;
        return (
            <div className={classNameToUse}>
                <div className='qig-wrapper' id={this.props.id}>
                    <div className='qig-col12 qig-col vertical-middle'>
                        <div className='middle-content'>
                            {this.renderMarkingStatusContent()}
                            <LinearProgressIndicator id={this.props.id + 'ProgressIndicator'}
                                key={this.props.id + 'progressIndicator'}
                                qigValidationResult={this.props.aggregatedQigvalidationResult}
                                isAggregatedTarget={true} />
                            <RemarkIndicator
                                id={this.props.id + 'Remarkindicator'}
                                key={this.props.id + 'Remarkindicator'}
                                selectedLanguage={this.props.selectedLanguage}
                                qigValidationResult={this.props.aggregatedQigvalidationResult} />
                        </div>
                    </div>
                    <QigVersionsLink id='qigVersionsLink'
                        key='key_qigVersionsLink'
                        onQigVersionLinkClick={this.onQigVersionLinkClick} />
                </div>
                <div className='panel-content' aria-hidden={true} style={style}>
                    <QigGroup qigs={this.sortedQigs} validationResults={this.props.normalQigvalidationResults}
                        selectedLanguage={this.props.selectedLanguage}
                        containerPage={this.props.containerPage}
                        id={'component_' + firstQig.markSchemeGroupId}
                        key={'componentGroup_' + firstQig.markSchemeGroupId} />
                </div>
            </div>
        );
    }

    /**
     * Renders the marking status content.`
     */
    private renderMarkingStatusContent(): JSX.Element {
        return (
            <div className='middle-content-inner'>
                <div className='progress-title middle-content-left'>
                    <span className='progress-title-text'>{this.props.aggregatedQigvalidationResult.statusText}</span>
                    <ResponseAvailabilityIndicator id={this.props.id + '_responseAvailabilityIndicatorID'}
                        key={this.props.id + '_responseAvailabilityIndicatorKey'}
                        qigValidationResult={this.props.aggregatedQigvalidationResult} />
                </div>
                <TargetProgressCountIndicator id={this.props.id + '_targetProgressCountIndicatorID'}
                    key={this.props.id + '_targetProgressCountIndicatorKey'}
                    selectedLanguage={this.props.selectedLanguage}
                    qigValidationResult={this.props.aggregatedQigvalidationResult}
                    isAggregatedQig={true}
                    isIncludedInAggregatedTarget={false} />
            </div>
        );
    }

    /**
     * On clicking qig versions link.
     */
    private onQigVersionLinkClick = () => {
        let groupid = this.aggregatedQig.groupId;
        this.setState({
            isOpen: !this.state.isOpen
        });
        qigselectorActionCreator.expandOrCollapseAggregatedQig(groupid);
        this.props.setAnimationOnQigGroupExpandOrCollapse();
    }

    /**
     * Returns the qigs sorted w.r.t component identifier.
     */
    private get sortedQigs() : Immutable.List<qigInformation> {
        let sortedQigs: Immutable.List<qigInformation> = Immutable.List<qigInformation>();
        sortedQigs = this.props.qigs;
        sortedQigs.sort(function(a: qigInformation, b: qigInformation) {
            if (a.componentId < b.componentId) {
                return -1;
            }
            if (a.componentId > b.componentId) {
                return 1;
            }
            return 0;
        });
        return sortedQigs;
    }
}

export = AggregatedQig;
