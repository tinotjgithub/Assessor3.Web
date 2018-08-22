"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
/* tslint:disable:variable-name */
var AdminSupport;
/**
 * React component class for AdminSupportContainer
 */
var AdminSupportContainer = (function (_super) {
    __extends(AdminSupportContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function AdminSupportContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    AdminSupportContainer.prototype.render = function () {
        if (AdminSupport) {
            return (React.createElement(AdminSupport, {id: this.props.id, key: this.props.key, selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline}));
        }
        else {
            return null;
        }
    };
    /**
     * Subscribe to component did mount event
     */
    AdminSupportContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    AdminSupportContainer.prototype.loadDependencies = function () {
        require.ensure([
            './adminsupport'], function () {
            AdminSupport = require('./adminsupport');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return AdminSupportContainer;
}(pureRenderComponent));
module.exports = AdminSupportContainer;
//# sourceMappingURL=adminsupportcontainer.js.map