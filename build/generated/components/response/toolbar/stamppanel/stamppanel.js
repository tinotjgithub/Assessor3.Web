"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ReactDom = require('react-dom');
var toolbarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
var ImageStamp = require('../../annotations/static/imagestamp');
var DynamicStamp = require('./stamptype/dynamicstamp');
var TextStamp = require('../../annotations/static/textstamp');
var ToolsStamp = require('../../annotations/static/toolsstamp');
var localeStore = require('../../../../stores/locale/localestore');
var Immutable = require('immutable');
var stampStore = require('../../../../stores/stamp/stampstore');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var enums = require('../../../utility/enums');
var sorthelper = require('../../../../utility/sorting/sorthelper');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var groupHelper = require('../../../../utility/grouping/grouphelper');
var grouperList = require('../../../../utility/grouping/groupingbase/grouperlist');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
var userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var responseActionCreator = require('../../../../actions/response/responseactioncreator');
var markingStore = require('../../../../stores/marking/markingstore');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var StampBanner = require('./stampbanner/stampbanner');
var constant = require('../../../utility/constants');
var classNames = require('classnames');
var eventTypes = require('../../../base/eventmanager/eventtypes');
var eventManagerBase = require('../../../base/eventmanager/eventmanagerbase');
var deviceHelper = require('../../../../utility/touch/devicehelper');
var responseStore = require('../../../../stores/response/responsestore');
var direction = require('../../../base/eventmanager/direction');
var timerHelper = require('../../../../utility/generic/timerhelper');
var eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var OverlayPanel = require('./acetate/overlaypanel');
var responseSearchHelper = require('../../../../utility/responsesearch/responsesearchhelper');
/**
 * React component class for Stamp Panel.
 */
