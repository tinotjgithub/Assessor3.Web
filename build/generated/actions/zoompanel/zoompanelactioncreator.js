"use strict";
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var rotateAction = require('./rotateresponseaction');
var fitAction = require('./fitresponseaction');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var setFracsDataForZoomAction = require('./setfracsdataforzoomaction');
var customZoomAction = require('../zoom/customzoomaction');
var zoomUpdatedAction = require('../zoom/zoomupdatedaction');
var hideZoomPanelAction = require('../zoompanel/hidezoompanelaction');
var zoomOptionClickedAction = require('../zoom/zoomoptionclickedaction');
var pinchZoomAction = require('../zoom/pinchzoomaction');
var responsePinchZoomAction = require('./responsepinchzoomaction');
var responsepinchzoomcompletedaction = require('./responsepinchzoomcompletedaction');
var zoomAnimationEndAction = require('../zoom/zoomanimationendaction');
var rotationCompletedAction = require('../zoom/rotationcompletedaction');
/**
 * Class for creating Zoom Panel Action Creator
 */
var ZoomPanelActionCreator = (function () {
    function ZoomPanelActionCreator() {
    }
    /**
     * This method will be called when the Zoom Panel Actions are being selected
     * @param responseViewSettings
     * @param zoomType
     */
    ZoomPanelActionCreator.prototype.HandleZoomPanelActions = function (responseViewSettings, zoomType) {
        switch (responseViewSettings) {
            case (enums.ResponseViewSettings.RotateClockwise):
            case (enums.ResponseViewSettings.RotateAntiClockwise):
                new Promise.Promise(function (resolve, reject) {
                    resolve();
                }).then(function () {
                    dispatcher.dispatch(new rotateAction(responseViewSettings, actionType.ROTATE_RESPONSE));
                }).catch();
                break;
            case (enums.ResponseViewSettings.FitToWidth):
            case (enums.ResponseViewSettings.FitToHeight):
            case (enums.ResponseViewSettings.CustomZoom):
                new Promise.Promise(function (resolve, reject) {
                    resolve();
                }).then(function () {
                    dispatcher.dispatch(new fitAction(responseViewSettings, actionType.FIT_RESPONSE, zoomType));
                }).catch();
                break;
        }
    };
    /**
     * Set fracs data for finding the active response for zoom
     * @param responseViewSettings
     */
    ZoomPanelActionCreator.prototype.SetFracsDataForZoom = function (responseViewSettings) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setFracsDataForZoomAction(responseViewSettings, actionType.SET_FRACS_DATA_FOR_ZOOM));
        }).catch();
    };
    /**
     * Publishing event to let the concerned view to trigger the zoom
     * @param {enums.ZoomType} customZoomType
     * @param {enums.ResponseViewSettings} switchTo
     * @param userZoomValue
     */
    ZoomPanelActionCreator.prototype.initiateResponseImageZoom = function (customZoomType, switchTo, userZoomValue) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new customZoomAction(customZoomType, switchTo, userZoomValue));
        });
    };
    /**
     * Updated response zoom
     * @param {number} zoomValue
     */
    ZoomPanelActionCreator.prototype.responseZoomUpdated = function (zoomValue) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new zoomUpdatedAction(zoomValue));
        });
    };
    /**
     * Hide Zoom Panel while pinch start
     */
    ZoomPanelActionCreator.prototype.hideZoomPanel = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new hideZoomPanelAction());
        });
    };
    /**
     * Zoom panel is opened or closed
     */
    ZoomPanelActionCreator.prototype.zoomOptionClicked = function (isZoomOptionOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new zoomOptionClickedAction(isZoomOptionOpen));
        });
    };
    /**
     * action for setting pinch zoom enabled or not
     */
    ZoomPanelActionCreator.prototype.isPinchZooming = function (isPinchZooming) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new pinchZoomAction(isPinchZooming));
        });
    };
    /**
     * Setting the current marksheet container width as current width and remove FIT HEIGHT/WIDTH style to
     * start pinch to Zoom.
     * This should trigger only for response
     * @param {number} marksheetHolderWidth
     */
    ZoomPanelActionCreator.prototype.prepareResponseImagePinchToZoom = function (marksheetHolderWidth) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responsePinchZoomAction(marksheetHolderWidth));
        });
    };
    /**
     * Remove the updated width if the response is zoomed from FITWIDTH/HEIGHT
     * @param {number} zoomedWidth
     */
    ZoomPanelActionCreator.prototype.responsePinchZoomCompleted = function (zoomedWidth) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responsepinchzoomcompletedaction(zoomedWidth));
        });
    };
    /**
     * To trigger the info event that zoom animation ended.
     */
    ZoomPanelActionCreator.prototype.zoomAnimationEnd = function (doReRender) {
        if (doReRender === void 0) { doReRender = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new zoomAnimationEndAction(doReRender));
        });
    };
    /**
     * Trigger on completing the rotation of image
     */
    ZoomPanelActionCreator.prototype.rotationCompletedAction = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new rotationCompletedAction());
        });
    };
    return ZoomPanelActionCreator;
}());
var zoomPanelActionCreator = new ZoomPanelActionCreator();
module.exports = zoomPanelActionCreator;
//# sourceMappingURL=zoompanelactioncreator.js.map