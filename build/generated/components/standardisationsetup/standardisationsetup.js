"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var classNames = require('classnames');
var enums = require('../utility/enums');
var Header = require('../header');
var Footer = require('../footer');
var StandardisationSetupContainer = require('./standardisationsetupcontainer');
var StandardisationSetupLeftCollapsiblePanel = require('./standardisationleftcollapsiblepanel');
var standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var qigStore = require('../../stores/qigselector/qigstore');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
var GenericBlueHelper = require('../utility/banner/genericbluehelper');
var localeStore = require('../../stores/locale/localestore');
var stringHelper = require('../../utility/generic/stringhelper');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
var userOptionsStore = require('../../stores/useroption/useroptionstore');
var qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var stampStore = require('../../stores/stamp/stampstore');
var responseHelper = require('../utility/responsehelper/responsehelper');
var acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
var Promise = require('es6-promise');
var storageAdapterFactory = require('../../dataservices/storageadapters/storageadapterfactory');
var BusyIndicator = require('../utility/busyindicator/busyindicator');
var scriptStore = require('../../stores/script/scriptstore');
var StandardisationSetup = (function (_super) {
    __extends(StandardisationSetup, _super);
    /**
     * @constructor
     * @param props
     * @param state
     */
    function StandardisationSetup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Click event of the standardisation link
         * @param standardisationLinkType
         */
        this.onLinkClick = function (standardisationLinkType) {
            if (standardisationLinkType === enums.StandardisationSetup.SelectResponse) {
                standardisationsetupActionCreator.standardisationSetupWorkListSelection(standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            }
            if (standardisationLinkType === enums.StandardisationSetup.ProvisionalResponse) {
                standardisationsetupActionCreator.standardisationSetupWorkListSelection(standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            }
            if (standardisationLinkType === enums.StandardisationSetup.UnClassifiedResponse) {
                standardisationsetupActionCreator.standardisationSetupWorkListSelection(standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            }
            if (standardisationLinkType === enums.StandardisationSetup.ClassifiedResponse) {
                standardisationsetupActionCreator.standardisationSetupWorkListSelection(standardisationLinkType, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            }
        };
        /**
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isLogoutConfirmationPopupDisplaying: true });
        };
        /**
         * this will hide busy indicator after target details load.
         */
        this.hideBusyIndicator = function () {
            _this.setState({ isBusy: false });
        };
        /**
         * Set the link state logic for the left Panel
         */
        this.setLinkSelection = function () {
            _this.getSTDLinks();
        };
        /*
         * Generates the value for the standardisation setup
         */
        this.getSTDLinks = function () {
            var stdSetupPermissionCCValue = stdSetupPermissionHelper
                .getSTDSetupPermissionCCValueByMarkSchemeGroupId(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
            _this.stdLinks = [
                {
                    linkName: enums.StandardisationSetup.SelectResponse,
                    targetCount: null,
                    isVisible: true,
                    isSelected: enums.StandardisationSetup.SelectResponse === standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                },
                {
                    linkName: enums.StandardisationSetup.ProvisionalResponse,
                    targetCount: standardisationSetupStore.instance.standardisationTargetDetails !== undefined ?
                        standardisationSetupStore.instance.standardisationTargetDetails.provisionalCount : 0,
                    isVisible: true,
                    isSelected: enums.StandardisationSetup.ProvisionalResponse === standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                },
                {
                    linkName: enums.StandardisationSetup.UnClassifiedResponse,
                    targetCount: standardisationSetupStore.instance.standardisationTargetDetails !== undefined ?
                        standardisationSetupStore.instance.standardisationTargetDetails.unclassifiedCount : 0,
                    isVisible: _this.isStdWorklistVisible(stdSetupPermissionCCValue, enums.StandardisationSetup.UnClassifiedResponse),
                    isSelected: enums.StandardisationSetup.UnClassifiedResponse === standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                },
                {
                    linkName: enums.StandardisationSetup.ClassifiedResponse,
                    targetCount: standardisationSetupStore.instance.standardisationTargetDetails !== undefined ?
                        standardisationSetupStore.instance.standardisationTargetDetails.classifiedCount : 0,
                    isVisible: _this.isStdWorklistVisible(stdSetupPermissionCCValue, enums.StandardisationSetup.ClassifiedResponse),
                    isSelected: enums.StandardisationSetup.ClassifiedResponse === standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                }
            ];
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /*
         * Generates the value for the standardisation setup
         */
        this.onStandardisationDetailsReceived = function () {
            //persist busy indicator while redirecting to porvisional worklist when 'Marknow' button is clicked form unclassified worklist
            if (!standardisationSetupStore.instance.isDoMarkNow) {
                _this.hideBusyIndicator();
            }
            _this.standardisationTargetDetailList = _this.getClassificationSummaryTargetDetails();
            _this.getSTDLinks();
        };
        /*
         * Retrieve the classification summary target details
         */
        this.getClassificationSummaryTargetDetails = function () {
            return standardisationSetupStore.instance.classificationSummaryTargetDetails;
        };
        /*
         * Updates the standardisation target detail
         */
        this.setStandardisationTargetDetailList = function () {
            _this.standardisationTargetDetailList = standardisationSetupStore.instance.classificationSummaryTargetDetails;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Handle toggle event of recipient list.
         *
         */
        this.onLeftPanelCollapseOrExpand = function () {
            standardisationsetupActionCreator.leftPanelToggleSave(!_this.state.isLeftPanelCollapsed);
        };
        /**
         * Handle left panel toggle event
         *
         */
        this.onLeftPanelToggle = function () {
            _this.setState({
                isLeftPanelCollapsed: standardisationSetupStore.instance.isStandardisationLeftPanelCollapsed
            });
        };
        /**
         * Returns visiblity of std worklist's depends on stdSetupPermissionCC value.
         */
        this.isStdWorklistVisible = function (stdSetupPermissionCCvalue, worklistType) {
            var isVisible = false;
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
        };
        /*
         * Refreshes the current worklist of standardisation setup
         */
        this.refreshStandardisationSetup = function () {
            if (standardisationSetupStore.instance.iscompleteStandardisationSuccess) {
                storageAdapterFactory.getInstance().deleteData('standardisationSetup', 'centreList_' + qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId + '_' +
                    standardisationSetupStore.instance.examinerRoleId);
                storageAdapterFactory.getInstance().deleteData('qigselector', 'overviewdata');
                standardisationsetupActionCreator.getStandardisationTargetDetails(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
                var currentworklist = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
                _this.onLinkClick(currentworklist);
            }
        };
        /**
         * Set busy indicator when a QIG is selected
         */
        this.onQigSelection = function (isDataFromSearch, isDataFromHistory) {
            if (isDataFromSearch === void 0) { isDataFromSearch = false; }
            if (isDataFromHistory === void 0) { isDataFromHistory = false; }
            if (isDataFromHistory) {
                return;
            }
            // promise to get standardisation target details
            var getStandardisationTargetDetails = standardisationsetupActionCreator.getStandardisationTargetDetails(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            // promise to get markgroup cc
            var markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
            markSchemeStructureActionCreator.getmarkSchemeStructureList(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, false, true);
            // load imagezonelist
            imagezoneActionCreator.getImagezoneList(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, true);
            // Load the stamps against qig
            stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, stampStore.instance.stampIdsForSelectedQIG, qigStore.instance.selectedQIGForMarkerOperation.markingMethod, responseHelper.isEbookMarking, true);
            // Retrieves the acetates data only if not ebookmarking component.
            if (responseHelper.isOverlayAnnotationsVisible) {
                acetatesActionCreator.loadAcetatesData(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true);
            }
            // If the selected Standardisation Setup WorkList is none then navigate to select responses
            var selectedStandardisationSetupWorkList = standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.None ?
                enums.StandardisationSetup.SelectResponse :
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            var that = _this;
            Promise.Promise.all([markSchemeGroupCCPromise, getStandardisationTargetDetails]).
                then(function (item) {
                standardisationsetupActionCreator.getStandardisationSetupPermissionCCData(qigStore.instance.getSelectedQIGForTheLoggedInUser.role, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                // load select Responses details on coming from Home link
                standardisationsetupActionCreator.standardisationSetupWorkListSelection(selectedStandardisationSetupWorkList, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            });
        };
        /**
         * Get the Qig selector data once the header has been loaded
         */
        this.onUserOptionsLoaded = function () {
            qigActionCreator.getQIGSelectorData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, false, false, false, true, false);
        };
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
    }
    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    StandardisationSetup.prototype.render = function () {
        var busyIndicator = (React.createElement(BusyIndicator, {id: 'busyIndicator', key: 'busyIndicator', isBusy: this.state.isBusy, busyIndicatorInvoker: enums.BusyIndicatorInvoker.none}));
        var header = (React.createElement(Header, {selectedLanguage: this.props.selectedLanguage, isInTeamManagement: false, renderedOn: this.props.renderedOn, containerPage: enums.PageContainers.StandardisationSetup}));
        var footer = (React.createElement(Footer, {selectedLanguage: this.props.selectedLanguage, id: 'footer_std_setup', key: 'footer_std_setup', footerType: enums.FooterType.StandardisationSetup, isLogoutConfirmationPopupDisplaying: this.state.isLogoutConfirmationPopupDisplaying, resetLogoutConfirmationSatus: this.resetLogoutConfirmationSatus, isCompleteStandardisation: this.state.isCompleteStandardisationSetupClicked, OnClickingCancelofStdSetupPopup: this.OnCompleteStandardisationClick}));
        return (React.createElement("div", {className: classNames('std-setup-wrapper', this.state.isLeftPanelCollapsed ? 'hide-left' : '')}, header, footer, this.renderDetails(), busyIndicator));
    };
    /**
     * Render the details for the standardisation setup.
     */
    StandardisationSetup.prototype.renderDetails = function () {
        // Render all components for the standardisation setup.
        return (React.createElement("div", {className: 'content-wrapper'}, React.createElement(StandardisationSetupLeftCollapsiblePanel, {id: 'StandardisationLeftCollapsiblePanel', key: 'StandardisationLeftCollapsiblePanel-Key', availableStandardisationSetupLinks: this.stdLinks, standardisationTargetDetails: this.standardisationTargetDetailList, onLinkClick: this.onLinkClick, selectedLanguage: this.props.selectedLanguage, isCompleteButtonDisabled: this.isCompleteSetupButtonDisabled(), completeButtonToolTip: this.completeButtonBlueHelperMessage, hasCompletePermission: this.hasCompletePermission, onCompleteButtonClick: this.onCompleteButtonClick}), React.createElement(StandardisationSetupContainer, {id: 'StandardisationSetupContainer', key: 'StandardisationSetupContainer-Key', isFromMenu: false, selectedLanguage: this.props.selectedLanguage, toggleLeftPanel: this.onLeftPanelCollapseOrExpand, standardisationSetupWorkList: standardisationSetupStore.instance.selectedStandardisationSetupWorkList}), React.createElement(GenericBlueHelper, {id: 'completeSetupMessage', key: 'key_completeSetupMessage', message: this.completeButtonBlueHelperMessage, selectedLanguage: this.props.selectedLanguage, role: 'tooltip', isAriaHidden: false, bannerType: enums.BannerType.CompleteStdSetupBanner, header: null, isVisible: this.doShowBlueHelper})));
    };
    /**
     * Component did mount method
     */
    StandardisationSetup.prototype.componentDidMount = function () {
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.SET_PANEL_STATE, this.onLeftPanelToggle);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.setLinkSelection);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT, this.onStandardisationDetailsReceived);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.setStandardisationTargetDetailList);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQigSelection);
        userOptionsStore.instance.addListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.
            COMPLETE_STANDARDISATION_SETUP_EVENT, this.refreshStandardisationSetup);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.onStandardisationDetailsReceived);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.onStandardisationDetailsReceived);
        scriptStore.instance.addListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.hideBusyIndicator);
    };
    /**
     * Unmount method
     */
    StandardisationSetup.prototype.componentWillUnmount = function () {
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.SET_PANEL_STATE, this.onLeftPanelToggle);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.setLinkSelection);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT, this.onStandardisationDetailsReceived);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.setStandardisationTargetDetailList);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.onQigSelection);
        userOptionsStore.instance.removeListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.
            COMPLETE_STANDARDISATION_SETUP_EVENT, this.refreshStandardisationSetup);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.onStandardisationDetailsReceived);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.onStandardisationDetailsReceived);
        scriptStore.instance.removeListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.hideBusyIndicator);
    };
    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    StandardisationSetup.prototype.resetLogoutConfirmationSatus = function () {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    };
    /**
     * Returns whether the complete setup button is disabled.
     */
    StandardisationSetup.prototype.isCompleteSetupButtonDisabled = function () {
        var isDisabled = true;
        if (this.isMandatoryTargetsMet()
            && (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)) {
            isDisabled = false;
        }
        return isDisabled;
    };
    /**
     * Returns whether the mandatory targets are all met  i.e all targets except Seed and STM Seed and
     * no restricted targets have been exceeded
     */
    StandardisationSetup.prototype.isMandatoryTargetsMet = function () {
        var isTargetsMet = false;
        if (this.standardisationTargetDetailList !== undefined
            && this.standardisationTargetDetailList !== null) {
            for (var i = 0; i < this.standardisationTargetDetailList.count(); i++) {
                var target = this.standardisationTargetDetailList.get(i);
                // Targets of seed or STM seed need not be considered.
                if (target.markingModeId === enums.MarkingMode.Seeding || target.isstmSeed) {
                    isTargetsMet = true;
                }
                else if (target.target <= target.count && !this.isRestrictedTargetAndExceedsLimit(target)) {
                    isTargetsMet = true;
                }
                else {
                    isTargetsMet = false;
                    break;
                }
            }
        }
        return isTargetsMet;
    };
    /**
     * Checks if the target is restricted and exceed the limit or it.
     * @param standardisationTarget
     */
    StandardisationSetup.prototype.isRestrictedTargetAndExceedsLimit = function (standardisationTarget) {
        var restrictedTargets = standardisationSetupStore.instance.restrictSSUTargetsCCData;
        var isExceeding = false;
        if (restrictedTargets && restrictedTargets.count() > 0) {
            for (var i = 0; i < restrictedTargets.count(); i++) {
                if (standardisationTarget.markingModeId === restrictedTargets.get(i)
                    && standardisationTarget.count > standardisationTarget.target) {
                    isExceeding = true;
                    break;
                }
            }
        }
        return isExceeding;
    };
    Object.defineProperty(StandardisationSetup.prototype, "completeButtonBlueHelperMessage", {
        /**
         * Returns the complete button bluehelper or tooltip content.
         */
        get: function () {
            var text = null;
            if (this.isCompleteSetupButtonDisabled()) {
                var restrictedtargets = standardisationSetupStore.instance.restrictSSUTargetsCCData;
                if (restrictedtargets
                    && restrictedtargets.count() > 0
                    && this.doesExistInStandardisationTargets(restrictedtargets)) {
                    // When RestrictStandardisationSetupTargets CC is ON and atleast one of the targets is restricted.
                    var formattedText = stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-setup-helper-message-when-target-restriction-on'), [this.restrictedTargetNames(restrictedtargets)]);
                    text = formattedText;
                }
                else {
                    // When RestrictStandardisationSetupTargets CC is OFF
                    text = localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-setup-helper-message-when-target-restriction-off');
                }
            }
            return text;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a string with restricted target name separated by commas.
     * @param restrictedtargets
     */
    StandardisationSetup.prototype.restrictedTargetNames = function (restrictedTargets) {
        var targetNames = '';
        restrictedTargets.map(function (target, index) {
            targetNames = targetNames + ' ' + localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.' +
                enums.MarkingMode[target]);
            if (index !== restrictedTargets.count() - 1) {
                targetNames = targetNames + ',';
            }
        });
        return targetNames;
    };
    Object.defineProperty(StandardisationSetup.prototype, "doShowBlueHelper", {
        /**
         * Whether or not to show blue helper.
         */
        get: function () {
            return this.isCompleteSetupButtonDisabled()
                && userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true'
                && this.hasCompletePermission
                && this.standardisationTargetDetailList !== undefined
                && this.standardisationTargetDetailList !== null
                && !this.state.isLeftPanelCollapsed
                && (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetup.prototype, "hasCompletePermission", {
        /**
         * Checks whether the user has complete permission.
         */
        get: function () {
            if (standardisationSetupStore.instance.stdSetupPermissionCCData) {
                return standardisationSetupStore.instance.stdSetupPermissionCCData.
                    role.permissions.complete;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if atleast one of the existing standardisation  targets is labelled as restricted.
     * @param restrictedTargets
     */
    StandardisationSetup.prototype.doesExistInStandardisationTargets = function (restrictedTargets) {
        var _this = this;
        var doesExist = false;
        if (this.standardisationTargetDetailList) {
            var _loop_1 = function(i) {
                var filteredTargets = restrictedTargets.filter(function (target) {
                    return target === _this.standardisationTargetDetailList.get(i).markingModeId;
                });
                if (filteredTargets.count() > 0) {
                    doesExist = true;
                    return "break";
                }
            };
            for (var i = 0; i < this.standardisationTargetDetailList.count(); i++) {
                var state_1 = _loop_1(i);
                if (state_1 === "break") break;
            }
        }
        return doesExist;
    };
    /**
     * The Complete Setup Button Click
     */
    StandardisationSetup.prototype.onCompleteButtonClick = function () {
        this.OnCompleteStandardisationClick();
    };
    /**
     * The Complete Setup Button Click
     */
    StandardisationSetup.prototype.OnCompleteStandardisationClick = function (isNoClick) {
        if (isNoClick === void 0) { isNoClick = false; }
        this.setState({ isCompleteStandardisationSetupClicked: !isNoClick });
    };
    return StandardisationSetup;
}(pureRenderComponent));
module.exports = StandardisationSetup;
//# sourceMappingURL=standardisationsetup.js.map