/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import domManager = require('../../../../utility/generic/domhelper');
import RotateClockWise = require('./rotateclockwise');
import RotateAntiClockWise = require('./rotateanticlockwise');
import FitWidth = require('./fitwidth');
import FitHeight = require('./fitheight');
import zoomPanelActionCreator = require('../../../../actions/zoompanel/zoompanelactioncreator');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import enums = require('../../../utility/enums');
import userOptionActionCreator = require('../../../../actions/useroption/useroptionactioncreator');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');
import userOptionHelper = require('../../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../../stores/qigselector/qigstore');
import stringHelper = require('../../../../utility/generic/stringhelper');
import responseStore = require('../../../../stores/response/responsestore');
import stampStore = require('../../../../stores/stamp/stampstore');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
import markingStore = require('../../../../stores/marking/markingstore');
import zoomHelper = require('../../responsescreen/zoomhelper/zoomhelper');
import responseHelper = require('../../../utility/responsehelper/responsehelper');
import constants = require('../../../utility/constants');
let classNames = require('classnames');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import modulekeys = require('../../../../utility/generic/modulekeys');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import awardingStore = require('../../../../stores/awarding/awardingstore');

/** Component for Zoom in and out */
/* tslint:disable:variable-name */
const ZoomInOut = (props: ZoomInOutProps) => (<a href='javascript:void(0)' id={props.id}
    title={props.title}
    className={props.style}
    onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        let zoomType = props.sign === '+' ? enums.ZoomType.CustomZoomIn : enums.ZoomType.CustomZoomOut;
        props.triggerZoom(zoomType);
    }}>
    {props.sign}</a>);

/** Component for zoom percentage */
/* tslint:disable:variable-name */
const ZoomPercentage = (props: ZoomPercentageProps) => (
    <div title={props.title}
        id={props.id}
        className={'border-button zoom-level' + (props.isEditable ? ' edit' : '')}
        onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            props.onClick();
        }}>
        <input type='text' value={props.zoomPercent} aria-label={props.title}
            className='zoom-leavel-input' id='zoom-label-input'
            onKeyUp={(e: any) => {
                props.onZoomPercentageKeyUp(e);
            }}
            onInput={(e: any) => {
                props.onZoomPercentageInput(e);
            }}
            onBlur={(e: any) => {
                props.onZoomPercentageBlur(e);
            }} />
        <span className='zoom-label'>
            {props.zoomPercent + '%'}
        </span>
    </div>);
/**
 * Properties of component ZoomInOut .
 * @param {Props} props
 */
interface ZoomInOutProps extends LocaleSelectionBase, PropsBase {
    id: string;
    title: string;
    style: string;
    sign: string;
    triggerZoom: Function;
}

/**
 * Properties of component ZoomPercentage.
 * @param {Props} props
 */
interface ZoomPercentageProps extends LocaleSelectionBase, PropsBase {
    id: string;
    title: string;
    zoomPercent: string;
    isEditable: boolean;
    onClick: Function;
    onZoomPercentageInput: Function;
    onZoomPercentageKeyUp: Function;
    onZoomPercentageBlur: Function;
}

/**
 * State of zoom button
 */
interface State {
    isZoomOptionOpen?: boolean;
    zoomPreference?: enums.ZoomPreference;
    zoomPercentage?: string;
    isZoomPercentageEditable?: boolean;
}

/**
 * Props for the zoom Panel
 */
interface ZoomPanelProps extends PropsBase, LocaleSelectionBase {
    selectedECourseworkPageID: number;
}

/**
 * ZoomOption class
 * @param {any} any
 * @param {any} any
 * @returns
 */
