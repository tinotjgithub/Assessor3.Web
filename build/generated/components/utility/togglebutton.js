"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var classNames = require('classnames');
var pureRenderComponent = require('../base/purerendercomponent');
/**
 * React component class for Ask on Logout confirmation
 */
var ToggleButton = (function (_super) {
    __extends(ToggleButton, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function ToggleButton(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.onToggleChange = function () {
            _this.props.onChange(_this.props.index, !_this.props.isChecked, _this.props.displayId);
        };
        this.onToggleChange = this.onToggleChange.bind(this);
    }
    /**
     * Render method
     */
    ToggleButton.prototype.render = function () {
        return (React.createElement("div", {className: classNames('toggle-button', this.props.className), "aria-pressed": 'false', style: this.props.style, title: this.props.title}, React.createElement("input", {type: 'checkbox', id: this.props.id + '_toggle_button', "data-value": this.props.isChecked, checked: this.props.isChecked, onChange: this.onToggleChange, disabled: this.props.isDisabled}), React.createElement("label", {className: 'toggle-label', id: this.props.id + '_label', htmlFor: this.props.id + '_toggle_button', title: this.props.title}, React.createElement("div", {className: 'toggle-content'}, React.createElement("div", {className: 'on-text'}, this.props.onText), React.createElement("div", {className: 'off-text'}, this.props.offText)), React.createElement("div", {className: 'toggle-switch'}))));
    };
    return ToggleButton;
}(pureRenderComponent));
module.exports = ToggleButton;
//# sourceMappingURL=togglebutton.js.map