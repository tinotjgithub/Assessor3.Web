/* List of global constants */
module constants {
    export const NOT_MARKED = '-';
    export const NOT_ATTEMPTED = 'NR';
    export const NO_MARK = '';
    export const MARK_CONFIRMATION_POPUP_ANIMATION_DELAY = '200';

    /* The total value of height of the header, top margins and the height of horizontal scroll bar
                  which has to be deducted from the viewport height for finding the marksheet holder height
            */

    //default width and height of the highlighter
    export const DEFAULT_HIGHLIGHTER_HEIGHT: number = 30;
    export const DEFAULT_HIGHLIGHTER_WIDTH: number = 60;

    //default width and height of the ellipse
    export const DEFAULT_ELLIPSE_HEIGHT: number = 30;
    export const DEFAULT_ELLIPSE_WIDTH: number = 60;

    //default width and height of the HLine
    export const DEFAULT_HLINE_HEIGHT: number = 20;
    export const DEFAULT_HLINE_WIDTH: number = 60;

    //default width and height of the VLine
    export const DEFAULT_VLINE_HEIGHT: number = 60;
    export const DEFAULT_VLINE_WIDTH: number = 20;

    //default width and height of static annotations
    export const DEFAULT_STATIC_ANNOTATION_HEIGHT: number = 32;
    export const DEFAULT_STATIC_ANNOTATION_WIDTH: number = 32;

    // Scroll Speed while scrolling.
    export const SCROLL_SPEED: number = 30;

    //Constant height tolerance to reduce while in Fit-Height
    export const HEIGHT_TOLERANCE = 60;
    export const DEVICE_SCREEN_HEIGHT = 1024;
    //A constant padding is given for the  marksheet container in css.This needs to be adjusted to set scroll position
    export const RESPONSE_CONTAINER_PADDING = 5;
    export const NONBREAKING_HYPHEN_UNICODE = '\u2011';
    export const NONBREAKING_WHITE_SPACE = '\u00a0';
    export const PLUS_SIGN = '\u002B';

    export const RESPONSE_LEFT_PANEL_WIDTH = 58;
    export const RESPONSE_TOP_PANEL_HEIGHT = 60;

    export const MARK_SCHEME_HEIGHT = 32;

    export const DEFAULT_STAMP_HEIGHT = 48;
    export const DEFAULT_COLLAPSE_PANEL_HEIGHT = 30;

    export const PINCH_ZOOM_FACTOR = 10;
    export const MAX_ZOOM_PERCENTAGE = 200;
    export const MIN_ZOOM_PERCENTAGE = 10;
    export const AVG_ZOOM_PERCENTAGE = 40;
    export const SEEN_STAMP_ID = 811;

    export const STROKE_WIDTH_RATIO = 0.002171552660152;
    export const SVG_HEIGHT = 5;

    export const MAX_MESSAGE_BODY_FIRST_LINE_WORDS: number = 10;
    // default marking scheme panel width
    export const DEFAULT_PANEL_WIDTH: number = 120;
    export const ITERATION_LIMIT: number = 8;
    //default number which prepends an Exception
    export const EXCEPTION_ID_PREFIX: string = '5';

    // Response screen css animation timeout for showing images in milliseconds
    export const MARKSHEETS_ANIMATION_TIMEOUT: number = 310;

    // fullresponse screen image transition time in milliseconds.
    // 50ms is added for device.
    export const FULLRESPONSEVIEW_TRANSITION_TIME: number = 350;

    // small popup text size for popup type
    export const SMALL_POPUP_TEXT_SIZE: number = 22;
    // medium popup text size for popup type
    export const MEDIUM_POPUP_TEXT_SIZE: number = 45;

    // Holds a value indicating the last updated/submitted date column style in worklist
    export const LASTUPDATED_COLUMN_STYLE: string = 'dim-text small-text';

    // Holds a value indicating the allocated date column style in worklist
    export const ALLOCATED_DATE_COLUMN_STYLE: string = 'dim-text txt-val small-text';

    // Holds a string of zero stroke width.
    export const ZERO_STROKE_WIDTH: string = '0.00';

    // margin between full response view items
    export const FULL_RESPONSE_VIEW_ITEM_MARGIN: number = 45;

    // no of recipient_more link width
    export const RECIPIENT_MORE_LINK: number = 100;

    // margin between unstructured zone view items
    export const ZONE_VIEW_ITEM_MARGIN: number = 35;

    // Holds a value indicating the key of the cookie
    export const SESSION_IDENTIFIER_COOKIE = 'sessionidentifiercookie';

    // width of the side view panel for on page comments
    export const SIDE_VIEW_COMMENT_PANEL_WIDTH: number = 255;

    // hide comments panel height
    export const HIDE_COMMENTS_PANEL_HEIGHT: number = 49;
    export const COMMENT_BOX_COLLAPSED_HEIGHT: number = 108;
    export const COMMENT_BOX_EXPANDED_HEIGHT: number = 186;

    //id link annotation
    export const LINK_ANNOTATION: number = 161;

