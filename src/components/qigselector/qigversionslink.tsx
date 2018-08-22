import React = require('react');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');

/**
 * Properties of the component.
 */
interface QigVersionsLinkProps extends PropsBase, LocaleSelectionBase {
    onQigVersionLinkClick?: Function;
}

/**
 * React stateless component for qig versions link.
 */
const qigVersionsLink: React.StatelessComponent<QigVersionsLinkProps> = (props: QigVersionsLinkProps) => {

    /**
     * On selecting the qig versions link.
     */
    const onLinkSelection = () => {
        props.onQigVersionLinkClick();
    };

    return (
        <div className='qig-col5 shift-right qig-col vertical-middle'>
            <div className='middle-content text-center'>
                <a href='javascript:void(0);' className='panel-link'
                    title={localeStore.instance.TranslateText('home.qig-data.qig-versions-link-tooltip')}
                    aria-expanded='true' onClick={onLinkSelection} id={props.id}>
                    <span className='hide-paper'>{localeStore.instance.TranslateText('home.qig-data.hide-paper-versions-link')}</span>
                    <span className='show-paper'>{localeStore.instance.TranslateText('home.qig-data.show-paper-versions-link')}</span>
                    <span className='small-bottom-arrow-blue sprite-icon'></span>
                </a>
            </div>
        </div>
    );
};

export = qigVersionsLink;