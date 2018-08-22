/*
  React component for Authorized BreadCrumb
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../components/base/purerendercomponent');
import loginSession = require('../../app/loginsession');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import enums = require('../utility/enums');
import navigationStore = require('../../stores/navigation/navigationstore');
import messageStore = require('../../stores/message/messagestore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import responseStore = require('../../stores/response/responsestore');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
import popupDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import markingStore = require('../../stores/marking/markingstore');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import navigationHelper = require('../../components/utility/navigation/navigationhelper');
import markingHelper = require('../../utility/markscheme/markinghelper');
import popupHelper = require('../../components/utility/popup/popuphelper');
import operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
import Logo = require('../utility/logo/logo');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import qigStore = require('../../stores/qigselector/qigstore');
import worklistStore = require('../../stores/worklist/workliststore');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    container: enums.PageContainers;
    isClickable: boolean;
    breadCrumbString?: string;
    navigateTo?: enums.PageContainers;
    isA3Logo?: boolean;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn?: number;
}

/**
 * React component class for BreadCrumb
 */
class BreadCrumbItem extends pureRenderComponent<Props, State> {

    private _loadCurrentExaminerWorklist: boolean = false;

    private storageAdapterHelper = new storageAdapterHelper();

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }

    /**
     * Render method
     */
    public render() {
        if (this.props.isA3Logo) {
            return (
                <li
                    className='breadcrumb-item dropdown-wrap header-dropdown'
                    id= {'li_' + this.props.id}
                    key= {'li_' + this.props.id + '_key'}>
                {this.renderLogo() }
                    </li>
            );
        } else {
            return (
                <li
                    className='breadcrumb-item'
                    id= {'li_' + this.props.id}
                    key= {'li_' + this.props.id + '_key'}>
                {this.renderBreadCrumbItem() }
                    </li>
            );
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED, this.navigateAwayFromResponse);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.MARKER_OPERATION_MODE_CHANGED, this.onMarkerOperationModeChange);
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED, this.navigateAwayFromResponse);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.MARKER_OPERATION_MODE_CHANGED, this.onMarkerOperationModeChange);
    }

    /**
     * This function will render breadcrumb items
     */
    private renderBreadCrumbItem(): JSX.Element {
        if (this.props.isClickable) {
            return (<a href='javascript:void(0)'
                id= {'a_' + this.props.id}
                onClick = {this.handleBreadCrumbClick.bind(this, this.props.container, this.props.navigateTo) }
                className='breadcrumb-anchor'>{this.props.breadCrumbString}</a>
            );
        } else {
            return (<span
                id= {'s_' + this.props.id }
                className='nav-text'>{this.props.breadCrumbString}</span>);
        }
    }

    /**
     * Handles the click
     * @param {any} source
     * @returns
     */
    private handleBreadCrumbClick = (pageContainer: enums.PageContainers, navigateTo: enums.PageContainers) => {

        switch (navigateTo) {
            case enums.PageContainers.Login:
                break;
            case enums.PageContainers.QigSelector:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
                break;
            case enums.PageContainers.WorkList:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                break;
            case enums.PageContainers.Response:
                break;
            case enums.PageContainers.Message:
				navigationHelper.handleNavigation(enums.SaveAndNavigate.toInboxMessagePage);
                break;
            case enums.PageContainers.TeamManagement:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toTeam);
                break;
            case enums.PageContainers.MarkingCheckExaminersWorkList:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toMarkingCheckWorklist);
                break;
            case enums.PageContainers.StandardisationSetup:
                navigationHelper.handleNavigation(this.navigateToForStandardisationSetupWorklist());
                break;
            case enums.PageContainers.Awarding:
                navigationHelper.loadAwardingPage(false);
                break;
        }
    };

    /**
     * Go out from response after saving mark if there is any
     */
    private navigateAwayFromResponse = (): void => {
        if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toWorklist ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toQigSelector ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toMenu ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toTeam ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toMarkingCheckWorklist ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toProvisional ||
			markingStore.instance.navigateTo === enums.SaveAndNavigate.toUnclassified ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toClassified ||
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toAwarding) {

            /** When navigated to '~/worklist', IsResponseClose is set in worklist which is used in the qig selector component
             * to get the current response mode
             */
            if (markingStore.instance.navigateTo !== enums.SaveAndNavigate.toMenu) {
                worklistActionCreator.responseClosed(true);
            }
            navigationHelper.loadContainerIfNeeded(enums.PageContainers.Response,
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
        }
    };

    /**
     * Go out from response after saving mark if there is any
     */
    private navigateToForStandardisationSetupWorklist = (): enums.SaveAndNavigate => {
        let selectedWorklist: enums.StandardisationSetup = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
        let saveAndNavigateTo: enums.SaveAndNavigate;
        switch (selectedWorklist) {
            case enums.StandardisationSetup.SelectResponse:
                saveAndNavigateTo = enums.SaveAndNavigate.toSelectResponses;
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                saveAndNavigateTo = enums.SaveAndNavigate.toUnclassified;
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                saveAndNavigateTo = enums.SaveAndNavigate.toClassified;
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                saveAndNavigateTo = enums.SaveAndNavigate.toProvisional;
                break;
        }

        return saveAndNavigateTo;
    };

    /**
     * This method will be invoked on marker operation mode change
     */
    private onMarkerOperationModeChange = (markerOperationMode: enums.MarkerOperationMode, loadCurrentExaminerWorklist: boolean): void => {
        // Marker clicked on worklist icon from TeamMangement worklist view we need to redirect
        // Logined examiners worklist
        if (loadCurrentExaminerWorklist && markerOperationMode === enums.MarkerOperationMode.Marking) {
            userInfoActionCreator.resetDoLoadWorklistStatus();
            // Invoke the action creator to Open the QIG
            qigSelectorActionCreator.openQIG(operationModeHelper.markSchemeGroupId);
        }
    };

    /**
     * This method will render the logo based on login- Familiarisation/ Marking
     */
    private renderLogo() {
        if (loginSession.IS_FAMILIARISATION_LOGIN || loginSession.IS_SUPPORT_ADMIN_LOGIN) {
            let logoText: string;
            let id: string;
            let key: string;
            if (loginSession.IS_FAMILIARISATION_LOGIN) {
                logoText = 'login.login-page.fam-button';
                id = 'fam-logo-text';
                key = 'fam-logo-text-key';
            }else { //Support Login
                logoText = 'login.login-page.support-admin-logo-text';
                id = 'support-admin-logo-text';
                key = 'support-admin-text-key';
            }
            return (<Logo
                id={id}
                key={key}
                onLogoClick={navigationHelper.handleNavigation.bind(this, enums.SaveAndNavigate.toQigSelector)}
                isFAMorSupportLogin={true}
                logoText={logoText}/>);
        } else if (this.props.isClickable) {
            return (<Logo
                id='assessor-logo' key='assessor-logo-key'
                onLogoClick={navigationHelper.handleNavigation.bind(this, enums.SaveAndNavigate.toQigSelector)} />);
        } else {
            return (<Logo
                id='assessor-logo'
                key='assessor-logo-key' />);
        }
    }
}

export = BreadCrumbItem;