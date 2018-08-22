/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import Immutable = require('immutable');
import StampPanel = require('./stamppanel/stamppanel');
import stampStore = require('../../../stores/stamp/stampstore');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import responseStore = require('../../../stores/response/responsestore');
import FullResponseViewButton = require('../fullresponseviewbutton');
import enums = require('../../utility/enums');
import worklistStore = require('../../../stores/worklist/workliststore');
import markingStore = require('../../../stores/marking/markingstore');
import markingactioncreator = require('../../../actions/marking/markingactioncreator');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');
import toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
import ZoomPanel = require('./zoompanel/zoompanel');
import MessageIcon = require('./messageicon/messageicon');
let classNames = require('classnames');
import stringHelper = require('../../../utility/generic/stringhelper');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import StampData = require('../../../stores/stamp/typings/stampdata');
import sorthelper = require('../../../utility/sorting/sorthelper');
import comparerList = require('../../../utility/sorting/sortbase/comparerlist');
import groupHelper = require('../../../utility/grouping/grouphelper');
import grouperList = require('../../../utility/grouping/groupingbase/grouperlist');
import stampData = require('../../../stores/stamp/typings/stampdata');
import ExceptionIcon = require('./exceptionicon/exceptionicon');
import exceptionHelper = require('../../utility/exception/exceptionhelper');
import SupervisorRemarkIcon = require('./supervisoricons/supervisorremarkicon');
import PromoteResponseIcons = require('./supervisoricons/promoteresponseicons');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import qigStore = require('../../../stores/qigselector/qigstore');
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import eCourseworkResponseActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');
import OverlayPanel = require('./stamppanel/acetate/overlaypanel');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import ecourseworkFilelistPanelState = require('../../../stores/useroption/typings/ecourseworkfilelistpanelstate');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import BookmarkIcon = require('./bookmarkicon/bookmarkicon');
import bookmarkHelper = require('../../../stores/marking/bookmarkhelper');
import bookmarkComponentWrapper = require('../../../stores/marking/bookmarkcomponentwrapper');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import htmlviewerhelper = require('../../utility/responsehelper/htmlviewerhelper');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import messageStore = require('../../../stores/message/messagestore');
import NoteIcon = require('./noteicon/noteicon');
import DiscardResponseIcon = require('./discardresponse/discardresponse');
import awardingStore = require('../../../stores/awarding/awardingstore');
import ReturnResponseToMarkerIcon = require('./supervisoricons/returnresponsetomarkericon');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
declare let config: any;

interface Props extends PropsBase, LocaleSelectionBase {
    onFullResponseClick: Function;
    hideStampPanelIcon: boolean;
    onMessageSelected: Function;
    onCreateNewMessageSelected: Function;
    onMessageReadStatusReflected: Function;
    onExceptionSelected: Function;
    onCreateNewExceptionClicked: Function;
    selectedMessageId: number;
    isNewMessageButtonHidden: boolean;
    onRemarkNowButtonClicked: Function;
    onRemarkLaterButtonClicked: Function;
    onPromoteToSeedButtonClicked: Function;
    onPromoteToReuseButtonClicked: Function;
    onRejectRigClick: Function;
    selectedResponseViewMode?: enums.ResponseViewMode;
    fileList: JSX.Element;
    renderedOn: number;
    hasMultipleColumns: Function;
    isDigitalFileSelected?: boolean;
    isECourseWorkResponse: boolean;
    isUnzoned: boolean;
    doDisableMarkingOverlay: Function;
    isOverlayAnnotationsVisible: boolean;
    isMessagePanelVisible: boolean;
    isDiscardResponseButtonVisible?: boolean;
    onDiscardStandardisationResponseIconClicked: Function;
}

interface State {
    renderedOn: number;
    isStampPanelExpanded?: boolean;
    issupervisorRemarkCheckFailureAlertPopupDisplaying?: boolean;
    isFilelistPanelCollapsed?: boolean;
    noteTextValue?: string;
}

/**
 * React component class for response toolbar.
 */
class ToolbarPanel extends pureRenderComponent<Props, State> {
    private columnClassName: string = ' col-1';
    private isStampPanelExpanded: boolean = false;
    private isRemarkButtonExpanded: boolean = false;
    private isRemarkButtonClicked: boolean = false;
    private isSupervisorRemarkAlreadyRaised: boolean = false;
    private showSupervisorRemarkButton: boolean = true;
    private isPromoteResponseButtonExpanded: boolean = false;
    private isPromoteResponseButtonClicked: boolean = false;
    private isPromoteToReuseBucketVisible: boolean = false;
    private isResponseChanged: boolean = false;
    //Set to true if Qig Changed with in whole response or in response navigation
    private isQigChanged: boolean = false;
    //Set to true if Annotations are auto-populated inside favourite toolbar if annotations
    //configured for the qig is less than AUTO_POPULATE_STAMPS_TO_FAVOUIRITES_COUNT
    private isAnnotationAutoPopulate: boolean = false;

