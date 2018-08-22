import qigSummary = require('../../../stores/qigselector/typings/qigsummary');
import markingTarget = require('../../../stores/qigselector/typings/markingtarget');
import enums = require('../enums');
import Immutable = require('immutable');
import localeStore = require('../../../stores/locale/localestore');
import worklistStore = require('../../../stores/worklist/workliststore');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import qigValidationResult = require('../../../stores/qigselector/qigvalidationresult');
import aggregatedQigValidationResult = require('../../../stores/qigselector/aggregatedqigvalidationresult');
import qigStore = require('../../../stores/qigselector/qigstore');

/**
 * Class for the Validations in the QIG Selector
 */
class QigSelectorValidationHelper {

    private qigValidationResult: qigValidationResult[] = [];
    private aggregatedQigValidationResult: aggregatedQigValidationResult;

    /**
     * Method to find the validation results by passing the QIG list
     * @param qigsummaryCollection
     */
    public getValidationResults(qigsummaryCollection: Immutable.List<qigSummary>) {

        // clearing existing result before filling to enusre while opened and tranlate language
        // should fill new results at the top.
        this.qigValidationResult = [];

        // Loop through each QIG and find the properties for the QIG selector
        qigsummaryCollection.map((qigsummary: qigSummary) => {

            let qigValidationResultObj = new qigValidationResult();
            this.populateValidationResultForQig(qigsummary, qigValidationResultObj);

            // Add the validation Result object to the collection
            this.qigValidationResult.push(qigValidationResultObj);
        });

        return this.qigValidationResult;
    }

    /**
     * Set the Visibility properties for UI Components
     * @param qigsummary
     * @param qigValidationResult
     */
    private setVisibilityPropertiesBasedOnExaminerQIGStatus(qigsummary: qigSummary, qigValidationResult: qigValidationResult) {
        switch (qigsummary.examinerQigStatus) {
            case enums.ExaminerQIGStatus.Practice:
            case enums.ExaminerQIGStatus.StandardisationMarking:
            case enums.ExaminerQIGStatus.STMStandardisationMarking:
            case enums.ExaminerQIGStatus.SecondStandardisationMarking:
                qigValidationResult.displayTargetDate = true;
                break;
            case enums.ExaminerQIGStatus.QualityFeedback:
            case enums.ExaminerQIGStatus.Suspended:
                if (qigsummary.isForAdminRemark !== true) {
                    qigValidationResult.displayTargetDate = true;
                    qigValidationResult.displayProgressBar = qigsummary.groupId <= 0;
                    qigValidationResult.displayTarget = true;
                }
                break;
            case enums.ExaminerQIGStatus.LiveMarking:
                qigValidationResult.displayTargetDate = true;
                qigValidationResult.displayProgressBar = qigsummary.groupId <= 0;
                qigValidationResult.displayTarget = true;
                if (this.getTotalOpenResponsesCount(qigsummary) > 0) {
                    qigValidationResult.displayOpenResponseIndicator = true;
                } else if (this.hasAvailableResponsesInPool(qigsummary)) {
                    qigValidationResult.displayResponseAvailableIndicator = true;

                }
                if (this.hasRemarkOpenResponse(qigsummary)) {
                    qigValidationResult.displayRemarkOpenResponseIndicator = true;
                    qigValidationResult.displayRemarkAvailableResponseIndicator = false;
                } else if (this.hasRemarkResponseInPool(qigsummary)) {
                    qigValidationResult.displayRemarkAvailableResponseIndicator = true;
                    qigValidationResult.displayRemarkOpenResponseIndicator = false;
                }
                break;
            case enums.ExaminerQIGStatus.LiveComplete:
                qigValidationResult.displayTargetDate = true;
                qigValidationResult.displayProgressBar = qigsummary.groupId <= 0;
                qigValidationResult.displayTarget = true;
                if (qigsummary.currentMarkingTarget.openResponsesCount > 0) {
                    qigValidationResult.displayOpenResponseIndicator = true;
                } else if (this.isIntoOverAllocation(qigsummary) && this.hasAvailableResponsesInPool(qigsummary)) {
                    qigValidationResult.displayResponseAvailableIndicator = true;
                }
                if (this.hasRemarkOpenResponse(qigsummary)) {
                    qigValidationResult.displayRemarkOpenResponseIndicator = true;
                    qigValidationResult.displayRemarkAvailableResponseIndicator = false;
                } else if (this.hasRemarkResponseInPool(qigsummary)) {
                    qigValidationResult.displayRemarkAvailableResponseIndicator = true;
                    qigValidationResult.displayRemarkOpenResponseIndicator = false;
                }
                break;
            case enums.ExaminerQIGStatus.AdminRemark:
                if (qigsummary.currentMarkingTarget.openResponsesCount > 0) {
                    qigValidationResult.displayOpenResponseIndicator = true;
                    qigValidationResult.displayResponseAvailableIndicator = false;
                } else if (this.hasAvailableResponsesInPool(qigsummary)) {
                    qigValidationResult.displayResponseAvailableIndicator = true;
                    qigValidationResult.displayOpenResponseIndicator = false;
                }
                break;
            case enums.ExaminerQIGStatus.Simulation:
                if (qigsummary.currentMarkingTarget.openResponsesCount > 0) {
                    qigValidationResult.displayOpenResponseIndicator = true;
                    qigValidationResult.displayResponseAvailableIndicator = false;
                } else if (this.hasAvailableResponsesInPool(qigsummary)) {
                    qigValidationResult.displayResponseAvailableIndicator = true;
                    qigValidationResult.displayOpenResponseIndicator = false;
                }
                break;
        }
    }

