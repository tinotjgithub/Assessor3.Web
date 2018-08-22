"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var TableControl = require('../utility/table/tablewrapper');
var classNames = require('classnames');
var worklistStore = require('../../stores/worklist/workliststore');
var timerHelper = require('../../utility/generic/timerhelper');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var deviceHelper = require('../../utility/touch/devicehelper');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var eventTypes = require('../base/eventmanager/eventtypes');
var direction = require('../base/eventmanager/direction');
var tableHelper = require('../utility/table/tablehelper');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var SCROLL_DAMPENING_FACTOR = 15;
var INITIAL_DISPLACEMENT_OFFSET = 20;
/**
 * React wrapper component for worklist tables
 */
var WorklistTableWrapper = (function (_super) {
    __extends(WorklistTableWrapper, _super);
    /**
     * @constructor
     */
    function WorklistTableWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /*checks user action is swipe or pan*/
        this.isSwipe = false;
        this.isManuallyScrolled = false;
        this.isAutoScrolled = false;
        /**
         * on scroll on the worklist set the scroll of the display IDs table
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
            _this.refs.workListGridPanel.className = _this.getGridClass();
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
        this.onMouseWheel = function (e) {
            _this.refs.tableScrollHolder.scrollTop = _this.refs.frozenTableHolder.scrollTop + e.deltaY;
            _this.setScrollablevariable();
            _this.refs.workListGridPanel.className = _this.getGridClass();
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
                if (htmlUtilities.isEdge || htmlUtilities.isIE || htmlUtilities.isFirefox || htmlUtilities.isIE11) {
                    _this.cssFrozenTableStyle = { marginRight: -hScrollbarWidth, paddingRight: hScrollbarWidth };
                }
                else {
                    _this.cssFrozenTableStyle = { marginRight: -hScrollbarWidth };
                }
                _this.setScrollablevariable();
                timerHelper.handleReactUpdatesOnWindowResize(function () {
                    _this.setState({
                        renderedOn: Date.now()
                    });
                });
            }
        };
        /**
         * returns the grid class (for shadow)
         */
        this.getGridClass = function () {
            var gridClass = classNames('work-list-grid', { 'scrolled-left': _this.isScrolledLeft === true }, { 'scrolled-right': _this.isScrolledRight === true });
            return gridClass;
        };
        this.onSortClick = function (comparerName, sortDirection) {
            _this.props.onSortClick(comparerName, sortDirection);
        };
        this.setColumnWidths = function () {
            tableHelper.setColumnWidthsForTable(_this.props.getGridControlId(), 'frozenHeader_', 'rowHeader_');
            tableHelper.setColumnWidthsForTable(_this.props.getGridControlId(), 'columnHeader_', '');
        };
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onSwipeHandler = this.onSwipeHandler.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        //this.onTouchMove = this.onTouchMove.bind(this);
        this.isScrolledLeft = true;
        this.isScrolledRight = true;
        this.onSortClick = this.onSortClick.bind(this);
        this.onFrozenColumnScroll = this.onFrozenColumnScroll.bind(this);
    }
    /**
     * Render component
     */
    WorklistTableWrapper.prototype.render = function () {
        return (React.createElement("div", {className: this.getGridClass(), style: this.cssRowHeaderTableStyle, ref: 'workListGridPanel'}, React.createElement("div", {className: 'table-header-wrap', style: this.cssRowHeaderHeaderTableStyle}, React.createElement("div", {className: 'table-wrap-lt', ref: 'frozenHeader', style: this.frozenHeadStyle}, React.createElement(TableControl, {tableHeaderRows: this.props.frozenHeaderRows, gridStyle: 'table-view', id: 'frozenHeader_' + this.props.getGridControlId(), key: 'key_frozenHeader_' + this.props.id, worklistType: this.props.worklistType, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'table-wrap-t'}, React.createElement("div", {className: 'header-scroll-holder', ref: 'headerScrollHolder'}, React.createElement(TableControl, {tableHeaderRows: this.props.columnHeaderRows, gridStyle: 'grid-view', id: 'columnHeader_' + this.props.getGridControlId(), key: 'key_columnHeader_' + this.props.id, worklistType: this.props.worklistType, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'drop-shadow'}, " "))), React.createElement("div", {className: 'table-content-wrap', style: this.cssContentWrapTableStyle}, React.createElement("div", {className: 'table-wrap-l', onWheel: this.onMouseWheel, onScroll: this.onFrozenColumnScroll}, React.createElement("div", {className: 'table-scroll-l', ref: 'frozenTableHolder', style: this.cssFrozenTableStyle}, React.createElement(TableControl, {tableBodyRows: this.props.frozenBodyRows, gridStyle: 'table-view', id: 'rowHeader_' + this.props.getGridControlId(), key: 'key_rowHeader_' + this.props.id, worklistType: this.props.worklistType, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn}))), React.createElement("div", {className: 'table-body-wrap'}, React.createElement("div", {className: 'table-scroll-holder', style: this.cssBodyWrapTableStyle, ref: 'tableScrollHolder', onScroll: this.onScrollHandler}, React.createElement("div", {className: 'table-content-holder'}, React.createElement(TableControl, {tableBodyRows: this.props.gridRows, gridStyle: 'table-view', id: this.props.getGridControlId(), key: 'key_' + this.props.id, worklistType: this.props.worklistType, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn}))), React.createElement("div", {className: 'drop-shadow'}, " ")))));
    };
    /**
     * Trigger on swipe move.
     */
    WorklistTableWrapper.prototype.onSwipeHandler = function (event) {
        this.isSwipe = true;
        /** To prevent event bubbling */
        event.srcEvent.preventDefault();
        var displacement = event.deltaY;
        this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - displacement;
    };
    /**
     * Trigger on touch move.
     */
    //private onTouchMove(event: any) {
    //    /** To prevent the default flickering behavior of ipad safari */
    //    event.preventDefault();
    //}
    /**
     * Trigger on touch move.
     */
    WorklistTableWrapper.prototype.onPanMove = function (event) {
        event.srcEvent.preventDefault();
        var displacement = event.deltaY;
        if (!this.isSwipe) {
            event.srcEvent.preventDefault();
            var displacement_1 = event.deltaY;
            if (Math.abs(displacement_1) > INITIAL_DISPLACEMENT_OFFSET && this.refs.tableScrollHolder && this.refs.frozenTableHolder) {
                // The displacement is divided by a dampening factor to restrict the fast scroll movement 
                this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - (displacement_1 / SCROLL_DAMPENING_FACTOR);
            }
        }
        this.isSwipe = false;
    };
    /**
     * This will setup events
     */
    WorklistTableWrapper.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this.refs.frozenTableHolder);
        if (element && !this.eventHandler.isInitialized) {
            this.eventHandler.initEvents(element);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipeHandler);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
        }
    };
    /**
     * unsubscribing hammer touch events and handlers
     */
    WorklistTableWrapper.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * margins and styles should be set after first render.
     */
    WorklistTableWrapper.prototype.componentDidUpdate = function () {
        // setting min-width except sorting
        if (this.props.doSetMinWidth) {
            this.setColumnWidths();
        }
    };
    /**
     * margins and styles should be set after first render.
     */
    WorklistTableWrapper.prototype.componentDidMount = function () {
        this.setMarginsAndStyle();
        window.addEventListener('resize', this.setMarginsAndStyle);
        worklistStore.instance.addListener(worklistStore.WorkListStore.SETSCROLL_WORKLIST_COLUMNS, this.setMarginsAndStyle);
        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
    };
    /**
     * Unsubscribe events
     */
    WorklistTableWrapper.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.setMarginsAndStyle);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.SETSCROLL_WORKLIST_COLUMNS, this.setMarginsAndStyle);
        // unregister events
        this.unRegisterEvents();
    };
    /**
     * Comparing the props to check the rerender
     * @param {Props} nextProps
     */
    WorklistTableWrapper.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.selectedLanguage !== nextProps.selectedLanguage) {
            worklistActionCreator.setScrollWorklistColumns();
        }
    };
    /**
     * set the left/right scrollable variables
     * @param tableScrollHolder
     */
    WorklistTableWrapper.prototype.setScrollablevariable = function () {
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
    return WorklistTableWrapper;
}(eventManagerBase));
module.exports = WorklistTableWrapper;
//# sourceMappingURL=worklisttablewrapper.js.map