    private doUnMount: boolean = false;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        let ecourseworkFileListPanelUserOption = this.ecourseworkFileListPanelUserOption;

        let isFilelistPanelCollapsed = ecourseworkFileListPanelUserOption.iscollapsed ? true : false;

        let currentFileListPanelView: enums.FileListPanelView = ecourseworkFileListPanelUserOption.fileListPanelView === undefined
            ? enums.FileListPanelView.List : ecourseworkFileListPanelUserOption.fileListPanelView;

        let currentResponseNote: string = this.currentNoteFromStore;

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
    public componentDidMount() {
        // Adding subscription to the events
        this.addEventListeners();
        if (!standardisationSetupStore.instance.isSelectResponsesWorklist
            && !markerOperationModeFactory.operationMode.isAwardingMode) {
            this.CustomiseFavauritesPanel();
            this.showStampPanelHelperMessages();
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        // Removing subscription to the events
        this.removeEventListeners();
    }

    /**
     * This function subscribes to different events
     */
    private addEventListeners() {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        stampStore.instance.addListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED, this.responseViewModeChanged);
        window.addEventListener('click', this.handleOutsideClickForRemarkButton);
        window.addEventListener('click', this.handleOutsideClickForPromoteResponseButton);
        responseStore.instance.addListener(responseStore.ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT,
            this.isSupervisorRmarkButtonVisible);
        responseStore.instance.addListener(responseStore.ResponseStore.VALIDATION_SUCCESS, this.openRaiseSupervisorRemarkPanel);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT, this.onPromoteToSeedButtonClicked);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT,
            this.toggleFilelistPanel);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT,
            this.onPromoteToReuseCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.reRenderBookmarks);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.reRenderBookmarks);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRenderBookmarkList);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.reRenderFavoritesToolbarOnQigChange);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.
            SAVE_NOTE_COMPLETED_ACTION_EVENT, this.reRender);
        examinerStore.instance.addListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.reRenderToolBar);
    }

    /**
     * This function removes all the event subscriptions
     */
    private removeEventListeners() {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        stampStore.instance.removeListener(stampStore.StampStore.FAVORITE_STAMP_UPDATED, this.favoriteStampListUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_VIEW_MODE_CHANGED, this.responseViewModeChanged);
        window.removeEventListener('click', this.handleOutsideClickForRemarkButton);
        window.removeEventListener('click', this.handleOutsideClickForPromoteResponseButton);
        responseStore.instance.removeListener(responseStore.ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT,
            this.isSupervisorRmarkButtonVisible);
        responseStore.instance.removeListener(responseStore.ResponseStore.VALIDATION_SUCCESS, this.openRaiseSupervisorRemarkPanel);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT, this.onPromoteToSeedButtonClicked);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT,
            this.toggleFilelistPanel);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT,
            this.onPromoteToReuseCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.reRenderBookmarks);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.reRenderBookmarks);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRenderBookmarkList);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.reRenderFavoritesToolbarOnQigChange);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.
            SAVE_NOTE_COMPLETED_ACTION_EVENT, this.reRender);
        examinerStore.instance.removeListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.reRenderToolBar);
    }

    /**
     * Method to check the note editable permission.
     */
    private get isNoteEditable(): boolean {
        if (standardisationSetupStore.instance.isClassifiedWorklist) {
            return standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editClassifiedNotes;
        } else if (standardisationSetupStore.instance.isUnClassifiedWorklist) {
            return standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editUnclassifiedNotes;
        }
        return true;
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let filelistPanelCollapsedClass = this.state.isFilelistPanelCollapsed ? ' media-collapsed ' : ' media-expanded ';
        let favouritesStampCollection = this.hideStampPanel ? null : stampStore.instance.getFavoriteStamps();
        let toolPanelClass = classNames('tool-panel', { 'expanded collapsed': this.state.isStampPanelExpanded })
            + filelistPanelCollapsedClass;

        // Get the selected doc PageID for the selected file, If component is ECoursework
        let selectedECourseworkPageID = 0;
        if (this.props.isECourseWorkResponse) {
            let getSelectedECourseworkImages = eCourseworkHelper.getSelectedECourseworkImages();
            if (getSelectedECourseworkImages) {
                selectedECourseworkPageID = eCourseworkHelper.getSelectedECourseworkImages().docPageID;
            }
        }

        if (!this.props.hideStampPanelIcon || this.doRenderOverlayPanel) {
            toolPanelClass += this.columnClassName;
        }

        let svgPointerEventsStyle: React.CSSProperties = {};
        svgPointerEventsStyle.pointerEvents = 'none';

        // hideStampPanelIcon: If marking is not started, hiding the toolbar panel (for closed response view)

        /*When we navigate away from response and there are marks to save to db, response screen would be shown untill
        * save marks completed. But Marking progress will be immediately set to false.Then tool bar panel wont be shown.
        in order to avoid that we need to check where we are navigating as well.navigateTo will only be set when navigating
        from open or ingarce response
        */

        let stampPanel = this.hideStampPanel ? null :
            <StampPanel id='stampPanel'
                key='stampPanel'
                favouriteStampsCollection={favouritesStampCollection}
                actualStampsCollection={stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId,
                    responseStore.instance.isWholeResponse)}
                selectedLanguage={this.props.selectedLanguage}
                isStampPanelExpanded={this.state.isStampPanelExpanded}
                setNumberOfColumnsInFavouriteToolBar={this.setNumberOfColumnsInFavouriteToolBar}
                doDisableMarkingOverlay={this.props.doDisableMarkingOverlay}
                isOverlayAnnotationsVisible={this.props.isOverlayAnnotationsVisible} />;

        // The button to send message shall not be shown on opening a simulation response. 
        let messageIcon = (worklistStore.instance.currentWorklistType !== enums.WorklistType.simulation &&
            !standardisationSetupStore.instance.isSelectResponsesWorklist &&
            !markerOperationModeFactory.operationMode.isAwardingMode) ?
            <div className='icon-tray new-msg-icons'>
                <ul>
                    <MessageIcon id={'message-button'} key={'key-message-button'}
                        onMessageSelected={this.props.onMessageSelected}
                        onCreateNewMessageSelected={this.props.onCreateNewMessageSelected}
                        selectedMessageId={this.props.selectedMessageId}
                        onMessageReadStatusReflected={this.props.onMessageReadStatusReflected}
                        selectedLanguage={this.props.selectedLanguage}
                        isNewMessageButtonHidden={this.props.isNewMessageButtonHidden} />
                </ul>
            </div> : null;

        let frvIcon = (!htmlviewerhelper.isHtmlComponent ? <div className='icon-tray change-view-icons'>
            <ul>
                <FullResponseViewButton id={'fullResponse'}
                    key={'fullResponse'} onFullResponseClick={this.onFullResponseClick}
                    selectedLanguage={this.props.selectedLanguage} />
            </ul>
        </div> : null);

        // Exception icon need not be shown in the following cases :
        // 1. Markingcheck worklist.
        // 2. Help Examiners worklist.
        // 3. Simulation worklist.
        let doShowExceptionIcon: boolean = !((worklistStore.instance.isMarkingCheckMode ||
            markerOperationModeFactory.operationMode.isHelpExaminersView ||
            markerOperationModeFactory.operationMode.isStandardisationSetupMode ||
            markerOperationModeFactory.operationMode.isAwardingMode));

        let exceptionIcon = doShowExceptionIcon ?
            <div className='icon-tray exception-icons'>
                <ul>
                    <ExceptionIcon id={'exception-button'} key={'exception-button'}
                        onExceptionSelected={this.props.onExceptionSelected}
                        onCreateNewExceptionClicked={this.props.onCreateNewExceptionClicked}
                        selectedLanguage={this.props.selectedLanguage}
                        canRaiseException=
                        {exceptionHelper.canRaiseException(markerOperationModeFactory.operationMode.isTeamManagementMode
                            || markerOperationModeFactory.operationMode.isAwardingMode)}
                        selectedResponseViewMode={this.props.selectedResponseViewMode}
                        onRejectRigClick={this.props.onRejectRigClick} />
                </ul>
            </div> : null;

        /* To hide zoom panel if downloadable file. */
        let doHideZoomPanelIcon = this.props.isDigitalFileSelected || this.props.isUnzoned || this.isSelectedFileDigital;
        let zoomPanelIcon = doHideZoomPanelIcon ? null :
            <div className='icon-tray zoom-icons'>
                <ul>
                    <ZoomPanel id={'zoompanel'}
                        key={'zoompanel'}
                        selectedECourseworkPageID={selectedECourseworkPageID}
                        selectedLanguage={this.props.selectedLanguage} />
                </ul>
            </div>;

        /*  Note icon sahall be displayed for all provisional, unclassified and classified responses in the standardisation setup area. */
        let doShowNoteIcon = markerOperationModeFactory.operationMode.isStandardisationSetupMode &&
            !standardisationSetupStore.instance.isSelectResponsesWorklist &&
            (!this.isNoteEditable ? (this.currentNoteFromStore !== null && this.currentNoteFromStore !== '') : true) ? true : false;
        let noteIcon = doShowNoteIcon ? <div className={classNames('icon-tray note-icon',
            this.state.noteTextValue === '' || this.state.noteTextValue === null ? '' : 'exsist')}>
            <ul>
                <NoteIcon id={'note-icon'}
                    key={'noteicon'}
                    isReadOnly={this.isNoteEditable}
                    selectedLanguage={this.props.selectedLanguage}
                    noteTextValue={this.state.noteTextValue} />
            </ul>
        </div > : null;

        let sortedBookmarkItems: Array<bookmarkComponentWrapper>;
        let bookmarkPanel: JSX.Element = null;

        let discardResponse = this.props.isDiscardResponseButtonVisible ?
            <div className='icon-tray discard-icon'>
                <ul id='discard_response_icon_id'
                    key='discard_response_key'>
                    <DiscardResponseIcon
                        id='discardresponse_id'
                        key='discardresponse_key'
                        onIconClick={this.props.onDiscardStandardisationResponseIconClicked} />
                </ul>
            </div>
            : null;

        // Bookmark icon need to be shown in all worklists if all the following conditions are true:
        // 1. Unstructured component(including Ecoursework)
        // 2. Bookmark CC is enabled
        let doShowBookmarkIcon: boolean = bookmarkHelper.isBookMarkEnabled
            && responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured
            && !this.props.isDigitalFileSelected
            && !this.isSelectedFileDigital
            && (standardisationSetupStore.instance.isUnClassifiedWorklist ?
                markerOperationModeFactory.operationMode.isResponseEditable : true)
            && !markerOperationModeFactory.operationMode.isAwardingMode;
        if (doShowBookmarkIcon) {
            sortedBookmarkItems = bookmarkHelper.getSortedBookmarkList(this.props.isECourseWorkResponse);

            bookmarkPanel =
                <div className='icon-tray add-bm-icons'>
                    <ul>
                        <BookmarkIcon id={'bookmark-panel'} key={'bookmark-panel'}
                            selectedLanguage={this.props.selectedLanguage}
                            bookmarkItems={sortedBookmarkItems} />
                    </ul>
                </div>;
        }

        let returnResponseToMarkerIcon = this.doShowReturnResponseToMarkerIcon ?
            (<ReturnResponseToMarkerIcon id={'ReturnResponseToMarker_id'}
                key={'ReturnResponseToMarker_key'}
                onReturnResponseToMarkerIconClicked={this.onReturnResponseToMarkerIconClicked.bind(this)} />) : null;

        return (
            < div id={'toolPanelId'} className={toolPanelClass} onClick={this.onClickHandler} >
                {this.props.fileList}
                < div className='tools-panel-default' >
                    {frvIcon}
                    {messageIcon}
                    {exceptionIcon}
                    {zoomPanelIcon}
                    {returnResponseToMarkerIcon}
                    {noteIcon}
                    {discardResponse}
                    {bookmarkPanel}
                    <div className='icon-tray sup-remark-icons'>
                        <ul>
                            <PromoteResponseIcons id='promote-response-icons' key='promote-response-icons-key'
                                isOpen={this.isPromoteResponseButtonExpanded}
                                isPromotToSeedVisible={markerOperationModeFactory.operationMode.isPromoteToSeedButtonVisible}
                                isPromotToReuseBucketVisible={markerOperationModeFactory.operationMode.isPromoteToReuseButtonVisible}
                                onPromoteResponseButtonClicked={this.handlePromoteResponseButtonClick}
                                onPromoteToSeedButtonClicked={this.props.onPromoteToSeedButtonClicked}
                                onPromoteToReuseButtonClicked={this.props.onPromoteToReuseButtonClicked}
                                selectedLanguage={this.props.selectedLanguage} />
                            <SupervisorRemarkIcon id='supervisor-rem-holder' key='supervisor-rem-holder'
                                isOpen={this.isRemarkButtonExpanded}
                                isSupervisorRemarkButtonVisible={this.showSupervisorRemarkButton === true ?
                                    markerOperationModeFactory.operationMode.isSupervisorRemarkButtonVisible : false}
                                onRemarkButtonClicked={this.handleRemarkButtonClick}
                                onMarkNowButtonClicked={this.props.onRemarkNowButtonClicked}
                                onMarkLaterButtonClicked={this.props.onRemarkLaterButtonClicked}
                                isSupervisorRemarkRaised={this.isSupervisorRemarkAlreadyRaised} />
                        </ul>
                    </div>
                    <div className='annotation-panel-holder'>
                        {this.renderOverlayPanel()}
                        {stampPanel}
                    </div>
                </div >
            </div >
        );
    }

    /* return true if we need to render overlay panel */
    private get doRenderOverlayPanel(): boolean {
        // No overlays in eBookmarking components
        // Show overlay in classified responses in view mode
        return ((markingStore.instance.currentResponseMode === enums.ResponseMode.closed ||
            markerOperationModeFactory.operationMode.isTeamManagementMode) ||
            (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse
                && (!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives ||
                    qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)))
            && !eCourseworkHelper.isECourseworkComponent && this.props.isOverlayAnnotationsVisible
            && !standardisationSetupStore.instance.isSelectResponsesWorklist
            && !markerOperationModeFactory.operationMode.isAwardingMode;
    }

    /**
     * This function renders the Overlay toolicons for closed response.
     */
    private renderOverlayPanel() {
        if (this.doRenderOverlayPanel) {
            return (<OverlayPanel id='overlay_id' key='overlay_key' isResponseModeClosed={true}></OverlayPanel>);
        } else {
            return null;
        }
    }

    /**
     * on click handler
     * @param event
     */
    private onClickHandler(event: any) {
        stampActionCreator.showOrHideComment(false);
    }

    /**
     * Handles the click on the supervisor remark button
     * @param {any} event
     */
    private handleRemarkButtonClick = (event: any): void => {
        this.isSupervisorRemarkAlreadyRaised = false;
        this.validateRaiseSupervisorRemarkPanel();
    };

    /**
     * Handles the click on outside for promote response button
     * @param {any} event
     */
    private handleOutsideClickForPromoteResponseButton = (event: any): void => {
        if (this.isPromoteResponseButtonExpanded && !this.isPromoteResponseButtonClicked) {
            this.isPromoteResponseButtonExpanded = !this.isPromoteResponseButtonExpanded;
            this.setState({
                renderedOn: Date.now()
            });
        }
        this.isPromoteResponseButtonClicked = false;
    };

    /**
     * Handles the click on the promote to response button
     * @param {any} event
     */
    private handlePromoteResponseButtonClick = (event: any): void => {
        // If popup is not open, Get the Details
        if (!this.isPromoteResponseButtonExpanded) {
            // handling offline scenarios
            if (!applicationActionCreator.checkActionInterrupted()) {
                return;
            }
            this.isPromoteResponseButtonClicked = true;
            this.isPromoteResponseButtonExpanded = true;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Re-rendering the to hide the pop up when promote to reusebutton button is clicked .
     */
    private onPromoteToReuseCompleted = (): void => {
        this.isPromoteResponseButtonExpanded = false;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Handles the click on outside for supervisor remark button
     * @param {any} event
     */
    private handleOutsideClickForRemarkButton = (event: any): void => {
        if (this.isRemarkButtonExpanded && !this.isRemarkButtonClicked) {
            this.isRemarkButtonExpanded = !this.isRemarkButtonExpanded;
            this.setState({
                renderedOn: Date.now()
            });
        }
        this.isRemarkButtonClicked = false;
    };

    /**
     * Method which gets the ecoursework FileList Panel status from the user option
     */
    private get ecourseworkFileListPanelUserOption(): ecourseworkFilelistPanelState {
        // Getting the user option for EcourseworkFileListPanel
        let _ecourseworkFilelistPanelState: ecourseworkFilelistPanelState = new ecourseworkFilelistPanelState();
        let _userOptionValue: string = userOptionsHelper.getUserOptionByName(userOptionKeys.ECOURSEWORK_FILELIST_PANEL_STATE,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        if (_userOptionValue) {
            _ecourseworkFilelistPanelState = JSON.parse(_userOptionValue);
        }
        return _ecourseworkFilelistPanelState;
    }

    /**
     * Fires after annotation panel is expanded/collapsed
     */
    private onStampPanelModeChanged = (): void => {

        if (toolbarStore.instance.isStampPanelExpanded === false && stampStore.instance.currentStampBannerType !== enums.BannerType.None
            && stampStore.instance.currentStampBannerType !== undefined) {
            stampActionCreator.updateStampBannerVisibility(enums.BannerType.None, true);
        }

        this.setState({
            renderedOn: Date.now(),
            isStampPanelExpanded: toolbarStore.instance.isStampPanelExpanded
        });

        markingactioncreator.setMarkEntrySelected();
    };

    /**
     * Callback function for stamppanel component.
     */
    private setNumberOfColumnsInFavouriteToolBar = (numberOfColumns: number): void => {
        this.columnClassName = ' col-' + numberOfColumns;
        this.props.hasMultipleColumns(numberOfColumns > 1);
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method to Re render the component once the note saved in db
     */
    private reRender = () => {
        this.setState({
            noteTextValue: this.currentNoteFromStore
        });
    };


    /**
     * Full response button click
     */
    private onFullResponseClick = (): void => {
        if (this.props.onFullResponseClick != null) {
            this.props.onFullResponseClick();
        }
    };

    /**
     * Response View Change click
     */
    private responseViewModeChanged = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     *  This method will display the stamp banner messages.
     */
    private showStampPanelHelperMessages = (): void => {
        if (this.isAnnotationAutoPopulate) {
            return;
        }
        // This section will works on first time, while opening the responses.
        if (stampStore.instance.currentStampBannerType === undefined && stampStore.instance.isFavouriteToolbarEmpty
            && stampStore.instance.stampsAgainstCurrentQig(responseStore.instance.isWholeResponse).count() > 0
            && (markerOperationModeFactory.operationMode.isMarkingMode ||
                markerOperationModeFactory.operationMode.isStandardisationSetupMode)) {
            toolbarActionCreator.ChangeStampPanelMode(true);
            if (!this.props.isDigitalFileSelected || !this.props.isUnzoned) {
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
            }
        } else if (!this.props.isMessagePanelVisible && !stampStore.instance.isFavouriteToolbarEmpty) {
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
    private favoriteStampListUpdated = (favoriteStampActionType: enums.FavoriteStampActionType): void => {
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
        if ((this.isQigChanged && this.isResponseChanged)) {
            let stampsAgainstCurrentQig = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId,
                responseStore.instance.isWholeResponse);
            this.setStampPanelStatus();
            if (stampStore.instance.isFavouriteToolbarEmpty && stampStore.instance.currentStampBannerType
                !== enums.BannerType.ShrinkExpandedBanner) {
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
            } else if (stampStore.instance.isFavouriteToolbarEmpty && stampStore.instance.currentStampBannerType
                === enums.BannerType.ShrinkExpandedBanner) {
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.ShrinkExpandedBanner, true);
            }

            // setting stamp panel collapsed when annotation count is zero
            if (stampsAgainstCurrentQig.count() === 0) {
                this.isStampPanelExpanded = false;
            }

            this.setState({
                renderedOn: Date.now(),
                isStampPanelExpanded: this.isStampPanelExpanded
            });

            // De-select annotation if it is not configured for the selected qig
            if (!this.isSelectedAnnotationConfigured() && toolbarStore.instance.selectedStampId) {
                stampActionCreator.deSelectAnnotation();
            }
            this.isQigChanged = false;
            this.isResponseChanged = false;
        }
        //check blocking message show/hide on load 
        if (this.isQigChanged && favoriteStampActionType === enums.FavoriteStampActionType.LoadFromUserOption) {
            //show block message if favourite panel is empty and hide if message panel is non empty
            if (stampStore.instance.currentStampBannerType === undefined && stampStore.instance.isFavouriteToolbarEmpty) {
                this.showStampPanelHelperMessages();
            } else if (stampStore.instance.currentStampBannerType === undefined) {
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.None, true);
            }
            this.isQigChanged = false;
        }
    };

    /**
     *  If required this will set the exapnded status of stamp panel.
     */
    private setStampPanelStatus = (): void => {
        if (toolbarStore.instance.isStampPanelExpanded === false &&
            stampStore.instance.isFavouriteToolbarEmpty &&
            stampStore.instance.stampsAgainstCurrentQig(responseStore.instance.isWholeResponse).count() !== 0) {
            toolbarActionCreator.ChangeStampPanelMode(true);
            this.isStampPanelExpanded = true;
        } else {
            this.isStampPanelExpanded = toolbarStore.instance.isStampPanelExpanded;
        }
    };

    /**
     *  If the stamps related data for the favourites toolbar is not yet customised,
     *  check the user already saved some favourites stamps other wise auto populate the stamps based on the configuration
     */
    private CustomiseFavauritesPanel() {
        if (!userOptionsHelper.hasExaminerCustomisedTheStamps()) {
            let favouritesStampCollection = stampStore.instance.getFavoriteStamps();
            // added the condition to remove system added annotations to be added into the favorites panel
            let actualStampsCollection = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId,
                responseStore.instance.isWholeResponse).filter((stampdata: StampData) => !stampdata.addedBySystem).toList();

            // Check the favourites panel is empty, Also Annotations configured against current QIG
            if (favouritesStampCollection.count() === 0 &&
                actualStampsCollection.count() <= parseInt(config.marksandannotationsconfig.AUTO_POPULATE_STAMPS_TO_FAVOUIRITES_COUNT)) {
                this.isAnnotationAutoPopulate = true;
                let stampIds = '';

                // Getting the stamps grouped by stamp type
                let groupedStamps = groupHelper.group(actualStampsCollection, grouperList.StampsGrouper, enums.GroupByField.stampType);

                // Getting the stamp types as key collection
                let groupedKeys = groupedStamps.keySeq();

                // Using sorting helper to sort the list based on the stamp types
                groupedKeys = sorthelper.sort(groupedKeys, comparerList.stampTypeComparer);

                // Loop through the keys and find the list of Stamps for the group.
                groupedKeys.forEach((key: enums.StampType) => {

                    // Get the Stamps for the group.
                    let currentStampGroup = groupedStamps.get(key);

                    currentStampGroup = (Immutable.List<stampData>(currentStampGroup)).sort((valueA: stampData, valueB: stampData) => {
                        return valueA.name.localeCompare(valueB.name);
                    }).toList();

                    if (currentStampGroup.count() > 0) {
                        currentStampGroup.forEach((x: StampData) => stampIds += x.stampId + ',');
                    }
                });

                // Remove the last ','
                stampIds = stampIds.substring(0, stampIds.length - 1);

                // Split the comma separated favorite stamp and convert it to array of number
                let favoriteStampList = stringHelper.split(stampIds, stringHelper.COMMA_SEPARATOR).map(Number);

                stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.LoadFromUserOption,
                    undefined,
                    Immutable.List<number>(favoriteStampList));

                // Collapse the toolbar
                toolbarActionCreator.ChangeStampPanelMode(false);

                // Hide the banners
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.None, true);

                // Close the panel
                this.setState({ renderedOn: 0, isStampPanelExpanded: false });

                // Call user option save to save the stamps to favourites tool bar.
                userOptionsHelper.save(userOptionKeys.REMEMBER_CHOSEN_STAMPS, stampIds, true, true, false, true,
                    markingStore.instance.selectedQIGExaminerRoleId);
            }
        }
    }

    /**
     * Method to check if supervisor remark already raised for the response
     */
    private openRaiseSupervisorRemarkPanel = (): void => {
        this.isRemarkButtonExpanded = true;
        if (responseStore.instance.supervisorremarkrequestreturn.isSupervisorRemarkRaised) {
            this.setSupervisorDescription();
        }
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Method to set supervisor remark already raised for the response
     */
    private setSupervisorDescription = (): void => {
        this.isSupervisorRemarkAlreadyRaised = true;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Method to check if supervisor remark already raised for the response
     */
    private validateRaiseSupervisorRemarkPanel = (): void => {
        // If popup is not open, Get the Details
        if (!this.isRemarkButtonExpanded) {
            this.isRemarkButtonClicked = true;
            let candidateScriptId: number = worklistStore.instance.getResponseDetails(
                responseStore.instance.selectedDisplayId.toString()).candidateScriptId;

            responseActionCreator.getResponseDetailsForSupervisorRemark(
                candidateScriptId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                operationModeHelper.subExaminerId,
                responseStore.instance.isWholeResponse);
        }
    }

    /**
     * Method to check if supervisor remark already raised for the response
     */
    private isSupervisorRmarkButtonVisible = (isVisible: boolean): void => {
        this.showSupervisorRemarkButton = isVisible;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Re-rendering the to hide icons when promote to seed button is clicked when there is no error returned
     */
    private onPromoteToSeedButtonClicked = (promoteToSeedError: enums.PromoteToSeedErrorCode): void => {
        if (promoteToSeedError === enums.PromoteToSeedErrorCode.None) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * Method to set expand/collapse status of filelist panel
     */
    private toggleFilelistPanel = (isFilelistPanelCollapsed: boolean): void => {
        this.setState({
            renderedOn: Date.now(),
            isFilelistPanelCollapsed: isFilelistPanelCollapsed
        });
        eCourseworkResponseActionCreator.updateZoomOnToggleFileListPanel();
    }

    /**
     * Method to re-render favorites toolbar
     */
    private reRenderFavoritesToolbarOnQigChange = (): void => {
        this.isQigChanged = true;
        // Re-render on auto populate favorite stamps, in case of whole response
        if (responseStore.instance.isWholeResponse) {
            // Update favorite stamp panel
            stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add,
                undefined,
                Immutable.List<number>(stampStore.instance.getFavoriteStamps));
        }
        stampActionCreator.showOrHideoffPageVisibility();
        this.setState({
            renderedOn: Date.now()
        });

        // ToDo we need to revert this fix and check 
        // is this issue exisist or not when the react new version comes
        // fix for the annotation rendering issue in favarate panel for the IE11 for the whole response
        let that = this;
        if (htmlUtilities.isIE) {
            that.doUnMount = true;
            setTimeout(() => {
                that.doUnMount = false;
                that.setState({
                    renderedOn: Date.now()
                });
            }, 100);
        }
    }
    /**
     * Fires once the response is changed through response navigation
     */
    private responseChanged = (): void => {
        this.isResponseChanged = true;
        this.setState({
            noteTextValue: this.currentNoteFromStore
        });
    };

	/**
	 * return true if selected annotation is configured for the selected qig
	 */
    private isSelectedAnnotationConfigured() {
        let stampConfigured: boolean = false;
        if (toolbarStore.instance.selectedStampId) {
            let actualStampsCollection = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId,
                responseStore.instance.isWholeResponse);
            let favouritesStampCollection = stampStore.instance.getFavoriteStamps();
            favouritesStampCollection.map((item: stampData) => {
                if (item.stampId === toolbarStore.instance.selectedStampId) {
                    stampConfigured = true;
                    return stampConfigured;
                }
            });
            if (stampConfigured) {
                return stampConfigured;
            }
            actualStampsCollection.map((item: stampData) => {
                if (item.stampId === toolbarStore.instance.selectedStampId) {
                    stampConfigured = true;
                    return stampConfigured;
                }
            });
            return stampConfigured;
        }
    }

    /**
     * Method to re-render bookmarks
     */
    private reRenderBookmarks = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     *  This will re-render the component.
     * @param removedAnnotation
     * @param isPanAvoidImageContainerRender
     */
    private reRenderBookmarkList = (removedAnnotation?: any, isPanAvoidImageContainerRender: boolean = false,
        contextMenuType: enums.ContextMenuType = enums.ContextMenuType.annotation) => {
        if (contextMenuType === enums.ContextMenuType.bookMark) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /* return true if selected file is digital */
    private get isSelectedFileDigital() {
        return eCourseworkHelper.isECourseworkComponent &&
            eCourseworkHelper.getSelectedECourseworkImageFile() === undefined;
    }

    /**
     * When the component is about to receive new props.
     * @param nextProps 
     */
    public componentWillReceiveProps(nextProps: Props) {
        let showStampBanner: boolean = markerOperationModeFactory.operationMode.isAwardingMode ?
            false : stampStore.instance.isFavouriteToolbarEmpty
            && stampStore.instance.stampsAgainstCurrentQig(responseStore.instance.isWholeResponse).count() > 0
            && (markerOperationModeFactory.operationMode.isMarkingMode
                || markerOperationModeFactory.operationMode.isStandardisationSetupMode);

        if (showStampBanner) {
            // For unzoned images in ebookMarking reset the stamp banner when the corrct props value is received.
            if (nextProps.isUnzoned && stampStore.instance.currentStampBannerType !== undefined) {
                stampActionCreator.updateStampBannerVisibility(undefined, false);
            } else if (!nextProps.isUnzoned && stampStore.instance.currentStampBannerType === undefined) {
                // After resetting set the banner type correctly if the next question item has a zone, 
                // to show banner while navigating from unzoned to zoned question item.
                stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
            }
        }
    }

    /**
     * Whether or not to hide the stamp panel.
     */
    private get hideStampPanel(): boolean {
        return this.props.hideStampPanelIcon
            || this.props.isUnzoned === true
            || this.isSelectedFileDigital
            || standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
            || this.doUnMount
            || markerOperationModeFactory.operationMode.isAwardingMode;
    }

    /**
     * Method to get the current response note version from store
     */
    private get currentNoteFromStore(): string {
        return this.doShowNoteIcon
            && standardisationSetupStore.instance.selectedStandardisationSetupWorkList !== enums.StandardisationSetup.SelectResponse
            && standardisationSetupStore.instance.standardisationSetUpResponsedetails.
                standardisationResponses.filter(x => x.displayId === markingStore.instance.selectedDisplayId.toString()).first().note;
    }

    /**
     * Whether or not to show noteicon.
     */
    private get doShowNoteIcon(): boolean {
        return markerOperationModeFactory.operationMode.isStandardisationSetupMode
            && !standardisationSetupStore.instance.isSelectResponsesWorklist
            && !markerOperationModeFactory.operationMode.isAwardingMode;
    }

    /**
     * Fired on clicking the return response to marker icon
     */
    private onReturnResponseToMarkerIconClicked() {
        teamManagementActionCreator.returnResponseToMarkerWorklistButtonClicked();
    }

    /**
     * Whether or not to show return response to marker icon
     */
    private get doShowReturnResponseToMarkerIcon(): boolean {
        return markerOperationModeFactory.operationMode.allowReturnResponseToMarker;
    }

    /**
     * Render toolbar, only if the marker details are updated without navigation.
     */
    private reRenderToolBar = (): void => {
        if (responseStore.instance.selectedDisplayId) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

}

export = ToolbarPanel;