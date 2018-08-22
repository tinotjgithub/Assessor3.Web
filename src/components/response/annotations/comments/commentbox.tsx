import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import enums = require('../../../utility/enums');
import deviceHelper = require('../../../../utility/touch/devicehelper');
import onPageCommentHelper = require('../../../../components/utility/annotation/onpagecommenthelper');
import annotation = require('../../../../stores/response/typings/annotation');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import markingStore = require('../../../../stores/marking/markingstore');
import stringHelper = require('../../../../utility/generic/stringhelper');
import constants = require('../../../utility/constants');
import localeStore = require('../../../../stores/locale/localestore');
import responseStore = require('../../../../stores/response/responsestore');
import stampStore = require('../../../../stores/stamp/stampstore');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import coloredAnnotationHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');

interface Props extends LocaleSelectionBase, PropsBase {
    comment: any;
    leftPosition: number;
    topPosition: number;
    rgbColor: string;
    markSchemeText: string;
    renderedOn: number;
    clientToken: string;
    isCommentBoxReadOnly: boolean;
    isCommentBoxInActive: boolean;
    naturalImageHeight?: number;
    naturalImageWidth?: number;
    enableCommentsSideView: boolean;
    enableCommentBox: boolean;
    selectedZoomPreference: enums.ZoomPreference;
}

interface State {
    toggle: boolean;
    comment?: string;
}

class CommentBox extends pureRenderComponent<Props, State> {
    private commentBoxStyle: React.CSSProperties;
    private commentBoxHolderStyle: React.CSSProperties;

    // Holds a value indicating the comment text.
    private commentText: string = '';
    private isCommentBoxReadOnly: boolean = false;
    private isCommentBoxInActive: boolean = false;
    private isCommentBoxChanging: boolean = false;

    /** refs */
    public refs: {
        [key: string]: (Element);
        commentTextBox: (HTMLTextAreaElement);
        commentBox: (HTMLElement);
    };

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
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
    public render(): JSX.Element {
        let commentBoxStyle = {
            left: this.props.leftPosition + '%',
            top: this.props.topPosition + '%'
        };
        let svgStyle: React.CSSProperties = {
            pointerEvents: 'none'
        };

        let commentElement: JSX.Element = (
            this.props.isCommentBoxReadOnly ?
             <div className='comment-textbox'>
                {this.commentText}
            </div>
                :
            <textarea className='comment-textbox'
            placeholder={localeStore.instance.TranslateText('marking.response.on-page-comment-box.comment-placeholder-text') }
            onInput={this.onChange}
            ref={'commentTextBox'}
            onFocus={this.onFocus}
            onClick={this.onCommentTextSelected}
            onContextMenu={this.onRightClick}
            value = {this.commentText}
            spellCheck = {true}
            aria-label='Comment-textbox'
            ></textarea>);

        let commentSideViewToggleElement: JSX.Element = null;
        if (this.props.enableCommentBox) {
            commentSideViewToggleElement = (<div className='comment-icon-holder'>
                <div className='offpage-comment-icon'
                    title={localeStore.instance.TranslateText('marking.response.on-page-comment-box.side-view-icon-tooltip') } >
                    <a href='javascript:void(0)' className='offpage-comment-link' onClick={this.toggleCommentSideView} >
                        <svg viewBox='0 0 26 26' className='offpage-comment-icon' style={svgStyle}>
                            <use xlinkHref='#icon-offpage-comment' >Switch to Side View</use>
                        </svg>
                    </a>
                </div>
            </div>);
        }

        let footerElement: JSX.Element = (<div className='comment-box-footer'>
            <a href='javascript:void(0)' className='delete-comment-button'
                title={stringHelper.format(
                    localeStore.instance.TranslateText('marking.response.on-page-comment-box.delete-icon-tooltip'),
                    [constants.NONBREAKING_HYPHEN_UNICODE]) } onClick={this.deleteComment}>
                <svg viewBox='0 0 26 26' className='delete-comment-icon'>
                    <use xlinkHref='#delete-comment-icon'>Delete Comment</use>
                </svg>
            </a>
        </div>);

        if (this.props.enableCommentsSideView === true && this.props.clientToken !== stampStore.instance.SelectedSideViewCommentToken) {
            commentElement = <div className='comment-textbox'>
                    {this.commentText}
                </div>;
        }

        let commentStyle: React.CSSProperties = {};
        commentStyle.color = coloredAnnotationHelper.getTintedRgbColor(this.props.rgbColor, 0.95);

        return (
            <div className='comment-box' style={commentBoxStyle} ref ={'commentBox'} id={'comment_box_' + this.props.id}
                onMouseLeave={this.onLeaveHandler}>
                <div className='commentbox-inner' style={commentStyle}>
                    <div className='comment-box-header clearfix'>
                        <div className='comment-heading'>{this.props.markSchemeText}</div>
                        {commentSideViewToggleElement}
                    </div>

                    <div className='comment-box-content'>
                        <div className='comment-input'>
                            {commentElement}
                            <div className='ellipsis-dots'></div>
                        </div>
                        <div className='comment-input-border' style={{ color: this.props.rgbColor }}></div>
                    </div>
                    {footerElement}
                </div>
                <div className='commentbox-fader'></div>
            </div >
        );
    }

    /**
     * Moving the cursor point to last(due to IE issue).
     * @param {Event} event
     */
    private onFocus = (event: any) => {
        let temp = event.target.value || event.srcElement;
        event.target.value = '';
        event.target.value = temp !== undefined ? temp : '';
    };

