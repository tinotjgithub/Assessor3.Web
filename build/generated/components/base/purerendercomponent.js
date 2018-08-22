"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
/**
 * Extends the generic React component class to implement a component whose render function is pure
 * i.e. for the same props and state, the rendered output will always be the same, and whose props
 * and state can be shallowly compared for equality (i.e. they use immutables). This improves performance
 * by implementing shouldComponentUpdate and only re-rendering if the old and new props and state are not
 * shallowly equal to the new ones.
 * All new components in Assessor must inherit from this class instead of React.Component unless there is
 * a good reason why their render function cannot be pure, or their props and state cannot consist of
 * fully - immutable data structures.
 */
var PureRenderComponent = (function (_super) {
    __extends(PureRenderComponent, _super);
    function PureRenderComponent() {
        _super.apply(this, arguments);
    }
    /**
     * This method will decide whether component needs to be rerendered
     * @param nextProps
     * @param nextState
     */
    PureRenderComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return (!this.shallowEqual(this.props, nextProps) || !this.shallowEqual(this.state, nextState));
    };
    /**
     * component did catch
     * @param error
     * @param info
     */
    PureRenderComponent.prototype.componentDidCatch = function (error, info) {
        window.onerror(error.message, '', null, null, new Error(error));
        var clientErrorObj = {
            message: error.message,
            stack: error.stack,
            componentStack: info.componentStack
        };
        var errorDetails = JSON.stringify(clientErrorObj);
        new auditLoggingHelper().logHelper.logEventOnApplicationError(errorDetails);
    };
    /**
     * Shallow equal
     * @param objA
     * @param objB
     */
    PureRenderComponent.prototype.shallowEqual = function (objA, objB) {
        if (objB != null && objB.forceRerender === true) {
            return false;
        }
        if (objA === objB) {
            return true;
        }
        if (typeof objA !== 'object' || objA == null || typeof objB !== 'object' || objB == null) {
            return false;
        }
        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) {
            return false;
        }
        // Check whether A's keys are different from B's
        var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
        for (var i = 0; i < keysA.length; i++) {
            // If the item is a Function pointer, no need to compare
            if (typeof objA[keysA[i]] === 'function' && typeof objB[keysA[i]] === 'function') {
                continue;
            }
            // If the item is in turn an object, invoke the shallEqual() method recursively
            // to compare each of the items in the object
            if (typeof objA[keysA[i]] === 'object' &&
                typeof objB[keysA[i]] === 'object' &&
                !React.isValidElement(objA[keysA[i]])) {
                if (this.shallowEqual(objA[keysA[i]], objB[keysA[i]])) {
                    continue;
                }
                else {
                    return false;
                }
            }
            if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
                return false;
            }
        }
        return true;
    };
    /**
     * This method appends event handler
     * @param element
     * @param eventType
     * @param method
     * @param disablePassive
     */
    PureRenderComponent.prototype.appendEventHandler = function (element, eventType, method, disablePassive) {
        var eventHandlerOptions = {};
        if (disablePassive) {
            eventHandlerOptions.passive = false;
        }
        element.addEventListener(eventType, method, eventHandlerOptions);
    };
    /**
     * This method removes event handler
     * @param element
     * @param eventType
     * @param method
     * @param disablePassive
     */
    PureRenderComponent.prototype.removeEventHandler = function (element, eventType, method, disablePassive) {
        var eventHandlerOptions = {};
        if (disablePassive) {
            eventHandlerOptions.passive = false;
        }
        element.removeEventListener(eventType, method, eventHandlerOptions);
    };
    return PureRenderComponent;
}(React.Component));
module.exports = PureRenderComponent;
//# sourceMappingURL=purerendercomponent.js.map