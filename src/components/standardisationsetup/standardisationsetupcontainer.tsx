import React = require('react');
import Promise = require('es6-promise');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import qigStore = require('../../stores/qigselector/qigstore');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import navigationHelper = require('../utility/navigation/navigationhelper');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import scriptStore = require('../../stores/script/scriptstore');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import responseStore = require('../../stores/response/responsestore');
import standardisationSetupHelper = require('../../utility/standardisationsetup/standardisationsetuphelper');
import GridToggleButton = require('../worklist/shared/gridtogglebutton');
import standardisationSetupFactory = require('../../utility/standardisationsetup/standardisationsetupfactory');
import StandardisationSetupTableWrapper = require('./standardisationsetuptablewrapper');
import imageZoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
import Immutable = require('immutable');
import standardisationsortdetails = require('../utility/grid/standardisationsortdetails');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../utility/sorting/sorthelper');
import loginsession = require('../../app/loginsession');
import TabControl = require('../utility/tab/tabcontrol');
import TabContentContainer = require('../utility/tab/tabcontentcontainer');
import ToggleButton = require('../utility/togglebutton');
import gridRow = require('../utility/grid/gridrow');
import gridCell = require('../utility/grid/gridcell');
import StandardisationSetupCentreScriptDetails = require('./standardisationsetupcentrescriptdetails');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import constants = require('../utility/constants');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import MultiOptionConfirmationDialog = require('../utility/multioptionconfirmationdialog');
import scriptImageDownloadHelper = require('../utility/backgroundworker/scriptimagedownloadhelper');
import markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
import scriptImageDownloader = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader');
import imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
import navigationStore = require('../../stores/navigation/navigationstore');
declare let config: any;
import examinerStore = require('../../stores/markerinformation/examinerstore');
import updateEsMarkGroupMarkingModeData = require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');
import GenericDialog = require('../utility/genericdialog');
import stringHelper = require('../../utility/generic/stringhelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import responseHelper = require('../utility/responsehelper/responsehelper');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import submitActionCreator = require('../../actions/submit/submitactioncreator');
import submitStore = require('../../stores/submit/submitstore');

interface Props extends LocaleSelectionBase, PropsBase {
    toggleLeftPanel: Function;
    renderedOn?: number;
    isFromMenu?: boolean;
    standardisationSetupWorkList: enums.StandardisationSetup;
}

interface State {
    renderedOn?: number;
    isBusy: boolean;
    isTotalMarkView: boolean;
    isGridViewChanged: boolean;
    isDeclassifyPopupDisplaying: boolean;
    isReclassifyPopupDisplaying: boolean;
    isReorderErrorPopupDisplaying: boolean;
    isShowHiddenResponsesOn: boolean;
}
/**
 * StandardisationSetup Container
 */
class StandardisationSetupContainer extends pureRenderComponent<Props, State> {
    private standardisationSetupHelper: standardisationSetupHelper;
    private isBusy: boolean = true;
    private _gridRows: Immutable.List<Row>;
    private _gridColumnHeaderRows: Immutable.List<Row>;
    private _gridFrozenBodyRows: Immutable.List<Row>;
    private _gridFrozenHeaderRows: Immutable.List<Row>;

    private comparerName: string;
    private sortDirection: enums.SortDirection;
    // Holds the value whether Centre or Script or Reuse . Used only for Select Response
    private _centreOrScriptOrReuse: string;
    private selectedSessionTab: enums.StandardisationSessionTab;

    private centreDetails: HTMLDivElement;
    private standardisationResponseData: Immutable.List<StandardisationResponseDetails>;
    private loading: JSX.Element;
    private _displayId: string;
    private _totalMarkValue: number;
    private metadataLoaded: boolean;
    private doSetMinWidth: boolean = true;
    private _candidateScriptId: number;
    private _esCandidateScriptMarkSchemeGroupId: number;
    private _markingModeId: number;
    private _rigOrder: number;
    private _selectedDraggableRow?: Immutable.List<Row>;
    private _doMarkNow: boolean;
    private _classifyResponseDetails: updateEsMarkGroupMarkingModeData;

    /**
     * @constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

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
            isReorderErrorPopupDisplaying: false
        };
        this.selectedSessionTab = standardisationSetupStore.instance.selectedTabInSelectResponse;
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
        this.hideReclassifyPopup = this.hideReclassifyPopup.bind(this);
        this.reclassifyResponse = this.reclassifyResponse.bind(this);
        this.onHideReuseToggleChange = this.onHideReuseToggleChange.bind(this);
        this.shareResponseCompleted = this.shareResponseCompleted.bind(this);
        this.reRenderOnReorderResponse = this.reRenderOnReorderResponse.bind(this);
        this.reuseRigActionCompletedEvent = this.reuseRigActionCompletedEvent.bind(this);
    }

    /**
     * This method will call parent component function to toggle left panel
     */
    private toggleLeftPanel() {
        this.props.toggleLeftPanel();
    }

    /**
     * component will Mount event
     */
    public componentWillMount() {
        this.isBusy = true;
    }

    /**
     * render method
     */
    public render() {
        this.setLoadingindicator();
        let errorBody: string;
        let popUpContent: JSX.Element[] = [];

        // Logic to display reclassify/declassify popup based  the flag.
        if (this.state.isDeclassifyPopupDisplaying) {
            popUpContent.push(<p className='dim-text padding-bottom-20'>
                <span>
                    {localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.declassify-popup.response-id')}
                    <span className='responseID'>{this._classifyResponseDetails.displayId}</span>
                </span>,
            <span>
                    {localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.total-mark')}
                    <span className='total-mark'>{this._classifyResponseDetails.totalMarkValue}</span>
                </span>
            </p>);
            popUpContent.push(<p>
                {localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.body')}
            </p>);
            popUpContent.push(<p className='padding-top-10'>
                {localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.declassify-popup.confirmation-text')}
            </p>);
        } else if (this.state.isReclassifyPopupDisplaying) {
            let previousMarkingMode: string = (localeStore.instance.TranslateText
                ('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[this._classifyResponseDetails.previousMarkingModeId]));
            let currentMarkingMode: string = (localeStore.instance.TranslateText
                ('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[this._classifyResponseDetails.markingModeId]));
            popUpContent.push(<p className='dim-text padding-bottom-10'>
                <span>
                    {localeStore.instance.TranslateText(
                        'standardisation-setup.standardisation-setup-worklist.reclassify-popup.response-id')}
                    <span className='responseID'>{this._classifyResponseDetails.displayId}</span>
                </span>,
            <span>
                    {localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.total-mark')}
                    <span className='total-mark'>{this._classifyResponseDetails.totalMarkValue}</span>
                </span>
            </p>);
            popUpContent.push(<p>
                {stringHelper.format(localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.reclassify-popup.body'),
                    [previousMarkingMode,
                        currentMarkingMode]
                )
                }
            </p>);
        } else if (this.state.isReorderErrorPopupDisplaying) {
            errorBody = stringHelper.format(
                localeStore.instance.TranslateText(
                    'standardisation-setup.standardisation-setup-worklist.reordererror-popup.body'
                ),
                [this._displayId]
            );
        }

        // Call confirmation dialog to dsplay declassify/reclassify 
        let declasifyPopup = <MultiOptionConfirmationDialog
            content={popUpContent}
            header={localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.header')}
            displayPopup={this.state.isDeclassifyPopupDisplaying}
            onCancelClick={this.hideDeclassifyPopup}
            onYesClick={this.declassifyResponse}
            onNoClick={null}
            isKeyBoardSupportEnabled={true}
            selectedLanguage={this.props.selectedLanguage}
            popupSize={enums.PopupSize.Medium}
            popupType={enums.PopUpType.Declassify}
            buttonCancelText={localeStore.instance
                .TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.no-button')}
            buttonYesText={localeStore.instance
                .TranslateText('standardisation-setup.standardisation-setup-worklist.declassify-popup.yes-button')}
            buttonNoText={null}
            displayNoButton={false}
        />;

        let reclasifyPopup = <MultiOptionConfirmationDialog
            content={popUpContent}
            header={localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.header')}
            displayPopup={this.state.isReclassifyPopupDisplaying}
            onCancelClick={this.hideReclassifyPopup}
            onYesClick={this.reclassifyResponse}
            onNoClick={null}
            isKeyBoardSupportEnabled={true}
            selectedLanguage={this.props.selectedLanguage}
            popupSize={enums.PopupSize.Medium}
            popupType={enums.PopUpType.Reclassify}
            buttonCancelText={localeStore.instance
                .TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.no-button')}
            buttonYesText={localeStore.instance
                .TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-popup.yes-button')}
            buttonNoText={null}
            displayNoButton={false}
        />;

        let reorderErrorPopup = <GenericDialog
            content={errorBody}
            multiLineContent={null}
            header={localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.reordererror-popup.header'
            )}
            secondaryContent={null}
            displayPopup={this.state.isReorderErrorPopupDisplaying}
            okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
            onOkClick={this.onReorderErrorMessageOkClick.bind(this)}
            id='reclassifyError'
            key='reorderErrorMessage'
            popupDialogType={enums.PopupDialogType.ReclassifyError}
            footerContent={null}
        />;
        return (
            <div className='column-right tab-holder horizontal response-tabs'>
                <a href='javascript:void(0);' className='toggle-left-panel' id='side-panel-toggle-button'
                    title={localeStore.instance.TranslateText('standardisation-setup.left-panel.show-hide-tooltip')}
                    onClick={this.toggleLeftPanel}>
                    <span className='sprite-icon panel-toggle-icon'>panel toggle</span>
                </a>
                {this.loadStandardisationRightPanel(this.props.standardisationSetupWorkList)}
                {declasifyPopup}
                {reclasifyPopup}
                {reorderErrorPopup}
            </div>
        );
    }

    /**
     * Handle animation of grid view toggle on componentDidUpdate
     */
    public componentDidUpdate() {
        // Need to reset the scroll styles on grid toggle.
        this.setScrollOnToggle();
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT,
            this.onStandardisationLeftPanelSelected);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
            this.loadScriptsOfSelectedCentre);

        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.loadContainer);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this.reRenderOnCentreDetailsSet);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.reRenderOnStandardisationResponseReceived);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT,
            this.renderPreviouseSession);

        window.addEventListener('orientationchange', this.setCentreListScroll);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_DECLASSIFY_POPUP_EVENT,
            this.declassifyPopupOpen);
        scriptStore.instance.addListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
            this.reclassifyPopupOpen);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REORDERED_RESPONSE_EVENT,
            this.reRenderOnReorderResponse);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT,
            this.reorderErrorPopupOpen);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT,
            this.reRenderOnUpdateHiddenStatus);

        submitStore.instance.addListener(
            submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.shareResponseCompleted);

        submitStore.instance.addListener(
                submitStore.SubmitStore.SHARE_AND_CLASSIFY_RESPONSE_COMPLETED, this.shareResponseCompleted);

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT,
            this.onStandardisationLeftPanelSelected);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
            this.loadScriptsOfSelectedCentre);

        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.loadContainer);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this.reRenderOnCentreDetailsSet);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.reRenderOnStandardisationResponseReceived);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT,
            this.renderPreviouseSession);

        window.removeEventListener('orientationchange', this.setCentreListScroll);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.declassifyPopupOpen);
        scriptStore.instance.removeListener(
            scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.onCandidateResponseMetadataRetrieved);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
            this.reclassifyPopupOpen);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REORDERED_RESPONSE_EVENT,
            this.reRenderOnReorderResponse);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT,
            this.reorderErrorPopupOpen);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT,
            this.reRenderOnUpdateHiddenStatus);

        submitStore.instance.removeListener(
            submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.shareResponseCompleted);

        submitStore.instance.removeListener(
            submitStore.SubmitStore.SHARE_AND_CLASSIFY_RESPONSE_COMPLETED, this.shareResponseCompleted);

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT,
            this.reuseRigActionCompletedEvent);
    }

    /**
     * Rerender when reuse rig action completed
     */
    private reuseRigActionCompletedEvent() {
        this.getReuseRigDetails();
    }

	/**
	 * set centre list scroll top
	 */
    private setCentreListScroll() {
        if (this.props.standardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            let scrollTop: number;
            // setting the scroll top of Centre List table to view the selected centre.
            scrollTop = (standardisationSetupStore.instance.selectedCentrePosition() - 1) * constants.TABLE_WRAPPER_ROW_HEIGHT;
            if (this.centreDetails) {
                this.centreDetails.getElementsByClassName('table-scroll-holder')[0].scrollTop = scrollTop;
            }
        }
    }

    /**
     * This method will load the right side panel
     */
    private loadStandardisationRightPanel = (workListSelection: enums.StandardisationSetup): JSX.Element => {
        let standardisationSetupRightPanel: JSX.Element;
        standardisationSetupRightPanel = (
            <div className='wrapper'>
                <div className='clearfix wl-page-header header-search' id='page-title'>
                    <h3 className='shift-left page-title' id='page-title-header'>
                        <span className='page-title-text' id='page-title-header-text'>
                            {this.getStandardisationSetupRightWorkListContainerHeader(workListSelection)}</span>
                        <span className='right-spacer'></span>
                    </h3>
                    {this.renderSessionTab(workListSelection)}
                </div>
                {this.getRightContainerItems(workListSelection)}
            </div>
        );
        return standardisationSetupRightPanel;
    }

    /**
     * This method will load the right side Blue Message
     */
    private getRightContainerBlueMessage = (workListSelection: enums.StandardisationSetup,
        isShowBluePanelSelectResponse: boolean = false): JSX.Element => {
        let element: JSX.Element;
        switch (workListSelection) {
            case enums.StandardisationSetup.None:
                break;
            case enums.StandardisationSetup.SelectResponse:
                if (isShowBluePanelSelectResponse) {
                    element = this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection, 0);
                }
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                element = this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection,
                    standardisationSetupStore.instance.standardisationTargetDetails.provisionalCount);
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                let targetCount: number = standardisationSetupStore.instance.standardisationTargetDetails.unclassifiedCount;
                element = this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection, targetCount,
                    qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                element = this.standardisationSetupHelper.getBlueBannerForTargets(workListSelection,
                    standardisationSetupStore.instance.standardisationTargetDetails.classifiedCount);
                break;
        }
        return element;
    }

    /**
     * This method will load the right side panel Items
     */
    private getRightContainerItems = (workListSelection: enums.StandardisationSetup): Array<JSX.Element> => {
        let element: Array<JSX.Element> = [];
        if (workListSelection !== enums.StandardisationSetup.None) {
            // get the selected SSU worklist.
            switch (workListSelection) {
                case enums.StandardisationSetup.SelectResponse:
                    if (this.selectedSessionTab !== enums.StandardisationSessionTab.PreviousSession) {
                        element.push(this.renderSelectResponseGrids(workListSelection));
                    } else {
                        element.push(this.renderPreviousSessionTabContent());
                    }
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                case enums.StandardisationSetup.ProvisionalResponse:
                case enums.StandardisationSetup.ClassifiedResponse:
                    let standardisationResponseData: Immutable.List<StandardisationResponseDetails>;
                    if (standardisationSetupStore.instance.standardisationSetUpResponsedetails) {
                        standardisationResponseData =
                            Immutable.List<StandardisationResponseDetails>(
                                standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
                    }

                    // below section is for displaying the grid toggle button
                    // Total Marks/ Marks by Question
                    // Load Grid and toggle button only if ther is any data to show.
                    if (standardisationResponseData && this.metadataLoaded) {
                        if (standardisationResponseData.count() > 0) {
                            if (!this.state.isBusy) {
                                element.push(
                                    <div className='grid-holder grid-view' key={enums.StandardisationSetup[workListSelection] + '_key'}>
                                        {this.getRightContainerBlueMessage(workListSelection, true)}
                                        <div className='col-wrap grid-nav padding-bottom-15'>
                                            <div className='col-12-of-12'>
                                                {this.getGridToggleButtons(workListSelection)}
                                            </div>
                                        </div>
                                        <div className='grid-wrapper'>
                                            {this.loadStandardisationWorklistScreen(workListSelection)}
                                        </div>
                                    </div>);
                            } else {
                                element.push(
                                    <div className='grid-holder grid-view' key={enums.StandardisationSetup[workListSelection] + '_key'}>
                                        {this.getRightContainerBlueMessage(workListSelection, true)}
                                        <div className='col-wrap grid-nav padding-bottom-15'>
                                            <div className='col-12-of-12'>
                                                {this.getGridToggleButtons(workListSelection)}
                                            </div>
                                        </div>
                                        {this.loading}

                                    </div>);
                            }
                        } else {
                            element.push(
                                <div className='grid-holder grid-view' key={enums.StandardisationSetup[workListSelection] + '_key'}>
                                    {this.getRightContainerBlueMessage(workListSelection, true)}
                                </div>);
                        }
                    } else {
                        element.push(this.loading);
                    }
                    break;
            }
        }
        return element;
    }

    /**
     * This method will set the session tab visiblity property
     */
    private renderSessionTab = (workListSelection: enums.StandardisationSetup): Array<JSX.Element> => {
        let element: Array<JSX.Element> = [];
        if (workListSelection !== enums.StandardisationSetup.None) {
            this.standardisationSetupHelper = standardisationSetupFactory.getStandardisationSetUpWorklistHelper(workListSelection);
            this.setTabStateToCurrentState(workListSelection);
            if (workListSelection === enums.StandardisationSetup.SelectResponse) {
                if (this.getSessionTabVisibilty()) {
                    element.push(<div className='tab-nav-holder'>
                        <TabControl
                            tabHeaders={this.getTabHeaders()}
                            selectTab={this.selectSessionTab} />
                    </div>);
                    element.push(<div className='response-button-holder'>
                        <div className='arrow-link'>
                            <div className='get-response-wrapper'><div className='dropdown-wrap'>
                                <ul className='menu'>
                                    <li><a href='javascript:void(0)'>Single response</a></li>
                                    <li><a href='javascript:void(0)'>Up to open response limit</a></li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>);
                    element.push(<div className='tab-right-end arrow-tab'>
                        <div className='arrow-link'>
                        </div>
                    </div>);
                }
            }
        }
        return element;
    }

    /**
     * This method will set the session tab visiblity property
     */
    private getSessionTabVisibilty() {
        return this.standardisationSetupHelper.getSessionTabVisibiltyinSelectResponse();
    }

    /**
     * This method will set the selectedTab state to current state
     */
    private setTabStateToCurrentState(workListSelection: enums.StandardisationSetup) {
        if (this.getSessionTabVisibilty() && this.selectedSessionTab !== enums.StandardisationSessionTab.CurrentSession
            && workListSelection !== enums.StandardisationSetup.SelectResponse) {
            this.selectedSessionTab = enums.StandardisationSessionTab.CurrentSession;
        }
        standardisationActionCreator.sessionTabSelectionInSelectResponse(this.selectedSessionTab);
    }

    /**
     * This method will load the select response right side container
     */
    private renderSelectResponseGrids(workListSelection: enums.StandardisationSetup) {
        if (this.getSessionTabVisibilty()) {
            return (
                <div className='tab-content-holder'>
                    <div className='grid-split-holder tab-content active' id='responseTab1' key='responseTab1_key'>
                        {this.getSelectResponseCentreListGrid(workListSelection)}
                        {this.getSelectResponseStdResponseGrid()}
                    </div>
                </div>
            );
        } else {
            return (
                <div className='grid-split-holder' id='gridsplitholder' key='gridSplitHolder_key'>
                    {this.getSelectResponseCentreListGrid(workListSelection)}
                    {this.getSelectResponseStdResponseGrid()}
                </div>
            );
        }
    }

    /**
     * This method will load the previous session tab content in select response when ReuseRIG CC ON
     */
    private renderPreviousSessionTabContent() {
        return (
            <div className='tab-content-holder'>
                <div className='wrapper tab-content active' id='previous_session_tab'>
                    {this.renderReusableResponsesGrid()}
                </div>
            </div>
        );
    }

    /**
     * On hide reuse toggle action
     */
    private onHideReuseToggleChange(evt: any): void {
        this.setState({
            isShowHiddenResponsesOn: !this.state.isShowHiddenResponsesOn
        });
        userOptionsHelper.save(userOptionKeys.SHOW_HIDDEN_RESPONSES, String(!this.state.isShowHiddenResponsesOn), true);
        standardisationActionCreator.onHideReuseToggleChange(!this.state.isShowHiddenResponsesOn);
    }

    /**
     * it will return blue banner for previous session tab
     */
    private getBlueBannerForPreviousSession(): JSX.Element {
        let element: JSX.Element;
        let targetCount = Immutable.List<StandardisationResponseDetails>
            (standardisationSetupStore.instance.standardisationSetupReusableDetailsList).count();

        if (this.metadataLoaded) {
            element = this.standardisationSetupHelper.
                getBlueBannerForTargets(enums.StandardisationSetup.SelectResponse, targetCount,
                    false, enums.StandardisationSessionTab.PreviousSession);
        }

        return element;
    }

    /**
     * This will returns the tab contents
     * @param validationResponseAllocationButtonValidationParam
     */
    private getTabData(tabSelection: enums.StandardisationSetup): Array<any> {

        let tabContents: Array<any> = [];

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
    }

    /**
     * This method will update the selected tab.
     * @param selectedTabIndex
     */
    private selectSessionTab(selectedTabIndex: number) {
        this.selectedSessionTab = selectedTabIndex;
        let stdWorklistViewType: enums.STDWorklistViewType = this.currentSTDWorklistViewType();
        //DataService call to get ReuseRigDetails
        if (this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession) {
            this.getReuseRigDetails();
        } else if (this.selectedSessionTab === enums.StandardisationSessionTab.CurrentSession) {
            standardisationActionCreator.getStandardisationCentresDetails(
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, false, false,
                standardisationSetupStore.instance.examinerRoleId, stdWorklistViewType, false);
        }
        standardisationActionCreator.sessionTabSelectionInSelectResponse(this.selectedSessionTab);
        this.setState({ renderedOn: Date.now() });
    }

	/**
	 * Get ReuseResponseDetails
	 */
    private getReuseRigDetails() {
        standardisationActionCreator.getReuseRigDetails(standardisationSetupStore.instance.examinerRoleId,
            standardisationSetupStore.instance.markSchemeGroupId, true, false, this.state.isShowHiddenResponsesOn);
        this.resetSortAttributes();
        this.setState({
            isBusy: true
        });
    }

    /**
     * renderPreviouseSession event method - this will fired after the Dataservice call to get ReUseRig is completed
     */
    private renderPreviouseSession() {
        if (this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession) {
            this._doMarkNow = false;
            this.metadataLoaded = false;

            // set candidate script info collection.
            let candidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(
                Immutable.List<ResponseBase>
                    (standardisationSetupStore.instance.standardisationSetupReusableDetailsList).toArray()
            );

            let eBookMarkingCCValue = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.eBookmarking).toLowerCase() ? true : false;

            scriptActionCreator.fetchCandidateScriptMetadata(
                candidateScriptInfoCollection,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                false,
                false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
                false,
                eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false,
                eBookMarkingCCValue,
                enums.StandardisationSetup.SelectResponse,
                false,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
            );
        }
    }

    /**
     * render reusable response grid
     */
    private renderReusableResponsesGrid() {
        let reusableResponsesGrid: JSX.Element;
        this._centreOrScriptOrReuse = 'Reuse';
        if (!this.comparerName) {
            this.setDefaultComparer();
        }
        if (!this.state.isBusy) {
            reusableResponsesGrid = (
                <div className='grid-holder grid-view'>
                    {this.getBlueBannerForPreviousSession()}
                    {this.getReuseGrid()}
                </div>);
            return reusableResponsesGrid;
        } else {
            return this.loading;
        }
    }

    /**
     * GetReusableGrid
     */
    private getReuseGrid() {
        let reuseGrid: Array<JSX.Element> = [];
        let reusableList = Immutable.List<StandardisationResponseDetails>
            (standardisationSetupStore.instance.reusableDetailsListBasedOnHiddenStatus(this.state.isShowHiddenResponsesOn));
        let fullReusableList = Immutable.List<StandardisationResponseDetails>
            (standardisationSetupStore.instance.standardisationSetupReusableDetailsList);
        if (fullReusableList.count() > 0 && this.metadataLoaded) {
            reuseGrid.push(<div className='col-wrap grid-nav padding-bottom-15'>
                <div className='shift-right'>
                    <div className='form-field inline'>
                        <label className='label' id='show_hidden_label'>Show hidden responses</label>
                        <ToggleButton
                            id='showhideresponse_id'
                            key='showhideresponse_key'
                            isChecked={this.state.isShowHiddenResponsesOn}
                            selectedLanguage={this.props.selectedLanguage}
                            index={0}
                            onChange={this.onHideReuseToggleChange}
                            style={undefined}
                            className={'form-component padding-left-5'}
                            title={'Hide Reuse'}
                            isDisabled={false}
                            onText={localeStore.instance.TranslateText('generic.toggle-button-states.yes')}
                            offText={localeStore.instance.TranslateText('generic.toggle-button-states.no')} />
                    </div>
                </div>
            </div>);
            reuseGrid.push(<div className='grid-wrapper'>
                <StandardisationSetupTableWrapper
                    columnHeaderRows={this.getGridColumnHeaderRows(this.props.standardisationSetupWorkList,
                        this.comparerName, this.sortDirection, this.selectedSessionTab)}
                    frozenHeaderRows={this.getFrozenTableHeaderRow(this.comparerName, this.sortDirection)}
                    frozenBodyRows={this.standardisationSetupHelper.generateStandardisationFrozenRowBodyReusableGrid(
                        reusableList, this.comparerName, this.sortDirection)}
                    gridRows={this.standardisationSetupHelper.generateReusableResponsesRowDefinition(reusableList,
                        this.comparerName, this.sortDirection)}
                    getGridControlId={this.getReusableResponsesGridControlId}
                    id={this.props.id}
                    onSortClick={this.onSortClick}
                    onRowClick={this.reuseGridOnRowClick}
                    renderedOn={this.state.renderedOn}
                    isBorderRequired={true}
                    doSetMinWidth={this.doSetMinWidth}
                />
            </div>);
        } else {
            return null;
        }
        return reuseGrid;
    }

    /**
     * On row click event for Reusable response grid
     */
    private reuseGridOnRowClick() {
        // Need to implement
    }

    /**
     * This method will load the Tab hearder for session tab in select response when ReuseRIG CC ON
     */
    public getTabHeaders() {
        //let tabHeader: JSX.Element[] = [];
        let tabHeader: Array<TabHeaderData> = [];
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
    }

    /**
     * user clicked on the left Tasks panel in Standardisation setup
     * @param selectedStandardisationSetupWorkList
     */
    private onStandardisationLeftPanelSelected(selectedStandardisationSetupWorkList: enums.StandardisationSetup, useCache: boolean) {
        let stdWorklistViewType: enums.STDWorklistViewType = this.currentSTDWorklistViewType();
        this.selectedSessionTab = standardisationSetupStore.instance.selectedTabInSelectResponse;
        this.resetSortAttributes();
        new scriptImageDownloader().clearBackgroundImageDownloadQueue();
        switch (selectedStandardisationSetupWorkList) {
            case enums.StandardisationSetup.SelectResponse:
                if (this.selectedSessionTab === enums.StandardisationSessionTab.CurrentSession) {
                    standardisationActionCreator.getStandardisationCentresDetails(
                        qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, false, false,
                        standardisationSetupStore.instance.examinerRoleId, stdWorklistViewType, useCache);
                } else {
                    this.getReuseRigDetails();
                }
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                // fill the store with ClassifiedResponseDetails
                standardisationActionCreator.getClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                    loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    false, stdWorklistViewType);
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                // fill the store with Provisional Response details
                standardisationActionCreator.getProvisionalResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                    loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    false, true, stdWorklistViewType);
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                // fill the store with UnClassifiedResponseDetails
                standardisationActionCreator.getUnClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                    loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    false, stdWorklistViewType);
                break;
        }
    }

    /**
     * Load the scripts for selected centre in centre list
     */
    private loadScriptsOfSelectedCentre() {
        this.metadataLoaded = false;
        // sets the selected candidateScriptId in store.
        let isEbookMarking: boolean =
            configurableCharacteristicsHelper
                .getExamSessionCCValue(
                    configurableCharacteristicsNames.eBookmarking,
                    qigStore.instance.selectedQIGForMarkerOperation.examSessionId
                )
                .toLowerCase() === 'true';

        let candidateScriptInfoCollection = [];

        // Get candidateScriptId and documentyId of all scripts in the currently selected centre
        candidateScriptInfoCollection = standardisationSetupStore.instance.getCandidateScriptDetailsAgainstCentre;

        if (candidateScriptInfoCollection) {
            scriptActionCreator.fetchCandidateScriptMetadata(
                Immutable.List<candidateScriptInfo>(candidateScriptInfoCollection),
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, // MarkSchemeGroupId
                false,
                false,
                false,
                eCourseworkHelper.isECourseworkComponent,
                isEbookMarking,
                enums.StandardisationSetup.SelectResponse,
                false,
                false,
                qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
            );
        }
    }

    /**
     * ReRender standardisation setup containersetupcontainer
     */
    private reRenderOnCentreDetailsSet() {
        this.loadScriptsOfSelectedCentre();
        this.isBusy = false; // wait until the store is updated with new list
        this.setState({ renderedOn: Date.now() });
        // set the scroll postion of Centre List table to view the selected centre
        this.setCentreListScroll();
    }

    /**
     * re render component on toggle change.
     */
    private reRenderOnStandardisationResponseReceived = (isTotalMarksViewSelected: boolean,
        selectedStandardisationSetupWorkList: enums.StandardisationSetup, doMarkNow: boolean = false): void => {
        standardisationsetupActionCreator.getStandardisationTargetDetails
            (standardisationSetupStore.instance.markSchemeGroupId,
            standardisationSetupStore.instance.examinerRoleId);
        this._doMarkNow = doMarkNow;
        // set candidate script info collection.
        let candidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(
            Immutable.List<ResponseBase>
                (standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses).toArray()
        );

        let eBookMarkingCCValue = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.eBookmarking).toLowerCase() ? true : false;

        scriptActionCreator.fetchCandidateScriptMetadata(
            candidateScriptInfoCollection,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            false,
            false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
            false,
            eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false,
            eBookMarkingCCValue,
            selectedStandardisationSetupWorkList,
            false,
            false,
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
        );

        markerInformationActionCreator.GetMarkerInformation(
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            true,
            true,
            qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus
        );
    }

	/**
	 * get Select Response StdResponseGrid
	 * @param hide
	 * @param centerId
	 */
    private getSelectResponseStdResponseGrid() {
        return (
            <StandardisationSetupCentreScriptDetails
                id={'StandardisationSetupCentreScriptDetails'}
                key={'StandardisationSetupCentreScriptDetails-key'}
                standardisationSetupHelper={this.standardisationSetupHelper}
                standardisationSetupWorkList={this.props.standardisationSetupWorkList}
                renderedOn={this.props.renderedOn}
            />);
    }

	/**
	 * Call back function from table wrapper on sorting
	 * @param comparerName
	 * @param sortDirection
	 */
    private onSortClick(comparerName: string, sortDirection: enums.SortDirection) {
        this.comparerName = comparerName;
        this.sortDirection = sortDirection;

        let sortDetails: standardisationsortdetails = {
            qig: standardisationSetupStore.instance.markSchemeGroupId,
            comparerName: comparerList[this.comparerName],
            sortDirection: this.sortDirection,
            selectedWorkList: this.props.standardisationSetupWorkList,
            centreOrScriptOrReuse: (
                this.props.standardisationSetupWorkList === enums.StandardisationSetup.SelectResponse ?
                    (this.selectedSessionTab === enums.StandardisationSessionTab.PreviousSession ? 'Reuse' : 'Centre') : ''),
        };
        // value is to prevent setting min width of the grid columns
        this.doSetMinWidth = false;
        standardisationActionCreator.onSortedClick(sortDetails);
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * callback on clicking the gridRow of the centre list
     */
    private onRowClick(rowId: number) {
        if (this.props.standardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            let centrePartId: number = standardisationSetupStore.instance.standardisationSetupSelectedCentrePartId(rowId);

            standardisationActionCreator.getScriptsOfSelectedCentre
                (standardisationSetupStore.instance.markSchemeGroupId,
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, centrePartId, false,
                standardisationSetupStore.instance.examinerRoleId, rowId);
        }
    }

	/**
	 * Get classifed worklist row definition
	 * @param standardisationSetupWorklistData
	 * @param workListSelection
	 * @param gridType
	 */
    private getGridRows(comparerName: string, sortDirection: enums.SortDirection,
        workListSelection: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        return this.standardisationSetupHelper.generateStandardisationRowDefinion(comparerName, sortDirection, workListSelection, gridType);
    }

	/**
	 * This method will returns the grid toggle button of standardisation setup.
	 */
    private getGridToggleButtons(workListSelection: enums.StandardisationSetup): JSX.Element {
        return (
            <div className='shift-right'>
                <ul className='filter-menu'>
                    <li className='switch-view-btn'>
                        <GridToggleButton key={'gridtogglebuttontotalmarkview_key_' + this.props.id}
                            id={'gridtogglebuttontotalmarkview_' + this.props.id}
                            toggleGridView={this.toggleGridView}
                            isSelected={this.state.isTotalMarkView}
                            buttonType={enums.GridType.totalMarks}
                            selectedLanguage={this.props.selectedLanguage} />

                        <GridToggleButton key={'gridtogglebuttonmarkbyquestion_key_' + this.props.id}
                            id={'gridtogglebuttonmarkbyquestion_' + this.props.id}
                            toggleGridView={this.toggleGridView}
                            isSelected={!this.state.isTotalMarkView}
                            buttonType={enums.GridType.markByQuestion}
                            selectedLanguage={this.props.selectedLanguage} />
                    </li>
                </ul>
            </div>);
    }

    /**
     * this will change the grid view (Total Marks/Marks by Question).
     */
    private toggleGridView() {
        let isTotalMarksViewSelected = !this.state.isTotalMarkView;

        this.setState({
            isBusy: true
        });

        userOptionsHelper.save(userOptionKeys.SELECTED_GRID_VIEW_OPTION, String(isTotalMarksViewSelected), true);

        let gridType: enums.STDWorklistViewType = isTotalMarksViewSelected ?
            enums.STDWorklistViewType.ViewTotalMarks : enums.STDWorklistViewType.ViewMarksByQuestion;

        // Fetch Data from Server on Toggle Change.
        switch (this.props.standardisationSetupWorkList) {
            case enums.StandardisationSetup.ProvisionalResponse:
                standardisationActionCreator.getProvisionalResponseDetails(
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                    loginsession.EXAMINER_ID, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                    false, true, gridType);
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                standardisationActionCreator.getClassifiedResponseDetails(
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                    loginsession.EXAMINER_ID, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                    false, gridType);
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                standardisationActionCreator.getUnClassifiedResponseDetails(
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                    loginsession.EXAMINER_ID, qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                    false, gridType);
                break;
        }
    }

	/**
	 * this will trigger the animation on grid view toggle.
	 */
    private setScrollOnToggle() {
        if (this.state.isGridViewChanged) {
            let that = this;
            /* setTimeout is used with delay 0 to work animation in Firefox and Chrome */
            setTimeout(function () {
                that.setState({
                    isGridViewChanged: false
                });
                worklistActionCreator.setScrollWorklistColumns();
            }, 0);
        }
    }

    /**
     * Load the Selected standardisation worklist screen
     */
    private loadStandardisationWorklistScreen = (workListSelection: enums.StandardisationSetup): JSX.Element => {
        let grid: JSX.Element;
        let gridType: enums.GridType = this.state.isTotalMarkView ? enums.GridType.totalMarks : enums.GridType.markByQuestion;

        this._centreOrScriptOrReuse = '';

        if (!this.comparerName) {
            this.setDefaultComparer();
        }

        let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

        grid = (<StandardisationSetupTableWrapper
            columnHeaderRows={this.getGridColumnHeaderRows(
                workListSelection, this.comparerName, this.sortDirection, this.selectedSessionTab, gridType)}
            frozenHeaderRows={this.getFrozenTableHeaderRow(this.comparerName, this.sortDirection)}
            frozenBodyRows={workListSelection !== enums.StandardisationSetup.ClassifiedResponse ?
                this.standardisationSetupHelper.generateStandardisationFrozenRowBody(
                    _comparerName, this.sortDirection, workListSelection, gridType) : null}
            gridRows={workListSelection !== enums.StandardisationSetup.ClassifiedResponse ?
                this.getGridRows(_comparerName, this.sortDirection, workListSelection, gridType) : null}
            getGridControlId={this.getGridControlId}
            id={this.props.id}
            key={'worklistcontainer_key_' + this.props.id}
            selectedLanguage={this.props.selectedLanguage}
            standardisationSetupType={workListSelection}
            renderedOn={this.state.renderedOn}
            onSortClick={this.onSortClick}
            isBorderRequired={false}
            onRowClick={this.onRowClick}
            doSetMinWidth={this.doSetMinWidth}
            gridType={gridType}
        />);

        return grid;
    }

    /**
     * Return the selected tab header.
     * @param workListSelection
     */
    private getStandardisationSetupRightWorkListContainerHeader = (workListSelection: enums.StandardisationSetup): string => {
        let headingText: string;
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
	 * Generating Grid Rows
	 * @param comparerName
	 * @param sortDirection
	 */
    private getFrozenTableHeaderRow(comparerName: string, sortDirection: enums.SortDirection): Immutable.List<Row> {
        return this.standardisationSetupHelper.generateFrozenRowHeader
            (comparerName, sortDirection, this.props.standardisationSetupWorkList, this.selectedSessionTab);
    }

	/**
	 * Generating Frozen Grid Rows
	 * @param standardisationSetupDetailsList
	 */
    private getFrozenTableBodyRows(standardisationSetupDetailsList: StandardisationSetupDetailsList): Immutable.List<Row> {
        return this.standardisationSetupHelper.generateFrozenRowBody(standardisationSetupDetailsList,
            this.props.standardisationSetupWorkList);
    }

    /**
     * Generating Grid Rows
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param gridType
     * @param centreOrScript
     */
    private getGridColumnHeaderRows(standardisationSetupType: enums.StandardisationSetup,
        comparerName: string,
        sortDirection: enums.SortDirection,
        selectedTab: enums.StandardisationSessionTab,
        gridType?: enums.GridType,
        centreOrScript?: string
    ): Immutable.List<Row> {
        return this.standardisationSetupHelper.generateTableHeader(standardisationSetupType,
            comparerName, sortDirection, gridType, selectedTab, centreOrScript);
    }

	/**
	 * Resets the comparer and sort order
	 */
    private resetSortAttributes(): void {
        this.comparerName = undefined;
        this.sortDirection = undefined;
    }

    /**
     * This method will return the table content for select response
     */
    private getSelectResponseCentreListGrid(workListSelection: enums.StandardisationSetup) {
        let selectResponseTableContent: JSX.Element;

        this._centreOrScriptOrReuse = 'Centre';

        if (!this.comparerName) {
            this.setDefaultComparer();
        }

        let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

        let data = standardisationSetupStore.instance.standardisationCentreList;

        if (data !== undefined && this.comparerName !== undefined) {
            data.centreList = Immutable.List<any>(sortHelper.sort(data.centreList.toArray(), comparerList[_comparerName]));
        }

        this._gridFrozenHeaderRows = null;
        this._gridFrozenBodyRows = null;

        if (data) {
            selectResponseTableContent = (
                <div className='grid-split-wrapper std-centre-grid' id='stdCentreGrid'>
                    <div className='grid-holder grid-view selectable-grid' ref={(ref) => this.centreDetails = ref}>
                        {this.getRightContainerBlueMessage(workListSelection, true)}
                        <div className='grid-wrapper'>
                            <StandardisationSetupTableWrapper
                                columnHeaderRows={this.getGridColumnHeaderRows(this.props.standardisationSetupWorkList,
                                    this.comparerName, this.sortDirection, this.selectedSessionTab)}
                                frozenHeaderRows={this._gridFrozenHeaderRows}
                                frozenBodyRows={this._gridFrozenBodyRows}
                                gridRows={this.standardisationSetupHelper.generateCentreRowDefinition(data)}
                                getGridControlId={this.getCentreGridControlId}
                                id={this.props.id}
                                onSortClick={this.onSortClick}
                                onRowClick={this.onRowClick}
                                renderedOn={this.state.renderedOn}
                                isBorderRequired={false}
                            />
                        </div>
                    </div>
                </div>);
        }

        return selectResponseTableContent;
    }

    /**
     * Set the comparer for the current standardisation
     */
    private setDefaultComparer() {
        let defaultComparers = standardisationSetupStore.instance.standardisationSortDetails;
        let standardisationSetup: enums.StandardisationSetup = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;

        let entry: standardisationsortdetails[] = defaultComparers.filter((x: standardisationsortdetails) =>
            x.selectedWorkList === standardisationSetup &&
            x.qig === standardisationSetupStore.instance.markSchemeGroupId &&
            x.centreOrScriptOrReuse === this._centreOrScriptOrReuse);

        if (entry && entry.length > 0) {
            this.comparerName = comparerList[entry[0].comparerName];
            this.sortDirection = entry[0].sortDirection;
        }

    }

    /**
     * Hide the declassify pop up
     */
    private hideDeclassifyPopup() {
        this.setState({
            isDeclassifyPopupDisplaying: false
        });
    }

	/**
	 * Hide the reclassify pop up
	 */
    private hideReclassifyPopup() {

        // Notify the reclassify cancel action.
        standardisationActionCreator.rejectedReclassifyAction();
        this.setState({
            isReclassifyPopupDisplaying: false
        });
    }

	/**
	 * Get the grid control id used only for select centre response.
	 */
    private getCentreGridControlId = (): string => {
        let gridId: string = enums.StandardisationSetup[this.props.standardisationSetupWorkList] + '_centre_grid_' + this.props.id;
        return gridId;
    }

    /**
     * Get the grid control id used only for reusable response.
     */
    private getReusableResponsesGridControlId = (): string => {
        let gridId: string = enums.StandardisationSetup[this.props.standardisationSetupWorkList] + '_reuasable_response_grid_' +
            this.props.id;
        return gridId;
    }

	/**
	 * Get the grid control id
	 * @param centreOrScript //used only for select response.
	 */
    private getGridControlId = (): string => {
        let gridId: string = '';
        switch (this.props.standardisationSetupWorkList) {
            case enums.StandardisationSetup.None:
                break;
            case enums.StandardisationSetup.SelectResponse:
                if (this._centreOrScriptOrReuse === 'Script') {
                    gridId = enums.StandardisationSetup[this.props.standardisationSetupWorkList] + '_script_grid_' + this.props.id;
                } else {
                    gridId = enums.StandardisationSetup[this.props.standardisationSetupWorkList] + '_centre_grid_' + this.props.id;
                }
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
            case enums.StandardisationSetup.ProvisionalResponse:
            case enums.StandardisationSetup.UnClassifiedResponse:
                gridId = enums.StandardisationSetup[this.props.standardisationSetupWorkList] + 'grid_' + this.props.id;
                break;
        }
        return gridId;
    }

    /**
     * Load response container.
     */
    private loadContainer(): void {
        navigationHelper.loadResponsePage();
    }

    /**
     * Set the loading indicator
     */
    private setLoadingindicator() {
        this.loading = <LoadingIndicator id='loading' key='loading'
            selectedLanguage={localeStore.instance.Locale}
            isOnline={applicationStore.instance.isOnline}
            cssClass='section-loader loading' />;
    }

	/**
	 * Declassify the Popup action
	 */
    private declassifyPopupOpen = (declassifyResponseDetails: updateEsMarkGroupMarkingModeData): void => {
        this._classifyResponseDetails = declassifyResponseDetails;
        this.setState(
            {
                isDeclassifyPopupDisplaying: true
            }
        );
    }

    /**
     * Gets called on retrieval of candidate response metadata which aids for the Script background download
     * No need to fetch the Suppressed pages
     */
    private onCandidateResponseMetadataRetrieved = (isAutoRefresh: boolean): void => {
        this.metadataLoaded = true;
        if (this._doMarkNow && this.metadataLoaded) {
            this._doMarkNow = false;

            //need to append 6 with display id from front end
            let openedResponseDetails =
                markerOperationModeFactory.operationMode.openedResponseDetails(
                    '6' + standardisationSetupStore.instance.createdStandardisationRIGDetails.displayId.toString());

            responseHelper.openResponse(parseInt(openedResponseDetails.displayId),
                enums.ResponseNavigation.specific,
                enums.ResponseMode.open,
                openedResponseDetails.esMarkGroupId,
                enums.ResponseViewMode.zoneView,
                enums.TriggerPoint.None,
                openedResponseDetails.sampleReviewCommentId,
                openedResponseDetails.sampleReviewCommentCreatedBy);

            markSchemeHelper.getMarks(parseInt(openedResponseDetails.displayId), undefined);

            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(openedResponseDetails.displayId));
        } else {
            this.setState({
                isTotalMarkView: standardisationSetupStore.instance.isTotalMarksViewSelected,
                renderedOn: Date.now(),
                // Set isGridViewChanged as true to reset the scroll.
                isGridViewChanged: true,
                isBusy: false
            });
        }
    }


	/**
	 * Declassify the selected response
	 */
    private declassifyResponse() {
        standardisationActionCreator.declassifyResponse(this._classifyResponseDetails);
        this.setState({
            isDeclassifyPopupDisplaying: false
        });
    }

    /**
     *  Display confirmation dialog to reclassify the response.
     */
    private reclassifyPopupOpen = (reclassifiedResponseDetails: updateEsMarkGroupMarkingModeData): void => {
        this._classifyResponseDetails = {
            candidateScriptId: reclassifiedResponseDetails.candidateScriptId,
            esCandidateScriptMarkSchemeGroupId: reclassifiedResponseDetails.esCandidateScriptMarkSchemeGroupId,
            markSchemeGroupId: reclassifiedResponseDetails.markSchemeGroupId,
            markingModeId: reclassifiedResponseDetails.markingModeId,
            previousMarkingModeId: reclassifiedResponseDetails.previousMarkingModeId,
            rigOrder: reclassifiedResponseDetails.rigOrder,
            isRigOrderUpdateRequired: reclassifiedResponseDetails.isRigOrderUpdateRequired,
            displayId: reclassifiedResponseDetails.displayId,
            totalMarkValue: reclassifiedResponseDetails.totalMarkValue,
            assignNextRigOrder: false,
            esMarkGroupRowVersion: reclassifiedResponseDetails.esMarkGroupRowVersion
        };

        // Set flag to display Reclassify Popup Or not.
        this.setState(
            {
                isReclassifyPopupDisplaying: true
            }
        );
    }

    private reclassifyResponse = (): void => {
        standardisationActionCreator.reclassifyResponse(standardisationSetupStore.instance.reclassifiedResponseDetails());
        this.setState({
            isReclassifyPopupDisplaying: false
        });
    };

    /**
     * share Provisional Response completed action
     */
    private shareResponseCompleted = (isFromMarkScheme: boolean): void => {
        if (!isFromMarkScheme) {
            standardisationActionCreator.getProvisionalResponseDetails(standardisationSetupStore.instance.examinerRoleId,
                loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                false, true, this.currentSTDWorklistViewType());
        }
    }

	/**
	 * On OK click of Reclassify Error message popup
	 */
    private onReorderErrorMessageOkClick = (): void => {
        //change the state to false to close the popup
        this.setState({ isReorderErrorPopupDisplaying: false });
    };

	/**
	 * Re render the classified response details after declassification.
	 */
    private reRenderOnReorderResponse = (): void => {

        // refresh the worklist once reordered.
        standardisationActionCreator.getClassifiedResponseDetails(standardisationSetupStore.instance.examinerRoleId,
            loginsession.EXAMINER_ID, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            false, this.currentSTDWorklistViewType());

        this.setState(
            {
                renderedOn: Date.now()
            }
        );
    }

    /**
     * Show the reorder fail popup whenever a failure occur
     */
    private reorderErrorPopupOpen = (displayId: string): void => {
        this._displayId = displayId;
        this.setState(
            {
                isReorderErrorPopupDisplaying: true
            }
        );
    }

    /**
     * Re render the previous session details after toggling Hide Response.
     */
    private reRenderOnUpdateHiddenStatus = (): void => {
        this.setState(
            {
                renderedOn: Date.now()
            }
        );
    }

    /**
     * Method to return the current worklist view of selected worklist.
     */
    private currentSTDWorklistViewType = () => {
        return this.state.isTotalMarkView ? enums.STDWorklistViewType.ViewTotalMarks :
            enums.STDWorklistViewType.ViewMarksByQuestion;
    }
}
export = StandardisationSetupContainer;
