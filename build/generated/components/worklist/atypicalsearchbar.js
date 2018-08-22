"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var responseactioncreator = require('../../actions/response/responseactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var enums = require('../utility/enums');
var responseStore = require('../../stores/response/responsestore');
var applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
/**
 * React component.
 * @param {Props} props
 * @returns
 */
var AtypicalSearchBar = (function (_super) {
    __extends(AtypicalSearchBar, _super);
    /**
     * Constructor for atypical search bar
     * @param props
     * @param state
     */
    function AtypicalSearchBar(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.centerNumber = '';
        this.candidateNumber = '';
        /**
         * Triggered to reset the center and candidate search field.
         */
        this.resetAtypicalSearchField = function (result) {
            if (!result || result.searchResultCode === enums.SearchResultCode.MarkerNotApproved ||
                result.searchResultCode === enums.SearchResultCode.MarkerSuspended) {
                _this.refs.atyCenterName.value = '';
                _this.refs.atyCandidateName.value = '';
                _this.setState({
                    isCenterValueSet: false,
                    isCandidateValueSet: false
                });
            }
        };
        /**
         * Triggered to reset the center and candidate search field if marker got suspended on atypical response allocation.
         */
        this.onResponseAllocated = function (responseAllocationErrorCode) {
            if (responseAllocationErrorCode !== enums.ResponseAllocationErrorCode.suspendedMarker) {
                _this.resetAtypicalSearchField();
            }
        };
        /**
         * This method will call on Atypical Center number onChange event
         */
        this.onAtypicalCenterChange = function (event) {
            var a = event.target.value;
            if (a.trim().length > 0) {
                _this.centerNumber = a.trim();
                _this.setState({
                    isCenterValueSet: true,
                    isCandidateValueSet: _this.state.isCandidateValueSet
                });
            }
            else {
                _this.setState({
                    isCenterValueSet: false,
                    isCandidateValueSet: _this.state.isCandidateValueSet
                });
            }
        };
        /**
         * This method will call on Atypical Candidate number onChange event
         */
        this.onAtypicalCandiadateChange = function (event) {
            var a = event.target.value;
            if (a.trim().length > 0) {
                _this.candidateNumber = a.trim();
                _this.setState({
                    isCenterValueSet: _this.state.isCenterValueSet,
                    isCandidateValueSet: true
                });
            }
            else {
                _this.setState({
                    isCenterValueSet: _this.state.isCenterValueSet,
                    isCandidateValueSet: false
                });
            }
        };
        this.state = {
            isCenterValueSet: false,
            isCandidateValueSet: false
        };
    }
    /**
     * render component
     */
    AtypicalSearchBar.prototype.render = function () {
        return React.createElement("div", {className: 'atypical-search-wrap middle-content'}, React.createElement("div", {className: 'aty-center'}, React.createElement("label", {htmlFor: 'atyCenter', className: (this.props.disableControls) ? 'disabled' : ''}, localeStore.instance.TranslateText('marking.worklist.atypical.centre-search-label')), React.createElement("input", {type: 'text', name: 'atyCenterName', onChange: this.onAtypicalCenterChange, ref: 'atyCenterName', id: 'atyCenter', disabled: this.props.disableControls, maxLength: 128, className: 'search-input Center', title: (this.props.disableControls) ?
            localeStore.instance.TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-disabled') :
            localeStore.instance.TranslateText('marking.worklist.atypical.centre-search-tooltip')})), React.createElement("div", {className: 'aty-candidate'}, React.createElement("label", {htmlFor: 'atyCandidate', className: (this.props.disableControls) ? 'disabled' : ''}, localeStore.instance.TranslateText('marking.worklist.atypical.candidate-search-label')), React.createElement("input", {type: 'text', name: 'atyCandidateName', onChange: this.onAtypicalCandiadateChange, ref: 'atyCandidateName', id: 'atyCandidate', disabled: this.props.disableControls, maxLength: 128, className: 'search-input Candidate', title: (this.props.disableControls) ?
            localeStore.instance.TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-disabled') :
            localeStore.instance.TranslateText('marking.worklist.atypical.candidate-search-tooltip')})), React.createElement("div", {className: 'aty-search-btn'}, React.createElement("button", {className: (((this.state.isCenterValueSet && this.state.isCandidateValueSet) === false)
            || this.props.disableControls) ?
            'btn primary rounded disabled' : 'btn primary rounded', title: (this.props.disableControls) ?
            localeStore.instance.TranslateText('marking.worklist.atypical-search-error-dialog.atypical-search-error-disabled') :
            localeStore.instance.TranslateText('marking.worklist.atypical.search-button-tooltip'), id: 'atySearch', onClick: this.onAtypicalSearchButtonClick.bind(this)}, localeStore.instance.TranslateText('marking.worklist.atypical.search-button'))));
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    AtypicalSearchBar.prototype.componentDidMount = function () {
        responseStore.instance.addListener(responseStore.ResponseStore.RESET_ATYPICAL_SEARCH_FIELD, this.resetAtypicalSearchField);
        responseStore.instance.addListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.resetAtypicalSearchField);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    AtypicalSearchBar.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESET_ATYPICAL_SEARCH_FIELD, this.resetAtypicalSearchField);
        responseStore.instance.removeListener(responseStore.ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this.resetAtypicalSearchField);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ALLOCATED_EVENT, this.onResponseAllocated);
    };
    /**
     * Method which handles the click event of Atypical response search button.
     */
    AtypicalSearchBar.prototype.onAtypicalSearchButtonClick = function () {
        if (!applicationactioncreator.checkActionInterrupted()) {
            return;
        }
        if (this.state.isCenterValueSet && this.state.isCandidateValueSet) {
            // set the sarch parameter
            var searchAtypicalResponseArgument = {
                candidateNumber: this.candidateNumber,
                centreNumber: this.centerNumber,
                examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
            };
            responseactioncreator.searchAtypicalResponse(searchAtypicalResponseArgument);
        }
    };
    return AtypicalSearchBar;
}(pureRenderComponent));
module.exports = AtypicalSearchBar;
//# sourceMappingURL=atypicalSearchBar.js.map