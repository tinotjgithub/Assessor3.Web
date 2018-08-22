"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var classNames = require('classnames');
var NotificationCount = require('../../../message/notificationcount');
var MesageOrExceptionHolder = require('../../responsescreen/messageandexception/mesageorexceptionholder');
var exceptionStore = require('../../../../stores/exception/exceptionstore');
var qigStore = require('../../../../stores/qigselector/qigstore');
var responseStore = require('../../../../stores/response/responsestore');
var domManager = require('../../../../utility/generic/domhelper');
var enums = require('../../../utility/enums');
var exceptionHelper = require('../../../utility/exception/exceptionhelper');
var teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
var responseActionCreator = require('../../../../actions/response/responseactioncreator');
var examinerStore = require('../../../../stores/markerinformation/examinerstore');
var worklistStore = require('../../../../stores/worklist/workliststore');
var markerOperationModeFacory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var loginStore = require('../../../../stores/login/loginstore');
var loginSession = require('../../../../app/loginsession');
var exceptionActionCreator = require('./../../../../actions/exception/exceptionactioncreator');
var applicationCreator = require('../../../../actions/applicationoffline/applicationactioncreator');
var storageAdapterhelper = require('../../../../dataservices/storageadapters/storageadapterhelper');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var ExceptionIcon = (function (_super) {
    __extends(ExceptionIcon, _super);
    /**
     * Constructor for exception icons
     * @param props
     * @param state
     */
    function ExceptionIcon(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._boundHandleOnClick = null;
        this.resolvedExceptionCount = 0;
        this.unactionedExceptionCount = 0;
        this.totalExceptionCount = 0;
        this._isRejectRigCCActive = false;
        this._rejectRigClicked = false;
        /**
         * Click Event Of  Message or Exception item in the list.
         */
        this.onNewMessageOrExceptionItemClick = function (isMsg, itemId) {
            if (!isMsg) {
                _this.props.onExceptionSelected(itemId);
                _this.selectedExceptionId = 0;
                _this.setState({
                    renderedOn: Date.now(),
                    exceptionPanelOpen: false
                });
            }
        };
        /**
         * Click Event Of new Message or Exception inside the list.
         */
        this.onNewMessageOrExceptionClick = function (isNewMsg) {
            if (!isNewMsg) {
                _this.props.onCreateNewExceptionClicked();
                _this.selectedExceptionId = 0;
                _this.setState({
                    renderedOn: Date.now(),
                    exceptionPanelOpen: false
                });
            }
        };
        /**
         * Handles message icon click
         */
        this.handleClick = function () {
            if (!applicationCreator.checkActionInterrupted()) {
                return;
            }
            if (_this.totalExceptionCount > 0 || (_this.doShowRejectThisResponse() && _this._isRejectRigCCActive)) {
                _this.selectedExceptionId = 0;
                _this.setState({
                    renderedOn: Date.now(),
                    exceptionPanelOpen: !_this.state.exceptionPanelOpen
                });
            }
            else {
                _this.props.onCreateNewExceptionClicked();
            }
        };
        /**
         *  Handle exception list menu
         */
        this.getLinkedExceptions = function (exceptionId, exceptionCount) {
            _this.props.onExceptionSelected(exceptionId);
            _this.selectedExceptionId = exceptionId;
            _this.setState({
                renderedOn: Date.now(),
                exceptionPanelOpen: (exceptionCount > 1)
            });
        };
        /**
         * Handle click events outside the zoom settings
         * @param {any} e - The source element
         */
        this.handleClickOutsideElement = function (e) {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'exception-button'; }) == null) {
                if (_this.state.exceptionPanelOpen === true) {
                    _this.setState({
                        renderedOn: Date.now(),
                        exceptionPanelOpen: false
                    });
                }
            }
            // both touchend and click event is fired one after other, 
            // this avoid resetting store in touchend
            if (_this.state.exceptionPanelOpen !== undefined && e.type !== 'touchend') {
                exceptionActionCreator.isExceptionSidePanelOpen(_this.state.exceptionPanelOpen);
            }
        };
        /**
         * Loads exception data and the resolved exception count, rerender the component
         * to show notification and the data list
         */
        this.loadExceptionsAndNotification = function () {
            _this.exceptionList = exceptionStore.instance.getExceptionData;
            // finding the resolved exception count in response
            _this.resolvedExceptionCount = exceptionStore.instance.getResolvedExceptionDataCount;
            var responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            // finding the resolved exception count in worklist
            var resolvedExceptionsCountFromWorklist = responseData.resolvedExceptionsCount;
            if (_this.exceptionList) {
                _this.totalExceptionCount = _this.exceptionList.count();
                if (markerOperationModeFacory.operationMode.isTeamManagementMode) {
                    _this.unactionedExceptionCount = _this.exceptionList.count(function (x) { return x.ownerExaminerId === loginSession.EXAMINER_ID; });
                }
                else if (resolvedExceptionsCountFromWorklist !== _this.resolvedExceptionCount) {
                    var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                    // Need to refresh the exception data in response while comparing with resolved exception count in worklist.
                    // call for clear cache.
                    var cacheKey = '';
                    var cacheValue = '';
                    var _storageAdapterHelper = new storageAdapterhelper();
                    cacheKey = 'ExceptionForResponse';
                    cacheValue = 'Exception-Data-' + responseData.candidateScriptId +
                        responseStore.instance.selectedMarkGroupId
                        + markSchemeGroupId + false;
                    _storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
                    // call the server for getting the exception data for response.
                    exceptionHelper.getNewExceptions(markerOperationModeFacory.operationMode.isTeamManagementMode);
                }
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Reject Rig icon click.
         */
        this.onRejectRigClick = function () {
            _this._rejectRigClicked = true;
            _this.showRejectRigPopUp();
        };
        /*
         * Display RejectRig Confirmation popup
         */
        this.showRejectRigPopUp = function () {
            if (_this._rejectRigClicked) {
                _this._rejectRigClicked = false;
                _this.props.onRejectRigClick();
            }
        };
        /*
         * on reject rig confirmation click.
         */
        this.rejectRigActionConfirmed = function () {
            var candidateScriptId = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
            var rejectRigArgument = {
                markGroupId: responseStore.instance.selectedMarkGroupId,
                examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                candidateScriptId: candidateScriptId,
                markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                examinerId: examinerStore.instance.getMarkerInformation.examinerId,
                displayId: responseStore.instance.selectedDisplayId,
                isWholeResponse: responseStore.instance.isWholeResponse
            };
            var isNextResponseAvailable = worklistStore.instance.isNextResponseAvailable(responseStore.instance.selectedDisplayId.toString());
            responseActionCreator.rejectRig(rejectRigArgument, isNextResponseAvailable);
            _this.setState({
                renderedOn: Date.now(),
                exceptionPanelOpen: false
            });
        };
        /*
         * Determine visiblity of LHS exception panel when there are no exceptions.
         */
        this.doShowExceptionPanel = function () {
            return !(_this.totalExceptionCount > 0) && _this._isRejectRigCCActive;
        };
        /**
         * Determines visiblity of Reject this response element.
         */
        this.doShowRejectThisResponse = function () {
            var worklistType = worklistStore.instance.currentWorklistType;
            var responseMode = responseStore.instance.selectedResponseMode;
            var hasOpenOrResolvedException = exceptionStore.instance.getOpenOrResolvedExceptionCount > 0;
            return _this._isRejectRigCCActive && ((worklistType === enums.WorklistType.live
                || worklistType === enums.WorklistType.atypical)
                && responseMode === enums.ResponseMode.open
                && !hasOpenOrResolvedException
                && !markerOperationModeFacory.operationMode.isTeamManagementMode);
        };
        this.state = {
            renderedOn: 0,
            exceptionPanelOpen: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.getExceptions = this.getExceptions.bind(this);
        this._isRejectRigCCActive = exceptionHelper.isRejectRigCCActive;
    }
    /**
     * Component did mount
     */
    ExceptionIcon.prototype.componentDidMount = function () {
        this._boundHandleOnClick = this.handleClickOutsideElement.bind(this);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.getExceptions);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.loadExceptionsAndNotification);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.getExceptions);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.getExceptions);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.GET_LINKED_EXCEPTIONS, this.getLinkedExceptions);
        responseStore.instance.addListener(responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT, this.rejectRigActionConfirmed);
        responseStore.instance.addListener(responseStore.ResponseStore.REJECT_RIG_POPUP_DISPLAY_EVENT, this.showRejectRigPopUp);
        this.getExceptions();
    };
    /**
     * Component will unmount
     */
    ExceptionIcon.prototype.componentWillUnmount = function () {
        // Removing subscription to the events
        window.removeEventListener('click', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.getExceptions);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.loadExceptionsAndNotification);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.getExceptions);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.getExceptions);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.GET_LINKED_EXCEPTIONS, this.getLinkedExceptions);
        responseStore.instance.removeListener(responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT, this.rejectRigActionConfirmed);
        responseStore.instance.removeListener(responseStore.ResponseStore.REJECT_RIG_POPUP_DISPLAY_EVENT, this.showRejectRigPopUp);
    };
    /**
     * Component did update
     */
    ExceptionIcon.prototype.componentDidUpdate = function () {
        // set the scroll position to the top of exception list
        if (htmlUtilities.isFirefox) {
            htmlUtilities.setScrollTop('exception-contents', 0);
        }
    };
    /**
     * Render the expand icon in message
     */
    ExceptionIcon.prototype.renderExpandIcon = function () {
        if (this.totalExceptionCount > 0 || (this.doShowRejectThisResponse() && this._isRejectRigCCActive)) {
            return (React.createElement("span", {className: 'sprite-icon toolexpand-icon'}, "Expand"));
        }
    };
    /**
     * Render component
     * @returns
     */
    ExceptionIcon.prototype.render = function () {
        // The raise exceptions shall not be shown on opening a simulation response.
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
            return null;
        }
        var iconToRender;
        var iconToolTip;
        if (this.totalExceptionCount > 0 || (this.doShowRejectThisResponse() && this._isRejectRigCCActive)) {
            iconToRender = React.createElement("use", {xlinkHref: '#exception-icon'});
            iconToolTip = this.props.hasUnManagedSLAO ?
                localeStore.instance.TranslateText('marking.full-response-view.problems-button-while-managing-slaos-tooltip') :
                localeStore.instance.TranslateText('marking.response.left-toolbar.problems-button-tooltip');
        }
        else if (this.props.canRaiseException) {
            iconToRender = React.createElement("use", {xlinkHref: '#new-exception-icon'});
            iconToolTip = (this.props.hasUnManagedSLAO || this.props.hasUnManagedImageZone) ?
                localeStore.instance.TranslateText('marking.full-response-view.problems-button-while-managing-slaos-tooltip') :
                localeStore.instance.TranslateText('marking.response.exception-list-panel.raise-new-exception');
        }
        var menuButton = (React.createElement("a", {className: 'menu-button', onClick: this.handleClick, title: iconToolTip}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'marking-exception-icon'}, React.createElement("title", null, iconToolTip), iconToRender), React.createElement(NotificationCount, {id: 'response-exception', key: 'response-exception', unReadMessageCount: markerOperationModeFacory.operationMode.isTeamManagementMode ?
            this.unactionedExceptionCount : this.resolvedExceptionCount})), this.renderExpandIcon()));
        var messageOrExceptionHolder = (React.createElement(MesageOrExceptionHolder, {id: 'excp-resp-holder', key: 'excp-resp-holder', isMessageHolder: false, selectedItemId: this.selectedExceptionId, messages: this.exceptionList, onNewMessageOrExceptionClick: this.onNewMessageOrExceptionClick, onMessageOrExceptionItemSelected: this.onNewMessageOrExceptionItemClick, isNewMessageButtonHidden: false, canRaiseException: this.props.canRaiseException, onRejectRigClick: this.onRejectRigClick, doShowExceptionPanel: this.doShowExceptionPanel(), doShowRejectThisResponse: this.doShowRejectThisResponse()}));
        if ((this.props.canRaiseException || this.totalExceptionCount > 0)
            && !this.props.hasUnManagedSLAO && !this.props.hasUnManagedImageZone
            && !teamManagementStore.instance.isRedirectFromException && !loginStore.instance.isAdminRemarker) {
            return (React.createElement("li", {id: this.props.id, className: classNames('mrk-exception dropdown-wrap', { 'open': this.state.exceptionPanelOpen })}, menuButton, messageOrExceptionHolder));
        }
        else if ((this.props.canRaiseException || this.totalExceptionCount > 0)
            && (this.props.hasUnManagedSLAO || this.props.hasUnManagedImageZone)
            && !teamManagementStore.instance.isRedirectFromException && !loginStore.instance.isAdminRemarker) {
            return (React.createElement("div", {id: this.props.id, className: classNames('toggle-response-view raise-new-exception dropdown-wrap', { 'open': this.state.exceptionPanelOpen })}, menuButton, messageOrExceptionHolder));
        }
        else {
            return null;
        }
    };
    /**
     * Get exceptions of the response
     */
    ExceptionIcon.prototype.getExceptions = function () {
        if (this.props.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView ||
            this.props.hasUnManagedSLAO) {
            exceptionHelper.getNewExceptions(markerOperationModeFacory.operationMode.isTeamManagementMode);
        }
        else {
            this.loadExceptionsAndNotification();
        }
    };
    return ExceptionIcon;
}(pureRenderComponent));
module.exports = ExceptionIcon;
//# sourceMappingURL=exceptionicon.js.map