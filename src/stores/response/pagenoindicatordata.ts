/**
 * Class for storing the page data to update page no: indicator during scrolling.
 */
class PageNoIndicatorData {
    private _mostVisiblePageNo: Array<number> = [];
    private _imageNo: Array<number> = [];

    /**
     * Constructor for PageNoIndicatorData
     * @param {Array<number>} pageNo
     * @param {Array<number>} imageNo
     */
    constructor(pageNo: Array<number>, imageNo: Array<number>) {
        this._mostVisiblePageNo = pageNo;
        this._imageNo = imageNo;
    }
    /** get mostVisiblePageNo */
    public get mostVisiblePageNo(): Array<number> {
        return this._mostVisiblePageNo;
    }

    /** get imageNo */
    public get imageNo(): Array<number> {
        return this._imageNo;
    }
}

export = PageNoIndicatorData;