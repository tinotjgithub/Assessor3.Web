/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
let classNames = require('classnames');
import NotificationCount = require('../../../message/notificationcount');
import MesageOrExceptionHolder = require('../../responsescreen/messageandexception/mesageorexceptionholder');
import exceptionStore = require('../../../../stores/exception/exceptionstore');
import qigStore = require('../../../../stores/qigselector/qigstore');
import responseStore = require('../../../../stores/response/responsestore');
import domManager = require('../../../../utility/generic/domhelper');
import enums = require('../../../utility/enums');
import exceptionHelper = require('../../../utility/exception/exceptionhelper');
import teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');
import responseHelper = require('../../../utility/responsehelper/responsehelper');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');
import worklistStore = require('../../../../stores/worklist/workliststore');
import markingHelper = require('../../../../utility/markscheme/markinghelper');
import markerOperationModeFacory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import popUpHelper = require('../../../utility/popup/popuphelper');
import markSchemeHelper = require('../../../../utility/markscheme/markschemehelper');
import loginStore = require('../../../../stores/login/loginstore');
import loginSession = require('../../../../app/loginsession');
import exceptionActionCreator = require('./../../../../actions/exception/exceptionactioncreator');
import applicationCreator = require('../../../../actions/applicationoffline/applicationactioncreator');
import storageAdapterhelper = require('../../../../dataservices/storageadapters/storageadapterhelper');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onExceptionSelected: Function;
    onCreateNewExceptionClicked: Function;
    canRaiseException?: boolean;
    hasUnManagedSLAO?: boolean;
    onRejectRigClick: Function;
    selectedResponseViewMode?: enums.ResponseViewMode;
    hasUnManagedImageZone?: boolean;
}

interface State {
    renderedOn: number;
    exceptionPanelOpen?: boolean;
}

class ExceptionIcon extends pureRenderComponent<Props, State> {
    private _boundHandleOnClick: EventListenerObject = null;
    private resolvedExceptionCount: number = 0;
    private unactionedExceptionCount: number = 0;
    private exceptionList: Immutable.List<ExceptionDetails>;
    private totalExceptionCount: number = 0;
    private selectedExceptionId: number;
    private _isRejectRigCCActive: boolean = false;
    private _rejectRigClicked: boolean = false;

    /**
     * Constructor for exception icons
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
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
    public componentDidMount() {
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

    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        // Removing subscription to the events
        window.removeEventListener('click', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.getExceptions);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.loadExceptionsAndNotification);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.RAISE_EXCEPTION, this.getExceptions);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.getExceptions);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.GET_LINKED_EXCEPTIONS, this.getLinkedExceptions);
        responseStore.instance.removeListener(responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT, this.rejectRigActionConfirmed);
        responseStore.instance.removeListener(responseStore.ResponseStore.REJECT_RIG_POPUP_DISPLAY_EVENT, this.showRejectRigPopUp);
	}

	/**
	 * Component did update
	 */
	public componentDidUpdate() {
		// set the scroll position to the top of exception list
		if (htmlUtilities.isFirefox) {
			htmlUtilities.setScrollTop('exception-contents', 0);
		}
	}

    /**
     * Render the expand icon in message
     */
    private renderExpandIcon() {
        if (this.totalExceptionCount > 0 || (this.doShowRejectThisResponse() && this._isRejectRigCCActive)) {
            return (<span className='sprite-icon toolexpand-icon'>Expand</span>);
        }
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        // The raise exceptions shall not be shown on opening a simulation response.
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.simulation) {
            return null;
        }
        let iconToRender;
        let iconToolTip;
        if (this.totalExceptionCount > 0 || (this.doShowRejectThisResponse() && this._isRejectRigCCActive)) {
            iconToRender = <use xlinkHref='#exception-icon'></use>;
            iconToolTip = this.props.hasUnManagedSLAO ?
                localeStore.instance.TranslateText('marking.full-response-view.problems-button-while-managing-slaos-tooltip') :
                localeStore.instance.TranslateText('marking.response.left-toolbar.problems-button-tooltip');
        } else if (this.props.canRaiseException) {
            iconToRender = <use xlinkHref='#new-exception-icon'></use>;
            iconToolTip = (this.props.hasUnManagedSLAO || this.props.hasUnManagedImageZone) ?
                localeStore.instance.TranslateText('marking.full-response-view.problems-button-while-managing-slaos-tooltip') :
                localeStore.instance.TranslateText('marking.response.exception-list-panel.raise-new-exception');
        }

