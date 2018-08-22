import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import qigStore = require('../../../stores/qigselector/qigstore');
import annotation = require('../../../stores/response/typings/annotation');
import markbyoptionactioncreator = require('../../../actions/markbyoption/markbyoptionactioncreator');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import stampStore = require('../../../stores/stamp/stampstore');
import stampData = require('../../../stores/stamp/typings/stampdata');
import enums = require('../enums');
import constants = require('../constants');

class MarkByAnnotationHelper {

    private currentQuestionItem: treeViewItem;

    private annotation: annotation;

    private mark: AllocatedMark;

    private totalMark: number = 0;

    /**
     * gets total mark aganist question item.
     * @param annotation
     */
    public getAggregateMarks(annotation: annotation): number {
        this.totalMark = this.totalMark + annotation.numericValue;
        return this.totalMark;
    }

    /**
     * Resets the total marks.
     */
    public resetTotalMarks() {
        this.totalMark = 0;
    }

    /**
     * returns the mark valid
     * @param mark
     * @param currentItem
     */
    public isMarkValid = (currentQuestionItem: treeViewItem, annotation: annotation): boolean => {
        this.currentQuestionItem = currentQuestionItem;
        let newMark = this.getPreviouslyAllocatedMarks(currentQuestionItem.allocatedMarks.displayMark) + annotation.numericValue;
        if (newMark > currentQuestionItem.maximumNumericMark) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * returns the previously allocated marks
     * @param avaliableMarks
     */
    protected getPreviouslyAllocatedMarks(displayMark: string): number {
        if (displayMark === constants.NOT_MARKED || displayMark === constants.NOT_ATTEMPTED) {
            return this.totalMark = 0;
        } else {
            return this.totalMark = parseFloat(displayMark);
        }
    }

    /**
     * remove annotation marks
     * @param allAnnotations
     * @param removedAnnotation
     * @param currentQuestionItem
     */
    public removeAnnotationMarks(allAnnotations: any,
        removedAnnotation: annotation,
        currentQuestionItem: treeViewItem): string {
        let previousAllocatedMark = parseFloat(currentQuestionItem.allocatedMarks.displayMark);
        let stampData: stampData = stampStore.instance.getStamp(removedAnnotation.stamp, removedAnnotation.markSchemeGroupId);
        let isNumericValueStamp: boolean = this.hasNumericValue(removedAnnotation);
        let newMark: string;
        // calculating new mark to display.
        if (isNumericValueStamp) {
            newMark = (previousAllocatedMark - stampData.numericValue).toString();
        } else {
            newMark = currentQuestionItem.allocatedMarks.displayMark;
        }

        return newMark;
    }

    /**
     * returns stamp has numeric value.
     */
    public hasNumericValue = (annotation: annotation): boolean => {
        let stampData: stampData = stampStore.instance.getStamp(annotation.stamp, annotation.markSchemeGroupId);
        return stampData.numericValue !== null && stampData.numericValue !== undefined;
    };

    /**
     * returns any value annotations left in question item.
     */
    public doCheckValueAnnotationLeft = (allAnnotations: any,
        removedAnnotation: annotation): boolean => {
        let hasNumericStamp: boolean = false;
        let index: number = 0;
        let currentQuestionItemStampIds: Array<number> = [];
        allAnnotations.map((annotation: annotation) => {
            if (annotation.markSchemeId === removedAnnotation.markSchemeId
                && annotation.clientToken !== removedAnnotation.clientToken
                && annotation.markingOperation !== enums.MarkingOperation.deleted) {
                currentQuestionItemStampIds.push(annotation.stamp);
            }
        });

        if (currentQuestionItemStampIds.length) {
            while (index < currentQuestionItemStampIds.length) {
                let stampData: stampData = stampStore.instance.getStamp(
                    currentQuestionItemStampIds[index], removedAnnotation.markSchemeGroupId);
                if (stampData.numericValue !== null) {
                    hasNumericStamp = true;
                    break;
                }
                index++;
            }
        }
        return hasNumericStamp;
    };
}

export = MarkByAnnotationHelper;