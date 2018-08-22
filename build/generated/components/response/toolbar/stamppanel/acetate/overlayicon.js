"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var localeStore = require('../../../../../stores/locale/localestore');
var PureRenderComponent = require('../../../../base/purerendercomponent');
var classNames = require('classnames');
var enums = require('../../../../utility/enums');
var toolbarActionCreator = require('../../../../../actions/toolbar/toolbaractioncreator');
var overlayHelper = require('../../../../utility/overlay/overlayhelper');
var toolbarStore = require('../../../../../stores/toolbar/toolbarstore');
var responseStore = require('../../../../../stores/response/responsestore');
var markingStore = require('../../../../../stores/marking/markingstore');
var responseActionCreator = require('../../../../../actions/response/responseactioncreator');
/**
 * The overlay icon component
 */
var OverlayIcon = (function (_super) {
    __extends(OverlayIcon, _super);
    function OverlayIcon(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         *  On selecting an overlay
         */
        this.onOverlaySelection = function () {
            if (markingStore.instance.currentQuestionItemInfo.answerItemId !== 0 && !toolbarStore.instance.isMarkingOverlayVisible) {
                if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                    // Calculate fracs.
                    responseActionCreator.structuredFracsDataSet(enums.FracsDataSetActionSource.Acetate);
                }
                toolbarActionCreator.selectAcetate(overlayHelper.getOverlayToolType(_this.props.overlayIcon));
                _this.setState({
                    isSelected: true
                });
            }
        };
        /**
         *  To remove selection after animation end
         */
        this.removeOverlaySelection = function (_selectedAcetate) {
            var that = _this;
            if (_selectedAcetate === overlayHelper.getOverlayToolType(_this.props.overlayIcon)) {
                setTimeout(function () {
                    that.setState({
                        isSelected: false
                    });
                }, 600);
            }
        };
        this.state = {
            isSelected: false,
            overlayIconDisabled: markingStore.instance.currentQuestionItemInfo
                && markingStore.instance.currentQuestionItemInfo.answerItemId === 0
        };
        this.onOverlaySelection = this.onOverlaySelection.bind(this);
        this.removeOverlaySelection = this.removeOverlaySelection.bind(this);
        this.onQuestionItemChanged = this.onQuestionItemChanged.bind(this);
    }
    /**
     * This function gets called when the component is mounted
     */
    OverlayIcon.prototype.componentDidMount = function () {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.removeOverlaySelection);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    OverlayIcon.prototype.componentWillUnmount = function () {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.removeOverlaySelection);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
    };
    /**
     * This method gets the class for overlay icon
     */
    OverlayIcon.prototype.render = function () {
        return (React.createElement("li", {className: classNames('tool-wrap dt', { 'selected': this.state.isSelected }), id: this.props.overlayIcon}, React.createElement("a", {title: localeStore.instance.TranslateText('marking.response.overlays.' + this.props.overlayIcon + '-tooltip'), className: classNames('tool-link', { 'disabled': this.state.overlayIconDisabled }), onClick: this.onOverlaySelection}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: this.props.overlayIcon + '-icon'}, React.createElement("use", {xlinkHref: '#' + this.props.overlayIcon}, "#shadow-root(closed)", React.createElement("g", {id: 'ruler'})))))));
    };
    /**
     *  To rerender overlay icon when question item is changed
     */
    OverlayIcon.prototype.onQuestionItemChanged = function () {
        this.setState({ overlayIconDisabled: markingStore.instance.currentQuestionItemInfo.answerItemId === 0 });
    };
    return OverlayIcon;
}(PureRenderComponent));
module.exports = OverlayIcon;
//# sourceMappingURL=overlayicon.js.map