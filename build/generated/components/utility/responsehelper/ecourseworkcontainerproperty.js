"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var responsecontainerpropertybase = require('./responsecontainerpropertybase');
var ECourseworkContainerProperty = (function (_super) {
    __extends(ECourseworkContainerProperty, _super);
    function ECourseworkContainerProperty() {
        _super.call(this);
        this._iseCourseWorkAutoFileSelected = false;
    }
    Object.defineProperty(ECourseworkContainerProperty.prototype, "iseCourseWorkAutoFileSelected", {
        get: function () {
            return this._iseCourseWorkAutoFileSelected;
        },
        set: function (theIseCourseWorkAutoFileSelected) {
            this._iseCourseWorkAutoFileSelected = theIseCourseWorkAutoFileSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseworkContainerProperty.prototype, "isPlayerLoaded", {
        get: function () {
            return this._isPlayerLoaded;
        },
        set: function (isPlayerLoaded) {
            this._isPlayerLoaded = isPlayerLoaded;
        },
        enumerable: true,
        configurable: true
    });
    return ECourseworkContainerProperty;
}(responsecontainerpropertybase));
module.exports = ECourseworkContainerProperty;
//# sourceMappingURL=ecourseworkcontainerproperty.js.map