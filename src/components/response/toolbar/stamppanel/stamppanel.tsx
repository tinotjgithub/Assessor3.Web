/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import toolbarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
import ImageStamp = require('../../annotations/static/imagestamp');
import DynamicStamp = require('./stamptype/dynamicstamp');
import TextStamp = require('../../annotations/static/textstamp');
import ToolsStamp = require('../../annotations/static/toolsstamp');
import localeStore = require('../../../../stores/locale/localestore');
import Immutable = require('immutable');
import stampData = require('../../../../stores/stamp/typings/stampdata');
import stampStore = require('../../../../stores/stamp/stampstore');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import colouredannotationshelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import enums = require('../../../utility/enums');
import sorthelper = require('../../../../utility/sorting/sorthelper');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import groupHelper = require('../../../../utility/grouping/grouphelper');
import grouperList = require('../../../../utility/grouping/groupingbase/grouperlist');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
import userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
import userOptionsActionCreator = require('../../../../actions/useroption/useroptionactioncreator');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');
import markingStore = require('../../../../stores/marking/markingstore');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import StampBanner = require('./stampbanner/stampbanner');
import constant = require('../../../utility/constants');
let classNames = require('classnames');
import eventTypes = require('../../../base/eventmanager/eventtypes');
import eventManagerBase = require('../../../base/eventmanager/eventmanagerbase');
import deviceHelper = require('../../../../utility/touch/devicehelper');
import responseStore = require('../../../../stores/response/responsestore');
import direction = require('../../../base/eventmanager/direction');
import timerHelper = require('../../../../utility/generic/timerhelper');
import eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import OverlayPanel = require('./acetate/overlaypanel');
import responseSearchHelper = require('../../../../utility/responsesearch/responsesearchhelper');

interface Props extends PropsBase, LocaleSelectionBase {
    favouriteStampsCollection: Immutable.List<stampData>;
    actualStampsCollection: Immutable.List<stampData>;
    isStampPanelExpanded: boolean;
    setNumberOfColumnsInFavouriteToolBar: Function;
    isOverlayAnnotationsVisible: boolean;
    doDisableMarkingOverlay: Function;
}

interface State {
    renderedOn: number;
}

/**
 * React component class for Stamp Panel.
 */
class StampPanel extends eventManagerBase {

    private stampsCountToBeRenderedInSingleColumn: number = 0;
    private numberOfColumnsInFavouriteToolBar: number = 1;
    private cursorDivStyle: React.CSSProperties = { 'top': 0, 'left': 0 };
    private annotationOverlayClass: string = 'annotation-holder';
    private isAnnotationOverFavouritePanel: boolean = false;

    // variable to hold Panned Stamp ID to update favuouritepanel. Fix for issue #51324. missing annotation in IE
    // Remove panned stamp id from the favourite list before adding it again in new position
    private panStampIdToUpdateFavouratePanel: number = 0;

    // This variable will hold the panned stampId
    private pannedStampId: number = 0;
    // paned stamp data
    private pannedStamp: stampData;
    // Pan threshold
    private PAN_THRESHOLD: number = 15;
    private PRESS_DELAY: number = 10;

    /** refs */
    public refs: {
        [key: string]: (Element);
        stampPanel: Element;
        stampMainPanel: Element;
        favoritesPanel: Element;
    };

    /**
     * Constructor for stamp panel
     * @param props
     */
    constructor(props: Props) {
        super(props, null);

        this.state = {
            renderedOn: 0
        };

        this.onTouchMoveHandler = this.onTouchMoveHandler.bind(this);
    }