class ZoomPanel extends pureRenderComponent<ZoomPanelProps, State> {
    private _boundHandleOnClick: EventListenerObject = null;
    private _switchFitOption: EventListenerObject = null;
    private _openCloseZoomOption: any = null;
    private _currentUserZoomValue: number = -1;
    /**
     * Constructor for Zoompanel
     * @param props
     * @param state
     */
    constructor(props: ZoomPanelProps, state: State) {
        super(props, state);
        this.state = {
            isZoomOptionOpen: false,
            zoomPreference: enums.ZoomPreference.FitWidth,
            zoomPercentage: '',
            isZoomPercentageEditable: false
        };
        this._openCloseZoomOption = this.openCloseZoomOption.bind(this);
        this._switchFitOption = this.switchFitOption.bind(this);
        this.switchFitOption = this.switchFitOption.bind(this);
        this.triggerZoom = this.triggerZoom.bind(this);
        this.responseZoomUpdated = this.responseZoomUpdated.bind(this);
        this.zoomPanelHide = this.zoomPanelHide.bind(this);
        this.onZoomPercentageClick = this.onZoomPercentageClick.bind(this);
        this.onRotateClockWise = this.onRotateClockWise.bind(this);
        this.onRotateAntiClockWise = this.onRotateAntiClockWise.bind(this);
        this.onZoomPercentageInput = this.onZoomPercentageInput.bind(this);
        this.onZoomPercentageKeyUp = this.onZoomPercentageKeyUp.bind(this);
        this.onZoomPercentageBlur = this.onZoomPercentageBlur.bind(this);
    }

