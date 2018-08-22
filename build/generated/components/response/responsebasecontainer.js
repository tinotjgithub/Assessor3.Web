"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
/* tslint:disable:variable-name */
var EcourseWorkContainer;
var NonDigitalContainer;
var HtmlContainer;
/**
 * React component class for Response base container
 */
var ResponseBaseContainer = (function (_super) {
    __extends(ResponseBaseContainer, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function ResponseBaseContainer(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render
     */
    ResponseBaseContainer.prototype.render = function () {
        var renderContainer;
        switch (this.props.containerPageType) {
            case enums.PageContainersType.HtmlView:
                if (HtmlContainer) {
                    renderContainer = (React.createElement(HtmlContainer, {id: 'container_response', key: 'container_response_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.selectedLanguage, setOfflineContainer: this.props.setOfflineContainer}));
                }
                else {
                    renderContainer = null;
                }
                break;
            case enums.PageContainersType.ECourseWork:
                if (EcourseWorkContainer) {
                    renderContainer = (React.createElement(EcourseWorkContainer, {id: 'container_response', key: 'container_response_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.selectedLanguage, setOfflineContainer: this.props.setOfflineContainer}));
                }
                else {
                    renderContainer = null;
                }
                break;
            default:
                if (EcourseWorkContainer) {
                    renderContainer = (React.createElement(NonDigitalContainer, {id: 'container_response', key: 'container_response_key', selectedLanguage: this.props.selectedLanguage, isOnline: this.props.isOnline, setOfflineContainer: this.props.setOfflineContainer}));
                }
                else {
                    renderContainer = null;
                }
                break;
        }
        return renderContainer;
    };
    /**
     * Subscribe to component did mount event
     */
    ResponseBaseContainer.prototype.componentDidMount = function () {
        this.loadDependencies();
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    ResponseBaseContainer.prototype.loadDependencies = function () {
        require.ensure([
            './nondigital/nondigitalcontainer',
            './digital/ecoursework/ecourseworkcontainer',
            './digital/htmlcontainer'
        ], function () {
            NonDigitalContainer = require('./nondigital/nondigitalcontainer');
            EcourseWorkContainer = require('./digital/ecoursework/ecourseworkcontainer');
            HtmlContainer = require('./digital/htmlcontainer');
            this.setState({ renderedOn: Date.now() });
        }.bind(this));
    };
    return ResponseBaseContainer;
}(pureRenderComponent));
module.exports = ResponseBaseContainer;
//# sourceMappingURL=responsebasecontainer.js.map