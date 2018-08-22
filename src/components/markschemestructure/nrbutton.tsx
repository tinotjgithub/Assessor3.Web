import React = require('react');
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');

interface Props {
    onNRButtonClick: Function;
    isDisabled: boolean;
}
/**
 * Stateless NRButton component
 */
/* tslint:disable:variable-name */
const NRButton = (props: Props): JSX.Element => {
    return (
        <div id='nr-btn-holder' className='nr-btn-holder'>
            <button id='nr-btn-holder'
                className={classNames('primary nr-button shift-left', { 'hide': props.isDisabled }) }
                onClick={(e) => props.onNRButtonClick(e) }>
                {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response') }
                </button>
        </div>);
};

export = NRButton;