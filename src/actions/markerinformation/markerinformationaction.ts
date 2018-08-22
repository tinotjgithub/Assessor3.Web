import markerInformation = require('../../stores/markerinformation/typings/markerinformation');
import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * The class holds user profile information.
 * @param {boolean} success
 */
class MarkerInformationAction extends dataRetrievalAction {

    // User's profile info argument.
    private markerInfo: markerInformation;

    /**
     * Initializing a new instance of marker information action.
     * @param {boolean} success
     */
    constructor(success: boolean, profileInfo: markerInformation) {
        super(action.Source.View, actionType.MARKERINFO, success);
        this.markerInfo = profileInfo;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    /**
     * Gets the marker's profile information.
     * @returns The profile information.
     */
    public get markerInformation(): markerInformation {
        return this.markerInfo;
    }
}
export = MarkerInformationAction;