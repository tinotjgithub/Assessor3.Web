/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import stringHelper = require('../../utility/generic/stringhelper');
import constants = require('../utility/constants');

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
class LoginSlider extends pureRenderComponent<Props, any> {

    /**
     * Constructor LoginSlider
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
        this.state = {

        };
    }

    /**
     * Render method
     */
    public render() {
        let sliderTextHeader = stringHelper.format(localeStore.instance.TranslateText('login.login-page.welcome-message'),
            [String(String.fromCharCode(179))]);
        return (
            <div className='col-1-of-2'>
                <div className='slider-holder'>
                    <div className='horizontal-carousel-container'>
                        <div className='horizontal-carousel-inner'>
                            <div className='horizontal-carousel-mask'>
                                <div className='horizontal-carousel-wrap'>
                                    <div className='horizontal-slide active text-centre' id='slide0'>
                                        <h3>{sliderTextHeader}</h3>
                                        <p>{this.getResourceText('login.login-page.welcome-detail') }</p>
                                    </div>
                                    <div className='horizontal-slide hide text-centre' id='slide1'>
                                        <h3>{sliderTextHeader}</h3>
                                        <p>{this.getResourceText('login.login-page.welcome-detail') }</p>
                                    </div>
                                    <div className='horizontal-slide hide text-centre' id='slide2'>
                                        <h3>{sliderTextHeader}</h3>
                                        <p>{this.getResourceText('login.login-page.welcome-detail') }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * gets text from resource file
     * @param resourceKey
     */
    private getResourceText(resourceKey: string) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey),
            [constants.NONBREAKING_HYPHEN_UNICODE]);
    }
}

export = LoginSlider;


