"use strict";
var markingStore = require('../../../stores/marking/markingstore');
var enums = require('../enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var worklistStore = require('../../../stores/worklist/workliststore');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
var annotationHelper = require('./annotationhelper');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var CopyPreviousMarksAndAnnotationsHelper = (function () {
    function CopyPreviousMarksAndAnnotationsHelper() {
    }
    /**
     * Copying previous marks and annotations
     */
    CopyPreviousMarksAndAnnotationsHelper.copyPreviousMarksAndAnnotations = function (callBack) {
        var allMarkSchemGroupIds = markingStore.instance.getRelatedWholeResponseQIGIds();
        var markSchemeGroupIndex = 0;
        // Loop through each qig to copy the previous marks and annotations in the case of a whole response.
        var _loop_1 = function() {
            var markGroupId = 0;
            var markSchemeGroupId = 0;
            if (allMarkSchemGroupIds && allMarkSchemGroupIds.length > 0) {
                markGroupId = markingStore.instance.getMarkGroupIdQIGtoRIGMap(allMarkSchemGroupIds[markSchemeGroupIndex]);
                markSchemeGroupId = allMarkSchemGroupIds[markSchemeGroupIndex];
            }
            else {
                markGroupId = markingStore.instance.currentMarkGroupId;
                markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
            }
            // getting previous marks and annotation to copy
            var _examinerMarksAndAnnotation = CopyPreviousMarksAndAnnotationsHelper.getPrevMarksAndAnnotationsToCopy(markGroupId);
            if (_examinerMarksAndAnnotation) {
                markingStore.instance.copyPreviousMarks(markGroupId);
                // reset the value when previous marks and annotation are copied.
                var annotations = _examinerMarksAndAnnotation.annotations.map(function (_annotation) {
                    var newAnnotation = CopyPreviousMarksAndAnnotationsHelper.getAnnotationToCopy(_annotation, markGroupId, markSchemeGroupId);
                    var stampName = enums.DynamicAnnotation[newAnnotation.stamp];
                    var cssProps = colouredAnnotationsHelper.
                        createAnnotationStyle(newAnnotation, enums.DynamicAnnotation[stampName]);
                    var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    newAnnotation.red = parseInt(rgba[0]);
                    newAnnotation.green = parseInt(rgba[1]);
                    newAnnotation.blue = parseInt(rgba[2]);
                    markingActionCreator.addNewlyAddedAnnotation(newAnnotation, undefined, undefined, undefined, undefined, true // Avoid emit while copying. Should display the marks and annotations from the collection while rendering.
                    );
                    return newAnnotation;
                });
                markingActionCreator.copiedPreviousMarksAndAnnotations();
                // Log copy activity
                if (callBack) {
                    callBack(annotations);
                }
            }
            markSchemeGroupIndex++;
        };
        do {
            _loop_1();
        } while (allMarkSchemGroupIds.length > markSchemeGroupIndex);
    };
    /**
     * Get previous mark and annotation to copy
     */
    CopyPreviousMarksAndAnnotationsHelper.getPrevMarksAndAnnotationsToCopy = function (markGroupId) {
        var allMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
        if (allMarksAndAnnotations) {
            if (this.allowCopyPreviousMarks(markGroupId)) {
                var allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(function (x) { return x.isDefault === true; });
                if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                    return allMarksAndAnnotationsWithIsDefault[0];
                }
                else {
                    return allMarksAndAnnotations[1];
                }
            }
        }
        return null;
    };
    /**
     * Returns true if StartWithEmptyMarkGroup is zero and marking progress is 0.
     */
    CopyPreviousMarksAndAnnotationsHelper.allowCopyPreviousMarks = function (markGroupId) {
        var canCopyPreviousMarks = false;
        if (markingStore.instance.currentResponseMode === enums.ResponseMode.open) {
            if (worklistStore.instance.isDirectedRemark) {
                var directedOpenWorklists = worklistStore.instance.getDirectedRemarkOpenWorklistDetails;
                if (directedOpenWorklists) {
                    var currentResponseDetail = directedOpenWorklists.responses.filter(function (x) { return x.markGroupId === markingStore.instance.currentMarkGroupId; }).first();
                    // if no marks and annotations exist in current response, allow copy if startWithEmptyMarkGroup is Zero
                    if (CopyPreviousMarksAndAnnotationsHelper.isMarkingNotStarted(markGroupId) &&
                        markingStore.instance.checkAnyAnnotationExist() === false) {
                        canCopyPreviousMarks = !currentResponseDetail.startWithEmptyMarkGroup;
                    }
                }
            }
            else {
                var pooledOpenWorklists = worklistStore.instance.getPooledRemarkOpenWorklistDetails;
                if (pooledOpenWorklists) {
                    var currentResponseDetail = pooledOpenWorklists.responses.filter(function (x) { return x.markGroupId === markingStore.instance.currentMarkGroupId; }).first();
                    // if no marks and annotations exist in current response, allow copy if startWithEmptyMarkGroup is Zero
                    if (CopyPreviousMarksAndAnnotationsHelper.isMarkingNotStarted(markGroupId) &&
                        markingStore.instance.checkAnyAnnotationExist() === false) {
                        canCopyPreviousMarks = !currentResponseDetail.startWithEmptyMarkGroup;
                    }
                }
            }
        }
        return canCopyPreviousMarks;
    };
    /**
     * Returns false if StartWithEmptyMarkGroup is zero.
     */
    CopyPreviousMarksAndAnnotationsHelper.canStartMarkingWithEmptyMarkGroup = function () {
        var canStartMarkingWithEmptyMarkGroup = false;
        if (markingStore.instance.currentResponseMode === enums.ResponseMode.open) {
            if (worklistStore.instance.isDirectedRemark) {
                var directedOpenWorklists = worklistStore.instance.getDirectedRemarkOpenWorklistDetails;
                if (directedOpenWorklists) {
                    var currentResponseDetail = directedOpenWorklists.responses.filter(function (x) { return x.markGroupId === markingStore.instance.currentMarkGroupId; }).first();
                    canStartMarkingWithEmptyMarkGroup = currentResponseDetail.startWithEmptyMarkGroup;
                }
            }
            else {
                var pooledOpenWorklists = worklistStore.instance.getPooledRemarkOpenWorklistDetails;
                if (pooledOpenWorklists) {
                    var currentResponseDetail = pooledOpenWorklists.responses.filter(function (x) { return x.markGroupId === markingStore.instance.currentMarkGroupId; }).first();
                    canStartMarkingWithEmptyMarkGroup = currentResponseDetail.startWithEmptyMarkGroup;
                }
            }
        }
        return canStartMarkingWithEmptyMarkGroup;
    };
    /**
     * Returns annotation object for copy.
     * @param _annotation
     * @param markGroupId
     * @param markSchemeGroupId
     */
    CopyPreviousMarksAndAnnotationsHelper.getAnnotationToCopy = function (_annotation, markGroupId, markSchemeGroupId, isDefinitive) {
        if (isDefinitive === void 0) { isDefinitive = false; }
        var rgbForRed = 255;
        var rgbForBlue = 0;
        var rgbForGreen = 0;
        var annotationColor;
        switch (_annotation.stamp) {
            case enums.DynamicAnnotation.Highlighter:
            case enums.DynamicAnnotation.Ellipse:
                annotationColor = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                if (annotationColor) {
                    _a = annotationHelper.getRGBColor(annotationColor), rgbForRed = _a[0], rgbForGreen = _a[1], rgbForBlue = _a[2];
                }
                else if (worklistStore.instance.getRemarkRequestType > 0) {
                    // if user option is not having any  color then get the base color from db if its a remark
                    var stampName = enums.DynamicAnnotation[_annotation.stamp];
                    var cssProps = colouredAnnotationsHelper.
                        getRemarkBaseColor(enums.DynamicAnnotation[stampName]);
                    var rgb = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    rgbForRed = parseInt(rgb[0]);
                    rgbForGreen = parseInt(rgb[1]);
                    rgbForBlue = parseInt(rgb[2]);
                }
        }
        var newlyAddedAnnotation = {
            addedBySystem: _annotation.addedBySystem,
            markingOperation: enums.MarkingOperation.added,
            stamp: _annotation.stamp,
            markSchemeId: _annotation.markSchemeId,
            pageNo: _annotation.pageNo,
            imageClusterId: _annotation.imageClusterId,
            outputPageNo: _annotation.outputPageNo,
            examinerRoleId: markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].examinerRoleId,
            markGroupId: markGroupId,
            markSchemeGroupId: markSchemeGroupId,
            candidateScriptId: _annotation.candidateScriptId,
            leftEdge: _annotation.leftEdge,
            topEdge: _annotation.topEdge,
            annotationId: 0,
            clientToken: htmlUtilities.guid,
            red: rgbForRed,
            blue: rgbForBlue,
            green: rgbForGreen,
            comment: _annotation.comment,
            definitiveMark: isDefinitive,
            freehand: '',
            height: _annotation.height,
            isDirty: true,
            uniqueId: htmlUtilities.guid,
            questionTagId: 0,
            rowVersion: '',
            transparency: 0,
            version: 0,
            width: _annotation.width,
            zOrder: markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations.length,
            dataShareLevel: null,
            dimension: '',
            isPrevious: false,
            remarkRequestTypeId: worklistStore.instance.getRemarkRequestType,
            numericValue: _annotation.numericValue,
            isCopyingInRemark: true
        };
        return newlyAddedAnnotation;
        var _a;
    };
    /**
     * gets whether the marking is started or not
     * @param markGroupId
     */
    CopyPreviousMarksAndAnnotationsHelper.isMarkingNotStarted = function (markGroupId) {
        var isMarkingNotStarted = false;
        var markItem = markingStore.instance.examinerMarksAgainstCurrentResponse;
        if (markItem !== null && markItem) {
            var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
            var examinerMarkGroupDetails = markItem.examinerMarkGroupDetails;
            // check the existance of marks and annotations for a specific mark group
            if (markGroupId && (examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].
                examinerMarksCollection.filter(function (examinerMarks) {
                return (examinerMarks.markingOperation !== enums.MarkingOperation.deleted);
            }).length === 0 ||
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].
                    annotations.filter(function (annotation) {
                    return (annotation.markingOperation !== enums.MarkingOperation.deleted);
                }).length === 0)) {
                return true;
            }
            // check the existance of marks and annotations, 
            // in case of whole response, check all respective mark group collections
            if (markGroupId === undefined &&
                (examinerMarkGroupDetails[currentMarkGroupId].allMarksAndAnnotations[0].
                    examinerMarksCollection.filter(function (examinerMarks) {
                    return (examinerMarks.markingOperation !== enums.MarkingOperation.deleted);
                }).length !== 0 ||
                    examinerMarkGroupDetails[currentMarkGroupId].allMarksAndAnnotations[0].
                        annotations.filter(function (annotation) {
                        return (annotation.markingOperation !== enums.MarkingOperation.deleted);
                    }).length !== 0)) {
                // if the current mark group has marks, then response is partially marked
                return false;
            }
            else if (markGroupId === undefined) {
                var markGroupIds = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId);
                for (var index = 0; index < markGroupIds.length; index++) {
                    var allMarksAndAnnotations = examinerMarkGroupDetails[markGroupIds[index]].allMarksAndAnnotations[0];
                    if (allMarksAndAnnotations.examinerMarksCollection.filter(function (examinerMarks) {
                        return (examinerMarks.markingOperation !== enums.MarkingOperation.deleted);
                    }).length !== 0 ||
                        allMarksAndAnnotations.examinerMarksCollection.filter(function (annotation) {
                            return (annotation.markingOperation !== enums.MarkingOperation.deleted);
                        }).length !== 0) {
                        // if any mark group has marks, then response is partially marked
                        return false;
                    }
                }
            }
            // if no marks and annotations exit, then the marking is not started
            return true;
        }
    };
    /**
     * Copy marks and annotation, as make it as definitive.
     * @param markGroupId
     */
    CopyPreviousMarksAndAnnotationsHelper.copyMarksAndAnnotationForUnClassified = function (markGroupId) {
        var allMarksAndAnnotationsToCopy = JSON.parse(JSON.stringify(markingStore.instance.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0]));
        var examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        if (allMarksAndAnnotationsToCopy) {
            var currentMarksAndAnnotations_1 = markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0];
            var markSchemeGroupId_1 = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
            /* Copying marks for Copy Marks as definitive*/
            if (standardisationSetupStore.instance.fetchStandardisationResponseData().examinerRoleId !== examinerRoleId) {
                allMarksAndAnnotationsToCopy.examinerMarksCollection.forEach(function (e) {
                    if (e.definitiveMark === false) {
                        var _examinerMark = e;
                        _examinerMark.markId = 0;
                        _examinerMark.examinerRoleId = examinerRoleId;
                        _examinerMark.markGroupId = markGroupId;
                        _examinerMark.rowVersion = '';
                        _examinerMark.version = 0;
                        _examinerMark.isDirty = true;
                        _examinerMark.uniqueId = htmlUtilities.guid;
                        _examinerMark.markingOperation = enums.MarkingOperation.added;
                        _examinerMark.definitiveMark = true;
                        currentMarksAndAnnotations_1.examinerMarksCollection.push(_examinerMark);
                    }
                });
                /* Copying annotations for Copy Marks as definitive*/
                if (allMarksAndAnnotationsToCopy.annotations) {
                    allMarksAndAnnotationsToCopy.annotations.map(function (_annotation) {
                        var newAnnotation = CopyPreviousMarksAndAnnotationsHelper.getAnnotationToCopy(_annotation, markGroupId, markSchemeGroupId_1, true);
                        var stampName = enums.DynamicAnnotation[newAnnotation.stamp];
                        var cssProps = colouredAnnotationsHelper.
                            createAnnotationStyle(newAnnotation, enums.DynamicAnnotation[stampName]);
                        var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                        newAnnotation.red = parseInt(rgba[0]);
                        newAnnotation.green = parseInt(rgba[1]);
                        newAnnotation.blue = parseInt(rgba[2]);
                        markingActionCreator.addNewlyAddedAnnotation(newAnnotation, undefined, undefined, undefined, undefined, true // Avoid emit while copying. Should display the marks and annotations from the collection while rendering.
                        );
                    });
                }
                /* Copying EnhancedOffPage annotations for Copy Marks as definitive */
                if (currentMarksAndAnnotations_1.enhancedOffPageComments && currentMarksAndAnnotations_1.enhancedOffPageComments.length > 0) {
                    currentMarksAndAnnotations_1.enhancedOffPageComments.forEach(function (e) {
                        if (e.isDefinitive === false) {
                            var _enhancedOffPageComment = e;
                            _enhancedOffPageComment.enhancedOffPageCommentId = 0;
                            _enhancedOffPageComment.examinerRoleId = examinerRoleId;
                            _enhancedOffPageComment.rowVersion = '';
                            _enhancedOffPageComment.rowVersion = 0;
                            _enhancedOffPageComment.isDirty = true;
                            _enhancedOffPageComment.uniqueId = htmlUtilities.guid;
                            _enhancedOffPageComment.markingOperation = enums.MarkingOperation.added;
                            _enhancedOffPageComment.isDefinitive = true;
                            currentMarksAndAnnotations_1.examinerMarksCollection.push(_enhancedOffPageComment);
                        }
                    });
                }
            }
            else {
                currentMarksAndAnnotations_1.examinerMarksCollection.forEach(function (e) {
                    if (e.definitiveMark === false) {
                        var _examinerMark = e;
                        _examinerMark.isDirty = true;
                        _examinerMark.definitiveMark = true;
                        _examinerMark.markingOperation = enums.MarkingOperation.updated;
                    }
                });
                if (currentMarksAndAnnotations_1.annotations) {
                    currentMarksAndAnnotations_1.annotations.map(function (e) {
                        if (e.definitiveMark === false) {
                            var _annotation = e;
                            _annotation.isDirty = true;
                            _annotation.definitiveMark = true;
                            _annotation.markingOperation = enums.MarkingOperation.updated;
                        }
                    });
                }
                if (currentMarksAndAnnotations_1.enhancedOffPageComments && currentMarksAndAnnotations_1.enhancedOffPageComments.length > 0) {
                    currentMarksAndAnnotations_1.enhancedOffPageComments.map(function (e) {
                        if (e.isDefinitive === false) {
                            var _enhancedOffPageComment = e;
                            _enhancedOffPageComment.isDirty = true;
                            _enhancedOffPageComment.isDefinitive = true;
                            _enhancedOffPageComment.markingOperation = enums.MarkingOperation.updated;
                        }
                    });
                }
            }
        }
        markingActionCreator.copiedPreviousMarksAndAnnotations();
    };
    return CopyPreviousMarksAndAnnotationsHelper;
}());
module.exports = CopyPreviousMarksAndAnnotationsHelper;
//# sourceMappingURL=copypreviousmarksandannotationshelper.js.map