"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var enums = require('../../components/utility/enums');
var imageZonesAction = require('./imagezonesaction');
var imageZoneDataService = require('../../dataservices/imagezones/imagezonesdataservice');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
/**
 * Class for Imagezone actioncreator
 */
var ImageZoneActionCreator = (function (_super) {
    __extends(ImageZoneActionCreator, _super);
    function ImageZoneActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Get the list of image zones of structured paper. If the selected marking method is other than structured clear the selection.
     * @param {number} questionPaperId
     * @param {enums.MarkingMethod} markingMethod
     */
    ImageZoneActionCreator.prototype.getImagezoneList = function (questionPaperId, markSchemeGroupId, markingMethod, useCache) {
        if (useCache === void 0) { useCache = true; }
        // If not structured clear existing the imagezone collection
        if (markingMethod !== enums.MarkingMethod.Structured) {
            // Dummy promise to dispatch an action
            var promise = new Promise.Promise(function (resolve, reject) {
                resolve();
            });
            promise.then(function () {
                dispatcher.dispatch(new imageZonesAction(true, null, markingMethod));
            }).catch();
        }
        else {
            var that_1 = this;
            // Get data from cach or online
            imageZoneDataService.getImageZoneDetails(function (success, jsonData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that_1.validateCall(jsonData)) {
                    dispatcher.dispatch(new imageZonesAction(success, jsonData, markingMethod));
                }
            }, questionPaperId, markSchemeGroupId, useCache);
        }
    };
    return ImageZoneActionCreator;
}(base));
var imageZoneActionCreator = new ImageZoneActionCreator();
module.exports = imageZoneActionCreator;
//# sourceMappingURL=imagezoneactioncreator.js.map