import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for enhanced off-page comment sort operation
 * @class EnhancedOffPageCommentSortAction
 * @extends {action}
 */
class EnhancedOffPageCommentSortAction extends action {

    private _sortDetails: EnhancedOffPageCommentSortDetails;

   /**
    * Creates an instance of EnhancedOffPageCommentSortAction.
    * @param {EnhancedOffPageCommentSortDetails} sortDetails 
    * @memberof EnhancedOffPageCommentSortAction
    */
    constructor(sortDetails: EnhancedOffPageCommentSortDetails) {
      super(action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENT_SORT_ACTION);
      this._sortDetails = sortDetails;
    }

   /**
    * Returns sort details
    * @readonly
    * @type {EnhancedOffPageCommentSortDetails}
    * @memberof EnhancedOffPageCommentSortAction
    */
    public get sortDetails(): EnhancedOffPageCommentSortDetails {
      return this._sortDetails;
    }

}

export = EnhancedOffPageCommentSortAction;
