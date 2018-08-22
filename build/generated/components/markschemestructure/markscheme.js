"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var MarkSchemeBase = require('./markschemebase');
var constants = require('../utility/constants');
var MarkScheme = (function (_super) {
    __extends(MarkScheme, _super);
    /**
     * @constructor
     */
    function MarkScheme(props, state) {
        _super.call(this, props, state);
        this.onMarkSchemeClicked = this.onMarkSchemeClicked.bind(this);
    }
    /**
     * Render method
     */
    MarkScheme.prototype.render = function () {
        var usedInTotalClass = this.getClassForNotUsedInTotal(this.props.node.allocatedMarks.displayMark);
        var classname = 'question-item';
        var markValue;
        markValue = this.isTotalMarkVisible() === true ? this.props.node.allocatedMarks.displayMark : '';
        if (markValue === constants.NOT_ATTEMPTED) {
            markValue = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
        }
        if (this.props.node.allocatedMarks.displayMark !== '-') {
            classname = 'question-item marked-question';
        }
        classname = classname;
        return (React.createElement("a", {href: 'javascript:void(0)', className: classname, onClick: this.onMarkSchemeClicked, tabIndex: -1}, React.createElement("span", {className: 'question-text', title: this.title}, React.createElement("span", {className: usedInTotalClass}, this.props.node.name)), this.renderLinkIndicator(), this.props.node.isUnZonedItem ? this.renderUnzonedIndicator() : null, React.createElement("span", {className: 'question-mark'}, React.createElement("span", {className: 'mark-version cur' + usedInTotalClass}, React.createElement("span", {className: 'mark'}, markValue), React.createElement("span", null, (this.props.isNonNumeric === true) ? '' : '/'), React.createElement("span", {className: 'mark-total'}, (this.props.isNonNumeric === true) ? ''
            : this.props.node.maximumNumericMark)), this.renderPreviousMarks())));
    };
    /**
     * Binded method to invoke the markscheme selection.
     */
    MarkScheme.prototype.onMarkSchemeClicked = function () {
        this.props.navigateToMarkScheme(this.props.node);
    };
    /**
     * This function gets invoked when the component is about to be mounted.
     */
    MarkScheme.prototype.componentDidMount = function () {
        // this will be set only once as dealing with direct DOM is heavy.
        // Transform Style is applying based on the mark scheme height. While message is open, mark scheme component is not rendered in DOM
        // and the height wont be returned, using the mark scheme height from Constants.
        this.elementHeight = constants.MARK_SCHEME_HEIGHT; // markSchemeHelper.getDomOffSet(this);
        if (this.props.node.isSelected === true) {
            this.props.onMarkSchemeSelected(this.props.node.index, this.elementHeight);
        }
    };
    /**
     * This function gets invoked when the component is about to be updated.
     */
    MarkScheme.prototype.componentDidUpdate = function () {
        // When the component has been rendered and if the markscheme is selected,
        // update the selection on UI.
        if (this.props.node.isSelected === true) {
            this.props.onMarkSchemeSelected(this.props.node.index, this.elementHeight);
        }
    };
    return MarkScheme;
}(MarkSchemeBase));
module.exports = MarkScheme;
//# sourceMappingURL=markscheme.js.map