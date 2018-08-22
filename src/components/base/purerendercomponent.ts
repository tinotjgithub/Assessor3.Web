import React = require('react');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');

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
class PureRenderComponent<P, S> extends React.Component<P, S> {
    /**
     * This method will decide whether component needs to be rerendered
     * @param nextProps
     * @param nextState
     */
    public shouldComponentUpdate(nextProps: P, nextState: S) {
        return (
            !this.shallowEqual(this.props, nextProps) || !this.shallowEqual(this.state, nextState)
        );
    }

    /**
     * component did catch
     * @param error
     * @param info
     */
    public componentDidCatch(error, info) {
        window.onerror(error.message, '', null, null, new Error(error));
        let clientErrorObj = {
            message: error.message,
            stack: error.stack,
            componentStack: info.componentStack
        };
        let errorDetails = JSON.stringify(clientErrorObj);
        new auditLoggingHelper().logHelper.logEventOnApplicationError(errorDetails);
    }

    /**
     * Shallow equal
     * @param objA
     * @param objB
     */
    private shallowEqual(objA: any, objB: any) {
        if (objB != null && objB.forceRerender === true) {
            return false;
        }

        if (objA === objB) {
            return true;
        }

        if (typeof objA !== 'object' || objA == null || typeof objB !== 'object' || objB == null) {
            return false;
        }

        let keysA = Object.keys(objA);
        let keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Check whether A's keys are different from B's
        let bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
        for (let i = 0; i < keysA.length; i++) {
            // If the item is a Function pointer, no need to compare
            if (typeof objA[keysA[i]] === 'function' && typeof objB[keysA[i]] === 'function') {
                continue;
            }

            // If the item is in turn an object, invoke the shallEqual() method recursively
            // to compare each of the items in the object
            if (
                typeof objA[keysA[i]] === 'object' &&
                typeof objB[keysA[i]] === 'object' &&
                !React.isValidElement(objA[keysA[i]])
            ) {
                if (this.shallowEqual(objA[keysA[i]], objB[keysA[i]])) {
                    continue;
                } else {
                    return false;
                }
            }

            if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
                return false;
            }
        }

        return true;
    }

    /**
     * This method appends event handler
     * @param element
     * @param eventType
     * @param method
     * @param disablePassive
     */
    protected appendEventHandler(
        element: Element,
        eventType: string,
        method: EventListener,
        disablePassive: boolean
    ) {
        let eventHandlerOptions: any = {};
        if (disablePassive) {
            eventHandlerOptions.passive = false;
        }

        element.addEventListener(eventType, method, eventHandlerOptions);
    }

    /**
     * This method removes event handler
     * @param element
     * @param eventType
     * @param method
     * @param disablePassive
     */
    protected removeEventHandler(
        element: Element,
        eventType: string,
        method: EventListener,
        disablePassive: boolean
    ) {
        let eventHandlerOptions: any = {};
        if (disablePassive) {
            eventHandlerOptions.passive = false;
        }

        element.removeEventListener(eventType, method, eventHandlerOptions);
    }
}

export = PureRenderComponent;