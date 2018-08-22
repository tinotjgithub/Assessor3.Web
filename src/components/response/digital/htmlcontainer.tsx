import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import loginSession = require('../../../app/loginsession');
import ResponseContainer = require('../responsecontainer');
import responsecontainerpropertybase = require('../../utility/responsehelper/responsecontainerpropertybase');
import htmlContainerHelper = require('../../utility/responsehelper/htmlcontainerhelper');
import responseStore = require('../../../stores/response/responsestore');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import worklistStore = require('../../../stores/worklist/workliststore');
import enums = require('../../utility/enums');
import HtmlViewer = require('../../digital/html/htmlviewer');
import IconsDefinitionPalette = require('../toolbar/stamppanel/stampdefinition/iconsdefinitionpalette');
import scriptStore = require('../../../stores/script/scriptstore');
import markingStore = require('../../../stores/marking/markingstore');
import stringHelper = require('../../../utility/generic/stringhelper');
import htmlutilities = require('../../../utility/generic/htmlutilities');
declare let config: any;

/**
 * props of html container
 */
interface Props extends PropsBase, LocaleSelectionBase {
}

/**
 * React component class for html container
 */
class HtmlContainer extends ResponseContainer {
    private isPinchZoomPrevented: boolean = false;
    constructor(props: Props, state: any) {
        super(props, state);
        // If authentication failed then the page is refreshed, redirect to login page.
        if (this.isLoginSessionAuthenticated()) {
            /* instantiating the property base which holds all the protected variables of response container*/
            this.responseContainerProperty = new responsecontainerpropertybase();
            this.initialize();
            this.setInitialValuesAfterAuthorize();

            /* instantiating the helper with */
            this.responseContainerHelper = new htmlContainerHelper(
                this.responseContainerProperty,
                this.state.renderedOn,
                this.props.selectedLanguage,
                this.state.selectedViewMode
            );
            this.responseContainerProperty.responseData = worklistStore.instance.getResponseDetails
                (responseStore.instance.selectedDisplayId.toString());
            this.responseContainerHelper.openResponse(this.loadScriptImages);
        }
        this.preventPinchZoom = this.preventPinchZoom.bind(this);

    }

