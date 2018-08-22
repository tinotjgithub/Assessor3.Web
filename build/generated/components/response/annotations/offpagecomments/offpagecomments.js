"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Immutable = require('immutable');
var localeStore = require('../../../../stores/locale/localestore');
var pureRenderComponent = require('../../../base/purerendercomponent');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var enums = require('../../../utility/enums');
var markingStore = require('../../../../stores/marking/markingstore');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var constants = require('../../../utility/constants');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
/**
 * OffPageComments
 * @param props
 */
// tslint:disable-next-line:variable-name
var OffPageComments = (function (_super) {
    __extends(OffPageComments, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function OffPageComments(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.commentText = '';
        this.commentClientToken = '';
        this.isContentEditable = false;
        /**
         * called on focus
         */
        this.onFocus = function (event) {
            var placeHolderDiv = document.getElementById('offpage-comment-placeholder');
            if (placeHolderDiv.innerText.trim().length > 0) {
                placeHolderDiv.innerText = '';
            }
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.OffPageComments);
        };
        /**
         * called on blur
         */
        this.onBlur = function () {
            _this.replaceHTMLText(_this.commentText);
            var placeHolderDiv = document.getElementById('offpage-comment-placeholder');
            if (placeHolderDiv.innerText.trim().length === 0 && _this.commentText.trim().length === 0) {
                placeHolderDiv.innerText =
                    localeStore.instance.TranslateText('marking.response.off-page-comments-panel.comment-text-placeholder');
            }
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.OffPageComments);
            _this.addOrUpdateOffpageComments();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Re render after save or update
         */
        this.reRender = function () {
            _this.commentText = _this.commentText.trim();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Saving offpage comments
         */
        this.addOrUpdateOffpageComments = function () {
            var newlyAddedOrUpdatedOffPageComment;
            var currentMarkSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
            if (_this.commentClientToken === '' && _this.commentText !== '') {
                newlyAddedOrUpdatedOffPageComment = annotationHelper.getAnnotationToAdd(constants.OFF_PAGE_COMMENT_STAMP_ID, 0, markingStore.instance.currentQuestionItemImageClusterId, 0, 0, 0, enums.AddAnnotationAction.Stamping, 0, 0, currentMarkSchemeId, 0, 0);
                newlyAddedOrUpdatedOffPageComment.comment = _this.commentText;
                var cssProps = colouredAnnotationsHelper.
                    createAnnotationStyle(newlyAddedOrUpdatedOffPageComment, enums.DynamicAnnotation.OffPageComment);
                var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                newlyAddedOrUpdatedOffPageComment.red = parseInt(rgba[0]);
                newlyAddedOrUpdatedOffPageComment.green = parseInt(rgba[1]);
                newlyAddedOrUpdatedOffPageComment.blue = parseInt(rgba[2]);
                _this.commentClientToken = newlyAddedOrUpdatedOffPageComment.clientToken;
                markingActionCreator.addNewlyAddedAnnotation(newlyAddedOrUpdatedOffPageComment, undefined, null, null, null, false);
            }
            else if (_this.commentClientToken !== '') {
                newlyAddedOrUpdatedOffPageComment = markingStore.instance.getAnnotation(_this.commentClientToken);
                if (newlyAddedOrUpdatedOffPageComment && _this.commentClientToken === newlyAddedOrUpdatedOffPageComment.clientToken) {
                    if (_this.commentText === '') {
                        _this.removeAnnotation(_this.commentClientToken);
                    }
                    else {
                        markingActionCreator.updateAnnotation(newlyAddedOrUpdatedOffPageComment.leftEdge, newlyAddedOrUpdatedOffPageComment.topEdge, newlyAddedOrUpdatedOffPageComment.imageClusterId, newlyAddedOrUpdatedOffPageComment.outputPageNo, newlyAddedOrUpdatedOffPageComment.pageNo, newlyAddedOrUpdatedOffPageComment.clientToken, newlyAddedOrUpdatedOffPageComment.width, newlyAddedOrUpdatedOffPageComment.height, _this.commentText, true, false, false, constants.OFF_PAGE_COMMENT_STAMP_ID);
                    }
                }
            }
        };
        // Set the default state
        this.state = {
            renderedOn: 0
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onCommentPaste = this.onCommentPaste.bind(this);
        this.offpageCommentsAgainstQuestionItem = this.offpageCommentsAgainstQuestionItem.bind(this);
        this.replaceSelectedText = this.replaceSelectedText.bind(this);
        this.onMarkReset = this.onMarkReset.bind(this);
        this.addOrUpdateOffpageComments = this.addOrUpdateOffpageComments.bind(this);
        this.onCommentCut = this.onCommentCut.bind(this);
        this.reRender = this.reRender.bind(this);
    }
    /**
     * Render method
     */
    OffPageComments.prototype.render = function () {
        this.isContentEditable = markerOperationModeFactory.operationMode.isOffPageCommentEditable;
        //using onKeyUp since onChange/onInput are not supported in IE for contenteditable div.
        var commentEditor = (React.createElement("div", {contentEditable: this.isContentEditable, id: 'offpage-comment-editor', className: 'offpage-comment-editor', onFocus: this.onFocus, onBlur: this.onBlur, onPaste: this.onCommentPaste, onCut: this.onCommentCut, onKeyUp: this.onTextChange, onInput: this.onTextChange, suppressContentEditableWarning: true, ref: 'offpageComment'}, this.commentText));
        // passing place holder text as empty when there is comment text, to resolve the overlaping issue in IE.
        var placeHolderText = '';
        if (this.commentText.length === 0 && this.isContentEditable) {
            placeHolderText = localeStore.instance.TranslateText('marking.response.off-page-comments-panel.comment-text-placeholder');
        }
        var commentPlaceHolder = (React.createElement("div", {id: 'offpage-comment-placeholder', className: 'offpage-comment-placeholder'}, placeHolderText));
        var borderStyle = {
            border: '1px',
            borderColor: this.props.annotationColor,
            borderStyle: 'solid'
        };
        var commentBorder = (React.createElement("div", {id: 'offpage-comment-border', className: 'offpage-comment-border', style: borderStyle}));
        return (React.createElement("div", {className: 'offpage-comment-editor-holder'}, commentEditor, commentPlaceHolder, commentBorder));
    };
    /**
     * componentDidMount
     */
    OffPageComments.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.offpageCommentsAgainstQuestionItem);
        markingStore.instance.addListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onMarkReset);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.reRender);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT, this.offpageCommentsAgainstQuestionItem);
    };
    /**
     * ComponentWillUnMount
     */
    OffPageComments.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.offpageCommentsAgainstQuestionItem);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onMarkReset);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.reRender);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT, this.offpageCommentsAgainstQuestionItem);
    };
    /**
     * called on paste
     * @param e
     */
    OffPageComments.prototype.onCommentPaste = function (e) {
        if (!this.isContentEditable) {
            return;
        }
        // preventing the default paste action to remove formats from the copied text
        e.preventDefault();
        if (window.clipboardData && window.clipboardData.getData) {
            this.replaceSelectedText(window.clipboardData.getData('Text'));
        }
        else if (e.clipboardData && e.clipboardData.getData) {
            this.replaceSelectedText(e.clipboardData.getData('text/plain'));
        }
        this.commentText = this.refs.offpageComment.innerText;
    };
    /**
     * Called on Cut event
     * for updating the comment text in IE
     * @param e
     */
    OffPageComments.prototype.onCommentCut = function (e) {
        // In IE onInput event is not triggered, so 'this.commentText' is not updated.
        if (htmlUtilities.isIE || htmlUtilities.isIE11) {
            // replaceSelectedText method is called to remove the selected text
            // since the cut event is not completed at this stage.
            this.replaceSelectedText('');
            this.commentText = this.refs.offpageComment.innerText;
        }
    };
    /**
     * Replace selected text while pasting
     * @param replacementText
     */
    OffPageComments.prototype.replaceSelectedText = function (replacementText) {
        var sel;
        var range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(replacementText));
            }
            range.collapse(false);
        }
    };
    /**
     * called on mark reset
     * @param resetMark
     * @param resetAnnotation
     */
    OffPageComments.prototype.onMarkReset = function (resetMark, resetAnnotation) {
        if (resetAnnotation) {
            this.commentText = '';
            this.commentClientToken = '';
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * Called once question item changed
     */
    OffPageComments.prototype.offpageCommentsAgainstQuestionItem = function () {
        var currentMarkSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
        var currentAnnotations = Immutable.List(annotationHelper.getCurrentMarkGroupAnnotation());
        this.commentText = '';
        this.commentClientToken = '';
        if (currentAnnotations && currentMarkSchemeId) {
            var commentAnnotation = currentAnnotations.filter(function (x) {
                return x.markSchemeId === currentMarkSchemeId &&
                    x.stamp === constants.OFF_PAGE_COMMENT_STAMP_ID &&
                    x.markingOperation !== enums.MarkingOperation.deleted;
            }).first();
            if (commentAnnotation) {
                this.commentText = commentAnnotation.comment;
                this.commentClientToken = commentAnnotation.clientToken;
            }
        }
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * called on text change
     * @param event
     */
    OffPageComments.prototype.onTextChange = function (event) {
        var target = event.target || event.srcElement;
        var text = target.innerHTML;
        this.commentText = text;
    };
    /**
     * replace inner html
     * @param innerHTML
     */
    OffPageComments.prototype.replaceHTMLText = function (innerHTML) {
        innerHTML = innerHTML.replace(/<\p><br><\/p>/g, '<br/>').replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
        this.refs.offpageComment.innerHTML = innerHTML;
        this.commentText = this.refs.offpageComment.innerText;
    };
    /**
     * Remove annotation
     * @param annotationClientToken
     */
    OffPageComments.prototype.removeAnnotation = function (annotationClientToken) {
        var annotationClientTokenToBeDeleted = [];
        annotationClientTokenToBeDeleted.push(annotationClientToken);
        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted);
    };
    return OffPageComments;
}(pureRenderComponent));
module.exports = OffPageComments;
//# sourceMappingURL=offpagecomments.js.map