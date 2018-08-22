/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import responseStore = require('../../../stores/response/responsestore');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import enums = require('../../utility/enums');
import AnnotationOverlay = require('./annotationoverlay');
import $ = require('jquery');
import PageOptions = require('./pageoptions');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import markingStore = require('../../../stores/marking/markingstore');
import scriptStore = require('../../../stores/script/scriptstore');
import SuppressedPage = require('./suppressedpage');
let classNames = require('classnames');
import AnnotatedMessageHolder = require('../annotatedmessageholder');
import worklistStore = require('../../../stores/worklist/workliststore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import exceptionHelper = require('../../utility/exception/exceptionhelper');
import constants = require('../../utility/constants');
import scriptHelper = require('../../../utility/script/scripthelper');
import LinkIcon = require('./linktopage/linkicon');
import pageLinkHelper = require('./linktopage/pagelinkhelper');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
import annotation = require('../../../stores/response/typings/annotation');
import onPageCommentHelper = require('../../utility/annotation/onpagecommenthelper');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import eCourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import eCourseworkResponseActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');
import courseWorkFile = require('../../../stores/response/digital/typings/courseworkfile');
import LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
import messageStore = require('../../../stores/message/messagestore');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

interface Props extends PropsBase, LocaleSelectionBase {
    fileMetadataList: Immutable.List<FileMetadata>;
    onImageLoaded: Function;
    fullResponseOption?: enums.FullResponeViewOption;
    onFullResponseViewOptionChanged: Function;
    switchViewCallback: Function;
    componentType: enums.MarkingMethod;
    isDrawStart: boolean;
    panEndData: any;
    lastMarkSchemeId: number;
    isShowAnnotatedPagesOptionSelected: boolean;
    isShowAllPagesOfScriptOptionSelected: boolean;
    onLinkToButtonClick: Function;
    isLinkToPagePopupShowing?: boolean;
    hasUnmanagedSLAO: boolean;
    unManagedSLAOFlagAsSeenClick: Function;
    allSLAOManaged: Function;
    linkedPagesByPreviousMarkers: number[];
    isECourseworkComponent: boolean;
    displayAnnotations: boolean;
    isShowUnAnnotatedAdditionalPagesOptionSelected: boolean;
    hasElementsToRenderInFRViewMode: Function;
    setScrollTopAfterAllImagesLoaded: boolean;
    isEbookmarking: boolean;
    hasUnmanagedImageZones: boolean;
    unKnownContentFlagAsSeenClick: Function;
    allUnknownContentManaged?: Function;
    hasUnmanagedImageZoneInRemark?: boolean;
    isStandardisationsetupmode?: boolean;
}

interface State {
    renderedOn: number;
    idOfMarksheetClicked: number;
    isMarkSheetHolderHovered: boolean;
    hoveredPageNo: number;
}

/**
 * React component class for FullResponseImageViewer
 */
class FullResponseImageViewer extends pureRenderComponent<Props, any> {

    private imagesLoaded: number = 0;

    // Get the total image count, exclude the suppressed url and the list contain converted images.
    private totalImageCount: number = this.props.fileMetadataList.filter(((x: FileMetadata) =>
        x.isSuppressed === false && x.isConvertible === true)).count();

    private imageWidths: ImageDetails[] = [];
    private pageNumbers: Array<Number>;
    private scriptHelper: scriptHelper;
    private isStructuredComponent: boolean;
    private flagAsSeenInLastSLAO: boolean = false;
    private treeViewHelper: treeViewDataHelper;
    private _lastMarkSchemeID: number;
    private _pageNumber: number;
    private doSetScroll: boolean = false;
    private marksheetHolder: HTMLDivElement;
    private pageOptionElement: HTMLDivElement;
    private optionButtonWrapperElement: HTMLDivElement;
    private marksheetcontainerElement: HTMLDivElement;
    private pageIds = [];
    private numberOfImagesToRender: number;
    private isComponenetMounted: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.scriptHelper = new scriptHelper();
        this.treeViewHelper = new treeViewDataHelper();
        let treeItem = this.treeViewHelper.treeViewItem();
        this.state = {
            renderedOn: 0,
            idOfMarksheetClicked: -1,
            isMarkSheetHolderHovered: false,
            hoveredPageNo: -1
        };
        this.buttonWrapperPositionUpdate = this.buttonWrapperPositionUpdate.bind(this);
        this.hidePageOptionButton = this.hidePageOptionButton.bind(this);
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillMount() {

        // clear the on page comments side view collections
        onPageCommentHelper.resetSideViewCollections();
        this.imageWidths = [];
        this.isStructuredComponent = this.props.isEbookmarking || this.props.componentType === enums.MarkingMethod.Structured;
        this.pageNumbers = this.isStructuredComponent ?
            this.scriptHelper.getPageNumbersForImageZones(this.props.isEbookmarking ?
                this.treeViewHelper.markSchemeIdsCollection : this.treeViewHelper.imageClusterIdCollection) : null;
    }

    /**
     * Render method of the component
     */
    public render(): JSX.Element {
        if (this.state.renderedOn === 0) {
            return null;
        }

        let suppressedImageTooltip: string = localeStore.instance.TranslateText
            ('marking.full-response-view.script-page.suppressed-page-tooltip');
        let suppressedPageText: string = localeStore.instance.TranslateText('marking.full-response-view.script-page.suppressed-page');
        let additionalPageText: string = localeStore.instance.TranslateText
            ('marking.full-response-view.script-page.additional-page-indicator');
        let that = this;
        let currentImageWidth: number = that.imageWidths.length > 0 ? that.imageWidths[0].width : 100;
        let currentImageHeight = that.imageWidths.length > 0 ? that.imageWidths[0].height : 100;
        let imageOrder = 0;
        let previousPageNumber = 0;
        this.numberOfImagesToRender = 0;

        // to set order of non convertible files
        let nonConvertibleFileOrder = 0;
        let order: any = 0;

        // to add last-page class
        let totalNumberOfFiles = 0;
        let additionalObjectPageOrder: number = 0;
        let suppressedPageCount = 0;
        let firstItemPageId = 0;
        let pageItemIndex = 1;
        let questionItemIndex = 1;
        let isEcoursework: boolean = this.props.isECourseworkComponent;
        let toRender = this.props.fileMetadataList.map((fileMetadata: FileMetadata) => {
            totalNumberOfFiles++;
            imageOrder++;
            if (markerOperationModeFactory.operationMode.isAwardingMode && this.treeViewHelper.isMultiQP) {
                if (previousPageNumber > fileMetadata.pageNumber) {
                    imageOrder = 0;
                    imageOrder++;
                    questionItemIndex++;
                }
                order = isEcoursework ? fileMetadata.pageNumber : 'Paper ' + questionItemIndex + ' Page ' + imageOrder;
            } else {
                order = isEcoursework ? fileMetadata.pageNumber : imageOrder;
            }

            previousPageNumber = fileMetadata.pageNumber;
            let actualPageNo: number = fileMetadata.pageNumber;
            let isAdditionalObject: boolean = false;
            let isPageLinked: boolean = !responseHelper.isEResponse && pageLinkHelper.isPageLinked(order);
            if (this.isStructuredComponent) {
                isAdditionalObject = scriptStore.instance.getAdditionalObjectFlagValue(order);
                if (isAdditionalObject) {
                    additionalObjectPageOrder++;
                }
            }

            if (this.props.isEbookmarking === true && that.props.hasUnmanagedImageZones && !that.props.hasUnmanagedImageZoneInRemark) {
                let isUnManaged: boolean = responseHelper.hasUnManagedImageZoneForThePage(fileMetadata.pageNumber);
                if (that.props.isShowAllPagesOfScriptOptionSelected === false && isUnManaged === false && isPageLinked === false) {
                    return null;
                }
            }

            // Calculate page index for each files in the ecoursework component.
            if (fileMetadata.pageId !== 0) {
                if (firstItemPageId !== fileMetadata.pageId) {
                    firstItemPageId = fileMetadata.pageId;
                    pageItemIndex = 1;
                } else {
                    pageItemIndex++;
                }
            }

            // For suppressed images, the image url will be empty.
            if (fileMetadata.isSuppressed) {

                if (that.props.isShowAnnotatedPagesOptionSelected ||
                    this.props.isShowUnAnnotatedAdditionalPagesOptionSelected ||
                    ((this.props.hasUnmanagedSLAO || this.props.hasUnmanagedImageZones)
                        && !this.props.isShowAllPagesOfScriptOptionSelected)) {
                    return null;
                }

                let padding = {
                    'paddingTop': (currentImageHeight / currentImageWidth) * 100 + '%'
                };

                suppressedPageCount++;

                return (
                    <SuppressedPage imageOrder={order}
                        showPageNumber={true}
                        key={'suppressed-page-' + suppressedPageCount}
                        isAdditionalObject={isAdditionalObject}
                        additionalObjectPageOrder={additionalObjectPageOrder}
                        isECourseworkComponent={this.props.isECourseworkComponent} />
                );
            }

            let hasPageContainsCurrentMarkGroupAnnotation: boolean = true;

            // Check the page having any annotations
            if (that.props.componentType === enums.MarkingMethod.Unstructured) {
                hasPageContainsCurrentMarkGroupAnnotation =
                    annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(actualPageNo);

                if (this.props.isShowAnnotatedPagesOptionSelected && hasPageContainsCurrentMarkGroupAnnotation) {
                    return null;
                }
            }

            if (this.props.hasUnmanagedSLAO) {
                if (!this.props.isShowAllPagesOfScriptOptionSelected) {
                    if (isAdditionalObject) {
                        hasPageContainsCurrentMarkGroupAnnotation =
                            annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(actualPageNo, true);
                        if (hasPageContainsCurrentMarkGroupAnnotation) {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }
            } else {
                if (that.props.isShowUnAnnotatedAdditionalPagesOptionSelected) {
                    if (isAdditionalObject) {
                        hasPageContainsCurrentMarkGroupAnnotation =
                            annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(actualPageNo, false);
                        if (hasPageContainsCurrentMarkGroupAnnotation) {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }
            }
            this.numberOfImagesToRender++;

            for (let arrayIndex = 0; arrayIndex < that.imageWidths.length; arrayIndex++) {
                if (that.imageWidths[arrayIndex].pageNo === actualPageNo) {
                    currentImageWidth = that.imageWidths[arrayIndex].width;
                    currentImageHeight = that.imageWidths[arrayIndex].height;
                    break;
                }
            }

            /* Flagged As seen button should be visible If
                    1. Component is Unstructured
                AND 2. Component has seen Annotation Configured
                AND 3. Page does not have any annotations on it.
                AND 4. Response Should not be in closed state
                AND 5. Not team management mode
                AND 6. Page not linked in unmanaged SLAO mode
                AND 7. If Not in Marking Check Mode
                AND 8. If a Page linked to a question item, for structured response*/
            let isFlaggedAsSeenButtonVisible = ((this.isFlaggedAsSeenButtonVisible
                (isAdditionalObject, isPageLinked, actualPageNo, hasPageContainsCurrentMarkGroupAnnotation))
                && !this.props.isECourseworkComponent && !that.props.isShowUnAnnotatedAdditionalPagesOptionSelected);

            let isPageOptionRender: boolean = this.isPageOptionRender(isAdditionalObject, fileMetadata.pageNumber);
            let isPageOptionButtonsShown = isPageOptionRender ? (this.state.isMarkSheetHolderHovered &&
                (isEcoursework ? (order === this.state.hoveredPageNo) :
                    (imageOrder === this.state.hoveredPageNo))) : false;
            let pageOptionRender: any = isPageOptionRender ? (<PageOptions pageNumber={order}
                markThisButtonClickCallback={this.markThisPageButtonClick}
                id={'po_' + order} key={'po_' + order} selectedLanguage={this.props.selectedLanguage}
                isFlaggedAsSeenButtonVisisble={isFlaggedAsSeenButtonVisible}
                isMarkThisPageButtonVisible={this.canShowMarkThisPageButton(actualPageNo, isPageLinked)}
                currentImageMaxWidth={currentImageWidth} lastMarkSchemeId={this.lastMarkSchemeID}
                markSheetIdClicked={this.state.idOfMarksheetClicked} reRender={this.reRender}
                onLinkToButtonClick={this.props.onLinkToButtonClick}
                isLinkToPagePopupShowing={this.props.isLinkToPagePopupShowing}
                hasUnmanagedSLAO={this.props.hasUnmanagedSLAO}
                unManagedSLAOFlagAsSeenClick={this.props.unManagedSLAOFlagAsSeenClick}
                isAdditionalObject={isAdditionalObject}
                hasUnKnownContent={responseHelper.hasUnManagedImageZoneForThePage(order)}
                unKnownContentFlagAsSeenClick={this.props.unKnownContentFlagAsSeenClick}
                hasUnmanagedImageZones={this.props.hasUnmanagedImageZones}
                updatePageOptionButtonPositionCallback={this.updatePageOptionButtonPosition}
                pageOptionElementRefCallback={this.pageOptionElementRefCallback}
                optionButtonWrapperElementRefCallback={this.optionButtonWrapperElementRefCallback}
                buttonWrapperPositionUpdate={this.buttonWrapperPositionUpdate}
                doWrapperReRender={(this.state.isMarkSheetHolderHovered && imageOrder === this.state.hoveredPageNo)}
                isPageOptionButtonsShown={isPageOptionButtonsShown}
            />) : null;

            let pageIndicator = fileMetadata.name !== '' ?
                <div className='file-name'>
                    {fileMetadata.name +
                        (fileMetadata.isConvertible ? '(P' + pageItemIndex + ')' : '')}
                </div> :
                <div className={classNames('page-number', { 'with-icon': isPageLinked })}
                    id={this.getPageElementId(order, isAdditionalObject, additionalObjectPageOrder)}>
                    {isAdditionalObject ? <span className='ad-pg-number'>
                        {additionalPageText + ' ' + additionalObjectPageOrder}
                    </span> : order}
                    {this.renderLinkIcon(order, isPageLinked)}
                </div>;

            let frvBusyIndicator = (<LoadingIndicator id='fileloading' key='fileloading'
                selectedLanguage={localeStore.instance.Locale}
                cssClass='file-pre-loader'
                isFrv={true} />);

            if (fileMetadata.isConvertible) {
                // if ecoursework component, then compare order and hovered page number as
                // image order and page number is different as coursework contain file types other than images.
                return (
                    <div className={classNames(
                        (isPageOptionRender ? (isPageOptionButtonsShown ?
                            'marksheet-holder pageoption-fixed' : 'marksheet-holder') : 'marksheet-holder no-hover'),
                        { 'loading': that.pageIds.indexOf('img_' + order) === -1 },
                        { 'last-page': (that.props.fileMetadataList.count() === totalNumberOfFiles) })}
                        id={'img_' + order}
                        ref={'img_' + order}
                        key={'img_' + order}
                        onClick={this.onMarkSheetHolderClick.bind(this, order, fileMetadata.pageId)}
                        onTouchStart={this.onTouchHandler.bind(this, order)}
                        onMouseOver={this.onMouseMoveHandler.bind(this, true, order)}
                        onMouseOut={this.onMouseMoveHandler.bind(this, false, order)}>
                        {this.getAnnotationOverlay(order, currentImageHeight, currentImageWidth, isPageLinked, isAdditionalObject)}
                        {pageOptionRender}
                        <div className='frv-marksheet-img'>
                            <img src={fileMetadata.url} onLoad={this.imageLoaded.bind(this, order, 'img_' + order)} />
                        </div>
                        {pageIndicator}
                        {frvBusyIndicator}
                    </div>
                );
            } else if (fileMetadata.isImage) {
                nonConvertibleFileOrder++;
                // TODO:
                // The < img /> tag can be made as a new component.
                // so that the binding can be moved to the constructor.
                return (
                    <div className={classNames(
                        (isPageOptionRender ? (isPageOptionButtonsShown ?
                            'marksheet-holder media-wrapper pageoption-fixed' : 'marksheet-holder media-wrapper') :
                            'marksheet-holder no-hover'),
                        { 'loading': that.pageIds.indexOf('img_' + order) === -1 },
                        { 'last-page': that.props.fileMetadataList.count() === totalNumberOfFiles })}
                        id={'img_' + order}
                        ref={'img_' + order}
                        key={'img_' + order}
                        onClick={this.onMarkSheetHolderClick.bind(this, order, fileMetadata.pageId)}
                        onMouseOver={this.onMouseMoveHandler.bind(this, true, order)}
                        onMouseOut={this.onMouseMoveHandler.bind(this, false, order)}>
                        {pageOptionRender}
                        {this.getAnnotationOverlay(order, currentImageHeight, currentImageWidth, isPageLinked, isAdditionalObject)}
                        <div className='media-box'
                            id={fileMetadata.name + '.' + fileMetadata.linkType}>
                            <div className='media-img-wraper'>
                                <div className='media-img-holder'>
                                    <img src={fileMetadata.url}
                                        onLoad={this.imageLoaded.bind(this, order, 'img_' + order)} />
                                </div>
                            </div>
                        </div>
                        {pageIndicator}
                        {frvBusyIndicator}
                    </div>
                );
            } else {
                // non convertible files like audio,video,jpg,zip,xls
                nonConvertibleFileOrder++;
                return (
                    <div
                        className={classNames(
                            (isPageOptionRender ? (isPageOptionButtonsShown ?
                                'marksheet-holder media-wrapper pageoption-fixed' : 'marksheet-holder media-wrapper') :
                                'marksheet-holder no-hover media-wrapper'),
                            { ' last-page': that.props.fileMetadataList.count() === totalNumberOfFiles }
                        )}
                        id={'img_' + order}
                        ref={'img_' + order}
                        key={'img_' + order}
                        onClick={this.onMarkSheetHolderClick.bind(this, order, fileMetadata.pageId)}
                        onMouseOver={this.onMouseMoveHandler.bind(this, true, order)}
						onMouseOut={this.onMouseMoveHandler.bind(this, false, order)}>
						{frvBusyIndicator}
                        <div className='page-options hovered'> </div>
                        <div className='media-box'
                            id={fileMetadata.name + '.' + fileMetadata.linkType}>
                            <div className='media-img-wraper'>
                                <div className='media-img-holder'>
                                    <div className='svg-media-ico'>
                                        <span className='svg-icon'>
                                            <svg viewBox='0 0 32 32'
                                                className={eCourseworkHelper.getIconStyleForSvg(
                                                    fileMetadata.linkType).svgClass}>
                                                <use
                                                    xmlnsXlink={'http://www.w3.org/1999/xlink'}
                                                    xlinkHref={'#' + eCourseworkHelper.getIconStyleForSvg(
                                                        fileMetadata.linkType).icon} />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='page-number' title={fileMetadata.name}>
                            {fileMetadata.name}
                        </div>
                    </div >
                );
            }
        });

        // if in hasUnmanagedSLAO mode and all slaos are managed the show the all slao managed popup
        if (this.props.hasUnmanagedSLAO && !responseHelper.hasUnManagedSLAOInMarkingMode && this.props.allSLAOManaged) {
            this.props.allSLAOManaged();
        }

        if (this.props.hasUnmanagedImageZones && !responseHelper.hasUnManagedImageZone() && this.props.allUnknownContentManaged) {
            this.props.allUnknownContentManaged();
            if (htmlUtilities.isTabletOrMobileDevice) {
                this.setState({ isMarkSheetHolderHovered: false });
            }
        }

        return (
            <div className={'marksheets-inner-images'} >
                {

                    this.renderDefinitions()
                }
                <div className='marksheet-container clearfix'
                    onWheel={this.onWheelHandler.bind(this)}
                    onTouchMove={this.onScrollHandler.bind(this)}
                    onScroll={this.onScrollHandler.bind(this)}
                    ref={(marksheetcontainer) => { this.marksheetcontainerElement = marksheetcontainer; }}>
                    <div className=
                        {classNames('frv-holder',
                            { 'frv-single-page': this.props.fullResponseOption === enums.FullResponeViewOption.onePage })}>
                        {!this.props.isECourseworkComponent ? this.renderFirstPageHolder() : null}
                        {toRender}
                        <AnnotatedMessageHolder id='annotatedMessageHolder' componentType={this.props.componentType}
                            key='annotatedMessageHolder' />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Function to find whether page option available for the page.
     */
    private isPageOptionRender(isAdditionalObject: boolean, pageNumber: number): boolean {
        if (this.props.isStandardisationsetupmode) {
            return true;
        } else {
            return ((this.props.hasUnmanagedSLAO || this.props.hasUnmanagedImageZones) ?
                (isAdditionalObject || responseHelper.isUnkNownContentPage(pageNumber) ? true : false) : true);
        }
    }

    /**
     * Function to find page option div's height
     */
    private optionButtonWrapperHeight = (pageOptionRect: any, markSheetHolderDimensions: any) => {
        let optionButtonWrapperTopPoint = Math.max(constants.FRV_TOOLBAR_HEIGHT, markSheetHolderDimensions.top + 10);
        let optionButtonWrapperBottomPoint = Math.min(window.innerHeight, markSheetHolderDimensions.bottom - 25);
        return optionButtonWrapperBottomPoint - optionButtonWrapperTopPoint;
    }

    /**
     * Function to find page option div's top
     */
    private optionButtonWrapperTop = (markSheetHolderDimensions: any) => {
        let optionButtonWrapperTopPoint = Math.max(constants.FRV_TOOLBAR_HEIGHT, markSheetHolderDimensions.top + 10);
        let optionButtonWrapperBottomPoint = Math.min(window.innerHeight, markSheetHolderDimensions.bottom - 25);
        let height = optionButtonWrapperBottomPoint - optionButtonWrapperTopPoint;
        let obnTop = optionButtonWrapperTopPoint - markSheetHolderDimensions.top;
        let obnCentrePoint = ((height / 2) + obnTop) - (this.optionButtonWrapperElement.getBoundingClientRect().height / 2);
        return Math.round(obnCentrePoint);
    }

    /**
     * Function to find page option div's left
     */
    private optionButtonWrapperLeft = (pageOptionRect: any, optionButtonWrapper: any) => {
        return Math.round((pageOptionRect.width - optionButtonWrapper.width) / 2);
    }

    /**
     * Function to find the button wrapper div's position
     */
    private buttonWrapperPositionUpdate = () => {
        let obwHeight: any;
        let obwTop: any = '50%';
        let obwLeft: any = '50%';
        let obwMaxWidth: number = 0;
        if (this.pageOptionElement && this.optionButtonWrapperElement) {
            let markSheetHolder = htmlUtilities.getElementsByClassName('pageoption-fixed')[0];
            let pageOptionRect = this.pageOptionElement.getBoundingClientRect();
            let optionButtonWrapper = this.optionButtonWrapperElement.getBoundingClientRect();
            let markSheetHolderDimensions = markSheetHolder ? markSheetHolder.getBoundingClientRect() : undefined;

            obwHeight = markSheetHolder ? this.optionButtonWrapperHeight(pageOptionRect, markSheetHolderDimensions) : 0;

            if (((obwHeight) <= optionButtonWrapper.height) || this.optionButtonWrapperElement.clientHeight === 0) {
                /* Hiding the button wrappers by setting the top and left with height and width of page option
                   if all the buttons doesnt fits in the avilable space */
                if (!this.optionButtonWrapperElement.classList.contains('hide')) {
                    this.optionButtonWrapperElement.classList.add('hide');
                }
            } else {

                // calculate the button wrapper top position.
                obwTop = markSheetHolder ? this.optionButtonWrapperTop(markSheetHolderDimensions).toString() + 'px' : obwTop;
                obwLeft = this.optionButtonWrapperLeft(pageOptionRect, optionButtonWrapper).toString() + 'px';

                // remove hide class to show the buttons.
                if (this.optionButtonWrapperElement.classList.contains('hide')) {
                    this.optionButtonWrapperElement.classList.remove('hide');
                }
            }

            // update the wrapper top, left.
            this.optionButtonWrapperElement.style.transform = 'translate3d(' + obwLeft + ',' + obwTop + ',' + '0)';
        }
    };

    /**
     * Handler for touch start event
     */
    public onTouchHandler = (imageOrder: number, event: any) => {
        if (!(this.state.isMarkSheetHolderHovered && imageOrder === this.state.hoveredPageNo)) {
            this.updatePageOptionButtonPosition(false, -1);
        }
    };

    /*
     * Scroll event handler
     */
    public onScrollHandler = (event: any) => {
        this.buttonWrapperPositionUpdate();
    }

    /*
     * On Wheel handler
     */
    public onWheelHandler = (event: any) => {
        let element: Element = htmlUtilities.getElementFromPosition(event.pageX, event.pageY);

        let str: string = element.id;
        let pageNo: number = parseInt(str.split('_')[1]);

        if (!isNaN(pageNo) &&
            ((element.getBoundingClientRect().height > (window.innerHeight - constants.FRV_TOOLBAR_HEIGHT))
                || (element.className.indexOf('page-options hovered') === -1))) {
            this.updatePageOptionButtonPosition(true, pageNo);
        }
    };

    /*
     * Call back method to set the option button wrapper ref
     */
    public pageOptionElementRefCallback = (element: HTMLDivElement) => {
        if (element !== undefined && element !== null) {
            this.pageOptionElement = element;
        }
    }

    /*
     * Call back method to set the page option ref
     */
    public optionButtonWrapperElementRefCallback = (element: HTMLDivElement) => {
        if (element !== undefined && element !== null) {
            this.optionButtonWrapperElement = element;
        }
    }

    /**
     * Function to update the page option button postion
     */
    private updatePageOptionButtonPosition = (isMouseIn: boolean, pageNo: number) => {
        // when mouse released from page hide the button wrapper.
        if (!isMouseIn && this.optionButtonWrapperElement) {

            // add hide class to show the page option buttons.
            if (!this.optionButtonWrapperElement.classList.contains('hide')) {
                this.optionButtonWrapperElement.classList.add('hide');
            }
        }

        this.setState({
            renderedOn: Date.now(),
            idOfMarksheetClicked: -1,
            isMarkSheetHolderHovered: isMouseIn,
            hoveredPageNo: pageNo
        });
    }

    /**
     * Function for rendering definitions
     */
    private renderDefinitions(): JSX.Element {
        if (this.props.isECourseworkComponent) {
            return eCourseworkHelper.renderDefinitions();
        } else {
            return null;
        }
    }

    /**
     *  Mark this page button should be visible If
     *                           1. Component is Unstructured and not ebookmarking or Structured response rendered as Unstructured(Atypical)
     *                           2. Structured and If one or more image zones available against that particular page
     *                           3. Not team management mode
     *                           4. Not ecoursework component
     *                           5. in ebookmarking pages with imagezones zoned to current QIG
     */
    private canShowMarkThisPageButton(actualPageNo: number, isPageLinked: boolean): boolean {
        return ((((this.props.componentType === enums.MarkingMethod.Unstructured &&
            !responseHelper.isEbookMarking) ||
            (responseHelper.isAtypicalResponse())) ||
            (this.pageNumbers && this.pageNumbers.indexOf(actualPageNo) !== -1 && !this.props.hasUnmanagedImageZones) ||
            (isPageLinked && this.props.componentType === enums.MarkingMethod.Structured && !this.props.hasUnmanagedSLAO) ||
            (isPageLinked && responseHelper.isEbookMarking && !this.props.hasUnmanagedImageZones)) &&
            !this.props.isECourseworkComponent);
    }

    /**
     * return FlagAsSeenButton visibility.
     * @param isAdditionalObject
     * @param isPageLinked
     * @param actualPageNo
     * @param hasPageContainsCurrentMarkGroupAnnotation
     */
    private isFlaggedAsSeenButtonVisible(isAdditionalObject: boolean, isPageLinked: boolean,
        actualPageNo: number, hasPageContainsCurrentMarkGroupAnnotation: boolean) {
        if (markerOperationModeFactory.operationMode.isFlaggedAsSeenButtonVisible) {
            if (this.props.hasUnmanagedSLAO && !this.props.hasUnmanagedImageZones) {
                // Need to display the flagseen button when the additionalObject which has not linked.
                if (isAdditionalObject) {
                    if (isPageLinked) {
                        return !isPageLinked;
                    } else {
                        return !annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(actualPageNo);
                    }
                    // No need to dispaly the flag seen button for pages which is not additional object in slao mode.
                } else {
                    return false;
                }
            } else if (this.props.hasUnmanagedImageZones && responseHelper.hasUnManagedImageZoneForThePage(actualPageNo) &&
                worklistStore.instance.getResponseMode !== enums.ResponseMode.closed) {
                return true;
            } else {
                return annotationHelper.IsSeenStampConfiguredForQIG
                    && worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
                    && !hasPageContainsCurrentMarkGroupAnnotation
                    && (!responseHelper.isEbookMarking && !responseHelper.isAtypicalResponse());
            }
        } else {
            return false;
        }
    }

    /**
     * get the last MarkSchemeID.
     */
    private get lastMarkSchemeID(): number {
        return this.props.lastMarkSchemeId ? this.props.lastMarkSchemeId : this.treeViewHelper.lastMarkSchemeId;
    }

    /**
     * returns ID for additional page element.
     * @param imageOrder
     * @param isAdditionalObject
     * @param additionalObjectPageOrder
     */
    private getPageElementId(imageOrder: number, isAdditionalObject: boolean, additionalObjectPageOrder: number): string {
        return isAdditionalObject ? 'AdditionalPage_' + additionalObjectPageOrder : 'pn_' + imageOrder;
    }

    /**
     * render link icon if the page is linked against any question item
     * @param pageNumber
     */
    private renderLinkIcon(pageNumber: number, isPageLinked: boolean) {
        if (isPageLinked) {
            return <LinkIcon id={'link_icon_' + pageNumber.toString()} />;
        } else {
            return null;
        }
    }

    /**
     * click event for marksheet holder
     * @param evt
     */
    private onMarkSheetHolderClick(pageNumber: number, pageId: number, evt: any) {
        let elementToFindId: any = evt.target.parentElement && evt.target.parentElement.parentElement
            || evt.target.parentNode && evt.target.parentNode.parentNode;
        let id = elementToFindId.id.replace('img_', '');
        if (id.indexOf('annotationoverlay') >= 0) {
            id = evt.target.getAttribute('data-pageno');
        }

        // Handling click outside annotation overlay. ( For hover effect in ipad)
        if (id === null && evt.target.id.indexOf('annotationoverlay') >= 0) {
            id = evt.target.parentElement.id.replace('img_', '');
        }

        // To get the id of ebookmarking page in FRV
        if (id !== null && (id.indexOf('unzone_content_wrapper_') >= 0 ||
            id.indexOf('unzone_content_holder_') >= 0 || id.indexOf('po_') >= 0)) {
            if (evt.target.id.indexOf('unzone_content_wrapper_') >= 0) {
                id = evt.target.id.replace('unzone_content_wrapper_', '');
            } else if (evt.target.id.indexOf('unzone_content_holder_') >= 0) {
                id = evt.target.parentElement.id.replace('unzone_content_wrapper_', '');
            } else {
                id = evt.target.id.replace('po_', '');
            }
        }
        if (pageNumber !== this.state.hoveredPageNo) {
            this.setState({
                renderedOn: Date.now(),
                idOfMarksheetClicked: parseInt(id),
                isMarkSheetHolderHovered: true,
                hoveredPageNo: pageNumber
            });
        }

        if (this.props.isECourseworkComponent) {

            this._pageNumber = pageNumber;

            // to save clicked pagenumber in store
            markingActionCreator.setMarkThisPageNumber(pageNumber);

            // filter the coursework file of particular response
            if (responseStore.instance.selectedDisplayId) {
                let responseData: any;
                let identifier: number;
                if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                    responseData = standardisationSetupStore.instance.
                        getResponseDetails(responseStore.instance.selectedDisplayId.toString());
                    if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.
                        SelectResponse) {
                        identifier = responseData.candidateScriptId;
                    } else {
                        identifier = responseData.esMarkGroupId;
                    }
                } else if (markerOperationModeFactory.operationMode.isAwardingMode) {
                    responseData = markerOperationModeFactory.operationMode.openedResponseDetails
                        (responseStore.instance.selectedDisplayId.toString());
                } else {
                    responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
                    identifier = responseData.markGroupId;
                }

                let eCourseworkFiles = responseData ? eCourseworkFileStore.instance.
                    getCourseWorkFilesAgainstIdentifier(identifier) : null;

                let doAutoPlay = eCourseworkFileStore.instance.getSelectedECourseWorkFiles().count() > 1 ?
                    eCourseworkFileStore.instance.doAutoPlay() : true;

                // find the current file while clicking the page in FRV
                let courseworkFile = eCourseworkFiles ? eCourseworkFiles.filter((x: courseWorkFile) => x.docPageID === pageId) : null;
                if (courseworkFile) {
                    // To avoid displaying file name in expanded view
                    if (eCourseworkFileStore.instance.isFilelistPanelCollapsed) {
                        eCourseworkResponseActionCreator.displayFileName(courseworkFile[0].title);
                    }
                    // Invoke action creator to save selected ecourse file in the store.
                    eCourseworkResponseActionCreator.eCourseworkFileSelect(courseworkFile[0], doAutoPlay, true, true);
                }
            }
        }
    }

    /**
     * Call back function for mark this page button click for non ecoursework components
     */
    private markThisPageButtonClick = (pageNumber: number) => {
        let imageElementId: string = 'img_' + pageNumber;
        if ((this.props.componentType === enums.MarkingMethod.Structured || responseHelper.isEbookMarking) &&
            !responseHelper.isAtypicalResponse()) {
            let imageZones: Immutable.List<ImageZone> = this.scriptHelper.getImageZonesAgainstPageNo(pageNumber);
            let linkedAnnotations: annotation[] = pageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);
            responseActionCreator.imageZonesAgainstPageNumber(imageZones, linkedAnnotations);
        } else {
            this.props.switchViewCallback(responseStore.instance.selectedImageOffsetTop(imageElementId));
        }
    };

    /**
     * Triggering switchView once the file is selected for ecoursework components
     */
    private onEcourseWorkFileChanged = (isInFullResponseView: boolean) => {
        // call only when navigating to zone view by clicking images in full response view
        if (isInFullResponseView) {
            this.markThisPageButtonClick(this._pageNumber);
            this._pageNumber = undefined;
        }
    };

    /**
     * For structured Resposnes Call switch view callback After saving ImageZones
     * against Mark This Page button click page number.
     */
    private imageZonesAgainstPageNoSaved = () => {
        this.props.switchViewCallback(0);
    };

    /**
     * Render a space area in fullresponse view if the Only Show unannotated pages option is OFF
     */
    private renderFirstPageHolder() {
        if (!this.props.isShowAnnotatedPagesOptionSelected && !this.props.isShowUnAnnotatedAdditionalPagesOptionSelected
            && !this.props.hasUnmanagedSLAO && !this.props.hasUnmanagedImageZones && !this.props.isShowAllPagesOfScriptOptionSelected) {
            return <div className='marksheet-holder first-page'></div>;
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        this.isComponenetMounted = true;
        // Sets the image properties oncce after first render.
        this.setImagePropertiesForFullResponseImage();
        responseStore.instance.addListener(responseStore.ResponseStore.FULL_RESPONSE_VIEW_OPTION_CHANGED_EVENT,
            this.fullResponseViewOptionChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRender);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.reloadExceptionDetailsOnCloseException);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.hidePageOptionButton);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW, this.hidePageOptionButton);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.hidePageOptionButton);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.hidePageOptionButton);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.hidePageOptionButton);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.hidePageOptionButton);
        window.addEventListener('resize', this.hidePageOptionButton);
        window.addEventListener('orientationchange', this.hidePageOptionButton);
        responseStore.instance.addListener(responseStore.ResponseStore.IMAGE_ZONES_AGAINST_PAGE_NO_SAVED,
            this.imageZonesAgainstPageNoSaved);
        eCourseworkFileStore.instance.addListener(eCourseworkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.onEcourseWorkFileChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.FOUND_VISIBLE_IMAGE,
            this.setScrollTop);
        responseStore.instance.addListener(responseStore.ResponseStore.FRV_SCROLL_EVENT,
            this.scrollToFirstUnknownContentPageOnPopUpOKClick);
        responseStore.instance.addListener(responseStore.ResponseStore.FRV_TOGGLE_BUTTON_EVENT, this.hidePageOptionButton);
        this.doSetScroll = true;
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillUnmount() {
        this.isComponenetMounted = false;
        responseStore.instance.removeListener(responseStore.ResponseStore.FULL_RESPONSE_VIEW_OPTION_CHANGED_EVENT,
            this.fullResponseViewOptionChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRender);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.reloadExceptionDetailsOnCloseException);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.hidePageOptionButton);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW, this.hidePageOptionButton);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.hidePageOptionButton);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.hidePageOptionButton);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.hidePageOptionButton);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.hidePageOptionButton);
        window.removeEventListener('resize', this.hidePageOptionButton);
        window.removeEventListener('orientationchange', this.hidePageOptionButton);
        responseStore.instance.removeListener(responseStore.ResponseStore.IMAGE_ZONES_AGAINST_PAGE_NO_SAVED,
            this.imageZonesAgainstPageNoSaved);
        eCourseworkFileStore.instance.removeListener(eCourseworkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.onEcourseWorkFileChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.FOUND_VISIBLE_IMAGE,
            this.setScrollTop);
        responseStore.instance.removeListener(responseStore.ResponseStore.FRV_SCROLL_EVENT,
            this.scrollToFirstUnknownContentPageOnPopUpOKClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.FRV_TOGGLE_BUTTON_EVENT, this.hidePageOptionButton);
    }

    /**
     * This function gets invoked after the component is rendered
     */
    public componentDidUpdate() {
        // add 'last-page' classname to the last element
        let elementList = htmlUtilities.getElementsByClassName('marksheet-holder');
        if (elementList.length > 0 && !elementList[elementList.length - 1].classList.contains('last-page')) {
            elementList[elementList.length - 1].className += ' last-page';
        }
        // call to set class name 'all-annotated' correctly
        this.props.hasElementsToRenderInFRViewMode(this.numberOfImagesToRender >= 1);
    }

    /*
     * Mouse move event handler
     */
    public onMouseMoveHandler = (isMouseIn: boolean, pageNumber: number, event: any) => {
        if (!htmlUtilities.isTabletOrMobileDevice) {
            this.updatePageOptionButtonPosition(isMouseIn, pageNumber);
        }
    }

    /**
     * Get the React component for Annotation Overlay
     * @param pageNumber
     * @param currentImageHeight
     * @param currentImageWidth
     * @param isPageLinked
     * @param isAdditionalObject
     */
    private getAnnotationOverlay(pageNumber: number,
        currentImageHeight: number,
        currentImageWidth: number,
        isPageLinked: boolean,
        isAdditionalObject?: boolean): JSX.Element {
        // we need to set this true as we need to get the current annotations which are placed against
        // pages linked by previous marker
        if (!isPageLinked && this.props.linkedPagesByPreviousMarkers &&
            this.props.linkedPagesByPreviousMarkers.indexOf(pageNumber) > -1) {
            isPageLinked = true;
        }
        if (this.props.displayAnnotations) {
            return (<AnnotationOverlay id={pageNumber.toString()} key={'annotationOverlay_' + pageNumber} outputPageNo={0}
                selectedLanguage={this.props.selectedLanguage}
                imageClusterId={0} currentOutputImageHeight={currentImageHeight} currentImageMaxWidth={currentImageWidth}
                pageNo={pageNumber}
                isDrawStart={this.props.isDrawStart}
                renderedOn={this.state.renderedOn}
                panEndData={this.props.panEndData}
                isReadOnly={true}
                currentImageNaturalWidth={currentImageWidth}
                isAdditionalObject={isAdditionalObject}
                isALinkedPage={isPageLinked}
                isEBookMarking={this.props.isEbookmarking} />);
        } else {
            return null;
        }
    }

    /**
     * Go to the corresponding element if all images rendered.
     * @param page
     */
    private imageLoaded(pageNumber: number, id: string): void {
        // TODO: elementToRemove implementation can be done without using JQuery
        // as the binding for imageLoaded() is moved to the constructor and new component is created.
        let elementToRemove = '#' + id + ' .file-pre-loader';

        // remove busy indicator after image has been loaded
        if ($(elementToRemove)) {
            $(elementToRemove).remove();
            $('#' + id).removeClass('loading');
        }

        let imageOffsetTop: number;
        this.imagesLoaded++;
        if (this.pageIds.indexOf(id) === -1) {
            this.pageIds[this.pageIds.length] = id;
        }

        // in ecoursework case once the first image loads we need to set scroll,
        // no need to wait for all images to be loaded
        if (!this.props.setScrollTopAfterAllImagesLoaded && this.doSetScroll) {
            this.setScrollTop();
            this.doSetScroll = false;
        }
        // find and save the offset of active image container.
        if (this.totalImageCount === this.imagesLoaded) {
            // This will find the offsetTop value of active image container.
            imageOffsetTop = this.props.setScrollTopAfterAllImagesLoaded ? this.findActiveImageContainerOffsetTop() : undefined;

            // reset images loaded count;
            this.imagesLoaded = 0;
        }

        this.props.onImageLoaded(pageNumber, imageOffsetTop);
    }

    /**
     * This method will find the offset top of active image container after loading the images.
     */
    private findActiveImageContainerOffsetTop = (): number => {
        if (this.refs != null) {
            // In full responseview the refs does not have output pageID
            let refId: string = responseStore.instance.currentlyVisibleImageContainerRefId;
            let ele: any = ReactDom.findDOMNode(this.refs[refId.substring(0, refId.lastIndexOf('_'))]);
            if (ele) {
                // set the offsetTop - substract change-view-holder size for getting correct scroll position.
                return ele.offsetTop - constants.FULL_RESPONSE_VIEW_ITEM_MARGIN;
            }
        }
    };

    /**
     *  This method will find offset top of active image container and call the callback function with
     *  full response view option and offsetTop
     */
    private fullResponseViewOptionChanged = (fullResponseViewOption: enums.FullResponeViewOption) => {
        let that = this;
        this.updatePageOptionButtonPosition(false, -1);
        // .3 sesond is the trannsition effect.
        setTimeout(function () {
            that.scrollToOffset(fullResponseViewOption);
        }, constants.FULLRESPONSEVIEW_TRANSITION_TIME);
    };

    /**
     *  This method will find the visible page and setting scroll position in FRV
     */
    private setScrollTop = () => {
        $('.marksheet-container').scrollTop(this.findActiveImageContainerOffsetTop() + constants.FULL_RESPONSE_VIEW_ITEM_MARGIN);
    };

    /**
     *  This method will find the first unknown content page and setting scroll position in FRV
     */
    private scrollToFirstUnknownContentPageOnPopUpOKClick = () => {
        this.marksheetcontainerElement.scrollTop = (this.findUnknownContentPagePositionToScroll());
    }

    /**
     *  This method will find the page reference to scroll
     */
    private findUnknownContentPagePositionToScroll = () => {
        if (this.refs != null) {
            let ele: any = ReactDom.findDOMNode(this.refs['img_' + responseHelper.findFirstUnknownContentPage()]);
            if (ele) {
                return ele.offsetTop;
            }
        }
    }
    /**
     * To set scroll offset
     * @param {enums.FullResponeViewOption} fullResponseViewOption
     */
    private scrollToOffset(fullResponseViewOption: enums.FullResponeViewOption) {
        let imageOffsetTop: number = this.findActiveImageContainerOffsetTop();
        this.props.onFullResponseViewOptionChanged(fullResponseViewOption, imageOffsetTop);
    }
    /**
     * get the image properties
     * @param {string} image
     * @param {Function} callback
     */
    private getImageProperties(image: string, callback: Function) {
        let img = $('<img />');
        img.attr('src', image);
        img.unbind('load');

        img.bind('load', function () {
            callback(this);
        });
    }

    /**
     * Rerender the component
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now(),
            idOfMarksheetClicked: -1
        });
    };

    /**
     * to reload exceptions after closing an exception
     */
    private reloadExceptionDetailsOnCloseException() {
        exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode);
    }

    /**
     * Hide Page Option Button whenever exception/message panel resize/close
     */
    private hidePageOptionButton() {
        this.updatePageOptionButtonPosition(false, -1);
    }

    /**
     * Sets the properties of a full response image viewer.
     */
    private setImagePropertiesForFullResponseImage = () => {
        let that = this;

        if (this.props.fileMetadataList) {
            this.props.fileMetadataList.forEach((metadata: FileMetadata) => {
                if (metadata.isConvertible) {
                    this.getImageProperties(metadata.url, function (context: any) {

                        let imageWidth: ImageDetails = { pageNo: metadata.pageNumber, height: context.height, width: context.width };

                        that.imageWidths.push(imageWidth);

                        if (that.totalImageCount === that.imageWidths.length && that.isComponenetMounted) {
                            that.setState({
                                renderedOn: Date.now(),
                                idOfMarksheetClicked: -1
                            });
                        }
                    });
                } else {
                    this.setState({
                        renderedOn: Date.now(),
                        idOfMarksheetClicked: -1
                    });
                }
            });
        }
    }
}


export = FullResponseImageViewer;