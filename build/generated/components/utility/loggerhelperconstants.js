"use strict";
var loggerHelperConstants;
(function (loggerHelperConstants) {
    /**
     * Indicate mark entry value has changed.
     */
    loggerHelperConstants.MARKENTRY_REASON_TEXT_CHANGED = 'MARKENTRY-REASON-Text box value updated';
    /**
     * Indicate mark entry text box value is an invalid mark.
     */
    loggerHelperConstants.MARKENTRY_TEXT_CHANGED_REASON_RESET = 'MARKENTRY-REASON-markschemepanel- Marker resetting assigned mark ';
    /**
     * Indicate annotations has been deleted through reset.
     */
    loggerHelperConstants.MARKENTRY_REASON_ANNOTATION_CHANGED = 'MARKENTRY-REASON- User has modified annotation ';
    /**
     *  Save marks and annotation
     */
    loggerHelperConstants.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION = 'MARKENTRY-REASON-Save mark and annotation.';
    /**
     *  reason for changes marker has changed marking mode
     */
    loggerHelperConstants.MARKENTRY_REASON_MARKING_MODE_CHANGED = 'MARKENTRY-REASON- Response marking mode has been changed by the user';
    /**
     *  reason for marker has changed the comment side view state
     */
    loggerHelperConstants.MARKENTRY_REASON_COMMENT_SIDE_VIEW_CHANGED = 'MARKENTRY-REASON- Marker has changed the side view status';
    /**
     *  reason for response screen changes
     */
    loggerHelperConstants.NAVIGATION_REASON_RESPONSE_CHANGES = 'NAVIGATION-REASON- response screen changes';
    /**
     *  reason for response screen changes
     */
    loggerHelperConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION = 'TEAMMANAGEMENt-REASON- Supervious took action on';
    /**
     *  reason for response screen changes
     */
    loggerHelperConstants.RESPONSESCREEN_REASON_RESPONSE_SCREEN_ACTION = 'TEAMMANAGEMENT-REASON- Marker actions in response screen';
    /**
     *  Application offline status has been changed.
     */
    loggerHelperConstants.APPLICATIONOFFLINE_REASON_NETWORKSTATUS_CHANGED = 'APPLICATION OFFLINE - REASON - Application network status has changed';
    /**
     * NR has applied to MBA question item.
     */
    loggerHelperConstants.MARKENTRY_TYPE_APPLIED_NR = 'MARKENTRY-TYPE- User has provided NR for the question item';
    /**
     * Indicate numeric valued annotations has been removed.
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION__REMOVED = 'MARKENTRY-TYPE- User has added new annotation removed';
    /**
     * Indicate numeric valued annotations has been added.
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_ADDED = 'MARKENTRY-TYPE- User has added new annotation';
    /**
     * Indicate annotations has been deleted through reset.
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_RESET = 'MARKENTRY-TYPE- User has removed annotation by resetting.';
    /**
     * Indicate mark entry text box value is an invalid mark.
     */
    loggerHelperConstants.MARKENTRY_TYPE_INVALIDMARK = 'MARKENTRY-TYPE- Invalid mark has been entered by the user ';
    /**
     * Indicate mark entry text box value has been deleted using keyboard.
     */
    loggerHelperConstants.MARKENTRY_TYPE_MARK_DELETED = 'MARKENTRY-TYPE- Current mark has been deleted';
    /**
     * Indicate mark entry action type caused the change in textbox
     */
    loggerHelperConstants.MARKENTRY_ACTION_TYPE_TEXTCHANGED = 'MARKENTRY-TYPE- Mark entry text box value has been changed to';
    /**
     * Indicate mark has resetted
     */
    loggerHelperConstants.MARKENTRY_ACTION_TYPE_RESET = 'MARKENTRY-TYPE- Resetting mark';
    /**
     * Mark all unmarked markschemes to NR as assigned mark.
     */
    loggerHelperConstants.MARKENTRY_ACTION_TYPE_COMPLETE_NR = 'MARKENTRY-TYPE- Marker has applied NR for all unmarked questions.';
    /**
     * Assign new mark to markscheme using mark button.
     */
    loggerHelperConstants.MARKENTRY_ACTION_TYPE_MARK_BUTTON_ASSIGN = 'MARKENTRY-TYPE- Marker has clicked mark button to assign newmark';
    /**
     * Save mark.
     */
    loggerHelperConstants.MARKENTRY_ACTION_TYPE_SAVE_MARK = 'MARKENTRY-TYPE- Saving marks to the queue';
    /**
     *  reason for changes in annotation (added/removed)
     */
    loggerHelperConstants.MARKENTRY_REASON_ANNOTATION_ADD = 'MARKENTRY-TYPE- Marker added new annotation to the response';
    /**
     *  reason for changes in annotation (added/removed) seen annotation using page option
     */
    loggerHelperConstants.MARKENTRY_REASON_ANNOTATION_ADD_SEEN = 'MARKENTRY-TYPE- Added SEEN annotation from fullresponse view';
    /**
     *  reason for changes in annotation (added/removed) copy mark and annoataion.
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_ADD_COPYMARK = 'MARKENTRY-TYPE- Copied previous mark to the new response mark collection';
    /**
     *  Type for changes in annotation (added/removed) copy mark and annoataion.
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_ADD_LINK_ANNOTATION = 'MARKENTRY-TYPE- Added link annotation';
    /**
     *  type for changes in annotation (added/removed) copy mark and annoataion.
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_REMOVED_LINK_ANNOTATION = 'MARKENTRY-TYPE- Link annotation has been removed';
    /**
     *  Type for changes in annotation removed
     */
    loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_REMOVED = 'MARKENTRY-TYPE- Annotation has been removed by the marker';
    /**
     *  type for changes in annotation removed
     */
    loggerHelperConstants.MARKENTRY_TYPE_MARKING_MODE_CHANGED = 'MARKENTRY-TYPE- Marking response mode has been changed by the marker';
    /**
     *  reason for marker has changed the comment side view state
     */
    loggerHelperConstants.MARKENTRY_TYPE_COMMENT_SIDE_VIEW_CHANGED = 'MARKENTRY-TYPE-  Marker has changed the comment side view visibility';
    /**
     *  type for saving marks and annotations to the db.
     */
    loggerHelperConstants.MARKENTRY_TYPE_SAVE_MARK_ANNOTATION_DB = 'MARKENTRY-TYPE-  Marks and annotataion are saving to DB';
    /**
     *  type for opening a response
     */
    loggerHelperConstants.NAVIGATION_TYPE_REPONSE_OPEN = 'MARKENTRY-TYPE- Marker opened a response of, ';
    /**
     *  type for teammanagement superviour changed suboordinates approval status
     */
    loggerHelperConstants.TEAMMANAGEMENT_TYPE_SUBOORDINATES_STATUS_CHANGED_ACTION = 'TEAMMANAGEMENT-TYPE- Supervisor has changed the apporval status of';
    /**
     *  type for teammanagement supervisor provided secondstd to subordinate.
     */
    loggerHelperConstants.TEAMMANAGEMENT_TYPE_SECONDSTANDARDISATION = 'TEAMMANAGEMENT-TYPE- Supervisor has provided second std to subordinate';
    /**
     *  type for teammanagement supervisor has set sep.
     */
    loggerHelperConstants.TEAMMANAGEMENT_TYPE_SEP_MANAGEMENT = 'TEAMMANAGEMENT-TYPE- Supervisor has set approval management';
    /**
     *  type for teammanagement has given sampling
     */
    loggerHelperConstants.TEAMMANAGEMENT_TYPE_SUPERVISOR_SAMPLING = 'TEAMMANAGEMENT-TYPE- Supervisor has provided sampling';
    /**
     *  type marker has rejected rig
     */
    loggerHelperConstants.RESPONSESCREEN_TYPE_REJECT_RIG = 'RESPONSESCREEN-TYPE- Marker rejected rig ';
    /**
     *  type marker has promoted response as seed.
     */
    loggerHelperConstants.RESPONSESCREEN_TYPE_PROMOTE_TO_SEED = 'RESPONSESCREEN-TYPE- Marker has promoted response as seed ';
    /**
     *  type marker has creating supervisor remark
     */
    loggerHelperConstants.RESPONSESCREEN_TYPE_CREATE_SUPERVISOR_REMARK = 'RESPONSESCREEN-TYPE- Marker has created supervisor remark ';
    /**
     *  Application offline status has been changed.
     */
    loggerHelperConstants.APPLICATIONOFFLINE_TYPE_NETWORKSTATUS_CHANGED = 'APPLICATIONOFFLINE-TYPE- Application offline - type - Application network status has changed to';
    /**
     * type for examiner navigated to menu screen.
     */
    loggerHelperConstants.NAVIGATION_REASON_MENU_CLICK = 'NAVIGATION-REASON- Marker clicked Menu button';
    /**
     * type for examiner navigated from menu screen.
     */
    loggerHelperConstants.NAVIGATION_REASON_MENU_CLOSE_CLICK = 'NAVIGATION-REASON- Marker clicked Menu Close button';
    /**
     * reason for menu screen navigation
     */
    loggerHelperConstants.NAVIGATION_REASON_MENU_SCREEN = 'NAVIGATION-REASON- Menu navigation';
})(loggerHelperConstants || (loggerHelperConstants = {}));
module.exports = loggerHelperConstants;
//# sourceMappingURL=loggerhelperconstants.js.map