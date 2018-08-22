"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
/**
 * React component class for Generic button implementation.
 */
var GenericButton = (function (_super) {
    __extends(GenericButton, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function GenericButton(props, state) {
        _super.call(this, props, state);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }
    /**
     * Render method
     */
    GenericButton.prototype.render = function () {
        var buttonElement;
        buttonElement = (React.createElement("button", {id: this.props.id, title: this.props.title, className: this.props.className, onClick: this.onClick, disabled: this.props.disabled, onDoubleClick: this.onDoubleClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, onMouseOver: this.onMouseOver}, this.props.content, this.props.childrens != null ? this.props.childrens : null));
        return buttonElement;
    };
    /**
     * Component did mount
     */
    GenericButton.prototype.componentDidMount = function () {
        applicationStore.instance.setMaxListeners(0);
    };
    /**
     * Handles the single click event.
     * @param evnt
     */
    GenericButton.prototype.onClick = function (evnt) {
        if (this.props.onClick != null) {
            this.props.onClick(evnt);
        }
    };
    /**
     * Handles the double click event.
     * @param evnt
     */
    GenericButton.prototype.onDoubleClick = function (evnt) {
        if (this.props.onDoubleClick != null) {
            this.props.onDoubleClick();
        }
    };
    /**
     * Handles the mouse enter event.
     * @param evnt
     */
    GenericButton.prototype.onMouseEnter = function (evnt) {
        if (this.props.onMouseEnter != null) {
            this.props.onMouseEnter();
        }
    };
    /**
     * Handles the mouse leave event.
     * @param evnt
     */
    GenericButton.prototype.onMouseLeave = function (evnt) {
        if (this.props.onMouseLeave != null) {
            this.props.onMouseLeave();
        }
    };
    /**
     * Handles the mouse over event.
     * @param evnt
     */
    GenericButton.prototype.onMouseOver = function (evnt) {
        if (this.props.onMouseOver != null) {
            this.props.onMouseOver();
        }
    };
    return GenericButton;
}(pureRenderComponent));
module.exports = GenericButton;
//# sourceMappingURL=genericbutton.js.map