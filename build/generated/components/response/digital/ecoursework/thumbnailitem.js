"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
var enums = require('../../../utility/enums');
var classNames = require('classnames');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var markingStore = require('../../../../stores/marking/markingstore');
var applicationStore = require('../../../../stores/applicationoffline/applicationstore');
var ThumbnailItem = (function (_super) {
    __extends(ThumbnailItem, _super);
    /**
     * @constructor
     */
    function ThumbnailItem(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /* based on this variable we will load images without cache */
        this.imageForceLoadRequired = false;
        this.resetThumbnailUrl = false;
        /**
         * Re render after image loaded
         */
        this.imageloaded = function () {
            _this.setState({ isLoaded: true });
            _this.props.onSuccess(_this.props.docPageId);
        };
        /**
         * On Error
         */
        this.onError = function (evt) {
            _this.props.onError(_this.props.docPageId);
        };
        /**
         * We need to reload all thumbnails if any offline and online scenario occured.
         */
        this.onlineStatusChanged = function () {
            /* Defect fix #60077 - We need to reload cloud images without considering cache,
             some times it's showing as partially loaded in IE and Edge, if there is a internet flickering occured
             in chrome we need to consider offline scenario */
            if (applicationStore.instance.isOnline) {
                _this.imageForceLoadRequired = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        this.state = {
            isLoaded: false,
            retryImageDownload: false,
            renderedOn: 0
        };
        this.imageloaded = this.imageloaded.bind(this);
        this.onError = this.onError.bind(this);
        this.reRenderImage = this.reRenderImage.bind(this);
        this.onResponseNavigate = this.onResponseNavigate.bind(this);
    }
    /**
     * Render method
     */
    ThumbnailItem.prototype.render = function () {
        var loadingIndicator = this.state.isLoaded ? null : (React.createElement(LoadingIndicator, {id: 'loadingIndicator', key: 'loadingIndicator_key', isFrv: false, cssClass: 'file-pre-loader'}));
        var toRender = this.props.fileListPanelView === enums.FileListPanelView.Thumbnail ? (React.createElement("div", {className: 'thumbnail-image'}, React.createElement("div", {className: classNames('thumbnail-inner', { 'loading': !this.state.isLoaded })}, React.createElement("img", {id: 'thumbImg_' + this.props.docPageId, src: this.getImageURL, alt: this.props.fileName, onLoad: this.imageloaded, onError: this.onError}), loadingIndicator))) :
            (React.createElement("div", {className: 'thumbnail-image'}));
        return (toRender);
    };
    /**
     * On Component Mount
     */
    ThumbnailItem.prototype.componentDidMount = function () {
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.RELOAD_FAILED_IMAGE, this.reRenderImage);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onResponseNavigate);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
    };
    /**
     * componentWillUnmount
     */
    ThumbnailItem.prototype.componentWillUnmount = function () {
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.RELOAD_FAILED_IMAGE, this.reRenderImage);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onResponseNavigate);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
    };
    /**
     * Component Will recieve props
     * @param nextProps
     */
    ThumbnailItem.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.docPageId !== this.props.docPageId) {
            this.setState({ retryImageDownload: false });
        }
    };
    /**
     * Component Did Update
     */
    ThumbnailItem.prototype.componentDidUpdate = function () {
        this.imageForceLoadRequired = false;
        this.resetThumbnailUrl = false;
        // if the retry Image Download is true rest the flag back to false so that the 
        // url will be set to the correct url on the next re render. The current render have already set the
        // url to null so that the next change in url willtrigger the image download
        if (this.state.retryImageDownload) {
            this.setState({
                retryImageDownload: false
            });
        }
    };
    /**
     * to force rerender when the image fails to render due to low band width or any network issue
     */
    ThumbnailItem.prototype.reRenderImage = function () {
        if (this.state.isLoaded) {
            return;
        }
        // Set the retryImageDownload to true.
        // This will initially set the url to null and on the next re render set the url back to original value
        this.setState({
            retryImageDownload: true
        });
    };
    Object.defineProperty(ThumbnailItem.prototype, "getImageURL", {
        /**
         * This method will return the image url by appending a query string if force image load required, else it will
         * return normal url. This will return null if retryImageDownload is true.
         * resetThumbnailUrl- thumbnail url resets on response navigate.
         */
        get: function () {
            return this.resetThumbnailUrl ? null : this.state.retryImageDownload ? null :
                this.imageForceLoadRequired ? this.props.url.replace(/\/$/, '') + '?' + Date.now() : this.props.url;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reset thumbnail url on response navigate.
     */
    ThumbnailItem.prototype.onResponseNavigate = function () {
        this.resetThumbnailUrl = true;
        this.setState({
            renderedOn: Date.now()
        });
    };
    return ThumbnailItem;
}(pureRenderComponent));
module.exports = ThumbnailItem;
//# sourceMappingURL=thumbnailitem.js.map