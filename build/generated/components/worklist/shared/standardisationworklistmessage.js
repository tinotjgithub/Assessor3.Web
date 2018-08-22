"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var StandardisationWorkListMessage = (function (_super) {
    __extends(StandardisationWorkListMessage, _super);
    /**
     * Constructor for StandardisationWorklistMessage
     * @param props
     */
    function StandardisationWorkListMessage(props) {
        _super.call(this, props, null);
    }
    /**
     * Render component
     */
    StandardisationWorkListMessage.prototype.render = function () {
        return (React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'grid-wrapper', id: this.props.id}, React.createElement("div", {className: 'message-box worklist-msgs wait-advise-msg'}, React.createElement("h3", {className: 'bolder msg-title'}, localeStore.instance.TranslateText('marking.worklist.not-approved-helper.header')), React.createElement("p", {className: 'message-body'}, " "), React.createElement("p", null, localeStore.instance.TranslateText('marking.worklist.not-approved-helper.body-line-1')), React.createElement("p", null, localeStore.instance.TranslateText('marking.worklist.not-approved-helper.body-line-2'), " "), React.createElement("p", null)))));
    };
    return StandardisationWorkListMessage;
}(pureRenderComponent));
module.exports = StandardisationWorkListMessage;
//# sourceMappingURL=standardisationworklistmessage.js.map