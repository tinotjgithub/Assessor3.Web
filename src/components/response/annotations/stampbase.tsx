import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import stampData = require('../../../stores/stamp/typings/stampdata');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import stampBaseProps = require('../toolbar/stamppanel/stamptype/typings/stampbaseprops');
import deviceHelper = require('../../../utility/touch/devicehelper');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');
import markingStore = require('../../../stores/marking/markingstore');
import enums = require('../../utility/enums');
import annotation = require('../../../stores/response/typings/annotation');
import stampStore = require('../../../stores/stamp/stampstore');
import EventManagerBase = require('../../base/eventmanager/eventmanagerbase');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import messageStore = require('../../../stores/message/messagestore');
import responseStore = require('../../../stores/response/responsestore');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import colouredannotationshelper = require('../../../utility/stamppanel/colouredannotationshelper');
import bookMarkHelper = require('../../../stores/marking/bookmarkhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

interface State {
    renderedOn: number;
    isVisible?: boolean;
    dragging?: boolean;
    isOpen?: boolean;
}
interface Props extends PropsBase {
    isInFullResponseView: boolean;
    isResponseEditable: boolean;
}

/**
 * React component class for Text Stamp.
 */
class StampBase extends EventManagerBase {
    private onTouchHoldEvent: any;

    // The left offset
    protected left: number;

    // The top offset
    protected top: number;

    // The current windows width
    private windowsWidth: number;

    // The current windows width
    private windowsHeight: number;

    //annotation overlay width
    private overlayWidth: number;

    //annotation overlay Height
    private overlayHeight: number;

    // comment box read only
    public isCommentBoxReadOnly: boolean;

    public isCommentBoxInActive: boolean;

    /**
     * @constructor
     */
    constructor(props: stampBaseProps, state: State) {
        super(props, state);

        this.state = {
            renderedOn: 0,
            isVisible: true,
            isOpen: false
        };

        this.onCommentOpenedForUpdate = this.onCommentOpenedForUpdate.bind(this);
    }

    protected onContextMenu = (event: any) => {
        // Prevent default right click browser context menu
        event.preventDefault();
        event.stopPropagation();

        // to avoid showing 'RemoveAnnotation' context menu while right clicking
        // on OnpageComment Icon which is already opened
        // Also check if exception panel is open or maximized, then prevent the context menu
        if (!this.props.bookmarkId &&
            this.props.clientToken === stampStore.instance.SelectedOnPageCommentClientToken ||
            this.props.clientToken === stampStore.instance.SelectedSideViewCommentToken ||
            this.props.clientToken === markingStore.instance.selectedBookmarkClientToken ||
            annotationHelper.isResponseReadOnly()) {
            return;
        }
        stampActionCreator.showOrHideComment(false);
        // Close Bookmark Name Entry Box
        stampActionCreator.showOrHideBookmarkNameBox(false);
        this.showOrHideRemoveContextMenu(true,
            this.props.clientToken,
            event.clientX,
            event.clientY,
            this.getAnnotationOverlayWidth(),
            this.props.annotationData === undefined ? null : this.props.annotationData,
            (this.props.bookmarkId) ? true : false);
    };

    /**
     * on touch and hold handler
     * @param event
     */
    // This will call from dynamic stamp base, this method is copied to AnnotationOverlay for all other stamp types
    protected onTouchHold = (event: TouchEvent) => {
        event.preventDefault();
        if (event.changedPointers && event.changedPointers.length > 0 && !deviceHelper.isMSTouchDevice()) {
            // Pass the currently clicked annotation along with the X and Y because Remove Context menu
            // is under marksheet div and we need to show the context menu at this position
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
            this.showOrHideRemoveContextMenu(true,
                this.props.clientToken,
                event.changedPointers[event.changedPointers.length - 1].clientX,
                event.changedPointers[event.changedPointers.length - 1].clientY,
                this.getAnnotationOverlayWidth(),
                this.props.annotationData,
                (this.props.bookmarkId) ? true : false);
        }
    };

    /**
     * Show or hide remove context menu
     * @param isVisible
     * @param currentlySelectedAnnotationToken
     * @param clientX
     * @param clientY
     * @param annotationOverlayWidth
     */
    private showOrHideRemoveContextMenu(isVisible: boolean,
        currentlySelectedAnnotationToken: string,
        clientX: number,
        clientY: number,
        annotationOverlayWidth: number,
        annotationData: annotation,
        isBookMark: boolean) {


        //check if exception panel is opened/ maximized
        if (exceptionStore.instance.isExceptionPanelVisible) {
            return;
        }

        /*
         * When we navigate away from response and there are marks to save to db, response screen would be shown untill
         * save marks completed. But Marking progress will be immediately set to false. Then annotation overlay will be hidden.
         * in order to avoid that we need to check where we are navigating as well.navigateTo will only be set when navigating
         * from open or ingarce response
         */
        if ((this.props.clientToken !== undefined
            && this.props.isActive
            && (this.props.isResponseEditable)) || this.props.bookmarkId) {

            // show context menu only if the annotation is for current marking
            if (!this.isPreviousAnnotation) {
                let contextMenuData;
                contextMenuData = isBookMark ? bookMarkHelper.getContextMenuData(currentlySelectedAnnotationToken, annotationOverlayWidth) :
                    annotationHelper.getContextMenuData(currentlySelectedAnnotationToken, annotationOverlayWidth, annotationData);
                   markingActionCreator.showOrHideRemoveContextMenu(isVisible, clientX, clientY, contextMenuData
                );
            }
        }
    }

    /**
     * checks if the element is an annotation
     * @param element
     */
    private checkIfElementIsAnAnnotation(element: Element): boolean {
        let elementId = element.id;
        return elementId.indexOf('annotation-wrap') > 0 || elementId.indexOf('svg-icon') > 0;
    }

    /**
     * On Mouse Enter handler
     * @param event
     */
    protected onMouseEnterHandler(event: any) {
        if ((toolbarStore.instance.panStampId > 0) &&
            !(messageStore.instance.isMessagePanelVisible || exceptionStore.instance.isExceptionPanelVisible) &&
            responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
            markingActionCreator.onAnnotationDraw(false);
        }

        if (this.props.isDisplayingInScript && !this.isPreviousAnnotation) {
            // Hide the SVG from mouse pointer
            responseActionCreator.setMousePosition(-1, -1);
            if (toolbarStore.instance.panStampId > 0) {
                // Get the proper cursor icon from the CSS based on the class
                this.setState({
                    renderedOn: Date.now()
                });
            }
        }
    }

    /**
     * On Mouse Enter handler
     * @param event
     */
    protected onMouseMoveHandler(event: any) {
        if (!this.isPreviousAnnotation && this.props.isDisplayingInScript) {
            if (this.checkIfElementIsAnAnnotation(event.target)) {
                responseActionCreator.setMousePosition(-1, -1);
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * trigged when mouse leaves the annotation area
     * @param event
     */
    protected onMouseLeaveHandler(event: any) {
        markingActionCreator.onAnnotationDraw(true);
    }

    /*returns true if a stamp is selected from the toolbar*/
    protected get isStampSelected(): boolean {
        return toolbarStore.instance.selectedStampId > 0;
    }

    /**
     * Add listeners
     */
    public componentDidMount() {
        // Attaching event only if the annotation is onpagecomment, to set open class
        // attribute to indicate comment is open
        if (this.props.annotationData &&
            this.props.stampData &&
            this.props.stampData.stampId === enums.DynamicAnnotation.OnPageComment
        ) {
            stampStore.instance.addListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.openOrCloseComment);
            stampStore.instance.addListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.onCommentOpenedForUpdate);

            // If new comment is added
            if (this.props.annotationData.annotationId === 0 &&
                this.props.annotationData.comment === undefined) {
                this.onEnterCommentSelected(null);
            }
        }
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.updateCommentStatus);
    }

    /**
     * Remove listeners
     */
    public componentWillUnmount() {
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.openOrCloseComment);
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.onCommentOpenedForUpdate);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.updateCommentStatus);
    }

    /**
     * Updates the status of the comment.
     */
    private updateCommentStatus = () => {

        if (this.state.isOpen && stampStore.instance.SelectedSideViewCommentToken !== this.props.clientToken) {
            this.setState({
                isOpen: false
            });
        }
    }

    private openOrCloseComment = (isOpen: boolean) => {

        let isCommentOpen = false;

        // if the comment is selected to close set open is false
        // or if the comment is open set the open value only to those comment
        // which is opened
        if (isOpen) {

            if (stampStore.instance.SelectedOnPageCommentClientToken === this.props.annotationData.clientToken) {
                isCommentOpen = true;
            }
        } else {
            isCommentOpen = isOpen;
        }
        this.setState({
            isOpen: isCommentOpen
        });
    };

    /**
     * Set the selected comment as opened.
     */
    private onCommentOpenedForUpdate(comment: any,
        leftOffset: any, topOffset: any, qustionHierarhy: any,
        windowsWidth: any, overlayHeight: any,
        overlayWidth: any, wrapper: any, isCommentBoxReadOnly: boolean,
        isCommentBoxInActive: boolean): void {

        this.openOrCloseComment(true);
    }

    /**
     * Get annotation overlay width
     */
    private getAnnotationOverlayWidth(): number {
        let element: Element = ReactDom.findDOMNode(this).parentElement;

        // Get parent element i.e. annotation overlay right edge boundary
        if (element !== undefined) {
            element = ReactDom.findDOMNode(element);
            return element.getBoundingClientRect().right;
        }

        return 0;
    }

    /**
     * Get the annotation color
     */
    protected getAnnotationColor = () => {
        return this.props.annotationData.red + ',' + this.props.annotationData.green + ',' +
            this.props.annotationData.blue;
    };

    /**
     * return true if the annotation is of a remarking
     */
    protected get isPreviousAnnotation(): boolean {
        return this.props.annotationData !== undefined
            && this.props.annotationData.isPrevious === true;
    }

    /**
     * return the post id text for an annotation
     */
    protected get remarkIdPostText(): string {
        return this.isPreviousAnnotation ?
            '-previous-' + this.props.annotationData.remarkRequestTypeId : '';
    }

    /**
     * Open comment edit box while clicking.
     * @param {Event} event
     */
    protected onEnterCommentSelected(e: any) {

        if (this.props.isActive !== undefined &&
            this.props.stampData.stampId === enums.DynamicAnnotation.OnPageComment) {
            // Preventing markscheme panel gets selected.
            if (e &&
                (
                    !this.isPreviousAnnotation
                    || toolbarStore.instance.selectedStampId === 0
                )
            ) {
                if (markingStore.instance.selectedBookmarkClientToken) {
                    stampActionCreator.showOrHideBookmarkNameBox(false);
                }
                e.preventDefault();
                e.stopPropagation();
            }

            // If the comment is already open we dont need to trigger to
            // reset the comment. This will ensure that when a new/old comment is already opened
            // and click on the same will persist the commentbox as well as clicking on another comment
            if (this.state.isOpen) {
                return;
            }

            // restrict previous commentbox from opening while stamping an annotation on it.
            if (this.isPreviousAnnotation && toolbarStore.instance.selectedStampId !== 0) {
                return;
            }

            markingActionCreator.showOrHideRemoveContextMenu(false);
            let element: Element = ReactDom.findDOMNode(this);
            let commmentWrapperWidth = 0;
            let editCommentContainerWidth = 187;
            let wrapper: any;
            if (element !== undefined) {
                element = ReactDom.findDOMNode(element);
                wrapper = element.getBoundingClientRect();
                this.overlayWidth = element.parentElement.clientWidth + element.parentElement.clientLeft;
                this.overlayHeight = element.parentElement.clientHeight + element.parentElement.clientTop;
                commmentWrapperWidth = element.clientWidth;

                this.windowsWidth = window.innerWidth;
                this.windowsHeight = window.innerHeight;
                let wrappertop = (wrapper.top + editCommentContainerWidth) < this.windowsHeight ?
                    wrapper.top :
                    (wrapper.top - editCommentContainerWidth + commmentWrapperWidth);

                this.left = 100 * ((wrapper.left + commmentWrapperWidth - 58) / this.overlayWidth);
                this.top = 100 * (wrappertop - 60) / this.overlayHeight;
            }
            this.isCommentBoxReadOnly = this.isPreviousAnnotation || !this.props.isActive
                || markingStore.instance.currentResponseMode === enums.ResponseMode.closed
                || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement
                || ((standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                    === enums.StandardisationSetup.UnClassifiedResponse ||
                    standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                    === enums.StandardisationSetup.ClassifiedResponse) &&
                        !markerOperationModeFactory.operationMode.isResponseEditable);
            this.isCommentBoxInActive = !this.props.isActive;
            if (this.props.isActive !== undefined) {
                stampActionCreator.editOnPageComment(this.props.annotationData,
                    this.left,
                    this.top,
                    this.props.toolTip,
                    this.windowsWidth,
                    this.overlayWidth,
                    this.overlayHeight,
                    wrapper,
                    this.isCommentBoxReadOnly,
                    this.isCommentBoxInActive);
                this.setState({ isOpen: true });
            }
        }
    }

    /**
     * Restrict Static annotation Placing outside of the response
     * @param wrapperStyle
     */
    protected getAnnotationWrapperStyle(wrapperStyle: React.CSSProperties): React.CSSProperties {
        let left = 0;
        let top = 0;
        let style: React.CSSProperties = {};
        if (wrapperStyle) {
            // avoid any reference from props or other objects
            style = JSON.parse(JSON.stringify(wrapperStyle));
            left = parseFloat(style.left);
            top = parseFloat(style.top);

            if (left < 0) {
                style.left = '0%';
            }
            if (top < 0) {
                style.top = '0%';
            }

            if (left > 100) {
                style.left = (left - 1) + '%';
            }
            if (top > 100) {
                style.top = (top - 1) + '%';
            }

            let rgb: string = colouredannotationshelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None).fill;
            style.color = rgb;

            // for Inactive annoataions .
            if (this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView) {
                style.color = colouredannotationshelper.getTintedRgbColor(rgb);
            }
        }

        if (this.props.isInFullResponseView) {
            style.pointerEvents = 'none';
        }
        return style;
    }
}

export = StampBase;