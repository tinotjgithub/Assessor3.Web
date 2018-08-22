"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Reuse button header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var PureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var ReuseButton = (function (_super) {
    __extends(ReuseButton, _super);
    /**
     * Constructor for ReuseButton
     * @param props
     * @param state
     */
    function ReuseButton(props, state) {
        _super.call(this, props, state);
        this.state = {
            reRender: Date.now()
        };
    }
    /**
     * Render component
     */
    ReuseButton.prototype.render = function () {
        return (React.createElement("button", {id: 'reuse_button_id_' + this.props.id, key: 'reuse_button_key_' + this.props.id, disabled: this.props.isDisabled ? true : false, title: (this.props.isDisabled ?
            localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.disable-tooltip')
            : localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.enable-tooltip')), className: 'primary button rounded popup-nav reusebtn', onClick: this.onReuseClick}, (this.props.isDisabled ? localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.disable')
            : localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.enable'))));
    };
    /**
     * On Reuse click
     */
    ReuseButton.prototype.onReuseClick = function () {
        // Need to implement
    };
    return ReuseButton;
}(PureRenderComponent));
module.exports = ReuseButton;
//# sourceMappingURL=reusebutton.js.map