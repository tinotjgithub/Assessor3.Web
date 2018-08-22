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
var SupervisorMarkDecisionButton = require('./supervisormarkdecisionbutton');
var enums = require('../../components/utility/enums');
var RemarkDecision = require('./supervisormarkdecisionoption');
var markingStore = require('../../stores/marking/markingstore');
var classNames = require('classnames');
var SupervisorMarkDecision = (function (_super) {
    __extends(SupervisorMarkDecision, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function SupervisorMarkDecision(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.remarkDecisionType = undefined;
        /**
         * triggers on remark decision button click.
         */
        this.onButtonClick = function (event) {
            event.stopPropagation();
            _this.setState({
                isOpen: !_this.state.isOpen,
                renderedOn: Date.now()
            });
        };
        /**
         * to hide the decision panel on clicking outside the box.
         */
        this.hideDecisionBox = function () {
            if (_this.state.isOpen === true) {
                _this.setState({
                    isOpen: false,
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * triggers on remark decision box click. To prevent the window click so that the box will not hide.
         */
        this.onDecisionBoxClick = function (event) {
            event.stopPropagation();
        };
        /**
         * Open supervisor remark decision.
         */
        this.openSupervisorRemarkDecision = function () {
            _this.setState({
                isOpen: true,
                renderedOn: Date.now()
            });
        };
        /**
         * triggers on radio button click
         */
        this.onOptionClick = function (remarkDecisionType) {
            if (_this.remarkDecisionType !== remarkDecisionType) {
                _this.remarkDecisionType = remarkDecisionType;
                _this.props.onRemarkDecisionChange(remarkDecisionType);
                _this.setState({
                    isOpen: false,
                    renderedOn: Date.now()
                });
            }
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.hideDecisionBox = this.hideDecisionBox.bind(this);
        this.onDecisionBoxClick = this.onDecisionBoxClick.bind(this);
        this.calculateAccuracy = this.calculateAccuracy.bind(this);
        this.remarkDecisionType = this.props.supervisorRemarkDecisionType;
        this.state = {
            isOpen: undefined,
            renderedOn: Date.now()
        };
    }
    /**
     * Render component
     */
    SupervisorMarkDecision.prototype.render = function () {
        var className = classNames('eur-reason-holder icon-menu-wrap dropdown-wrap up white supervisor-remark-decision', {
            'close': (this.state.isOpen === false),
            'open': (this.state.isOpen === true)
        });
        var accuracyText = this.getAccuracyText(this.accuracyIndicator);
        return (React.createElement("div", {className: className, onClick: this.onDecisionBoxClick}, React.createElement(SupervisorMarkDecisionButton, {isReadonly: !(this.remarkDecisionType === undefined
            || this.remarkDecisionType === enums.SupervisorRemarkDecisionType.none), key: this.props.key + '_button', id: 'remarkdecisonButton', onButtonClick: this.onButtonClick, selectedLanguage: this.props.selectedLanguage}), React.createElement("div", {className: 'menu-callout'}), React.createElement("div", {className: 'menu'}, React.createElement("h4", {className: 'eur-reason-title bolder padding-bottom-15'}, localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.popout-header')), React.createElement("div", {className: 'eur-reason-options'}, React.createElement("p", {className: 'eur-accuracy-levels dim-text'}, React.createElement("span", {className: 'eur-accuracy-label'}, localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.absolute-mark-difference') + ':'), React.createElement("span", {className: 'eur-accuracy-mark', id: 'amdvalue'}, this.absoluteMarkDifference), React.createElement("br", null), React.createElement("span", {className: 'eur-accuracy-label'}, localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.total-mark-difference') + ':'), React.createElement("span", {className: 'eur-accuracy-mark', id: 'tmdvalue'}, this.totalMarkDifference)), React.createElement("p", {className: 'eur-original-accuracy dim-text'}, React.createElement("span", {className: 'eur-original-accuracy-label'}, localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.original-mark-accuracy') + ':'), React.createElement("span", {className: this.accurayClassName, id: 'originalmarkaccuracy'}, accuracyText)), React.createElement("p", {className: 'eur-option-title'}, localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.popout-body')), React.createElement("ul", {className: 'remark-decision-options', id: 'remarkdecisionoptions'}, this.remarkDecisionElement)))));
    };
    /**
     * triggers once compenent is mounted.
     */
    SupervisorMarkDecision.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT, this.calculateAccuracy);
        window.addEventListener('click', this.hideDecisionBox);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION, this.openSupervisorRemarkDecision);
    };
    /**
     * triggers on unmounting the component.
     */
    SupervisorMarkDecision.prototype.componentDidUnMount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT, this.calculateAccuracy);
        window.removeEventListener('click', this.hideDecisionBox);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION, this.openSupervisorRemarkDecision);
    };
    /**
     * triggers while the component receives the props.
     */
    SupervisorMarkDecision.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props !== nextProps) {
            this.accuracyIndicator = nextProps.accuracy;
            this.absoluteMarkDifference = nextProps.amd;
            this.totalMarkDifference = nextProps.tmd;
            this.remarkDecisionType = nextProps.supervisorRemarkDecisionType;
        }
    };
    /**
     * Returns the accuracy name of given accuracy type
     * @param {enums.AccuracyIndicatorType} type
     * @returns
     */
    SupervisorMarkDecision.prototype.getAccuracyText = function (accuracyIndicatorType) {
        var accuracyTypeName = '';
        switch (accuracyIndicatorType) {
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                accuracyTypeName = 'inaccurate';
                this.accurayClassName = 'eur-accuracy-mark error';
                this.setInaccurateRemarDecisions();
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                accuracyTypeName = 'in-tolerance';
                this.accurayClassName = 'eur-accuracy-mark warning';
                this.setAccurateRemarDecisions();
                break;
            default:
                accuracyTypeName = 'accurate';
                this.accurayClassName = 'eur-accuracy-mark success';
                this.setAccurateRemarDecisions();
                break;
        }
        return localeStore.instance.TranslateText('generic.accuracy-indicators.' + accuracyTypeName);
    };
    /**
     * Set remark decison elements for accurate
     */
    SupervisorMarkDecision.prototype.setAccurateRemarDecisions = function () {
        var options = [
            enums.SupervisorRemarkDecisionType.none,
            enums.SupervisorRemarkDecisionType.nonjudgementalerror,
            enums.SupervisorRemarkDecisionType.originalmarks
        ];
        var that = this;
        this.remarkDecisionElement = options.map(function (value) {
            return (React.createElement(RemarkDecision, {decisionText: localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.' +
                enums.getEnumString(enums.SupervisorRemarkDecisionType, value)), isSelected: (value === that.remarkDecisionType ||
                (that.remarkDecisionType === undefined && value === enums.SupervisorRemarkDecisionType.none)), onOptionClick: that.onOptionClick, id: 'remarkdecisonoption_' + value, key: 'remarkdecisonoption_' + value, remarkDecisionType: value, selectedLanguage: that.props.selectedLanguage}));
        });
    };
    /**
     * Set remark decison elements for inaccurate and in tolerance
     */
    SupervisorMarkDecision.prototype.setInaccurateRemarDecisions = function () {
        var options = [
            enums.SupervisorRemarkDecisionType.none,
            enums.SupervisorRemarkDecisionType.nonjudgementalerror,
            enums.SupervisorRemarkDecisionType.judgementaloutsidetolerance
        ];
        var that = this;
        this.remarkDecisionElement = options.map(function (value) {
            return (React.createElement(RemarkDecision, {decisionText: localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.' +
                enums.getEnumString(enums.SupervisorRemarkDecisionType, value)), isSelected: (value === that.remarkDecisionType ||
                (that.remarkDecisionType === undefined && value === enums.SupervisorRemarkDecisionType.none)), onOptionClick: that.onOptionClick, id: 'remarkdecisonoption_' + value, key: 'remarkdecisonoption_' + value, remarkDecisionType: value, selectedLanguage: that.props.selectedLanguage}));
        });
    };
    /**
     * function to calculate and set the accuracy indaicator based on accuracy rules while marking reaches 100%.
     */
    SupervisorMarkDecision.prototype.calculateAccuracy = function () {
        var accuracy = this.props.calculateAccuracy();
        this.accuracyIndicator = accuracy[0];
        this.absoluteMarkDifference = accuracy[1];
        this.totalMarkDifference = accuracy[2];
    };
    return SupervisorMarkDecision;
}(pureRenderComponent));
module.exports = SupervisorMarkDecision;
//# sourceMappingURL=supervisormarkdecision.js.map