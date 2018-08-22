"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var awardingStore = require('../../stores/awarding/awardingstore');
var ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
var awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
var domManager = require('../../utility/generic/domhelper');
var AwardingGridToggleButton = require('./awardinggridtogglebutton');
var AwardingCandidateDetailsView = require('./awardingcandidatedetailsview');
var classNames = require('classnames');
var awardingHelper = require('../utility/awarding/awardinghelper');
var markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
/**
 * React component for Awarding container
 */
var Awarding = (function (_super) {
    __extends(Awarding, _super);
    /**
     * @constructor
     */
    function Awarding(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.busyIndicatorInvoker = enums.BusyIndicatorInvoker.none;
        this.showBackgroundScreenOnBusy = false;
        this._viaUserOption = false;
        /**
         * to hide the awarding dropdowns while clicking outside.
         */
        this.hideAwardingDropdowns = function (event) {
            if (event.target !== undefined &&
                domManager.searchParentNode(event.target, function (el) {
                    return (el.id === 'awd-grade-dropdown'
                        || el.id === 'awd-session-dropdown' || el.id === 'awd-total-dropdown');
                }) == null) {
                if (_this.state.isGradeDropdownOpen === true || _this.state.isSessionDropdownOpen === true ||
                    _this.state.isTotalMarkDropdownOpen === true) {
                    _this.setState({
                        isTotalMarkDropdownOpen: false,
                        isGradeDropdownOpen: false,
                        isSessionDropdownOpen: false
                    });
                }
            }
        };
        /**
         * To rerender
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * setAwardingComponentsSelectin
         */
        this.resetCandidateData = function () {
            var _grade = awardingHelper.getUserOptionData(enums.AwardingFilters.Grade);
            var _totalMark = awardingHelper.getUserOptionData(enums.AwardingFilters.TotalMark);
            _this.setState({
                renderedOn: Date.now(),
                selectedgrade: _grade !== '' && _this._viaUserOption ?
                    _grade : localeStore.instance.TranslateText('awarding.right-panel.all'),
                selectedMark: _totalMark !== '' && _this._viaUserOption ?
                    _totalMark : localeStore.instance.TranslateText('awarding.right-panel.all')
            });
        };
        /**
         * To retrieve candidate details for the selected exam session
         */
        this.retriveAwardingCandidateDetails = function (viaUserOption) {
            var _sessionList = awardingStore.instance.sessionList;
            var _sessionId = awardingHelper.getUserOptionData(enums.AwardingFilters.ExamSessionId);
            _this._viaUserOption = viaUserOption;
            // Check the user option boolean
            var _examSessionId = _sessionId !== '' && viaUserOption ? parseInt(_sessionId)
                : awardingStore.instance.selectedSession.examSessionId;
            awardingActionCreator.getAwardingCandidateDetails(_examSessionId);
            if (viaUserOption === false) {
                awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId, awardingStore.instance.selectedSession.examSessionId, localeStore.instance.TranslateText('awarding.right-panel.all'), localeStore.instance.TranslateText('awarding.right-panel.all'), _this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
            }
            _this.setState({
                selectedsessionId: _examSessionId,
                renderedOn: Date.now()
            });
        };
        /**
         *  method for update the dropdown state
         */
        this.updateDropDownState = function (isSessionDropdownOpen, isGradeDropDownOpen, isTotalMarkDropDownOpen) {
            _this.setState({
                isSessionDropdownOpen: isSessionDropdownOpen,
                isGradeDropdownOpen: isGradeDropDownOpen,
                isTotalMarkDropdownOpen: isTotalMarkDropDownOpen
            });
        };
        /**
         * Load the Awarding Right panel
         */
        this.loadAwardingRightPanel = function () {
            var awardingRightPanel = (React.createElement("div", {id: 'awardingRightPanel', className: 'wrapper'}, React.createElement("div", {id: 'awarding-session-header', className: 'clearfix wl-page-header header-search'}, React.createElement("h3", {className: 'shift-left page-title padding-top-15'}, React.createElement("span", {id: 'awarding-session-header-text', className: 'page-title-text'}, awardingStore.instance.selectedSession &&
                awardingStore.instance.selectedSession.assessmentCode))), React.createElement("div", {className: 'filter-dropdown padding-bottom-10'}, React.createElement("div", null, React.createElement("span", {className: 'menu-label'}, localeStore.instance.TranslateText('awarding.right-panel.session'), ":")), _this.renderSessionList(), React.createElement("div", {id: 'awarding-panel-publish-archive'}, _this.renderSampleStatusIcon())), React.createElement("div", {className: 'message-bar', id: 'blue-message-bar'}, React.createElement("span", {className: 'message-content'}, React.createElement("div", {className: 'text-left'}, React.createElement("p", null, localeStore.instance.TranslateText('awarding.right-panel.blue-banner-text'))))), React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'filter-dropdown padding-bottom-10'}, React.createElement("div", {className: 'items'}, React.createElement("span", {className: 'menu-label'}, localeStore.instance.TranslateText('awarding.right-panel.grade'), " : ")), React.createElement("div", {className: 'items'}, _this.renderGradeList()), React.createElement("div", {className: 'items padding-left-15'}, React.createElement("span", {className: 'menu-label'}, localeStore.instance.TranslateText('awarding.right-panel.total-mark'), ":")), React.createElement("div", {className: 'items'}, _this.renderTotalMarkList()), React.createElement(AwardingGridToggleButton, {switchGridToggle: _this.switchGrid, groupByGrade: _this.state.groupByGrade})), React.createElement("div", {className: 'grid-wrapper'}, awardingStore.instance.awardingCandidateData &&
                awardingStore.instance.selectedSession &&
                React.createElement(AwardingCandidateDetailsView, {id: 'id_awarding_grid', key: 'key-awarding_grid', viewType: _this.state.groupByGrade ? enums.AwardingViewType.Grade :
                    enums.AwardingViewType.Totalmark, renderedOn: _this.state.renderedOn, selectedLanguage: _this.props.selectedLanguage, selectedGrade: _this.state.selectedgrade, selectedMark: _this.state.selectedMark})))));
            return awardingRightPanel;
        };
        var _groupByGrade = awardingHelper.getUserOptionData(enums.AwardingFilters.GroupByGrade);
        this.state = {
            isBusy: false,
            isSessionDropdownOpen: false,
            isGradeDropdownOpen: false,
            isTotalMarkDropdownOpen: false,
            selectedsessionId: 0,
            selectedgrade: localeStore.instance.TranslateText('awarding.right-panel.all'),
            selectedMark: localeStore.instance.TranslateText('awarding.right-panel.all'),
            groupByGrade: _groupByGrade !== '' ?
                (_groupByGrade === 'true' ? true : false) : true,
            renderedOn: Date.now()
        };
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.none, false);
        this.switchGrid = this.switchGrid.bind(this);
    }
    /**
     * Render method
     */
    Awarding.prototype.render = function () {
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'awarding_' + this.busyIndicatorInvoker.toString(), isBusy: this.state.isBusy, key: 'response_' + this.busyIndicatorInvoker.toString(), isMarkingBusy: true, busyIndicatorInvoker: this.busyIndicatorInvoker, doShowDialog: true, showBackgroundScreen: this.showBackgroundScreenOnBusy}));
        return (React.createElement("div", {className: 'column-right'}, React.createElement("a", {href: 'javascript:void(0);', className: 'toggle-left-panel', id: 'side-panel-toggle-button', title: localeStore.instance.TranslateText('awarding.left-panel.show-hide-tooltip'), onClick: this.toggleLeftPanel}, React.createElement("span", {className: 'sprite-icon panel-toggle-icon'}, "panel toggle")), this.loadAwardingRightPanel(), busyIndicator));
    };
    /**
     * componentDidMount React lifecycle event
     */
    Awarding.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this.hideAwardingDropdowns);
        window.addEventListener('click', this.hideAwardingDropdowns);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_COMPONENT_SELECTED, this.retriveAwardingCandidateDetails);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED, this.resetCandidateData);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.reRender);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    Awarding.prototype.componentWillUnmount = function () {
        window.removeEventListener('touchend', this.hideAwardingDropdowns);
        window.removeEventListener('click', this.hideAwardingDropdowns);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_COMPONENT_SELECTED, this.retriveAwardingCandidateDetails);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED, this.resetCandidateData);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.reRender);
    };
    /**
     * method for fetching candidate data while  changing exam session
     */
    Awarding.prototype.selectSessionType = function (selectedSession) {
        var _this = this;
        this._viaUserOption = false;
        if (selectedSession.examSessionId === this.state.selectedsessionId) {
            this.updateDropDownState(!this.state.isSessionDropdownOpen, false, false);
            return;
        }
        var ccPromise = ccActionCreator.getMarkSchemeGroupCCs(selectedSession.markSchemeGroupId, selectedSession.questionPaperID);
        ccPromise.then(function () {
            awardingActionCreator.getAwardingCandidateDetails(selectedSession.examSessionId);
            awardingHelper.saveAwardingFilters(selectedSession.componentId, selectedSession.examSessionId, localeStore.instance.TranslateText('awarding.right-panel.all'), localeStore.instance.TranslateText('awarding.right-panel.all'), _this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
        });
        var markSchemePromise = markSchemeStructureActionCreator.getmarkSchemeStructureList(selectedSession.markSchemeGroupId, 0, false, true, selectedSession.examSessionId, true);
        this.setState({
            selectedsessionId: selectedSession.examSessionId,
            isSessionDropdownOpen: false,
            selectedgrade: 'All'
        });
    };
    /**
     * method for changing candidate data while changing grade
     */
    Awarding.prototype.selectGradeType = function (selectedgrade) {
        var _selectedGrade = selectedgrade.grade ? selectedgrade.grade :
            localeStore.instance.TranslateText('awarding.right-panel.all');
        awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId, awardingStore.instance.selectedSession.examSessionId, _selectedGrade, this.state.selectedMark, this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
        this.setState({
            selectedgrade: _selectedGrade,
            isGradeDropdownOpen: false,
        });
    };
    /**
     * method for changing candidate data while changing mark
     */
    Awarding.prototype.selectMarkType = function (selectedMark) {
        var _selectedTotalMark = selectedMark.totalMark ? selectedMark.totalMark.toFixed(2) :
            localeStore.instance.TranslateText('awarding.right-panel.all');
        awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId, awardingStore.instance.selectedSession.examSessionId, this.state.selectedgrade, _selectedTotalMark, this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
        this.setState({
            selectedMark: _selectedTotalMark,
            isTotalMarkDropdownOpen: false,
        });
    };
    /**
     * This method will call parent component function to toggle left panel
     */
    Awarding.prototype.toggleLeftPanel = function () {
        this.props.toggleLeftPanel();
    };
    /**
     * This method will set the gradelist drop down
     */
    Awarding.prototype.renderGradeList = function () {
        var _this = this;
        var gradeList = (awardingStore.instance.gradeList && awardingStore.instance.gradeList.map(function (item) {
            return (React.createElement("li", {onClick: _this.selectGradeType.bind(_this, item)}, React.createElement("a", {href: 'javascript:void(0);'}, item.grade)));
        }));
        return (awardingStore.instance.gradeList &&
            React.createElement("div", {id: 'awd-grade-dropdown'}, React.createElement("div", {className: classNames('dropdown-wrap white-dropdown', 'awd-grade-dropdown', this.state.isGradeDropdownOpen ? 'open' : false)}, React.createElement("a", {className: 'menu-button', id: 'awd-grade-selected', onClick: function () { _this.updateDropDownState(false, !_this.state.isGradeDropdownOpen, false); }}, React.createElement("span", {className: 'markby-txt'}, this.state.selectedgrade), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement("ul", {className: 'menu', id: 'awd-grade-dropdown-menu'}, React.createElement("li", {onClick: this.selectGradeType.bind(this)}, React.createElement("a", {href: 'javascript:void(0);'}, localeStore.instance.TranslateText('awarding.right-panel.all'))), gradeList))));
    };
    /**
     * This method will set the sessionlist drop down
     */
    Awarding.prototype.renderSessionList = function () {
        var _this = this;
        var _selectedSession;
        var sessionList = (awardingStore.instance.sessionList && awardingStore.instance.sessionList.map(function (item) {
            if (item.examSessionId === _this.state.selectedsessionId) {
                _selectedSession = item.sessionName;
            }
            return (React.createElement("li", {onClick: _this.selectSessionType.bind(_this, item)}, React.createElement("a", {href: 'javascript:void(0);'}, item.sessionName)));
        }));
        return (awardingStore.instance.selectedSession && awardingStore.instance.sessionList &&
            React.createElement("div", {id: 'awd-session-dropdown'}, React.createElement("div", {className: classNames('dropdown-wrap white-dropdown', 'awd-session-dropdown', this.state.isSessionDropdownOpen ? 'open' : false)}, React.createElement("a", {className: 'menu-button', id: 'awd-session-selected', onClick: function () { _this.updateDropDownState(!_this.state.isSessionDropdownOpen, false, false); }}, React.createElement("span", {className: 'markby-txt'}, _selectedSession), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement("ul", {className: 'menu', id: 'awd-session-dropdown-menu'}, sessionList))));
    };
    /**
     * This method will set the sample status icon
     */
    Awarding.prototype.renderSampleStatusIcon = function () {
        var publishedStatusIcon = awardingStore.instance.selectedSession && awardingStore.instance.selectedSession.sampleStatus === 1 ?
            true : false;
        if (publishedStatusIcon) {
            return (React.createElement("span", {className: 'success padding-left-15'}, React.createElement("span", {className: 'sprite-icon success-small-icon'}), React.createElement("span", {className: 'small-text padding-left-5'}, localeStore.instance.TranslateText('awarding.right-panel.published'))));
        }
        else {
            return (React.createElement("span", {className: 'padding-left-15'}, React.createElement("span", {className: 'sprite-icon gray-small-icon'}), React.createElement("span", {className: 'small-text padding-left-5'}, localeStore.instance.TranslateText('awarding.right-panel.archived'))));
        }
    };
    /**
     * This method will set the totalmarks drop down
     */
    Awarding.prototype.renderTotalMarkList = function () {
        var _this = this;
        var markList = (awardingStore.instance.markList &&
            awardingStore.instance.markList.map(function (item) {
                return (React.createElement("li", {onClick: _this.selectMarkType.bind(_this, item)}, React.createElement("a", {href: 'javascript:void(0);'}, item.totalMark.toFixed(2))));
            }));
        return (awardingStore.instance.markList &&
            React.createElement("div", {id: 'awd-total-dropdown'}, React.createElement("div", {className: classNames('dropdown-wrap white-dropdown', 'awd-grade-dropdown', this.state.isTotalMarkDropdownOpen ? 'open' : false)}, React.createElement("a", {className: 'menu-button', id: 'awd-totalmark-selected', onClick: function () { _this.updateDropDownState(false, false, !_this.state.isTotalMarkDropdownOpen); }}, React.createElement("span", {className: 'markby-txt'}, this.state.selectedMark), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement("ul", {className: 'menu', id: 'awd-total-dropdown-menu'}, React.createElement("li", {onClick: this.selectMarkType.bind(this)}, React.createElement("a", {href: 'javascript:void(0);'}, localeStore.instance.TranslateText('awarding.right-panel.all'))), markList))));
    };
    /**
     * Method for toggle grid data
     */
    Awarding.prototype.switchGrid = function () {
        awardingHelper.saveAwardingFilters(awardingStore.instance.selectedComponentId, awardingStore.instance.selectedSession.examSessionId, this.state.selectedgrade, this.state.selectedMark, !this.state.groupByGrade, awardingStore.instance.selectedSession.examProductId);
        this.setState({
            groupByGrade: !this.state.groupByGrade,
        });
    };
    /**
     * Method which sets the busy indicator properties
     * @param busyIndicatorInvoker
     * @param showBackgroundScreenOnBusy
     */
    Awarding.prototype.setBusyIndicatorProperties = function (busyIndicatorInvoker, showBackgroundScreenOnBusy) {
        this.busyIndicatorInvoker = busyIndicatorInvoker;
        this.showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    };
    return Awarding;
}(pureRenderComponent));
module.exports = Awarding;
//# sourceMappingURL=awarding.js.map