import React = require('react');
import localeStore = require('../../../../stores/locale/localestore');
let classNames = require('classnames');

interface Props extends PropsBase, LocaleSelectionBase {
    fileName: string;
}

const downloadableFileItem: React.StatelessComponent<Props> = (props: Props) => {

    // svg element for file icon
    let svgElement = <g id='unknonwn-file-icon'>
        <svg viewBox='0 0 18 22' preserveAspectRatio='xMidYMid meet'>
            {/* tslint:disable:max-line-length */}
            <path d='M17,22H1c-0.3,0-0.5-0.1-0.7-0.3C0.1,21.5,0,21.3,0,21V1c0-0.6,0.4-1,1-1h12c0.3,0,0.5,0.1,0.7,0.3l4,4.3 C17.9,4.8,18,5,18,5.3V21C18,21.6,17.6,22,17,22z M2,20h14V5.7L12.6,2H2V20z'></path>
            {/* tslint:enable:max-line-length */}
            <path d='M17,7h-5c-0.6,0-1-0.4-1-1V1h2v4h4V7z'></path>
        </svg>
    </g>;

        return (
            <div className='file-exception-wrapper'>
                <div className='file-exception-msg'>
                    <div className='exception-file-type'>
                        <div className='file-icon'>
                            <span className='svg-icon'>
                                <svg viewBox='0 0 18 22' className='unknown-file-icon'>
                                    <use xlinkHref='#unknonwn-file-icon'>{svgElement}</use>
                                </svg>
                            </span>
                        </div>
                        <div className='file-name'>{props.fileName}</div>
                    </div>
                    <p className='exception-msg' id='msg-text'>
                        {localeStore.instance.TranslateText('marking.response.ecoursework-unsupported-file-placeholder.line-1')}&#xB3;{'.'}
                        <br/>{localeStore.instance.TranslateText('marking.response.ecoursework-unsupported-file-placeholder.line-2')}</p>
                </div>
            </div>
    );
};

export = downloadableFileItem;