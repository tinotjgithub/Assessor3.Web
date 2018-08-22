"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var enums = require('../../utility/enums');
var worklistStore = require('../../../stores/worklist/workliststore');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var localeStore = require('../../../stores/locale/localestore');
var GenericButton = require('../../utility/genericbutton');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var constants = require('../../utility/constants');
var deviceHelper = require('../../../utility/touch/devicehelper');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var pageLinkHelper = require('./linktopage/pagelinkhelper');
var classNames = require('classnames');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var responseStore = require('../../../stores/response/responsestore');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var markingStore = require('../../../stores/marking/markingstore');
var loggingHelper = require('../../utility/marking/markingauditlogginghelper');
var loggerConstants = require('../../utility/loggerhelperconstants');
var colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
var eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
var eventTypes = require('../../base/eventmanager/eventtypes');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
/**
 * React component class for Full Response view Page Options.
 */
var PageOptions = (function (_super) {
    __extends(PageOptions, _super);
    /**
     * @constructor
     */
    function PageOptions(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.logger = new loggingHelper();
        /**
         * determines stamping is needed.
         * @param pageNumber
         */
        this.doStampSeenAnnotation = function (pageNumber) {
            if (_this.clickedPageNumber === pageNumber) {
                _this.stampSeenAnnotation();
            }
        };
        /**
         * Function to find page option div's height
         */
        this.optionButtonWrapperHeight = function (pageOptionRect) {
            var windowHeight = window.innerHeight;
            return (Math.min(windowHeight - constants.FRV_TOOLBAR_HEIGHT, Math.min(pageOptionRect.bottom, windowHeight) - Math.max(pageOptionRect.top, constants.FRV_TOOLBAR_HEIGHT)) / 2);
        };
        /**
         * Function to find page option div's top
         */
        this.optionButtonWrapperTop = function (calulatedOptionButtonWrapperHeight, optionButtonWrapper, pageOptionRect) {
            var obnWrapperTop = Math.round(optionButtonWrapper.height < calulatedOptionButtonWrapperHeight ?
                calulatedOptionButtonWrapperHeight + Math.max(constants.FRV_TOOLBAR_HEIGHT, pageOptionRect.top) :
                pageOptionRect.bottom - (optionButtonWrapper.height));
            obnWrapperTop = obnWrapperTop - (optionButtonWrapper.height / 2);
            return obnWrapperTop;
        };
        /**
         * Function to find page option div's left
         */
        this.optionButtonWrapperLeft = function (pageOptionRect, optionButtonWrapper) {
            return Math.round(pageOptionRect.left + (pageOptionRect.width / 2) - (optionButtonWrapper.width / 2));
        };
        /*
         * Mouse move event handler
         */
        this.onMouseMoveHandler = function (isMouseIn, event) {
            if (!htmlUtilities.isTabletOrMobileDevice) {
                _this.props.updatePageOptionButtonPositionCallback(isMouseIn, _this.props.pageNumber);
            }
        };
        /*
         * Tap event handler
         */
        this.onPanHandler = function (isMouseIn, event) {
            _this.props.updatePageOptionButtonPositionCallback(isMouseIn, _this.props.pageNumber);
        };
        /**
         * Returns whether current page is annotated
         */
        this.isCurrentPageAnnotated = function () {
            var currentAnnotations = annotationHelper.getCurrentMarkGroupAnnotation();
            var isCurrentPageAnnotated = currentAnnotations.some(function (annotation) { return annotation.pageNo === _this.props.pageNumber; });
            return isCurrentPageAnnotated;
        };
        /**
         * This method will call on mark this button click
         */
        this.onMarkThisPageButtonClick = function () {
            if (_this.props.markThisButtonClickCallback) {
                /** Reset the markingProgress flag in marking store back to true only if the response mode is
                 *  open. This flag is used while saving marks. Save marks will not happen for closed responses
                 */
                if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
                    || (markerOperationModeFactory.operationMode.isStandardisationSetupMode
                        && !markerOperationModeFactory.operationMode.isResponseReadOnly)) {
                    markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toCurrentResponse);
                }
                _this.props.markThisButtonClickCallback(_this.props.pageNumber);
            }
            markingActionCreator.setMarkThisPageNumber(_this.props.pageNumber);
        };
        /**
         * this method is involked when the Flag as seen Button Click
         */
        this.onFlagAsSeenButtonClick = function () {
            // shows a popup for unmanaged SLAO
            if (_this.props.hasUnmanagedSLAO && _this.props.isAdditionalObject) {
                _this.clickedPageNumber = _this.props.pageNumber;
                _this.props.unManagedSLAOFlagAsSeenClick(_this.props.pageNumber);
            }
            else if (_this.props.hasUnKnownContent) {
                _this.clickedPageNumber = _this.props.pageNumber;
                _this.props.unKnownContentFlagAsSeenClick(_this.props.pageNumber);
            }
            else {
                _this.stampSeenAnnotation();
            }
        };
        /*
         * stamps flag as seen annotation
         */
        this.stampSeenAnnotation = function () {
            var newlyAddedAnnotation = annotationHelper.
                getAnnotationToAdd(constants.SEEN_STAMP_ID, _this.props.pageNumber, 0, 0, _this.props.currentImageMaxWidth / 2, // Annottaion should be placed the centre top of the respective page.
            60, // 60 is in px to show the image in the top of script
            enums.AddAnnotationAction.Stamping, 7, // 7 is in px to show the annotation in AI -- this valud generally leties with respect to the page zoom
            7, // 7 is in px to show the annotation in AI -- this valud generally leties with respect to the page zoom
            _this.props.lastMarkSchemeId, 0, 0);
            newlyAddedAnnotation.addedBySystem = true;
            var stampName = enums.DynamicAnnotation[constants.SEEN_STAMP_ID];
            var cssProps = colouredAnnotationsHelper.
                createAnnotationStyle(newlyAddedAnnotation, enums.DynamicAnnotation[stampName]);
            var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
            newlyAddedAnnotation.red = parseInt(rgba[0]);
            newlyAddedAnnotation.green = parseInt(rgba[1]);
            newlyAddedAnnotation.blue = parseInt(rgba[2]);
            markingActionCreator.addNewlyAddedAnnotation(newlyAddedAnnotation);
            // Log the annotation modified actions.
            _this.logger.logAnnotationModifiedAction(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, 'DisplayId -' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_ADD_SEEN, newlyAddedAnnotation, markingStore.instance.currentMarkGroupId, markingStore.instance.currentMarkSchemeId);
            _this.props.reRender();
        };
        /* triggered when link to page button is clicked */
        this.onLinkToQuestionButtonClick = function (event) {
            _this.clickedPageNumber = _this.props.pageNumber;
            _this.props.onLinkToButtonClick(event, _this.props.pageNumber);
            _this.props.reRender();
        };
        /**
         * Rerender the component on annotation added
         */
        this.onAnnotationAdded = function (stampId, annotationAction, annotationOverlayId, annotation) {
            // render only annotation added page
            if (_this.clickedPageNumber === annotation.pageNo) {
                _this.clickedPageNumber = undefined;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Rerender the component on annotation removed
         */
        this.onAnnotationRemoved = function (annotation) {
            // render only annotation removed page
            if (_this.clickedPageNumber === annotation.pageNo) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        this.onMarkThisPageButtonClick = this.onMarkThisPageButtonClick.bind(this);
        this.onFlagAsSeenButtonClick = this.onFlagAsSeenButtonClick.bind(this);
        this.onLinkToQuestionButtonClick = this.onLinkToQuestionButtonClick.bind(this);
        this.style = {};
    }
    /**
     * Render method
     */
    PageOptions.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {className: this.getClassName(), id: this.props.id, key: 'key_' + this.props.id, onMouseOver: this.onMouseMoveHandler.bind(this, true), onMouseOut: this.onMouseMoveHandler.bind(this, false), ref: function (pageOption) {
            _this.pageOptionElement = pageOption;
            // Fix to avoid button showing in Gray area of FRV
            // Page option Element will set only for hovered page.
            _this.props.pageOptionElementRefCallback(_this.props.isPageOptionButtonsShown ? pageOption : undefined);
        }}, this.renderFullResponseViewButtons()));
    };
    /**
     * component did mount
     */
    PageOptions.prototype.componentDidMount = function () {
        responseStore.instance.addListener(responseStore.ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT, this.doStampSeenAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onAnnotationRemoved);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        if (!this.eventHandler.isInitialized) {
            var touchActionValue = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(this.pageOptionElement, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, null);
            this.eventHandler.on(eventTypes.PAN, this.onPanHandler.bind(this, true));
            this.eventHandler.on(eventTypes.TAP, this.onPanHandler.bind(this, true));
        }
    };
    /**
     * component updated by changig props or state
     */
    PageOptions.prototype.componentDidUpdate = function () {
        if (this.props.doWrapperReRender === true && !(eCourseworkHelper && eCourseworkHelper.isECourseworkComponent)) {
            this.props.buttonWrapperPositionUpdate();
        }
    };
    /**
     * component will unmount
     */
    PageOptions.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT, this.doStampSeenAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onAnnotationRemoved);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        if (this.eventHandler) {
            this.eventHandler.destroy();
        }
    };
    /**
     * Render the Flagged As Seen Button, if required.
     */
    PageOptions.prototype.renderFlagAsSeenButton = function () {
        if (this.props.isFlaggedAsSeenButtonVisisble) {
            var buttonText = localeStore.instance.TranslateText('marking.full-response-view.script-page.flag-as-seen-button');
            return (React.createElement(GenericButton, {className: 'rounded', id: 'flag-as-seen-' + this.props.id, key: 'flag-as-seen' + this.props.id, content: buttonText, onClick: this.onFlagAsSeenButtonClick, selectedLanguage: this.props.selectedLanguage}));
        }
    };
    /**
     * Change Link as primary button in FR View(only for unmanaged SLAO) if links already Applied .
     */
    PageOptions.prototype.renderFullResponseViewButtons = function () {
        var _this = this;
        var isPageLinked = pageLinkHelper.isPageLinked(this.props.pageNumber);
        var buttonElementArray = [];
        if (this.props.hasUnmanagedSLAO) {
            buttonElementArray.push(this.renderMarkThisPageButton());
            buttonElementArray.push(this.renderLinkToQuestionButton());
            buttonElementArray.push(this.renderFlagAsSeenButton());
        }
        else if (this.props.hasUnmanagedImageZones) {
            var isUnManaged = responseHelper.hasUnManagedImageZoneForThePage(this.props.pageNumber);
            if (isUnManaged === true) {
                buttonElementArray.push(this.renderMarkThisPageButton());
                buttonElementArray.push(this.renderLinkToQuestionButton());
                buttonElementArray.push(this.renderFlagAsSeenButton());
            }
            else {
                buttonElementArray.push((isPageLinked === true || this.isCurrentPageAnnotated()) ?
                    this.renderLinkToQuestionButton() : null);
                buttonElementArray.push(this.renderFlagAsSeenButton());
            }
        }
        else if (responseHelper.isEbookMarking) {
            buttonElementArray.push(this.renderMarkThisPageButton());
            buttonElementArray.push(this.renderLinkToQuestionButton());
        }
        else {
            buttonElementArray.push(this.renderMarkThisPageButton());
            buttonElementArray.push(this.renderFlagAsSeenButton());
            buttonElementArray.push(this.renderLinkToQuestionButton());
        }
        return (React.createElement("div", {className: 'option-button-wrapper', style: this.style, ref: function (optionButtonWrapper) {
            _this.optionButtonWrapperElement = optionButtonWrapper;
            // Fix to avoid button showing in Gray area of FRV
            // Option Button Wrapper Element will set only for hovered page.
            _this.props.optionButtonWrapperElementRefCallback(_this.props.isPageOptionButtonsShown ? optionButtonWrapper : undefined);
        }}, buttonElementArray));
    };
    /**
     * Render mark this page Button, if required.
     */
    PageOptions.prototype.renderMarkThisPageButton = function () {
        if (this.props.isMarkThisPageButtonVisible) {
            var buttonText = markerOperationModeFactory.operationMode.markThisPageOrViewThisPageButtonText;
            return (React.createElement(GenericButton, {className: 'rounded primary', id: 'btn-' + this.props.id, key: 'key_button_' + this.props.id, content: buttonText, onClick: this.onMarkThisPageButtonClick, selectedLanguage: this.props.selectedLanguage}));
        }
    };
    /**
     * For getting the proper classname for the pageoption component.
     */
    PageOptions.prototype.getClassName = function () {
        if (htmlUtilities.isTabletOrMobileDevice) {
            return classNames('page-options', { 'hovered': this.props.markSheetIdClicked === this.props.pageNumber });
        }
        else {
            return 'page-options hovered';
        }
    };
    /**
     * Render link to question button.
     */
    PageOptions.prototype.renderLinkToQuestionButton = function () {
        if (markerOperationModeFactory.operationMode.hasLinkToQuestion
            && pageLinkHelper.doShowLinkToQuestion(responseHelper.isAtypicalResponse())) {
            var linkToQuestionClassName = this.props.hasUnmanagedSLAO || this.props.hasUnmanagedImageZones ?
                'rounded primary' : 'rounded popup-nav';
            var isPageLinked = pageLinkHelper.isPageLinked(this.props.pageNumber);
            var buttonText = isPageLinked ?
                localeStore.instance.TranslateText('marking.full-response-view.script-page.view-and-edit-links-button')
                : localeStore.instance.TranslateText('marking.full-response-view.script-page.link-to-question-button');
            return (React.createElement(GenericButton, {className: linkToQuestionClassName, id: 'link_to_question_btn-' + this.props.id, key: 'key_link_to_question_btn_' + this.props.id, content: buttonText, onClick: this.onLinkToQuestionButtonClick, "aria-haspopup": 'true', "data-popup": 'linkToPagePopUp', selectedLanguage: this.props.selectedLanguage}));
        }
        else {
            return null;
        }
    };
    return PageOptions;
}(eventManagerBase));
module.exports = PageOptions;
//# sourceMappingURL=pageoptions.js.map