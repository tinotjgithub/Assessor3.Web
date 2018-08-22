"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var PanelResizer = require('../../../utility/panelresizer/panelresizer');
var OffPageComments = require('./offpagecomments');
var OffPageCommentListHolder = require('./offpagecommentlistholder');
var colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var enums = require('../../../utility/enums');
var responseStore = require('../../../../stores/response/responsestore');
var userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
var qigStore = require('../../../../stores/qigselector/qigstore');
var markingStore = require('../../../../stores/marking/markingstore');
var classNames = require('classnames');
var OffPageCommentContainer = (function (_super) {
    __extends(OffPageCommentContainer, _super);
    /**
     * @constructor
     */
    function OffPageCommentContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /*
         * get container classname
         */
        this.getContainerClassName = function () {
            var offPageCommentContainerClass = 'offpage-comment-container ';
            if (!_this.props.isVisible) {
                offPageCommentContainerClass += 'hide ';
            }
            return offPageCommentContainerClass;
        };
        /*
         * set panel style
         */
        this.setPanelStyle = function () {
            var offpageCommentHeightInUserOption;
            if (qigStore.instance.getSelectedQIGForTheLoggedInUser) {
                offpageCommentHeightInUserOption = userOptionsHelper.getUserOptionByName(userOptionKeys.OFFPAGE_COMMENT_PANEL_HEIGHT, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            }
            var panelStyle = {};
            if (_this.containerHeight || offpageCommentHeightInUserOption) {
                panelStyle = {
                    height: _this.containerHeight ? _this.containerHeight + 'px' :
                        offpageCommentHeightInUserOption ? offpageCommentHeightInUserOption + 'px' : ''
                };
            }
            return panelStyle;
        };
        /**
         * Called once panel is resized
         * param - height
         * param - pan action type
         */
        this.onPanelResize = function (height, panActionType) {
            if (height && panActionType === enums.PanActionType.Move) {
                _this.containerHeight = height;
                _this.setState({ height: height });
            }
        };
        /**
         * set border color for offpage comment
         */
        this.getAnnotationColor = function () {
            var selectedMarkgroupid = markingStore.instance.currentMarkGroupId;
            var allMarksAndAnnotation = markingStore.instance.allMarksAndAnnotationAgainstResponse(selectedMarkgroupid);
            if (markingStore.instance.currentResponseMode === enums.ResponseMode.closed &&
                allMarksAndAnnotation.length > 0 &&
                allMarksAndAnnotation[0].annotations.length > 0) {
                var annotations = allMarksAndAnnotation[0].annotations;
                _this.annotationColor = 'rgb(' + annotations[0].red + ',' + annotations[0].green + ',' + annotations[0].blue + ')';
            }
            else {
                _this.annotationColor = colouredAnnotationsHelper.createAnnotationStyle(null, enums.DynamicAnnotation.OffPageComment).fill;
            }
            return _this.annotationColor;
        };
        // Set the default state
        this.state = {
            renderedOn: 0
        };
        this.renderOffpageComments = this.renderOffpageComments.bind(this);
        this.getContainerClassName = this.getContainerClassName.bind(this);
        this.setPanelStyle = this.setPanelStyle.bind(this);
        this.onPanelResize = this.onPanelResize.bind(this);
        this.getAnnotationColor = this.getAnnotationColor.bind(this);
    }
    /**
     * Render method
     */
    OffPageCommentContainer.prototype.render = function () {
        return (React.createElement("div", {className: this.getContainerClassName(), id: 'offpage-comment-container', style: this.setPanelStyle()}, React.createElement(PanelResizer, {id: 'panel-resizer', key: 'panel-resizer', resizerType: enums.ResizePanelType.OffPageComment}), React.createElement("div", {className: 'offpage-comment-wrapper'}, this.renderOffpageComments(), this.renderOffPageCommentListHolder())));
    };
    /**
     * componentDidMount
     * @memberof OffPageCommentContainer
     */
    OffPageCommentContainer.prototype.componentDidMount = function () {
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.onPanelResize);
    };
    /**
     * ComponentWillUnMount
     */
    OffPageCommentContainer.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.onPanelResize);
    };
    /**
     * Render OffPageComments.
     * @private
     * @returns
     * @memberof OffPageCommentsContainer
     */
    OffPageCommentContainer.prototype.renderOffpageComments = function () {
        return (React.createElement(OffPageComments, {id: 'offpage-comment-editor-holder', key: 'offpage-comment-editor-holder', annotationColor: this.getAnnotationColor(), selectedLanguage: this.props.selectedLanguage}));
    };
    /**
     * render offpage comment list holder
     */
    OffPageCommentContainer.prototype.renderOffPageCommentListHolder = function () {
        return (React.createElement(OffPageCommentListHolder, {id: 'comment-list-holder', key: 'comment-list-holder', selectedLanguage: this.props.selectedLanguage}));
    };
    return OffPageCommentContainer;
}(pureRenderComponent));
module.exports = OffPageCommentContainer;
//# sourceMappingURL=offpagecommentcontainer.js.map