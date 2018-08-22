import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import qigInfo = require('../../stores/useroption/typings/rememberqig');

/**
 * Class for updating remember qig details
 */
class SetRememberQigAction extends action {

private _rememberQig: any;

    /**
     * Constructor setRememberQigAction
     * @param {rememberQig} qigInfo
     */
    constructor(rememberQig: qigInfo) {
        super(action.Source.View, actionType.SET_REMEMBER_QIG);
        this._rememberQig = rememberQig;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{qigId}/g, rememberQig.qigId.toString());
  }

  /**
   * for returning remember qig details.
   * @returns
   */
    public get rememberQig(): qigInfo {
     return this._rememberQig;
  }

}

export = SetRememberQigAction;
