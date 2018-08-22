import menuItem = require('./typings/menuitem');
import submenuItem = require('../../utility/contextmenu/typings/submenuitem');
import enums = require('../enums');
import annotation = require('../../../stores/response/typings/annotation');
import colouredannotationshelper = require('../../../utility/stamppanel/colouredannotationshelper');
import userOptionshelper = require('../../../utility/useroption/useroptionshelper');
import qigstore = require('../../../stores/qigselector/qigstore');
import userOptionkeys = require('../../../utility/useroption/useroptionkeys');
import acetateContextMenuData = require('./acetatecontextmenudata');
import contextMenuData = require('./contextmenudata');
import annotationContextMenuData = require('./annotationcontextmenudata');
import bookMarkContextMenuData = require('./bookmarkcontextmenudata');
import acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import responseHelper = require('../responsehelper/responsehelper');

class ContextMenuHelper {
    private static isColorPanelVisible = false;

    /**
     * Get menu items
     */
    public static getAnnotationContextMenuItems(contextMenuType: enums.ContextMenuType, annotationData?: annotation,
        contextMenuDetails?: annotationContextMenuData): Array<menuItem> {

        let items: Array<menuItem> = [];
        let item: menuItem = null;
        let stampType: enums.StampType = null;

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
                let colorStatus = colouredannotationshelper.getHighlighterColouredAnnotationStatusForTheQIG();
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
                        item.subMenu = new Array<submenuItem>();
                        let colorsubmenuitems = this.getColorSubItems(annotationData, contextMenuDetails);
                        colorsubmenuitems.map((subItem: submenuItem) => {
                            item.subMenu.push(subItem);
                        });
                        items.push(item);
                    }
                }
                break;
        }

        return items;
    }

    /**
     * Get menu items
     */
    public static getBookmarkContextMenuItems(contextMenuType: enums.ContextMenuType, contextMenuData: contextMenuData): Array<menuItem> {

        let items: Array<menuItem> = [];
        let item: menuItem = null;
        item = new menuItem();
        item.hasSubMenu = false;
        item.menuAction = enums.MenuAction.RemoveAnnotation;
        item.name = 'marking.response.annotation-context-menu.remove-bookmark';
        item.contextMenuData = contextMenuData;
        items.push(item);
        return items;
    }

    /**
     * Get menu items
     */
    public static getAcetateContextMenuItems(contextMenuType: enums.ContextMenuType,
        acetateToolType: enums.ToolType,
        contextMenuDetails: acetateContextMenuData): Array<menuItem> {

        let items: Array<menuItem> = [];
        let item: menuItem = null;
        item = new menuItem();
        item.hasSubMenu = false;
        item.menuAction = enums.MenuAction.RemoveOverlay;
        item.contextMenuData = contextMenuDetails;
        if (acetateToolType === enums.ToolType.multiline) {
            let shareItem: menuItem = null;
            let mainName = 'marking.response.annotation-context-menu';
            if (contextMenuDetails.multilinearguments.isShared && qigstore.instance.getSelectedQIGForTheLoggedInUser &&
                qigstore.instance.getSelectedQIGForTheLoggedInUser.role !== enums.ExaminerRole.principalExaminer) {
                let _menuItem = {
                    name: mainName + '.remove-multiline-shared',
                    hasSubMenu: false,
                    menuAction: enums.MenuAction.RemoveOverlay,
                    subMenu: null,
                    contextMenuData: contextMenuDetails
                };

                items = [_menuItem];
            } else {
                if (qigstore.instance.getSelectedQIGForTheLoggedInUser &&
                    qigstore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer) {
                    shareItem = {
                        name: mainName + '.share-multiline',
                        hasSubMenu: false, menuAction: null, subMenu: null, isSharedItem: true
                    };
                }

                let addPointSubmenu = {
                    name: mainName + '.point-multiline',
                    value: null,
                    isSelected: null,
                    isDark: null,
                    submenuAction: enums.MenuAction.AddMultilinePoint
                };

                let addLineSubmenu = {
                    name: mainName + '.line-multiline',
                    value: null,
                    isSelected: null,
                    isDark: null,
                    submenuAction: enums.MenuAction.AddMultilineLine
                };

                let _menuItem = {
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

                let _lineType = contextMenuDetails.multilinearguments.LineType;
                let _lineColor = contextMenuDetails.multilinearguments.LineColor;

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
        } else {
            let name = 'marking.response.annotation-context-menu.remove-';
            if (acetateToolType === enums.ToolType.ruler) {
                item.name = name + enums.ToolType[acetateToolType];
                item.contextMenuData = contextMenuDetails;
            } else if (acetateToolType === enums.ToolType.protractor) {
                item.name = name + enums.ToolType[acetateToolType];
                item.contextMenuData = contextMenuDetails;
            }
            items.push(item);
        }
        return items = items.filter(function(x) { return x !== null; });
    }

    /**
     * get Is Selected
     * @param value1
     * @param value2
     */
    public static getIsSelected(value1: any, value2: any): boolean {
        return value1 === value2;
    }

    /**
     * Get color sub menu items
     */
    public static getColorSubItems(annotationData: annotation,
        acetateContextMenuData: any): Array<submenuItem> {
        let colorsubmenuitems: Array<submenuItem> = [
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

        let color = 'rgb(' + annotationData.red + ',' + annotationData.green + ',' + annotationData.blue + ')';
        colorsubmenuitems.map((menu: submenuItem) => {
            if (menu.value === color) {
                menu.isSelected = true;
            }
        });

        return colorsubmenuitems;
    }

    /**
     * Check if context menu goes offscreen on right hand side of the window.
     * If mouse X position + content menu width is greater than annotation overlay width then
     * it means that when context menu is rendered it will go offscreen.
     */
    public static isRigtAlignmentRequired(mouseX: number, contextMenuWidth: number, annotationOverlayWidth: number): boolean {

        if ((mouseX + contextMenuWidth) > annotationOverlayWidth) {
            return true;
        }

        return false;
    }

    /**
     * Check if context menu goes offscreen on bottom side of the window.
     * If mouse Y position + content menu height is greater than annotation overlay width then
     * it means that when context menu is rendered it will go offscreen.
     */
    public static isBottomAlignmentRequired(mouseY: number, contextMenuHeight: number, windowHeight: number): boolean {

        if ((mouseY + contextMenuHeight) > windowHeight) {
            return true;
        }

        return false;
    }

    /**
     * Check if sub menu goes offscreen on bottom side of the window.
     */
    public static isRigtAlignmentRequiredForSubMenu(parentWidth: number, clientXCoordinate: number, contextMenuWidth: number) {

        if (parentWidth < clientXCoordinate + contextMenuWidth) {
            return true;
        }

        return false;
    }

    /**
     * Get X coordinate's
     * If rightAlign is applied that means we need to move X co-ordinate by 2
     * so that context menu will be positioned in such a way that the mouse pointer
     * is over the "Remove annotation" option once it appears
     * @param x
     * @param rightAlign
     */
    public static getXcoordinate(x: number, rightAlign: boolean): number {
        if (x === undefined) {
            return 0;
        }

        if (rightAlign === true) {
            return x + 2;
        } else {
            return x - 2;
        }
    }

    /**
     * Get Y coordinate's
     * If bottomAlign is applied that means we need to move Y co-ordinate by 2
     * so that context menu will be positioned in such a way that the mouse pointer
     * is over the "Remove annotation" option once it appears
     * @param y
     * @param bottomAlign
     */
    public static getYcoordinate(y: number, bottomAlign: boolean): number {
        if (y === undefined) {
            return 0;
        }

        if (bottomAlign === true) {
            return y + 2;
        } else {
            return y;
        }
    }

    /**
     * get the contextmenuitem details from helper according to the contextmenu type
     */
    public static getContextMenuItems(contextMenuData: any) {
        let contextMenuItems: Array<menuItem> = [];
        switch (contextMenuData.contextMenuType) {
            case enums.ContextMenuType.annotation:
                contextMenuItems =
                    ContextMenuHelper.getAnnotationContextMenuItems(contextMenuData.contextMenuType,
                        contextMenuData.annotationData, contextMenuData);
                break;
            case enums.ContextMenuType.bookMark:
                contextMenuItems =
                    ContextMenuHelper.getBookmarkContextMenuItems(contextMenuData.contextMenuType, contextMenuData);
                break;
            case enums.ContextMenuType.acetate:
                contextMenuItems =
                    ContextMenuHelper.getAcetateContextMenuItems(
                        contextMenuData.contextMenuType,
                        contextMenuData.acetateToolType,
                        contextMenuData);
                break;
            default:
                contextMenuItems =
                    ContextMenuHelper.getAnnotationContextMenuItems(contextMenuData.contextMenuType, contextMenuData.annotationData);
                break;
        }
        return contextMenuItems;
    }

    /**
     * get the contextmenudata details from helper according to the contextmenu type
     */
    public static getContextMenuData(contextMenuData?: contextMenuData) {
        let data: contextMenuData;
        if (contextMenuData) {
            switch (contextMenuData.contextMenuType) {
                case enums.ContextMenuType.acetate:
                    data = contextMenuData as acetateContextMenuData;
                    break;
                case enums.ContextMenuType.annotation:
                    data = contextMenuData as annotationContextMenuData;
                    break;
                case enums.ContextMenuType.bookMark:
                    data = contextMenuData as bookMarkContextMenuData;
                    break;
            }
        } else {
            data = new annotationContextMenuData;
            data.contextMenuType = enums.ContextMenuType.annotation;
        }
        return data;
    }

    /**
     * Do action according to the menyactiontype.
     */
    public static doClickAction(xPos: number, yPos: number, selectedClientToken: Array<string>,
        menuAction: enums.MenuAction, value?: any, contextMenuData?: any) {
        switch (menuAction) {
            case enums.MenuAction.RemoveAnnotation:
                let isMarkByAnnotation: boolean;
                isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
                markingActionCreator.removeAnnotation(selectedClientToken, isMarkByAnnotation, false, contextMenuData.contextMenuType);
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
                acetatesActionCreator.removeAcetate(
                    selectedClientToken[0],
                    contextMenuData.acetateToolType,
                    enums.MultiLineItems.all);
                break;
            case enums.MenuAction.RemoveMultilineLine:
                acetatesActionCreator.removeAcetate(
                    selectedClientToken[0],
                    contextMenuData.acetateToolType,
                    enums.MultiLineItems.line,
                    contextMenuData);
                break;
            case enums.MenuAction.RemoveMultilinePoint:
                acetatesActionCreator.removeAcetate(selectedClientToken[0],
                    contextMenuData.acetateToolType,
                    enums.MultiLineItems.point,
                    contextMenuData);
                break;
            case enums.MenuAction.AddMultilinePoint:
                acetatesActionCreator.addMultilineItems(
                    contextMenuData.clientToken,
                    xPos,
                    yPos,
                    contextMenuData ? contextMenuData : null,
                    enums.MultiLineItems.point);
                break;
            case enums.MenuAction.AddMultilineLine:
                acetatesActionCreator.addMultilineItems(
                    contextMenuData.clientToken,
                    xPos,
                    yPos,
                    contextMenuData ? contextMenuData : null,
                    enums.MultiLineItems.line);
                break;
            case enums.MenuAction.LineStyleOverlay:
                contextMenuData.multilinearguments.LineType = ContextMenuHelper.getMultilineStyleByMenuAction(value);
                acetatesActionCreator.multiLineStyleUpdate(
                    contextMenuData.clientToken,
                    xPos,
                    yPos,
                    contextMenuData ? contextMenuData : null,
                    enums.MultiLineItems.line);
                break;
            case enums.MenuAction.ChangeColorOverlay:
                contextMenuData.multilinearguments.LineColor = ContextMenuHelper.getAcetateColorByMenuAction(value);
                acetatesActionCreator.multiLineStyleUpdate(
                    contextMenuData.clientToken,
                    xPos,
                    yPos,
                    contextMenuData ? contextMenuData : null,
                    enums.MultiLineItems.line);
                break;
        }
    }

    /**
     * get Acetate Color based on Menu Action
     * @param color
     */
    private static getAcetateColorByMenuAction(menuAction: any) {
        let colorValue = enums.OverlayColor.red;
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
    }

    /**
     * get Multiline Style based on Menu Action
     * @param color
     */
    private static getMultilineStyleByMenuAction(menuAction: any) {
        let lineType = enums.LineType.line;
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
    }

    /**
     * Update Annotation Color
     * @param currentlySelectedAnnotation
     * @param color
     */
    private static updateAnnotationColor(currentlySelectedAnnotation: annotation, color: string) {
        let colors: Array<string> = color.replace('rgb(', '').replace(')', '').split(',');

        currentlySelectedAnnotation.red = Number(colors[0]);
        currentlySelectedAnnotation.green = Number(colors[1]);
        currentlySelectedAnnotation.blue = Number(colors[2]);

        // Change and Save the User options.
        userOptionshelper.save(userOptionkeys.HIGHTLIGHTER_COLOR, color, true, true);
        markingActionCreator.updateAnnotationColor(currentlySelectedAnnotation);
    }

    /**
     * Update Color panel visibilty
     * @param menuAction
     * @param value
     */
    public static setColourPanelVisibility(menuAction: enums.MenuAction, value?: any) {
        if (menuAction === enums.MenuAction.ChangeAnnotationColor) {
            this.isColorPanelVisible = true;
        }
        if (value) {
            this.isColorPanelVisible = false;
        }
        return this.isColorPanelVisible;
    }

    /**
     * Update shared panel visibilty
     * @param contextMenuData
     */
    public static setSharedPanelVisibility(contextMenuData: acetateContextMenuData): boolean {
        let isShared: boolean = false;
        if (contextMenuData &&
            contextMenuData.acetateToolType === enums.ToolType.multiline) {
            isShared = qigstore.instance.acetatesList.filter((x) =>
                x.clientToken === contextMenuData.clientToken).first().shared;
        }
        return isShared;
    }

    /**
     * get Acetate Color
     * @param color
     */
    public static getAcetateColor(color: any) {
        let colorValue;
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
    }

    /**
     * get Acetate LineType ClassName
     * @param value
     * @param isSelected
     */
    public static getAcetateLineTypeClassName(value: any, isSelected: boolean) {
        let _value = 'context-list menu-item';
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
    }

    /**
     * get submenu item details(classname,id,text,style)
     * @param item
     */
    public static getSubmenuItemData(item: submenuItem) {
        let submenuData: any;
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
    }
}

export = ContextMenuHelper;