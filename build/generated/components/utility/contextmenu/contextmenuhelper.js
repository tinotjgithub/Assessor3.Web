"use strict";
var menuItem = require('./typings/menuitem');
var enums = require('../enums');
var colouredannotationshelper = require('../../../utility/stamppanel/colouredannotationshelper');
var userOptionshelper = require('../../../utility/useroption/useroptionshelper');
var qigstore = require('../../../stores/qigselector/qigstore');
var userOptionkeys = require('../../../utility/useroption/useroptionkeys');
var annotationContextMenuData = require('./annotationcontextmenudata');
var acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var ContextMenuHelper = (function () {
    function ContextMenuHelper() {
    }
    /**
     * Get menu items
     */
    ContextMenuHelper.getAnnotationContextMenuItems = function (contextMenuType, annotationData, contextMenuDetails) {
        var items = [];
        var item = null;
        var stampType = null;
        if (annotationData) {
            switch (annotationData.stamp) {
                case enums.DynamicAnnotation.Highlighter:
                    stampType = enums.StampType.dynamic;
                    break;
            }
        }
        item = new menuItem();
        item.hasSubMenu = false;
        item.menuAction = enums.MenuAction.RemoveAnnotation;
        item.name = 'marking.response.annotation-context-menu.remove-annotation';
        item.contextMenuData = contextMenuDetails;
        items.push(item);
        switch (stampType) {
            case enums.StampType.dynamic:
                var colorStatus = colouredannotationshelper.getHighlighterColouredAnnotationStatusForTheQIG();
                if (colorStatus === null) {
                    colorStatus = 'Yes';
                }
                if (colorStatus) {
                    if (colorStatus.toLowerCase() === enums.ConfigurableCharacteristicsHighlighterColorStatus[1].toLowerCase()) {
                        item = new menuItem();
                        item.hasSubMenu = true;
                        item.name = 'marking.response.annotation-context-menu.change-colour';
                        item.menuAction = enums.MenuAction.ChangeAnnotationColor;
                        item.contextMenuData = contextMenuDetails;
                        item.subMenu = new Array();
                        var colorsubmenuitems = this.getColorSubItems(annotationData, contextMenuDetails);
                        colorsubmenuitems.map(function (subItem) {
                            item.subMenu.push(subItem);
                        });
                        items.push(item);
                    }
                }
                break;
        }
        return items;
    };
    /**
     * Get menu items
     */
    ContextMenuHelper.getBookmarkContextMenuItems = function (contextMenuType, contextMenuData) {
        var items = [];
        var item = null;
        item = new menuItem();
        item.hasSubMenu = false;
        item.menuAction = enums.MenuAction.RemoveAnnotation;
        item.name = 'marking.response.annotation-context-menu.remove-bookmark';
        item.contextMenuData = contextMenuData;
        items.push(item);
        return items;
    };
    /**
     * Get menu items
     */
    ContextMenuHelper.getAcetateContextMenuItems = function (contextMenuType, acetateToolType, contextMenuDetails) {
        var items = [];
        var item = null;
        item = new menuItem();
        item.hasSubMenu = false;
        item.menuAction = enums.MenuAction.RemoveOverlay;
        item.contextMenuData = contextMenuDetails;
        if (acetateToolType === enums.ToolType.multiline) {
            var shareItem = null;
            var mainName = 'marking.response.annotation-context-menu';
            if (contextMenuDetails.multilinearguments.isShared && qigstore.instance.getSelectedQIGForTheLoggedInUser &&
                qigstore.instance.getSelectedQIGForTheLoggedInUser.role !== enums.ExaminerRole.principalExaminer) {
                var _menuItem = {
                    name: mainName + '.remove-multiline-shared',
                    hasSubMenu: false,
                    menuAction: enums.MenuAction.RemoveOverlay,
                    subMenu: null,
                    contextMenuData: contextMenuDetails
                };
                items = [_menuItem];
            }
            else {
                if (qigstore.instance.getSelectedQIGForTheLoggedInUser &&
                    qigstore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer) {
                    shareItem = {
                        name: mainName + '.share-multiline',
                        hasSubMenu: false, menuAction: null, subMenu: null, isSharedItem: true
                    };
                }
                var addPointSubmenu = {
                    name: mainName + '.point-multiline',
                    value: null,
                    isSelected: null,
                    isDark: null,
                    submenuAction: enums.MenuAction.AddMultilinePoint
                };
                var addLineSubmenu = {
                    name: mainName + '.line-multiline',
                    value: null,
                    isSelected: null,
                    isDark: null,
                    submenuAction: enums.MenuAction.AddMultilineLine
                };
                var _menuItem = {
                    name: mainName + '.add-multiline',
                    hasSubMenu: true,
                    menuAction: null,
                    contextMenuData: contextMenuDetails,
                    subMenu: []
                };
                if (contextMenuDetails.multilinearguments.noOfPoints < 10) {
                    _menuItem.subMenu.push(addPointSubmenu);
                }
                if (contextMenuDetails.multilinearguments.noOfLines < 10) {
                    _menuItem.subMenu.push(addLineSubmenu);
                }
                _menuItem = _menuItem.subMenu.length > 0 ? _menuItem : null;
                var _lineType = contextMenuDetails.multilinearguments.LineType;
                var _lineColor = contextMenuDetails.multilinearguments.LineColor;
                items = [shareItem,
                    _menuItem,
                    {
                        name: mainName + '.remove-multiline',
                        hasSubMenu: true, menuAction: enums.MenuAction.RemoveOverlay,
                        contextMenuData: contextMenuDetails,
                        subMenu: [
                            {
                                name: mainName + '.point-multiline',
                                value: null, isSelected: null, isDark: null, submenuAction: enums.MenuAction.RemoveMultilinePoint
                            },
                            {
                                name: mainName + '.line-multiline',
                                value: null, isSelected: null, isDark: null, submenuAction: enums.MenuAction.RemoveMultilineLine
                            },
                            {
                                name: mainName + '.all-multiline',
                                value: 'deletemultiline', isSelected: null, isDark: null, submenuAction: enums.MenuAction.RemoveOverlay
                            }
                        ]
                    },
                    {
                        name: mainName + '.change-colour-multiline',
                        hasSubMenu: true, menuAction: enums.MenuAction.ChangeColorOverlay,
                        contextMenuData: contextMenuDetails,
                        subMenu: [
                            {
                                name: mainName + '.red', value: enums.MenuAction.MultilineRed,
                                isSelected: this.getIsSelected(_lineColor, enums.OverlayColor.red),
                                isDark: false, submenuAction: enums.MenuAction.ChangeColorOverlay
                            },
                            {
                                name: mainName + '.blue', value: enums.MenuAction.MultilineBlue,
                                isSelected: this.getIsSelected(_lineColor, enums.OverlayColor.blue),
                                isDark: false, submenuAction: enums.MenuAction.ChangeColorOverlay
                            },
                            {
                                name: mainName + '.green', value: enums.MenuAction.MultilineGreen,
                                isSelected: this.getIsSelected(_lineColor, enums.OverlayColor.green),
                                isDark: true, submenuAction: enums.MenuAction.ChangeColorOverlay
                            },
                            {
                                name: mainName + '.yellow', value: enums.MenuAction.MultilineYellow,
                                isSelected: this.getIsSelected(_lineColor, enums.OverlayColor.yellow),
                                isDark: false, submenuAction: enums.MenuAction.ChangeColorOverlay
                            },
                            {
                                name: mainName + '.black', value: enums.MenuAction.MultilineBlack,
                                isSelected: this.getIsSelected(_lineColor, enums.OverlayColor.black),
                                isDark: false, submenuAction: enums.MenuAction.ChangeColorOverlay
                            },
                            {
                                name: mainName + '.pink', value: enums.MenuAction.MultilinePink,
                                isSelected: this.getIsSelected(_lineColor, enums.OverlayColor.pink),
                                isDark: false, submenuAction: enums.MenuAction.ChangeColorOverlay
                            }
                        ]
                    }, {
                        name: mainName + '.multiline-style',
                        hasSubMenu: true, menuAction: enums.MenuAction.LineStyleOverlay,
                        contextMenuData: contextMenuDetails,
                        subMenu: [
                            {
                                name: mainName + '.multiline-style-straight', value: enums.MenuAction.StraightLine,
                                isSelected: this.getIsSelected(_lineType, enums.LineType.line),
                                isDark: null, submenuAction: enums.MenuAction.LineStyleOverlay
                            },
                            {
                                name: mainName + '.multiline-style-curved', value: enums.MenuAction.CurvedLine,
                                isSelected: this.getIsSelected(_lineType, enums.LineType.curve),
                                isDark: null, submenuAction: enums.MenuAction.LineStyleOverlay
                            },
                            {
                                name: mainName + '.multiline-style-hidden', value: enums.MenuAction.HiddenLine,
                                isSelected: this.getIsSelected(_lineType, enums.LineType.none),
                                isDark: null, submenuAction: enums.MenuAction.LineStyleOverlay
                            }
                        ]
                    }
                ];
            }
        }
        else {
            var name_1 = 'marking.response.annotation-context-menu.remove-';
            if (acetateToolType === enums.ToolType.ruler) {
                item.name = name_1 + enums.ToolType[acetateToolType];
                item.contextMenuData = contextMenuDetails;
            }
            else if (acetateToolType === enums.ToolType.protractor) {
                item.name = name_1 + enums.ToolType[acetateToolType];
                item.contextMenuData = contextMenuDetails;
            }
            items.push(item);
        }
        return items = items.filter(function (x) { return x !== null; });
    };
    /**
     * get Is Selected
     * @param value1
     * @param value2
     */
    ContextMenuHelper.getIsSelected = function (value1, value2) {
        return value1 === value2;
    };
    /**
     * Get color sub menu items
     */
    ContextMenuHelper.getColorSubItems = function (annotationData, acetateContextMenuData) {
        var colorsubmenuitems = [
            {
                name: 'marking.response.annotation-context-menu.red', value: 'rgb(255,0,0)',
                isSelected: false, isDark: false, submenuAction: enums.MenuAction.ChangeAnnotationColor
            },
            {
                name: 'marking.response.annotation-context-menu.blue', value: 'rgb(0,0,255)',
                isSelected: false, isDark: false, submenuAction: enums.MenuAction.ChangeAnnotationColor
            },
            {
                name: 'marking.response.annotation-context-menu.green', value: 'rgb(0,255,0)',
                isSelected: false, isDark: true, submenuAction: enums.MenuAction.ChangeAnnotationColor
            },
            {
                name: 'marking.response.annotation-context-menu.yellow', value: 'rgb(255,255,0)',
                isSelected: false, isDark: true, submenuAction: enums.MenuAction.ChangeAnnotationColor
            },
            {
                name: 'marking.response.annotation-context-menu.black', value: 'rgb(0,0,0)',
                isSelected: false, isDark: false, submenuAction: enums.MenuAction.ChangeAnnotationColor
            },
            {
                name: 'marking.response.annotation-context-menu.pink', value: 'rgb(255,20,147)',
                isSelected: false, isDark: true, submenuAction: enums.MenuAction.ChangeAnnotationColor
            }
        ];
        var color = 'rgb(' + annotationData.red + ',' + annotationData.green + ',' + annotationData.blue + ')';
        colorsubmenuitems.map(function (menu) {
            if (menu.value === color) {
                menu.isSelected = true;
            }
        });
        return colorsubmenuitems;
    };
    /**
     * Check if context menu goes offscreen on right hand side of the window.
     * If mouse X position + content menu width is greater than annotation overlay width then
     * it means that when context menu is rendered it will go offscreen.
     */
    ContextMenuHelper.isRigtAlignmentRequired = function (mouseX, contextMenuWidth, annotationOverlayWidth) {
        if ((mouseX + contextMenuWidth) > annotationOverlayWidth) {
            return true;
        }
        return false;
    };
    /**
     * Check if context menu goes offscreen on bottom side of the window.
     * If mouse Y position + content menu height is greater than annotation overlay width then
     * it means that when context menu is rendered it will go offscreen.
     */
    ContextMenuHelper.isBottomAlignmentRequired = function (mouseY, contextMenuHeight, windowHeight) {
        if ((mouseY + contextMenuHeight) > windowHeight) {
            return true;
        }
        return false;
    };
    /**
     * Check if sub menu goes offscreen on bottom side of the window.
     */
    ContextMenuHelper.isRigtAlignmentRequiredForSubMenu = function (parentWidth, clientXCoordinate, contextMenuWidth) {
        if (parentWidth < clientXCoordinate + contextMenuWidth) {
            return true;
        }
        return false;
    };
    /**
     * Get X coordinate's
     * If rightAlign is applied that means we need to move X co-ordinate by 2
     * so that context menu will be positioned in such a way that the mouse pointer
     * is over the "Remove annotation" option once it appears
     * @param x
     * @param rightAlign
     */
    ContextMenuHelper.getXcoordinate = function (x, rightAlign) {
        if (x === undefined) {
            return 0;
        }
        if (rightAlign === true) {
            return x + 2;
        }
        else {
            return x - 2;
        }
    };
    /**
     * Get Y coordinate's
     * If bottomAlign is applied that means we need to move Y co-ordinate by 2
     * so that context menu will be positioned in such a way that the mouse pointer
     * is over the "Remove annotation" option once it appears
     * @param y
     * @param bottomAlign
     */
    ContextMenuHelper.getYcoordinate = function (y, bottomAlign) {
        if (y === undefined) {
            return 0;
        }
        if (bottomAlign === true) {
            return y + 2;
        }
        else {
            return y;
        }
    };
    /**
     * get the contextmenuitem details from helper according to the contextmenu type
     */
    ContextMenuHelper.getContextMenuItems = function (contextMenuData) {
        var contextMenuItems = [];
        switch (contextMenuData.contextMenuType) {
            case enums.ContextMenuType.annotation:
                contextMenuItems =
                    ContextMenuHelper.getAnnotationContextMenuItems(contextMenuData.contextMenuType, contextMenuData.annotationData, contextMenuData);
                break;
            case enums.ContextMenuType.bookMark:
                contextMenuItems =
                    ContextMenuHelper.getBookmarkContextMenuItems(contextMenuData.contextMenuType, contextMenuData);
                break;
            case enums.ContextMenuType.acetate:
                contextMenuItems =
                    ContextMenuHelper.getAcetateContextMenuItems(contextMenuData.contextMenuType, contextMenuData.acetateToolType, contextMenuData);
                break;
            default:
                contextMenuItems =
                    ContextMenuHelper.getAnnotationContextMenuItems(contextMenuData.contextMenuType, contextMenuData.annotationData);
                break;
        }
        return contextMenuItems;
    };
    /**
     * get the contextmenudata details from helper according to the contextmenu type
     */
    ContextMenuHelper.getContextMenuData = function (contextMenuData) {
        var data;
        if (contextMenuData) {
            switch (contextMenuData.contextMenuType) {
                case enums.ContextMenuType.acetate:
                    data = contextMenuData;
                    break;
                case enums.ContextMenuType.annotation:
                    data = contextMenuData;
                    break;
                case enums.ContextMenuType.bookMark:
                    data = contextMenuData;
                    break;
            }
        }
        else {
            data = new annotationContextMenuData;
            data.contextMenuType = enums.ContextMenuType.annotation;
        }
        return data;
    };
    /**
     * Do action according to the menyactiontype.
     */
    ContextMenuHelper.doClickAction = function (xPos, yPos, selectedClientToken, menuAction, value, contextMenuData) {
        switch (menuAction) {
            case enums.MenuAction.RemoveAnnotation:
                markingActionCreator.removeAnnotation(selectedClientToken, false, contextMenuData.contextMenuType);
                // Fix for the defect 65467 - remove the context menu visibility 
                // after clicked the remove annotation option for dynamic annotation
                markingActionCreator.showOrHideRemoveContextMenu(false);
                break;
            case enums.MenuAction.ChangeAnnotationColor:
                if (value) {
                    ContextMenuHelper.updateAnnotationColor(contextMenuData.annotationData, value);
                }
                break;
            case enums.MenuAction.RemoveOverlay:
                acetatesActionCreator.removeAcetate(selectedClientToken[0], contextMenuData.acetateToolType, enums.MultiLineItems.all);
                break;
            case enums.MenuAction.RemoveMultilineLine:
                acetatesActionCreator.removeAcetate(selectedClientToken[0], contextMenuData.acetateToolType, enums.MultiLineItems.line, contextMenuData);
                break;
            case enums.MenuAction.RemoveMultilinePoint:
                acetatesActionCreator.removeAcetate(selectedClientToken[0], contextMenuData.acetateToolType, enums.MultiLineItems.point, contextMenuData);
                break;
            case enums.MenuAction.AddMultilinePoint:
                acetatesActionCreator.addMultilineItems(contextMenuData.clientToken, xPos, yPos, contextMenuData ? contextMenuData : null, enums.MultiLineItems.point);
                break;
            case enums.MenuAction.AddMultilineLine:
                acetatesActionCreator.addMultilineItems(contextMenuData.clientToken, xPos, yPos, contextMenuData ? contextMenuData : null, enums.MultiLineItems.line);
                break;
            case enums.MenuAction.LineStyleOverlay:
                contextMenuData.multilinearguments.LineType = ContextMenuHelper.getMultilineStyleByMenuAction(value);
                acetatesActionCreator.multiLineStyleUpdate(contextMenuData.clientToken, xPos, yPos, contextMenuData ? contextMenuData : null, enums.MultiLineItems.line);
                break;
            case enums.MenuAction.ChangeColorOverlay:
                contextMenuData.multilinearguments.LineColor = ContextMenuHelper.getAcetateColorByMenuAction(value);
                acetatesActionCreator.multiLineStyleUpdate(contextMenuData.clientToken, xPos, yPos, contextMenuData ? contextMenuData : null, enums.MultiLineItems.line);
                break;
        }
    };
    /**
     * get Acetate Color based on Menu Action
     * @param color
     */
    ContextMenuHelper.getAcetateColorByMenuAction = function (menuAction) {
        var colorValue = enums.OverlayColor.red;
        switch (menuAction) {
            case enums.MenuAction.MultilineRed:
                colorValue = enums.OverlayColor.red;
                break;
            case enums.MenuAction.MultilineBlack:
                colorValue = enums.OverlayColor.black;
                break;
            case enums.MenuAction.MultilineBlue:
                colorValue = enums.OverlayColor.blue;
                break;
            case enums.MenuAction.MultilineGreen:
                colorValue = enums.OverlayColor.green;
                break;
            case enums.MenuAction.MultilinePink:
                colorValue = enums.OverlayColor.pink;
                break;
            case enums.MenuAction.MultilineYellow:
                colorValue = enums.OverlayColor.yellow;
                break;
        }
        return colorValue;
    };
    /**
     * get Multiline Style based on Menu Action
     * @param color
     */
    ContextMenuHelper.getMultilineStyleByMenuAction = function (menuAction) {
        var lineType = enums.LineType.line;
        switch (menuAction) {
            case enums.MenuAction.StraightLine:
                lineType = enums.LineType.line;
                break;
            case enums.MenuAction.CurvedLine:
                lineType = enums.LineType.curve;
                break;
            case enums.MenuAction.HiddenLine:
                lineType = enums.LineType.none;
                break;
        }
        return lineType;
    };
    /**
     * Update Annotation Color
     * @param currentlySelectedAnnotation
     * @param color
     */
    ContextMenuHelper.updateAnnotationColor = function (currentlySelectedAnnotation, color) {
        var colors = color.replace('rgb(', '').replace(')', '').split(',');
        currentlySelectedAnnotation.red = Number(colors[0]);
        currentlySelectedAnnotation.green = Number(colors[1]);
        currentlySelectedAnnotation.blue = Number(colors[2]);
        // Change and Save the User options.
        userOptionshelper.save(userOptionkeys.HIGHTLIGHTER_COLOR, color, true, true);
        markingActionCreator.updateAnnotationColor(currentlySelectedAnnotation);
    };
    /**
     * Update Color panel visibilty
     * @param menuAction
     * @param value
     */
    ContextMenuHelper.setColourPanelVisibility = function (menuAction, value) {
        if (menuAction === enums.MenuAction.ChangeAnnotationColor) {
            this.isColorPanelVisible = true;
        }
        if (value) {
            this.isColorPanelVisible = false;
        }
        return this.isColorPanelVisible;
    };
    /**
     * Update shared panel visibilty
     * @param contextMenuData
     */
    ContextMenuHelper.setSharedPanelVisibility = function (contextMenuData) {
        var isShared = false;
        if (contextMenuData &&
            contextMenuData.acetateToolType === enums.ToolType.multiline) {
            isShared = qigstore.instance.acetatesList.filter(function (x) {
                return x.clientToken === contextMenuData.clientToken;
            }).first().shared;
        }
        return isShared;
    };
    /**
     * get Acetate Color
     * @param color
     */
    ContextMenuHelper.getAcetateColor = function (color) {
        var colorValue;
        switch (color) {
            case enums.MenuAction.MultilineRed:
                colorValue = 'rgb(255,0,0)';
                break;
            case enums.MenuAction.MultilineBlack:
                colorValue = 'rgb(0,0,0)';
                break;
            case enums.MenuAction.MultilineBlue:
                colorValue = 'rgb(0,0,255)';
                break;
            case enums.MenuAction.MultilineGreen:
                colorValue = 'rgb(0,255,0)';
                break;
            case enums.MenuAction.MultilinePink:
                colorValue = 'rgb(255,20,147)';
                break;
            case enums.MenuAction.MultilineYellow:
                colorValue = 'rgb(255,255,0)';
                break;
        }
        return colorValue;
    };
    /**
     * get Acetate LineType ClassName
     * @param value
     * @param isSelected
     */
    ContextMenuHelper.getAcetateLineTypeClassName = function (value, isSelected) {
        var _value = 'context-list menu-item';
        switch (value) {
            case enums.MenuAction.StraightLine:
                _value += ' straight-menu-item';
                break;
            case enums.MenuAction.CurvedLine:
                _value += ' curved-menu-item';
                break;
            case enums.MenuAction.HiddenLine:
                _value += ' hidden-menu-item';
                break;
        }
        _value = isSelected ? (_value += ' selected') : _value;
        return _value;
    };
    /**
     * get submenu item details(classname,id,text,style)
     * @param item
     */
    ContextMenuHelper.getSubmenuItemData = function (item) {
        var submenuData;
        switch (item.submenuAction) {
            case enums.MenuAction.RemoveOverlay:
                submenuData = {
                    className: 'context-link add-point',
                    id: 'SubMenu_RemoveMultilineAll'
                };
                break;
            case enums.MenuAction.RemoveMultilinePoint:
                submenuData = {
                    className: 'context-link add-point',
                    id: 'SubMenu_RemoveMultilinePoint'
                };
                break;
            case enums.MenuAction.RemoveMultilineLine:
                submenuData = {
                    className: 'context-link add-line',
                    id: 'SubMenu_RemoveMultilineLine'
                };
                break;
            case enums.MenuAction.AddMultilinePoint:
                submenuData = {
                    className: 'context-link add-point',
                    id: 'SubMenu_AddMultilinePoint'
                };
                break;
            case enums.MenuAction.AddMultilineLine:
                submenuData = {
                    className: 'context-link add-line',
                    id: 'SubMenu_AddMultilineLine'
                };
                break;
            case enums.MenuAction.ChangeColorOverlay:
                submenuData = {
                    className: 'context-link',
                    id: 'SubMenu_Default',
                    style: ContextMenuHelper.getAcetateColor(item.value)
                };
                break;
            default:
                submenuData = {
                    className: 'context-link',
                    id: 'SubMenu_Default',
                    style: item.value
                };
                break;
        }
        return submenuData;
    };
    ContextMenuHelper.isColorPanelVisible = false;
    return ContextMenuHelper;
}());
module.exports = ContextMenuHelper;
//# sourceMappingURL=contextmenuhelper.js.map