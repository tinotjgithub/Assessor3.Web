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
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../enums');
var contextMenuHelper = require('./contextmenuhelper');
var classNames = require('classnames');
/**
 * Sub Menu item class
 */
var SubMenu = (function (_super) {
    __extends(SubMenu, _super);
    /**
     * Constructor sub menu
     * @param props
     * @param state
     */
    function SubMenu(props, state) {
        _super.call(this, props, state);
        this.initial = true;
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Component did mount
     */
    SubMenu.prototype.componentDidMount = function () {
        var element = ReactDom.findDOMNode(this);
        this.contextSubMenuHeight = element.getBoundingClientRect().height;
    };
    /**
     * render tick
     */
    SubMenu.prototype.renderTick = function () {
        return (React.createElement("span", {className: 'svg-icon shift-left tick'}, " ", React.createElement("svg", {viewBox: '0 0 32 32', className: 'tick-icon'}, React.createElement("use", {xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#v-icon-tick'}))));
    };
    /**
     * Render method for Context Menu.
     */
    SubMenu.prototype.render = function () {
        var _this = this;
        var isAlignBottomTransform = false;
        var isAlignRightTransform = false;
        var isAlignBottomRightTransform = false;
        var toRender = null;
        if (this.props.items) {
            var _contextSubMenuHeight_1 = 0;
            toRender = this.props.items.map(function (item) {
                var className = item.isSelected ? 'context-list selected' : 'context-list';
                var tickClassName = item.isDark ? 'color-sample lite' : 'color-sample dark';
                var submenuRender;
                var submenuData = contextMenuHelper.getSubmenuItemData(item);
                _contextSubMenuHeight_1 = _contextSubMenuHeight_1 + _this.props.contextMainMenuHeight;
                switch (item.submenuAction) {
                    case enums.MenuAction.RemoveOverlay:
                    case enums.MenuAction.RemoveMultilinePoint:
                    case enums.MenuAction.RemoveMultilineLine:
                    case enums.MenuAction.AddMultilinePoint:
                    case enums.MenuAction.AddMultilineLine:
                        submenuRender = (React.createElement("a", {className: submenuData.className, id: submenuData.id}, localeStore.instance.TranslateText(item.name)));
                        break;
                    case enums.MenuAction.LineStyleOverlay:
                        className = contextMenuHelper.getAcetateLineTypeClassName(item.value, item.isSelected);
                        submenuRender = _this.getAcetateLineTypeElement(item.value, item.name);
                        break;
                    case enums.MenuAction.ChangeColorOverlay:
                    default:
                        submenuRender = (React.createElement("a", {className: 'context-link', id: 'SubMenu_Default'}, React.createElement("span", {className: tickClassName, style: { backgroundColor: submenuData.style }}), React.createElement("span", {className: 'color-text'}, localeStore.instance.TranslateText(item.name))));
                        break;
                }
                return (React.createElement("li", {className: className, onClick: _this.props.submenuClick.bind(_this, item.submenuAction, item.value), id: _this.props.id + '-' + item.name, key: 'key_' + _this.props.id + '-' + item.name}, submenuRender));
            });
            isAlignBottomTransform = contextMenuHelper.isBottomAlignmentRequired(this.props.clientYCoordinate, _contextSubMenuHeight_1, window.innerHeight);
            isAlignRightTransform = contextMenuHelper.isRigtAlignmentRequired(this.props.clientXCoordinate, this.props.contextMenuWidth, this.props.annotationOverlayWidth);
            // Check if align bottom right transform is needed
            isAlignBottomRightTransform = (isAlignRightTransform === true && isAlignBottomTransform === true);
        }
        return (React.createElement("ul", {className: classNames('context-menu', { 'selectable line-style-menu': this.props.menuAction === enums.MenuAction.LineStyleOverlay }, { 'align-bottom-right': isAlignBottomRightTransform === true }, { 'align-right': isAlignBottomRightTransform === false && isAlignRightTransform === true }, { 'align-bottom': isAlignBottomRightTransform === false && isAlignBottomTransform === true }), id: this.props.id, key: 'key_' + this.props.id}, toRender));
    };
    /**
     * get Acetate LineType Element
     * @param value
     * @param name
     */
    SubMenu.prototype.getAcetateLineTypeElement = function (value, name) {
        var _value;
        var id;
        switch (value) {
            case enums.MenuAction.StraightLine:
                id = 'SubMenu_StraightLine';
                break;
            case enums.MenuAction.CurvedLine:
                id = 'SubMenu_CurvedLine';
                break;
            case enums.MenuAction.HiddenLine:
                id = 'SubMenu_HiddenLine';
                break;
        }
        _value = (React.createElement("a", {className: 'context-link', id: id}, this.renderTick(), React.createElement("span", {className: 'label-text'}, localeStore.instance.TranslateText(name))));
        return _value;
    };
    return SubMenu;
}(pureRenderComponent));
module.exports = SubMenu;
//# sourceMappingURL=submenuitem.js.map