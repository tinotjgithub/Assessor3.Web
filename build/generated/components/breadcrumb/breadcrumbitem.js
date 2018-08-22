"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Authorized BreadCrumb
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../components/base/purerendercomponent');
var loginSession = require('../../app/loginsession');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var enums = require('../utility/enums');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var markingStore = require('../../stores/marking/markingstore');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var navigationHelper = require('../../components/utility/navigation/navigationhelper');
var operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
var Logo = require('../utility/logo/logo');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
/**
 * React component class for BreadCrumb
 */
var BreadCrumbItem = (function (_super) {
    __extends(BreadCrumbItem, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function BreadCrumbItem(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._loadCurrentExaminerWorklist = false;
        this.storageAdapterHelper = new storageAdapterHelper();
        /**
         * Handles the click
         * @param {any} source
         * @returns
         */
        this.handleBreadCrumbClick = function (pageContainer, navigateTo) {
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
                    break;
                case enums.PageContainers.TeamManagement:
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toTeam);
                    break;
                case enums.PageContainers.MarkingCheckExaminersWorkList:
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toMarkingCheckWorklist);
                    break;
                case enums.PageContainers.StandardisationSetup:
                    navigationHelper.handleNavigation(_this.navigateToForStandardisationSetupWorklist());
                    break;
            }
        };
        /**
         * Go out from response after saving mark if there is any
         */
        this.navigateAwayFromResponse = function () {
            if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toWorklist ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toQigSelector ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toMenu ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toTeam ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toMarkingCheckWorklist ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toProvisional ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toUnclassified ||
                markingStore.instance.navigateTo === enums.SaveAndNavigate.toClassified) {
                /** When navigated to '~/worklist', IsResponseClose is set in worklist which is used in the qig selector component
                 * to get the current response mode
                 */
                if (markingStore.instance.navigateTo !== enums.SaveAndNavigate.toMenu) {
                    worklistActionCreator.responseClosed(true);
                }
                navigationHelper.loadContainerIfNeeded(enums.PageContainers.Response, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
            }
        };
        /**
         * Go out from response after saving mark if there is any
         */
        this.navigateToForStandardisationSetupWorklist = function () {
            var selectedWorklist = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            var saveAndNavigateTo;
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
        this.onMarkerOperationModeChange = function (markerOperationMode, loadCurrentExaminerWorklist) {
            // Marker clicked on worklist icon from TeamMangement worklist view we need to redirect
            // Logined examiners worklist
            if (loadCurrentExaminerWorklist && markerOperationMode === enums.MarkerOperationMode.Marking) {
                userInfoActionCreator.resetDoLoadWorklistStatus();
                // Invoke the action creator to Open the QIG
                qigSelectorActionCreator.openQIG(operationModeHelper.markSchemeGroupId);
            }
        };
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render method
     */
    BreadCrumbItem.prototype.render = function () {
        if (this.props.isA3Logo) {
            return (React.createElement("li", {className: 'breadcrumb-item dropdown-wrap header-dropdown', id: 'li_' + this.props.id, key: 'li_' + this.props.id + '_key'}, this.renderLogo()));
        }
        else {
            return (React.createElement("li", {className: 'breadcrumb-item', id: 'li_' + this.props.id, key: 'li_' + this.props.id + '_key'}, this.renderBreadCrumbItem()));
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    BreadCrumbItem.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED, this.navigateAwayFromResponse);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.MARKER_OPERATION_MODE_CHANGED, this.onMarkerOperationModeChange);
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    BreadCrumbItem.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED, this.navigateAwayFromResponse);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.MARKER_OPERATION_MODE_CHANGED, this.onMarkerOperationModeChange);
    };
    /**
     * This function will render breadcrumb items
     */
    BreadCrumbItem.prototype.renderBreadCrumbItem = function () {
        if (this.props.isClickable) {
            return (React.createElement("a", {href: 'javascript:void(0)', id: 'a_' + this.props.id, onClick: this.handleBreadCrumbClick.bind(this, this.props.container, this.props.navigateTo), className: 'breadcrumb-anchor'}, this.props.breadCrumbString));
        }
        else {
            return (React.createElement("span", {id: 's_' + this.props.id, className: 'nav-text'}, this.props.breadCrumbString));
        }
    };
    /**
     * This method will render the logo based on login- Familiarisation/ Marking
     */
    BreadCrumbItem.prototype.renderLogo = function () {
        if (loginSession.IS_FAMILIARISATION_LOGIN === true) {
            return (React.createElement(Logo, {id: 'fam-logo-text', key: 'fam-logo-text-key', onLogoClick: navigationHelper.handleNavigation.bind(this, enums.SaveAndNavigate.toQigSelector), isFamiliarisation: true}));
        }
        else if (this.props.isClickable) {
            return (React.createElement(Logo, {id: 'assessor-logo', key: 'assessor-logo-key', onLogoClick: navigationHelper.handleNavigation.bind(this, enums.SaveAndNavigate.toQigSelector)}));
        }
        else {
            return (React.createElement(Logo, {id: 'assessor-logo', key: 'assessor-logo-key'}));
        }
    };
    return BreadCrumbItem;
}(pureRenderComponent));
module.exports = BreadCrumbItem;
//# sourceMappingURL=breadcrumbitem.js.map