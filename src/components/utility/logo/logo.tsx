import React = require('react');
import localeStore = require('../../../stores/locale/localestore');

interface LogoProps extends LocaleSelectionBase, PropsBase {
    onLogoClick?: Function;
    isFAMorSupportLogin?: boolean;
    logoText?: string;
}

/**
 * Returns logo based on different login mode
 * @param props
 */
const logo: React.StatelessComponent<LogoProps> = (props: LogoProps) => {

    return props.isFAMorSupportLogin ?
        <span className='assessor-logo-link breadcrumb-anchor cursor-default familiarisation'>
            <span className='sprite-icon logo-small'></span>
            <span id={props.id} className='logo-text'>
                {localeStore.instance.TranslateText(props.logoText)}
            </span>
        </span> : <span id={props.id + '_link'}
            className = 'assessor-logo-link breadcrumb-anchor cursor-default'>
            <span className = 'sprite-icon assessor-logo' id={props.id}>
                <h1>
                    {localeStore.instance.TranslateText('login.login-page.rm-assessor')}
                </h1>
            </span>
        </span>;
};

export = logo;