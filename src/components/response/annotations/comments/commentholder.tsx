import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import CommentBox = require('./commentbox');
import stampStore = require('../../../../stores/stamp/stampstore');
import markingStore = require('../../../../stores/marking/markingstore');
import responseStore = require('../../../../stores/response/responsestore');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import annotation = require('../../../../stores/response/typings/annotation');
let classNames = require('classnames');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import constants = require('../../../utility/constants');
import enums = require('../../../utility/enums');
import eventManagerBase = require('../../../base/eventmanager/eventmanagerbase');
import eventTypes = require('../../../base/eventmanager/eventtypes');
import exceptionStore = require('../../../../stores/exception/exceptionstore');
import userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
import onPageCommentHelper = require('../../../utility/annotation/onpagecommenthelper');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import CommentLine = require('./commentline');
import userInfoStore = require('../../../../stores/userinfo/userinfostore');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
const GREYGAP_FRACTION = 0.03;

/**
 * Properties of Comment box spacer component.
 * @param {Props} props
 */
interface CommentBoxSpacerProps extends LocaleSelectionBase, PropsBase {
    commentBoxTopHeight: number;
    currentBoxHeight: number;
    annotationTop: number;
    overlayHeight: number;
    overlayWidth: number;
    selectedZoomPreference?: enums.ZoomPreference;
    renderedOn: number;
    annotationWidth: number;
    displayAngle: number;
    boxHolderCount: number;
}

/* tslint:disable:variable-name  */
/** Component for comment Spacer - Gap between the boxes to maintain the boxes vertical to comment annotation */
const CommentBoxSpacer: React.StatelessComponent<CommentBoxSpacerProps> = (props: CommentBoxSpacerProps) => {
    let paddingTopStyle: string;
    let aspectRatio: number = props.overlayHeight / props.overlayWidth;
    switch (props.selectedZoomPreference) {
        case enums.ZoomPreference.FitWidth:
            paddingTopStyle = '(100% - ' + constants.SIDE_VIEW_COMMENT_PANEL_WIDTH + 'px)';
            break;
        case enums.ZoomPreference.FitHeight:
        case enums.ZoomPreference.Percentage:
        case enums.ZoomPreference.MarkschemePercentage:
            paddingTopStyle = '(' + props.overlayWidth + 'px)';
            break;
    }
    let spacerStyle: React.CSSProperties = null;
    let styleStr: string = '';
    var scope;
    let annotationTopInPixels = props.annotationTop * props.overlayHeight;
    let ratio = (annotationTopInPixels) / props.overlayWidth;

    if (props.currentBoxHeight !== undefined && props.commentBoxTopHeight !== undefined && props.annotationWidth !== undefined) {

        let annotationWidth: string = '0px';
        // Add half of annotation size to spacer for the first box only
        if (props.boxHolderCount === 1) {
            //reduce half of the annotation size from spacer if rotated in 180 or 270
            if (props.displayAngle === 180 || props.displayAngle === 270) {
                annotationWidth = (props.annotationWidth * -1).toString() + 'px / 2';
            } else {
                annotationWidth = props.annotationWidth.toString() + 'px / 2';
            }
        }

        styleStr = ratio.toString() + ' * ' + paddingTopStyle + ' + ' + annotationWidth + ' - '
            + (props.commentBoxTopHeight).toString()
            + 'px - (' + props.currentBoxHeight.toString() + 'px / 2)';
        spacerStyle = { paddingTop: 'calc(' + styleStr + ')' };
    }
    return (<div className='comment-box-spacer' id={props.id} key={props.id} style={spacerStyle}></div>);
};
/* tslint:enable:variable-name */

/**
 * Properties of Comment box holder component.
 * @param {Props} props
 */
