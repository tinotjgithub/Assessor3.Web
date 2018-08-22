import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import CommentBox = require('./commentbox');
import stampStore = require('../../../../stores/stamp/stampstore');
import toolBarStore = require('../../../../stores/toolbar/toolbarstore');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import markingStore = require('../../../../stores/marking/markingstore');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import annotation = require('../../../../stores/response/typings/annotation');
let classNames = require('classnames');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import constants = require('../../../utility/constants');
import enums = require('../../../utility/enums');
import messageStore = require('../../../../stores/message/messagestore');
import eventManagerBase = require('../../../base/eventmanager/eventmanagerbase');
import eventTypes = require('../../../base/eventmanager/eventtypes');
import exceptionStore = require('../../../../stores/exception/exceptionstore');
import userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
import onPageCommentHelper = require('../../../utility/annotation/onpagecommenthelper');
import CommentHolder = require('./commentholder');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import dynamicElementProperties = require('../../../response/annotations/typings/dynamicelementproperties');
import responseStore = require('../../../../stores/response/responsestore');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import ecourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import enhancedOffPageCommentStore = require('../../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import responseHelper = require('../../../utility/responsehelper/responsehelper');

/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    naturalImageHeight?: number;
    naturalImageWidth?: number;
    enableCommentsSideView: boolean;
    renderedOn: number;
    enableCommentBox: boolean;
    commentContainerRight: number;
    selectedZoomPreference?: enums.ZoomPreference;
    displayAngle?: number;
    isEBookMarking: boolean;
}

interface State {
    isOpen: boolean;
    renderedOn: number;
    hideCommentLines: boolean;
    hideCommentBoxes: boolean;
}

class CommentContainer extends eventManagerBase {

    /** refs */
    public refs: {
        [key: string]: (Element);
        commentContainer: Element;
    };
    private isCommentBoxReadOnly: boolean;
    private isCommentBoxInActive: boolean;
    private wrapperStyle: React.CSSProperties;

    private commentBoxLeft: number;
    private commentBoxTop: number;
    private comment: string;
    private markSchemeText: string;
    private windowsWidth: number;
    private overlayHeight: number;
    private overlayWidth: number;
    private wrapper: any;
    private wrapperLeft: number;
    private wrapperTop: number;

    /** variables to hold the line ponts */
    private lineX1: number = 0;
    private lineX2: number = 0;
    private lineY1: number = 0;
    private lineY2: number = 0;
    private lineMaskX: number = 0;
    private lineMaskY: number = 0;

    /** variable to hold annotation color */
    private commentColor: string;
    private leftDeviation: number;
    private topDeviation: number;
    private isReadyToDrag: boolean = true;

    private isAnnotationMoving: boolean = false;
    // flag for enabling scroll
    private doEnableScroll: boolean = false;

    // Holds the annotation unique id
    private clientToken: string;
    private that: any;
    private isZoomEnds: boolean = false;
	private horizontalScrollInProgress: boolean = false;

