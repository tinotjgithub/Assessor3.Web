"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var enums = require('../utility/enums');
var keydownHelper = require('../../utility/generic/keydownhelper');
/**
 * React component class for Header for Authorized pages
 */
var ErrorDialogBase = (function (_super) {
    __extends(ErrorDialogBase, _super);
    /**
     * Constructor ErrorDialog
     * @param props
     * @param state
     */
    function ErrorDialogBase(props, state) {
        _super.call(this, props, state);
        this.onViewMore = this.onViewMore.bind(this);
    }
    /**
     * Function for rendering the more information on error dialog
     */
    ErrorDialogBase.prototype.renderMoreInfo = function () {
        /** if showing a custom error, no need to show more info part */
        if (!this.props.isCustomError) {
            return (React.createElement("div", {className: classNames('panel', {
                'open': this.state.isViewMoreOpen === enums.Tristate.open,
                'close': this.state.isViewMoreOpen === enums.Tristate.notSet ?
                    undefined : this.state.isViewMoreOpen === enums.Tristate.open ? false : true
            })}, React.createElement("a", {href: 'javascript:void(0)', onClick: this.onViewMore, className: 'view-more panel-link', title: localeStore.instance.TranslateText('generic.error-dialog.view-more')}, localeStore.instance.TranslateText('generic.error-dialog.view-more')), React.createElement("div", {className: 'error-detail panel-content grey-border-all padding-all-10', "aria-hidden": 'true', dangerouslySetInnerHTML: { __html: this.props.viewMoreContent }})));
        }
    };
    /**
     * Render the OK button of error dialog
     */
    ErrorDialogBase.prototype.renderOKButton = function () {
        return (React.createElement("div", {className: 'popup-footer text-right'}, React.createElement("button", {onClick: this.onOkClick, className: 'button primary rounded close-button', title: localeStore.instance.TranslateText('generic.error-dialog.ok-button')}, localeStore.instance.TranslateText('generic.error-dialog.ok-button'))));
    };
    /**
     * Render header of error dialog
     */
    ErrorDialogBase.prototype.renderErrorDialogHeader = function () {
        return (React.createElement("div", {className: 'popup-header iconic-header'}, React.createElement("span", {className: classNames({
            'error-big-icon sprite-icon': this.props.showErrorIcon
        })}), React.createElement("h4", {id: 'popup5Title', className: 'inline-block border-right: ;'}, this.props.header ?
            localeStore.instance.TranslateText(this.props.header) :
            localeStore.instance.TranslateText('generic.error-dialog.header'))));
    };
    /**
     * On Component Did Update
     */
    ErrorDialogBase.prototype.componentDidUpdate = function () {
        if (this.props.isOpen) {
            keydownHelper.instance.DeActivate(enums.MarkEntryDeactivator.ApplicationPopup);
        }
        else {
            keydownHelper.instance.Activate(enums.MarkEntryDeactivator.ApplicationPopup);
        }
    };
    /**
     * On ok clicked
     * @param evnt
     */
    ErrorDialogBase.prototype.onOkClick = function (evnt) {
        this.props.onOkClick();
        this.setState({
            isViewMoreOpen: enums.Tristate.notSet
        });
    };
    /**
     * On view more clicked
     * @param evnt
     */
    ErrorDialogBase.prototype.onViewMore = function (evnt) {
        this.setState({
            isViewMoreOpen: this.state.isViewMoreOpen === enums.Tristate.open ?
                enums.Tristate.close : enums.Tristate.open
        });
    };
    return ErrorDialogBase;
}(pureRenderComponent));
module.exports = ErrorDialogBase;
//# sourceMappingURL=errordialogbase.js.map