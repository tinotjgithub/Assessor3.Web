import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dispatcher = require('../../app/dispatcher');

/**
 * Toggle User Information panel
 */
class ToggleUserInfoAction extends action  {

    /**
     * local variable
     * @private
     * @type {boolean}
     * @memberof ToggleUserInfoAction
     */
    private _saveUserOptionData : boolean;
    /**
     * Constructor ToggleUserInfoAction
     * @param actionType
     */
    constructor(actionType: string, saveUserOptionData: boolean) {
        super(action.Source.View, actionType);
        this._saveUserOptionData = saveUserOptionData;
    }

    /**
     * Returns the save useroption data
     * @readonly
     * @type {boolean}
     * @memberof ToggleUserInfoAction
     */
    public get saveUserOptionData(): boolean {
        return this._saveUserOptionData;
    }
}
export = ToggleUserInfoAction;