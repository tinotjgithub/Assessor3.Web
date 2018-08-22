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
/**
 * React component class for Script Status
 */
var ScriptStatusGridElement = (function (_super) {
    __extends(ScriptStatusGridElement, _super);
    /**
     * Constructor for Script Status
     * @param props Props
     * @param state State
     */
    function ScriptStatusGridElement(props, state) {
        _super.call(this, props, state);
        this.classNameText = '';
    }
    /**
     * Render component
     */
    ScriptStatusGridElement.prototype.render = function () {
        var parentClass = '';
        var isAvailable = (!this.props.isAllocatedALive
            && !this.props.isUsedForProvisionalMarking);
        var available = (isAvailable) ? localeStore.instance.
            TranslateText('standardisation-setup.right-container.available-status') : localeStore.instance.
            TranslateText('standardisation-setup.right-container.not-available-status');
        if (isAvailable) {
            this.classNameText = 'sprite-icon success-small-icon text-middle';
            parentClass = 'success';
        }
        else {
            this.classNameText = 'sprite-icon not-small-black-icon text-middle';
        }
        return (React.createElement("span", {className: parentClass, id: 'status_' + this.props.id}, React.createElement("span", {className: this.classNameText}), React.createElement("span", {className: 'small-text padding-left-5'}, available)));
    };
    return ScriptStatusGridElement;
}(pureRenderComponent));
module.exports = ScriptStatusGridElement;
//# sourceMappingURL=scriptstatusgridelement.js.map