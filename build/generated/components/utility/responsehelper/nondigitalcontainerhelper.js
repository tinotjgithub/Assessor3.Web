"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var responseContainerHelperBase = require('./responsecontainerhelperbase');
var enums = require('../enums');
var messageStore = require('../../../stores/message/messagestore');
var onPageCommentHelper = require('../annotation/onpagecommenthelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var NonDigitalContainerHelper = (function (_super) {
    __extends(NonDigitalContainerHelper, _super);
    function NonDigitalContainerHelper(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode) {
        _super.call(this, _responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode);
    }
    /**
     * Fetch images for ecourse work script images.
     */
    NonDigitalContainerHelper.prototype.fetchUnstructuredScriptImages = function () {
        return this.responseContainerProperty.scriptHelper.fetchUnstructuredScriptImages();
    };
    /**
     * Get the urls for all images.
     */
    NonDigitalContainerHelper.prototype.getAllImageURLs = function () {
        return this.responseContainerProperty.scriptHelper.getAllImageURLs();
    };
    /**
     * Get the file meta data.
     */
    NonDigitalContainerHelper.prototype.getFileMetadata = function () {
        return this.responseContainerProperty.scriptHelper.getFileMetadata();
    };
    /**
     * called for setting the side view class
     * @returns
     */
    NonDigitalContainerHelper.prototype.enableSideViewComment = function (isExceptionPanelVisible) {
        var selectedFileMetadataList = this.getFileMetadata();
        this.responseContainerProperty.hasOnPageComments = onPageCommentHelper.hasOnPageComments(selectedFileMetadataList, false, this.responseContainerProperty.imageZonesCollection);
        return (this.responseContainerProperty.hasOnPageComments &&
            ((!this.responseContainerProperty.isMessagePanelVisible && !isExceptionPanelVisible) ||
                (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize ||
                    this.responseContainerProperty.isExceptionPanelMinimized)));
    };
    /**
     * wrapper class name
     * @param isExceptionPanelVisible
     * @param isCommentsSideViewEnabled
     */
    NonDigitalContainerHelper.prototype.getResponseModeWrapperClassName = function (isExceptionPanelVisible, isCommentsSideViewEnabled) {
        var enableSideViewComment = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup
            ? false
            : this.enableSideViewComment(isExceptionPanelVisible);
        return this.getWrapperClassName(isExceptionPanelVisible, isCommentsSideViewEnabled, enableSideViewComment);
    };
    Object.defineProperty(NonDigitalContainerHelper.prototype, "doExcludeSuppressedPage", {
        /**
         * Return true if the component is e-course work
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return NonDigitalContainerHelper;
}(responseContainerHelperBase));
module.exports = NonDigitalContainerHelper;
//# sourceMappingURL=nondigitalcontainerhelper.js.map