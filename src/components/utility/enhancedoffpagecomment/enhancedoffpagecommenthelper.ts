import markingStore = require('../../../stores/marking/markingstore');
import examinerMarksAndAnnotation = require('../../../stores/response/typings/examinermarksandannotation');
import enums = require('../enums');
import Immutable = require('immutable');
import jsonRefResolver = require('../../../utility/jsonrefresolver/josnrefresolver');
import tableHeader = require('./typings/tableheader');
import localeStore = require('../../../stores/locale/localestore');
import gridColumnNames = require('../grid/gridcolumnnames');
import sortHelper = require('../../../utility/sorting/sorthelper');
import compareList = require('../../../utility/sorting/sortbase/comparerlist');
let enhancedOffPageCommentGridColumns = require('./enhancedoffpagecommentgridcolumns.json');
import enhancedOffPageComment = require('../../../stores/response/typings/enhancedoffpagecomment');
import ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import eCourseWorkFile = require('../../../stores/response/digital/typings/courseworkfile');
import worklistStore = require('../../../stores/worklist/workliststore');
import responseStore = require('../../../stores/response/responsestore');
import ecourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import ecourseworkFile = require('../../../stores/response/digital/typings/courseworkfile');
import enhancedOffPageCommentActionCreator = require('../../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
import enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');


class EnhancedOffPageCommentHelper {

    /* variable to holds the column details JSON*/
    public static resolvedGridColumnsJson: any;
    private static comparerName: string;
    private static sortDirection: enums.SortDirection;

    private eCourseWorkFileList: Immutable.List<eCourseWorkFile>;

    /**
     * Returns the enhanced off-page comments against current mark group.
     * 
     * @param {string} comparerName 
     * @param {enums.SortDirection} sortDirection 
     * @returns {Immutable.List<EnhancedOffPageComment>} 
     * @memberof EnhancedOffPageCommentHelper
     */
    public static getEnhancedOffPageComments(comparerName: string, sortDirection: enums.SortDirection, index: number):
        Immutable.List<EnhancedOffPageCommentViewDataItem> {
        EnhancedOffPageCommentHelper.comparerName = comparerName;
        EnhancedOffPageCommentHelper.sortDirection = sortDirection;
        return EnhancedOffPageCommentHelper.getTableRows(markingStore.instance.enhancedOffPageCommentsAgainstCurrentResponse(index));
    }

    /**
     * generateTableHeader
     * @returns {Immutable.List<tableHeader>} 
     * @memberof EnhancedOffPageCommentHelper
     */
    public static generateTableHeader(): Immutable.List<tableHeader> {
        EnhancedOffPageCommentHelper.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(enhancedOffPageCommentGridColumns);
        let enhancedOffPageCommentHeaderCollection: Immutable.List<tableHeader> = EnhancedOffPageCommentHelper.getTableHeader();
        return enhancedOffPageCommentHeaderCollection;
    }

    /**
     * getTableRows
     * @param {Immutable.List<EnhancedOffPageComment>} enhancedOffPageComments 
     * @returns {Immutable.List<EnhancedOffPageCommentViewDataItem>} 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getTableRows(enhancedOffPageComments: Immutable.List<enhancedOffPageComment>):
        Immutable.List<EnhancedOffPageCommentViewDataItem> {
        let currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        let selectedMarkSchemeId: number;
        if (currentQuestionItemInfo) {
            selectedMarkSchemeId = currentQuestionItemInfo.uniqueId;
        }

        let selectedEcourseworkFiles: Immutable.List<ecourseworkFile> = ecourseworkFileStore.instance.getSelectedECourseWorkFiles();

        let tableRows: Array<EnhancedOffPageCommentViewDataItem> = new Array<EnhancedOffPageCommentViewDataItem>();
        enhancedOffPageComments.map((item: enhancedOffPageComment, index: number) => {
            let isSelected: boolean = false;
            let markSchemeInfo: MarkSchemeInfo = markingStore.instance.getMarkSchemeInfo(item.markSchemeId);
            let itemName: string = EnhancedOffPageCommentHelper.getItemName(markSchemeInfo);
            let itemSortIndex: number = EnhancedOffPageCommentHelper.getItemSortIndex(markSchemeInfo);
            let fileId: number;
            let fileSortIndex: number;
            if (EnhancedOffPageCommentHelper.getCellVisibility(gridColumnNames.File)) {
                fileId = item.fileId;
                fileSortIndex = EnhancedOffPageCommentHelper.getFileSortIndex(item.fileId);
            }
            if (selectedEcourseworkFiles && item.fileId !== 0) {
                selectedEcourseworkFiles.forEach((file: ecourseworkFile) => {
                    if ((item.fileId === file.docPageID)) {
                        isSelected = true;
                    }
                });
            }
            tableRows.push({
                enhancedOffPageCommentId: item.enhancedOffPageCommentId,
                itemId: item.markSchemeId,
                itemText: itemName,
                itemSortValue: itemSortIndex,
                fileId: fileId,
                fileSortValue: fileSortIndex,
                comment: item.comment,
                isFileSelected: isSelected,
                isMarkSchemeSelected: item.markSchemeId === selectedMarkSchemeId,
                clientToken: item.clientToken
            });

        });



        // sort 
        let comparerName: string = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

        return Immutable.List<EnhancedOffPageCommentViewDataItem>(sortHelper.sort(tableRows, compareList[comparerName]));
    }

    /**
     * getItemName
     * 
     * @private
     * @param {MarkSchemeInfo} markSchemeInfo 
     * @returns {string} 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getItemName(markSchemeInfo: MarkSchemeInfo): string {
        return markSchemeInfo ? markSchemeInfo.markSchemeText : '';
    }

    /**
     * getItemSortIndex
     * 
     * @private
     * @param {MarkSchemeInfo} markSchemeInfo 
     * @returns {number} 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getItemSortIndex(markSchemeInfo: MarkSchemeInfo): number {
        return markSchemeInfo ? markSchemeInfo.sequenceNo : 0;
    }

    /**
     * Get enhancedOffPageCommentLength for the current question item
     */
    public static hasEnhancedOffPageComments() {
        // Adding the check to avoid the error. CurrentQuestionItemInfo object will have the proper value after next render.
        if (markingStore.instance.currentQuestionItemInfo) {
            return markingStore.instance.enhancedOffPageCommentsAgainstCurrentResponse().
                filter((comment: enhancedOffPageComment) =>
                    comment.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId).count();
        } else {
            return 0;
        }
    }

    /**
     * getFileSortIndex
     * @private
     * @param {number} fileId 
     * @returns {number} 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getFileSortIndex(fileId: number): number {
        // we need to sort the filelist based on the sequence number (Page_Number). fileList is maintaing the order of 
        // sequence number hence we can relay the index of the eCourseWorkFile Item from collection.
        return this.getIndexOfECourseWorkFile(fileId);
    }

    /**
     * getTableHeader
     * @returns {Immutable.List<tableHeader>} 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getTableHeader(): Immutable.List<tableHeader> {
        let tableHeaders: Array<tableHeader> = new Array<tableHeader>();
        let gridColumns = EnhancedOffPageCommentHelper.getGridColumns(EnhancedOffPageCommentHelper.resolvedGridColumnsJson);
        gridColumns.map((column: any, index: number) => {
            let columnName: string = column.GridColumn;
            let headerText: string = column.ColumnHeader; //key         
            let sortDirection: enums.SortDirection = EnhancedOffPageCommentHelper.sortDirection;
            let sortOption: enums.SortOption = column.SortOption === 'Up' ? enums.SortOption.Up :
                column.SortOption === 'Down' ? enums.SortOption.Down : enums.SortOption.Both;
            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            let columnIndex: number = index + 1;
            if (EnhancedOffPageCommentHelper.getCellVisibility(columnName)) {
                tableHeaders.push({
                    columnIndex: columnIndex,
                    columnName: columnName,
                    header: headerText,
                    isSortRequired: column.Sortable === 'true',
                    isCurrentSort: column.ComparerName === EnhancedOffPageCommentHelper.comparerName,
                    sortOption: sortOption,
                    sortDirection: EnhancedOffPageCommentHelper.
                        getSortDirection((column.ComparerName === EnhancedOffPageCommentHelper.comparerName),
                        EnhancedOffPageCommentHelper.sortDirection, sortOption),
                    style: column.CssClassName,
                    comparerName: column.ComparerName
                });
            }

        });
        return Immutable.List<tableHeader>(tableHeaders);
    }

    /**
     * getCellVisibility
     * @param {string} columnName 
     * @returns {boolean} 
     * @memberof EnhancedOffPageCommentHelper
     */
    public static getCellVisibility(gridColumnName: string): boolean {
        return gridColumnName === gridColumnNames.File ? ccValues.isECourseworkComponent ? true : false : true;
    }

    /**
     * get column index
     * @param {string} gridColumnName 
     * @returns {number} 
     * @memberof EnhancedOffPageCommentHelper
     */
    public static getColumnIndex(gridColumnName: string): number {
        let columnIndex: number;
        switch (gridColumnName) {
            case gridColumnNames.Item:
                columnIndex = 1;
                break;
            case gridColumnNames.File:
                columnIndex = 2;
                break;
            case gridColumnNames.Comment:
                // if file column is not visible then return 2 else return 3
                columnIndex = EnhancedOffPageCommentHelper.getCellVisibility(gridColumnNames.File) ? 3 : 2;
                break;
        }
        return columnIndex;
    }

    /**
     * getGridColumns
     * 
     * @param {*} resolvedGridColumnsJson 
     * @returns 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getGridColumns(resolvedGridColumnsJson: any) {
        let gridColumns: any;
        let responseType: string = ccValues.isECourseworkComponent ? 'digital' : 'image';
        switch (responseType) {
            case 'image':
                gridColumns = resolvedGridColumnsJson.enhancedOffPageComments.image.GridColumns;
                break;
            case 'digital':
                gridColumns = resolvedGridColumnsJson.enhancedOffPageComments.digital.GridColumns;
                break;
        }

        return gridColumns;
    }

    /**
     * Returns the sort direction
     * 
     * @private
     * @param {boolean} isCurrentSort 
     * @param {enums.SortDirection} sortDirection 
     * @param {enums.SortOption} sortOption 
     * @returns {enums.SortDirection} 
     * @memberof EnhancedOffPageCommentHelper
     */
    private static getSortDirection(isCurrentSort: boolean, sortDirection: enums.SortDirection, sortOption: enums.SortOption):
        enums.SortDirection {
        if (isCurrentSort) {
            if (sortOption === undefined || sortOption === enums.SortOption.Both) {
                return (sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending;
            } else if (sortOption === enums.SortOption.Up) {
                return enums.SortDirection.Ascending;
            } else {
                return enums.SortDirection.Descending;
            }
        } else {
            return (sortOption === undefined || sortOption === enums.SortOption.Both) ? enums.SortDirection.Ascending :
                ((sortOption === enums.SortOption.Up) ? enums.SortDirection.Ascending : enums.SortDirection.Descending);
        }
    }

    /**
     * Returns the index of a eCourse workfile
     * 
     * @param {number} docPageID 
     * @returns {number} 
     * @memberof EnhancedOffPageCommentHelper
     */
    public static getIndexOfECourseWorkFile(docPageID: number): number {
        let responseDetails: ResponseBase = markerOperationModeFactory.operationMode.openedResponseDetails(
            responseStore.instance.selectedDisplayId.toString());
        let markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                                            responseDetails.esMarkGroupId : responseDetails.markGroupId;
        let index: number = eCourseWorkFileStore.instance.getIndexOfECourseWorkFile(markGroupId, docPageID);
        return index;
    }

    /**
     * Handles changes in the comment edit.
     * @param e
     */
    public static handleCommentEdit = (isEdited: boolean) => {
        if (!enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited) {
            enhancedOffPageCommentActionCreator.updateEnhancedOffPageComment(isEdited);
        }
    }

    /**
     * Returns the eCourse workfile
     * 
     * @param {number} docPageID 
     * @returns {eCourseWorkFile} 
     * @memberof EnhancedOffPageCommentHelper
     */
    public static getECourseWorkFile(docPageID: number): eCourseWorkFile {
        let responseDetails: ResponseBase = markerOperationModeFactory.operationMode.openedResponseDetails(
            responseStore.instance.selectedDisplayId.toString());
        let markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                                            responseDetails.esMarkGroupId : responseDetails.markGroupId;
        let eCourseWorkFile: eCourseWorkFile = eCourseWorkFileStore.instance.getECourseWorkFile(markGroupId, docPageID);
        return eCourseWorkFile;
    }

    /**
     * Returns the index of enhanced off page comment
     * @param isMarksColumnVisibilitySwitched
     * @param allMarksAndAnnotationsLength
     */
    public static getEnhancedOffPageCommentIndex(isMarksColumnVisibilitySwitched: boolean, allMarksAndAnnotationsLength: number): number {
        // Fix for defect 56207
        let index: number = isMarksColumnVisibilitySwitched ||
            (allMarksAndAnnotationsLength <= enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex) ?
            0 : enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;

        return index;
    }

}
export = EnhancedOffPageCommentHelper;