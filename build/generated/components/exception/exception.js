"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ExceptionBase = require('./exceptionbase');
var exceptionStore = require('../../stores/exception/exceptionstore');
var DropDownException = require('./dropdownexception');
var qigStore = require('../../stores/qigselector/qigstore');
var markingStore = require('../../stores/marking/markingstore');
var exceptionactionCreator = require('../../actions/exception/exceptionactioncreator');
var ExceptionTypeInfo = require('./exceptiontypeinfo');
var ExceptionCommentHistory = require('./exceptioncommenthistory');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var enums = require('../utility/enums');
var scriptHelper = require('../../utility/script/scripthelper');
var localeStore = require('../../stores/locale/localestore');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var exceptionHelper = require('../utility/exception/exceptionhelper');
var popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
var responseStore = require('../../stores/response/responsestore');
var constants = require('../utility/constants');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var deviceHelper = require('../../utility/touch/devicehelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var navigationHelper = require('../utility/navigation/navigationhelper');
var worklistStore = require('../../stores/worklist/workliststore');
var eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
var Exception = (function (_super) {
    __extends(Exception, _super);
    /**
     * Constructor Exception
     * @param props
     * @param state
     */
    function Exception(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // indicates whether the exeptiontype information is visible
        this.exceptionTypeInfoClose = false;
        // indicates whether the exeption action is available
        this.isExceptionActionAvailable = false;
        //Exception type id of exception file access error
        this.selectedExceptionTypeId = 25;
        //MarkSchemeGroupName of Qig in Whole Response
        this._markSchemeGroupName = null;
        //MarkSchemeGroupid of Qig in Whole Response
        this._markSchemeGroupId = undefined;
        //MarkGroupid of Qig in Whole Response
        this._markGroupId = undefined;
        //ExaminerRoleId of Examiner in Qig in Whole Response
        this._examinerRoleId = undefined;
        /**
         * Get the exception details
         */
        this.getExceptionData = function () {
            //TODO -- Use the method in store to get selectedAudioVideo files
            var selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
            var selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter(function (x) {
                return (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio);
            }).first() : undefined;
            var filename = selectedFile.title;
            var currentlySelectedExceptionType = _this.getExceptionTypeDetails(_this.selectedExceptionTypeId.toString());
            _this.setState({
                selectedExceptionTypeId: _this.selectedExceptionTypeId,
                exceptionComment: filename + '\n\n' + _this.props.exceptionBody.replace(/<br\/>/g, ''),
                isSubmitButtonDisabled: (currentlySelectedExceptionType) ? false : true
            });
        };
        this.closeExceptionPanel = function () {
            // Inorder to exclude the 'open' or 'class' from the exception type div.
            if (_this.state.selectedExceptionTypeId === undefined && _this.state.exceptionComment === '') {
                _this.setState({
                    isExceptionTypeMenuSelected: false
                });
            }
            _this.props.closeExceptionPanel();
        };
        /**
         * Reset the scroll position for exception type list
         */
        this.resetScroll = function () {
            var exceptionTypeInfo = document.getElementsByClassName('exception-type-menu-item menu-item panel open')[0];
            if (exceptionTypeInfo) {
                $('#exceptionMenu').animate({ scrollTop: exceptionTypeInfo.offsetTop }, 1000);
            }
        };
        /**
         * Render the exception comment box.
         * @param- event
         */
        this.commentChanged = function (event) {
            var exceptionComment = event.target.value;
            _this.setState({
                isSubmitButtonDisabled: _this.isValidException(true, exceptionComment, _this.state.selectedExceptionTypeId),
                exceptionComment: exceptionComment
            });
            _this.props.validateException(_this.isValidException(false, exceptionComment, _this.state.selectedExceptionTypeId));
        };
        /**
         * This method will validate whether or not the Exception Panel is edited
         * @param- isSubmitButton
         * @param- exceptionComment
         * @param- exceptionTypeid
         */
        this.isValidException = function (isSubmitButton, exceptionComment, exceptionTypeId) {
            if (isSubmitButton) {
                return !(exceptionComment.trim().length > 0 && exceptionTypeId !== undefined);
            }
            else {
                return !(exceptionComment.trim().length > 0 || exceptionTypeId !== undefined);
            }
        };
        /**
         * Select changeRelatesto Items.
         * @param- uniqueId
         */
        this.changeRelatesTo = function (uniqueId) {
            var exceptionComment = _this.state.exceptionComment;
            _this.setState({
                selectedRelatesTo: uniqueId,
                selectedExceptionTypeId: undefined,
                isSubmitButtonDisabled: _this.isValidException(true, exceptionComment, undefined),
            });
        };
        /**
         * Save exception Callback.
         * @param- res
         */
        this.raiseException = function (response) {
            _this.props.closeExceptionPanel(response.success, response.createExceptionReturnErrorCode);
        };
        /**
         * Method fired to close the exception panel.
         */
        this.onExceptionPanelClose = function () {
            _this.resetExceptionPanel();
        };
        /**
         * Method fired to reset the exception panel.
         */
        this.resetExceptionPanel = function () {
            _this._questionId = undefined;
            _this._markSchemeGroupId = undefined;
            if (exceptionStore.instance.exceptionViewAction === enums.ExceptionViewAction.Open) {
                _this._markSchemeGroupId = (_this.props.hasUnManagedSLAO
                    || _this.props.hasUnmanagedImageZone) ? qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                    : markingStore.instance.selectedQIGMarkSchemeGroupId;
                _this._markSchemeGroupName = responseStore.instance.isWholeResponse ? qigStore.instance.
                    getMarkSchemeGroupName(_this._markSchemeGroupId) : null;
                _this._markGroupId = markingStore.instance.getMarkGroupIdQIGtoRIGMap(_this._markSchemeGroupId);
                if (_this.props.hasUnManagedSLAO || _this.props.hasUnmanagedImageZone) {
                    _this._examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
                }
                else {
                    _this._examinerRoleId = markingStore.instance.selectedQIGExaminerRoleId;
                }
            }
            _this.setState({
                selectedExceptionTypeId: undefined,
                showExceptionTypeclassName: 'close',
                isSubmitButtonDisabled: true,
                selectedRelatesTo: undefined,
                exceptionComment: '',
                renderedOn: Date.now(),
                selectedExceptionDescriptionId: 0,
                isExceptionTypeMenuSelected: false
            });
            if (_this.props.isFromMediaErrorDialog) {
                _this.getExceptionData();
            }
            if (_this.props.isNewException && _this.refs.commentTextBox !== undefined && !deviceHelper.isTouchDevice()) {
                _this.refs.commentTextBox.focus();
            }
        };
        /**
         * This method is handling the letious popup events.
         */
        this.onPopUpDisplayEvent = function (popUpType, popUpActionType) {
            switch (popUpType) {
                case enums.PopUpType.DiscardException:
                case enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick:
                case enums.PopUpType.DiscardOnNewExceptionButtonClick:
                    if (popUpActionType === enums.PopUpActionType.Yes) {
                        _this.resetExceptionPanel();
                    }
                    break;
                case enums.PopUpType.CloseException:
                    if (popUpActionType === enums.PopUpActionType.Yes) {
                        _this.closeException();
                    }
                    break;
            }
        };
        /**
         * handle exception actions such as Escalate, Resolve, Close
         */
        this.onActionException = function (exceptionActionType) {
            if (exceptionActionType === enums.ExceptionActionType.Close) {
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.CloseException, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                    popupContent: localeStore.instance.TranslateText('marking.response.close-exception-dialog.body')
                });
            }
            else {
                exceptionactionCreator.doVisibleExceptionActionPopup(true, exceptionActionType);
            }
        };
        // Set the default states
        this.state = {
            renderedOn: 0,
            showExceptionTypeclassName: 'close',
            isSubmitButtonDisabled: true,
            exceptionComment: '',
            isExceptionTypeMenuSelected: false
        };
        this.commentChanged = this.commentChanged.bind(this);
        this.saveException = this.saveException.bind(this);
        this.showExceptionType = this.showExceptionType.bind(this);
        this.selectExceptionType = this.selectExceptionType.bind(this);
        this.showExceptionDescription = this.showExceptionDescription.bind(this);
        this.closeExceptionPanel = this.closeExceptionPanel.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.resetScroll = this.resetScroll.bind(this);
        this.onActionException = this.onActionException.bind(this);
        this.resetExceptionPanel = this.resetExceptionPanel.bind(this);
    }
    /**
     * Component did  mount
     */
    Exception.prototype.componentDidMount = function () {
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionPanelClose);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.resetExceptionPanel);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.raiseException);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.closeExceptionPanel);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION, this.resetScroll);
    };
    /**
     * Componet will unmount
     */
    Exception.prototype.componentWillUnmount = function () {
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionPanelClose);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        if (exceptionStore.instance.exceptionViewAction !== enums.ExceptionViewAction.None) {
            exceptionactionCreator.exceptionWindowAction(enums.ExceptionViewAction.None);
        }
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.resetExceptionPanel);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.raiseException);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.closeExceptionPanel);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_TYPE_SCROLL_RESET_ACTION, this.resetScroll);
    };
    /**
     * Component did update
     */
    Exception.prototype.componentDidUpdate = function () {
        //when exception is raised from error dialog, then the Entire Response radio button should be selected by default
        //so setting selectedRelatesTo to 0
        if (this.props.isFromMediaErrorDialog && this.state.selectedRelatesTo === undefined) {
            this.setState({
                selectedRelatesTo: 0
            });
        }
    };
    /**
     * Render method
     */
    Exception.prototype.render = function () {
        var panelContent;
        if (this.props.exceptionData && this.props.exceptionData !== null
            && !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            panelContent = this.exceptionPanelContent();
        }
        return (React.createElement("div", {id: 'responseExceptionContainer', className: 'response-message response-exception-container'}, this.renderExceptionHeader(), React.createElement("div", {className: 'messaging-content'}, panelContent)));
    };
    /**
     * Render Exception Header.
     */
    Exception.prototype.renderExceptionHeader = function () {
        var headerDetails;
        if (this.props.isNewException || !this.props.isExceptionPanelVisible) {
            headerDetails = (React.createElement("h3", {id: 'popup2TitleException', className: 'shift-left comp-msg-title'}, localeStore.instance.TranslateText('marking.response.exception-list-panel.raise-new-exception')));
        }
        else {
            headerDetails = (React.createElement("h3", {id: 'popup2TitleException', className: 'shift-left comp-msg-title'}, React.createElement("span", {className: 'exceptionid-label'}, localeStore.instance.TranslateText('marking.response.view-exception-panel.header')), React.createElement("span", {className: 'exceptionid-colon'}, ": "), React.createElement("span", {className: 'exception-id'}, constants.EXCEPTION_ID_PREFIX + this.props.exceptionDetails.uniqueId)));
        }
        return (React.createElement("div", {className: 'response-msg-header clearfix'}, headerDetails, this.props.isNewException || !this.props.isExceptionPanelVisible ?
            (React.createElement("div", {id: 'exception_submit_btn', className: 'shift-left comp-msg-butons'}, React.createElement("button", {id: 'submit_exception', className: 'button primary rounded', title: localeStore.instance.TranslateText('marking.response.raise-exception-panel.submit-button'), onClick: this.saveException, disabled: this.state.isSubmitButtonDisabled}, localeStore.instance.TranslateText('marking.response.raise-exception-panel.submit-button')))) : null, teamManagementStore.instance.isRedirectFromException && this.props.isExceptionPanelVisible ?
            (React.createElement("button", {id: 'back_to_exception_btn', className: 'rounded back-exception-btn light', title: localeStore.instance.TranslateText('generic.response.exception-panel.back-to-exceptions'), onClick: this.navigatetoExceptionList}, localeStore.instance.TranslateText('generic.response.exception-panel.back-to-exceptions'))) : null, React.createElement("div", {className: 'shift-right minimize-message'}, React.createElement("a", {className: 'minimize-message-link', title: localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip'), onClick: this.onMinimize}, React.createElement("span", {className: 'minimize-icon lite'}, "Minimize")), React.createElement("a", {className: 'maximize-message-link', title: localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip'), onClick: this.onMaximize}, React.createElement("span", {className: 'maxmize-icon lite'})), !teamManagementStore.instance.isRedirectFromException ?
            React.createElement("a", {className: 'close-message-link', title: localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip'), onClick: this.closeExceptionPanel}, React.createElement("span", {className: 'close-icon lite'}, "Close")) : null)));
    };
    /**
     * Render Exception Content.
     */
    Exception.prototype.exceptionPanelContent = function () {
        var exceptionRelateWrap = (this.props.hasUnManagedSLAO || this.props.hasUnmanagedImageZone)
            ? null :
            (React.createElement("div", {id: 'exceptionRelateWrap', className: 'exception-relate-wrap'}, React.createElement("div", {className: 'dim-text exception-relate-label'}, localeStore.instance.TranslateText('marking.response.raise-exception-panel.exception-relates-to-label'), " "), this.renderExceptionRelatesTo()));
        if (this.props.isNewException || !this.props.isExceptionPanelVisible) {
            var newExceptionSubTitle = (this.props.hasUnManagedSLAO || this.props.hasUnmanagedImageZone)
                ? localeStore.instance.TranslateText('marking.response.raise-exception-panel.new-exception-subtitle-has-unmanagedslao')
                : localeStore.instance.TranslateText('marking.response.raise-exception-panel.exception-type-label');
            return (React.createElement("div", {className: 'exception-wrapper'}, exceptionRelateWrap, React.createElement("div", {className: 'exception-type-menu-wrap clearfix'}, React.createElement("div", {className: 'exception-reason-label dim-text'}, newExceptionSubTitle), this.renderExceptionTypes()), this.renderExceptionMessage()));
        }
        else {
            this.isExceptionActionAvailable = markerOperationModeFactory.operationMode.isTeamManagementMode &&
                this.props.exceptionDetails.currentStatus === enums.ExceptionStatus.Open &&
                examinerStore.instance.getMarkerInformation.examinerId === this.props.exceptionDetails.ownerExaminerId;
            return (React.createElement("div", {className: 'exception-wrapper'}, React.createElement("div", {className: 'exception-detail-wrapper'}, React.createElement(ExceptionTypeInfo, {id: 'exception-info', key: 'exception-info', selectedLanguage: this.props.selectedLanguage, exceptionTypeId: this.props.exceptionDetails.exceptionType, status: this.props.exceptionDetails.currentStatus, markSchemeId: this.props.exceptionDetails.markSchemeID, onActionException: this.onActionException, isExceptionActionAvailable: this.isExceptionActionAvailable, alternativeEscalationPoint: this.props.exceptionDetails.alternativeEscalationPoint, isPE: qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer, questionName: this.props.exceptionDetails.markSchemeID === 0 ?
                (responseStore.instance.isWholeResponse ?
                    qigStore.instance.getMarkSchemeGroupName(this.props.exceptionDetails.markSchemeGroupID)
                    : 'Entire response') : markingStore.instance.toolTip(this.props.exceptionDetails.markSchemeID)}), this.renderExceptionCommentHistory())));
        }
    };
    /**
     * Render Exception Types.
     */
    Exception.prototype.renderExceptionTypes = function () {
        var _this = this;
        var dropdownclassName = 'dropdown-wrap exception-type option-menu-wrap shift-left ' +
            (this.state.isExceptionTypeMenuSelected ? this.state.showExceptionTypeclassName : '');
        var exceptionTypeDescription = '';
        var isDisabled = false;
        var exceptionTypes = exceptionHelper.sortExceptionTypes(exceptionStore.instance.getExceptionTypes);
        var blockerDescription;
        if (this.props.hasUnManagedSLAO) {
            // for SLAO unmanaged scenario, expection type related to the Selected QIG should be displayed.
            this._markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        }
        else if (this.props.currentQuestionItemInfo &&
            this.props.currentQuestionItemInfo.markSchemeGroupId &&
            this._markSchemeGroupId === undefined) {
            this._markSchemeGroupId = this.props.currentQuestionItemInfo.markSchemeGroupId;
        }
        var toRender = exceptionTypes.map(function (exceptionType, index) {
            if (exceptionType.markSchemeGroupId === _this._markSchemeGroupId) {
                exceptionTypeDescription = '';
                isDisabled = false;
                // Disable already raised exception.
                if (_this.props.exceptionData) {
                    _this.props.exceptionData.map(function (data, index) {
                        if (_this.state.selectedRelatesTo === 0) {
                            if (data.markSchemeID === 0 && exceptionType.exceptionType === data.exceptionType
                                && data.currentStatus !== enums.ExceptionStatus.Closed &&
                                data.markSchemeGroupID === exceptionType.markSchemeGroupId) {
                                exceptionTypeDescription = localeStore.instance.TranslateText('marking.response.raise-exception-panel.open-exception-exists-against-response');
                                isDisabled = true;
                            }
                        }
                        else {
                            if (data.markSchemeID === 0 && exceptionType.exceptionType === data.exceptionType
                                && data.currentStatus !== enums.ExceptionStatus.Closed && (data.markSchemeGroupID === exceptionType.markSchemeGroupId
                                || _this.props.hasUnManagedSLAO || _this.props.hasUnmanagedImageZone)) {
                                exceptionTypeDescription = localeStore.instance.TranslateText('marking.response.raise-exception-panel.open-exception-exists-against-response');
                                isDisabled = true;
                            }
                            else if (data.markSchemeID === _this._questionId
                                && exceptionType.exceptionType === data.exceptionType
                                && data.currentStatus !== enums.ExceptionStatus.Closed) {
                                exceptionTypeDescription = localeStore.instance.TranslateText('marking.response.raise-exception-panel.open-exception-exists-against-question');
                                isDisabled = true;
                            }
                        }
                    });
                }
                blockerDescription = exceptionHelper.getExceptionDescription(exceptionType, exceptionStore.instance.isExceptionBlocker(exceptionType.exceptionType));
                return React.createElement(DropDownException, {id: exceptionType.exceptionType, key: exceptionType.exceptionType.toString(), isOpen: parseInt(_this.state.selectedExceptionDescriptionId) === exceptionType.exceptionType, isChecked: parseInt(_this.state.selectedExceptionTypeId) === exceptionType.exceptionType, onClick: _this.selectExceptionType, showExceptionDesc: _this.showExceptionDescription, isDisabled: isDisabled, description: exceptionTypeDescription, blockerDescription: blockerDescription});
            }
        });
        var dropdownText = '';
        var selectedExceptionType = this.getExceptionTypeDetails(this.state.selectedExceptionTypeId);
        if (selectedExceptionType === null) {
            dropdownText = localeStore.instance.TranslateText('marking.response.raise-exception-panel.select-exception-type-placeholder');
        }
        else {
            dropdownText = localeStore.instance.TranslateText('generic.exception-types.' +
                selectedExceptionType.exceptionType + '.name');
        }
        // reset the scroll position only after clicking the exceptiontype info icon
        if (this.exceptionTypeInfoClose) {
            exceptionactionCreator.setScrollForExceptionType();
            this.exceptionTypeInfoClose = false;
        }
        return (React.createElement("div", {className: dropdownclassName, onClick: this.showExceptionType}, React.createElement("a", {id: 'exceptionSelected', className: 'menu-button exception-type-caption'}, React.createElement("span", null, dropdownText), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement("div", {id: 'exceptionMenu', className: 'menu', role: 'menu', title: localeStore.instance.TranslateText('marking.response.raise-exception-panel.exception-type-tooltip'), "aria-hidden": 'true'}, React.createElement("div", {className: 'exception-type-menu-content panel-group'}, toRender))));
    };
    /**
     * Render the exception Relates to items.
     */
    Exception.prototype.renderExceptionRelatesTo = function () {
        if (this.props.currentQuestionItemInfo &&
            this.props.currentQuestionItemInfo.uniqueId) {
            if (this._questionId === undefined) {
                this._questionId = this.props.currentQuestionItemInfo.uniqueId;
            }
            this._questionName = localeStore.instance.TranslateText('marking.response.raise-exception-panel.selected-question')
                + markingStore.instance.toolTip(this._questionId);
        }
        var selectedQuestionItem;
        selectedQuestionItem = this.state.selectedRelatesTo === undefined ?
            this._questionId : this.state.selectedRelatesTo;
        return (React.createElement("div", {className: 'exception-relate-option-wrap '}, React.createElement("div", {className: 'exception-relate-option'}, React.createElement("input", {type: 'radio', value: 'selected', id: 'exceptionRelated1', name: 'exceptionRelated', defaultChecked: this.state.selectedRelatesTo !== 0, onChange: null}), React.createElement("label", {htmlFor: 'exceptionRelated1', onClick: selectedQuestionItem !== this._questionId ?
            this.changeRelatesTo.bind(this, this._questionId) : null}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, this._questionName))), React.createElement("div", {className: 'exception-relate-option'}, React.createElement("input", {type: 'radio', value: 'selected', id: 'exceptionRelated2', name: 'exceptionRelated', defaultChecked: this.state.selectedRelatesTo === 0}), React.createElement("label", {htmlFor: 'exceptionRelated2', onClick: selectedQuestionItem !== 0 ?
            this.changeRelatesTo.bind(this, 0) : null}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, responseStore.instance.isWholeResponse ? this._markSchemeGroupName
            : localeStore.instance.TranslateText('marking.response.raise-exception-panel.entire-response'))))));
    };
    /**
     * Render the exception comment box.
     */
    Exception.prototype.renderExceptionMessage = function () {
        return (React.createElement("div", {className: 'exception-message-wrap'}, React.createElement("textarea", {ref: 'commentTextBox', "aria-label": 'Exception', name: 'exception-msg', id: 'exceptionmsg', className: 'exception-message', placeholder: localeStore.instance.TranslateText('marking.response.raise-exception-panel.comment-placeholder'), onChange: this.commentChanged, value: this.state.exceptionComment, onFocus: this.onFocus})));
    };
    /**
     * This method will call on focus of exception comment box text area
     * @param e
     */
    Exception.prototype.onFocus = function (e) {
        this.setState({
            showExceptionTypeclassName: 'close'
        });
    };
    /**
     * Render the exception History.
     */
    Exception.prototype.renderExceptionCommentHistory = function () {
        var commentDetails = this.props.exceptionDetails.exceptionComments;
        var exceptionStatus = this.props.exceptionDetails.currentStatus;
        var isEscalated = false;
        var toRender = commentDetails.map(function (comment, index) {
            if ((exceptionStatus === enums.ExceptionStatus.Open && index === 0) ||
                (exceptionStatus === (enums.ExceptionStatus.Resolved || enums.ExceptionStatus.Closed) && index === 0) ||
                (exceptionStatus === (enums.ExceptionStatus.Resolved || enums.ExceptionStatus.Closed) &&
                    index === commentDetails.length - 1)) {
                isEscalated = false;
            }
            else {
                isEscalated = true;
            }
            return React.createElement(ExceptionCommentHistory, {key: 'comment-history' + index, commentedBy: comment.examinerName, isEscalated: isEscalated, updatedDate: comment.updatedDate, comments: comment.comment, exceptionStatus: comment.exceptionStatus, id: index});
        });
        return (React.createElement("div", {className: 'exception-history-wrapper'}, toRender));
    };
    /**
     * Navigate to the team Management ExceptionList
     */
    Exception.prototype.navigatetoExceptionList = function () {
        teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
        teamManagementActionCreator.getUnactionedExceptions(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, true);
        navigationHelper.loadTeamManagement();
    };
    /**
     * Save the Exception to Db.
     */
    Exception.prototype.saveException = function () {
        this._scriptHelper = new scriptHelper();
        var selectedExceptionType = this.getExceptionTypeDetails(this.state.selectedExceptionTypeId);
        var isEbookMarking = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false;
        var comments = [{
                comment: this.state.exceptionComment,
                uniqueId: 0,
                examinerID: examinerStore.instance.getMarkerInformation.examinerId,
                escalationPoint: enums.EscalationPoint.None,
                authorIsGroup: false,
                updatedBy: ''
            }];
        var raiseExceptionParams = {
            candidateScriptID: this._scriptHelper.getResponseData.candidateScriptId,
            exceptionType: this.state.selectedExceptionTypeId,
            markSchemeGroupID: this._markSchemeGroupId,
            markGroupId: this._markGroupId,
            isEBookMarking: isEbookMarking,
            originatorExaminerId: examinerStore.instance.getMarkerInformation.examinerId,
            questionPaperPartID: qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            ownerEscalationPoint: selectedExceptionType.ownerEscalationPoint,
            exceptionComments: comments,
            currentStatus: enums.ExceptionStatus.Open,
            exceptionId: 0,
            markSchemeID: this.state.selectedRelatesTo === undefined ?
                this._questionId : this.state.selectedRelatesTo,
            originatorExaminerRoleId: this._examinerRoleId,
            ownerExaminerId: selectedExceptionType.ownerExaminerId,
            uniqueId: 0,
            displayId: responseStore.instance.selectedDisplayId,
            examinerName: examinerStore.instance.getMarkerInformation.formattedExaminerName
        };
        this.setState({
            isSubmitButtonDisabled: true,
            exceptionComment: ''
        }, function () {
            // Call the raise exception Action.
            exceptionactionCreator.raiseExceptionAction(raiseExceptionParams, worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString()).markGroupId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        });
    };
    /**
     * Get the Exception type details.
     */
    Exception.prototype.getExceptionTypeDetails = function (exceptionTypeId) {
        var exceptionTypes = exceptionStore.instance.getExceptionTypes;
        var selectedExceptionType = null;
        exceptionTypes.map(function (exceptionType) {
            if (exceptionType.exceptionType === parseInt(exceptionTypeId)) {
                selectedExceptionType = exceptionType;
            }
        });
        return selectedExceptionType;
    };
    /**
     * Show ExceptionType Dropdown.
     */
    Exception.prototype.showExceptionType = function () {
        this.setState({
            isExceptionTypeMenuSelected: true,
            showExceptionTypeclassName: this.state.showExceptionTypeclassName === 'close' ? 'open' : 'close'
        });
    };
    /**
     * Select the ExceptionType.
     * @param- exceptionTypeid
     * @param- isDisabled
     * @param- event
     */
    Exception.prototype.selectExceptionType = function (exceptionTypeId, isDisabled, event) {
        var exceptionComment = this.state.exceptionComment;
        if (!isDisabled) {
            this.setState({
                selectedExceptionTypeId: exceptionTypeId,
                isSubmitButtonDisabled: this.isValidException(true, exceptionComment, exceptionTypeId),
                showExceptionTypeclassName: 'close'
            });
        }
        this.props.validateException(this.isValidException(false, exceptionComment, exceptionTypeId));
        event.stopPropagation();
    };
    /**
     * Show the Exception Description.
     * @param- exceptionTypeid
     * @param- isOpen
     * @param- event
     */
    Exception.prototype.showExceptionDescription = function (exceptionTypeId, isOpen, event) {
        this.exceptionTypeInfoClose = isOpen !== 'open';
        this.setState({
            selectedExceptionDescriptionId: isOpen === 'open' ? 0 : exceptionTypeId
        });
        event.stopPropagation();
    };
    /**
     * Update exception status to Db
     */
    Exception.prototype.closeException = function () {
        var exceptionParams = {
            uniqueId: this.props.exceptionDetails.uniqueId,
            exceptionType: this.props.exceptionDetails.exceptionType,
            currentStatus: enums.ExceptionStatus.Closed,
            exceptionComments: null,
            markSchemeID: this.props.exceptionDetails.markSchemeID,
            ownerEscalationPoint: this.props.exceptionDetails.ownerEscalationPoint,
            ownerExaminerId: this.props.exceptionDetails.ownerExaminerId,
            markGroupId: this.props.exceptionDetails.markGroupId,
            candidateScriptID: this.props.exceptionDetails.candidateScriptID,
            markSchemeGroupID: this.props.exceptionDetails.markSchemeGroupID,
            questionPaperPartID: this.props.exceptionDetails.questionPaperPartID,
            originatorExaminerId: this.props.exceptionDetails.originatorExaminerId,
            isEBookMarking: this.props.exceptionDetails.iseBookMarking
        };
        /* Defect 46286 - Exception count is not getting updated once after closing the exception.
           To fix the issue by clearing the worklist cache after closing the exception.So it required worklist type, response mode,
           remark request type as the exception argument */
        var exceptionActionParams = {
            exception: exceptionParams,
            actionType: enums.ExceptionActionType.Close,
            requestedByExaminerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            worklistType: worklistStore.instance.currentWorklistType,
            responseMode: worklistStore.instance.getResponseMode,
            remarkRequestType: worklistStore.instance.getRemarkRequestType,
            displayId: responseStore.instance.selectedDisplayId.toString(),
        };
        exceptionactionCreator.updateExceptionStatus(exceptionActionParams);
    };
    return Exception;
}(ExceptionBase));
module.exports = Exception;
//# sourceMappingURL=exception.js.map