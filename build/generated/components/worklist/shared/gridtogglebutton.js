"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var enums = require('../../utility/enums');
/**
 * React component
 * @param {Props} props
 */
var GridToggleButton = (function (_super) {
    __extends(GridToggleButton, _super);
    /**
     * Constructor for Grid toggle button
     * @param props
     * @param state
     */
    function GridToggleButton(props, state) {
        _super.call(this, props, state);
        this.toggleView = this.toggleView.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    GridToggleButton.prototype.render = function () {
        var buttonTitle;
        var iconStyle;
        var click;
        var _class;
        if (this.props.buttonType === enums.GridType.tiled) {
            buttonTitle = localeStore.instance.TranslateText('marking.worklist.view-switcher.tile-view');
            iconStyle = 'sprite-icon tile-view-icon';
        }
        else if (this.props.buttonType === enums.GridType.detailed) {
            buttonTitle = localeStore.instance.TranslateText('marking.worklist.view-switcher.list-view');
            iconStyle = 'sprite-icon grid-view-icon';
        }
        else if (this.props.buttonType === enums.GridType.markByQuestion) {
            buttonTitle = localeStore.instance.TranslateText('standardisation-setup.view-switcher.mark-by-question-view');
            iconStyle = 'sprite-icon view-total-mark-icon';
        }
        else if (this.props.buttonType === enums.GridType.totalMarks) {
            buttonTitle = localeStore.instance.TranslateText('standardisation-setup.view-switcher.total-mark-view');
            iconStyle = 'sprite-icon grid-view-icon';
        }
        if (this.props.isSelected) {
            _class = 'switch-view active';
            click = null;
        }
        else {
            _class = 'switch-view';
            click = this.toggleView;
        }
        return (React.createElement("a", {href: 'javascript:void(0)', title: buttonTitle, key: 'key_' + this.props.id, id: this.props.id, onClick: click, className: _class}, React.createElement("span", {className: iconStyle}), React.createElement("span", {className: 'view-text', id: this.props.id + '_ToggleText'}, buttonTitle)));
    };
    /**
     * this will toggle the grid view (tile/detail).
     */
    GridToggleButton.prototype.toggleView = function (evnt) {
        this.props.toggleGridView();
    };
    return GridToggleButton;
}(pureRenderComponent));
module.exports = GridToggleButton;
//# sourceMappingURL=gridtogglebutton.js.map