import React = require('react');
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
import stringFormatHelper = require('../../../utility/stringformat/stringformathelper');

interface Props extends LocaleSelectionBase, PropsBase {
    reviewedById: number;
    reviewedByInitials: string;
    reviewedBySurname: string;
    isAutoChecked: boolean;
}

/**
 * Stateless reviewed by label component
 * @param props
 */
/* tslint:disable:variable-name */
const ReviewedByLabel = (props: Props): JSX.Element => {
    /* tslint:enable:variable-name */
    if (props.reviewedByInitials && props.reviewedBySurname || props.isAutoChecked) {
        return (
            < span className='dim-text small-text' >
                {props.isAutoChecked ? localeStore.instance.
                    TranslateText('team-management.examiner-worklist.response-data.auto-reviewed') : operationModeHelper &&
                    props.reviewedById &&
                    operationModeHelper.authorisedExaminerRoleId ===
                    props.reviewedById ?
                    localeStore.instance.
                        TranslateText('team-management.examiner-worklist.response-data.reviewed-by-me') :
                    stringFormatHelper.getFormattedExaminerName
                        (props.reviewedByInitials, props.reviewedBySurname)
                }
            </span>
        );
    } else {
        return null;
    }
};

export = ReviewedByLabel;