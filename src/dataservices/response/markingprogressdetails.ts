/**
 * Class for holding marking progress details.
 */
class MarkingProgressDetails {
    public totalMarks: number;
    public markingProgress: number;
    public accuracyIndicator: number;
    public absoluteMarksDifference: number;
    public markCount: number;
    public totalMarksDifference: number;
    public lowerTolerance: number;
    public  upperTolerance: number;
    public totalDefinitiveMarks: number;
    public letiantItemId: number;
    public definitiveletiantItemId: number;
    public isletiantItemUpdated: boolean;
    public version: number;
    public lastUpdatedDate: Date;
    public isAllNR: boolean;
	public isAllPagesAnnotated: boolean;
	public markSchemeCount: number; // total number of mark schemes
}

export = MarkingProgressDetails;