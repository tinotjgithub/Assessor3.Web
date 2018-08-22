import React = require('react');
import Immutable = require('immutable');
import enums = require('../enums');
import worklistStore = require('../../../stores/worklist/workliststore');
import markingStore = require('../../../stores/marking/markingstore');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import examinerMark = require('../../../stores/response/typings/examinermark');
import examinerMarksAndAnnotations = require('../../../stores/response/typings/examinermarksandannotation');
const NR_MARK_STATUS = 'not attempted';

// Helper class for handling mark change reason
class MarkChangeReasonHelper {

    /* variable to indicate whether the current marks differ with the default ones */
    private static isMarkDiffer: boolean;

    /**
     * get the status of current mark visibility
     * @param markSchemeId
     * @param allocatedMark
     */
    public static isMarkChangeReasonVisible(markSchemeId: number = undefined, allocatedMark: string = undefined): boolean {
        let isMarkChangeReasonVisible: boolean = false;
        this.isMarkDiffer = false;

        if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark &&
            worklistStore.instance.isMarkChangeReasonVisible(
                markingStore.instance.currentMarkGroupId,
                markingStore.instance.currentResponseMode)
        ) {
            if (markingStore.instance.currentResponseMode !== enums.ResponseMode.closed) {
                MarkChangeReasonHelper.checkIfMarkDiffer(markSchemeId, allocatedMark);
                isMarkChangeReasonVisible = this.isMarkDiffer;
            } else if (markingStore.instance.currentResponseMode === enums.ResponseMode.closed) {
                let markChangeReason: string = worklistStore.instance.getMarkChangeReason(
                    markingStore.instance.currentMarkGroupId,
                    markingStore.instance.currentResponseMode);
                isMarkChangeReasonVisible = markChangeReason ? markChangeReason.length > 0 ? true : false : false;
            }
        }

        return isMarkChangeReasonVisible;
    }

    /**
     * Function to check if marks differ
     * @param markSchemeId
     * @param allocatedMark
     */
    private static checkIfMarkDiffer(markSchemeId: number = undefined, allocatedMark: string = undefined): boolean {

        let defaultMarks = MarkChangeReasonHelper.getDefaultMarks();
        let currentMarks = MarkChangeReasonHelper.getCurrentMarks();
        let i: number = 0;

        let _defaultMark: examinerMark = undefined;
        for (i = 0; i < defaultMarks.length; i++) {
            _defaultMark = defaultMarks[i];
            if (_defaultMark.markSchemeId === markSchemeId) {
                this.marksEqual(_defaultMark, allocatedMark);
            } else {
                let _curMarks: examinerMark = currentMarks.
                    filter((x: examinerMark) => x.markSchemeId === _defaultMark.markSchemeId)[0];
                if (_curMarks) {
                    if (_defaultMark.markStatus && _defaultMark.markStatus.toLowerCase() === NR_MARK_STATUS) {
                        if (_defaultMark.markStatus === _curMarks.markStatus &&
                            _defaultMark.numericMark === _curMarks.numericMark &&
                            _defaultMark.numericMark === 0) {
                            this.isMarkDiffer = false;
                        } else {
                            this.isMarkDiffer = true;
                        }
                    } else {
                        this.isMarkDiffer = _defaultMark.numericMark === _curMarks.numericMark ? false : true;
                    }
                }
            }
            if (this.isMarkDiffer) {
                return this.isMarkDiffer;
            }
        }

        return this.isMarkDiffer;
    }

    /**
     * Check current and default marks equal or not
     * @param markSchemeId
     * @param allocatedMark
     */
    private static marksEqual(_examinerMark: examinerMark, currentMark: string): boolean {
        if (_examinerMark.markStatus && _examinerMark.markStatus.toLowerCase() === NR_MARK_STATUS) {
            this.isMarkDiffer = currentMark === 'NR' ? false : true;
        } else {
            this.isMarkDiffer = _examinerMark.numericMark.toString() === currentMark ? false : true;
        }
        return this.isMarkDiffer;
    }

    /**
     * Getting default marks
     */
    public static getDefaultMarks(): examinerMark[] {
        // Get Default Previous Marks single/whole response.
        return markingStore.instance.getDefaultPreviousMarks();
    }

    /**
     * Getting Current marks
     */
    public static getCurrentMarks(): examinerMark[] {
         // Get Current Marks single/whole response.
        let examinerMarks: examinerMark[] = [];
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse
            (markingStore.instance.currentMarkGroupId);
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                x.examinerMarksCollection.forEach((y: examinerMark) => {
                    examinerMarks.push(y);
                });
            });
        }
        return examinerMarks;
    }
}

export = MarkChangeReasonHelper;


