"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ReactDom = require('react-dom');
var pureRenderComponent = require('../../base/purerendercomponent');
var Immutable = require('immutable');
var SingleImageViewer = require('./singleimageviewer');
var StitchedImageViewer = require('./stitchedimageviewer');
var responseStore = require('../../../stores/response/responsestore');
var stampStore = require('../../../stores/stamp/stampstore');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var classNames = require('classnames');
var UnStructuredResponseImageViewer = require('./unstructuredresponseimageviewer');
var enums = require('../../utility/enums');
var deviceHelper = require('../../../utility/touch/devicehelper');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var ContextMenu = require('../../utility/contextmenu/contextmenu');
var userOptionHelper = require('../../../utility/useroption/useroptionshelper');
var qigStore = require('../../../stores/qigselector/qigstore');
var markingStore = require('../../../stores/marking/markingstore');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var PageNumberIndicator = require('./pagenumberindicator');
var moduleKeyHandler = require('../../../utility/generic/modulekeyhandler');
var modulekeys = require('../../../utility/generic/modulekeys');
var keyDownHelper = require('../../../utility/generic/keydownhelper');
var keycodes = require('../../../utility/keyboardacess/keycodes');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var CommentContainer = require('../annotations/comments/commentcontainer');
var Zoomable = require('../../utility/zoom/Zoomable');
var ZoomableUnstructuredImage = require('./zoomableunstructuredimage');
var ZoomableStructuredImage = require('./zoomablestructuredimage');
var zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
var $ = require('jquery');
var localeStore = require('../../../stores/locale/localestore');
var constants = require('../../utility/constants');
var LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
var busyIndicatorHelper = require('../../utility/busyindicator/busyindicatorhelper');
var messageStore = require('../../../stores/message/messagestore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var timerHelper = require('../../../utility/generic/timerhelper');
var onPageCommentHelper = require('../../utility/annotation/onpagecommenthelper');
var zoomHelper = require('./zoomhelper/zoomhelper');
var pageLinkHelper = require('./linktopage/pagelinkhelper');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var FileNameIndicator = require('./filenameindicator');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var worklistStore = require('../../../stores/worklist/workliststore');
var enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var BookmarkStampBox = require('../annotations/bookmarkstampbox');
var fracsHelper = require('../../../utility/generic/fracshelper');
/* tslint:disable:variable-name */
var HideCommentsPanel = function (props) { return (React.createElement("div", {className: 'relative'}, React.createElement("div", {id: 'hideCommentsSideView', className: 'hide-comment-holder', title: localeStore.instance.TranslateText('marking.response.comments-side-view.hide-comments-tooltip'), style: props.panelStyle}, React.createElement("a", {href: 'javascript:void(0);', onClick: function () { props.sideViewToggleCallback(); }, className: 'hide-comment-link'}, localeStore.instance.TranslateText('marking.response.comments-side-view.hide-comments'))))); };
var COMMENT_CONTAINER_PADDING = 5;
var BOOKMARK_TEXTBOX_POINITING_ARROW_SIZE = 56;
/**
 * React component class for Image Zone container.
 */
var ImageContainer = (function (_super) {
    __extends(ImageContainer, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function ImageContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isOnPageCommentStamped = false;
        this.cursorDivStyle = { 'top': 0, 'left': 0 };
        this.isUnStructured = false;
        this.orientationChange = false;
        this._changeDeviceOrientation = null;
        this.isDrawStart = false;
        this.isMarksAndAnnotationsLoaded = false;
        // The no: of images rendered.
        this.renderedImageCount = 0;
        // Hold a value indicating the previous scroll top when
        // zoom begins
        this.scrollPosition = 0;
        // Holds a value indicating previous marksheet view holder width
        // when zoom begins
        this.previousContainerWidth = 0;
        // Holds a value indicating previous marksheet view holder scroll left
        // when zoom begins
        this.previousScrollLeft = 0;
        //to store the rotaed images
        this.rotatedImages = [];
        // flag for enabling scroll
        this.doEnableScroll = true;
        // Holds a value indicating the previous zoom width
        // which is updating when pinch to zoom is happening
        this.previousZoomWidth = 0;
        // Holding a value indicating the zoom origin
        this.zoomX = 0;
        this.zoomY = 0;
        // Indicating whether response is ready for pinch zoom.
        this.isPinchReady = false;
        // Holds a value indicating updated zoom type to zoom
        this.updatedZoomType = [];
        // Holds the last pinch scale factor
        this.pinchScaleFactor = 0;
        this.isZoomingInitiated = false;
        this.marginTop = 0;
        this.marginLeft = 0;
        this.animating = false;
        this.commentContainerRight = 0;
        this.fracsLoadedImageCount = 0;
        // Holds marksheet-container values
        this.markSheetWrapper = undefined;
        this.structuredImageZone = new Array();
        // Holds the biggest aspected ratio to check whether the horizontal scroll bar comes while fit-height.
        this.biggestRatio = 0;
        // detect horizontal or vertical scroll
        this.markSheetScrollLeft = 0;
        this.markSheetScrollTop = 0;
        this.isUserOptionZoom = false;
        this.isFirstCommentOnSideView = false;
        this.previousScrollHeightRatio = 0;
        // Value indicating to freeze the comment sideview on view.
        // This will draw a dummy sideview over the existing one.
        this.freezeCommentSideView = false;
        // Hold the initial click value on zoom till animationend called.
        this.previousImageWidth = 0;
        this.allowRenderSideViewComments = false;
        //Holds bookmark initial text
        this.bookmarkText = '';
        //holds book mark client token
        this.bookmarkClientToken = '';
        //holds book mark Top position
        this.bookmarkTop = 0;
        //holds book mark Left position
        this.bookmarkLeft = 0;
        //holds book mark Text box visibility
        this.isBookmarkTextBoxOpen = false;
        //Hold the Bookmark text box position
        this.bookmarkTextboxPosition = 'left';
        this.isBookletView = false;
        this.isSideViewPanelToggled = false;
        this.isFileViewPanelToggled = true;
        // This will check whether manual scrolling is happening.
        this.isManuallyScrolling = true;
        this.imageContainerHeight = 0;
        this.imageContainerWidth = 0;
        /*sets the pan enable status for the annotation overlay*/
        this.enableImageContainerScroll = function (value) {
            _this.doEnableScroll = value;
        };
        /* touch move event for image container*/
        this.onTouchMoveHandler = function (event) {
            if (!_this.doEnableScroll && htmlUtilities.isTabletOrMobileDevice) {
                event.preventDefault();
            }
        };
        /**
         * to reset the enhanced off page comment container height when visibility changed
         */
        this.enhancedOffPageCommentVisibilityChanged = function (isEnhancedOffPageCommentsPanelVisible) {
            if (!isEnhancedOffPageCommentsPanelVisible) {
                _this.enhancedOffPageCommentHeight = 0;
            }
            else {
                _this.enhancedOffPageCommentHeight = Number(userOptionHelper.getUserOptionByName(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT));
            }
        };
        /**
         * reset values while response navigation
         */
        this.responseChanged = function () {
            // Reset the rendered image count while navigate to next or previous response.
            _this.renderedImageCount = 0;
            _this.currentImageIdToScroll = undefined;
            // reset the book mark previous scroll data while navigate to next or previous response.
            responseActionCreator.setBookmarkPreviousScrollData(undefined);
        };
        /**
         * Called once panel is resized to left/right
         */
        this.updateZoomAfterChangingFileListpanelView = function () {
            _this.setState({
                renderedOn: Date.now(),
                refreshZoom: Date.now()
            });
        };
        /**
         * Method to be invoked once the annotation starts drawing
         */
        this.onAnnotationDrawStart = function (isDrawStart) {
            _this.isDrawStart = isDrawStart;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         *  This will re-render the component.
         * @param removedAnnotation
         * @param isPanAvoidImageContainerRender
         */
        this.reRender = function (removedAnnotation, isPanAvoidImageContainerRender) {
            if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
            // following condition is checked to prevent the imagecontainer getting refreshed everytime, while
            // we resizing the panel
            if (markingStore.instance.getResizedPanelClassName() || enhancedOffPageCommentStore.instance.isEnhancedOffpageCommentResizing) {
                return;
            }
            if (!isPanAvoidImageContainerRender) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            // need to refactor this section as we are using same method 'reRender' for enhanced offpage activities and remove annotation
            if (removedAnnotation === undefined) {
                // we need to recalculate zoom value if zoom preference is set to fitToHeight 
                // and height / visibility of enhanced off page comment is changed
                if (_this.state.zoomPreference === enums.ZoomPreference.FitHeight) {
                    zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, enums.ResponseViewSettings.FitToHeight);
                }
            }
        };
        /**
         *  function for applying zoom settings while changing the device orientation
         */
        this.changeDeviceOrientation = function () {
            _this.orientationChange = true;
            var element = ReactDom.findDOMNode(_this.refs.markSheet);
            // element will be null when no content has been assigned to the question item.
            if (element && (_this.props.imageZonesCollection ? _this.props.imageZonesCollection.length > 0 ? true : false : false)
                || (_this.props.imagesToRender ? _this.props.imagesToRender.length > 0 ? true : false : false)) {
                var scrollHeightRatio = _this.scrollHeightRatio === 0 ? _this.getScrollHeightRatio(element) : _this.scrollHeightRatio;
                var scrollTop = (element.scrollHeight * scrollHeightRatio) / 100;
                element.scrollTop = scrollTop;
            }
        };
        /**
         * This method will swith response view. Without this function, the full response view button will not work in structured response.
         */
        this.switchResponseView = function () {
            _this.props.switchViewCallback();
        };
        /**
         * This method will find the current scroll position of MarkSheetContainer Div.
         */
        this.findCurrentScrollPosition = function () {
            //Reset the linked zone page number after scroll postion change.
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured || responseHelper.isEbookMarking) {
                if (markingStore.instance.currentlyLinkedZonePageNumber > 0) {
                    markingStore.instance.resetLinkedZonePageNumber();
                }
            }
            var elem = ReactDom.findDOMNode(_this.refs.markSheet);
            // save the current scroll position in store
            // elem will be undefined for unzoned pages in EBM. Hence storing the top a s 0 for those cases.        
            responseActionCreator.setCurrentScrollPosition(((elem) ? elem.scrollTop : 0), true);
        };
        /**
         * Get the Image container properties.
         */
        this.getMarkSheetContainerProperties = function () {
            var element = ReactDom.findDOMNode(_this.refs.markSheet);
            return {
                'element': element
            };
        };
        /**
         * if the comment box is open we should close comment box while scrolling using
         * scroll bar
         * @param event
         */
        this.onMouseDownHandler = function (event) {
            var markSheetWidth = 0;
            var markSheetHeight = 0;
            // Defect 69602 fix : refs will be empty on rendering the component,
            // so check check the existance o element bofore usage to avoid unhandled errors
            if (_this.refs.markSheet) {
                markSheetWidth = _this.refs.markSheet.getBoundingClientRect().width;
                markSheetHeight = _this.refs.markSheet.getBoundingClientRect().height;
            }
            var commentBoxContainer = $('.comment-box');
            var bookmarkBoxContainer = $('.bookmark-entry');
            // checking for the click on scroll Bar inside imageContainer
            if (markSheetWidth <= event.clientX || markSheetHeight <= event.clientY) {
                // if the click is inside the comment box then we should not
                // hide the comment box if it is open
                if ((commentBoxContainer) &&
                    !((commentBoxContainer.is(event.target)) || ((commentBoxContainer.has(event.target).length > 0)))) {
                    stampActionCreator.showOrHideComment(false);
                }
                if ((bookmarkBoxContainer) &&
                    !((bookmarkBoxContainer.is(event.target)) || ((bookmarkBoxContainer.has(event.target).length > 0)))) {
                    stampActionCreator.showOrHideBookmarkNameBox(false);
                }
            }
        };
        /**
         * On mouse scroll hide context menu
         * @param event
         */
        this.onScrollHandler = function (event) {
            // to detect if scrolled vertically or horizontally
            var scrollDelta = _this.getScrollDelta();
            // let isHorizontalScroll: boolean = scrollDelta[0] > 0;
            var isVerticalScroll = scrollDelta[1] > 0;
            // In firefox after clicking  yes/no on DeleteComment Popup OnScroll getting executed
            // so the Comment Box getting closed
            // The issue was not able to find in latest version of firefox hence adding the change to onScrollHandler
            if (deviceHelper.isTouchDevice() === true &&
                (stampStore.instance.SelectedOnPageCommentClientToken !== undefined && !_this.isSideViewEnabledAndVisible)) {
                stampActionCreator.showOrHideComment(false);
            }
            if (deviceHelper.isTouchDevice() === true && markingStore.instance.selectedBookmarkClientToken) {
                stampActionCreator.showOrHideBookmarkNameBox(false);
            }
            if (isVerticalScroll) {
                markingActionCreator.showOrHideRemoveContextMenu(false);
                // find active page for structured and E-bookmarking
                if (_this.props.imageZonesCollection && _this.previousMarkSheetContainerHeight === _this.refs.markSheet.clientHeight &&
                    _this.previousMarkSheetContainerWidth === _this.refs.markSheet.clientWidth && !_this.isSideViewPanelToggled) {
                    var index_1 = 0;
                    var pageNo_1;
                    var that_1 = _this;
                    if (_this.props.isEBookMarking) {
                        // need to handle Ebookmarking scenario
                        // renderImages = this.renderEbookmarkingSingleImage(this.props.imageZonesCollection, index);
                        var imageCount_1 = 0;
                        // Loop through images either single/Stitched
                        _this.props.imageZonesCollection[0].map(function (item) {
                            var image = that_1.props.imagesToRender[0][imageCount_1];
                            pageNo_1 = image ? image.split('/')[9] : 0;
                            imageCount_1++;
                            index_1++;
                            var elementId = 'outputPageNo_' + index_1;
                            _this.setCurrentImageIdToScroll(elementId);
                        });
                    }
                    else {
                        _this.props.imageZonesCollection.map(function (imageZones) {
                            if (imageZones.count() === 1) {
                                pageNo_1 = that_1.props.imagesToRender[index_1][0] ? that_1.props.imagesToRender[index_1][0].split('/')[9] : 0;
                            }
                            else {
                                pageNo_1 = that_1.props.imagesToRender[index_1] ? that_1.props.imagesToRender[index_1][0].split('/')[9] : 0;
                            }
                            index_1++;
                            var elementId = 'outputPageNo_' + index_1;
                            _this.setCurrentImageIdToScroll(elementId);
                        });
                        // render the linked pages
                        _this.props.imagesToRender.map(function (images, collectionIndex) {
                            if (collectionIndex >= index_1) {
                                _this.doApplyLinkingScenarios = true;
                                pageNo_1 = images[0] ? images[0].split('/')[9] : 0;
                                var elementId = 'outputPageNo_' + index_1;
                                _this.setCurrentImageIdToScroll(elementId);
                            }
                        });
                    }
                }
                if (_this.isUnStructured && _this.isManuallyScrolling) {
                    // pass argument as true to indicate the method is invoked from the scroll.
                    _this.handlePageNumberIndicator();
                }
                if (!_this.orientationChange) {
                    var marksheetContainer = ReactDom.findDOMNode(_this.refs.markSheet);
                    if (_this.previousMarkSheetContainerHeight === marksheetContainer.clientHeight &&
                        _this.previousMarkSheetContainerWidth === marksheetContainer.clientWidth && !_this.isSideViewPanelToggled &&
                        !_this.isFileViewPanelToggled) {
                        _this.findScrollHeightRatio();
                    }
                    if (!_this.isFileViewPanelToggled) {
                        _this.previousMarkSheetContainerHeight = marksheetContainer.clientHeight;
                        _this.previousMarkSheetContainerWidth = marksheetContainer.clientWidth;
                    }
                }
                _this.orientationChange = false;
            }
            // sets the right style attribute so that the comment side view is maintained on scroll
            // Checking this.animating to verify when an animation is happening in between and if a scroll
            // has been triggered, we should not re-render the comment container.
            if (_this.isSideViewEnabledAndVisible && !isVerticalScroll) {
                var resetScroll = (_this.state.zoomPreference === enums.ZoomPreference.FitWidth);
                _this.setCommentContainerRightAttribute(resetScroll, true);
            }
            _this.isManuallyScrolling = true;
        };
        /**
         * This method will set current ImageId to scroll
         * @private
         * @memberof ImageContainer
         */
        this.setCurrentImageIdToScroll = function (elementId) {
            var markSheetElement = $('#' + elementId);
            if (markSheetElement[0]) {
                // getting fracs data for particular image
                var fracsData = fracsHelper.getFracs(markSheetElement[0]);
                // adding to array only if the image is visible
                if (fracsData.visible > 0) {
                    var currentScrollTop = _this.refs.markSheet.scrollTop;
                    var imageHeight = markSheetElement[0].offsetHeight;
                    var offsetTop = markSheetElement[0].offsetTop;
                    if (currentScrollTop > offsetTop && currentScrollTop < offsetTop + imageHeight) {
                        _this.currentImageIdToScroll = elementId;
                    }
                }
            }
        };
        /**
         * if the comment box is open we should block scrolling using
         * mouse wheel
         * @param event
         */
        this.onWheelHandler = function (event) {
            var isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
            // prevent scroll using mouse Wheel when comment boxk is open
            if (isCommentBoxOpen) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            else if (stampStore.instance.SelectedSideViewCommentToken !== undefined) {
                stampActionCreator.showOrHideComment(false);
            }
        };
        /**
         * When the user click on the image, set the mark entry box as selected.
         * If OnPage comment or a bookmark has been stamped then the focus should be
         * retained in the corresponding OnPage comment box or bookmark textbox
         * Otherwise focus should be in mark scheme panel
         */
        this.onImageContainerClicked = function () {
            // If OnPage comment or a bookmark has been stamped then the focus should be
            // retained in the corresponding OnPage comment box or bookmark textbox, else focus should be in mark scheme panel
            if (!_this.isOnPageCommentStamped && !_this.isBookmarkTextBoxOpen) {
                markingActionCreator.setMarkEntrySelected();
            }
            else {
                _this.isOnPageCommentStamped = false;
            }
        };
        /**
         * Calculates the most visible page no and the corresponding image and
         * raises and action to update the page indicator.
         */
        this.handlePageNumberIndicator = function () {
            var visiblePages = [];
            var visiblePageTops = [];
            var visiblePageimageNumbers = [];
            var counter = 1;
            var marksheetContainer = ReactDom.findDOMNode(_this.refs.markSheet);
            var visibleInFracs = [];
            _this.props.fileMetadataList.map(function (fileMetadata, index) {
                if (!fileMetadata.isSuppressed) {
                    var pageNumber = fileMetadata.pageNumber;
                    var markSheetElement = $('#img_' + pageNumber);
                    if (markSheetElement[0]) {
                        /** For displaying the page which has the maximum visibility, the top value of marksheet element
                         * is reduced by 25 percentage of marksheet elements height
                         */
                        var overlayTop = markSheetElement[0].getBoundingClientRect().top -
                            (markSheetElement[0].getBoundingClientRect().height * 0.25);
                        // getting fracs data for particular image
                        var fracsData = fracsHelper.getFracs(markSheetElement[0]);
                        // adding to array only if the image is visible
                        if (fracsData.visible > 0) {
                            var obj = { visible: 0, pageNo: 0, imgNo: 0 };
                            obj.imgNo = counter;
                            obj.pageNo = pageNumber;
                            obj.visible = fracsData.visible;
                            visibleInFracs.push(obj);
                        }
                        counter++;
                    }
                }
            });
            if (visibleInFracs.length > 0) {
                var _visibleInFracs = visibleInFracs.sort(function (a, b) { return b.visible - a.visible; });
                // EBookMarking scenario will be handled with structrued responses.
                if (!_this.props.isEBookMarking && _this.isUnStructured) {
                    _this.currentImageIdToScroll = 'img_' + _visibleInFracs[0].pageNo;
                }
                // removing all image details other than first 2 images (splice(RemoveFromStartIndex,noOfItemstoRemove))
                // because in pageIndicator we used to show maximum up to 2 page numbers
                if (_visibleInFracs.length > constants.BOOKLET_VIEW_IMAGE_COUNT) {
                    _visibleInFracs.splice(constants.BOOKLET_VIEW_IMAGE_COUNT, _visibleInFracs.length - constants.BOOKLET_VIEW_IMAGE_COUNT);
                }
                var pageIndicators = _this.getPageNumberIndicatorDetails(_visibleInFracs);
                responseActionCreator.updatePageNoIndicator(pageIndicators.newPageNumber, pageIndicators.newImageNumber, _this.isBookletView);
            }
        };
        /**
         * function to trigger pinch to zoom
         * @param {enum} zoomtype
         * @param {any} event
         */
        this.onPinchZoom = function (zoomType, event) {
            if (_this.currentZoomPercentage) {
                _this.currentZoomPercentage = _this.currentZoomPercentage;
            }
            else {
                _this.currentZoomPercentage = responseStore.instance.currentZoomPercentage;
            }
            // Both custom_zoom and pinch_to_zoom for devices has been handled here
            switch (zoomType) {
                case enums.ZoomType.PinchIn:
                    _this.zoomType = enums.ZoomType.PinchIn;
                    _this.pinchZoomFactor = -(constants.PINCH_ZOOM_FACTOR);
                    _this.pinchZoom(event);
                    break;
                case enums.ZoomType.PinchOut:
                    _this.zoomType = enums.ZoomType.PinchOut;
                    _this.pinchZoomFactor = constants.PINCH_ZOOM_FACTOR;
                    _this.pinchZoom(event);
                    break;
                case enums.ZoomType.CustomZoomIn:
                    _this.pinchZoomFactor = (constants.MAX_ZOOM_PERCENTAGE - _this.currentZoomPercentage) / constants.MIN_ZOOM_PERCENTAGE;
                    _this.currentZoomPercentage = _this.pinchZoomFactor >= 1 ?
                        _this.currentZoomPercentage + constants.MIN_ZOOM_PERCENTAGE : constants.MAX_ZOOM_PERCENTAGE;
                    _this.customZoom(zoomType);
                    break;
                case enums.ZoomType.CustomZoomOut:
                    if (_this.currentZoomPercentage > constants.MAX_ZOOM_PERCENTAGE) {
                        _this.pinchZoomFactor = (constants.MAX_ZOOM_PERCENTAGE - _this.currentZoomPercentage) / constants.MIN_ZOOM_PERCENTAGE;
                        _this.currentZoomPercentage = _this.pinchZoomFactor >= 1 ?
                            _this.currentZoomPercentage + constants.MIN_ZOOM_PERCENTAGE : constants.MAX_ZOOM_PERCENTAGE;
                    }
                    else {
                        _this.pinchZoomFactor = (_this.currentZoomPercentage - constants.MIN_ZOOM_PERCENTAGE);
                        _this.currentZoomPercentage = _this.pinchZoomFactor >= constants.MIN_ZOOM_PERCENTAGE ?
                            _this.currentZoomPercentage - constants.MIN_ZOOM_PERCENTAGE : constants.MIN_ZOOM_PERCENTAGE;
                    }
                    _this.customZoom(zoomType);
                    break;
                case enums.ZoomType.UserInput:
                    _this.currentZoomPercentage = responseStore.instance.userZoomValue;
                    _this.customZoom(zoomType);
                    break;
                default:
                    break;
            }
        };
        /**
         * function to trigger pinch end
         * @param {any} event
         */
        this.onPinchEnd = function (event) {
            if (_this.props.enableCommentsSideView && _this.props.enableCommentBox) {
                // action to trigger the animation on zoom ends here.
                stampActionCreator.toggleCommentLinesVisibility(false, false);
                _this.triggerAnimationEndForSideViewComments();
            }
            // preparing scrollLeft and top value based on the changed offsetTop while pinching.
            // adding constant of 10 as including padding value. -1 indicating the how far we have set the top position
            var sT = ($('.marksheet-view-holder').offset().top - ($('.marksheet-container').offset().top) - 10) * -1;
            var sL = ($('.marksheet-view-holder').offset().left - $('.marksheet-container').offset().left - 10) * -1;
            // using last pinch scale value since onPinchEnd is triggered from pinchcancel event
            var resultWidth = _this.previousZoomWidth *
                (_this.pinchScaleFactor === 0 ? _this.getPinchScaleFactor(event.scale) : _this.pinchScaleFactor);
            var paddingStyle = '0px 0px';
            // setting the width and removing transformation
            // For structured response we dont need to set the marksheet holder width explicitly as this is already
            // set in percentage. we only have to set the parent container width then the child will stretch to the
            // specific width.
            if (_this.isUnStructured) {
                $('.marksheet-holder').css({
                    'font-size': ((resultWidth / 2) / 10) + 'px',
                    'width': +resultWidth + 'px', 'margin-left': 0
                });
            }
            else {
                $('.marksheet-holder').css({
                    'font-size': ((resultWidth / 2) / 10) + 'px'
                });
            }
            // modifying the current zoom value
            _this.currentZoomPercentage = (resultWidth / _this.naturalImageWidth) * 100;
            /* for rotated structured images we need to reset the padding based on the same calculation using on rotation. */
            if (!_this.isUnStructured && responseStore.instance.hasRotatedImages
                && _this.currentZoomPercentage <= constants.MAX_ZOOM_PERCENTAGE) {
                var padding = zoomHelper.getRotatedPagePadding(resultWidth, _this.structuredImageZone, _this.rotatedImages, _this.currentZoomPercentage, responseStore.instance.displayAnglesOfCurrentResponse);
                if (padding > 0) {
                    paddingStyle = 0 + ' ' + padding + 'px';
                    resultWidth = (resultWidth + (padding * 2));
                }
            }
            $('.marksheet-view-holder').css({
                'width': resultWidth + 'px',
                'transform': '',
                'transform-origin': '',
                'padding': paddingStyle
            });
            // setting scrollTop and Left
            $('.marksheet-container').scrollTop(sT).scrollLeft(sL);
            _this.enableImageContainerScroll(true);
            zoomPanelActionCreator.isPinchZooming(false);
            _this.animating = false;
            // Defect 65186 fix - on pinchzoom the useroption is get saved as undefined/NaN intermittently.
            // Save the minimal zoom value as a defensive fix 
            var _currentZoomPercentage = _this.currentZoomPercentage ? _this.currentZoomPercentage : constants.AVG_ZOOM_PERCENTAGE;
            // update the value in user option
            _this.updateAndSaveZoomPreference(_currentZoomPercentage);
            // update value to store
            zoomPanelActionCreator.responseZoomUpdated(_currentZoomPercentage);
            zoomPanelActionCreator.zoomAnimationEnd(true);
            _this.currentZoomPercentage = undefined;
            // Reset the zoom value that are used to set if user zoomed from FITWIDTH/HEIGHT to 0
            // so it will not set any width unless we demand on next re-render
            zoomPanelActionCreator.responsePinchZoomCompleted(resultWidth);
            // removing the class 'zooming' which is added during pinch In and pinch Out
            $('.marksheet-zoom-holder').removeClass('zooming');
            /* Resetting the view holder left and top which was set in custom zoom animation start
              - to handle the scenario of pinch zoom before custom zoom animation ends */
            $('.marksheet-view-holder').css({ 'top': '', 'left': '' });
        };
        /**
         * function to trigger pinch start
         * @param {any} event
         */
        this.onPinchStart = function (event) {
            _this.isPinchReady = false;
            var zoomPreference = _this.getCurrentUserOption();
            // adding the class 'zooming' which is added during pinch In and pinch Out
            $('.marksheet-zoom-holder').addClass('zooming');
            //Defect 66722 - Comment box does not close on pinch zoom in devices
            //Earlier only if scroll was enabled the comment box was closing
            //So added a call to stampactioncreator to close comment box if pinch to zoom is started
            if (stampStore.instance.SelectedOnPageCommentClientToken !== undefined && !_this.isSideViewEnabledAndVisible) {
                stampActionCreator.showOrHideComment(false);
            }
            // hide the comment lines in side view
            if (_this.props.enableCommentsSideView && _this.props.enableCommentBox) {
                stampActionCreator.toggleCommentLinesVisibility(true, true);
            }
            // taking the current scroll top and left to calculate the touch area and do zoom in/out
            // operation based on this.
            var sT = $('.marksheet-container').scrollTop();
            var sL = $('.marksheet-container').scrollLeft();
            // taking the offpage comment height for calculating the zoomy value
            var enhancedOffPageCommentHeight = annotationHelper.percentToPixelConversion(_this.enhancedOffPageCommentHeight, (window.innerHeight - constants.COMMON_HEADER_HEIGHT));
            // If the user has selected FIT HEIGHT/WIDTH we need to remove the default width and style setting before do
            // pinch to perform the transformation.
            if (zoomPreference === enums.ZoomPreference.FitHeight || zoomPreference === enums.ZoomPreference.FitWidth) {
                var updateToWidth = 0;
                var currentHeight = $('.marksheet-view-holder').innerHeight();
                // Get the current width of the image holder, This will be set in pixel for each image.
                updateToWidth = _this.naturalImageWidth * (responseStore.instance.currentZoomPercentage / 100);
                // Holds the percentage of previous scroll without updating proposed width.
                var previousScroll_1 = ($('.marksheet-container').scrollTop() / $('.marksheet-view-holder').innerHeight()) * 100;
                // Update the container with respect to child holder
                $('.marksheet-view-holder').css({
                    'width': updateToWidth + 'px',
                    'max-width': ''
                });
                // change the image holder width according to the current width
                zoomPanelActionCreator.prepareResponseImagePinchToZoom(updateToWidth);
                var that_2 = _this;
                // This setimeout will ensure the UI update with the width will be completed and we cand proceed
                setTimeout(function () {
                    // Recalculating the scrolltop here because we consider that, once we changed the width of each
                    // Marksheet-Holder to a specific width then height will get changed and push to the bottom. Then
                    // we need to set the scrollTop again to position to pinch start.
                    var currentScrollTop = $('.marksheet-container').scrollTop();
                    // Update the current scroll position to the previous percentage.
                    var updatedScroll = $('.marksheet-view-holder').innerHeight() * (previousScroll_1 / 100);
                    $('.marksheet-container').scrollTop(updatedScroll);
                    sT = $('.marksheet-container').scrollTop();
                    // setting the transform originX and Y based on touch area
                    that_2.zoomX = event.center.x + sL -
                        ($('.marksheet-view-holder').offset().left - $('.marksheet-content-holder').offset().left);
                    that_2.zoomY = (event.center.y + sT -
                        ($('.marksheet-view-holder').offset().top - $('.marksheet-content-holder').offset().top)) -
                        (enhancedOffPageCommentHeight);
                    // Lets start the pinch move
                    that_2.isPinchReady = true;
                }, 0);
            }
            else {
                // setting the transform originX and Y based on touch area
                _this.zoomX = event.center.x + sL - ($('.marksheet-view-holder').offset().left - $('.marksheet-content-holder').offset().left);
                _this.zoomY = (event.center.y + sT -
                    ($('.marksheet-view-holder').offset().top - $('.marksheet-content-holder').offset().top)) - (enhancedOffPageCommentHeight);
                // Lets start the pinch move
                _this.isPinchReady = true;
            }
            _this.enableImageContainerScroll(false);
            zoomPanelActionCreator.isPinchZooming(true);
            // hide zoompanel
            zoomPanelActionCreator.hideZoomPanel();
            // to set the zoom preference for hiding the onpage comment in side view for the devices
            _this.setState({ zoomPreference: zoomPreference });
        };
        /**
         * add/remove rotaed images based on the rotaed angle. This is a callback from image viewer component on rotation.
         * @param rotatedAngle
         */
        this.onRotation = function (rotatedAngle) {
            if (rotatedAngle === 0 || rotatedAngle % 360 === 0) {
                var index = _this.rotatedImages.indexOf(responseStore.instance.currentlyVisibleImageContainerRefId);
                if (index > -1) {
                    _this.rotatedImages.splice(index, 1);
                }
            }
            else {
                if (_this.rotatedImages.indexOf(responseStore.instance.currentlyVisibleImageContainerRefId) < 0) {
                    _this.rotatedImages.push(responseStore.instance.currentlyVisibleImageContainerRefId);
                }
            }
            // Prevent re-rendering comment container when horizontal scroll is triggerd due to the rotation.
            _this.animating = true;
            var that = _this;
            // need to hide comment lines in rotate and zoom.hence this code comes before the return;
            if (_this.isSideViewEnabledAndVisible) {
                _this.freezeSideView(true);
                // Given settimeout because in device we are not getting the transion end of marksheet-wrapper
                // The fix for the safari browser is causing the problem. So we are giving explicite delay for re-rendering
                // after transition. There is a delay of .3sec to start the animation and .3sec delay to complete the transition
                // Thats why we are giving a 600
                setTimeout(function () {
                    that.animating = false;
                    // make visible after the animation and set the right scroll.
                    that.freezeSideView(false);
                    that.setState({
                        renderedOn: Date.now()
                    });
                    that.notifyAnimationCompleted();
                    that.triggerAnimationEndForSideViewComments(0);
                }, constants.RESPONSE_IMAGE_ROTATION_DELAY);
            }
            else {
                setTimeout(function () {
                    that.animating = false;
                    that.setState({
                        renderedOn: Date.now()
                    });
                    that.notifyAnimationCompleted();
                }, constants.RESPONSE_IMAGE_ROTATION_DELAY);
            }
            // Update the response image width on zoom based on the height to fit to the
            // screen and avoid trimming the page.
            responseActionCreator.responseImageRotated(_this.rotatedImages.length > 0, _this.rotatedImages);
        };
        /**
         * Trigger the hide comment side view call
         */
        this.toggleCommentsSideView = function (e) {
            stampActionCreator.toggleCommentSideView(false);
            stampActionCreator.showOrHideComment(false);
        };
        /**
         * to handle the side view visibility on annotation on and off
         */
        this.handleMarksAndAnnotationsVisibility = function () {
            _this.allowRenderSideViewComments = true;
            _this.setState({
                refreshCommentSideView: Date.now(),
                renderedOn: Date.now()
            });
        };
        /**
         * add image natural dimensions
         * @param pageNo
         * @param height
         * @param width
         */
        this.addImageNaturalDimensions = function (pageNo, height, width) {
            _this.imageDimensions[pageNo] = { naturalHeight: height, naturalWidth: width };
        };
        /**
         * return natural dimension of image
         * @param pageNo
         */
        this.getImageNaturalDimension = function (pageNo) {
            return _this.imageDimensions[pageNo];
        };
        /**
         * Method to be invoked once the message/exception window minimized or closed
         */
        this.resetCommentRightAttribute = function () {
            _this.setCommentContainerRightAttribute(false, true);
        };
        /**
         * This method excute on  load course work file.
         */
        this.onloadECourseworkFile = function (doAutoIndex, mediaType) {
            // Reset the rendered image count while changing the coursework file.
            // Re render the image container if the latest selected type is not audio.
            if (mediaType !== enums.MediaType.Audio) {
                _this.renderedImageCount = 0;
                // clear the on page comments side view collections
                onPageCommentHelper.resetSideViewCollections();
            }
            if (_this.isExternalImageFile && mediaType !== enums.MediaType.Audio) {
                _this.setState({ isExternalImageFileLoaded: false });
                _this.props.externalImageLoaded(false);
            }
            // resetting the bookmark previous scroll data while navigating to FRV
            responseActionCreator.setBookmarkPreviousScrollData(undefined);
        };
        /**
         * on Off Page Comment Panel Resize
         * @param height
         * @param panActionType
         */
        this.onOffPageCommentPanelResize = function (height, panActionType) {
            if (panActionType === enums.PanActionType.End) {
                _this.reRender();
            }
        };
        /**
         * On zoom updated
         */
        this.onZoomUpdated = function () {
            // No need to rerender on zooming by pinching.
            if (_this.zoomType !== enums.ZoomType.PinchIn && _this.zoomType !== enums.ZoomType.PinchOut) {
                _this.calculateImagesScrollTops();
                _this.setState({
                    resetZoomClass: Date.now()
                });
            }
        };
        /**
         * Show or Hide book mark text box
         */
        this.showOrHideBookmarkTextBox = function (bookMarkText, clientToken, isVisible, rotatedAngle) {
            _this.isBookmarkTextBoxOpen = isVisible;
            if (_this.isBookmarkTextBoxOpen) {
                _this.bookmarkText = bookMarkText;
                _this.bookmarkClientToken = clientToken;
                _this.bookmarkRotatedAngle = rotatedAngle;
                var elementId = 'script-bookmark_' + clientToken;
                var bookmarkElement = htmlUtilities.getElementById(elementId);
                var heightDif = constants.BOOKMARK_TEXT_BOX_HEIGHT - bookmarkElement.getBoundingClientRect().height;
                //Bookmark entry box pointing arrow size /2 to be considered in the 'left' attribute when the text box position is right
                var bookMarkArrowWidth = BOOKMARK_TEXTBOX_POINITING_ARROW_SIZE / 2;
                _this.bookmarkTop = (bookmarkElement.getBoundingClientRect().top -
                    _this.refs.markSheet.getBoundingClientRect().top - (heightDif / 2)) + _this.refs.markSheet.scrollTop;
                _this.bookmarkLeft = (bookmarkElement.getBoundingClientRect().left -
                    _this.refs.markSheet.getBoundingClientRect().left - constants.BOOKMARK_TEXT_BOX_WIDTH)
                    + _this.refs.markSheet.scrollLeft;
                switch (_this.bookmarkRotatedAngle) {
                    case enums.RotateAngle.Rotate_0:
                        _this.bookmarkTextboxPosition = 'left';
                        break;
                    case enums.RotateAngle.Rotate_90:
                    case enums.RotateAngle.Rotate_270:
                        if (_this.refs.markSheet.scrollLeft > _this.bookmarkLeft) {
                            _this.bookmarkLeft = (bookmarkElement.getBoundingClientRect().left -
                                _this.refs.markSheet.getBoundingClientRect().left) +
                                bookmarkElement.getBoundingClientRect().width +
                                _this.refs.markSheet.scrollLeft + bookMarkArrowWidth;
                            _this.bookmarkTextboxPosition = 'right';
                        }
                        else {
                            _this.bookmarkTextboxPosition = 'left';
                        }
                        break;
                    case enums.RotateAngle.Rotate_180:
                        _this.bookmarkLeft = (bookmarkElement.getBoundingClientRect().left -
                            _this.refs.markSheet.getBoundingClientRect().left) +
                            bookmarkElement.getBoundingClientRect().width +
                            _this.refs.markSheet.scrollLeft + bookMarkArrowWidth;
                        _this.bookmarkTextboxPosition = 'right';
                        break;
                }
            }
            else {
                _this.bookmarkClientToken = '';
                _this.bookmarkLeft = 0;
                _this.bookmarkText = '';
                _this.bookmarkTop = 0;
            }
            _this.setState({
                renderedOnBookmark: Date.now()
            });
        };
        /**
         * Set focus to bookmark text box
         */
        this.setFocusToBookmarkTextBox = function () {
            _this.isBookmarkTextBoxOpen = true;
        };
        /**
         * on Book mark item selection
         * @param clientToken
         */
        this.bookmarkSelected = function (clientToken) {
            var bookmarkPreviousScrollData = {
                scrollHeight: _this.refs.markSheet.scrollHeight,
                scrollTop: _this.refs.markSheet.scrollTop
            };
            responseActionCreator.setBookmarkPreviousScrollData(bookmarkPreviousScrollData);
            var elementId = 'script-bookmark_' + clientToken;
            var bookmarkElement = htmlUtilities.getElementById(elementId);
            var enhancedOffPageComment = document.getElementById('enhanced-off-page-comments-container');
            var audioPlayer = document.getElementById('audioPlayerContainer');
            var bookmarkTop = _this.refs.markSheet.scrollTop + (bookmarkElement.getBoundingClientRect().top
                - constants.COMMON_HEADER_HEIGHT
                - (enhancedOffPageComment ? enhancedOffPageComment.clientHeight : 0)
                - (audioPlayer ? audioPlayer.clientHeight : 0));
            _this.refs.markSheet.scrollTop = bookmarkTop;
        };
        /**
         * on Go Back button Click
         */
        this.goBackButtonClicked = function () {
            var prvScrollData = responseStore.instance.getBookmarkPreviousScrollData;
            var scrollChangePercentage = (_this.refs.markSheet.scrollHeight - prvScrollData.scrollHeight) / prvScrollData.scrollHeight;
            var goBackScrollTop = prvScrollData.scrollTop + (prvScrollData.scrollTop * scrollChangePercentage);
            _this.refs.markSheet.scrollTop = goBackScrollTop;
            // resetting the bookmark previous scroll data
            responseActionCreator.setBookmarkPreviousScrollData(undefined);
        };
        /* refresh comment container */
        this.refreshCommentContainer = function () {
            _this.setState({
                refreshCommentSideView: Date.now()
            });
        };
        /**
         * Maintain mark sheet container scroll on various scenarios.
         * @private
         * @memberof ImageContainer
         */
        this.setScrollOnContainerSizeChanges = function (forceSet) {
            if (forceSet === void 0) { forceSet = false; }
            var marksheetContainer = ReactDom.findDOMNode(_this.refs.markSheet);
            if (_this.scrollHeightRatio > 0 && _this.currentImageIdToScroll && (_this.state.zoomPreference === enums.ZoomPreference.FitWidth ||
                _this.state.zoomPreference === enums.ZoomPreference.FitHeight) &&
                ((_this.previousMarkSheetContainerHeight !== marksheetContainer.clientHeight ||
                    _this.previousMarkSheetContainerWidth !== marksheetContainer.clientWidth) || forceSet)) {
                setTimeout(function () {
                    // Defect fix: #63665
                    if (_this.currentImageIdToScroll && $('#' + _this.currentImageIdToScroll).length > 0) {
                        var scrollTop = $('#' + _this.currentImageIdToScroll)[0].offsetTop +
                            (_this.scrollRatioAgainstCurrentVisibleImage * marksheetContainer.scrollHeight) / 100;
                        // marksheetContainer.scrollTop =  scrollTop has side effects in ipad
                        // blank message panel is displaying for some time after maximizing the panel.
                        $('.marksheet-container').scrollTop(scrollTop);
                        _this.findScrollHeightRatio();
                        _this.previousMarkSheetContainerHeight = marksheetContainer.clientHeight;
                        _this.previousMarkSheetContainerWidth = marksheetContainer.clientWidth;
                        _this.isSideViewPanelToggled = false;
                        _this.isFileViewPanelToggled = false;
                    }
                }, constants.SCROLL_SET_TIMEOUT);
            }
        };
        /**
         * We've to maintain scroll on mark scheme panel width changes.
         *
         * @private
         * @memberof ImageContainer
         */
        this.onPanelResize = function (panelWidth, resizeClassName, panelType, panActionType) {
            if (panelType === enums.ResizePanelType.MarkSchemePanel && panActionType === enums.PanActionType.End) {
                _this.setScrollOnContainerSizeChanges(true);
            }
        };
        /**
         * We don't need set the scrollRatio while file browser is toggling
         * @private
         * @memberof ImageContainer
         */
        this.toggleFilelistPanelUpdated = function () {
            _this.isFileViewPanelToggled = true;
        };
        /**
         * Get user zoom value.
         */
        this.getUserZoomValue = function () {
            if (_this.naturalImageWidth > 0 && _this.isFitToContainerEnabled()) {
                return _this.initiateResponseImageZoom(_this.naturalImageWidth, _this.naturalImageHeight);
            }
            else {
                return responseStore.instance.userZoomValue;
            }
        };
        /**
         * Determines whether ecoursework image file is opening for first time.
         */
        this.isFitToContainerEnabled = function () {
            var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            var currentZoomPercentage = zoomHelper.getCurrentZoomPreference(zoomUserOption, 0, _this.props.selectedECourseworkPageID);
            return eCourseworkHelper.isECourseworkComponent
                && eCourseWorkFileStore.instance.isImageFileSelected(_this.props.selectedECourseworkPageID)
                && currentZoomPercentage.userOptionZoomValue === 0
                && currentZoomPercentage.selectedECourseworkPageID !== _this.props.selectedECourseworkPageID;
        };
        /**
         * on scroll position changed, update the page number.
         */
        this.onScrollPositionChanged = function () {
            if (_this.isUnStructured) {
                _this.handlePageNumberIndicator();
            }
        };
        this.state = {
            renderedOn: 0,
            isMouseHover: false,
            zoomPreference: enums.ZoomPreference.None,
            zoomabeleWidth: 0,
            refreshZoom: 0,
            refreshCommentSideView: 0,
            isExternalImageFileLoaded: false,
            renderedOnBookmark: 0,
            resetZoomClass: 0,
            containerDimensionChangedOn: 0
        };
        this.scrollTopCache = Immutable.Map();
        this.imageLoaded = this.imageLoaded.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onWheelHandler = this.onWheelHandler.bind(this);
        this._changeDeviceOrientation = this.changeDeviceOrientation.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.reRender = this.reRender.bind(this);
        this.onAnnotationDrawStart = this.onAnnotationDrawStart.bind(this);
        this.onZoomOptionChanged = this.onZoomOptionChanged.bind(this);
        this.setResponseScroll = this.setResponseScroll.bind(this);
        this.storeCurrentResponseScroll = this.storeCurrentResponseScroll.bind(this);
        this.onCustomZoomUpdated = this.onCustomZoomUpdated.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onImageContainerClicked = this.onImageContainerClicked.bind(this);
        this.onAnnotationAdded = this.onAnnotationAdded.bind(this);
        this.onResponsePinchToZoomStarted = this.onResponsePinchToZoomStarted.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.toggleCommentsSideView = this.toggleCommentsSideView.bind(this);
        this.setScrollForZoom = this.setScrollForZoom.bind(this);
        this.naturalImageWidth = 0;
        this.clientImageWidth = 0;
        this.naturalImageHeight = 0;
        this.refreshZoomComponent = Date.now();
        this.zoomedContainerWidth = 0;
        this.rotatedImageWidth = 0;
        this.enhancedOffPageCommentHeight = Number(userOptionHelper.getUserOptionByName(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT));
        this.onPinchZoom = this.onPinchZoom.bind(this);
        this.onPinchEnd = this.onPinchEnd.bind(this);
        this.onPinchStart = this.onPinchStart.bind(this);
        this.getZoomableComponentWidth = this.getZoomableComponentWidth.bind(this);
        this.onResponseImageRotationCompleted = this.onResponseImageRotationCompleted.bind(this);
        this.minimumNaturalImageWidth = 0;
        this.minimumNaturalImageHeight = 0;
        this.currentZoomPercentage = undefined;
        this.structuredFracsDataLoaded = this.structuredFracsDataLoaded.bind(this);
        this.handleMarksAndAnnotationsVisibility = this.handleMarksAndAnnotationsVisibility.bind(this);
        this.onToggleCommentsSideView = this.onToggleCommentsSideView.bind(this);
        this.imageDimensions = [];
        this.doApplyLinkingScenarios = this.props.doApplyLinkingScenarios;
        this.resetCommentRightAttribute = this.resetCommentRightAttribute.bind(this);
        this.onPanelHeightChange = this.onPanelHeightChange.bind(this);
        this.onOffPageCommentPanelResize = this.onOffPageCommentPanelResize.bind(this);
        this.bookmarkSelected = this.bookmarkSelected.bind(this);
        this.goBackButtonClicked = this.goBackButtonClicked.bind(this);
        this.setFocusToBookmarkTextBox = this.setFocusToBookmarkTextBox.bind(this);
        this.showOrHideBookmarkTextBox = this.showOrHideBookmarkTextBox.bind(this);
        this.onZoomUpdated = this.onZoomUpdated.bind(this);
        this.onScrollPositionChanged = this.onScrollPositionChanged.bind(this);
    }
    /**
     * Render component
     */
    ImageContainer.prototype.render = function () {
        var _this = this;
        // In Structured components if images are not available against zones then we need to display the on-screen marking confirmation
        // For structured components zones might be there which has no images in them so returing markconfirmation.
        if (!this.props.isECourseworkComponent && !this.props.isEBookMarking &&
            (this.props.imagesToRender == null || this.props.imagesToRender.length === 0)) {
            this.props.onImageLoaded(0, 0, false);
            return (null);
        }
        var _className = '';
        var index = 0;
        var toRender = null;
        var renderImages = null;
        var loadingIndicator = null;
        var commentContainerOnPage;
        var commentContainerSideView;
        var bookmarkStampBox;
        var marksheetContainerLeft;
        if (this.isSideViewEnabledAndVisible) {
            var markSheetElement = htmlUtilities.getElementsByClassName('marksheet-container');
            if (markSheetElement[0]) {
                marksheetContainerLeft = markSheetElement[0].scrollLeft;
                if (marksheetContainerLeft > 0) {
                    marksheetContainerLeft = -1 * marksheetContainerLeft;
                }
            }
        }
        // Structured Response
        if (this.props.imageZonesCollection) {
            // calculate the biggest ratio to check whether response has a horizontal scroll bar
            this.calculateBiggestRatio();
        }
        if (this.hasAllScriptImagesLoaded) {
            commentContainerOnPage = this.isSideViewEnabledAndVisible ? null :
                React.createElement(CommentContainer, {id: 'comment', key: 'comment', selectedLanguage: this.props.selectedLanguage, naturalImageWidth: this.minimumNaturalImageWidth, naturalImageHeight: this.minimumNaturalImageHeight, enableCommentsSideView: this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices, renderedOn: 0, enableCommentBox: this.props.enableCommentBox, selectedZoomPreference: this.state.zoomPreference, isEBookMarking: this.props.isEBookMarking});
            commentContainerSideView = this.isSideViewEnabledAndVisible ?
                React.createElement(CommentContainer, {id: 'commentSideViewContainer', key: 'commentSideViewContainer', selectedLanguage: this.props.selectedLanguage, naturalImageWidth: this.minimumNaturalImageWidth, naturalImageHeight: this.minimumNaturalImageHeight, enableCommentsSideView: this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices, renderedOn: this.state.refreshCommentSideView, commentContainerRight: marksheetContainerLeft, enableCommentBox: this.props.enableCommentBox, selectedZoomPreference: this.state.zoomPreference, isEBookMarking: this.props.isEBookMarking}) : null;
        }
        else if (!this.hasAllScriptImagesLoaded) {
            var cssClass = 'section-loader loading';
            cssClass += busyIndicatorHelper.getResponseModeBusyClass(markingStore.instance.currentResponseMode);
            loadingIndicator = (React.createElement(LoadingIndicator, {id: enums.BusyIndicatorInvoker.none.toString(), key: enums.BusyIndicatorInvoker.none.toString(), cssClass: cssClass}));
        }
        // Structured Response
        if (this.props.imageZonesCollection) {
            if (this.props.imageZonesCollection.length > 0) {
                var that_3 = this;
                if (this.props.isEBookMarking) {
                    renderImages = this.renderEbookmarkingSingleImage(this.props.imageZonesCollection, index);
                    var hasZonedImages_1 = this.props.imageZonesCollection[0].some(function (x) { return x.height > 0; });
                    /* render the linked pages , the scecond collection contains the linked images and first holds the zoned images.
                    Checking >1 for taking from the second collection */
                    // below variable used to assign continuous outputpage no to linked page.
                    var rendereImagesCount_1 = renderImages.length;
                    this.props.imagesToRender.map(function (images, collectionIndex) {
                        if (collectionIndex >= 1 || !hasZonedImages_1) {
                            _this.doApplyLinkingScenarios = true;
                            renderImages = renderImages.concat(_this.renderLinkedImages(images, rendereImagesCount_1));
                            rendereImagesCount_1++;
                        }
                    });
                    /* If none of normal or linked images there the unzoned indicator should be visibile . Handling the same here*/
                    if (this.props.imagesToRender.length === 0 && renderImages.length === 0) {
                        return (that_3.renderSingleImage(this.props.imageZonesCollection[0].first(), 1, 1));
                    }
                }
                else {
                    // calculate the biggest ratio to check whether response has a horizontal scroll bar
                    renderImages = this.props.imageZonesCollection.map(function (imageZones) {
                        if (imageZones.count() === 1) {
                            var imageCount = index++;
                            return (that_3.renderSingleImage(imageZones.first(), imageCount, imageCount));
                        }
                        else {
                            return (that_3.renderStichedImages(imageZones, index++));
                        }
                    });
                    // render the linked pages
                    this.props.imagesToRender.map(function (images, collectionIndex) {
                        if (collectionIndex >= index) {
                            _this.doApplyLinkingScenarios = true;
                            renderImages = renderImages.concat(_this.renderLinkedImages(images, collectionIndex));
                        }
                    });
                }
                toRender = (React.createElement("div", {className: classNames('marksheet-container active', { 'not-loaded': !this.hasAllScriptImagesLoaded }, this.getZoomLevelClass()), ref: 'markSheet'}, React.createElement(Zoomable, {onPinchZoom: this.onPinchZoom, onPinchEnd: this.onPinchEnd, onPinchStart: this.onPinchStart, forceUpdate: this.refreshZoomComponent, onContainerWidthUpdated: this.getZoomableComponentWidth, onTransitionEnd: this.onAnimationEnd, zoomPreference: this.state.zoomPreference, onZoomingInitiated: this.storeCurrentResponseScroll}, React.createElement(ZoomableStructuredImage, {userZoomValue: responseStore.instance.userZoomValue, naturalImageWidth: this.naturalImageWidth, clientImageWidth: this.clientImageWidth, renderedOn: this.state.refreshZoom, setResponseScroll: this.setResponseScroll, naturalImageHeight: this.naturalImageHeight, responseOrientationChanged: this.onResponseImageRotationCompleted, pinchZoomFactor: this.pinchZoomFactor, structuredImageZone: this.structuredImageZone, sideViewEnabledAndVisible: this.isSideViewEnabledAndVisible, currentQuestion: markingStore.instance.currentQuestionItemInfo ?
                    markingStore.instance.currentQuestionItemInfo.uniqueId : 0}, renderImages)), commentContainerSideView));
            }
            this.isUnStructured = false;
        }
        else {
            bookmarkStampBox = React.createElement(BookmarkStampBox, {id: 'bookmark-stamp-box', key: 'bookmark-stamp-box', top: this.bookmarkTop, left: this.bookmarkLeft, bookmarkText: this.bookmarkText, bookmarkPosition: this.bookmarkTextboxPosition, clientToken: this.bookmarkClientToken, renderedOn: this.state.renderedOnBookmark, isVisible: this.isBookmarkTextBoxOpen});
            var pageNoWithoutSuppressed_1 = 0;
            renderImages = this.fileMetadataList.map(function (fileMetadata) {
                var currentIndex = index++;
                var pageNo = _this.props.doExcludeSuppressedPage ? fileMetadata.pageNumber : currentIndex + 1;
                return (React.createElement(UnStructuredResponseImageViewer, {id: 'image_unstructured_' + currentIndex, key: 'key_image_Unstructured_' + currentIndex, selectedLanguage: _this.props.selectedLanguage, switchViewCallback: _this.props.switchViewCallback, imageUrl: fileMetadata.url, onImageLoaded: _this.imageLoaded, getMarkSheetContainerProperties: _this.getMarkSheetContainerProperties, zoomPreference: _this.state.zoomPreference, setZoomOptions: _this.props.setZoomOptions, isDrawStart: _this.isDrawStart, renderedOn: _this.state.renderedOn, onRotation: _this.onRotation, imageOrder: pageNo, isResponseEditable: _this.props.isResponseEditable, enableImageContainerScroll: _this.enableImageContainerScroll, enableCommentBox: _this.props.enableCommentBox, naturalImageWidth: _this.naturalImageWidth, naturalImageHeight: _this.naturalImageHeight, hasRotatedImages: responseStore.instance.hasRotatedImagesWithOddAngle, enableCommentsSideView: _this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices, onScrollForZoom: _this.setScrollForZoom, isECourseworkComponent: _this.props.isECourseworkComponent, pageNo: fileMetadata.pageNumber, getImageNaturalDimension: _this.getImageNaturalDimension, refreshCommnetContainer: _this.refreshCommentContainer, pageNoWithoutSuppressed: (fileMetadata.isSuppressed) ? pageNoWithoutSuppressed_1 : ++pageNoWithoutSuppressed_1, setScrollPositionCallback: _this.findCurrentScrollPosition, marksheetContainerHeight: _this.imageContainerHeight, marksheetContainerWidth: _this.imageContainerWidth}));
            });
            toRender = (React.createElement("div", {className: classNames('marksheet-container active', { 'not-loaded': !this.hasAllScriptImagesLoaded }, this.getZoomLevelClass()), ref: 'markSheet'}, bookmarkStampBox, React.createElement(Zoomable, {onPinchZoom: this.onPinchZoom, onPinchEnd: this.onPinchEnd, onPinchStart: this.onPinchStart, forceUpdate: this.refreshZoomComponent, onContainerWidthUpdated: this.getZoomableComponentWidth, onTransitionEnd: this.onAnimationEnd, zoomPreference: this.state.zoomPreference, onZoomingInitiated: this.storeCurrentResponseScroll}, React.createElement(ZoomableUnstructuredImage, {selectedECourseworkPageID: this.props.selectedECourseworkPageID, userZoomValue: this.getUserZoomValue(), naturalImageWidth: this.naturalImageWidth, clientImageWidth: this.clientImageWidth, renderedOn: this.state.refreshZoom, setResponseScroll: this.setResponseScroll, naturalImageHeight: this.naturalImageHeight, responseOrientationChanged: this.onResponseImageRotationCompleted, sideViewEnabledAndVisible: this.isSideViewEnabledAndVisible, pinchZoomFactor: this.pinchZoomFactor}, renderImages)), commentContainerSideView));
            this.isUnStructured = true;
        }
        // for nonconvertable files, this.props.imagesToRender is undefined and there is only one page to show,
        // so numberOfPages is always 1
        var numberOfPages = this.isExternalImageFile ? 1 : this.props.imagesToRender.length > 0 ?
            this.props.imagesToRender[0].length : 0;
        var pageNumberIndicatorComponent = this.isUnStructured ? React.createElement(PageNumberIndicator, {noOfImages: numberOfPages}) : null;
        var fileNameIndicatorComponent = this.props.fileNameIndicatorEnabled ? React.createElement(FileNameIndicator, {key: 'filename-Indicator-key', renderedOn: this.state.renderedOn}) : null;
        var markSheetContainer = htmlUtilities.getElementsByClassName('marksheet-container')[0];
        var scrollWidth = markSheetContainer ? (markSheetContainer.offsetWidth - markSheetContainer.clientWidth) : 0;
        // Freeze the comment sideview.
        var panelCssStyle = this.freezeCommentSideView ?
            { height: '100vh', right: scrollWidth } : { right: scrollWidth };
        var hideCommentsSideViewComponent = this.isSideViewEnabledAndVisible ?
            React.createElement(HideCommentsPanel, {key: 'hideCommentsSideView', id: 'hideCommentsSideView', sideViewToggleCallback: this.toggleCommentsSideView, panelStyle: panelCssStyle}) : null;
        return (React.createElement("div", {id: 'imagecontainer', ref: 'imageContainer', onScroll: this.onScrollHandler, onWheel: this.onWheelHandler, onMouseDown: this.onMouseDownHandler, className: 'marksheets-inner-images', onClick: this.onImageContainerClicked}, React.createElement(ContextMenu, {id: 'context-menu', key: 'context-menu'}), commentContainerOnPage, this.getResponseZoomStyle(), fileNameIndicatorComponent, pageNumberIndicatorComponent, hideCommentsSideViewComponent, toRender, loadingIndicator));
    };
    Object.defineProperty(ImageContainer.prototype, "isRotatedImage", {
        /**
         * returns wether the selected coursework file has a rotated image or not
         */
        get: function () {
            var isRotatedImage = false;
            var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                this.props.fileMetadataList.forEach(function (fileMetadata) {
                    if (!fileMetadata.isSuppressed) {
                        var pageNumber_1 = fileMetadata.pageNumber;
                        var displayAngle = 0;
                        displayAngleCollection.forEach(function (angle, key) {
                            /*changing the condition angle >0 because while rotating anti clockwise the angle will come as negative so it
                            will not return the rotated image as true.
                            This is for ecoursework component and it is unstructured, Appending 0 as output page number*/
                            if ((key === 'img_' + pageNumber_1 + '_0') && angle !== 0) {
                                isRotatedImage = true;
                            }
                        });
                    }
                });
            }
            return isRotatedImage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the Response Zoom Style
     */
    ImageContainer.prototype.getResponseZoomStyle = function () {
        var maxWidth = (this.state.zoomabeleWidth * 2) + ($(window).width() - $('.marksheet-zoom-holder').width());
        var minWidth = maxWidth + 1;
        var zoomableWidth = 0;
        if (this.isSideViewEnabledAndVisible) {
            zoomableWidth = this.state.zoomabeleWidth;
        }
        else {
            zoomableWidth = this.state.zoomabeleWidth * 2;
        }
        if (!htmlUtilities.isTabletOrMobileDevice && this.state.zoomabeleWidth > 0) {
            if (this.state.zoomPreference === enums.ZoomPreference.Percentage && this.hasAllScriptImagesLoaded) {
                //No need of booklte view if any rotaed images there or the  comment side view is enabled
                /* for ecoursework component check wether the selected file has any rotatd images*/
                if (((this.props.isECourseworkComponent && !this.isRotatedImage) ||
                    !responseStore.instance.hasRotatedImages) && !this.isExternalImageFile) {
                    if (this.isUnStructured) {
                        return (React.createElement("style", null, '.marksheet-holder{font-size:' + ((this.state.zoomabeleWidth / 2) / 10) + 'px; width:'
                            + this.state.zoomabeleWidth + 'px; margin-left:0;\
                            }\
                              @media screen and (max-width: ' + maxWidth + 'px){\
	                             .marksheet-view-holder {\
                                            width:' + this.state.zoomabeleWidth + 'px;\
                                  }\
                            }\
                            @media screen and (min-width:' + minWidth + 'px) {\
	                            .marksheet-view-holder { width:' + Math.ceil(zoomableWidth) + 'px; }\
	                            .content-wrapper:not(.side-page) .marksheet-holder.suppressed{display:block; }\
                                .content-wrapper:not(.side-page) .marksheets .page-number-marksheet,\
	                            .content-wrapper:not(.side-page) .marksheet-holder:first-child { \
                                                        margin-left: ' + this.state.zoomabeleWidth + 'px; \
                                            }\
                                .content-wrapper:not(.side-page) .rotate-button-holder A {\
                                opacity:0.4;\
                                    pointer-events:none; \
                                   }\
                                .content-wrapper:not(.side-page) .marksheet-zoom-holder .marksheet-holder.suppressed:first-child' +
                            ' + .marksheet-holder .marksheet-holder-inner{\
                            margin-top: 3%; \
                            }\
                              }\
                        '));
                    }
                    else {
                        //////Setting the width for marksheet-view-holder & marksheet-holder inline.
                        //////Individual width for marksheet- holder for structured images.
                        return null;
                    }
                }
                else {
                    if (this.isUnStructured) {
                        return (React.createElement("style", null, " ", '.marksheet-holder {font-size:' + ((this.state.zoomabeleWidth / 2) / 10) + 'px; width:' +
                            this.state.zoomabeleWidth + 'px;\
                            }\
                            .marksheet-holder.rotate-270,\
                            .marksheet-holder.rotate-90 {\
                                  width:' + this.rotatedImageWidth + 'px;\
                            }\
                              @media screen and (max-width:' + maxWidth + 'px) {\
	                               .marksheet-view-holder{\
                                          width:' + this.rotatedImageWidth + 'px;\
                                    }\
                            }\
                              @media screen and (min-width:' + minWidth + 'px) {\
	                                .marksheet-view-holder {\
                                            width:' + this.rotatedImageWidth + 'px;\
                                  }\
                               }\
                        '));
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        else {
            return null;
        }
    };
    /**
     * Setting marksheetContainer/ViewHolder values when in fit height to keep the scroll position
     */
    ImageContainer.prototype.setScrollForZoom = function () {
        if (this.state.zoomPreference === enums.ZoomPreference.FitHeight) {
            var marksheetWrapper = void 0;
            marksheetWrapper = {
                marksheetContainerScrollTop: $('.marksheet-container').scrollTop(),
                marksheetContainerScrollLeft: $('.marksheet-container').scrollLeft(),
                marksheetContainerScrollHeight: $('.marksheet-container')[0].scrollHeight,
                marksheetContainerScrollWidth: $('.marksheet-container')[0].scrollWidth,
                MarksheetContainerClientHeight: $('.marksheet-container')[0].clientHeight,
                MarksheetContainerClientWidth: $('.marksheet-container')[0].clientWidth,
                MarksheetContainerLeft: $('.marksheet-container')[0].getBoundingClientRect().left,
                MarksheetContainerTop: $('.marksheet-container')[0].getBoundingClientRect().top,
                marksheetViewHolderWidth: $('.marksheet-view-holder').width(),
                marksheetViewHolderHeight: $('.marksheet-view-holder').height(),
                MarksheetViewHolderClientHeight: $('.marksheet-view-holder')[0].clientHeight,
                MarksheetViewHolderClientWidth: $('.marksheet-view-holder')[0].clientWidth,
                MarksheetViewHolderLeft: $('.marksheet-view-holder')[0].getBoundingClientRect().left,
                MarksheetViewHolderTop: $('.marksheet-view-holder')[0].getBoundingClientRect().top
            };
            this.markSheetWrapper = marksheetWrapper;
        }
        else {
            this.markSheetWrapper = undefined;
        }
    };
    /**
     * setting the response scroll
     */
    ImageContainer.prototype.setResponseScroll = function (responseZoomedWidth, updateScroll, zoomType, rotatedImageWidth) {
        // updating the top scrol position only on zooming.
        // other rendering will not modify the scroll. eg: dragging annotation.
        if (updateScroll) {
            this.updatedZoomType.push(zoomType);
        }
        this.rotatedImageWidth = rotatedImageWidth;
        // re-render to update the zoom style according to the width.
        // this will happen on each change of zoom (including fitwidth,height)
        this.setState({
            zoomabeleWidth: responseZoomedWidth,
            refreshCommentSideView: Date.now()
        });
    };
    /**
     * Store the current response scroll
     */
    ImageContainer.prototype.storeCurrentResponseScroll = function (zoomType) {
        this.zoomType = zoomType;
        var elem = ReactDom.findDOMNode(this.refs.markSheet);
        this.scrollPosition = (elem.scrollTop / $('.marksheet-view-holder').height()) * 100;
        this.previousContainerWidth = $('.marksheet-view-holder').width();
        this.previousScrollLeft = elem.scrollLeft;
        this.animationStart();
    };
    /**
     * calls on zoom updation
     */
    ImageContainer.prototype.onCustomZoomUpdated = function () {
        // #57487 store the current scroll positions before zoom starts
        // when increase/ decrease height and width of the image on zoom
        // Moved setScrollForZoom from storeCurrentResponseScroll to onCustomZoomUpdated since
        // marksheetContainer/ViewHolder values vary in IE.
        this.setScrollForZoom();
    };
    /**
     * To get currently saved use preference(FW/FH)
     */
    ImageContainer.prototype.getCurrentUserOption = function (reRender, selectedECourseworkPageID) {
        if (reRender === void 0) { reRender = false; }
        if (selectedECourseworkPageID === void 0) { selectedECourseworkPageID = 0; }
        var zoomPreference = enums.ZoomPreference.FitWidth;
        var zoomUserOption;
        zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
            markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        var userOption = {};
        // If user has opened structured response, we have to get the zoom value of the current markscheme
        // or the default as FITWidth.
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            if (responseHelper.isAtypicalResponse()) {
                userOption = zoomHelper.getAtypicalZoomOption(zoomUserOption);
            }
            else {
                // Get the saved zoom percentage value
                userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, markingStore.instance.currentQuestionItemImageClusterId ? markingStore.instance.currentQuestionItemImageClusterId : 0);
            }
        }
        else if (selectedECourseworkPageID > 0) {
            userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, 0, selectedECourseworkPageID);
        }
        else {
            userOption = zoomHelper.getZoomUserOption(zoomUserOption);
        }
        zoomPreference = userOption.zoomPreference;
        this.isUserOptionZoom = true;
        if (reRender) {
            this.setState({ zoomPreference: zoomPreference });
        }
        return zoomPreference;
    };
    /**
     * This function gets invoked when the component will receive props
     */
    ImageContainer.prototype.componentWillReceiveProps = function (nxtProps) {
        // if the response container width has been changed due to new element added to the
        // container, eg: messagebox
        if (this.props.refreshImageContainer !== nxtProps.refreshImageContainer) {
            this.refreshZoomComponent = Date.now();
        }
        if (this.props.hasOnPageComments === false && nxtProps.hasOnPageComments && nxtProps.enableCommentsSideView) {
            this.isFirstCommentOnSideView = true;
            this.previousScrollHeightRatio = this.scrollHeightRatio;
        }
        else {
            this.isFirstCommentOnSideView = false;
            // find scroll height ratio for initial rendering
            // needs to test comments side view scroll setting logic
            if (this.previousMarkSheetContainerHeight === undefined || this.previousMarkSheetContainerWidth === undefined) {
                this.findScrollHeightRatio();
                var marksheetContainer = ReactDom.findDOMNode(this.refs.markSheet);
                if (marksheetContainer) {
                    this.previousMarkSheetContainerHeight = marksheetContainer.clientHeight;
                    this.previousMarkSheetContainerWidth = marksheetContainer.clientWidth;
                }
            }
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    ImageContainer.prototype.componentWillMount = function () {
        var zoomPreference = this.getCurrentUserOption(true, this.props.selectedECourseworkPageID);
        onPageCommentHelper.isFitWidth = zoomPreference === enums.ZoomPreference.FitWidth;
        // clear the on page comments side view collections
        onPageCommentHelper.resetSideViewCollections();
        this.allowRenderSideViewComments = true;
    };
    /**
     * This function is invoked after component is rendered
     */
    ImageContainer.prototype.componentDidUpdate = function () {
        // render Side view comments after all annotations rendered eg: switch side view, show/hide annotations
        // avoid render during zoom -> handled in animation end callbacks
        if (this.isSideViewEnabledAndVisible && this.allowRenderSideViewComments) {
            stampActionCreator.renderSideViewComments(null, null, null, false, false);
            this.allowRenderSideViewComments = false;
        }
        // This condition handles the scenario when user puts first comment and to maintain the scroll from going up
        // and restores the previous scroll top to height ratio - issue noted in IE11
        if (this.previousScrollHeightRatio > 0 && this.isFirstCommentOnSideView) {
            this.refs.markSheet.scrollTop = (this.previousScrollHeightRatio * this.refs.markSheet.scrollHeight) / 100;
        }
        /* TODO: change jquery based implementation of onPinch End into refs (callbacks)
            This is to fix the fit width issue #57024. THe issue occures due to the width set by JQuery is not getting changed on
            re-render by react . We can fix this by changing the jquery logic into ref ( callbacks). */
        if (htmlUtilities.isTabletOrMobileDevice && this.state.zoomPreference === enums.ZoomPreference.FitWidth) {
            if (this.zoomType === enums.ZoomType.PinchIn || this.zoomType === enums.ZoomType.PinchOut) {
                $('.marksheet-holder').css({
                    'width': '100%'
                });
            }
        }
        var containerHeight = this.getImageContainerHeight();
        var containerWidth = this.getImageContainerWidth();
        if (this.imageContainerHeight !== containerHeight || this.imageContainerWidth !== containerWidth) {
            this.imageContainerHeight = containerHeight;
            this.imageContainerWidth = containerWidth;
            this.setState({
                containerDimensionChangedOn: Date.now()
            });
        }
        this.setScrollOnContainerSizeChanges();
    };
    /**
     * This function gets invoked when the component is mounted
     */
    ImageContainer.prototype.componentDidMount = function () {
        var that = this;
        // Let UI animation finish
        setTimeout(function () {
            if (that.refs && that.refs.markSheet) {
                // Must re-render to reflect the container height and width to set the zoom level, if the
                // user has selected either fitHeight.Width and re-opening the response..
                that.setState({ refreshZoom: Date.now() });
            }
        }, 0);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.switchResponseView);
        var pageKeyDownHandler = new moduleKeyHandler(modulekeys.PAGE_KEY_DOWN, enums.Priority.Fourth, true, this.handleKeyDown, enums.KeyMode.down);
        // Hooking the Key Down Event
        keyDownHelper.instance.mountKeyDownHandler(pageKeyDownHandler);
        window.addEventListener('orientationchange', this._changeDeviceOrientation);
        /* We've moved annotation overlay events to ImageContainer to avoid possible eventEmitter memory leak detected node.js warning */
        /* Annotation overlay events */
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksAndAnnotationsRetrieved);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        window.addEventListener('resize', this.onWindowResize);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        /* Annotation overlay events ends */
        /** Refresh Page indicator while updateing zoom settings */
        responseStore.instance.addListener(responseStore.ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT, this.handlePageNumberIndicator);
        this.handlePageNumberIndicator();
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED, this.onResponsePinchToZoomStarted);
        // Appending the touchmove event handler to the Image Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        if (this.refs && this.refs.imageContainer) {
            this.appendEventHandler(this.refs.imageContainer, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isAndroidChrome());
        }
        responseStore.instance.addListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED, this.structuredFracsDataLoaded);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.handleMarksAndAnnotationsVisibility);
        stampStore.instance.addListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, this.onToggleCommentsSideView);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.resetCommentRightAttribute);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.resetCommentRightAttribute);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.resetCommentRightAttribute);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.resetCommentRightAttribute);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT, this.updateZoomAfterChangingFileListpanelView);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.onloadECourseworkFile);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.onPanelHeightChange);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE, this.reRender);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.enhancedOffPageCommentVisibilityChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.onOffPageCommentPanelResize);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_SELECTED_EVENT, this.bookmarkSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.GO_BACK_BUTTON_CLICK_EVENT, this.goBackButtonClicked);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.setFocusToBookmarkTextBox);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.showOrHideBookmarkTextBox);
        markingStore.instance.addListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this.toggleFilelistPanelUpdated);
        responseStore.instance.addListener(responseStore.ResponseStore.SCROLL_POSITION_CHANGED_EVENT, this.onScrollPositionChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
    };
    /**
     * This function gets invoked when the component is about to be ummounted
     */
    ImageContainer.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.switchResponseView);
        keyDownHelper.instance.unmountKeyHandler(modulekeys.PAGE_KEY_DOWN);
        window.removeEventListener('orientationchange', this._changeDeviceOrientation);
        /* We've moved annotation overlay events to ImageContainer to avoid possible eventEmitter memory leak detected node.js warning */
        /* Annotation overlay events ends */
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksAndAnnotationsRetrieved);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        window.removeEventListener('resize', this.onWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        /* Annotation overlay events ends */
        responseStore.instance.removeListener(responseStore.ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT, this.handlePageNumberIndicator);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED, this.onResponsePinchToZoomStarted);
        responseStore.instance.removeListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED, this.structuredFracsDataLoaded);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, this.onToggleCommentsSideView);
        // Removing the touchmove event handler to the Image Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        if (this.refs && this.refs.imageContainer) {
            this.removeEventHandler(this.refs.imageContainer, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isAndroidChrome());
        }
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.handleMarksAndAnnotationsVisibility);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.resetCommentRightAttribute);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.resetCommentRightAttribute);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.resetCommentRightAttribute);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.resetCommentRightAttribute);
        /* Fix for defect : 44260 - Functional_MarkEntry_Marks entered against one question gets copied to
                                    immediate next question item on key press.
        As per current implementation, long key-press event is handled in keydown helper and
        this event works based on enums.MarkEntryDeactivator, in case of structured response
        this enum value is resetted only after when the images gets loaded, so when long key press event triggers
        at the in-between time (ie) before image loading, this enum value wont gets reset, At that time
        logic(long key press event blocking) in keydown helper will wont work  */
        // Fix for defect 53607: We dont need to reset the mark entry deactivators when another ecoursework file is selected.
        // The image container will be unmounted when another file is selected
        if (!this.props.isECourseworkComponent) {
            keyDownHelper.instance.resetMarkEntryDeactivators();
        }
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT, this.updateZoomAfterChangingFileListpanelView);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.onPanelHeightChange);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE, this.reRender);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.enhancedOffPageCommentVisibilityChanged);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.onloadECourseworkFile);
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.onOffPageCommentPanelResize);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_SELECTED_EVENT, this.bookmarkSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.GO_BACK_BUTTON_CLICK_EVENT, this.goBackButtonClicked);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.setFocusToBookmarkTextBox);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.showOrHideBookmarkTextBox);
        markingStore.instance.removeListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this.toggleFilelistPanelUpdated);
        responseStore.instance.removeListener(responseStore.ResponseStore.SCROLL_POSITION_CHANGED_EVENT, this.onScrollPositionChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
    };
    /**
     * Render the component after receives the data
     */
    ImageContainer.prototype.marksAndAnnotationsRetrieved = function () {
        // If data already fetched for the response, skip
        if (this.isMarksAndAnnotationsLoaded) {
            return;
        }
        else {
            // Check data is exists or not
            this.isMarksAndAnnotationsLoaded = markingStore.instance.isMarksLoaded(markingStore.instance.selectedQIGMarkGroupId);
        }
        // If data loaded for the current response, Render the UI
        if (this.isMarksAndAnnotationsLoaded) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    /**
     *  function for finding scroll height ratio.
     */
    ImageContainer.prototype.findScrollHeightRatio = function () {
        var element = ReactDom.findDOMNode(this.refs.markSheet);
        if (element) {
            this.scrollHeightRatio = this.getScrollHeightRatio(element);
            // We will find the current imageId with with marksheet container top, We will find scroll ratio of that particular
            //  image and will set scrollTop based on current scroll ratio.
            if (this.currentImageIdToScroll) {
                this.scrollRatioAgainstCurrentVisibleImage =
                    ((element.getBoundingClientRect().top + 5 -
                        htmlUtilities.getElementById(this.currentImageIdToScroll)
                            .getBoundingClientRect().top) / element.scrollHeight) * 100;
            }
        }
    };
    /**
     * Get the biggest ratio of structures response
     */
    ImageContainer.prototype.calculateBiggestRatio = function () {
        var element;
        var biggestRatio = 0;
        var displayAngle = 0;
        for (var i = 0; element = this.structuredImageZone[i]; i++) {
            var rotatedImage = this.rotatedImages.filter((function (x) { return x === element.pageNo; }));
            displayAngle = 0;
            var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map(function (angle, key) {
                    if (key === element.pageNo) {
                        displayAngle = angle;
                    }
                });
            }
            displayAngle = annotationHelper.getAngleforRotation(displayAngle);
            if (element.pageNo === rotatedImage[0] && (displayAngle === 90 || displayAngle === 270)) {
                if (biggestRatio < (element.zoneHeight / element.zoneWidth)) {
                    biggestRatio = element.zoneHeight / element.zoneWidth;
                }
            }
            else {
                if (biggestRatio < (element.zoneWidth / element.zoneHeight)) {
                    biggestRatio = element.zoneWidth / element.zoneHeight;
                }
            }
        }
        this.biggestRatio = biggestRatio;
    };
    /**
     * Method to render ebookmarking single image
     * @param imageZones
     * @param index
     */
    ImageContainer.prototype.renderEbookmarkingSingleImage = function (imageZones, index) {
        var imageCount = 0;
        var that = this;
        var renderImages = null;
        // Loop through images either single/Stitched       
        renderImages = imageZones[0].filter(function (x) { return x.height > 0; }).map(function (item) {
            return (that.renderSingleImage(item, index++, imageCount++));
        });
        return renderImages.toArray();
    };
    /**
     * Method to render single image
     * @param imageZone
     * @param index
     */
    ImageContainer.prototype.renderSingleImage = function (imageZone, index, imageCount) {
        var isALinkedPage = (imageZone.pageNo) > 0 ? pageLinkHelper.isZoneLinked(imageZone, this.props.multipleMarkSchemes) ||
            this.props.pagesLinkedByPreviousMarkers.indexOf(imageZone.pageNo) > -1 : false;
        return (React.createElement(SingleImageViewer, {id: 'image_' + index, key: 'key_image_' + index, selectedLanguage: this.props.selectedLanguage, switchViewCallback: this.props.switchViewCallback, imageZone: imageZone, image: (this.props.imagesToRender && this.props.imagesToRender.length > 0) ? this.props.isEBookMarking ?
            this.props.imagesToRender[0][imageCount] : this.props.imagesToRender[index][0] : null, onImageLoaded: this.imageLoaded, getMarkSheetContainerProperties: this.getMarkSheetContainerProperties, outputPageNo: index + 1, zoomPreference: this.state.zoomPreference, setZoomOptions: this.props.setZoomOptions, isDrawStart: this.isDrawStart, renderedOn: this.state.renderedOn, onRotation: this.onRotation, isResponseEditable: this.props.isResponseEditable, enableImageContainerScroll: this.enableImageContainerScroll, markSheetViewHolderWidth: this.state.zoomabeleWidth, enableCommentBox: this.props.enableCommentBox, isALinkedPage: isALinkedPage, biggestRatio: this.biggestRatio, enableCommentsSideView: this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices, getImageNaturalDimension: this.getImageNaturalDimension, currentImageZones: this.props.currentImageZones, doApplyLinkingScenarios: this.doApplyLinkingScenarios, pagesLinkedByPreviousMarkers: this.props.pagesLinkedByPreviousMarkers, onScrollForZoom: this.setScrollForZoom, refreshCommnetContainer: this.refreshCommentContainer, isEBookMarking: this.props.isEBookMarking, setScrollPositionCallback: this.findCurrentScrollPosition, marksheetContainerHeight: this.imageContainerHeight, marksheetContainerWidth: this.imageContainerWidth}));
    };
    /**
     * render the linked images
     * @param index
     * @param images
     */
    ImageContainer.prototype.renderLinkedImages = function (images, index) {
        return (React.createElement(SingleImageViewer, {id: 'linked_image_' + index, key: 'key_linked_image_' + index, selectedLanguage: this.props.selectedLanguage, switchViewCallback: this.props.switchViewCallback, imageZone: undefined, image: images[0], onImageLoaded: this.imageLoaded, getMarkSheetContainerProperties: this.getMarkSheetContainerProperties, outputPageNo: index + 1, zoomPreference: this.state.zoomPreference, setZoomOptions: this.props.setZoomOptions, isDrawStart: this.isDrawStart, renderedOn: this.state.renderedOn, onRotation: this.onRotation, isResponseEditable: this.props.isResponseEditable, enableImageContainerScroll: this.enableImageContainerScroll, markSheetViewHolderWidth: this.state.zoomabeleWidth, enableCommentBox: this.props.enableCommentBox, isALinkedPage: true, enableCommentsSideView: this.props.enableCommentsSideView, currentImageZones: this.props.currentImageZones, getImageNaturalDimension: this.getImageNaturalDimension, doApplyLinkingScenarios: this.doApplyLinkingScenarios, pagesLinkedByPreviousMarkers: this.props.pagesLinkedByPreviousMarkers, onScrollForZoom: this.setScrollForZoom, refreshCommnetContainer: this.refreshCommentContainer, isEBookMarking: this.props.isEBookMarking, setScrollPositionCallback: this.findCurrentScrollPosition, marksheetContainerHeight: this.imageContainerHeight, marksheetContainerWidth: this.imageContainerWidth}));
    };
    /**
     * Method to render stiched images
     * @param imageZones
     * @param index
     */
    ImageContainer.prototype.renderStichedImages = function (imageZones, index) {
        return (React.createElement(StitchedImageViewer, {id: 'stitched_image_' + index, key: 'key_stitched_image_' + index, selectedLanguage: this.props.selectedLanguage, switchViewCallback: this.props.switchViewCallback, candidateScriptId: this.props.responseDetails.candidateScriptId, imageZones: imageZones, images: this.props.imagesToRender[index], onImageLoaded: this.imageLoaded, getMarkSheetContainerProperties: this.getMarkSheetContainerProperties, outputPageNo: index + 1, zoomPreference: this.state.zoomPreference, setZoomOptions: this.props.setZoomOptions, isDrawStart: this.isDrawStart, renderedOn: this.state.renderedOn, onRotation: this.onRotation, isResponseEditable: this.props.isResponseEditable, enableImageContainerScroll: this.enableImageContainerScroll, markSheetViewHolderWidth: this.state.zoomabeleWidth, enableCommentBox: this.props.enableCommentBox, biggestRatio: this.biggestRatio, enableCommentsSideView: this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices, currentImageZones: this.props.currentImageZones, getImageNaturalDimension: this.getImageNaturalDimension, doApplyLinkingScenarios: this.doApplyLinkingScenarios, onScrollForZoom: this.setScrollForZoom, refreshCommnetContainer: this.refreshCommentContainer, setScrollPositionCallback: this.findCurrentScrollPosition, marksheetContainerHeight: this.imageContainerHeight, marksheetContainerWidth: this.imageContainerWidth}));
    };
    /**
     * Set the props if image loaded.
     * @param pageNumber
     * @param scrollTop
     * @param naturalImageWidth
     * @param clientImageWidth
     * @param naturalImageHeight
     */
    ImageContainer.prototype.imageLoaded = function (pageNumber, scrollTop, naturalImageWidth, clientImageWidth, naturalImageHeight, clientImageHeight, outputPageNumber) {
        if (clientImageHeight === void 0) { clientImageHeight = 0; }
        if (outputPageNumber === void 0) { outputPageNumber = 0; }
        this.props.onImageLoaded(pageNumber);
        if (!this.isUnStructured &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus) &&
            !messageStore.instance.isMessagePanelActive &&
            !exceptionStore.instance.isExceptionPanelActive) {
            keyDownHelper.instance.resetMarkEntryDeactivators();
        }
        // add the natural dimensions of page
        this.addImageNaturalDimensions(pageNumber, naturalImageHeight, naturalImageWidth);
        // Build a cache of the scroll tops of all the images.
        this.scrollTopCache = this.scrollTopCache.set(pageNumber, scrollTop);
        // gets the minimum natural width among all the images of particular response
        // for comment box calculation
        // and passing this values as props to comment container
        if ((naturalImageWidth !== undefined) && (naturalImageWidth < this.minimumNaturalImageWidth ||
            this.minimumNaturalImageWidth === 0)) {
            this.minimumNaturalImageWidth = naturalImageWidth;
        }
        // gets the minimum natural height among all the images of particular response
        // for comment box calculation
        // and passing this values as props to comment container
        if ((naturalImageHeight !== undefined) && (naturalImageHeight < this.minimumNaturalImageHeight ||
            this.minimumNaturalImageHeight === 0)) {
            this.minimumNaturalImageHeight = naturalImageHeight;
        }
        // Keep the large image file natural width to adjust the zoom
        // For ECourseworkComponent height and width will be different for each files, so set it
        if (naturalImageWidth !== undefined && (naturalImageWidth > this.naturalImageWidth || this.props.isECourseworkComponent)) {
            this.naturalImageWidth = naturalImageWidth;
            this.clientImageWidth = clientImageWidth;
            // Will discuss with TA, to confirm whether we need to
            // compare each image height.
            this.naturalImageHeight = naturalImageHeight;
        }
        if (!this.isUnStructured || this.props.isEBookMarking) {
            var structuredImageZone = {
                pageNo: 'img_' + pageNumber + '_' + outputPageNumber,
                zoneWidth: clientImageWidth, zoneHeight: clientImageHeight
            };
            this.structuredImageZone.push(structuredImageZone);
        }
        this.renderedImageCount++;
        if (this.isExternalImageFile) {
            this.setState({ isExternalImageFileLoaded: true });
            this.props.externalImageLoaded(true);
        }
        if (this.hasAllScriptImagesLoaded) {
            // inform responsecontainer that images have loaded
            this.props.allImagesLoaded();
            /* File read status change operation is not available in team management or marking check mode.
               If Supervisor select a subordinate response that has not been viewed, the status
               does not change to file has been viewed.
            */
            if (this.props.isECourseworkComponent && !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !worklistStore.instance.isMarkingCheckAvailable) {
                // Invoke action creator to set selected ecoursework file read status and in progress status as true.
                var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                    this.props.responseDetails.esMarkGroupId : this.props.responseDetails.markGroupId;
                eCourseworkHelper.updatefileReadStatusProgress(markGroupId, eCourseworkHelper.getSelectedECourseworkImages().docPageID);
            }
            this.calculateImagesScrollTops();
            this.refreshUpdates();
            var that = this;
            // This will ensure adjust the thickness of line annotations
            // after the zoom applied.
            setTimeout(function () {
                that.notifyAnimationCompleted();
                if (!that.isUnStructured) {
                    that.fracsLoadedImageCount = 0;
                    //set fracs when new images loaded
                    responseActionCreator.structuredFracsDataSet();
                }
            }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
        }
    };
    /**
     * refresh after all script loaded
     */
    ImageContainer.prototype.refreshUpdates = function () {
        var isScrollTopSet = false;
        if (this.props.markThisScrollPosition !== undefined && this.isUnStructured) {
            // Since the scrolltop is getting set, updating manually scrolling to false.
            // This is done to identify manual scrolling in scrollHandler().
            this.isManuallyScrolling = false;
            $('.marksheet-container').scrollTop(this.props.markThisScrollPosition);
            isScrollTopSet = true;
        }
        // re render to pass the updated natural width to zoomable.
        this.setState({
            renderedOn: Date.now(), refreshZoom: Date.now()
        });
        // This will emit and event to each image to refresh the rotation settings
        responseActionCreator.refreshImageRotationSettings();
        // Once settings has been finished this will refresh the screen to set the updated
        // width of marksheet view holder
        responseActionCreator.responseImageRotated(true);
        // Handling the page number indicator once all the images are loaded
        // If scroll top is set then handlePageNumberIndicator() will be called from onScrollHandler()
        if (!isScrollTopSet) {
            this.handlePageNumberIndicator();
        }
    };
    /**
     * handle the action event after setting fracs data
     */
    ImageContainer.prototype.structuredFracsDataLoaded = function (fracsDataSource) {
        //waiting for all fracs to set, to get the most visible page
        this.fracsLoadedImageCount++;
        if (this.fracsLoadedImageCount === this.props.imagesToRender.length) {
            responseActionCreator.findVisibleImageId(true, fracsDataSource);
            this.fracsLoadedImageCount = 0;
        }
    };
    /**
     * Calculate Image Scoll Tops
     */
    ImageContainer.prototype.calculateImagesScrollTops = function () {
        var _this = this;
        var isComponentUnstructured = this.props.imageZonesCollection ? false : true;
        if (this.hasAllScriptImagesLoaded && isComponentUnstructured) {
            // Clear the existing collection
            this.scrollTopCache.clear();
            this.props.fileMetadataList.every(function (fileMetadata) {
                if (!fileMetadata.isSuppressed) {
                    var pageNo = fileMetadata.pageNumber;
                    // Get the top of the image// Image Offset().top value is not accurate.
                    var top_1 = htmlUtilities.getOffsetTop('img_' + pageNo, true);
                    _this.scrollTopCache = _this.scrollTopCache.set(pageNo, top_1);
                }
                return true;
            });
        }
    };
    /**
     * Called when an annotation is added
     * @param stampId stamptypeid
     */
    ImageContainer.prototype.onAnnotationAdded = function (stampId, addAnnotationAction, annotationOverlayId, annotation, isStitched) {
        // Perform only for onpage comment to open comment box
        // for firefox.
        if (stampId === enums.DynamicAnnotation.OnPageComment) {
            this.isOnPageCommentStamped = true;
        }
    };
    /**
     * Show page number indicator while response scrolling
     */
    ImageContainer.prototype.getPageNumberIndicatorDetails = function (_visibleInFracs) {
        this.isBookletView = false;
        if (_visibleInFracs.length === constants.BOOKLET_VIEW_IMAGE_COUNT && _visibleInFracs[0].visible === _visibleInFracs[1].visible) {
            this.isBookletView = true;
        }
        var newPageNumber = [];
        var newImgNumber = [];
        if (this.isBookletView) {
            newPageNumber.push(_visibleInFracs[0].pageNo, _visibleInFracs[1].pageNo);
            newImgNumber.push(_visibleInFracs[0].imgNo, _visibleInFracs[1].imgNo);
        }
        else {
            newPageNumber.push(_visibleInFracs[0].pageNo);
            newImgNumber.push(_visibleInFracs[0].imgNo);
        }
        return { 'newPageNumber': newPageNumber, 'newImageNumber': newImgNumber };
    };
    /**
     * Gets the image height buffer; the difference between tops of 2 subsequent images.
     * @returns
     */
    ImageContainer.prototype.getImageHeightBuffer = function () {
        var keys = this.scrollTopCache.keySeq();
        return this.scrollTopCache.get(keys.get(1)) - this.scrollTopCache.get(keys.get(0));
    };
    /**
     * Handles the Key down Event.
     * @param {KeyboardEvent} event
     */
    ImageContainer.prototype.handleKeyDown = function (event) {
        if (this.isUnStructured && (event.keyCode === keycodes.PAGE_DOWN_KEY || event.keyCode === keycodes.PAGE_UP_KEY)) {
            var newScrollTop = 0;
            var currentScrollTop = ReactDom.findDOMNode(this.refs.markSheet).scrollTop;
            if (event.keyCode === keycodes.PAGE_DOWN_KEY) {
                newScrollTop = this.getPageOffSetFromImageTops(currentScrollTop + ImageContainer.PADDING_VALUE_BETWEEN_IMAGES, true);
            }
            else if (event.keyCode === keycodes.PAGE_UP_KEY) {
                newScrollTop = this.getPageOffSetFromImageTops(currentScrollTop - ImageContainer.PADDING_VALUE_BETWEEN_IMAGES, false);
            }
            htmlUtilities.scrollToTopWithAnimation('marksheet-container', newScrollTop);
            return true;
        }
        return false;
    };
    /**
     * Get the next nearest scroll top from the collection
     * @param currentScrollTop
     */
    ImageContainer.prototype.getPageOffSetFromImageTops = function (currentScrollTop, nextImage) {
        var keys = this.scrollTopCache.keySeq();
        var newTop = Number.MAX_VALUE;
        if (nextImage) {
            this.scrollTopCache.forEach(function (top, pageNo) {
                if (top > currentScrollTop && top < newTop) {
                    newTop = top;
                }
            });
        }
        else {
            newTop = Number.MIN_VALUE;
            this.scrollTopCache.forEach(function (top, pageNo) {
                if (top < currentScrollTop && top > newTop) {
                    newTop = top;
                }
            });
        }
        // Firefox is resetting the scroll to 0. Adjust the width to complete the scroll
        // For Large Zoom (200) 1000 not enogh for whole page scroll, setting to 10000.
        if (newTop === Number.MAX_VALUE) {
            return currentScrollTop + 10000;
        }
        // Adjust the top value with the Padding height
        return newTop - ImageContainer.PADDING_VALUE_BETWEEN_IMAGES;
    };
    /**
     * Invoked when zooming option has been changed in Zoom Panel
     * @param responseViewSettings - new zoom settings to apply
     * @param isZooming - distinguish Zooming or Rotating
     * @param isPinchZoom - Pinch zoom in progress for devices only
     */
    ImageContainer.prototype.onZoomOptionChanged = function (responseViewSettings, isZooming, isPinchZoom, zoomType) {
        if (isPinchZoom === void 0) { isPinchZoom = false; }
        // if rotating, return
        if (!isZooming) {
            return;
        }
        if (this.isSideViewEnabledAndVisible) {
            stampActionCreator.toggleCommentLinesVisibility(true, true);
        }
        this.isZoomingInitiated = true;
        var selectedZoomPreference = enums.ZoomPreference.None;
        var refreshOn = Date.now();
        var that = this;
        onPageCommentHelper.isFitWidth = responseViewSettings === enums.ResponseViewSettings.FitToWidth;
        switch (responseViewSettings) {
            case enums.ResponseViewSettings.FitToHeight:
                this.currentZoomPercentage = undefined;
                selectedZoomPreference = enums.ZoomPreference.FitHeight;
                // Freeze the comment side view until comment container re-render and
                // finish the animation.
                this.freezeSideView(true);
                setTimeout(function () {
                    // Make comment side view visible
                    that.freezeSideView(false);
                    that.triggerAnimationEndForSideViewComments();
                    that.notifyAnimationCompleted();
                    that.setState({ refreshZoom: Date.now() });
                }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                break;
            case enums.ResponseViewSettings.FitToWidth:
                this.currentZoomPercentage = undefined;
                selectedZoomPreference = enums.ZoomPreference.FitWidth;
                // Freeze the comment side view until comment container re-render and
                // finish the animation.
                this.freezeSideView(true);
                setTimeout(function () {
                    // Make comment side view visible
                    that.freezeSideView(false);
                    that.triggerAnimationEndForSideViewComments();
                    that.notifyAnimationCompleted();
                    that.setState({ refreshZoom: Date.now() });
                }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                break;
            case enums.ResponseViewSettings.CustomZoom:
                selectedZoomPreference = enums.ZoomPreference.Percentage;
                // Avoiding render for disabling outlet view for Unstructured in devices which handled using jquery.
                // For structured, booklet view is disabled both in device and browser, so handled in react.
                refreshOn = (isPinchZoom || (htmlUtilities.isTabletOrMobileDevice && this.isUnStructured))
                    ? this.state.refreshZoom : Date.now();
                // on before animation start set the comment side view freeze if applicable.
                if (refreshOn !== this.state.refreshZoom && this.isSideViewEnabledAndVisible) {
                    this.freezeSideView(true);
                }
                // for user input custome zoom , fires animationcompleted. 
                // for zomm by + and - animationcompleted will fires from animation end
                if (zoomType === enums.ZoomType.UserInput && htmlUtilities.isTabletOrMobileDevice) {
                    setTimeout(function () {
                        that.notifyAnimationCompleted();
                    }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                }
                that.setState({ refreshZoom: refreshOn });
                break;
        }
        // If response zoom setting is not custom mode, reset the width to adjust the default behaviour
        // of fitwidth and fitheight.
        this.setState({
            zoomPreference: selectedZoomPreference
        });
    };
    /**
     * Do process on resize event
     * @param {any} event
     */
    ImageContainer.prototype.onWindowResize = function (event) {
        var _this = this;
        if (!htmlUtilities.isTabletOrMobileDevice) {
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
        }
        // Must re-render to reflect the container height and width to set the zoom level, if the
        // user has selected either fitHeight.Width and re-opening the response..
        if ((this.state.zoomPreference === enums.ZoomPreference.FitHeight ||
            this.state.zoomPreference === enums.ZoomPreference.FitWidth) &&
            this.isSideViewEnabledAndVisible === false) {
            timerHelper.handleReactUpdatesOnWindowResize(function () {
                _this.setState({
                    renderedOn: Date.now()
                });
            });
        }
        else if (this.isSideViewEnabledAndVisible === true &&
            stampStore.instance.SelectedSideViewCommentToken === undefined) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    Object.defineProperty(ImageContainer.prototype, "hasAllScriptImagesLoaded", {
        /**
         * Has all the script images loaded completely
         * @returns flag indicating whether all script images loaded
         */
        get: function () {
            var isAllScriptsLoaded = false;
            if (this.props.imageZonesCollection) {
                var totalImageCount = 0;
                this.props.imagesToRender.map(function (x) {
                    totalImageCount += x.length;
                });
                isAllScriptsLoaded = this.renderedImageCount >= totalImageCount;
            }
            else {
                isAllScriptsLoaded = (this.isExternalImageFile && this.state.isExternalImageFileLoaded) ||
                    (!this.isExternalImageFile && this.renderedImageCount === (this.props.imagesToRender &&
                        this.props.imagesToRender.length > 0 &&
                        this.props.imagesToRender[0].length));
            }
            return isAllScriptsLoaded;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * function to update zoom preference
     * @param _currentZoomValue
     */
    ImageContainer.prototype.updateAndSaveZoomPreference = function (_currentZoomPercentage) {
        if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {
            // Defect 65186 fix - on pinchzoom the useroption is get saved as undefined/NaN intermittently.
            // Save the minimal zoom value as a defensive fix
            var _currentZoomValue = _currentZoomPercentage ? _currentZoomPercentage : this.currentZoomValue;
            // EBM zoom preference also should save like unstructured.
            if (this.isUnStructured || responseHelper.isEbookMarking) {
                var zoomPreferenceToSave = enums.ZoomPreference.Percentage.toString() + ',' + _currentZoomValue;
                var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
                // If the response is structured atypical we need to consider saving in structuredway.
                if (responseHelper.isAtypicalResponse() &&
                    responseHelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {
                    zoomPreferenceToSave = zoomHelper.updateAtypicalZoomOption(zoomUserOption, enums.ZoomPreference.MarkschemePercentage, _currentZoomValue);
                }
                else {
                    var userOption = zoomHelper.getZoomUserOption(zoomUserOption);
                    // Format the saving user preference value.
                    zoomPreferenceToSave = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue, _currentZoomValue, 0, enums.ZoomPreference.Percentage, enums.ZoomPreference.FilePercentage.toString(), this.props.selectedECourseworkPageID);
                }
                userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, zoomPreferenceToSave, true, true, false, true, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            }
            else {
                var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
                var userOption = zoomHelper.getZoomUserOption(zoomUserOption);
                // Format the saving user preference value.
                var preference = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue, _currentZoomValue, markingStore.instance.currentQuestionItemInfo.uniqueId, enums.ZoomPreference.Percentage, userOption.zoomHeader);
                userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, preference, false, true, false, true, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
            }
        }
    };
    /**
     * Refresh the component when the container size has been changed
     * eg: message panel appears
     */
    ImageContainer.prototype.getZoomableComponentWidth = function (containerWidth, containerHeight) {
        // update the image width while opening a response
        if (htmlUtilities.isTabletOrMobileDevice && this.isUnStructured
            && this.state.zoomPreference === enums.ZoomPreference.Percentage) {
            var zoomableWidth = this.naturalImageWidth * (responseStore.instance.currentZoomPercentage / 100);
            this.updateImageSize(zoomableWidth);
        }
        if (this.zoomedContainerWidth !== containerWidth) {
            this.zoomedContainerWidth = containerWidth;
            this.setState({ refreshZoom: Date.now() });
        }
        // This method invoked after som timeout after zoom update. So Recalculate the image tops for the updated positions
        this.calculateImagesScrollTops();
    };
    /**
     * set scroll top and left on zoom
     * Increase/Decrease the scroll left and top propational to the increased/decreased height and wifth of the image on zoom
     * @param zoomType
     * @param zoomFactor
     */
    ImageContainer.prototype.setScrollPositionOnZoom = function (zoomType, zoomFactor) {
        if (zoomType !== enums.ZoomType.None) {
            /* adding the variation in scroll left and top based on the current zoom to the current scroll left and top*/
            var elem = ReactDom.findDOMNode(this.refs.markSheet);
            elem.scrollTop = elem.scrollHeight * (this.scrollPosition / 100);
            elem.scrollLeft = (this.previousScrollLeft + (($('.marksheet-view-holder').width() - this.previousContainerWidth) / 2));
        }
    };
    /**
     * resize the rotated image according to the current zoom level.
     * @param {number} rotatedImageWidth
     */
    ImageContainer.prototype.onResponseImageRotationCompleted = function (rotatedImageWidth) {
        // setting the rotated image width. If any of the image is rotated
        // then applying the rotated image height percentage. Otherwise same
        // as normal zoom width.
        this.rotatedImageWidth = rotatedImageWidth;
        this.setState({ refreshZoom: Date.now() });
    };
    /**
     * on pinch zoom
     * @param {any} event
     */
    ImageContainer.prototype.pinchZoom = function (event) {
        // If user pinch started but didnt move, we dont need to do anything
        if (event.distance === 0 || !this.isPinchReady) {
            return;
        }
        if (this.currentZoomPercentage > constants.MAX_ZOOM_PERCENTAGE) {
            this.currentZoomPercentage = constants.MAX_ZOOM_PERCENTAGE;
        }
        if (this.currentZoomPercentage < constants.MIN_ZOOM_PERCENTAGE) {
            this.currentZoomPercentage = constants.MIN_ZOOM_PERCENTAGE;
        }
        this.previousZoomWidth = this.naturalImageWidth * (this.currentZoomPercentage / 100);
        var scaleFactor = this.getPinchScaleFactor(event.scale);
        // transform screen
        $('.marksheet-view-holder').css({
            'transform': 'scale(' + (scaleFactor) + ')',
            'transform-origin': '' + this.zoomX + 'px  ' + this.zoomY + 'px'
        });
    };
    /**
     * Gets a value indicating the current scale factor
     * @param {number} currentScale
     * @returns
     */
    ImageContainer.prototype.getPinchScaleFactor = function (currentScale) {
        var result = currentScale;
        var widthAccordingToCurrentScale = this.previousZoomWidth * currentScale;
        /**
         * if current pinch zoom scale is exceeding the maximum zoom value restrict zoom.
         * @param (this.naturalImageWidth * 2) > widthAccordingToCurrentScale
         */
        if (widthAccordingToCurrentScale > (this.naturalImageWidth * 2)) {
            result = ((this.naturalImageWidth * 2) / this.previousZoomWidth);
        }
        else if (widthAccordingToCurrentScale < (this.naturalImageWidth * .10)) {
            result = ((this.naturalImageWidth * .10) / this.previousZoomWidth);
        }
        this.pinchScaleFactor = result;
        return result;
    };
    /**
     * Updating the image size
     * @param {number} zoomableWidth
     */
    ImageContainer.prototype.updateImageSize = function (zoomableWidth) {
        // As part of defect fix: #45658
        if (isNaN(zoomableWidth) || zoomableWidth === 0) {
            $('.marksheet-view-holder').css({
                'width': 'auto'
            });
        }
        else {
            $('.marksheet-holder').css({
                'font-size': ((zoomableWidth / 2) / 10) + 'px',
                'width': +zoomableWidth + 'px', 'margin-left': 0
            });
            $('.marksheet-view-holder').css({
                'width': zoomableWidth + 'px'
            });
        }
    };
    /**
     * Custom zoom
     * @param zoomType
     */
    ImageContainer.prototype.customZoom = function (zoomType) {
        this.zoomType = zoomType;
        this.updateAndSaveZoomPreference();
        if (this.currentZoomValue > constants.MAX_ZOOM_PERCENTAGE) {
            this.currentZoomPercentage = constants.MAX_ZOOM_PERCENTAGE;
        }
        if (this.currentZoomValue < constants.MIN_ZOOM_PERCENTAGE) {
            this.currentZoomPercentage = constants.MIN_ZOOM_PERCENTAGE;
        }
        this.updatedZoomType.push(zoomType);
        this.storeCurrentResponseScroll(zoomType);
        var zoomableWidth = this.naturalImageWidth * (this.currentZoomValue / 100);
        this.updateImageSize(zoomableWidth);
        zoomPanelActionCreator.responseZoomUpdated(this.currentZoomValue);
    };
    Object.defineProperty(ImageContainer.prototype, "currentZoomValue", {
        /**
         * Get a value indicating the current zoom percentage value
         * @returns
         */
        get: function () {
            // For pinch to zoom depending on "currentZoomPercentage". This will be undefined
            // for manual zoom.
            return this.currentZoomPercentage ? this.currentZoomPercentage
                : responseStore.instance.currentZoomPercentage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Re-render each page and reset FITWIDTH/HEIGHT styles and set the updated width as style
     * then only pinch transform will happen
     */
    ImageContainer.prototype.onResponsePinchToZoomStarted = function () {
        this.onZoomOptionChanged(enums.ResponseViewSettings.CustomZoom, true, true);
    };
    /**
     * Triggers when Zoomable transition has been completed (custom zoom only)
     */
    ImageContainer.prototype.onAnimationEnd = function (isFitHeight) {
        if (isFitHeight) {
            // Inorder to notify overlayholder in fit-to-height mode.
            if (!qigStore.instance.isAcetateMoving) {
                this.notifyAnimationCompleted();
            }
            //re render the side view for comments
            stampActionCreator.renderSideViewComments();
        }
        else {
            //Don't check disableSideviewOnDevice as this call disables the side view
            // action to trigger the animation on zoom ends here.
            this.triggerAnimationEndForSideViewComments();
            //disabling animation event in fitheight mode to prevent reset scroll top
            // TODO: consider fit height scenario before adding else case
            if (this.updatedZoomType.length > 0) {
                this.animationEnds();
            }
        }
        // TODO: revisit setTimeouts for MARKSHEET_ANIMATION_TIMEOUT using this action, move logic to Zoomable
        // dispatch the action to inform other componenents about animation complete
    };
    /**
     * to trigger the actions to update side view comments on zoom send
     */
    ImageContainer.prototype.triggerAnimationEndForSideViewComments = function (timeout) {
        if (timeout === void 0) { timeout = constants.MARKSHEETS_ANIMATION_TIMEOUT; }
        if (this.props.enableCommentBox && this.props.enableCommentsSideView) {
            var disableSideViewOnDevices = false;
            var commentSideViewUserOptionValue = responseStore.instance.isPinchZooming ? false :
                userOptionHelper.getUserOptionByName(userOptionKeys.COMMENTS_SIDE_VIEW) === 'true';
            if (htmlUtilities.isTabletOrMobileDevice) {
                if (this.state.zoomPreference !== enums.ZoomPreference.FitWidth) {
                    disableSideViewOnDevices = true;
                }
                stampActionCreator.toggleCommentSideView(commentSideViewUserOptionValue, stampStore.instance.SelectedSideViewCommentToken, disableSideViewOnDevices);
            }
            stampActionCreator.toggleCommentLinesVisibility(false, false);
            if (!disableSideViewOnDevices) {
                var that_4 = this;
                setTimeout(function () {
                    that_4.setCommentContainerRightAttribute(false, true);
                }, timeout);
            }
        }
    };
    /**
     * called when toggle the comment side view - mainly for resetting the scroll left
     */
    ImageContainer.prototype.onToggleCommentsSideView = function () {
        this.isSideViewPanelToggled = true;
        // Reset the scroll ratio when side view is enabled. 
        // As there is already a focus applied on the comment box.
        if (this.isSideViewEnabledAndVisible) {
            this.scrollRatioAgainstCurrentVisibleImage = 0;
        }
        this.setScrollOnContainerSizeChanges(true);
        if (this.isSideViewEnabledAndVisible) {
            var that_5 = this;
            setTimeout(function () {
                that_5.setCommentContainerRightAttribute(false, true);
                that_5.findScrollHeightRatio();
            }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
        }
    };
    /**
     * called for setting the right attribute of comment container in SIDE View
     * @param resetPosition   - Whether we need to reset the righ attribute of comment container to 0 .
     * @param renderCommentContainer - Whether we need to re-render the comment container.
     * @param commentContainerRight - If this value is not 0 it will set as right of comment container, otherwise marksheetContainerLeft.
     */
    ImageContainer.prototype.setCommentContainerRightAttribute = function (resetPosition, renderCommentContainer, commentContainerRight) {
        if (resetPosition === void 0) { resetPosition = false; }
        if (renderCommentContainer === void 0) { renderCommentContainer = false; }
        if (commentContainerRight === void 0) { commentContainerRight = 0; }
        // We dont need to do this when an animation is happening in background.
        if (this.animating) {
            return;
        }
        var marksheetContainer = htmlUtilities.getElementsByClassName('marksheet-container');
        var marksheetContainerLeft = resetPosition ? 0 : marksheetContainer.length > 0 ? marksheetContainer[0].scrollLeft : 0;
        if (marksheetContainerLeft > 0) {
            marksheetContainerLeft = -1 * marksheetContainerLeft;
        }
        //set the style right for commentcontainer on scroll of the marksheet-container
        this.setState({
            commentContainerRight: commentContainerRight !== 0 ? commentContainerRight : marksheetContainerLeft,
            refreshCommentSideView: renderCommentContainer ? Date.now() : this.state.refreshCommentSideView
        });
    };
    /**
     * Triggers when mark sheet transition has started
     */
    ImageContainer.prototype.animationStart = function () {
        var hookPointTopPx;
        var hookPointLeftPx;
        var hDiffPx;
        var wDiffPx;
        var marginTopPx;
        var marginLeftPx;
        var c;
        var h;
        var x;
        var commentConatinerWidthPlusPadding = 0;
        var currentTop = this.markSheetWrapper === undefined ?
            $('.marksheet-container').scrollTop() : this.markSheetWrapper.marksheetContainerScrollTop;
        c = this.markSheetWrapper === undefined ?
            $('.marksheet-view-holder').width() : this.markSheetWrapper.marksheetViewHolderWidth;
        h = this.markSheetWrapper === undefined ?
            $('.marksheet-view-holder').height() : this.markSheetWrapper.marksheetViewHolderHeight;
        if (this.isSideViewEnabledAndVisible) {
            commentConatinerWidthPlusPadding = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
        }
        // Calculating the top
        // Taking MarksheetViewHolderTop from MarksheetWrapper if not undefined(To solve the scroll issue in IE).
        var topDiff = $('.marksheet-container')[0].getBoundingClientRect().top -
            (this.markSheetWrapper === undefined ?
                $('.marksheet-view-holder')[0].getBoundingClientRect().top :
                this.markSheetWrapper.MarksheetViewHolderTop);
        hookPointTopPx = topDiff +
            (this.markSheetWrapper === undefined ?
                ($('.marksheet-container')[0].clientHeight / 2) :
                (this.markSheetWrapper.MarksheetContainerClientHeight / 2));
        // Calculating the left
        var leftDiff = $('.marksheet-container')[0].getBoundingClientRect().left -
            $('.marksheet-view-holder')[0].getBoundingClientRect().left;
        hookPointLeftPx = leftDiff + (this.markSheetWrapper === undefined ?
            (($('.marksheet-container')[0].clientWidth - commentConatinerWidthPlusPadding) / 2) :
            ((this.markSheetWrapper.MarksheetContainerClientWidth - commentConatinerWidthPlusPadding) / 2));
        this.hookPointTopPercentage = 100 * hookPointTopPx /
            (this.markSheetWrapper === undefined ?
                ($('.marksheet-view-holder')[0].clientHeight + 5) : this.markSheetWrapper.MarksheetViewHolderClientHeight + 5);
        this.hookPointLeftPercentage = 100 * hookPointLeftPx /
            (this.markSheetWrapper === undefined ?
                (($('.marksheet-view-holder')[0].clientWidth)) :
                this.markSheetWrapper.MarksheetViewHolderClientWidth);
        var r = h / c;
        var zoomFactor = 0;
        if (this.zoomType === enums.ZoomType.CustomZoomIn) {
            zoomFactor = constants.PINCH_ZOOM_FACTOR;
            x = -1;
        }
        else if (this.zoomType === enums.ZoomType.CustomZoomOut) {
            zoomFactor = -(constants.PINCH_ZOOM_FACTOR);
            x = 1;
        }
        else if (this.zoomType === enums.ZoomType.UserInput && !htmlUtilities.isTabletOrMobileDevice) {
            // set zoomFactor for sideViewComments. We dont need to set the zoomFactor
            // as side view comments are only enabled in FitWidth for devices.
            var userZoomValue = responseStore.instance.userZoomValue;
            if (userZoomValue > this.currentZoomValue) {
                // zooming in
                zoomFactor = responseStore.instance.currentCustomZoomDifference;
                x = -1;
            }
            else {
                // zooming out
                zoomFactor = -(responseStore.instance.currentCustomZoomDifference);
                x = 1;
            }
        }
        // When user zoom without interval, when animation end will not get fired. So we we need to calculate
        // the width diff from the first click itself.
        var width = this.previousImageWidth > 0 ?
            this.previousImageWidth : (this.naturalImageWidth * (this.currentZoomValue) / 100);
        wDiffPx = Math.abs(((this.naturalImageWidth * (this.currentZoomValue + zoomFactor) / 100))
            - (width));
        // Calculating height diff using the ratio. This ration will be same always on
        // all zoom
        hDiffPx = r * wDiffPx;
        this.marginTop = x * this.hookPointTopPercentage * hDiffPx / 100;
        this.marginLeft = x * this.hookPointLeftPercentage * wDiffPx / 100;
        // Consider the very first image width other than the immediate one to calculate the margintop and left.
        // coz when the user clicks fast animation end will not get fire and we are appending only the margin left and top.
        if (!this.animating) {
            this.previousImageWidth = (this.naturalImageWidth * (this.currentZoomValue) / 100);
        }
        $('.marksheet-view-holder').css({ 'top': this.marginTop + 'px', 'left': this.marginLeft + 'px' });
        if (this.zoomType === enums.ZoomType.CustomZoomIn) {
            this.marginTop = currentTop - (this.marginTop);
        }
        else if (this.zoomType === enums.ZoomType.CustomZoomOut) {
            this.marginTop = currentTop - this.marginTop;
        }
        // Will stop comment container from rerending when a scroll has been fired on setting
        // margine left.
        this.animating = true;
        this.markSheetWrapper = undefined;
    };
    /**
     * Triggers when mark sheet transition has ends
     */
    ImageContainer.prototype.animationEnds = function () {
        var st;
        var sl;
        var commentConatinerWidthPlusPadding = 0;
        if (this.isSideViewEnabledAndVisible) {
            commentConatinerWidthPlusPadding = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
        }
        $('.marksheet-view-holder').removeClass('no-animation').addClass('no-animation');
        $('.marksheet-view-holder').css({ 'height': 'auto', 'top': '', 'left': '' });
        var that = this;
        setTimeout(function () {
            $('.marksheet-view-holder').removeClass('no-animation');
        });
        // Calculate new scroll top/left and set.
        st = (this.hookPointTopPercentage * ($('.marksheet-view-holder')[0].clientHeight + 10) / 100)
            - $('.marksheet-container')[0].clientHeight / 2;
        sl = (this.hookPointLeftPercentage * ($('.marksheet-view-holder')[0].clientWidth + 10) / 100)
            - ($('.marksheet-container')[0].clientWidth - commentConatinerWidthPlusPadding) / 2;
        if (htmlUtilities.isIPadDevice) {
            // setting scrollLeft and scrollTop, causes marksheet-container to disappear in ipad safari
            // while performing zoom functionality but it works fine in Android and desktop.
            // checked with UI team, and came up with the below fix of setting the overflow property and removing the same
            // after setting the scrollTop and scrollLeft.
            var markSheetContainer = htmlUtilities.getElementsByClassName('marksheet-container');
            markSheetContainer[0].style.overflow = 'hidden';
            $('.marksheet-container').scrollLeft(sl);
            $('.marksheet-container').scrollTop(st);
            markSheetContainer[0].style.removeProperty('overflow');
        }
        else {
            $('.marksheet-container').scrollLeft(sl);
            $('.marksheet-container').scrollTop(st);
        }
        // Once animation end has been called we dont previous position.
        this.previousImageWidth = 0;
        // Finish the animation after setting top and left
        this.animating = false;
        if (this.isSideViewEnabledAndVisible) {
            // Get the new scroll left and set as the right of the comment container
            // also remove the dummy sideview comment used for freezing the comment container div.
            sl = $('.marksheet-container').scrollLeft();
            this.freezeSideView(false);
            var that_6 = this;
            setTimeout(function () {
                that_6.setCommentContainerRightAttribute(false, true, (sl < 0 ? sl : sl * -1));
            }, 0);
        }
        this.notifyAnimationCompleted();
    };
    Object.defineProperty(ImageContainer.prototype, "isSideViewEnabledAndVisible", {
        /**
         * returns whether side view is enabled and open (will rturn false if exception or message windows open)
         */
        get: function () {
            return (this.props.enableCommentsSideView && this.props.enableCommentBox && !onPageCommentHelper.disableSideViewInDevices);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the changes in scroll position during scroll
     */
    ImageContainer.prototype.getScrollDelta = function () {
        var deltaX = Math.abs(htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollLeft - this.markSheetScrollLeft);
        var deltaY = Math.abs(htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollTop - this.markSheetScrollTop);
        this.markSheetScrollLeft = htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollLeft;
        this.markSheetScrollTop = htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollTop;
        return [deltaX, deltaY];
    };
    /**
     * Freezing the commentside view visibility on animation is happening in background
     * @param freeze
     */
    ImageContainer.prototype.freezeSideView = function (freeze) {
        if (this.isSideViewEnabledAndVisible) {
            stampActionCreator.setCommentVisibilityAction(!freeze);
            this.freezeCommentSideView = freeze;
        }
    };
    /**
     * Notify other componenet that animation has been completed.
     */
    ImageContainer.prototype.notifyAnimationCompleted = function () {
        zoomPanelActionCreator.zoomAnimationEnd(true);
        // (#50530) render CommentSideView(Issue fix for stiched image comment line misalign)
        stampActionCreator.renderSideViewComments(null, null, null, false, false);
    };
    Object.defineProperty(ImageContainer.prototype, "fileMetadataList", {
        /**
         * returns fileMetadataList
         */
        get: function () {
            var fileMetadataList;
            if (this.props.doExcludeSuppressedPage) {
                fileMetadataList = this.props.fileMetadataList.toArray().
                    filter(function (fileMetadata) { return fileMetadata.isSuppressed === false; });
            }
            else {
                fileMetadataList = this.props.fileMetadataList.toArray();
            }
            return fileMetadataList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageContainer.prototype, "isExternalImageFile", {
        /**
         * return if the first file is convertable or not
         */
        get: function () {
            return this.fileMetadataList && this.fileMetadataList.length > 0 &&
                !this.fileMetadataList[0].isConvertible && this.fileMetadataList[0].isImage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * onPanel Height Change
     * @param height
     * @param className
     * @param elementOverlapped
     * @param panActionType
     */
    ImageContainer.prototype.onPanelHeightChange = function (height, className, elementOverlapped, panActionType) {
        if (panActionType === enums.PanActionType.End && !enhancedOffPageCommentStore.instance.isEnhancedOffpageCommentResizing) {
            this.enhancedOffPageCommentHeight = Number(height);
            this.reRender();
            this.handlePageNumberIndicator();
        }
    };
    /**
     * return class name related to zoom percentage
     */
    ImageContainer.prototype.getZoomLevelClass = function () {
        var className = '';
        var zoomLevel = responseStore.instance.currentZoomPercentage;
        if (zoomLevel <= 50) {
            className = 'small-zoom';
        }
        else if (zoomLevel <= 100) {
            className = 'medium-zoom';
        }
        else {
            className = 'large-zoom';
        }
        return className;
    };
    /**
     * Initiate custom zooms w.r.t container size.
     * @param naturalImageWidth
     * @param naturalImageHeight
     */
    ImageContainer.prototype.initiateResponseImageZoom = function (naturalImageWidth, naturalImageHeight) {
        var contaninerAttribute = htmlUtilities.getElementsByClassName('marksheet-container')[0];
        var imageHeightWidthRatio = naturalImageHeight / naturalImageWidth;
        var scaledImageHeight = contaninerAttribute.clientWidth * imageHeightWidthRatio;
        var zoomPreference;
        var responseViewSettings;
        if (scaledImageHeight > contaninerAttribute.clientHeight) {
            zoomPreference = enums.ZoomPreference.FitHeight;
            responseViewSettings = enums.ResponseViewSettings.FitToHeight;
        }
        else {
            zoomPreference = enums.ZoomPreference.FitWidth;
            responseViewSettings = enums.ResponseViewSettings.FitToWidth;
        }
        var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        var userOption = zoomHelper.getZoomUserOption(zoomUserOption);
        var zoomPreferenceToSave = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue, 0, markingStore.instance.currentQuestionItemInfo.imageClusterId, zoomPreference, userOption.zoomHeader, this.props.selectedECourseworkPageID);
        userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, zoomPreferenceToSave, true, true, false, true, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, responseViewSettings);
    };
    /**
     * get image container height.
     */
    ImageContainer.prototype.getImageContainerHeight = function () {
        var marksheetContainer = ReactDom.findDOMNode(this.refs.markSheet);
        var marksheetContainerHeight = 0;
        if (marksheetContainer) {
            if (!htmlUtilities.isAndroidDevice) {
                marksheetContainerHeight = marksheetContainer.clientHeight;
            }
            else {
                // Client Height vary in Android, so using offset height.
                // offsetHeight is not using as common since it is not correct in IE
                marksheetContainerHeight = marksheetContainer.offsetHeight;
            }
        }
        return marksheetContainerHeight;
    };
    /**
     * get image container width.
     */
    ImageContainer.prototype.getImageContainerWidth = function () {
        var marksheetContainer = ReactDom.findDOMNode(this.refs.markSheet);
        var marksheetContainerWidth = 0;
        if (marksheetContainer) {
            marksheetContainerWidth = marksheetContainer.clientWidth;
        }
        return marksheetContainerWidth;
    };
    /**
     * Returns the scroll height ratio.
     * @param element
     */
    ImageContainer.prototype.getScrollHeightRatio = function (element) {
        return (element.scrollTop / element.scrollHeight) * 100;
    };
    ImageContainer.PADDING_VALUE_BETWEEN_IMAGES = 10;
    return ImageContainer;
}(pureRenderComponent));
module.exports = ImageContainer;
//# sourceMappingURL=imagecontainer.js.map