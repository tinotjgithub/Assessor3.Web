/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import LanguageSelector = require('../utility/locale/languageselector');
import localeStore = require('../../stores/locale/localestore');
import htmlUtilities = require('../../utility/generic/htmlutilities');
declare let languageList: any;
import enums = require('../utility/enums');
import Logo = require('../utility/logo/logo');

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
}
/* tslint:enable:no-empty-interfaces */

/**
 * React component class for Login
 */
class LoginHeader extends pureRenderComponent<Props, any> {

    private timeout: any;
    private lastTap: number = 0;

    /**
     * Constructor LoginHeader
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render component
     */
    public render() {
        return (
            <header className='fixed'>
                <div className='wrapper clearfix'>
                  <div className='breadcrumb-holder'>
                        <ul className='breadcrumb'>
                            <li className='breadcrumb-item dropdown-wrap header-dropdown'>
                           <Logo
                               id= 'a3Logo_loginPage'
                               key = 'key_a3Logo_loginPage'
                               selectedLanguage={this.props.selectedLanguage} />
                                </li>
                            </ul>
                      </div>

                    <ul className='nav shift-right' role='menubar'>
                        <LanguageSelector availableLanguages={languageList}
                            selectedLanguage={this.props.selectedLanguage}
                            isBeforeLogin={true} />
                    </ul>
                </div>
                <div className='blue-strip'></div>
            </header>
        );
    }

    /**
     * Component did  mount
     */
    public componentDidMount() {
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            document.documentElement.addEventListener('touchstart', this.blockPinchToZoom, false);
            document.documentElement.addEventListener('touchend', this.blockDoubleTapZoom, false);
        }
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            document.documentElement.removeEventListener('touchstart', this.blockPinchToZoom, false);
            document.documentElement.removeEventListener('touchend', this.blockDoubleTapZoom, false);
        }
    }

    /**
     * This will block the double-tap zoom in ipad
     */
    private blockDoubleTapZoom = (e: any): void => {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - this.lastTap;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        this.lastTap = currentTime;
    };

    /**
     * This will block the pinch-to-zoom in ipad
     */
    private blockPinchToZoom = (e: any): void => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    };
}

export = LoginHeader;


