import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('./../../components/utility/enums');

/**
 * action class for removing a response from store worklist collection
 * @class RemoveResponseAction
 * @extends {action}
 */
class RemoveResponseAction extends action {
  private _worklistType: enums.WorklistType;
  private _responseMode: enums.ResponseMode;
  private _displayId: string;

  /**
   * Creates an instance of RemoveResponseAction.
   * @param {enums.WorklistType} worklistType 
   * @param {enums.ResponseMode} responseMode 
   * @param {string} displayId 
   * 
   * @memberof RemoveResponseAction
   */
  constructor(worklistType: enums.WorklistType, responseMode: enums.ResponseMode, displayId: string) {
    super(action.Source.View, actionType.REMOVE_RESPONSE);
    this._worklistType = worklistType;
    this._responseMode = responseMode;
    this._displayId = displayId;
  }

  /**
   * Returns worklist type
   * @readonly
   * @type {enums.WorklistType}
   * @memberof RemoveResponseAction
   */
  public get worklistType(): enums.WorklistType {
    return this._worklistType;
  }

  /**
   * Returns response mode
   * @readonly
   * @type {enums.ResponseMode}
   * @memberof RemoveResponseAction
   */
  public get responseMode(): enums.ResponseMode {
    return this._responseMode;
  }

  /**
   * Returns displayId
   * @readonly
   * @type {string}
   * @memberof RemoveResponseAction
   */
  public get displayId(): string {
    return this._displayId;
  }

}

export = RemoveResponseAction;
