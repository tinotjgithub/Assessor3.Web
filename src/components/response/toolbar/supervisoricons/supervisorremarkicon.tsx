/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
let classNames = require('classnames');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import localeStore = require('../../../../stores/locale/localestore');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */

interface SupervisorRemarkProps extends PropsBase, LocaleSelectionBase {
    isOpen: boolean;
    isSupervisorRemarkButtonVisible: boolean;
    onRemarkButtonClicked: Function;
    onMarkNowButtonClicked: Function;
    onMarkLaterButtonClicked: Function;
    isSupervisorRemarkRaised: boolean;
}


const supervisorRemarkIcon: React.StatelessComponent<SupervisorRemarkProps> = (props: SupervisorRemarkProps) => {

    /**
     * This method displays the message within the remark holder if remark already raised for the response.
     */
    const renderRemarkRaised = () => {
        if (props.isSupervisorRemarkRaised) {
            return (<div id={'supervisor-remark-raised'} className='raise-remark-desc'>
                <p>{localeStore.instance.TranslateText
                        ('team-management.response.supervisor-remark-panel.supervisor-remark-already-raised')}</p>
            </div>);
        }
    };

    let renderButtons = (!props.isOpen) ? null : (<div className='tool-option-menu menu'>
        <div className='raise-remark-holder' id={'supervisor-remark-panel'}>
            <div className='raise-remark-title'>
                {localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.header')}
            </div>
            {renderRemarkRaised()}
            <div className='remark-button-holder'>
                <button className='button primary rounded' onClick={() => { props.onMarkNowButtonClicked(); }} id={'sup-mark-now'}>
                    {localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.mark-now-button')}
                </button>
            </div>
            <div className='remark-button-holder'>
                <button className='button rounded' onClick={() => { props.onMarkLaterButtonClicked(); }} id={'sup-mark-later'}>
                    {localeStore.instance.TranslateText('team-management.response.supervisor-remark-panel.mark-later-button')}
                </button>
            </div>
        </div>
    </div>);

    if (props.isSupervisorRemarkButtonVisible) {
        return (
            <li id='sup-icon' className={classNames('mrk-zoom-icon dropdown-wrap',
                { 'open': props.isOpen },
                { 'close': (!props.isOpen) })} onClick={() => { props.onRemarkButtonClicked(); }}
                title={localeStore.instance.TranslateText('team-management.response.left-toolbar.supervisor-remark-button-tooltip')}>
                <a className='menu-button' href='#'>
                    <span className='svg-icon'>
                        <svg className='supervisor-remark-icon' viewBox='0 0 32 32'>
                            <use xlinkHref='#supervisor-remark-icon'></use>
                        </svg>
                    </span>
                    <span className='sprite-icon toolexpand-icon'>Supervisor Remark</span>
                </a>
                {renderButtons}
            </li>
        );
    } else {
        return null;
    }

};
export = supervisorRemarkIcon;