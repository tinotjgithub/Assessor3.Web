/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import stampData = require('../../../../stores/stamp/typings/stampdata');
import StampBase = require('../stampbase');
let classNames = require('classnames');
import toolbarstore = require('../../../../stores/toolbar/toolbarstore');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import enums = require('../../../utility/enums');
import markingStore = require('../../../../stores/marking/markingstore');
import ReactDom = require('react-dom');
import colouredannotationshelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import bookmarkhelper = require('../../../../stores/marking/bookmarkhelper');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import moduleKeyHandler = require('../../../../utility/generic/modulekeyhandler');
import domManager = require('../../../../utility/generic/domhelper');
import localestore = require('../../../../stores/locale/localestore');

interface BookmarkStampProps extends PropsBase, LocaleSelectionBase {
    bookmarkId: string;
    toolTip: string;
    isNewBookmark: boolean;
    clientToken: string;
    renderedOn: number;
    id: string;
    rotatedAngle?: enums.RotateAngle;
}

interface State {
    renderedOn: number;
    isBookmarkNameTextBoxOpen: boolean;
}

/**
 * React component class for Image Stamp.
 */
class BookmarkStamp extends StampBase {

    // Holding mouse click method ref.
    private bookmarkName: string;

    // Holds a value indicating the comment text.
    private bookmarkText: string = '';

    private _boundHandleOnClick: EventListenerObject = null;

    private ignoreOutsideClickOnce: boolean = true;
    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);
        this.state = {
            renderedOn: 0,
            isBookmarkNameTextBoxOpen: this.props.isNewBookmark
        };

        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onEnterCommentSelected = this.onEnterCommentSelected.bind(this);
        this.left = 0;
        this.top = 0;
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        if (this.props.isNewBookmark) {
            stampActionCreator.showOrHideBookmarkNameBox(this.props.isNewBookmark, this.props.toolTip,
                this.props.clientToken, this.props.rotatedAngle);
        }
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        // SVG pointer event style added for IE browser fix where use by default will have mouse pointer events
        // which was showing browser default context menu.
        let svgPointerEventsStyle: React.CSSProperties = {};
        let style: React.CSSProperties = {};
        let wrapperStyle: React.CSSProperties = {};
        let isDisplayingInScript: boolean = false;
        let svgId: string = '';
        let classToApply;

        isDisplayingInScript = this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript;
        // Check if current annotation is dragged then we should hide the annotation
        // so that it will not be dispalyed to the user at the initial position from
        // where it is being dragged
        if (!this.props.isVisible) {
            classToApply = '';
            wrapperStyle.display = 'none';
            style.display = 'none';
            svgPointerEventsStyle.display = 'none';
        } else {
            let isPrevious = this.isPreviousAnnotation;
            wrapperStyle = this.getAnnotationWrapperStyle(this.props.wrapperStyle);
            style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
            style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
            style.pointerEvents = 'none';
            this.top = style.top;
            this.left = style.left;

            svgPointerEventsStyle.pointerEvents = 'none';
            classToApply = classNames(
                { 'book-mark': isDisplayingInScript },
                { 'open': this.state.isOpen === undefined ? false : this.state.isOpen },
                { 'inactive': this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView }
            );
        }

        svgId = isDisplayingInScript ? 'svgScriptStamp' : 'svgStamp';

        //If the stamp is not in the script no need to render the parent span.
        if (!isDisplayingInScript) {
            return this.renderBookmark(svgPointerEventsStyle, style, svgId);
        }

        return (
            <span className={classToApply} style={wrapperStyle}
                id={this.props.id}
                onMouseEnter={this.onMouseEnterHandler}
                onMouseMove={this.onMouseMoveHandler}
                onMouseLeave={this.onMouseLeaveHandler}
                onContextMenu={this.onContextMenu}
                onClick={this.onEnterCommentSelected}
                onDoubleClick={this.onEnterCommentSelected}
                data-token={this.props.clientToken}>
                {this.renderBookmark(svgPointerEventsStyle, style, svgId)}
            </span>
        );
    }

    /**
     * Render the Bookmark.
     * @param svgPointerEventsStyle
     * @param style
     * @param svgId
     */
    private renderBookmark(svgPointerEventsStyle: React.CSSProperties, style: React.CSSProperties = {}, svgId: string) {
        return (
            <span id={this.props.bookmarkId} className='book-m-ico' title={this.props.toolTip}>
                <span className='svg-icon' data-token={this.props.clientToken}>
                    <svg viewBox='0 0 24 40' className='select-bm-icon' style={style} role='img'>
                        <title>{this.props.toolTip}</title>
                        <use style={svgPointerEventsStyle} xlinkHref='#select-bm-icon'></use>
                    </svg>
                </span>
            </span>
        );
    }
}

export = BookmarkStamp;