import responsecontainerpropertybase = require('./responsecontainerpropertybase');

class ECourseworkContainerProperty extends responsecontainerpropertybase {
    /** property to holds the information of whether coursework  file is auto selected or not */
    private _iseCourseWorkAutoFileSelected: boolean;

    public get iseCourseWorkAutoFileSelected(): boolean {
        return this._iseCourseWorkAutoFileSelected;
    }

    public set iseCourseWorkAutoFileSelected(theIseCourseWorkAutoFileSelected: boolean) {
        this._iseCourseWorkAutoFileSelected = theIseCourseWorkAutoFileSelected;
    }

    /* property to hold whether media player is loaded or not */
    private _isPlayerLoaded: boolean;

    public get isPlayerLoaded(): boolean {
        return this._isPlayerLoaded;
    }

    public set isPlayerLoaded(isPlayerLoaded: boolean) {
        this._isPlayerLoaded = isPlayerLoaded;
    }

    constructor() {
        super();
        this._iseCourseWorkAutoFileSelected = false;
    }
}

export = ECourseworkContainerProperty;
