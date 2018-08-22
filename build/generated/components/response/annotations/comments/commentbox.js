"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var enums = require('../../../utility/enums');
var deviceHelper = require('../../../../utility/touch/devicehelper');
var onPageCommentHelper = require('../../../../components/utility/annotation/onpagecommenthelper');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var markingStore = require('../../../../stores/marking/markingstore');
var stringHelper = require('../../../../utility/generic/stringhelper');
var constants = require('../../../utility/constants');
var localeStore = require('../../../../stores/locale/localestore');
var responseStore = require('../../../../stores/response/responsestore');
var stampStore = require('../../../../stores/stamp/stampstore');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var coloredAnnotationHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var responseActionCreator = require('../../../../actions/response/responseactioncreator');
var CommentBox = (function (_super) {
    __extends(CommentBox, _super);
    /**
     * @constructor
     */
    function CommentBox(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Holds a value indicating the comment text.
        this.commentText = '';
        this.isCommentBoxReadOnly = false;
        this.isCommentBoxInActive = false;
        this.isCommentBoxChanging = false;
        /**
         * Moving the cursor point to last(due to IE issue).
         * @param {Event} event
         */
        this.onFocus = function (event) {
            var temp = event.target.value || event.srcElement;
            event.target.value = '';
            event.target.value = temp !== undefined ? temp : '';
        };
        /**
         * This method will get fired when the mouse leaves the Comment box.
         * @param {Event} event
         */
        this.onLeaveHandler = function (event) {
            var e = event.toElement || event.relatedTarget;
            if (e.classList
                && !e.classList.contains('annotation-holder')
                && responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                responseActionCreator.viewWholePageLinkAction(false, undefined);
            }
        };
        /**
         * Adding inputs to text area.
         * @param {Event} event
         */
        this.onChange = function (event) {
            if (!_this.props.isCommentBoxReadOnly) {
                // Browser specific.
                var target = event.target || event.srcElement;
                var comment = target.value;
                _this.commentText = comment;
                var annotation = markingStore.instance.getAnnotation(_this.props.clientToken);
                if (annotation) {
                    // WA compatibility comment box position calculation
                    var pos = onPageCommentHelper.UpdateOnPageCommentPosition(_this.props.naturalImageHeight, _this.props.naturalImageWidth, _this.commentText, annotation.topEdge, annotation.leftEdge);
                    // Updating the left and top position along with comment text
                    // And pass isPositionUpdated as false, because only the comment text is changed not position of annotation
                    markingActionCreator.updateAnnotation(pos.left, pos.top, annotation.imageClusterId, annotation.outputPageNo, annotation.pageNo, annotation.clientToken, annotation.width, annotation.height, _this.commentText, false, false, true);
                    // update the side view collection to reflect the change
                    onPageCommentHelper.updateSideViewItem(_this.props.clientToken, _this.commentText);
                    _this.isCommentBoxChanging = true;
                    _this.setState({
                        toggle: !_this.state.toggle
                    });
                }
            }
        };
        /**
         * Set mark entybox selected
         */
        this.setMarkEntryBoxSelected = function (isCommentSelected) {
            // For device selecting the mark entry textbox is disabled
            // for preventing unwanted popup of device keyboard popup.
            if (deviceHelper.isTouchDevice() === true) {
                return;
            }
            // skip selection when comment box is selected
            if (_this.refs.commentTextBox && isCommentSelected) {
                (_this.props.isCommentBoxReadOnly) ? _this.refs.commentTextBox.blur() : _this.refs.commentTextBox.focus();
                _this.refs.commentTextBox.scrollTop = (_this.props.isCommentBoxReadOnly) ? 0 : _this.refs.commentTextBox.scrollHeight;
            }
        };
        /**
         * Prevent markscheme text box get selected on click/input
         * @param {Event} event
         */
        this.onCommentTextSelected = function (event) {
            // Prevent markscheme text box get selected on click/input
            event.stopPropagation();
            event.preventDefault();
        };
        /**
         * To enable default right click behaviour
         * ie.showing browser default context menu while right clicking
         * on comment box
         * @param {Event} event
         */
        this.onRightClick = function (event) {
            // Prevent markscheme text box get selected on click/input
            event.stopPropagation();
        };
        /**
         * Will display delete comment confirmation dialog
         */
        this.deleteComment = function (event) {
            // Prevent event bubbling of parent element.
            event.stopPropagation();
            stampActionCreator.deleteComment(false);
        };
        this.state = {
            comment: this.props.comment,
            toggle: true
        };
        this.onCommentTextSelected = this.onCommentTextSelected.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.toggleCommentSideView = this.toggleCommentSideView.bind(this);
    }
    /**
     * Render method
     */
    CommentBox.prototype.render = function () {
        var commentBoxStyle = {
            left: this.props.leftPosition + '%',
            top: this.props.topPosition + '%'
        };
        var svgStyle = {
            pointerEvents: 'none'
        };
        var commentElement = (this.props.isCommentBoxReadOnly ?
            React.createElement("div", {className: 'comment-textbox'}, this.commentText)
            :
                React.createElement("textarea", {className: 'comment-textbox', placeholder: localeStore.instance.TranslateText('marking.response.on-page-comment-box.comment-placeholder-text'), onInput: this.onChange, ref: 'commentTextBox', onFocus: this.onFocus, onClick: this.onCommentTextSelected, onContextMenu: this.onRightClick, value: this.commentText, spellCheck: true, "aria-label": 'Comment-textbox'}));
        var commentSideViewToggleElement = null;
        if (this.props.enableCommentBox) {
            commentSideViewToggleElement = (React.createElement("div", {className: 'comment-icon-holder'}, React.createElement("div", {className: 'offpage-comment-icon', title: localeStore.instance.TranslateText('marking.response.on-page-comment-box.side-view-icon-tooltip')}, React.createElement("a", {href: 'javascript:void(0)', className: 'offpage-comment-link', onClick: this.toggleCommentSideView}, React.createElement("svg", {viewBox: '0 0 26 26', className: 'offpage-comment-icon', style: svgStyle}, React.createElement("use", {xlinkHref: '#icon-offpage-comment'}, "Switch to Side View"))))));
        }
        var footerElement = (React.createElement("div", {className: 'comment-box-footer'}, React.createElement("a", {href: 'javascript:void(0)', className: 'delete-comment-button', title: stringHelper.format(localeStore.instance.TranslateText('marking.response.on-page-comment-box.delete-icon-tooltip'), [constants.NONBREAKING_HYPHEN_UNICODE]), onClick: this.deleteComment}, React.createElement("svg", {viewBox: '0 0 26 26', className: 'delete-comment-icon'}, React.createElement("use", {xlinkHref: '#delete-comment-icon'}, "Delete Comment")))));
        if (this.props.enableCommentsSideView === true && this.props.clientToken !== stampStore.instance.SelectedSideViewCommentToken) {
            commentElement = React.createElement("div", {className: 'comment-textbox'}, this.commentText);
        }
        var commentStyle = {};
        commentStyle.color = coloredAnnotationHelper.getTintedRgbColor(this.props.rgbColor, 0.95);
        return (React.createElement("div", {className: 'comment-box', style: commentBoxStyle, ref: 'commentBox', id: 'comment_box_' + this.props.id, onMouseLeave: this.onLeaveHandler}, React.createElement("div", {className: 'commentbox-inner', style: commentStyle}, React.createElement("div", {className: 'comment-box-header clearfix'}, React.createElement("div", {className: 'comment-heading'}, this.props.markSchemeText), commentSideViewToggleElement), React.createElement("div", {className: 'comment-box-content'}, React.createElement("div", {className: 'comment-input'}, commentElement, React.createElement("div", {className: 'ellipsis-dots'})), React.createElement("div", {className: 'comment-input-border', style: { color: this.props.rgbColor }})), footerElement), React.createElement("div", {className: 'commentbox-fader'})));
    };
    /**
     * This function gets invoked when the component is about to receive props
     */
    CommentBox.prototype.componentWillReceiveProps = function (nxtProps) {
        // if new comment has been opened, then update the existing comment text to the new one.
        if (this.props.renderedOn !== nxtProps.renderedOn) {
            this.isCommentBoxChanging = false;
            // replacing undefined to empty text
            var prevComment = this.commentText;
            this.commentText = nxtProps.comment ? nxtProps.comment :
                (this.commentText === undefined || this.props.comment === prevComment) ? '' : this.commentText;
            if (this.props.enableCommentsSideView === true &&
                nxtProps.clientToken === stampStore.instance.SelectedSideViewCommentToken) {
                onPageCommentHelper.updateSideViewItem(nxtProps.clientToken, this.commentText);
            }
        }
    };
    /**
     * This function gets invoked when the component is mounted
     */
    CommentBox.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
        this.setCommentBoxFocus();
    };
    /**
     * To set the comment box focus
     */
    CommentBox.prototype.setCommentBoxFocus = function () {
        var _this = this;
        // set time out is a hack to resolve scroll to a non focused comment box on side view comment .
        setTimeout(function () {
            // If it is a touch device or monitor will not focus the textbox,
            // to prevent virtual keyboard to pop-up
            if (htmlUtilities.isTabletOrMobileDevice === false && _this.refs.commentTextBox) {
                (_this.props.isCommentBoxReadOnly) ? _this.refs.commentTextBox.blur() : _this.refs.commentTextBox.focus();
            }
        }, 0);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    CommentBox.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
    };
    /**
     * This function gets invoked when the component is updated
     */
    CommentBox.prototype.componentDidUpdate = function () {
        this.setCommentBoxFocus();
        // setting scroll position at the bottom of textarea if the comment is not changing.
        // setting scroll position to zero when it is readonly
        if (this.refs.commentTextBox && !this.isCommentBoxChanging) {
            this.refs.commentTextBox.scrollTop = (this.props.isCommentBoxReadOnly) ? 0 : this.refs.commentTextBox.scrollHeight;
        }
    };
    /**
     * Will switch to Side view for On Page comments
     */
    CommentBox.prototype.toggleCommentSideView = function () {
        var disableSideViewOnDevices = (this.props.selectedZoomPreference !== enums.ZoomPreference.FitWidth
            && htmlUtilities.isTabletOrMobileDevice);
        stampActionCreator.toggleCommentSideView(true, this.props.clientToken);
        if (disableSideViewOnDevices) {
            stampActionCreator.switchZoomPreference(enums.ZoomPreference.FitWidth);
            onPageCommentHelper.isFitWidth = true;
        }
    };
    return CommentBox;
}(pureRenderComponent));
module.exports = CommentBox;
//# sourceMappingURL=commentbox.js.map