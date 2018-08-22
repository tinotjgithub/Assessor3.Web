"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var EnhancedOffPageComments = require('./enhancedOffpagecomments');
var enums = require('../../../utility/enums');
var Immutable = require('immutable');
var enhancedOffPageCommentHelper = require('../../../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
var EnhancedOffPageCommentDetailView = require('./enhancedoffpagecommentdetailview');
var markingStore = require('../../../../stores/marking/markingstore');
var enhancedOffPageCommentActionCreator = require('../../../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
var enhancedOffPageCommentStore = require('../../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var responseStore = require('../../../../stores/response/responsestore');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var PanelResizer = require('../../../utility/panelresizer/panelresizer');
var userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
var qigStore = require('../../../../stores/qigselector/qigstore');
var eCourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var ecourseWorkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var localeStore = require('../../../../stores/locale/localestore');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var worklistStore = require('../../../../stores/worklist/workliststore');
var classNames = require('classnames');
var ccHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var examinerStore = require('../../../../stores/markerinformation/examinerstore');
var EnhancedOffPageCommentsContainer = (function (_super) {
    __extends(EnhancedOffPageCommentsContainer, _super);
    /**
     * @constructor
     */
    function EnhancedOffPageCommentsContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isDetailViewEnabled = false;
        this.commentText = '';
        this.isEnhancedOffPageCommentEdited = false;
        this.isPanelOverlapped = false;
        this.itemHeaderElementStyle = {};
        this.fileHeaderElementStyle = {};
        this.isTableHeaderWrapped = false;
        /**
         * Call back function from enhanced off-page comment table on sorting
         */
        this.onSortClick = function (comparerName, sortDirection) {
            _this.sortDirection = sortDirection;
            _this.comparerName = comparerName;
            // update sort details in store
            enhancedOffPageCommentActionCreator.onSortClick({
                markGroupId: responseStore.instance.selectedMarkGroupId,
                comparerName: comparerList[_this.comparerName], sortDirection: _this.sortDirection
            });
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to reRender
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.reRender = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * on Message Deleted
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.onCommentUpdateCompleted = function () {
            _this.isAddButtonClicked = false;
            _this.isEnhancedOffPageCommentEdited = false;
            enhancedOffPageCommentHelper.handleCommentEdit(_this.isEnhancedOffPageCommentEdited);
            _this.isDetailViewEnabled = false;
            _this.updateEnhancedOffPageCommentDetails();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * on Response changed.
         */
        this.onResponseChanged = function () {
            _this.closeEnhancedOffPageCommentEditView();
            _this.comparerName = undefined;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Returns Classname for Enhanced offpage comment container.
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.getContainerClassName = function () {
            var enhancedOffPageCommentContainerClass = 'enhanced offpage-comment-container ';
            if (_this.isDetailViewEnabled) {
                enhancedOffPageCommentContainerClass += 'detail-view ';
            }
            if (!_this.props.isVisible) {
                enhancedOffPageCommentContainerClass += 'hide ';
            }
            if (_this.isPanelOverlapped && _this.props.isStampPanelVisible) {
                enhancedOffPageCommentContainerClass += 'tool-panel-space ';
            }
            if (_this.resizePanelClassName) {
                enhancedOffPageCommentContainerClass += _this.resizePanelClassName;
            }
            return enhancedOffPageCommentContainerClass;
        };
        /**
         * Set style for panel.
         *
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.setPanelStyle = function () {
            var containerHeightInUserOption = userOptionsHelper.getUserOptionByName(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT);
            var stylePanel = {};
            if (_this.resizedPanelHeight || containerHeightInUserOption) {
                stylePanel = {
                    height: _this.resizedPanelHeight ? _this.resizedPanelHeight + '%' :
                        (containerHeightInUserOption) ? containerHeightInUserOption + '%' : ''
                };
            }
            return stylePanel;
        };
        /**
         * on Panel resize.
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.onPanelResize = function (height, className, elementOverlapped, panActionType) {
            if (height && panActionType === enums.PanActionType.Move) {
                _this.resizedPanelHeight = height;
                _this.resizePanelClassName = className;
                _this.isPanelOverlapped = _this.props.hasMultipleToolbarColumn ? elementOverlapped : false;
                _this.setState({ height: height });
            }
        };
        /**
         * Determines to append toolbar space class name.
         */
        this.doAppendToolBarSpace = function () {
            var annotationPanelHolderElement = document.getElementsByClassName('annotation-panel-holder')[0];
            if (annotationPanelHolderElement && _this.enhancedOffpageComment) {
                var annotationPanelHolder = annotationPanelHolderElement.getBoundingClientRect().top;
                var enhancedOffPageContainerBottom = _this.enhancedOffpageComment.getBoundingClientRect().bottom;
                _this.isPanelOverlapped = enhancedOffPageContainerBottom > annotationPanelHolder;
            }
        };
        /**
         * Changes the comment view when the visibility is changed
         * @param isVisible
         */
        this.handleEnhancedOffPageCommentsVisibility = function () {
            if (_this.isDetailViewEnabled) {
                _this.isDetailViewEnabled = false;
                _this.updateEnhancedOffPageCommentDetails();
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Updates the enhanced off page comment details
         * @param isVisible
         */
        this.updateEnhancedOffPageCommentDetails = function () {
            var enhancedOffPageCommentDetailView = {
                clientToken: _this.selectedEnhancedOffPageClientToken,
                comment: _this.commentText,
                fileId: _this.selectedFileId,
                itemId: _this.selectedCommentMarkSchemeId,
                isCommentEdited: _this.isEnhancedOffPageCommentEdited,
                isDetailViewEnabled: _this.isDetailViewEnabled,
                isAddButtonClicked: _this.isAddButtonClicked
            };
            _this.props.updateEnhancedOffPageCommentDetails(enhancedOffPageCommentDetailView);
        };
        /**
         * Updates the enhanced off page comment details when question item or file item is changed
         */
        this.onQuestionOrFileItemChanged = function (selectedId, dropDowntype) {
            if (dropDowntype === enums.DropDownType.EnhancedOffPageCommentQuestionItem) {
                _this.selectedCommentMarkSchemeId = selectedId;
            }
            if (dropDowntype === enums.DropDownType.EnhancedOffPageCommentFile) {
                _this.selectedFileId = selectedId;
            }
            _this.updateEnhancedOffPageCommentDetails();
        };
        /**
         * Set panel resize classname
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.setPanelResizeClassName = function (height, className, elementOverlapped, panActionType) {
            _this.resizePanelClassName = className ? className : '';
            if (_this.resizePanelClassName === '' && panActionType === enums.PanActionType.End) {
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * on animation end
         * @private
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.onAnimationEnd = function () {
            markingActionCreator.reRenderImageOnVisiblityChange();
            _this.doAppendToolBarSpace();
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * On Add Comment Link clicked
         */
        this.onAddCommentLinkClicked = function (event) {
            // pause the media player on clicking the add comment button
            var selectedEcourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
            if (selectedEcourseWorkFiles) {
                if (userOptionsHelper.getUserOptionByName(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED) === 'true') {
                    selectedEcourseWorkFiles.forEach(function (file) {
                        if ((file.linkData.mediaType === enums.MediaType.Audio)
                            || (file.linkData.mediaType === enums.MediaType.Video)) {
                            ecourseWorkResponseActionCreator.pauseMediaPlayer();
                        }
                    });
                }
            }
            _this.isAddButtonClicked = true;
            _this.isDetailViewEnabled = true;
            _this.commentText = '';
            _this.selectedEnhancedOffPageClientToken = '';
            _this.selectedCommentMarkSchemeId = markingStore.instance.currentMarkSchemeId ? markingStore.instance.currentMarkSchemeId : 0;
            _this.selectedFileId = selectedEcourseWorkFiles ? selectedEcourseWorkFiles.first().docPageID : 0;
            htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
            _this.updateEnhancedOffPageCommentDetails();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Reference call back function to get the element reference from the table header element
         */
        this.headerReferenceCallback = function (element, headerText) {
            if (element) {
                if (headerText === localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.item-column-header')) {
                    _this.itemHeaderElement = element;
                }
                else if (headerText === localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.file-column-header')) {
                    _this.fileHeaderElement = element;
                }
            }
        };
        /**
         * Returns background color for container header.
         */
        this.getCommentBackgroundColor = function () {
            var backgroundColor = enhancedOffPageCommentStore.instance.enhancedoffpageCommentHeaderColor;
            return backgroundColor ? backgroundColor.color : null;
        };
        /**
         * Render enhanced offpage container only on qig change.
         */
        this.renderEnhancedOffPageCommentInQigChanges = function (selectedMgid, prevMgid, isResponseViewModeChange) {
            if (isResponseViewModeChange === void 0) { isResponseViewModeChange = false; }
            if (responseStore.instance.isWholeResponse === true && !isResponseViewModeChange) {
                _this.closeEnhancedOffPageCommentEditView();
            }
        };
        /**
         * Reset and close enhanced offpage comment edit view.
         */
        this.closeEnhancedOffPageCommentEditView = function () {
            _this.isAddButtonClicked = false;
            _this.isDetailViewEnabled = false;
            _this.commentText = '';
            _this.selectedCommentMarkSchemeId = 0;
            _this.selectedFileId = 0;
            _this.selectedEnhancedOffPageClientToken = '';
            _this.updateEnhancedOffPageCommentDetails();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This button will handle various enhanced offpage comments button actions
         * In normal use we are using an existing callback function.
         * @private
         * @param {enums.EnhancedOffPageCommentButtonAction} enhancedOffPageCommentButtonAction
         * @memberof EnhancedOffPageCommentsContainer
         */
        this.handleEnhancedOffPageCommentButtonAction = function (enhancedOffPageCommentButtonAction) {
            if (enhancedOffPageCommentButtonAction === enums.EnhancedOffPageCommentAction.Close) {
                // This method will be called on leave response click of response discard popup while navigating to Menu.
                // We are displaying menu as an overlay, if we close that then we've to display the enhanced offpage comments table view
                // instead of detail view
                _this.closeEnhancedOffPageCommentEditView();
            }
        };
        /**
         * Update detail view new panel height.
         */
        this.updateDetailViewPanelNewHeight = function (height) {
            _this.resizedPanelHeight = height;
            _this.setState({ height: height });
        };
        this.isEnhancedOffPageCommentEdited = enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited ?
            enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited : false;
        this.enhancedOffPageComments = Immutable.List();
        this.onCommentClickHandler = this.onCommentClickHandler.bind(this);
        this.onButtonClickHandler = this.onButtonClickHandler.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onAddCommentLinkClicked = this.onAddCommentLinkClicked.bind(this);
        this.renderAddCommentLink = this.renderAddCommentLink.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.selectedCommentMarkSchemeId = 0;
        this.selectedFileId = 0;
        // Set the default states
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Render method
     */
    EnhancedOffPageCommentsContainer.prototype.render = function () {
        // load Enhanced off-page comment data.
        this.loadEnhancedOffPageCommentData();
        return (React.createElement("div", {className: this.getContainerClassName(), id: 'enhanced-off-page-comments-container', style: this.setPanelStyle()}, React.createElement("div", {className: 'comment-flip-holder'}, this.renderAddCommentLink(), this.renderEnhancedOffPageComment()), React.createElement(PanelResizer, {id: 'panel-resizer', key: 'panel-resizer', resizerType: enums.ResizePanelType.EnhancedOffPageComment})));
    };
    /**
     * Render EnhancedOffPageComment Containers.
     * @private
     * @returns
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsContainer.prototype.renderEnhancedOffPageComment = function () {
        var view = this.isDetailViewEnabled ? enums.EnhancedOffPageCommentView.detail : enums.EnhancedOffPageCommentView.grid;
        var currentEnhancedOffpageCommentIndex = enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        switch (view) {
            case enums.EnhancedOffPageCommentView.detail:
                return (React.createElement(EnhancedOffPageCommentDetailView, {id: 'offpage-comments-detail-view', key: 'offpage-comments-detail-key', selectedLanguage: this.props.selectedLanguage, onButtonClick: this.onButtonClickHandler, responseMode: responseStore.instance.selectedResponseMode, commentText: this.commentText, enhancedOffPageCommentClientToken: this.selectedEnhancedOffPageClientToken, textAreaChanged: this.onTextChanged, selectedCommentQuestionId: this.selectedCommentMarkSchemeId === null ? 0 : this.selectedCommentMarkSchemeId, selectedFileId: this.selectedFileId === null ? 0 : this.selectedFileId, onQuestionItemOrFileChanged: this.onQuestionOrFileItemChanged, isAddButtonClicked: this.isAddButtonClicked, selectedCommentIndex: currentEnhancedOffpageCommentIndex, isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode, heightInPercentage: this.updateDetailViewPanelNewHeight, containerElement: this.enhancedOffpageComment}));
            case enums.EnhancedOffPageCommentView.grid:
                return (React.createElement(EnhancedOffPageComments, {id: 'offpage-comments-table', key: 'offpage-comments-table-key', selectedLanguage: this.props.selectedLanguage, enhancedOffPageComments: this.enhancedOffPageComments, tableHeaders: this.tableHeaders, onCommentClick: this.onCommentClickHandler, onSortClick: this.onSortClick, isAddCommentLinkVisible: this.isAddCommentLinkVisible(), headerRefCallBack: this.headerReferenceCallback, style: this.getCommentBackgroundColor(), selectedCommentIndex: currentEnhancedOffpageCommentIndex}));
        }
    };
    /**
     * Render the add comment link
     */
    EnhancedOffPageCommentsContainer.prototype.renderAddCommentLink = function () {
        var fileDummyElement = (this.fileHeaderElementStyle.minWidth) > 0 ? (React.createElement("span", {className: 'dummy-head-text', style: this.fileHeaderElementStyle}, localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.file-column-header'), " ")) : null;
        var addCommentLink = this.isAddCommentLinkVisible() ? (React.createElement("a", {className: 'add-comment-link', title: localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.add-comment'), id: 'addEnhancedOffPageCommentLink', onClick: this.onAddCommentLinkClicked}, localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.add-comment'))) : null;
        var currentRemarkName = !this.isAddCommentLinkVisible() ? (React.createElement("span", {className: 'current-remark-selected'}, enhancedOffPageCommentStore.instance.commentHeaderText, " ")) : null;
        return (this.isDetailViewEnabled ? null :
            (React.createElement("div", {className: 'comment-link-holder', id: 'comment-link-holder'}, React.createElement("div", {className: 'comment-dummy-header small-text'}, React.createElement("span", {className: 'dummy-head-text', style: {}}), "this.itemHeaderElementStyle }} >", localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.item-column-header'), " "), fileDummyElement, React.createElement("span", {className: 'dummy-head-text comment-txt'}, localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.comment-column-header'), " "))
                ,
                    React.createElement("div", {className: 'link-holder'}, addCommentLink, currentRemarkName)));
        div > ;
        ;
    };
    /**
     * on Comment Click Handler.
     */
    EnhancedOffPageCommentsContainer.prototype.onCommentClickHandler = function (enhancedOffPageComment) {
        this.isDetailViewEnabled = true;
        this.isAddButtonClicked = false;
        this.commentText = enhancedOffPageComment.comment;
        this.selectedEnhancedOffPageClientToken = enhancedOffPageComment.clientToken;
        this.selectedCommentMarkSchemeId = enhancedOffPageComment.itemId;
        this.selectedFileId = enhancedOffPageComment.fileId;
        this.linkCommentFiletoLHSPanel();
        this.updateEnhancedOffPageCommentDetails();
        this.setState({
            renderedOn: Date.now()
        });
    };
    /**
     * Link the LHS file to file item of selected Enhanced Off Page Comment
     * @private
     * @returns
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsContainer.prototype.linkCommentFiletoLHSPanel = function () {
        if (this.selectedFileId > 0) {
            //The File of the selected Enhanced Off Page Comment
            var eCourseWorkSelectedCommentFile_1 = enhancedOffPageCommentHelper.getECourseWorkFile(this.selectedFileId);
            //The selected Files from the LHS File Panel
            var eCourseworkLHSPanelFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
            if (eCourseworkLHSPanelFiles) {
                var files = eCourseworkLHSPanelFiles.filter(function (item) { return item.docPageID === eCourseWorkSelectedCommentFile_1.docPageID; });
                if (files && files.size === 0) {
                    eCourseworkResponseActionCreator.eCourseworkFileSelect(eCourseWorkSelectedCommentFile_1, true);
                }
            }
        }
    };
    /**
     * on button click handler.
     * To handle all the button clicks in Enhanced off page comment detail view
     * @param buttonAction To know which button has been clicked
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsContainer.prototype.onButtonClickHandler = function (buttonAction, clientToken) {
        if (buttonAction === enums.EnhancedOffPageCommentAction.Close &&
            enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited === false) {
            this.closeEnhancedOffPageCommentEditView();
        }
        else {
            // The method has to be made common once the implementation of save and edit is implemented
            this.props.onEnhanceOffPageCommentButtonClicked(buttonAction, clientToken);
        }
    };
    /**
     * componentDidMount
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsContainer.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT, this.onCommentUpdateCompleted);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT, this.onResponseChanged);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.onPanelResize);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.setPanelResizeClassName);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.handleEnhancedOffPageCommentsVisibility);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.reRender);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT, this.handleEnhancedOffPageCommentButtonAction);
        this.enhancedOffpageComment = document.getElementById('enhanced-off-page-comments-container');
        if (this.enhancedOffpageComment) {
            this.enhancedOffpageComment.addEventListener('transitionend', this.onAnimationEnd);
        }
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.renderEnhancedOffPageCommentInQigChanges);
        var enhancedOffPageCommentHeightInUserOption = userOptionsHelper.getUserOptionByName(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT);
        // appending toolbar-space class
        if (this.resizedPanelHeight === undefined && enhancedOffPageCommentHeightInUserOption) {
            this.doAppendToolBarSpace();
        }
    };
    /**
     * ComponentDidUpdate.
     */
    EnhancedOffPageCommentsContainer.prototype.componentDidUpdate = function () {
        // Update the item header style minWidth and file header minWidth when the component is updated for the first time
        if (this.itemHeaderElement && (this.itemHeaderElementStyle.minWidth !== this.itemHeaderElement.clientWidth)) {
            this.itemHeaderElementStyle = { minWidth: this.itemHeaderElement.clientWidth };
            this.setState({ renderedOn: Date.now() });
        }
        else if (this.fileHeaderElement && (this.fileHeaderElementStyle.minWidth !== this.fileHeaderElement.clientWidth)) {
            this.fileHeaderElementStyle = { minWidth: this.fileHeaderElement.clientWidth };
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * ComponentWillRecieveProps
     *
     * @param {Props} nextProps
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsContainer.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.hasMultipleToolbarColumn !== nextProps.hasMultipleToolbarColumn) {
            this.doAppendToolBarSpace();
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * ComponentWillUnMount
     */
    EnhancedOffPageCommentsContainer.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT, this.onCommentUpdateCompleted);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            ON_RESPONSE_CHANGED_EVENT, this.onResponseChanged);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.onPanelResize);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.setPanelResizeClassName);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.handleEnhancedOffPageCommentsVisibility);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.reRender);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT, this.handleEnhancedOffPageCommentButtonAction);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.renderEnhancedOffPageCommentInQigChanges);
        if (this.enhancedOffpageComment) {
            this.enhancedOffpageComment.removeEventListener('transitionend', this.onAnimationEnd);
        }
    };
    /**
     * Update local variables
     * @param nxtProps
     */
    EnhancedOffPageCommentsContainer.prototype.componentWillMount = function () {
        if (this.props.enhancedOffPageCommentDetails) {
            this.commentText = this.props.enhancedOffPageCommentDetails.comment;
            this.isDetailViewEnabled = this.props.enhancedOffPageCommentDetails.isDetailViewEnabled;
            this.selectedCommentMarkSchemeId = this.props.enhancedOffPageCommentDetails.itemId;
            this.selectedFileId = this.props.enhancedOffPageCommentDetails.fileId;
            this.selectedEnhancedOffPageClientToken = this.props.enhancedOffPageCommentDetails.clientToken;
            this.isAddButtonClicked = this.props.enhancedOffPageCommentDetails.isAddButtonClicked;
        }
    };
    /**
     * load Enhanced offPage comment data
     *
     * @param {string} comparerName
     * @param {enums.SortDirection} sortDirection
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsContainer.prototype.loadEnhancedOffPageCommentData = function () {
        if (!this.comparerName) {
            var sortDetails = enhancedOffPageCommentStore.instance.markGroupSortDetails(responseStore.instance.selectedMarkGroupId);
            this.comparerName = comparerList[sortDetails.comparerName];
            this.sortDirection = sortDetails.sortDirection;
        }
        // This is to set marking index to set current comments and previous marking comments.
        var index = enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        this.enhancedOffPageComments =
            enhancedOffPageCommentHelper.getEnhancedOffPageComments(this.comparerName, this.sortDirection, index);
        this.tableHeaders = enhancedOffPageCommentHelper.generateTableHeader();
    };
    /**
     * on Text changed.
     */
    EnhancedOffPageCommentsContainer.prototype.onTextChanged = function (content) {
        this.isEnhancedOffPageCommentEdited = true;
        enhancedOffPageCommentHelper.handleCommentEdit(this.isEnhancedOffPageCommentEdited);
        this.commentText = content;
        this.updateEnhancedOffPageCommentDetails();
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * Returns whether add comment link is visible or not
     */
    EnhancedOffPageCommentsContainer.prototype.isAddCommentLinkVisible = function () {
        var updatePendingResponsesWhenSuspendedCCOn = ccHelper.getCharacteristicValue(ccNames.UpdatePendingResponsesWhenSuspended, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        if (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
            !this.isDetailViewEnabled &&
            enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex === 0 &&
            !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup &&
            (markerOperationModeFactory.operationMode.isMarkingMode ||
                markerOperationModeFactory.operationMode.isDefinitveMarkingStarted ||
                markerOperationModeFactory.operationMode.isProvisionalTabInStdSetup) &&
            !worklistStore.instance.isMarkingCheckMode) {
            /* when marker is in suspended status, then the marker should not add/Update offpage comment ,
             * if updatePendingResponsesWhenSuspendedCCOn then  marker can add/ update the offpage comment*/
            if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended
                && responseStore.instance.selectedResponseMode === enums.ResponseMode.pending) {
                return updatePendingResponsesWhenSuspendedCCOn;
            }
            return true;
        }
    };
    return EnhancedOffPageCommentsContainer;
}(pureRenderComponent));
module.exports = EnhancedOffPageCommentsContainer;
//# sourceMappingURL=enhancedoffpagecommentscontainer.js.map