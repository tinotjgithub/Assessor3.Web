"use strict";
/**
 * Entity class for response allocation validation
 */
var ResponseAllocationValidationParameter = (function () {
    /**
     * Initializing new instance of response allocation validation entity.
     */
    function ResponseAllocationValidationParameter(errorDialogHeaderText, errorDialogContentText, responseAllocateButtonVisibility) {
        this.errorDialogHeaderText = errorDialogHeaderText;
        this.errorDialogContentText = errorDialogContentText;
        this.responseAllocateButtonVisibility = responseAllocateButtonVisibility;
    }
    Object.defineProperty(ResponseAllocationValidationParameter.prototype, "ErrorDialogHeaderText", {
        /**
         * Returns back the Resource Key for Error Dialog Header Text
         */
        get: function () {
            return this.errorDialogHeaderText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationValidationParameter.prototype, "ErrorDialogContentText", {
        /**
         * Returns back the Resource Key for Error Dialog Content Text
         */
        get: function () {
            return this.errorDialogContentText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseAllocationValidationParameter.prototype, "ResponseAllocateButtonVisibility", {
        /**
         * Returns back the visibility for the Allocate New Response button
         */
        get: function () {
            return this.responseAllocateButtonVisibility;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseAllocationValidationParameter;
}());
module.exports = ResponseAllocationValidationParameter;
//# sourceMappingURL=responseallocationvalidationparameter.js.map