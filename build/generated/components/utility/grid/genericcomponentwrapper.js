"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
/**
 * React component class for GenericWrapper
 */
var GenericComponentWrapper = (function (_super) {
    __extends(GenericComponentWrapper, _super);
    /**
     * Constructor GenericComponentWrapper
     * @param properties
     * @param state
     */
    function GenericComponentWrapper(properties, state) {
        _super.call(this, properties, state);
    }
    /**
     * Render component
     * @returns
     */
    GenericComponentWrapper.prototype.render = function () {
        return (React.createElement("div", {className: this.props.divClassName}, this.props.componentList));
    };
    return GenericComponentWrapper;
}(pureRenderComponent));
module.exports = GenericComponentWrapper;
//# sourceMappingURL=genericcomponentwrapper.js.map