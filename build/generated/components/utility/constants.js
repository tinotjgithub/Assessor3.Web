"use strict";
/* List of global constants */
var constants;
(function (constants) {
    constants.NOT_MARKED = '-';
    constants.NOT_ATTEMPTED = 'NR';
    constants.NO_MARK = '';
    constants.MARK_CONFIRMATION_POPUP_ANIMATION_DELAY = '200';
    /* The total value of height of the header, top margins and the height of horizontal scroll bar
                  which has to be deducted from the viewport height for finding the marksheet holder height
            */
    //default width and height of the highlighter
    constants.DEFAULT_HIGHLIGHTER_HEIGHT = 30;
    constants.DEFAULT_HIGHLIGHTER_WIDTH = 60;
    //default width and height of the ellipse
    constants.DEFAULT_ELLIPSE_HEIGHT = 30;
    constants.DEFAULT_ELLIPSE_WIDTH = 60;
    //default width and height of the HLine
    constants.DEFAULT_HLINE_HEIGHT = 20;
    constants.DEFAULT_HLINE_WIDTH = 60;
    //default width and height of the VLine
    constants.DEFAULT_VLINE_HEIGHT = 60;
    constants.DEFAULT_VLINE_WIDTH = 20;
    //default width and height of static annotations
    constants.DEFAULT_STATIC_ANNOTATION_HEIGHT = 32;
    constants.DEFAULT_STATIC_ANNOTATION_WIDTH = 32;
    // Scroll Speed while scrolling.
    constants.SCROLL_SPEED = 30;
    //Constant height tolerance to reduce while in Fit-Height
    constants.HEIGHT_TOLERANCE = 60;
    constants.DEVICE_SCREEN_HEIGHT = 1024;
    //A constant padding is given for the  marksheet container in css.This needs to be adjusted to set scroll position
    constants.RESPONSE_CONTAINER_PADDING = 5;
    constants.NONBREAKING_HYPHEN_UNICODE = '\u2011';
    constants.NONBREAKING_WHITE_SPACE = '\u00a0';
    constants.PLUS_SIGN = '\u002B';
    constants.RESPONSE_LEFT_PANEL_WIDTH = 58;
    constants.RESPONSE_TOP_PANEL_HEIGHT = 60;
    constants.MARK_SCHEME_HEIGHT = 32;
    constants.DEFAULT_STAMP_HEIGHT = 48;
    constants.DEFAULT_COLLAPSE_PANEL_HEIGHT = 30;
    constants.PINCH_ZOOM_FACTOR = 10;
    constants.MAX_ZOOM_PERCENTAGE = 200;
    constants.MIN_ZOOM_PERCENTAGE = 10;
    constants.AVG_ZOOM_PERCENTAGE = 40;
    constants.SEEN_STAMP_ID = 811;
    constants.STROKE_WIDTH_RATIO = 0.002171552660152;
    constants.SVG_HEIGHT = 5;
    constants.MAX_MESSAGE_BODY_FIRST_LINE_WORDS = 10;
    // default marking scheme panel width
    constants.DEFAULT_PANEL_WIDTH = 120;
    constants.ITERATION_LIMIT = 8;
    //default number which prepends an Exception
    constants.EXCEPTION_ID_PREFIX = '5';
    // Response screen css animation timeout for showing images in milliseconds
    constants.MARKSHEETS_ANIMATION_TIMEOUT = 310;
    // fullresponse screen image transition time in milliseconds.
    // 50ms is added for device.
    constants.FULLRESPONSEVIEW_TRANSITION_TIME = 350;
    // small popup text size for popup type
    constants.SMALL_POPUP_TEXT_SIZE = 22;
    // medium popup text size for popup type
    constants.MEDIUM_POPUP_TEXT_SIZE = 45;
    // Holds a value indicating the last updated/submitted date column style in worklist
    constants.LASTUPDATED_COLUMN_STYLE = 'dim-text small-text';
    // Holds a value indicating the allocated date column style in worklist
    constants.ALLOCATED_DATE_COLUMN_STYLE = 'dim-text txt-val small-text';
    // Holds a string of zero stroke width.
    constants.ZERO_STROKE_WIDTH = '0.00';
    // margin between full response view items
    constants.FULL_RESPONSE_VIEW_ITEM_MARGIN = 45;
    // no of recipient_more link width
    constants.RECIPIENT_MORE_LINK = 100;
    // margin between unstructured zone view items
    constants.ZONE_VIEW_ITEM_MARGIN = 35;
    // Holds a value indicating the key of the cookie
    constants.SESSION_IDENTIFIER_COOKIE = 'sessionidentifiercookie';
    // width of the side view panel for on page comments
    constants.SIDE_VIEW_COMMENT_PANEL_WIDTH = 255;
    // hide comments panel height
    constants.HIDE_COMMENTS_PANEL_HEIGHT = 49;
    constants.COMMENT_BOX_COLLAPSED_HEIGHT = 108;
    constants.COMMENT_BOX_EXPANDED_HEIGHT = 186;
    //id link annotation
    constants.LINK_ANNOTATION = 161;
    // Delay for initiating and completing response rotation.
    constants.RESPONSE_IMAGE_ROTATION_DELAY = 600;
    // Offset for the fit height mode in comment wrapper style
    constants.SIDE_VIEW_COMMENT_FIT_HEIGHT_OFFSET = 60;
    // animation time for the popup.
    constants.LINK_TO_PAGE_POPUP_ANIMATION_TIME = 800;
    // system message type id.
    constants.SYSTEM_MESSAGE = 255;
    // alternative value of NR
    constants.NR_ALTERNATIVE_VALUE = -100;
    // annotation border size
    constants.DEFAULT_ANNOTATION_BORDER_SIZE = 1;
    // threshols value for pan action
    constants.PAN_THRESHOLD = 5;
    // media file icon width
    constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT = 49;
    // media file icon width
    constants.DEFAULT_MEDIA_ARROW_ICON_HEIGHT = 39;
    // enhanced off-page comment stamp Id
    constants.ENHANCED_OFFPAGE_COMMENT_ID = 182;
    // off-page comment Stamp Id
    constants.OFF_PAGE_COMMENT_STAMP_ID = 181;
    // 300ms is the animation delay set in CSS .
    constants.GENERIC_ANIMATION_TIMEOUT = 300;
    // 300ms is the animation delay set in CSS , 310 is used for triggering an immediate action afte animation.
    constants.GENERIC_IMMEDIATE_AFTER_ANIMATION_TIMEOUT = 310;
    ///Default question or file item name to be shown when there is no selected question or file item against comment
    constants.DEFAULT_QUESTION_OR_FILE_ITEM = '---';
    // The height of common header of the page in pixels (the black one)
    constants.COMMON_HEADER_HEIGHT = 50;
    // The top position of file list panel pixels
    constants.ECOURSEWORK_FILELIST_PANEL_TOP = 70;
    // The half height of the bookmark svg icon
    constants.BOOKMARK_SVG_SCALE = 21;
    // The width of the bookmark svg icon.
    constants.BOOKMARK_SVG_WIDTH = 24;
    // Height of the bookmark svg icon
    constants.BOOKMARK_SVG_STYLE = '42px';
    // Enhanced offpage comment container view minimum heights in px.
    constants.ENHANCED_OFFPAGE_COMMENT_TABULAR_VIEW_MIN_HEIGHT = 71;
    constants.ENHANCED_OFFPAGE_COMMENT_DETAIL_VIEW_MIN_HEIGHT = 140;
    // offpage comment container min height.
    constants.OFFPAGE_COMMENT_MIN_HEIGHT = 70;
    // msExtendedCode for offline with Error code 4
    constants.MEDIA_ERROR_MS_EXTENDED_CODE_OFFLINE = -1072889803;
    constants.BOOKMARK_TEXT_BOX_WIDTH = 290;
    constants.BOOKMARK_TEXT_BOX_HEIGHT = 56;
    constants.VIDEO_PLAYER_MIN_WIDTH = 720;
    constants.VIDEO_PLAYER_MIN_PADDING = 56;
    constants.ENHANCED_OFFPAGE_COMMENT_MAXIMUM_LENGTH = 4000;
    constants.FALLBACK_LOCALE = 'rm-en';
    // Default attributes for Acetates.
    constants.SCRIPT_RESOLUTION = 200;
    constants.RULER_LENGTH_OFFSET = 50;
    constants.RULER_BACK_COLOR = -256;
    constants.LINE_COLOR = -65536;
    constants.MULTI_LINE_OFFSET_X = 100;
    constants.MULTI_LINE_OFFSET_Y = 50;
    constants.MULTI_LINE_ADD_OFFSET_X = 10;
    constants.BOOKLET_VIEW_IMAGE_COUNT = 2;
    constants.GREY_GAP_PERCENT = 3;
    constants.PROTRACTOR_LENGTH_OFFSET = 100;
    constants.PROTRACTOR_ANGLE_OFFSET = 238;
    constants.SVG_XMLNS = 'http://www.w3.org/2000/svg';
    constants.SVG_VERSION = '1.1';
    constants.SVG_XMLNS_XLINK = 'http://www.w3.org/1999/xlink';
    constants.PRESS_TIME_DELAY = 500;
    constants.ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_OPEN_RESPONSE = 106;
    constants.ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_CLOSED_RESPONSE = 69;
    constants.FRV_TOOLBAR_HEIGHT = 92;
    constants.SCROLL_SET_TIMEOUT = 210;
    constants.UNKNOWN_CONTENT_TYPE_ID = 4;
    constants.MESSAGE_SEND_SQL_ERROR_CODE = 101;
    constants.QIG_SESSION_CLOSED = 15;
    // Table Wrapper default row height
    constants.TABLE_WRAPPER_ROW_HEIGHT = 41;
})(constants || (constants = {}));
module.exports = constants;
//# sourceMappingURL=constants.js.map