"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='typings/row.ts' />
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var classNames = require('classnames');
var enums = require('../enums');
var qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
var QualityFeedbackBanner = require('../../worklist/banner/qualityfeedbackbanner');
/**
 * Represents the GridControl Component
 */
var GridControl = (function (_super) {
    __extends(GridControl, _super);
    /**
     * Constructor GridControl
     * @param properties
     * @param state
     */
    function GridControl(properties, state) {
        _super.call(this, properties, state);
        /**
         * This method will call callback function
         */
        this.handleClick = function (rowId) {
            this.props.onClickCallBack(rowId);
        };
    }
    /**
     * Render method for GridControl.
     */
    GridControl.prototype.render = function () {
        var that = this;
        var seqIndex;
        var seq;
        var index = -1; // Set to -1 because we need to show banner only at 0 index and increment before return li statement
        var isQualityFeedbackMessageToBeDisplayed = qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(this.props.worklistType);
        if (this.props.gridRows != null) {
            var gridSeq_1 = this.props.gridRows.keySeq();
            seqIndex = 0;
            //Creating grid rows
            var gridRowElements = this.props.gridRows.map(function (gridRow) {
                //Creating grid rows elements
                var gridRowElement = gridRow.getCells().map(function (gridCell) {
                    var gridCellElement = gridCell.columnElement;
                    return (gridCellElement);
                });
                index++;
                return (React.createElement("li", {onClick: that.handleClick.bind(that, gridRow.getRowId()), key: 'gridcomponent_' + gridSeq_1.get(seqIndex++), className: classNames((_a = {},
                    _a[gridRow.getRowStyle()] = true,
                    _a
                )), title: gridRow.getRowTitle()}, gridRowElement, that.renderQualityFeedbackBanner(index, isQualityFeedbackMessageToBeDisplayed)));
                var _a;
            });
            index = -1;
            return (React.createElement("div", {className: classNames('grid-wrapper', { 'show-seed-message': isQualityFeedbackMessageToBeDisplayed })}, React.createElement("ul", {id: this.props.id, key: 'key_' + this.props.id, className: this.props.gridStyle}, gridRowElements)));
        }
        else {
            return (React.createElement("div", {className: 'grid-wrapper'}));
        }
    };
    /**
     * Render quality feedback banner
     * @param {number} index
     * @param {boolean} isQualityFeedbackMessageToBeDisplayed
     * @returns
     */
    GridControl.prototype.renderQualityFeedbackBanner = function (index, isQualityFeedbackMessageToBeDisplayed) {
        if (index === 0 && isQualityFeedbackMessageToBeDisplayed) {
            return (React.createElement(QualityFeedbackBanner, {id: 'quality-feedback-banner', key: 'quality-feedback-banner', isAriaHidden: false, selectedLanguage: this.props.selectedLanguage, header: '', message: qualityFeedbackHelper.getQualityFeedbackStatusMessage(), role: '', bannerType: enums.BannerType.QualityFeedbackBanner}));
        }
    };
    return GridControl;
}(pureRenderComponent));
module.exports = GridControl;
//# sourceMappingURL=gridcontrol.js.map