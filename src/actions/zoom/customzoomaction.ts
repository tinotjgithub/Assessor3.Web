import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class CustomZoomAction extends action {

    // Holds the zoom type. [zoomin/zoomout]
    private _customZoomType: enums.ZoomType;

    // Holds a value indicating user switching to this response view.
    private _responseViewSettings: enums.ResponseViewSettings;

    private _userZoomValue: number;

    /**
     * Constructor
     * @param customZoomType
     * @param responseViewSettings
     * @param userZoomValue
     */
    constructor(customZoomType: enums.ZoomType, responseViewSettings: enums.ResponseViewSettings, userZoomValue?: number) {
        super(action.Source.View, actionType.CUSTOM_ZOOM_ACTION);
        this._customZoomType = customZoomType;
        this._responseViewSettings = responseViewSettings;
        this._userZoomValue = userZoomValue;
    }

    /**
     * Get the zoom type.
     * @returns seleceted zoom type
     */
    public get zoomType(): enums.ZoomType {
        return this._customZoomType;
    }

    /**
     * Get the view where the response is going to switch
     */
    public get responseViewSettings(): enums.ResponseViewSettings {
        return this._responseViewSettings;
    }

    /**
     * Get user zoom value
     */
    public get userZoomValue(): enums.ResponseViewSettings {
        return this._userZoomValue;
    }
}
export = CustomZoomAction;