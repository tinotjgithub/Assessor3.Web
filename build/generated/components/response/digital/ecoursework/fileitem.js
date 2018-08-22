"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var MetaData = require('./metadata');
var classNames = require('classnames');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var constants = require('../../../utility/constants');
var enums = require('../../../../components/utility/enums');
var ThumbnailItem = require('./thumbnailitem');
var METAPOPOUT_BOTTOM_CORRECTION_PIXEL = 10;
var FileItem = (function (_super) {
    __extends(FileItem, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function FileItem(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.metaPopoutTop = 0;
        this.menuCalloutTop = 0;
        /**
         * returns the meta data JSX element
         */
        this.metaDataElement = function () {
            return (React.createElement(MetaData, {selectedLanguage: _this.props.selectedLanguage, metadata: _this.props.metaData, title: _this.props.eCourseWorkFile.title, id: _this.props.id + '_' + _this.props.eCourseWorkFile.docPageID, key: _this.props.key + '_' + _this.props.eCourseWorkFile.docPageID, isFilelistPanelCollapsed: _this.props.isFilelistPanelCollapsed, isSelected: _this.props.isSelected, scrollHeight: _this.props.scrollHeight, metaWrapperRefCallback: _this.metaWrapperRefCallback, metaPopoutTop: _this.metaPopoutTop, fileListPanelView: _this.props.fileListPanelView}));
        };
        /**
         * event handle for file item  mouse over - It calculate the position of pop out div and correct it position to fully visible.
         */
        this.onFileItemHover = function (event) {
            if (!_this.isPopoutEmpty()) {
                event.stopPropagation();
                if (_this.props.isFilelistPanelCollapsed) {
                    _this.setMetaPopoupPositionOnCollapsedView();
                }
                else {
                    _this.setMetaPopoupPositionOnStdView();
                }
                _this.props.onFileItemHover();
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * this is a callback to get the child element ref
         */
        this.metaWrapperRefCallback = function (metaWrapper) {
            _this.metaWrapperElement = metaWrapper;
        };
        this.state = {
            renderedOn: 0
        };
        this.onFileItemHover = this.onFileItemHover.bind(this);
        this.metaWrapperRefCallback = this.metaWrapperRefCallback.bind(this);
    }
    /**
     * Render component
     */
    FileItem.prototype.render = function () {
        var _this = this;
        var _classnames = eCourseworkHelper.getIconStyleForSvg(this.props.eCourseWorkFile.linkType);
        var calloutStyle = {
            top: (this.menuCalloutTop) ? (this.menuCalloutTop + 'px') : '0px'
        };
        var doShowThumbnailImage = this.props.eCourseWorkFile.linkData.mediaType === enums.MediaType.Image;
        var thumbnailImage = doShowThumbnailImage ? (React.createElement(ThumbnailItem, {key: 'key_thumbnailItem', id: 'thumbnailItem', url: eCourseworkHelper.getECourseworkFileContentUrl(this.props.eCourseWorkFile.linkData.url), fileName: this.props.eCourseWorkFile.title, fileListPanelView: this.props.fileListPanelView, renderedOn: this.props.renderedOn, onError: this.props.onError, docPageId: this.props.docPageId, onSuccess: this.props.onSuccess})) : null;
        return (React.createElement("li", {role: 'listitem', className: classNames(_classnames.listItemClass, { 'active': this.props.isSelected }, { 'unread': this.props.isUnread }, { 'start-view': this.props.doAddStartView }, { 'end-view': this.props.doAddEndView }), id: 'li_' + this.props.id, onMouseOver: this.onFileItemHover, ref: function (fileItem) { _this.fileItemElement = fileItem; }}, React.createElement("a", {href: 'javascript:void(0);', className: 'file-list-anchor', onClick: function () { _this.props.onCouseWorkFileClick(_this.props.eCourseWorkFile); }}, React.createElement("div", {className: 'file-icon'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {className: _classnames.svgClass, viewBox: _classnames.viewBox}, React.createElement("use", {xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#' + _classnames.icon})))), React.createElement("div", {className: 'file-name'}, this.props.eCourseWorkFile.title), thumbnailImage), this.isPopoutEmpty() ? null :
            React.createElement("div", {className: 'menu-callout', style: calloutStyle, ref: function (menuCallOut) { _this.menuCallOutElement = menuCallOut; }}), this.metaDataElement()));
    };
    /**
     * returns whether the metadata popout should be visible or not.
     */
    FileItem.prototype.isPopoutEmpty = function () {
        var _isPopoutEmpty = (htmlUtilities.isTabletOrMobileDevice || (!this.props.metaData &&
            (this.props.isFilelistPanelCollapsed === false && this.props.fileListPanelView === enums.FileListPanelView.List)));
        return _isPopoutEmpty;
    };
    /**
     * Comparing the props to check the updates are made by self
     * @param {Props} nextProps
     */
    FileItem.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.isFilelistPanelCollapsed !== nextProps.isFilelistPanelCollapsed) {
            this.metaPopoutTop = 0;
            this.menuCalloutTop = 0;
        }
    };
    /**
     * function to set the callout menu top and meta popup top on the collapsed file list view ( expanded)
     */
    FileItem.prototype.setMetaPopoupPositionOnCollapsedView = function () {
        var wrapperRect = this.metaWrapperElement.getBoundingClientRect();
        /* if the top + height of of pop-out is higher than window height we need to shift this up*/
        if ((window.innerHeight) < (wrapperRect.top + wrapperRect.height)) {
            var topValueDiff = ((wrapperRect.top + wrapperRect.height) - window.innerHeight);
            this.metaPopoutTop = -((this.fileItemElement.offsetHeight + topValueDiff) + METAPOPOUT_BOTTOM_CORRECTION_PIXEL);
        }
        else if (wrapperRect.top < 0) {
            /* this is to reset the top for those poput which has negative top value*/
            this.metaPopoutTop = 0;
        }
    };
    /**
     * function to set the callout menu top and meta popup top on the standard view
     */
    FileItem.prototype.setMetaPopoupPositionOnStdView = function () {
        var wrapperRect = this.metaWrapperElement.getBoundingClientRect();
        // Defect fix #53684, added renderedTopItem to set the pop out position correctly for the last file items in an ecoursework response
        var renderedTopItem = this.fileItemElement.getBoundingClientRect().top +
            ((this.fileItemElement.getBoundingClientRect().height) - constants.ECOURSEWORK_FILELIST_PANEL_TOP);
        // Used for menu call out position
        var renderedTopMenu = this.fileItemElement.getBoundingClientRect().top +
            ((this.fileItemElement.getBoundingClientRect().height / 2) - constants.ECOURSEWORK_FILELIST_PANEL_TOP);
        /* if the top + height of of pop-out is higher than window height we need to shift this up*/
        if ((window.innerHeight) < (renderedTopItem + wrapperRect.height)) {
            var topValueDiff = (renderedTopItem + wrapperRect.height) - window.innerHeight;
            this.metaPopoutTop = ((renderedTopItem - topValueDiff) - (constants.COMMON_HEADER_HEIGHT + METAPOPOUT_BOTTOM_CORRECTION_PIXEL));
        }
        else {
            this.metaPopoutTop = renderedTopMenu;
        }
        this.menuCalloutTop = renderedTopMenu;
    };
    return FileItem;
}(pureRenderComponent));
module.exports = FileItem;
//# sourceMappingURL=fileitem.js.map