"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var tagDataService = require('../../dataservices/tag/tagdataservice');
var base = require('../base/actioncreatorbase');
var tagAction = require('./taggetaction');
var tagUpdateAction = require('./tagupdateaction');
var tagListClickAction = require('./taglistclickaction');
var enums = require('../../components/utility/enums');
var TagActionCreator = (function (_super) {
    __extends(TagActionCreator, _super);
    function TagActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * action creator for fetching tags and dispatching the tag get action.
     */
    TagActionCreator.prototype.getTags = function () {
        tagDataService.getTags(function (success, tagData) {
            dispatcher.dispatch(new tagAction(success, tagData));
        });
    };
    /**
     * action creator function for update/delete the tags
     * @param updateResponseTagArguments
     */
    TagActionCreator.prototype.updateTags = function (updateResponseTagArguments, tagOrder, markGroupId, markingMode) {
        if (markingMode === void 0) { markingMode = enums.MarkingMode.None; }
        var that = this;
        tagDataService.updateTags(updateResponseTagArguments, function (success, tagUpdate) {
            if (that.validateCall(tagUpdate, false, true)) {
                if (!success) {
                    tagUpdate = undefined;
                }
            }
            dispatcher.dispatch(new tagUpdateAction(success, updateResponseTagArguments.tagId, updateResponseTagArguments.markGroupList, tagOrder, markGroupId, markingMode, tagUpdate));
        });
    };
    /**
     * action creator function for notifying tag list clicked.
     * @param mark group id of selected response in worklist.
     */
    TagActionCreator.prototype.tagListClickAction = function (markGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new tagListClickAction(markGroupId));
        }).catch();
    };
    return TagActionCreator;
}(base));
var tagActionCreator = new TagActionCreator();
module.exports = tagActionCreator;
//# sourceMappingURL=tagactioncreator.js.map