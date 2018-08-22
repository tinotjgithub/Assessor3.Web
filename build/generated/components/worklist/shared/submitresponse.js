"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Submit response header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var PureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var submitActionCreator = require('../../../actions/submit/submitactioncreator');
var enums = require('../../utility/enums');
var busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
var worklistStore = require('../../../stores/worklist/workliststore');
var markingStore = require('../../../stores/marking/markingstore');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var submitHelper = require('../../utility/submit/submithelper');
var markingHelper = require('../../../utility/markscheme/markinghelper');
var classNames = require('classnames');
var combinedWarningPopupHelper = require('../../utility/popup/responseerrordialoghelper');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var standardisationsetupActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');
/**
 * React component class for submit button
 */
var SubmitResponse = (function (_super) {
    __extends(SubmitResponse, _super);
    /**
     * Constructor for SubmitResponse
     * @param props
     * @param state
     */
    function SubmitResponse(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Change visibility of mark change reason
         */
        this.showHideMarkChangeReason = function () {
            if (_this.props.checkIsSubmitVisible()) {
                _this.isVisible = true;
            }
            else {
                _this.isVisible = false;
            }
            _this.setState({ reRender: Date.now() });
        };
        /**
         * File read status updated event.
         */
        this.fileReadStatusUpdated = function () {
            _this.isVisible = _this.props.checkIsSubmitVisible();
            _this.setState({ reRender: Date.now() });
        };
        this.submitResponseFromMarkscheme = function () {
            if (markingStore.instance.navigateTo === enums.SaveAndNavigate.submit) {
                busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.submitInResponseScreen);
                submitHelper.saveAndSubmitResponse(_this.props.markGroupId);
            }
        };
        this.state = {
            reRender: Date.now()
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.showHideMarkChangeReason = this.showHideMarkChangeReason.bind(this);
        this.isVisible = this.props.isVisible;
    }
    /**
     * Render component
     */
    SubmitResponse.prototype.render = function () {
        /**
         * show multiple/single response submit button
         */
        if (this.props.isSubmitAll) {
            return (React.createElement("button", {id: 'submitResponseAll_' + this.props.id, key: 'submitResponseAll_key_' + this.props.id, title: !this.props.isDisabled ? '' :
                localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button-not-approved-tooltip'), disabled: this.props.isDisabled ? true : false, className: classNames('button primary rounded', {
                'disabled submit-all-rsp-btn': this.props.isDisabled
            }), onClick: this.onSubmit}, localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button'), this.renderSubTextItem()));
        }
        else if (this.props.fromMarkScheme) {
            if (this.isVisible) {
                return (React.createElement("div", {className: 'submit-holder show'}, this.getSubmitButton()));
            }
            else {
                return null;
            }
        }
        else {
            return (((!this.props.isTileView) ?
                this.getSubmitButton() :
                React.createElement("div", {className: 'col wl-status text-center'}, React.createElement("div", {className: 'col-inner'}, this.getSubmitButton()))));
        }
    };
    /**
     * To get the submit button
     */
    SubmitResponse.prototype.getSubmitButton = function () {
        var isfromStandardisationProvResponse = this.props.standardisationSetupType === enums.StandardisationSetup.ProvisionalResponse;
        var className = isfromStandardisationProvResponse ? 'primary button rounded popup-nav shareProv'
            : 'button primary rounded submit-button';
        var id = isfromStandardisationProvResponse ? 'shareProvResponse_'
            : 'submitSingleResponse_';
        var toolTip = isfromStandardisationProvResponse ?
            localeStore.instance.TranslateText('standardisation-setup.right-container.share-button-tooltip') : '';
        if (this.props.fromMarkScheme) {
            className = ' submit-mark rounded primary';
        }
        else if (this.props.isDisabled) {
            className = className + ' disabled';
        }
        var result = React.createElement("button", null);
        result = React.createElement("button", {id: id + this.props.id, key: 'submitSingleResponse_key_' + this.props.id, disabled: this.props.isDisabled ? true : false, title: !this.props.isDisabled ? toolTip :
            localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button-not-approved-tooltip'), className: className, onClick: this.onSubmit}, 
        // For provisional worklist in standardisationsetup, instead of submit we should show share button
        isfromStandardisationProvResponse ?
            localeStore.instance.TranslateText('standardisation-setup.right-container.share-button') :
            localeStore.instance.TranslateText('marking.worklist.response-data.submit-button'));
        return result;
    };
    /**
     * componentDidMount
     */
    SubmitResponse.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.submitResponseFromMarkscheme);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED, this.fileReadStatusUpdated);
    };
    /**
     * componentWillUnmount
     */
    SubmitResponse.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.submitResponseFromMarkscheme);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED, this.fileReadStatusUpdated);
    };
    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    SubmitResponse.prototype.componentWillReceiveProps = function (nextProps) {
        this.isVisible = nextProps.isVisible;
    };
    /**
     * Method to indicate whether to show the sub text for the case where Submit button is disabled;
     * since the subtext needs to be shown only in disabled state
     */
    SubmitResponse.prototype.renderSubTextItem = function () {
        if (this.props.isDisabled) {
            return (React.createElement("span", {className: classNames('', {
                'awaiting-feedback-msg text-middle small-text': this.props.isDisabled
            })}, localeStore.instance.TranslateText('marking.worklist.action-buttons.submit-button-suspended-indicator')));
        }
    };
    /**
     * On clicking submit
     */
    SubmitResponse.prototype.onSubmit = function (e) {
        //on submitting simulation response, show a confirmation popup before submit
        if (!applicationActionCreator.checkActionInterrupted()) {
            return;
        }
        if (this.props.standardisationSetupType === enums.StandardisationSetup.ProvisionalResponse) {
            //ActionCreator for showing Share Response Popup
            standardisationsetupActionCreator.shareResponsePopupOpen(this.props.stdResponseDetails);
            return;
        }
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
            markingActionCreator.showSimulationResponseSubmitConfirmationPopup(this.props.markGroupId, this.props.fromMarkScheme);
            if (!this.props.fromMarkScheme) {
                /* stopping propagation because the parent li has a click event in tile view
                which should not work when submit is clicked
                 */
                e.stopPropagation();
            }
        }
        else if (this.props.fromMarkScheme) {
            var navigatePossible = true;
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.length > 0) {
                navigatePossible = false;
                var combinedWarningMessages = combinedWarningPopupHelper.getCombinedWarningMessage(enums.SaveAndNavigate.submit, responseNavigationFailureReasons);
                markingActionCreator.showResponseNavigationFailureReasons(enums.SaveAndNavigate.submit, combinedWarningMessages);
            }
            if (navigatePossible) {
                busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.submitInResponseScreen);
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
            }
        }
        else {
            var markGroupId = void 0;
            if (this.props.isSubmitAll) {
                markGroupId = 0;
            }
            else {
                markGroupId = this.props.markGroupId;
            }
            submitActionCreator.submitResponseStarted(markGroupId);
            /* stopping propagation because the parent li has a click event in tile view
            which should not work when submit is clicked
             */
            e.stopPropagation();
        }
    };
    return SubmitResponse;
}(PureRenderComponent));
module.exports = SubmitResponse;
//# sourceMappingURL=submitresponse.js.map