interface CommentBoxProps extends LocaleSelectionBase, PropsBase {
    isCommentBoxReadOnly: boolean;
    isCommentBoxInActive: boolean;
    isOpen: boolean;
    lineX1: number;
    lineX2: number;
    lineY1: number;
    lineY2: number;
    comment: string;
    commentColor: string;
    clientToken: string;
    markSchemeText: string;
    commentBoxTop: number;
    commentBoxLeft: number;
    naturalImageWidth: number;
    naturalImageHeight: number;
    commentBoxTopHeight?: number;
    currentBoxHeight?: number;
    enableCommentsSideView: boolean;
    annotationTop: number;
    overlayHeight: number;
    overlayWidth: number;
    enableCommentBox: boolean;
    selectedZoomPreference?: enums.ZoomPreference;
    marksheetHolderLeft: number;
    annotationLeftPx?: number;
    annotationWidth?: number;
    renderedOn?: number;
    boxRenderedOn?: number;
    displayAngle: number;
    boxHolderCount?: number;
}

/* tslint:disable:variable-name  */
/** Component for comment box holder */
const CommentBoxHolder: React.StatelessComponent<CommentBoxProps> = (props: CommentBoxProps) => (
    <div className={classNames('comment-box-holder', {
        'read-only-comment': props.isCommentBoxReadOnly
    },
        {
            'open ': (props.isOpen === true && props.enableCommentsSideView === false) ||
            (props.enableCommentsSideView === true &&
                stampStore.instance.SelectedSideViewCommentToken === props.clientToken &&
                props.enableCommentBox)
        },
        { 'inactive': props.isCommentBoxInActive })}
        id={'commentBox_' + props.id + '_' + props.clientToken} aria-hidden='true' style={{ color: props.commentColor }}
        data-client={props.clientToken}>
        <CommentBoxSpacer id={'commentSpacer_' + props.id} key={'commentSpacer_' + props.id}
            commentBoxTopHeight={props.commentBoxTopHeight}
            currentBoxHeight={props.currentBoxHeight}
            annotationTop={props.annotationTop}
            overlayHeight={props.overlayHeight}
            overlayWidth={props.overlayWidth}
            selectedZoomPreference={props.selectedZoomPreference}
            renderedOn={props.renderedOn}
            annotationWidth={props.annotationWidth}
            displayAngle={props.displayAngle}
            boxHolderCount={props.boxHolderCount}
        />
        <CommentLine lineX1={props.lineX1 ? props.lineX1 : 0} lineX2={props.lineX2 ? props.lineX2 : 0}
            lineY1={props.lineY1 ? props.lineY1 : 0} lineY2={props.lineY2 ? props.lineY2 : 0}
            key={'commentLine_' + props.id} id={'commentLine_' + props.id}
            rgbColor={props.commentColor}
            enableCommentsSideView={props.enableCommentsSideView}
            clientToken={props.clientToken}
            overlayHeight={props.overlayHeight}
            overlayWidth={props.overlayWidth}
            selectedZoomPreference={props.selectedZoomPreference}
            marksheetHolderLeft={props.marksheetHolderLeft}
            annotationLeftPx={props.annotationLeftPx}
            annotationWidth={props.annotationWidth}
            renderedOn={props.boxRenderedOn}
            displayAngle={props.displayAngle}
        />
        <CommentBox comment={props.comment}
            markSchemeText={props.markSchemeText}
            topPosition={props.commentBoxTop}
            leftPosition={props.commentBoxLeft}
            rgbColor={props.commentColor}
            selectedLanguage={props.selectedLanguage}
            key={'commentBox_' + props.id} id={'commentBox_' + props.id}
            clientToken={props.clientToken}
            isCommentBoxReadOnly={props.isCommentBoxReadOnly}
            isCommentBoxInActive={props.isCommentBoxInActive}
            naturalImageWidth={props.naturalImageWidth}
            naturalImageHeight={props.naturalImageHeight}
            enableCommentsSideView={props.enableCommentsSideView}
            renderedOn={props.boxRenderedOn}
            enableCommentBox={props.enableCommentBox}
            selectedZoomPreference={props.selectedZoomPreference}
        />
    </div>);
/* tslint:enable:variable-name */


