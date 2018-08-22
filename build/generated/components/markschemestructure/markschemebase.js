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
var constants = require('../utility/constants');
var treeViewDataHelper = require('../../utility/treeviewhelpers/treeviewdatahelper');
var Mark = require('./mark');
var markingStore = require('../../stores/marking/markingstore');
var enums = require('../utility/enums');
var marksAndAnnotationsVisibilityHelper = require('../utility/marking/marksandannotationsvisibilityhelper');
var responseStore = require('../../stores/response/responsestore');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
/**
 * base component class for marckshceme panel child nodes .
 */
var MarkSchemeBase = (function (_super) {
    __extends(MarkSchemeBase, _super);
    /**
     * @constructor
     */
    function MarkSchemeBase(props, state) {
        _super.call(this, props, state);
        this.STRIKE_CLASS = ' strike-out';
        this.title = this.props.node.name;
        this.treeViewHelper = new treeViewDataHelper();
    }
    /**
     * get the strike out class name for those nodes not used in total
     */
    MarkSchemeBase.prototype.getClassForNotUsedInTotal = function (mark) {
        if (this.props.node.usedInTotal === false && this.props.isNonNumeric !== true && mark !== '-' && mark !== '') {
            this.title = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.optionality-tooltip');
            return this.STRIKE_CLASS;
        }
        this.title = this.props.node.name;
        return '';
    };
    /**
     * get the marked cluster/answeritem class if all markschemes under this cluster is marked
     */
    MarkSchemeBase.prototype.getClassForMarkedCluster = function () {
        var className = '';
        if (this.props.node.markSchemeCount === this.props.node.markCount) {
            className = ' marked-question';
        }
        return className;
    };
    /**
     * Render the previous marks.
     */
    MarkSchemeBase.prototype.renderPreviousMarks = function () {
        var _this = this;
        if (this.treeViewHelper.canRenderPreviousMarks()) {
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var visiblityInfo_1 = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
            if (this.props.node.previousMarks != null
                && (this.props.node.itemType === enums.TreeViewItemType.marksScheme
                    || this.props.isNonNumeric !== true)) {
                /*Previous Marks only need to shown for expanded qigs in markschemepanel
                 for whole response according to US-57116 Re-marking of pooled atypical whole response from any QIG*/
                var previousMarks_1 = responseStore.instance.isWholeResponse && markingStore.instance.currentQuestionItemInfo &&
                    markingStore.instance.currentQuestionItemInfo.markSchemeGroupId ===
                        this.props.node.markSchemeGroupId;
                var counter_1 = 0;
                var previousMarkItems = this.props.node.previousMarks.map(function (previousMark) {
                    counter_1++;
                    // render the mark only if the isMarkVisible is true
                    if (visiblityInfo_1.get(counter_1) && visiblityInfo_1.get(counter_1).isMarkVisible === true) {
                        return (React.createElement(Mark, {id: _this.props.id + 'remarks-cluster-item' + counter_1.toString(), key: _this.props.id + 'remarks-cluster-item' + counter_1.toString(), mark: previousMarks_1 ? previousMark.mark.displayMark :
                            !responseStore.instance.isWholeResponse ? previousMark.mark.displayMark : '', showMarksChangedIndicator: _this.hasMarksChanged(_this.props.node, previousMark.mark.displayMark), usedInTotal: previousMark.usedInTotal, isNonNumeric: _this.props.isNonNumeric}));
                    }
                });
                return previousMarkItems;
            }
        }
    };
    /**
     * Returns whether the marks has changed comparing the current mark with the previous mark
     * @param treeNode
     * @param previousMarkValue
     */
    MarkSchemeBase.prototype.hasMarksChanged = function (treeNode, previousMarkValue) {
        if (this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Practice ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Standardisation ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Secondstandardisation ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Seed ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.DirectedRemark ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.PooledRemark) {
            var currentMark = void 0;
            switch (treeNode.itemType) {
                case enums.TreeViewItemType.cluster:
                case enums.TreeViewItemType.answerItem:
                    if (treeNode.markCount === treeNode.markSchemeCount) {
                        currentMark = treeNode.totalMarks === undefined ||
                            treeNode.totalMarks == null ? constants.NOT_MARKED : treeNode.totalMarks.trim();
                    }
                    else {
                        return false;
                    }
                    break;
                default:
                    currentMark = treeNode.allocatedMarks === undefined ||
                        treeNode.allocatedMarks == null ? constants.NOT_MARKED : treeNode.allocatedMarks.displayMark;
                    break;
            }
            if (isNaN(parseFloat(currentMark))) {
                if (currentMark === constants.NOT_ATTEMPTED) {
                    return currentMark !== previousMarkValue;
                }
                else if (currentMark === constants.NOT_MARKED) {
                    return false;
                }
            }
            else {
                return isNaN(parseFloat(previousMarkValue)) ? true : parseFloat(currentMark) !== parseFloat(previousMarkValue);
            }
        }
        return false;
    };
    /**
     * return whether the display mark is visible or not
     */
    MarkSchemeBase.prototype.isMarkVisible = function () {
        return ((this.props.isNonNumeric === true) ? false : true);
    };
    /**
     * return whether to display the total mark.
     */
    MarkSchemeBase.prototype.isTotalMarkVisible = function () {
        return !(markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup);
    };
    /**
     * return the unzoned indicator
     */
    MarkSchemeBase.prototype.renderUnzonedIndicator = function () {
        return (React.createElement("span", {className: 'unzone-indication', title: localeStore.instance.
            TranslateText('marking.response.mark-scheme-panel.unzoned-indicator-tooltip')}, React.createElement("span", {className: 'svg-icon unzoned-icon'}, React.createElement("svg", {viewBox: '0 0 18 22', className: 'unzoned-content-icon'}, React.createElement("use", {xlinkHref: '#unzoned-content'})))));
    };
    /**
     * return jsx element for link indicator
     */
    MarkSchemeBase.prototype.renderLinkIndicator = function () {
        if (this.props.linkedItems && this.props.linkedItems.contains(this.props.node.uniqueId)) {
            var toolTip = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.link-indicator-tooltip');
            var linkIndicatorId = 'markscheme_panel_link_icon_' + this.props.node.bIndex.toString();
            return markSchemeHelper.renderLinkIndicator(linkIndicatorId, toolTip);
        }
        return null;
    };
    return MarkSchemeBase;
}(pureRenderComponent));
module.exports = MarkSchemeBase;
//# sourceMappingURL=markschemebase.js.map