    /**
     * Get the Status color class for the text in UI.
     * @param qigsummary
     */
    private getStatusClassBasedOnExaminerQIGStatus(qigsummary: qigSummary): string {
        switch (qigsummary.examinerQigStatus) {
            case enums.ExaminerQIGStatus.QualityFeedback:
                return 'warning'; //Amber
            case enums.ExaminerQIGStatus.WaitingStandardisation:
            case enums.ExaminerQIGStatus.AwaitingApproval:
            case enums.ExaminerQIGStatus.Suspended:
            case enums.ExaminerQIGStatus.NoLiveTarget:
            case enums.ExaminerQIGStatus.AwaitingScripts:
                return 'error'; // Red
            default:
                return ''; // Black
        }
    }

    /**
     * To check the remark open response
     * Returns true if any remark is available in the any remark open worklist
     */
    private hasRemarkOpenResponse(qigsummary: qigSummary): boolean {
        if (qigsummary.markingTargets) {
            return qigsummary.markingTargets.some((remark: markingTarget) =>
                remark.markingMode === enums.MarkingMode.Remarking
                && remark.openResponsesCount > 0);
        }

        return false;
    }

    /**
     * To check the remark pool status
     * Returns true if any remark is available in the any remark pool
     */
    private hasRemarkResponseInPool(qigsummary: qigSummary): boolean {
        if (qigsummary.markingTargets) {
            return qigsummary.markingTargets.some((remark: markingTarget) =>
                remark.markingMode === enums.MarkingMode.Remarking
                && !remark.isDirectedRemark
                && remark.areResponsesAvailableToBeDownloaded
                && remark.maximumMarkingLimit > remark.closedResponsesCount);
        }
        return false;
    }