/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    clientToken: string;
    wrapperStyle: any;
    isCommentBoxReadOnly: boolean;
    isCommentBoxInActive: boolean;
    isOpen: boolean;
    lineX1: number;
    lineX2: number;
    lineY1: number;
    lineY2: number;
    comment: string;
    markSchemeText: string;
    commentBoxTop: number;
    commentBoxLeft: number;
    renderedOn: number;
    naturalImageWidth: number;
    naturalImageHeight: number;
    lineMaskX: number;
    lineMaskY: number;
    enableCommentsSideView: boolean;
    imageClusterId: number;
    outputPageNo: number;
    pageNo: number;
    windowsWidth: number;
    overlayWidth: number;
    overlayHeight: number;
    commentColor: string;
    enableCommentBox: boolean;
    isAnnotationMoving: boolean;
    holderCount: number;
    selectedZoomPreference?: enums.ZoomPreference;
    marksheetHolderLeft: number;
    boxRenderedOn: number;
    displayAngle: number;
    hideCommentBoxes: boolean;
}

interface State {
    isOpen: boolean;
    renderedOn: number;
    minHeight: number;
}

class CommentHolder extends pureRenderComponent<Props, State> {

    private commentBoxTopHeight: number;
    private currentBoxHeight: number;
    private spacerSetCount: number = 0;
    private commentColor: string;
    private pageNo: number;

    /** refs */
    public refs: {
        [key: string]: (Element);
        commentHolder: (HTMLElement);
    };

