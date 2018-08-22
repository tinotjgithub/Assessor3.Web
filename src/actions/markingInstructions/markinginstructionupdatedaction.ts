import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class MarkingInstructionUpdatedAction extends action {

    private _documentId: number;
    private _readStatus: boolean;

 /**
  * Constructor of MarkingInstructionUpdatedAction
  * @param success
  * @param documentId
  * @param readStatus
  */
  constructor(documentId: number, readStatus: boolean) {
    super(action.Source.View, actionType.MARKING_INSTRUCTION_UPDATED_ACTION);
    this._documentId = documentId;
    this._readStatus = readStatus;
    this.auditLog.logContent = this.auditLog.logContent.
        replace(/{ documentId}/g, documentId.toString());
  }

 /**
  * Retrieves document Id of marking instruction file.
  */
  public get documentId(): number {
     return this._documentId;
  }

 /**
  * Retrieves markinginstructions data
  */
  public get readStatus(): boolean {
     return this._readStatus;
  }
}
export = MarkingInstructionUpdatedAction;
