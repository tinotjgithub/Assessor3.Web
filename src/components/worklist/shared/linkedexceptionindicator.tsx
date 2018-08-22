/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import stringHelper = require('../../../utility/generic/stringhelper');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import enums = require('../../utility/enums');
import worklistStore = require('../../../stores/worklist/workliststore');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import messageStore = require('../../../stores/message/messagestore');
import messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import exceptionHelper = require('../../utility/exception/exceptionhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');

/**
 * Properties of a componenet.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    hasExceptions: boolean;
    hasZoningExceptions: boolean;
    isZoningExceptionRaisedInSameScript: boolean;
    hasBlockingExceptions: boolean;
    resolvedExceptionsCount?: number;
    isTileView?: boolean;
    displayId: string;
    isTeamManagementMode: boolean;
    unactionedExceptionCount?: number;
}

/**
 * React component.
 * @param {Props} props
 * @returns
 */
class LinkedExceptionIndicator extends pureRenderComponent<Props, any> {

    /**
     * Constructor for linked exception indicator
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * render component
     */
    public render(): JSX.Element {

        return (!this.props.isTileView) ? this.getExceptionContent()
            :
            (<div className='col wl-alert text-left' id={this.props.id + '_execeptionIndicator'}>
                {this.getExceptionContent()}
            </div>
            );
    }

