/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import stampStore = require('../../../../stores/stamp/stampstore');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
import responseStore = require('../../../../stores/response/responsestore');
import ImageStamp = require('../../annotations/static/imagestamp');
import DynamicStamp = require('../../toolbar/stamppanel/stamptype/dynamicstamp');
import TextStamp = require('../../annotations/static/textstamp');
import ToolsStamp = require('../../annotations/static/toolsstamp');
import enums = require('../../../utility/enums');
import stampData = require('../../../../stores/stamp/typings/stampdata');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import messageStore = require('../../../../stores/message/messagestore');
import exceptionStore = require('../../../../stores/exception/exceptionstore');
import BookmarkStamp = require('../../annotations/bookmarks/bookmarkstamp');
import markingStore = require('../../../../stores/marking/markingstore');
import qigStore = require('../../../../stores/qigselector/qigstore');
import constants = require('../../../utility/constants');
let classNames = require('classnames');

interface Props extends PropsBase, LocaleSelectionBase {
    cursorType: enums.CursorType;
    renderedOn: number;
}

interface State {
    renderedOn: number;
}

/**
 * React component class for stamp cursor.
 */
class StampCursor extends pureRenderComponent<Props, State> {

    // private isAddNewBookmarkSelected: boolean = false;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0
        };
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        responseStore.instance.addListener(responseStore.ResponseStore.MOUSE_POSITION_UPDATED_EVENT, this.onMousePositionUpdated);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PAN, this.onStampPanStart);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_END, this.onStampPanEnd);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT, this.reRender);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.reRender);
		toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_CANCEL, this.onStampPanEnd);
		toolbarStore.instance.addListener(toolbarStore.ToolbarStore.DE_SELECT_ANNOTATION_EVENT, this.reRender);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.MOUSE_POSITION_UPDATED_EVENT, this.onMousePositionUpdated);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PAN, this.onStampPanStart);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.onStampPanEnd);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT, this.reRender);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.reRender);
		toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_CANCEL, this.onStampPanEnd);
		toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.DE_SELECT_ANNOTATION_EVENT, this.reRender);
    }

    /**
     * Render component
     * @returns
     */
	public render(): JSX.Element {

        // If it is tablet/mobile devices,no need to render the cursor for stamp action.
        if (this.props.cursorType === enums.CursorType.Select) {
            if (htmlUtilities.isTabletOrMobileDevice
                || toolbarStore.instance.panStampId !== 0) {
                return null;
            }
        }

        if (responseStore.instance.selectedResponseMode === enums.ResponseMode.closed) {
            return null;
        }

        let cursorDivStyle = this.getCursorDivStyle();

        let cursorStyle = this.getCursorStyle();

        let stampId = this.getStampId();

        let style: any;
        if (toolbarStore.instance.isBookMarkSelected && this.props.cursorType !== enums.CursorType.Pan) {
            style = { 'width': constants.BOOKMARK_SVG_STYLE};
        }


        return (
            <div
                id={this.props.cursorType === enums.CursorType.Pan ? 'dragCursor' : 'cursor'}
                className={this.getCursorClass() }>
                <div className={cursorStyle} style={style}>
                        {(toolbarStore.instance.isBookMarkSelected && this.props.cursorType !== enums.CursorType.Pan) ?
                            this.renderBookmark(cursorDivStyle) :
                            this.renderStamp(stampStore.instance.getStamp(stampId), cursorDivStyle) }
                        </div>
                </div>
        );
    }

    /**
     * gets the class name for the cursor
     */
    private getCursorClass() {
        return (this.props.cursorType === enums.CursorType.Pan ? 'drag-cursor-holder' : 'stamp-cursor-holder') +
            ' cursor-holder ' + this.getAnnotationClass();
    }

    /**
     * gets the glassname for the cursor
     */
    private renderBookmark(cursorDivStyle: React.CSSProperties) {
        if (this.props.cursorType === enums.CursorType.Pan) {
            return null;
        } else {
            return (
                <BookmarkStamp id={'select-bm-icon'}
                    key={'select-bm-icon'}
                    isDisplayingInScript={false}
                    isNewBookmark={false}
                    selectedLanguage={this.props.selectedLanguage}
                    leftPos={cursorDivStyle.left}
                    topPos={cursorDivStyle.top}
                    isVisible={true} />
            );
        }
    }

    /**
     * Create stamp based on the stamp data
     * @param groupIndex
     */
    private renderStamp(stampData: stampData, cursorDivStyle: React.CSSProperties) {

        if (stampData != null && stampData !== undefined) {

            switch (stampData.stampType) {
                case enums.StampType.image:
                    return (
                        <ImageStamp id={stampData.name + '-icon'}
                            toolTip={stampData.displayName}
                            key={stampData.name + '-icon'}
                            stampData = {stampData}
                            isDisplayingInScript = {false}
                            selectedLanguage = {this.props.selectedLanguage}
                            leftPos = {cursorDivStyle.left}
                            topPos = {cursorDivStyle.top}
                            isVisible = { true }/>
                    );
                case enums.StampType.dynamic:
                    return (
                        <DynamicStamp id={stampData.name + '-icon'}
                            toolTip={stampData.displayName}
                            key={stampData.name + '-icon'}
                            stampData = {stampData}
                            isDisplayingInScript = {false}
                            selectedLanguage = {this.props.selectedLanguage}
                            leftPos = {cursorDivStyle.left}
                            topPos = {cursorDivStyle.top}
                            isVisible = { true } />
                    );
                case enums.StampType.text:
                    return (
                        <TextStamp id={stampData.name + '-icon'}
                            toolTip={stampData.displayName}
                            key={stampData.name + '-icon'}
                            stampData = {stampData}
                            isDisplayingInScript = {false}
                            selectedLanguage = {this.props.selectedLanguage}
                            leftPos = {cursorDivStyle.left}
                            topPos = {cursorDivStyle.top}
                            isVisible = {true} />
                    );
                case enums.StampType.tools:
                    return (
                        <ToolsStamp id={stampData.name + '-icon'}
                            toolTip={stampData.displayName}
                            key={stampData.name + '-icon'}
                            stampData = {stampData}
                            isDisplayingInScript = {false}
                            selectedLanguage = {this.props.selectedLanguage}
                            leftPos = {cursorDivStyle.left}
                            topPos = {cursorDivStyle.top}
                            isVisible = {true} />
                    );
            }
        }

        return null;
    }

    /**
     * getCursorDivStyle
     */
    private getCursorDivStyle(): any {
        let mousePosition = responseStore.instance.mousePosition;

        return {
            'top': mousePosition.yPosition,
            'left': mousePosition.xPosition
        };
    }

    /**
     * Returns the cursor style corresponding to the action invoked.
     */
    private getCursorStyle(): string {
        return this.props.cursorType === enums.CursorType.Pan ? 'cursor-drag' : 'cursor';
    }

    /**
     * Returns the stamp id corresponding to the action invoked.
     */
    private getStampId(): number {
        return this.props.cursorType === enums.CursorType.Pan ? toolbarStore.instance.panStampId
            : toolbarStore.instance.selectedStampId;
    }

    /**
     * returns true if message or exception panel is in open state
     */
    private get isMessageOrExceptionPanelOpen(): boolean {
        return messageStore.instance.isMessagePanelVisible ||
            exceptionStore.instance.isExceptionPanelVisible;
    }

    /**
     * getAnnotationClass
     */
    private getAnnotationClass(): string {
        if (qigStore.instance.isAcetateMoving ||
            (responseStore.instance.mousePosition.xPosition <= 0 && responseStore.instance.mousePosition.yPosition <= 0)) {
            return '';
        } else if (this.props.cursorType === enums.CursorType.Pan
            && toolbarStore.instance.panStampId !== 0) {

            return classNames(
                { 'annotating': !this.isMessageOrExceptionPanelOpen },
                {
                    'dragging':
                    (toolbarStore.instance.draggedAnnotationClientToken !== undefined ? true : false)
                });

		} else if (this.props.cursorType === enums.CursorType.Select
            && toolbarStore.instance.selectedStampId !== 0
			&& !toolbarStore.instance.isBookMarkSelected) {
            let stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
            if (stamp.stampType === enums.StampType.dynamic &&
                stamp.stampId !== enums.DynamicAnnotation.OnPageComment) {
                return this.isMessageOrExceptionPanelOpen ? '' : 'annotating dynamic';
			} else {
                return this.isMessageOrExceptionPanelOpen ? '' : 'annotating hover';
            }
		} else if (toolbarStore.instance.isBookMarkSelected) {
            return this.props.cursorType === enums.CursorType.Select ? 'annotating hover' : '';
        }
    }

    private onMousePositionUpdated = (): void => {

        if ((
            (   // annotation dragged from stamp panel
                this.props.cursorType === enums.CursorType.Pan
                && toolbarStore.instance.panStampId === 0
            )
            ||
            (   // annotation selected from stamp panel
                this.props.cursorType === enums.CursorType.Select
                && (
                    toolbarStore.instance.selectedStampId === 0
                    || toolbarStore.instance.panStampId !== 0
                )
            )
        ) && !toolbarStore.instance.isBookMarkSelected) {
            // No need to set state in these scenarios.
            return;
        }

        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Invoked on starting the stamp pan
     */
    private onStampPanStart = (): void => {
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Invoked on ending the stamp pan
     */
    private onStampPanEnd = (): void => {
        if (this.props.cursorType === enums.CursorType.Pan) {
            this.setState({ renderedOn: Date.now() + 100 });
        } else {
            this.setState({ renderedOn: Date.now() });
        }
    };

    /*
     * Called when a bookmark is placed on the script
     */
    private reRender  = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };
}

export = StampCursor;