"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Reactdom = require('react-dom');
var stampStore = require('../../../../stores/stamp/stampstore');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var markingStore = require('../../../../stores/marking/markingstore');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var classNames = require('classnames');
var colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var constants = require('../../../utility/constants');
var enums = require('../../../utility/enums');
var messageStore = require('../../../../stores/message/messagestore');
var eventManagerBase = require('../../../base/eventmanager/eventmanagerbase');
var eventTypes = require('../../../base/eventmanager/eventtypes');
var exceptionStore = require('../../../../stores/exception/exceptionstore');
var onPageCommentHelper = require('../../../utility/annotation/onpagecommenthelper');
var CommentHolder = require('./commentholder');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var responseStore = require('../../../../stores/response/responsestore');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var ecourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var enhancedOffPageCommentStore = require('../../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var CommentContainer = (function (_super) {
    __extends(CommentContainer, _super);
    /**
     * @constructor
     */
    function CommentContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /** variables to hold the line ponts */
        this.lineX1 = 0;
        this.lineX2 = 0;
        this.lineY1 = 0;
        this.lineY2 = 0;
        this.lineMaskX = 0;
        this.lineMaskY = 0;
        this.isReadyToDrag = true;
        this.isAnnotationMoving = false;
        // flag for enabling scroll
        this.doEnableScroll = false;
        this.isZoomEnds = false;
        this.horizontalScrollInProgress = false;
        // Indicating to hide the comment container
        this.hideCommentContainer = false;
        this.isComponentMounted = false;
        /**
         * re render the comment container by considering the animation
         */
        this.reRenderAfterAnimation = function () {
            var that = _this;
            if (markingStore.instance.getResizedPanelClassName() || enhancedOffPageCommentStore.instance.isEnhancedOffpageCommentResizing) {
                return;
            }
            else {
                setTimeout(function () {
                    that.reRender();
                }, constants.GENERIC_IMMEDIATE_AFTER_ANIMATION_TIMEOUT);
            }
        };
        /**
         * Re render the container
         */
        this.reRenderOnZoom = function (isZoomEnd) {
            _this.isZoomEnds = isZoomEnd;
            /*this.horizontalScrollInProgress ? this.state.boxRenderedOn : */
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Re render the comment boxes only
         */
        this.reRenderCommentBoxesOnly = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * set flags to hide the lines and boxes during animation/pinch zoom
         */
        this.toggleCommentLinesAndBoxesVisiibility = function (hideLines, hideBoxes) {
            _this.setState({
                hideCommentLines: hideLines,
                hideCommentBoxes: hideBoxes
            });
        };
        /* touch move event for image container */
        this.onTouchMoveHandler = function (event) {
            if (!_this.doEnableScroll && htmlUtilities.isTabletOrMobileDevice) {
                event.preventDefault();
            }
        };
        /**
         * prevent default behaviour while scrolling on comment container
         * @param event any
         */
        this.onScrollHandler = function (e) {
            _this.enableCommentContainerScroll(true);
            e.stopPropagation();
        };
        /**
         * set the flag for enable comment container scroll
         * @param value true/false
         */
        this.enableCommentContainerScroll = function (value) {
            _this.doEnableScroll = value;
        };
        /**
         * prevent default behaviour while scrolling using Mouse Wheel on comment container
         * @param any
         */
        this.onWheelHandler = function (e) {
            if (stampStore.instance.SelectedSideViewCommentToken !== undefined && _this.isSideViewEnabledAndVisible) {
                stampActionCreator.showOrHideComment(false);
            }
            else {
                e.stopPropagation();
            }
        };
        /**
         * listner of show on page comment event. this will show the commen edit box on comment icon click.
         * @param comment
         * @param leftOffset
         * @param topOffset
         * @param qustionHierarhy
         * @param windowsWidth
         * @param overlayHeight
         * @param overlayWidth
         * @param wrapper
         * @param isCommentBoxReadOnly
         * @param isCommentBoxInActive
         */
        this.showOnPageComment = function (comment, leftOffset, topOffset, qustionHierarhy, windowsWidth, overlayHeight, overlayWidth, wrapper, isCommentBoxReadOnly, isCommentBoxInActive) {
            // If a newly added comment is opened and clicking on another comment should
            // delete and hide the new comment and open the selected one
            // handle for onpage and side view comments
            if ((_this.state.isOpen === true
                || _this.isSideViewEnabledAndVisible && stampStore.instance.SelectedSideViewCommentToken !== undefined)
                && !_this.comment) {
                _this.showOrHideComment(false);
            }
            _this.clientToken = comment.clientToken;
            _this.comment = comment.comment;
            // set the below values for on page comment mode only
            if (_this.props.enableCommentBox === false || _this.props.enableCommentsSideView === false) {
                _this.commentBoxLeft = leftOffset;
                _this.commentBoxTop = topOffset;
                _this.windowsWidth = windowsWidth;
                _this.overlayHeight = overlayHeight;
                _this.overlayWidth = overlayWidth;
                _this.wrapper = wrapper;
                _this.wrapperLeft = _this.wrapper.left;
                _this.wrapperTop = _this.wrapper.top;
                _this.markSchemeText = markingStore.instance.toolTip(comment.markSchemeId);
                _this.isCommentBoxReadOnly = isCommentBoxReadOnly;
                _this.isCommentBoxInActive = isCommentBoxInActive;
                /** calculating the line parameters */
                var lineleft = 100 * ((wrapper.left + (wrapper.width / 2) - constants.RESPONSE_LEFT_PANEL_WIDTH)
                    / _this.overlayWidth);
                var lineTop = 100 * ((wrapper.top + (wrapper.height / 2)) - constants.RESPONSE_TOP_PANEL_HEIGHT)
                    / _this.overlayHeight;
                _this.lineX1 = lineleft;
                _this.lineY1 = lineTop;
                _this.lineX2 = lineleft;
                _this.lineY2 = lineTop;
                _this.lineMaskX = 100 * ((wrapper.left - constants.RESPONSE_LEFT_PANEL_WIDTH) / _this.overlayWidth);
                _this.lineMaskY = 100 * ((wrapper.top - constants.RESPONSE_TOP_PANEL_HEIGHT) / _this.overlayHeight);
                /** getting the color of annotation from annotation helper */
                _this.commentColor = colouredAnnotationsHelper.createAnnotationStyle(comment, enums.DynamicAnnotation.OnPageComment).fill;
            }
            else {
                stampActionCreator.setSelectedSideViewComment(comment.clientToken);
            }
            // Open edit box - render is needed for on page comment mode
            _this.showOrHideComment(true, false, _this.isSideViewEnabledAndVisible);
            // Mounting events to close the comment while clicking outside
            _this.mountOrUnMountEvent(true);
        };
        /**
         *  to show or hide comment box by setting the state values
         * @param isOpen
         * @param isPanAvoidImageContainerRender
         * @param avoidRender
         */
        this.showOrHideComment = function (isOpen, isPanAvoidImageContainerRender, avoidRender) {
            if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
            if (avoidRender === void 0) { avoidRender = false; }
            var setCommentBoxVisible = isOpen;
            var annotaion = markingStore.instance.getAnnotation(_this.clientToken);
            if (annotaion) {
                _this.comment = annotaion.comment;
            }
            // To prevent mark entry textbox to get process, we need to deactivate the
            // keyboard handler on comment open and viceversa.
            if (isOpen === true && !_this.isCommentBoxReadOnly) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Comment);
            }
            else {
                _this.mountOrUnMountEvent(false);
                if (!messageStore.instance.isMessagePanelVisible && !exceptionStore.instance.isExceptionPanelVisible) {
                    keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Comment);
                }
                // deleting comment while closing comment box
                // ie. deleting onpage comment while the comment text is empty
                // and to avoid deleting in closed response
                if (!_this.isCommentBoxReadOnly
                    && !_this.comment) {
                    _this.deleteComment(isPanAvoidImageContainerRender);
                    // after removing annotation the focus is setted to markscheme panel
                    // it is used to bring back the focus to the comment box
                    markingActionCreator.setMarkEntrySelected(true);
                    setCommentBoxVisible = false;
                }
                // in case the focus is lost from the comment side view boxes, reset selected edit box
                if (_this.isSideViewEnabledAndVisible === true &&
                    !onPageCommentHelper.commentMoveInSideView &&
                    !avoidRender) {
                    stampActionCreator.setSelectedSideViewComment(undefined);
                }
            }
            if (!avoidRender && _this.isComponentMounted) {
                _this.setState({
                    isOpen: setCommentBoxVisible,
                    renderedOn: Date.now()
                });
            }
        };
        /**
         *  to delete comment
         * @param isPanAvoidImageContainerRender
         */
        this.deleteComment = function (isPanAvoidImageContainerRender) {
            if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
            // avoid removeAnnotation event for invalid annotation(ie if clientToken is undefined)
            if (_this.clientToken) {
                var annotationClientTokenToBeDeleted = [];
                annotationClientTokenToBeDeleted.push(_this.clientToken);
                markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted, isPanAvoidImageContainerRender);
                if (_this.isSideViewEnabledAndVisible === true) {
                    onPageCommentHelper.updateSideViewItem(_this.clientToken, null, true);
                }
            }
        };
        /**
         *  listener to select the comment box in Side view
         */
        this.onSelectCommentBox = function (evt) {
            // Typing in the comment text area should not trigger the selection
            // 'key' to avoid tslint error
            var key = 'type';
            var event = evt;
            var deleteAncestor = htmlUtilities.findAncestor(event.target, 'delete-comment-button');
            var isDeleteButton = deleteAncestor ? deleteAncestor.classList[0] === 'delete-comment-button' : false;
            if (event.target[key] !== 'textarea' && !isDeleteButton &&
                _this.isSideViewEnabledAndVisible === true) {
                _this.mountOrUnMountEvent(false);
                var commentBoxHolder = htmlUtilities.findAncestor(event.target, 'comment-box-holder');
                if (commentBoxHolder) {
                    var boxHolderId = commentBoxHolder.attributes.getNamedItem('id');
                    if (boxHolderId) {
                        // get the client token before we set this.clientToken and check if we clicked on a different commentbox in Side view
                        // This avoids unnecessary calls when same box is clicked
                        var targetClientToken = commentBoxHolder.attributes.getNamedItem('id').value.split('_')[3];
                        if (targetClientToken !== _this.clientToken && _this.clientToken !== undefined) {
                            // perform various actions like keydown deactivate, delete empty previous comment etc.
                            // No need to render commentcontainer as render happens in setSelectedSideViewComment below
                            _this.showOrHideComment(false, false, true);
                        }
                        _this.clientToken = targetClientToken;
                        _this.showOrHideComment(true, false, true);
                        // Mounting events to close the comment while clicking outside
                        _this.mountOrUnMountEvent(true);
                        stampActionCreator.setSelectedSideViewComment(_this.clientToken);
                    }
                }
            }
        };
        /**
         * Listner for comment box drag event
         * @param event
         */
        this.onDragMove = function (event) {
            if (_this.isReadyToDrag === true && _this.isSideViewEnabledAndVisible === false) {
                _this.enableCommentContainerScroll(false);
                event.preventDefault();
                var element = $('.comment-box').get(0);
                _this.setCommentBoxPositions(event, element);
                _this.setCommentLinePositions(element);
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Listner for comment box drag start event
         * @param event
         */
        this.onDragStart = function (event) {
            if (event.target.classList !== undefined && event.target.classList[0] !== 'comment-textbox'
                && _this.isSideViewEnabledAndVisible === false) {
                _this.enableCommentContainerScroll(false);
                event.preventDefault();
                var annotation = markingStore.instance.getAnnotation(_this.clientToken);
                if (annotation) {
                    _this.comment = annotation.comment;
                }
                var element = $('.comment-box').get(0);
                var elementRect = element.getBoundingClientRect();
                _this.isReadyToDrag = true;
                _this.leftDeviation = Math.abs(event.center.x - elementRect.left + _this.wrapper.width);
                _this.topDeviation = Math.abs(event.center.y - elementRect.top);
            }
            else {
                _this.enableCommentContainerScroll(true);
                _this.isReadyToDrag = false;
            }
        };
        this.state = {
            isOpen: false,
            renderedOn: 0,
            hideCommentLines: false,
            hideCommentBoxes: false
        };
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onClick = this.onClick.bind(this);
        this.showOrHideComment = this.showOrHideComment.bind(this);
        this.showOnPageComment = this.showOnPageComment.bind(this);
        this.onAnnotationMoveEnd = this.onAnnotationMoveEnd.bind(this);
        /** getting the color of annotation from annotation helper */
        this.commentColor = colouredAnnotationsHelper.createAnnotationStyle(null, enums.DynamicAnnotation.OnPageComment).fill;
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.reRender = this.reRender.bind(this);
        this.onSelectCommentBox = this.onSelectCommentBox.bind(this);
        this.onCommentVisibilityChanged = this.onCommentVisibilityChanged.bind(this);
    }
    /**
     * Render method
     */
    CommentContainer.prototype.render = function () {
        var _this = this;
        // calculating width and padding for comment-wrapper
        var _widthCalc = window.innerWidth - this.overlayWidth;
        var _aspectRatio = this.overlayHeight / this.overlayWidth;
        // comment-wrapper style object
        var wrapperStyle;
        var containerStyle = null;
        var commentHolderEl = null;
        var commentHoldersSideView = null;
        var commentsSideViewbgEl = null;
        if (this.isSideViewEnabledAndVisible === false) {
            wrapperStyle = {
                width: 'calc(100% - ' + _widthCalc + 'px)',
                paddingTop: 'calc(' + _aspectRatio + ' * (100% - ' + _widthCalc + 'px))'
            };
            commentHolderEl = (React.createElement(CommentHolder, {clientToken: this.clientToken, comment: this.comment, markSchemeText: this.markSchemeText, commentBoxTop: this.commentBoxTop, commentBoxLeft: this.commentBoxLeft, selectedLanguage: this.props.selectedLanguage, key: 'commentHolder', id: 'commentHolder', renderedOn: this.state.renderedOn, isCommentBoxReadOnly: this.isCommentBoxReadOnly, isCommentBoxInActive: this.isCommentBoxInActive, naturalImageWidth: this.props.naturalImageWidth, naturalImageHeight: this.props.naturalImageHeight, isOpen: this.state.isOpen, lineX1: this.lineX1, lineX2: this.lineX2, lineY1: this.lineY1, lineY2: this.lineY2, lineMaskX: this.lineMaskX, lineMaskY: this.lineMaskY, wrapperStyle: wrapperStyle, enableCommentsSideView: this.isSideViewEnabledAndVisible, imageClusterId: null, outputPageNo: null, pageNo: null, overlayHeight: this.overlayHeight, overlayWidth: this.overlayWidth, windowsWidth: this.windowsWidth, commentColor: this.commentColor, enableCommentBox: this.props.enableCommentBox, isAnnotationMoving: this.isAnnotationMoving, holderCount: 0, marksheetHolderLeft: 0, boxRenderedOn: this.state.renderedOn, displayAngle: 0, hideCommentBoxes: this.state.hideCommentBoxes, selectedZoomPreference: this.props.selectedZoomPreference}));
        }
        else {
            var holderCount_1 = 0;
            commentsSideViewbgEl = (React.createElement("div", {className: 'comments-bg'}));
            containerStyle = { right: this.props.commentContainerRight };
            commentHoldersSideView = onPageCommentHelper.outputPages.map(function (x) {
                var marksheetHolderLeft = 0;
                var overlayheight = 0;
                var overlaywidth = 0;
                var height = 0;
                var width = 0;
                var overlayElement;
                var markSheetHolder;
                holderCount_1++;
                var displayAngle = _this.getDisplayAngle(x.pageNo, x.structeredPageNo, x.outputPageNo);
                if (x.overlayElement) {
                    overlayElement = x.overlayElement;
                    markSheetHolder = htmlUtilities.findAncestor(overlayElement, 'marksheet-holder');
                    if (markSheetHolder) {
                        marksheetHolderLeft = markSheetHolder.getBoundingClientRect().left;
                    }
                    switch (displayAngle) {
                        case 90:
                        case 270:
                            overlayheight = overlayElement.clientWidth;
                            overlaywidth = overlayElement.clientHeight;
                            height = x.width;
                            width = x.height;
                            break;
                        default:
                            overlayheight = overlayElement.clientHeight;
                            overlaywidth = overlayElement.clientWidth;
                            height = x.height;
                            width = x.width;
                            break;
                    }
                }
                _widthCalc = window.innerWidth - overlaywidth;
                _aspectRatio = height / width;
                // rounding to 4 decimal places for fixing IE issue in specific zones - #44909
                _aspectRatio = Math.round(_aspectRatio * 10000) / 10000;
                var paddingTopStyle;
                var marginTopStyle;
                switch (_this.props.selectedZoomPreference) {
                    case enums.ZoomPreference.FitWidth:
                        paddingTopStyle = 'calc(' + _aspectRatio + ' * (100% - ' + constants.SIDE_VIEW_COMMENT_PANEL_WIDTH + 'px))';
                        marginTopStyle = 'calc(3 * (100% - ' + constants.SIDE_VIEW_COMMENT_PANEL_WIDTH + 'px) / 100)';
                        break;
                    case enums.ZoomPreference.FitHeight:
                    case enums.ZoomPreference.Percentage:
                    case enums.ZoomPreference.MarkschemePercentage:
                        paddingTopStyle = overlayheight + 'px';
                        marginTopStyle = 'calc(3 * (' + overlaywidth + 'px) / 100)';
                        break;
                }
                wrapperStyle = {
                    width: 'calc(100% - ' + _widthCalc + 'px)',
                    paddingTop: paddingTopStyle,
                    marginTop: holderCount_1 === 1 ? 0 : marginTopStyle
                };
                return (React.createElement(CommentHolder, {clientToken: _this.clientToken, comment: _this.comment, markSchemeText: undefined, commentBoxTop: undefined, commentBoxLeft: undefined, selectedLanguage: _this.props.selectedLanguage, key: 'commentHolder' + holderCount_1, id: 'commentHolder' + holderCount_1, renderedOn: _this.state.renderedOn, isCommentBoxReadOnly: undefined, isCommentBoxInActive: undefined, naturalImageWidth: _this.props.naturalImageWidth, naturalImageHeight: _this.props.naturalImageHeight, isOpen: _this.state.isOpen, lineX1: undefined, lineX2: undefined, lineY1: undefined, lineY2: undefined, lineMaskX: undefined, lineMaskY: undefined, wrapperStyle: wrapperStyle, enableCommentsSideView: _this.isSideViewEnabledAndVisible, imageClusterId: x.imageClusterId, outputPageNo: x.outputPageNo, pageNo: x.pageNo, overlayHeight: overlayheight, overlayWidth: overlaywidth, windowsWidth: _this.windowsWidth, commentColor: _this.commentColor, enableCommentBox: _this.props.enableCommentBox, isAnnotationMoving: _this.isAnnotationMoving, holderCount: holderCount_1, selectedZoomPreference: _this.props.selectedZoomPreference, marksheetHolderLeft: marksheetHolderLeft, boxRenderedOn: _this.props.renderedOn, displayAngle: displayAngle, hideCommentBoxes: _this.state.hideCommentBoxes}));
            });
        }
        return (React.createElement("div", {className: classNames('comment-container', {
            'hide-line': this.state.hideCommentLines,
            'hide-box': this.state.hideCommentBoxes,
            'hide': this.hideCommentContainer
        }), ref: 'commentContainer', onClick: function (e) { return _this.onClick(e); }, onDoubleClick: function (e) { return _this.onClick(e); }, onScroll: function (e) { return _this.onScrollHandler(e); }, onWheel: function (e) { return _this.onWheelHandler(e); }, onContextMenu: function (e) { return _this.onClick(e); }, style: containerStyle}, commentHolderEl, commentHoldersSideView, commentsSideViewbgEl));
    };
    /**
     * This function gets invoked when the component is mounted
     */
    CommentContainer.prototype.componentDidMount = function () {
        this.isComponentMounted = true;
        stampStore.instance.addListener(stampStore.StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT, this.toggleCommentLinesAndBoxesVisiibility);
        stampStore.instance.addListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.showOnPageComment);
        stampStore.instance.addListener(stampStore.StampStore.DELETE_COMMENT, this.deleteComment);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.reRenderOnZoom);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.reRenderCommentBoxesOnly);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationMoveEnd);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.reRender);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_VISIBILITY_CHANGED_EVENT, this.onCommentVisibilityChanged);
        ecourseWorkFileStore.instance.addListener(ecourseWorkFileStore.ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT, this.reRender);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.reRenderAfterAnimation);
        if (this.props.enableCommentsSideView === true) {
            this.mountOrUnMountEvent(true);
            // Set this.clientToken to preserve the switch from on page comment mode to side view
            this.clientToken = stampStore.instance.SelectedSideViewCommentToken;
        }
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.reRenderAfterAnimation);
        this.setUpEvents();
        // Appending the touchmove event handler to the Comment Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.appendEventHandler(this.refs.commentContainer, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isAndroidChrome());
    };
    /**
     * This function gets invoked when the component is updated
     */
    CommentContainer.prototype.componentDidUpdate = function () {
        this.isAnnotationMoving = false;
    };
    /**
     * This function gets invoked when the component will receive props
     */
    CommentContainer.prototype.componentWillReceiveProps = function (nxtProps) {
        /* if (this.props.enableCommentsSideView !== nxtProps.enableCommentsSideView &&
            this.props.enableCommentsSideView === true) {
            stampActionCreator.setSelectedSideViewComment(stampStore.instance.SelectedSideViewCommentToken);
        }*/
        if (this.props.commentContainerRight !== nxtProps.commentContainerRight &&
            this.props.enableCommentsSideView === true) {
            this.horizontalScrollInProgress = true;
        }
        else {
            this.horizontalScrollInProgress = false;
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    CommentContainer.prototype.componentWillUnmount = function () {
        this.isComponentMounted = false;
        stampStore.instance.removeListener(stampStore.StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT, this.toggleCommentLinesAndBoxesVisiibility);
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.showOnPageComment);
        stampStore.instance.removeListener(stampStore.StampStore.DELETE_COMMENT, this.deleteComment);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.reRenderOnZoom);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.reRenderCommentBoxesOnly);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationMoveEnd);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_VISIBILITY_CHANGED_EVENT, this.onCommentVisibilityChanged);
        ecourseWorkFileStore.instance.removeListener(ecourseWorkFileStore.ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT, this.reRender);
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.reRenderAfterAnimation);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.reRenderAfterAnimation);
        this.unRegisterEvents();
        // Removing the touchmove event handler to the Comment Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.removeEventHandler(this.refs.commentContainer, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isAndroidChrome());
    };
    /**
     * Mount or unmount events on demand
     * @param {boolean} active
     */
    CommentContainer.prototype.mountOrUnMountEvent = function (active) {
        if (active === true) {
            stampStore.instance.addListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.showOrHideComment);
        }
        else {
            stampStore.instance.removeListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.showOrHideComment);
        }
    };
    /**
     * Re render the container
     */
    CommentContainer.prototype.reRender = function () {
        this.setState({
            renderedOn: Date.now()
        });
    };
    /**
     *  annotation move
     */
    CommentContainer.prototype.onAnnotationMoveEnd = function (draggedAnnotationClientToken, isPositionUpdated, isDrawEndOfStampFromStampPanel, stampId) {
        if (stampId === enums.DynamicAnnotation.OnPageComment && this.isSideViewEnabledAndVisible === true) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    /**
     * prevent default behaviour while clicking on comment container
     * @param any
     */
    CommentContainer.prototype.onClick = function (e) {
        markingActionCreator.showOrHideRemoveContextMenu(false);
        if (this.isSideViewEnabledAndVisible === true) {
            if (e.target.classList && e.target.classList[0] !== 'comments-bg') {
                this.onSelectCommentBox(e);
                e.preventDefault();
                e.stopPropagation();
            }
        }
        else {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    /**
     * This will setup events
     */
    CommentContainer.prototype.setUpEvents = function () {
        var element = Reactdom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            var touchActionValue = 'pan-x,pan-y';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { threshold: 0 });
            this.eventHandler.on(eventTypes.PAN_START, this.onDragStart);
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onDragMove);
        }
    };
    /**
     * unregister events
     */
    CommentContainer.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * calculate the left and top positions of comment box on drag/pan
     * @param event
     * @param element
     */
    CommentContainer.prototype.setCommentBoxPositions = function (event, element) {
        var elementRect = element.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        this.wrapperLeft = event.center.x - this.leftDeviation;
        this.wrapperTop = event.center.y - this.topDeviation;
        if (event.center.x - this.leftDeviation < 0) {
            this.wrapperLeft = 0;
        }
        if (event.center.y - this.topDeviation < 0) {
            this.wrapperTop = 0;
        }
        if (event.center.x - this.leftDeviation + elementRect.width > vw) {
            this.wrapperLeft = vw - elementRect.width;
        }
        if (event.center.y - this.topDeviation + elementRect.height > vh) {
            this.wrapperTop = vh - elementRect.height;
        }
        this.commentBoxLeft = 100 * ((this.wrapperLeft + this.wrapper.width - constants.RESPONSE_LEFT_PANEL_WIDTH) / this.overlayWidth);
        this.commentBoxTop = 100 * (this.wrapperTop - constants.RESPONSE_TOP_PANEL_HEIGHT) / this.overlayHeight;
    };
    /**
     * calculate the position (X2,Y2) of comment line on drag/pan
     * @param event
     * @param element
     */
    CommentContainer.prototype.setCommentLinePositions = function (element) {
        var elementRect = element.getBoundingClientRect();
        var lineleft = 100 * (((this.wrapperLeft + this.wrapper.width - constants.RESPONSE_LEFT_PANEL_WIDTH) +
            (elementRect.width / 2)) / this.overlayWidth);
        var lineTop = 100 * ((this.wrapperTop - constants.RESPONSE_TOP_PANEL_HEIGHT) +
            (elementRect.height / 2)) / this.overlayHeight;
        this.lineX2 = lineleft;
        this.lineY2 = lineTop;
    };
    Object.defineProperty(CommentContainer.prototype, "isSideViewEnabledAndVisible", {
        /**
         * returns whether side view is enabled and open (will rturn false if exception or message windows open)
         */
        get: function () {
            return (this.props.enableCommentsSideView && this.props.enableCommentBox);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns the display angle
     */
    CommentContainer.prototype.getDisplayAngle = function (pageNo, structerdPageNo, outputPageNo) {
        var displayAngle = 0;
        var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
            displayAngleCollection.map(function (angle, key) {
                var str = key.split('_');
                if (str[0] + '_' + str[1] + '_' + str[2] === 'img_' + structerdPageNo + '_' + outputPageNo) {
                    displayAngle = angle;
                }
            });
        }
        displayAngle = annotationHelper.getAngleforRotation(displayAngle);
        return displayAngle;
    };
    /**
     * Invoke when response comment container visibility has been chanegd
     * @param isVisible
     */
    CommentContainer.prototype.onCommentVisibilityChanged = function (isVisible) {
        this.hideCommentContainer = !isVisible;
    };
    return CommentContainer;
}(eventManagerBase));
module.exports = CommentContainer;
//# sourceMappingURL=commentcontainer.js.map