import loggerBase = require('../../base/loggerbase');
import logCategory = require('../auditlogger/auditloggingcategory');

class MarkingAuditLoggingHelper extends loggerBase {

	/**
	 * Constructor
	 */
	constructor() {
		super(logCategory.MARKING_STYLE);
	}

	/**
	 * Log marking activity
	 * @param keyUsage
	 * @param markButtonUsage
	 * @param responseId
	 */
	public logActiveMarkingActionCount(keyUsage: number, markButtonUsage: number, responseId: string): void {
        this.logHelper.logEventOnMarking(keyUsage, markButtonUsage, responseId);
	}

	/**
	 * Log all mark entry actions.
	 * @param reason
	 * @param activity
	 * @param markGroupId
	 * @param oldMark
	 * @param newMark
	 * @param markSchemeId
	 * @param isNonNumeric
	 * @param isMBQ
	 */
	public logMarkEntryAction(reason: string,
		activity: string,
		markGroupId: number,
		oldMark: string,
		newMark: string,
		markSchemeId: number,
		isNonNumeric: boolean,
		isMBQ: boolean): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'MarkGroupId': markGroupId,
			'OldMark': oldMark,
			'NewMark': newMark,
			'MarkSchemeId': markSchemeId,
			'IsNonNumeric': isNonNumeric,
			'IsMBQ': isMBQ
		};

		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, false);
	}

	/**
	 * Log annotation update actions based on the reset and assigining mark using MBA.
	 * @param reason
	 * @param activity
	 * @param markGroupId
	 * @param markSchemeId
	 * @param isNonNumeric
	 * @param isMBQ
	 * @param annotationCount
	 */
	public logMarkEntryAnnotationUpateAction(reason: string,
		activity: string,
		markGroupId: number,
		markSchemeId: number,
		isNonNumeric: boolean,
		isMBQ: boolean,
		annotationCount: number) {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'MarkGroupId': markGroupId,
			'MarkSchemeId': markSchemeId,
			'IsNonNumeric': isNonNumeric,
			'IsMBQ': isMBQ,
			'annotationCount': annotationCount
		};

		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, false);
	}

	/**
	 * Log mark saving actions.
	 * @param isMarkUpdatedWithoutNavigation
	 * @param isNextResponse
	 * @param isUpdateUsedInTotalOnly
	 * @param isUpdateMarkingProgress
	 * @param markDetails
	 */
	public logMarkSaveAction(reason: string,
		activity: string,
		isMarkUpdatedWithoutNavigation: boolean,
		isNextResponse: boolean,
		isUpdateUsedInTotalOnly: boolean,
		isUpdateMarkingProgress: boolean,
		markDetails: any) {

		let result = this.formatInputAction(reason,
			activity,
			isMarkUpdatedWithoutNavigation,
			isNextResponse,
			isUpdateUsedInTotalOnly,
			isUpdateMarkingProgress,
			markDetails);
		this.saveAuditLog(result, false);
	}

	/**
	 * Log annotation modified action details.
	 * @param reason
	 * @param activity
	 * @param annotation
	 * @param markGroupId
	 * @param markSchemeId
	 */
	public logAnnotationModifiedAction(reason: string,
		activity: string,
		annotation: any,
		markGroupId: number,
		markSchemeId: number): void {
		let result = this.formatInputAction(reason,
			activity,
			annotation,
			markGroupId,
			markSchemeId);
		this.saveAuditLog(result, false);
	}

	/**
	 * Log users current log status is mbq or mbc
	 * @param reason
	 * @param activity
	 * @param isMBQSelected
	 */
	public logMBQChangeAction(reason: string,
		activity: string,
		isMBQSelected: boolean): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'IsMBQSelected': isMBQSelected
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, false);
	}

	/**
	 * Log comment side view state changes made by marker
	 * @param reason
	 * @param activity
	 * @param commentsideviewEnabled
	 */
	public logCommentSideViewStateChanges(reason: string,
		activity: string,
		commentsideviewEnabled: boolean,
		markGroupId: number): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'CommentSideViewEnabled': commentsideviewEnabled,
			'MarkGroupId': markGroupId
		};

		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, false);
	}

	/**
	 * Log save marks and annoataion actions.
	 * @param reason
	 * @param activity
	 * @param isBackGround
	 * @param isApplicationOnline
	 * @param priority
	 * @param saveTriggerPoint
	 * @param saveMarkArg
	 */
	public logSaveMarksAndAnnoatation(reason: string,
		activity: string,
		isBackGround: boolean,
		isApplicationOnline: boolean,
		priority: number,
		saveTriggerPoint: number,
		saveMarkArg: any): void {

		let logActionObj = {
			'Reason': reason,
			'Activity': activity,
			'isBackGround': isBackGround,
			'isApplicationOnline': isApplicationOnline,
			'priority': priority,
			'saveTriggerPoint': saveTriggerPoint,
			'saveMarkArg': saveMarkArg
		};
		let result = this.formatInputAction(logActionObj);
		this.saveAuditLog(result, false);
	}
}

export = MarkingAuditLoggingHelper;
