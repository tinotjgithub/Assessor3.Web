/*
    React component for last updated date and time of a response.S
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import stringHelper = require('../../../utility/generic/stringhelper');
import enums = require('../../utility/enums');
import constants = require('../../utility/constants');
import GenericDate = require('./genericdate');
/**
 * Properties of last updated date.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    dateValue?: Date;
    dateType: enums.WorkListDateType;
    isTileView?: boolean;
}

/**
 * React component class for time to end the grace period
 */
const lastUpdatedColumn = (props: Props) => {

    if (props.dateType === enums.WorkListDateType.lastUpdatedDate || enums.WorkListDateType.submittedDate) {
        /** 
         * Last updated date
         */
        let displayValue;
        let formattedDate: JSX.Element;
        if (props.dateValue) {
            formattedDate = (<GenericDate
                                dateValue={props.dateValue}
                                id={'dtup_' + props.id}
                                key={'dtup_' + props.id}
                                className={constants.LASTUPDATED_COLUMN_STYLE} />);

        } else {
            /** 
             * If marking is not started the dateValue prop should be undefined , and shows marking not started text
             */
            formattedDate = (<GenericDate
                                id={'dtup_' + props.id}
                                key={'dtup_' + props.id}
                                className={constants.LASTUPDATED_COLUMN_STYLE}
                                displayText={localeStore.instance.TranslateText('marking.worklist.response-data.marking-not-started')} />);
        }

        return (
            <div>{formattedDate}</div>
        );
    }
};
export = lastUpdatedColumn;