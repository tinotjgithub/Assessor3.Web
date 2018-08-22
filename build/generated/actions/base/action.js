"use strict";
var actionAuditLogInfo = require('./auditloginfo/actionauditloginfo');
var json = require('./actions.json');
/**
 * Action Base
 * @class
 */
var Action = (function () {
    /**
     * Constructor
     * @param source
     * @param actionType
     */
    function Action(source, actionType) {
        this._shouldActionBeLogged = true;
        this._source = source;
        this._actionType = actionType;
        var auditLog = new actionAuditLogInfo();
        var jsonKey = this.getCurrentClassName();
        var auditLogProps = ['name', 'message'];
        auditLog.loggedActionName = this.actionInfo[jsonKey][auditLogProps[0]];
        auditLog.logContent = this.actionInfo[jsonKey][auditLogProps[1]];
        this._actionAuditLog = auditLog;
    }
    Object.defineProperty(Action.prototype, "source", {
        /**
         * The Source of the action
         * Make sure the source is immutable to avoid change
         * during Dispatch
         */
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "auditLog", {
        /**
         * Gets the current action audit information
         * @returns The audit information.
         */
        get: function () {
            return this._actionAuditLog;
        },
        /**
         * Sets auditLog content
         * @param {actionAuditLogInfo} auditLog
         */
        set: function (auditLog) {
            this._actionAuditLog = auditLog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "actionInfo", {
        /**
         * Gets the actions with details
         * @returns The actions information.
         */
        get: function () {
            return json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "shouldActionBeLogged", {
        /**
         * Gets whether this action should be logged
         */
        get: function () {
            return this._shouldActionBeLogged;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Flags the action not to be logged
     */
    Action.prototype.setTheActionAsNotToBeLogged = function () {
        this._shouldActionBeLogged = false;
    };
    Object.defineProperty(Action.prototype, "actionType", {
        /**
         * Gets the action type
         * @returns The action type.
         */
        get: function () {
            return this._actionType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the class Name for this instance
     * @returns The class Name for this instance
     */
    Action.prototype.getCurrentClassName = function () {
        return this.constructor.toString().match(/\w+/g)[1].toLowerCase();
    };
    return Action;
}());
/**
 * Action source mode
 */
var Action;
(function (Action) {
    /**
     * enum for source
     *
     * @export Source
     * @enum {number}
     */
    (function (Source) {
        Source[Source["View"] = 0] = "View";
        Source[Source["Server"] = 1] = "Server";
    })(Action.Source || (Action.Source = {}));
    var Source = Action.Source;
})(Action || (Action = {}));
module.exports = Action;
//# sourceMappingURL=action.js.map