"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
var stringFormatHelper = require('../../../utility/stringformat/stringformathelper');
/**
 * Stateless reviewed by label component
 * @param props
 */
/* tslint:disable:variable-name */
var ReviewedByLabel = function (props) {
    /* tslint:enable:variable-name */
    if (props.reviewedByInitials && props.reviewedBySurname || props.isAutoChecked) {
        return (React.createElement("span", {className: 'dim-text small-text'}, props.isAutoChecked ? localeStore.instance.
            TranslateText('team-management.examiner-worklist.response-data.auto-reviewed') : operationModeHelper &&
            props.reviewedById &&
            operationModeHelper.authorisedExaminerRoleId ===
                props.reviewedById ?
            localeStore.instance.
                TranslateText('team-management.examiner-worklist.response-data.reviewed-by-me') :
            stringFormatHelper.getFormattedExaminerName(props.reviewedByInitials, props.reviewedBySurname)));
    }
    else {
        return null;
    }
};
module.exports = ReviewedByLabel;
//# sourceMappingURL=reviewedbylabel.js.map