"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var enums = require('../utility/enums');
/* tslint:disable:variable-name */
var WorkList;
/**
 * React component class for Worklist base container
 */
var WorklistBaseContainer = (function (_super) {
    __extends(WorklistBaseContainer, _super);
    /**
     * Constructor WorklistBaseContainer
     * @param props
     * @param state
     */
    function WorklistBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    WorklistBaseContainer.prototype.render = function () {
        if (WorkList) {
            if (this.props.isFromMenu) {
                return (React.createElement(WorkList, {id: 'container_worklist', key: 'container_worklist_key', selectedLanguage: this.props.selectedLanguage, isFromMenu: this.props.isFromMenu, renderedOn: this.state.renderedOn, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
            }
            else {
                return (React.createElement(WorkList, {id: 'container_worklist', key: 'container_worklist_key', selectedLanguage: this.props.selectedLanguage, renderedOn: this.state.renderedOn, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
            }
        }
        else {
            return (React.createElement(BusyIndicator, {id: 'modulesLoadingBusyIndicator', key: 'modulesLoadingBusyIndicator', isBusy: true, busyIndicatorInvoker: enums.BusyIndicatorInvoker.loadingModules}));
        }
    };
    /**
     * Subscribe to component did mount event
     */
    WorklistBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    WorklistBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './worklist'], function () {
            WorkList = require('./worklist');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return WorklistBaseContainer;
}(pureRenderComponent));
module.exports = WorklistBaseContainer;
//# sourceMappingURL=worklistbasecontainer.js.map