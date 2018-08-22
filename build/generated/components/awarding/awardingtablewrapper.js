"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var ReactDom = require('react-dom');
var eventTypes = require('../base/eventmanager/eventtypes');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var classNames = require('classnames');
var TableControl = require('../utility/table/tablewrapper');
var timerHelper = require('../../utility/generic/timerhelper');
var tableHelper = require('../utility/table/tablehelper');
var deviceHelper = require('../../utility/touch/devicehelper');
var direction = require('../base/eventmanager/direction');
var SCROLL_DAMPENING_FACTOR = 15;
var INITIAL_DISPLACEMENT_OFFSET = 20;
/**
 * React wrapper component for awarding details grid tables
 */
var AwardingTableWrapper = (function (_super) {
    __extends(AwardingTableWrapper, _super);
    /**
     *
     * @param props
     * @param state
     */
    function AwardingTableWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /*checks user action is swipe or pan*/
        this.isSwipe = false;
        this.isManuallyScrolled = false;
        this.isAutoScrolled = false;
        this.setColumnWidths = function () {
            tableHelper.setColumnWidthsForTable('awarding_grid', 'frozenHeader_', 'rowHeader_');
            tableHelper.setColumnWidthsForTable('awarding_grid', 'columnHeader_', '');
        };
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
            _this.refs.awardingGridPanel.className = _this.getGridClass();
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
         * Trigger on mouse scroll.
         */
        this.onMouseWheel = function (e) {
            _this.refs.tableScrollHolder.scrollTop = _this.refs.frozenTableHolder.scrollTop + e.deltaY;
            _this.setScrollablevariable();
            _this.refs.teamManagementGridPanel.className = _this.getGridClass();
        };
        /**
         * set the margins and css styles for diff divs and tables in worklist
         */
        this.setMarginsAndStyle = function () {
            if (_this.refs.frozenTableHolder) {
                var tableScrollHolder = _this.refs.tableScrollHolder;
                _this.frozenTableHolderWidth = _this.refs.frozenTableHolder.offsetWidth;
                if (_this.refs.frozenTableHolder) {
                    _this.frozenHeadStyle = {};
                }
                if (tableScrollHolder) {
                    var hScrollbarWidth = tableScrollHolder.offsetWidth - tableScrollHolder.clientWidth;
                    var vScrollbarWidth = tableScrollHolder.offsetHeight - tableScrollHolder.clientHeight;
                    //NaN check for removing react warning
                    hScrollbarWidth = isNaN(hScrollbarWidth) ? 0 : hScrollbarWidth;
                    vScrollbarWidth = isNaN(vScrollbarWidth) ? 0 : vScrollbarWidth;
                    _this.cssRowHeaderTableStyle = { marginRight: -hScrollbarWidth };
                    _this.cssRowHeaderHeaderTableStyle = { marginRight: hScrollbarWidth };
                    _this.cssContentWrapTableStyle = { paddingBottom: vScrollbarWidth, paddingRight: hScrollbarWidth };
                    _this.cssBodyWrapTableStyle = { right: -hScrollbarWidth, bottom: -vScrollbarWidth };
                    _this.cssFrozenTableStyle = { marginRight: -hScrollbarWidth };
                    _this.setScrollablevariable();
                    timerHelper.handleReactUpdatesOnWindowResize(function () {
                        _this.setState({
                            renderedOn: Date.now()
                        });
                    });
                }
                // we need to recalculate the column widths in window resize
                _this.setColumnWidths();
            }
        };
        /**
         * returns the grid class (for shadow)
         */
        this.getGridClass = function () {
            var gridClass = classNames('work-list-grid scrolled-left scrolled-right');
            return gridClass;
        };
        /**
         * This method will call on table header click for sorting.
         */
        this.onSortClick = function (comparerName, sortDirection) {
            return null;
        };
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onSwipeHandler = this.onSwipeHandler.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onSortClick = this.onSortClick.bind(this);
        this.isScrolledLeft = true;
        this.isScrolledRight = true;
        this.onFrozenColumnScroll = this.onFrozenColumnScroll.bind(this);
    }
    /**
     * margins and styles should be set after first render.
     */
    AwardingTableWrapper.prototype.componentDidMount = function () {
        this.setMarginsAndStyle();
        window.addEventListener('resize', this.setMarginsAndStyle);
        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
    };
    /**
     * This will setup events
     */
    AwardingTableWrapper.prototype.setUpEvents = function () {
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
     * set the left/right scrollable variables
     * @param tableScrollHolder
     */
    AwardingTableWrapper.prototype.setScrollablevariable = function () {
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
    /**
     * Unsubscribe events
     */
    AwardingTableWrapper.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.setMarginsAndStyle);
        // unregister events
        this.unRegisterEvents();
    };
    /**
     * unsubscribing hammer touch events and handlers
     */
    AwardingTableWrapper.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * componentDidUpdate reate life cycle event
     */
    AwardingTableWrapper.prototype.componentDidUpdate = function () {
        if (this.refs.frozenTableHolder && this.frozenTableHolderWidth !== this.refs.frozenTableHolder.offsetWidth) {
            // dynamically set the examiner column width on node expansion
            this.setMarginsAndStyle();
        }
        else {
            this.setColumnWidths();
        }
    };
    /**
     * render
     */
    AwardingTableWrapper.prototype.render = function () {
        return React.createElement("div", {className: this.getGridClass(), style: this.cssRowHeaderTableStyle, ref: 'awardingGridPanel'}, React.createElement("div", {className: 'table-header-wrap', style: this.cssRowHeaderHeaderTableStyle}, React.createElement("div", {className: 'table-wrap-lt', ref: 'frozenHeader', style: this.frozenHeadStyle}, React.createElement(TableControl, {tableHeaderRows: this.props.awardingFrozenHeaderRows, gridStyle: 'table-view', id: 'frozenHeader_awarding_grid', key: 'key_frozenHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'table-wrap-t'}, React.createElement("div", {className: 'header-scroll-holder', ref: 'headerScrollHolder'}, React.createElement(TableControl, {tableHeaderRows: this.props.awardingColumnHeaderRows, gridStyle: 'table-view', id: 'columnHeader_awarding_grid', key: 'key_columnHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'drop-shadow'}, " "))), React.createElement("div", {className: 'table-content-wrap', style: this.cssContentWrapTableStyle}, React.createElement("div", {className: 'table-wrap-l tree-view', ref: 'frozenTableHolder'}, React.createElement(TableControl, {tableBodyRows: this.props.awardingCandidateGradeViewCollection[0], gridStyle: 'table-view', id: 'rowHeader_awarding_grid', key: 'key_rowHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'table-body-wrap'}, React.createElement("div", {className: 'table-scroll-holder', style: this.cssBodyWrapTableStyle, ref: 'tableScrollHolder', onScroll: this.onScrollHandler}, React.createElement("div", {className: 'table-content-holder'}, React.createElement(TableControl, {tableBodyRows: this.props.awardingCandidateGradeViewCollection[1], gridStyle: 'table-view', id: 'awarding_grid', key: 'key_awarding_grid', selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn}))), React.createElement("div", {className: 'drop-shadow'}, " "))));
    };
    /**
     * Trigger on swipe move.
     */
    AwardingTableWrapper.prototype.onSwipeHandler = function (event) {
        this.isSwipe = true;
        /** To prevent event bubbling */
        event.srcEvent.preventDefault();
        var displacement = event.deltaY;
        this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - displacement;
    };
    /**
     * Trigger on touch move.
     */
    AwardingTableWrapper.prototype.onPanMove = function (event) {
        event.srcEvent.preventDefault();
        var displacement = event.deltaY;
        var timeTaken = event.deltaTime;
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
    return AwardingTableWrapper;
}(eventManagerBase));
module.exports = AwardingTableWrapper;
//# sourceMappingURL=awardingtablewrapper.js.map