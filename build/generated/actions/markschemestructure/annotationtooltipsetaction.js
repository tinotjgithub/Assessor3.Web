"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * class for annotation tooltip set action against markSchemeIds
 */
var AnnotationToolTipSetAction = (function (_super) {
    __extends(AnnotationToolTipSetAction, _super);
    /**
     * @Constructor.
     * @param {boolean} success
     * @param {any} tooltipInfo
     */
    function AnnotationToolTipSetAction(success, tooltipInfo) {
        _super.call(this, action.Source.View, actionType.SET_ANNOTATION_TOOLTIPS, success);
        this._toolTipInfo = tooltipInfo;
    }
    Object.defineProperty(AnnotationToolTipSetAction.prototype, "toolTipInfo", {
        /**
         * Returns the annotation tooltip dictionary
         * @returns
         */
        get: function () {
            return this._toolTipInfo;
        },
        enumerable: true,
        configurable: true
    });
    return AnnotationToolTipSetAction;
}(dataRetrievalAction));
module.exports = AnnotationToolTipSetAction;
//# sourceMappingURL=annotationtooltipsetaction.js.map