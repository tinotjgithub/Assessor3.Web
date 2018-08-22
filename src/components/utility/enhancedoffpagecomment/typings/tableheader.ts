import enums = require('../../enums');

interface TableHeader {
    columnIndex: number;
    columnName: string;
    header: string;
    style: string;
    isSortRequired: boolean;
    isCurrentSort: boolean;
    comparerName: string;
    sortDirection?: enums.SortDirection;
    sortOption?: enums.SortOption;
}

export = TableHeader;