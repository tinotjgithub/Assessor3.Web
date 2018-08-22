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
var QigSelectorContainer;
/**
 * React component class for Login
 */
var QigSelectorBaseContainer = (function (_super) {
    __extends(QigSelectorBaseContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function QigSelectorBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    QigSelectorBaseContainer.prototype.render = function () {
        if (QigSelectorContainer) {
            if (this.props.isNavigatedAfterFromLogin) {
                return (React.createElement(QigSelectorContainer, {id: 'container_qigselector', key: 'container_qigselector_key', isNavigatedAfterFromLogin: this.props.isNavigatedAfterFromLogin, selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
            }
            else {
                return (React.createElement(QigSelectorContainer, {id: 'container_qigselector', key: 'container_qigselector_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
            }
        }
        else {
            return null;
        }
    };
    /**
     * Subscribe to component did mount event
     */
    QigSelectorBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    QigSelectorBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './qigselectorcontainer'], function () {
            QigSelectorContainer = require('./qigselectorcontainer');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return QigSelectorBaseContainer;
}(pureRenderComponent));
module.exports = QigSelectorBaseContainer;
//# sourceMappingURL=qigselectorbasecontainer.js.map