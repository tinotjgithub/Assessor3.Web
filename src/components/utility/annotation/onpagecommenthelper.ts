import React = require('react');
import Immutable = require('immutable');
import enums = require('../enums');
import annotationHelper = require('./annotationhelper');
import annotation = require('../../../stores/response/typings/annotation');
import marksAndAnnotationsVisibilityHelper = require('../marking/marksandannotationsvisibilityhelper');
import marksAndAnnotationsVisibilityInfo = require('./marksandannotationsvisibilityinfo');
import markingStore = require('../../../stores/marking/markingstore');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import responseHelper = require('../responsehelper/responsehelper');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import markingHelper = require('../../../utility/markscheme/markinghelper');
import responseStore = require('../../../stores/response/responsestore');
import treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
import makerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');

class OnPageCommentHelper {
    public static onPageCommentsSideView: Array<OnPageCommentSideViewItem> = new Array<OnPageCommentSideViewItem>();
    public static outputPages: Array<OutputPage> = new Array<OutputPage>();
    public static commentMoveInSideView: boolean = false;
    public static isFitWidth: boolean = false;
    public treeViewHelper: treeViewDataHelper;

    /**
     * Get position of OnPageComment Web Assessor Compatibility
     * @param OrginalImageHeight
     * @param OrginalImageWidth
     * @param commentText
     * @param top
     * @param left
     */
    public static UpdateOnPageCommentPosition(orginalImageHeight: number,
        orginalImageWidth: number,
        commentText: any,
        top: number,
        left: number): any {

        // creating obj for position
        let onPagePosition = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };

        // as per current Implementation the comment icons left
        // and top is stored as width and height in db
        // and also left & top positions are the positions of comment box in WA
        // so assigning left to width and top to height
        onPagePosition.width = left;
        onPagePosition.height = top;

        // by default width of comment box in Web Assessor is 235
        let commentBoxWidth = 225;

        // holds the comment text
        let comment = commentText;

        // holds the number of lines in comment box
        let noOfLine = 0;
        let noOfLineMod = 0;

        // holds total lines in comment box
        let linesInCommentBox = 0;

        // by defalult height of line inside commentBox in WA is 17
        let lineHeight = 17;

        // by defalult height of commentBox in WA is 27
        let commentBoxHeight = 27;

        // by defalult, number of characters per line inside CommentBox in WA is 30
        let maxCharsPerLine = 30;

        // holds the maximum height of original image
        let imageMaxHeight = orginalImageHeight;

        // increment values
        let i = 1;
        let capacity = 0;
        let totalLinesHeight = 0;

        // holds the top position value of comment box
        let commentTop = 0;

        // checks the comment box position lies within the Image towards left & right
        // if it is not so changing the left position by decreasing with commentBox width(235)
        let _left = commentBoxWidth + left;
        let leftpos = left;
        if (_left > orginalImageWidth) {
            leftpos = leftpos - commentBoxWidth;
            if (leftpos < 0) {
                leftpos = left;
            }
        }
        onPagePosition.left = leftpos;

        // checks the comment box position lies within the Image towards top & bottom
        // based on number of characters in comment box the position of commentBox
        // get changed towards top & bottom
        capacity = top + commentBoxHeight;

        // this is to find total lines can be entered towards bottom
        // if the box position has already reached the bottom then skip this

        let condition: boolean = true;
        if (comment) {
            if (capacity < imageMaxHeight) {
                while (condition) {
                    totalLinesHeight = i * lineHeight;
                    if (i !== 0) {
                        commentBoxHeight = 0;
                    }
                    capacity = top + lineHeight + totalLinesHeight;
                    if (capacity > imageMaxHeight) {
                        break;
                    }
                    i++;
                }
            }

            // holds number of lines which has 30 characters
            noOfLine = Math.floor((comment.length) / maxCharsPerLine);

            // to identify the last line has 30 charcters
            noOfLineMod = (comment.length) % maxCharsPerLine;

            // if not so then add one line to Numberoflines count
            noOfLineMod = noOfLineMod > 0 ? 1 : 0;

            linesInCommentBox = (noOfLine + noOfLineMod) * lineHeight;

            // checks if the position of comment box lies inside the
            // image after entering those number of lines which is
            // calculated above
            // if it is so then decrease the top position
            if (linesInCommentBox > totalLinesHeight) {
                commentTop = linesInCommentBox - totalLinesHeight;
                commentTop = top - commentTop;
            } else {
                commentTop = top;
            }
        } else {
            commentTop = top;
        }

