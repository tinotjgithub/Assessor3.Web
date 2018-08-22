"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var errorActionCreator = require('../../actions/logging/erroractioncreator');
var auditStore = require('../../stores/audit/auditlogstore');
var loginStore = require('../../stores/login/loginstore');
var auditLogInfoArgument = require('../../dataservices/logging/auditloginfoargument');
var Immutable = require('immutable');
var errorInfoArgument = require('../../dataservices/logging/errorinfoargument');
var loginSession = require('../../app/loginsession');
var ErrorDialog = require('./errordialog');
var localeStore = require('../../stores/locale/localestore');
var busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
var enums = require('../utility/enums');
var navigationhelper = require('../utility/navigation/navigationhelper');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
var Logging = (function (_super) {
    __extends(Logging, _super);
    /**
     * Constructor Logging
     * @param props
     * @param state
     */
    function Logging(props, state) {
        _super.call(this, props, state);
        this.showErrorIcon = true;
        this.isCustomError = false;
        this.isUnAuthorised = false;
        this.state = {
            isErrorDialogDisplaying: false
        };
        this.onOkClick = this.onOkClick.bind(this);
    }
    /**
     * Component will mount
     */
    Logging.prototype.componentWillMount = function () {
        this.RecordErrorLog();
    };
    /**
     * Records the error logs
     */
    Logging.prototype.RecordErrorLog = function () {
        var _this = this;
        window.onerror = function (message, file, line, column, errorObject) {
            /** If error object is custom error show the custom message esle show the default message */
            if (!errorObject) {
                return;
            }
            if (errorObject && errorObject.hasOwnProperty('moduleName')) {
                _this.isCustomError = true;
                _this.errorContentKey = errorObject.message;
                _this.customErrorHeader = errorObject.headerText;
                _this.showErrorIcon = errorObject.showErrorIcon;
            }
            else {
                _this.isCustomError = (message === '' ? true : false);
                _this.showErrorIcon = true;
                _this.customErrorHeader = 'generic.error-dialog.header';
                _this.errorContentKey = 'generic.error-dialog.body';
                var stacktrace = void 0;
                var propertyNames = Object.getOwnPropertyNames(errorObject);
                // populate the stack trace.
                for (var property = void 0, i = 0, len = propertyNames.length; i < len; ++i) {
                    property = propertyNames[i];
                    if (property = 'stack') {
                        stacktrace = errorObject[property];
                        break;
                    }
                }
                // Create a json object to populate the whole error stack trace information
                var clienterrorObj = {
                    message: message,
                    file: file,
                    line: line,
                    column: column,
                    stacktrace: stacktrace
                };
                _this._errorViewmoreContent = 'Error Message : ' + clienterrorObj.message
                    + (clienterrorObj.file ? ' File: ' + clienterrorObj.file : '')
                    + (clienterrorObj.line ? ', Line: ' + clienterrorObj.line : '')
                    + (clienterrorObj.column ? ', Column: ' + clienterrorObj.column : '')
                    + (clienterrorObj.stacktrace ? ', Stack Trace: ' + clienterrorObj.stacktrace : '');
                var errorDetails = JSON.stringify(clienterrorObj);
                _this.sendToServer(errorDetails);
                new auditLoggingHelper().logHelper.logEventOnApplicationError(errorDetails);
            }
            // checking if the client is unauthorised
            _this.isUnAuthorised = errorObject !== undefined && errorObject.status === 401 ? true : false;
            _this.setState({
                isErrorDialogDisplaying: true
            });
            /* if any error occur we need to remove the busy indicator from the UI */
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
            return true; // error handled and return true
        };
    };
    /**
     * Render method
     */
    Logging.prototype.render = function () {
        return (React.createElement(ErrorDialog, {isOpen: this.state.isErrorDialogDisplaying, isCustomError: this.isCustomError, header: this.customErrorHeader, content: localeStore.instance.TranslateText(this.errorContentKey), viewMoreContent: this._errorViewmoreContent, onOkClick: this.onOkClick, showErrorIcon: this.showErrorIcon}));
    };
    /** creating object to store error informentation send to server */
    Logging.prototype.sendToServer = function (reason) {
        /** creating object to store error informentation send to server */
        var errorInfoArgumentItem = new errorInfoArgument();
        var date = new Date();
        errorInfoArgumentItem.ExamBodyName = loginSession.AWARDING_BODY;
        errorInfoArgumentItem.RequestDate = date.getDate().toString();
        errorInfoArgumentItem.Reason = reason;
        var auditLogInfoArgumentItem;
        /** looping through auditStore LogInfo collection to map values into dataservice class */
        var auditLogItem = auditStore.instance.LogInfo.map(function (auditInfoItem) {
            auditLogInfoArgumentItem = new auditLogInfoArgument();
            auditLogInfoArgumentItem.LoggedAction = auditInfoItem.loggedAction;
            auditLogInfoArgumentItem.LoggedDate = auditInfoItem.loggedDate;
            auditLogInfoArgumentItem.Content = auditInfoItem.content;
            auditLogInfoArgumentItem.MarkSchemeGroupId = auditInfoItem.markSchemeGroupId;
            auditLogInfoArgumentItem.MarkGroupId = auditInfoItem.markGroupId;
            auditLogInfoArgumentItem.EsMarkGroupId = auditInfoItem.esMarkGroupId;
            return auditLogInfoArgumentItem;
        });
        /** Setting the collection into errorInfoArgument */
        errorInfoArgumentItem.AuditLogInfo = Immutable.List(auditLogItem);
        var userName = loginStore.instance.loggedInUserName;
        errorActionCreator.SaveToServer(errorInfoArgumentItem, userName);
    };
    /**
     * Invoked on the OK click of the error dialog window
     */
    Logging.prototype.onOkClick = function () {
        this.setState({ isErrorDialogDisplaying: false });
        // If client is unauthorised, then navigate to the login page forcefully
        if (this.isUnAuthorised) {
            this.isUnAuthorised = false;
            navigationhelper.loadLoginPage();
        }
    };
    return Logging;
}(pureRenderComponent));
module.exports = Logging;
//# sourceMappingURL=logging.js.map