"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var SubMenu = require('./submenuitem');
var annotationHelper = require('../annotation/annotationhelper');
var stampStore = require('../../../stores/stamp/stampstore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var ToggleButton = require('../togglebutton');
/**
 * Menu item class
 */
var MenuItem = (function (_super) {
    __extends(MenuItem, _super);
    /**
     * Constructor Menu Item
     * @param props
     * @param state
     */
    function MenuItem(props, state) {
        _super.call(this, props, state);
        this.contextMenuStyle = { 'top': 0, 'left': 0 };
        this.isVisible = false;
        this._isToggleButtonSelected = false;
        // set when context menu is rendered.
        this.menuRendered = false;
        /**
         * Method to trigger on share toggle click.
         */
        this.onToggleClick = function (event) {
            event.stopPropagation();
        };
        this.state = {
            renderedOn: Date.now()
        };
        this.onSubMenuItemClick = this.onSubMenuItemClick.bind(this);
        this.onToggleButtonClick = this.onToggleButtonClick.bind(this);
        this.onToggleClick = this.onToggleClick.bind(this);
    }
    /**
     * Render method for Context Menu.
     */
    MenuItem.prototype.render = function () {
        var _this = this;
        this.menuRendered = false;
        if (this.props.isShareableItem) {
            return (React.createElement("li", {id: 'shared-menu-item', className: 'context-list shared-menu-item', onClick: this.onToggleClick}, React.createElement("span", {className: 'context-link remove-annotation'}, localeStore.instance.TranslateText('marking.response.annotation-context-menu.share-multiline')), React.createElement(ToggleButton, {title: this.props.isShared === true ?
                localeStore.instance.TranslateText('marking.response.annotation-context-menu.click-multiline-unshare') :
                localeStore.instance.TranslateText('marking.response.annotation-context-menu.click-multiline-share'), id: 'share', key: 'share-key', selectedLanguage: this.props.selectedLanguage, isChecked: this.props.isShared, index: 0, onChange: this.onToggleButtonClick, style: this.style, onText: localeStore.instance.TranslateText('generic.toggle-button-states.on'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.off')})));
        }
        else {
            return (React.createElement("li", {className: classNames('context-list', { 'has-sub': this.props.hasSubMenu === true }), onClick: this.props.hasSubMenu === true ? null : this.onMenuItemClick.bind(this), onTouchEnd: function () { _this.onTouchEnd(); }, onMouseOver: this.onMenuMouseOver.bind(this, this.props.hasSubMenu)}, React.createElement("a", {className: 'context-link remove-annotation', id: 'Overlay_' + localeStore.instance.TranslateText(this.props.name), onClick: this.props.hasSubMenu === true ? null : this.onMenuItemClick.bind(this)}, localeStore.instance.TranslateText(this.props.name)), React.createElement(SubMenu, {id: this.props.id, key: 'key_' + this.props.id, items: this.props.subMenuItems, menuAction: this.props.menuAction, annotationOverlayWidth: this.props.annotationOverlayWidth, submenuClick: this.onSubMenuItemClick, clientXCoordinate: this.props.clientXCoordinate + this.props.contextMainMenuWidth, clientYCoordinate: this.props.clientYCoordinate, isVisible: this.isVisible, contextMenuWidth: this.props.contextMainMenuWidth, contextMainMenuHeight: this.props.contextMainMenuHeight})));
        }
    };
    /**
     * Method to trigger on tounchend event in ipad.
     */
    MenuItem.prototype.onTouchEnd = function () {
        // set true to avoid auto deleting annotaion on touchend in ipad.
        this.menuRendered = true;
    };
    /**
     * Method to trigger on share button toggle.
     */
    MenuItem.prototype.onToggleButtonClick = function (event) {
        this.props.onShareStateChange();
    };
    /**
     * Method to trigger on menu item event.
     */
    MenuItem.prototype.onMenuItemClick = function (event, menuAction, value) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isMenuClickable || (this.props.contextMenuData.annotationData &&
            annotationHelper.isDynamicAnnotation(stampStore.instance.getStamp(this.props.contextMenuData.annotationData.stamp)))) {
            if (this.props.subMenuItems) {
                this.props.menuClick(menuAction, value, this.props.contextMenuData);
            }
            else {
                this.props.menuClick(this.props.menuAction, value, this.props.contextMenuData);
            }
        }
    };
    /**
     * Method to trigger on sub menu item event.
     */
    MenuItem.prototype.onSubMenuItemClick = function (menuAction, value, event) {
        this.menuRendered = true;
        this.onMenuItemClick(event, menuAction, value);
    };
    Object.defineProperty(MenuItem.prototype, "isMenuClickable", {
        get: function () {
            return this.menuRendered || !htmlUtilities.isTabletOrMobileDevice;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show or hide the Submenu items while mouse over.
     */
    MenuItem.prototype.onMenuMouseOver = function (hasSubMenu, event) {
        this.isVisible = hasSubMenu;
        if (hasSubMenu) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    return MenuItem;
}(pureRenderComponent));
module.exports = MenuItem;
//# sourceMappingURL=menuitem.js.map