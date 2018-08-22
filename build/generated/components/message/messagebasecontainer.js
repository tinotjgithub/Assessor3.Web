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
var MessageContainer;
/**
 * React component class for Response base container
 */
var MessageBaseContainer = (function (_super) {
    __extends(MessageBaseContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function MessageBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    MessageBaseContainer.prototype.render = function () {
        if (MessageContainer) {
            return (React.createElement(MessageContainer, {id: 'container_message', key: 'container_message_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
        }
        else {
            return null;
        }
    };
    /**
     * Subscribe to component did mount event
     */
    MessageBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    MessageBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './messagecontainer'
        ], function () {
            MessageContainer = require('./messagecontainer');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return MessageBaseContainer;
}(pureRenderComponent));
module.exports = MessageBaseContainer;
//# sourceMappingURL=messagebasecontainer.js.map