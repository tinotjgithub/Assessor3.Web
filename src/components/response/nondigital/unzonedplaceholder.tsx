import React = require('react');
let classNames = require('classnames');
import localeStore = require('../../../stores/locale/localestore');

interface Props extends PropsBase, LocaleSelectionBase {
}

const unZonedPlaceHolder: React.StatelessComponent<Props> = (props: Props) => {

    //svg element
    let svgElement = <g id='unzoned-content'>
        <svg viewBox='0 0 18 22' preserveAspectRatio='xMidYMid meet'>
            <g>
                {/* tslint:disable:max-line-length */}
                <path d='M17.7,4.6l-4-4.3C13.5,0.1,13.3,0,13,0H1C0.4,0,0,0.4,0,1v20c0,0.3,0.1,0.5,0.3,0.7S0.7,22,1,22h16c0.6,0,1-0.4,1-1V5.3C18,5,17.9,4.8,17.7,4.6z M15.4,5H13V2.4L15.4,5z M2,20V2h9v4c0,0.6,0.4,1,1,1h4v13H2z'></path>
                {/* tslint:enable:max-line-length */}
                <rect x='8' y='3' transform='matrix(0.7926 -0.6097 0.6097 0.7926 -4.9625 7.81)' width='2' height='16.4'></rect>
            </g>
        </svg>
    </g>;

    return (
        <div id='unzoned-holder' className='unzoned-holder'>
            <div className='unzoned-icon-holder'>
                <span className='svg-icon unzoned-icon'>
                    <svg viewBox='0 0 18 22' className='unzoned-content-icon'>
                        <use xlinkHref='#unzoned-content'>{svgElement}</use>
                    </svg>
                </span>
                <div className='unzone-msg-holder'>
                    <p className='unzoned-image-message' id='unzoned-msg-text'>
                        {localeStore.instance.TranslateText('marking.response.ebookmarking.unzoned-images-placeholder')}</p>
                </div>
            </div>
        </div >
    );

};

export = unZonedPlaceHolder;