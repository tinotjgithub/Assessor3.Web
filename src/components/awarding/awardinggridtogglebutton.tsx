import React = require('react');
import awardingStore = require('../../stores/awarding/awardingstore');
import localeStore = require('../../stores/locale/localestore');

/**
 * Properties of a component
 */
interface Props {
	groupByGrade: boolean;
	switchGridToggle: Function;
}

/**
 * React component for Awarding Container
 */

const awardingGridToggleButton:
    React.StatelessComponent<Props> = (props: Props) => {
        return (
            <div className='items right' id='awardinggridtogglebutton' key='toggle-candidate-details-grid'>
                <ul className='filter-menu'>
                    <li className='switch-view-btn' onClick={props.switchGridToggle.bind(this)}>
                        <a id='toggle-candidate-details-text' href='javascript:void(0);' className='switch-view'
                            title={!props.groupByGrade ?
                            localeStore.instance.TranslateText('awarding.right-panel.order-by-grade') :
                            localeStore.instance.TranslateText('awarding.right-panel.order-by-total-mark')}>
                            <span className='sprite-icon grid-view-icon'></span>
                            <span className='view-text' id= {props.groupByGrade ?
                                'toggle-candidate-details-text-orderbygrade' :
                                'toggle-candidate-details-text-totalmark'}>
                                {!props.groupByGrade ?
                                    localeStore.instance.TranslateText('awarding.right-panel.order-by-grade') :
                                    localeStore.instance.TranslateText('awarding.right-panel.order-by-total-mark')}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        );
    };
export = awardingGridToggleButton;