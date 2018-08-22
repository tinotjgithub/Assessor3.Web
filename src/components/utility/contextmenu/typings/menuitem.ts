import SubMenuItem = require('./submenuitem');
import contextMenuData = require('../contextmenudata');
import enums = require('../../enums');

/**
 * Menu item
 */
class MenuItem {
    public name: string;
    public hasSubMenu: boolean;
    public menuAction: enums.MenuAction;
    public subMenu: Array<SubMenuItem>;
    public isSharedItem?: boolean;
    public contextMenuData?: any;
}

export = MenuItem;