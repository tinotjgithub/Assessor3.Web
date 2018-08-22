"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var constants = require('../../../utility/constants');
var localeStore = require('../../../../stores/locale/localestore');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var enums = require('../../../utility/enums');
var classNames = require('classnames');
/* this is the sum of heights of  header panel and the two divs above file list panel */
var FILE_LIST_PANEL_TOP = 120;
/* tslint:disable:variable-name */
var MetaDataItem = function (props) {
    return (React.createElement("div", {className: 'meta-item'}, React.createElement("span", {className: 'meta-key'}, " ", props.metaKey, " "), React.createElement("span", {className: 'meta-value'}, " ", props.metaValue, " ")));
};
/**
 * React component class for meta data
 */
var MetaData = (function (_super) {
    __extends(MetaData, _super);
    /**
     * Constructor for metadata class
     */
    function MetaData(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isShowMore = undefined;
        this.isFloating = false;
        this.prevPageY = 0;
        this.allowUp = false;
        this.allowDown = false;
        /**
         * handler for scroll and wheel - to prevent the event propagation to stop the scroll of
         */
        this.onScroll = function (event) {
            event.stopPropagation();
        };
        /**
         * handler for Mousewheel event of popout content - to prevent the scroll propagation to filelist panel.
         */
        this.onMousewheel = function (event) {
            if ((htmlUtilities.isIE || htmlUtilities.isEdge) && _this.props.isSelected !== true
                && _this.props.isFilelistPanelCollapsed !== true) {
                var height = _this.refs.metaData.clientHeight;
                var scrollHeight = _this.refs.metaData.scrollHeight;
                var scrollTop = _this.refs.metaData.scrollTop;
                if (((scrollTop === (scrollHeight - height) && event.deltaY > 0)
                    || (scrollTop === 0 && event.deltaY < 0))) {
                    event.preventDefault();
                }
            }
        };
        /**
         * returns the show more or  less JSX element
         */
        this.showMoreLessElement = function () {
            var showMoreLessElement = null;
            if (_this.isShowMore !== undefined) {
                showMoreLessElement =
                    React.createElement("a", {href: 'javascript:void(0);', className: classNames('meta-change-view ', { 'fixed': (_this.isFloating && (_this.isShowMore === false)) }), onClick: _this.onShowMoreLessClick, id: 'showmorelessbutton'}, (_this.isShowMore === true) ?
                        localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.show-more-metadata') :
                        localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.show-less-metadata'));
            }
            return showMoreLessElement;
        };
        /**
         * click event handler of show more or less button .
         */
        this.onShowMoreLessClick = function () {
            _this.isShowMore = !_this.isShowMore;
            _this.isFloating = false;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * event handler for touch start
         */
        this.onTouchStart = function (event) {
            _this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
            // TODO: find an alterantive to avoid document.getElementById
            var content = document.getElementById('File_List');
            _this.allowUp = (content.scrollTop > 0);
            _this.allowDown = (content.scrollTop <= content.scrollHeight - content.clientHeight);
        };
        /**
         * event handler for touch move
         */
        this.onTouchMove = function (event) {
            event.preventDefault();
            // TODO: find an alterantive to avoid document.getElementById
            var content = document.getElementById('File_List');
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
         * to show the Show more or less buttons based on the content size.
         */
        this.showMoreOrLessButtton = function () {
            var timeOut;
            if (_this.props.isSelected === true && eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List) {
                if (_this.refs.metaData) {
                    /* this is to reset the top of metadata div even after scrolling the popout of the same */
                    _this.refs.metaData.scrollTop = 0;
                }
                if (htmlUtilities.isAndroidDevice || htmlUtilities.isEdge) {
                    timeOut = 0;
                }
                else {
                    timeOut = constants.GENERIC_ANIMATION_TIMEOUT;
                }
                setTimeout(function () {
                    var that = _this;
                    var scrollValue = (that.refs.metaViewControl) ? (that.refs.metaViewControl.getBoundingClientRect().top) : undefined;
                    var _isFloating = that.isFloating;
                    var _isShowMore = that.isShowMore;
                    var metadatTop = (that.refs.metaData) ? that.refs.metaData.getBoundingClientRect().top : 0;
                    var windowHeight = window.innerHeight;
                    /*  Conditions for displaying the floating show less button. (Based on the scrolling) */
                    if (scrollValue > windowHeight && windowHeight > metadatTop) {
                        that.isFloating = true;
                    }
                    else {
                        that.isFloating = false;
                    }
                    var containerHeight = (that.refs.metaData) ? that.refs.metaData.clientHeight : 0;
                    var innerHeight = (that.refs.metaDataInner) ? that.refs.metaDataInner.clientHeight : 0;
                    /* Conditions for displaying the show more button based on the meta data content size.*/
                    if (innerHeight > containerHeight && that.isShowMore === undefined) {
                        that.isShowMore = true;
                    }
                    /* Defect Fix : #57280 , Added condition for rechecking the display of showmore link after resizing the window*/
                    if (innerHeight === containerHeight && that.isShowMore === true) {
                        that.isShowMore = undefined;
                    }
                    /* re rendering if floating or show more options changed - Using private variables for these to avoid mutating of state
                    in will receive props*/
                    if (_isFloating !== that.isFloating || _isShowMore !== that.isShowMore) {
                        that.setState({ renderedOn: Date.now() });
                    }
                }, timeOut);
            }
        };
        this.state = {
            renderedOn: Date.now()
        };
        this.showMoreOrLessButtton = this.showMoreOrLessButtton.bind(this);
    }
    /**
     * render method
     */
    MetaData.prototype.render = function () {
        var _this = this;
        var that = this;
        var metDataItems;
        var element;
        if (this.props.metadata) {
            metDataItems = this.props.metadata.map(function (item) {
                return (React.createElement(MetaDataItem, {metaKey: item.key, metaValue: item.value, id: 'metadata_' + item.key + '_' + item.sequence, key: 'metadata_' + item.key + '_' + item.sequence, selectedLanguage: that.props.selectedLanguage}));
            });
        }
        if (htmlUtilities.isTabletOrMobileDevice && this.props.isFilelistPanelCollapsed) {
            return null;
        }
        else {
            var doShowTitle = (this.props.isSelected === false ||
                (this.props.isSelected && this.props.fileListPanelView === enums.FileListPanelView.Thumbnail)
                || this.props.isFilelistPanelCollapsed === true);
            element = React.createElement("div", {id: 'metadataContainer', className: 'file-meta-inner', ref: 'metaData', onWheel: this.onMousewheel}, React.createElement("div", {ref: 'metaDataInner', id: 'metaDataInnerContainer'}, doShowTitle ?
                React.createElement("div", {className: 'collapsed-dropdown-title'}, this.props.title) : null, metDataItems));
            var style = {
                top: (this.props.metaPopoutTop) ? (this.props.metaPopoutTop + 'px') : '0px'
            };
            if (this.doRenderMetaWrapper) {
                return (React.createElement("div", {className: classNames('file-meta-wrapper ', { 'more': (this.isShowMore === undefined || this.isShowMore === true) }, { 'less': this.isShowMore === false }), style: style, ref: function (metaWrapper) {
                    _this.metaWrapper = metaWrapper;
                    _this.props.metaWrapperRefCallback(metaWrapper);
                }, onScroll: this.onScroll, onWheel: this.onScroll}, element, React.createElement("div", {className: 'meta-view-controll', ref: 'metaViewControl'}, this.showMoreLessElement())));
            }
            else {
                return null;
            }
        }
    };
    Object.defineProperty(MetaData.prototype, "doRenderMetaWrapper", {
        /**
         * handle logic for showing meta data wrapper
         */
        get: function () {
            return (this.props.metadata !== undefined || this.props.isFilelistPanelCollapsed ||
                this.props.fileListPanelView === enums.FileListPanelView.Thumbnail);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * componentDidUpdate
     */
    MetaData.prototype.componentDidUpdate = function () {
        this.showMoreOrLessButtton();
    };
    /**
     * componentDidMount
     */
    MetaData.prototype.componentDidMount = function () {
        this.showMoreOrLessButtton();
        window.addEventListener('resize', this.showMoreOrLessButtton);
        /* These events are used to block default scrolling in ipad and implement custom
            scrolling logic to prevent the elastic scroll behavior of safari */
        if (htmlUtilities.isIPadDevice && this.metaWrapper) {
            this.metaWrapper.addEventListener('touchstart', this.onTouchStart);
            this.metaWrapper.addEventListener('touchmove', this.onTouchMove);
            this.metaWrapper.addEventListener('touchend', this.onTouchEnd);
        }
    };
    /**
     * componentDidMount
     */
    MetaData.prototype.componentWillunmount = function () {
        window.removeEventListener('resize', this.showMoreOrLessButtton);
        this.metaWrapper.removeEventListener('touchstart', this.onTouchStart);
        this.metaWrapper.removeEventListener('touchmove', this.onTouchMove);
        this.metaWrapper.removeEventListener('touchend', this.onTouchEnd);
    };
    /**
     * Comparing the props to check the updates are made by self
     * @param {Props} nextProps
     */
    MetaData.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.isFilelistPanelCollapsed !== nextProps.isFilelistPanelCollapsed
            || this.props.isSelected !== nextProps.isSelected) {
            this.isShowMore = undefined;
            this.isFloating = false;
        }
    };
    return MetaData;
}(pureRenderComponent));
module.exports = MetaData;
//# sourceMappingURL=metadata.js.map