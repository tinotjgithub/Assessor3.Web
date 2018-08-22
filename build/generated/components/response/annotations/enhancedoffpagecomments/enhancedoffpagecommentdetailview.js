"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var enums = require('../../../utility/enums');
var classNames = require('classnames');
var localeStore = require('../../../../stores/locale/localestore');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var Dropdown = require('../../../utility/dropdown');
var markingStore = require('../../../../stores/marking/markingstore');
var sortHelper = require('../../../../utility/sorting/sorthelper');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var enhancedOffPageCommentHelper = require('../../../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
var configurableCharacteristicsValues = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var responseStore = require('../../../../stores/response/responsestore');
var worklistStore = require('../../../../stores/worklist/workliststore');
var constants = require('../../../utility/constants');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
var exceptionStore = require('../../../../stores/exception/exceptionstore');
var messageStore = require('../../../../stores/message/messagestore');
var examinerStore = require('../../../../stores/markerinformation/examinerstore');
var ccHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var qigStore = require('../../../../stores/qigselector/qigstore');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * enhanced OffPageComments Detail View
 * @param props
 */
// tslint:disable-next-line:variable-name
var EnhancedOffPageCommentsDetailView = (function (_super) {
    __extends(EnhancedOffPageCommentsDetailView, _super);
    /**
     * @constructor
     */
    function EnhancedOffPageCommentsDetailView(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.questionItemsList = new Array();
        this.ecourseworkFileItemsList = new Array();
        this._boundHandleOnClick = null;
        /**
         * Gets cancel or close button texts.
         * @returns {string}
         */
        this.getCancelOrCloseButtonText = function () {
            return _this.isReadOnly ?
                localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.close-button') :
                localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.cancel-button');
        };
        /**
         * render Delete button
         * @returns
         */
        this.renderDeleteButton = function () {
            return (!_this.isReadOnly
                && !_this.props.isAddButtonClicked) ?
                (React.createElement("button", {id: 'deleteCommentRow', className: 'rounded', onClick: function () {
                    _this.props.onButtonClick(enums.EnhancedOffPageCommentAction.Delete, _this.props.enhancedOffPageCommentClientToken);
                }}, localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.delete-button'))) : null;
        };
        /**
         * render save button
         * @returns
         */
        this.renderSaveButton = function () {
            return !_this.isReadOnly ?
                (React.createElement("button", {id: 'saveCommentRow', className: classNames('rounded primary', { 'disabled': !_this.isSaveButtonEnabled() }), disabled: !_this.isSaveButtonEnabled(), onClick: function () {
                    _this.props.onButtonClick(enums.EnhancedOffPageCommentAction.Save, _this.props.enhancedOffPageCommentClientToken);
                }}, localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.save-button'))) : null;
        };
        /**
         * Render cancel or close buttons.
         * @returns
         */
        this.renderCancelOrCloseButton = function () {
            var buttonText = _this.getCancelOrCloseButtonText();
            return (React.createElement("button", {id: buttonText + 'CommmentDetailView', onClick: function () { _this.props.onButtonClick(enums.EnhancedOffPageCommentAction.Close); }, className: classNames('rounded', { 'primary': _this.isReadOnly })}, buttonText));
        };
        /**
         * On Text area is focused
         */
        this.onTextAreaFocus = function (event) {
            // Moving the cursor point to last(due to IE and ipad issue).
            // Setting the selection range to the last postion so that the cursor will be focused there
            if (htmlUtilities.isIE || htmlUtilities.isIE11 || htmlUtilities.isIPadDevice) {
                var length_1 = event.target.value.length;
                event.target.setSelectionRange(length_1, length_1);
            }
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EnhancedOffPageComments);
        };
        /**
         * On Text changed
         * @param event
         */
        this.onTextChanged = function (event) {
            // If any of the dropdown is open while changing the text we have to close the dropdown
            _this.isFileDropDownOpen = undefined;
            _this.isItemDropDownOpen = undefined;
            _this.props.textAreaChanged(event.target.value);
        };
        /**
         * On Dropdown clicked
         */
        this.onDropDownClicked = function (dropDown, width) {
            _this.isSelectedItemClicked = true;
            if (width) {
                _this.dropDownStyle = { minWidth: width };
            }
            _this.selectedDropDown = dropDown;
            if (dropDown === enums.DropDownType.EnhancedOffPageCommentQuestionItem) {
                _this.isFileDropDownOpen = undefined;
                _this.isItemDropDownOpen = _this.isItemDropDownOpen === undefined ? true : !_this.isItemDropDownOpen;
            }
            else if (dropDown === enums.DropDownType.EnhancedOffPageCommentFile) {
                _this.isItemDropDownOpen = undefined;
                _this.isFileDropDownOpen = _this.isFileDropDownOpen === undefined ? true : !_this.isFileDropDownOpen;
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * On Question Item Selected
         */
        this.onQuestionItemSelected = function (selectedId) {
            _this.props.onQuestionItemOrFileChanged(selectedId, _this.selectedDropDown);
            if (_this.selectedDropDown === enums.DropDownType.EnhancedOffPageCommentQuestionItem) {
                _this.selectedQuestionItem = _this.questionItemsList.filter(function (item) {
                    return item.id === selectedId;
                })[0].name;
            }
            else if (_this.selectedDropDown === enums.DropDownType.EnhancedOffPageCommentFile) {
                _this.selectedFile = _this.ecourseworkFileItemsList.filter(function (item) {
                    return item.id === selectedId;
                })[0].name;
            }
            enhancedOffPageCommentHelper.handleCommentEdit(true);
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Get the question items list
         */
        this.getDropDownItemsList = function () {
            if (_this.questionItemsList.length === 0) {
                var item = {
                    id: 0,
                    sequenceNo: 0,
                    name: constants.DEFAULT_QUESTION_OR_FILE_ITEM
                };
                _this.questionItemsList.push(item);
                var markSchemes_1 = markingStore.instance.getMarkSchemes;
                if (markSchemes_1) {
                    markSchemes_1.forEach(function (value) {
                        if (value.markGroupId === markingStore.instance.selectedQIGMarkGroupId) {
                            var item_1 = {
                                id: markSchemes_1.keyOf(value),
                                sequenceNo: value.sequenceNo,
                                name: value.markSchemeText
                            };
                            _this.questionItemsList.push(item_1);
                        }
                    });
                    sortHelper.sort(_this.questionItemsList, comparerList.MarkSchemeComparer);
                    _this.selectedQuestionItem = _this.questionItemsList.filter(function (item) {
                        return item.id === _this.props.selectedCommentQuestionId;
                    })[0].name;
                }
                if (configurableCharacteristicsValues.isECourseworkComponent && _this.ecourseworkFileItemsList.length === 0) {
                    var item_2 = {
                        id: 0,
                        sequenceNo: 0,
                        name: constants.DEFAULT_QUESTION_OR_FILE_ITEM
                    };
                    _this.ecourseworkFileItemsList.push(item_2);
                    var isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
                    var responseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
                    var ecourseworkFiles = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstMarkGroupId(isStandardisationSetupMode ? responseDetails.esMarkGroupId : responseDetails.markGroupId);
                    if (ecourseworkFiles) {
                        ecourseworkFiles.forEach(function (file) {
                            var item = {
                                id: file.docPageID,
                                sequenceNo: file.docPageID,
                                name: file.title
                            };
                            _this.ecourseworkFileItemsList.push(item);
                        });
                        _this.selectedFile = _this.ecourseworkFileItemsList.filter(function (item) {
                            return item.id === _this.props.selectedFileId;
                        })[0].name;
                    }
                }
            }
        };
        /**
         * Handle click events on the window and collapse dropdowns
         * @param {any} source - The source element
         */
        this.handleOnClick = function (e) {
            if (!_this.isSelectedItemClicked && ((_this.isItemDropDownOpen !== undefined && _this.isItemDropDownOpen)
                || (_this.isFileDropDownOpen !== undefined && _this.isFileDropDownOpen))) {
                // collapse the dropdown
                _this.isFileDropDownOpen = undefined;
                _this.isItemDropDownOpen = undefined;
                _this.setState({ renderedOn: Date.now() });
            }
            else {
                _this.isSelectedItemClicked = false;
            }
            //Fix for defect 54305: Blocked the window event which is fired while clicking message editor
            // When the buttons are clicked we dont need to set focus on the text area
            if (e.target !== window && _this.refs.enhancedOffPageCommentsDetailView.contains(e.target) &&
                !_this.refs.enhancedOffPageCommentsButtonContainer.contains(e.target)) {
                // If the click is inside the enhanced off page container. set focus to the editor
                htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
            }
        };
        /**
         * Save button has to be disabled when there is no comment entered
         */
        this.isSaveButtonEnabled = function () {
            if (_this.props.commentText === '' && _this.props.isAddButtonClicked) {
                return false;
            }
            else {
                return true;
            }
        };
        /**
         * onTransitionEnd
         *
         * @private
         * @memberof EnhancedOffPageCommentsDetailView
         */
        this.onTransitionEnd = function (event) {
            if (event.target && event.target.id === 'enhanced-off-page-comments-container'
                && !(exceptionStore.instance.isExceptionPanelVisible || messageStore.instance.isMessagePanelVisible)) {
                var containerHeight = _this.props.containerElement.getBoundingClientRect().height;
                if (containerHeight <= constants.ENHANCED_OFFPAGE_COMMENT_DETAIL_VIEW_MIN_HEIGHT) {
                    var marksheetInner = htmlUtilities.getBoundingClientRect('markSheetContainerInner', true).height;
                    var heightInPercentage = annotationHelper.pixelsToPercentConversion(containerHeight, marksheetInner);
                    userOptionsHelper.save(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT, heightInPercentage.toString(), true);
                    _this.props.heightInPercentage(heightInPercentage);
                }
            }
        };
        this.getDropDownItemsList();
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);
        this.onDropDownClicked = this.onDropDownClicked.bind(this);
        // Set the default states
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Render method
     */
    EnhancedOffPageCommentsDetailView.prototype.render = function () {
        var renderButtonHolder = (React.createElement("div", {className: 'comment-button-holder', ref: 'enhancedOffPageCommentsButtonContainer'}, this.renderDeleteButton(), this.renderCancelOrCloseButton(), this.renderSaveButton()));
        var renderCommentEditor = (React.createElement("div", {className: 'comment-detail-content'}, React.createElement("div", {className: 'offpage-comment-editor-holder'}, this.isReadOnly ?
            React.createElement("div", {id: 'enhancedOffpageCommentEditor', className: 'offpage-comment-editor'}, this.props.commentText)
            :
                React.createElement("textarea", {id: 'enhancedOffpageCommentEditor', className: 'offpage-comment-editor', placeholder: localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.comment-text-placeholder'), value: this.props.commentText, onFocus: this.onTextAreaFocus, onBlur: this.onTextAreaBlur, onChange: this.onTextChanged, maxLength: constants.ENHANCED_OFFPAGE_COMMENT_MAXIMUM_LENGTH}))));
        var renderItemDropDown = this.isReadOnly ?
            (React.createElement("div", {className: 'comment-item-dropdown', id: 'enhancedOffPageComment_questionItem'}, React.createElement("span", {title: localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.question-item-dropdown-tooltip')
                + this.selectedQuestionItem, className: 'dropdown-text'}, React.createElement("span", null, this.selectedQuestionItem)))) : (React.createElement(Dropdown, {dropDownType: enums.DropDownType.EnhancedOffPageCommentQuestionItem, id: 'select_enhancedOffPageComment_questionItem', style: this.dropDownStyle, className: 'dropdown-wrap comment-item-dropdown', selectedItem: this.selectedQuestionItem, isOpen: this.isItemDropDownOpen, items: this.questionItemsList, onClick: this.onDropDownClicked, onSelect: this.onQuestionItemSelected, title: localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.question-item-dropdown-tooltip')
            + this.selectedQuestionItem}));
        var renderFileDropDown = configurableCharacteristicsValues.isECourseworkComponent ?
            (this.isReadOnly ?
                (React.createElement("div", {className: 'comment-file-dropdown', id: 'enhancedOffPageComment_file'}, React.createElement("span", {title: localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.question-item-dropdown-tooltip')
                    + this.selectedFile, className: 'dropdown-text'}, React.createElement("span", null, this.selectedFile)))) : (React.createElement(Dropdown, {dropDownType: enums.DropDownType.EnhancedOffPageCommentFile, id: 'select_enhancedOffPageComment_file', style: this.dropDownStyle, className: 'dropdown-wrap comment-file-dropdown', selectedItem: this.selectedFile, isOpen: this.isFileDropDownOpen, items: this.ecourseworkFileItemsList, onClick: this.onDropDownClicked, onSelect: this.onQuestionItemSelected, title: localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.file-dropdown-tooltip')
                + this.selectedFile}))) : null;
        return (React.createElement("div", {className: 'comment-detail-wrapper', ref: 'enhancedOffPageCommentsDetailView'}, React.createElement("div", {className: 'comment-detail-header clearfix'}, React.createElement("div", {className: 'comment-menu-holder'}, renderItemDropDown, renderFileDropDown), renderButtonHolder), renderCommentEditor));
    };
    /**
     * componentDidMount
     * @memberof EnhancedOffPageCommentsContainer
     */
    EnhancedOffPageCommentsDetailView.prototype.componentDidMount = function () {
        window.addEventListener('click', this._boundHandleOnClick);
        // Set the focus on enhanced off page text area when detail view is enabled
        if (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
            htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
        }
        if (this.props.containerElement) {
            this.props.containerElement.addEventListener('transitionend', this.onTransitionEnd);
            this.props.containerElement.addEventListener('webkitTransitionEnd', this.onTransitionEnd);
        }
    };
    /**
     * ComponentWillUnMount
     */
    EnhancedOffPageCommentsDetailView.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._boundHandleOnClick);
        if (this.props.containerElement) {
            this.props.containerElement.removeEventListener('transitionend', this.onTransitionEnd);
            this.props.containerElement.removeEventListener('webkitTransitionEnd', this.onTransitionEnd);
        }
    };
    /**
     * On text area blur
     */
    EnhancedOffPageCommentsDetailView.prototype.onTextAreaBlur = function () {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.EnhancedOffPageComments);
    };
    Object.defineProperty(EnhancedOffPageCommentsDetailView.prototype, "isReadOnly", {
        /**
         * Returns true comment is read only else return false.
         * @private
         * @memberof EnhancedOffPageCommentsDetailView
         */
        get: function () {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            var updatePendingResponsesWhenSuspendedCCOn = ccHelper.getCharacteristicValue(ccNames.UpdatePendingResponsesWhenSuspended, markSchemeGroupId).toLowerCase() === 'true';
            return this.props.responseMode === enums.ResponseMode.closed || this.props.selectedCommentIndex !== 0 ||
                this.props.isTeamManagementMode || (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                !markerOperationModeFactory.operationMode.isDefinitveMarkingStarted) ||
                worklistStore.instance.isMarkingCheckMode ||
                (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended &&
                    this.props.responseMode === enums.ResponseMode.pending &&
                    !updatePendingResponsesWhenSuspendedCCOn);
        },
        enumerable: true,
        configurable: true
    });
    return EnhancedOffPageCommentsDetailView;
}(pureRenderComponent));
module.exports = EnhancedOffPageCommentsDetailView;
//# sourceMappingURL=enhancedoffpagecommentdetailview.js.map