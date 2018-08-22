"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Reactdom = require('react-dom');
var pureRenderComponent = require('../../../base/purerendercomponent');
var CommentBox = require('./commentbox');
var stampStore = require('../../../../stores/stamp/stampstore');
var markingStore = require('../../../../stores/marking/markingstore');
var classNames = require('classnames');
var colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var constants = require('../../../utility/constants');
var enums = require('../../../utility/enums');
var onPageCommentHelper = require('../../../utility/annotation/onpagecommenthelper');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var CommentLine = require('./commentline');
var userInfoStore = require('../../../../stores/userinfo/userinfostore');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var GREYGAP_FRACTION = 0.03;
/* tslint:disable:variable-name  */
/** Component for comment Spacer - Gap between the boxes to maintain the boxes vertical to comment annotation */
var CommentBoxSpacer = function (props) {
    var paddingTopStyle;
    var aspectRatio = props.overlayHeight / props.overlayWidth;
    switch (props.selectedZoomPreference) {
        case enums.ZoomPreference.FitWidth:
            paddingTopStyle = '(100% - ' + constants.SIDE_VIEW_COMMENT_PANEL_WIDTH + 'px)';
            break;
        case enums.ZoomPreference.FitHeight:
        case enums.ZoomPreference.Percentage:
        case enums.ZoomPreference.MarkschemePercentage:
            paddingTopStyle = '(' + props.overlayWidth + 'px)';
            break;
    }
    var spacerStyle = null;
    var styleStr = '';
    var scope;
    var annotationTopInPixels = props.annotationTop * props.overlayHeight;
    var ratio = (annotationTopInPixels) / props.overlayWidth;
    if (props.currentBoxHeight !== undefined && props.commentBoxTopHeight !== undefined && props.annotationWidth !== undefined) {
        var annotationWidth = '0px';
        // Add half of annotation size to spacer for the first box only
        if (props.boxHolderCount === 1) {
            //reduce half of the annotation size from spacer if rotated in 180 or 270
            if (props.displayAngle === 180 || props.displayAngle === 270) {
                annotationWidth = (props.annotationWidth * -1).toString() + 'px / 2';
            }
            else {
                annotationWidth = props.annotationWidth.toString() + 'px / 2';
            }
        }
        styleStr = ratio.toString() + ' * ' + paddingTopStyle + ' + ' + annotationWidth + ' - '
            + (props.commentBoxTopHeight).toString()
            + 'px - (' + props.currentBoxHeight.toString() + 'px / 2)';
        spacerStyle = { paddingTop: 'calc(' + styleStr + ')' };
    }
    return (React.createElement("div", {className: 'comment-box-spacer', id: props.id, key: props.id, style: spacerStyle}));
};
/* tslint:disable:variable-name  */
/** Component for comment box holder */
var CommentBoxHolder = function (props) { return (React.createElement("div", {className: classNames('comment-box-holder', {
    'read-only-comment': props.isCommentBoxReadOnly
}, {
    'open ': (props.isOpen === true && props.enableCommentsSideView === false) ||
        (props.enableCommentsSideView === true &&
            stampStore.instance.SelectedSideViewCommentToken === props.clientToken &&
            props.enableCommentBox)
}, { 'inactive': props.isCommentBoxInActive }), id: 'commentBox_' + props.id + '_' + props.clientToken, "aria-hidden": 'true', style: { color: props.commentColor }, "data-client": props.clientToken}, React.createElement(CommentBoxSpacer, {id: 'commentSpacer_' + props.id, key: 'commentSpacer_' + props.id, commentBoxTopHeight: props.commentBoxTopHeight, currentBoxHeight: props.currentBoxHeight, annotationTop: props.annotationTop, overlayHeight: props.overlayHeight, overlayWidth: props.overlayWidth, selectedZoomPreference: props.selectedZoomPreference, renderedOn: props.renderedOn, annotationWidth: props.annotationWidth, displayAngle: props.displayAngle, boxHolderCount: props.boxHolderCount}), React.createElement(CommentLine, {lineX1: props.lineX1 ? props.lineX1 : 0, lineX2: props.lineX2 ? props.lineX2 : 0, lineY1: props.lineY1 ? props.lineY1 : 0, lineY2: props.lineY2 ? props.lineY2 : 0, key: 'commentLine_' + props.id, id: 'commentLine_' + props.id, rgbColor: props.commentColor, enableCommentsSideView: props.enableCommentsSideView, clientToken: props.clientToken, overlayHeight: props.overlayHeight, overlayWidth: props.overlayWidth, selectedZoomPreference: props.selectedZoomPreference, marksheetHolderLeft: props.marksheetHolderLeft, annotationLeftPx: props.annotationLeftPx, annotationWidth: props.annotationWidth, renderedOn: props.boxRenderedOn, displayAngle: props.displayAngle}), React.createElement(CommentBox, {comment: props.comment, markSchemeText: props.markSchemeText, topPosition: props.commentBoxTop, leftPosition: props.commentBoxLeft, rgbColor: props.commentColor, selectedLanguage: props.selectedLanguage, key: 'commentBox_' + props.id, id: 'commentBox_' + props.id, clientToken: props.clientToken, isCommentBoxReadOnly: props.isCommentBoxReadOnly, isCommentBoxInActive: props.isCommentBoxInActive, naturalImageWidth: props.naturalImageWidth, naturalImageHeight: props.naturalImageHeight, enableCommentsSideView: props.enableCommentsSideView, renderedOn: props.boxRenderedOn, enableCommentBox: props.enableCommentBox, selectedZoomPreference: props.selectedZoomPreference}))); };
var CommentHolder = (function (_super) {
    __extends(CommentHolder, _super);
    /**
     * constructor for CommentHolder
     * @param props
     * @param state
     */
    function CommentHolder(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.spacerSetCount = 0;
        /**
         * returns the commentline mask svg element, for edge this will leads to application reload issue and not using the savg mask
         */
        this.commentLineMaskElement = function () {
            if (htmlUtilities.isEdge) {
                return null;
            }
            else {
                return (React.createElement("svg", {className: 'comment-mask'}, React.createElement("defs", null, React.createElement("g", {id: 'hide-area'}, React.createElement("svg", {viewBox: '0 0 10 10', className: 'mask-svg', preserveAspectRatio: 'xMinYMin meet', width: '4%', height: '10000', x: _this.props.lineMaskX + '%', y: _this.props.lineMaskY + '%'}, React.createElement("rect", {x: '0', y: '0', width: '100%', height: '100%', fill: 'black'}, " ")))), React.createElement("mask", {id: 'comment-line-mask'}, React.createElement("rect", {className: 'mask-reveal', x: '-58', y: '-60', width: window.innerWidth, height: window.innerHeight, fill: 'white'}, " "), React.createElement("use", {xlinkHref: '#hide-area'}, " "))));
            }
        };
        this.commentBoxTopHeight = 0;
        this.spacerSetCount = 0;
        this.state = {
            isOpen: false,
            renderedOn: Date.now(),
            minHeight: 0
        };
    }
    /**
     * Render method
     */
    CommentHolder.prototype.render = function () {
        var _this = this;
        var commentBoxHolderEl = null;
        var commentBoxHoldersSideView = null;
        if (this.props.enableCommentsSideView === false) {
            this.commentColor = colouredAnnotationsHelper.createAnnotationStyle(null, enums.DynamicAnnotation.OnPageComment).fill;
            commentBoxHolderEl = (React.createElement(CommentBoxHolder, {comment: this.props.comment, markSchemeText: this.props.markSchemeText, commentBoxTop: this.props.commentBoxTop, commentBoxLeft: this.props.commentBoxLeft, commentColor: this.props.commentColor, selectedLanguage: this.props.selectedLanguage, key: this.props.id, id: this.props.id, clientToken: this.props.clientToken, isCommentBoxReadOnly: this.props.isCommentBoxReadOnly, isCommentBoxInActive: this.props.isCommentBoxInActive, naturalImageWidth: this.props.naturalImageWidth, naturalImageHeight: this.props.naturalImageHeight, isOpen: this.props.isOpen, lineX1: this.props.lineX1, lineX2: this.props.lineX2, lineY1: this.props.lineY1, lineY2: this.props.lineY2, enableCommentsSideView: this.props.enableCommentsSideView, annotationTop: 0, commentBoxTopHeight: 0, currentBoxHeight: 0, overlayHeight: 0, overlayWidth: 0, enableCommentBox: this.props.enableCommentBox, marksheetHolderLeft: this.props.marksheetHolderLeft, renderedOn: Date.now(), boxRenderedOn: this.props.boxRenderedOn, displayAngle: this.props.displayAngle, selectedZoomPreference: this.props.selectedZoomPreference}));
            return (React.createElement("div", {className: 'comment-holder', ref: 'commentHolder'}, React.createElement("div", {className: 'comment-wrapper', style: this.props.wrapperStyle}, React.createElement("div", {className: 'side-view-wrapper'}, this.commentLineMaskElement(), commentBoxHolderEl, commentBoxHoldersSideView))));
        }
        else {
            if (!this.props.hideCommentBoxes) {
                var commentBoxTopHeight = 0;
                var boxHolderCount = 0;
                commentBoxHoldersSideView = this.sortedListBasedOnRotation().map(function (x) {
                    boxHolderCount++;
                    _this.pageNo = x.pageNo;
                    var markSchemeText = markingStore.instance.toolTip(x.markSchemeId);
                    var isPreviousAnnotation = x.annotation.isPrevious;
                    var uniqueId = markingStore.instance.currentQuestionItemInfo ?
                        markingStore.instance.currentQuestionItemInfo.uniqueId : 0;
                    var isInActive = !(x.annotation.markSchemeId === uniqueId);
                    var isReadonly = isPreviousAnnotation || isInActive
                        || markingStore.instance.currentResponseMode === enums.ResponseMode.closed
                        || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement
                        || (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                            !markerOperationModeFactory.operationMode.isDefinitveMarkingStarted);
                    _this.commentColor =
                        colouredAnnotationsHelper.createAnnotationStyle(x.annotation, enums.DynamicAnnotation.OnPageComment).fill;
                    var currentBoxHeight = stampStore.instance.SelectedSideViewCommentToken === x.clientToken ?
                        constants.COMMENT_BOX_EXPANDED_HEIGHT : constants.COMMENT_BOX_COLLAPSED_HEIGHT;
                    var overlayWidth = _this.props.overlayWidth;
                    var overlayHeight = _this.props.overlayHeight;
                    var annotationSize = (x.annotationWidth / 100) * (overlayWidth);
                    //Annotation size should be calculated when rotated in 90 or 270 uusing the overlayHeight
                    if (_this.props.displayAngle === 90 || _this.props.displayAngle === 270) {
                        annotationSize = (x.annotationWidth / 100) * (overlayHeight);
                    }
                    var _a = _this.getAnnotationLeftTopBasedOnRotation(x.annotationLeftPx, x.annotationTopPx, annotationSize, overlayWidth, overlayHeight), annotationLeftPercent = _a[0], annotationTopPercent = _a[1];
                    var lineX1 = annotationLeftPercent;
                    var lineY1 = annotationTopPercent;
                    var lineX2 = 102; // adjust the line end to touch the box - add a 2%
                    // logic to compare the annotation position allows box to be displayed straight
                    var annotationTopInPixels = (annotationTopPercent / 100) * overlayHeight;
                    var previousCommentBoxHeight = commentBoxTopHeight +
                        (_this.props.holderCount === 1 && boxHolderCount === 1 ?
                            constants.HIDE_COMMENTS_PANEL_HEIGHT : 0);
                    /**
                     * scenarios where the comment box can come vertically straight to the comment annotation
                     * or to display below because there are other adjacent boxes or hide comments panel.
                     */
                    if ((annotationTopInPixels - (currentBoxHeight / 2)) > commentBoxTopHeight) {
                        // This condition is when the comment box can be displayed vertically straight to annotation.
                        /**
                         *       	,-------.
                         *          |Comment|
                         *  --------|-------|
                         *          `-------'
                         */
                        commentBoxTopHeight = annotationTopInPixels + (currentBoxHeight / 2);
                    }
                    else {
                        // comment box displays below the annotation vertical position
                        /**
                         *
                         *    \  	,-------.
                         *      \   |Comment|
                         *        \ |-------|
                         *          `-------'
                         */
                        commentBoxTopHeight += currentBoxHeight +
                            (_this.props.holderCount === 1 && boxHolderCount === 1 ?
                                constants.HIDE_COMMENTS_PANEL_HEIGHT : 0);
                    }
                    var annotationSizeToAdd = 0;
                    annotationSizeToAdd = ((_this.props.displayAngle >= 180) ? ((annotationSize / 2) * -1) : (annotationSize / 2));
                    var lineY2 = commentBoxTopHeight - (currentBoxHeight / 2) + annotationSizeToAdd;
                    return (React.createElement(CommentBoxHolder, {comment: x.comment, markSchemeText: markSchemeText, commentBoxTop: _this.props.commentBoxTop ? _this.props.commentBoxTop : 0, commentBoxLeft: _this.props.commentBoxLeft ? _this.props.commentBoxLeft : 0, commentColor: _this.commentColor, selectedLanguage: _this.props.selectedLanguage, key: 'boxHolder_' + _this.props.id + boxHolderCount, id: 'boxHolder_' + _this.props.id + boxHolderCount, clientToken: x.clientToken, isCommentBoxReadOnly: isReadonly, isCommentBoxInActive: isInActive, naturalImageWidth: _this.props.naturalImageWidth, naturalImageHeight: _this.props.naturalImageHeight, isOpen: false, lineX1: lineX1, lineX2: lineX2, lineY1: lineY1, lineY2: lineY2, currentBoxHeight: currentBoxHeight, commentBoxTopHeight: previousCommentBoxHeight, enableCommentsSideView: _this.props.enableCommentsSideView, annotationTop: annotationTopPercent / 100, overlayHeight: overlayHeight, overlayWidth: overlayWidth, enableCommentBox: _this.props.enableCommentBox, selectedZoomPreference: _this.props.selectedZoomPreference, marksheetHolderLeft: _this.props.marksheetHolderLeft, annotationLeftPx: annotationLeftPercent / 100, annotationWidth: annotationSize, renderedOn: _this.props.renderedOn, boxRenderedOn: Date.now(), displayAngle: _this.props.displayAngle, boxHolderCount: boxHolderCount}));
                });
            }
            else {
                commentBoxHoldersSideView = null;
            }
            var holderStyle;
            // setting min height to expand the grey area in comment side view
            holderStyle = { minHeight: this.state.minHeight };
            return (React.createElement("div", {className: 'comment-holder', ref: 'commentHolder', style: holderStyle}, React.createElement("div", {className: 'comment-wrapper', style: this.props.wrapperStyle}, React.createElement("div", {className: 'side-view-wrapper'}, React.createElement("svg", {className: 'comment-mask'}), commentBoxHolderEl, commentBoxHoldersSideView))));
        }
    };
    /**
     * This function gets invoked after the component is re-rendered
     */
    CommentHolder.prototype.componentDidUpdate = function () {
        if (this.props.enableCommentsSideView) {
            var boxHolderCounter = 0;
            var commentHolder = Reactdom.findDOMNode(this.refs.commentHolder);
            var currentBoxHolders = void 0;
            var commentBoxTopHeight = 0;
            var minHeight = 0;
            if (commentHolder) {
                currentBoxHolders = commentHolder.getElementsByClassName('comment-box-holder');
                var currentBoxHoldersCount = currentBoxHolders.length;
                if (currentBoxHoldersCount === 0) {
                    this.resetMinHeightForPage();
                }
                var elem = void 0;
                for (var i = 0; i < currentBoxHoldersCount; i++) {
                    elem = currentBoxHolders[i];
                    boxHolderCounter++;
                    if (boxHolderCounter === currentBoxHoldersCount) {
                        /* the min height calculations to  set the grey gap b/w responses if there are more comments */
                        minHeight = commentBoxTopHeight + elem.offsetHeight;
                        minHeight = minHeight + +(this.props.holderCount === 1 ?
                            constants.HIDE_COMMENTS_PANEL_HEIGHT : (minHeight * GREYGAP_FRACTION));
                        var _pageNo = ((this.props.outputPageNo && this.props.outputPageNo !== 0) ?
                            this.props.outputPageNo : this.props.pageNo);
                        stampActionCreator.setCommentHolderRendered(_pageNo, minHeight);
                    }
                    // setting the height for using in the next comment box holder
                    commentBoxTopHeight = commentBoxTopHeight + elem.offsetHeight -
                        (this.props.holderCount === 1 && boxHolderCounter === 1 ?
                            constants.HIDE_COMMENTS_PANEL_HEIGHT : 0);
                }
                this.setState({ minHeight: minHeight });
            }
        }
    };
    /**
     * resets the minheight for comment holder and the marksheet
     */
    CommentHolder.prototype.resetMinHeightForPage = function () {
        var _pageNo = ((this.props.outputPageNo && this.props.outputPageNo !== 0) ?
            this.props.outputPageNo : this.props.pageNo);
        stampActionCreator.setCommentHolderRendered(_pageNo, 0);
        this.setState({ minHeight: 0 });
    };
    /**
     * returns the sorted side view comment data based on the rotate angle
     */
    CommentHolder.prototype.sortedListBasedOnRotation = function () {
        var _this = this;
        var showDefAnnotationsOnly = markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
        var filteredListForPage = onPageCommentHelper.onPageCommentsSideView.filter(function (x) {
            return x.outputPageNo === _this.props.outputPageNo &&
                x.pageNo === _this.props.pageNo &&
                x.isVisible === true &&
                showDefAnnotationsOnly ? x.isDefinitive === true : true;
        });
        // sorting the sideview list based on the position , related to the rotate angle.
        var sortedList = filteredListForPage.sort(function (a, b) {
            if (_this.props.displayAngle === 180) {
                return ((b.annotationTopPx - a.annotationTopPx) === 0 ?
                    (b.annotationLeftPx - a.annotationLeftPx) : (b.annotationTopPx - a.annotationTopPx));
            }
            if (_this.props.displayAngle === 90) {
                return ((a.annotationLeftPx - b.annotationLeftPx === 0) ?
                    (b.annotationTopPx - a.annotationTopPx) : (a.annotationLeftPx - b.annotationLeftPx));
            }
            if (_this.props.displayAngle === 270) {
                return ((b.annotationLeftPx - a.annotationLeftPx) === 0 ?
                    (a.annotationTopPx - b.annotationTopPx) : (b.annotationLeftPx - a.annotationLeftPx));
            }
            return ((a.annotationTopPx - b.annotationTopPx) === 0 ?
                (a.annotationLeftPx - b.annotationLeftPx) : (a.annotationTopPx - b.annotationTopPx));
        });
        return sortedList;
    };
    /**
     * gets the annotation left and top values based on rotation
     * @param annotationLeftPx
     * @param annotationTopPx
     * @param annotationSize
     * @param overlayWidth
     * @param overlayHeight
     */
    CommentHolder.prototype.getAnnotationLeftTopBasedOnRotation = function (annotationLeftPx, annotationTopPx, annotationSize, overlayWidth, overlayHeight) {
        var _annotationLeft = annotationLeftPx;
        var _annotationTop = annotationTopPx;
        switch (this.props.displayAngle) {
            case 90:
                _annotationLeft = 1 - annotationTopPx;
                _annotationTop = annotationLeftPx;
                break;
            case 180:
                _annotationLeft = 1 - annotationLeftPx;
                _annotationTop = 1 - annotationTopPx;
                break;
            case 270:
                _annotationLeft = annotationTopPx;
                _annotationLeft = _annotationLeft;
                _annotationTop = 1 - annotationLeftPx;
                _annotationTop = _annotationTop;
                break;
        }
        return [_annotationLeft * 100, _annotationTop * 100];
    };
    return CommentHolder;
}(pureRenderComponent));
module.exports = CommentHolder;
//# sourceMappingURL=commentholder.js.map