	// Indicating to hide the comment container
    private hideCommentContainer: boolean = false;
    private isComponentMounted: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
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
    public render(): JSX.Element {
        // calculating width and padding for comment-wrapper
        let _widthCalc = window.innerWidth - this.overlayWidth;
        let _aspectRatio = this.overlayHeight / this.overlayWidth;

        // comment-wrapper style object
        let wrapperStyle: React.CSSProperties;
        let containerStyle: React.CSSProperties = null;

        let commentHolderEl: JSX.Element = null;
        let commentHoldersSideView: JSX.Element[] = null;
        let commentsSideViewbgEl: JSX.Element = null;
        if (this.isSideViewEnabledAndVisible === false) {
            wrapperStyle = {
                width: 'calc(100% - ' + _widthCalc + 'px)',
                paddingTop: 'calc(' + _aspectRatio + ' * (100% - ' + _widthCalc + 'px))'
            };
            commentHolderEl = (<CommentHolder clientToken={this.clientToken}
                comment={this.comment}
                markSchemeText={this.markSchemeText}
                commentBoxTop={this.commentBoxTop}
                commentBoxLeft={this.commentBoxLeft}
                selectedLanguage={this.props.selectedLanguage}
                key ={'commentHolder'} id={'commentHolder'}
                renderedOn={this.state.renderedOn}
                isCommentBoxReadOnly = {this.isCommentBoxReadOnly}
                isCommentBoxInActive = {this.isCommentBoxInActive}
                naturalImageWidth= {this.props.naturalImageWidth}
                naturalImageHeight= {this.props.naturalImageHeight}
                isOpen ={this.state.isOpen}
                lineX1 = {this.lineX1}
                lineX2 = {this.lineX2}
                lineY1 = {this.lineY1}
                lineY2 = {this.lineY2}
                lineMaskX = {this.lineMaskX}
                lineMaskY = {this.lineMaskY}
                wrapperStyle = {wrapperStyle}
                enableCommentsSideView = {this.isSideViewEnabledAndVisible}
                imageClusterId = {null} outputPageNo={null} pageNo={null}
                overlayHeight = {this.overlayHeight}
                overlayWidth = {this.overlayWidth}
                windowsWidth={this.windowsWidth}
                commentColor = {this.commentColor}
                enableCommentBox = {this.props.enableCommentBox}
                isAnnotationMoving = {this.isAnnotationMoving}
                holderCount = {0}
                marksheetHolderLeft = {0}
                boxRenderedOn = {this.state.renderedOn}
                displayAngle={0}
                hideCommentBoxes={this.state.hideCommentBoxes}
                selectedZoomPreference = {this.props.selectedZoomPreference}
                />);
        } else {
            let holderCount: number = 0;
            commentsSideViewbgEl = (<div className='comments-bg'></div>);
            containerStyle = { right: this.props.commentContainerRight };
            commentHoldersSideView = onPageCommentHelper.outputPages.map(
                (x: OutputPage) => {
                    let marksheetHolderLeft: number = 0;
                    let overlayheight: number = 0;
                    let overlaywidth: number = 0;
                    let height: number = 0;
                    let width: number = 0;
                    let overlayElement: Element;
                    let markSheetHolder: Element;
                    holderCount++;
                    let displayAngle: number = this.getDisplayAngle(x.pageNo, x.structeredPageNo, x.outputPageNo);

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
                    let paddingTopStyle: string;
                    let marginTopStyle: string;
                    switch (this.props.selectedZoomPreference) {
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
                        marginTop: holderCount === 1 ? 0 : marginTopStyle
                    };
                    return (<CommentHolder clientToken={this.clientToken}
                        comment={this.comment}
                        markSchemeText={undefined}
                        commentBoxTop={undefined}
                        commentBoxLeft={undefined}
                        selectedLanguage={this.props.selectedLanguage}
                        key ={'commentHolder' + holderCount} id={'commentHolder' + holderCount}
                        renderedOn={this.state.renderedOn}
                        isCommentBoxReadOnly = {undefined}
                        isCommentBoxInActive = {undefined}
                        naturalImageWidth= {this.props.naturalImageWidth}
                        naturalImageHeight= {this.props.naturalImageHeight}
                        isOpen ={this.state.isOpen}
                        lineX1 = {undefined}
                        lineX2 = {undefined}
                        lineY1 = {undefined}
                        lineY2 = {undefined}
                        lineMaskX = {undefined}
                        lineMaskY = {undefined}
                        wrapperStyle = {wrapperStyle}
                        enableCommentsSideView = {this.isSideViewEnabledAndVisible}
                        imageClusterId = {x.imageClusterId}
                        outputPageNo = {x.outputPageNo}
                        pageNo = {x.pageNo}
                        overlayHeight = {overlayheight}
                        overlayWidth = {overlaywidth}
                        windowsWidth={this.windowsWidth}
                        commentColor = {this.commentColor}
                        enableCommentBox = {this.props.enableCommentBox}
                        isAnnotationMoving = {this.isAnnotationMoving}
                        holderCount = {holderCount}
                        selectedZoomPreference = {this.props.selectedZoomPreference}
                        marksheetHolderLeft = {marksheetHolderLeft}
                        boxRenderedOn = {this.props.renderedOn}
                        displayAngle={displayAngle}
                        hideCommentBoxes={this.state.hideCommentBoxes}
                        />);
                });
        }
		return (
            <div className= { classNames('comment-container',
                    {
                        'hide-line': this.state.hideCommentLines,
						'hide-box': this.state.hideCommentBoxes,
						'hide': this.hideCommentContainer
                    }) }
                ref={'commentContainer'}
                onClick={(e) => this.onClick(e)}
                onDoubleClick={(e) => this.onClick(e)}
                onScroll = {(e) => this.onScrollHandler(e)}
                onWheel = {(e) => this.onWheelHandler(e)}
                onContextMenu ={(e) => this.onClick(e)}
                style = {containerStyle}
                >
                {commentHolderEl}
                {commentHoldersSideView}
                {commentsSideViewbgEl}
            </div >
        );
    }

