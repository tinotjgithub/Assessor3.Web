import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ResponsePinchZoomAction extends action {

    // hold a value indicating the contianer width
    private _marksheetHolderWidth: number;

    /**
     * Initialise a new instance of response zoom action to prepare the responses pages to
     * start the pinch to Zoom
     * @param {number} marksheetHolderWidth
     */
    constructor(marksheetHolderWidth: number) {
        super(action.Source.View, actionType.RESPONSEPINCHZOOMACTION);

        // assigning the marksheet holder width
        this._marksheetHolderWidth = marksheetHolderWidth;
    }

    /**
     * Gets a value indicating the current marksheet holder width.
     * @returns
     */
    public get markSheetHolderWidth() {
        return this._marksheetHolderWidth;
    }
}
export = ResponsePinchZoomAction;
