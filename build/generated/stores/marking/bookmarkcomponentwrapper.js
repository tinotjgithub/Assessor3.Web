"use strict";
var BookmarkComponentWrapper = (function () {
    /**
     * Creates an instance of BookmarkComponentWrapper.
     * @memberof BookmarkComponentWrapper
     */
    function BookmarkComponentWrapper(prefix) {
        this.isEcoursework = false;
        this._prefix = prefix;
    }
    Object.defineProperty(BookmarkComponentWrapper.prototype, "toolTip", {
        /**
         * The tool tip associated with the bookmark
         *
         * @type {string}
         * @memberof BookmarkComponentWrapper
         */
        get: function () {
            this._pageNum = this._prefix + ' ' + this.pageNo.toString();
            if (this.isEcoursework) {
                if (this.fileName) {
                    this._toolTip = this.fileName + ', ' + this._pageNum;
                }
                else {
                    this._toolTip = this._pageNum;
                }
                return this._toolTip;
            }
            // For non-Ecoursework unstructured response, return only page number
            return this._pageNum;
        },
        enumerable: true,
        configurable: true
    });
    return BookmarkComponentWrapper;
}());
module.exports = BookmarkComponentWrapper;
//# sourceMappingURL=bookmarkcomponentwrapper.js.map