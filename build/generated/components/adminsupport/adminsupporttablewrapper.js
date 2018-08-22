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
var deviceHelper = require('../../utility/touch/devicehelper');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var eventTypes = require('../base/eventmanager/eventtypes');
var direction = require('../base/eventmanager/direction');
var tableHelper = require('../utility/table/tablehelper');
var loginActionCreator = require('../../actions/login/loginactioncreator');
/**
 * React wrapper component for Admin Support table
 */
var AdminSupportTableWrapper = (function (_super) {
    __extends(AdminSupportTableWrapper, _super);
    /**
     * @constructor
     */
    function AdminSupportTableWrapper(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * handle examiner selection in support enviornment grid
         */
        this.handleExaminerSelection = function (examinerId) {
            loginActionCreator.selectExaminer(examinerId);
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
            tableHelper.setColumnWidthsForTable(_this.props.id, 'columnHeader_', '');
        };
        this.onSortClick = this.onSortClick.bind(this);
        this.isScrolledLeft = true;
        this.isScrolledRight = true;
    }
    /**
     * Render component
     */
    AdminSupportTableWrapper.prototype.render = function () {
        return (React.createElement("div", {className: this.getGridClass(), style: this.cssRowHeaderTableStyle, ref: 'adminSupportGridPanel'}, React.createElement("div", {className: 'table-header-wrap', style: this.cssRowHeaderHeaderTableStyle}, React.createElement("div", {className: 'table-wrap-t'}, React.createElement("div", {className: 'header-scroll-holder', ref: 'headerScrollHolder'}, React.createElement(TableControl, {tableHeaderRows: this.props.columnHeaderRows, gridStyle: 'table-view', id: 'columnHeader_' + this.props.id, key: 'key_columnHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, onSortClick: this.onSortClick, renderedOn: this.props.renderedOn})), React.createElement("div", {className: 'drop-shadow'}, " "))), React.createElement("div", {className: 'table-content-wrap', style: this.cssContentWrapTableStyle}, React.createElement("div", {className: 'table-body-wrap'}, React.createElement("div", {className: 'table-scroll-holder', style: this.cssBodyWrapTableStyle, ref: 'tableScrollHolder'}, React.createElement("div", {className: 'table-content-holder'}, React.createElement(TableControl, {tableBodyRows: this.props.gridRows, gridStyle: 'table-view', id: this.props.id, key: 'key_' + this.props.id, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn, onRowClick: this.handleExaminerSelection}))), React.createElement("div", {className: 'drop-shadow'}, " ")))));
    };
    /**
     * This will setup events
     */
    AdminSupportTableWrapper.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this.refs.tableWrapDisplayIDs);
        if (element && !this.eventHandler.isInitialized) {
            this.eventHandler.initEvents(element);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
        }
    };
    /**
     * unsubscribing hammer touch events and handlers
     */
    AdminSupportTableWrapper.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * margins and styles should be set after first render.
     */
    AdminSupportTableWrapper.prototype.componentDidUpdate = function () {
        this.setColumnWidths();
    };
    /**
     * margins and styles should be set after first render.
     */
    AdminSupportTableWrapper.prototype.componentDidMount = function () {
        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
    };
    /**
     * Unsubscribe events
     */
    AdminSupportTableWrapper.prototype.componentWillUnmount = function () {
        this.unRegisterEvents();
    };
    return AdminSupportTableWrapper;
}(eventManagerBase));
module.exports = AdminSupportTableWrapper;
//# sourceMappingURL=adminsupporttablewrapper.js.map