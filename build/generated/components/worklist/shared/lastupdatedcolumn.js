"use strict";
/*
    React component for last updated date and time of a response.S
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var constants = require('../../utility/constants');
var GenericDate = require('./genericdate');
/**
 * React component class for time to end the grace period
 */
var lastUpdatedColumn = function (props) {
    if (props.dateType === enums.WorkListDateType.lastUpdatedDate || enums.WorkListDateType.submittedDate) {
        /**
         * Last updated date
         */
        var displayValue = void 0;
        var formattedDate = void 0;
        if (props.dateValue) {
            formattedDate = (React.createElement(GenericDate, {dateValue: props.dateValue, id: 'dtup_' + props.id, key: 'dtup_' + props.id, className: constants.LASTUPDATED_COLUMN_STYLE}));
        }
        else {
            /**
             * If marking is not started the dateValue prop should be undefined , and shows marking not started text
             */
            formattedDate = (React.createElement(GenericDate, {id: 'dtup_' + props.id, key: 'dtup_' + props.id, className: constants.LASTUPDATED_COLUMN_STYLE, displayText: localeStore.instance.TranslateText('marking.worklist.response-data.marking-not-started')}));
        }
        return (React.createElement("div", null, formattedDate));
    }
};
module.exports = lastUpdatedColumn;
//# sourceMappingURL=lastupdatedcolumn.js.map