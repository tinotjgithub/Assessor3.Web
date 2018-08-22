import markingStore = require('./markingstore');
import qigStore = require('../qigselector/qigstore');
import enums = require('../../components/utility/enums');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ecourseWorkHelper = require('../../components//utility/ecoursework/ecourseworkhelper');
import bookmark = require('../response/typings/bookmark');
import examinerMarkData = require('../response/typings/examinermarkdata');
import bookmarkComponentWrapper = require('./bookmarkcomponentwrapper');
import ecourseworkfilestore = require('../response/digital/ecourseworkfilestore');
import localeStore = require('../locale/localestore');
import courseworkfile = require('../response/digital/typings/courseworkfile');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../utility/sorting/sorthelper');
import Immutable = require('immutable');
import bookMarkContextMenuData = require('../../components/utility/contextmenu/bookmarkcontextmenudata');
import standardisationSetupStore = require('../standardisationsetup/standardisationsetupstore');
class BookMarkHelper {
    /**
     * Get the bookmark type for the selected qig.
     *
     * @static
     * @param {} current marking mode
     * @returns {enums.BookMarkFetchType}
     * @memberof BookMarkHelper
     */
    public static getBookMarkTypeForQIG(markingMode: enums.MarkingMode): enums.BookMarkFetchType {
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
        if (
            qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod !== enums.MarkingMethod.Unstructured
        ) {
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
    }

    /**
     * Returns a value indicating whether the Bookmark CC is enabled
     * fot the current loaded qig
     *
     * @static
     * @returns {boolean}
     * @memberof BookMarkHelper
     */
    public static get isBookMarkEnabled(): boolean {
        let isBookMarkCCOn: boolean =
            configurableCharacteristicsHelper
                .getCharacteristicValue(configurableCharacteristicsNames.Bookmark)
                .toLowerCase() === 'true'
                ? true
                : false;
        return !standardisationSetupStore.instance.isSelectResponsesWorklist && isBookMarkCCOn;
    }

    /**
     * Retrieve bookmark list of the current selected response.
     *
     * @static
     * @param {boolean} isEcourseWork
     * @returns {Array<bookmark>}
     * @memberof BookMarkHelper
     */
    public static getBookmarkList(isEcourseWork: boolean): Array<bookmarkComponentWrapper> {
        let filteredBookmarkList: Array<bookmarkComponentWrapper> = null;

        // If markgroup is not set while open the response then set as null.
        if (markingStore.instance.currentMarkGroupId && markingStore.instance.currentMarkGroupId === 0) {
            return filteredBookmarkList;
        }

        // Get the current bookmark details of the current response.
        let markData: examinerMarkData = markingStore.instance.examinerMarksAgainstCurrentResponse;

        // If there are no bookmark found return as empty.
        if (!markData || markData === null) {
            return filteredBookmarkList;
        }

        // if ecourse work and pages there to display then filter the bookmark list (if there is any),.
        // and show only bookmarks associated to the current docstorepage.
        let bookmarkList =
            markData.examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations[0]
                .bookmarks;

        // if none of the bookmarks we cant display anything.
        if (bookmarkList && bookmarkList.length === 0) {
            return null;
        }

        if (isEcourseWork) {
            // Filter bookmarklist against the current selected file.
            let selectedFile = this.ecourseworkFileToRenderBookmarks();
            let documentId: number = selectedFile ? selectedFile.docPageID : undefined;

            if (documentId) {
                for (let i = 0; i < bookmarkList.length; i++) {
                    if (bookmarkList[i].inputFileDocumentId === documentId) {
                        // Empty array? initilize
                        if (filteredBookmarkList === null) {
                            filteredBookmarkList = new Array<bookmarkComponentWrapper>();
                        }

                        let bookmarkWrapper: bookmarkComponentWrapper = BookMarkHelper.createWrapperObject(
                            bookmarkList[i]
                        );
                        bookmarkWrapper.isEcoursework = true;
                        filteredBookmarkList.push(bookmarkWrapper);
                    }
                }
            }
        } else {
            // For unstructured reponses we need to show all bookmarks associated to the entire response
            for (let i = 0; i < bookmarkList.length; i++) {
                if (filteredBookmarkList === null) {
                    filteredBookmarkList = new Array<bookmarkComponentWrapper>();
                }
                let bookmarkWrapper: bookmarkComponentWrapper = BookMarkHelper.createWrapperObject(bookmarkList[i]);
                filteredBookmarkList.push(bookmarkWrapper);
            }
        }
        return filteredBookmarkList;
    }

    /**
     * returns sorted list of bookmarks
     * @param isEcoursework
     */
    public static getSortedBookmarkList(isEcoursework: boolean) {
        let sortedBookmarksList: Array<bookmarkComponentWrapper> = BookMarkHelper.getBookmarkList(isEcoursework);

        if (sortedBookmarksList) {
            // sort bookmarks - comment asc(primary), createdDate desc(secondary)
            sortedBookmarksList = this.sortBookmarkList(Immutable.List<bookmarkComponentWrapper>(sortedBookmarksList));
        }

        return sortedBookmarksList;
    }

    /**
     * Create and map bookmark object to wrapper compatible
     *
     * @param {bookmark} bookmark
     * @returns {bookmarkComponentWrapper}
     * @memberof BookMarkHelper
     */
    public static createWrapperObject(bookmark: bookmark): bookmarkComponentWrapper {
        let prefix: string = localeStore.instance.TranslateText('marking.response.bookmarks-panel.page');
        let bookmarkWrapper: bookmarkComponentWrapper = new bookmarkComponentWrapper(prefix);

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
    }

    /**
     * Retrive the newly added bookmarks
     * @param topEdge
     * @param leftEdge
     */
    public static getBookmarksToAdd(
        topEdge: number,
        leftEdge: number,
        pageNo: number,
        pageNoWithoutSuppressed: number
    ) {
        let selectedFile = this.ecourseworkFileToRenderBookmarks();
        let selectedFileName: string = '';
        let selectedFileDocPageID: number = 0;
        let prefix: string = localeStore.instance.TranslateText('marking.response.bookmarks-panel.page');

        if (selectedFile) {
            selectedFileName = selectedFile.title ? selectedFile.title : '';
            selectedFileDocPageID = selectedFile.docPageID ? selectedFile.docPageID : 0;
            prefix = selectedFileName + ', ' + prefix;
        }

        let newBookmark: bookmark = {
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
    }

    /**
     * This method will return the currently selected file(image file only) to render bookmarks
     */
    public static ecourseworkFileToRenderBookmarks(): courseworkfile {
        let selectedECourseWorkFiles = ecourseworkfilestore.instance.getSelectedECourseWorkFiles();
        let selectedFile = selectedECourseWorkFiles
            ? selectedECourseWorkFiles
                  .filter(
                      (x: courseworkfile) =>
                          x.linkData.mediaType === enums.MediaType.Image ||
                          x.linkData.mediaType === enums.MediaType.None
                  )
                  .first()
            : undefined;

        return selectedFile;
    }

    /**
     * Sort bookmark list
     * @param bookmarks
     */
    public static sortBookmarkList(
        bookmarks: Immutable.List<bookmarkComponentWrapper>
    ): Array<bookmarkComponentWrapper> {
        // Sort bookmarks based on the alphabetical order of the bookmark names.
        // If there are bookmarks with the same name, then sort based on time of creation, the oldest comes first.
        let sortedBookmarks = Immutable.List<bookmarkComponentWrapper>(
            sortHelper.sort(bookmarks.toArray(), comparerList.BookmarkComparer)
        );

        return sortedBookmarks.toArray();
    }

    /**
     * return bookmark context menu data.
     */
    public static getContextMenuData(clientToken: string, annotationOverlayWidth: number): bookMarkContextMenuData {
        let data: bookMarkContextMenuData;
        data = new bookMarkContextMenuData();
        data.contextMenuType = enums.ContextMenuType.bookMark;
        data.clientToken = clientToken;
        data.annotationOverlayWidth = annotationOverlayWidth;
        return data;
    }
}
export = BookMarkHelper;
