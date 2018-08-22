/*
    React component for generic date.
*/
import React = require('react');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import stringHelper = require('../../../utility/generic/stringhelper');
import enums = require('../../utility/enums');
import constant = require('../../utility/constants');

interface GenericDate extends LocaleSelectionBase, PropsBase {
    dateValue?: Date;
    id: string;
    className: string;
    displayText?: string;
}

/**
 * Stateless component for generic date.
 * @param props
 */
const genericDate: React.StatelessComponent<GenericDate> = (props: GenericDate) => {
    let dateValue : string = props.displayText ? props.displayText : localeHelper.toLocaleDateTimeString(props.dateValue);
    return (
        <span id={props.id} className={props.className}>
            {dateValue}
        </span>
    );
};

export = genericDate;