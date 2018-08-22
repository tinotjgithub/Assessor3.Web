"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var bannerBase = require('../../../../utility/banner/bannerbase');
var localeStore = require('../../../../../stores/locale/localestore');
var enums = require('../../../../utility/enums');
var stampStore = require('../../../../../stores/stamp/stampstore');
var classNames = require('classnames');
var toolbarStore = require('../../../../../stores/toolbar/toolbarstore');
var messageStore = require('../../../../../stores/message/messagestore');
var exceptionStore = require('../../../../../stores/exception/exceptionstore');
var markingStore = require('../../../../../stores/marking/markingstore');
var responsestore = require('../../../../../stores/response/responsestore');
var eCourseworkHelper = require('../../../../utility/ecoursework/ecourseworkhelper');
var responseHelper = require('../../../../utility/responsehelper/responsehelper');
/**
 * Stamp banner component
 */
var StampBanner = (function (_super) {
    __extends(StampBanner, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function StampBanner(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /* variable for holding visibility status of a variable*/
        this.isStampBannerVisible = false;
        /* variable will set to true once we displayed the shrink expanded banner */
        this.isShrinkExpandedBannerDisplayed = false;
        /* variable will set to true while we close the toolbar */
        this.resetShowClass = false;
        this.resetHideClass = false;
        this.isInitialRender = true;
        /**
         * On stamp banner visibility mode updated event, we are not using isBannerVisible variable here but provided for a generic approach.
         */
        this.onStampBannerVisibilityModeUpdated = function (stampBannerType, isBannerVisibile) {
            if (stampStore.instance.isFavouriteToolbarEmpty) {
                _this.resetShowClass = false;
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Re-renders the Stamp Banner, when the favorite toolbar is empty.
         */
        this.setStampBannerVisiblityOnQigChange = function () {
            if (stampStore.instance.isFavouriteToolbarEmpty &&
                responsestore.instance.isWholeResponse === true) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /* We need to remove 'show' and 'hide' classes to avoid annotation clarity banner flashing issue */
        this.onStampPanelModeChanged = function () {
            if (!toolbarStore.instance.isStampPanelExpanded) {
                _this.resetShowClass = true;
                _this.resetHideClass = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /* We need to remove 'hide' class to avoid annotation clarity banner flashing issue */
        this.onResetHideClass = function () {
            _this.resetHideClass = true;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Retruns text for Overlay tools.
         */
        this.getOverlayBannerBody = function () {
            if (_this.props.bannerType === enums.BannerType.CustomizeToolBarBanner) {
                return ((eCourseworkHelper && eCourseworkHelper.isECourseworkComponent) || responseHelper.isEbookMarking) ? null : React.createElement("p", null, React.createElement("br", null), localeStore.instance.TranslateText('marking.response.annotation-toolbar-helper.body-before-adding-stamp-with-overlays'));
            }
        };
    }
    /**
     * Component did mount
     */
    StampBanner.prototype.componentDidMount = function () {
        stampStore.instance.addListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED, this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onResetHideClass);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.onResetHideClass);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.setStampBannerVisiblityOnQigChange);
    };
    /**
     * Component will unmount
     */
    StampBanner.prototype.componentWillUnmount = function () {
        stampStore.instance.removeListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED, this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onResetHideClass);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.onResetHideClass);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.setStampBannerVisiblityOnQigChange);
    };
    /**
     * Render method
     */
    StampBanner.prototype.render = function () {
        // if there are no stamps against current qig then there is no need to show stamp banner
        if (this.state.renderedOn === 0 ||
            stampStore.instance.stampsAgainstCurrentQig(responsestore.instance.isWholeResponse).count() === 0) {
            return null;
        }
        this.isStampBannerVisible = stampStore.instance.currentStampBannerType === this.props.bannerType;
        /* we don't need to add hide class to ShrinkExpandedBanner if it's not rendered yet, other wise it will flashes on the screen */
        if (this.isStampBannerVisible && this.props.bannerType === enums.BannerType.ShrinkExpandedBanner
            && !this.isShrinkExpandedBannerDisplayed) {
            this.isShrinkExpandedBannerDisplayed = true;
        }
        this.currentStampBannerClass = this.props.bannerType === enums.BannerType.CustomizeToolBarBanner ?
            'cutomise-toolbar-msg1' : 'cutomise-toolbar-msg triggered';
        var markingOverlayClass;
        if (this.props.bannerType === enums.BannerType.CustomizeToolBarBanner) {
            markingOverlayClass = 'fav-message-box ';
        }
        /* We need to remove 'show' and 'hide' classes to avoid annotation clarity banner flashing issue */
        var classToApply = classNames('message-box text-left float-msg dark-msg left info-guide callout ', this.currentStampBannerClass, markingOverlayClass, { 'show': this.isStampBannerVisible === true && !this.resetShowClass }, {
            'hide': (this.resetHideClass || this.isInitialRender) ? false :
                (this.props.bannerType === enums.BannerType.ShrinkExpandedBanner ?
                    (this.isShrinkExpandedBannerDisplayed && this.isStampBannerVisible === false) : !this.isStampBannerVisible)
        });
        // reseting hide class flag
        this.isInitialRender = false;
        return (React.createElement("div", {className: classToApply, role: this.props.role, id: this.props.id, "aria-hidden": this.props.isAriaHidden}, React.createElement("h4", {id: 'bannerHeader', className: 'bolder padding-bottom-10'}, localeStore.instance.TranslateText(this.props.header)), React.createElement("p", {id: 'bannerBody', className: 'message-body'}, localeStore.instance.TranslateText(this.props.message)), this.getOverlayBannerBody()));
    };
    return StampBanner;
}(bannerBase));
module.exports = StampBanner;
//# sourceMappingURL=stampbanner.js.map