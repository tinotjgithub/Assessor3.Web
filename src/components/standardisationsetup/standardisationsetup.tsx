import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import classNames = require('classnames');
import enums = require('../utility/enums');
import Header = require('../header');
import Footer = require('../footer');
import StandardisationSetupContainer = require('./standardisationsetupcontainer');
import StandardisationSetupLeftCollapsiblePanel = require('./standardisationleftcollapsiblepanel');
import StandardisationLink = require('./typings/standardisationlink');
import standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import qigStore = require('../../stores/qigselector/qigstore');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import stdSetupPermissionCCData = require('../../stores/standardisationsetup/typings/standardisationsetupccdata');
import standardisationTargetDetail = require('../../stores/standardisationsetup/typings/standardisationtargetdetail');
import stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
import GenericBlueHelper = require('../utility/banner/genericbluehelper');
import localeStore = require('../../stores/locale/localestore');
import stringHelper = require('../../utility/generic/stringhelper');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
import userOptionsStore = require('../../stores/useroption/useroptionstore');
import qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import stampStore = require('../../stores/stamp/stampstore');
import responseStore = require('../../stores/response/responsestore');
import responseHelper = require('../utility/responsehelper/responsehelper');
import acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
import Promise = require('es6-promise');
import storageAdapterFactory = require('../../dataservices/storageadapters/storageadapterfactory');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import scriptStore = require('../../stores/script/scriptstore');
import responseSearchhelper = require('../../utility/responsesearch/responsesearchhelper');
import qigSelectorValidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import standardisationSetupHelper = require('../../utility/standardisationsetup/standardisationsetuphelper');
import standardisationSetupFactory = require('../../utility/standardisationsetup/standardisationsetupfactory');

interface Props extends LocaleSelectionBase, PropsBase {
    renderedOn?: number;
    isFromMenu?: boolean;
}

interface State {
    isLeftPanelCollapsed?: boolean;
    isLogoutConfirmationPopupDisplaying?: boolean;
    renderedOn?: number;
    selectedWorkList?: number;
    isCompleteStandardisationSetupClicked?: boolean;
    isBusy: boolean;
}

class StandardisationSetup extends pureRenderComponent<Props, State> {

    private stdLinks: Array<StandardisationLink>;
    private stdSetupPermissionCCData: stdSetupPermissionCCData;
    private standardisationTargetDetailList: Immutable.List<standardisationTargetDetail>;
    private standardisationSetupHelper : standardisationSetupHelper;

    /**
     * @constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isLeftPanelCollapsed: standardisationSetupStore.instance.isStandardisationLeftPanelCollapsed,
            renderedOn: this.props.renderedOn,
            selectedWorkList: standardisationSetupStore.instance.selectedStandardisationSetupWorkList,
            isBusy: true
        };
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
        this.refreshStandardisationSetup = this.refreshStandardisationSetup.bind(this);
        this.onCompleteButtonClick = this.onCompleteButtonClick.bind(this);
        this.OnCompleteStandardisationClick = this.OnCompleteStandardisationClick.bind(this);
        this.reuseRigActionCompletedEvent = this.reuseRigActionCompletedEvent.bind(this);
    }

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    public render(): JSX.Element {
        let busyIndicator = (
            <BusyIndicator
                id='busyIndicator'
                key='busyIndicator'
                isBusy={this.state.isBusy}
                busyIndicatorInvoker={enums.BusyIndicatorInvoker.none} />);

        let header = (
            <Header selectedLanguage={this.props.selectedLanguage}
                isInTeamManagement={false}
                renderedOn={this.props.renderedOn}
                containerPage={enums.PageContainers.StandardisationSetup} />
        );

        let footer = (<Footer selectedLanguage={this.props.selectedLanguage}
            id={'footer_std_setup'} key={'footer_std_setup'}
            footerType={enums.FooterType.StandardisationSetup}
            isLogoutConfirmationPopupDisplaying={this.state.isLogoutConfirmationPopupDisplaying}
            resetLogoutConfirmationSatus={this.resetLogoutConfirmationSatus}
            isCompleteStandardisation = {this.state.isCompleteStandardisationSetupClicked}
            OnClickingCancelofStdSetupPopup={this.OnCompleteStandardisationClick}
             />);

        return (
            <div className={classNames('std-setup-wrapper', this.state.isLeftPanelCollapsed ? 'hide-left' : '')}>
                {header}
                {footer}
                {this.renderDetails()}
                {busyIndicator}
            </div>);
    }

    /**
     * Render the details for the standardisation setup.
     */
    private renderDetails() {
        // Render all components for the standardisation setup.
        return (
            <div className='content-wrapper'>
                <StandardisationSetupLeftCollapsiblePanel
                    id={'StandardisationLeftCollapsiblePanel'}
                    key={'StandardisationLeftCollapsiblePanel-Key'}
                    availableStandardisationSetupLinks={this.stdLinks}
                    standardisationTargetDetails={this.standardisationTargetDetailList}
                    onLinkClick={this.onLinkClick}
                    selectedLanguage={this.props.selectedLanguage}
                    isCompleteButtonDisabled={this.isCompleteSetupButtonDisabled()}
                    completeButtonToolTip={this.completeButtonBlueHelperMessage}
                    hasCompletePermission={this.hasCompletePermission}
                    onCompleteButtonClick={this.onCompleteButtonClick}/>
                <StandardisationSetupContainer id={'StandardisationSetupContainer'}
                    key={'StandardisationSetupContainer-Key'}
                    isFromMenu={false}
                    selectedLanguage={this.props.selectedLanguage}
                    toggleLeftPanel={this.onLeftPanelCollapseOrExpand}
                    standardisationSetupWorkList={standardisationSetupStore.instance.selectedStandardisationSetupWorkList}
                />
                <GenericBlueHelper
                    id={'completeSetupMessage'}
                    key={'key_completeSetupMessage'}
                    message={this.completeButtonBlueHelperMessage}
                    selectedLanguage={this.props.selectedLanguage}
                    role={'tooltip'}
                    isAriaHidden={false}
                    bannerType={enums.BannerType.CompleteStdSetupBanner}
                    header={null}
                    isVisible={this.doShowBlueHelper} />
            </div>
        );
    }


