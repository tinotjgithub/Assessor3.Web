"use strict";
var markingStore = require('../../../stores/marking/markingstore');
var enums = require('../enums');
var Immutable = require('immutable');
var jsonRefResolver = require('../../../utility/jsonrefresolver/josnrefresolver');
var localeStore = require('../../../stores/locale/localestore');
var gridColumnNames = require('../grid/gridcolumnnames');
var sortHelper = require('../../../utility/sorting/sorthelper');
var compareList = require('../../../utility/sorting/sortbase/comparerlist');
var enhancedOffPageCommentGridColumns = require('./enhancedoffpagecommentgridcolumns.json');
var ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var responseStore = require('../../../stores/response/responsestore');
var ecourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var enhancedOffPageCommentActionCreator = require('../../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
var enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var EnhancedOffPageCommentHelper = (function () {
    function EnhancedOffPageCommentHelper() {
    }
    /**
     * Returns the enhanced off-page comments against current mark group.
     *
     * @param {string} comparerName
     * @param {enums.SortDirection} sortDirection
     * @returns {Immutable.List<EnhancedOffPageComment>}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getEnhancedOffPageComments = function (comparerName, sortDirection, index) {
        EnhancedOffPageCommentHelper.comparerName = comparerName;
        EnhancedOffPageCommentHelper.sortDirection = sortDirection;
        return EnhancedOffPageCommentHelper.getTableRows(markingStore.instance.enhancedOffPageCommentsAgainstCurrentResponse(index));
    };
    /**
     * generateTableHeader
     * @returns {Immutable.List<tableHeader>}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.generateTableHeader = function () {
        EnhancedOffPageCommentHelper.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(enhancedOffPageCommentGridColumns);
        var enhancedOffPageCommentHeaderCollection = EnhancedOffPageCommentHelper.getTableHeader();
        return enhancedOffPageCommentHeaderCollection;
    };
    /**
     * getTableRows
     * @param {Immutable.List<EnhancedOffPageComment>} enhancedOffPageComments
     * @returns {Immutable.List<EnhancedOffPageCommentViewDataItem>}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getTableRows = function (enhancedOffPageComments) {
        var currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        var selectedMarkSchemeId;
        if (currentQuestionItemInfo) {
            selectedMarkSchemeId = currentQuestionItemInfo.uniqueId;
        }
        var selectedEcourseworkFiles = ecourseworkFileStore.instance.getSelectedECourseWorkFiles();
        var tableRows = new Array();
        enhancedOffPageComments.map(function (item, index) {
            var isSelected = false;
            var markSchemeInfo = markingStore.instance.getMarkSchemeInfo(item.markSchemeId);
            var itemName = EnhancedOffPageCommentHelper.getItemName(markSchemeInfo);
            var itemSortIndex = EnhancedOffPageCommentHelper.getItemSortIndex(markSchemeInfo);
            var fileId;
            var fileSortIndex;
            if (EnhancedOffPageCommentHelper.getCellVisibility(gridColumnNames.File)) {
                fileId = item.fileId;
                fileSortIndex = EnhancedOffPageCommentHelper.getFileSortIndex(item.fileId);
            }
            if (selectedEcourseworkFiles && item.fileId !== 0) {
                selectedEcourseworkFiles.forEach(function (file) {
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
        var comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
        return Immutable.List(sortHelper.sort(tableRows, compareList[comparerName]));
    };
    /**
     * getItemName
     *
     * @private
     * @param {MarkSchemeInfo} markSchemeInfo
     * @returns {string}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getItemName = function (markSchemeInfo) {
        return markSchemeInfo ? markSchemeInfo.markSchemeText : '';
    };
    /**
     * getItemSortIndex
     *
     * @private
     * @param {MarkSchemeInfo} markSchemeInfo
     * @returns {number}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getItemSortIndex = function (markSchemeInfo) {
        return markSchemeInfo ? markSchemeInfo.sequenceNo : 0;
    };
    /**
     * Get enhancedOffPageCommentLength for the current question item
     */
    EnhancedOffPageCommentHelper.hasEnhancedOffPageComments = function () {
        // Adding the check to avoid the error. CurrentQuestionItemInfo object will have the proper value after next render.
        if (markingStore.instance.currentQuestionItemInfo) {
            return markingStore.instance.enhancedOffPageCommentsAgainstCurrentResponse().
                filter(function (comment) {
                return comment.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId;
            }).count();
        }
        else {
            return 0;
        }
    };
    /**
     * getFileSortIndex
     * @private
     * @param {number} fileId
     * @returns {number}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getFileSortIndex = function (fileId) {
        // we need to sort the filelist based on the sequence number (Page_Number). fileList is maintaing the order of 
        // sequence number hence we can relay the index of the eCourseWorkFile Item from collection.
        return this.getIndexOfECourseWorkFile(fileId);
    };
    /**
     * getTableHeader
     * @returns {Immutable.List<tableHeader>}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getTableHeader = function () {
        var tableHeaders = new Array();
        var gridColumns = EnhancedOffPageCommentHelper.getGridColumns(EnhancedOffPageCommentHelper.resolvedGridColumnsJson);
        gridColumns.map(function (column, index) {
            var columnName = column.GridColumn;
            var headerText = column.ColumnHeader; //key         
            var sortDirection = EnhancedOffPageCommentHelper.sortDirection;
            var sortOption = column.SortOption === 'Up' ? enums.SortOption.Up :
                column.SortOption === 'Down' ? enums.SortOption.Down : enums.SortOption.Both;
            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            var columnIndex = index + 1;
            if (EnhancedOffPageCommentHelper.getCellVisibility(columnName)) {
                tableHeaders.push({
                    columnIndex: columnIndex,
                    columnName: columnName,
                    header: headerText,
                    isSortRequired: column.Sortable === 'true',
                    isCurrentSort: column.ComparerName === EnhancedOffPageCommentHelper.comparerName,
                    sortOption: sortOption,
                    sortDirection: EnhancedOffPageCommentHelper.
                        getSortDirection((column.ComparerName === EnhancedOffPageCommentHelper.comparerName), EnhancedOffPageCommentHelper.sortDirection, sortOption),
                    style: column.CssClassName,
                    comparerName: column.ComparerName
                });
            }
        });
        return Immutable.List(tableHeaders);
    };
    /**
     * getCellVisibility
     * @param {string} columnName
     * @returns {boolean}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getCellVisibility = function (gridColumnName) {
        return gridColumnName === gridColumnNames.File ? ccValues.isECourseworkComponent ? true : false : true;
    };
    /**
     * get column index
     * @param {string} gridColumnName
     * @returns {number}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getColumnIndex = function (gridColumnName) {
        var columnIndex;
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
    };
    /**
     * getGridColumns
     *
     * @param {*} resolvedGridColumnsJson
     * @returns
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getGridColumns = function (resolvedGridColumnsJson) {
        var gridColumns;
        var responseType = ccValues.isECourseworkComponent ? 'digital' : 'image';
        switch (responseType) {
            case 'image':
                gridColumns = resolvedGridColumnsJson.enhancedOffPageComments.image.GridColumns;
                break;
            case 'digital':
                gridColumns = resolvedGridColumnsJson.enhancedOffPageComments.digital.GridColumns;
                break;
        }
        return gridColumns;
    };
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
    EnhancedOffPageCommentHelper.getSortDirection = function (isCurrentSort, sortDirection, sortOption) {
        if (isCurrentSort) {
            if (sortOption === undefined || sortOption === enums.SortOption.Both) {
                return (sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending;
            }
            else if (sortOption === enums.SortOption.Up) {
                return enums.SortDirection.Ascending;
            }
            else {
                return enums.SortDirection.Descending;
            }
        }
        else {
            return (sortOption === undefined || sortOption === enums.SortOption.Both) ? enums.SortDirection.Ascending :
                ((sortOption === enums.SortOption.Up) ? enums.SortDirection.Ascending : enums.SortDirection.Descending);
        }
    };
    /**
     * Returns the index of a eCourse workfile
     *
     * @param {number} docPageID
     * @returns {number}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getIndexOfECourseWorkFile = function (docPageID) {
        var responseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            responseDetails.esMarkGroupId : responseDetails.markGroupId;
        var index = eCourseWorkFileStore.instance.getIndexOfECourseWorkFile(markGroupId, docPageID);
        return index;
    };
    /**
     * Returns the eCourse workfile
     *
     * @param {number} docPageID
     * @returns {eCourseWorkFile}
     * @memberof EnhancedOffPageCommentHelper
     */
    EnhancedOffPageCommentHelper.getECourseWorkFile = function (docPageID) {
        var responseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            responseDetails.esMarkGroupId : responseDetails.markGroupId;
        var eCourseWorkFile = eCourseWorkFileStore.instance.getECourseWorkFile(markGroupId, docPageID);
        return eCourseWorkFile;
    };
    /**
     * Returns the index of enhanced off page comment
     * @param isMarksColumnVisibilitySwitched
     * @param allMarksAndAnnotationsLength
     */
    EnhancedOffPageCommentHelper.getEnhancedOffPageCommentIndex = function (isMarksColumnVisibilitySwitched, allMarksAndAnnotationsLength) {
        // Fix for defect 56207
        var index = isMarksColumnVisibilitySwitched ||
            (allMarksAndAnnotationsLength <= enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex) ?
            0 : enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        return index;
    };
    /**
     * Handles changes in the comment edit.
     * @param e
     */
    EnhancedOffPageCommentHelper.handleCommentEdit = function (isEdited) {
        if (!enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited) {
            enhancedOffPageCommentActionCreator.updateEnhancedOffPageComment(isEdited);
        }
    };
    return EnhancedOffPageCommentHelper;
}());
module.exports = EnhancedOffPageCommentHelper;
//# sourceMappingURL=enhancedoffpagecommenthelper.js.map