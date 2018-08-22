"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var localeStore = require('../../../../stores/locale/localestore');
var pureRenderComponent = require('../../../base/purerendercomponent');
var enums = require('../../../utility/enums');
var responseHelper = require('../../../utility/responsehelper/responsehelper');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var markingStore = require('../../../../stores/marking/markingstore');
var constants = require('../../../utility/constants');
/* tslint:disable:variable-name  */
/**
 * Offpage Previous Comments
 * @param props
 */
var OffPagePreviousComments = function (props) {
    return (React.createElement("li", {className: 'comment-list', id: 'comment-list_' + props.index}, React.createElement("span", {className: 'comment-author', id: 'comment-author_' + props.index}, React.createElement("span", {className: 'remark-type bolder', id: 'remark-type_' + props.index, style: props.style}, props.header), React.createElement("span", {className: 'author-name', id: 'author-name_' + props.index}, props.markedBy)), React.createElement("span", {className: 'comment-desc', id: 'comment-desc_' + props.index}, props.comment)));
};
/**
 * OffPageCommentListHolder
 */
var OffPageCommentListHolder = (function (_super) {
    __extends(OffPageCommentListHolder, _super);
    function OffPageCommentListHolder(props, state) {
        _super.call(this, props, state);
        // Set the default state
        this.state = {
            renderedOn: 0
        };
        this.renderPreviousOffPageComments = this.renderPreviousOffPageComments.bind(this);
        this.reRender = this.reRender.bind(this);
    }
    /**
     * render
     */
    OffPageCommentListHolder.prototype.render = function () {
        var prvCommentLists = this.renderPreviousOffPageComments();
        if (prvCommentLists && prvCommentLists.length > 0) {
            var prvCommentHeader = localeStore.instance.TranslateText('marking.response.off-page-comments-panel.previous-comment-header');
            return (React.createElement("div", {className: 'comment-list-holder', id: 'comment-list-holder'}, React.createElement("h5", {className: 'comment-list-title bolder', id: 'comment-list-title'}, prvCommentHeader), React.createElement("ul", {className: 'comment-lists', id: 'comment-lists'}, prvCommentLists)));
        }
        else {
            return null;
        }
    };
    /**
     * componentDidMount
     */
    OffPageCommentListHolder.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.reRender);
    };
    /**
     * componentWillMount
     */
    OffPageCommentListHolder.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.reRender);
    };
    /**
     * re render
     */
    OffPageCommentListHolder.prototype.reRender = function () {
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * render previous offpage comments
     */
    OffPageCommentListHolder.prototype.renderPreviousOffPageComments = function () {
        var prvCommentLists = [];
        if (markingStore.instance.currentQuestionItemInfo) {
            var currentMarkSchemeId_1 = markingStore.instance.currentQuestionItemInfo.uniqueId;
            var seedType = responseHelper.getCurrentResponseSeedType();
            var previousRemarkAnnotationsDetails = annotationHelper.getPreviousAnnotationDetails(responseHelper.isClosedEurSeed, responseHelper.isClosedLiveSeed, seedType);
            if (previousRemarkAnnotationsDetails && currentMarkSchemeId_1) {
                previousRemarkAnnotationsDetails.map(function (prvDetails, index) {
                    if (prvDetails) {
                        var prvRemarkAnnotations = prvDetails.get('marksAndAnnotations');
                        var markedBy = prvDetails.get('markedBy');
                        var header = prvDetails.get('header');
                        var style = {
                            backgroundColor: prvDetails.get('previousRemarkBaseColor')
                        };
                        if (prvRemarkAnnotations.annotations.length > 0) {
                            var prvCommentAnnotation = prvRemarkAnnotations.annotations.filter(function (x) {
                                return x.markSchemeId === currentMarkSchemeId_1 &&
                                    x.stamp === constants.OFF_PAGE_COMMENT_STAMP_ID &&
                                    x.markingOperation !== enums.MarkingOperation.deleted;
                            })[0];
                            if (prvCommentAnnotation) {
                                var element = (React.createElement(OffPagePreviousComments, {id: 'offPagePreviousComments_' + index, key: 'offPagePreviousComments_' + index, style: style, header: header, markedBy: markedBy, comment: prvCommentAnnotation.comment, index: index}));
                                prvCommentLists.push(element);
                            }
                        }
                    }
                });
            }
        }
        return prvCommentLists;
    };
    return OffPageCommentListHolder;
}(pureRenderComponent));
module.exports = OffPageCommentListHolder;
//# sourceMappingURL=offpagecommentlistholder.js.map