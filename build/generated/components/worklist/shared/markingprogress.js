"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var PureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var SubmitResponse = require('./submitresponse');
var localeHelper = require('../../../utility/locale/localehelper');
var enums = require('../../utility/enums');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var classNames = require('classnames');
var worklistStore = require('../../../stores/worklist/workliststore');
var ClassifyResponse = require('../../standardisationsetup/shared/classifyresponse');
/**
 * React component class for marking progress
 */
var MarkingProgress = (function (_super) {
    __extends(MarkingProgress, _super);
    /**
     * Constructor for MarkingProgress
     * @param props
     * @param state
     */
    function MarkingProgress(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     * @returns
     */
    MarkingProgress.prototype.render = function () {
        if (this.props.responseStatus !== undefined) {
            if (this.props.responseStatus.contains(enums.ResponseStatus.readyToSubmit) &&
                !(this.props.isTeamManagementMode ||
                    worklistStore.instance.isMarkingCheckMode)) {
                if (this.props.standardisationSetupTab === enums.StandardisationSetup.UnClassifiedResponse) {
                    return (React.createElement(ClassifyResponse, {id: this.props.id, key: this.props.id + '_key', isDisabled: false, buttonTextResourceKey: 'standardisation-setup.right-container.classify-button'}));
                }
                else {
                    return (React.createElement(SubmitResponse, {isSubmitAll: false, selectedLanguage: this.props.selectedLanguage, id: this.props.id, key: 'key_' + this.props.id, markGroupId: this.props.markGroupId, isDisabled: this.props.isSubmitDisabled, isTileView: this.props.isTileView, standardisationSetupType: this.props.standardisationSetupTab, stdResponseDetails: this.props.stdResponseDetails}));
                }
            }
            else if (this.props.responseStatus.contains(enums.ResponseStatus.markingNotStarted)) {
                return (((!this.props.isTileView) ? null :
                    React.createElement("div", {className: 'col wl-status text-center', id: this.props.id + '_markingProgress'}, React.createElement("div", {className: 'col-inner'}))));
            }
            else if (this.props.responseStatus.contains(enums.ResponseStatus.definitiveMarkingNotStarted) ||
                this.props.responseStatus.contains(enums.ResponseStatus.NoViewDefinitivesPermisssion)) {
                return (React.createElement("span", {className: 'dim-text txt-val small-text', id: this.props.id + '_provisional'}, localeStore.instance.TranslateText('standardisation-setup.right-container.status-provisional')));
            }
            else {
                return (((!this.props.isTileView) ? React.createElement("span", {className: classNames('inline-bubble oval', {
                    'pink': (this.props.responseStatus.contains(enums.ResponseStatus.hasException) ||
                        this.props.responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
                        this.props.responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
                        this.props.responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected) ||
                        this.props.responseStatus.contains(enums.ResponseStatus.wholeResponseNotAvailable) ||
                        this.props.responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated)) &&
                        !worklistStore.instance.isMarkingCheckMode ?
                        false : true
                }), id: this.props.id + '_markingProgress'}, " ", markerOperationModeFactory.operationMode.showMarkingProgressWithPercentage(this.props.responseStatus.contains(enums.ResponseStatus.markingInProgress))
                    ? localeHelper.toLocaleString(this.props.progress) + '%' : '')
                    :
                        React.createElement("div", {className: 'col wl-status text-center', id: this.props.id + '_markingProgress'}, React.createElement("div", {className: 'col-inner'}, React.createElement("span", {className: classNames('inline-bubble oval', {
                            'pink': this.props.responseStatus.contains(enums.ResponseStatus.hasException) ||
                                this.props.responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
                                this.props.responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
                                this.props.responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected) ||
                                this.props.responseStatus.contains(enums.ResponseStatus.wholeResponseNotAvailable) ||
                                this.props.responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated) ?
                                false : true
                        })}, this.props.responseStatus.contains(enums.ResponseStatus.markingInProgress)
                            ? localeHelper.toLocaleString(this.props.progress) + '%' : '')))));
            }
        }
        else {
            return (null);
        }
    };
    /**
     * Checks if Share button text is visible
     */
    MarkingProgress.prototype.isShareButtonVisible = function () {
        return this.props.standardisationSetupTab === enums.StandardisationSetup.ProvisionalResponse;
    };
    return MarkingProgress;
}(PureRenderComponent));
module.exports = MarkingProgress;
//# sourceMappingURL=markingprogress.js.map