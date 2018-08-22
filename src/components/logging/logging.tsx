/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import errorActionCreator = require('../../actions/logging/erroractioncreator');
import auditStore = require('../../stores/audit/auditlogstore');
import loginStore = require('../../stores/login/loginstore');
import auditLogInfoArgument = require('../../dataservices/logging/auditloginfoargument');
import Immutable = require('immutable');
import errorInfoArgument = require('../../dataservices/logging/errorinfoargument');
import loginSession = require('../../app/loginsession');
import ErrorDialog = require('./errordialog');
import localeStore = require('../../stores/locale/localestore');
import busyIndicatorActionCreator = require('../../actions/busyindicator/busyindicatoractioncreator');
import enums = require('../utility/enums');
import navigationhelper = require('../utility/navigation/navigationhelper');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');

// All fields optional to allow partial state updates in setState
interface State {
    isErrorDialogDisplaying?: boolean;
}

class Logging extends pureRenderComponent<any, State> {

    private _errorViewmoreContent: string;
    private errorContentKey: string;
    private isCustomError: boolean;
    private isUnAuthorised: boolean;
    private customErrorHeader: string;
    private showErrorIcon: boolean = true;

    /**
     * Constructor Logging
     * @param props
     * @param state
     */
    constructor(props: any, state: State) {
        super(props, state);
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
    public componentWillMount() {
        this.RecordErrorLog();
    }

    /**
     * Records the error logs
     */
    private RecordErrorLog() {
        window.onerror = (message: string, file: string, line: number, column: number, errorObject: any) => {
            /** If error object is custom error show the custom message esle show the default message */

            if (!errorObject) {
                return;
            }

            if (errorObject && errorObject.hasOwnProperty('moduleName')) {
                this.isCustomError = true;
                this.errorContentKey = errorObject.message;
                this.customErrorHeader = errorObject.headerText;
                this.showErrorIcon = errorObject.showErrorIcon;
            } else {
                this.isCustomError = (message === '' ? true : false);
                this.showErrorIcon = true;
                this.customErrorHeader = 'generic.error-dialog.header';
                this.errorContentKey = 'generic.error-dialog.body';
                let stacktrace;
                let propertyNames = Object.getOwnPropertyNames(errorObject);
                // populate the stack trace.
                for (let property, i = 0, len = propertyNames.length; i < len; ++i) {
                    property = propertyNames[i];
                    if (property = 'stack') {
                        stacktrace = errorObject[property];
                        break;
                    }
                }
                // Create a json object to populate the whole error stack trace information
                let clienterrorObj = {
                    message: message,
                    file: file,
                    line: line,
                    column: column,
                    stacktrace: stacktrace
                };

                this._errorViewmoreContent = 'Error Message : ' + clienterrorObj.message
                    + (clienterrorObj.file ? ' File: ' + clienterrorObj.file : '')
                    + (clienterrorObj.line ? ', Line: ' + clienterrorObj.line : '')
                    + (clienterrorObj.column ? ', Column: ' + clienterrorObj.column : '')
                    + (clienterrorObj.stacktrace ? ', Stack Trace: ' + clienterrorObj.stacktrace : '');
                let errorDetails = JSON.stringify(clienterrorObj);
                this.sendToServer(errorDetails);
                new auditLoggingHelper().logHelper.logEventOnApplicationError(errorDetails);
            }

            // checking if the client is unauthorised
            this.isUnAuthorised = errorObject !== undefined && errorObject.status === 401 ? true : false;

            this.setState({
                isErrorDialogDisplaying: true
            });

            /* if any error occur we need to remove the busy indicator from the UI */
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
            return true; // error handled and return true
        };
    }

    /**
     * Render method
     */
    public render() {
        return (
            <ErrorDialog isOpen={this.state.isErrorDialogDisplaying}
                isCustomError={this.isCustomError}
                header={this.customErrorHeader}
                content={localeStore.instance.TranslateText(this.errorContentKey)}
                viewMoreContent={this._errorViewmoreContent}
                onOkClick={this.onOkClick}
                showErrorIcon={this.showErrorIcon} />
        );
    }

    /** creating object to store error informentation send to server */
    private sendToServer(reason: string) {
        /** creating object to store error informentation send to server */
        let errorInfoArgumentItem = new errorInfoArgument();
        let date = new Date();
        errorInfoArgumentItem.ExamBodyName = loginSession.AWARDING_BODY;
        errorInfoArgumentItem.RequestDate = date.getDate().toString();
        errorInfoArgumentItem.Reason = reason;
        let auditLogInfoArgumentItem;
        /** looping through auditStore LogInfo collection to map values into dataservice class */
        let auditLogItem = auditStore.instance.LogInfo.map(function (auditInfoItem: AuditLogInfo) {
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
        errorInfoArgumentItem.AuditLogInfo = Immutable.List<auditLogInfoArgument>(auditLogItem);
        let userName = loginStore.instance.loggedInUserName;
        errorActionCreator.SaveToServer(errorInfoArgumentItem, userName);
    }

    /**
     * Invoked on the OK click of the error dialog window
     */
    private onOkClick() {
        this.setState({ isErrorDialogDisplaying: false });

        // If client is unauthorised, then navigate to the login page forcefully
        if (this.isUnAuthorised) {
            this.isUnAuthorised = false;
            navigationhelper.loadLoginPage();
        }
    }
}

export = Logging;
