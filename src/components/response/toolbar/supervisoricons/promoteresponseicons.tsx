/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import localeStore = require('../../../../stores/locale/localestore');
let classNames = require('classnames');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */

interface PromoteResponseIconsProps extends PropsBase, LocaleSelectionBase {
    isOpen: boolean;
    isPromotToSeedVisible: boolean;
    isPromotToReuseBucketVisible: boolean;
    onPromoteResponseButtonClicked: Function;
    onPromoteToSeedButtonClicked: Function;
    onPromoteToReuseButtonClicked: Function;
}

const promoteResponseIcons: React.StatelessComponent<PromoteResponseIconsProps> = (props: PromoteResponseIconsProps) => {

    // render TO seed and To Re-use Bucket buttons.
    let renderButtons = (!props.isOpen) ? null : (<div className='tool-option-menu menu' aria-hidden='true' aria-label='submenu'>
        <div className='raise-remark-holder'>
            <p>{localeStore.instance.TranslateText('team-management.response.promote-panel.header')}</p>
            <div className='remark-button-holder'>
                <button id='id-to-seed' className='button primary rounded'
                    title={localeStore.instance.TranslateText('team-management.response.left-toolbar.promote-to-seed-button-tooltip')}
                    onClick= {() => {props.onPromoteToSeedButtonClicked(); }}>
                    {localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-seed-button')}
                </button>
            </div>
            <div className='remark-button-holder'>
                <button id='id-to-reuse-bucket' className='button rounded'
                    title={localeStore.instance.TranslateText
                        ('team-management.response.promote-panel.promote-to-reuse-bucket-button-tooltip')}
                    onClick={() => { props.onPromoteToReuseButtonClicked(); }}>
                {localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-reuse-bucket-button')}
             </button>
            </div>
        </div>
    </div>);

    if (props.isPromotToSeedVisible && props.isPromotToReuseBucketVisible) {
        return (
            <li id='promote-Response-Icons-dropdown-wrap'
                className={classNames('promote-seed-icon dropdown-wrap',
                { 'open': props.isOpen },
                { 'close': (!props.isOpen) })}
                title={localeStore.instance.TranslateText('team-management.response.promote-panel.header')}
                onClick={() => { props.onPromoteResponseButtonClicked(); }}
                role='navigation' aria-label='Promote response dropdowns'>
                <a className='menu-button' href='#' aria-haspopup='true'>
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='promote-response-icon'>
                            <use xlinkHref='#promote-seed-icon'></use>
                        </svg>
                    </span>
                    <span id='sprite-icon-toolexpand-promote-id' className='sprite-icon toolexpand-icon'></span>
                </a>
                {renderButtons}
            </li>
        );
    } else if (props.isPromotToSeedVisible && !props.isPromotToReuseBucketVisible) {
        return (
            < li id={'promote-to-seed'} key={'promote-to-seed-key'} className='promote-seed-icon'
                title={localeStore.instance.TranslateText('team-management.response.left-toolbar.promote-to-seed-button-tooltip')}
                onClick={() => { props.onPromoteToSeedButtonClicked(); }}>
                <a className='menu-button' href='#'>
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='promote-response-icon'>
                            <use xlinkHref='#promote-seed-icon'></use>
                        </svg>
                    </span>
                </a>
            </li>
        );
    } else if (!props.isPromotToSeedVisible && props.isPromotToReuseBucketVisible){
        return (
            < li id={'promote-to-reuse'} key={'promote-to-reuse-key'} className='promote-seed-icon'
                title={localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-reuse-bucket-button-tooltip')}
                onClick={() => { props.onPromoteToReuseButtonClicked(); }}>
                <a className='menu-button' href='#'>
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='promote-response-icon'>
                            <use xlinkHref='#promote-seed-icon'></use>
                        </svg>
                    </span>
                </a>
            </li>
        );
    } else {
        return null;
    }
};
export = promoteResponseIcons;