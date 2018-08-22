"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
/**
 * Store fore locale.
 */
var TagStore = (function (_super) {
    __extends(TagStore, _super);
    /**
     * @constructor
     */
    function TagStore() {
        var _this = this;
        _super.call(this);
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.TAG_GET:
                    _this.success = action.success;
                    if (_this.success) {
                        _this._tags = action.tagData;
                        // Adding the empty tag to the list.
                        _this._tags.push({ tagId: 0, tagName: '', tagOrder: 0 });
                    }
                    break;
            }
        });
    }
    Object.defineProperty(TagStore.prototype, "tags", {
        /**
         * gets the tags
         */
        get: function () {
            return this._tags;
        },
        enumerable: true,
        configurable: true
    });
    return TagStore;
}(storeBase));
var instance = new TagStore();
module.exports = { TagStore: TagStore, instance: instance };
//# sourceMappingURL=tagstore.js.map