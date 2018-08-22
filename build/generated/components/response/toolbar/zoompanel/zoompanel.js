"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var domManager = require('../../../../utility/generic/domhelper');
var RotateClockWise = require('./rotateclockwise');
var RotateAntiClockWise = require('./rotateanticlockwise');
var FitWidth = require('./fitwidth');
var FitHeight = require('./fitheight');
var zoomPanelActionCreator = require('../../../../actions/zoompanel/zoompanelactioncreator');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var enums = require('../../../utility/enums');
var responseActionCreator = require('../../../../actions/response/responseactioncreator');
var userOptionHelper = require('../../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
var qigStore = require('../../../../stores/qigselector/qigstore');
var responseStore = require('../../../../stores/response/responsestore');
var stampStore = require('../../../../stores/stamp/stampstore');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
var markingStore = require('../../../../stores/marking/markingstore');
var zoomHelper = require('../../responsescreen/zoomhelper/zoomhelper');
var responseHelper = require('../../../utility/responsehelper/responsehelper');
var constants = require('../../../utility/constants');
var classNames = require('classnames');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var modulekeys = require('../../../../utility/generic/modulekeys');
/** Component for Zoom in and out */
/* tslint:disable:variable-name */
var ZoomInOut = function (props) { return (React.createElement("a", {href: 'javascript:void(0)', id: props.id, title: props.title, className: props.style, onClick: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var zoomType = props.sign === '+' ? enums.ZoomType.CustomZoomIn : enums.ZoomType.CustomZoomOut;
    props.triggerZoom(zoomType);
}}, props.sign)); };
/** Component for zoom percentage */
/* tslint:disable:variable-name */
var ZoomPercentage = function (props) { return (React.createElement("div", {title: props.title, id: props.id, className: 'border-button zoom-level' + (props.isEditable ? ' edit' : ''), onClick: function (e) {
    e.preventDefault();
    e.stopPropagation();
    props.onClick();
}}, React.createElement("input", {type: 'text', value: props.zoomPercent, "aria-label": props.title, className: 'zoom-leavel-input', id: 'zoom-label-input', onKeyUp: function (e) {
    props.onZoomPercentageKeyUp(e);
}, onInput: function (e) {
    props.onZoomPercentageInput(e);
}}), React.createElement("span", {className: 'zoom-label'}, props.zoomPercent + '%'))); };
/**
 * ZoomOption class
 * @param {any} any
 * @param {any} any
 * @returns
 */
