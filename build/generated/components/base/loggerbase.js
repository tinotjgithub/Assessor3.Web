"use strict";
var gaHelper = require('../../utility/googleanalytics/gahelper');
var aiHelper = require('../../utility/applicationinsightanalytics/aihelper');
var LoggerBase = (function () {
    /**
     * Constructor
     * @param type
     */
    function LoggerBase(actionType) {
        // Formatted input result
        this.formatterString = '';
        // The log action type
        this.readonly = actionType;
        this.actionType = actionType;
        if (config.logger.LOGGER_TYPE.toLowerCase() === 'ga') {
            this.logHelper = gaHelper;
        }
        else {
            this.logHelper = aiHelper;
        }
    }
    /**
     * Format the input
     * @param args
     */
    LoggerBase.prototype.formatInputAction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        try {
            // Clearing previous log details.
            this.formatterString = '';
            this.format(args);
        }
        catch (e) {
        }
        return this.formatterString;
    };
    /**
     * Format and map the data
     * @param args
     */
    LoggerBase.prototype.format = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < args.length; i++) {
            this.mapObject(args[i]);
        }
    };
    /**
     * Map the logging data
     * @param obj
     */
    LoggerBase.prototype.mapObject = function (obj) {
        if (obj === undefined || obj === null) {
            return;
        }
        if (Array.isArray(obj)) {
            for (var j = 0; j < obj.length; j++) {
                this.mapObject(obj[j]);
            }
        }
        else if (typeof obj !== 'object') {
            this.addSpacer(obj);
        }
        else if (obj['@@__IMMUTABLE_LIST__@@'] === true ||
            obj['@@__IMMUTABLE_MAP__@@'] === true ||
            obj['@@__IMMUTABLE_ARRAY__@@'] === true) {
            this.mapObject(obj.toArray());
        }
        else {
            for (var key in obj) {
                if (typeof obj[key] === 'object') {
                    this.mapObject(obj[key]);
                }
                else {
                    this.addSpacer(key + ' : ' + obj[key]);
                }
            }
        }
    };
    /**
     * Add space and delimiter to the string
     * @param val
     */
    LoggerBase.prototype.addSpacer = function (val) {
        if (this.formatterString === '') {
            this.formatterString = val;
        }
        else {
            this.formatterString = this.formatterString + ' , ' + val;
        }
    };
    /**
     * Save action
     * @param action
     * @param saveAction
     */
    LoggerBase.prototype.saveAuditLog = function (action, saveAction) {
        this.logHelper.sendLogToServer(this.actionType, action, saveAction);
    };
    /**
     * Send actions logs to analytics.
     * @param actionType
     * @param actions
     */
    LoggerBase.prototype.sendLogToServer = function (actionType, actions) {
        // Process only the actions belongs to the current type.
        if (actionType === this.actionType) {
            var result_1 = '';
            actions.map(function (x) {
                result_1 += x + '\n';
            });
        }
    };
    return LoggerBase;
}());
module.exports = LoggerBase;
//# sourceMappingURL=loggerbase.js.map