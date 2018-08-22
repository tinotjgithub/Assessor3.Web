/// <reference path='typings/row.ts' />
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
let classNames = require('classnames');
import enums = require('../enums');
import qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
import QualityFeedbackBanner = require('../../worklist/banner/qualityfeedbackbanner');

/**
 * Properties of GridControl component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    gridRows: Immutable.List<Row>;
    gridStyle: string;
    onClickCallBack: Function;
    worklistType: enums.WorklistType;
}

/**
 * Represents the GridControl Component
 */
class GridControl extends pureRenderComponent<Props, any> {

    /**
     * Constructor GridControl
     * @param properties
     * @param state
     */
    constructor(properties: Props, state: any) {
        super(properties, state);
    }

    /**
     * Render method for GridControl.
     */
    public render() {
        let that = this;
        let seqIndex: number;
        let seq: string;
        let index: number = -1; // Set to -1 because we need to show banner only at 0 index and increment before return li statement
        let isQualityFeedbackMessageToBeDisplayed: boolean =
            qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(this.props.worklistType);

        if (this.props.gridRows != null) {
            let gridSeq = this.props.gridRows.keySeq();
            seqIndex = 0;
            //Creating grid rows
            let gridRowElements = this.props.gridRows.map(function (gridRow: Row) {
                //Creating grid rows elements
                let gridRowElement = gridRow.getCells().map(function (gridCell: Cell) {
                    let gridCellElement = gridCell.columnElement;
                    return (
                        gridCellElement
                    );
                });

                index++;

                return (
                    <li onClick={that.handleClick.bind(that, gridRow.getRowId()) } key = {'gridcomponent_' + gridSeq.get(seqIndex++) }
                        className = {classNames(
                            {
                                [gridRow.getRowStyle()]: true
                            }
                        ) }
                        title={gridRow.getRowTitle() }
                        >
                        {gridRowElement}
                        {that.renderQualityFeedbackBanner(index, isQualityFeedbackMessageToBeDisplayed)}
                    </li>
                );
            }
            );

            index = -1;

            return (
                <div className = { classNames('grid-wrapper', { 'show-seed-message': isQualityFeedbackMessageToBeDisplayed }) }>
                    <ul id= {this.props.id} key= {'key_' + this.props.id} className={this.props.gridStyle}>
                        {gridRowElements}
                    </ul>
                </div>
            );
        } else {
            return (
                <div className = 'grid-wrapper'>
                </div>
            );
        }
    }

    /**
     * This method will call callback function
     */
    private handleClick = function (rowId: number): void {
        this.props.onClickCallBack(rowId);
    };

    /**
     * Render quality feedback banner
     * @param {number} index
     * @param {boolean} isQualityFeedbackMessageToBeDisplayed
     * @returns
     */
    private renderQualityFeedbackBanner(index: number, isQualityFeedbackMessageToBeDisplayed: boolean) {
        if (index === 0 && isQualityFeedbackMessageToBeDisplayed) {

            return (<QualityFeedbackBanner
                id = 'quality-feedback-banner'
                key = 'quality-feedback-banner'
                isAriaHidden = { false}
                selectedLanguage = { this.props.selectedLanguage }
                header = ''
                message = { qualityFeedbackHelper.getQualityFeedbackStatusMessage() }
                role = ''
                bannerType = { enums.BannerType.QualityFeedbackBanner } />);
        }
    }
}
export = GridControl;