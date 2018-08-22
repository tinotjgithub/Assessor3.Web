"use strict";
var stampStore = require('../../../stores/stamp/stampstore');
var enums = require('../enums');
var constants = require('../constants');
var MarkByAnnotationHelper = (function () {
    function MarkByAnnotationHelper() {
        var _this = this;
        this.totalMark = 0;
        /**
         * returns the mark valid
         * @param mark
         * @param currentItem
         */
        this.isMarkValid = function (currentQuestionItem, annotation) {
            _this.currentQuestionItem = currentQuestionItem;
            var newMark = _this.getPreviouslyAllocatedMarks(currentQuestionItem.allocatedMarks.displayMark) + annotation.numericValue;
            if (newMark > currentQuestionItem.maximumNumericMark) {
                return false;
            }
            else {
                return true;
            }
        };
        /**
         * returns stamp has numeric value.
         */
        this.hasNumericValue = function (annotation) {
            var stampData = stampStore.instance.getStamp(annotation.stamp, annotation.markSchemeGroupId);
            return stampData.numericValue !== null && stampData.numericValue !== undefined;
        };
        /**
         * returns any value annotations left in question item.
         */
        this.doCheckValueAnnotationLeft = function (allAnnotations, removedAnnotation) {
            var hasNumericStamp = false;
            var index = 0;
            var currentQuestionItemStampIds = [];
            allAnnotations.map(function (annotation) {
                if (annotation.markSchemeId === removedAnnotation.markSchemeId
                    && annotation.clientToken !== removedAnnotation.clientToken
                    && annotation.markingOperation !== enums.MarkingOperation.deleted) {
                    currentQuestionItemStampIds.push(annotation.stamp);
                }
            });
            if (currentQuestionItemStampIds.length) {
                while (index < currentQuestionItemStampIds.length) {
                    var stampData = stampStore.instance.getStamp(currentQuestionItemStampIds[index], removedAnnotation.markSchemeGroupId);
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
    /**
     * gets total mark aganist question item.
     * @param annotation
     */
    MarkByAnnotationHelper.prototype.getAggregateMarks = function (annotation) {
        this.totalMark = this.totalMark + annotation.numericValue;
        return this.totalMark;
    };
    /**
     * Resets the total marks.
     */
    MarkByAnnotationHelper.prototype.resetTotalMarks = function () {
        this.totalMark = 0;
    };
    /**
     * returns the previously allocated marks
     * @param avaliableMarks
     */
    MarkByAnnotationHelper.prototype.getPreviouslyAllocatedMarks = function (displayMark) {
        if (displayMark === constants.NOT_MARKED || displayMark === constants.NOT_ATTEMPTED) {
            return this.totalMark = 0;
        }
        else {
            return this.totalMark = parseFloat(displayMark);
        }
    };
    /**
     * remove annotation marks
     * @param allAnnotations
     * @param removedAnnotation
     * @param currentQuestionItem
     */
    MarkByAnnotationHelper.prototype.removeAnnotationMarks = function (allAnnotations, removedAnnotation, currentQuestionItem) {
        var previousAllocatedMark = parseFloat(currentQuestionItem.allocatedMarks.displayMark);
        var stampData = stampStore.instance.getStamp(removedAnnotation.stamp, removedAnnotation.markSchemeGroupId);
        var isNumericValueStamp = this.hasNumericValue(removedAnnotation);
        var newMark;
        // calculating new mark to display.
        if (isNumericValueStamp) {
            newMark = (previousAllocatedMark - stampData.numericValue).toString();
        }
        else {
            newMark = currentQuestionItem.allocatedMarks.displayMark;
        }
        return newMark;
    };
    return MarkByAnnotationHelper;
}());
module.exports = MarkByAnnotationHelper;
//# sourceMappingURL=markbyannotationhelper.js.map