    /**
     * * AvailableResponseExists logic *
     * If live marking target is having responses in the pool
     * @param qigsummary
     */
    private hasAvailableResponsesInPool(qigsummary: qigSummary) {
        if (qigsummary.markingTargets == null) {
            if (qigsummary.isForAdminRemark) {
                if (qigsummary.currentMarkingTarget.areResponsesAvailableToBeDownloaded) {
                    return true;
                }
                return false;
            }
            return false;
        }
        for (let index in qigsummary.markingTargets) {
            if (qigsummary.markingTargets[index].areResponsesAvailableToBeDownloaded
                && qigsummary.markingTargets[index].markingMode === enums.MarkingMode.LiveMarking) {
                return true;
            } else if (qigsummary.markingTargets[index].areResponsesAvailableToBeDownloaded
                && qigsummary.markingTargets[index].markingMode === enums.MarkingMode.Remarking
                && qigsummary.isForAdminRemark) {
                return true;
            } else if (qigsummary.markingTargets[index].areResponsesAvailableToBeDownloaded
                && qigsummary.markingTargets[index].markingMode === enums.MarkingMode.Simulation) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check the user having access to live target
     * @param qigsummary
     */
    private hasLiveMarkingTargetExists(qigsummary: qigSummary) {
        for (let index in qigsummary.markingTargets) {
            if (qigsummary.markingTargets[index].markingMode === enums.MarkingMode.LiveMarking) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check the user has completed the non line targets.
     * @param qigsummary
     */
    private hasNonLiveTargetCompleted(qigsummary: qigSummary) {
        for (let index in qigsummary.markingTargets) {
            if (qigsummary.markingTargets.hasOwnProperty(index)) {
                let target = qigsummary.markingTargets[index];

                if (target.markingMode === enums.MarkingMode.LiveMarking ||
                    target.markingMode === enums.MarkingMode.Simulation ||
                    target.markingMode === enums.MarkingMode.Remarking) {
                    continue;
                }

                if (target.maximumMarkingLimit > target.closedResponsesCount) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     * Examiner QIG Status Text to display in QIG selector
     * @param qigsummary
     */
    private getStatusText(qigsummary: qigSummary): string {

        let isIntoOverAllocation: boolean = this.isIntoOverAllocation(qigsummary);
        let qigStatusKey: string = 'home.qig-statuses.' +
            enums.ExaminerQIGStatus[qigsummary.examinerQigStatus];

        if (isIntoOverAllocation) {
            qigStatusKey = 'home.qig-statuses.LiveTargetOverAllocation';
        }

        return localeStore.instance.TranslateText(qigStatusKey);
    }

    /**
     * checks if marking targets contains any directed remarks
     * @param {qigSummary} qigsummary
     * @returns
     */
    private filterDirectedRemarks(qigsummary: qigSummary) {

        let directedRemarkTargets = [];
        if (qigsummary.markingTargets != null) {
            qigsummary.markingTargets.map((remark: markingTarget) => {
                if (remark.isDirectedRemark === true) {
                    directedRemarkTargets.push(remark);
                }
            });
        }
        return directedRemarkTargets;
    }

    /**
     * Retrieving the total open responses count
     * @param qigsummary
     */
    private getTotalOpenResponsesCount(qigsummary: qigSummary) {

        if (!qigsummary.currentMarkingTarget) {
            return 0;
        }

        let totalOpenResponsesCount: number = 0;
        let directedRemarkTargets = this.filterDirectedRemarks(qigsummary);

        if (directedRemarkTargets !== undefined && directedRemarkTargets != null) {
            directedRemarkTargets.map((remark: markingTarget) => {
                totalOpenResponsesCount += remark.openResponsesCount;
            });
        }

        if (qigsummary.currentMarkingTarget !== undefined && qigsummary.currentMarkingTarget != null) {
            totalOpenResponsesCount += isNaN(qigsummary.currentMarkingTarget.openResponsesCount) ?
                0 : qigsummary.currentMarkingTarget.openResponsesCount;
            totalOpenResponsesCount += isNaN(qigsummary.currentMarkingTarget.openAtypicalResponsesCount) ?
                0 : qigsummary.currentMarkingTarget.openAtypicalResponsesCount;
        }

        return totalOpenResponsesCount;
    }

    /**
     * Method to verify if the QIG is into the over allocation mode
     * A marker would move to the over allocation mode only if
     * the marker has an over allocation mentioned in the target
     * and the total submitted responses count has crossed the actual
     * marking target
     * @param {qigSummary} qigsummary
     * @returns
     */
    private isIntoOverAllocation(qigsummary: qigSummary): boolean {

        if (!qigsummary.currentMarkingTarget || qigsummary.currentMarkingTarget.overAllocationCount <= 0) {
            return false;
        }

        let totalResponsesCount: number = 0;
        let directedRemarkTargets = this.filterDirectedRemarks(qigsummary);

        if (directedRemarkTargets !== undefined && directedRemarkTargets != null) {
            directedRemarkTargets.map((remark: markingTarget) => {
                totalResponsesCount += remark.openResponsesCount +
                    remark.pendingResponsesCount +
                    remark.closedResponsesCount;
            });
        }

        if (qigsummary.currentMarkingTarget !== undefined && qigsummary.currentMarkingTarget != null) {
            totalResponsesCount += isNaN(qigsummary.currentMarkingTarget.openResponsesCount) ?
                0 : qigsummary.currentMarkingTarget.openResponsesCount;
            totalResponsesCount += isNaN(qigsummary.currentMarkingTarget.pendingResponsesCount) ?
                0 : qigsummary.currentMarkingTarget.pendingResponsesCount;
            totalResponsesCount += isNaN(qigsummary.currentMarkingTarget.closedResponsesCount) ?
                0 : qigsummary.currentMarkingTarget.closedResponsesCount;
        }

        return totalResponsesCount >= qigsummary.currentMarkingTarget.maximumMarkingLimit;
    }

    /**
     * Method to verify if the concurrent limit is met
     * @param qigsummary
     * @param concurrentLimit
     */
    public isConcurrentLimitMet(qigsummary: qigSummary, liveOpenWorklist: LiveOpenWorklist): boolean {

        let totalOpenResponsesCount: number = 0;
        let currentTarget = targetSummaryStore.instance.getCurrentTarget();

        let directedRemarkTargets = this.filterDirectedRemarks(qigsummary);
        //The directed remark targest have to be checked only when the worklist type is live
        if (directedRemarkTargets !== undefined && directedRemarkTargets != null
            && (worklistStore.instance.currentWorklistType === enums.WorklistType.live
                || worklistStore.instance.currentWorklistType === enums.WorklistType.atypical)) {
            directedRemarkTargets.map((remark: markingTarget) => {
                totalOpenResponsesCount += remark.openResponsesCount;
            });
        }

        let concurrentLimit: number = 0;
        if (qigStore.instance.isAggregatedQigCCEnabledForCurrentQig) {
            concurrentLimit = currentTarget.aggregatedMaximumConcurrentLimit;
            // calculating aggregated open response count including atypical. 
            totalOpenResponsesCount = currentTarget.aggregatedOpenResponsesCount;
        } else {
            concurrentLimit = liveOpenWorklist.concurrentLimit;
            totalOpenResponsesCount += liveOpenWorklist && liveOpenWorklist.responses ? liveOpenWorklist.responses.count() : 0;
            if (worklistStore.instance.currentWorklistType === enums.WorklistType.live) {
                totalOpenResponsesCount += isNaN(currentTarget.examinerProgress.atypicalOpenResponsesCount) ?
                    0 : currentTarget.examinerProgress.atypicalOpenResponsesCount;
            } else if (worklistStore.instance.currentWorklistType === enums.WorklistType.atypical) {
                totalOpenResponsesCount += isNaN(currentTarget.examinerProgress.openResponsesCount) ?
                    0 : currentTarget.examinerProgress.openResponsesCount;
            }
        }
        return liveOpenWorklist &&
            totalOpenResponsesCount >= concurrentLimit;
    }

    /**
     * Method to find the aggregated QIg validation result.
     * @param qigsummaryCollection
     */
    public getAggregatedQigValidationResult(qigsummaryCollection: Immutable.List<qigSummary>) {
        this.aggregatedQigValidationResult = new aggregatedQigValidationResult();
        let qigValidationResultObj = new aggregatedQigValidationResult();
        // Sets the visibility properties of different elements in the agregated qig.
        this.setVisibilityPropertiesForAggregatedQig(qigsummaryCollection);
        return this.aggregatedQigValidationResult;
    }

    /**
     * Set the Visibility properties for the aggregatedQig
     * @param qigsummary
     * @param qigValidationResult
     */
    private setVisibilityPropertiesForAggregatedQig(qigsummary: Immutable.List<qigSummary>) {
        this.aggregatedQigValidationResult.displayTargetDate = false;

        // Display indicator properties.
        this.aggregatedQigValidationResult.displayOpenResponseIndicator = this.displayAggregatedOpenResponseIndicator(qigsummary);
        this.aggregatedQigValidationResult.displayResponseAvailableIndicator =
            this.aggregatedQigValidationResult.displayOpenResponseIndicator ?
                false : this.displayAggregatedResponseAvailabilityIndicator(qigsummary);
        this.aggregatedQigValidationResult.displayRemarkOpenResponseIndicator =
            this.displayAggregatedOpenResponseIndicator(qigsummary, true);
        this.aggregatedQigValidationResult.displayRemarkAvailableResponseIndicator =
            this.aggregatedQigValidationResult.displayRemarkOpenResponseIndicator ?
                false : this.displayAggregatedResponseAvailabilityIndicator(qigsummary, true);

        // Traget properties.
        this.aggregatedQigValidationResult.displayTarget = this.displayAggregatedTarget(qigsummary);

        // For displaying aggregated status text.
        this.aggregatedQigValidationResult.displayAggregatedStatusText = true;
        this.aggregatedQigValidationResult.statusText = localeStore.instance.TranslateText('home.qig-statuses.LiveMarking');
        // Progress bar.
        this.aggregatedQigValidationResult.displayProgressBar = this.aggregatedQigValidationResult.displayTarget;

        // Response counts.
        this.aggregatedQigValidationResult.aggregatedMaxMarkingLimit = this.aggregatedMaximiumMarkingLimit(qigsummary);
        let [openCount, pendingCount, closedCount] = this.aggregatedResponseCount(qigsummary);
        this.aggregatedQigValidationResult.aggregatedOpenResponsesCount = openCount;
        this.aggregatedQigValidationResult.aggregatedPendingResponsesCount = pendingCount;
        this.aggregatedQigValidationResult.aggregatedClosedResponsesCount = closedCount;
        this.aggregatedQigValidationResult.aggregatedSubmittedResponsesCount = this.aggregatedSubmittedResponseCount(qigsummary);
    }

    /**
     * Whether or not to display the aggregated response availability indicator.
     * @param qigsummary
     * @param isForRemark
     */
    private displayAggregatedResponseAvailabilityIndicator(qigsummary: Immutable.List<qigSummary>, isForRemark: boolean = false): boolean {
        let displayIndicator: boolean = false;
        let qigsCount: number = qigsummary.count();
        for (let i = 0; i < qigsCount; i++) {
            let qig = qigsummary.get(i);
            if (qig.examinerQigStatus !== enums.ExaminerQIGStatus.LiveMarking
                && qig.examinerQigStatus !== enums.ExaminerQIGStatus.LiveComplete) {
                displayIndicator = false;
            } else if (isForRemark && this.hasRemarkResponseInPool(qig)) {
                displayIndicator = true;
                break;
            } else if (!isForRemark && qig.examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete) {
                if (this.isIntoOverAllocation(qig) && this.hasAvailableResponsesInPool(qig)) {
                    displayIndicator = true;
                    break;
                } else {
                    displayIndicator = false;
                }
            } else if (!isForRemark && this.hasAvailableResponsesInPool(qig)) {
                displayIndicator = true;
                break;
            }
        }
        return displayIndicator;
    }

    /**
     * Whether or not to display the aggregated response open indicator.
     * @param qigsummary
     * @param isForRemark
     */
    private displayAggregatedOpenResponseIndicator(qigsummary: Immutable.List<qigSummary>, isForRemark: boolean = false): boolean {
        let displayIndicator: boolean = false;
        let qigsCount: number = qigsummary.count();
        for (let i = 0; i < qigsCount; i++) {
            let qig = qigsummary.get(i);
            if (qig.examinerQigStatus !== enums.ExaminerQIGStatus.LiveMarking
                && qig.examinerQigStatus !== enums.ExaminerQIGStatus.LiveComplete) {
                displayIndicator = false;
            } else if (isForRemark && this.hasRemarkOpenResponse(qig)) {
                displayIndicator = true;
                break;
            } else if (!isForRemark && qig.examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete) {
                if (qig.currentMarkingTarget.openResponsesCount > 0) {
                    displayIndicator = true;
                    break;
                } else {
                    displayIndicator = false;
                }
            } else if (!isForRemark && this.getTotalOpenResponsesCount(qig) > 0) {
                displayIndicator = true;
                break;
            }
        }
        return displayIndicator;
    }

    /**
     * Whether or not to display the aggregated target.
     * @param qigsummary
     */
    private displayAggregatedTarget(qigsummary: Immutable.List<qigSummary>): boolean {
        let displayTarget: boolean = false;
        let qigsCount: number = qigsummary.count();
        for (let i = 0; i < qigsCount; i++) {
            let qig = qigsummary.get(i);
            if (this.isInLiveMarkingMode(qig.examinerQigStatus)) {
                displayTarget = true;
                break;
            }
        }
        return displayTarget;
    }

    /**
     * Returns the aggregated maximum marking limit.
     * @param qigsummary
     */
    private aggregatedMaximiumMarkingLimit(qigsummary: Immutable.List<qigSummary>): number {
        let aggregatedOpenCount: number = 0;
        qigsummary.map((qig: qigSummary) => {
            aggregatedOpenCount += qig.currentMarkingTarget.maximumMarkingLimit;
        });
        return aggregatedOpenCount;
    }

    /**
     * Finds the submitted responses count for a qig, including directed remarks.
     * @param directedRemarkTargets
     * @param currentMarkingTarget 
     */
    public findSubmittedResponsesCount(directedRemarkTargets: Immutable.List<markingTarget>, currentMarkingTarget: markingTarget): number {
        let totalClosedResponsesCount = 0;
        let remarkClosedResponsesCount = 0;
        let remarkPendingResponsesCount = 0;
        if (directedRemarkTargets != null && directedRemarkTargets !== undefined) {
            directedRemarkTargets.map((remark: markingTarget) => {
                remarkClosedResponsesCount += remark.closedResponsesCount;
                remarkPendingResponsesCount += remark.pendingResponsesCount;
            });
        }
        totalClosedResponsesCount += remarkClosedResponsesCount + remarkPendingResponsesCount;

        if (currentMarkingTarget !== undefined && currentMarkingTarget != null) {
            totalClosedResponsesCount += currentMarkingTarget.closedResponsesCount
                + (isNaN(currentMarkingTarget.pendingResponsesCount) ? 0 : currentMarkingTarget.pendingResponsesCount)
                + (isNaN(currentMarkingTarget.pendingAtypicalResponsesCount) ? 0 : currentMarkingTarget.pendingAtypicalResponsesCount)
                + (isNaN(currentMarkingTarget.closedAtypicalResponsesCount) ? 0 : currentMarkingTarget.closedAtypicalResponsesCount);
        }
        return totalClosedResponsesCount;
    }

    /**
     * Returns the aggregated submitted responses count.
     * @param qigsummary
     */
    private aggregatedSubmittedResponseCount(qigsummary: Immutable.List<qigSummary>): number {
        let aggregatedSubmittedCount: number = 0;
        let directedRemarkTargets: markingTarget[];
        qigsummary.map((qig: qigSummary) => {
            directedRemarkTargets = [];
            if (qig.markingTargets !== undefined && qig.markingTargets !== null) {
                qig.markingTargets.map((target: markingTarget) => {
                    if (target.isDirectedRemark === true) {
                        directedRemarkTargets.push(target);
                    }
                });
            }
            if (this.isInLiveMarkingMode(qig.examinerQigStatus)) {
                aggregatedSubmittedCount += this.findSubmittedResponsesCount(
                    Immutable.List<markingTarget>(directedRemarkTargets), qig.currentMarkingTarget);
            }
        });

        return aggregatedSubmittedCount;
    }

    /**
     * Finds the response count in open-pending-closed worklist.
     * @param directedRemarkTargets
     * @param currentMarkingTarget 
     */
    public findResponseCountInWorklist(directedRemarkTargets: Immutable.List<markingTarget>, currentMarkingTarget: markingTarget):
        [number, number, number] {
        let openCount: number = 0;
        let pendingCount: number = 0;
        let closedCount: number = 0;
        if (directedRemarkTargets != null && directedRemarkTargets !== undefined) {
            directedRemarkTargets.map((remark: markingTarget) => {
                openCount += remark.openResponsesCount;
                pendingCount += remark.pendingResponsesCount;
                closedCount += remark.closedResponsesCount;
            });
        }
        if (currentMarkingTarget !== undefined && currentMarkingTarget != null) {
            openCount += isNaN(currentMarkingTarget.openResponsesCount) ? 0 : currentMarkingTarget.openResponsesCount
                + (isNaN(currentMarkingTarget.openAtypicalResponsesCount) ? 0 : currentMarkingTarget.openAtypicalResponsesCount);

            pendingCount += isNaN(currentMarkingTarget.pendingResponsesCount) ? 0 : currentMarkingTarget.pendingResponsesCount
                + (isNaN(currentMarkingTarget.pendingAtypicalResponsesCount) ? 0 : currentMarkingTarget.pendingAtypicalResponsesCount);

            closedCount += isNaN(currentMarkingTarget.closedResponsesCount) ? 0 : currentMarkingTarget.closedResponsesCount
                + (isNaN(currentMarkingTarget.closedAtypicalResponsesCount) ? 0 : currentMarkingTarget.closedAtypicalResponsesCount);
        }
        return [openCount, pendingCount, closedCount];
    }

    /**
     * Returns the aggregated response count in each qig's open, pending and closed worklist.
     * @param qigsummary
     */
    private aggregatedResponseCount(qigsummary: Immutable.List<qigSummary>): [number, number, number] {
        let directedRemarkTargets: markingTarget[];
        let openCount: number = 0;
        let pendingCount: number = 0;
        let closedCount: number = 0;
        qigsummary.map((qig: qigSummary) => {
            directedRemarkTargets = [];
            if (qig.markingTargets !== undefined && qig.markingTargets !== null) {
                qig.markingTargets.map((target: markingTarget) => {
                    if (target.isDirectedRemark === true) {
                        directedRemarkTargets.push(target);
                    }
                });
            }
            if (this.isInLiveMarkingMode(qig.examinerQigStatus)) {
                let responseCounts: [number, number, number] = this.findResponseCountInWorklist(
                    Immutable.List<markingTarget>(directedRemarkTargets), qig.currentMarkingTarget);
                openCount += responseCounts[0];
                pendingCount += responseCounts[1];
                closedCount += responseCounts[2];
            }
        });
        return [openCount, pendingCount, closedCount];
    }

    /**
     * Populates validation result for qig.
     * @param qig 
     * @param qigValidationResultObj 
     * @param hasAggregatedTargets 
     */
    private populateValidationResultForQig(qig: qigSummary, qigValidationResultObj: any): void {
        // Set examinerQig Status as 'NoLiveTarget'
        // 1. If no Targets specified
        // 2. If User is having non live targets and all those targets completed.
        // 3. User having live target but limit is 0
        if (qig.isForAdminRemark) {
            if (qig.examinerQigStatus !== enums.ExaminerQIGStatus.Suspended) {
                qig.examinerQigStatus = enums.ExaminerQIGStatus.AdminRemark;
            }

        } else if (qig.markingTargets == null ||
            (this.hasNonLiveTargetCompleted(qig) && !this.hasLiveMarkingTargetExists(qig)) ||
            (qig.currentMarkingTarget.markingMode === enums.MarkingMode.LiveMarking
                && qig.currentMarkingTarget.maximumMarkingLimit === 0)
               && qig.examinerQigStatus !== enums.ExaminerQIGStatus.WaitingStandardisation) {
            qig.examinerQigStatus = enums.ExaminerQIGStatus.NoLiveTarget;
        }
        qigValidationResultObj.statusColourClass = this.getStatusClassBasedOnExaminerQIGStatus(qig);
        this.setVisibilityPropertiesBasedOnExaminerQIGStatus(qig, qigValidationResultObj);
        qigValidationResultObj.statusText = this.getStatusText(qig);
        // Added examinerQigStatus if it is in simulation mode.
        if (qig.examinerQigStatus === enums.ExaminerQIGStatus.Simulation) {
            qigValidationResultObj.isSimulationMode = true;
        }

        // Added to set visibility of status text in marking target component
        // Status text is not needed if Qualification set up button is visble
        if (qig.examinerQigStatus === enums.ExaminerQIGStatus.WaitingStandardisation) {
            qigValidationResultObj.isInStandardisationMode = true;
        }

        // Setting the open responses count when there is an over allocation
        qigValidationResultObj.openResponsesCount =
            this.isIntoOverAllocation(qig) ?
                this.getTotalOpenResponsesCount(qig) : 0;
    }

    /**
     * Checks if the marker is in live marking mode.
     * @param examinerStatus
     */
    private isInLiveMarkingMode(examinerStatus: enums.ExaminerQIGStatus): boolean {
        return examinerStatus === enums.ExaminerQIGStatus.Suspended
        || examinerStatus === enums.ExaminerQIGStatus.LiveMarking
        || examinerStatus === enums.ExaminerQIGStatus.LiveComplete;
    }

    /**
     * Logic moved to QIG Store
     */
    public static isQigHasBrowseScriptPermissionOnly(selectedQIG : qigSummary) : boolean {
        return qigStore.instance.isQigHasBrowseScriptPermissionOnly(selectedQIG);
    }

}

export = QigSelectorValidationHelper;