    /**
     * constructor for CommentHolder
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.commentBoxTopHeight = 0;
        this.spacerSetCount = 0;
        this.state = {
            isOpen: false,
            renderedOn: Date.now(),
            minHeight: 0
        };
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let commentBoxHolderEl: JSX.Element = null;
        let commentBoxHoldersSideView: any = null;
        if (this.props.enableCommentsSideView === false) {
            this.commentColor = colouredAnnotationsHelper.createAnnotationStyle(null, enums.DynamicAnnotation.OnPageComment).fill;
            commentBoxHolderEl = (<CommentBoxHolder comment={this.props.comment}
                markSchemeText={this.props.markSchemeText}
                commentBoxTop={this.props.commentBoxTop}
                commentBoxLeft={this.props.commentBoxLeft}
                commentColor={this.props.commentColor}
                selectedLanguage={this.props.selectedLanguage}
                key={this.props.id} id={this.props.id}
                clientToken={this.props.clientToken}
                isCommentBoxReadOnly={this.props.isCommentBoxReadOnly}
                isCommentBoxInActive={this.props.isCommentBoxInActive}
                naturalImageWidth={this.props.naturalImageWidth}
                naturalImageHeight={this.props.naturalImageHeight}
                isOpen={this.props.isOpen}
                lineX1={this.props.lineX1}
                lineX2={this.props.lineX2}
                lineY1={this.props.lineY1}
                lineY2={this.props.lineY2}
                enableCommentsSideView={this.props.enableCommentsSideView}
                annotationTop={0}
                commentBoxTopHeight={0}
                currentBoxHeight={0}
                overlayHeight={0}
                overlayWidth={0}
                enableCommentBox={this.props.enableCommentBox}
                marksheetHolderLeft={this.props.marksheetHolderLeft}
                renderedOn={Date.now()}
                boxRenderedOn={this.props.boxRenderedOn}
                displayAngle={this.props.displayAngle}
                selectedZoomPreference={this.props.selectedZoomPreference}
            />);

            return (<div className='comment-holder' ref={'commentHolder'}>
                <div className='comment-wrapper' style={this.props.wrapperStyle} >
                    <div className='side-view-wrapper' >
                        {this.commentLineMaskElement()}
                        {commentBoxHolderEl}
                        {commentBoxHoldersSideView}
                    </div>
                </div>
            </div>
            );

        } else {
            if (!this.props.hideCommentBoxes) {
                var commentBoxTopHeight: number = 0;
                var boxHolderCount: number = 0;
                commentBoxHoldersSideView = this.sortedListBasedOnRotation().map((x: OnPageCommentSideViewItem) => {
                    boxHolderCount++;
                    this.pageNo = x.pageNo;
                    let markSchemeText: string = markingStore.instance.toolTip(x.markSchemeId);
                    let isPreviousAnnotation: boolean = x.annotation.isPrevious;
                    let uniqueId = markingStore.instance.currentQuestionItemInfo ?
                        markingStore.instance.currentQuestionItemInfo.uniqueId : 0;
                    let isInActive: boolean = !(x.annotation.markSchemeId === uniqueId);
                    let isReadonly: boolean = isPreviousAnnotation || isInActive
                        || markingStore.instance.currentResponseMode === enums.ResponseMode.closed
                        || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement
                        || ((standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                            === enums.StandardisationSetup.ClassifiedResponse ||
                            standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                            === enums.StandardisationSetup.UnClassifiedResponse ||
                            standardisationSetupStore.instance.selectedStandardisationSetupWorkList ===
                            enums.StandardisationSetup.ProvisionalResponse) &&
                                !markerOperationModeFactory.operationMode.isResponseEditable);
                    this.commentColor =
                        colouredAnnotationsHelper.createAnnotationStyle(x.annotation, enums.DynamicAnnotation.OnPageComment).fill;

                    let currentBoxHeight: number = stampStore.instance.SelectedSideViewCommentToken === x.clientToken ?
                        constants.COMMENT_BOX_EXPANDED_HEIGHT : constants.COMMENT_BOX_COLLAPSED_HEIGHT;

                    let overlayWidth = this.props.overlayWidth;
                    let overlayHeight = this.props.overlayHeight;
                    let annotationSize: number = (x.annotationWidth / 100) * (overlayWidth);
                    //Annotation size should be calculated when rotated in 90 or 270 uusing the overlayHeight
                    if (this.props.displayAngle === 90 || this.props.displayAngle === 270) {
                        annotationSize = (x.annotationWidth / 100) * (overlayHeight);
                    }

                    let [annotationLeftPercent, annotationTopPercent] = this.getAnnotationLeftTopBasedOnRotation
                        (x.annotationLeftPx, x.annotationTopPx, annotationSize, overlayWidth, overlayHeight);

                    let lineX1 = annotationLeftPercent;
                    let lineY1 = annotationTopPercent;

                    let lineX2 = 102; // adjust the line end to touch the box - add a 2%

                    // logic to compare the annotation position allows box to be displayed straight
                    let annotationTopInPixels: number = (annotationTopPercent / 100) * overlayHeight;

                    let previousCommentBoxHeight = commentBoxTopHeight +
                        (this.props.holderCount === 1 && boxHolderCount === 1 ?
                            constants.HIDE_COMMENTS_PANEL_HEIGHT : 0);

                    /**
                     * scenarios where the comment box can come vertically straight to the comment annotation
                     * or to display below because there are other adjacent boxes or hide comments panel.
                     */
                    if ((annotationTopInPixels - (currentBoxHeight / 2)) > commentBoxTopHeight) {
                        // This condition is when the comment box can be displayed vertically straight to annotation.
                        /**
                         *       	,-------.
                         *          |Comment|
                         *  --------|-------|
                         *          `-------'
                         */
                        commentBoxTopHeight = annotationTopInPixels + (currentBoxHeight / 2);
                    } else {
                        // comment box displays below the annotation vertical position
                        /**
                         *
                         *    \  	,-------.
                         *      \   |Comment|
                         *        \ |-------|
                         *          `-------'
                         */
                        commentBoxTopHeight += currentBoxHeight +
                            (this.props.holderCount === 1 && boxHolderCount === 1 ?
                                constants.HIDE_COMMENTS_PANEL_HEIGHT : 0);
                    }

                    let annotationSizeToAdd: number = 0;
                    annotationSizeToAdd = ((this.props.displayAngle >= 180) ? ((annotationSize / 2) * -1) : (annotationSize / 2));
                    let lineY2 = commentBoxTopHeight - (currentBoxHeight / 2) + annotationSizeToAdd;

