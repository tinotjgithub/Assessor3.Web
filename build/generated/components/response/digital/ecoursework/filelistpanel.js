"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var classNames = require('classnames');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var FileItem = require('./fileitem');
var eCourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
var userOptionHelper = require('../../../../utility/useroption/useroptionshelper');
var constants = require('../../../utility/constants');
var responseStore = require('../../../../stores/response/responsestore');
var eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var URLS = require('../../../../dataservices/base/urls');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var worklistStore = require('../../../../stores/worklist/workliststore');
var enums = require('../../../utility/enums');
var applicationActionCreator = require('../../../../actions/applicationoffline/applicationactioncreator');
var ecourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var ecourseworkFilelistPanelState = require('../../../../stores/useroption/typings/ecourseworkfilelistpanelstate');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var stampStore = require('../../../../stores/stamp/stampstore');
var stampActioncreator = require('../../../../actions/stamp/stampactioncreator');
/**
 * React component class for response toolbar.
 */
var FilelistPanel = (function (_super) {
    __extends(FilelistPanel, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function FilelistPanel(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.topIndex = 0;
        this.bottomIndex = 0;
        this.totalNoOfItems = 0;
        this.maxNoOfIcons = 0;
        this.selectedFileIndex = 0;
        this.prevPageY = 0;
        this.allowUp = false;
        this.allowDown = false;
        this.isTouchInitialised = false;
        this.onErrorRetryCount = config.general.CLOUD_IMAGE_RETRY_COUNT;
        this.hasScrolled = false;
        /**
         * event handler for touch start
         */
        this.onTouchStart = function (event) {
            _this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
            var content = _this.refs.fileList;
            _this.allowUp = (content.scrollTop > 0);
            _this.allowDown = (content.scrollTop <= content.scrollHeight - content.clientHeight);
        };
        /**
         * event handler for touch move
         */
        this.onTouchMove = function (event) {
            event.preventDefault();
            var content = _this.refs.fileList;
            var pageY = event.changedTouches[0].pageY;
            var up = (pageY > _this.prevPageY);
            var down = (pageY < _this.prevPageY);
            var diff = Math.abs(_this.prevPageY - event.pageY);
            _this.prevPageY = event.pageY;
            if ((up && _this.allowUp)) {
                content.scrollTop = (content.scrollTop - diff);
            }
            else if (down && _this.allowDown) {
                content.scrollTop = (content.scrollTop + diff);
            }
        };
        /**
         * event handler for touch end
         */
        this.onTouchEnd = function (event) {
            _this.prevPageY = 0;
        };
        /**
         * OnError of image load
         */
        this.onError = function (docPageID) {
            _this.docPageIdsWithError.push(docPageID);
            _this.renderCloudImages();
        };
        /**
         * OnSuccess of image load
         */
        this.onSuccess = function (docPageID) {
            _this.docPageIdsWithSuccess.push(docPageID);
            _this.renderCloudImages();
        };
        /**
         * Save selected ecourse work file in the store.
         */
        this.eCourseworkFileSelectionchange = function (eCourseworkfile) {
            // for handling offline scenario for image types. While selecting an image we need to display an offline popup
            if (eCourseworkfile.linkData.mediaType === enums.MediaType.Image) {
                // displaying offline error popup
                applicationActionCreator.checkActionInterrupted();
            }
            // To avoid displaying file name in expanded view
            if (eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
                eCourseworkResponseActionCreator.displayFileName(eCourseworkfile.title);
            }
            var courseWorkSelectedFile = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
            var isSameFileSelected = courseWorkSelectedFile ? courseWorkSelectedFile.filter(function (x) { return x.docPageID ===
                eCourseworkfile.docPageID; }).count() === 0 : true;
            if (!eCourseworkfile.linkData.canDisplayInApplication || isSameFileSelected) {
                // Invoke action creator to save selected ecourse file in the store.
                eCourseworkResponseActionCreator.eCourseworkFileSelect(eCourseworkfile, true);
            }
            if (stampStore.instance.isFavouriteToolbarEmpty && !eCourseWorkFileStore.instance.iscustomToolbarMessageDisplayed) {
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
            }
        };
        /**
         * Re Render on File selection change
         */
        this.changeFileSelection = function (doSetIndex) {
            _this.doAutoDownloadFileItem(false);
            if (doSetIndex) {
                _this.setIndexes(null, doSetIndex);
            }
            else {
                _this.doRender();
            }
        };
        /**
         * reset values while response navigation
         */
        this.responseChanged = function () {
            _this.bottomIndex = 0;
            _this.topIndex = 0;
        };
        /**
         * Function for switching filelist view
         */
        this.toggleFilelistView = function () {
            _this.setTopIndex();
            var _viewToUpdate = enums.FileListPanelView.List;
            //Defect #59177 check OnlineStatus when switch to thumbnail View
            if (eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List &&
                !applicationActionCreator.checkActionInterrupted()) {
                return;
            }
            if (eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List) {
                _viewToUpdate = enums.FileListPanelView.Thumbnail;
            }
            eCourseworkResponseActionCreator.filelistPanelSwitchView(_viewToUpdate);
            _this.updateFileListPanelUserOption(_viewToUpdate, eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
        };
        /**
         * Function for getting expand/collapse status
         */
        this.toggleFilelistPanel = function () {
            // re-setting indexes in collapsed state
            if (_this.refs.fileList && !eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
                _this.setTopIndex();
                var actualHeight = _this.refs.fileList.clientHeight - constants.DEFAULT_MEDIA_ARROW_ICON_HEIGHT;
                _this.totalNoOfItems = _this.totalElements.length;
                // setting single icon width
                var singleIconWidth = constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT;
                // setting max no of icons fits within particular height
                _this.maxNoOfIcons = Math.floor(actualHeight / singleIconWidth);
                var _bottomIndex = _this.topIndex + _this.maxNoOfIcons;
                _this.bottomIndex = (_bottomIndex > _this.totalNoOfItems ? _this.totalNoOfItems : _bottomIndex) - 1;
            }
            _this.updateFileListPanelUserOption(eCourseWorkFileStore.instance.fileListPanelCurrentView, !eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
            eCourseworkResponseActionCreator.fileListPanelToggle(!eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
        };
        /**
         * Method to save user option of ecoursework file list panel state
         */
        this.updateFileListPanelUserOption = function (fileListPanelView, iscollapsed) {
            var _ecourseworkFilelistPanelState = new ecourseworkFilelistPanelState();
            _ecourseworkFilelistPanelState.iscollapsed = iscollapsed;
            _ecourseworkFilelistPanelState.fileListPanelView = fileListPanelView;
            userOptionHelper.save(userOptionKeys.ECOURSEWORK_FILELIST_PANEL_STATE, JSON.stringify(_ecourseworkFilelistPanelState), true, true);
        };
        /**
         * Method to update filelist panel in the store
         */
        this.toggleFilelistPanelUpdated = function () {
            _this.doRender();
        };
        /*
         * event handler for file list panel scroll.
         */
        this.onScroll = function () {
            _this.hasScrolled = true;
            if (!eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
                _this.setState({
                    renderedOn: _this.state.renderedOn,
                    fileListScrollHeight: _this.getFileListScrollHeight()
                }, function () {
                    _this.hasScrolled = false;
                });
            }
        };
        /*
         * event handler for file list panel item hover.
         */
        this.onFileItemHover = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * setting / resetting index for first time based on filelist height
         */
        this.setIndexes = function (event, doSetIndex) {
            if (doSetIndex === void 0) { doSetIndex = false; }
            if ((eCourseWorkFileStore.instance.isFilelistPanelCollapsed || doSetIndex) && _this.refs.fileList) {
                // getting actual height of filelist html element
                var actualHeight = _this.refs.fileList.clientHeight;
                _this.totalNoOfItems = _this.totalElements.length;
                // setting single icon width
                var singleIconWidth = constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT;
                // setting max no of icons fits within particular height
                _this.maxNoOfIcons = Math.floor(actualHeight / singleIconWidth);
                _this.topIndex = 0;
                // setting default value while the maxnooficons is 1 or less than 1
                // which avoids cyclic re-render through  componentDidMount
                _this.bottomIndex = _this.maxNoOfIcons <= 1 ?
                    1 : (_this.maxNoOfIcons > _this.totalNoOfItems ?
                    _this.totalNoOfItems : _this.maxNoOfIcons) - 1;
                // setting index based on file Index
                // while resizing the selected file should be shown and
                // also while returning back to collapsed mode from expanded mode then selected file should shown
                _this.setSelectedFileIndex(doSetIndex);
                _this.doRender();
            }
        };
        /**
         * setting / resetting scroll position
         */
        this.setScroll = function (event) {
            var isMediaEvent = event && (event.type === 'transitionend' || event.type === 'webkitTransitionEnd')
                && (event.propertyName === 'margin-left' || (htmlUtilities.isIPadDevice && event.propertyName === 'margin'))
                && event.target.className === 'media-panel-inner';
            // setting scroll bar while switching between thumnailview and listview
            var isThumbNailEvent = event && (event.type === 'transitionend' || event.type === 'webkitTransitionEnd')
                && (event.propertyName === 'height' || (htmlUtilities.isIPadDevice && event.propertyName === 'margin'))
                && event.target.className === 'thumbnail-image';
            // for fixing partial visible icons issue after transition end
            // for fixing scroll persist in filelist panel for ipad
            if (isMediaEvent || isThumbNailEvent) {
                if (!eCourseWorkFileStore.instance.isFilelistPanelCollapsed && _this.refs.fileList) {
                    var fileItemHeight = 0;
                    // include meta data height when the selected file is
                    // above the file which present at first position in collapsed view (i < this.topIndex)
                    for (var i = 0; i < _this.topIndex; i++) {
                        fileItemHeight = fileItemHeight + _this.totalElements[i].offsetHeight;
                    }
                    // skip scroll top calculation for first Item
                    var _scrollTop = _this.topIndex === 0 ? 0 : fileItemHeight;
                    _this.refs.fileList.scrollTop = _scrollTop > 0 ? _scrollTop : 0;
                }
                else {
                    // call the action for updating the on page comment's line position
                    eCourseworkResponseActionCreator.mediaPanelTransitionEnd();
                }
            }
        };
        this.state = {
            renderedOn: 0
        };
        this._eCourseWorkFileList = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstMarkGroupId(this.props.responseId);
        this.upArrowClick = this.upArrowClick.bind(this);
        this.downArrowClick = this.downArrowClick.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.toggleFilelistPanel = this.toggleFilelistPanel.bind(this);
        this.toggleFilelistView = this.toggleFilelistView.bind(this);
        this.fileListPanelViewUpdated = this.fileListPanelViewUpdated.bind(this);
        this.docPageIdsWithError = new Array();
        this.docPageIdsWithSuccess = new Array();
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.onFileItemHover = this.onFileItemHover.bind(this);
    }
    /**
     * Render component
     */
    FilelistPanel.prototype.render = function () {
        // logic for disabling the arrow keys
        var doDisableUpArrow = this.topIndex === 0;
        // if the this.totalElements are not updated, then donot show the down arrow, will set correctly after loading the files
        var doDisableDownArrow = this.totalElements && (this.totalElements.length === 0 ||
            this.bottomIndex === this.totalElements.length - 1);
        var isListView = eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List;
        var linkButtonIcon = isListView ? 'tile-view-icon' : 'grid-view-icon';
        var linkButtonText = isListView ? localeStore.instance.TranslateText('marking.response.media-player.thumbnail-view') :
            localeStore.instance.TranslateText('marking.response.media-player.list-view');
        var fileListViewClass = isListView ? 'list-view' : 'thumbnail-view';
        var switchViewButton = this.isImageFileExists(this.props.responseId) ? (React.createElement("a", {href: 'javascript:void(0);', onClick: this.toggleFilelistView, id: 'toggleFileListView', className: 'switch-view', title: linkButtonText}, React.createElement("span", {className: classNames('sprite-icon', linkButtonIcon)}, linkButtonText), React.createElement("span", {className: 'view-text'}, linkButtonText))) : null;
        return (React.createElement("div", {className: classNames('media-panel', fileListViewClass), id: 'media-panel'}, React.createElement("div", {className: 'media-panel-inner'}, React.createElement("div", {className: 'panel-header'}, React.createElement("div", {id: 'media_panel_header', className: 'panel-header-label'}, localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.header')), React.createElement("a", {href: 'javascript:void(0);', className: 'exp-col-media-panel', id: 'ecourseworkpanel', title: eCourseWorkFileStore.instance.isFilelistPanelCollapsed ?
            localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.expand-button-tooltip') :
            localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.collapse-button-tooltip'), onTransitionEnd: this.onAnimationEnd, onClick: this.toggleFilelistPanel}, React.createElement("span", {className: 'sprite-icon exp-collapse-arrow right'}, eCourseWorkFileStore.instance.isFilelistPanelCollapsed ?
            localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.expand-button-tooltip') :
            localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.collapse-button-tooltip')))), React.createElement("div", {className: 'panel-content'}, React.createElement("div", {className: 'media-panel-nav'}, React.createElement("div", {className: 'panel-view-contol'}, switchViewButton), React.createElement("a", {href: 'javascript:void(0);', id: 'mediaFileUpArrow', onClick: this.upArrowClick, className: classNames('panel-control prev', { 'disabled': doDisableUpArrow }), title: localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.previous-button-tooltip')}, React.createElement("span", {className: 'sprite-icon top-arrow-blue'}, localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.previous-button-tooltip')))), this.getFileList(), React.createElement("div", {className: 'media-panel-nav'}, React.createElement("div", {className: 'panel-bottom-contol'}), React.createElement("a", {href: 'javascript:void(0);', id: 'mediaFileDownArrow', onClick: this.isOnlyOneFileInPanel ? null : this.downArrowClick, className: classNames('panel-control next', { 'disabled': doDisableDownArrow }), title: localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.next-button-tooltip')}, React.createElement("span", {className: 'sprite-icon bottom-arrow-blue'}, localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.next-button-tooltip')))))), this.renderDefinitions()));
    };
    /**
     * On Component Mount
     */
    FilelistPanel.prototype.componentDidMount = function () {
        eCourseWorkFileStore.instance.
            addListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.changeFileSelection);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this.toggleFilelistPanelUpdated);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT, this.fileListPanelViewUpdated);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        window.addEventListener('resize', this.setIndexes);
        var mediaPanel = document.getElementById('media-panel');
        if (mediaPanel) {
            mediaPanel.addEventListener('transitionend', this.setScroll);
            mediaPanel.addEventListener('webkitTransitionEnd', this.setScroll);
        }
        // getting htmlElements collections
        this.totalElements = document.getElementsByClassName('media-file-item');
    };
    /**
     * componentWillUnmount
     */
    FilelistPanel.prototype.componentWillUnmount = function () {
        eCourseWorkFileStore.instance.
            removeListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.changeFileSelection);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this.toggleFilelistPanelUpdated);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT, this.fileListPanelViewUpdated);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        window.removeEventListener('resize', this.setIndexes);
        var mediaPanel = document.getElementById('media-panel');
        if (mediaPanel) {
            mediaPanel.removeEventListener('transitionend', this.setScroll);
            mediaPanel.removeEventListener('webkitTransitionEnd', this.setScroll);
        }
        this.refs.fileList.removeEventListener('touchstart', this.onTouchStart);
        this.refs.fileList.removeEventListener('touchmove', this.onTouchMove);
        this.refs.fileList.removeEventListener('touchend', this.onTouchEnd);
        // update current view to store while moving out from response
        this.updateFileListView(this.props.responseId);
    };
    /**
     * componentDidUpdate
     */
    FilelistPanel.prototype.componentDidUpdate = function () {
        // due to animation DOM elements of filelist won't be available
        // so to avoid settimeout function, added check for filling html collection
        if (this.totalElements.length === 0) {
            // ensuring whether the file list html collections exists
            this.totalElements = document.getElementsByClassName('media-file-item');
        }
        else if (this.topIndex === 0 && this.bottomIndex === 0 && this.totalElements.length > 1) {
            // calculate indexex only if this.totalElements.length > 1, to avoid cyclic re-render
            // if this.totalElements.length is 1, then this.topIndex and this.bottomIndex are 0, no need of recalculation
            // to set top and bottom indexes
            this.setIndexes();
        }
        /* these events are used to block default scrolling in ipad and implement custom
           scrolling logic to prevent the elastic scroll behavior of safari */
        if (this.refs.fileList && this.isTouchInitialised === false && htmlUtilities.isIPadDevice) {
            this.isTouchInitialised = true;
            this.refs.fileList.addEventListener('touchstart', this.onTouchStart);
            this.refs.fileList.addEventListener('touchmove', this.onTouchMove);
            this.refs.fileList.addEventListener('touchend', this.onTouchEnd);
        }
    };
    /**
     * component will receive props
     */
    FilelistPanel.prototype.componentWillReceiveProps = function (nextProps) {
        this._eCourseWorkFileList = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstMarkGroupId(nextProps.responseId);
        if (nextProps.responseId !== this.props.responseId) {
            this.docPageIdsWithError = new Array();
            this.docPageIdsWithSuccess = new Array();
            // update current view to store while moving out from response
            this.updateFileListView(this.props.responseId);
        }
    };
    /**
     * Method To Render Sideview
     */
    FilelistPanel.prototype.onAnimationEnd = function () {
        stampActioncreator.renderSideViewComments();
    };
    Object.defineProperty(FilelistPanel.prototype, "fileListPanelStyle", {
        /**
         * file list panel style
         */
        get: function () {
            return classNames('file-list', { 'scrolling': this.hasScrolled });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Function for getting file list
     */
    FilelistPanel.prototype.getFileList = function () {
        if (this._eCourseWorkFileList) {
            var index_1 = 0;
            var that_1 = this;
            var files = this._eCourseWorkFileList.map(function (_eCourseWorkFile) {
                // logic for adding startview and endview classes
                var doAddStartView = index_1 === that_1.bottomIndex;
                var doAddEndView = index_1 === that_1.topIndex;
                var metadata = eCourseWorkFileStore.instance.getCoversheetMetaData(that_1.props.responseId, _eCourseWorkFile.docPageID);
                var fileItemComponent = (React.createElement(FileItem, {selectedLanguage: that_1.props.selectedLanguage, id: 'FileItem' + index_1, key: 'FileItem_key' + index_1, eCourseWorkFile: _eCourseWorkFile, isSelected: eCourseWorkFileStore.instance.
                    getSelectedECourseWorkFiles() ?
                    eCourseWorkFileStore.instance.getSelectedECourseWorkFiles().
                        some(function (x) { return x.docPageID === _eCourseWorkFile.docPageID; }) : false, onCouseWorkFileClick: that_1.eCourseworkFileSelectionchange, doAddStartView: doAddStartView, doAddEndView: doAddEndView, isUnread: !_eCourseWorkFile.readStatus, metaData: metadata, isFilelistPanelCollapsed: eCourseWorkFileStore.instance.isFilelistPanelCollapsed, scrollHeight: that_1.state.fileListScrollHeight, fileListPanelView: eCourseWorkFileStore.instance.fileListPanelCurrentView, renderedOn: that_1.state.renderedOn, onError: that_1.onError, docPageId: _eCourseWorkFile.docPageID, onSuccess: that_1.onSuccess, onFileItemHover: that_1.onFileItemHover}));
                index_1++;
                return fileItemComponent;
            });
            return (React.createElement("ul", {className: this.fileListPanelStyle, role: 'list', id: 'File_List', onWheel: this.isOnlyOneFileInPanel ? null : this.onMouseWheel, onScroll: this.isOnlyOneFileInPanel ? null : this.onScroll, ref: 'fileList'}, files));
        }
        else {
            return null;
        }
    };
    /**
     * to check whether image file exits in file list
     */
    FilelistPanel.prototype.isImageFileExists = function (identifier) {
        var _eCourseWorkFileList = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstMarkGroupId(identifier);
        if (_eCourseWorkFileList) {
            return _eCourseWorkFileList.some(function (courseWorkFile) {
                return courseWorkFile.linkData.mediaType === enums.MediaType.Image;
            });
        }
        return false;
    };
    /**
     * update current view to store while moving out from response
     */
    FilelistPanel.prototype.updateFileListView = function (identifier) {
        var doShowSwitchViewButton = this.isImageFileExists(identifier);
        if (eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.Thumbnail
            && !doShowSwitchViewButton) {
            eCourseworkResponseActionCreator.filelistPanelSwitchView(enums.FileListPanelView.List, false);
            this.updateFileListPanelUserOption(enums.FileListPanelView.List, eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
        }
    };
    /**
     * check rerender of cloud images
     */
    FilelistPanel.prototype.renderCloudImages = function () {
        /*filter cloud images*/
        var courseWorkFileList = this._eCourseWorkFileList.filter(function (x) {
            return x.linkData.cloudType !== enums.CloudType.None &&
                x.linkData.mediaType === enums.MediaType.Image;
        });
        /* if any of the image not loaded do a retry to load the images */
        if (this.onErrorRetryCount > 0 && this.docPageIdsWithError.length > 0 &&
            courseWorkFileList.length === (this.docPageIdsWithError.length + this.docPageIdsWithSuccess.length)) {
            this.onErrorRetryCount = this.onErrorRetryCount - 1;
            eCourseworkResponseActionCreator.reloadFailedImage();
            this.docPageIdsWithError = [];
        }
    };
    /**
     * Function for rendering definitions
     */
    FilelistPanel.prototype.renderDefinitions = function () {
        return eCourseWorkHelper.renderDefinitions();
    };
    /**
     * Method to handle up arrow click file Navigation
     */
    FilelistPanel.prototype.upArrowClick = function () {
        // block navigation only when top index reaches first file
        if (this.topIndex !== 0) {
            this.moveUp();
        }
    };
    /**
     * Method to handle down arrow click file Navigation
     */
    FilelistPanel.prototype.downArrowClick = function () {
        // block navigation only when bottom index reaches last file
        if (this.bottomIndex !== this.totalNoOfItems - 1) {
            this.moveDown();
        }
    };
    /**
     * handles mouseWheel navigation in file list collapsed mode
     */
    FilelistPanel.prototype.onMouseWheel = function (event) {
        if (eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
            // handles mouse sroll down event
            if (event.deltaY > 0 && (this.bottomIndex !== this.totalNoOfItems - 1)) {
                this.moveDown();
            }
            else if (event.deltaY < 0 && this.topIndex !== 0) {
                // handles mouse sroll up event
                this.moveUp();
            }
        }
    };
    /**
     * returns the file list scroll height
     */
    FilelistPanel.prototype.getFileListScrollHeight = function () {
        return (this.refs.fileList) ? (this.refs.fileList.clientHeight + this.refs.fileList.scrollTop) : undefined;
    };
    /**
     * handles fileicon navigation upwards
     */
    FilelistPanel.prototype.moveUp = function () {
        // this.maxNoOfIcons indicates max no of icons should be in particular file list based on height
        // checks of difference between two indexes matches this.maxNoOfIcons
        if (Math.abs(this.topIndex - this.bottomIndex) === (this.maxNoOfIcons - 1)) {
            this.bottomIndex--;
        }
        this.topIndex--;
        this.doRender();
    };
    /**
     * handles fileicon navigation downwards
     */
    FilelistPanel.prototype.moveDown = function () {
        this.topIndex++;
        this.bottomIndex++;
        this.doRender();
    };
    /**
     * Function for setting top Index value to calculate scrollTop value
     */
    FilelistPanel.prototype.setTopIndex = function () {
        var fileListElement = this.refs.fileList;
        if (fileListElement) {
            var currentFileListPosition = Math.round(fileListElement.getBoundingClientRect().top);
            for (var i = 0; i < this.totalElements.length; i++) {
                // setting topindex for viewable icon (partially selected or fully selected)
                // this.totalElements[i].getBoundingClientRect().top ---> returns the current icon's position
                // if this icon is less than currentFileListPosition then it is hidden
                // so based on this condition index is setted
                if (Math.round(this.totalElements[i].getBoundingClientRect().top) < currentFileListPosition
                    && Math.round(this.totalElements[i].getBoundingClientRect().bottom) > currentFileListPosition) {
                    this.topIndex = i;
                    break;
                }
                else if (Math.round(this.totalElements[i].getBoundingClientRect().top) >= currentFileListPosition) {
                    this.topIndex = i;
                    break;
                }
            }
        }
    };
    /**
     * setting / resetting index based on selected file
     */
    FilelistPanel.prototype.setSelectedFileIndex = function (doSetIndex) {
        if (doSetIndex === void 0) { doSetIndex = false; }
        var pageId = eCourseWorkFileStore.instance.
            getSelectedECourseWorkFiles() ? eCourseWorkFileStore.instance.
            getSelectedECourseWorkFiles().last().docPageID : 0;
        var index = 0;
        var that = this;
        this._eCourseWorkFileList.map(function (_eCourseWorkFile) {
            if (pageId === _eCourseWorkFile.docPageID) {
                that.selectedFileIndex = index;
            }
            index++;
        });
        // setting index based on selected file index
        if (this.selectedFileIndex > 0 && this.maxNoOfIcons > 0) {
            var _topIndex = 0;
            var doLoop = true;
            while (doLoop) {
                _topIndex = _topIndex + this.maxNoOfIcons;
                if (_topIndex > this.selectedFileIndex) {
                    this.topIndex = _topIndex - this.maxNoOfIcons;
                    var _bottomIndex = this.topIndex + this.maxNoOfIcons - 1;
                    this.bottomIndex = _bottomIndex > this.totalNoOfItems - 1 ? this.totalNoOfItems - 1 : _bottomIndex;
                    break;
                }
            }
            if (doSetIndex) {
                var metaDataFileHeight = 0;
                if (this.totalElements[this.selectedFileIndex]) {
                    metaDataFileHeight = this.totalElements[this.selectedFileIndex].offsetHeight - constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT;
                }
                // skip scroll top calculation for first Item
                var _scrollTop = this.topIndex === 0 ? 0 :
                    (this.topIndex * constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT) + metaDataFileHeight;
                this.refs.fileList.scrollTop = _scrollTop > 0 ? _scrollTop : 0;
            }
        }
    };
    /**
     * To download the file item
     * it is used to download files with formats which cannot be displayed in A3
     * if the first file upon opening a response is unsupported, then the download will only take place on selecting the metadata.
     */
    FilelistPanel.prototype.doAutoDownloadFileItem = function (multipleDownload) {
        var isOnline = true;
        var selectedCourseWorkFile = eCourseWorkHelper.getCurrentEcourseworkFile();
        var canDownload = multipleDownload ? multipleDownload
            : eCourseWorkFileStore.instance.doAutoPlay();
        if (!selectedCourseWorkFile.linkData.canDisplayInApplication && canDownload) {
            // handling offline scenario
            if (!applicationActionCreator.checkActionInterrupted()) {
                return;
            }
            if (!markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !worklistStore.instance.isMarkingCheckAvailable) {
                // Invoke action creator to set selected ecoursework file read status and in progress status as true.
                eCourseWorkHelper.updatefileReadStatusProgress(this.props.responseId);
            }
            var url_1 = config.general.SERVICE_BASE_URL + URLS.GET_ECOURSE_WORK_BASE_URL +
                selectedCourseWorkFile.linkData.url;
            /* Delaying the download window to complete the file item and metadata div animation.
            Otherwise the client height of meta data div became zero and causing issues od show more button visibility */
            if (htmlUtilities.isIPadDevice) {
                if (eCourseWorkHelper.openFileInNewWindow(url_1)) {
                    ecourseworkResponseActionCreator.fileDownloadedOustide();
                }
            }
            else {
                setTimeout(function () {
                    // We can't download file if application is offline
                    if (eCourseWorkHelper.openFileInNewWindow(url_1)) {
                        ecourseworkResponseActionCreator.fileDownloadedOustide();
                    }
                }, constants.GENERIC_IMMEDIATE_AFTER_ANIMATION_TIMEOUT);
            }
        }
    };
    /**
     * to force rerender
     */
    FilelistPanel.prototype.doRender = function () {
        this.setState({
            renderedOn: Date.now(),
            fileListScrollHeight: this.getFileListScrollHeight()
        });
    };
    /**
     * to force rerender
     */
    FilelistPanel.prototype.fileListPanelViewUpdated = function () {
        this.doRender();
    };
    Object.defineProperty(FilelistPanel.prototype, "isOnlyOneFileInPanel", {
        /**
         * returns true if the panel having only one file.
         */
        get: function () {
            return this.bottomIndex === 0 && this.topIndex === 0;
        },
        enumerable: true,
        configurable: true
    });
    return FilelistPanel;
}(pureRenderComponent));
module.exports = FilelistPanel;
//# sourceMappingURL=filelistpanel.js.map