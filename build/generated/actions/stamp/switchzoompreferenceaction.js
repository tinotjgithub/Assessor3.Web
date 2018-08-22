"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SwitchZoomPreferenceAction = (function (_super) {
    __extends(SwitchZoomPreferenceAction, _super);
    /**
     * Creates an instance of SwitchZoomPreferenceAction.
     *
     * @memberof SwitchZoomPreferenceAction
     */
    function SwitchZoomPreferenceAction(zoomPreference) {
        _super.call(this, action.Source.View, actionType.SWITCH_ZOOM_PREFERENCE);
        this._zoomPreference = zoomPreference;
    }
    Object.defineProperty(SwitchZoomPreferenceAction.prototype, "zoomPreference", {
        /**
         * zoom Preference
         *
         * @readonly
         * @type {boolean}
         * @memberof SwitchZoomPreferenceAction
         */
        get: function () {
            return this._zoomPreference;
        },
        enumerable: true,
        configurable: true
    });
    return SwitchZoomPreferenceAction;
}(action));
module.exports = SwitchZoomPreferenceAction;
//# sourceMappingURL=switchzoompreferenceaction.js.map