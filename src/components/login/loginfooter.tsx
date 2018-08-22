/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import PureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');

/**
 * Properties of a component
 */
/* tslint:disable:no-empty-interfaces */
interface Props extends LocaleSelectionBase {
}
/* tslint:enable:no-empty-interfaces */

/**
 * React component class for Login
 */
class LoginFooter extends PureRenderComponent<Props, any> {

    /**
     * Constructor Login Footer
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Renders component
     * @returns
     */
    public render() {
        return (
            <footer className='footer'>
                <div className='wrapper clearfix'>
                    <div className='col-wrap responsive-medium'>
                        <div className='col-1-of-2'>
                            <div className='copyright'>
                                { String.fromCharCode(169) + localeStore.instance.TranslateText('login.login-page.copyright') }
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

}

export = LoginFooter;