    /**
     * This method will get fired when the mouse leaves the Comment box.
     * @param {Event} event
     */
    private onLeaveHandler = (event: any) => {
        let e: Element = event.toElement || event.relatedTarget;
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
    private onChange = (event: any) => {
        if (!this.props.isCommentBoxReadOnly) {
            // Browser specific.
            let target: any = event.target || event.srcElement;
            let comment: string = target.value;
            this.commentText = comment;

            let annotation = markingStore.instance.getAnnotation(this.props.clientToken);

            if (annotation) {
                // WA compatibility comment box position calculation
                let pos = onPageCommentHelper.UpdateOnPageCommentPosition(
                    this.props.naturalImageHeight,
                    this.props.naturalImageWidth,
                    this.commentText,
                    annotation.topEdge,
                    annotation.leftEdge);

                // Updating the left and top position along with comment text
                // And pass isPositionUpdated as false, because only the comment text is changed not position of annotation
                markingActionCreator.updateAnnotation(pos.left,
                    pos.top,
                    annotation.imageClusterId,
                    annotation.outputPageNo,
                    annotation.pageNo,
                    annotation.clientToken,
                    annotation.width,
                    annotation.height,
                    this.commentText,
                    false,
                    false,
                    true);

                // update the side view collection to reflect the change
                onPageCommentHelper.updateSideViewItem(this.props.clientToken, this.commentText);
                this.isCommentBoxChanging = true;

                this.setState({
                    toggle: !this.state.toggle
                });
            }
        }
    };

    /**
     * This function gets invoked when the component is about to receive props
     */
    public componentWillReceiveProps(nxtProps: Props) {

        // if new comment has been opened, then update the existing comment text to the new one.
        if (this.props.renderedOn !== nxtProps.renderedOn) {

            this.isCommentBoxChanging = false;
            // replacing undefined to empty text
            let prevComment = this.commentText;
            this.commentText = nxtProps.comment ? nxtProps.comment :
                (this.commentText === undefined || this.props.comment === prevComment) ? '' : this.commentText;
            if (this.props.enableCommentsSideView === true &&
                nxtProps.clientToken === stampStore.instance.SelectedSideViewCommentToken) {
                    onPageCommentHelper.updateSideViewItem(nxtProps.clientToken, this.commentText);
            }
        }
    }

    /**
     * This function gets invoked when the component is mounted
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
        this.setCommentBoxFocus();
    }

    /**
     * To set the comment box focus
     */
    private setCommentBoxFocus() {

        // set time out is a hack to resolve scroll to a non focused comment box on side view comment .
        setTimeout(() => {
            // If it is a touch device or monitor will not focus the textbox,
            // to prevent virtual keyboard to pop-up
            if (htmlUtilities.isTabletOrMobileDevice === false && this.refs.commentTextBox) {
                (this.props.isCommentBoxReadOnly) ? this.refs.commentTextBox.blur() : this.refs.commentTextBox.focus();
            }
        }, 0);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.SET_MARK_ENTRY_SELECTED, this.setMarkEntryBoxSelected);
    }

    /**
     * This function gets invoked when the component is updated
     */
    public componentDidUpdate() {

        this.setCommentBoxFocus();

        // setting scroll position at the bottom of textarea if the comment is not changing.
        // setting scroll position to zero when it is readonly
        if (this.refs.commentTextBox && !this.isCommentBoxChanging) {
            this.refs.commentTextBox.scrollTop = (this.props.isCommentBoxReadOnly) ? 0 : this.refs.commentTextBox.scrollHeight;
        }
    }

    /**
     * Set mark entybox selected
     */
    private setMarkEntryBoxSelected = (isCommentSelected: boolean): void => {

        // For device selecting the mark entry textbox is disabled
        // for preventing unwanted popup of device keyboard popup.
        if (deviceHelper.isTouchDevice() === true) {
            return;
        }

        // skip selection when comment box is selected
        if (this.refs.commentTextBox && isCommentSelected) {
            (this.props.isCommentBoxReadOnly) ? this.refs.commentTextBox.blur() : this.refs.commentTextBox.focus();
            this.refs.commentTextBox.scrollTop = (this.props.isCommentBoxReadOnly) ? 0 : this.refs.commentTextBox.scrollHeight;
        }
    };

    /**
     * Prevent markscheme text box get selected on click/input
     * @param {Event} event
     */
    private onCommentTextSelected = (event: any) => {
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
    private onRightClick = (event: any) => {

        // Prevent markscheme text box get selected on click/input
        event.stopPropagation();
    };

    /**
     * Will display delete comment confirmation dialog
     */
    private deleteComment = (event: any) => {
        // Prevent event bubbling of parent element.
        event.stopPropagation();
        stampActionCreator.deleteComment(false);
    }

    /**
     * Will switch to Side view for On Page comments
     */
    private toggleCommentSideView(): void {
        let disableSideViewOnDevices: boolean = (this.props.selectedZoomPreference !== enums.ZoomPreference.FitWidth
        && htmlUtilities.isTabletOrMobileDevice);
        stampActionCreator.toggleCommentSideView(true, this.props.clientToken);
        if (disableSideViewOnDevices) {
            stampActionCreator.switchZoomPreference(enums.ZoomPreference.FitWidth);
            onPageCommentHelper.isFitWidth = true;
        }
    }
}
export = CommentBox;