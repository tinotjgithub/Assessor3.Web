"use strict";
var markingStore = require('./markingstore');
var qigStore = require('../qigselector/qigstore');
var enums = require('../../components/utility/enums');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var bookmarkComponentWrapper = require('./bookmarkcomponentwrapper');
var ecourseworkfilestore = require('../response/digital/ecourseworkfilestore');
var localeStore = require('../locale/localestore');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../utility/sorting/sorthelper');
var Immutable = require('immutable');
var bookMarkContextMenuData = require('../../components/utility/contextmenu/bookmarkcontextmenudata');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var BookMarkHelper = (function () {
    function BookMarkHelper() {
    }
    /**
     * Get the bookmark type for the selected qig.
     *
     * @static
     * @param {} current marking mode
     * @returns {enums.BookMarkFetchType}
     * @memberof BookMarkHelper
     */
    BookMarkHelper.getBookMarkTypeForQIG = function (markingMode) {
        /**
         * If bookmark cc is not enabled for the qig dont need to show
         */
        if (!BookMarkHelper.isBookMarkEnabled) {
            return enums.BookMarkFetchType.None;
        }
        /**
         * Bookmark is enabled only for unstrucured response, even if structred atypical or ebookmarking.
         * while viewing suboordinates worklist this may undefined
         */
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod !== enums.MarkingMethod.Unstructured) {
            return enums.BookMarkFetchType.None;
        }
        // Checking the selected marking moode is live similar or esworklist
        // and set the associated fetch type.
        return markingMode === enums.MarkingMode.LiveMarking ||
            markingMode === enums.MarkingMode.Remarking ||
            markingMode === enums.MarkingMode.Sample ||
            markingMode === enums.MarkingMode.Simulation
            ? enums.BookMarkFetchType.Live
            : enums.BookMarkFetchType.Standardisation;
    };
    Object.defineProperty(BookMarkHelper, "isBookMarkEnabled", {
        /**
         * Returns a value indicating whether the Bookmark CC is enabled
         * fot the current loaded qig
         *
         * @static
         * @returns {boolean}
         * @memberof BookMarkHelper
         */
        get: function () {
            var isBookMarkCCOn = configurableCharacteristicsHelper
                .getCharacteristicValue(configurableCharacteristicsNames.Bookmark)
                .toLowerCase() === 'true'
                ? true
                : false;
            return !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup && isBookMarkCCOn;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Retrieve bookmark list of the current selected response.
     *
     * @static
     * @param {boolean} isEcourseWork
     * @returns {Array<bookmark>}
     * @memberof BookMarkHelper
     */
    BookMarkHelper.getBookmarkList = function (isEcourseWork) {
        var filteredBookmarkList = null;
        // If markgroup is not set while open the response then set as null.
        if (markingStore.instance.currentMarkGroupId && markingStore.instance.currentMarkGroupId === 0) {
            return filteredBookmarkList;
        }
        // Get the current bookmark details of the current response.
        var markData = markingStore.instance.examinerMarksAgainstCurrentResponse;
        // If there are no bookmark found return as empty.
        if (!markData || markData === null) {
            return filteredBookmarkList;
        }
        // if ecourse work and pages there to display then filter the bookmark list (if there is any),.
        // and show only bookmarks associated to the current docstorepage.
        var bookmarkList = markData.examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations[0]
            .bookmarks;
        // if none of the bookmarks we cant display anything.
        if (bookmarkList && bookmarkList.length === 0) {
            return null;
        }
        if (isEcourseWork) {
            // Filter bookmarklist against the current selected file.
            var selectedFile = this.ecourseworkFileToRenderBookmarks();
            var documentId = selectedFile ? selectedFile.docPageID : undefined;
            if (documentId) {
                for (var i = 0; i < bookmarkList.length; i++) {
                    if (bookmarkList[i].inputFileDocumentId === documentId) {
                        // Empty array? initilize
                        if (filteredBookmarkList === null) {
                            filteredBookmarkList = new Array();
                        }
                        var bookmarkWrapper = BookMarkHelper.createWrapperObject(bookmarkList[i]);
                        bookmarkWrapper.isEcoursework = true;
                        filteredBookmarkList.push(bookmarkWrapper);
                    }
                }
            }
        }
        else {
            // For unstructured reponses we need to show all bookmarks associated to the entire response
            for (var i = 0; i < bookmarkList.length; i++) {
                if (filteredBookmarkList === null) {
                    filteredBookmarkList = new Array();
                }
                var bookmarkWrapper = BookMarkHelper.createWrapperObject(bookmarkList[i]);
                filteredBookmarkList.push(bookmarkWrapper);
            }
        }
        return filteredBookmarkList;
    };
    /**
     * returns sorted list of bookmarks
     * @param isEcoursework
     */
    BookMarkHelper.getSortedBookmarkList = function (isEcoursework) {
        var sortedBookmarksList = BookMarkHelper.getBookmarkList(isEcoursework);
        if (sortedBookmarksList) {
            // sort bookmarks - comment asc(primary), createdDate desc(secondary)
            sortedBookmarksList = this.sortBookmarkList(Immutable.List(sortedBookmarksList));
        }
        return sortedBookmarksList;
    };
    /**
     * Create and map bookmark object to wrapper compatible
     *
     * @param {bookmark} bookmark
     * @returns {bookmarkComponentWrapper}
     * @memberof BookMarkHelper
     */
    BookMarkHelper.createWrapperObject = function (bookmark) {
        var prefix = localeStore.instance.TranslateText('marking.response.bookmarks-panel.page');
        var bookmarkWrapper = new bookmarkComponentWrapper(prefix);
        bookmarkWrapper.bookmarkId = bookmark.bookmarkId;
        bookmarkWrapper.clientToken = bookmark.clientToken;
        bookmarkWrapper.comment = bookmark.comment;
        bookmarkWrapper.createdDate = bookmark.createdDate;
        bookmarkWrapper.definitiveBookmark = bookmark.definitiveBookmark;
        bookmarkWrapper.examinerRoleId = bookmark.examinerRoleId;
        bookmarkWrapper.fileName = bookmark.fileName;
        bookmarkWrapper.height = bookmark.height;
        bookmarkWrapper.inputFileDocumentId = bookmark.inputFileDocumentId;
        bookmarkWrapper.isDirty = bookmark.isDirty;
        bookmarkWrapper.left = bookmark.left;
        bookmarkWrapper.markGroupId = bookmark.markGroupId;
        bookmarkWrapper.markSchemeGroupId = bookmark.markSchemeGroupId;
        bookmarkWrapper.pageNo = bookmark.pageNo;
        bookmarkWrapper.rowVersion = bookmark.rowVersion;
        bookmarkWrapper.top = bookmark.top;
        bookmarkWrapper.width = bookmark.width;
        bookmarkWrapper.markingOperation = bookmark.markingOperation;
        return bookmarkWrapper;
    };
    /**
     * Retrive the newly added bookmarks
     * @param topEdge
     * @param leftEdge
     */
    BookMarkHelper.getBookmarksToAdd = function (topEdge, leftEdge, pageNo, pageNoWithoutSuppressed) {
        var selectedFile = this.ecourseworkFileToRenderBookmarks();
        var selectedFileName = '';
        var selectedFileDocPageID = 0;
        var prefix = localeStore.instance.TranslateText('marking.response.bookmarks-panel.page');
        if (selectedFile) {
            selectedFileName = selectedFile.title ? selectedFile.title : '';
            selectedFileDocPageID = selectedFile.docPageID ? selectedFile.docPageID : 0;
            prefix = selectedFileName + ', ' + prefix;
        }
        var newBookmark = {
            bookmarkId: 0,
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markGroupId: markingStore.instance.currentMarkGroupId,
            pageNo: pageNo,
            left: Math.round(leftEdge),
            top: Math.round(topEdge),
            fileName: selectedFileName,
            width: 32,
            height: 32,
            comment: prefix + ' ' + pageNoWithoutSuppressed,
            inputFileDocumentId: selectedFileDocPageID,
            isDirty: true,
            definitiveBookmark: false,
            rowVersion: null,
            clientToken: htmlUtilities.guid,
            markingOperation: enums.MarkingOperation.added,
            createdDate: null
        };
        return newBookmark;
    };
    /**
     * This method will return the currently selected file(image file only) to render bookmarks
     */
    BookMarkHelper.ecourseworkFileToRenderBookmarks = function () {
        var selectedECourseWorkFiles = ecourseworkfilestore.instance.getSelectedECourseWorkFiles();
        var selectedFile = selectedECourseWorkFiles
            ? selectedECourseWorkFiles
                .filter(function (x) {
                return x.linkData.mediaType === enums.MediaType.Image ||
                    x.linkData.mediaType === enums.MediaType.None;
            })
                .first()
            : undefined;
        return selectedFile;
    };
    /**
     * Sort bookmark list
     * @param bookmarks
     */
    BookMarkHelper.sortBookmarkList = function (bookmarks) {
        // Sort bookmarks based on the alphabetical order of the bookmark names.
        // If there are bookmarks with the same name, then sort based on time of creation, the oldest comes first.
        var sortedBookmarks = Immutable.List(sortHelper.sort(bookmarks.toArray(), comparerList.BookmarkComparer));
        return sortedBookmarks.toArray();
    };
    /**
     * return bookmark context menu data.
     */
    BookMarkHelper.getContextMenuData = function (clientToken, annotationOverlayWidth) {
        var data;
        data = new bookMarkContextMenuData();
        data.contextMenuType = enums.ContextMenuType.bookMark;
        data.clientToken = clientToken;
        data.annotationOverlayWidth = annotationOverlayWidth;
        return data;
    };
    return BookMarkHelper;
}());
module.exports = BookMarkHelper;
//# sourceMappingURL=bookmarkhelper.js.map