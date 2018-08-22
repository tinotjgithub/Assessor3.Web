import React = require('react');
let classNames = require('classnames');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface ReturnResponseToMarkerIconsProps extends PropsBase, LocaleSelectionBase {
    onReturnResponseToMarkerIconClicked: Function;
}

const returnResponseToMarkerIcons: React.StatelessComponent<ReturnResponseToMarkerIconsProps> =
    (props: ReturnResponseToMarkerIconsProps) => {
    return (<div className='icon-tray return-supervisor-icons'
        onClick={() => { props.onReturnResponseToMarkerIconClicked(); }}>
        <ul>
            <li id='retunSupervisoIcon' className='return-supervisor-icon'>
                <a href='#' title='Return to marker' className='menu-button'>
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='mag-glass-icon'>
                            <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='#return_response_icon'>
                            </use>
                        </svg>
                    </span>
                </a>
            </li>
        </ul>
    </div>);
};
export = returnResponseToMarkerIcons;