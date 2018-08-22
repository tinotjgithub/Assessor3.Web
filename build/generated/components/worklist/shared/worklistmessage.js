"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='gridtogglebutton.tsx' />
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var localeHelper = require('../../../utility/locale/localehelper');
/**
 * Class for displaying worklist message.
 */
var WorkListMessage = (function (_super) {
    __extends(WorkListMessage, _super);
    /**
     * Constructor for worklist message
     * @param props
     */
    function WorkListMessage(props) {
        _super.call(this, props, null);
        this.worklistEmptyMessage = '';
    }
    /**
     * Render component
     * @returns
     */
    WorkListMessage.prototype.render = function () {
        if (this.props.hasResponsesAvailableInPool === true) {
            if (!this.props.isSimulation) {
                this.worklistEmptyMessage = localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.body-line-2');
                /** Replacing the message with concurrent limit */
                this.worklistEmptyMessage = this.worklistEmptyMessage.replace('{0}', localeHelper.toLocaleString(this.props.responseConcurrentLimit));
                return (React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'grid-wrapper', id: this.props.id}, React.createElement("div", {className: 'message-box dark-msg info-guide callout download-resp-msg'}, React.createElement("h4", {id: this.props.id + '_messageHeader', className: 'bolder padding-bottom-10'}, localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.header')), React.createElement("p", {id: this.props.id + '_messageContent', className: 'message-body'}, localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.body-line-1'), " ", React.createElement("br", null), this.worklistEmptyMessage, " ", React.createElement("br", null), React.createElement("br", null), localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.body-line-3'))))));
            }
            else {
                return (React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'grid-wrapper', id: this.props.id}, React.createElement("div", {className: 'message-box text-left float-msg dark-msg info-guide callout download-resp-msg'}, React.createElement("h4", {id: this.props.id + '_messageHeader', className: 'bolder padding-bottom-10'}, localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.header')), React.createElement("p", {id: this.props.id + '_messageContent1', className: 'message-body'}, localeStore.instance.TranslateText('marking.worklist.simulation-helper.body-line-1')), React.createElement("p", {id: this.props.id + '_messageContent2', className: 'message-body padding-top-10'}, localeStore.instance.TranslateText('marking.worklist.simulation-helper.body-line-2'))))));
            }
        }
        else if (this.props.hasTargetCompleted === true) {
            return (React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'grid-wrapper', id: this.props.id}, React.createElement("div", {className: 'message-box dark-msg float-msg info-guide download-resp-msg'}, React.createElement("h4", {id: this.props.id + '_messageHeader', className: 'bolder padding-bottom-10'}, localeStore.instance.TranslateText('marking.worklist.marking-target-complete-helper.header')), React.createElement("p", {id: this.props.id + '_messageContent', className: 'message-body'}, localeStore.instance.TranslateText('marking.worklist.marking-target-complete-helper.body'), " ")))));
        }
        else {
            return (React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'grid-wrapper', id: this.props.id}, React.createElement("div", {className: 'message-box dark-msg info-guide download-resp-msg'}, React.createElement("h4", {id: this.props.id + '_messageHeader', className: 'bolder padding-bottom-10'}, localeStore.instance.TranslateText('marking.worklist.no-responses-available-helper.header')), React.createElement("p", {id: this.props.id + '_messageContent', className: 'message-body'}, localeStore.instance.TranslateText('marking.worklist.no-responses-available-helper.body'))))));
        }
    };
    return WorkListMessage;
}(pureRenderComponent));
module.exports = WorkListMessage;
//# sourceMappingURL=worklistmessage.js.map