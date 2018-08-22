import React = require('react');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');

interface Props extends LocaleSelectionBase, PropsBase {
    mark: string;
    showMarksChangedIndicator: boolean;
    usedInTotal: boolean;
    isNonNumeric: boolean;
}

/**
 * Stateless mark component
 * @param props
 */
/* tslint:disable:variable-name */
const Mark = (props: Props): JSX.Element => {
    let title = '';
    if (props.usedInTotal === false && props.isNonNumeric !== true && props.mark !== '-') {
        title = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.optionality-tooltip');
    }
    return (
        <span className={ classNames('mark-version',
            { 'highlight': props.showMarksChangedIndicator }) }
            title = {title} >
            <span className='mark'>
                <span className={classNames({ 'strike-out': (props.usedInTotal === false && props.isNonNumeric !== true) })}>
                    {props.mark}
                    </span>
            </span>
        </span>
    );
};

export = Mark;