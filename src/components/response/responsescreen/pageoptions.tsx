/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import enums = require('../../utility/enums');
import worklistStore = require('../../../stores/worklist/workliststore');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import localeStore = require('../../../stores/locale/localestore');
import GenericButton = require('../../utility/genericbutton');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import annotation = require('../../../stores/response/typings/annotation');
import constants = require('../../utility/constants');
import deviceHelper = require('../../../utility/touch/devicehelper');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import pageLinkHelper = require('./linktopage/pagelinkhelper');
let classNames = require('classnames');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import responseStore = require('../../../stores/response/responsestore');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import markingStore = require('../../../stores/marking/markingstore');
import loggingHelper = require('../../utility/marking/markingauditlogginghelper');
import loggerConstants = require('../../utility/loggerhelperconstants');
import colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
import eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
import eventTypes = require('../../base/eventmanager/eventtypes');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import direction = require('../../base/eventmanager/direction');

interface Props extends PropsBase, LocaleSelectionBase {
    pageNumber: number;
    markThisButtonClickCallback: Function;
    isFlaggedAsSeenButtonVisisble: boolean;
    isMarkThisPageButtonVisible: boolean;
    currentImageMaxWidth: number;
    lastMarkSchemeId: number;
    markSheetIdClicked?: number;
    reRender: Function;
    onLinkToButtonClick: Function;
    isLinkToPagePopupShowing: boolean;
    unManagedSLAOFlagAsSeenClick: Function;
    hasUnmanagedSLAO: boolean;
    isAdditionalObject: boolean;
    hasUnmanagedImageZones: boolean;
    hasUnKnownContent: boolean;
    unKnownContentFlagAsSeenClick: Function;
    updatePageOptionButtonPositionCallback: Function;
    pageOptionElementRefCallback: Function;
    optionButtonWrapperElementRefCallback: Function;
    buttonWrapperPositionUpdate: Function;
    doWrapperReRender: boolean;
    isPageOptionButtonsShown: boolean;
}

/**
 * React component class for Full Response view Page Options.
 */
class PageOptions extends eventManagerBase {

