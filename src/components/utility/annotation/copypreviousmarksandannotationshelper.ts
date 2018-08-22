import React = require('react');
import markingStore = require('../../../stores/marking/markingstore');
import annotation = require('../../../stores/response/typings/annotation');
import Immutable = require('immutable');
import enums = require('../enums');
import qigStore = require('../../../stores/qigselector/qigstore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import responseStore = require('../../../stores/response/responsestore');
import worklistStore = require('../../../stores/worklist/workliststore');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import constants = require('../constants');
import stampStore = require('../../../stores/stamp/stampstore');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import messageStore = require('../../../stores/message/messagestore');
import initCoordinates = require('../../response/annotations/typings/initcoordinates');
import colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
import examinerMarksAndAnnotation = require('../../../stores/response/typings/examinermarksandannotation');
import annotationHelper = require('./annotationhelper');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import examinerMark = require('../../../stores/response/typings/examinermark');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import EnhancedOffPageComment = require('../../../stores/response/typings/enhancedoffpagecomment');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import Promise = require('es6-promise');

class CopyPreviousMarksAndAnnotationsHelper {
    /**
     * Copying previous marks and annotations
     */
    public static copyPreviousMarksAndAnnotations(callBack?: Function) {
        let allMarkSchemGroupIds = markingStore.instance.getRelatedWholeResponseQIGIds();
        let markSchemeGroupIndex = 0;
        // Loop through each qig to copy the previous marks and annotations in the case of a whole response.
        do {
            let markGroupId = 0;
            let markSchemeGroupId: number = 0;
            if (allMarkSchemGroupIds && allMarkSchemGroupIds.length > 0) {
                markGroupId = markingStore.instance.getMarkGroupIdQIGtoRIGMap(allMarkSchemGroupIds[markSchemeGroupIndex]);
                markSchemeGroupId = allMarkSchemGroupIds[markSchemeGroupIndex];
            } else {
                markGroupId = markingStore.instance.currentMarkGroupId;
                markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
            }
            // getting previous marks and annotation to copy
            let _examinerMarksAndAnnotation: examinerMarksAndAnnotation =
                CopyPreviousMarksAndAnnotationsHelper.getPrevMarksAndAnnotationsToCopy(markGroupId);
            if (_examinerMarksAndAnnotation) {
                markingStore.instance.copyPreviousMarks(markGroupId);
                // reset the value when previous marks and annotation are copied.
                let annotations = _examinerMarksAndAnnotation.annotations.map((_annotation: annotation) => {
                    let newAnnotation: annotation = CopyPreviousMarksAndAnnotationsHelper.getAnnotationToCopy(_annotation,
                        markGroupId, markSchemeGroupId);
                    let stampName: string = enums.DynamicAnnotation[newAnnotation.stamp];
                    let cssProps: React.CSSProperties = colouredAnnotationsHelper.
                        createAnnotationStyle(newAnnotation, enums.DynamicAnnotation[stampName]);
                    let rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    newAnnotation.red = parseInt(rgba[0]);
                    newAnnotation.green = parseInt(rgba[1]);
                    newAnnotation.blue = parseInt(rgba[2]);
                    markingActionCreator.addNewlyAddedAnnotation(
                        newAnnotation,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        true // Avoid emit while copying. Should display the marks and annotations from the collection while rendering.
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
        } while (allMarkSchemGroupIds.length > markSchemeGroupIndex);
    }

    /**
     * Get previous mark and annotation to copy
     */
    public static getPrevMarksAndAnnotationsToCopy(markGroupId: number): examinerMarksAndAnnotation {
        let allMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
        if (allMarksAndAnnotations) {
            if (this.allowCopyPreviousMarks(markGroupId)) {
                let allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter((x: any) => x.isDefault === true);
                if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                    return allMarksAndAnnotationsWithIsDefault[0];
                } else {
                    return allMarksAndAnnotations[1];
                }
            }
        }

        return null;
    }

    /**
     * Returns true if StartWithEmptyMarkGroup is zero and marking progress is 0.
     */
    public static allowCopyPreviousMarks(markGroupId?: number): boolean {
        let canCopyPreviousMarks: boolean = false;
        if (markingStore.instance.currentResponseMode === enums.ResponseMode.open) {
            if (worklistStore.instance.isDirectedRemark) {
                let directedOpenWorklists: DirectedRemarkOpenWorklist = worklistStore.instance.getDirectedRemarkOpenWorklistDetails;
                if (directedOpenWorklists) {
                    let currentResponseDetail = directedOpenWorklists.responses.filter(
                        (x: DirectedRemarkOpenResponse) => x.markGroupId === markingStore.instance.currentMarkGroupId).first();
                    // if no marks and annotations exist in current response, allow copy if startWithEmptyMarkGroup is Zero
                    if (CopyPreviousMarksAndAnnotationsHelper.isMarkingNotStarted(markGroupId) &&
                        markingStore.instance.checkAnyAnnotationExist() === false) {
                        canCopyPreviousMarks = !currentResponseDetail.startWithEmptyMarkGroup;
                    }
                }
            } else {

                let pooledOpenWorklists: PooledRemarkOpenWorklist = worklistStore.instance.getPooledRemarkOpenWorklistDetails;
                if (pooledOpenWorklists) {
                    let currentResponseDetail = pooledOpenWorklists.responses.filter(
                        (x: PooledRemarkOpenResponse) => x.markGroupId === markingStore.instance.currentMarkGroupId).first();
                    // if no marks and annotations exist in current response, allow copy if startWithEmptyMarkGroup is Zero
                    if (CopyPreviousMarksAndAnnotationsHelper.isMarkingNotStarted(markGroupId) &&
                        markingStore.instance.checkAnyAnnotationExist() === false) {
                        canCopyPreviousMarks = !currentResponseDetail.startWithEmptyMarkGroup;
                    }
                }
            }
        }
        return canCopyPreviousMarks;
    }

    /**
     * Returns false if StartWithEmptyMarkGroup is zero.
     */
    public static canStartMarkingWithEmptyMarkGroup(): boolean {
        let canStartMarkingWithEmptyMarkGroup: boolean = false;
        if (markingStore.instance.currentResponseMode === enums.ResponseMode.open) {
            if (worklistStore.instance.isDirectedRemark) {
                let directedOpenWorklists: DirectedRemarkOpenWorklist = worklistStore.instance.getDirectedRemarkOpenWorklistDetails;
                if (directedOpenWorklists) {
                    let currentResponseDetail = directedOpenWorklists.responses.filter(
                        (x: DirectedRemarkOpenResponse) => x.markGroupId === markingStore.instance.currentMarkGroupId).first();
                    canStartMarkingWithEmptyMarkGroup = currentResponseDetail.startWithEmptyMarkGroup;
                }
            } else {

                let pooledOpenWorklists: PooledRemarkOpenWorklist = worklistStore.instance.getPooledRemarkOpenWorklistDetails;
                if (pooledOpenWorklists) {
                    let currentResponseDetail = pooledOpenWorklists.responses.filter(
                        (x: PooledRemarkOpenResponse) => x.markGroupId === markingStore.instance.currentMarkGroupId).first();
                    canStartMarkingWithEmptyMarkGroup = currentResponseDetail.startWithEmptyMarkGroup;
                }
            }
        }
        return canStartMarkingWithEmptyMarkGroup;
    }

    /**
     * Returns annotation object for copy.
     * @param _annotation
     * @param markGroupId
     * @param markSchemeGroupId
     */
    public static getAnnotationToCopy(_annotation: annotation, markGroupId: number, markSchemeGroupId, isDefinitive: boolean = false) {

        let rgbForRed: number = 255;
        let rgbForBlue: number = 0;
        let rgbForGreen: number = 0;
        let annotationColor;

        switch (_annotation.stamp) {
            case enums.DynamicAnnotation.Highlighter:
            case enums.DynamicAnnotation.Ellipse:
                annotationColor = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                if (annotationColor) {
                    [rgbForRed, rgbForGreen, rgbForBlue] = annotationHelper.getRGBColor(annotationColor);
                } else if (worklistStore.instance.getRemarkRequestType > 0) {
                    // if user option is not having any  color then get the base color from db if its a remark
                    let stampName: string = enums.DynamicAnnotation[_annotation.stamp];
                    let cssProps: React.CSSProperties = colouredAnnotationsHelper.
                        getRemarkBaseColor(enums.DynamicAnnotation[stampName]);
                    let rgb = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    rgbForRed = parseInt(rgb[0]);
                    rgbForGreen = parseInt(rgb[1]);
                    rgbForBlue = parseInt(rgb[2]);
                }
        }

        let newlyAddedAnnotation: annotation = {
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
    }

    /**
     * gets whether the marking is started or not
     * @param markGroupId
     */
    private static isMarkingNotStarted(markGroupId?: number) {
        let isMarkingNotStarted = false;
        let markItem = markingStore.instance.examinerMarksAgainstCurrentResponse;
        if (markItem !== null && markItem) {
            let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
            let examinerMarkGroupDetails = markItem.examinerMarkGroupDetails;
            // check the existance of marks and annotations for a specific mark group
            if (markGroupId && (examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].
                examinerMarksCollection.filter((examinerMarks: examinerMark) =>
                    (examinerMarks.markingOperation !== enums.MarkingOperation.deleted)).length === 0 ||
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].
                annotations.filter((annotation: annotation) =>
                    (annotation.markingOperation !== enums.MarkingOperation.deleted)).length === 0)) {
                return true;
            }

            // check the existance of marks and annotations, 
            // in case of whole response, check all respective mark group collections
            if (markGroupId === undefined &&
                (examinerMarkGroupDetails[currentMarkGroupId].allMarksAndAnnotations[0].
                    examinerMarksCollection.filter((examinerMarks: examinerMark) =>
                        (examinerMarks.markingOperation !== enums.MarkingOperation.deleted)).length !== 0 ||
                examinerMarkGroupDetails[currentMarkGroupId].allMarksAndAnnotations[0].
                    annotations.filter((annotation: annotation) =>
                            (annotation.markingOperation !== enums.MarkingOperation.deleted)).length !== 0)) {
                // if the current mark group has marks, then response is partially marked
                return false;
            } else if (markGroupId === undefined) {
                let markGroupIds: number[] = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId);
                for (let index = 0; index < markGroupIds.length; index++) {
                    let allMarksAndAnnotations = examinerMarkGroupDetails[markGroupIds[index]].allMarksAndAnnotations[0];
                    if (allMarksAndAnnotations.examinerMarksCollection.filter((examinerMarks: examinerMark) =>
                        (examinerMarks.markingOperation !== enums.MarkingOperation.deleted)).length !== 0 ||
                        allMarksAndAnnotations.examinerMarksCollection.filter((annotation: annotation) =>
                            (annotation.markingOperation !== enums.MarkingOperation.deleted)).length !== 0) {
                        // if any mark group has marks, then response is partially marked
                        return false;
                    }
                }
            }
            // if no marks and annotations exit, then the marking is not started
            return true;
        }
    }

    /**
     * Copy marks and annotation, as make it as definitive.
     * @param markGroupId
     */
    public static copyMarksAndAnnotationForUnClassified(markGroupId: number, isDefinitive: boolean, avoidEventEmit: boolean = false): void {
        let allMarksAndAnnotationsToCopy = JSON.parse(JSON.stringify(markingStore.instance.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0]));

        let examinerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
		let promiseCopy: any;

        if (allMarksAndAnnotationsToCopy) {
            let currentMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0];
            let markSchemeGroupId: number = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

             /* Copying marks for Copy Marks as definitive*/

            if (standardisationSetupStore.instance.fetchStandardisationResponseData().examinerRoleId !== examinerRoleId) {

				promiseCopy = markingActionCreator.copyMarksForDefinitive(true, isDefinitive, avoidEventEmit);

                /* Copying annotations for Copy Marks as definitive*/
                if (allMarksAndAnnotationsToCopy.annotations) {
                    allMarksAndAnnotationsToCopy.annotations.map((_annotation: annotation) => {
                        let newAnnotation: annotation = CopyPreviousMarksAndAnnotationsHelper.getAnnotationToCopy(_annotation,
                            markGroupId, markSchemeGroupId, true);
                        let stampName: string = enums.DynamicAnnotation[newAnnotation.stamp];
                        let cssProps: React.CSSProperties = colouredAnnotationsHelper.
                            createAnnotationStyle(newAnnotation, enums.DynamicAnnotation[stampName]);
                        let rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                        newAnnotation.red = parseInt(rgba[0]);
                        newAnnotation.green = parseInt(rgba[1]);
						newAnnotation.blue = parseInt(rgba[2]);
						newAnnotation.examinerRoleId = examinerRoleId;

						markingActionCreator.addNewlyAddedAnnotation(
                            newAnnotation,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            true // Avoid emit while copying. Should display the marks and annotations from the collection while rendering.
                        );
                    });
                }

			} else {
				promiseCopy = markingActionCreator.copyMarksForDefinitive(false, isDefinitive, avoidEventEmit);
            }
		}
		if (!avoidEventEmit) {
			Promise.Promise.all([promiseCopy]).then(function (data: any) {
				markingActionCreator.copiedPreviousMarksAndAnnotations();
			});
		}
	}

	/**
	 * Update the marks and annotation collection when multiple markers marking the same response before classify.
	 */
	public static updateDefinitiveMarkCollectionForDifferentMarkers(callback ?: Function): void {

		let currentExaminerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;

		let currentMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
			examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations[0];
		let promiseUpdate: any;
		// hold the count of provisional marks in the collection
		let provisionalMarks = currentMarksAndAnnotations.examinerMarksCollection.filter(
			(x: examinerMark) => x.definitiveMark === false && x.markingOperation === enums.MarkingOperation.none);
		if (provisionalMarks.length === 0) {
			provisionalMarks = currentMarksAndAnnotations.annotations.filter(
				(x: annotation) => x.definitiveMark === false && x.markingOperation === enums.MarkingOperation.none);
		}
		if (provisionalMarks.length === 0) {
			provisionalMarks = currentMarksAndAnnotations.enhancedOffPageComments.filter(
				(x: EnhancedOffPageComment) => x.isDefinitive === false && x.markingOperation === enums.MarkingOperation.none);
		}

		// If provisional Marker is not same as current marker and mark collection contains "No provisional marks"(Definitive = 0),
		// then update the current collection as Provisional Marks(this will be handled in SP) 
		// and Make a copy for Definitive mark with updated marks and examiner role id (update in the client collection).
		if (((standardisationSetupStore.instance.fetchStandardisationResponseData().examinerRoleId !== currentExaminerRoleId &&
			provisionalMarks.length === 0) ||
			(standardisationSetupStore.instance.fetchStandardisationResponseData().examinerRoleId !== currentExaminerRoleId &&
				provisionalMarks.length > 0))) {

			promiseUpdate = markingActionCreator.updateDefinitiveMarksForDifferentMarker(currentExaminerRoleId);
			Promise.Promise.all([promiseUpdate]).then(function (data: any) {
				if (callback) {
					callback();
				}
			});
		} else if ((standardisationSetupStore.instance.fetchStandardisationResponseData().examinerRoleId === currentExaminerRoleId &&
			provisionalMarks.length > 0)) {
			// Remove the provisional marks (Definitive = 0) from the collection when
			// the current marker is same as provisional marker and the collection contains Provisional Marks.
			promiseUpdate = markingActionCreator.updateDefinitiveMarksForDifferentMarker(currentExaminerRoleId, true);
			Promise.Promise.all([promiseUpdate]).then(function (data: any) {
				if (callback) {
					callback();
				}
			});
		} else {
			if (callback) {
				callback();
			}
		}
	}

	/**
	 * Delete the provisional marks if the current marker is same as Provisional Marker.
	 */
	public static deleteProvisionalMarksIfSameExaminer(): void {
		let examinerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
		// If the current marker choose the clear option from Mark as Definitive Popup, 
		// delete the provisional marks if the current marker is same as Provisional Marker.
		if (standardisationSetupStore.instance.fetchStandardisationResponseData().examinerRoleId === examinerRoleId) {
			markingActionCreator.deleteProvisionalMarksWhenSameMarker();
		}
	}
}

export = CopyPreviousMarksAndAnnotationsHelper;