/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import constants = require('../utility/constants');
import localeStore = require('../../stores/locale/localestore');
import MarkSchemeBase = require('./markschemebase');
import enums = require('../utility/enums');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import qigStore = require('../../stores/qigselector/qigstore');
import Mark = require('./mark');

class Cluster extends MarkSchemeBase {

    /**
     * Constructor cluster
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
        this.title = this.props.node.name;
        this.onClusterClicked = this.onClusterClicked.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let usedInTotalClass = this.getClassForNotUsedInTotal(this.props.node.totalMarks);
        let classname = 'question-item';
        classname = classname + this.getClassForMarkedCluster();

        let maxMark: string = '';
        let totalMark: string = '';

        if (this.isMarkVisible() === true) {

            totalMark =  this.isTotalMarkVisible() === true ? (this.props.node.totalMarks ? this.props.node.totalMarks : '0') : '';
            maxMark = (this.props.node.maximumNumericMark) ? this.props.node.maximumNumericMark.toString() : '0';

            /* if the total mark is NR for an answer item, translate the same when showing it in the UI */
            if (totalMark === constants.NOT_ATTEMPTED) {
                totalMark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
            }
		}

		let setComplexOptionalityCC = configurableCharacteristicsHelper.getCharacteristicValue(
			configurableCharacteristicsNames.ComplexOptionality,
			qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
		let maxMarkRender = (setComplexOptionalityCC ?
			null : (<span className={'mark-version cur' + usedInTotalClass}>
				<span className='mark'>{totalMark}</span>
				<span>{(this.isMarkVisible() === true) ? '/' : ''}</span>
				<span className='mark-total'>{maxMark}</span>
			</span>));
		let previousMarkRender = setComplexOptionalityCC ? null : this.renderPreviousMarks();

        return (
            <a href='javascript:void(0)' className={classname} onClick={this.onClusterClicked} tabIndex={-1}>
                <span className = { 'question-text' }
                    title={this.title}>
                    <span className={usedInTotalClass}>
                        {this.props.node.name}
                    </span>
                    </span>
                <span className = 'question-mark'>
					{maxMarkRender}
					{previousMarkRender}
                    </span>
                </a>
        );
    }

    /**
     * Invoke the click event to notify and select the first markable markascheme
     */
    private onClusterClicked(): void {
        if (!(this.props.node.itemType === enums.TreeViewItemType.QIG && this.props.isOpen === true)) {
            this.props.navigateToMarkScheme(this.props.node);
        }
    }
}

export = Cluster;
