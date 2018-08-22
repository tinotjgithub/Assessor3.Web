import answerItem = require('./answeritem');
interface Cluster {
        externalParentId: number;
        sequenceNo: number;
        name: string;
        maximumExpectedResponses: number;
        examBodyClusterNo: number;
        itemGroup: boolean;
        answerItems: Immutable.List<answerItem>;
        childClusters?: Immutable.List<Cluster>;
        showQuestionTotals: boolean;
        minTotalMarks?: number;
        uniqueId: number;
        questionPaperPartId: number;
        markSchemes?: any;
        parentClusterId: number;
        parentCluster?: Cluster;
}
export = Cluster;