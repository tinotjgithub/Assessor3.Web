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
var TeamManagement;
/**
 * React component class for teammanagement base container
 */
var TeamManagementBaseContainer = (function (_super) {
    __extends(TeamManagementBaseContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function TeamManagementBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    TeamManagementBaseContainer.prototype.render = function () {
        if (TeamManagement) {
            if (this.props.isFromMenu) {
                return (React.createElement(TeamManagement, {id: 'container_team_management', key: 'container_team_management_key', selectedLanguage: this.props.selectedLanguage, renderedOn: this.state.renderedOn, isFromMenu: this.props.isFromMenu, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
            }
            else {
                return (React.createElement(TeamManagement, {id: 'container_team_management', key: 'container_team_management_key', selectedLanguage: this.props.selectedLanguage, renderedOn: this.state.renderedOn, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
            }
        }
        else {
            return null;
        }
    };
    /**
     * Subscribe to component did mount event
     */
    TeamManagementBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    TeamManagementBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './teammanagement'], function () {
            TeamManagement = require('./teammanagement');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return TeamManagementBaseContainer;
}(pureRenderComponent));
module.exports = TeamManagementBaseContainer;
//# sourceMappingURL=teammanagementbasecontainer.js.map