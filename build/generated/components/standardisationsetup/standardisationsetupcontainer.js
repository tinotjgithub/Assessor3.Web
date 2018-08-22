"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var qigStore = require('../../stores/qigselector/qigstore');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
var navigationHelper = require('../utility/navigation/navigationhelper');
var scriptActionCreator = require('../../actions/script/scriptactioncreator');
var scriptStore = require('../../stores/script/scriptstore');
var responseStore = require('../../stores/response/responsestore');
var GridToggleButton = require('../worklist/shared/gridtogglebutton');
var standardisationSetupFactory = require('../../utility/standardisationsetup/standardisationsetupfactory');
var StandardisationSetupTableWrapper = require('./standardisationsetuptablewrapper');
var Immutable = require('immutable');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../utility/sorting/sorthelper');
var loginsession = require('../../app/loginsession');
var TabControl = require('../utility/tab/tabcontrol');
var ToggleButton = require('../utility/togglebutton');
var StandardisationSetupCentreScriptDetails = require('./standardisationsetupcentrescriptdetails');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var constants = require('../utility/constants');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
var LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
var MultiOptionConfirmationDialog = require('../utility/multioptionconfirmationdialog');
var scriptImageDownloadHelper = require('../utility/backgroundworker/scriptimagedownloadhelper');
var markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
var scriptImageDownloader = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var GenericDialog = require('../utility/genericdialog');
var stringHelper = require('../../utility/generic/stringhelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var responseHelper = require('../utility/responsehelper/responsehelper');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var submitActionCreator = require('../../actions/submit/submitactioncreator');
var submitStore = require('../../stores/submit/submitstore');
/**
 * StandardisationSetup Container
 */
var StandardisationSetupContainer = (function (_super) {
    __extends(StandardisationSetupContainer, _super);
    /**
     * @constructor
     * @param props
     * @param state
     */
    function StandardisationSetupContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isBusy = true;
        this.doSetMinWidth = true;
        /**
         * This method will load the right side panel
         */
        this.loadStandardisationRightPanel = function (workListSelection) {
            var standardisationSetupRightPanel;
            standardisationSetupRightPanel = (React.createElement("div", {className: 'wrapper'}, React.createElement("div", {className: 'clearfix wl-page-header header-search', id: 'page-title'}, React.createElement("h3", {className: 'shift-left page-title', id: 'page-title-header'}, React.createElement("span", {className: 'page-title-text', id: 'page-title-header-text'}, _this.getStandardisationSetupRightWorkListContainerHeader(workListSelection)), React.createElement("span", {className: 'right-spacer'})), _this.renderSessionTab(workListSelection)), _this.getRightContainerItems(workListSelection)));
            return standardisationSetupRightPanel;
        };
        /**
         * This method will load the right side Blue Message
         */
        this.getRightContainerBlueMessage = function (workListSelection, isShowBluePanelSelectResponse) {
            if (isShowBluePanelSelectResponse === void 0) { isShowBluePanelSelectResponse = false; }
            var element;
            switch (workListSelection) {
                case enums.StandardisationSetup.None:
                    break;
                case enums.StandardisationSetup.SelectResponse:
                    if (isShowBluePanelSelectResponse) {
                        element = _this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection, 0);
                    }
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    element = _this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection, standardisationSetupStore.instance.standardisationTargetDetails.provisionalCount);
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    var targetCount = standardisationSetupStore.instance.standardisationTargetDetails.unclassifiedCount;
                    element = _this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection, targetCount, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    element = _this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection, standardisationSetupStore.instance.standardisationTargetDetails.classifiedCount);
                    break;
            }
            return element;
        };
        /**
         * This method will load the right side panel Items
         */
        this.getRightContainerItems = function (workListSelection) {
            var element = [];
            if (workListSelection !== enums.StandardisationSetup.None) {
                // get the selected SSU worklist.
                switch (workListSelection) {
                    case enums.StandardisationSetup.SelectResponse:
                        if (_this.selectedSessionTab !== enums.StandardisationSessionTab.PreviousSession) {
                            element.push(_this.renderSelectResponseGrids(workListSelection));
                        }
                        else {
                            element.push(_this.renderPreviousSessionTabContent());
                        }
                        break;
                    case enums.StandardisationSetup.UnClassifiedResponse:
                    case enums.StandardisationSetup.ProvisionalResponse:
                    case enums.StandardisationSetup.ClassifiedResponse:
                        var standardisationResponseData = void 0;
                        if (standardisationSetupStore.instance.standardisationSetUpResponsedetails) {
                            standardisationResponseData =
                                Immutable.List(workListSelection === enums.StandardisationSetup.ClassifiedResponse ?
                                    standardisationSetupStore.instance.stdResponseListBasedOnPermission :
                                    standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
                        }
                        // below section is for displaying the grid toggle button
                        // Total Marks/ Marks by Question
                        // Load Grid and toggle button only if ther is any data to show.
                        if (standardisationResponseData && _this.metadataLoaded) {
                            if (standardisationResponseData.count() > 0) {
                                if (!_this.state.isBusy) {
                                    element.push(React.createElement("div", {className: 'grid-holder grid-view', key: enums.StandardisationSetup[workListSelection] + '_key'}, _this.getRightContainerBlueMessage(workListSelection, true), React.createElement("div", {className: 'col-wrap grid-nav padding-bottom-15'}, React.createElement("div", {className: 'col-12-of-12'}, _this.getGridToggleButtons(workListSelection))), React.createElement("div", {className: 'grid-wrapper'}, _this.loadStandardisationWorklistScreen(workListSelection))));
                                }
                                else {
                                    element.push(React.createElement("div", {className: 'grid-holder grid-view', key: enums.StandardisationSetup[workListSelection] + '_key'}, _this.getRightContainerBlueMessage(workListSelection, true), React.createElement("div", {className: 'col-wrap grid-nav padding-bottom-15'}, React.createElement("div", {className: 'col-12-of-12'}, _this.getGridToggleButtons(workListSelection))), _this.loading));
                                }
                            }
                            else {
                                element.push(React.createElement("div", {className: 'grid-holder grid-view', key: enums.StandardisationSetup[workListSelection] + '_key'}, _this.getRightContainerBlueMessage(workListSelection, true)));
                            }
                        }
                        else {
                            element.push(_this.loading);
                        }
                        break;
                }
            }
            return element;
        };
        /**
         * This method will set the session tab visiblity property
         */
        this.renderSessionTab = function (workListSelection) {
            var element = [];
            if (workListSelection !== enums.StandardisationSetup.None) {
                _this.standardisationSetupHelper = standardisationSetupFactory.getStandardisationSetUpWorklistHelper(workListSelection);
                _this.setTabStateToCurrentState(workListSelection);
                if (workListSelection === enums.StandardisationSetup.SelectResponse) {
                    if (_this.getSessionTabVisibilty()) {
                        element.push(React.createElement("div", {className: 'tab-nav-holder'}, React.createElement(TabControl, {tabHeaders: _this.getTabHeaders(), selectTab: _this.selectSessionTab})));
                        element.push(React.createElement("div", {className: 'response-button-holder'}, React.createElement("div", {className: 'arrow-link'}, React.createElement("div", {className: 'get-response-wrapper'}, React.createElement("div", {className: 'dropdown-wrap'}, React.createElement("ul", {className: 'menu'}, React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)'}, "Single response")), React.createElement("li", null, React.createElement("a", {href: 'javascript:void(0)'}, "Up to open response limit"))))))));
                        element.push(React.createElement("div", {className: 'tab-right-end arrow-tab'}, React.createElement("div", {className: 'arrow-link'})));
                    }
                }
            }
            return element;
        };
        /**
         * re render component on toggle change.
         */
        this.reRenderOnStandardisationResponseReceived = function (isTotalMarksViewSelected, selectedStandardisationSetupWorkList, doMarkNow) {
            if (doMarkNow === void 0) { doMarkNow = false; }
            standardisationsetupActionCreator.getStandardisationTargetDetails(standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            _this._doMarkNow = doMarkNow;
            // set candidate script info collection.
            var candidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(Immutable.List(standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses).toArray());
            var eBookMarkingCCValue = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() ? true : false;
            scriptActionCreator.fetchCandidateScriptMetadata(candidateScriptInfoCollection, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
            false, eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false, eBookMarkingCCValue, selectedStandardisationSetupWorkList, false, false, qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject);
            markerInformationActionCreator.GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true, true, qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus);
        };
        /**
         * Load the Selected standardisation worklist screen
         */
        this.loadStandardisationWorklistScreen = function (workListSelection) {
            var grid;
            var gridType = _this.state.isTotalMarkView ? enums.GridType.totalMarks : enums.GridType.markByQuestion;
            _this._centreOrScriptOrReuse = '';
            if (!_this.comparerName) {
                _this.setDefaultComparer();
            }
            var _comparerName = (_this.sortDirection === enums.SortDirection.Ascending) ? _this.comparerName : _this.comparerName + 'Desc';
            grid = (React.createElement(StandardisationSetupTableWrapper, {columnHeaderRows: _this.getGridColumnHeaderRows(workListSelection, _this.comparerName, _this.sortDirection, _this.selectedSessionTab, gridType), frozenHeaderRows: _this.getFrozenTableHeaderRow(_this.comparerName, _this.sortDirection), frozenBodyRows: workListSelection !== enums.StandardisationSetup.ClassifiedResponse ?
                _this.standardisationSetupHelper.generateStandardisationFrozenRowBody(_comparerName, _this.sortDirection, workListSelection, gridType) : null, gridRows: workListSelection !== enums.StandardisationSetup.ClassifiedResponse ?
                _this.getGridRows(_comparerName, _this.sortDirection, workListSelection, gridType) : null, getGridControlId: _this.getGridControlId, id: _this.props.id, key: 'worklistcontainer_key_' + _this.props.id, selectedLanguage: _this.props.selectedLanguage, standardisationSetupType: workListSelection, renderedOn: _this.state.renderedOn, onSortClick: _this.onSortClick, isBorderRequired: false, onRowClick: _this.onRowClick, doSetMinWidth: _this.doSetMinWidth, gridType: gridType}));
            return grid;
        };
        /**
         * Return the selected tab header.
         * @param workListSelection
         */
        this.getStandardisationSetupRightWorkListContainerHeader = function (workListSelection) {
            var headingText;
            switch (workListSelection) {
                case enums.StandardisationSetup.SelectResponse:
                    headingText = localeStore.instance.TranslateText('standardisation-setup.right-container.select-response-worklist');
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    headingText = localeStore.instance.TranslateText('standardisation-setup.right-container.provisional-worklist');
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    headingText = localeStore.instance.TranslateText('standardisation-setup.right-container.unclassified-worklist');
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    headingText = localeStore.instance.TranslateText('standardisation-setup.right-container.classified-worklist');
                    break;
            }
            return headingText;
        };
        /**
         * Get the grid control id used only for select centre response.
         */
        this.getCentreGridControlId = function () {
            var gridId = enums.StandardisationSetup[_this.props.standardisationSetupWorkList] + '_centre_grid_' + _this.props.id;
            return gridId;
        };
        /**
         * Get the grid control id used only for reusable response.
         */
        this.getReusableResponsesGridControlId = function () {
            var gridId = enums.StandardisationSetup[_this.props.standardisationSetupWorkList] + '_reuasable_response_grid_' +
                _this.props.id;
            return gridId;
        };
        /**
         * Get the grid control id
         * @param centreOrScript //used only for select response.
         */
        this.getGridControlId = function () {
            var gridId = '';
            switch (_this.props.standardisationSetupWorkList) {
                case enums.StandardisationSetup.None:
                    break;
                case enums.StandardisationSetup.SelectResponse:
                    if (_this._centreOrScriptOrReuse === 'Script') {
                        gridId = enums.StandardisationSetup[_this.props.standardisationSetupWorkList] + '_script_grid_' + _this.props.id;
                    }
                    else {
                        gridId = enums.StandardisationSetup[_this.props.standardisationSetupWorkList] + '_centre_grid_' + _this.props.id;
                    }
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                case enums.StandardisationSetup.ProvisionalResponse:
                case enums.StandardisationSetup.UnClassifiedResponse:
                    gridId = enums.StandardisationSetup[_this.props.standardisationSetupWorkList] + 'grid_' + _this.props.id;
                    break;
            }
            return gridId;
        };
        /**
         * Declassify the Popup action
         */
        this.declassifyPopupOpen = function (displayId, totalMarkValue, candidateScriptId, esCandidateScriptMarkSchemeGroupId, markingModeId, rigOrder) {
            _this._displayId = displayId;
            _this._totalMarkValue = totalMarkValue;
            _this._candidateScriptId = candidateScriptId;
            _this._esCandidateScriptMarkSchemeGroupId = esCandidateScriptMarkSchemeGroupId;
            _this._markingModeId = markingModeId;
            _this._rigOrder = rigOrder;
            _this.setState({
                isDeclassifyPopupDisplaying: true
            });
        };
        /**
         * Gets called on retrieval of candidate response metadata which aids for the Script background download
         * No need to fetch the Suppressed pages
         */
        this.onCandidateResponseMetadataRetrieved = function (isAutoRefresh) {
            _this.metadataLoaded = true;
            if (_this._doMarkNow && _this.metadataLoaded) {
                _this._doMarkNow = false;
                //need to append 6 with display id from front end
                var openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails('6' + standardisationSetupStore.instance.createdStandardisationRIGDetails.displayId.toString());
                responseHelper.openResponse(parseInt(openedResponseDetails.displayId), enums.ResponseNavigation.specific, enums.ResponseMode.open, openedResponseDetails.esMarkGroupId, enums.ResponseViewMode.zoneView, enums.TriggerPoint.None, openedResponseDetails.sampleReviewCommentId, openedResponseDetails.sampleReviewCommentCreatedBy);
                markSchemeHelper.getMarks(parseInt(openedResponseDetails.displayId), undefined);
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(openedResponseDetails.displayId));
            }
            else {
                _this.setState({
                    isTotalMarkView: standardisationSetupStore.instance.isTotalMarksViewSelected,
                    renderedOn: Date.now(),
                    // Set isGridViewChanged as true to reset the scroll.
                    isGridViewChanged: true,
                    isBusy: false
                });
            }
        };
        /**
         *  Display confirmation dialog to reclassify the response.
         */
        this.reclassifyPopupOpen = function (reclassifiedResponseDetails) {
            _this._reclassifyResponseDetails = {
                candidateScriptId: reclassifiedResponseDetails.candidateScriptId,
                esCandidateScriptMarkSchemeGroupId: reclassifiedResponseDetails.esCandidateScriptMarkSchemeGroupId,
                markSchemeGroupId: reclassifiedResponseDetails.markSchemeGroupId,
                markingModeId: reclassifiedResponseDetails.markingModeId,
                previousMarkingModeId: reclassifiedResponseDetails.previousMarkingModeId,
                rigOrder: reclassifiedResponseDetails.rigOrder,
                isRigOrderUpdateRequired: reclassifiedResponseDetails.isRigOrderUpdateRequired,
                displayId: reclassifiedResponseDetails.displayId,
                totalMarkValue: reclassifiedResponseDetails.totalMarkValue,
                assignNextRigOrder: false
            };
            // Set flag to display Reclassify Popup Or not.
            _this.setState({
                isReclassifyPopupDisplaying: true
            });
        };
        this.reclassifyResponse = function () {
            standardisationActionCreator.reclassifyResponse(standardisationSetupStore.instance.reclassifiedResponseDetails());
            _this.setState({
                isReclassifyPopupDisplaying: false
            });
        };
        /**
         *  Display confirmation dialog to share the response.
         */
        this.shareResponsePopupOpen = function (shareResponseDetails) {
            // Set flag to display shareResponse Popup Or not.
            _this._shareResponseDisplayId = shareResponseDetails.displayId;
            _this._shareResponseTotalMarkValue = shareResponseDetails.totalMarkValue;
            _this._shareResponseDetails = shareResponseDetails;
            _this.setState({
                isShareResponsePopupDisplaying: true
            });
        };
        /**
         *  Close Share Response dialog after clicking Cancel.
         */
        this.shareResponsePopupClose = function () {
            // Set flag to display shareResponse Popup Or not.
            _this.setState({
                isShareResponsePopupDisplaying: false
            });
        };
        /**
         * share Provisional Response
         */
        this.shareResponse = function () {
            var shareResponseArgument;
            /**
             * mapping values on submit argument
             */
            shareResponseArgument = {
                markGroupIds: [_this._shareResponseDetails.esMarkGroupId],
                markingMode: _this._shareResponseDetails.markingModeId,
                examinerRoleId: standardisationSetupStore.instance.examinerRoleId,
                markSchemeGroupId: standardisationSetupStore.instance.markSchemeGroupId,
                examinerApproval: examinerStore.instance.getMarkerInformation.approvalStatus,
                isAdminRemarker: false
            };
            _this.setState({
                isShareResponsePopupDisplaying: false,
                isBusy: true
            });
            submitActionCreator.submitResponse(shareResponseArgument, standardisationSetupStore.instance.markSchemeGroupId, enums.WorklistType.none, enums.RemarkRequestType.Unknown, false, _this._shareResponseDisplayId);
        };
        /**
         * share Provisional Response completed action
         */
        this.shareResponseCompleted = function () {
            var stdWorklistViewType = _this.state.isTotalMarkView ? enums.STDWorklistViewType.ViewTotalMarks : enums.STDWorklistViewType.ViewMarksByQuestion;
            standardisationActionCreator.getProvisionalResponseDetails(standardisationSetupStore.instance.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, true, stdWorklistViewType);
        };
        /**
         * On OK click of Reclassify Error message popup
         */
        this.onReclassifyErrorMessageOkClick = function () {
            //change the state to false to close the popup
            _this.setState({ isReclassifyErrorPopupDisplaying: false });
        };
        /**
         * On OK click of Reclassify Error message popup
         */
        this.onReorderErrorMessageOkClick = function () {
            //change the state to false to close the popup
            _this.setState({ isReorderErrorPopupDisplaying: false });
        };
        this.reclassifyErrorPopupOpen = function () {
            _this.setState({
                isReclassifyErrorPopupDisplaying: true
            });
        };
        /**
         * Re render the classified response details after declassification.
         */
        this.reRenderOnReorderResponse = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.reorderErrorPopupOpen = function (displayId) {
            _this._displayId = displayId;
            _this.setState({
                isReorderErrorPopupDisplaying: true
            });
        };
        /**
         * Re render the previous session details after toggling Hide Response.
         */
        this.reRenderOnUpdateHiddenStatus = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            isBusy: false,
            renderedOn: this.props.renderedOn,
            isTotalMarkView: userOptionsHelper.getUserOptionByName(userOptionKeys.SELECTED_GRID_VIEW_OPTION)
                === 'false' ? false : true,
            isShowHiddenResponsesOn: userOptionsHelper.getUserOptionByName(userOptionKeys.SHOW_HIDDEN_RESPONSES)
                === 'true' ? true : false,
            isGridViewChanged: false,
            isDeclassifyPopupDisplaying: false,
            isReclassifyPopupDisplaying: false,
            isReclassifyErrorPopupDisplaying: false,
            isReorderErrorPopupDisplaying: false,
            isShareResponsePopupDisplaying: false
        };
        this.selectedSessionTab = enums.StandardisationSessionTab.CurrentSession;
        this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
        this.loadScriptsOfSelectedCentre = this.loadScriptsOfSelectedCentre.bind(this);
        this.onStandardisationLeftPanelSelected = this.onStandardisationLeftPanelSelected.bind(this);
        this.reRenderOnCentreDetailsSet = this.reRenderOnCentreDetailsSet.bind(this);
        this.onSortClick = this.onSortClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.toggleGridView = this.toggleGridView.bind(this);
        this.selectSessionTab = this.selectSessionTab.bind(this);
        this.getSessionTabVisibilty = this.getSessionTabVisibilty.bind(this);
        this.setDefaultComparer = this.setDefaultComparer.bind(this);
        this.renderPreviouseSession = this.renderPreviouseSession.bind(this);
        this.setCentreListScroll = this.setCentreListScroll.bind(this);
        this.hideDeclassifyPopup = this.hideDeclassifyPopup.bind(this);
        this.onCandidateResponseMetadataRetrieved = this.onCandidateResponseMetadataRetrieved.bind(this);
        this.metadataLoaded = false;
        this.declassifyResponse = this.declassifyResponse.bind(this);
        this.reRenderOnClassifiedResponseReceived = this.reRenderOnClassifiedResponseReceived.bind(this);
        this.hideReclassifyPopup = this.hideReclassifyPopup.bind(this);
        this.reclassifyResponse = this.reclassifyResponse.bind(this);
        this.onHideReuseToggleChange = this.onHideReuseToggleChange.bind(this);
        this.shareResponseCompleted = this.shareResponseCompleted.bind(this);
        this.shareResponse = this.shareResponse.bind(this);
    }
    /**
     * This method will call parent component function to toggle left panel
     */
    StandardisationSetupContainer.prototype.toggleLeftPanel = function () {
        this.props.toggleLeftPanel();
    };
    /**
     * component will Mount event
     */
    StandardisationSetupContainer.prototype.componentWillMount = function () {
        this.isBusy = true;
    };
    /**
     * render method
     */
    StandardisationSetupContainer.prototype.render = function () {
        this.setLoadingindicator();
        var errorBody;
        var popUpContent = [];
        // Logic to display reclassify/declassify popup based  the flag.
        if (this.state.isDeclassifyPopupDisplaying) {
            popUpContent.push(React.createElement("p", {className: 'dim-text padding-bottom-20'}, React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.response-id'), React.createElement("span", {className: 'responseID'}, this._displayId)), ",", React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.total-mark'), React.createElement("span", {className: 'total-mark'}, this._totalMarkValue))));
            popUpContent.push(React.createElement("p", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.body')));
            popUpContent.push(React.createElement("p", {className: 'padding-top-10'}, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.confirmation-text')));
        }
        else if (this.state.isReclassifyPopupDisplaying) {
            var previousMarkingMode = (localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[this._reclassifyResponseDetails.previousMarkingModeId]));
            var currentMarkingMode = (localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[this._reclassifyResponseDetails.markingModeId]));
            popUpContent.push(React.createElement("p", {className: 'dim-text padding-bottom-10'}, React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.response-id'), React.createElement("span", {className: 'responseID'}, this._reclassifyResponseDetails.displayId)), ",", React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.total-mark'), React.createElement("span", {className: 'total-mark'}, this._reclassifyResponseDetails.totalMarkValue))));
            popUpContent.push(React.createElement("p", null, stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.body'), [previousMarkingMode,
                currentMarkingMode])));
        }
        else if (this.state.isReclassifyErrorPopupDisplaying) {
            var previousMarkingMode = (localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[this._reclassifyResponseDetails.previousMarkingModeId]));
            var currentMarkingMode = (localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[this._reclassifyResponseDetails.markingModeId]));
            errorBody = stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassifyerror-popup.body'), [this._reclassifyResponseDetails.displayId,
                previousMarkingMode,
                currentMarkingMode
            ]);
        }
        else if (this.state.isReorderErrorPopupDisplaying) {
            errorBody = stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reordererror-popup.body'), [this._displayId]);
        }
        else if (this.state.isShareResponsePopupDisplaying) {
            //need to render popup
            popUpContent.push(React.createElement("p", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.body')));
            popUpContent.push(React.createElement("p", {className: 'dim-text padding-top-10'}, React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.response-id'), React.createElement("span", {className: 'responseID'}, this._shareResponseDisplayId)), ",", React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.total-mark'), React.createElement("span", {className: 'total-mark'}, this._shareResponseTotalMarkValue))));
            popUpContent.push(React.createElement("p", {className: 'padding-top-10'}, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.confirmation-text')));
        }
        // Call confirmation dialog to dsplay declassify/reclassify 
        var declasifyPopup = React.createElement(MultiOptionConfirmationDialog, {content: popUpContent, header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.header'), displayPopup: this.state.isDeclassifyPopupDisplaying, onCancelClick: this.hideDeclassifyPopup, onYesClick: this.declassifyResponse, onNoClick: null, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.Declassify, buttonCancelText: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.no-button'), buttonYesText: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.yes-button'), buttonNoText: null, displayNoButton: false});
        var reclasifyPopup = React.createElement(MultiOptionConfirmationDialog, {content: popUpContent, header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.header'), displayPopup: this.state.isReclassifyPopupDisplaying, onCancelClick: this.hideReclassifyPopup, onYesClick: this.reclassifyResponse, onNoClick: null, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.Reclassify, buttonCancelText: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.no-button'), buttonYesText: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.yes-button'), buttonNoText: null, displayNoButton: false});
        var reclasifyErrorPopup = React.createElement(GenericDialog, {content: errorBody, multiLineContent: null, header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassifyerror-popup.header'), secondaryContent: null, displayPopup: this.state.isReclassifyErrorPopupDisplaying, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onReclassifyErrorMessageOkClick.bind(this), id: 'reclassifyError', key: 'reclassifyErrorMessage', popupDialogType: enums.PopupDialogType.ReclassifyError, footerContent: null});
        var reorderErrorPopup = React.createElement(GenericDialog, {content: errorBody, multiLineContent: null, header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reordererror-popup.header'), secondaryContent: null, displayPopup: this.state.isReorderErrorPopupDisplaying, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onReorderErrorMessageOkClick.bind(this), id: 'reclassifyError', key: 'reorderErrorMessage', popupDialogType: enums.PopupDialogType.ReclassifyError, footerContent: null});
        var shareResponsePopup = React.createElement(MultiOptionConfirmationDialog, {content: popUpContent, header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.header'), displayPopup: this.state.isShareResponsePopupDisplaying, onCancelClick: this.shareResponsePopupClose, onYesClick: this.shareResponse, onNoClick: null, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.ShareResponse, buttonCancelText: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.cancel-button'), buttonYesText: localeStore.instance
            .TranslateText('standardisation-setup.standardisation-setup-worklist.share-response-popup.share-button'), buttonNoText: null, displayNoButton: false});
        return (React.createElement("div", {className: 'column-right tab-holder horizontal response-tabs'}, React.createElement("a", {href: 'javascript:void(0);', className: 'toggle-left-panel', id: 'side-panel-toggle-button', title: localeStore.instance.TranslateText('standardisation-setup.left-panel.show-hide-tooltip'), onClick: this.toggleLeftPanel}, React.createElement("span", {className: 'sprite-icon panel-toggle-icon'}, "panel toggle")), this.loadStandardisationRightPanel(this.props.standardisationSetupWorkList), declasifyPopup, reclasifyPopup, reclasifyErrorPopup, reorderErrorPopup, shareResponsePopup));
    };
    /**
     * Handle animation of grid view toggle on componentDidUpdate
     */
    StandardisationSetupContainer.prototype.componentDidUpdate = function () {
        // Need to reset the scroll styles on grid toggle.
        this.setScrollOnToggle();
    };
    /**
     * componentDidMount React lifecycle event
     */
    StandardisationSetupContainer.prototype.componentDidMount = function () {
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.onStandardisationLeftPanelSelected);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.loadScriptsOfSelectedCentre);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.loadContainer);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this.reRenderOnCentreDetailsSet);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT, this.reRenderOnStandardisationResponseReceived);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT, this.renderPreviouseSession);
        window.addEventListener('orientationchange', this.setCentreListScroll);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_DECLASSIFY_POPUP_EVENT, this.declassifyPopupOpen);
        scriptStore.instance.addListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.onCandidateResponseMetadataRetrieved);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.reRenderOnClassifiedResponseReceived);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.reRenderOnClassifiedResponseReceived);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.reclassifyPopupOpen);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT, this.reclassifyErrorPopupOpen);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.REORDERED_RESPONSE_EVENT, this.reRenderOnReorderResponse);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT, this.reorderErrorPopupOpen);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT, this.reRenderOnUpdateHiddenStatus);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY, this.shareResponsePopupOpen);
        submitStore.instance.addListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.shareResponseCompleted);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    StandardisationSetupContainer.prototype.componentWillUnmount = function () {
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.onStandardisationLeftPanelSelected);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.loadScriptsOfSelectedCentre);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.loadContainer);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this.reRenderOnCentreDetailsSet);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT, this.reRenderOnStandardisationResponseReceived);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT, this.renderPreviouseSession);
        window.removeEventListener('orientationchange', this.setCentreListScroll);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT, this.declassifyPopupOpen);
        scriptStore.instance.removeListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.onCandidateResponseMetadataRetrieved);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT, this.reRenderOnClassifiedResponseReceived);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.reclassifyPopupOpen);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT, this.reRenderOnClassifiedResponseReceived);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT, this.reclassifyErrorPopupOpen);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.REORDERED_RESPONSE_EVENT, this.reRenderOnReorderResponse);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT, this.reorderErrorPopupOpen);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT, this.reRenderOnUpdateHiddenStatus);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY, this.shareResponsePopupOpen);
        submitStore.instance.removeListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.shareResponseCompleted);
    };
    /**
     * set centre list scroll top
     */
    StandardisationSetupContainer.prototype.setCentreListScroll = function () {
        if (this.props.standardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            var scrollTop = void 0;
            // setting the scroll top of Centre List table to view the selected centre.
            scrollTop = (standardisationSetupStore.instance.selectedCentrePosition - 1) * constants.TABLE_WRAPPER_ROW_HEIGHT;
            if (this.centreDetails) {
                this.centreDetails.getElementsByClassName('table-scroll-holder')[0].scrollTop = scrollTop;
            }
        }
    };
    /**
     * This method will set the session tab visiblity property
     */
    StandardisationSetupContainer.prototype.getSessionTabVisibilty = function () {
        return this.standardisationSetupHelper.getSessionTabVisibiltyinSelectResponse();
    };
    /**
     * This method will set the selectedTab state to current state
     */
    StandardisationSetupContainer.prototype.setTabStateToCurrentState = function (workListSelection) {
        if (this.getSessionTabVisibilty() && this.selectedSessionTab !== enums.StandardisationSessionTab.CurrentSession
            && workListSelection !== enums.StandardisationSetup.SelectResponse) {
            this.selectedSessionTab = enums.StandardisationSessionTab.CurrentSession;
        }
    };
    /**
     * This method will load the select response right side container
     */
    StandardisationSetupContainer.prototype.renderSelectResponseGrids = function (workListSelection) {
        if (this.getSessionTabVisibilty()) {
            return (React.createElement("div", {className: 'tab-content-holder'}, React.createElement("div", {className: 'grid-split-holder tab-content active', id: 'responseTab1', key: 'responseTab1_key'}, this.getSelectResponseCentreListGrid(workListSelection), this.getSelectResponseStdResponseGrid())));
        }
        else {
            return (React.createElement("div", {className: 'grid-split-holder', id: 'gridsplitholder', key: 'gridSplitHolder_key'}, this.getSelectResponseCentreListGrid(workListSelection), this.getSelectResponseStdResponseGrid()));
        }
    };
    /**
     * This method will load the previous session tab content in select response when ReuseRIG CC ON
     */
    StandardisationSetupContainer.prototype.renderPreviousSessionTabContent = function () {
        return (React.createElement("div", {className: 'tab-content-holder'}, React.createElement("div", {className: 'wrapper tab-content active', id: 'previous_session_tab'}, this.getBlueBannerForPreviousSession(), this.renderReusableResponsesGrid())));
    };
    /**
     * On hide reuse toggle action
     */
    StandardisationSetupContainer.prototype.onHideReuseToggleChange = function (evt) {
        this.setState({
            isShowHiddenResponsesOn: !this.state.isShowHiddenResponsesOn
        });
        standardisationActionCreator.onHideReuseToggleChange();
        userOptionsHelper.save(userOptionKeys.SHOW_HIDDEN_RESPONSES, String(!this.state.isShowHiddenResponsesOn), true);
    };
    /**
     * it will return blue banner for previous session tab
     */
    StandardisationSetupContainer.prototype.getBlueBannerForPreviousSession = function () {
        var element;
        if (this._displayBlueBanner) {
            element = this.standardisationSetupHelper.
                getBlueBannerForTargets(enums.StandardisationSetup.SelectResponse, 0, false, enums.StandardisationSessionTab.PreviousSession);
        }
        return element;
    };
    /**
     * This will returns the tab contents
     * @param validationResponseAllocationButtonValidationParam
     */
    StandardisationSetupContainer.prototype.getTabData = function (tabSelection) {
        var tabContents = [];
        tabContents.push({
            index: 1,
            class: 'wrapper tab-content resp-grace active',
            isSelected: this.selectedSessionTab === enums.StandardisationSessionTab.CurrentSession,
            id: 'responseTab1',
            content: this.selectedSessionTab === enums.StandardisationSessionTab.CurrentSession
                ? this.renderSelectResponseGrids(tabSelection) : null
        });
        tabContents.push({
            index: 2,
            class: 'wrapper tab-content resp-grace',
            isSelected: this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession,
            id: 'responseTab2',
            content: this.selectedSessionTab !== enums.StandardisationSessionTab.CurrentSession
                ? this.renderPreviousSessionTabContent() : null
        });
        return tabContents;
    };
    /**
     * This method will update the selected tab.
     * @param selectedTabIndex
     */
    StandardisationSetupContainer.prototype.selectSessionTab = function (selectedTabIndex) {
        this.selectedSessionTab = selectedTabIndex;
        //DataService call to get ReuseRigDetails
        if (this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession) {
            standardisationActionCreator.getReuseRigDetails(standardisationSetupStore.instance.examinerRoleId, standardisationSetupStore.instance.markSchemeGroupId, true, false);
            this.resetSortAttributes();
        }
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * renderPreviouseSession event method - this will fired after the Dataservice call to get ReUseRig is completed
     */
    StandardisationSetupContainer.prototype.renderPreviouseSession = function () {
        var reusableList;
        reusableList = Immutable.List(standardisationSetupStore.instance.standardisationSetupReusableDetailsList);
        if (reusableList !== undefined && reusableList !== null) {
            if (reusableList.count() === 0) {
                this._displayBlueBanner = true;
            }
            else if (reusableList.count() >= 0) {
                this._displayBlueBanner = false;
            }
        }
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * render reusable response grid
     */
    StandardisationSetupContainer.prototype.renderReusableResponsesGrid = function () {
        var reusableResponsesGrid;
        var reusableList = Immutable.List(standardisationSetupStore.instance.reusableDetailsListBasedOnHiddenStatus(this.state.isShowHiddenResponsesOn));
        var fullReusableList = Immutable.List(standardisationSetupStore.instance.standardisationSetupReusableDetailsList);
        this._centreOrScriptOrReuse = 'Reuse';
        if (!this.comparerName) {
            this.setDefaultComparer();
        }
        if (fullReusableList.count() > 0) {
            reusableResponsesGrid = (React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'col-wrap grid-nav padding-bottom-15'}, React.createElement("div", {className: 'shift-right'}, React.createElement("div", {className: 'form-field inline'}, React.createElement("label", {className: 'label', id: 'show_hidden_label'}, "Show hidden responses"), React.createElement(ToggleButton, {id: 'showhideresponse_id', key: 'showhideresponse_key', isChecked: this.state.isShowHiddenResponsesOn, selectedLanguage: this.props.selectedLanguage, index: 0, onChange: this.onHideReuseToggleChange, style: undefined, className: 'form-component padding-left-5', title: 'Hide Reuse', isDisabled: false, onText: localeStore.instance.TranslateText('generic.toggle-button-states.yes'), offText: localeStore.instance.TranslateText('generic.toggle-button-states.no')})))), React.createElement("div", {className: 'grid-wrapper'}, React.createElement(StandardisationSetupTableWrapper, {columnHeaderRows: this.getGridColumnHeaderRows(this.props.standardisationSetupWorkList, this.comparerName, this.sortDirection, this.selectedSessionTab), frozenHeaderRows: this.getFrozenTableHeaderRow(this.comparerName, this.sortDirection), frozenBodyRows: this.standardisationSetupHelper.generateStandardisationFrozenRowBodyReusableGrid(reusableList, this.comparerName, this.sortDirection), gridRows: this.standardisationSetupHelper.generateReusableResponsesRowDefinition(reusableList, this.comparerName, this.sortDirection), getGridControlId: this.getReusableResponsesGridControlId, id: this.props.id, onSortClick: this.onSortClick, onRowClick: this.reuseGridOnRowClick, renderedOn: this.state.renderedOn, isBorderRequired: true, doSetMinWidth: this.doSetMinWidth}))));
            return reusableResponsesGrid;
        }
        else {
            return null;
        }
    };
    /**
     * On row click event for Reusable response grid
     */
    StandardisationSetupContainer.prototype.reuseGridOnRowClick = function () {
        // Need to implement
    };
    /**
     * This method will load the Tab hearder for session tab in select response when ReuseRIG CC ON
     */
    StandardisationSetupContainer.prototype.getTabHeaders = function () {
        //let tabHeader: JSX.Element[] = [];
        var tabHeader = [];
        tabHeader.push({
            index: 1,
            class: 'resp-open',
            isSelected: this.selectedSessionTab === enums.StandardisationSessionTab.CurrentSession,
            isDisabled: false,
            tabNavigation: 'responseTab1',
            headerText: localeStore.instance.TranslateText('standardisation-setup.right-container.current-session-tab-header'),
            isHeaderCountNotRequired: true,
            headerCount: 0,
            id: 'current-session-id',
            key: 'current-session-key'
        });
        tabHeader.push({
            index: 2,
            class: 'resp-closed',
            isSelected: this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession,
            isDisabled: false,
            tabNavigation: 'responseTab2',
            headerText: localeStore.instance.TranslateText('standardisation-setup.right-container.previous-session-tab-header'),
            isHeaderCountNotRequired: true,
            headerCount: 0,
            id: 'previous-session-id',
            key: 'previous-session-key'
        });
        return tabHeader;
    };
    /**
     * user clicked on the left Tasks panel in Standardisation setup
     * @param selectedStandardisationSetupWorkList
     */
    StandardisationSetupContainer.prototype.onStandardisationLeftPanelSelected = function (selectedStandardisationSetupWorkList, useCache) {
        var stdWorklistViewType = this.state.isTotalMarkView ? enums.STDWorklistViewType.ViewTotalMarks : enums.STDWorklistViewType.ViewMarksByQuestion;
        this.resetSortAttributes();
        new scriptImageDownloader().clearBackgroundImageDownloadQueue();
        switch (selectedStandardisationSetupWorkList) {
            case enums.StandardisationSetup.SelectResponse:
                standardisationActionCreator.getStandardisationCentresDetails(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, false, false, standardisationSetupStore.instance.examinerRoleId, stdWorklistViewType, useCache);
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                // fill the store with ClassifiedResponseDetails
                standardisationActionCreator.getClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, stdWorklistViewType);
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                // fill the store with Provisional Response details
                standardisationActionCreator.getProvisionalResponseDetails(standardisationSetupStore.instance.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, true, stdWorklistViewType);
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                // fill the store with UnClassifiedResponseDetails
                standardisationActionCreator.getUnClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, stdWorklistViewType);
                break;
        }
    };
    /**
     * Load the scripts for selected centre in centre list
     */
    StandardisationSetupContainer.prototype.loadScriptsOfSelectedCentre = function () {
        this.metadataLoaded = false;
        // sets the selected candidateScriptId in store.
        var isEbookMarking = configurableCharacteristicsHelper
            .getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true';
        var candidateScriptInfoCollection = [];
        // Get candidateScriptId and documentyId of all scripts in the currently selected centre
        candidateScriptInfoCollection = standardisationSetupStore.instance.getCandidateScriptDetailsAgainstCentre;
        if (candidateScriptInfoCollection) {
            scriptActionCreator.fetchCandidateScriptMetadata(Immutable.List(candidateScriptInfoCollection), qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, // MarkSchemeGroupId
            false, false, false, eCourseworkHelper.isECourseworkComponent, isEbookMarking, enums.StandardisationSetup.SelectResponse, false, false, qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject);
        }
    };
    /**
     * ReRender standardisation setup containersetupcontainer
     */
    StandardisationSetupContainer.prototype.reRenderOnCentreDetailsSet = function () {
        this.loadScriptsOfSelectedCentre();
        this.isBusy = false; // wait until the store is updated with new list
        this.setState({ renderedOn: Date.now() });
        // set the scroll postion of Centre List table to view the selected centre
        this.setCentreListScroll();
    };
    /**
     * get Select Response StdResponseGrid
     * @param hide
     * @param centerId
     */
    StandardisationSetupContainer.prototype.getSelectResponseStdResponseGrid = function () {
        return (React.createElement(StandardisationSetupCentreScriptDetails, {id: 'StandardisationSetupCentreScriptDetails', key: 'StandardisationSetupCentreScriptDetails-key', standardisationSetupHelper: this.standardisationSetupHelper, standardisationSetupWorkList: this.props.standardisationSetupWorkList, renderedOn: this.props.renderedOn}));
    };
    /**
     * Call back function from table wrapper on sorting
     * @param comparerName
     * @param sortDirection
     */
    StandardisationSetupContainer.prototype.onSortClick = function (comparerName, sortDirection) {
        this.comparerName = comparerName;
        this.sortDirection = sortDirection;
        var sortDetails = {
            qig: standardisationSetupStore.instance.markSchemeGroupId,
            comparerName: comparerList[this.comparerName],
            sortDirection: this.sortDirection,
            selectedWorkList: this.props.standardisationSetupWorkList,
            centreOrScriptOrReuse: (this.props.standardisationSetupWorkList === enums.StandardisationSetup.SelectResponse ?
                (this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession ? 'Reuse' : 'Centre') : ''),
        };
        // value is to prevent setting min width of the grid columns
        this.doSetMinWidth = false;
        standardisationActionCreator.onSortedClick(sortDetails);
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * callback on clicking the gridRow of the centre list
     */
    StandardisationSetupContainer.prototype.onRowClick = function (rowId) {
        if (this.props.standardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            var centrePartId = standardisationSetupStore.instance.standardisationSetupSelectedCentrePartId(rowId);
            standardisationActionCreator.getScriptsOfSelectedCentre(standardisationSetupStore.instance.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, centrePartId, false, standardisationSetupStore.instance.examinerRoleId, rowId);
        }
    };
    /**
     * Get classifed worklist row definition
     * @param standardisationSetupWorklistData
     * @param workListSelection
     * @param gridType
     */
    StandardisationSetupContainer.prototype.getGridRows = function (comparerName, sortDirection, workListSelection, gridType) {
        return this.standardisationSetupHelper.generateStandardisationRowDefinion(comparerName, sortDirection, workListSelection, gridType);
    };
    /**
     * This method will returns the grid toggle button of standardisation setup.
     */
    StandardisationSetupContainer.prototype.getGridToggleButtons = function (workListSelection) {
        return (React.createElement("div", {className: 'shift-right'}, React.createElement("ul", {className: 'filter-menu'}, React.createElement("li", {className: 'switch-view-btn'}, React.createElement(GridToggleButton, {key: 'gridtogglebuttontotalmarkview_key_' + this.props.id, id: 'gridtogglebuttontotalmarkview_' + this.props.id, toggleGridView: this.toggleGridView, isSelected: this.state.isTotalMarkView, buttonType: enums.GridType.totalMarks, selectedLanguage: this.props.selectedLanguage}), React.createElement(GridToggleButton, {key: 'gridtogglebuttonmarkbyquestion_key_' + this.props.id, id: 'gridtogglebuttonmarkbyquestion_' + this.props.id, toggleGridView: this.toggleGridView, isSelected: !this.state.isTotalMarkView, buttonType: enums.GridType.markByQuestion, selectedLanguage: this.props.selectedLanguage})))));
    };
    /**
     * this will change the grid view (Total Marks/Marks by Question).
     */
    StandardisationSetupContainer.prototype.toggleGridView = function () {
        var isTotalMarksViewSelected = !this.state.isTotalMarkView;
        this.setState({
            isBusy: true
        });
        userOptionsHelper.save(userOptionKeys.SELECTED_GRID_VIEW_OPTION, String(isTotalMarksViewSelected), true);
        var gridType = isTotalMarksViewSelected ?
            enums.STDWorklistViewType.ViewTotalMarks : enums.STDWorklistViewType.ViewMarksByQuestion;
        // Fetch Data from Server on Toggle Change.
        switch (this.props.standardisationSetupWorkList) {
            case enums.StandardisationSetup.ProvisionalResponse:
                standardisationActionCreator.getProvisionalResponseDetails(qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, false, true, gridType);
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                standardisationActionCreator.getClassifiedResponseDetails(qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, false, gridType);
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                standardisationActionCreator.getUnClassifiedResponseDetails(qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, loginsession.EXAMINER_ID, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, false, gridType);
                break;
        }
    };
    /**
     * this will trigger the animation on grid view toggle.
     */
    StandardisationSetupContainer.prototype.setScrollOnToggle = function () {
        if (this.state.isGridViewChanged) {
            var that_1 = this;
            /* setTimeout is used with delay 0 to work animation in Firefox and Chrome */
            setTimeout(function () {
                that_1.setState({
                    isGridViewChanged: false
                });
                worklistActionCreator.setScrollWorklistColumns();
            }, 0);
        }
    };
    /**
     * Generating Grid Rows
     * @param comparerName
     * @param sortDirection
     */
    StandardisationSetupContainer.prototype.getFrozenTableHeaderRow = function (comparerName, sortDirection) {
        return this.standardisationSetupHelper.generateFrozenRowHeader(comparerName, sortDirection, this.props.standardisationSetupWorkList, this.selectedSessionTab);
    };
    /**
     * Generating Frozen Grid Rows
     * @param standardisationSetupDetailsList
     */
    StandardisationSetupContainer.prototype.getFrozenTableBodyRows = function (standardisationSetupDetailsList) {
        return this.standardisationSetupHelper.generateFrozenRowBody(standardisationSetupDetailsList, this.props.standardisationSetupWorkList);
    };
    /**
     * Generating Grid Rows
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param gridType
     * @param centreOrScript
     */
    StandardisationSetupContainer.prototype.getGridColumnHeaderRows = function (standardisationSetupType, comparerName, sortDirection, selectedTab, gridType, centreOrScript) {
        return this.standardisationSetupHelper.generateTableHeader(standardisationSetupType, comparerName, sortDirection, gridType, selectedTab, centreOrScript);
    };
    /**
     * Resets the comparer and sort order
     */
    StandardisationSetupContainer.prototype.resetSortAttributes = function () {
        this.comparerName = undefined;
        this.sortDirection = undefined;
    };
    /**
     * This method will return the table content for select response
     */
    StandardisationSetupContainer.prototype.getSelectResponseCentreListGrid = function (workListSelection) {
        var _this = this;
        var selectResponseTableContent;
        this._centreOrScriptOrReuse = 'Centre';
        if (!this.comparerName) {
            this.setDefaultComparer();
        }
        var _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
        var data = standardisationSetupStore.instance.standardisationCentreList;
        if (data !== undefined && this.comparerName !== undefined) {
            data.centreList = Immutable.List(sortHelper.sort(data.centreList.toArray(), comparerList[_comparerName]));
        }
        this._gridFrozenHeaderRows = null;
        this._gridFrozenBodyRows = null;
        if (data) {
            selectResponseTableContent = (React.createElement("div", {className: 'grid-split-wrapper std-centre-grid', id: 'stdCentreGrid'}, React.createElement("div", {className: 'grid-holder grid-view selectable-grid', ref: function (ref) { return _this.centreDetails = ref; }}, this.getRightContainerBlueMessage(workListSelection, true), React.createElement("div", {className: 'grid-wrapper'}, React.createElement(StandardisationSetupTableWrapper, {columnHeaderRows: this.getGridColumnHeaderRows(this.props.standardisationSetupWorkList, this.comparerName, this.sortDirection, this.selectedSessionTab), frozenHeaderRows: this._gridFrozenHeaderRows, frozenBodyRows: this._gridFrozenBodyRows, gridRows: this.standardisationSetupHelper.generateCentreRowDefinition(data), getGridControlId: this.getCentreGridControlId, id: this.props.id, onSortClick: this.onSortClick, onRowClick: this.onRowClick, renderedOn: this.state.renderedOn, isBorderRequired: false})))));
        }
        return selectResponseTableContent;
    };
    /**
     * Set the comparer for the current standardisation
     */
    StandardisationSetupContainer.prototype.setDefaultComparer = function () {
        var _this = this;
        var defaultComparers = standardisationSetupStore.instance.standardisationSortDetails;
        var standardisationSetup = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
        var entry = defaultComparers.filter(function (x) {
            return x.selectedWorkList === standardisationSetup &&
                x.qig === standardisationSetupStore.instance.markSchemeGroupId &&
                x.centreOrScriptOrReuse === _this._centreOrScriptOrReuse;
        });
        if (entry.length > 0) {
            this.comparerName = comparerList[entry[0].comparerName];
            this.sortDirection = entry[0].sortDirection;
        }
    };
    /**
     * Hide the declassify pop up
     */
    StandardisationSetupContainer.prototype.hideDeclassifyPopup = function () {
        this.setState({
            isDeclassifyPopupDisplaying: false
        });
    };
    /**
     * Hide the reclassify pop up
     */
    StandardisationSetupContainer.prototype.hideReclassifyPopup = function () {
        // Notify the reclassify cancel action.
        standardisationActionCreator.rejectedReclassifyAction();
        this.setState({
            isReclassifyPopupDisplaying: false
        });
    };
    /**
     * Load response container.
     */
    StandardisationSetupContainer.prototype.loadContainer = function () {
        navigationHelper.loadResponsePage();
    };
    /**
     * Set the loading indicator
     */
    StandardisationSetupContainer.prototype.setLoadingindicator = function () {
        this.loading = React.createElement(LoadingIndicator, {id: 'loading', key: 'loading', selectedLanguage: localeStore.instance.Locale, isOnline: applicationStore.instance.isOnline, cssClass: 'section-loader loading'});
    };
    /**
     * Declassify the selected response
     */
    StandardisationSetupContainer.prototype.declassifyResponse = function () {
        standardisationActionCreator.declassifyResponse(this._candidateScriptId, standardisationSetupStore.instance.markSchemeGroupId, this._esCandidateScriptMarkSchemeGroupId, this._markingModeId, this._rigOrder);
        this.setState({
            isDeclassifyPopupDisplaying: false
        });
    };
    /**
     * Re render the classified response details after declassification.
     */
    StandardisationSetupContainer.prototype.reRenderOnClassifiedResponseReceived = function () {
        this.setState({
            renderedOn: Date.now()
        });
    };
    return StandardisationSetupContainer;
}(pureRenderComponent));
module.exports = StandardisationSetupContainer;
//# sourceMappingURL=standardisationsetupcontainer.js.map