        let menuButton = (<a className='menu-button'
            onClick={this.handleClick}
            title={iconToolTip}>
            <span className='svg-icon'>
                <svg viewBox='0 0 32 32' className='marking-exception-icon'>
                    <title>{iconToolTip}</title>
                    {iconToRender}
                </svg>
                <NotificationCount id='response-exception' key='response-exception'
                    unReadMessageCount={markerOperationModeFacory.operationMode.isTeamManagementMode ?
                        this.unactionedExceptionCount : this.resolvedExceptionCount} />
            </span>
            {this.renderExpandIcon()}
        </a>);

        let messageOrExceptionHolder = (<MesageOrExceptionHolder id='excp-resp-holder' key='excp-resp-holder'
            isMessageHolder={false}
            selectedItemId={this.selectedExceptionId}
            messages={this.exceptionList}
            onNewMessageOrExceptionClick={this.onNewMessageOrExceptionClick}
            onMessageOrExceptionItemSelected={this.onNewMessageOrExceptionItemClick}
            isNewMessageButtonHidden={false}
            canRaiseException={this.props.canRaiseException}
            onRejectRigClick={this.onRejectRigClick}
            doShowExceptionPanel={this.doShowExceptionPanel()}
            doShowRejectThisResponse={this.doShowRejectThisResponse()} />);
        if ((this.props.canRaiseException || this.totalExceptionCount > 0)
            && !this.props.hasUnManagedSLAO && !this.props.hasUnManagedImageZone
            && !teamManagementStore.instance.isRedirectFromException && !loginStore.instance.isAdminRemarker) {
            return (
                <li id={this.props.id} className={classNames('mrk-exception dropdown-wrap',
                    { 'open': this.state.exceptionPanelOpen })}>

                    {menuButton}
                    {messageOrExceptionHolder}

                </li>
            );
        } else if ((this.props.canRaiseException || this.totalExceptionCount > 0)
            && (this.props.hasUnManagedSLAO || this.props.hasUnManagedImageZone)
            && !teamManagementStore.instance.isRedirectFromException && !loginStore.instance.isAdminRemarker) {
            return (
                <div id={this.props.id} className={classNames('toggle-response-view raise-new-exception dropdown-wrap',
                    { 'open': this.state.exceptionPanelOpen })}>

                    {menuButton}
                    {messageOrExceptionHolder}

                </div>
            );
        } else {
            return null;
        }
    }

    /**
     * Click Event Of  Message or Exception item in the list.
     */
    private onNewMessageOrExceptionItemClick = (isMsg: boolean, itemId: number): void => {
        if (!isMsg) {
            this.props.onExceptionSelected(itemId);
            this.selectedExceptionId = 0;
            this.setState({
                renderedOn: Date.now(),
                exceptionPanelOpen: false
            });
        }
    };

    /**
     * Click Event Of new Message or Exception inside the list.
     */
    private onNewMessageOrExceptionClick = (isNewMsg: boolean): void => {
        if (!isNewMsg) {
            this.props.onCreateNewExceptionClicked();
            this.selectedExceptionId = 0;
            this.setState({
                renderedOn: Date.now(),
                exceptionPanelOpen: false
            });
        }
    };

    /**
     * Handles message icon click
     */
    private handleClick = (): void => {
        if (!applicationCreator.checkActionInterrupted()) {
            return;
        }

        if (this.totalExceptionCount > 0 || (this.doShowRejectThisResponse() && this._isRejectRigCCActive)) {
            this.selectedExceptionId = 0;
            this.setState({
                renderedOn: Date.now(),
                exceptionPanelOpen: !this.state.exceptionPanelOpen
            });
        } else {
            this.props.onCreateNewExceptionClicked();
        }
    };

    /**
     *  Handle exception list menu
     */
    private getLinkedExceptions = (exceptionId: number, exceptionCount: number): void => {
        this.props.onExceptionSelected(exceptionId);
        this.selectedExceptionId = exceptionId;
        this.setState({
            renderedOn: Date.now(),
            exceptionPanelOpen: (exceptionCount > 1)
        });
    };

    /**
     * Handle click events outside the zoom settings
     * @param {any} e - The source element
     */
    private handleClickOutsideElement = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the user details list item. if not close the open window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any) { return el.id === 'exception-button'; }) == null) {
            if (this.state.exceptionPanelOpen === true) {
                this.setState({
                    renderedOn: Date.now(),
                    exceptionPanelOpen: false
                });
            }
        }

        // both touchend and click event is fired one after other, 
        // this avoid resetting store in touchend
        if (this.state.exceptionPanelOpen !== undefined && e.type !== 'touchend') {
            exceptionActionCreator.isExceptionSidePanelOpen(this.state.exceptionPanelOpen);
        }
    };

    /**
     * Get exceptions of the response
     */
    private getExceptions() {
        if (this.props.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView ||
            this.props.hasUnManagedSLAO) {
            exceptionHelper.getNewExceptions(markerOperationModeFacory.operationMode.isTeamManagementMode,
                markerOperationModeFacory.operationMode.isAwardingMode);
        } else {
            this.loadExceptionsAndNotification();
        }
    }

    /**
     * Loads exception data and the resolved exception count, rerender the component
     * to show notification and the data list
     */
    private loadExceptionsAndNotification = (): void => {
        this.exceptionList = exceptionStore.instance.getExceptionData;
        // finding the resolved exception count in response
        this.resolvedExceptionCount = exceptionStore.instance.getResolvedExceptionDataCount;
        let responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        // finding the resolved exception count in worklist
        let resolvedExceptionsCountFromWorklist: number = responseData.resolvedExceptionsCount;
        if (this.exceptionList) {
            this.totalExceptionCount = this.exceptionList.count();
            if (markerOperationModeFacory.operationMode.isTeamManagementMode) {
                this.unactionedExceptionCount = this.exceptionList.count(x => x.ownerExaminerId === loginSession.EXAMINER_ID);
            } else if (resolvedExceptionsCountFromWorklist !== this.resolvedExceptionCount) {
                let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                // Need to refresh the exception data in response while comparing with resolved exception count in worklist.
                // call for clear cache.
                let cacheKey = '';
                let cacheValue = '';
                let _storageAdapterHelper = new storageAdapterhelper();
                cacheKey = 'ExceptionForResponse';
                cacheValue = 'Exception-Data-' + responseData.candidateScriptId +
                    responseStore.instance.selectedMarkGroupId
                    + markSchemeGroupId + false;
                _storageAdapterHelper.clearCacheByKey(
                    cacheKey,
                    cacheValue);
                // call the server for getting the exception data for response.
                exceptionHelper.getNewExceptions(markerOperationModeFacory.operationMode.isTeamManagementMode,
                    markerOperationModeFacory.operationMode.isAwardingMode, null, false, true);
            }
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Reject Rig icon click.
     */
    private onRejectRigClick = (): void => {
        this._rejectRigClicked = true;
        this.showRejectRigPopUp();
    };

    /*
     * Display RejectRig Confirmation popup
     */
    private showRejectRigPopUp = () => {
        if (this._rejectRigClicked) {
            this._rejectRigClicked = false;
            this.props.onRejectRigClick();
        }
    }

    /*
     * on reject rig confirmation click.
     */
    private rejectRigActionConfirmed = () => {
        let candidateScriptId: number = worklistStore.instance.getResponseDetails(
            responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
        let rejectRigArgument: RejectRigArgument = {
            markGroupId: responseStore.instance.selectedMarkGroupId,
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            candidateScriptId: candidateScriptId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerId: examinerStore.instance.getMarkerInformation.examinerId,
            displayId: responseStore.instance.selectedDisplayId,
            isWholeResponse: responseStore.instance.isWholeResponse
        };

        let isNextResponseAvailable: boolean =
            worklistStore.instance.isNextResponseAvailable(responseStore.instance.selectedDisplayId.toString());
        responseActionCreator.rejectRig(rejectRigArgument, isNextResponseAvailable);
        this.setState({
            renderedOn: Date.now(),
            exceptionPanelOpen: false
        });
    };

    /*
     * Determine visiblity of LHS exception panel when there are no exceptions.
     */
    private doShowExceptionPanel = (): boolean => {
        return !(this.totalExceptionCount > 0) && this._isRejectRigCCActive;
    }

    /**
     * Determines visiblity of Reject this response element.
     */
    private doShowRejectThisResponse = (): boolean => {
        let worklistType = worklistStore.instance.currentWorklistType;
        let responseMode = responseStore.instance.selectedResponseMode;
        let hasOpenOrResolvedException = exceptionStore.instance.getOpenOrResolvedExceptionCount > 0;
        return this._isRejectRigCCActive && ((worklistType === enums.WorklistType.live
            || worklistType === enums.WorklistType.atypical)
            && responseMode === enums.ResponseMode.open
            && !hasOpenOrResolvedException
            && !markerOperationModeFacory.operationMode.isTeamManagementMode);
    }
}

export = ExceptionIcon;