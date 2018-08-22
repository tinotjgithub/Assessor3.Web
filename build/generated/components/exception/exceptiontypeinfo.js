"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var ExceptionActionButton = require('./exceptionactionbutton');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
/* tslint:disable:variable-name */
var ExceptionTypeInfo = (function (_super) {
    __extends(ExceptionTypeInfo, _super);
    /**
     * Constructor ExceptionTypeInfo
     * @param props
     * @param state
     */
    function ExceptionTypeInfo(props, state) {
        _super.call(this, props, state);
        //exception description callout padding
        this._calloutPadding = 6;
        // Set the default states
        this.state = {
            showExceptionDescription: false
        };
        this.showExceptionDescription = this.showExceptionDescription.bind(this);
    }
    /**
     * Component will receive props
     */
    ExceptionTypeInfo.prototype.componentWillReceiveProps = function () {
        //close the description when the component recieves new props
        this.setState({
            showExceptionDescription: false
        });
    };
    /**
     * Component did mount
     */
    ExceptionTypeInfo.prototype.componentDidMount = function () {
        //set type call out style based in the exception name width
        this._exceptionTypeSpanWidth = ReactDom.findDOMNode(this.refs.caption).getBoundingClientRect().width;
    };
    /**
     * Component did update
     */
    ExceptionTypeInfo.prototype.componentDidUpdate = function () {
        //set tyhe call out style based in the exception name width
        this._exceptionTypeSpanWidth = ReactDom.findDOMNode(this.refs.caption).getBoundingClientRect().width;
    };
    /**
     * Render
     */
    ExceptionTypeInfo.prototype.render = function () {
        //setting callout style
        var styleCallout = {
            left: this._exceptionTypeSpanWidth + this._calloutPadding
        };
        var closeException = (!markerOperationModeFactory.operationMode.isTeamManagementMode &&
            this.props.status === enums.ExceptionStatus.Resolved ?
            React.createElement(ExceptionActionButton, {id: 'exception_action_close', key: 'exception_action_close', content: localeStore.instance.TranslateText('generic.response.view-exception-panel.' +
                enums.ExceptionActionType[enums.ExceptionActionType.Close]), className: 'sprite-icon tick-round-icon', onActionException: this.props.onActionException.bind(this, enums.ExceptionActionType.Close)})
            : null);
        var escalateException = (this.props.isExceptionActionAvailable &&
            (this.props.alternativeEscalationPoint !==
                enums.EscalationPoint.None || !this.props.isPE) ? React.createElement(ExceptionActionButton, {id: 'exception_action_escalate', key: 'exception_action_escalate', content: localeStore.instance.TranslateText('generic.response.view-exception-panel.' +
            enums.ExceptionActionType[enums.ExceptionActionType.Escalate]), className: 'sprite-icon round-arrow-up-icon', onActionException: this.props.onActionException.bind(this, enums.ExceptionActionType.Escalate)})
            : null);
        var resolveException = (this.props.isExceptionActionAvailable ? React.createElement(ExceptionActionButton, {id: 'exception_action_resolve', key: 'exception_action_resolve', content: localeStore.instance.TranslateText('generic.response.view-exception-panel.' +
            enums.ExceptionActionType[enums.ExceptionActionType.Resolve]), className: 'sprite-icon round-arrow-down-icon', onActionException: this.props.onActionException.bind(this, enums.ExceptionActionType.Resolve)})
            : null);
        var actionException = (React.createElement("div", {className: 'exception-header-right'}, escalateException, resolveException, closeException));
        return (React.createElement("div", {className: classNames('exception-detail-header  panel', this.state.showExceptionDescription ? 'open' : ''), key: 'key_' + this.props.id}, React.createElement("div", {className: 'exception-header-row'}, React.createElement("div", {className: 'exception-header-left'}, React.createElement("div", {className: 'exception-type'}, React.createElement("span", {ref: 'caption', className: 'exception-type-caption'}, localeStore.instance.TranslateText('generic.exception-types.' +
            this.props.exceptionTypeId + '.name')), React.createElement("span", {className: 'sprite-icon info-round-icon panel-link', onClick: this.showExceptionDescription}))), React.createElement("div", {className: classNames('exception-header-right exception-status-holder dim-text ', this.props.status === enums.ExceptionStatus.Resolved ? 'resolved' : '')}, React.createElement("div", {className: 'exception-status'}, React.createElement("div", {className: 'exception-status-text', id: 'current_exception_status'}, localeStore.instance.TranslateText('generic.exception-statuses.' +
            enums.getEnumString(enums.ExceptionStatus, this.props.status).toLowerCase()))))), React.createElement("div", {style: styleCallout, className: 'menu-callout'}), React.createElement("div", {className: 'panel-content exception-type-info padding-all-15', "aria-hidden": 'true'}, localeStore.instance.TranslateText('generic.exception-types.' + this.props.exceptionTypeId + '.details')), React.createElement("div", {className: 'exception-header-row'}, React.createElement("div", {className: 'exception-header-left'}, React.createElement("div", {className: 'exception-question'}, React.createElement("span", {className: 'dim-text'}, localeStore.instance.TranslateText('marking.response.question')), React.createElement("span", {className: 'question-name'}, this.props.questionName))), actionException)));
    };
    /**
     * function to open/close info button
     */
    ExceptionTypeInfo.prototype.showExceptionDescription = function () {
        this.setState({
            showExceptionDescription: this.state.showExceptionDescription === false ? true : false
        });
    };
    return ExceptionTypeInfo;
}(pureRenderComponent));
module.exports = ExceptionTypeInfo;
//# sourceMappingURL=exceptiontypeinfo.js.map