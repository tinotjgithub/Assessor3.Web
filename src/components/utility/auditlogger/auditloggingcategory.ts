/**
 * Holds the logging type categories.
 */
module AuditLoggingCategory {
    export const SCREEN_NAVIGATION: string = 'Examiner navigated between screens';
    export const TAB_SWITCH: string = 'Tab switch';
    export const QIG_SELECTION: string = 'Qig selection';
    export const RESPONSE_ALLOCATION: string = 'Response allocation';
    export const SUBMIT_RESPONSE: string = 'Submit response';
    export const MARKING_STYLE: string = 'Marks and annotation save';
	export const TEAM_MANAGEMENT_TAB_SWITCH: string = 'Teammanagement Tab Switch';
	export const RESPONSE_SCREEN: string = 'Response screen changes';
    export const APPLICATION_OFFLINE: string = 'Application offline status';
    export const APPLICATION_ERROR: string = 'Application Error';
    export const GENERAL: string = 'General';
    export const MENU_ACTION: string = 'Menu Actions';
    export const CHANGE_RESPONSE_VIEW_MODE: string = 'Change response view mode';
}

export = AuditLoggingCategory;