    /**
     * This function gets called when the component is mounted
     */
    public componentDidMount() {

        // Adding subscription to the events
        this.addEventListeners();

        // Determining the maximum number of stamps that could be rendered
        // on the stamp panel favourite's section and number of columns in the favourite toolbar to display.
        this.determineStampCountAndNoOfColumnsToRender();

        // setup events
        this.setUpEvents();

        // for handling scenario:- 
        // first markscheme is unzoned CustomizeToolBarBanner will not display.
        if (stampStore.instance.isFavouriteToolbarEmpty
            && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner
            && stampStore.instance.currentStampBannerType !== undefined) {
            stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        // Removing subscription to the events
        this.removeEventListeners();
        // unregister events
        this.unRegisterEvents();
    }

    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            let touchActionValue: string = deviceHelper.isTouchDevice() && !deviceHelper.isMSTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: this.PAN_THRESHOLD });
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.onPanCancel);
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

    /* press event for stamp panel */
    private onPress = (event: EventCustom) => {
        this.setPannedStamp(event);
    }

    /**
     * sets the pan stamp 
     * @param event
     */
    private setPannedStamp(event: EventCustom) {
        // find the position of pan start for finding stamp element.
        let stampX: number = event.center.x - event.deltaX;
        let stampY: number = event.center.y - event.deltaY;
        // find the stamp element
        let element: any = htmlUtilities.getElementFromPosition(stampX, stampY);
        // get the stampId and stamp data if it has an element
        if (element) {
            this.pannedStampId = parseInt(element.getAttribute('data-stamp'));
        }
    }

    /**
     * This will call on pan start in stamp panel
     * @param evnt: Custom event type
     */
    private onPanStart = (event: EventCustom) => {
        // setting panned stamp id using pan start
        this.setPannedStamp(event);
        if (this.pannedStampId > 0) {
            // Hide context menu while dragging
            markingActionCreator.showOrHideRemoveContextMenu(false);
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
            if (this.pannedStampId > 0) {
                event.preventDefault();
                toolbarActionCreator.PanStamp(this.pannedStampId);
            }
        }
    };
    /**
     * This will call on pan end in stamp panel
     * @param evnt: Custom event type
     */
    private onPanEnd = (event: EventCustom) => {
        if (this.pannedStampId > 0) {
            let xPos: number = event.changedPointers[0].clientX;
            let yPos: number = event.changedPointers[0].clientY;
            let stampId: number = this.pannedStampId;
            // reset the paned stampId
            this.pannedStampId = 0;
            // set false if updateFavoriteStampCollection action not called
            // To handle different scenarios where favourite annotation panel is not updated
            let updationOnFavouriteStampCollection: boolean = true;

            let element: Element = htmlUtilities.getElementFromPosition(xPos, yPos);
            let isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
            let isPannedOnAcetate = annotationHelper.isAcetate(element);
            if (isPannedOnDynamicAnnotation || isPannedOnAcetate) {
                // find the annotation holder of the current element
                element = annotationHelper.findAnnotationHolderOfAnElement(element);
            }

            if (element) {
                let elementId: string;
                // find the id of parent element with classname 'icon-tray-left'
                elementId = htmlUtilities.findAncestor(element, 'icon-tray-left').id;

                markingActionCreator.panEndAction(
                    stampId,
                    xPos,
                    yPos,
                    element == null ? '' : element.id,
                    enums.PanSource.StampPanel,
                    false,
                    false);

                responseActionCreator.setMousePosition(0, 0);

                let favList = this.props.favouriteStampsCollection;
                let hasPanedFromFavoritesPanel = favList.filter((x: stampData) => x.stampId === stampId).count() > 0;
                switch (elementId) {
                    case 'iconToolsTray':
                        stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Remove,
                            stampId);
                        stampActionCreator.setFocusOnMarkEntrytextbox();
                        break;
                    case 'favouritepanel':
                    case 'righttrayicon':
                    case 'defaultmarkingtray':
                    case 'favouritepaneladdicon':
                        updationOnFavouriteStampCollection = this.handlePanEndOnFavPanel(xPos,
                            yPos, stampId, hasPanedFromFavoritesPanel);
                        stampActionCreator.setFocusOnMarkEntrytextbox();
                        break;
                    case 'wrapperli-favouritepanel-addtoollink':
                        if (hasPanedFromFavoritesPanel) {
                            // Stamp From the Favorites Panel, Insert into the last position
                            stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Insert,
                                stampId, null, favList.last().stampId);
                        } else {
                            stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add,
                                stampId);
                        }
                        stampActionCreator.setFocusOnMarkEntrytextbox();
                        break;
                    default:
                        this.handlePanEndOnOtherAreas(elementId, stampId);
                        break;
                }

                markingActionCreator.onAnnotationDraw(true);
            } else {
                markingActionCreator.panCancelAction();
            }

            if (this.isAnnotationOverFavouritePanel) {
                this.isAnnotationOverFavouritePanel = false;
                // Set panStampIdToUpdateFavouratePanel only if there is an updation in the favourite panel
                if (updationOnFavouriteStampCollection) {
                    this.panStampIdToUpdateFavouratePanel = toolbarStore.instance.panStampId;
                }

                this.setState({
                    renderedOn: Date.now()
                });
            }
        }
    };

    /**
     * Handles stamp pan move event - This method will call on devices and desktop
     * Logic for showing stamp cursors including dynamic annotations while draging from toolbar panel to favourite toolbar panel
     * and to response
     * @param event: Custom Event type
     */
    private onPanMove = (event: EventCustom): void => {
        event.preventDefault();

        let actualX = event.changedPointers[0].clientX;
        let actualY = event.changedPointers[0].clientY;
        let element: Element = htmlUtilities.getElementFromPosition(actualX, actualY);
        let isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
        let isPannedOnAcetate: boolean = annotationHelper.isAcetate(element);
        let isPanOnStampPanel: boolean = false;
        let isAnnotationOverlaps: boolean = false;
        // If an element exists and if an annotation is paned
        if (element != null && element !== undefined && toolbarStore.instance.panStampId > 0) {
            if (element.id.indexOf('favouritepanel') >= 0 ||
                element.id.indexOf('defaultmarkingtray') >= 0) {
                if (!this.isAnnotationOverFavouritePanel) {
                    this.isAnnotationOverFavouritePanel = true;
                    this.setState({
                        renderedOn: Date.now()
                    });
                }
            } else {
                if (this.isAnnotationOverFavouritePanel) {
                    this.isAnnotationOverFavouritePanel = false;
                    this.setState({
                        renderedOn: Date.now()
                    });
                }
            }

            let selectedStamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);

            // First checking if the pan is performed inside the stamp panel on the stamps in the stamp panel
            isPanOnStampPanel = annotationHelper.isPanOnStampPanel(element, enums.PanSource.StampPanel);
            if (isPanOnStampPanel) {

                // If the pan is on the stamp panel, set the cursor with the dragged stamp
                this.setCursorPosition(actualX, actualY, false);
                markingActionCreator.onAnnotationDraw(true);
            } else if (element.id.indexOf('annotationoverlay') >= 0) {
                // If the stamp is on the annotation overlay, check two things:
                // (i)  If the annotation overlaps another
                // (ii) If the mouse cursor is currently inside an image zone or not
                let left = actualX - element.getBoundingClientRect().left;
                let top = actualY - element.getBoundingClientRect().top;

                // While dragging If the annotation boundary in the cursor is overlapping with another display strike through cursor
                isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType,
                    element, actualX, actualY, this.annotationOverlayClass);

                // if dynamic annotation overlaps on static annotaion then we don't need to show the no drop cursor
                if (selectedStamp.stampType === enums.StampType.dynamic && isAnnotationOverlaps) {
                    isAnnotationOverlaps = false;
                }

                // If the mouse position is currently outside the grey area

                let displayAngle = responseStore.instance.displayAnglesOfCurrentResponse;
                let holderElement = htmlUtilities.findAncestor(element.parentElement, 'marksheet-holder');
                let id = ReactDom.findDOMNode(holderElement).id;
                let degreeOfRotation = displayAngle.get(id) === undefined ? 0 : displayAngle.get(id);
                let inGreyArea = annotationHelper.checkInGreyArea(actualX, actualY, degreeOfRotation,
                    false, element, element.parentElement, 0, true, null,
                    annotationHelper.getStitchedImageBoundary(element.parentElement, degreeOfRotation));

                let insideStitchedGap = annotationHelper.isAnnotationInsideStitchedImage(
                    annotationHelper.getStitchedImageBoundary(element.parentElement, degreeOfRotation),
                    degreeOfRotation, actualX, actualY);
                // This method will set the stamp cursor in devices (This will also works in desktops)
                this.setCursorPosition(
                    actualX,
                    actualY,
                    isAnnotationOverlaps || inGreyArea || !insideStitchedGap);
            } else {
                this.setCursorPosition(actualX, actualY, !isPannedOnDynamicAnnotation === true && !isPannedOnAcetate === true);
            }
        } else {

            let stampCursorXPos = toolbarStore.instance.panStampId > 0 ? actualX : -1;
            let stampCursorYPos = toolbarStore.instance.panStampId > 0 ? actualY : -1;
            this.setCursorPosition(stampCursorXPos, stampCursorYPos, toolbarStore.instance.panStampId > 0);
        }
    };


    private onWindowResize = () => {

        // Determining the maximum number of stamps that could be rendered
        // on the stamp panel favourite's section
        timerHelper.handleReactUpdatesOnWindowResize(() => {
            this.determineStampCountAndNoOfColumnsToRender();
        });
        // Trigger hide remove context menu annotation
        markingActionCreator.showOrHideRemoveContextMenu(false);
    };

    /**
     * This function subscribes to different events
     */
    private addEventListeners() {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        stampStore.instance.addListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        stampStore.instance.addListener(stampStore.StampStore.UPDATE_ANNOTATION_COLOR_STAMP, this.onStampUpdate);
        stampStore.instance.addListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED,
            this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_DESELECTED, this.onStampSelected);
        window.addEventListener('resize', this.onWindowResize);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onStampUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onStampUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onStampUpdate);

        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            responseSearchHelper.loadFavoriteStampForSelectedQig);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.ADD_NEW_BOOKMARK_EVENT, this.onBookmarkSelect);
        //The script was sliding when the user scrolls over the stamp panel in touch devices
        this.appendEventHandler(this.refs.stampPanel,
            'touchmove',
            this.onTouchMoveHandler,
            htmlUtilities.isTabletOrMobileDevice);
        this.appendEventHandler(this.refs.favoritesPanel,
                    'touchmove',
                    this.onFavoritesPanelTouchMoveHandler,
                    htmlUtilities.isTabletOrMobileDevice);
    }

    /**
     * This function removes all the event subscriptions
     */
    private removeEventListeners() {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        stampStore.instance.removeListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        stampStore.instance.removeListener(stampStore.StampStore.UPDATE_ANNOTATION_COLOR_STAMP, this.onStampUpdate);
        stampStore.instance.removeListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED,
            this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_DESELECTED, this.onStampSelected);
        window.removeEventListener('resize', this.onWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onStampUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onStampUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onStampUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            responseSearchHelper.loadFavoriteStampForSelectedQig);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.ADD_NEW_BOOKMARK_EVENT, this.onBookmarkSelect);
        //The script was sliding when the user scrolls over the stamp panel in touch devices
        this.removeEventHandler(this.refs.stampPanel,
            'touchmove',
            this.onTouchMoveHandler,
            htmlUtilities.isTabletOrMobileDevice);
        this.removeEventHandler(this.refs.favoritesPanel,
                    'touchmove',
                    this.onFavoritesPanelTouchMoveHandler,
                    htmlUtilities.isTabletOrMobileDevice);
    }

    /**
     * This function Refreshing the stamp panel after stamp property changed.
     */
    public onStampUpdate = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {

        return (
            <div id={this.props.id}
                ref={'stampPanel'}
                className={'marking-tools-panel collapsed'}
            >
                {this.renderMainStampsPanel()}
                {this.renderFavouriteStampsPanel()}
            </div >
        );
    }

    /**
     * This function renders the Overlay toolicons for open and pending response.
     */
    private renderOverlayPanel() {
        // No overlays in eBookmarking components
        if ((eCourseworkHelper && eCourseworkHelper.isECourseworkComponent) ||
            (!this.props.isOverlayAnnotationsVisible) ||
            !this.props.isStampPanelExpanded) {
            return null;
        } else {
            return (
                <OverlayPanel id='overlay_id' key='overlay_key' isResponseModeClosed={false}></OverlayPanel>);
        }
    }

    /**
     * This function renders the Main section of the Stamp Panel.
     */
    private renderMainStampsPanel() {

        // Creating the stamp icons to be rendered on the main panel
        let toRender = this.renderStampsOnTheMainPanel();

        return (
            <div className='icon-tray-left' aria-hidden='true' id='iconToolsTray'>

                <div className='icon-groups-wrap' id='mainpanel'
                ref={'stampMainPanel'}>
                    {this.renderOverlayPanel()}
                    {toRender}
                </div >
            </div>
        );
    }

    /**
     * This function creates the stamps to be rendered on the main panel
     */
    private renderStampsOnTheMainPanel() {

        if (!this.props.isStampPanelExpanded) {
            return null;
        }

        // Getting the stamps grouped by stamp type
        let groupedStamps = groupHelper.group(this.props.actualStampsCollection, grouperList.StampsGrouper, enums.GroupByField.stampType);

        // Getting the stamp types as key collection
        let groupedKeys = groupedStamps.keySeq();

        // Using sorting helper to sort the list based on the stamp types
        groupedKeys = sorthelper.sort(groupedKeys, comparerList.stampTypeComparer);

        // Loop through the keys and find the list of Stamps for the group.
        return groupedKeys.map((key: enums.StampType) => {

            // Get the Stamps for the group.
            let currentStampGroup = groupedStamps.get(key);

            currentStampGroup = (Immutable.List<stampData>(currentStampGroup)).sort((valueA: stampData, valueB: stampData) => {
                return valueA.name.localeCompare(valueB.name);
            }
            ).toList();


            // Get each Stamp for the group.
            let stampsList = currentStampGroup.map((stamp: stampData) => {

                /* hide rendering of seen annotation if its not assined for qig in structured component -.*/
                if (stamp.addedBySystem === true) {
                    return null;
                }
                return (
                    <li className={classNames('tool-wrap',
                        { 'selected': stamp.stampId === toolbarStore.instance.selectedStampId })}
                        key={stamp.name + '-mainpanel-iconContainer'}
                        id={stamp.name + '-mainpanel-iconContainer'}>
                        <a className='tool-link'
                            id={'toollink-mainpanel-stamp-' + stamp.stampId}
                            title={this.getStampTitle(stamp.stampId)}
                            onClick={this.onStampSelect
                                .bind(this, stamp.stampId, !(stamp.stampId === toolbarStore.instance.selectedStampId))}
                        >
                            {this.renderStamp(stamp, '-mainpanel')}
                        </a>
                    </li >
                );
            });

            let stampPanelStyle = classNames(
                { 'static-tools': key === enums.StampType.image },
                { 'dynamic-tools': key === enums.StampType.dynamic },
                { 'txt-tool-icons': key === enums.StampType.text },
                { 'dynamic-tools': key === enums.StampType.tools }
            );

            return (
                <ul id={'mainpanelul' + key} key={key} className={'icon-grouping ' + stampPanelStyle}>
                    {stampsList}
                </ul>
            );

        });
    }

    /**
     * This function renders the Favourites section of the Stamp Panel.
     */
    private renderFavouriteStampsPanel() {

        let classNameToApply = classNames('icon-tray-right',
            {
                'droping': this.isAnnotationOverFavouritePanel
            }
        );
        return (
            <div className={classNameToApply} id='righttrayicon'>
                <div className='exp-colp-mrking-tary'>
                    {this.renderExpandCollapseButton()}
                    <StampBanner
                        id='stamp-banner-hide-expanded-panel'
                        key='stamp-banner-hide-expanded-panel'
                        isAriaHidden={false}
                        selectedLanguage={this.props.selectedLanguage}
                        header='marking.response.annotation-toolbar-helper.header_customise'
                        message='marking.response.annotation-toolbar-helper.body-after-adding-stamp'
                        role='tooltip'
                        bannerType={enums.BannerType.ShrinkExpandedBanner} />
                </div>
                <div className='default-marking-tray' id='defaultmarkingtray' ref = {'favoritesPanel'} >
                    <ul className='marking-tool-tray clearfix' id='favouritepanel'>
                        {this.renderStampsOnTheFavouritesPanel()}
                        {this.renderAddToolIcon()}
                    </ul>
                </div >
            </div >
        );
    }

    /**
     * This function renders the expand/collapse button on the Stamp Panel
     */
    private renderExpandCollapseButton() {
        return (
            <a id={this.props.id + '_expanded_' + this.props.isStampPanelExpanded}
                href='javascript:void(0)'
                className='expandcollapselink'
                title=
                {
                    !this.props.isStampPanelExpanded ?
                        localeStore.instance.TranslateText(
                            'marking.response.annotations-toolbar.expand-button-tooltip')
                        :
                        localeStore.instance.TranslateText(
                            'marking.response.annotations-toolbar.collapse-button-tooltip')
                }
                aria-expanded='false'
                aria-controls='iconToolsTray'
                onClick={this.onStampPanelExpanded.bind(this, !this.props.isStampPanelExpanded)}>
                <span id='sprite-icon-arrow' className={classNames('sprite-icon exp-collapse-arrow',
                    { 'right': !this.props.isStampPanelExpanded },
                    { 'left': this.props.isStampPanelExpanded })}>stamp panel</span>
            </a>
        );
    }

    /**
     * This function renders the stamps in the Favourites section of the Stamp Panel.
     */
    private renderStampsOnTheFavouritesPanel() {
        let favouritesStampCollection:
            Immutable.List<stampData> = annotationHelper.getStampsWithCount(this.props.favouriteStampsCollection);

        return favouritesStampCollection.map((stampData: stampData) => {
            // Remove Panned Stamp before rendering it in new position
            //NOTE: since panned favourite annotation is removed, there should be another render to add it
            if (stampData.addedBySystem === true ||
                (this.panStampIdToUpdateFavouratePanel > 0
                    && this.panStampIdToUpdateFavouratePanel === stampData.stampId)) {
                // reset panned stamp id
                this.panStampIdToUpdateFavouratePanel = 0;
                return null;
            }
            return (

                <li className={classNames('tool-wrap',
                    { 'selected': stampData.stampId === toolbarStore.instance.selectedStampId })}
                    key={stampData.name + '-favouritepanel-iconContainer'}
                    id={stampData.name + '-favouritepanel-iconContainer'}>
                    <a className='tool-link'
                        id={'toollink-favouritepanel-stamp-' + stampData.stampId}
                        title={this.getStampTitle(stampData.stampId)}
                        onClick={this.onStampSelect
                            .bind(this, stampData.stampId, !(stampData.stampId === toolbarStore.instance.selectedStampId))}
                    >
                        <span id={'annotation-count-' + stampData.stampId} className='annotation-count'>
                            {stampData.count === 0 ? '' : stampData.count}
                        </span>
                        {this.renderStamp(stampData, '-favouritepanel')}
                    </a>
                </li >
            );
        });
    }

    /**
     * Create stamp based on the stamp data
     * @param groupIndex
     */
    private renderStamp(stampData: stampData, panelType: string) {

        if (stampData != null && stampData !== undefined) {
            switch (stampData.stampType) {
                case enums.StampType.image:
                    return (
                        <ImageStamp id={stampData.name + '-icon'}
                            uniqueId={stampData.stampId + panelType}
                            toolTip={this.getStampTitle(stampData.stampId)}
                            key={stampData.name + '-icon'}
                            stampData={stampData}
                            isVisible={true}
                            selectedLanguage={this.props.selectedLanguage} />
                    );
                case enums.StampType.dynamic:
                    return (
                        <DynamicStamp id={stampData.name + '-icon'}
                            uniqueId={stampData.stampId + panelType}
                            toolTip={this.getStampTitle(stampData.stampId)}
                            key={stampData.name + '-icon'}
                            color={stampData.color}
                            stampData={stampData}
                            isVisible={true}
                            selectedLanguage={this.props.selectedLanguage} />
                    );
                case enums.StampType.text:
                    return (
                        <TextStamp id={stampData.name + '-icon'}
                            uniqueId={stampData.stampId + panelType}
                            toolTip={this.getStampTitle(stampData.stampId)}
                            key={stampData.name + '-icon'}
                            stampData={stampData}
                            isVisible={true}
                            selectedLanguage={this.props.selectedLanguage} />
                    );
                case enums.StampType.tools:
                    return (
                        <ToolsStamp id={stampData.name + '-icon'}
                            uniqueId={stampData.stampId + panelType}
                            toolTip={this.getStampTitle(stampData.stampId)}
                            key={stampData.name + '-icon'}
                            stampData={stampData}
                            isVisible={true}
                            selectedLanguage={this.props.selectedLanguage} />
                    );
            }
        }

        return null;
    }

    /**
     * Returns the stamp tool tip
     * @param {number} stampId
     * @returns Stamp tooltip
     */
    private getStampTitle(stampId: number): string {

        // For onpage comment, the stamp which displayed on stamp panel has different title
        // other than the one added on the image.
        if (stampId === enums.DynamicAnnotation.OnPageComment) {
            return localeStore.instance.TranslateText('marking.response.stamps.on-page-comment-tooltip');
        }
        return localeStore.instance.TranslateText('marking.response.stamps.stamp_' + stampId);
    }

    /**
     * This function renders the Add Tool icon in the Favourites section of the Stamp Panel
     */
    private renderAddToolIcon() {
        return (
            <li className='tool-wrap add-tool-wrap'
                id='wrapperli-favouritepanel-addtoollink'>
                <a href='javascript:void(0)'
                    title={
                        localeStore.instance.TranslateText(
                            'marking.response.annotations-toolbar.plus-button-tooltip')
                    }
                    className='tool-link add-tool-link'
                    id='toollink-favouritepanel-addtoollink'
                    onClick={this.onStampPanelExpanded.bind(this, true)}>
                    <span id='favouritepaneladdicon' className='svg-icon'>
                        <svg viewBox='0 0 40 40' className='plus-icon'>
                            <use xlinkHref='#plus-icon'>Favourite Panel</use>
                        </svg>
                    </span>
                </a>
                <StampBanner
                    id='stamp-banner-customize-tool-bar'
                    key='stamp-banner-customize-tool-bar'
                    isAriaHidden={false}
                    selectedLanguage={this.props.selectedLanguage}
                    header='marking.response.annotation-toolbar-helper.header'
                    message={'marking.response.annotation-toolbar-helper.body-before-adding-stamp'}
                    role='tooltip'
                    bannerType={enums.BannerType.CustomizeToolBarBanner} />
            </li >
        );
    }

    /**
     * This function is called on expanding/collapsing the stamp toolbar.
     */
    private onStampPanelExpanded(isExpanded: boolean, event: Event) {
        // Disable collapse button when favorite toolbar panel is empty.
        if (stampStore.instance.isFavouriteToolbarEmpty
            && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner) {
            return false;
        }

        this.setState({
            renderedOn: Date.now()
        });

        toolbarActionCreator.ChangeStampPanelMode(isExpanded);
        // not to close on page comment while collapsing the stamp panel. This is propogated to toolbarpanel clickhandler
        if (isExpanded === false) {
            event.stopPropagation();
        }
    }

    /**
     * This function helps in determining the maximum number of stamps that could be rendered
     * on the stamp panel favourite's section and number of columns in the favourite toolbar to display.
     */
    private determineStampCountAndNoOfColumnsToRender() {
        let numberOfStampsInFavouriteToolBar: number = stampStore.instance.getFavoriteStamps().size;
        let element = ReactDom.findDOMNode(this);
        // we will reduce the arrow portion height from element height.
        // total number of stamps in favourite tool bar = total no of favourite stamps + add tool stamp ( plus sign stamp inside the circle)
        this.stampsCountToBeRenderedInSingleColumn =
            parseInt(((element.clientHeight - constant.DEFAULT_COLLAPSE_PANEL_HEIGHT) / constant.DEFAULT_STAMP_HEIGHT).toString());
        this.numberOfColumnsInFavouriteToolBar = numberOfStampsInFavouriteToolBar === 0 || this.stampsCountToBeRenderedInSingleColumn === 0
            ? 1 : Math.ceil((numberOfStampsInFavouriteToolBar + 1) / this.stampsCountToBeRenderedInSingleColumn);
        // calling callback function.
        this.props.setNumberOfColumnsInFavouriteToolBar(this.numberOfColumnsInFavouriteToolBar);
    }

    /**
     * Method to be invoked on clicking a stamp
     */
    private onStampSelect = (stampId: number, isSelected: boolean): void => {
        toolbarActionCreator.SelectStamp(stampId, isSelected);
    };
    /**
     * Method to be invoked on clicking a bookmark
     */
    private onBookmarkSelect = (): void => {
        let selectedStampId = toolbarStore.instance.selectedStampId;
        toolbarActionCreator.SelectStamp(selectedStampId, false);
    }

    /**
     * Called when an annotation is added
     * @param stampId stamptypeid
     * @param annotationWithDefaultWidthOrHeight annotationWithDefaultWidthOrHeight
     */
    private onAnnotationAdded = (stampId: number, addAnnotationAction: enums.AddAnnotationAction): void => {
        let favouriteStampsCollection = stampStore.instance.getFavoriteStamps();
        let isStampFromFavourate = favouriteStampsCollection.filter((x: stampData) => x.stampId === stampId).count() > 0;
        if (!isStampFromFavourate) {
            // If stamp an annottaion from toolbar,then deselect it from panel
            if (addAnnotationAction === enums.AddAnnotationAction.Stamping) {
                toolbarActionCreator.SelectStamp(stampId, false);
            }
        } else {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Called when an annotation is updated
     * @param stampId stamptypeid
     */
    private onAnnotationUpdated(draggedAnnotationClientToken: string, isPositionUpdated: boolean,
        isDrawEndOfStampFromStampPanel: boolean, stampId: number): void {
        if (isDrawEndOfStampFromStampPanel) {
            toolbarActionCreator.SelectStamp(stampId, false);
        }
    }

    /**
     * Method to be invoked once the stamp is selected/deselected and stored in the store
     */
    private onStampSelected = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method which sets the correct cursor position
     * @param canDelete
     * @param xPos
     * @param yPos
     */
    private setCursorPosition(xPos: number, yPos: number, resetCursor: boolean) {
        responseActionCreator.setMousePosition(resetCursor ? -1 : xPos, resetCursor ? -1 : yPos);
        markingActionCreator.onAnnotationDraw(!resetCursor);
    }

    /**
     * Handle pan end on favorite panel
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} stampId
     * @param {boolean} hasPanedFromFavoritesPanel
     */
    private handlePanEndOnFavPanel(xPos: number, yPos: number, stampId: number, hasPanedFromFavoritesPanel: boolean): boolean {
        //return variable to mention if no updation on favourite panel
        let updationOnFavouriteStampsCollection = true;
        // proximity search 20px is half of the width of the stamp.
        let element: Element = htmlUtilities.getElementFromPosition(xPos, yPos + 20);
        // To handle edge cases, if the element is found to be undefined, get the element
        // at the given x and y position
        if (element === undefined || element == null) {
            element = htmlUtilities.getElementFromPosition(xPos, yPos);
        }

        if (element.id.indexOf('favouritepanel') === 0 ||
            element.id.indexOf('righttrayicon') === 0 ||
            element.id.indexOf('defaultmarkingtray') === 0
        ) {
            if (hasPanedFromFavoritesPanel) {
                if (element.id.indexOf('favouritepanel') !== 0) {
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Insert,
                        stampId, null, this.props.favouriteStampsCollection.last().stampId);
                } else {
                    updationOnFavouriteStampsCollection = false;
                }
            } else {
                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add,
                    stampId);
            }
        } else {
            this.handlePanEndOnOtherAreas(element.id, stampId);
        }
        return updationOnFavouriteStampsCollection;
    }

    /**
     * Handles scenarios where the pan end happened over other areas.
     * @param {string} elementId
     * @param {number} stampId
     */
    private handlePanEndOnOtherAreas(elementId: string, stampId: number) {
        if (elementId !== undefined) {
            let substrings = elementId.split('-');

            switch (substrings[1]) {
                case 'mainpanel':
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Remove,
                        stampId);
                    break;
                case 'favouritepanel':
                    let insertedOverStampId: number = isNaN(parseInt(substrings[0])) ? parseInt(substrings[3]) : parseInt(substrings[0]);
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Insert,
                        stampId, null, insertedOverStampId);
                    break;
            }
        }
    }

    /**
     * On favorite stamp list updated (added or removed icon)
     */
    private favoriteStampListUpdated = (favoriteStampActionType: enums.FavoriteStampActionType): void => {
        if (favoriteStampActionType !== enums.FavoriteStampActionType.LoadFromUserOption) {
            // Call user option save.
            userOptionsHelper.save(userOptionKeys.REMEMBER_CHOSEN_STAMPS,
                stampStore.instance.favouriteStampsToSave, true, true, false, true, markingStore.instance.selectedQIGExaminerRoleId);
        }

        this.determineStampCountAndNoOfColumnsToRender();
        // re-rendering stamp panel to update the favourite annotation tool panel
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * In touch devices when sliding up/down in the stamp panel, response script will also slide up and down. This event handler
     * will block that default behavior
     */
    private onTouchMoveHandler = (event: any) => {
        // If currently a user pans over annotation toolbar, then the scroll action on the annotation toolbar should be blocked
        // The user should be able to scroll if the element is scrollable
         if ((this.refs.stampMainPanel.clientHeight === this.refs.stampMainPanel.scrollHeight) ||
                                                                                this.pannedStampId > 0) {
             event.preventDefault();
         }
    };

    /**
     * In touch devices when sliding up/down in the favorites panel, response script will also slide up and down. This event handler
     * will block that default behavior
     */
    private onFavoritesPanelTouchMoveHandler = (event: any) => {
        // If currently a user pans over annotation toolbar, then the scroll action on the annotation toolbar should be blocked
        event.preventDefault();
    };

    /**
     * On stamp banner visibility mode updated event, we are not using isBannerVisible variable here but provided for a generic approach.
     */
    private onStampBannerVisibilityModeUpdated = (stampBannerType: enums.BannerType, isBannerVisibile: boolean): void => {
        // Disables marking overlay div when fav toolbar have annotations.
        if (!stampStore.instance.isFavouriteToolbarEmpty && stampBannerType === enums.BannerType.ShrinkExpandedBanner
            && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
            this.props.doDisableMarkingOverlay();
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * On PAN_CANCEL event, the pancancelaction should trigger
     */
    private onPanCancel = (): void => {
        markingActionCreator.panCancelAction();
    };
}

export = StampPanel;