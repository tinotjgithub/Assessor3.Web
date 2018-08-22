"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var TableControl = require('../utility/table/tablewrapper');
var enums = require('../utility/enums');
var classNames = require('classnames');
var timerHelper = require('../../utility/generic/timerhelper');
var deviceHelper = require('../../utility/touch/devicehelper');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var eventTypes = require('../base/eventmanager/eventtypes');
var direction = require('../base/eventmanager/direction');
var tableHelper = require('../utility/table/tablehelper');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var DraggingRowHolder = require('../worklist/shared/draggingrowholder');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
var gridRow = require('../utility/grid/gridrow');
var immutable = require('immutable');
var qigStore = require('../../stores/qigselector/qigstore');
var stdSetupFactory = require('../../utility/standardisationsetup/standardisationsetupfactory');
var constants = require('../utility/constants');
var ROW_HEIGHT = 41;
var DRAGGING_ROW_HEIGHT = 86;
var PRESS_TIME_DELAY = 250;
/**
 * React wrapper component for Standardisation tables
 */
var StandardisationSetupTableWrapper = (function (_super) {
    __extends(StandardisationSetupTableWrapper, _super);
    /**
     * @constructor
     */
    function StandardisationSetupTableWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /*checks user action is swipe or pan*/
        this.isSwipe = false;
        this.isReclassifyPopupOpened = false;
        this.isManuallyScrolled = false;
        this.isAutoScrolled = false;
        this.prevPageY = 0;
        this.allowDrag = false;
        this.counter = 0;
        /**
         * on scroll on the STD Setup worklist set the scroll of the display IDs table
         * @param any
         */
        this.onScrollHandler = function (e) {
            if (_this.isAutoScrolled === false) {
                _this.isManuallyScrolled = true;
            }
            var tableScrollHolder = _this.refs.tableScrollHolder;
            var scrollTop = _this.refs.tableScrollHolder.scrollTop;
            var scrollleft = _this.refs.tableScrollHolder.scrollLeft;
            _this.refs.frozenTableHolder.scrollTop = scrollTop;
            _this.refs.headerScrollHolder.scrollLeft = scrollleft;
            _this.setScrollablevariable();
            _this.refs.standardisationSetupGridPanel.className = _this.getGridClass();
            if (_this.isAutoScrolled) {
                _this.isAutoScrolled = false;
            }
        };
        /**
         * Trigger on frozen column scroll.
         */
        this.onFrozenColumnScroll = function (e) {
            if (_this.isManuallyScrolled === false) {
                _this.refs.tableScrollHolder.scrollTop = _this.refs.frozenTableHolder.scrollTop;
                _this.isAutoScrolled = true;
            }
            if (_this.isManuallyScrolled) {
                _this.isManuallyScrolled = false;
            }
        };
        /**
         * on mouse wheel on the STD Setup worklist, set the scroll of the display IDs table
         * @param any
         */
        this.onMouseWheel = function (e) {
            _this.refs.tableScrollHolder.scrollTop = _this.refs.frozenTableHolder.scrollTop + e.deltaY;
            _this.setScrollablevariable();
            _this.refs.standardisationSetupGridPanel.className = _this.getGridClass();
        };
        /**
         * event handler for touch end
         * Reset the grid to remove styles added as part of Dragging/Droping
         */
        this.onTouchEnd = function (event) {
            _this.prevPageY = 0;
            _this.allowDrag = false;
            _this.onPanEnd(event);
        };
        /**
         * set the margins and css styles for diff divs and tables in worklist
         */
        this.setMarginsAndStyle = function () {
            // we need to recalculate the column widths in window resize
            _this.setColumnWidths();
            var tableScrollHolder = _this.refs.tableScrollHolder;
            if (_this.refs.frozenTableHolder) {
                _this.frozenHeadStyle = {};
            }
            if (tableScrollHolder) {
                var hScrollbarWidth = tableScrollHolder.offsetWidth - tableScrollHolder.clientWidth;
                var vScrollbarWidth = tableScrollHolder.offsetHeight - tableScrollHolder.clientHeight;
                _this.cssRowHeaderTableStyle = { marginRight: -hScrollbarWidth };
                _this.cssRowHeaderHeaderTableStyle = { marginRight: hScrollbarWidth };
                _this.cssContentWrapTableStyle = { paddingBottom: vScrollbarWidth, paddingRight: hScrollbarWidth };
                _this.cssBodyWrapTableStyle = { right: -hScrollbarWidth, bottom: -vScrollbarWidth };
                _this.cssFrozenTableStyle = (htmlUtilities.isEdge || htmlUtilities.isIE || htmlUtilities.isIE11) ?
                    { marginRight: -hScrollbarWidth, paddingRight: hScrollbarWidth } : { marginRight: -hScrollbarWidth };
                _this.setScrollablevariable();
                timerHelper.handleReactUpdatesOnWindowResize(function () {
                    _this.setState({
                        renderedOn: Date.now()
                    });
                });
            }
        };
        /* pressup event for annotation overlay */
        this.onPressUp = function (event) {
            if (_this.isClassificationWorklist) {
                _this.resetDraggableRow(false);
                _this.allowDrag = false;
            }
            event.preventDefault();
        };
        /**
         * event handler for touch start
         */
        this.onGridRowSelected = function (rowId) {
            if (_this.isClassificationWorklist) {
                _this.onSelectGridRow(rowId);
            }
        };
        /**
         * Method to drag grid row on touch devices.
         * @param event
         */
        this.onTouchHold = function (event) {
            event.srcEvent.stopPropagation();
            event.srcEvent.preventDefault();
            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;
            var yCoord = event.center.y;
            _this.allowDrag = true;
            if (_this.isClassificationWorklist && standardisationSetupStore.instance.
                stdSetupPermissionCCData.role.permissions.classify && _this.selectedDraggableRow) {
                _this.isDraggingEnabled = true;
                _this.onDraggingRow(actualX, actualY, yCoord);
                _this.setState({ renderedOn: Date.now });
            }
        };
        /**
         * This will call on pan start in stamp panel
         * @param event: Custom event type
         */
        this.onPanStart = function (event) {
            // allow dragging only if classify permission available.
            if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete &&
                _this.isClassificationWorklist &&
                standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.classify &&
                !deviceHelper.isTouchDevice() && _this.selectedDraggableRow) {
                _this.isDraggingEnabled = true;
                _this.allowDrag = true;
                event.preventDefault();
                _this.setState({ renderedOn: Date.now });
            }
        };
        /**
         * This method will call on panend event
         */
        this.onPanEnd = function (event) {
            if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete &&
                _this.isClassificationWorklist && standardisationSetupStore.instance.
                stdSetupPermissionCCData.role.permissions.classify) {
                var dropingRow = _this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; });
                var draggableRow = _this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('draggable') > -1; });
                if (dropingRow.count() > 0 && draggableRow.count() > 0) {
                    var draggableRowId = draggableRow.first().getRowId();
                    var isPlaceHolderRow = dropingRow.first().getRowStyle().indexOf('placeholder-row') > -1;
                    var droppingRowId = isPlaceHolderRow ?
                        _this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; }).first().getRowId() :
                        dropingRow.first().getRowId();
                    var isDroppedAfter = dropingRow.first().getRowStyle().indexOf('after') > -1 ? true : false;
                    // get the response details of dragged and dropped response.
                    _this.draggedOrDropedResponseDetails(draggableRowId, false, isPlaceHolderRow);
                    _this.draggedOrDropedResponseDetails(droppingRowId, true, isPlaceHolderRow, isDroppedAfter);
                    // Re order logic. move response within a classification type if previousMarkingModeId and current markink mode id s same
                    // else reclassify Logic. move from one classification type to another.
                    if (_this.previousMarkingModeId === _this.currentMarkingModeId) {
                        standardisationActionCreator.reorderResponse(draggableRowId.toString(), _this.previousMarkingModeId, _this.currentMarkingModeId, _this.candidateScriptId, _this.esCandidateScriptMarkGroupId, _this.newRigOrder, standardisationSetupStore.instance.markSchemeGroupId);
                    }
                    else if (_this.previousMarkingModeId !== _this.currentMarkingModeId) {
                        standardisationActionCreator.reclassifyPopupOpen(draggableRowId.toString(), _this.totalMark, _this.previousMarkingModeId, _this.currentMarkingModeId, _this.candidateScriptId, _this.esCandidateScriptMarkGroupId, _this.newRigOrder, standardisationSetupStore.instance.markSchemeGroupId, _this.oldRigOrder);
                    }
                }
                // If any rows being set as draggable, reset them.
                if (draggableRow.count() > 0) {
                    _this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('draggable') > -1; }).first().setRowStyle('row');
                    _this.gridRows.filter(function (x) { return x.getRowStyle().indexOf('draggable') > -1; }).first().setRowStyle('row');
                }
            }
            // Reset grid after dragging.
            _this.resetClassificationGrid();
        };
        /**
         * returns the grid class (for shadow)
         */
        this.getGridClass = function () {
            var gridClass = classNames('work-list-grid', { ' row-draggable': _this.isClassificationWorklist }, { 'scrolled-left': _this.isScrolledLeft === true }, { 'scrolled-right': _this.isScrolledRight === true }, { 'row-dragging': _this.isDraggingEnabled }, { 'allow-dragging': _this.isDraggingEnabled });
            return gridClass;
        };
        this.onSortClick = function (comparerName, sortDirection) {
            _this.props.onSortClick(comparerName, sortDirection);
        };
        this.setColumnWidths = function () {
            tableHelper.setColumnWidthsForTable(_this.props.getGridControlId(), 'frozenHeader_', 'rowHeader_');
            tableHelper.setColumnWidthsForTable(_this.props.getGridControlId(), 'columnHeader_', '');
        };
        /**
         * Method to set the scroll top.
         * @param event
         */
        this.onTouchStart = function (event) {
            // logic for calculating the displacement while dragging to next row.
            // Need to set the scroll top based on that.
            _this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
        };
        /**
         * Method to reset the grid by removing the classes added as part of dragging and dropping.
         */
        this.resetClassificationGrid = function () {
            if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete &&
                !_this.isReclassifyPopupOpened && _this.isClassificationWorklist) {
                // reset the grid and remove the classes added related to Dragging and dropping
                _this.resetDraggableRow(false);
            }
        };
        /**
         * Reset Draggable row on canceling the reclassify action
         */
        this.resetDraggableRow = function (isGridUpdateRequired) {
            _this.selectedDraggableRow = undefined;
            _this.refreshGrid(isGridUpdateRequired);
            _this.gridDragReset();
        };
        /**
         * Refresh grid when reclassify/declassify happens.
         */
        this.refreshGrid = function (isGridUpdateRequired) {
            _this.isGridUpdateRequired = isGridUpdateRequired;
            if (isGridUpdateRequired) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        // construct data here for classification worklist alone
        // part of refactoring
        if (this.isClassificationWorklist) {
            this.getClassificationGridRows();
        }
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onSwipeHandler = this.onSwipeHandler.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onPanStart = this.onPanStart.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.isScrolledLeft = true;
        this.isScrolledRight = true;
        this.onSortClick = this.onSortClick.bind(this);
        this.onFrozenColumnScroll = this.onFrozenColumnScroll.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.setReclassifyPopupOpenFlag = this.setReclassifyPopupOpenFlag.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchHold = this.onTouchHold.bind(this);
        this.setTableWrapperMarginsAndStyle = this.setTableWrapperMarginsAndStyle.bind(this);
    }
    /**
     * Render component
     */
    StandardisationSetupTableWrapper.prototype.render = function () {
        var gridId = this.props.getGridControlId();
        var rowId = this.selectedDraggableRow ? this.selectedDraggableRow.first().getRowId() : undefined;
        // if reclassification/Reordering occurred.
        if (this.isGridUpdateRequired) {
            this.getClassificationGridRows();
            this.isGridUpdateRequired = false;
        }
        var draggingRowHolder = this.isClassificationWorklist ?
            React.createElement(DraggingRowHolder, {id: gridId + 'draggable', key: gridId + 'draggable', rowId: rowId, selectedRow: this.selectedDraggableRow, renderedOn: this.props.renderedOn}) : null;
        return (React.createElement("div", {className: this.getGridClass(), id: gridId + 'Wrapper', style: this.cssRowHeaderTableStyle, ref: 'standardisationSetupGridPanel'}, draggingRowHolder, React.createElement("div", {className: 'table-header-wrap', id: 'tableHeaders', style: this.cssRowHeaderHeaderTableStyle}, React.createElement("div", {className: 'table-wrap-lt', ref: 'frozenHeader', style: this.frozenHeadStyle}, React.createElement(TableControl, {tableHeaderRows: this.props.frozenHeaderRows, gridStyle: this.getTableStyle(), id: 'frozenHeader_' + gridId, key: 'key_frozenHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'table-wrap-t'}, React.createElement("div", {className: 'header-scroll-holder', ref: 'headerScrollHolder'}, React.createElement(TableControl, {tableHeaderRows: this.props.columnHeaderRows, gridStyle: this.getTableStyle(), id: 'columnHeader_' + gridId, key: 'key_columnHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn, avoidLastColumn: this.isClassificationWorklist})), React.createElement("div", {className: 'drop-shadow'}, " "))), React.createElement("div", {className: 'table-content-wrap', ref: 'tableContentHolder', id: 'tableContent', style: this.cssContentWrapTableStyle}, React.createElement("div", {className: 'table-wrap-l', onWheel: this.onMouseWheel, onScroll: this.onFrozenColumnScroll}, React.createElement("div", {className: 'table-scroll-l', ref: 'frozenTableHolder', style: this.cssFrozenTableStyle}, React.createElement(TableControl, {tableBodyRows: this.isClassificationWorklist ? this.frozenBodyRows : this.props.frozenBodyRows, gridStyle: this.getTableStyle(), id: 'rowHeader_' + gridId, key: 'key_rowHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn, standardisationSetUpType: this.props.standardisationSetupType, onRowClick: this.props.onRowClick, selectedRowIdToDrag: rowId, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onTouchStart: this.onGridRowSelected}))), React.createElement("div", {className: 'table-body-wrap'}, React.createElement("div", {className: 'table-scroll-holder', style: this.cssBodyWrapTableStyle, ref: 'tableScrollHolder', onScroll: this.onScrollHandler}, React.createElement("div", {className: 'table-content-holder'}, React.createElement(TableControl, {tableBodyRows: this.isClassificationWorklist ? this.gridRows : this.props.gridRows, gridStyle: this.getTableStyle(), id: gridId, key: 'key_' + this.props.id, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn, onRowClick: this.props.onRowClick, avoidLastColumn: this.isClassificationWorklist, standardisationSetUpType: this.props.standardisationSetupType, selectedRowIdToDrag: rowId, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onTouchStart: this.onGridRowSelected}))), React.createElement("div", {className: 'drop-shadow'}, " ")))));
    };
    /**
     * Set Grid table style
     */
    StandardisationSetupTableWrapper.prototype.getTableStyle = function () {
        if (this.props.isBorderRequired) {
            return 'table-view';
        }
        else {
            return 'table-view no-border';
        }
    };
    /**
     * Trigger on swipe move.
     */
    StandardisationSetupTableWrapper.prototype.onSwipeHandler = function (event) {
        if (deviceHelper.isTouchDevice()) {
            this.isSwipe = true;
            /** To prevent event bubbling */
            event.srcEvent.preventDefault();
            var displacement = event.deltaY;
            this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - displacement;
        }
    };
    /**
     * Trigger on pan move.
     */
    StandardisationSetupTableWrapper.prototype.onPanMove = function (event) {
        event.preventDefault();
        if (!htmlUtilities.isAndroidChrome() && this.allowDrag) {
            var scrollTop = void 0;
            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;
            var yCoord = event.center.y;
            var displacement = event.deltaY;
            this.allowDragging(actualX, actualY, displacement, yCoord);
        }
    };
    /**
     * Method trigger on touch move.
     * @param event
     */
    StandardisationSetupTableWrapper.prototype.onTouchMove = function (event) {
        // Work only for android/chrome browser combination.
        // TO DO: Investigation needed why PAN Move cancel in android chrome device.
        // Introduced Touch Move event as PAN Move cancelled after initial move
        // Happened in android device alone.
        if (htmlUtilities.isAndroidChrome() && this.allowDrag) {
            event.preventDefault();
            var pageY = event.changedTouches[0].pageY;
            var actualX = event.changedTouches[0].clientX;
            var actualY = event.changedTouches[0].clientY;
            var displacement = this.prevPageY - pageY;
            this.prevPageY = pageY;
            this.allowDragging(actualX, actualY, displacement, pageY);
        }
    };
    /**
     * This method is seperately added to handle both PAN/Touch move events.
     * @param actualX
     * @param actualY
     * @param yCoord
     */
    StandardisationSetupTableWrapper.prototype.allowDragging = function (actualX, actualY, displacement, yCoord) {
        // Allow dragging only if classify permission available for the examiner.
        if (this.isClassificationWorklist && standardisationSetupStore.instance.
            stdSetupPermissionCCData.role.permissions.classify) {
            this.onDraggingRow(actualX, actualY, yCoord, displacement);
        }
    };
    /**
     * Method to handle the logic of dragging row over classififcation worklist.
     * @param event
     */
    StandardisationSetupTableWrapper.prototype.onDraggingRow = function (actualX, actualY, yCoord, displacement) {
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
            var draggingRow = htmlUtilities.getElementsByClassName('draggable');
            var draggingRowIndex = draggingRow.length > 0 ? draggingRow[0].getAttribute('id').split('_')[1] : -1;
            var gridTop = htmlUtilities.getElementsByClassName('grid-wrapper')[0].getBoundingClientRect().top;
            var gridBottom = Math.min(this.refs.frozenTableHolder.lastElementChild.getBoundingClientRect().bottom, htmlUtilities.getElementsByClassName('grid-wrapper')[0].getBoundingClientRect().bottom);
            var draggableRowTopPos = (gridTop + ROW_HEIGHT);
            var draggableRowBottomPos = (gridBottom - ROW_HEIGHT);
            // Logic to calculate scroll top when number of rows exceeded the grid size.
            if (displacement && Math.abs(displacement) > 2 && (draggableRowTopPos > yCoord || draggableRowBottomPos < yCoord)) {
                this.refs.tableScrollHolder.scrollTop = this.refs.tableScrollHolder.scrollTop + displacement;
            }
            // Getting the element at the current cursor position
            var element = htmlUtilities.getElementFromPosition(actualX, actualY);
            var row = htmlUtilities.findAncestor(element, 'row');
            if (row) {
                // Logic to calculate scroll top when number of rows exceeded the grid size.
                // add/minus displacement based on grid top/bottom.
                if (displacement && Math.abs(displacement) > 2 &&
                    (draggableRowTopPos > yCoord || draggableRowBottomPos < yCoord)) {
                    if (draggableRowTopPos > yCoord) {
                        displacement = -ROW_HEIGHT;
                    }
                    else if (draggableRowBottomPos < yCoord) {
                        displacement = ROW_HEIGHT;
                    }
                    this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop + displacement;
                }
                // if any draggable row available, set its row style.
                if (draggingRowIndex !== -1) {
                    this.frozenBodyRows.toArray()[draggingRowIndex].setRowStyle('row draggable');
                    this.gridRows.toArray()[draggingRowIndex].setRowStyle('row draggable');
                }
                // Update the position of draagable row element on pan move.
                var offsetTop = yCoord - gridTop - (ROW_HEIGHT / 2);
                standardisationActionCreator.setMousePosition(offsetTop);
                var dropIndex = row ? row.rowIndex : -1;
                var className = '';
                // Avoid dragging beyond the grid
                if (yCoord <= gridBottom) {
                    var droppingRow = this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; });
                    // Reset the classifcation grid before applying the row styles.
                    if (droppingRow.count() > 0) {
                        var rowStyle = row.classList.contains('placeholder-row') ? 'row placeholder-row' :
                            (row.classList.contains('warning-alert') ? 'row warning-alert' : 'row');
                        this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; }).first().setRowStyle(rowStyle);
                        this.gridRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; }).first().setRowStyle(rowStyle);
                    }
                    // exclude classification header rows from droping.pa
                    if (row && !row.classList.contains('classify-items-row') && dropIndex !== -1) {
                        var currentRowStyle = void 0;
                        // add class 'droping' to the dropping row(frozen and un frozen).
                        if (this.frozenBodyRows.toArray()[dropIndex] && this.gridRows.toArray()[dropIndex]) {
                            currentRowStyle = this.frozenBodyRows.toArray()[dropIndex].getRowStyle();
                            var dropingRowStyle = currentRowStyle.indexOf('droping') > -1 ? currentRowStyle : (currentRowStyle + ' droping');
                            this.frozenBodyRows.toArray()[dropIndex].setRowStyle(dropingRowStyle);
                            this.gridRows.toArray()[dropIndex].setRowStyle(dropingRowStyle);
                        }
                        // find the position where we have to drop the response.
                        //  either before or after.
                        var dropingRowElement = htmlUtilities.getElementFromPosition(actualX, actualY);
                        var dropedRow = htmlUtilities.findAncestor(dropingRowElement, 'row');
                        if (dropedRow) {
                            var dropPoint = yCoord - dropedRow.getBoundingClientRect().top;
                            className = dropPoint > (DRAGGING_ROW_HEIGHT / 2) ? ' after' : ' before';
                            droppingRow = this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; });
                            if (droppingRow.count() > 0) {
                                currentRowStyle = droppingRow.first().getRowStyle();
                                var dropPosStyle = currentRowStyle.indexOf(className) > -1 ? currentRowStyle : (currentRowStyle + className);
                                this.frozenBodyRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; }).first().setRowStyle(dropPosStyle);
                                this.gridRows.filter(function (x) { return x.getRowStyle().indexOf('droping') > -1; }).first().setRowStyle(dropPosStyle);
                            }
                        }
                    }
                    else {
                        this.isGridUpdateRequired = true;
                    }
                    this.setState({ renderedOn: Date.now() });
                }
                else {
                    // reset the grid.
                    this.resetDraggableRow(true);
                }
            }
            else {
                // reset the grid.
                this.resetDraggableRow(false);
            }
        }
    };
    /**
     * This will setup events
     */
    StandardisationSetupTableWrapper.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this.refs.tableContentHolder);
        if (element && !this.eventHandler.isInitialized) {
            var touchActionValue = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            var threshold = deviceHelper.isTouchDevice() ? constants.PAN_THRESHOLD : 0;
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: threshold });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipeHandler);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: threshold });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            if (deviceHelper.isTouchDevice()) {
                this.eventHandler.get(eventTypes.PRESS, { time: PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchHold);
                this.eventHandler.on(eventTypes.PRESS_UP, this.onPressUp);
            }
        }
    };
    /**
     * get the response details for Dragged response.
     * @param rowIndex
     * @param isNewRowPosition
     * @param isPlaceHolderRow
     * @param isDroppedAfter
     */
    StandardisationSetupTableWrapper.prototype.draggedOrDropedResponseDetails = function (rowId, isNewRowPosition, isPlaceHolderRow, isDroppedAfter) {
        if (isDroppedAfter === void 0) { isDroppedAfter = false; }
        var responseDetails = standardisationSetupStore.instance.stdResponseListBasedOnPermission.filter(function (x) {
            return x.displayId === rowId.toString();
        })[0];
        // If row not moved to new position.
        if (!isNewRowPosition) {
            this.previousMarkingModeId = responseDetails.markingModeId;
            this.oldRigOrder = responseDetails.rigOrder;
            this.totalMark = responseDetails.totalMarkValue;
            this.candidateScriptId = responseDetails.candidateScriptId;
            this.esCandidateScriptMarkGroupId = responseDetails.esCandidateScriptMarkSchemeGroupId;
        }
        else {
            this.currentMarkingModeId = isPlaceHolderRow ?
                rowId : responseDetails.markingModeId;
            // If marking mode is seeding set rig order as null. In case of reorder set the new rig order accordingly.
            if (this.currentMarkingModeId === enums.MarkingMode.Seeding) {
                this.newRigOrder = null;
            }
            else if (this.currentMarkingModeId === this.previousMarkingModeId) {
                var dropingRigOrder = responseDetails.rigOrder;
                this.newRigOrder = this.oldRigOrder < dropingRigOrder ?
                    (isDroppedAfter ? responseDetails.rigOrder : (responseDetails.rigOrder - 1)) :
                    (isDroppedAfter ? (responseDetails.rigOrder + 1) : responseDetails.rigOrder);
            }
            else {
                this.newRigOrder = isPlaceHolderRow ? 1 : (isDroppedAfter ? (responseDetails.rigOrder + 1) : responseDetails.rigOrder);
            }
        }
    };
    /**
     * unsubscribing hammer touch events and handlers
     */
    StandardisationSetupTableWrapper.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * margins and styles should be set after first render.
     */
    StandardisationSetupTableWrapper.prototype.componentDidMount = function () {
        this.setMarginsAndStyle();
        window.addEventListener('resize', this.setMarginsAndStyle);
        // Logic to add padding for grid when scroll appears to avoid column misalignment with frozen column.        
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT, this.setMarginsAndStyle);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.setReclassifyPopupOpenFlag);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.REORDERED_RESPONSE_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.refreshGrid.bind(this, true));
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE, this.setTableWrapperMarginsAndStyle);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.TAG_UPDATED_EVENT, this.refreshGrid.bind(this, true));
        this.setUpEvents();
        this.refs.tableContentHolder.addEventListener('touchstart', this.onTouchStart);
        this.refs.tableContentHolder.addEventListener('touchmove', this.onTouchMove);
        this.refs.tableContentHolder.addEventListener('touchend', this.onTouchEnd);
    };
    /**
     * Unsubscribe events
     */
    StandardisationSetupTableWrapper.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.setMarginsAndStyle);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT, this.setMarginsAndStyle);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.setReclassifyPopupOpenFlag);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.REORDERED_RESPONSE_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.refreshGrid.bind(this, true));
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE, this.setTableWrapperMarginsAndStyle);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.TAG_UPDATED_EVENT, this.refreshGrid.bind(this, true));
        // unregister events
        this.unRegisterEvents();
        this.refs.tableContentHolder.removeEventListener('touchstart', this.onTouchStart);
        this.refs.tableContentHolder.removeEventListener('touchmove', this.onTouchMove);
        this.refs.tableContentHolder.removeEventListener('touchend', this.onTouchEnd);
    };
    /**
     * Comparing the props to check the rerender
     * @param {Props} nextProps
     */
    StandardisationSetupTableWrapper.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.selectedLanguage !== nextProps.selectedLanguage) {
            worklistActionCreator.setScrollWorklistColumns();
        }
    };
    /**
     * set the left/right scrollable variables
     * @param tableScrollHolder
     */
    StandardisationSetupTableWrapper.prototype.setScrollablevariable = function () {
        if (this.refs.tableScrollHolder) {
            if (this.refs.tableScrollHolder.scrollLeft <= 0) {
                this.isScrolledLeft = true;
            }
            else {
                this.isScrolledLeft = false;
            }
            if ((this.refs.tableScrollHolder.scrollLeft + this.refs.tableScrollHolder.offsetWidth) >=
                this.refs.tableScrollHolder.scrollWidth) {
                this.isScrolledRight = true;
            }
            else {
                this.isScrolledRight = false;
            }
        }
    };
    Object.defineProperty(StandardisationSetupTableWrapper.prototype, "isClassificationWorklist", {
        /**
         * Returns whether classification worklist or not
         */
        get: function () {
            return this.props.standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get Row selected on mouse down.
     * @param rowId
     */
    StandardisationSetupTableWrapper.prototype.onMouseDown = function (rowId) {
        if (!deviceHelper.isTouchDevice() && this.isClassificationWorklist) {
            this.onSelectGridRow(rowId);
        }
    };
    /**
     * Method to make a row selected for dragging
     * @param rows
     * @param rowId
     */
    StandardisationSetupTableWrapper.prototype.onSelectGridRow = function (rowId) {
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
            var selectedTableRow = this.frozenBodyRows.filter(function (x) { return x.getRowId() === rowId &&
                x.getRowStyle().indexOf('classify-items-row') === -1 &&
                x.getRowStyle().indexOf('placeholder-row') === -1; });
            // If selected row is not a placeholder and not a banner row(Practice/Seed/Approval/STM)
            if (selectedTableRow.count() > 0) {
                this.selectedDraggableRow = this.getSelectedDraggableRow(rowId);
            }
        }
    };
    /**
     * Get Row selected on mouse up.
     * @param rowId
     */
    StandardisationSetupTableWrapper.prototype.onMouseUp = function (rowId) {
        if (!deviceHelper.isTouchDevice()) {
            // reset the grid and remove the classes added related to Dragging and dropping
            this.resetClassificationGrid();
        }
    };
    /**
     * Get selected draggable row.
     * @param rowId
     */
    StandardisationSetupTableWrapper.prototype.getSelectedDraggableRow = function (rowId) {
        var selectedDraggableGridRow = new gridRow();
        var selectedDraggableGridRowCollection = Array();
        var draggableFrozenRow = this.classifiedFrozenBodyRows.filter(function (x) { return x.getRowId() === rowId; }).first();
        var draggableRow = this.classifiedGridRows.filter(function (x) { return x.getRowId() === rowId; }).first();
        var draggableRowCells = draggableFrozenRow.getCells();
        draggableRowCells = draggableRowCells.concat(draggableRow.getCells());
        // Craete grid row.
        selectedDraggableGridRow.setRowStyle('row');
        selectedDraggableGridRow.setRowId(parseFloat(rowId.toString()));
        selectedDraggableGridRow.setCells(draggableRowCells);
        selectedDraggableGridRow.setAdditionalElement(undefined);
        selectedDraggableGridRowCollection.push(selectedDraggableGridRow);
        return immutable.List(selectedDraggableGridRowCollection);
    };
    /**
     * Reset the grid class list once we done the reclassification.
     */
    StandardisationSetupTableWrapper.prototype.gridDragReset = function () {
        this.isDraggingEnabled = false;
        this.isReclassifyPopupOpened = false;
        this.setState({
            renderedOn: Date.now()
        });
    };
    /**
     * method to notify that Reclassify popup is open.
     */
    StandardisationSetupTableWrapper.prototype.setReclassifyPopupOpenFlag = function () {
        this.isReclassifyPopupOpened = true;
    };
    /**
     * method to set MarginsAndStyle
     */
    StandardisationSetupTableWrapper.prototype.setTableWrapperMarginsAndStyle = function () {
        this.setMarginsAndStyle();
    };
    /**
     * Method to get the details of classification responses.
     * Part of refactoring
     */
    StandardisationSetupTableWrapper.prototype.getClassificationGridRows = function () {
        this.standardisationSetupHelper =
            stdSetupFactory.getStandardisationSetUpWorklistHelper(enums.StandardisationSetup.ClassifiedResponse);
        this.classifiedFrozenBodyRows = this.standardisationSetupHelper.generateStandardisationFrozenRowBody('', undefined, this.props.standardisationSetupType, this.props.gridType);
        this.frozenBodyRows = this.classifiedFrozenBodyRows;
        this.classifiedGridRows = this.standardisationSetupHelper.generateStandardisationRowDefinion('', undefined, this.props.standardisationSetupType, this.props.gridType);
        this.gridRows = this.classifiedGridRows;
    };
    return StandardisationSetupTableWrapper;
}(eventManagerBase));
module.exports = StandardisationSetupTableWrapper;
//# sourceMappingURL=standardisationsetuptablewrapper.js.map