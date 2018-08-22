/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import localeStore = require('../../stores/locale/localestore');
import constants = require('../utility/constants');
import MarkSchemeBase = require('./markschemebase');
import Mark = require('./mark');

class AnswerItem extends MarkSchemeBase {

    /**
     * Constructor answer item
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
        this.title = this.props.node.name;
        this.onAnswerItemClicked = this.onAnswerItemClicked.bind(this);
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

            totalMark = this.isTotalMarkVisible() === true  ? (this.props.node.totalMarks ? this.props.node.totalMarks : '0') : '';
            maxMark = (this.props.node.maximumNumericMark) ? this.props.node.maximumNumericMark.toString() : '0';

            /* if the total mark is NR for an answer item, translate the same when showing it in the UI */
            if (totalMark === constants.NOT_ATTEMPTED) {
                totalMark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
            }
        }

        return (
            <a href='javascript:void(0)' className={classname} onClick={this.onAnswerItemClicked} tabIndex={-1}>
                <span className={'question-text'}
                    title={this.title}>
                    <span className={usedInTotalClass}>
                        {this.props.node.name}
                    </span>
                </span>
                {this.renderLinkIndicator()}
                {this.props.node.isUnZonedItem ? this.renderUnzonedIndicator() : null}
                <span className='question-mark'>
                    <span className={'mark-version cur' + usedInTotalClass}>
                        <span className='mark'>{totalMark}</span>
                        <span>{(this.isMarkVisible() === true) ? '/' : ''}</span>
                        <span className='mark-total'>{maxMark}</span>
                    </span>
                    {this.renderPreviousMarks()}
                </span>
            </a>
        );
    }

    /**
     * Notfiy the click and select the fist markable item
     */
    private onAnswerItemClicked(): void {
        this.props.navigateToMarkScheme(this.props.node);
    }
}

export = AnswerItem;
