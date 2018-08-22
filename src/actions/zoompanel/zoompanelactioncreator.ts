import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import rotateAction = require('./rotateresponseaction');
import fitAction = require('./fitresponseaction');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import setFracsDataForZoomAction = require('./setfracsdataforzoomaction');
import customZoomAction = require('../zoom/customzoomaction');
import zoomUpdatedAction = require('../zoom/zoomupdatedaction');
import hideZoomPanelAction = require('../zoompanel/hidezoompanelaction');
import zoomOptionClickedAction = require('../zoom/zoomoptionclickedaction');
import pinchZoomAction = require('../zoom/pinchzoomaction');
import responsePinchZoomAction = require('./responsepinchzoomaction');
import responsepinchzoomcompletedaction = require('./responsepinchzoomcompletedaction');
import zoomAnimationEndAction = require('../zoom/zoomanimationendaction');
import rotationCompletedAction = require('../zoom/rotationcompletedaction');

/**
 * Class for creating Zoom Panel Action Creator
 */
class ZoomPanelActionCreator {

    /**
     * This method will be called when the Zoom Panel Actions are being selected
     * @param responseViewSettings
     * @param zoomType
     */
    public HandleZoomPanelActions(responseViewSettings: enums.ResponseViewSettings, zoomType?: enums.ZoomType) {
        switch (responseViewSettings) {
            case (enums.ResponseViewSettings.RotateClockwise):
            case (enums.ResponseViewSettings.RotateAntiClockwise):
                new Promise.Promise(function (resolve: any, reject: any) {
                    resolve();
                }).then(() => {
                    dispatcher.dispatch(new rotateAction(responseViewSettings, actionType.ROTATE_RESPONSE));
                }).catch();
                break;
            case (enums.ResponseViewSettings.FitToWidth):
            case (enums.ResponseViewSettings.FitToHeight):
            case (enums.ResponseViewSettings.CustomZoom):
                new Promise.Promise(function (resolve: any, reject: any) {
                    resolve();
                }).then(() => {
                    dispatcher.dispatch(new fitAction(responseViewSettings, actionType.FIT_RESPONSE, zoomType));
                }).catch();
                break;
        }
    }

    /**
     * Set fracs data for finding the active response for zoom
     * @param responseViewSettings
     */
    public SetFracsDataForZoom(responseViewSettings: enums.ResponseViewSettings) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setFracsDataForZoomAction(responseViewSettings, actionType.SET_FRACS_DATA_FOR_ZOOM));
        }).catch();
    }

    /**
     * Publishing event to let the concerned view to trigger the zoom
     * @param {enums.ZoomType} customZoomType
     * @param {enums.ResponseViewSettings} switchTo
     * @param userZoomValue
     */
    public initiateResponseImageZoom(customZoomType: enums.ZoomType, switchTo: enums.ResponseViewSettings,
        userZoomValue?: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new customZoomAction(customZoomType, switchTo, userZoomValue));
        });
    }

    /**
     * Updated response zoom
     * @param {number} zoomValue
     */
    public responseZoomUpdated(zoomValue: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new zoomUpdatedAction(zoomValue));
        });
    }

    /**
     * Hide Zoom Panel while pinch start
     */
    public hideZoomPanel(): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new hideZoomPanelAction());
        });
    }

    /**
     * Zoom panel is opened or closed
     */
    public zoomOptionClicked(isZoomOptionOpen: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new zoomOptionClickedAction(isZoomOptionOpen));
        });
    }

    /**
     * action for setting pinch zoom enabled or not
     */
    public isPinchZooming(isPinchZooming: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new pinchZoomAction(isPinchZooming));
        });
    }

    /**
     * Setting the current marksheet container width as current width and remove FIT HEIGHT/WIDTH style to
     * start pinch to Zoom.
     * This should trigger only for response
     * @param {number} marksheetHolderWidth
     */
    public prepareResponseImagePinchToZoom(marksheetHolderWidth: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responsePinchZoomAction(marksheetHolderWidth));
        });
    }

    /**
     * Remove the updated width if the response is zoomed from FITWIDTH/HEIGHT
     * @param {number} zoomedWidth
     */
    public responsePinchZoomCompleted(zoomedWidth: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responsepinchzoomcompletedaction(zoomedWidth));
        });
    }

    /**
     * To trigger the info event that zoom animation ended.
     */
    public zoomAnimationEnd(doReRender: boolean = false): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new zoomAnimationEndAction(doReRender));
        });
    }

    /**
     * Trigger on completing the rotation of image
     */
    public rotationCompletedAction() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new rotationCompletedAction());
        });
    }
}

let zoomPanelActionCreator = new ZoomPanelActionCreator();
export = zoomPanelActionCreator;

