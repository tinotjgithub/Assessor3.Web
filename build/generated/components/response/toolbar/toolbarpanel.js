"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var Immutable = require('immutable');
var StampPanel = require('./stamppanel/stamppanel');
var stampStore = require('../../../stores/stamp/stampstore');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var responseStore = require('../../../stores/response/responsestore');
var FullResponseViewButton = require('../fullresponseviewbutton');
var enums = require('../../utility/enums');
var worklistStore = require('../../../stores/worklist/workliststore');
var markingStore = require('../../../stores/marking/markingstore');
var markingactioncreator = require('../../../actions/marking/markingactioncreator');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
var ZoomPanel = require('./zoompanel/zoompanel');
var MessageIcon = require('./messageicon/messageicon');
var classNames = require('classnames');
var stringHelper = require('../../../utility/generic/stringhelper');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var sorthelper = require('../../../utility/sorting/sorthelper');
var comparerList = require('../../../utility/sorting/sortbase/comparerlist');
var groupHelper = require('../../../utility/grouping/grouphelper');
var grouperList = require('../../../utility/grouping/groupingbase/grouperlist');
var ExceptionIcon = require('./exceptionicon/exceptionicon');
var exceptionHelper = require('../../utility/exception/exceptionhelper');
var SupervisorRemarkIcon = require('./supervisoricons/supervisorremarkicon');
var PromoteResponseIcons = require('./supervisoricons/promoteresponseicons');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var qigStore = require('../../../stores/qigselector/qigstore');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var eCourseworkResponseActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');
var OverlayPanel = require('./stamppanel/acetate/overlaypanel');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var ecourseworkFilelistPanelState = require('../../../stores/useroption/typings/ecourseworkfilelistpanelstate');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var BookmarkIcon = require('./bookmarkicon/bookmarkicon');
var bookmarkHelper = require('../../../stores/marking/bookmarkhelper');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var htmlviewerhelper = require('../../utility/responsehelper/htmlviewerhelper');
var NoteIcon = require('./noteicon/noteicon');
var DiscardResponseIcon = require('./discardresponse/discardresponse');
/**
 * React component class for response toolbar.
 */
