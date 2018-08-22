"use strict";
var Immutable = require('immutable');
var stringHelper = require('../../../utility/generic/stringhelper');
var constants = require('../../utility/constants');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var marksAndAnnotationsVisibilityInfo = require('../../../components/utility/annotation/marksandannotationsvisibilityinfo');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var worklistStore = require('../../../stores/worklist/workliststore');
// We couldn't implement the markerOperationMode factory logic here due to the circular dependency issues. (markingstore)
var MarksAndAnnotationsVisibilityHelper = (function () {
    function MarksAndAnnotationsVisibilityHelper() {
    }
    /**
     * content for markscheme header and header dropdown.
     * /
     * @param counter
     * @param allMarksAndAnnotations
     * @param allMarksAndAnnotationsCount
     * @param visibilityInfos
     * @param isClosedEurSeed
     * @param isClosedLiveSeed
     * @param remarkBaseColor
     */
    MarksAndAnnotationsVisibilityHelper.getMarkSchemePanelColumnHeaderAttributes = function (counter, marksAndAnnotation, allMarksAndAnnotationsCount, visibilityInfos, isClosedEurSeed, isClosedLiveSeed, remarkBaseColor, responseMode, seedTypeId, markGroupId, worklistType, allMarksAndAnnotation, previousRemarkBaseColor) {
        var label = '';
        var header;
        var isMarksVisible = visibilityInfos.get(counter).isMarkVisible;
        var isAnnotationVisible = visibilityInfos.get(counter).isAnnotationVisible;
        var enhancedOffpageCommentVisible = visibilityInfos.get(counter).isEnhancedOffpageCommentVisible;
        var markedBy = marksAndAnnotation.markedBySurname === null ? undefined :
            marksAndAnnotation.markedByInitials + ' ' + marksAndAnnotation.markedBySurname;
        var markSchemeHeader = Immutable.Map();
        var remarkRequestTypeId = marksAndAnnotation.remarkRequestTypeId;
        var showCheckbox = true;
        var isDefinitive = false;
        var style = {};
        style.color = this.getPreviousMarksColumnMarkSchemeColor(counter, worklistType, responseMode, seedTypeId, markGroupId, allMarksAndAnnotation, previousRemarkBaseColor);
        // current marks
        if (counter === 0) {
            label = this.getResourceText('marking.response.previous-marks.current-marks');
            showCheckbox = false;
            if (responseMode !== enums.ResponseMode.closed) {
                style.color = remarkBaseColor;
            }
        }
        else if (counter === allMarksAndAnnotationsCount) {
            if (this.doShowDefenitiveHeader(isClosedEurSeed, isClosedLiveSeed, worklistType, responseMode)) {
                // Definitive Marking
                label = this.getResourceText('marking.response.previous-marks.definitive-marking-long');
                header = this.getResourceText('marking.response.previous-marks.definitive-marking-short');
                isDefinitive = true;
            }
            else {
                if (marksAndAnnotation.directed) {
                    // Directed remarks
                    label = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.long-names.');
                    header = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.short-names.');
                }
                else {
                    // First Marking
                    label = this.getResourceText('marking.response.previous-marks.first-marking-long');
                    header = this.getResourceText('marking.response.previous-marks.first-marking-short');
                }
            }
        }
        else {
            label = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.long-names.');
            header = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.short-names.');
        }
        if (markedBy !== undefined && markedBy !== null && markedBy.trim() !== '' && isDefinitive === false) {
            label = label + ' (' + markedBy + ')';
        }
        markSchemeHeader = markSchemeHeader.set('label', label);
        markSchemeHeader = markSchemeHeader.set('header', header);
        markSchemeHeader = markSchemeHeader.set('style', style);
        markSchemeHeader = markSchemeHeader.set('isMarksVisible', isMarksVisible);
        markSchemeHeader = markSchemeHeader.set('isAnnotationVisible', isAnnotationVisible);
        markSchemeHeader = markSchemeHeader.set('showCheckbox', showCheckbox);
        markSchemeHeader = markSchemeHeader.set('isDefinitive', isDefinitive);
        markSchemeHeader = markSchemeHeader.set('isEnhancedOffpageCommentVisible', enhancedOffpageCommentVisible);
        markSchemeHeader = markSchemeHeader.set('marksAndAnnotations', marksAndAnnotation);
        markSchemeHeader = markSchemeHeader.set('markedBy', markedBy);
        markSchemeHeader = markSchemeHeader.set('previousRemarkBaseColor', style.color);
        return markSchemeHeader;
    };
    /**
     * set the visibility status for the marks and annotation
     * @param allMarksAndAnnotations
     * @param markGroupId
     */
    MarksAndAnnotationsVisibilityHelper.setMarksAndAnnotationsVisibility = function (allMarksAndAnnotations, markGroupId, responseMode, worklistType) {
        var _this = this;
        var info;
        var infos = Immutable.Map();
        if (allMarksAndAnnotations) {
            // Filtering all the marks and annotations collection with Is Default indicator set to true
            var allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter(function (x) { return x.isDefault === true; });
            // Selecting the latest submitted one alone from the above filtered collection
            var lastSubmittedMarksAndAnnotationsWithIsDefault_1 = allMarksAndAnnotationsWithIsDefault && allMarksAndAnnotationsWithIsDefault.length > 0 ?
                allMarksAndAnnotationsWithIsDefault[0] : undefined;
            allMarksAndAnnotations.map(function (item, index) {
                var enhancedOffPageCommentStatus = index === 0;
                // set visibility for all the items if there is no default indicator set for the collection
                if (!lastSubmittedMarksAndAnnotationsWithIsDefault_1) {
                    if (index === 1 && worklistType === enums.WorklistType.practice &&
                        responseMode === enums.ResponseMode.open) {
                        info = _this.setMarkAndAnnotationVisiblity(false, enhancedOffPageCommentStatus);
                    }
                    else {
                        info = _this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus);
                    }
                }
                else if (index === 0) {
                    // current marks and annotations. default value will be true for visiblity of marks and annotations
                    info = _this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus);
                }
                else {
                    // set the default visibility from the server
                    if (item.markGroupId === lastSubmittedMarksAndAnnotationsWithIsDefault_1.markGroupId) {
                        info = _this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus);
                    }
                    else {
                        info = _this.setMarkAndAnnotationVisiblity(false, enhancedOffPageCommentStatus);
                    }
                }
                info.markGroupId = item.markGroupId;
                infos = infos.set(index, info);
            });
            return infos;
        }
    };
    /**
     * gets color for previous marks
     * /
     * @param index
     * @param worklistType
     * @param seedTypeId
     * @param responseMode
     */
    MarksAndAnnotationsVisibilityHelper.getPreviousMarksColumnMarkSchemeColor = function (index, worklistType, responseMode, seedTypeId, markGroupId, allMarksAndAnnotation, previousRemarkBaseColor) {
        var annotations = allMarksAndAnnotation.annotations;
        var showRemarkColor = this.doShowMarkSchemeInColor(worklistType, responseMode, seedTypeId, index);
        var showGreyColor = this.doShowGreyColor(worklistType, responseMode, seedTypeId, index);
        // getting previous marks color
        if ((annotations.length > 0 && showRemarkColor) || showGreyColor) {
            // Grey Color
            var red = 128;
            var green = 128;
            var blue = 128;
            //If we want to show grey color only we dont need to assign the annotations colors
            if (!showGreyColor) {
                for (var i = 0; i < annotations.length; i++) {
                    if (annotations[i].stamp !== enums.DynamicAnnotation.Highlighter) {
                        red = annotations[i].red;
                        green = annotations[i].green;
                        blue = annotations[i].blue;
                        break;
                    }
                }
            }
            return 'rgb(' + red + ',' + green + ',' + blue + ')';
        }
        else {
            // returns previous remark base color when no annotations stamped aganist the response.
            return previousRemarkBaseColor;
        }
    };
    /**
     * determines previous mark color is needed.
     * @param worklistType
     * @param responseMode
     * @param seedTypeId
     * @param index
     */
    MarksAndAnnotationsVisibilityHelper.doShowMarkSchemeInColor = function (worklistType, responseMode, seedTypeId, index) {
        var doFetchPreviousMarksColor = false;
        if ((worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark)
            && (responseMode === enums.ResponseMode.open || responseMode === enums.ResponseMode.pending)) {
            doFetchPreviousMarksColor = true;
        }
        else if ((worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark)
            && responseMode === enums.ResponseMode.closed && seedTypeId !== enums.SeedType.EUR) {
            doFetchPreviousMarksColor = true;
        }
        else if (index === 0) {
            // for current marks
            doFetchPreviousMarksColor = true;
        }
        return doFetchPreviousMarksColor;
    };
    /**
     * determines grey color is needed.
     * @param worklistType
     * @param responseMode
     * @param seedTypeId
     * @param index
     */
    MarksAndAnnotationsVisibilityHelper.doShowGreyColor = function (worklistType, responseMode, seedTypeId, index) {
        if ((worklistType === enums.WorklistType.practice
            || worklistType === enums.WorklistType.standardisation
            || worklistType === enums.WorklistType.secondstandardisation
            || ((worklistType === enums.WorklistType.directedRemark
                || worklistType === enums.WorklistType.pooledRemark
                || worklistType === enums.WorklistType.live)
                && (responseMode === enums.ResponseMode.closed ||
                    (responseMode === enums.ResponseMode.open &&
                        userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement))
                && seedTypeId !== enums.SeedType.None))
            && index !== 0) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * set the visiblity of the marks and annotations and return the object
     * @param status
     */
    MarksAndAnnotationsVisibilityHelper.setMarkAndAnnotationVisiblity = function (status, enhancedOffpageCommentStatus) {
        var item = new marksAndAnnotationsVisibilityInfo();
        item.isAnnotationVisible = status;
        item.isMarkVisible = status;
        item.isEnhancedOffpageCommentVisible = enhancedOffpageCommentStatus;
        return item;
    };
    /**
     * Returns whether the marks column's visibility has been switched
     * @param index
     * @param visibilityInfo
     * @param marksAndAnnotationVisibilityDetails
     */
    MarksAndAnnotationsVisibilityHelper.isMarksColumnVisibilitySwitched = function (index, visibilityInfo, marksAndAnnotationVisibilityDetails, markGroupId) {
        var _visibilityInfoMap = marksAndAnnotationVisibilityDetails.get(markGroupId);
        if (_visibilityInfoMap.get(index).isMarkVisible !== visibilityInfo.isMarkVisible) {
            return true;
        }
        return false;
    };
    /**
     * update the visibility status of marks and annotation collection
     * @param index
     * @param visibilityInfo
     */
    MarksAndAnnotationsVisibilityHelper.updateMarksAndAnnotationVisibilityStatus = function (index, visibilityInfo, marksAndAnnotationVisibilityDetails, markGroupId) {
        var _visibilityInfoMap = marksAndAnnotationVisibilityDetails.get(markGroupId);
        _visibilityInfoMap = _visibilityInfoMap.set(index, visibilityInfo);
        return marksAndAnnotationVisibilityDetails = marksAndAnnotationVisibilityDetails.set(markGroupId, _visibilityInfoMap);
    };
    /**
     * gets text from resource file
     * @param remarkRequestTypeId
     * @param resourceKey
     */
    MarksAndAnnotationsVisibilityHelper.getResourceTextForRemarks = function (remarkRequestTypeId, resourceKey) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey
            + enums.RemarkRequestType[remarkRequestTypeId]), [constants.NONBREAKING_HYPHEN_UNICODE]);
    };
    /**
     * gets text from resource file
     * @param resourceKey
     */
    MarksAndAnnotationsVisibilityHelper.getResourceText = function (resourceKey) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey), [constants.NONBREAKING_HYPHEN_UNICODE]);
    };
    /**
     * determines the need of defenitive header.
     * @param isClosedLiveSeed
     * @param isClosedEurSeed
     */
    MarksAndAnnotationsVisibilityHelper.doShowDefenitiveHeader = function (isClosedLiveSeed, isClosedEurSeed, worklistType, responseMode) {
        return worklistType === enums.WorklistType.practice ||
            (responseMode === enums.ResponseMode.closed ||
                (responseMode === enums.ResponseMode.open
                    && userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement))
                && (worklistType === enums.WorklistType.standardisation ||
                    worklistType === enums.WorklistType.secondstandardisation) ||
            isClosedLiveSeed || isClosedEurSeed;
    };
    /**
     * gets current annotation visibility
     */
    MarksAndAnnotationsVisibilityHelper.isCurrentAnnotaionsVisible = function (marksAndAnnotationVisibilityDetails, markGroupId) {
        var visibilityList = this.getMarksAndAnnotaionVisibilityByIndex(0, marksAndAnnotationVisibilityDetails, markGroupId);
        if (visibilityList.isAnnotationVisible) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * set marks and annoation visibility on stamp seletion drag.
     */
    MarksAndAnnotationsVisibilityHelper.setMarksAndAnnotationVisibilityOnStampSelectionOrDrag = function (marksAndAnnotationVisibilityDetails, markGroupId) {
        var visibilityDetails = this.getMarksAndAnnotaionVisibilityByIndex(0, marksAndAnnotationVisibilityDetails, markGroupId);
        if (visibilityDetails) {
            if (!visibilityDetails.isAnnotationVisible) {
                visibilityDetails.isAnnotationVisible = true;
                this.updateMarksAndAnnotationVisibilityStatus(0, visibilityDetails, marksAndAnnotationVisibilityDetails, markGroupId);
            }
        }
    };
    /**
     * get Marks And Annotaion Visibility By Index.
     * @param index
     */
    MarksAndAnnotationsVisibilityHelper.getMarksAndAnnotaionVisibilityByIndex = function (index, marksAndAnnotationVisibilityDetails, markGroupId) {
        if (marksAndAnnotationVisibilityDetails && marksAndAnnotationVisibilityDetails.count() > 0) {
            return marksAndAnnotationVisibilityDetails.get(markGroupId).get(index);
        }
    };
    /**
     * gets whether annotation is visible.
     * @param markGroupId
     * @param marksAndAnnotationVisibilityDetails
     * @param preMarkGroupId
     */
    MarksAndAnnotationsVisibilityHelper.isAnnotationVisible = function (currentMarkGroupId, marksAndAnnotationVisibilityDetails, annotationMarkGroupId) {
        var visibilityDetails = marksAndAnnotationVisibilityDetails.get(currentMarkGroupId);
        var isAnnotationVisible = false;
        visibilityDetails.map(function (item) {
            var relatedMarkgroupIds = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId);
            if (item.isMarkVisible && (item.markGroupId === annotationMarkGroupId ||
                relatedMarkgroupIds.length > 0 && relatedMarkgroupIds.indexOf(annotationMarkGroupId) !== -1)) {
                isAnnotationVisible = item.isAnnotationVisible;
            }
        });
        return isAnnotationVisible;
    };
    /**
     * return the visibility info regarding the marks and annotation collection
     */
    MarksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo = function (marksAndAnnotationVisibilityDetails, markGroupId) {
        return marksAndAnnotationVisibilityDetails.get(markGroupId);
    };
    /**
     * Getting live closed annotation toggle button color.
     * @param allMarksAndAnnotation
     * @param defaultColor
     */
    MarksAndAnnotationsVisibilityHelper.getLiveClosedAnnotationToggleButtonColor = function (allMarksAndAnnotation, defaultColor, responseMode) {
        // for live marking
        var annotations = allMarksAndAnnotation[0].annotations;
        var red;
        var green;
        var blue;
        var showAnnotationColor = false;
        // getting current marks toggle button color .
        if (annotations.length > 0 && responseMode === enums.ResponseMode.closed) {
            for (var i = 0; i < annotations.length; i++) {
                if (annotations[i].stamp !== enums.DynamicAnnotation.Highlighter) {
                    showAnnotationColor = true;
                    red = annotations[i].red;
                    green = annotations[i].green;
                    blue = annotations[i].blue;
                    break;
                }
            }
            return showAnnotationColor ? 'rgb(' + red + ',' + green + ',' + blue + ')' : defaultColor;
        }
        else {
            return defaultColor;
        }
    };
    /**
     * Updates Enhanced offpage comment radio button selection status.
     */
    MarksAndAnnotationsVisibilityHelper.updateEnhancedOffpageComemntRadioButtonStatus = function (visiblityDetails, marksAndAnnotationVisibilityDetails, getMarksAndAnnotationVisibilityDetails, currentMarkGroupId, selectedMarkingIndex, selectedCommentindex, isMarksColumnVisibilitySwitched) {
        var updatedVisibilityDetails = marksAndAnnotationVisibilityDetails;
        visiblityDetails.map(function (item, index) {
            var visibilityInfo = new marksAndAnnotationsVisibilityInfo();
            visibilityInfo = MarksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, currentMarkGroupId).get(index);
            // Reset all comment radio buttons other than selected one
            if (index !== selectedMarkingIndex
                && !isMarksColumnVisibilitySwitched) {
                visibilityInfo.isEnhancedOffpageCommentVisible = false;
                updatedVisibilityDetails = MarksAndAnnotationsVisibilityHelper.
                    updateMarksAndAnnotationVisibilityStatus(index, visibilityInfo, getMarksAndAnnotationVisibilityDetails, currentMarkGroupId);
            }
            // Set currentmarks comments as selected on mark column hide.
            if (isMarksColumnVisibilitySwitched && (selectedMarkingIndex === selectedCommentindex)) {
                visibilityInfo.isEnhancedOffpageCommentVisible = (index === 0) ? true : false;
                updatedVisibilityDetails = MarksAndAnnotationsVisibilityHelper.
                    updateMarksAndAnnotationVisibilityStatus(index, visibilityInfo, getMarksAndAnnotationVisibilityDetails, currentMarkGroupId);
            }
        });
        return updatedVisibilityDetails;
    };
    return MarksAndAnnotationsVisibilityHelper;
}());
module.exports = MarksAndAnnotationsVisibilityHelper;
//# sourceMappingURL=marksandannotationsvisibilityhelper.js.map