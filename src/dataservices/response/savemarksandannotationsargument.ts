import stampItem = require('./stampitem');
import marksAndAnnotationsToSave = require('../../stores/response/typings/marksandannotationstosave');
import enums = require('../../components/utility/enums');

// Argument for marks and annotations
class SaveMarksAndAnnotationsArgument {

    private isUpdateMarkAnnotationDetails: boolean;
    private markingMode: string;
    private markGroupID: number;
    private questionPaperPartId: number;
    private marksAndAnnotationsToSave: Immutable.Map<number, marksAndAnnotationsToSave>;
    private isUsedInStandardisationSetup: boolean;
    private usedStamps: Immutable.Map<number, Immutable.List<stampItem>>;
    private saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint;
    private isWholeResponse: boolean;
    private currentExaminerRoleId: number;
    private _hasComplexOptionality: boolean;
    private isCoordinationCompleted: boolean;
    private isDefinitiveMarking: boolean;

    /**
     * Constructor
     * @param markGroupId
     * @param questionPaperPartId
     * @param marksAndAnnotationsToSave
     * @param isUsedInStandardisationSetup
     * @param usedStamps
     */
    constructor(isUpdateMarkAnnotationDetails: boolean, markingMode: string, markGroupId: number, questionPaperPartId: number,
        marksAndAnnotationsToSave: Immutable.Map<number, marksAndAnnotationsToSave>,
        isUsedInStandardisationSetup: boolean, usedStamps: Immutable.Map<number, Immutable.List<stampItem>>,
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        isWholeResponse: boolean, currentExaminerRoleId: number, hasComplexOptionality: boolean, isCoordinationCompleted: boolean,
        isDefinitiveMarking: boolean = false) {
        this.isUpdateMarkAnnotationDetails = isUpdateMarkAnnotationDetails;
        this.markingMode = markingMode;
        this.markGroupID = markGroupId;
        this.questionPaperPartId = questionPaperPartId;
        this.marksAndAnnotationsToSave = marksAndAnnotationsToSave;
        this.isUsedInStandardisationSetup = isUsedInStandardisationSetup;
        this.usedStamps = usedStamps;
        this.saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        this.isWholeResponse = isWholeResponse;
        this.currentExaminerRoleId = currentExaminerRoleId;
        this._hasComplexOptionality = hasComplexOptionality;
        this.isCoordinationCompleted = isCoordinationCompleted;
        this.isDefinitiveMarking = isDefinitiveMarking;
    }

    /**
     * Returns the MarkGroupID
     */
    public get markGroupId(): number {
        return this.markGroupID;
    }

    /**
     * Returns the whole response indicator
     */
    public get isWholeResponseMarking(): boolean {
        return this.isWholeResponse;
    }

    /**
     * Returns has complex optionality
     */
    public get hasComplexOptionality(): boolean {
        return this._hasComplexOptionality;
    }
}

export = SaveMarksAndAnnotationsArgument;