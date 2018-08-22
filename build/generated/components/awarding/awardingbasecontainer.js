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
var AwardingContainer;
/**
 * React component class for awarding base container
 */
var AwardingBaseContainer = (function (_super) {
    __extends(AwardingBaseContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function AwardingBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    AwardingBaseContainer.prototype.render = function () {
        if (AwardingContainer) {
            return (React.createElement(AwardingContainer, {id: 'container_awarding', key: 'container_awarding_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
        }
        else {
            return null;
        }
    };
    /**
     * Subscribe to component did mount event
     */
    AwardingBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    AwardingBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './awardingcontainer'
        ], function () {
            AwardingContainer = require('./awardingcontainer');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return AwardingBaseContainer;
}(pureRenderComponent));
module.exports = AwardingBaseContainer;
//# sourceMappingURL=awardingbasecontainer.js.map