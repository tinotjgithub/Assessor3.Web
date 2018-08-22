/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import LanguageSelector = require('../../utility/locale/languageselector');
import localeStore = require('../../../stores/locale/localestore');
let classNames = require('classnames');
import LogoutConfirmationDialog = require('../../logout/logoutconfirmationdialog');
declare let languageList: any;

 /**
  * Properties of User options
  */
interface Props extends LocaleSelectionBase {
    isUserOptionLoaded?: boolean;
}

/**
 * Represents the user option
 */
const useroption = (props: Props) => {

    return (
        <div className='edit-settings-holder' aria-hidden='true'>
                    <div className='tab-holder horizontal'>
                        <div className='tab-content-holder'>
                            <div id='settingsTab1' role='tabpanel' aria-hidden='false'
                                className={classNames('tab-content text-left active') }>
                                <div className='language-settings form-field inline'>
                                    <label className='label' htmlFor='langSelected'>
                                        {localeStore.instance.TranslateText('generic.user-menu.user-options.language') }
                                        </label>
                                    <LanguageSelector availableLanguages = {languageList}
                                        selectedLanguage = {props.selectedLanguage}
                                        isBeforeLogin = {false} />
                                    </div>
                                <LogoutConfirmationDialog
                                    selectedLanguage={props.selectedLanguage}
                                    isUserOptionLoaded={props.isUserOptionLoaded}/>
                                </div>
                            </div>
                        </div>
            </div>
    );
};
export = useroption;