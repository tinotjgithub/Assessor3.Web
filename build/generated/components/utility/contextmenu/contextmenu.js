"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
var contextMenuHelper = require('./contextmenuhelper');
var pureRenderComponent = require('../../base/purerendercomponent');
var MenuItem = require('./menuitem');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var markingStore = require('../../../stores/marking/markingstore');
var classNames = require('classnames');
var enums = require('../enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var markByAnnotationHelper = require('../marking/markbyannotationhelper');
var acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
/**
 * Context menu component
 */
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    /**
     * Constructor ContextMenu
     * @param props
     * @param state
     */
    function ContextMenu(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isColorPanelVisible = false;
        this.contextMenuItems = [];
        this._isShared = false;
        /**
         * On click handler
         * @param event
         * @param contextMenuData
         */
        this.onClickHandler = function (menuAction, value, contextMenuData) {
            _this.isColorPanelVisible = false;
            var selectedClientToken = [];
            selectedClientToken.push(_this.contextMenuData.clientToken);
            if (contextMenuData) {
                contextMenuData.menuAction = menuAction;
            }
            // Set colour panel visibilty for annotation.
            _this.isColorPanelVisible = contextMenuHelper.setColourPanelVisibility(menuAction, value);
            contextMenuHelper.doClickAction(_this.xPos, _this.yPos, selectedClientToken, menuAction, value, contextMenuData);
            _this.reRender(false);
        };
        /**
         * trigger's while clicking context menu
         */
        this.onContextMenuClick = function (event) {
            // preventing default due to image flickering issues in iPad
            event.preventDefault();
            event.stopPropagation();
        };
        /**
         * Update context menu position
         * @param isVisible
         * @param xPos
         * @param yPos
         * @param contextMenuData
         */
        this.showOrHideContextMenu = function (isVisible, xPos, yPos, data) {
            _this.contextMenuData = data ? contextMenuHelper.getContextMenuData(data) : null;
            _this._isShared = false;
            _this.isColorPanelVisible = false;
            if (isVisible) {
                _this.xPos = xPos;
                _this.yPos = yPos;
            }
            else {
                _this.isColorPanelVisible = isVisible;
            }
            // set shared shared overlay panel visibilty.
            _this._isShared = contextMenuHelper.setSharedPanelVisibility(_this.contextMenuData);
            _this.reRender(isVisible);
        };
        /**
         * call when toggle button to share multiline changes
         */
        this.shareMultiline = function (isShared) {
            _this._isShared = isShared;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Hide context menu
         */
        this.hideContextMenu = function () {
            if (_this.state.isVisible === true) {
                _this.reset();
                _this.reRender(false);
            }
        };
        /**
         * Reset all property
         */
        this.reset = function () {
            _this.contextMenuData = undefined;
            _this.xPos = 0;
            _this.yPos = 0;
        };
        /**
         * Rerender if required
         */
        this.reRender = function (isVisible) {
            // If previous state is invisible and new state is invisible no need to re-render as it's already hidden
            if (!_this.state.isVisible && !isVisible) {
                return;
            }
            if (_this.isColorPanelVisible) {
                return;
            }
            _this.setState({
                renderedOn: Date.now(),
                isVisible: isVisible
            });
        };
        this.reset();
        this.state = {
            renderedOn: 0,
            isVisible: true
        };
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onShareToggleButtonClick = this.onShareToggleButtonClick.bind(this);
        this.markByAnnotationHelper = new markByAnnotationHelper();
        // minimum one item should be rendered which is used for contextmenu position calculation
        this.contextMenuData = contextMenuHelper.getContextMenuData();
    }
    /**
     * Render method for Context Menu.
     */
    ContextMenu.prototype.render = function () {
        var _this = this;
        if (!this.state.isVisible) {
            return (React.createElement("ul", {id: this.props.id, key: 'key_' + this.props.id, className: classNames('context-menu annotation-context-menu')}));
        }
        var contextMenuStyle = { 'top': 0, 'left': 0 };
        var isAlignBottomTransform = false;
        var isAlignRightTransform = false;
        var isAlignBottomRightTransform = false;
        // Get Context Menu Items.
        this.contextMenuItems = contextMenuHelper.getContextMenuItems(this.contextMenuData);
        // Check if align bottom transform is needed
        isAlignBottomTransform = contextMenuHelper.isBottomAlignmentRequired(this.yPos, this.height *
            (this.contextMenuItems.length), window.innerHeight);
        isAlignRightTransform = contextMenuHelper.isRigtAlignmentRequired(this.xPos, this.width, this.contextMenuData.annotationOverlayWidth);
        // Check if align bottom right transform is needed
        isAlignBottomRightTransform = (isAlignRightTransform === true && isAlignBottomTransform === true);
        // Apply top and left style for the context menu
        contextMenuStyle = {
            'top': contextMenuHelper.getYcoordinate(this.yPos, isAlignBottomTransform),
            'left': contextMenuHelper.getYcoordinate(this.xPos, isAlignRightTransform)
        };
        // Apply share-on class only if the logged in examiner is a PE and the multi line is shared.
        var isShareOn = (this._isShared && qigStore.instance.getSelectedQIGForTheLoggedInUser &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer);
        // Get the menu items
        var toRender = this.contextMenuItems.map(function (item, index) {
            return (React.createElement(MenuItem, {id: _this.props.id + '-' + item.name, key: 'key_' + _this.props.id + '-' + item.name, name: item.name, hasSubMenu: item.hasSubMenu, subMenuItems: item.subMenu, menuAction: item.menuAction, menuClick: _this.onClickHandler, clientXCoordinate: _this.xPos, clientYCoordinate: isAlignBottomTransform ?
                (_this.yPos - ((_this.contextMenuItems.length - index) * _this.height)) :
                (_this.yPos + (index * _this.height)), contextMainMenuWidth: _this.width, contextMainMenuHeight: _this.height, annotationOverlayWidth: window.innerWidth, onShareStateChange: _this.onShareToggleButtonClick, isShared: _this._isShared, isShareableItem: item.isSharedItem, contextMenuData: item.contextMenuData}));
        });
        // Render the context menu
        return (React.createElement("ul", {id: this.props.id, key: 'key_' + this.props.id, style: contextMenuStyle, onClick: this.onContextMenuClick, className: classNames('context-menu annotation-context-menu', { 'show': this.state.isVisible === true }, { 'align-bottom-right': isAlignBottomRightTransform === true }, { 'align-right': isAlignBottomRightTransform === false && isAlignRightTransform === true }, { 'align-bottom': isAlignBottomRightTransform === false && isAlignBottomTransform === true }, { 'share-on': isShareOn }), onMouseMove: this.onMouseOverHandler, onMouseLeave: this.onMouseLeaveHandler}, toRender));
    };
    /**
     * Component mounted
     */
    ContextMenu.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED, this.showOrHideContextMenu);
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareMultiline);
        if (this.state.renderedOn === 0) {
            this.reset();
            this.initializeContextMenuProperties();
            this.reRender(false);
        }
    };
    /**
     * componentWillUnmount
     *
     * @memberof ContextMenu
     */
    ContextMenu.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED, this.showOrHideContextMenu);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareMultiline);
    };
    /**
     * Initialize context menu properties
     */
    ContextMenu.prototype.initializeContextMenuProperties = function () {
        var element = ReactDom.findDOMNode(this);
        this.width = element.getBoundingClientRect().width;
        this.height = element.getBoundingClientRect().height;
    };
    /**
     * Method to trigger on share button toggle.
     */
    ContextMenu.prototype.onShareToggleButtonClick = function (evt) {
        var multilineClientTokenToBeShared = [];
        multilineClientTokenToBeShared.push(this.contextMenuData.clientToken);
        // Show popup only when unsharing the multiline
        if (this._isShared) {
            acetatesActionCreator.shareConfirmationPopup(multilineClientTokenToBeShared[0], this._isShared);
        }
        else {
            acetatesActionCreator.shareAcetate(multilineClientTokenToBeShared[0]);
        }
    };
    /**
     * On mouse over handler
     * @param event
     */
    ContextMenu.prototype.onMouseOverHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        responseActionCreator.setMousePosition(-1, -1);
    };
    /**
     * On mouse leave handler
     * @param event
     */
    ContextMenu.prototype.onMouseLeaveHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        responseActionCreator.setMousePosition(0, 0);
    };
    return ContextMenu;
}(pureRenderComponent));
module.exports = ContextMenu;
//# sourceMappingURL=contextmenu.js.map