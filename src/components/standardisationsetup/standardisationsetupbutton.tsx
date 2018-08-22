import React = require('react');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
/**
 * Properties of a StandardisationSetupButtonProps
 */
interface StandardisationSetupButtonProps extends PropsBase, LocaleSelectionBase {
    onStandardisationButtonClick: Function;
    isMarkedAsProvisional: boolean;
}

/**
 * React stateless component for standardisation Setup Button on qig selector
 */
const standardisationSetupButton: React.StatelessComponent<StandardisationSetupButtonProps> = (props: StandardisationSetupButtonProps) => {
    let className = classNames(
        'sprite-icon',
        { 'remark-download-icon': !props.isMarkedAsProvisional },
        { 'downloaded-indicator-icon': props.isMarkedAsProvisional },
        'not-clickable'
    );

    return (
        <div className='middle-content standardisationsetup-holder text-center'>
            <div>
                <button className='rounded primary btn-standardisation'
                    id={'standardisation_btn'}
                    key={'key_standardisation_btn'}
                    title={localeStore.instance.TranslateText('home.qig-data.standardisation-button')}
                    onClick={() => props.onStandardisationButtonClick()}>
                    {localeStore.instance.TranslateText('home.qig-data.standardisation-button')}</button>
                <span className={className}
                    id={props.isMarkedAsProvisional ? 'stack-indicator-icon' : 'download-indicator-icon'}
                    title={props.isMarkedAsProvisional ? localeStore.instance.TranslateText('home.qig-data.stack-indicator-icon') :
                        localeStore.instance.TranslateText('home.qig-data.download-indicator-icon')
                    }></span>
            </div>
        </div>
    );
};

export = standardisationSetupButton;