    /**
     * Click event of the standardisation link
     * @param standardisationLinkType
     */
    private onLinkClick = (standardisationLinkType: enums.StandardisationSetup): void => {
        if (standardisationLinkType === enums.StandardisationSetup.SelectResponse) {
            standardisationsetupActionCreator.standardisationSetupWorkListSelection
                (standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId);
        }
        if (standardisationLinkType === enums.StandardisationSetup.ProvisionalResponse) {
            standardisationsetupActionCreator.standardisationSetupWorkListSelection
                (standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId);
        }
        if (standardisationLinkType === enums.StandardisationSetup.UnClassifiedResponse) {
            standardisationsetupActionCreator.standardisationSetupWorkListSelection
                (standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId);
        }
        if (standardisationLinkType === enums.StandardisationSetup.ClassifiedResponse) {
            standardisationsetupActionCreator.standardisationSetupWorkListSelection
                (standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId);
        }
    }

    /**
     * Component did mount method
     */
    public componentDidMount() {
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.SET_PANEL_STATE,
            this.onLeftPanelToggle);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.setLinkSelection);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT,
            this.onStandardisationDetailsReceived);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.setStandardisationTargetDetailList);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT,
                this.onQigSelection);
        userOptionsStore.instance.addListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.
            COMPLETE_STANDARDISATION_SETUP_EVENT,
			this.refreshStandardisationSetup);

		standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.onStandardisationDetailsReceived);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT,
            this.onStandardisationDetailsReceived);
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.hideBusyIndicator);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);

    }

    /**
     * Unmount method
     */
    public componentWillUnmount() {
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.SET_PANEL_STATE,
            this.onLeftPanelToggle);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.setLinkSelection);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT,
            this.onStandardisationDetailsReceived);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.setStandardisationTargetDetailList);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT,
                this.onQigSelection);
        userOptionsStore.instance.removeListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT,
            this.onUserOptionsLoaded);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.
            COMPLETE_STANDARDISATION_SETUP_EVENT,
			this.refreshStandardisationSetup);

		standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.onStandardisationDetailsReceived);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT,
            this.onStandardisationDetailsReceived);

        scriptStore.instance.removeListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.hideBusyIndicator);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);
    }

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    private resetLogoutConfirmationSatus(): void {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    }

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private showLogoutConfirmation = (): void => {
        this.setState({ isLogoutConfirmationPopupDisplaying: true });
    };

    /**
     * this will hide busy indicator after target details load.
     */
    private hideBusyIndicator = (): void => {
        this.setState({ isBusy: false });
    };

    /**
     * Rerender when reuse rig action completed
     */
    private reuseRigActionCompletedEvent() {
        this.standardisationTargetDetailList = this.getClassificationSummaryTargetDetails();
        this.getSTDLinks();
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Set the link state logic for the left Panel
     */
    private setLinkSelection = (): void => {
        this.getSTDLinks();
    };

    /*
     * Generates the value for the standardisation setup
     */
    private getSTDLinks = (): void => {
        let stdSetupPermissionCCValue: string = stdSetupPermissionHelper
            .getSTDSetupPermissionCCValueByMarkSchemeGroupId(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
        if (qigStore.instance.isQigHasBrowseScriptPermissionOnly(qigStore.instance.selectedQIGForMarkerOperation)){
                this.stdLinks = [
                    {
                        linkName: enums.StandardisationSetup.SelectResponse,
                        targetCount: null,
                        isVisible: true,
                        isSelected:
                        enums.StandardisationSetup.SelectResponse ===
                        standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                    }];
            } else {
                this.stdLinks = [
                    {
                        linkName: enums.StandardisationSetup.SelectResponse,
                        targetCount: null,
                        isVisible: this.isSelectResponseslistVisible(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId),
                        isSelected: standardisationSetupStore.instance.isSelectResponsesWorklist
                    },
                    {
                        linkName: enums.StandardisationSetup.ProvisionalResponse,
                        targetCount: standardisationSetupStore.instance.standardisationTargetDetails !== undefined ?
                            standardisationSetupStore.instance.standardisationTargetDetails.provisionalCount : 0,
                        isVisible: true,
                        isSelected: standardisationSetupStore.instance.isProvisionalWorklist
                    },
                    {
                        linkName: enums.StandardisationSetup.UnClassifiedResponse,
                        targetCount: standardisationSetupStore.instance.standardisationTargetDetails !== undefined ?
                            standardisationSetupStore.instance.standardisationTargetDetails.unclassifiedCount : 0,
                        isVisible: this.isStdWorklistVisible(stdSetupPermissionCCValue, enums.StandardisationSetup.UnClassifiedResponse),
                        isSelected: standardisationSetupStore.instance.isUnClassifiedWorklist
                    },
                    {
                        linkName: enums.StandardisationSetup.ClassifiedResponse,
                        targetCount: standardisationSetupStore.instance.standardisationTargetDetails !== undefined ?
                            standardisationSetupStore.instance.standardisationTargetDetails.classifiedCount : 0,
                        isVisible: this.isStdWorklistVisible(stdSetupPermissionCCValue, enums.StandardisationSetup.ClassifiedResponse),
                        isSelected: standardisationSetupStore.instance.isClassifiedWorklist
                    }
                ];
            }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /*
     * Generates the value for the standardisation setup
     */
    private onStandardisationDetailsReceived = (): void => {
        //persist busy indicator while redirecting to porvisional worklist when 'Marknow' button is clicked form unclassified worklist
        if (!standardisationSetupStore.instance.isDoMarkNow){
            this.hideBusyIndicator();
        }
        this.standardisationTargetDetailList = this.getClassificationSummaryTargetDetails();
        this.getSTDLinks();
    }

    /*
     * Retrieve the classification summary target details
     */
    private getClassificationSummaryTargetDetails = (): Immutable.List<standardisationTargetDetail> => {
        return standardisationSetupStore.instance.classificationSummaryTargetDetails;
    }

    /*
     * Updates the standardisation target detail
     */
    private setStandardisationTargetDetailList = (): void => {
        this.standardisationTargetDetailList = standardisationSetupStore.instance.classificationSummaryTargetDetails;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Handle toggle event of recipient list.
     *
     */
    private onLeftPanelCollapseOrExpand = () => {
        standardisationsetupActionCreator.leftPanelToggleSave(!this.state.isLeftPanelCollapsed);
    };


    /**
     * Handle left panel toggle event
     *
     */
    private onLeftPanelToggle = (): void => {
        this.setState({
            isLeftPanelCollapsed: standardisationSetupStore.instance.isStandardisationLeftPanelCollapsed
        });
    };

    /**
     * Returns visiblity of std worklist's depends on stdSetupPermissionCC value.
     */
    private isStdWorklistVisible = (stdSetupPermissionCCvalue: string, worklistType: enums.StandardisationSetup): boolean => {
        let isVisible: boolean = false;
        if (stdSetupPermissionCCvalue !== '' && standardisationSetupStore.instance.stdSetupPermissionCCData) {
            switch (worklistType) {
                case enums.StandardisationSetup.UnClassifiedResponse:
                    isVisible = standardisationSetupStore.instance.
                        stdSetupPermissionCCData.role.viewByClassification.views.unclassified ? true : false;
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    isVisible = standardisationSetupStore.instance.
                        stdSetupPermissionCCData.role.viewByClassification.views.classified ? true : false;
                    break;
            }
        }
        return isVisible;
    }

    /**
     * Returns visiblity Select Responses list.
     */
    private isSelectResponseslistVisible(markSchemeGroupId: number): boolean {
        let cpsCCValue = configurableCharacteristicsHelper.getCharacteristicValue
            (configurableCharacteristicsNames.CommonProvisionalStandardisation, markSchemeGroupId);
        let stdSetupPermissionCCValue = stdSetupPermissionHelper.getSTDSetupPermissionCCValueByMarkSchemeGroupId(markSchemeGroupId);
        if (cpsCCValue === 'true' && stdSetupPermissionCCValue &&
            !standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewCommonProvisionalAvailableResponses) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Returns whether the complete setup button is disabled.
     */
    private isCompleteSetupButtonDisabled(): boolean {
        let isDisabled: boolean = true;
        if (this.isMandatoryTargetsMet()
            && (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)
            && this.isRequiredTargetsMet()) {
            isDisabled = false;
        }
        return isDisabled;
    }

    /**
     * Returns whether the mandatory targets are all met  i.e all targets except Seed and STM Seed and
     * no restricted targets have been exceeded
     */
    private isMandatoryTargetsMet(): boolean {
        let isTargetsMet: boolean = false;
        if (this.standardisationTargetDetailList !== undefined
            && this.standardisationTargetDetailList !== null) {
            for (let i = 0; i < this.standardisationTargetDetailList.count(); i++) {
                let target: standardisationTargetDetail = this.standardisationTargetDetailList.get(i);
                // Targets of seed or STM seed need not be considered.
                if (target.markingModeId === enums.MarkingMode.Seeding || target.isstmSeed) {
                    isTargetsMet = true;
                } else if (target.target <= target.count && !this.isRestrictedTargetAndExceedsLimit(target)) {
                    isTargetsMet = true;
                } else if (this.isRequiredTarget(target.markingModeId)) {
                    isTargetsMet = false;
                    break;
                }
            }
        }
        return isTargetsMet;
    }

    /**
     * Checks whether the required targets are met or not.
     */
    private isRequiredTargetsMet(): boolean {
        let isTargetsMet: boolean = false;
        let requiredTargets: Immutable.List<enums.MarkingMode>;
        this.standardisationSetupHelper = standardisationSetupFactory.
            getStandardisationSetUpWorklistHelper(standardisationSetupStore.instance.selectedStandardisationSetupWorkList);
        if (this.standardisationSetupHelper !== undefined) {
            requiredTargets = this.standardisationSetupHelper.getStandardisationSetupRequiredTargets();
        }
        if (requiredTargets && requiredTargets.count() > 0 && this.standardisationTargetDetailList !== undefined
            && this.standardisationTargetDetailList !== null) {
            for (let i = 0; i < requiredTargets.count(); i++) {
                if (this.standardisationTargetDetailList.filter
                    ((x: standardisationTargetDetail) => x.markingModeId === requiredTargets.get(i)
                        && x.count === x.target)) {
                    isTargetsMet = true;
                } else {
                    return false;
                }
            }
        }

        return isTargetsMet;
    }

    /**
     * Checks if the target is restricted and exceed the limit or it.
     * @param standardisationTarget
     */
    private isRestrictedTargetAndExceedsLimit(standardisationTarget: standardisationTargetDetail): boolean {
        let restrictedTargets: Immutable.List<enums.MarkingMode> = standardisationSetupStore.instance.restrictSSUTargetsCCData;

        let isExceeding: boolean = false;
        if (restrictedTargets && restrictedTargets.count() > 0) {
            for (let i = 0; i < restrictedTargets.count(); i++) {
                if (standardisationTarget.markingModeId === restrictedTargets.get(i)
                    && standardisationTarget.count > standardisationTarget.target
                    && this.isRequiredTarget(restrictedTargets.get(i))) {
                    isExceeding = true;
                    break;
                }
            }
        }
        return isExceeding;
    }

    /**
     * Checks if the target is required.
     * @param target
     */
    private isRequiredTarget(target: enums.MarkingMode): boolean {
        let requiredTargets: Immutable.List<enums.MarkingMode>;
        this.standardisationSetupHelper = standardisationSetupFactory.
            getStandardisationSetUpWorklistHelper(standardisationSetupStore.instance.selectedStandardisationSetupWorkList);
        if (this.standardisationSetupHelper !== undefined) {
            requiredTargets = this.standardisationSetupHelper.getStandardisationSetupRequiredTargets();
        }

        if (requiredTargets && requiredTargets.contains(target)) {
            return true;
        }

        return false;
    }

    /**
     * Returns the complete button bluehelper or tooltip content.
     */
    private get completeButtonBlueHelperMessage(): string {
        let text: string = null;
        if (this.isCompleteSetupButtonDisabled()) {
            let restrictedtargets = standardisationSetupStore.instance.restrictSSUTargetsCCData;
            if (restrictedtargets
                && restrictedtargets.count() > 0
                && this.doesExistInStandardisationTargets(restrictedtargets)) {
                // When RestrictStandardisationSetupTargets CC is ON and atleast one of the targets is restricted.
                let formattedText: string = stringHelper.format(
                    localeStore.instance.TranslateText(
                        'standardisation-setup.left-panel.complete-setup-helper-message-when-target-restriction-on'
                    ),
                    [this.restrictedTargetNames(restrictedtargets)]
                );
                text = formattedText;
            } else {
                // When RestrictStandardisationSetupTargets CC is OFF
                text = localeStore.instance.TranslateText(
                    'standardisation-setup.left-panel.complete-setup-helper-message-when-target-restriction-off');
            }
        }
        return text;
    }

    /**
     * Returns a string with restricted target name separated by commas.
     * @param restrictedtargets
     */
    private restrictedTargetNames(restrictedTargets: Immutable.List<enums.MarkingMode>): string {
        let targetNames: string = '';
        restrictedTargets.map((target: enums.MarkingMode, index: number) => {
            targetNames = targetNames + ' ' + localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.classification-type.' +
                enums.MarkingMode[target]);
            if (index !== restrictedTargets.count() - 1) {
                targetNames = targetNames + ',';
            }
        });
        return targetNames;
    }

    /**
     * Whether or not to show blue helper.
     */
    private get doShowBlueHelper(): boolean {
        return this.isCompleteSetupButtonDisabled()
            && userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true'
            && this.hasCompletePermission
            && this.standardisationTargetDetailList !== undefined
            && this.standardisationTargetDetailList !== null
            && !this.state.isLeftPanelCollapsed
            && (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete);
    }


    /**
     * Checks whether the user has complete permission.
     */
    private get hasCompletePermission(): boolean {
        if (standardisationSetupStore.instance.stdSetupPermissionCCData) {
            return standardisationSetupStore.instance.stdSetupPermissionCCData.
                role.permissions.complete;
        }
        return false;
    }

    /*
     * Refreshes the current worklist of standardisation setup
     */
    private refreshStandardisationSetup = (): void => {
        if (standardisationSetupStore.instance.iscompleteStandardisationSuccess) {
            storageAdapterFactory.getInstance().deleteData('standardisationSetup'
            , 'centreList_' + qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId + '_' +
            standardisationSetupStore.instance.examinerRoleId);
            storageAdapterFactory.getInstance().deleteData('qigselector', 'overviewdata');
            standardisationsetupActionCreator.getStandardisationTargetDetails
                (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                standardisationSetupStore.instance.examinerRoleId);
            let currentworklist = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            this.onLinkClick(currentworklist);
        } else {
            this.setState({ isCompleteStandardisationSetupClicked: false });
        }
    }
    /**
     * Checks if atleast one of the existing standardisation  targets is labelled as restricted.
     * @param restrictedTargets
     */
    private doesExistInStandardisationTargets(restrictedTargets: Immutable.List<enums.MarkingMode>): boolean {
        let doesExist: boolean = false;
        if (this.standardisationTargetDetailList) {
            for (let i = 0; i < this.standardisationTargetDetailList.count(); i++) {
                let filteredTargets = restrictedTargets.filter((target: enums.MarkingMode) =>
                    target === this.standardisationTargetDetailList.get(i).markingModeId
                );
                if (filteredTargets.count() > 0) {
                    doesExist = true;
                    break;
                }
            }
        }
        return doesExist;
    }

    /**
     * Set worklist data for opening responses.
     */
    private onQigSelection = (isDataFromSearch: boolean = false, isDataFromHistory: boolean = false): void => {
        if (isDataFromHistory) {
            return;
        }

        responseSearchhelper.getStandardisationSetupQigDetails(isDataFromSearch, isDataFromHistory);
    }

        /**
         * Get the Qig selector data once the header has been loaded
         */
        private onUserOptionsLoaded = () => {
            qigActionCreator.getQIGSelectorData
                (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId , false, false, false, false, true,
                false);
        }

    /**
     * The Complete Setup Button Click       
     */
        private onCompleteButtonClick(): void {
            this.OnCompleteStandardisationClick();
        }
    /**
     * The Complete Setup Button Click       
     */
        private OnCompleteStandardisationClick(isNoClick : boolean = false) {
            this.setState({ isCompleteStandardisationSetupClicked: !isNoClick });
        }

}
export = StandardisationSetup;