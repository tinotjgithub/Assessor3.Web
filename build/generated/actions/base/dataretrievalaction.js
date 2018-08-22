"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('./action');
/**
 * Data retrieval base action class
 */
var DataRetrievalAction = (function (_super) {
    __extends(DataRetrievalAction, _super);
    /**
     * Constructor
     * @param source
     * @param actionType
     * @param success
     * @param errorJsonObject
     */
    function DataRetrievalAction(source, actionType, success, errorJsonObject) {
        _super.call(this, source, actionType);
        this._success = success;
        //Check if error response is not undefined
        if (errorJsonObject !== undefined && errorJsonObject !== 'undefined' && errorJsonObject.toString().length > 0) {
            this.parseError(errorJsonObject);
        }
    }
    Object.defineProperty(DataRetrievalAction.prototype, "success", {
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataRetrievalAction.prototype, "getStatusCode", {
        get: function () {
            return this.statusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataRetrievalAction.prototype, "getErrorMessage", {
        get: function () {
            return this.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To parse error
     * @param json
     */
    DataRetrievalAction.prototype.parseError = function (json) {
        var xhr = (json !== undefined && json.toString().length > 0) ? json.xhr : undefined;
        if (xhr !== undefined && xhr !== 'undefined') {
            this.statusCode = xhr.status;
            this.errorMessage = (xhr.responseJSON !== undefined) ? xhr.responseJSON.error : '';
        }
        else {
            this.statusCode = 0;
            this.errorMessage = '';
        }
    };
    return DataRetrievalAction;
}(action));
module.exports = DataRetrievalAction;
//# sourceMappingURL=dataretrievalaction.js.map