        commentTop = commentTop > 0 ? commentTop : 0;
        onPagePosition.top = commentTop;
        return onPagePosition;
    }

    /**
     * Adds to a collection which is used in displaying the side view comment panel
     * @param commentItem - Item to add to the list of on page comments
     */
    public static addPageCommentsInResponseToSideViewList(commentItem: OnPageCommentSideViewItem): void {
        let found = false;
        let element: OnPageCommentSideViewItem;
        for (let i = 0; element = OnPageCommentHelper.onPageCommentsSideView[i]; i++) {
            if (element.clientToken === commentItem.clientToken) {
                found = true;
                // when comment text was updated, this method is being called.
                OnPageCommentHelper.onPageCommentsSideView[i] = commentItem;
            }
        }
        if (found === false) {
            OnPageCommentHelper.onPageCommentsSideView.push(commentItem);
        }

        OnPageCommentHelper.onPageCommentsSideView.sort(
            (a: OnPageCommentSideViewItem, b: OnPageCommentSideViewItem) => {
                return a.annotationTopPx - b.annotationTopPx;
            });
    }

    /**
     * updates the list item with the new comment text
     * @param {string} clientToken
     * @param {string} commentText
     */
    public static updateSideViewItem(clientToken: string, commentText: string, remove: boolean = false): void {
        let element: OnPageCommentSideViewItem;
        for (let i = 0; element = OnPageCommentHelper.onPageCommentsSideView[i]; i++) {
            if (element.clientToken === clientToken) {
                if (remove) {
                    OnPageCommentHelper.onPageCommentsSideView.splice(i, 1);
                } else {
                    // update the comment text with the new text
                    OnPageCommentHelper.onPageCommentsSideView[i].comment = commentText;
                    break;
                }
            }
        }
    }

    /**
     * checks the existence On Page Comment annotations
     */
    public static hasOnPageComments(selectedFileMetadataList: Immutable.List<FileMetadata>,
        isECourseworkComponent: boolean, imageZoneCollection: Immutable.List<ImageZone>): boolean {
        let hasOnPageAnnotations: boolean = false;
        let annotations: any = Immutable.List(annotationHelper.getExaminerMarksAgainstResponse(markingStore.instance.currentMarkGroupId));
        let previousRemarkAnnotations: any;
        let seedType: enums.SeedType = responseHelper.getCurrentResponseSeedType();
        let markGroupId: number = responseStore.instance.selectedMarkGroupId;
        let currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        let imageClusterId: number = currentQuestionItemInfo ? currentQuestionItemInfo.imageClusterId : 0;
            imageClusterId = imageClusterId ? imageClusterId : 0;

        let currentMarkSchemeId: number = currentQuestionItemInfo ? currentQuestionItemInfo.uniqueId : 0;
        let tree: treeViewItem;
        let currentQuestionItem = markingStore.instance.currentQuestionItemInfo;
        let treeViewHelper: treeViewDataHelper;
        let markSchemesWithSameImageClusterId: any;
        treeViewHelper = new treeViewDataHelper();
        let isEBookMarking = responseHelper.isEbookMarking;

        if (currentQuestionItem && currentQuestionItem.imageClusterId > 0) {
            tree = treeViewHelper.treeViewItem();
        }

        if (tree && tree.treeViewItemList) {
            markSchemesWithSameImageClusterId = markingHelper.getMarkSchemesWithSameImageClusterId(
                tree, markingStore.instance.currentQuestionItemImageClusterId, true);
        }

        if (annotationHelper.doShowPreviousAnnotations) {
            // get the previous annotations and append to current list of annotations
            previousRemarkAnnotations = Immutable.List(annotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType));
            if (annotations !== undefined && previousRemarkAnnotations !== undefined) {
                annotations = annotations.concat(previousRemarkAnnotations);
            } else {
                annotations = previousRemarkAnnotations;
            }
        }

        if (annotations) {
            hasOnPageAnnotations = annotations.some((annotation: annotation) => {
                if (annotationHelper.isOnPageComment(annotation.stamp) &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    // for an ECourseworkComponent, check wether comment exist aganist selected file
                    ((isECourseworkComponent && selectedFileMetadataList && selectedFileMetadataList.size > 0 &&
                        selectedFileMetadataList.filter((fileMetadata: FileMetadata) =>
                        fileMetadata.pageNumber === annotation.pageNo).count() > 0) ||
                    (isEBookMarking && this.isEMBPageHasCommentAnnotation(imageZoneCollection, annotation.pageNo)) ||
                        (!isECourseworkComponent && !isEBookMarking &&  annotation.imageClusterId === imageClusterId) ||
                        // if the comment is putting aganist linked page then imagecluster id is zero, so filter against markschemeid
                        /* The side view should be enabled if any one of the markSchemes having the same imageClusterId
                            contains atleast one onPageComment */
                        (annotation.pageNo !== 0 && markSchemesWithSameImageClusterId &&
                    markSchemesWithSameImageClusterId.filter(
                        (x: treeViewItem) => x.uniqueId === annotation.markSchemeId).count() > 0)
                    || responseHelper.isAtypicalResponse() ||
                        // markSchemesWithSameImageClusterId is undefined for eBookMarkingcomponents,
                        // check the annotation aganist current markscheme id
                    (isEBookMarking && annotation.pageNo !== 0 && annotation.markSchemeId === currentMarkSchemeId)) &&
                    this.isAnnotationVisible(annotation)
                ) {
                    return true;
                }
            });
        }
        return hasOnPageAnnotations;
    }

    /**
     * return whether the ebookmarking pages for the response has comment annotation in it.
     * @param imageZoneCollection
     * @param pageNo
     */
    private static isEMBPageHasCommentAnnotation(imageZoneCollection: any, pageNo: number): boolean {
        let hasComment = false;
        if (imageZoneCollection && imageZoneCollection.length > 0) {
            for (var i = 0; i < imageZoneCollection.length; i++) {
                hasComment = imageZoneCollection[i] && imageZoneCollection[i].filter((item: ImageZone) =>
                    item.pageNo === pageNo).count() > 0;
            }
        }
        return hasComment;
    }

    /**
     * Checks whether annotation is visible as per the business rules
     * @param markGroupId
     */
    private static isAnnotationVisible(annotation: annotation): boolean {
        let marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>> =
            markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let currentMarkGroupID: number = markingStore.instance.currentMarkGroupId;
        let _isCurrentAnnotationVisible = marksAndAnnotationsVisibilityHelper.isAnnotationVisible
            (currentMarkGroupID,
            marksAndAnnotationVisibilityDetails,
            annotation.markGroupId,
            annotation.examinerRoleId,
            markingStore.instance.canRenderPreviousMarksInStandardisationSetup ,
            makerOperationModeFactory.operationMode.isAwardingMode ? true : false);

        return _isCurrentAnnotationVisible;
    }

    /**
     * adds output page (annotation overlay details) to a collection to be used for displaying side view panel
     * @param page
     */
    public static addOutputPageAttributesForSideView(page: OutputPage, isEBookMarking: boolean): void {
        let found = false;
        let element: OutputPage;
        if (!OnPageCommentHelper.outputPages) {
            OnPageCommentHelper.outputPages = new Array<OutputPage>();
        }
        for (let i = 0; element = OnPageCommentHelper.outputPages[i]; i++) {
            if (element.outputPageNo === page.outputPageNo
                && element.imageClusterId === page.imageClusterId
                && element.pageNo === page.pageNo) {
                found = true;
                OnPageCommentHelper.outputPages[i] = page;
            }
        }

        if (found === false) {
            OnPageCommentHelper.outputPages.push(page);
        }

        OnPageCommentHelper.outputPages.sort(
            (a: OutputPage, b: OutputPage) => {
                // Sort based on Output page no for EBookMarking Response.
                if (!isEBookMarking && a.imageClusterId === 0) {
                    return a.pageNo - b.pageNo;
                } else {
                    return a.outputPageNo - b.outputPageNo;
                }
            });
    }

    /**
     * clear the collections for side view comments
     */
    public static resetSideViewCollections() {
        OnPageCommentHelper.outputPages.length = 0;
        OnPageCommentHelper.onPageCommentsSideView.length = 0;
    }

    /**
     * checks whether comments side view is enabled or not
     * @returns side view enabled or not
     */
    public static get isCommentsSideViewEnabled(): boolean {
        let sideViewEnabled: boolean =
            userOptionsHelper.getUserOptionByName(userOptionKeys.COMMENTS_SIDE_VIEW) === 'true' ? true : false;
        return sideViewEnabled && !this.disableSideViewInDevices;
    }

    /**
     * checks whether side view can be disabled in devices
     */
    public static get disableSideViewInDevices(): boolean {
        return !this.isFitWidth && htmlUtilities.isTabletOrMobileDevice;
    }

    /**
     * get the specific comment item
     * @param clientToken
     */
    public static getCommentSideViewItem(clientToken: string): OnPageCommentSideViewItem {
        let commentItem: OnPageCommentSideViewItem;
        for (let i = 0; commentItem = OnPageCommentHelper.onPageCommentsSideView[i]; i++) {
            if (commentItem.clientToken === clientToken) {
                return commentItem;
            }
        }
        return null;
    }
}

export = OnPageCommentHelper;