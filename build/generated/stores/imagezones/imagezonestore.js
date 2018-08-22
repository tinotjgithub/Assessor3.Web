"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var immutable = require('immutable');
var responseStore = require('../response/responsestore');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
/**
 * Class for Image zone store
 */
var ImageZoneStore = (function (_super) {
    __extends(ImageZoneStore, _super);
    /**
     * @Constructor
     */
    function ImageZoneStore() {
        var _this = this;
        _super.call(this);
        this._candidateScriptImageZoneCollection = immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === actionType.IMAGEZONE_LOAD) {
                var actionResult = action;
                if (actionResult.success) {
                    _this._imageZoneList = actionResult.imageZoneList;
                }
                else {
                    // If a new qig has been selected and call has been failed, clear the previous selection
                    _this._imageZoneList = null;
                }
                _this.emit(ImageZoneStore.IMAGEZONE_LOADED_EVENT);
            }
            else if (action.actionType === actionType.GET_EBOOKMARK_IMAGE_ZONE) {
                // Check whetehr action to load ebookmarking image zones
                var actionResult = action;
                if (actionResult.success) {
                    var result = actionResult.getCandidateScriptEBookMarkImageZoneCollection;
                    // if success, get the image zone collection
                    _this._candidateScriptImageZoneCollection =
                        _this._candidateScriptImageZoneCollection.set(result.candidateScriptId, result.candidateScriptImageZoneCollection);
                }
                _this.emit(ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT);
            }
        });
    }
    Object.defineProperty(ImageZoneStore.prototype, "imageZoneList", {
        /**
         * Get the image zone list against the current qig
         * @returns
         */
        get: function () {
            return this._imageZoneList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageZoneStore.prototype, "candidateScriptImageZoneList", {
        /**
         * Get the image zone list against the current QIG
         * @returns
         */
        get: function () {
            return this._candidateScriptImageZoneCollection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageZoneStore.prototype, "currentCandidateScriptImageZone", {
        /**
         * Get the image zone list against the current script
         * @returns
         */
        get: function () {
            var openedResponseDetails = markerOperationModeFactory.operationMode.
                openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
            if (openedResponseDetails) {
                return this._candidateScriptImageZoneCollection.get(openedResponseDetails.candidateScriptId);
            }
        },
        enumerable: true,
        configurable: true
    });
    // ImageZoneloaded event name.
    ImageZoneStore.IMAGEZONE_LOADED_EVENT = 'ImageZoneLoadedEvent';
    // EbookMarking ImageZone loaded event name.
    ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT = 'EbookMarkingImageZoneLoadedEvent';
    return ImageZoneStore;
}(storeBase));
var instance = new ImageZoneStore();
module.exports = { ImageZoneStore: ImageZoneStore, instance: instance };
//# sourceMappingURL=imagezonestore.js.map