                    return (<CommentBoxHolder comment={x.comment}
                        markSchemeText={markSchemeText}
                        commentBoxTop={this.props.commentBoxTop ? this.props.commentBoxTop : 0}
                        commentBoxLeft={this.props.commentBoxLeft ? this.props.commentBoxLeft : 0}
                        commentColor={this.commentColor}
                        selectedLanguage={this.props.selectedLanguage}
                        key={'boxHolder_' + this.props.id + boxHolderCount}
                        id={'boxHolder_' + this.props.id + boxHolderCount}
                        clientToken={x.clientToken}
                        isCommentBoxReadOnly={isReadonly}
                        isCommentBoxInActive={isInActive}
                        naturalImageWidth={this.props.naturalImageWidth}
                        naturalImageHeight={this.props.naturalImageHeight}
                        isOpen={false}
                        lineX1={lineX1}
                        lineX2={lineX2}
                        lineY1={lineY1}
                        lineY2={lineY2}
                        currentBoxHeight={currentBoxHeight}
                        commentBoxTopHeight={previousCommentBoxHeight}
                        enableCommentsSideView={this.props.enableCommentsSideView}
                        annotationTop={annotationTopPercent / 100}
                        overlayHeight={overlayHeight}
                        overlayWidth={overlayWidth}
                        enableCommentBox={this.props.enableCommentBox}
                        selectedZoomPreference={this.props.selectedZoomPreference}
                        marksheetHolderLeft={this.props.marksheetHolderLeft}
                        annotationLeftPx={annotationLeftPercent / 100}
                        annotationWidth={annotationSize}
                        renderedOn={this.props.renderedOn}
                        // checking for commentMoveInSideView since the renderedOn was not updating when
                        // moving the comment between pages in side view
                        boxRenderedOn={Date.now()}
                        displayAngle={this.props.displayAngle}
                        boxHolderCount={boxHolderCount}
                    />);
                });
            } else {
                commentBoxHoldersSideView = null;
            }

            var holderStyle: React.CSSProperties;
            // setting min height to expand the grey area in comment side view
            holderStyle = { minHeight: this.state.minHeight };

            return (<div className='comment-holder' ref={'commentHolder'} style={holderStyle}>
                <div className='comment-wrapper' style={this.props.wrapperStyle} >
                    <div className='side-view-wrapper' >
                        <svg className='comment-mask' >
                        </svg>
                        {commentBoxHolderEl}
                        {commentBoxHoldersSideView}
                    </div>
                </div>
            </div>
            );
        }
    }

    /**
     * This function gets invoked after the component is re-rendered
     */
    public componentDidUpdate() {
        if (this.props.enableCommentsSideView) {
            let boxHolderCounter: number = 0;
            let commentHolder: HTMLElement = Reactdom.findDOMNode(this.refs.commentHolder) as HTMLElement;
            let currentBoxHolders: any;
            let commentBoxTopHeight: number = 0;
            let minHeight: number = 0;
            if (commentHolder) {
                currentBoxHolders = commentHolder.getElementsByClassName('comment-box-holder');
                let currentBoxHoldersCount: number = currentBoxHolders.length;
                if (currentBoxHoldersCount === 0) {
                    this.resetMinHeightForPage();
                }
                let elem: any;
                for (let i = 0; i < currentBoxHoldersCount; i++) {
                    elem = currentBoxHolders[i];
                    boxHolderCounter++;
                    if (boxHolderCounter === currentBoxHoldersCount) {
                        /* the min height calculations to  set the grey gap b/w responses if there are more comments */
                        minHeight = commentBoxTopHeight + elem.offsetHeight;
                        minHeight = minHeight +  +
                            (this.props.holderCount === 1 ?
                            constants.HIDE_COMMENTS_PANEL_HEIGHT : (minHeight * GREYGAP_FRACTION));

                        let _pageNo = ((this.props.outputPageNo && this.props.outputPageNo !== 0) ?
                            this.props.outputPageNo : this.props.pageNo);

                        stampActionCreator.setCommentHolderRendered(_pageNo, minHeight);
                    }
                    // setting the height for using in the next comment box holder
                    commentBoxTopHeight = commentBoxTopHeight + elem.offsetHeight -
                        (this.props.holderCount === 1 && boxHolderCounter === 1 ?
                            constants.HIDE_COMMENTS_PANEL_HEIGHT : 0);
                }
                this.setState({minHeight: minHeight});
            }
        }
    }

    /**
     * resets the minheight for comment holder and the marksheet
     */
    private resetMinHeightForPage(): void {
        let _pageNo = ((this.props.outputPageNo && this.props.outputPageNo !== 0) ?
            this.props.outputPageNo : this.props.pageNo);
        stampActionCreator.setCommentHolderRendered(_pageNo, 0);
        this.setState({minHeight: 0});
    }

    /**
     * returns the commentline mask svg element, for edge this will leads to application reload issue and not using the savg mask
     */
    private commentLineMaskElement = (): JSX.Element => {
        if (htmlUtilities.isEdge) {
            return null;
        } else {
            return (<svg className='comment-mask' >
                <defs>
                    <g id='hide-area' >
                        <svg viewBox='0 0 10 10' className='mask-svg' preserveAspectRatio='xMinYMin meet'
                            width='4%' height='10000'
                            x={this.props.lineMaskX + '%'}
                            y={this.props.lineMaskY + '%'} >
                            <rect x='0' y='0' width='100%' height='100%' fill='black' > </rect>
                        </svg>
                    </g>
                </defs>
                <mask id='comment-line-mask' >
                    <rect className='mask-reveal' x='-58' y='-60' width={window.innerWidth}
                        height={window.innerHeight} fill='white' > </rect>
                    <use xlinkHref='#hide-area' > </use>
                </mask>
            </svg>);
        }
    }
    /**
     * returns the sorted side view comment data based on the rotate angle
     */
    private sortedListBasedOnRotation(): Array<OnPageCommentSideViewItem> {
        let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? annotationHelper.showDefMarkAndAnnotation() : false;

        let filteredListForPage: Array<OnPageCommentSideViewItem> = onPageCommentHelper.onPageCommentsSideView.filter
            ((x : OnPageCommentSideViewItem) =>
                x.outputPageNo === this.props.outputPageNo &&
                    x.pageNo === this.props.pageNo &&
                    x.isVisible === true &&
                    (isSelectedTabEligibleForDefMarks ? x.isDefinitive === showDefAnnotationsOnly : true)
            );
        // sorting the sideview list based on the position , related to the rotate angle.
        let sortedList: Array<OnPageCommentSideViewItem> = filteredListForPage.sort
        ((a: OnPageCommentSideViewItem, b: OnPageCommentSideViewItem) => {
            if (this.props.displayAngle === 180) {
                return ((b.annotationTopPx - a.annotationTopPx) === 0 ?
                    (b.annotationLeftPx - a.annotationLeftPx) : (b.annotationTopPx - a.annotationTopPx));
            }
            if (this.props.displayAngle === 90) {
                return ((a.annotationLeftPx - b.annotationLeftPx === 0) ?
                    (b.annotationTopPx - a.annotationTopPx) : (a.annotationLeftPx - b.annotationLeftPx));
            }
            if (this.props.displayAngle === 270) {
                return ((b.annotationLeftPx - a.annotationLeftPx) === 0 ?
                    (a.annotationTopPx - b.annotationTopPx) : (b.annotationLeftPx - a.annotationLeftPx));
            }
            return ((a.annotationTopPx - b.annotationTopPx) === 0 ?
                (a.annotationLeftPx - b.annotationLeftPx) : (a.annotationTopPx - b.annotationTopPx));
        });

        return sortedList;
    }

/**
 * gets the annotation left and top values based on rotation
 * @param annotationLeftPx
 * @param annotationTopPx
 * @param annotationSize
 * @param overlayWidth
 * @param overlayHeight
 */
    private getAnnotationLeftTopBasedOnRotation(annotationLeftPx: number, annotationTopPx: number,
    annotationSize: number, overlayWidth: number, overlayHeight: number): [number, number] {
        let _annotationLeft: number = annotationLeftPx;
        let _annotationTop: number = annotationTopPx;
        switch (this.props.displayAngle) {
            case 90:
                _annotationLeft = 1 - annotationTopPx;
                _annotationTop = annotationLeftPx;
                break;
            case 180:
                _annotationLeft = 1 - annotationLeftPx;
                _annotationTop = 1 - annotationTopPx;
                break;
            case 270:
                _annotationLeft = annotationTopPx;
                _annotationLeft = _annotationLeft;
                _annotationTop = 1 - annotationLeftPx;
                _annotationTop = _annotationTop;
                break;
        }

        return [_annotationLeft * 100, _annotationTop * 100];
    }
}
export = CommentHolder;