var ToolbarPanel = (function (_super) {
    __extends(ToolbarPanel, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function ToolbarPanel(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.columnClassName = ' col-1';
        this.isStampPanelExpanded = false;
        this.isRemarkButtonExpanded = false;
        this.isRemarkButtonClicked = false;
        this.isSupervisorRemarkAlreadyRaised = false;
        this.showSupervisorRemarkButton = true;
        this.isPromoteResponseButtonExpanded = false;
        this.isPromoteResponseButtonClicked = false;
        this.isPromoteToReuseBucketVisible = false;
        this.isResponseChanged = false;
        //Set to true if Qig Changed with in whole response or in response navigation
        this.isQigChanged = false;
        //Set to true if Annotations are auto-populated inside favourite toolbar if annotations
        //configured for the qig is less than AUTO_POPULATE_STAMPS_TO_FAVOUIRITES_COUNT
        this.isAnnotationAutoPopulate = false;
        this.doUnMount = false;
        /**
         * Handles the click on the supervisor remark button
         * @param {any} event
         */
        this.handleRemarkButtonClick = function (event) {
            _this.isSupervisorRemarkAlreadyRaised = false;
            _this.validateRaiseSupervisorRemarkPanel();
        };
        /**
         * Handles the click on outside for promote response button
         * @param {any} event
         */
        this.handleOutsideClickForPromoteResponseButton = function (event) {
            if (_this.isPromoteResponseButtonExpanded && !_this.isPromoteResponseButtonClicked) {
                _this.isPromoteResponseButtonExpanded = !_this.isPromoteResponseButtonExpanded;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            _this.isPromoteResponseButtonClicked = false;
        };
        /**
         * Handles the click on the promote to response button
         * @param {any} event
         */
        this.handlePromoteResponseButtonClick = function (event) {
            // If popup is not open, Get the Details
            if (!_this.isPromoteResponseButtonExpanded) {
                // handling offline scenarios
                if (!applicationActionCreator.checkActionInterrupted()) {
                    return;
                }
                _this.isPromoteResponseButtonClicked = true;
                _this.isPromoteResponseButtonExpanded = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Re-rendering the to hide the pop up when promote to reusebutton button is clicked .
         */
        this.onPromoteToReuseCompleted = function () {
            _this.isPromoteResponseButtonExpanded = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Handles the click on outside for supervisor remark button
         * @param {any} event
         */
        this.handleOutsideClickForRemarkButton = function (event) {
            if (_this.isRemarkButtonExpanded && !_this.isRemarkButtonClicked) {
                _this.isRemarkButtonExpanded = !_this.isRemarkButtonExpanded;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            _this.isRemarkButtonClicked = false;
        };
        /**
         * Fires after annotation panel is expanded/collapsed
         */
        this.onStampPanelModeChanged = function () {
            if (toolbarStore.instance.isStampPanelExpanded === false && stampStore.instance.currentStampBannerType !== enums.BannerType.None
                && stampStore.instance.currentStampBannerType !== undefined) {
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.None, true);
            }
            _this.setState({
                renderedOn: Date.now(),
                isStampPanelExpanded: toolbarStore.instance.isStampPanelExpanded
            });
            markingactioncreator.setMarkEntrySelected();
        };
        /**
         * Callback function for stamppanel component.
         */
        this.setNumberOfColumnsInFavouriteToolBar = function (numberOfColumns) {
            _this.columnClassName = ' col-' + numberOfColumns;
            _this.props.hasMultipleColumns(numberOfColumns > 1);
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to Re render the component once the note saved in db
         */
        this.reRender = function () {
            _this.setState({
                noteTextValue: _this.currentNoteFromStore
            });
        };
        /**
         * Full response button click
         */
        this.onFullResponseClick = function () {
            if (_this.props.onFullResponseClick != null) {
                _this.props.onFullResponseClick();
            }
        };
        /**
         * Response View Change click
         */
        this.responseViewModeChanged = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         *  This method will display the stamp banner messages.
         */
        this.showStampPanelHelperMessages = function () {
            if (_this.isAnnotationAutoPopulate) {
                return;
            }
            // This section will works on first time, while opening the responses.
            if (stampStore.instance.currentStampBannerType === undefined && stampStore.instance.isFavouriteToolbarEmpty
                && stampStore.instance.stampsAgainstCurrentQig(responseStore.instance.isWholeResponse).count() > 0
                && (markerOperationModeFactory.operationMode.isMarkingMode ||
                    markerOperationModeFactory.operationMode.isStandardisationSetupMode)) {
                toolbarActionCreator.ChangeStampPanelMode(true);
                if (!_this.props.isDigitalFileSelected || !_this.props.isUnzoned) {
                    stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
                }
            }
            else if (!_this.props.isMessagePanelVisible && !stampStore.instance.isFavouriteToolbarEmpty) {
                toolbarActionCreator.ChangeStampPanelMode(false);
            }
            // This section will works when returning from FRV.Initial loading this won't work because we are checking currentBannerType
            // is undefined or not.
            if (stampStore.instance.currentStampBannerType !== undefined &&
                stampStore.instance.currentStampBannerType !== enums.BannerType.None) {
                stampActionCreator.updateStampBannerVisibility(stampStore.instance.currentStampBannerType, true);
            }
        };
        /**
         * On favorite stamp list updated (added or removed icon)
         */
        this.favoriteStampListUpdated = function (favoriteStampActionType) {
            switch (favoriteStampActionType) {
                case enums.FavoriteStampActionType.Add:
                case enums.FavoriteStampActionType.Insert:
                    // we have to check favourite toolbar is non-empty check here because add event will be fired if just drag and leave
                    // a stamp from main toolbar
                    if (stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner &&
                        !stampStore.instance.isFavouriteToolbarEmpty) {
                        stampActionCreator.updateStampBannerVisibility(enums.BannerType.ShrinkExpandedBanner, true);
                    }
                    break;
                case enums.FavoriteStampActionType.Remove:
                    if (stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner &&
                        !stampStore.instance.isFavouriteToolbarEmpty) {
                        stampActionCreator.updateStampBannerVisibility(enums.BannerType.ShrinkExpandedBanner, true);
                    }
                    break;
            }
            if ((_this.isQigChanged && _this.isResponseChanged)) {
                var stampsAgainstCurrentQig = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, responseStore.instance.isWholeResponse);
                _this.setStampPanelStatus();
                if (stampStore.instance.isFavouriteToolbarEmpty && stampStore.instance.currentStampBannerType
                    !== enums.BannerType.ShrinkExpandedBanner) {
                    stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
                }
                else if (stampStore.instance.isFavouriteToolbarEmpty && stampStore.instance.currentStampBannerType
                    === enums.BannerType.ShrinkExpandedBanner) {
                    stampActionCreator.updateStampBannerVisibility(enums.BannerType.ShrinkExpandedBanner, true);
                }
                // setting stamp panel collapsed when annotation count is zero
                if (stampsAgainstCurrentQig.count() === 0) {
                    _this.isStampPanelExpanded = false;
                }
                _this.setState({
                    renderedOn: Date.now(),
                    isStampPanelExpanded: _this.isStampPanelExpanded
                });
                // De-select annotation if it is not configured for the selected qig
                if (!_this.isSelectedAnnotationConfigured() && toolbarStore.instance.selectedStampId) {
                    stampActionCreator.deSelectAnnotation();
                }
                _this.isQigChanged = false;
                _this.isResponseChanged = false;
            }
            //check blocking message show/hide on load 
            if (_this.isQigChanged && favoriteStampActionType === enums.FavoriteStampActionType.LoadFromUserOption) {
                //show block message if favourite panel is empty and hide if message panel is non empty
                if (stampStore.instance.currentStampBannerType === undefined && stampStore.instance.isFavouriteToolbarEmpty) {
                    _this.showStampPanelHelperMessages();
                }
                else if (stampStore.instance.currentStampBannerType === undefined) {
                    stampActionCreator.updateStampBannerVisibility(enums.BannerType.None, true);
                }
                _this.isQigChanged = false;
            }
        };
        /**
         *  If required this will set the exapnded status of stamp panel.
         */
        this.setStampPanelStatus = function () {
            if (toolbarStore.instance.isStampPanelExpanded === false &&
                stampStore.instance.isFavouriteToolbarEmpty &&
                stampStore.instance.stampsAgainstCurrentQig(responseStore.instance.isWholeResponse).count() !== 0) {
                toolbarActionCreator.ChangeStampPanelMode(true);
                _this.isStampPanelExpanded = true;
            }
            else {
                _this.isStampPanelExpanded = toolbarStore.instance.isStampPanelExpanded;
            }
        };
        /**
         * Method to check if supervisor remark already raised for the response
         */
        this.openRaiseSupervisorRemarkPanel = function () {
            _this.isRemarkButtonExpanded = true;
            if (responseStore.instance.supervisorremarkrequestreturn.isSupervisorRemarkRaised) {
                _this.setSupervisorDescription();
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to set supervisor remark already raised for the response
         */
        this.setSupervisorDescription = function () {
            _this.isSupervisorRemarkAlreadyRaised = true;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to check if supervisor remark already raised for the response
         */
        this.validateRaiseSupervisorRemarkPanel = function () {
            // If popup is not open, Get the Details
            if (!_this.isRemarkButtonExpanded) {
                _this.isRemarkButtonClicked = true;
                var candidateScriptId = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
                responseActionCreator.getResponseDetailsForSupervisorRemark(candidateScriptId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, operationModeHelper.subExaminerId, responseStore.instance.isWholeResponse);
            }
        };
        /**
         * Method to check if supervisor remark already raised for the response
         */
        this.isSupervisorRmarkButtonVisible = function (isVisible) {
            _this.showSupervisorRemarkButton = isVisible;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Re-rendering the to hide icons when promote to seed button is clicked when there is no error returned
         */
        this.onPromoteToSeedButtonClicked = function (promoteToSeedError) {
            if (promoteToSeedError === enums.PromoteToSeedErrorCode.None) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Method to set expand/collapse status of filelist panel
         */
        this.toggleFilelistPanel = function (isFilelistPanelCollapsed) {
            _this.setState({
                renderedOn: Date.now(),
                isFilelistPanelCollapsed: isFilelistPanelCollapsed
            });
            eCourseworkResponseActionCreator.updateZoomOnToggleFileListPanel();
        };
        /**
         * Method to re-render favorites toolbar
         */
        this.reRenderFavoritesToolbarOnQigChange = function () {
            _this.isQigChanged = true;
            // Re-render on auto populate favorite stamps, in case of whole response
            if (responseStore.instance.isWholeResponse) {
                // Update favorite stamp panel
                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add, undefined, Immutable.List(stampStore.instance.getFavoriteStamps));
            }
            stampActionCreator.showOrHideoffPageVisibility();
            _this.setState({
                renderedOn: Date.now()
            });
            // ToDo we need to revert this fix and check 
            // is this issue exisist or not when the react new version comes
            // fix for the annotation rendering issue in favarate panel for the IE11 for the whole response
            var that = _this;
            if (htmlUtilities.isIE) {
                that.doUnMount = true;
                setTimeout(function () {
                    that.doUnMount = false;
                    that.setState({
                        renderedOn: Date.now()
                    });
                }, 100);
            }
        };
        /**
         * Fires once the response is changed through response navigation
         */
        this.responseChanged = function () {
            _this.isResponseChanged = true;
            _this.setState({
                noteTextValue: _this.currentNoteFromStore
            });
        };
        /**
         * Method to re-render bookmarks
         */
        this.reRenderBookmarks = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         *  This will re-render the component.
         * @param removedAnnotation
         * @param isPanAvoidImageContainerRender
         */
        this.reRenderBookmarkList = function (removedAnnotation, isPanAvoidImageContainerRender, contextMenuType) {
            if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
            if (contextMenuType === void 0) { contextMenuType = enums.ContextMenuType.annotation; }
            if (contextMenuType === enums.ContextMenuType.bookMark) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        var ecourseworkFileListPanelUserOption = this.ecourseworkFileListPanelUserOption;
        var isFilelistPanelCollapsed = ecourseworkFileListPanelUserOption.iscollapsed ? true : false;
        var currentFileListPanelView = ecourseworkFileListPanelUserOption.fileListPanelView === undefined
            ? enums.FileListPanelView.List : ecourseworkFileListPanelUserOption.fileListPanelView;
        var currentResponseNote = this.currentNoteFromStore;
        this.state = {
            renderedOn: 0,
            isStampPanelExpanded: toolbarStore.instance.isStampPanelExpanded,
            isFilelistPanelCollapsed: isFilelistPanelCollapsed,
            noteTextValue: currentResponseNote
        };
        // To update value in store
        eCourseworkResponseActionCreator.fileListPanelToggle(isFilelistPanelCollapsed);
        eCourseworkResponseActionCreator.filelistPanelSwitchView(currentFileListPanelView);
        this.setNumberOfColumnsInFavouriteToolBar = this.setNumberOfColumnsInFavouriteToolBar.bind(this);
        this.onFullResponseClick = this.onFullResponseClick.bind(this);
    }
    /**
     * This function gets called when the component is mounted
     */
    ToolbarPanel.prototype.componentDidMount = function () {
        // Adding subscription to the events
        this.addEventListeners();
        if (!markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            this.CustomiseFavauritesPanel();
            this.showStampPanelHelperMessages();
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    ToolbarPanel.prototype.componentWillUnmount = function () {
        // Removing subscription to the events
        this.removeEventListeners();
    };
    /**
     * This function subscribes to different events
     */
    ToolbarPanel.prototype.addEventListeners = function () {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        stampStore.instance.addListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED, this.responseViewModeChanged);
        window.addEventListener('click', this.handleOutsideClickForRemarkButton);
        window.addEventListener('click', this.handleOutsideClickForPromoteResponseButton);
        responseStore.instance.addListener(responseStore.ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT, this.isSupervisorRmarkButtonVisible);
        responseStore.instance.addListener(responseStore.ResponseStore.VALIDATION_SUCCESS, this.openRaiseSupervisorRemarkPanel);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT, this.onPromoteToSeedButtonClicked);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this.toggleFilelistPanel);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT, this.onPromoteToReuseCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.reRenderBookmarks);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.reRenderBookmarks);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRenderBookmarkList);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.reRenderFavoritesToolbarOnQigChange);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.
            SAVE_NOTE_COMPLETED_ACTION_EVENT, this.reRender);
    };
    /**
     * This function removes all the event subscriptions
     */
    ToolbarPanel.prototype.removeEventListeners = function () {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        stampStore.instance.removeListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED, this.responseViewModeChanged);
        window.removeEventListener('click', this.handleOutsideClickForRemarkButton);
        window.removeEventListener('click', this.handleOutsideClickForPromoteResponseButton);
        responseStore.instance.removeListener(responseStore.ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT, this.isSupervisorRmarkButtonVisible);
        responseStore.instance.removeListener(responseStore.ResponseStore.VALIDATION_SUCCESS, this.openRaiseSupervisorRemarkPanel);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT, this.onPromoteToSeedButtonClicked);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this.toggleFilelistPanel);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT, this.onPromoteToReuseCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.reRenderBookmarks);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.reRenderBookmarks);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRenderBookmarkList);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, this.reRenderFavoritesToolbarOnQigChange);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.
            SAVE_NOTE_COMPLETED_ACTION_EVENT, this.reRender);
    };
    /**
     * Render component
     */
    ToolbarPanel.prototype.render = function () {
        var filelistPanelCollapsedClass = this.state.isFilelistPanelCollapsed ? ' media-collapsed ' : ' media-expanded ';
        var favouritesStampCollection = stampStore.instance.getFavoriteStamps();
        var toolPanelClass = classNames('tool-panel', { 'expanded collapsed': this.state.isStampPanelExpanded })
            + filelistPanelCollapsedClass;
        // Get the selected doc PageID for the selected file, If component is ECoursework
        var selectedECourseworkPageID = 0;
        if (this.props.isECourseWorkResponse) {
            var getSelectedECourseworkImages = eCourseworkHelper.getSelectedECourseworkImages();
            if (getSelectedECourseworkImages) {
                selectedECourseworkPageID = eCourseworkHelper.getSelectedECourseworkImages().docPageID;
            }
        }
        if (!this.props.hideStampPanelIcon || this.doRenderOverlayPanel) {
            toolPanelClass += this.columnClassName;
        }
        var svgPointerEventsStyle = {};
        svgPointerEventsStyle.pointerEvents = 'none';
        // hideStampPanelIcon: If marking is not started, hiding the toolbar panel (for closed response view)
        /*When we navigate away from response and there are marks to save to db, response screen would be shown untill
        * save marks completed. But Marking progress will be immediately set to false.Then tool bar panel wont be shown.
        in order to avoid that we need to check where we are navigating as well.navigateTo will only be set when navigating
        from open or ingarce response
        */
        var stampPanel = this.hideStampPanel ? null :
            React.createElement(StampPanel, {id: 'stampPanel', key: 'stampPanel', favouriteStampsCollection: favouritesStampCollection, actualStampsCollection: stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, responseStore.instance.isWholeResponse), selectedLanguage: this.props.selectedLanguage, isStampPanelExpanded: this.state.isStampPanelExpanded, setNumberOfColumnsInFavouriteToolBar: this.setNumberOfColumnsInFavouriteToolBar, doDisableMarkingOverlay: this.props.doDisableMarkingOverlay, isOverlayAnnotationsVisible: this.props.isOverlayAnnotationsVisible});
        // The button to send message shall not be shown on opening a simulation response. 
        var messageIcon = (worklistStore.instance.currentWorklistType !== enums.WorklistType.simulation &&
            !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) ?
            React.createElement("div", {className: 'icon-tray new-msg-icons'}, React.createElement("ul", null, React.createElement(MessageIcon, {id: 'message-button', key: 'key-message-button', onMessageSelected: this.props.onMessageSelected, onCreateNewMessageSelected: this.props.onCreateNewMessageSelected, selectedMessageId: this.props.selectedMessageId, onMessageReadStatusReflected: this.props.onMessageReadStatusReflected, selectedLanguage: this.props.selectedLanguage, isNewMessageButtonHidden: this.props.isNewMessageButtonHidden}))) : null;
        var frvIcon = (!htmlviewerhelper.isHtmlComponent ? React.createElement("div", {className: 'icon-tray change-view-icons'}, React.createElement("ul", null, React.createElement(FullResponseViewButton, {id: 'fullResponse', key: 'fullResponse', onFullResponseClick: this.onFullResponseClick, selectedLanguage: this.props.selectedLanguage}))) : null);
        // Exception icon need not be shown in the following cases :
        // 1. Markingcheck worklist.
        // 2. Help Examiners worklist.
        // 3. Simulation worklist.
        var doShowExceptionIcon = !((worklistStore.instance.isMarkingCheckMode ||
            markerOperationModeFactory.operationMode.isHelpExaminersView ||
            markerOperationModeFactory.operationMode.isStandardisationSetupMode));
        var exceptionIcon = doShowExceptionIcon ?
            React.createElement("div", {className: 'icon-tray exception-icons'}, React.createElement("ul", null, React.createElement(ExceptionIcon, {id: 'exception-button', key: 'exception-button', onExceptionSelected: this.props.onExceptionSelected, onCreateNewExceptionClicked: this.props.onCreateNewExceptionClicked, selectedLanguage: this.props.selectedLanguage, canRaiseException: exceptionHelper.canRaiseException(markerOperationModeFactory.operationMode.isTeamManagementMode), selectedResponseViewMode: this.props.selectedResponseViewMode, onRejectRigClick: this.props.onRejectRigClick}))) : null;
        /* To hide zoom panel if downloadable file. */
        var doHideZoomPanelIcon = this.props.isDigitalFileSelected || this.props.isUnzoned || this.isSelectedFileDigital;
        var zoomPanelIcon = doHideZoomPanelIcon ? null :
            React.createElement("div", {className: 'icon-tray zoom-icons'}, React.createElement("ul", null, React.createElement(ZoomPanel, {id: 'zoompanel', key: 'zoompanel', selectedECourseworkPageID: selectedECourseworkPageID, selectedLanguage: this.props.selectedLanguage})));
        /*  Note icon sahall be displayed for all provisional, unclassified and classified responses in the standardisation setup area. */
        var noteIcon = this.doShowNoteIcon ?
            React.createElement("div", {className: classNames('icon-tray note-icon', this.state.noteTextValue === '' || this.state.noteTextValue === null ? '' : 'exsist')}, React.createElement("ul", null, React.createElement(NoteIcon, {id: 'note-icon', key: 'noteicon', selectedLanguage: this.props.selectedLanguage, noteTextValue: this.state.noteTextValue}))) : null;
        var sortedBookmarkItems;
        var bookmarkPanel = null;
        var discardResponse = this.props.isDiscardResponseButtonVisible ?
            React.createElement("div", {className: 'icon-tray discard-icon'}, React.createElement("ul", {id: 'discard_response_icon_id', key: 'discard_response_key'}, React.createElement(DiscardResponseIcon, {id: 'discardresponse_id', key: 'discardresponse_key', onIconClick: this.props.onDiscardStandardisationResponseIconClicked})))
            : null;
        // Bookmark icon need to be shown in all worklists if all the following conditions are true:
        // 1. Unstructured component(including Ecoursework)
        // 2. Bookmark CC is enabled
        var doShowBookmarkIcon = bookmarkHelper.isBookMarkEnabled
            && responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured
            && !this.props.isDigitalFileSelected
            && !this.isSelectedFileDigital;
        if (doShowBookmarkIcon) {
            sortedBookmarkItems = bookmarkHelper.getSortedBookmarkList(this.props.isECourseWorkResponse);
            bookmarkPanel =
                React.createElement("div", {className: 'icon-tray add-bm-icons'}, React.createElement("ul", null, React.createElement(BookmarkIcon, {id: 'bookmark-panel', key: 'bookmark-panel', selectedLanguage: this.props.selectedLanguage, bookmarkItems: sortedBookmarkItems})));
        }
        return (React.createElement("div", {id: 'toolPanelId', className: toolPanelClass, onClick: this.onClickHandler}, this.props.fileList, React.createElement("div", {className: 'tools-panel-default'}, frvIcon, messageIcon, exceptionIcon, zoomPanelIcon, noteIcon, discardResponse, bookmarkPanel, React.createElement("div", {className: 'icon-tray sup-remark-icons'}, React.createElement("ul", null, React.createElement(PromoteResponseIcons, {id: 'promote-response-icons', key: 'promote-response-icons-key', isOpen: this.isPromoteResponseButtonExpanded, isPromotToSeedVisible: markerOperationModeFactory.operationMode.isPromoteToSeedButtonVisible, isPromotToReuseBucketVisible: markerOperationModeFactory.operationMode.isPromoteToReuseButtonVisible, onPromoteResponseButtonClicked: this.handlePromoteResponseButtonClick, onPromoteToSeedButtonClicked: this.props.onPromoteToSeedButtonClicked, onPromoteToReuseButtonClicked: this.props.onPromoteToReuseButtonClicked, selectedLanguage: this.props.selectedLanguage}), React.createElement(SupervisorRemarkIcon, {id: 'supervisor-rem-holder', key: 'supervisor-rem-holder', isOpen: this.isRemarkButtonExpanded, isSupervisorRemarkButtonVisible: this.showSupervisorRemarkButton === true ?
            markerOperationModeFactory.operationMode.isSupervisorRemarkButtonVisible : false, onRemarkButtonClicked: this.handleRemarkButtonClick, onMarkNowButtonClicked: this.props.onRemarkNowButtonClicked, onMarkLaterButtonClicked: this.props.onRemarkLaterButtonClicked, isSupervisorRemarkRaised: this.isSupervisorRemarkAlreadyRaised}))), React.createElement("div", {className: 'annotation-panel-holder'}, this.renderOverlayPanel(), stampPanel))));
    };
    Object.defineProperty(ToolbarPanel.prototype, "doRenderOverlayPanel", {
        /* return true if we need to render overlay panel */
        get: function () {
            // No overlays in eBookmarking components
            return (markingStore.instance.currentResponseMode === enums.ResponseMode.closed ||
                markerOperationModeFactory.operationMode.isTeamManagementMode) &&
                !eCourseworkHelper.isECourseworkComponent && this.props.isOverlayAnnotationsVisible &&
                !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This function renders the Overlay toolicons for closed response.
     */
    ToolbarPanel.prototype.renderOverlayPanel = function () {
        if (this.doRenderOverlayPanel) {
            return (React.createElement(OverlayPanel, {id: 'overlay_id', key: 'overlay_key', isResponseModeClosed: true}));
        }
        else {
            return null;
        }
    };
    /**
     * on click handler
     * @param event
     */
    ToolbarPanel.prototype.onClickHandler = function (event) {
        stampActionCreator.showOrHideComment(false);
    };
    Object.defineProperty(ToolbarPanel.prototype, "ecourseworkFileListPanelUserOption", {
        /**
         * Method which gets the ecoursework FileList Panel status from the user option
         */
        get: function () {
            // Getting the user option for EcourseworkFileListPanel
            var _ecourseworkFilelistPanelState = new ecourseworkFilelistPanelState();
            var _userOptionValue = userOptionsHelper.getUserOptionByName(userOptionKeys.ECOURSEWORK_FILELIST_PANEL_STATE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            if (_userOptionValue) {
                _ecourseworkFilelistPanelState = JSON.parse(_userOptionValue);
            }
            return _ecourseworkFilelistPanelState;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  If the stamps related data for the favourites toolbar is not yet customised,
     *  check the user already saved some favourites stamps other wise auto populate the stamps based on the configuration
     */
    ToolbarPanel.prototype.CustomiseFavauritesPanel = function () {
        if (!userOptionsHelper.hasExaminerCustomisedTheStamps()) {
            var favouritesStampCollection = stampStore.instance.getFavoriteStamps();
            // added the condition to remove system added annotations to be added into the favorites panel
            var actualStampsCollection = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, responseStore.instance.isWholeResponse).filter(function (stampdata) { return !stampdata.addedBySystem; }).toList();
            // Check the favourites panel is empty, Also Annotations configured against current QIG
            if (favouritesStampCollection.count() === 0 &&
                actualStampsCollection.count() <= parseInt(config.marksandannotationsconfig.AUTO_POPULATE_STAMPS_TO_FAVOUIRITES_COUNT)) {
                this.isAnnotationAutoPopulate = true;
                var stampIds_1 = '';
                // Getting the stamps grouped by stamp type
                var groupedStamps_1 = groupHelper.group(actualStampsCollection, grouperList.StampsGrouper, enums.GroupByField.stampType);
                // Getting the stamp types as key collection
                var groupedKeys = groupedStamps_1.keySeq();
                // Using sorting helper to sort the list based on the stamp types
                groupedKeys = sorthelper.sort(groupedKeys, comparerList.stampTypeComparer);
                // Loop through the keys and find the list of Stamps for the group.
                groupedKeys.forEach(function (key) {
                    // Get the Stamps for the group.
                    var currentStampGroup = groupedStamps_1.get(key);
                    currentStampGroup = (Immutable.List(currentStampGroup)).sort(function (valueA, valueB) {
                        return valueA.name.localeCompare(valueB.name);
                    }).toList();
                    if (currentStampGroup.count() > 0) {
                        currentStampGroup.forEach(function (x) { return stampIds_1 += x.stampId + ','; });
                    }
                });
                // Remove the last ','
                stampIds_1 = stampIds_1.substring(0, stampIds_1.length - 1);
                // Split the comma separated favorite stamp and convert it to array of number
                var favoriteStampList = stringHelper.split(stampIds_1, stringHelper.COMMA_SEPARATOR).map(Number);
                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.LoadFromUserOption, undefined, Immutable.List(favoriteStampList));
                // Collapse the toolbar
                toolbarActionCreator.ChangeStampPanelMode(false);
                // Hide the banners
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.None, true);
                // Close the panel
                this.setState({ renderedOn: 0, isStampPanelExpanded: false });
                // Call user option save to save the stamps to favourites tool bar.
                userOptionsHelper.save(userOptionKeys.REMEMBER_CHOSEN_STAMPS, stampIds_1, true, true, false, true, markingStore.instance.selectedQIGExaminerRoleId);
            }
        }
    };
    /**
     * return true if selected annotation is configured for the selected qig
     */
    ToolbarPanel.prototype.isSelectedAnnotationConfigured = function () {
        var stampConfigured = false;
        if (toolbarStore.instance.selectedStampId) {
            var actualStampsCollection = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, responseStore.instance.isWholeResponse);
            var favouritesStampCollection = stampStore.instance.getFavoriteStamps();
            favouritesStampCollection.map(function (item) {
                if (item.stampId === toolbarStore.instance.selectedStampId) {
                    stampConfigured = true;
                    return stampConfigured;
                }
            });
            if (stampConfigured) {
                return stampConfigured;
            }
            actualStampsCollection.map(function (item) {
                if (item.stampId === toolbarStore.instance.selectedStampId) {
                    stampConfigured = true;
                    return stampConfigured;
                }
            });
            return stampConfigured;
        }
    };
    Object.defineProperty(ToolbarPanel.prototype, "isSelectedFileDigital", {
        /* return true if selected file is digital */
        get: function () {
            return eCourseworkHelper.isECourseworkComponent &&
                eCourseworkHelper.getSelectedECourseworkImageFile() === undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * When the component is about to receive new props.
     * @param nextProps
     */
    ToolbarPanel.prototype.componentWillReceiveProps = function (nextProps) {
        var showStampBanner = stampStore.instance.isFavouriteToolbarEmpty
            && stampStore.instance.stampsAgainstCurrentQig(responseStore.instance.isWholeResponse).count() > 0
            && markerOperationModeFactory.operationMode.isMarkingMode;
        if (showStampBanner) {
            // For unzoned images in ebookMarking reset the stamp banner when the corrct props value is received.
            if (nextProps.isUnzoned && stampStore.instance.currentStampBannerType !== undefined) {
                stampActionCreator.updateStampBannerVisibility(undefined, false);
            }
            else if (!nextProps.isUnzoned && stampStore.instance.currentStampBannerType === undefined) {
                // After resetting set the banner type correctly if the next question item has a zone, 
                // to show banner while navigating from unzoned to zoned question item.
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
            }
        }
    };
    Object.defineProperty(ToolbarPanel.prototype, "hideStampPanel", {
        /**
         * Whether or not to hide the stamp panel.
         */
        get: function () {
            return this.props.hideStampPanelIcon
                || this.props.isUnzoned === true
                || this.isSelectedFileDigital
                || standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
                || this.doUnMount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarPanel.prototype, "currentNoteFromStore", {
        /**
         * Method to get the current response note from store
         */
        get: function () {
            return this.doShowNoteIcon
                && standardisationSetupStore.instance.standardisationSetUpResponsedetails.
                    standardisationResponses.filter(function (x) { return x.displayId === markingStore.instance.selectedDisplayId.toString(); }).first().note;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarPanel.prototype, "doShowNoteIcon", {
        /**
         * Whether or not to show noteicon.
         */
        get: function () {
            return markerOperationModeFactory.operationMode.isStandardisationSetupMode
                && !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup;
        },
        enumerable: true,
        configurable: true
    });
    return ToolbarPanel;
}(pureRenderComponent));
module.exports = ToolbarPanel;
//# sourceMappingURL=toolbarpanel.js.map