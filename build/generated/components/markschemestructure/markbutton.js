"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var stampStore = require('../../stores/stamp/stampstore');
var enums = require('../utility/enums');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var responseStore = require('../../stores/response/responsestore');
/**
 * Marking button.
 * @param {Props} props
 * @returns
 */
var MarkButton = (function (_super) {
    __extends(MarkButton, _super);
    /**
     * Constructor mark button
     * @param {Props} props
     * @param {State} state
     */
    function MarkButton(props, state) {
        _super.call(this, props, state);
        this._className = this.props.className;
        this.onMarkButtonClick = this.onMarkButtonClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    MarkButton.prototype.render = function () {
        return (React.createElement("a", {href: 'javascript:void(0)', className: this.props.className, onClick: this.onMarkButtonClick, onMouseOver: this.onMouseOver, onMouseOut: this.onMouseOut, draggable: false}, this.props.allocatedMark.displayMark));
    };
    /**
     * Click event of mark button
     */
    MarkButton.prototype.onMarkButtonClick = function () {
        if (stampStore.instance.isFavouriteToolbarEmpty
            && responseStore.instance.markingMethod !== enums.MarkingMethod.MarkFromObject
            && !eCourseworkHelper.isDigitalFile()
            && !this.props.isUnzoned
            && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner) {
            return;
        }
        /* updating the new mark to store */
        markingActionCreator.markUpdated(this.props.allocatedMark);
    };
    /**
     * onMouseOver event of mark button to handle the hover color
     */
    MarkButton.prototype.onMouseOver = function () {
        this._className = this._className + ' hover';
        this.setState({ reRenderedOn: Date.now() });
    };
    /**
     * onMouseOut event of mark button to handle the hover color
     */
    MarkButton.prototype.onMouseOut = function () {
        this._className = this._className.replace(' hover', '');
        this.setState({ reRenderedOn: Date.now() });
    };
    return MarkButton;
}(pureRenderComponent));
module.exports = MarkButton;
//# sourceMappingURL=markbutton.js.map