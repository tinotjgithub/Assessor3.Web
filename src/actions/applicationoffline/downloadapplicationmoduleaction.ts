import action = require('../base/action');
import actionType = require('../base/actiontypes');

class DownloadApplicationModuleAction extends action {

    // Holds the module name to download
    private _moduleName: string;

    /**
     * Initialize a new instance of DownloadApplicationModule.
     * @param {string} moduleName
     */
    constructor(moduleName: string) {
        super(action.Source.View, actionType.DOWNLOAD_APPLICATION_MODULE_ACTION);
        this._moduleName = moduleName;
    }

    /**
     * Gets a value indicating the module name
     * @returns
     */
    public get moduleName(): string {
        return this._moduleName;
    }
}

export = DownloadApplicationModuleAction;