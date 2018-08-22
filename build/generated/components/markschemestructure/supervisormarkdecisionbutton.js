"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var SupervisorMarkDecisionButton = (function (_super) {
    __extends(SupervisorMarkDecisionButton, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function SupervisorMarkDecisionButton(props, state) {
        _super.call(this, props, state);
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    /**
     * Render component
     */
    SupervisorMarkDecisionButton.prototype.render = function () {
        var buttonClass = classNames('sprite-icon', {
            'edit-box-yellow-icon': !this.props.isReadonly,
            'edit-box-icon': this.props.isReadonly
        });
        return (React.createElement("a", {href: 'javascript:void(0)', className: 'eur-reason-link menu-button', id: this.props.id, title: (this.props.isReadonly) ?
            localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.decision-tooltip')
            : localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.no-decision-tooltip'), onClick: this.onButtonClick}, React.createElement("span", {className: buttonClass})));
    };
    /**
     * Triggers on decision button click
     */
    SupervisorMarkDecisionButton.prototype.onButtonClick = function (event) {
        this.props.onButtonClick(event);
    };
    return SupervisorMarkDecisionButton;
}(pureRenderComponent));
module.exports = SupervisorMarkDecisionButton;
//# sourceMappingURL=supervisormarkdecisionbutton.js.map