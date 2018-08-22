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
/**
 * Class for displaying worklist message.
 */
var PendingWorklistBanner = (function (_super) {
    __extends(PendingWorklistBanner, _super);
    /**
     * Constructor for worklist message
     * @param props
     */
    function PendingWorklistBanner(props) {
        _super.call(this, props, null);
    }
    /**
     * Render component
     */
    PendingWorklistBanner.prototype.render = function () {
        if (this.props.isVisible) {
            return (React.createElement("div", {className: 'message-bar'}, React.createElement("span", {className: 'message-content'}, React.createElement("div", {className: 'text-left', id: 'pendingWorklistBannerId'}, localeStore.instance.TranslateText('marking.worklist.submitted-editable-worklist-helper')))));
        }
        else {
            return null;
        }
    };
    return PendingWorklistBanner;
}(pureRenderComponent));
module.exports = PendingWorklistBanner;
//# sourceMappingURL=pendingworklistbanner.js.map