    // Delay for initiating and completing response rotation.
    export const RESPONSE_IMAGE_ROTATION_DELAY: number = 600;

    // Offset for the fit height mode in comment wrapper style
    export const SIDE_VIEW_COMMENT_FIT_HEIGHT_OFFSET: number = 60;

    // animation time for the popup.
    export const LINK_TO_PAGE_POPUP_ANIMATION_TIME: number = 800;

    // system message type id.
    export const SYSTEM_MESSAGE: number = 255;

    // alternative value of NR
    export const NR_ALTERNATIVE_VALUE: number = -100;

    // annotation border size
    export const DEFAULT_ANNOTATION_BORDER_SIZE: number = 1;

    // threshols value for pan action
    export const PAN_THRESHOLD: number = 5;

    // media file icon width
    export const DEFAULT_MEDIA_FILE_ICON_HEIGHT: number = 49;

    // media file icon width
    export const DEFAULT_MEDIA_ARROW_ICON_HEIGHT: number = 39;

    // enhanced off-page comment stamp Id
    export const ENHANCED_OFFPAGE_COMMENT_ID: number = 182;
    // off-page comment Stamp Id
    export const OFF_PAGE_COMMENT_STAMP_ID: number = 181;

    // 300ms is the animation delay set in CSS .
    export const GENERIC_ANIMATION_TIMEOUT: number = 300;

    // 300ms is the animation delay set in CSS , 310 is used for triggering an immediate action afte animation.
    export const GENERIC_IMMEDIATE_AFTER_ANIMATION_TIMEOUT: number = 310;

    ///Default question or file item name to be shown when there is no selected question or file item against comment
    export const DEFAULT_QUESTION_OR_FILE_ITEM: string = '---';

    // The height of common header of the page in pixels (the black one)
    export const COMMON_HEADER_HEIGHT: number = 50;

    // The top position of file list panel pixels
    export const ECOURSEWORK_FILELIST_PANEL_TOP: number = 70;

    // The half height of the bookmark svg icon
    export const BOOKMARK_SVG_SCALE: number = 21;

    // The width of the bookmark svg icon.
    export const BOOKMARK_SVG_WIDTH: number = 24;

    // Height of the bookmark svg icon
    export const BOOKMARK_SVG_STYLE: string = '42px';

    // Enhanced offpage comment container view minimum heights in px.
    export const ENHANCED_OFFPAGE_COMMENT_TABULAR_VIEW_MIN_HEIGHT: number = 71;
    export const ENHANCED_OFFPAGE_COMMENT_DETAIL_VIEW_MIN_HEIGHT: number = 140;

    // offpage comment container min height.
    export const OFFPAGE_COMMENT_MIN_HEIGHT: number = 70;

    // msExtendedCode for offline with Error code 4
    export const MEDIA_ERROR_MS_EXTENDED_CODE_OFFLINE = -1072889803;

    export const BOOKMARK_TEXT_BOX_WIDTH: number = 290;

    export const BOOKMARK_TEXT_BOX_HEIGHT: number = 56;

    export const VIDEO_PLAYER_MIN_WIDTH: number = 720;

    export const VIDEO_PLAYER_MIN_PADDING: number = 56;

    export const ENHANCED_OFFPAGE_COMMENT_MAXIMUM_LENGTH: number = 4000;

    export const FALLBACK_LOCALE: string = 'rm-en';

    // Default attributes for Acetates.
    export const SCRIPT_RESOLUTION: number = 200;
    export const RULER_LENGTH_OFFSET: number = 50;
    export const RULER_BACK_COLOR: number = -256;
    export const LINE_COLOR: number = -65536;
    export const MULTI_LINE_OFFSET_X: number = 100;
    export const MULTI_LINE_OFFSET_Y: number = 50;
    export const MULTI_LINE_ADD_OFFSET_X: number = 10;
    export const BOOKLET_VIEW_IMAGE_COUNT: number = 2;
    export const GREY_GAP_PERCENT: number = 3;
    export const PROTRACTOR_LENGTH_OFFSET: number = 100;
    export const PROTRACTOR_ANGLE_OFFSET: number = 238;

    export const SVG_XMLNS = 'http://www.w3.org/2000/svg';

    export const SVG_VERSION = '1.1';

    export const SVG_XMLNS_XLINK = 'http://www.w3.org/1999/xlink';
    export const PRESS_TIME_DELAY: number = 500;

    export const ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_OPEN_RESPONSE: number = 106;

    export const ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_CLOSED_RESPONSE: number = 69;
    export const FRV_TOOLBAR_HEIGHT: number = 92;

    export const SCROLL_SET_TIMEOUT: number = 210;

    export const UNKNOWN_CONTENT_TYPE_ID: number = 4;
    export const MESSAGE_SEND_SQL_ERROR_CODE: number = 101;

	export const QIG_SESSION_CLOSED: number = 15;
	// Table Wrapper default row height
	export const TABLE_WRAPPER_ROW_HEIGHT: number = 41;
}
export = constants;