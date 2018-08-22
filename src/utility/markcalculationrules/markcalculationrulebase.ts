import markCalculationRuleSchema = require('./markcalculationruleschema');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import loggingHelper = require('../../components/utility/marking/markingauditlogginghelper');
import loggerHelperConstant = require('../../components/utility/loggerhelperconstants');

abstract class MarkCalculationRuleBase {

	/**
	 * CalculateMaximumAndTotalMark
	 */
	public abstract calculateMaximumAndTotalMark(treeItem: treeViewItem, currentBIndex?: number,
		marksManagementHelper?: MarksAndAnnotationsManagementBase, optionalItems?: Array<OptionalityDictionary>): void;


	/**
	 * Log saving marks action.
	 * @param isMarkUpdatedWithoutNavigation
	 * @param isNextResponse
	 * @param isUpdateUsedInTotalOnly
	 * @param isUpdateMarkingProgress
	 * @param markDetails
	 */
	protected logSaveMarksAction(
		isMarkUpdatedWithoutNavigation: boolean,
		isNextResponse: boolean,
		isUpdateUsedInTotalOnly: boolean,
		isUpdateMarkingProgress: boolean,
		markDetails: any): void {

		let logger: loggingHelper = new loggingHelper();
		logger.logMarkSaveAction(loggerHelperConstant.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION,
			loggerHelperConstant.MARKENTRY_ACTION_TYPE_SAVE_MARK,
			isMarkUpdatedWithoutNavigation,
			isNextResponse,
			isUpdateUsedInTotalOnly,
			isUpdateMarkingProgress,
			markDetails);
	}
}
export = MarkCalculationRuleBase;