"use strict";
var Immutable = require('immutable');
var enums = require('../enums');
var annotationHelper = require('./annotationhelper');
var marksAndAnnotationsVisibilityHelper = require('../marking/marksandannotationsvisibilityhelper');
var markingStore = require('../../../stores/marking/markingstore');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var responseHelper = require('../responsehelper/responsehelper');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var markingHelper = require('../../../utility/markscheme/markinghelper');
var responseStore = require('../../../stores/response/responsestore');
var treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
var OnPageCommentHelper = (function () {
    function OnPageCommentHelper() {
    }
    /**
     * Get position of OnPageComment Web Assessor Compatibility
     * @param OrginalImageHeight
     * @param OrginalImageWidth
     * @param commentText
     * @param top
     * @param left
     */
    OnPageCommentHelper.UpdateOnPageCommentPosition = function (orginalImageHeight, orginalImageWidth, commentText, top, left) {
        // creating obj for position
        var onPagePosition = {
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
        var commentBoxWidth = 225;
        // holds the comment text
        var comment = commentText;
        // holds the number of lines in comment box
        var noOfLine = 0;
        var noOfLineMod = 0;
        // holds total lines in comment box
        var linesInCommentBox = 0;
        // by defalult height of line inside commentBox in WA is 17
        var lineHeight = 17;
        // by defalult height of commentBox in WA is 27
        var commentBoxHeight = 27;
        // by defalult, number of characters per line inside CommentBox in WA is 30
        var maxCharsPerLine = 30;
        // holds the maximum height of original image
        var imageMaxHeight = orginalImageHeight;
        // increment values
        var i = 1;
        var capacity = 0;
        var totalLinesHeight = 0;
        // holds the top position value of comment box
        var commentTop = 0;
        // checks the comment box position lies within the Image towards left & right
        // if it is not so changing the left position by decreasing with commentBox width(235)
        var _left = commentBoxWidth + left;
        var leftpos = left;
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
        var condition = true;
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
            }
            else {
                commentTop = top;
            }
        }
        else {
            commentTop = top;
        }
        commentTop = commentTop > 0 ? commentTop : 0;
        onPagePosition.top = commentTop;
        return onPagePosition;
    };
    /**
     * Adds to a collection which is used in displaying the side view comment panel
     * @param commentItem - Item to add to the list of on page comments
     */
    OnPageCommentHelper.addPageCommentsInResponseToSideViewList = function (commentItem) {
        var found = false;
        var element;
        for (var i = 0; element = OnPageCommentHelper.onPageCommentsSideView[i]; i++) {
            if (element.clientToken === commentItem.clientToken) {
                found = true;
                // when comment text was updated, this method is being called.
                OnPageCommentHelper.onPageCommentsSideView[i] = commentItem;
            }
        }
        if (found === false) {
            OnPageCommentHelper.onPageCommentsSideView.push(commentItem);
        }
        OnPageCommentHelper.onPageCommentsSideView.sort(function (a, b) {
            return a.annotationTopPx - b.annotationTopPx;
        });
    };
    /**
     * updates the list item with the new comment text
     * @param {string} clientToken
     * @param {string} commentText
     */
    OnPageCommentHelper.updateSideViewItem = function (clientToken, commentText, remove) {
        if (remove === void 0) { remove = false; }
        var element;
        for (var i = 0; element = OnPageCommentHelper.onPageCommentsSideView[i]; i++) {
            if (element.clientToken === clientToken) {
                if (remove) {
                    OnPageCommentHelper.onPageCommentsSideView.splice(i, 1);
                }
                else {
                    // update the comment text with the new text
                    OnPageCommentHelper.onPageCommentsSideView[i].comment = commentText;
                    break;
                }
            }
        }
    };
    /**
     * checks the existence On Page Comment annotations
     */
    OnPageCommentHelper.hasOnPageComments = function (selectedFileMetadataList, isECourseworkComponent, imageZoneCollection) {
        var _this = this;
        var hasOnPageAnnotations = false;
        var annotations = Immutable.List(annotationHelper.getExaminerMarksAgainstResponse(markingStore.instance.currentMarkGroupId));
        var previousRemarkAnnotations;
        var seedType = responseHelper.getCurrentResponseSeedType();
        var markGroupId = responseStore.instance.selectedMarkGroupId;
        var currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        var imageClusterId = currentQuestionItemInfo ? currentQuestionItemInfo.imageClusterId : 0;
        imageClusterId = imageClusterId ? imageClusterId : 0;
        var currentMarkSchemeId = currentQuestionItemInfo ? currentQuestionItemInfo.uniqueId : 0;
        var tree;
        var currentQuestionItem = markingStore.instance.currentQuestionItemInfo;
        var treeViewHelper;
        var markSchemesWithSameImageClusterId;
        treeViewHelper = new treeViewDataHelper();
        var isEBookMarking = responseHelper.isEbookMarking;
        if (currentQuestionItem && currentQuestionItem.imageClusterId > 0) {
            tree = treeViewHelper.treeViewItem();
        }
        if (tree && tree.treeViewItemList) {
            markSchemesWithSameImageClusterId = markingHelper.getMarkSchemesWithSameImageClusterId(tree, markingStore.instance.currentQuestionItemImageClusterId, true);
        }
        if (annotationHelper.doShowPreviousAnnotations) {
            // get the previous annotations and append to current list of annotations
            previousRemarkAnnotations = Immutable.List(annotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType));
            if (annotations !== undefined && previousRemarkAnnotations !== undefined) {
                annotations = annotations.concat(previousRemarkAnnotations);
            }
            else {
                annotations = previousRemarkAnnotations;
            }
        }
        if (annotations) {
            hasOnPageAnnotations = annotations.some(function (annotation) {
                if (annotationHelper.isOnPageComment(annotation.stamp) &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    // for an ECourseworkComponent, check wether comment exist aganist selected file
                    ((isECourseworkComponent && selectedFileMetadataList && selectedFileMetadataList.size > 0 &&
                        selectedFileMetadataList.filter(function (fileMetadata) {
                            return fileMetadata.pageNumber === annotation.pageNo;
                        }).count() > 0) ||
                        (isEBookMarking && _this.isEMBPageHasCommentAnnotation(imageZoneCollection, annotation.pageNo)) ||
                        (!isECourseworkComponent && !isEBookMarking && annotation.imageClusterId === imageClusterId) ||
                        // if the comment is putting aganist linked page then imagecluster id is zero, so filter against markschemeid
                        /* The side view should be enabled if any one of the markSchemes having the same imageClusterId
                            contains atleast one onPageComment */
                        (annotation.pageNo !== 0 && markSchemesWithSameImageClusterId &&
                            markSchemesWithSameImageClusterId.filter(function (x) { return x.uniqueId === annotation.markSchemeId; }).count() > 0)
                        || responseHelper.isAtypicalResponse() ||
                        // markSchemesWithSameImageClusterId is undefined for eBookMarkingcomponents,
                        // check the annotation aganist current markscheme id
                        (isEBookMarking && annotation.pageNo !== 0 && annotation.markSchemeId === currentMarkSchemeId)) &&
                    _this.isAnnotationVisible(annotation.markGroupId)) {
                    return true;
                }
            });
        }
        return hasOnPageAnnotations;
    };
    /**
     * return whether the ebookmarking pages for the response has comment annotation in it.
     * @param imageZoneCollection
     * @param pageNo
     */
    OnPageCommentHelper.isEMBPageHasCommentAnnotation = function (imageZoneCollection, pageNo) {
        var hasComment = false;
        if (imageZoneCollection && imageZoneCollection.length > 0) {
            for (var i = 0; i < imageZoneCollection.length; i++) {
                hasComment = imageZoneCollection[i] && imageZoneCollection[i].filter(function (item) {
                    return item.pageNo === pageNo;
                }).count() > 0;
            }
        }
        return hasComment;
    };
    /**
     * Checks whether annotation is visible as per the business rules
     * @param markGroupId
     */
    OnPageCommentHelper.isAnnotationVisible = function (markGroupId) {
        var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        var currentMarkGroupID = markingStore.instance.currentMarkGroupId;
        var _isCurrentAnnotationVisible = marksAndAnnotationsVisibilityHelper.isAnnotationVisible(currentMarkGroupID, marksAndAnnotationVisibilityDetails, markGroupId);
        return _isCurrentAnnotationVisible;
    };
    /**
     * adds output page (annotation overlay details) to a collection to be used for displaying side view panel
     * @param page
     */
    OnPageCommentHelper.addOutputPageAttributesForSideView = function (page, isEBookMarking) {
        var found = false;
        var element;
        if (!OnPageCommentHelper.outputPages) {
            OnPageCommentHelper.outputPages = new Array();
        }
        for (var i = 0; element = OnPageCommentHelper.outputPages[i]; i++) {
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
        OnPageCommentHelper.outputPages.sort(function (a, b) {
            // Sort based on Output page no for EBookMarking Response.
            if (!isEBookMarking && a.imageClusterId === 0) {
                return a.pageNo - b.pageNo;
            }
            else {
                return a.outputPageNo - b.outputPageNo;
            }
        });
    };
    /**
     * clear the collections for side view comments
     */
    OnPageCommentHelper.resetSideViewCollections = function () {
        OnPageCommentHelper.outputPages.length = 0;
        OnPageCommentHelper.onPageCommentsSideView.length = 0;
    };
    Object.defineProperty(OnPageCommentHelper, "isCommentsSideViewEnabled", {
        /**
         * checks whether comments side view is enabled or not
         * @returns side view enabled or not
         */
        get: function () {
            var sideViewEnabled = userOptionsHelper.getUserOptionByName(userOptionKeys.COMMENTS_SIDE_VIEW) === 'true' ? true : false;
            return sideViewEnabled && !this.disableSideViewInDevices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OnPageCommentHelper, "disableSideViewInDevices", {
        /**
         * checks whether side view can be disabled in devices
         */
        get: function () {
            return !this.isFitWidth && htmlUtilities.isTabletOrMobileDevice;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get the specific comment item
     * @param clientToken
     */
    OnPageCommentHelper.getCommentSideViewItem = function (clientToken) {
        var commentItem;
        for (var i = 0; commentItem = OnPageCommentHelper.onPageCommentsSideView[i]; i++) {
            if (commentItem.clientToken === clientToken) {
                return commentItem;
            }
        }
        return null;
    };
    OnPageCommentHelper.onPageCommentsSideView = new Array();
    OnPageCommentHelper.outputPages = new Array();
    OnPageCommentHelper.commentMoveInSideView = false;
    OnPageCommentHelper.isFitWidth = false;
    return OnPageCommentHelper;
}());
module.exports = OnPageCommentHelper;
//# sourceMappingURL=onpagecommenthelper.js.map