var ZoomPanel = (function (_super) {
    __extends(ZoomPanel, _super);
    /**
     * Constructor for Zoompanel
     * @param props
     * @param state
     */
    function ZoomPanel(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._boundHandleOnClick = null;
        this._switchFitOption = null;
        this._openCloseZoomOption = null;
        this._currentUserZoomValue = -1;
        /**
         * Handle click events outside the zoom settings
         * @param {any} e - The source element
         */
        this.handleClickOutsideElement = function (e) {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'zoompanel'; }) == null) {
                if (_this.state.isZoomOptionOpen === true) {
                    _this.setState({
                        isZoomOptionOpen: false,
                        isZoomPercentageEditable: false
                    });
                    _this.validateAndRoundOffZoomValue(_this._currentUserZoomValue, enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
                }
            }
            // both touchend and click event is fired one after other, 
            // this avoid resetting store in touchend
            if (e.type !== 'touchend') {
                zoomPanelActionCreator.zoomOptionClicked(_this.state.isZoomOptionOpen);
            }
            _this.setZoomPreference();
        };
        /**
         * Finds the current user option for FitHeight and FitWidth
         */
        this.setZoomPreference = function () {
            // If Marker got withdrawn during the actions. Skip the activities.
            if (qigStore.instance.selectedQIGForMarkerOperation === undefined) {
                return;
            }
            var preference = _this.getZoomPreferenceFromUserOption();
            switch (preference.zoomPreference) {
                case enums.ZoomPreference.FitWidth:
                    _this.setState({ zoomPreference: enums.ZoomPreference.FitWidth });
                    break;
                case enums.ZoomPreference.FitHeight:
                    _this.setState({ zoomPreference: enums.ZoomPreference.FitHeight });
                    break;
                case enums.ZoomPreference.Percentage:
                    _this.setState({ zoomPreference: enums.ZoomPreference.Percentage });
                    break;
            }
        };
        /**
         * Gets the Zoom Preference from User Option
         */
        this.getZoomPreferenceFromUserOption = function () {
            var zoomPreference = enums.ZoomPreference.FitWidth;
            var zoomPercentage;
            var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, _this.getExaminerRoleId());
            var userOption = {};
            // If user has opened structured response, we have to get the zoom value of the current markscheme
            // or the default as FITWidth.
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                && markingStore.instance.currentQuestionItemInfo !== undefined ||
                _this.props.selectedECourseworkPageID > 0) {
                if (responseHelper.isAtypicalResponse()) {
                    userOption = zoomHelper.getAtypicalZoomOption(zoomUserOption);
                }
                else {
                    // Get the saved zoom percentage value
                    userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, markingStore.instance.currentQuestionItemInfo.imageClusterId, _this.props.selectedECourseworkPageID);
                }
            }
            else {
                userOption = zoomHelper.getZoomUserOption(zoomUserOption);
            }
            zoomPreference = userOption.zoomPreference;
            zoomPercentage = userOption.userOptionZoomValue;
            return { 'zoomPreference': zoomPreference, 'zoomPercentage': zoomPercentage };
        };
        /**
         * Triggering the zoom
         * @param {enums.ZoomType} zoomType
         */
        this.triggerZoom = function (zoomType) {
            // check if no custom zoom in entered by the user. if this._currentUserZoomValue !== -1 then it means user had entered
            // custom zoom then we have to go through validateAndRoundOffZoomValue() and apply custom zoom accordingly 
            if (_this._currentUserZoomValue === -1) {
                if (zoomType === enums.ZoomType.CustomZoomOut && parseInt(_this.state.zoomPercentage) === constants.MIN_ZOOM_PERCENTAGE) {
                    _this.setState({ isZoomPercentageEditable: false });
                    return;
                }
                else if (zoomType === enums.ZoomType.CustomZoomIn && parseInt(_this.state.zoomPercentage) === constants.MAX_ZOOM_PERCENTAGE) {
                    _this.setState({ isZoomPercentageEditable: false });
                    return;
                }
            }
            _this.setState({
                zoomPreference: enums.ZoomPreference.Percentage,
                isZoomPercentageEditable: false
            });
            /* we need to update user zoom value on clicking the + or - button if user enters any value
             * Eg : - if user enters a value in the custom zoom box and clicked + or - button then
             * the zoom value to update should be MIN_ZOOM_PERCENTAGE added or substracted to the user input
             */
            if (_this._currentUserZoomValue !== -1 && !isNaN(_this._currentUserZoomValue)) {
                if (zoomType === enums.ZoomType.CustomZoomIn) {
                    _this._currentUserZoomValue += constants.MIN_ZOOM_PERCENTAGE;
                }
                else if (zoomType === enums.ZoomType.CustomZoomOut) {
                    _this._currentUserZoomValue = _this.roundOffZoomValue(_this._currentUserZoomValue);
                    _this._currentUserZoomValue -= constants.MIN_ZOOM_PERCENTAGE;
                }
                _this.validateAndRoundOffZoomValue(_this._currentUserZoomValue, enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
            }
            else {
                zoomPanelActionCreator.initiateResponseImageZoom(zoomType, enums.ResponseViewSettings.CustomZoom);
            }
            setTimeout(function () {
                /** Updating page number indicator on zoom settings change.
                 * Here timeout is applied so that the ui is rendered after applying zoom settings
                 * and load page indicator based on those settings
                 */
                responseActionCreator.updatePageNoIndicatorOnZoom();
            }, 500);
            _this.doEnableKeyBoardHandlers(true);
        };
        /* handles zoom percentage click */
        this.onZoomPercentageClick = function (e) {
            if (!_this.state.isZoomPercentageEditable) {
                _this.setState({
                    isZoomPercentageEditable: true,
                    zoomPreference: enums.ZoomPreference.Percentage
                });
                // select the input element text while clicking the zoom percentage
                setTimeout(function () {
                    // element.select() not working in iPad. to fix setSelectionRange is used
                    var element = document.getElementById('zoom-label-input');
                    var start = 0;
                    var end = element.value.length;
                    element.focus();
                    element.setSelectionRange(start, end);
                }, 0);
                // deactivate the keydown for the mark entry textbox when the zoom percentage is in edit mode
                _this.doEnableKeyBoardHandlers(false);
            }
        };
        /* triggered on text change event for zoom percentage */
        this.onZoomPercentageInput = function (event) {
            _this._currentUserZoomValue = _this.getUserEnteredZoomValue(event);
            _this.responseZoomUpdated(_this._currentUserZoomValue);
        };
        /* key up event for zoom percentage */
        this.onZoomPercentageKeyUp = function (event) {
            _this._currentUserZoomValue = _this.getUserEnteredZoomValue(event);
            if (event && event.keyCode === enums.KeyCode.enter) {
                _this.validateAndRoundOffZoomValue(_this._currentUserZoomValue, enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
                _this.setState({
                    isZoomOptionOpen: false,
                    isZoomPercentageEditable: false
                });
            }
        };
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
    }
    /**
     * Open/Close the Zoom option
     * @param {any} source - The source element
     */
    ZoomPanel.prototype.openCloseZoomOption = function (e) {
        stampActionCreator.showOrHideComment(false);
        // Close Bookmark Name Entry Box
        stampActionCreator.showOrHideBookmarkNameBox(false);
        if (this.state.isZoomOptionOpen === false) {
            this.setState({ isZoomOptionOpen: true });
        }
        else {
            // set isZoomOptionOpen state to false only if not clicked on the zoom percentage
            if (e.target !== undefined &&
                domManager.searchParentNode(e.target, function (el) { return el.id === 'zoom-percentage'; }) == null) {
                this.setState({
                    isZoomOptionOpen: false,
                    isZoomPercentageEditable: false
                });
                this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
            }
        }
    };
    /**
     * Handle click events for switching the Fit Options
     * @param {string} fitType - The Fit Type as per user selection
     */
    ZoomPanel.prototype.switchFitOption = function (fitType) {
        if (fitType === this.state.zoomPreference) {
            return;
        }
        switch (fitType) {
            case (enums.ZoomPreference.FitHeight):
                if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {
                    userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, this.getUpdatedZoomPreference(enums.ZoomPreference.FitHeight), responseStore.instance.markingMethod !== enums.MarkingMethod.Structured, true, false, true, this.getExaminerRoleId());
                }
                zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, enums.ResponseViewSettings.FitToHeight);
                this.setState({
                    zoomPreference: enums.ZoomPreference.FitHeight,
                    isZoomPercentageEditable: false
                });
                break;
            case (enums.ZoomPreference.FitWidth):
                if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {
                    userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, this.getUpdatedZoomPreference(enums.ZoomPreference.FitWidth), responseStore.instance.markingMethod !== enums.MarkingMethod.Structured, true, false, true, this.getExaminerRoleId());
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
    };
    /**
     * Subscribe window click event
     */
    ZoomPanel.prototype.componentDidMount = function () {
        this._boundHandleOnClick = this.handleClickOutsideElement.bind(this);
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        stampStore.instance.addListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.zoomPanelHide);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.HIDE_ZOOM_PANEL, this.zoomPanelHide);
        stampStore.instance.addListener(stampStore.StampStore.SWITCH_ZOOM_PREFERENCE_EVENT, this.switchFitOption);
    };
    /**
     * Unsubscribe window click event
     */
    ZoomPanel.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.zoomPanelHide);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.HIDE_ZOOM_PANEL, this.zoomPanelHide);
        stampStore.instance.removeListener(stampStore.StampStore.SWITCH_ZOOM_PREFERENCE_EVENT, this.switchFitOption);
    };
    /**
     * Render component
     * @returns
     */
    ZoomPanel.prototype.render = function () {
        var svgStyle = {
            pointerEvents: 'none'
        };
        var ZoomPlus = ZoomInOut;
        var ZoomMinus = ZoomInOut;
        var zoom = localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom');
        var rotate = localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.rotate');
        var zoomPercentage = isNaN(parseFloat(this.state.zoomPercentage)) ? '' :
            Math.round(parseFloat(this.state.zoomPercentage)).toString();
        return (React.createElement("li", {id: this.props.id, className: classNames('mrk-zoom-icon dropdown-wrap', this.state.isZoomOptionOpen ? 'open' : ''), onClick: this._openCloseZoomOption}, React.createElement("a", {href: 'javascript:void(0)', className: 'menu-button', title: localeStore.instance.TranslateText('marking.response.left-toolbar.zoom-rotate-button-tooltip'), id: this.props.id}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'mag-glass-icon', style: svgStyle}, React.createElement("title", null, localeStore.instance.TranslateText('marking.response.left-toolbar.zoom-rotate-button-tooltip')), React.createElement("use", {xlinkHref: '#icon-mag-glass'}))), React.createElement("span", {className: 'sprite-icon toolexpand-icon'}, "Zoom Panel")), React.createElement("div", {className: 'tool-option-menu menu', id: 'zoom_tool_option_menu'}, React.createElement("div", {className: 'zoom-button-holder'}, React.createElement("div", {className: 'button-label'}, zoom), React.createElement("div", {className: 'border-button-holder'}, React.createElement("div", {className: 'fit-screen-holder'}, React.createElement(FitWidth, {title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-fit-width-tooltip'), name: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-fit-width'), active: this.state.zoomPreference === enums.ZoomPreference.FitWidth
            && !this.state.isZoomPercentageEditable
            ? 'fit-width-button fit-button border-button active'
            : 'fit-width-button fit-button border-button', switchFit: this._switchFitOption}), React.createElement(FitHeight, {title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-fit-height-tooltip'), name: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-fit-height'), active: this.state.zoomPreference === enums.ZoomPreference.FitHeight
            && !this.state.isZoomPercentageEditable
            ? 'fit-height-button fit-button border-button active'
            : 'fit-height-button fit-button border-button', switchFit: this._switchFitOption}))), React.createElement("div", {className: this.getCustomZoomClassName()}, React.createElement(ZoomMinus, {style: 'border-button decrease-zoom', id: 'zoom-out', key: 'key_zoom_out', title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-out-tooltip'), sign: '-', triggerZoom: this.triggerZoom.bind(this)}), React.createElement(ZoomPercentage, {key: 'key_zoom_per', id: 'zoom-percentage', title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-level-tooltip'), zoomPercent: zoomPercentage, onClick: this.onZoomPercentageClick, isEditable: this.state.isZoomPercentageEditable, onZoomPercentageInput: this.onZoomPercentageInput, onZoomPercentageKeyUp: this.onZoomPercentageKeyUp}), React.createElement(ZoomPlus, {style: 'border-button increase-zoom', id: 'zoom-in', key: 'key_zoom_in', title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.zoom-in-tooltip'), sign: '+', triggerZoom: this.triggerZoom.bind(this)}))), React.createElement("div", {className: 'rotate-button-holder'}, React.createElement("div", {className: 'button-label'}, rotate), React.createElement(RotateClockWise, {title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.rotate-clockwise-tooltip'), onRotateClockWise: this.onRotateClockWise}), React.createElement(RotateAntiClockWise, {title: localeStore.instance.TranslateText('marking.response.zoom-rotate-panel.rotate-anticlockwise-tooltip'), onRotateAntiClockWise: this.onRotateAntiClockWise})))));
    };
    /**
     * Retrieve the zoom class name
     * @returns
     */
    ZoomPanel.prototype.getCustomZoomClassName = function () {
        return classNames('enlarger border-button-holder', {
            'active': this.state.zoomPreference === enums.ZoomPreference.Percentage
                && this.state.isZoomPercentageEditable !== true
        });
    };
    /**
     * Rotate Clockwise click
     */
    ZoomPanel.prototype.onRotateClockWise = function (e) {
        this.setState({ isZoomPercentageEditable: false });
        this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
        zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.RotateClockwise);
        e.stopPropagation();
    };
    /**
     * Rotate Anti Clockwise click
     */
    ZoomPanel.prototype.onRotateAntiClockWise = function (e) {
        this.setState({ isZoomPercentageEditable: false });
        this.validateAndRoundOffZoomValue(this._currentUserZoomValue, enums.ZoomType.UserInput, enums.ResponseViewSettings.CustomZoom);
        zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.RotateAntiClockwise);
        e.stopPropagation();
    };
    /**
     * Response zoom has been updated
     * @param {number} zoomValue
     */
    ZoomPanel.prototype.responseZoomUpdated = function (zoomValue) {
        if (isNaN(zoomValue)) {
            this.setState({ zoomPercentage: '' });
        }
        else {
            zoomValue = zoomValue < 0 ? 1 : zoomValue;
            this.setState({ zoomPercentage: zoomValue.toString() });
        }
    };
    /**
     * Hides Zoom Panel while clicking On Page comment
     */
    ZoomPanel.prototype.zoomPanelHide = function () {
        if (this.state.isZoomOptionOpen === true) {
            this.setState({
                isZoomOptionOpen: false,
                isZoomPercentageEditable: false
            });
        }
    };
    /**
     * Update the zoom preference string
     * @param {enums.ZoomPreference} updatedPreference
     * @returns
     */
    ZoomPanel.prototype.getUpdatedZoomPreference = function (updatedPreference) {
        var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
            markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        var userOption = {};
        var preference = updatedPreference.toString();
        if (responseHelper.isAtypicalResponse() && responseHelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {
            return zoomHelper.updateAtypicalZoomOption(zoomUserOption, updatedPreference, 0);
        }
        // For structured response we need to store the zoom preference for each markscheme if the user has been
        // changed the preference. Unstructured we dont need to map to markscheme.
        // Map the page id, if it has selected file in Ecoursework.
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
            || this.props.selectedECourseworkPageID > 0) {
            userOption = zoomHelper.getZoomUserOption(zoomUserOption);
            preference = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue, 0, markingStore.instance.currentQuestionItemInfo.imageClusterId, updatedPreference, userOption.zoomHeader, this.props.selectedECourseworkPageID);
        }
        return preference;
    };
    /**
     * enables or disable handlers in keydown helper
     * @param enable
     */
    ZoomPanel.prototype.doEnableKeyBoardHandlers = function (doEnable) {
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_TEXT_ENTRY, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.MARKSCHEME_SCHEME_PANEL_SCROLL, doEnable);
        keyDownHelper.instance.resetActivateHandler(modulekeys.RESPONSE_NAVIGATION, doEnable);
    };
    /**
     * get zoom value
     * @param event
     */
    ZoomPanel.prototype.getUserEnteredZoomValue = function (event) {
        var target = event.target || event.srcElement;
        var zoomValue = parseFloat(target.value);
        return zoomValue;
    };
    /**
     * validate the zoom value
     * @param zoomValue
     * @param zoomType
     * @param responseViewSettings
     */
    ZoomPanel.prototype.validateAndRoundOffZoomValue = function (zoomValue, zoomType, responseViewSettings) {
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
    };
    /**
     * round zoom value to min or max zoom value
     * @param zoomValue
     */
    ZoomPanel.prototype.roundOffZoomValue = function (zoomValue) {
        if (zoomValue < constants.MIN_ZOOM_PERCENTAGE) {
            zoomValue = constants.MIN_ZOOM_PERCENTAGE;
        }
        else if (zoomValue > constants.MAX_ZOOM_PERCENTAGE) {
            zoomValue = constants.MAX_ZOOM_PERCENTAGE;
        }
        return zoomValue;
    };
    /**
     * return examiner role id
     */
    ZoomPanel.prototype.getExaminerRoleId = function () {
        return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !responseHelper.isAtypicalResponse()) ?
            markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
    };
    return ZoomPanel;
}(pureRenderComponent));
module.exports = ZoomPanel;
//# sourceMappingURL=zoompanel.js.map