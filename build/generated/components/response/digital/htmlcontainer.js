"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ResponseContainer = require('../responsecontainer');
var responsecontainerpropertybase = require('../../utility/responsehelper/responsecontainerpropertybase');
var htmlContainerHelper = require('../../utility/responsehelper/htmlcontainerhelper');
var responseStore = require('../../../stores/response/responsestore');
var markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
var worklistStore = require('../../../stores/worklist/workliststore');
var enums = require('../../utility/enums');
var HtmlViewer = require('../../digital/html/htmlviewer');
var IconsDefinitionPalette = require('../toolbar/stamppanel/stampdefinition/iconsdefinitionpalette');
var scriptStore = require('../../../stores/script/scriptstore');
var markingStore = require('../../../stores/marking/markingstore');
var stringHelper = require('../../../utility/generic/stringhelper');
var htmlutilities = require('../../../utility/generic/htmlutilities');
/**
 * React component class for html container
 */
var HtmlContainer = (function (_super) {
    __extends(HtmlContainer, _super);
    function HtmlContainer(props, state) {
        _super.call(this, props, state);
        this.isPinchZoomPrevented = false;
        // If authentication failed then the page is refreshed, redirect to login page.
        if (this.isLoginSessionAuthenticated()) {
            /* instantiating the property base which holds all the protected variables of response container*/
            this.responseContainerProperty = new responsecontainerpropertybase();
            this.initialize();
            this.setInitialValuesAfterAuthorize();
            /* instantiating the helper with */
            this.responseContainerHelper = new htmlContainerHelper(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
            this.responseContainerProperty.responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            this.responseContainerHelper.openResponse(this.loadScriptImages);
        }
        this.preventPinchZoom = this.preventPinchZoom.bind(this);
    }
    /**
     * render method of html viewer component
     */
    HtmlContainer.prototype.render = function () {
        var _this = this;
        /* instantiating the helper with */
        this.responseContainerHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        this.popupHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        var htmlContainerElement;
        var header = this.responseContainerHelper.header();
        var footer = this.responseContainerHelper.footer(this.state.isConfirmationPopupDisplaying, this.resetLogoutConfirmationSatus);
        if (this.state != null && this.state.modulesLoaded && responseStore.instance.selectedDisplayId > 0
            && this.state.scriptLoaded && markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            this.responseContainerHelper.preRenderInitialisations(this.state.isBusy, this.state.selectedViewMode, this.state.isUnManagedSLAOPopupVisible, this.state.isUnManagedImageZonePopUpVisible);
            var responseModeWrapperClassName = this.responseContainerHelper.getResponseModeWrapperClassName(this.state.isExceptionPanelVisible, this.state.isCommentsSideViewEnabled);
            var _a = this.getMarkschemeAndToolbarComponents(), markSchemePanel = _a[0], markButtonsContainer = _a[1];
            htmlContainerElement = (React.createElement("div", {className: 'marking-wrapper', onClick: this.onClickHandler, onDoubleClick: this.onClickHandler, onContextMenu: this.onClickHandler}, React.createElement(IconsDefinitionPalette, null), header, this.getMessageExceptionComponents(), footer, React.createElement("div", {className: responseModeWrapperClassName}, this.responseContainerHelper.markingViewButton(null, this.onChangeResponseViewClick, responseStore.instance.markingMethod, this.onShowAnnotatedPagesOptionChanged, this.onShowAllPagesOfScriptOptionChanged, this.onExceptionSelected, this.onCreateNewExceptionClicked, this.showRejectRigConfirmationPopUp, this.onShowUnAnnotatedAdditionalPagesOptionChanged, false, false), this.getToolBarPanel(), React.createElement("div", {className: 'marksheets', onMouseMove: this.onMouseMove, ref: function (ele) {
                _this.responseContainerProperty.markSheetContainer = ele;
            }}, React.createElement("div", {id: 'markSheetContainerInner', className: 'marksheets-inner'}, React.createElement("div", {className: 'marksheets-inner-images'}, React.createElement("div", {className: 'marksheet-container active'}, this.getHtmlViewer())), this.popupHelper.markConfirmation())), markSchemePanel, markButtonsContainer, this.commonElements()), this.getPopupComponents()));
        }
        else {
            htmlContainerElement = (React.createElement("div", null, header, this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, enums.BusyIndicatorInvoker.loadingModules, this.autoKillLoadingIndicator, 30000), footer));
        }
        return htmlContainerElement;
    };
    /**
     * The component didmount for CBT response
     */
    HtmlContainer.prototype.componentDidMount = function () {
        if (this.state == null) {
            return;
        }
        this.addCommonEventListners();
    };
    /**
     * This function gets invoked when the component is about to be updated
     */
    HtmlContainer.prototype.componentDidUpdate = function () {
        // Rerender the page to resize the image when the response container size changes.
        // eg: Appearing message box pane;
        if (this.responseContainerProperty.hasResponseLayoutChanged) {
            this.getMessagePanelRightPosition();
            this.responseContainerProperty.hasResponseLayoutChanged = false;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    HtmlContainer.prototype.componentWillUnmount = function () {
        this.removeCommonEventListners();
    };
    /**
     * Get html viewer component.
     */
    HtmlContainer.prototype.getHtmlViewer = function () {
        var htmlViewer = null;
        if (markingStore.instance.currentQuestionItemInfo
            && !(this.doUnMount && htmlutilities.isIPadDevice && htmlutilities.getUserDevice().browser === 'Safari')) {
            var responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            var candidateScriptId_1 = responseData.candidateScriptId;
            var url = void 0;
            if (candidateScriptId_1 > 0) {
                if (scriptStore.instance.getCandidateResponseMetadata) {
                    var scriptImage = scriptStore.instance.getCandidateResponseMetadata.scriptImageList.filter(function (scriptImage) {
                        return scriptImage.candidateScriptId === candidateScriptId_1;
                    });
                    if (scriptImage != null) {
                        url = scriptImage.first().responseLink;
                    }
                }
            }
            var pageLink = config.general.SERVICE_BASE_URL + stringHelper.format(url, [markingStore.instance.currentQuestionItemInfo.answerItemId.toString()]);
            htmlViewer = (React.createElement(HtmlViewer, {id: 'html-viewer', key: 'key-html-viewer', className: 'cbt-content-holder active', url: pageLink, onLoadFn: this.preventPinchZoom, iframeID: 'iframe_HTML'}));
        }
        return htmlViewer;
    };
    /**
     * tool bar panel
     */
    HtmlContainer.prototype.getToolBarPanel = function () {
        var toolBarPanel;
        // Checking whether marks and markschemes are loaded for showing markscheme.
        if (this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            toolBarPanel = this.responseContainerHelper.toolbarPanel(this.state.renderedOnECourseWorkFiles, null, this.onMessageSelected, this.onCreateNewMessageSelected, this.onMessageReadStatusRequireUpdation, this.onExceptionSelected, this.onCreateNewExceptionClicked, this.onRemarkNowButtonClicked, this.onPromoteToSeedButtonClicked, this.onRemarkLaterButtonClicked, this.onPromoteToReuseButtonClicked, this.showRejectRigConfirmationPopUp, this.setHasMultipleToolbarColumns, this.doDisableMarkingOverlay);
        }
        return toolBarPanel;
    };
    /**
     * prevent Pinch Zoom
     */
    HtmlContainer.prototype.preventPinchZoom = function () {
        var iframe = window.parent.document.getElementById('iframe_HTML');
        if (iframe !== null && this.isPinchZoomPrevented === false) {
            $(iframe.contentWindow).on('gesturestart touchmove', function (evt) {
                var e = evt.originalEvent;
                // Added condition to check touches lenth and event scale to allow scrolling and only prevent pinch zoom in gesture start.
                if (e.touches.length > 1 || evt.delegateTarget.event.scale !== 1) {
                    evt.originalEvent.preventDefault();
                }
            });
            $(iframe.contentWindow).on('gestureend touchmove', function (evt) {
                var e = evt.originalEvent;
                // Added condition to check touches lenth and event scale to allow scrolling and only prevent pinch zoom in gesture end.
                if (e.touches.length > 1 || evt.delegateTarget.event.scale !== 1) {
                    evt.originalEvent.preventDefault();
                }
            });
            this.isPinchZoomPrevented = true;
        }
    };
    return HtmlContainer;
}(ResponseContainer));
module.exports = HtmlContainer;
//# sourceMappingURL=htmlcontainer.js.map