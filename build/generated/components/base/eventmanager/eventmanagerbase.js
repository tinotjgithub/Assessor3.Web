"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hammerHandler = require('./hammerhandler');
var pureRenderComponent = require('../../base/purerendercomponent');
/**
 * Base class for handling letious event types using this class object we can
 * switch between hammer and native events
 */
var EventManagerBase = (function (_super) {
    __extends(EventManagerBase, _super);
    /**
     * event manager constructor
     * @param props
     * @param state
     */
    function EventManagerBase(props, state) {
        _super.call(this, props, state);
    }
    Object.defineProperty(EventManagerBase.prototype, "eventHandler", {
        /**
         * returns the current event handler
         */
        get: function () {
            if (!this._hammerHandler) {
                this._hammerHandler = new hammerHandler();
            }
            return this._hammerHandler;
        },
        enumerable: true,
        configurable: true
    });
    return EventManagerBase;
}(pureRenderComponent));
module.exports = EventManagerBase;
//# sourceMappingURL=eventmanagerbase.js.map