    /**
     * Open response while clicking on linked exception icon
     */
    private onLinkedExceptionIconClick = (event: any) => {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            event.stopPropagation();
            let displayId = this.props.displayId.toString();
            let exceptionicon: boolean = true;
            let selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(displayId));
            exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode,
                markerOperationModeFactory.operationMode.isAwardingMode, displayId, exceptionicon);
            if (!messageStore.instance.isMessagePanelActive) {
                let openedResponseDetails = worklistStore.instance.getResponseDetails(displayId);
                responseHelper.openResponse(
                    parseInt(displayId),
                    enums.ResponseNavigation.specific,
                    worklistStore.instance.getResponseMode,
                    openedResponseDetails.markGroupId,
                    enums.ResponseViewMode.zoneView,
                    enums.TriggerPoint.WorkListResponseExceptionIcon);
                markSchemeHelper.getMarks(parseInt(displayId), selectedMarkingMode);
            } else {
                let messageNavigationArguments: MessageNavigationArguments = {
                    responseId: parseInt(displayId),
                    canNavigate: false,
                    navigateTo: enums.MessageNavigation.toResponse,
                    navigationConfirmed: false,
                    hasMessageContainsDirtyValue: undefined,
                    triggerPoint: enums.TriggerPoint.WorkListResponseExceptionIcon
                };
                messagingActionCreator.canMessageNavigate(messageNavigationArguments);
            }
        }
    };

    /**
     * Retrns exception content.
     * @returns
     */
    private getExceptionContent(): JSX.Element {
        let result = (<div></div>);
        let toolTipText: string = '';
        let exceptionClassName: string = '';
        let notificationClassName: string = '';
        let exceptionAltText: string = localeStore.instance.TranslateText('generic.worklist.information-text');

        // The exception alert count:
        // On viewing one's own worklist,
        // the number of exception that has been resolved by supervisor and needs action by the logged in user.
        // In team management view,
        // the number or exception that the supervisor needs to action.

        let exceptionAlertCount: number = this.props.isTeamManagementMode ?
            (this.props.unactionedExceptionCount ? this.props.unactionedExceptionCount : 0) :
            (this.props.resolvedExceptionsCount ? this.props.resolvedExceptionsCount : 0);

        if (!this.props.hasExceptions && !this.props.hasZoningExceptions) {
            return result;
        }

        if (this.props.hasExceptions && !this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount === 0) {
            toolTipText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.exceptions-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.exceptions-icon-tooltip');
            exceptionClassName = 'sprite-icon info-icon-dark-small';
        } else if (this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount === 0) {
            toolTipText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.blocking-exceptions-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.blocking-exceptions-icon-tooltip');
            exceptionClassName = 'sprite-icon info-icon-yellow';
        } else if (this.props.hasExceptions && !this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount > 0) {
            toolTipText = this.props.isTeamManagementMode ?
                stringHelper.format(localeStore.instance.
                    TranslateText('team-management.examiner-worklist.response-data.resolved-exceptions-icon-tooltip'),
                    [String(this.props.resolvedExceptionsCount)]) :
                stringHelper.format(localeStore.instance.TranslateText('marking.worklist.response-data.resolved-exceptions-icon-tooltip'),
                    [String(this.props.resolvedExceptionsCount)]);
            exceptionClassName = 'sprite-icon info-icon-dark-small';
        } else if (this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount > 0) {
            toolTipText = this.props.isTeamManagementMode ? stringHelper.format(
                localeStore.instance.TranslateText
                    ('team-management.examiner-worklist.response-data.resolved-and-blocking-exceptions-icon-tooltip'),
                [String(this.props.resolvedExceptionsCount)]) :
                stringHelper.format(
                    localeStore.instance.TranslateText('marking.worklist.response-data.resolved-and-blocking-exceptions-icon-tooltip'),
                    [String(this.props.resolvedExceptionsCount)]);
            exceptionClassName = 'sprite-icon info-icon-yellow';
        } else if (!this.props.hasZoningExceptions) {
            toolTipText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.exceptions-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.exceptions-icon-tooltip');
            exceptionClassName = 'sprite-icon info-icon-dark-small';
        }

        ////Append the tooltip of existing exceptions with zoning exception tooltip if sibling rig contains zoning exception
        if (this.props.hasZoningExceptions) {
            if (toolTipText && !this.props.isZoningExceptionRaisedInSameScript) {
                toolTipText = toolTipText + '\n\n' + (this.props.isTeamManagementMode ?
                    localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.zoning-exceptions-icon-tooltip') :
                    localeStore.instance.TranslateText('marking.worklist.response-data.zoning-exceptions-icon-tooltip'));
            } else if (this.props.isZoningExceptionRaisedInSameScript) {
                toolTipText = this.props.isTeamManagementMode ?
                    localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.blocking-exceptions-icon-tooltip') :
                    localeStore.instance.TranslateText('marking.worklist.response-data.blocking-exceptions-icon-tooltip');
            } else {
                toolTipText = this.props.isTeamManagementMode ?
                    localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.zoning-exceptions-icon-tooltip') :
                    localeStore.instance.TranslateText('marking.worklist.response-data.zoning-exceptions-icon-tooltip');
            }
            exceptionClassName = 'sprite-icon info-icon-yellow';
        }

        /**
         * If exceptionAlertCount is greater than 0 notification will show
         */
        if (exceptionAlertCount > 0) {
            result = (!this.props.isTileView) ? <div className='wl-alert'
                id={this.props.id + '_execeptionIndicatorNotification'}>
                <a title={toolTipText} className='resp-alerts' onClick={this.onLinkedExceptionIconClick}>
                    <span className={exceptionClassName}> {exceptionAltText} </span>
                    <span className='notification circle' id={this.props.id + '_execeptionIndicatorNotification'} >
                        {localeHelper.toLocaleString(exceptionAlertCount)} </span>
                </a>
            </div> :
                <div className='col-inner'>
                    <a title={toolTipText} className='resp-alerts' onClick={this.onLinkedExceptionIconClick}>
                        <span className={exceptionClassName}> {exceptionAltText} </span>
                        <span className='notification circle' id={this.props.id + '_execeptionIndicatorNotification'} >
                            {localeHelper.toLocaleString(exceptionAlertCount)} </span>
                    </a>
                </div>;
        } else if (this.props.hasZoningExceptions && !this.props.hasExceptions) {
            result = (!this.props.isTileView) ? <div className='wl-alert'
                id={this.props.id + '_execeptionIndicatorNotification'}>
                <a title={toolTipText} className='resp-alerts' onClick={(e) => { e.stopPropagation(); }}>
                    <span className={exceptionClassName}> {exceptionAltText} </span>
                </a>
            </div>
                :
                <div className='col-inner'>
                    <a title={toolTipText} className='resp-alerts' onClick={(e) => { e.stopPropagation(); }}>
                        <span className={exceptionClassName}> {exceptionAltText} </span>
                    </a>
                </div>;
        } else {
            result = (!this.props.isTileView) ? <div className='wl-alert'
                id={this.props.id + '_execeptionIndicatorNotification'}>
                <a title={toolTipText} className='resp-alerts' onClick={this.onLinkedExceptionIconClick}>
                    <span className={exceptionClassName}> {exceptionAltText} </span>
                </a>
            </div>
                :
                <div className='col-inner'>
                    <a title={toolTipText} className='resp-alerts' onClick={this.onLinkedExceptionIconClick}>
                        <span className={exceptionClassName}> {exceptionAltText} </span>
                    </a>
                </div>;
        }
        return (result);
    }
}

export = LinkedExceptionIndicator;