	private clickedPageNumber: number;
    private logger: loggingHelper = new loggingHelper();
    private style: React.CSSProperties;
    private pageOptionElement: HTMLDivElement;
    private optionButtonWrapperElement: HTMLDivElement;

    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onMarkThisPageButtonClick = this.onMarkThisPageButtonClick.bind(this);
        this.onFlagAsSeenButtonClick = this.onFlagAsSeenButtonClick.bind(this);
        this.onLinkToQuestionButtonClick = this.onLinkToQuestionButtonClick.bind(this);
        this.style = {};
    }

    /**
     * Render method
     */
    public render(): JSX.Element {

        return (
            <div className={this.getClassName()} id={this.props.id} key={'key_' + this.props.id}
                onMouseOver={this.onMouseMoveHandler.bind(this, true)}
                onMouseOut={this.onMouseMoveHandler.bind(this, false)}
                ref={(pageOption) => {
                    this.pageOptionElement = pageOption;
                    // Fix to avoid button showing in Gray area of FRV
                    // Page option Element will set only for hovered page.
                    this.props.pageOptionElementRefCallback(this.props.isPageOptionButtonsShown ? pageOption : undefined);
                }}
            >
                {this.renderFullResponseViewButtons() }
            </div>
        );
    }

    /**
     * component did mount
     */
    public componentDidMount() {
        responseStore.instance.addListener(responseStore.ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT,
            this.doStampSeenAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onAnnotationRemoved);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        if (!this.eventHandler.isInitialized) {
            let touchActionValue: string = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(this.pageOptionElement, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, null);
            this.eventHandler.on(eventTypes.PAN, this.onPanHandler.bind(this, true));
            this.eventHandler.on(eventTypes.TAP, this.onPanHandler.bind(this, true));
        }
    }

    /**
     * component updated by changig props or state
     */
    public componentDidUpdate() {
        if (this.props.doWrapperReRender === true && !(eCourseworkHelper && eCourseworkHelper.isECourseworkComponent)) {
            this.props.buttonWrapperPositionUpdate();
        }
    }

    /**
     * component will unmount
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT,
            this.doStampSeenAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onAnnotationRemoved);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        if (this.eventHandler) {
            this.eventHandler.destroy();
        }
    }

    /**
     * determines stamping is needed.
     * @param pageNumber
     */
    private doStampSeenAnnotation = (pageNumber: number): void => {
        if (this.clickedPageNumber === pageNumber) {
            this.stampSeenAnnotation();
        }
    }

    /**
     * Render the Flagged As Seen Button, if required.
     */
    public renderFlagAsSeenButton() {
        if (this.props.isFlaggedAsSeenButtonVisisble) {
            let buttonText = localeStore.instance.TranslateText('marking.full-response-view.script-page.flag-as-seen-button');
            return (
                <GenericButton className='rounded' id={'flag-as-seen-' + this.props.id} key= {'flag-as-seen' + this.props.id}
                    content={buttonText} onClick={this.onFlagAsSeenButtonClick}
                    selectedLanguage={this.props.selectedLanguage}/>
            );
        }
    }

    /**
     * Function to find page option div's height
     */
    private optionButtonWrapperHeight = (pageOptionRect: any) => {
        let windowHeight = window.innerHeight;
        return (Math.min(windowHeight - constants.FRV_TOOLBAR_HEIGHT,
                Math.min(pageOptionRect.bottom, windowHeight) - Math.max(pageOptionRect.top, constants.FRV_TOOLBAR_HEIGHT)) / 2);
    }

    /**
     * Function to find page option div's top
     */
    private optionButtonWrapperTop = (calulatedOptionButtonWrapperHeight: number, optionButtonWrapper: any, pageOptionRect: any) => {
        let obnWrapperTop: any = Math.round(optionButtonWrapper.height < calulatedOptionButtonWrapperHeight ?
            calulatedOptionButtonWrapperHeight + Math.max(constants.FRV_TOOLBAR_HEIGHT, pageOptionRect.top) :
            pageOptionRect.bottom - (optionButtonWrapper.height));
        obnWrapperTop = obnWrapperTop - (optionButtonWrapper.height / 2);
        return obnWrapperTop;
    }

    /**
     * Function to find page option div's left
     */
    private optionButtonWrapperLeft = (pageOptionRect: any, optionButtonWrapper: any) => {
        return Math.round(pageOptionRect.left + (pageOptionRect.width / 2) - (optionButtonWrapper.width / 2));
    }

    /*
     * Mouse move event handler
     */
    public onMouseMoveHandler = (isMouseIn: boolean, event: any) => {
        if (!htmlUtilities.isTabletOrMobileDevice) {
            this.props.updatePageOptionButtonPositionCallback(isMouseIn, this.props.pageNumber);
        }
    };

    /*
     * Tap event handler
     */
    public onPanHandler = (isMouseIn: boolean, event: any) => {
        this.props.updatePageOptionButtonPositionCallback(isMouseIn, this.props.pageNumber);
    };

    /**
     * Change Link as primary button in FR View(only for unmanaged SLAO) if links already Applied .
     */
    public renderFullResponseViewButtons() {
        let isPageLinked = pageLinkHelper.isPageLinked(this.props.pageNumber);
        let buttonElementArray: Array<JSX.Element> = [];

        if (this.props.hasUnmanagedSLAO) {
            buttonElementArray.push(this.renderMarkThisPageButton());
            buttonElementArray.push(this.renderLinkToQuestionButton());
            buttonElementArray.push(this.renderFlagAsSeenButton());
        } else if (this.props.hasUnmanagedImageZones) {
            let isUnManaged: boolean = responseHelper.hasUnManagedImageZoneForThePage(this.props.pageNumber);
                if (isUnManaged === true) {
                    buttonElementArray.push(this.renderMarkThisPageButton());
                    buttonElementArray.push(this.renderLinkToQuestionButton());
                    buttonElementArray.push(this.renderFlagAsSeenButton());
                } else {
                    buttonElementArray.push((isPageLinked === true || this.isCurrentPageAnnotated()) ?
                        this.renderLinkToQuestionButton() : null);
                    buttonElementArray.push(this.renderFlagAsSeenButton());
            }
        } else if (responseHelper.isEbookMarking) {
            buttonElementArray.push(this.renderMarkThisPageButton());
            buttonElementArray.push(this.renderLinkToQuestionButton());
        } else {
            buttonElementArray.push(this.renderMarkThisPageButton());
            buttonElementArray.push(this.renderFlagAsSeenButton());
            buttonElementArray.push(this.renderLinkToQuestionButton());
        }

        // added class hide to control the animation on page option buttons. done as part of 
        // frv usability improvement.
        return (<div className='option-button-wrapper hide' style={this.style}
            ref={(optionButtonWrapper) => {
                this.optionButtonWrapperElement = optionButtonWrapper;
                // Fix to avoid button showing in Gray area of FRV
                // Option Button Wrapper Element will set only for hovered page.
                this.props.optionButtonWrapperElementRefCallback(this.props.isPageOptionButtonsShown ? optionButtonWrapper : undefined);
            }}>
            {buttonElementArray}
        </div>);
    }

    /**
     * Render mark this page Button, if required.
     */
    private renderMarkThisPageButton() {
        if (this.props.isMarkThisPageButtonVisible) {
            let buttonText: string = markerOperationModeFactory.operationMode.markThisPageOrViewThisPageButtonText;
            return (
                <GenericButton className='rounded primary' id={'btn-' + this.props.id} key= {'key_button_' + this.props.id}
                    content={buttonText} onClick={this.onMarkThisPageButtonClick}
                    selectedLanguage={this.props.selectedLanguage}/>
            );
        }
    }

    /**
     * Returns whether current page is annotated
     */
    private isCurrentPageAnnotated = (): boolean => {
        let currentAnnotations: Immutable.List<annotation> = annotationHelper.getCurrentMarkGroupAnnotation();
        let isCurrentPageAnnotated = currentAnnotations.some((annotation: annotation) => annotation.pageNo === this.props.pageNumber);
        return isCurrentPageAnnotated;
    }

    /**
     * For getting the proper classname for the pageoption component.
     */
    private getClassName() {
        if (htmlUtilities.isTabletOrMobileDevice) {
            return classNames(
                    'page-options',
                    { 'hovered': this.props.isPageOptionButtonsShown || this.props.markSheetIdClicked === this.props.pageNumber });
        } else {
            // add the hovered class only if page option button to shown is true.
            return this.props.isPageOptionButtonsShown ? 'page-options hovered' : 'page-options';
        }
    }

    /**
     * This method will call on mark this button click
     */
    private onMarkThisPageButtonClick = (): void => {
        if (this.props.markThisButtonClickCallback) {
            /** Reset the markingProgress flag in marking store back to true only if the response mode is
             *  open. This flag is used while saving marks. Save marks will not happen for closed responses
             */
            if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed
                || (markerOperationModeFactory.operationMode.isStandardisationSetupMode
                    && !markerOperationModeFactory.operationMode.isResponseReadOnly)) {
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toCurrentResponse);
            }

            this.props.markThisButtonClickCallback(this.props.pageNumber);
        }

        markingActionCreator.setMarkThisPageNumber(this.props.pageNumber);
    };

    /**
     * this method is involked when the Flag as seen Button Click
     */
    private onFlagAsSeenButtonClick = (): void => {
        // shows a popup for unmanaged SLAO
        if (this.props.hasUnmanagedSLAO && this.props.isAdditionalObject) {
            this.clickedPageNumber = this.props.pageNumber;
            this.props.unManagedSLAOFlagAsSeenClick(this.props.pageNumber);
        } else if (this.props.hasUnKnownContent) {
            this.clickedPageNumber = this.props.pageNumber;
            this.props.unKnownContentFlagAsSeenClick(this.props.pageNumber);
        } else {
            this.stampSeenAnnotation();
        }
    };

    /*
     * stamps flag as seen annotation
     */
    private stampSeenAnnotation = (): void => {
        let newlyAddedAnnotation: annotation = annotationHelper.
            getAnnotationToAdd(constants.SEEN_STAMP_ID,
            this.props.pageNumber, 0, 0,
            this.props.currentImageMaxWidth / 2, // Annottaion should be placed the centre top of the respective page.
            60, // 60 is in px to show the image in the top of script
            enums.AddAnnotationAction.Stamping,
            7, // 7 is in px to show the annotation in AI -- this valud generally leties with respect to the page zoom
            7, // 7 is in px to show the annotation in AI -- this valud generally leties with respect to the page zoom
            this.props.lastMarkSchemeId, 0, 0);
		newlyAddedAnnotation.addedBySystem = true;

		let stampName: string = enums.DynamicAnnotation[constants.SEEN_STAMP_ID];
		let cssProps: React.CSSProperties = colouredAnnotationsHelper.
			createAnnotationStyle(newlyAddedAnnotation, enums.DynamicAnnotation[stampName]);
		let rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
		newlyAddedAnnotation.red = parseInt(rgba[0]);
		newlyAddedAnnotation.green = parseInt(rgba[1]);
		newlyAddedAnnotation.blue = parseInt(rgba[2]);

		markingActionCreator.addNewlyAddedAnnotation(newlyAddedAnnotation);

		// Log the annotation modified actions.
		this.logger.logAnnotationModifiedAction(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
            'DisplayId -' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_ADD_SEEN,
			newlyAddedAnnotation,
			markingStore.instance.currentMarkGroupId,
			markingStore.instance.currentMarkSchemeId);

        this.props.reRender();
    }

    /* triggered when link to page button is clicked */
    private onLinkToQuestionButtonClick = (event: any): void => {
        this.clickedPageNumber = this.props.pageNumber;
        this.props.onLinkToButtonClick(event, this.props.pageNumber);
        this.props.reRender();
    };

    /**
     * Render link to question button.
     */
    private renderLinkToQuestionButton() {
        if (markerOperationModeFactory.operationMode.hasLinkToQuestion
            && pageLinkHelper.doShowLinkToQuestion(responseHelper.isAtypicalResponse())) {
            let linkToQuestionClassName = this.props.hasUnmanagedSLAO || this.props.hasUnmanagedImageZones ?
                'rounded primary' : 'rounded popup-nav';
            let isPageLinked = pageLinkHelper.isPageLinked(this.props.pageNumber);
            let buttonText: string = isPageLinked ?
                localeStore.instance.TranslateText('marking.full-response-view.script-page.view-and-edit-links-button')
                : localeStore.instance.TranslateText('marking.full-response-view.script-page.link-to-question-button');
            return (<GenericButton className={linkToQuestionClassName} id={'link_to_question_btn-' + this.props.id}
                key= {'key_link_to_question_btn_' + this.props.id} content={buttonText} onClick={this.onLinkToQuestionButtonClick}
                aria-haspopup='true' data-popup='linkToPagePopUp' selectedLanguage={this.props.selectedLanguage}/>);
        } else {
            return null;
        }
    }

    /**
     * Rerender the component on annotation added
     */
    private onAnnotationAdded = (stampId: number, annotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string, annotation: annotation) => {
        // render only annotation added page
        if (this.clickedPageNumber === annotation.pageNo) {
            this.clickedPageNumber = undefined;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Rerender the component on annotation removed
     */
    private onAnnotationRemoved = (annotation: annotation) => {
        // render only annotation removed page
        if (this.clickedPageNumber === annotation.pageNo) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
}

export = PageOptions;