    /**
     * render method of html viewer component
     */
    public render(): JSX.Element {
        /* instantiating the helper with */
        this.responseContainerHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn,
            this.props.selectedLanguage, this.state.selectedViewMode);
        this.popupHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn,
            this.props.selectedLanguage, this.state.selectedViewMode);
        let htmlContainerElement: JSX.Element;
        let header: JSX.Element = this.responseContainerHelper.header();
        let footer: JSX.Element =
            this.responseContainerHelper.footer(this.state.isConfirmationPopupDisplaying,
                this.resetLogoutConfirmationSatus);

        if (this.state != null && this.state.modulesLoaded && responseStore.instance.selectedDisplayId > 0
            && this.state.scriptLoaded && markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            this.responseContainerHelper.preRenderInitialisations(this.state.isBusy,
                this.state.selectedViewMode, this.state.isUnManagedSLAOPopupVisible, this.state.isUnManagedImageZonePopUpVisible);

            let responseModeWrapperClassName: string = this.responseContainerHelper.getResponseModeWrapperClassName(
                this.state.isExceptionPanelVisible,
                this.state.isCommentsSideViewEnabled
            );

            let [markSchemePanel, markButtonsContainer] = this.getMarkschemeAndToolbarComponents();

            htmlContainerElement = (
                <div className='marking-wrapper'
                    onClick={this.onClickHandler}
                    onDoubleClick={this.onClickHandler}
                    onContextMenu={this.onClickHandler}>
                    <IconsDefinitionPalette />
                    {header}
                    {this.getMessageExceptionComponents()}
                    {footer}
                    <div className={responseModeWrapperClassName}>
                        {this.responseContainerHelper.markingViewButton(null,
                            this.onChangeResponseViewClick, responseStore.instance.markingMethod, this.onShowAnnotatedPagesOptionChanged,
                            this.onShowAllPagesOfScriptOptionChanged, this.onExceptionSelected, this.onCreateNewExceptionClicked,
                            this.showRejectRigConfirmationPopUp, this.onShowUnAnnotatedAdditionalPagesOptionChanged, false, false)}
                        {this.getToolBarPanel()}
                        <div className={'marksheets'} onMouseMove={this.onMouseMove} ref={(ele) => {
                            this.responseContainerProperty.markSheetContainer = ele;
                        }}>
                            <div id='markSheetContainerInner'
                                className='marksheets-inner'>
                                <div className='marksheets-inner-images'>
                                    <div className='marksheet-container active'>
                                        {this.getHtmlViewer()}
                                    </div>
                                </div>
                                {this.responseContainerHelper.offPageComments(this.state.isExceptionPanelVisible)}
                                {this.popupHelper.markConfirmation()}
                            </div>
                        </div>
                        {markSchemePanel}
                        {markButtonsContainer}
                        {this.commonElements()}
                    </div>
                    {this.getPopupComponents()}
                </div>
            );
        } else {
            htmlContainerElement = (<div>
                {header}
                {this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy,
                    enums.BusyIndicatorInvoker.loadingModules, this.autoKillLoadingIndicator, 30000)}
                {footer}
            </div>);
        }
        return htmlContainerElement;
    }

    /**
     * The component didmount for CBT response
     */
    public componentDidMount() {
        if (this.state == null) {
            return;
        }
        this.addCommonEventListners();
    }

    /**
     * This function gets invoked when the component is about to be updated
     */
    public componentDidUpdate() {
        // Rerender the page to resize the image when the response container size changes.
        // eg: Appearing message box pane;
        if (this.responseContainerProperty.hasResponseLayoutChanged) {
            this.getMessagePanelRightPosition();
            this.responseContainerProperty.hasResponseLayoutChanged = false;
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        this.removeCommonEventListners();
    }

    /**
     * Get html viewer component.
     */
    private getHtmlViewer(): JSX.Element {
        let htmlViewer: JSX.Element = null;
        if (markingStore.instance.currentQuestionItemInfo
            && !(this.doUnMount && htmlutilities.isIPadDevice && htmlutilities.getUserDevice().browser === 'Safari')) {
            let responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            let candidateScriptId = responseData.candidateScriptId;
            let url: string;
            if (candidateScriptId > 0) {
                if (scriptStore.instance.getCandidateResponseMetadata) {
                    let scriptImage = scriptStore.instance.getCandidateResponseMetadata.scriptImageList.filter((scriptImage: ScriptImage) =>
                        scriptImage.candidateScriptId === candidateScriptId
                    );

                    if (scriptImage != null) {
                        url = scriptImage.first().responseLink;
                    }
                }
            }

            let pageLink: string = config.general.SERVICE_BASE_URL + stringHelper.format(url,
                [markingStore.instance.currentQuestionItemInfo.answerItemId.toString()]);

            htmlViewer = (<HtmlViewer
                id='html-viewer'
                key='key-html-viewer'
                className='cbt-content-holder active'
                url={pageLink}
                onLoadFn={this.preventPinchZoom}
                // Iframe id need to be changed depending on differen html player.
                iframeID='iframe_HTML' />);
        }

        return htmlViewer;
    }

    /**
     * tool bar panel
     */
    private getToolBarPanel(): JSX.Element {
        let toolBarPanel: JSX.Element;
        // Checking whether marks and markschemes are loaded for showing markscheme.
        if (
            this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()
        ) {

            toolBarPanel = this.responseContainerHelper.toolbarPanel(
                this.state.renderedOnECourseWorkFiles,
                null,
                this.onMessageSelected,
                this.onCreateNewMessageSelected,
                this.onMessageReadStatusRequireUpdation,
                this.onExceptionSelected,
                this.onCreateNewExceptionClicked,
                this.onRemarkNowButtonClicked,
                this.onPromoteToSeedButtonClicked,
                this.onRemarkLaterButtonClicked,
                this.onPromoteToReuseButtonClicked,
                this.showRejectRigConfirmationPopUp,
                this.setHasMultipleToolbarColumns,
                this.doDisableMarkingOverlay
            );
        }
        return toolBarPanel;
    }

    /**
     * prevent Pinch Zoom
     */
    private preventPinchZoom() {
        let iframe = window.parent.document.getElementById('iframe_HTML') as HTMLIFrameElement;
        if (iframe !== null && this.isPinchZoomPrevented === false) {
            $(iframe.contentWindow).on('gesturestart touchmove', function (evt: any) {
                let e = evt.originalEvent as TouchEvent;
                // Added condition to check touches lenth and event scale to allow scrolling and only prevent pinch zoom in gesture start.
                if (e.touches.length > 1 || evt.delegateTarget.event.scale !== 1) {
                    evt.originalEvent.preventDefault();
                }
            });

            $(iframe.contentWindow).on('gestureend touchmove', function (evt: any) {
                let e = evt.originalEvent as TouchEvent;
                // Added condition to check touches lenth and event scale to allow scrolling and only prevent pinch zoom in gesture end.
                if (e.touches.length > 1 || evt.delegateTarget.event.scale !== 1) {
                    evt.originalEvent.preventDefault();
                }
            });
            this.isPinchZoomPrevented = true;
        }
    }
}
export = HtmlContainer;