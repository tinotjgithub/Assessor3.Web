import action = require('../base/action');
import actionTypes = require('../base/actiontypes');

class ShowHeaderIconsAction extends action {

    private _showHeaderIcons: boolean;

    /**
     * Constructor for ShowHeaderIconsAction
     * @param showIcons
     */
    constructor(showIcons: boolean = true) {
        super(action.Source.View, actionTypes.SHOW_HEADER_ICONS);
        this._showHeaderIcons = showIcons;
    }

    /**
     * Show Icons in Header bar
     * @returns flag whether show header icons
     */
    public get showHeaderIcons(): boolean {
        return this._showHeaderIcons;
    }
}

export = ShowHeaderIconsAction;