"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var ImageZoneAction = (function (_super) {
    __extends(ImageZoneAction, _super);
    /**
     * @Constructor.
     * @param {boolean} success
     * @param {any} imageZoneList
     * @param {enums.MarkingMethod} originalMarkingMethod
     */
    function ImageZoneAction(success, imageZoneList, originalMarkingMethod) {
        _super.call(this, action.Source.View, actionType.IMAGEZONE_LOAD, success);
        // Map the collection
        this._imageZoneList = imageZoneList;
        this._originalMarkingMethod = originalMarkingMethod;
    }
    Object.defineProperty(ImageZoneAction.prototype, "imageZoneList", {
        /**
         * Returns the list of image zones associated to the selected QIG.
         * @returns
         */
        get: function () {
            return this._imageZoneList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageZoneAction.prototype, "originalMarkingMethod", {
        /**
         * Returns the originalMarkingMethod.
         * @returns
         */
        get: function () {
            return this._originalMarkingMethod;
        },
        enumerable: true,
        configurable: true
    });
    return ImageZoneAction;
}(dataRetrievalAction));
module.exports = ImageZoneAction;
//# sourceMappingURL=imagezonesaction.js.map