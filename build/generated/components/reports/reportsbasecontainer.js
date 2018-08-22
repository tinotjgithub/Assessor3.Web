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
var ReportsWrapper;
/**
 * React component class for reports base container
 */
var ReportsBaseContainer = (function (_super) {
    __extends(ReportsBaseContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function ReportsBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    ReportsBaseContainer.prototype.render = function () {
        if (ReportsWrapper) {
            return (React.createElement(ReportsWrapper, {id: 'container_reports', key: 'container_reports_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer, reportsDidMount: this.props.reportsDidMount}));
        }
        else {
            return null;
        }
    };
    /**
     * Subscribe to component did mount event
     */
    ReportsBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    ReportsBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './reportswrapper'
        ], function () {
            ReportsWrapper = require('./reportswrapper');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return ReportsBaseContainer;
}(pureRenderComponent));
module.exports = ReportsBaseContainer;
//# sourceMappingURL=reportsbasecontainer.js.map