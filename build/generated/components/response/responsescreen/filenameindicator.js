"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
/**
 * Page number indicator component to show the page number when scrolling through the script.
 */
var FileNameIndicator = (function (_super) {
    __extends(FileNameIndicator, _super);
    /**
     * @constructor
     */
    function FileNameIndicator(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Method to add class and set filename
         */
        this.onFileNameDisplay = function (fileName) {
            var element = document.getElementById('response-file-name');
            if (element) {
                element.classList.add('show');
            }
            _this.setState({
                renderedOn: Date.now(),
                fileName: fileName
            });
        };
        /**
         * Method to remove file name indicator after animation end
         */
        this.removeFileNameIndicator = function (event) {
            if (event && (event.type === 'animationend') && (event.animationName === 'fade-out')
                && event.target.id === 'response-file-name') {
                // To show the animation effect, need to make change in html
                // So removing class name 'show' and adding the same in render method
                document.getElementById('response-file-name').classList.remove('show');
            }
        };
        var fileName = eCourseWorkFileStore.instance.lastSelectedECourseworkFile ?
            eCourseWorkFileStore.instance.lastSelectedECourseworkFile.title : '';
        this.state = {
            renderedOn: 0,
            fileName: fileName
        };
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    FileNameIndicator.prototype.componentDidMount = function () {
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT, this.onFileNameDisplay);
        var fileNameElement = document.getElementById('response-file-name');
        if (fileNameElement) {
            fileNameElement.addEventListener('animationend', this.removeFileNameIndicator);
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    FileNameIndicator.prototype.componentWillUnmount = function () {
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT, this.onFileNameDisplay);
        var fileNameElement = document.getElementById('response-file-name');
        if (fileNameElement) {
            fileNameElement.removeEventListener('animationend', this.removeFileNameIndicator);
        }
    };
    /**
     * Render method
     */
    FileNameIndicator.prototype.render = function () {
        return (React.createElement("div", {id: 'response-file-name', className: classNames('response-file-name', { 'show': eCourseWorkFileStore.instance.isFilelistPanelCollapsed && this.state.fileName !== '' })}, React.createElement("div", {className: 'pn-line1'}, localeStore.instance.TranslateText('marking.response.media-player.file-name')), React.createElement("div", {id: 'file-name-indicator', className: 'pn-line2'}, this.state.fileName)));
    };
    return FileNameIndicator;
}(pureRenderComponent));
module.exports = FileNameIndicator;
//# sourceMappingURL=filenameindicator.js.map