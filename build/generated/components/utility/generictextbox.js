"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
// non-typescript require
var classNames = require('classnames');
/**
 * React component class for GenericTextBox
 */
var GenericTextBox = (function (_super) {
    __extends(GenericTextBox, _super);
    /**
     * @constructor
     */
    function GenericTextBox(props, state) {
        _super.call(this, props, state);
        this.state = {
            currentValue: this.props.value
        };
        this.handleChange = this.handleChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    /**
     * Render method
     */
    GenericTextBox.prototype.render = function () {
        return (React.createElement("input", {type: 'text', className: 'text-underline', id: this.props.id, value: this.state.currentValue, onChange: this.handleChange, onFocus: this.onFocus, onKeyDown: this.handleKeyDown, spellCheck: false, "aria-label": this.props.id, ref: 'genericTextBox'}));
    };
    /**
     * This method will set value for login form
     * @param e
     */
    GenericTextBox.prototype.handleChange = function (e) {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value);
    };
    /**
     * Handles the On focus
     * @param {any} e
     */
    GenericTextBox.prototype.onFocus = function (e) {
        this.setState({ currentValue: e.target.value });
        this.props.setValue(e.target.value);
    };
    /**
     * Checking if Enter key is pressed
     * @param {any} e
     */
    GenericTextBox.prototype.handleKeyDown = function (e) {
        if (e.keyCode === 13) {
            this.props.onEnterKeyDown();
        }
    };
    /**
     * This will set state hasError based on props value
     * @param nxtProps
     */
    GenericTextBox.prototype.componentWillReceiveProps = function (nxtProps) {
        var _this = this;
        this.setState({ currentValue: nxtProps.value }, function () {
            _this.refs.genericTextBox.focus();
        });
    };
    return GenericTextBox;
}(pureRenderComponent));
module.exports = GenericTextBox;
//# sourceMappingURL=generictextbox.js.map