"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var GenericButton = require('../utility/genericbutton');
var qigStore = require('../../stores/qigselector/qigstore');
var enums = require('../utility/enums');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var localeStore = require('../../stores/locale/localestore');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var loginStore = require('../../stores/login/loginstore');
var navigationHelper = require('../utility/navigation/navigationhelper');
var responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
var applicationstore = require('../../stores/applicationoffline/applicationstore');
var applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
var classNames = require('classnames');
/**
 * React stateless component for QigItemActionColumn on qig selector
 */
var qigItemActionColumn = function (props) {
    /**
     * return the current qig
     */
    var getCurrentQIG = function () {
        return qigStore.instance.getOverviewData.qigSummary.filter(function (qig) {
            return qig.markSchemeGroupId === props.markSchemeGroupId;
        }).first();
    };
    /**
     * Do not show the My Marking Button in any of the following cases :
     * If Access Restriction is set to restrict Assessor 3
     * If QIG Status is Awaiting Standardisation.
     * If marking targets are not specified for the marker.
     *
     * returns boolean value indicating whether Marking will be enabled.
     */
    var doEnableMarking = function () {
        var currentQig = getCurrentQIG();
        return (props.isMarkingEnabled
            && currentQig.examinerQigStatus !== enums.ExaminerQIGStatus.WaitingStandardisation
            && currentQig.examinerQigStatus !== enums.ExaminerQIGStatus.AwaitingScripts
            && (currentQig.currentMarkingTarget != null || currentQig.isForAdminRemark));
    };
    /**
     * Method which gets called on the click of My Marking button of a QIG
     */
    var navigateToWorklistOnMarkingClick = function () {
        // set the marker operation mode as Marking
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
        // Reset the response mode to Open. to show the Open tab selected
        worklistActionCreator.responseModeChanged(enums.ResponseMode.open);
        // Invoke the action creator to Open the QIG
        qigSelectorActionCreator.openQIG(props.markSchemeGroupId);
        navigationHelper.loadWorklist();
    };
    /**
     * Method which gets called on the click of My Marking button of a QIG
     */
    var onMarkButtonClick = function (keyEvent) {
        if (!applicationstore.instance.isOnline) {
            applicationactioncreator.checkActionInterrupted();
        }
        else {
            if (loginStore.instance.isAdminRemarker && props.examinerRoleId === 0) {
                var createAdminRemarkerPromise = qigSelectorActionCreator.createAdminRemarkerRole(props.markSchemeGroupId, function () {
                    navigateToWorklistOnMarkingClick();
                });
            }
            else {
                navigateToWorklistOnMarkingClick();
            }
        }
    };
    var onTeamManagementButtonClick = function (keyEvent) {
        // Open Team Management data
        if (!applicationstore.instance.isOnline) {
            applicationactioncreator.checkActionInterrupted();
        }
        else {
            responseSearchHelper.
                openTeamManagementQIGDetails(props.examinerRoleId, props.markSchemeGroupId, props.questionPaperPartId, true);
        }
    };
    /**
     * return the components for the team management button
     * @param doRenderIcons
     * @param iconClass
     * @param toolTip
     */
    var getTeamManagementButtonComponents = function (doRenderIcons, iconClass, toolTip) {
        var teamManagementButton = React.createElement(GenericButton, {id: 'team_management_btn', key: 'key_team_management_btn', className: 'rounded btn-team-management', title: localeStore.instance.TranslateText('home.qig-data.team-management-button'), content: localeStore.instance.TranslateText('home.qig-data.team-management-button'), disabled: false, onClick: onTeamManagementButtonClick});
        if (doRenderIcons) {
            return (React.createElement("div", {className: 'stuck-lock-wrap'}, teamManagementButton, React.createElement("span", {className: iconClass, title: toolTip})));
        }
        return teamManagementButton;
    };
    /**
     * render team management button
     */
    var renderTeamManagementButton = function () {
        var currentQig = getCurrentQIG();
        var stuckIconClass = 'sprite-icon stuck-indicator-icon';
        var lockIconClass = 'sprite-icon lock-indicator-icon';
        var iconClass = '';
        var toolTip = '';
        if (currentQig.hasAnyLockedExaminers) {
            iconClass = lockIconClass;
            toolTip = localeStore.instance.TranslateText('home.qig-data.team-management-button-locked-examiners-tooltip');
        }
        else if (currentQig.hasAnyStuckExaminers) {
            iconClass = stuckIconClass;
            toolTip = localeStore.instance.TranslateText('home.qig-data.team-management-button-stuck-examiners-tooltip');
        }
        // iconClass will be '' when we dont need to render the icons
        return getTeamManagementButtonComponents(iconClass !== '', iconClass, toolTip);
    };
    /**
     * To check whether simulation marking is enabled with Standardisation
     */
    var isSimulationMarkingEnabledWithStandardisation = function () {
        var currentQig = getCurrentQIG();
        return props.isStandardisationSetupButtonVisible && currentQig.examinerQigStatus === enums.ExaminerQIGStatus.Simulation;
    };
    /**
     * Get the className for marking Button
     */
    var className = classNames('rounded', { 'primary': !isSimulationMarkingEnabledWithStandardisation() }, { 'btn-simulation-marking': isSimulationMarkingEnabledWithStandardisation() }, { 'btn-my-marking': !isSimulationMarkingEnabledWithStandardisation() });
    /**
     * doEnableMarking() : 30901 : Handling different states of My Marking button in QIG selector
     */
    var markingButton = doEnableMarking() ? (React.createElement(GenericButton, {id: 'marking_btn', key: 'key_marking_btn', className: className, title: isSimulationMarkingEnabledWithStandardisation() ?
        localeStore.instance.TranslateText('home.qig-data.simulation-marking-button') :
        localeStore.instance.TranslateText('home.qig-data.my-marking-button'), content: isSimulationMarkingEnabledWithStandardisation() ?
        localeStore.instance.TranslateText('home.qig-data.simulation-marking-button') :
        localeStore.instance.TranslateText('home.qig-data.my-marking-button'), disabled: false, onClick: onMarkButtonClick})) : null;
    var teamManagementButton = props.isTeamManagementEnabled ? renderTeamManagementButton() : null;
    return (React.createElement("div", {className: 'qig-col5 shift-right qig-col vertical-middle'}, React.createElement("div", {className: 'middle-content text-center'}, markingButton, teamManagementButton)));
};
module.exports = qigItemActionColumn;
//# sourceMappingURL=qigitemactioncolumn.js.map