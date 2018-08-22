"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var responseContainerHelperBase = require('./responsecontainerhelperbase');
var HtmlContainerHelper = (function (_super) {
    __extends(HtmlContainerHelper, _super);
    function HtmlContainerHelper(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode) {
        _super.call(this, _responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode);
    }
    /**
     * wrapper class name
     * @param isExceptionPanelVisible
     * @param isCommentsSideViewEnabled
     */
    HtmlContainerHelper.prototype.getResponseModeWrapperClassName = function (isExceptionPanelVisible, isCommentsSideViewEnabled) {
        return this.getWrapperClassName(isExceptionPanelVisible, isCommentsSideViewEnabled, false);
    };
    return HtmlContainerHelper;
}(responseContainerHelperBase));
module.exports = HtmlContainerHelper;
//# sourceMappingURL=htmlcontainerhelper.js.map