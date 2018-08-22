"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var markingStore = require('../../stores/marking/markingstore');
var enums = require('../utility/enums');
var applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
/**
 * FullResponseViewButton class
 * @param {Props} props
 * @param {any} any
 * @returns
 */
var FullResponseViewButton = (function (_super) {
    __extends(FullResponseViewButton, _super);
    /**
     * @constructor
     */
    function FullResponseViewButton(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Navigate to full response view after saving mark if there is any
         */
        this.navigateAwayFromResponse = function () {
            /* if the full response view button is clicked, move to full response view */
            if (_this.props.onFullResponseClick != null &&
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toFullResponseview) {
                _this.props.onFullResponseClick();
            }
        };
        this.handleClick = this.handleClick.bind(this);
    }
    /**
     * Render method
     */
    FullResponseViewButton.prototype.render = function () {
        var svgPointerEventsStyle = {};
        svgPointerEventsStyle.pointerEvents = 'none';
        return (React.createElement("li", {className: 'mrk-change-view'}, React.createElement("a", {onClick: this.handleClick, title: localeStore.instance.TranslateText('marking.response.left-toolbar.full-response-view-button-tooltip'), id: this.props.id}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'change-resp-view-icon', style: svgPointerEventsStyle, role: 'img'}, React.createElement("title", null, localeStore.instance.TranslateText('marking.response.left-toolbar.full-response-view-button-tooltip')), React.createElement("use", {xlinkHref: '#icon-change-resp-view'}))))));
    };
    /**
     * Handles the full response view icon click
     */
    FullResponseViewButton.prototype.handleClick = function () {
        if (!applicationActionCreator.checkActionInterrupted()) {
        }
        /* Save the selected mark scheme mark to the mark collection on response move */
        if (markingStore.instance.isMarkingInProgress) {
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
        }
        else {
            /* navigating from a response which is in view mode doesn't require save marks */
            this.props.onFullResponseClick();
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    FullResponseViewButton.prototype.componentDidMount = function () {
        /* will be called after saving the currently entered amrk into the collection */
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    FullResponseViewButton.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
    };
    return FullResponseViewButton;
}(pureRenderComponent));
module.exports = FullResponseViewButton;
//# sourceMappingURL=fullresponseviewbutton.js.map