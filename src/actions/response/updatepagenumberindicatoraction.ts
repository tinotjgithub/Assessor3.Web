import action = require('../base/action');
import actionType = require('../base/actiontypes');
import pageNoIndicatorData = require('../../stores/response/pagenoindicatordata');

class UpdatePageNumberIndicatorAction extends action {

    private mostVisiblePage: Array<number>;
    private imageNo: Array<number>;
    private _isBookletView: boolean;

    /**
     * Constructor UpdatePageNumberIndicatorAction
     * @param pageNo
     * @param imageNo
     */
    constructor(pageNo: Array<number>, imageNo: Array<number>, isBookletView: boolean) {
        super(action.Source.View, actionType.UPDATE_PAGE_NO_INDICATOR);
        this.mostVisiblePage = pageNo;
        this.imageNo = imageNo;
        this._isBookletView = isBookletView;
    }

    public get pageNoIndicatorData(): pageNoIndicatorData {
        return new pageNoIndicatorData(this.mostVisiblePage, this.imageNo);
    }

    public get isBookletView(): boolean {
        return this._isBookletView;
    }
}

export = UpdatePageNumberIndicatorAction;