    /**
     * Open/Close the Zoom option
     * @param {any} source - The source element
     */
    private openCloseZoomOption(e: MouseEvent) {
        stampActionCreator.showOrHideComment(false);
        // Close Bookmark Name Entry Box
        stampActionCreator.showOrHideBookmarkNameBox(false);
        if (this.state.isZoomOptionOpen === false) {
            this.setState({ isZoomOptionOpen: true });
        } else {
            // set isZoomOptionOpen state to false only if not clicked on the zoom percentage
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el: any) { return el.id === 'zoom-percentage'; }) == null) {
                this.setState({
                    isZoomOptionOpen: false,
                    isZoomPercentageEditable: false
                });
                this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput,
                    enums.ResponseViewSettings.CustomZoom);
            }
        }
    }

    /**
     * Handle click events outside the zoom settings
     * @param {any} e - The source element
     */
    private handleClickOutsideElement = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the user details list item. if not close the open window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any) { return el.id === 'zoompanel'; }) == null) {
            if (this.state.isZoomOptionOpen === true) {
                this.setState({
                    isZoomOptionOpen: false,
                    isZoomPercentageEditable: false
                });
                this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput,
                    enums.ResponseViewSettings.CustomZoom);
            }
        }

        // both touchend and click event is fired one after other,
        // this avoid resetting store in touchend
        if (e.type !== 'touchend') {
            zoomPanelActionCreator.zoomOptionClicked(this.state.isZoomOptionOpen);
        }

        this.setZoomPreference();
    };

    /**
     * Handle click events for switching the Fit Options
     * @param {string} fitType - The Fit Type as per user selection
     */
    private switchFitOption(fitType: enums.ZoomPreference) {
        if (fitType === this.state.zoomPreference) {
            return;
        }

        switch (fitType) {
            case (enums.ZoomPreference.FitHeight):
                if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined
                    && !markerOperationModeFactory.operationMode.isAwardingMode) {
                    userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE,
                        this.getUpdatedZoomPreference(enums.ZoomPreference.FitHeight),
                        responseStore.instance.markingMethod !== enums.MarkingMethod.Structured,
                        true, false, true, this.getExaminerRoleId());
                }
                zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, enums.ResponseViewSettings.FitToHeight);
                this.setState({
                    zoomPreference: enums.ZoomPreference.FitHeight,
                    isZoomPercentageEditable: false
                });
                break;
            case (enums.ZoomPreference.FitWidth):
                if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined
                    && !markerOperationModeFactory.operationMode.isAwardingMode) {
                    userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE,
                        this.getUpdatedZoomPreference(enums.ZoomPreference.FitWidth),
                        responseStore.instance.markingMethod !== enums.MarkingMethod.Structured,
                        true, false, true, this.getExaminerRoleId());
                }
                zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, enums.ResponseViewSettings.FitToWidth);
                this.setState({
                    zoomPreference: enums.ZoomPreference.FitWidth,
                    isZoomPercentageEditable: false
                });
                break;
        }
        // reset the user custom zoom value to -1 when clicking fit height/width option
        this._currentUserZoomValue = -1;
        this.doEnableKeyBoardHandlers(true);
    }

    /**
     * Finds the current user option for FitHeight and FitWidth
     */
    private setZoomPreference = () => {
        // If Marker got withdrawn during the actions. Skip the activities.
        if (qigStore.instance.selectedQIGForMarkerOperation === undefined) {
            return;
        }

        let preference: any = this.getZoomPreferenceFromUserOption();

        switch (preference.zoomPreference) {
            case enums.ZoomPreference.FitWidth:
                this.setState({ zoomPreference: enums.ZoomPreference.FitWidth });
                break;
            case enums.ZoomPreference.FitHeight:
                this.setState({ zoomPreference: enums.ZoomPreference.FitHeight });
                break;
            case enums.ZoomPreference.Percentage:
                this.setState({ zoomPreference: enums.ZoomPreference.Percentage });
                break;
        }
    };

    /**
     * Gets the Zoom Preference from User Option
     */
    private getZoomPreferenceFromUserOption = () => {

        let zoomPreference: enums.ZoomPreference = enums.ZoomPreference.FitWidth;
        let zoomPercentage: number;
        let zoomUserOption: string = userOptionHelper.getUserOptionByName
            (userOptionKeys.ZOOM_PREFERENCE, this.getExaminerRoleId());

        let userOption: any = {};

        // If user has opened structured response, we have to get the zoom value of the current markscheme
        // or the default as FITWidth.
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
            && markingStore.instance.currentQuestionItemInfo !== undefined ||
            this.props.selectedECourseworkPageID > 0) {

            if (responseHelper.isAtypicalResponse()) {
                userOption = zoomHelper.getAtypicalZoomOption(zoomUserOption);
            } else {
                // Get the saved zoom percentage value
                userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption,
                    markingStore.instance.currentQuestionItemInfo.imageClusterId,
                    this.props.selectedECourseworkPageID);
            }
        } else {
            userOption = zoomHelper.getZoomUserOption(zoomUserOption);
        }
        zoomPreference = userOption.zoomPreference;
        zoomPercentage = userOption.userOptionZoomValue;
        return { 'zoomPreference': zoomPreference, 'zoomPercentage': zoomPercentage };
    };

    /**
     * Subscribe window click event
     */
    public componentDidMount() {
        this._boundHandleOnClick = this.handleClickOutsideElement.bind(this);
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        stampStore.instance.addListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.zoomPanelHide);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.HIDE_ZOOM_PANEL, this.zoomPanelHide);
        stampStore.instance.addListener(stampStore.StampStore.SWITCH_ZOOM_PREFERENCE_EVENT, this.switchFitOption);
    }

    /**
     * Unsubscribe window click event
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.zoomPanelHide);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.HIDE_ZOOM_PANEL, this.zoomPanelHide);
        stampStore.instance.removeListener(stampStore.StampStore.SWITCH_ZOOM_PREFERENCE_EVENT, this.switchFitOption);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        let svgStyle = {
            pointerEvents: 'none'
        };
        let ZoomPlus = ZoomInOut;
        let ZoomMinus = ZoomInOut;
        let zoom = localeStore.instance.TranslateText(
            'marking.response.zoom-rotate-panel.zoom');
        let rotate = localeStore.instance.TranslateText(
            'marking.response.zoom-rotate-panel.rotate');
        let zoomPercentage = isNaN(parseFloat(this.state.zoomPercentage)) ? '' :
            Math.round(parseFloat(this.state.zoomPercentage)).toString();
        return (<li id={this.props.id} className={classNames('mrk-zoom-icon dropdown-wrap',
            this.state.isZoomOptionOpen ? 'open' : ''
        )} onClick={this._openCloseZoomOption}>
            <a href='javascript:void(0)'
                className='menu-button'
                title={
                    localeStore.instance.TranslateText(
                        'marking.response.left-toolbar.zoom-rotate-button-tooltip')
                }
                id={this.props.id}>
                <span className='svg-icon'>
                    <svg viewBox='0 0 32 32' className='mag-glass-icon' style={svgStyle}>
                        <title>
                            {localeStore.instance.TranslateText('marking.response.left-toolbar.zoom-rotate-button-tooltip')}
                        </title>
                        <use xlinkHref='#icon-mag-glass'></use>
                    </svg>
                </span>
                <span className='sprite-icon toolexpand-icon'>Zoom Panel</span>
            </a>
            <div className='tool-option-menu menu' id='zoom_tool_option_menu'>
                <div className='zoom-button-holder'>
                    <div className='button-label'>{zoom}</div>
                    <div className='border-button-holder'>
                        <div className='fit-screen-holder'>
                            <FitWidth
                                title={localeStore.instance.TranslateText(
                                    'marking.response.zoom-rotate-panel.zoom-fit-width-tooltip')}
                                name={localeStore.instance.TranslateText(
                                    'marking.response.zoom-rotate-panel.zoom-fit-width')}
                                active={this.state.zoomPreference === enums.ZoomPreference.FitWidth
                                    && !this.state.isZoomPercentageEditable
                                    ? 'fit-width-button fit-button border-button active'
                                    : 'fit-width-button fit-button border-button'}
                                switchFit={this._switchFitOption} />
                            <FitHeight
                                title={localeStore.instance.TranslateText(
                                    'marking.response.zoom-rotate-panel.zoom-fit-height-tooltip')}
                                name={localeStore.instance.TranslateText(
                                    'marking.response.zoom-rotate-panel.zoom-fit-height')}
                                active={this.state.zoomPreference === enums.ZoomPreference.FitHeight
                                    && !this.state.isZoomPercentageEditable
                                    ? 'fit-height-button fit-button border-button active'
                                    : 'fit-height-button fit-button border-button'}
                                switchFit={this._switchFitOption} />
                        </div>
                    </div>
                    <div className={this.getCustomZoomClassName()}>
                        <ZoomMinus style={'border-button decrease-zoom'} id='zoom-out' key='key_zoom_out'
                            title={localeStore.instance.TranslateText(
                                'marking.response.zoom-rotate-panel.zoom-out-tooltip')}
                            sign={'-'}
                            triggerZoom={this.triggerZoom.bind(this)} />
                        <ZoomPercentage key='key_zoom_per' id='zoom-percentage'
                            title={localeStore.instance.TranslateText(
                                'marking.response.zoom-rotate-panel.zoom-level-tooltip')}
                            zoomPercent={zoomPercentage}
                            onClick={this.onZoomPercentageClick}
                            isEditable={this.state.isZoomPercentageEditable}
                            onZoomPercentageInput={this.onZoomPercentageInput}
                            onZoomPercentageKeyUp={this.onZoomPercentageKeyUp}
                            onZoomPercentageBlur={this.onZoomPercentageBlur} />
                        <ZoomPlus style={'border-button increase-zoom'} id='zoom-in' key='key_zoom_in'
                            title={localeStore.instance.TranslateText(
                                'marking.response.zoom-rotate-panel.zoom-in-tooltip')}
                            sign={'+'}
                            triggerZoom={this.triggerZoom.bind(this)} />
                    </div>
                </div>

                <div className='rotate-button-holder'>
                    <div className='button-label'>{rotate}</div>
                    <RotateClockWise title={localeStore.instance.TranslateText(
                        'marking.response.zoom-rotate-panel.rotate-clockwise-tooltip')}
                        onRotateClockWise={this.onRotateClockWise} />
                    <RotateAntiClockWise title={localeStore.instance.TranslateText(
                        'marking.response.zoom-rotate-panel.rotate-anticlockwise-tooltip')}
                        onRotateAntiClockWise={this.onRotateAntiClockWise} />
                </div>
            </div >
        </li>);
    }

    /**
     * Retrieve the zoom class name
     * @returns
     */
    private getCustomZoomClassName() {
        return classNames(
            'enlarger border-button-holder',
            {
                'active': this.state.zoomPreference === enums.ZoomPreference.Percentage
                && this.state.isZoomPercentageEditable !== true
            }
        );
    }

    /**
     * Rotate Clockwise click
     */
    private onRotateClockWise(e: MouseEvent | TouchEvent): void {
        this.setState({ isZoomPercentageEditable: false });
        this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput,
            enums.ResponseViewSettings.CustomZoom);
        zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.RotateClockwise);
        e.stopPropagation();
    }

    /**
     * Rotate Anti Clockwise click
     */
    private onRotateAntiClockWise(e: MouseEvent | TouchEvent): void {
        this.setState({ isZoomPercentageEditable: false });
        this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput,
            enums.ResponseViewSettings.CustomZoom);
        zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.RotateAntiClockwise);
        e.stopPropagation();
    }

    /**
     * Triggering the zoom
     * @param {enums.ZoomType} zoomType
     */
    private triggerZoom = (zoomType: enums.ZoomType): void => {
        // check if no custom zoom in entered by the user. if this._currentUserZoomValue !== -1 then it means user had entered
        // custom zoom then we have to go through validateAndRoundOffZoomValue() and apply custom zoom accordingly
        if (this._currentUserZoomValue === -1) {
            if (zoomType === enums.ZoomType.CustomZoomOut && Math.round(parseFloat(this.state.zoomPercentage))
                                                                                         === constants.MIN_ZOOM_PERCENTAGE) {
                this.setState({ isZoomPercentageEditable: false });
                return;
            } else if (zoomType === enums.ZoomType.CustomZoomIn && Math.round(parseFloat(this.state.zoomPercentage))
                                                                                         === constants.MAX_ZOOM_PERCENTAGE) {
                this.setState({ isZoomPercentageEditable: false });
                return;
            }
        }
        this.setState({
            zoomPreference: enums.ZoomPreference.Percentage,
            isZoomPercentageEditable: false
        });
        /* we need to update user zoom value on clicking the + or - button if user enters any value
         * Eg : - if user enters a value in the custom zoom box and clicked + or - button then
         * the zoom value to update should be MIN_ZOOM_PERCENTAGE added or substracted to the user input
         */
        if (this._currentUserZoomValue !== -1 && !isNaN(this._currentUserZoomValue)) {
            if (zoomType === enums.ZoomType.CustomZoomIn) {
                this._currentUserZoomValue += constants.MIN_ZOOM_PERCENTAGE;
            } else if (zoomType === enums.ZoomType.CustomZoomOut) {
                this._currentUserZoomValue = this.roundOffZoomValue(this._currentUserZoomValue);
                this._currentUserZoomValue -= constants.MIN_ZOOM_PERCENTAGE;
            }
            this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput,
                enums.ResponseViewSettings.CustomZoom);
        } else {
            zoomPanelActionCreator.initiateResponseImageZoom(zoomType, enums.ResponseViewSettings.CustomZoom);
        }
        setTimeout(function () {
            /** Updating page number indicator on zoom settings change.
             * Here timeout is applied so that the ui is rendered after applying zoom settings
             * and load page indicator based on those settings
             */
            responseActionCreator.updatePageNoIndicatorOnZoom();
        }, 500);
        this.doEnableKeyBoardHandlers(true);
    };

    /**
     * Response zoom has been updated
     * @param {number} zoomValue
     */
    private responseZoomUpdated(zoomValue: number): void {
        if (isNaN(zoomValue)) {
            this.setState({ zoomPercentage: '' });
        } else {
            zoomValue = zoomValue < 0 ? 1 : zoomValue;
            this.setState({ zoomPercentage: zoomValue.toString() });
        }
    }

    /**
     * Hides Zoom Panel while clicking On Page comment
     */
    private zoomPanelHide(): void {
        if (this.state.isZoomOptionOpen === true) {
            this.setState({
                isZoomOptionOpen: false,
                isZoomPercentageEditable: false
            });
        }
    }

    /**
     * Update the zoom preference string
     * @param {enums.ZoomPreference} updatedPreference
     * @returns
     */
    private getUpdatedZoomPreference(updatedPreference: enums.ZoomPreference): string {

        let zoomUserOption: string = userOptionHelper.getUserOptionByName
            (userOptionKeys.ZOOM_PREFERENCE, responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
                markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
                markerOperationModeFactory.operationMode.isAwardingMode
                    ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerRoleId
                    : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

        let userOption: any = {};
        let preference = updatedPreference.toString();
        if (responseHelper.isAtypicalResponse() && responseHelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {
            return zoomHelper.updateAtypicalZoomOption(zoomUserOption, updatedPreference, 0);
        }

        // For structured response we need to store the zoom preference for each markscheme if the user has been
        // changed the preference. Unstructured we dont need to map to markscheme.
        // Map the page id, if it has selected file in Ecoursework.
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
            || this.props.selectedECourseworkPageID > 0) {

            userOption = zoomHelper.getZoomUserOption(zoomUserOption);
            preference = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue,
                0,
                markingStore.instance.currentQuestionItemInfo.imageClusterId,
                updatedPreference,
                userOption.zoomHeader,
                this.props.selectedECourseworkPageID);
        }
        return preference;
    }

    /* handles zoom percentage click */
    private onZoomPercentageClick = (e: MouseEvent | TouchEvent): any => {
        if (!this.state.isZoomPercentageEditable) {
            this.setState({
                isZoomPercentageEditable: true,
                zoomPreference: enums.ZoomPreference.Percentage
            });
            // select the input element text while clicking the zoom percentage
            setTimeout(() => {
                // element.select() not working in iPad. to fix setSelectionRange is used
                let element: any = document.getElementById('zoom-label-input');
                let start: number = 0;
                let end: number = element.value.length;
                element.focus();
                element.setSelectionRange(start, end);
            }, 0);

            // deactivate the keydown for the mark entry textbox when the zoom percentage is in edit mode
            this.doEnableKeyBoardHandlers(false);
        }
    }

    /**
     * enables or disable handlers in keydown helper
     * @param enable
     */
    private doEnableKeyBoardHandlers(doEnable: boolean) {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.RESPONSE_NAVIGATION, doEnable);
    }

    /**
     * get zoom value
     * @param event
     */
    private getUserEnteredZoomValue(event: any) {
        let target: any = event.target || event.srcElement;
        let zoomValue: number = parseFloat(target.value);
        return zoomValue;
    }

    /* triggered on text change event for zoom percentage */
    private onZoomPercentageInput = (event: any): any => {
        this._currentUserZoomValue = this.getUserEnteredZoomValue(event);
        this.responseZoomUpdated(this._currentUserZoomValue);
    }

    /* key up event for zoom percentage */
    private onZoomPercentageKeyUp = (event: any): any => {
        this._currentUserZoomValue = this.getUserEnteredZoomValue(event);
        if (event && event.keyCode === enums.KeyCode.enter) {
            this.validateAndRoundOffZoomValue(this._currentUserZoomValue,
                enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
            this.setState({
                isZoomOptionOpen: false,
                isZoomPercentageEditable: false
            });
        }
    }

    /**
     * validate the zoom value
     * @param zoomValue
     * @param zoomType
     * @param responseViewSettings
     */
    private validateAndRoundOffZoomValue(zoomValue: number, zoomType: enums.ZoomType,
        responseViewSettings: enums.ResponseViewSettings) {

        // reactivate the keydown for the mark entry textbox when the zoom percentage edit is over
        this.doEnableKeyBoardHandlers(true);

        if (isNaN(zoomValue)) {
            // we will retain the current zoom if the user entered value is NaN
            this.responseZoomUpdated(responseStore.instance.currentZoomPercentage);
            return;
        }

        if (this._currentUserZoomValue !== -1) {
            zoomValue = this.roundOffZoomValue(zoomValue);
            this.setState({ zoomPreference: enums.ZoomPreference.Percentage });
            this.responseZoomUpdated(zoomValue);
            // return the function if there is no change in already applied zoom value
            if (responseStore.instance.currentZoomPercentage === zoomValue) {
                return;
            }
            zoomPanelActionCreator.initiateResponseImageZoom(zoomType, responseViewSettings, zoomValue);
            this._currentUserZoomValue = -1;
        }
    }

    /**
     * round zoom value to min or max zoom value
     * @param zoomValue
     */
    private roundOffZoomValue(zoomValue: number) {
        if (zoomValue < constants.MIN_ZOOM_PERCENTAGE) {
            zoomValue = constants.MIN_ZOOM_PERCENTAGE;
        } else if (zoomValue > constants.MAX_ZOOM_PERCENTAGE) {
            zoomValue = constants.MAX_ZOOM_PERCENTAGE;
        }
        return zoomValue;
    }

    /**
     * return examiner role id
     */
    private getExaminerRoleId() {
        return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !responseHelper.isAtypicalResponse()) ?
            markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
            markerOperationModeFactory.operationMode.isAwardingMode
                ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerRoleId
                : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
    }

    /**
     * triggered when zoom panel input blur event is triggered
     */
    private onZoomPercentageBlur = (e: MouseEvent | TouchEvent): any => {
        this.setState({ isZoomPercentageEditable: false });
    }
}

export = ZoomPanel;