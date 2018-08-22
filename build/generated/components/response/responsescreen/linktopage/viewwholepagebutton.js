"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var classNames = require('classnames');
var pureRenderComponent = require('../../../base/purerendercomponent');
var responseStore = require('../../../../stores/response/responsestore');
var pageLinkHelper = require('./pagelinkhelper');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var localeStore = require('../../../../stores/locale/localestore');
var stampStore = require('../../../../stores/stamp/stampstore');
var treeViewDataHelper = require('../../../../utility/treeviewhelpers/treeviewdatahelper');
var markingStore = require('../../../../stores/marking/markingstore');
var markingHelper = require('../../../../utility/markscheme/markinghelper');
var enums = require('../../../utility/enums');
/**
 * React component for reports
 */
var ViewWholePageButton = (function (_super) {
    __extends(ViewWholePageButton, _super);
    /**
     * Constructor for TagList class
     */
    function ViewWholePageButton(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * updates the visibility of the view whole page link button.
         */
        this.updateVisibility = function (isVisible, activeImageZone) {
            _this._activeImageZone = activeImageZone;
            if (htmlUtilities.isTabletOrMobileDevice) {
                _this.viewWholePageButtonHide();
                var that_1 = _this;
                setTimeout(function () {
                    _this.setState({
                        isEnabled: (activeImageZone &&
                            that_1.props.imageZones &&
                            that_1.props.imageZones.pageNo === activeImageZone.pageNo &&
                            that_1.props.imageZones.uniqueId === activeImageZone.uniqueId) ? isVisible : false
                    });
                }, 0);
            }
            else {
                _this.setState({
                    isEnabled: (activeImageZone &&
                        _this.props.imageZones &&
                        _this.props.imageZones.pageNo === activeImageZone.pageNo &&
                        _this.props.imageZones.uniqueId === activeImageZone.uniqueId) ? isVisible : false
                });
            }
        };
        /**
         * Link whole page button, click handler.
         */
        this.linkWholePageClickHandler = function () {
            if (_this.state.isEnabled) {
                _this.setState({
                    isEnabled: false
                });
                var currentMarkSchemeId = 0;
                // if a item with multiple children having same image cluster, then we need 
                // to add link annotation against first item in that collection.
                if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                    var tree = null;
                    _this.treeViewHelper = new treeViewDataHelper();
                    var currentQuestionItem = markingStore.instance.currentQuestionItemInfo;
                    if (currentQuestionItem && currentQuestionItem.imageClusterId > 0) {
                        tree = _this.treeViewHelper.treeViewItem();
                        if (tree !== null) {
                            var multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(tree, markingStore.instance.currentMarkSchemeId, true);
                            if (multipleMarkSchemes) {
                                // if multiple markscheme then return the first child
                                var itemToLink = pageLinkHelper.getItemToLink(markingStore.instance.currentQuestionItemInfo, multipleMarkSchemes.treeViewItemList, multipleMarkSchemes.treeViewItemList.count() > 0);
                                currentMarkSchemeId = itemToLink.uniqueId;
                            }
                        }
                    }
                }
                else {
                    currentMarkSchemeId = markingStore.instance.currentMarkSchemeId;
                }
                pageLinkHelper.linkImageZone(_this._activeImageZone, _this.props.isStitched, currentMarkSchemeId);
            }
        };
        /**
         * updates the visibility of the view whole page button.
         */
        this.viewWholePageButtonHide = function () {
            _this.setState({
                isEnabled: false
            });
        };
        /**
         * updates the visibility of the view whole page button.
         */
        this.onMouseOverHandler = function () {
            if (_this.props.isMouseOverEnabled === true && _this.props.imageZones.isViewWholePageLinkVisible) {
                _this.setState({
                    isEnabled: true
                });
            }
        };
        // Setting the initial state
        this.state = {
            isEnabled: false
        };
        this.linkWholePageClickHandler = this.linkWholePageClickHandler.bind(this);
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
    }
    /**
     * Render component.
     */
    ViewWholePageButton.prototype.render = function () {
        var viewWholeButtonClass = 'expand-zone' + (this.state.isEnabled === true ? ' expand-delay' : '');
        return (React.createElement("a", {className: viewWholeButtonClass, onMouseLeave: this.viewWholePageButtonHide, onMouseOver: this.onMouseOverHandler, id: this.props.id, onClick: this.linkWholePageClickHandler, href: '#'}, localeStore.instance.TranslateText('marking.response.script-images.view-whole-page')));
    };
    /**
     * triggers when the tag list component mount.
     */
    ViewWholePageButton.prototype.componentDidMount = function () {
        // Event to collapse all tag list except the selected one from worklist
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS, this.updateVisibility);
        if (htmlUtilities.isTabletOrMobileDevice) {
            stampStore.instance.addListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.viewWholePageButtonHide);
        }
    };
    /**
     * triggers when the tag list components unmounts
     */
    ViewWholePageButton.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS, this.updateVisibility);
        if (htmlUtilities.isTabletOrMobileDevice) {
            stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.viewWholePageButtonHide);
        }
    };
    return ViewWholePageButton;
}(pureRenderComponent));
module.exports = ViewWholePageButton;
//# sourceMappingURL=viewwholepagebutton.js.map