import enums = require('../../enums');
/**
 * Sub Menu item
 */
class SubMenuItem {
    public name: string;
    public value: any;
    public isSelected: boolean;
    public isDark: boolean;
    public submenuAction: enums.MenuAction;
}

export = SubMenuItem;