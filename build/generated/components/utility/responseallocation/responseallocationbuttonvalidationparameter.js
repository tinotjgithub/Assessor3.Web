"use strict";
/**
 * Entity class for response allocation button validation
 */
var ResponseAllocationButtonValidationParameter = (function () {
    /**
     * Initializing new instance of response allocation button validation entity.
     */
    function ResponseAllocationButtonValidationParameter(responseAllocationButtonMainText, responseAllocationButtonSubText, isResponseAllocateButtonVisible, isResponseAllocateButtonEnabled, isWorklistInformationBannerVisible, responseAllocationButtonTitle, responseAllocationButtonSingleResponseText, responseAllocationButtonUpToOpenResponseText, isWholeResponseResponseAllocationButtonAvailable) {
        this.responseAllocationButtonMainText = responseAllocationButtonMainText;
        this.responseAllocationButtonSubText = responseAllocationButtonSubText;
        this.isResponseAllocateButtonVisible = isResponseAllocateButtonVisible;
        this.isResponseAllocateButtonEnabled = isResponseAllocateButtonEnabled;
        this.isWorklistInformationBannerVisible = isWorklistInformationBannerVisible;
        this.responseAllocationButtonTitle = responseAllocationButtonTitle;
        this.responseAllocationButtonSingleResponseText = responseAllocationButtonSingleResponseText;
        this.responseAllocationButtonUpToOpenResponseText = responseAllocationButtonUpToOpenResponseText;
        this.isWholeResponseResponseAllocationButtonAvailable = isWholeResponseResponseAllocationButtonAvailable;
    }
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "ResponseAllocationButtonMainText", {
        /**
         * Returns back the Resource Key for Error Dialog Header Text
         */
        get: function () {
            return this.responseAllocationButtonMainText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "ResponseAllocationButtonSubText", {
        /**
         * Returns back the Resource Key for Error Dialog Header Text
         */
        get: function () {
            return this.responseAllocationButtonSubText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "IsResponseAllocateButtonVisible", {
        /**
         * Returns back the Resource Key for Error Dialog Header Text
         */
        get: function () {
            return this.isResponseAllocateButtonVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "IsResponseAllocateButtonEnabled", {
        /**
         * Returns back the Resource Key for Error Dialog Header Text
         */
        get: function () {
            return this.isResponseAllocateButtonEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "IsWorklistInformationBannerVisible", {
        /**
         * Returns back if the worklist banner should be visible or not
         */
        get: function () {
            return this.isWorklistInformationBannerVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "ResponseAllocationButtonTitle", {
        /**
         * Returns back the Resource Key for Title for response button
         */
        get: function () {
            return this.responseAllocationButtonTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "ResponseAllocationButtonSingleResponseText", {
        /**
         * Returns back the Resource Key for Single Response Text
         */
        get: function () {
            return this.responseAllocationButtonSingleResponseText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "ResponseAllocationButtonUpToOpenResponseText", {
        /**
         * Returns back the Resource Key for Up To Open Response Text
         */
        get: function () {
            return this.responseAllocationButtonUpToOpenResponseText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationButtonValidationParameter.prototype, "IsWholeResponseResponseAllocationButtonAvailable", {
        /**
         * Returns back the Resource Key for Whole Response enbled
         */
        get: function () {
            return this.isWholeResponseResponseAllocationButtonAvailable;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseAllocationButtonValidationParameter;
}());
module.exports = ResponseAllocationButtonValidationParameter;
//# sourceMappingURL=responseallocationbuttonvalidationparameter.js.map