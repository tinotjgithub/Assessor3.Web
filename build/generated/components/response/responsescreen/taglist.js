"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var classNames = require('classnames');
var pureRenderComponent = require('../../base/purerendercomponent');
var Tag = require('./tag');
var tagActionCreator = require('../../../actions/tag/tagactioncreator');
var responseStore = require('../../../stores/response/responsestore');
var worklistStore = require('../../../stores/worklist/workliststore');
var domManager = require('../../../utility/generic/domhelper');
var loginSession = require('../../../app/loginsession');
var TAG_LIST_WIDTH = 90;
var TAG_LIST_HEIGHT = 216;
/**
 * React component for reports
 */
var TagList = (function (_super) {
    __extends(TagList, _super);
    /**
     * Constructor for TagList class
     */
    function TagList(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.xPos = 0;
        this.yPos = 0;
        /**
         * Render the list
         */
        this.renderTagListItems = function () {
            var that = _this;
            var tagList = that.props.tagList;
            var element = tagList && tagList.map(function (tagItem) {
                return (React.createElement("li", {className: 'tag-menu-item', id: that.props.id + '_item_' + tagItem.tagId, key: that.props.id + '_item_' + tagItem.tagId}, React.createElement(Tag, {isSelected: (that.selectedTag === tagItem.tagId), tagType: tagItem.tagId, onSelection: that.onTagSelection, onArrowClick: that.onArrowClick, isInList: true, isFromWorklist: (that.props.markGroupId ? true : false), selectedLanguage: that.props.selectedLanguage, id: that.props.id + '_' + tagItem.tagId, key: that.props.id + '_' + tagItem.tagId})));
            });
            return element;
        };
        /**
         * to hide the tag drop down clicking outside the box.
         */
        this.hideTagList = function (event) {
            if (event.target !== undefined &&
                domManager.searchParentNode(event.target, function (el) { return el.id === 'response_tag'; }) == null) {
                if (_this.state.isExpanded === true) {
                    _this.setState({
                        isExpanded: false
                    });
                }
            }
        };
        /**
         * To change the state of the component on selecting the component.
         */
        this.onTagSelection = function (selectedTag, event) {
            event.stopPropagation();
            // Case 1: this.props.markGroupId : Tag Updated from worklist.
            // Case 2: responseStore.instance.selectedMarkGroupId : Tag Updated  within response.
            var currentMarkGroupId = _this.props.markGroupId ? _this.props.markGroupId : responseStore.instance.selectedMarkGroupId;
            var updateResponseTagArguments = {
                markGroupList: _this.populateMarkGroupList(currentMarkGroupId, _this.props.isESResponse),
                examinerId: loginSession.EXAMINER_ID,
                isDelete: selectedTag === 0 ? true : false,
                tagId: selectedTag,
                isESResponse: _this.props.isESResponse
            };
            // get the updated tag order to update the worklist data with the newly selected tag.
            var tagOrder = _this.props.tagList.filter(function (t) { return t.tagId === selectedTag; })[0].tagOrder;
            tagActionCreator.updateTags(updateResponseTagArguments, tagOrder, currentMarkGroupId, _this.props.markingMode);
        };
        /**
         * event listener for the tag update event
         */
        this.onTagUpdated = function (selectedTag, markGroupId) {
            // Case 1: !this.props.markGroupId : Tag Updated within response.
            // Case 2: this.props.markGroupId === markGroupId : Tag Updated from worklist.
            if (!_this.props.markGroupId || _this.props.markGroupId === markGroupId) {
                _this.selectedTag = selectedTag;
                _this.setState({
                    isExpanded: false
                });
            }
        };
        /**
         * event listener for the tag list click event
         * To hide any open tag list other than selected one.
         */
        this.onTagListClicked = function (selectedMarkGroupId) {
            // Hide all tag list other than one selected now.
            if (_this.props.markGroupId !== selectedMarkGroupId && _this.state.isExpanded === true) {
                _this.setState({
                    isExpanded: false
                });
            }
        };
        // Setting the initial state
        this.state = {
            isExpanded: undefined
        };
        this.onTagSelection = this.onTagSelection.bind(this);
        this.onArrowClick = this.onArrowClick.bind(this);
        this.hideTagList = this.hideTagList.bind(this);
        this.selectedTag = this.props.selectedTagId;
        this.onTagUpdated = this.onTagUpdated.bind(this);
    }
    /**
     * Render component.
     */
    TagList.prototype.render = function () {
        var tagClass;
        return (React.createElement("span", {className: classNames('tag dropdown-wrap', { ' center right': this.isCenterAlignmentRequired === true && this.isRightAlignmentRequired === true }, { ' center left': this.isCenterAlignmentRequired === true && this.isLeftAlignmentRequired === true }, { ' bottom right': this.isRightAlignmentRequired === true && this.isBottomAlignmentRequired === true }, {
            ' bottom left': this.isRightAlignmentRequired === false &&
                this.isBottomAlignmentRequired === true && this.isLeftAlignmentRequired === true
        }, {
            ' top left': this.isRightAlignmentRequired === false
                && this.isLeftAlignmentRequired === true && this.isTopAlignmentRequired === true
        }, { ' top right': this.isRightAlignmentRequired === true && this.isTopAlignmentRequired === true }, { ' close': (this.state.isExpanded === false) }, { ' open': (this.state.isExpanded === true) }), id: 'response_tag'}, React.createElement(Tag, {isSelected: true, tagType: this.selectedTag, onSelection: this.onTagSelection, onArrowClick: this.onArrowClick, isInList: false, isFromWorklist: (this.props.markGroupId ? true : false), selectedLanguage: this.props.selectedLanguage, id: this.props.id + '_selected', key: this.props.id + '_selected'}), React.createElement("div", {className: 'menu-callout'}), React.createElement("ul", {className: 'menu tag-menu', role: 'menu', "aria-hidden": 'true', id: 'tag_list'}, this.renderTagListItems())));
    };
    /**
     * triggers when the tag list component mount.
     */
    TagList.prototype.componentDidMount = function () {
        /** Avoid memory leak warning */
        worklistStore.instance.setMaxListeners(0);
        window.addEventListener('touchend', this.hideTagList);
        window.addEventListener('click', this.hideTagList);
        worklistStore.instance.addListener(worklistStore.WorkListStore.TAG_UPDATED_EVENT, this.onTagUpdated);
        // Event to collapse all tag list except the selected one from worklist 
        worklistStore.instance.addListener(worklistStore.WorkListStore.TAG_LIST_CLICKED, this.onTagListClicked);
    };
    /**
     * triggers while the component receives the props.
     */
    TagList.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.selectedTag !== nextProps.selectedTagId) {
            this.selectedTag = nextProps.selectedTagId;
        }
    };
    /**
     * triggers when the tag list components unmounts
     */
    TagList.prototype.componentWillUnmount = function () {
        window.removeEventListener('touchend', this.hideTagList);
        window.removeEventListener('click', this.hideTagList);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.TAG_UPDATED_EVENT, this.onTagUpdated);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.TAG_LIST_CLICKED, this.onTagListClicked);
    };
    /**
     * On arrow click.
     */
    TagList.prototype.onArrowClick = function (selectedTag, event) {
        // Tag List Position Logic is applicable only in worklist.
        if (this.props.markGroupId) {
            this.getTaglistPosition(event.clientX, event.clientY);
            tagActionCreator.tagListClickAction(this.props.markGroupId);
        }
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };
    /**
     * Check if tag list goes offscreen on right hand side of the window.
     * If taglist widhth  is greater than the space available right to tag indicator then
     * it means that when tag list is rendered it will go offscreen.
     */
    TagList.prototype.isHorizontalAlignmentRequired = function (mouseX, worklistWidth) {
        // if space available right of tag indicator,
        if (TAG_LIST_WIDTH < (window.innerWidth - mouseX)) {
            this.isRightAlignmentRequired = true;
        }
        else {
            if (TAG_LIST_WIDTH < (mouseX - (window.innerWidth - worklistWidth))) {
                this.isLeftAlignmentRequired = true;
            }
        }
    };
    /**
     * Check if tag list goes offscreen on bottom side of the window.
     * If mouse Y position + tag list height is greater than
     * space available bottom from tag indicator then
     * it means that when tag list is rendered it will go offscreen.
     */
    TagList.prototype.isVerticalAlignmentRequired = function (mouseY, worklistHeight) {
        // If space available in the bottom of tag indicator,
        if ((window.innerHeight - mouseY) > TAG_LIST_HEIGHT) {
            this.isTopAlignmentRequired = true;
        }
        else {
            if (mouseY - (window.innerHeight - worklistHeight) > TAG_LIST_HEIGHT) {
                this.isBottomAlignmentRequired = true;
            }
        }
    };
    /**
     * Get tag list expanded position based on window space available.
     * @param xPos: Tag Indicator Xcoord
     * @param yPos: Tag Indicator Y coord
     */
    TagList.prototype.getTaglistPosition = function (xPos, yPos) {
        this.isCenterAlignmentRequired = false;
        this.isLeftAlignmentRequired = false;
        this.isRightAlignmentRequired = false;
        this.isTopAlignmentRequired = false;
        this.isBottomAlignmentRequired = false;
        // Tag indicator Coords.
        this.xPos = xPos;
        this.yPos = yPos;
        // Get the height and width of scroll holder.
        var worklistElement = document.getElementsByClassName('table-scroll-holder')[0].getBoundingClientRect();
        var worklistHeight = worklistElement.height;
        var worklistWidth = worklistElement.width;
        // Determine whether tag list show in Bottom/Top.
        this.isVerticalAlignmentRequired(this.yPos, worklistHeight);
        // Determine whether tag list show in Right/Left.
        this.isHorizontalAlignmentRequired(this.xPos, worklistWidth);
        // If no space available in bottom or Top portion,
        // we should display it in centre position.
        if (this.isBottomAlignmentRequired === false && this.isTopAlignmentRequired === false) {
            this.isCenterAlignmentRequired = true;
        }
    };
    /**
     * Get the markGroupIds for tagging the resposnse.
     * @param currentMarkGroupId
     * @param isESResponse
     */
    TagList.prototype.populateMarkGroupList = function (currentMarkGroupId, isESResponse) {
        var markGroupIds = [];
        // If the response is an es response then whole response tagging is not possible
        // So only pushing the current markGroupID into the collection
        // else we need to add the related markGroupIds for a whole response.
        if (isESResponse) {
            markGroupIds.push(currentMarkGroupId);
        }
        else {
            markGroupIds = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId);
            markGroupIds.unshift(currentMarkGroupId);
        }
        return markGroupIds;
    };
    return TagList;
}(pureRenderComponent));
module.exports = TagList;
//# sourceMappingURL=taglist.js.map