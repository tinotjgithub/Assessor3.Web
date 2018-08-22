"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var DeSelectAnnotationAction = (function (_super) {
    __extends(DeSelectAnnotationAction, _super);
    /**
     * Constructor
     */
    function DeSelectAnnotationAction() {
        _super.call(this, action.Source.View, actionType.DE_SELECT_ANNOTATION);
    }
    return DeSelectAnnotationAction;
}(action));
module.exports = DeSelectAnnotationAction;
//# sourceMappingURL=deselectannotationaction.js.map