    /**
     * This function gets invoked when the component is mounted
     */
    public componentDidMount() {
        this.isComponentMounted = true;
        stampStore.instance.addListener(stampStore.StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT,
        this.toggleCommentLinesAndBoxesVisiibility);
        stampStore.instance.addListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.showOnPageComment);
        stampStore.instance.addListener(stampStore.StampStore.DELETE_COMMENT, this.deleteComment);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.reRenderOnZoom);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.reRenderCommentBoxesOnly);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationMoveEnd);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
			this.reRender);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_VISIBILITY_CHANGED_EVENT, this.onCommentVisibilityChanged);
        ecourseWorkFileStore.instance.addListener(ecourseWorkFileStore.ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT,
            this.reRender);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT,
            this.reRenderAfterAnimation);
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
        this.appendEventHandler(this.refs.commentContainer,
            'touchmove',
            this.onTouchMoveHandler,
            htmlUtilities.isAndroidChrome());
    }

    /**
     * This function gets invoked when the component is updated
     */
    public componentDidUpdate() {
        this.isAnnotationMoving = false;
    }


    /**
     * This function gets invoked when the component will receive props
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        /* if (this.props.enableCommentsSideView !== nxtProps.enableCommentsSideView &&
            this.props.enableCommentsSideView === true) {
            stampActionCreator.setSelectedSideViewComment(stampStore.instance.SelectedSideViewCommentToken);
        }*/
        if (this.props.commentContainerRight !== nxtProps.commentContainerRight &&
            this.props.enableCommentsSideView === true) {
            this.horizontalScrollInProgress = true;
        } else {
            this.horizontalScrollInProgress = false;
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        this.isComponentMounted = false;
        stampStore.instance.removeListener(stampStore.StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT,
        this.toggleCommentLinesAndBoxesVisiibility);
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.showOnPageComment);
        stampStore.instance.removeListener(stampStore.StampStore.DELETE_COMMENT, this.deleteComment);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.reRenderOnZoom);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.reRenderCommentBoxesOnly);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.reRender);
		markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationMoveEnd);
		stampStore.instance.removeListener(stampStore.StampStore.COMMENT_VISIBILITY_CHANGED_EVENT, this.onCommentVisibilityChanged);
        ecourseWorkFileStore.instance.removeListener(ecourseWorkFileStore.ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT,
            this.reRender);
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.reRenderAfterAnimation);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT,
            this.reRenderAfterAnimation);
        this.unRegisterEvents();

        // Removing the touchmove event handler to the Comment Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.removeEventHandler(this.refs.commentContainer,
            'touchmove',
            this.onTouchMoveHandler,
            htmlUtilities.isAndroidChrome());
    }

    /**
     * Mount or unmount events on demand
     * @param {boolean} active
     */
    private mountOrUnMountEvent(active: boolean): void {
        if (active === true) {
            stampStore.instance.addListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.showOrHideComment);
        } else {
            stampStore.instance.removeListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.showOrHideComment);
        }
    }

    /**
     * Re render the container
     */
    private reRender(): void {
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * re render the comment container by considering the animation
     */
    private reRenderAfterAnimation = () => {
        let that = this;
        if (markingStore.instance.getResizedPanelClassName() || enhancedOffPageCommentStore.instance.isEnhancedOffpageCommentResizing) {
                return;
        }else{
            setTimeout(function() {
                that.reRender();
            }, constants.GENERIC_IMMEDIATE_AFTER_ANIMATION_TIMEOUT);
        }
    }

    /**
     * Re render the container
     */
    private reRenderOnZoom = (isZoomEnd: boolean) => {
        this.isZoomEnds = isZoomEnd;
        /*this.horizontalScrollInProgress ? this.state.boxRenderedOn : */
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Re render the comment boxes only
     */
    private reRenderCommentBoxesOnly = () => {
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * set flags to hide the lines and boxes during animation/pinch zoom
     */
	private toggleCommentLinesAndBoxesVisiibility = (hideLines: boolean, hideBoxes: boolean) => {
        this.setState({
            hideCommentLines: hideLines,
            hideCommentBoxes: hideBoxes
        });
    }

    /**
     *  annotation move
     */
    private onAnnotationMoveEnd(draggedAnnotationClientToken, isPositionUpdated,
        isDrawEndOfStampFromStampPanel, stampId) {

        if (stampId === enums.DynamicAnnotation.OnPageComment && this.isSideViewEnabledAndVisible === true) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * prevent default behaviour while clicking on comment container
     * @param any
     */
    private onClick(e: any): void {
        markingActionCreator.showOrHideRemoveContextMenu(false);
        if (this.isSideViewEnabledAndVisible === true) {
            if ((e.target as Element).classList && (e.target as Element).classList[0] !== 'comments-bg') {
                this.onSelectCommentBox(e);
                e.preventDefault();
                e.stopPropagation();
            }
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /* touch move event for image container */
    private onTouchMoveHandler = (event: any) => {
        if (!this.doEnableScroll && htmlUtilities.isTabletOrMobileDevice) {
            event.preventDefault();
        }
    };

    /**
     * prevent default behaviour while scrolling on comment container
     * @param event any
     */
    private onScrollHandler = (e: any) => {
        this.enableCommentContainerScroll(true);
        e.stopPropagation();
    };

    /**
     * set the flag for enable comment container scroll
     * @param value true/false
     */
    public enableCommentContainerScroll = (value: boolean): void => {
        this.doEnableScroll = value;
    };

    /**
     * prevent default behaviour while scrolling using Mouse Wheel on comment container
     * @param any
     */
    private onWheelHandler = (e: any) => {
        if (stampStore.instance.SelectedSideViewCommentToken !== undefined && this.isSideViewEnabledAndVisible) {
        stampActionCreator.showOrHideComment(false);
        } else {
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
    private showOnPageComment = (comment: any, leftOffset: any, topOffset: any, qustionHierarhy: any,
        windowsWidth: any, overlayHeight: any, overlayWidth: any, wrapper: any, isCommentBoxReadOnly: boolean,
        isCommentBoxInActive: boolean) => {
        // If a newly added comment is opened and clicking on another comment should
        // delete and hide the new comment and open the selected one
        // handle for onpage and side view comments
        if ((this.state.isOpen === true
            || this.isSideViewEnabledAndVisible && stampStore.instance.SelectedSideViewCommentToken !== undefined)
            && !this.comment) {
            this.showOrHideComment(false);
        }
        this.clientToken = comment.clientToken;
        this.comment = comment.comment;
        // set the below values for on page comment mode only
        if (this.props.enableCommentBox === false || this.props.enableCommentsSideView === false) {
            this.commentBoxLeft = leftOffset;
            this.commentBoxTop = topOffset;
            this.windowsWidth = windowsWidth;
            this.overlayHeight = overlayHeight;
            this.overlayWidth = overlayWidth;
            this.wrapper = wrapper;
            this.wrapperLeft = this.wrapper.left;
            this.wrapperTop = this.wrapper.top;
            this.markSchemeText = markingStore.instance.toolTip(comment.markSchemeId);
            this.isCommentBoxReadOnly = isCommentBoxReadOnly;
            this.isCommentBoxInActive = isCommentBoxInActive;

            /** calculating the line parameters */
            let lineleft = 100 * ((wrapper.left + (wrapper.width / 2) - constants.RESPONSE_LEFT_PANEL_WIDTH)
                / this.overlayWidth);
            let lineTop = 100 * ((wrapper.top + (wrapper.height / 2)) - constants.RESPONSE_TOP_PANEL_HEIGHT)
                / this.overlayHeight;

            this.lineX1 = lineleft;
            this.lineY1 = lineTop;
            this.lineX2 = lineleft;
            this.lineY2 = lineTop;
            this.lineMaskX = 100 * ((wrapper.left - constants.RESPONSE_LEFT_PANEL_WIDTH) / this.overlayWidth);
            this.lineMaskY = 100 * ((wrapper.top - constants.RESPONSE_TOP_PANEL_HEIGHT) / this.overlayHeight);

            /** getting the color of annotation from annotation helper */
            this.commentColor = colouredAnnotationsHelper.createAnnotationStyle(comment, enums.DynamicAnnotation.OnPageComment).fill;
        } else {
            stampActionCreator.setSelectedSideViewComment(comment.clientToken);
        }

        // Open edit box - render is needed for on page comment mode
        this.showOrHideComment(true, false, this.isSideViewEnabledAndVisible);

        // Mounting events to close the comment while clicking outside
        this.mountOrUnMountEvent(true);
    };

    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = Reactdom.findDOMNode(this);

        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            let touchActionValue: string = 'pan-x,pan-y';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { threshold: 0 });
            this.eventHandler.on(eventTypes.PAN_START, this.onDragStart);
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onDragMove);
        }
    }

    /**
     * unregister events
     */
    private unRegisterEvents() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     *  to show or hide comment box by setting the state values
     * @param isOpen
     * @param isPanAvoidImageContainerRender
     * @param avoidRender
     */
    private showOrHideComment = (isOpen: boolean, isPanAvoidImageContainerRender: boolean = false, avoidRender: boolean = false) => {
        let setCommentBoxVisible: boolean = isOpen;
        let annotaion = markingStore.instance.getAnnotation(this.clientToken);
        if (annotaion) {
            this.comment = annotaion.comment;
        }
        // To prevent mark entry textbox to get process, we need to deactivate the
        // keyboard handler on comment open and viceversa.
        if (isOpen === true && !this.isCommentBoxReadOnly) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Comment);
        } else {
            this.mountOrUnMountEvent(false);
            if (!messageStore.instance.isMessagePanelVisible && !exceptionStore.instance.isExceptionPanelVisible) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Comment);
            }
            // deleting comment while closing comment box
            // ie. deleting onpage comment while the comment text is empty
            // and to avoid deleting in closed response
            if (!this.isCommentBoxReadOnly
                && !this.comment) {
                this.deleteComment(isPanAvoidImageContainerRender);
                // after removing annotation the focus is setted to markscheme panel
                // it is used to bring back the focus to the comment box
                markingActionCreator.setMarkEntrySelected(true);
                setCommentBoxVisible = false;
            }
            // in case the focus is lost from the comment side view boxes, reset selected edit box
            if (this.isSideViewEnabledAndVisible === true &&
                !onPageCommentHelper.commentMoveInSideView &&
                !avoidRender) {
                stampActionCreator.setSelectedSideViewComment(undefined);
            }
        }
        if (!avoidRender && this.isComponentMounted) {
            this.setState({
                isOpen: setCommentBoxVisible,
                renderedOn: Date.now()
            });
        }
    };

    /**
     *  to delete comment
     * @param isPanAvoidImageContainerRender
     */
    private deleteComment = (isPanAvoidImageContainerRender: boolean = false): void => {

        // avoid removeAnnotation event for invalid annotation(ie if clientToken is undefined)
        if (this.clientToken) {
            let annotationClientTokenToBeDeleted: Array<string> = [];
            annotationClientTokenToBeDeleted.push(this.clientToken);
            let isMarkByAnnotation: boolean;
            isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
            markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted, isMarkByAnnotation, isPanAvoidImageContainerRender);
            if (this.isSideViewEnabledAndVisible === true) {
                onPageCommentHelper.updateSideViewItem(this.clientToken, null, true);
            }
        }
    };

    /**
     *  listener to select the comment box in Side view
     */
    private onSelectCommentBox = (evt: Event): void => {
        // Typing in the comment text area should not trigger the selection
        // 'key' to avoid tslint error
        let key: string = 'type';
        let event: Event = evt;
        let deleteAncestor: Element = htmlUtilities.findAncestor(event.target as Element, 'delete-comment-button');
        let isDeleteButton: boolean = deleteAncestor ? deleteAncestor.classList[0] === 'delete-comment-button' : false;
        if (event.target[key] !== 'textarea' && !isDeleteButton &&
            this.isSideViewEnabledAndVisible === true) {
            this.mountOrUnMountEvent(false);
            let commentBoxHolder: Element = htmlUtilities.findAncestor(event.target as Element, 'comment-box-holder');
            if (commentBoxHolder) {
                let boxHolderId: Attr = commentBoxHolder.attributes.getNamedItem('id');
                if (boxHolderId) {
                    // get the client token before we set this.clientToken and check if we clicked on a different commentbox in Side view
                    // This avoids unnecessary calls when same box is clicked
                    let targetClientToken: string = commentBoxHolder.attributes.getNamedItem('id').value.split('_')[3];
                    if (targetClientToken !== this.clientToken && this.clientToken !== undefined) {
                        // perform various actions like keydown deactivate, delete empty previous comment etc.
                        // No need to render commentcontainer as render happens in setSelectedSideViewComment below
                        this.showOrHideComment(false, false, true);
                    }
                    this.clientToken = targetClientToken;
                    this.showOrHideComment(true, false, true);
                    // Mounting events to close the comment while clicking outside
                    this.mountOrUnMountEvent(true);
                    stampActionCreator.setSelectedSideViewComment(this.clientToken);
                }
            }
        }
    };

    /**
     * Listner for comment box drag event
     * @param event
     */
    private onDragMove = (event: EventCustom) => {
        if (this.isReadyToDrag === true && this.isSideViewEnabledAndVisible === false) {
            this.enableCommentContainerScroll(false);
            event.preventDefault();
            let element = $('.comment-box').get(0) as HTMLElement;
            this.setCommentBoxPositions(event, element);
            this.setCommentLinePositions(element);
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Listner for comment box drag start event
     * @param event
     */
    private onDragStart = (event: EventCustom) => {
        if (event.target.classList !== undefined && event.target.classList[0] !== 'comment-textbox'
            && this.isSideViewEnabledAndVisible === false) {
            this.enableCommentContainerScroll(false);
            event.preventDefault();
            let annotation = markingStore.instance.getAnnotation(this.clientToken);
            if (annotation) {
                this.comment = annotation.comment;
            }
            let element = $('.comment-box').get(0) as HTMLElement;
            let elementRect = element.getBoundingClientRect();

            this.isReadyToDrag = true;

            this.leftDeviation = Math.abs(event.center.x - elementRect.left + this.wrapper.width);
            this.topDeviation = Math.abs(event.center.y - elementRect.top);

        } else {
            this.enableCommentContainerScroll(true);
            this.isReadyToDrag = false;
        }
    };

    /**
     * calculate the left and top positions of comment box on drag/pan
     * @param event
     * @param element
     */
    private setCommentBoxPositions(event: any, element: HTMLElement): void {

        let elementRect = element.getBoundingClientRect();

        let vw = window.innerWidth;
        let vh = window.innerHeight;

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
    }

    /**
     * calculate the position (X2,Y2) of comment line on drag/pan
     * @param event
     * @param element
     */
    private setCommentLinePositions(element: HTMLElement): void {

        let elementRect = element.getBoundingClientRect();

        let lineleft = 100 * (((this.wrapperLeft + this.wrapper.width - constants.RESPONSE_LEFT_PANEL_WIDTH) +
            (elementRect.width / 2)) / this.overlayWidth);
        let lineTop = 100 * ((this.wrapperTop - constants.RESPONSE_TOP_PANEL_HEIGHT) +
            (elementRect.height / 2)) / this.overlayHeight;

        this.lineX2 = lineleft;
        this.lineY2 = lineTop;
    }

    /**
     * returns whether side view is enabled and open (will rturn false if exception or message windows open)
     */
    private get isSideViewEnabledAndVisible(): boolean {
        return (this.props.enableCommentsSideView && this.props.enableCommentBox);
    }

    /**
     * returns the display angle
     */
    private getDisplayAngle(pageNo: number, structerdPageNo: number, outputPageNo: number) {

        let displayAngle: number = 0;
        let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
            displayAngleCollection.map((angle: number, key: string) => {

                let str = key.split('_');
                if (str[0] + '_' + str[1] + '_' + str[2] === 'img_' + structerdPageNo + '_' + outputPageNo) {
                    displayAngle = angle;
                }
            });
        }
        displayAngle = annotationHelper.getAngleforRotation(displayAngle);

        return displayAngle;
	}

    /**
     * Invoke when response comment container visibility has been chanegd
     * @param isVisible
     */
	private onCommentVisibilityChanged(isVisible: boolean): void {
		this.hideCommentContainer = !isVisible;
    }
}

export = CommentContainer;