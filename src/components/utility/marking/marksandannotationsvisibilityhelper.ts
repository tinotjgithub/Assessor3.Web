import React = require('react');
import Immutable = require('immutable');
import stringHelper = require('../../../utility/generic/stringhelper');
import constants = require('../../utility/constants');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
import marksAndAnnotationsVisibilityInfo = require('../../../components/utility/annotation/marksandannotationsvisibilityinfo');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import worklistStore = require('../../../stores/worklist/workliststore');
import qigStore = require('../../../stores/qigselector/qigstore');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import awardingStore =  require('../../../stores/awarding/awardingstore');

// We couldn't implement the markerOperationMode factory logic here due to the circular dependency issues. (markingstore)


class MarksAndAnnotationsVisibilityHelper {

    /**
     * content for markscheme header and header dropdown
     * @param counter
     * @param marksAndAnnotation
     * @param allMarksAndAnnotationsCount
     * @param visibilityInfos
     * @param isClosedEurSeed
     * @param isClosedLiveSeed
     * @param remarkBaseColor
     * @param responseMode
     * @param seedTypeId
     * @param markGroupId
     * @param worklistType
     * @param allMarksAndAnnotation
     * @param previousRemarkBaseColor
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    public static getMarkSchemePanelColumnHeaderAttributes(
        counter: number,
        marksAndAnnotation: any,
        allMarksAndAnnotationsCount: number,
        visibilityInfos: any,
        isClosedEurSeed: boolean,
        isClosedLiveSeed: boolean,
        remarkBaseColor: string,
        responseMode: enums.ResponseMode,
        seedTypeId: enums.SeedType,
        markGroupId: number,
        worklistType: enums.WorklistType,
        allMarksAndAnnotation: any,
        previousRemarkBaseColor: string,
        canRenderPreviousMarksInStandardisationSetup: boolean) {
        let label: string = '';
        let header;
        let isMarksVisible = visibilityInfos.get(counter).isMarkVisible;
        let isAnnotationVisible = visibilityInfos.get(counter).isAnnotationVisible;
        let enhancedOffpageCommentVisible = visibilityInfos.get(counter).isEnhancedOffpageCommentVisible;
        let markedBy = marksAndAnnotation.markedBySurname === null ? undefined :
            marksAndAnnotation.markedByInitials + ' ' + marksAndAnnotation.markedBySurname;
        let markSchemeHeader: Immutable.Map<string, any> = Immutable.Map<string, any>();
        let remarkRequestTypeId = marksAndAnnotation.remarkRequestTypeId;
        let showCheckbox = true;
        let isDefinitive = false;
        let style: React.CSSProperties = {};
        style.color = this.getPreviousMarksColumnMarkSchemeColor(counter, worklistType, responseMode, seedTypeId,
            markGroupId, allMarksAndAnnotation, previousRemarkBaseColor, canRenderPreviousMarksInStandardisationSetup);

        if (canRenderPreviousMarksInStandardisationSetup) {
            if (counter === 0) {
                label = this.getResourceText('marking.response.previous-marks.definitive-marking-long');
                showCheckbox = false;
                if (responseMode !== enums.ResponseMode.closed) {
                    style.color = remarkBaseColor;
                }
            } else if (counter === 1) {
                label = this.getResourceText('marking.response.previous-marks.provisional-marking-long');
                header = this.getResourceText('marking.response.previous-marks.provisional-marking-short');
                let provisionalMarkedBy = null;
                let standardisationResponseData = standardisationSetupStore.instance.fetchStandardisationResponseData();
                if (standardisationResponseData) {
                    provisionalMarkedBy = standardisationResponseData.provisionalMarkerInitials + ' ' +
                        standardisationResponseData.provisionalMarkerSurname;
                }
                if (provisionalMarkedBy !== null) {
                    label = label + ' (' + provisionalMarkedBy + ')';
                }
            }
        } else {
            // current marks
            if (counter === 0) {
                label = this.getResourceText('marking.response.previous-marks.current-marks');
                showCheckbox = false;
                if (responseMode !== enums.ResponseMode.closed) {
                    style.color = remarkBaseColor;
                }
            } else if (counter === allMarksAndAnnotationsCount) {
                if (this.doShowDefenitiveHeader(isClosedEurSeed, isClosedLiveSeed, worklistType, responseMode)) {
                    // Definitive Marking
                    label = this.getResourceText('marking.response.previous-marks.definitive-marking-long');
                    header = this.getResourceText('marking.response.previous-marks.definitive-marking-short');
                    isDefinitive = true;
                } else {
                    if (marksAndAnnotation.directed) {
                        // Directed remarks
                        label = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.long-names.');
                        header = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.short-names.');
                    } else {
                        // First Marking
                        label = this.getResourceText('marking.response.previous-marks.first-marking-long');
                        header = this.getResourceText('marking.response.previous-marks.first-marking-short');
                    }
                }
            } else {
                label = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.long-names.');
                header = this.getResourceTextForRemarks(remarkRequestTypeId, 'generic.remark-types.short-names.');
            }

            if (markedBy !== undefined && markedBy !== null && markedBy.trim() !== '' && isDefinitive === false) {
                label = label + ' (' + markedBy + ')';
            }
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
    }

    /**
     * set the visibility status for the marks and annotation
     * @param allMarksAndAnnotations
     * @param markGroupId
     * @param responseMode
     * @param worklistType
     * @param doShowPreviousMarkInStandardisationSetup
     */
    public static setMarksAndAnnotationsVisibility(allMarksAndAnnotations: any,
        markGroupId: number,
        responseMode: enums.ResponseMode,
        worklistType: enums.WorklistType, canRenderPreviousMarksInStandardisationSetup: boolean) {
        let info: marksAndAnnotationsVisibilityInfo;
        let infos: Immutable.Map<number, marksAndAnnotationsVisibilityInfo> = Immutable.Map<number, marksAndAnnotationsVisibilityInfo>();
        if (allMarksAndAnnotations) {
            // Filtering all the marks and annotations collection with Is Default indicator set to true
            let allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter((x: any) => x.isDefault === true);

            // Selecting the latest submitted one alone from the above filtered collection
            let lastSubmittedMarksAndAnnotationsWithIsDefault =
                allMarksAndAnnotationsWithIsDefault && allMarksAndAnnotationsWithIsDefault.length > 0 ?
                    allMarksAndAnnotationsWithIsDefault[0] : undefined;


            allMarksAndAnnotations.map((item: any, index: number) => {
                let enhancedOffPageCommentStatus: boolean = index === 0;
                if (canRenderPreviousMarksInStandardisationSetup) {
                    let examinerRoleId = MarksAndAnnotationsVisibilityHelper.getExaminerRoleId(index);
                    if (index === 0) {
                        info = this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus, examinerRoleId);
                    } else if (index === 1) {
                        info = this.setMarkAndAnnotationVisiblity(false, enhancedOffPageCommentStatus, examinerRoleId);
                    }
                } else {
                    // set visibility for all the items if there is no default indicator set for the collection
                    if (!lastSubmittedMarksAndAnnotationsWithIsDefault) {
                        if (index === 1 && worklistType === enums.WorklistType.practice &&
                            responseMode === enums.ResponseMode.open) {
                            info = this.setMarkAndAnnotationVisiblity(false, enhancedOffPageCommentStatus);
                        } else {
                            info = this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus);
                        }
                    } else if (index === 0) {
                        // current marks and annotations. default value will be true for visiblity of marks and annotations
                        info = this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus);
                    } else {
                        // set the default visibility from the server
                        if (item.markGroupId === lastSubmittedMarksAndAnnotationsWithIsDefault.markGroupId) {
                            info = this.setMarkAndAnnotationVisiblity(true, enhancedOffPageCommentStatus);
                        } else {
                            info = this.setMarkAndAnnotationVisiblity(false, enhancedOffPageCommentStatus);
                        }
                    }
                }

                info.markGroupId = item.markGroupId;

                infos = infos.set(index, info);
            });

            return infos;
        }
    }

    /**
     * gets color for previous marks
     * @param index
     * @param worklistType
     * @param responseMode
     * @param seedTypeId
     * @param markGroupId
     * @param allMarksAndAnnotation
     * @param previousRemarkBaseColor
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    public static getPreviousMarksColumnMarkSchemeColor(index: number, worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode, seedTypeId: enums.SeedType, markGroupId: number, allMarksAndAnnotation: any,
        previousRemarkBaseColor: string, canRenderPreviousMarksInStandardisationSetup: boolean): string {

        let annotations = allMarksAndAnnotation.annotations;
        let showRemarkColor: boolean = this.doShowMarkSchemeInColor(worklistType, responseMode, seedTypeId, index);
        let showGreyColor: boolean = this.doShowGreyColor(worklistType, responseMode, seedTypeId,
            index, canRenderPreviousMarksInStandardisationSetup);

        // getting previous marks color
        if ((annotations.length > 0 && showRemarkColor) || showGreyColor) {

            // Grey Color
            let red = 128;
            let green = 128;
            let blue = 128;

            //If we want to show grey color only we dont need to assign the annotations colors
            if (!showGreyColor) {
                for (let i = 0; i < annotations.length; i++) {
                    if (annotations[i].stamp !== enums.DynamicAnnotation.Highlighter) {
                        red = annotations[i].red;
                        green = annotations[i].green;
                        blue = annotations[i].blue;
                        break;
                    }
                }
            }

            return 'rgb(' + red + ',' + green + ',' + blue + ')';
        } else {
            // returns previous remark base color when no annotations stamped aganist the response.
            return previousRemarkBaseColor;
        }
    }

    /**
     * determines previous mark color is needed.
     * @param worklistType
     * @param responseMode
     * @param seedTypeId
     * @param index
     */
    private static doShowMarkSchemeInColor(worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        seedTypeId: enums.SeedType, index: number): boolean {
        let doFetchPreviousMarksColor: boolean = false;
        if ((worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark)
            && (responseMode === enums.ResponseMode.open || responseMode === enums.ResponseMode.pending)) {
            doFetchPreviousMarksColor = true;
        } else if ((worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark)
            && responseMode === enums.ResponseMode.closed && seedTypeId !== enums.SeedType.EUR) {
            doFetchPreviousMarksColor = true;
        } else if (index === 0) {
            // for current marks
            doFetchPreviousMarksColor = true;
        }
        return doFetchPreviousMarksColor;
    }

    /**
     * determines grey color is needed.
     * @param worklistType
     * @param responseMode
     * @param seedTypeId
     * @param index
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    private static doShowGreyColor(worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode,
        seedTypeId: enums.SeedType,
        index: number, canRenderPreviousMarksInStandardisationSetup: boolean): boolean {

        if (canRenderPreviousMarksInStandardisationSetup) {
            return true;
        }

        if ((worklistType === enums.WorklistType.practice
            || worklistType === enums.WorklistType.standardisation
            || worklistType === enums.WorklistType.secondstandardisation
            || (
                (
                    worklistType === enums.WorklistType.directedRemark
                    || worklistType === enums.WorklistType.pooledRemark
                    || worklistType === enums.WorklistType.live
                )
                && (responseMode === enums.ResponseMode.closed ||
                    (responseMode === enums.ResponseMode.open &&
                        userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement))
                && seedTypeId !== enums.SeedType.None
            ))
            && index !== 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * set the visiblity of the marks and annotations and return the object
     * @param status
     */
    private static setMarkAndAnnotationVisiblity(status: boolean,
        enhancedOffpageCommentStatus: boolean, examinerRoleId: number = 0): marksAndAnnotationsVisibilityInfo {
        let item: marksAndAnnotationsVisibilityInfo = new marksAndAnnotationsVisibilityInfo();
        item.isAnnotationVisible = status;
        item.isMarkVisible = status;
        item.isEnhancedOffpageCommentVisible = enhancedOffpageCommentStatus;
        item.examinerRoleId = examinerRoleId;
        return item;
    }

    /**
     * Returns whether the marks column's visibility has been switched
     * @param index
     * @param visibilityInfo
     * @param marksAndAnnotationVisibilityDetails
     */
    public static isMarksColumnVisibilitySwitched(
        index: number,
        visibilityInfo: marksAndAnnotationsVisibilityInfo,
        marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        markGroupId: number): boolean {
        let _visibilityInfoMap = marksAndAnnotationVisibilityDetails.get(markGroupId);
        if (_visibilityInfoMap.get(index).isMarkVisible !== visibilityInfo.isMarkVisible) {
            return true;
        }
        return false;
    }

    /**
     * update the visibility status of marks and annotation collection
     * @param index
     * @param visibilityInfo
     */
    public static updateMarksAndAnnotationVisibilityStatus(
        index: number,
        visibilityInfo: marksAndAnnotationsVisibilityInfo,
        marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        markGroupId: number) {
        visibilityInfo.examinerRoleId = MarksAndAnnotationsVisibilityHelper.getExaminerRoleId(index);
        let _visibilityInfoMap = marksAndAnnotationVisibilityDetails.get(markGroupId);
        _visibilityInfoMap = _visibilityInfoMap.set(index, visibilityInfo);
        return marksAndAnnotationVisibilityDetails = marksAndAnnotationVisibilityDetails.set(
            markGroupId, _visibilityInfoMap);
    }

    /**
     * gets text from resource file
     * @param remarkRequestTypeId
     * @param resourceKey
     */
    private static getResourceTextForRemarks(remarkRequestTypeId: number, resourceKey: string) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey
            + enums.RemarkRequestType[remarkRequestTypeId]),
            [constants.NONBREAKING_HYPHEN_UNICODE]);
    }

    /**
     * gets text from resource file
     * @param resourceKey
     */
    private static getResourceText(resourceKey: string) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey),
            [constants.NONBREAKING_HYPHEN_UNICODE]);
    }

    /**
     * determines the need of defenitive header.
     * @param isClosedLiveSeed
     * @param isClosedEurSeed
     */
    public static doShowDefenitiveHeader(
        isClosedLiveSeed: boolean,
        isClosedEurSeed: boolean,
        worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode): boolean {
        return worklistType === enums.WorklistType.practice ||
            (responseMode === enums.ResponseMode.closed ||
                (responseMode === enums.ResponseMode.open
                    && userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement))
            && (worklistType === enums.WorklistType.standardisation ||
                worklistType === enums.WorklistType.secondstandardisation) ||
            isClosedLiveSeed || isClosedEurSeed;
    }

    /**
     * gets current annotation visibility
     */
    public static isCurrentAnnotaionsVisible(
        marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        markGroupId: number): boolean {
        let visibilityList: marksAndAnnotationsVisibilityInfo =
            this.getMarksAndAnnotaionVisibilityByIndex(0,
                marksAndAnnotationVisibilityDetails,
                markGroupId);
        if (visibilityList.isAnnotationVisible) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * set marks and annoation visibility on stamp seletion drag.
     */
    public static setMarksAndAnnotationVisibilityOnStampSelectionOrDrag(
        marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        markGroupId: number) {
        let visibilityDetails: marksAndAnnotationsVisibilityInfo =
            this.getMarksAndAnnotaionVisibilityByIndex(0,
                marksAndAnnotationVisibilityDetails,
                markGroupId);
        if (visibilityDetails) {
            if (!visibilityDetails.isAnnotationVisible) {
                visibilityDetails.isAnnotationVisible = true;
                this.updateMarksAndAnnotationVisibilityStatus(0, visibilityDetails,
                    marksAndAnnotationVisibilityDetails, markGroupId);
            }
        }
    }

    /**
     * get Marks And Annotaion Visibility By Index.
     * @param index
     */
    public static getMarksAndAnnotaionVisibilityByIndex(
        index: number,
        marksAndAnnotationVisibilityDetails: Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        markGroupId: number):
        marksAndAnnotationsVisibilityInfo {
        if (marksAndAnnotationVisibilityDetails && marksAndAnnotationVisibilityDetails.count() > 0) {
            return marksAndAnnotationVisibilityDetails.get(markGroupId).get(index);
        }
    }

    /**
     * gets whether annotation is visible.
     * @param currentMarkGroupId
     * @param marksAndAnnotationVisibilityDetails
     * @param annotationMarkGroupId
     * @param annotationExaminerRoleId
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    public static isAnnotationVisible(
        currentMarkGroupId: number,
        marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        annotationMarkGroupId: number, annotationExaminerRoleId: number,
        canRenderPreviousMarksInStandardisationSetup: boolean , isFromAwaring : boolean = false ): boolean {
        let visibilityDetails = marksAndAnnotationVisibilityDetails.get(currentMarkGroupId);
        let isAnnotationVisible: boolean = false;

        if (canRenderPreviousMarksInStandardisationSetup) {
            visibilityDetails.map((item: marksAndAnnotationsVisibilityInfo) => {
                if (item.isMarkVisible && item.examinerRoleId === annotationExaminerRoleId) {
                    isAnnotationVisible = item.isAnnotationVisible;
                }
            });
        } else {
            visibilityDetails.map((item: marksAndAnnotationsVisibilityInfo) => {
                let relatedMarkgroupIds = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId);

                if (isFromAwaring){
                   relatedMarkgroupIds = awardingStore.instance.getRelatedMarkGroupIdForAwarding();
                }

                if (item.isMarkVisible && (item.markGroupId === annotationMarkGroupId ||
                    relatedMarkgroupIds.length > 0 && relatedMarkgroupIds.indexOf(annotationMarkGroupId) !== -1)) {
                    isAnnotationVisible = item.isAnnotationVisible;
                }
            });
        }

        return isAnnotationVisible;
    }

    /**
     * return the visibility info regarding the marks and annotation collection
     */
    public static getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails:
        Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        markGroupId: number):
        Immutable.Map<number, marksAndAnnotationsVisibilityInfo> {
        return marksAndAnnotationVisibilityDetails.get(markGroupId);
    }

    /**
     * Getting live closed annotation toggle button color.
     * @param allMarksAndAnnotation
     * @param defaultColor
     */
    public static getLiveClosedAnnotationToggleButtonColor(allMarksAndAnnotation: any,
        defaultColor: string,
        responseMode: enums.ResponseMode) {
        // for live marking
        let annotations = allMarksAndAnnotation[0].annotations;
        let red; let green; let blue;
        let showAnnotationColor: boolean = false;
        // getting current marks toggle button color .
        if (annotations.length > 0 && responseMode === enums.ResponseMode.closed) {
            for (let i = 0; i < annotations.length; i++) {
                if (annotations[i].stamp !== enums.DynamicAnnotation.Highlighter) {
                    showAnnotationColor = true;
                    red = annotations[i].red;
                    green = annotations[i].green;
                    blue = annotations[i].blue;
                    break;
                }
            }
            return showAnnotationColor ? 'rgb(' + red + ',' + green + ',' + blue + ')' : defaultColor;
        } else {
            return defaultColor;
        }
    }

    /**
     * Updates Enhanced offpage comment radio button selection status.
     */
    public static updateEnhancedOffpageComemntRadioButtonStatus(visiblityDetails: Immutable.Map<number, marksAndAnnotationsVisibilityInfo>,
        marksAndAnnotationVisibilityDetails: Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        getMarksAndAnnotationVisibilityDetails: Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>,
        currentMarkGroupId: number,
        selectedMarkingIndex: number,
        selectedCommentindex: number,
        isMarksColumnVisibilitySwitched: boolean): Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>> {
        let updatedVisibilityDetails: Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>> =
            marksAndAnnotationVisibilityDetails;
        visiblityDetails.map((item: marksAndAnnotationsVisibilityInfo, index: number) => {
            let visibilityInfo: marksAndAnnotationsVisibilityInfo = new marksAndAnnotationsVisibilityInfo();
            visibilityInfo = MarksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
                    currentMarkGroupId).get(index);
            // Reset all comment radio buttons other than selected one
            if (index !== selectedMarkingIndex
                && !isMarksColumnVisibilitySwitched) {
                visibilityInfo.isEnhancedOffpageCommentVisible = false;
                updatedVisibilityDetails = MarksAndAnnotationsVisibilityHelper.
                    updateMarksAndAnnotationVisibilityStatus(
                        index,
                        visibilityInfo,
                        getMarksAndAnnotationVisibilityDetails,
                        currentMarkGroupId);
            }
            // Set currentmarks comments as selected on mark column hide.
            if (isMarksColumnVisibilitySwitched && (selectedMarkingIndex === selectedCommentindex)) {
                visibilityInfo.isEnhancedOffpageCommentVisible = (index === 0) ? true : false;
                updatedVisibilityDetails = MarksAndAnnotationsVisibilityHelper.
                    updateMarksAndAnnotationVisibilityStatus(
                        index,
                        visibilityInfo,
                        getMarksAndAnnotationVisibilityDetails,
                        currentMarkGroupId);
            }
        });
        return updatedVisibilityDetails;
    }

    /**
     * return examiner role id
     * @param index
     */
    private static getExaminerRoleId(index: number): number {
        let examinerRoleId = 0;
        let canRenderPreviousMarksInStandardisationSetup = false;
        let selectedStandardisationSetupWorkList = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
        if (selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse ||
            selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse) {
            canRenderPreviousMarksInStandardisationSetup = true;
        }

        // we will check annotation and mark visibility based on examiner role for standardisation setup as
        // we are having same markgroupid for classified and unclassified responses
        if (canRenderPreviousMarksInStandardisationSetup) {
            let standardisationResponseData = standardisationSetupStore.instance.fetchStandardisationResponseData();
            if (standardisationResponseData) {
                examinerRoleId = standardisationResponseData.examinerRoleId;
            }

            // we need to set previous marker examiner role id if we are showing previous marks and
            // annotation in Standerdisation setup unclassified screen
            if (index === 1) {
                return examinerRoleId;
            } else {
                return qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            }
        } else {
            return 0;
        }
    }
}

export = MarksAndAnnotationsVisibilityHelper;