var StampPanel = (function (_super) {
    __extends(StampPanel, _super);
    /**
     * Constructor for stamp panel
     * @param props
     */
    function StampPanel(props) {
        var _this = this;
        _super.call(this, props, null);
        this.stampsCountToBeRenderedInSingleColumn = 0;
        this.numberOfColumnsInFavouriteToolBar = 1;
        this.cursorDivStyle = { 'top': 0, 'left': 0 };
        this.annotationOverlayClass = 'annotation-holder';
        this.isAnnotationOverFavouritePanel = false;
        // variable to hold Panned Stamp ID to update favuouritepanel. Fix for issue #51324. missing annotation in IE
        // Remove panned stamp id from the favourite list before adding it again in new position
        this.panStampIdToUpdateFavouratePanel = 0;
        // This variable will hold the panned stampId
        this.pannedStampId = 0;
        // Pan threshold
        this.PAN_THRESHOLD = 15;
        this.PRESS_DELAY = 10;
        /* press event for stamp panel */
        this.onPress = function (event) {
            _this.setPannedStamp(event);
        };
        /**
         * This will call on pan start in stamp panel
         * @param evnt: Custom event type
         */
        this.onPanStart = function (event) {
            // setting panned stamp id using pan start
            _this.setPannedStamp(event);
            if (_this.pannedStampId > 0) {
                // Hide context menu while dragging
                markingActionCreator.showOrHideRemoveContextMenu(false);
                stampActionCreator.showOrHideComment(false);
                // Close Bookmark Name Entry Box
                stampActionCreator.showOrHideBookmarkNameBox(false);
                if (_this.pannedStampId > 0) {
                    event.preventDefault();
                    toolbarActionCreator.PanStamp(_this.pannedStampId);
                }
            }
        };
        /**
         * This will call on pan end in stamp panel
         * @param evnt: Custom event type
         */
        this.onPanEnd = function (event) {
            if (_this.pannedStampId > 0) {
                var xPos = event.changedPointers[0].clientX;
                var yPos = event.changedPointers[0].clientY;
                var stampId_1 = _this.pannedStampId;
                // reset the paned stampId
                _this.pannedStampId = 0;
                // set false if updateFavoriteStampCollection action not called
                // To handle different scenarios where favourite annotation panel is not updated
                var updationOnFavouriteStampCollection = true;
                var element = htmlUtilities.getElementFromPosition(xPos, yPos);
                var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
                var isPannedOnAcetate = annotationHelper.isAcetate(element);
                if (isPannedOnDynamicAnnotation || isPannedOnAcetate) {
                    // find the annotation holder of the current element
                    element = annotationHelper.findAnnotationHolderOfAnElement(element);
                }
                if (element) {
                    var elementId = void 0;
                    // find the id of parent element with classname 'icon-tray-left'
                    elementId = htmlUtilities.findAncestor(element, 'icon-tray-left').id;
                    markingActionCreator.panEndAction(stampId_1, xPos, yPos, element == null ? '' : element.id, enums.PanSource.StampPanel, false, false);
                    responseActionCreator.setMousePosition(0, 0);
                    var favList = _this.props.favouriteStampsCollection;
                    var hasPanedFromFavoritesPanel = favList.filter(function (x) { return x.stampId === stampId_1; }).count() > 0;
                    switch (elementId) {
                        case 'iconToolsTray':
                            stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Remove, stampId_1);
                            stampActionCreator.setFocusOnMarkEntrytextbox();
                            break;
                        case 'favouritepanel':
                        case 'righttrayicon':
                        case 'defaultmarkingtray':
                        case 'favouritepaneladdicon':
                            updationOnFavouriteStampCollection = _this.handlePanEndOnFavPanel(xPos, yPos, stampId_1, hasPanedFromFavoritesPanel);
                            stampActionCreator.setFocusOnMarkEntrytextbox();
                            break;
                        case 'wrapperli-favouritepanel-addtoollink':
                            if (hasPanedFromFavoritesPanel) {
                                // Stamp From the Favorites Panel, Insert into the last position
                                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Insert, stampId_1, null, favList.last().stampId);
                            }
                            else {
                                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add, stampId_1);
                            }
                            stampActionCreator.setFocusOnMarkEntrytextbox();
                            break;
                        default:
                            _this.handlePanEndOnOtherAreas(elementId, stampId_1);
                            break;
                    }
                    markingActionCreator.onAnnotationDraw(true);
                }
                else {
                    markingActionCreator.panCancelAction();
                }
                if (_this.isAnnotationOverFavouritePanel) {
                    _this.isAnnotationOverFavouritePanel = false;
                    // Set panStampIdToUpdateFavouratePanel only if there is an updation in the favourite panel
                    if (updationOnFavouriteStampCollection) {
                        _this.panStampIdToUpdateFavouratePanel = toolbarStore.instance.panStampId;
                    }
                    _this.setState({
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
        this.onPanMove = function (event) {
            event.preventDefault();
            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;
            var element = htmlUtilities.getElementFromPosition(actualX, actualY);
            var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
            var isPannedOnAcetate = annotationHelper.isAcetate(element);
            var isPanOnStampPanel = false;
            var isAnnotationOverlaps = false;
            // If an element exists and if an annotation is paned
            if (element != null && element !== undefined && toolbarStore.instance.panStampId > 0) {
                if (element.id.indexOf('favouritepanel') >= 0 ||
                    element.id.indexOf('defaultmarkingtray') >= 0) {
                    if (!_this.isAnnotationOverFavouritePanel) {
                        _this.isAnnotationOverFavouritePanel = true;
                        _this.setState({
                            renderedOn: Date.now()
                        });
                    }
                }
                else {
                    if (_this.isAnnotationOverFavouritePanel) {
                        _this.isAnnotationOverFavouritePanel = false;
                        _this.setState({
                            renderedOn: Date.now()
                        });
                    }
                }
                var selectedStamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);
                // First checking if the pan is performed inside the stamp panel on the stamps in the stamp panel
                isPanOnStampPanel = annotationHelper.isPanOnStampPanel(element, enums.PanSource.StampPanel);
                if (isPanOnStampPanel) {
                    // If the pan is on the stamp panel, set the cursor with the dragged stamp
                    _this.setCursorPosition(actualX, actualY, false);
                    markingActionCreator.onAnnotationDraw(true);
                }
                else if (element.id.indexOf('annotationoverlay') >= 0) {
                    // If the stamp is on the annotation overlay, check two things:
                    // (i)  If the annotation overlaps another
                    // (ii) If the mouse cursor is currently inside an image zone or not
                    var left = actualX - element.getBoundingClientRect().left;
                    var top_1 = actualY - element.getBoundingClientRect().top;
                    // While dragging If the annotation boundary in the cursor is overlapping with another display strike through cursor
                    isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType, element, actualX, actualY, _this.annotationOverlayClass);
                    // if dynamic annotation overlaps on static annotaion then we don't need to show the no drop cursor
                    if (selectedStamp.stampType === enums.StampType.dynamic && isAnnotationOverlaps) {
                        isAnnotationOverlaps = false;
                    }
                    // If the mouse position is currently outside the grey area
                    var displayAngle = responseStore.instance.displayAnglesOfCurrentResponse;
                    var holderElement = htmlUtilities.findAncestor(element.parentElement, 'marksheet-holder');
                    var id = ReactDom.findDOMNode(holderElement).id;
                    var degreeOfRotation = displayAngle.get(id) === undefined ? 0 : displayAngle.get(id);
                    var inGreyArea = annotationHelper.checkInGreyArea(actualX, actualY, degreeOfRotation, false, element, element.parentElement, 0, true, null, annotationHelper.getStitchedImageBoundary(element.parentElement, degreeOfRotation));
                    var insideStitchedGap = annotationHelper.isAnnotationInsideStitchedImage(annotationHelper.getStitchedImageBoundary(element.parentElement, degreeOfRotation), degreeOfRotation, actualX, actualY);
                    // This method will set the stamp cursor in devices (This will also works in desktops)
                    _this.setCursorPosition(actualX, actualY, isAnnotationOverlaps || inGreyArea || !insideStitchedGap);
                }
                else {
                    _this.setCursorPosition(actualX, actualY, !isPannedOnDynamicAnnotation === true && !isPannedOnAcetate === true);
                }
            }
            else {
                var stampCursorXPos = toolbarStore.instance.panStampId > 0 ? actualX : -1;
                var stampCursorYPos = toolbarStore.instance.panStampId > 0 ? actualY : -1;
                _this.setCursorPosition(stampCursorXPos, stampCursorYPos, toolbarStore.instance.panStampId > 0);
            }
        };
        this.onWindowResize = function () {
            // Determining the maximum number of stamps that could be rendered
            // on the stamp panel favourite's section
            timerHelper.handleReactUpdatesOnWindowResize(function () {
                _this.determineStampCountAndNoOfColumnsToRender();
            });
            // Trigger hide remove context menu annotation
            markingActionCreator.showOrHideRemoveContextMenu(false);
        };
        /**
         * This function Refreshing the stamp panel after stamp property changed.
         */
        this.onStampUpdate = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to be invoked on clicking a stamp
         */
        this.onStampSelect = function (stampId, isSelected) {
            toolbarActionCreator.SelectStamp(stampId, isSelected);
        };
        /**
         * Method to be invoked on clicking a bookmark
         */
        this.onBookmarkSelect = function () {
            var selectedStampId = toolbarStore.instance.selectedStampId;
            toolbarActionCreator.SelectStamp(selectedStampId, false);
        };
        /**
         * Called when an annotation is added
         * @param stampId stamptypeid
         * @param annotationWithDefaultWidthOrHeight annotationWithDefaultWidthOrHeight
         */
        this.onAnnotationAdded = function (stampId, addAnnotationAction) {
            var favouriteStampsCollection = stampStore.instance.getFavoriteStamps();
            var isStampFromFavourate = favouriteStampsCollection.filter(function (x) { return x.stampId === stampId; }).count() > 0;
            if (!isStampFromFavourate) {
                // If stamp an annottaion from toolbar,then deselect it from panel
                if (addAnnotationAction === enums.AddAnnotationAction.Stamping) {
                    toolbarActionCreator.SelectStamp(stampId, false);
                }
            }
            else {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Method to be invoked once the stamp is selected/deselected and stored in the store
         */
        this.onStampSelected = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * On favorite stamp list updated (added or removed icon)
         */
        this.favoriteStampListUpdated = function (favoriteStampActionType) {
            if (favoriteStampActionType !== enums.FavoriteStampActionType.LoadFromUserOption) {
                // Call user option save.
                userOptionsHelper.save(userOptionKeys.REMEMBER_CHOSEN_STAMPS, stampStore.instance.favouriteStampsToSave, true, true, false, true, markingStore.instance.selectedQIGExaminerRoleId);
            }
            _this.determineStampCountAndNoOfColumnsToRender();
            // re-rendering stamp panel to update the favourite annotation tool panel
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * In touch devices when sliding up/down in the stamp panel, response script will also slide up and down. This event handler
         * will block that default behavior
         */
        this.onTouchMoveHandler = function (event) {
            // If currently a user pans over annotation toolbar, then the scroll action on the annotation toolbar should be blocked
            // The user should be able to scroll if the element is scrollable
            if ((_this.refs.stampMainPanel.clientHeight === _this.refs.stampMainPanel.scrollHeight) ||
                _this.pannedStampId > 0) {
                event.preventDefault();
            }
        };
        /**
         * In touch devices when sliding up/down in the favorites panel, response script will also slide up and down. This event handler
         * will block that default behavior
         */
        this.onFavoritesPanelTouchMoveHandler = function (event) {
            // If currently a user pans over annotation toolbar, then the scroll action on the annotation toolbar should be blocked
            event.preventDefault();
        };
        /**
         * On stamp banner visibility mode updated event, we are not using isBannerVisible variable here but provided for a generic approach.
         */
        this.onStampBannerVisibilityModeUpdated = function (stampBannerType, isBannerVisibile) {
            // Disables marking overlay div when fav toolbar have annotations.
            if (!stampStore.instance.isFavouriteToolbarEmpty && stampBannerType === enums.BannerType.ShrinkExpandedBanner
                && responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
                _this.props.doDisableMarkingOverlay();
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * On PAN_CANCEL event, the pancancelaction should trigger
         */
        this.onPanCancel = function () {
            markingActionCreator.panCancelAction();
        };
        this.state = {
            renderedOn: 0
        };
        this.onTouchMoveHandler = this.onTouchMoveHandler.bind(this);
    }
    /**
     * This function gets called when the component is mounted
     */
    StampPanel.prototype.componentDidMount = function () {
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
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    StampPanel.prototype.componentWillUnmount = function () {
        // Removing subscription to the events
        this.removeEventListeners();
        // unregister events
        this.unRegisterEvents();
    };
    /**
     * This will setup events
     */
    StampPanel.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            var touchActionValue = deviceHelper.isTouchDevice() && !deviceHelper.isMSTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: this.PAN_THRESHOLD });
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.onPanCancel);
        }
    };
    /**
     * unregister events
     */
    StampPanel.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * sets the pan stamp
     * @param event
     */
    StampPanel.prototype.setPannedStamp = function (event) {
        // find the position of pan start for finding stamp element.
        var stampX = event.center.x - event.deltaX;
        var stampY = event.center.y - event.deltaY;
        // find the stamp element
        var element = htmlUtilities.getElementFromPosition(stampX, stampY);
        // get the stampId and stamp data if it has an element
        if (element) {
            this.pannedStampId = parseInt(element.getAttribute('data-stamp'));
        }
    };
    /**
     * This function subscribes to different events
     */
    StampPanel.prototype.addEventListeners = function () {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        stampStore.instance.addListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        stampStore.instance.addListener(stampStore.StampStore.UPDATE_ANNOTATION_COLOR_STAMP, this.onStampUpdate);
        stampStore.instance.addListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED, this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_DESELECTED, this.onStampSelected);
        window.addEventListener('resize', this.onWindowResize);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onStampUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onStampUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onStampUpdate);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.ADD_NEW_BOOKMARK_EVENT, this.onBookmarkSelect);
        //The script was sliding when the user scrolls over the stamp panel in touch devices
        this.appendEventHandler(this.refs.stampPanel, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isTabletOrMobileDevice);
        this.appendEventHandler(this.refs.favoritesPanel, 'touchmove', this.onFavoritesPanelTouchMoveHandler, htmlUtilities.isTabletOrMobileDevice);
    };
    /**
     * This function removes all the event subscriptions
     */
    StampPanel.prototype.removeEventListeners = function () {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        stampStore.instance.removeListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        stampStore.instance.removeListener(stampStore.StampStore.UPDATE_ANNOTATION_COLOR_STAMP, this.onStampUpdate);
        stampStore.instance.removeListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED, this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_DESELECTED, this.onStampSelected);
        window.removeEventListener('resize', this.onWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onStampUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onStampUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onStampUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onAnnotationUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.ADD_NEW_BOOKMARK_EVENT, this.onBookmarkSelect);
        //The script was sliding when the user scrolls over the stamp panel in touch devices
        this.removeEventHandler(this.refs.stampPanel, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isTabletOrMobileDevice);
        this.removeEventHandler(this.refs.favoritesPanel, 'touchmove', this.onFavoritesPanelTouchMoveHandler, htmlUtilities.isTabletOrMobileDevice);
    };
    /**
     * Render component
     * @returns
     */
    StampPanel.prototype.render = function () {
        return (React.createElement("div", {id: this.props.id, ref: 'stampPanel', className: 'marking-tools-panel collapsed'}, this.renderMainStampsPanel(), this.renderFavouriteStampsPanel()));
    };
    /**
     * This function renders the Overlay toolicons for open and pending response.
     */
    StampPanel.prototype.renderOverlayPanel = function () {
        // No overlays in eBookmarking components
        if ((eCourseworkHelper && eCourseworkHelper.isECourseworkComponent) ||
            (!this.props.isOverlayAnnotationsVisible) ||
            !this.props.isStampPanelExpanded) {
            return null;
        }
        else {
            return (React.createElement(OverlayPanel, {id: 'overlay_id', key: 'overlay_key', isResponseModeClosed: false}));
        }
    };
    /**
     * This function renders the Main section of the Stamp Panel.
     */
    StampPanel.prototype.renderMainStampsPanel = function () {
        // Creating the stamp icons to be rendered on the main panel
        var toRender = this.renderStampsOnTheMainPanel();
        return (React.createElement("div", {className: 'icon-tray-left', "aria-hidden": 'true', id: 'iconToolsTray'}, React.createElement("div", {className: 'icon-groups-wrap', id: 'mainpanel', ref: 'stampMainPanel'}, this.renderOverlayPanel(), toRender)));
    };
    /**
     * This function creates the stamps to be rendered on the main panel
     */
    StampPanel.prototype.renderStampsOnTheMainPanel = function () {
        var _this = this;
        if (!this.props.isStampPanelExpanded) {
            return null;
        }
        // Getting the stamps grouped by stamp type
        var groupedStamps = groupHelper.group(this.props.actualStampsCollection, grouperList.StampsGrouper, enums.GroupByField.stampType);
        // Getting the stamp types as key collection
        var groupedKeys = groupedStamps.keySeq();
        // Using sorting helper to sort the list based on the stamp types
        groupedKeys = sorthelper.sort(groupedKeys, comparerList.stampTypeComparer);
        // Loop through the keys and find the list of Stamps for the group.
        return groupedKeys.map(function (key) {
            // Get the Stamps for the group.
            var currentStampGroup = groupedStamps.get(key);
            currentStampGroup = (Immutable.List(currentStampGroup)).sort(function (valueA, valueB) {
                return valueA.name.localeCompare(valueB.name);
            }).toList();
            // Get each Stamp for the group.
            var stampsList = currentStampGroup.map(function (stamp) {
                /* hide rendering of seen annotation if its not assined for qig in structured component -.*/
                if (stamp.addedBySystem === true) {
                    return null;
                }
                return (React.createElement("li", {className: classNames('tool-wrap', { 'selected': stamp.stampId === toolbarStore.instance.selectedStampId }), key: stamp.name + '-mainpanel-iconContainer', id: stamp.name + '-mainpanel-iconContainer'}, React.createElement("a", {className: 'tool-link', id: 'toollink-mainpanel-stamp-' + stamp.stampId, title: _this.getStampTitle(stamp.stampId), onClick: _this.onStampSelect
                    .bind(_this, stamp.stampId, !(stamp.stampId === toolbarStore.instance.selectedStampId))}, _this.renderStamp(stamp, '-mainpanel'))));
            });
            var stampPanelStyle = classNames({ 'static-tools': key === enums.StampType.image }, { 'dynamic-tools': key === enums.StampType.dynamic }, { 'txt-tool-icons': key === enums.StampType.text }, { 'dynamic-tools': key === enums.StampType.tools });
            return (React.createElement("ul", {id: 'mainpanelul' + key, key: key, className: 'icon-grouping ' + stampPanelStyle}, stampsList));
        });
    };
    /**
     * This function renders the Favourites section of the Stamp Panel.
     */
    StampPanel.prototype.renderFavouriteStampsPanel = function () {
        var classNameToApply = classNames('icon-tray-right', {
            'droping': this.isAnnotationOverFavouritePanel
        });
        return (React.createElement("div", {className: classNameToApply, id: 'righttrayicon'}, React.createElement("div", {className: 'exp-colp-mrking-tary'}, this.renderExpandCollapseButton(), React.createElement(StampBanner, {id: 'stamp-banner-hide-expanded-panel', key: 'stamp-banner-hide-expanded-panel', isAriaHidden: false, selectedLanguage: this.props.selectedLanguage, header: 'marking.response.annotation-toolbar-helper.header_customise', message: 'marking.response.annotation-toolbar-helper.body-after-adding-stamp', role: 'tooltip', bannerType: enums.BannerType.ShrinkExpandedBanner})), React.createElement("div", {className: 'default-marking-tray', id: 'defaultmarkingtray', ref: 'favoritesPanel'}, React.createElement("ul", {className: 'marking-tool-tray clearfix', id: 'favouritepanel'}, this.renderStampsOnTheFavouritesPanel(), this.renderAddToolIcon()))));
    };
    /**
     * This function renders the expand/collapse button on the Stamp Panel
     */
    StampPanel.prototype.renderExpandCollapseButton = function () {
        return (React.createElement("a", {id: this.props.id + '_expanded_' + this.props.isStampPanelExpanded, href: 'javascript:void(0)', className: 'expandcollapselink', title: !this.props.isStampPanelExpanded ?
            localeStore.instance.TranslateText('marking.response.annotations-toolbar.expand-button-tooltip')
            :
                localeStore.instance.TranslateText('marking.response.annotations-toolbar.collapse-button-tooltip'), "aria-expanded": 'false', "aria-controls": 'iconToolsTray', onClick: this.onStampPanelExpanded.bind(this, !this.props.isStampPanelExpanded)}, React.createElement("span", {id: 'sprite-icon-arrow', className: classNames('sprite-icon exp-collapse-arrow', { 'right': !this.props.isStampPanelExpanded }, { 'left': this.props.isStampPanelExpanded })}, "stamp panel")));
    };
    /**
     * This function renders the stamps in the Favourites section of the Stamp Panel.
     */
    StampPanel.prototype.renderStampsOnTheFavouritesPanel = function () {
        var _this = this;
        var favouritesStampCollection = annotationHelper.getStampsWithCount(this.props.favouriteStampsCollection);
        return favouritesStampCollection.map(function (stampData) {
            // Remove Panned Stamp before rendering it in new position
            //NOTE: since panned favourite annotation is removed, there should be another render to add it
            if (stampData.addedBySystem === true ||
                (_this.panStampIdToUpdateFavouratePanel > 0
                    && _this.panStampIdToUpdateFavouratePanel === stampData.stampId)) {
                // reset panned stamp id
                _this.panStampIdToUpdateFavouratePanel = 0;
                return null;
            }
            return (React.createElement("li", {className: classNames('tool-wrap', { 'selected': stampData.stampId === toolbarStore.instance.selectedStampId }), key: stampData.name + '-favouritepanel-iconContainer', id: stampData.name + '-favouritepanel-iconContainer'}, React.createElement("a", {className: 'tool-link', id: 'toollink-favouritepanel-stamp-' + stampData.stampId, title: _this.getStampTitle(stampData.stampId), onClick: _this.onStampSelect
                .bind(_this, stampData.stampId, !(stampData.stampId === toolbarStore.instance.selectedStampId))}, React.createElement("span", {id: 'annotation-count-' + stampData.stampId, className: 'annotation-count'}, stampData.count === 0 ? '' : stampData.count), _this.renderStamp(stampData, '-favouritepanel'))));
        });
    };
    /**
     * Create stamp based on the stamp data
     * @param groupIndex
     */
    StampPanel.prototype.renderStamp = function (stampData, panelType) {
        if (stampData != null && stampData !== undefined) {
            switch (stampData.stampType) {
                case enums.StampType.image:
                    return (React.createElement(ImageStamp, {id: stampData.name + '-icon', uniqueId: stampData.stampId + panelType, toolTip: this.getStampTitle(stampData.stampId), key: stampData.name + '-icon', stampData: stampData, isVisible: true, selectedLanguage: this.props.selectedLanguage}));
                case enums.StampType.dynamic:
                    return (React.createElement(DynamicStamp, {id: stampData.name + '-icon', uniqueId: stampData.stampId + panelType, toolTip: this.getStampTitle(stampData.stampId), key: stampData.name + '-icon', color: stampData.color, stampData: stampData, isVisible: true, selectedLanguage: this.props.selectedLanguage}));
                case enums.StampType.text:
                    return (React.createElement(TextStamp, {id: stampData.name + '-icon', uniqueId: stampData.stampId + panelType, toolTip: this.getStampTitle(stampData.stampId), key: stampData.name + '-icon', stampData: stampData, isVisible: true, selectedLanguage: this.props.selectedLanguage}));
                case enums.StampType.tools:
                    return (React.createElement(ToolsStamp, {id: stampData.name + '-icon', uniqueId: stampData.stampId + panelType, toolTip: this.getStampTitle(stampData.stampId), key: stampData.name + '-icon', stampData: stampData, isVisible: true, selectedLanguage: this.props.selectedLanguage}));
            }
        }
        return null;
    };
    /**
     * Returns the stamp tool tip
     * @param {number} stampId
     * @returns Stamp tooltip
     */
    StampPanel.prototype.getStampTitle = function (stampId) {
        // For onpage comment, the stamp which displayed on stamp panel has different title
        // other than the one added on the image.
        if (stampId === enums.DynamicAnnotation.OnPageComment) {
            return localeStore.instance.TranslateText('marking.response.stamps.on-page-comment-tooltip');
        }
        return localeStore.instance.TranslateText('marking.response.stamps.stamp_' + stampId);
    };
    /**
     * This function renders the Add Tool icon in the Favourites section of the Stamp Panel
     */
    StampPanel.prototype.renderAddToolIcon = function () {
        return (React.createElement("li", {className: 'tool-wrap add-tool-wrap', id: 'wrapperli-favouritepanel-addtoollink'}, React.createElement("a", {href: 'javascript:void(0)', title: localeStore.instance.TranslateText('marking.response.annotations-toolbar.plus-button-tooltip'), className: 'tool-link add-tool-link', id: 'toollink-favouritepanel-addtoollink', onClick: this.onStampPanelExpanded.bind(this, true)}, React.createElement("span", {id: 'favouritepaneladdicon', className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 40 40', className: 'plus-icon'}, React.createElement("use", {xlinkHref: '#plus-icon'}, "Favourite Panel")))), React.createElement(StampBanner, {id: 'stamp-banner-customize-tool-bar', key: 'stamp-banner-customize-tool-bar', isAriaHidden: false, selectedLanguage: this.props.selectedLanguage, header: 'marking.response.annotation-toolbar-helper.header', message: 'marking.response.annotation-toolbar-helper.body-before-adding-stamp', role: 'tooltip', bannerType: enums.BannerType.CustomizeToolBarBanner})));
    };
    /**
     * This function is called on expanding/collapsing the stamp toolbar.
     */
    StampPanel.prototype.onStampPanelExpanded = function (isExpanded, event) {
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
    };
    /**
     * This function helps in determining the maximum number of stamps that could be rendered
     * on the stamp panel favourite's section and number of columns in the favourite toolbar to display.
     */
    StampPanel.prototype.determineStampCountAndNoOfColumnsToRender = function () {
        var numberOfStampsInFavouriteToolBar = stampStore.instance.getFavoriteStamps().size;
        var element = ReactDom.findDOMNode(this);
        // we will reduce the arrow portion height from element height.
        // total number of stamps in favourite tool bar = total no of favourite stamps + add tool stamp ( plus sign stamp inside the circle)
        this.stampsCountToBeRenderedInSingleColumn =
            parseInt(((element.clientHeight - constant.DEFAULT_COLLAPSE_PANEL_HEIGHT) / constant.DEFAULT_STAMP_HEIGHT).toString());
        this.numberOfColumnsInFavouriteToolBar = numberOfStampsInFavouriteToolBar === 0 || this.stampsCountToBeRenderedInSingleColumn === 0
            ? 1 : Math.ceil((numberOfStampsInFavouriteToolBar + 1) / this.stampsCountToBeRenderedInSingleColumn);
        // calling callback function.
        this.props.setNumberOfColumnsInFavouriteToolBar(this.numberOfColumnsInFavouriteToolBar);
    };
    /**
     * Called when an annotation is updated
     * @param stampId stamptypeid
     */
    StampPanel.prototype.onAnnotationUpdated = function (draggedAnnotationClientToken, isPositionUpdated, isDrawEndOfStampFromStampPanel, stampId) {
        if (isDrawEndOfStampFromStampPanel) {
            toolbarActionCreator.SelectStamp(stampId, false);
        }
    };
    /**
     * Method which sets the correct cursor position
     * @param canDelete
     * @param xPos
     * @param yPos
     */
    StampPanel.prototype.setCursorPosition = function (xPos, yPos, resetCursor) {
        responseActionCreator.setMousePosition(resetCursor ? -1 : xPos, resetCursor ? -1 : yPos);
        markingActionCreator.onAnnotationDraw(!resetCursor);
    };
    /**
     * Handle pan end on favorite panel
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} stampId
     * @param {boolean} hasPanedFromFavoritesPanel
     */
    StampPanel.prototype.handlePanEndOnFavPanel = function (xPos, yPos, stampId, hasPanedFromFavoritesPanel) {
        //return variable to mention if no updation on favourite panel
        var updationOnFavouriteStampsCollection = true;
        // proximity search 20px is half of the width of the stamp.
        var element = htmlUtilities.getElementFromPosition(xPos, yPos + 20);
        // To handle edge cases, if the element is found to be undefined, get the element
        // at the given x and y position
        if (element === undefined || element == null) {
            element = htmlUtilities.getElementFromPosition(xPos, yPos);
        }
        if (element.id.indexOf('favouritepanel') === 0 ||
            element.id.indexOf('righttrayicon') === 0 ||
            element.id.indexOf('defaultmarkingtray') === 0) {
            if (hasPanedFromFavoritesPanel) {
                if (element.id.indexOf('favouritepanel') !== 0) {
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Insert, stampId, null, this.props.favouriteStampsCollection.last().stampId);
                }
                else {
                    updationOnFavouriteStampsCollection = false;
                }
            }
            else {
                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add, stampId);
            }
        }
        else {
            this.handlePanEndOnOtherAreas(element.id, stampId);
        }
        return updationOnFavouriteStampsCollection;
    };
    /**
     * Handles scenarios where the pan end happened over other areas.
     * @param {string} elementId
     * @param {number} stampId
     */
    StampPanel.prototype.handlePanEndOnOtherAreas = function (elementId, stampId) {
        if (elementId !== undefined) {
            var substrings = elementId.split('-');
            switch (substrings[1]) {
                case 'mainpanel':
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Remove, stampId);
                    break;
                case 'favouritepanel':
                    var insertedOverStampId = isNaN(parseInt(substrings[0])) ? parseInt(substrings[3]) : parseInt(substrings[0]);
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Insert, stampId, null, insertedOverStampId);
                    break;
            }
        }
    };
    return StampPanel;
}(eventManagerBase));
module.exports = StampPanel;
//# sourceMappingURL=stamppanel.js.map