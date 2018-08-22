"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../../components/utility/enums');
var worklistStore = require('../../stores/worklist/workliststore');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var classNames = require('classnames');
var SupervisorMarkDecisionOption = (function (_super) {
    __extends(SupervisorMarkDecisionOption, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function SupervisorMarkDecisionOption(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * triggers on radio button click
         */
        this.onOptionClick = function (event) {
            event.stopPropagation();
            if (!_this.isClosedOrTeamManagement) {
                _this.props.onOptionClick(_this.props.remarkDecisionType);
            }
        };
        this.onOptionClick = this.onOptionClick.bind(this);
    }
    /**
     * Render component
     */
    SupervisorMarkDecisionOption.prototype.render = function () {
        return (React.createElement("li", {onClick: this.onOptionClick}, React.createElement("input", {type: 'radio', value: 'selected', name: 'remarkDecision', checked: this.props.isSelected, disabled: this.isClosedOrTeamManagement}), React.createElement("label", {htmlFor: 'decideLater', className: (this.isClosedOrTeamManagement) ? 'disabled' : ''}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, this.props.decisionText))));
    };
    Object.defineProperty(SupervisorMarkDecisionOption.prototype, "isClosedOrTeamManagement", {
        /**
         * returns whether the response is closed or in team management
         */
        get: function () {
            return (worklistStore.instance.getResponseMode === enums.ResponseMode.closed
                || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement);
        },
        enumerable: true,
        configurable: true
    });
    return SupervisorMarkDecisionOption;
}(pureRenderComponent));
module.exports = SupervisorMarkDecisionOption;
//# sourceMappingURL=supervisormarkdecisionoption.js.map