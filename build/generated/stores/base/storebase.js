"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Events = require('events');
/**
 * Base class for Store
 */
var StoreBase = (function (_super) {
    __extends(StoreBase, _super);
    /**
     * @constructor
     */
    function StoreBase() {
        _super.call(this);
    }
    Object.defineProperty(StoreBase.prototype, "dispatchToken", {
        /**
         *  gets the dispatch token
         */
        get: function () {
            return this._dispatchToken;
        },
        /**
         *  sets the dispatch token variable
         */
        set: function (dispatchToken) {
            this._dispatchToken = dispatchToken;
        },
        enumerable: true,
        configurable: true
    });
    return StoreBase;
}(Events.EventEmitter));
module.exports = StoreBase;
//# sourceMappingURL=storebase.js.map