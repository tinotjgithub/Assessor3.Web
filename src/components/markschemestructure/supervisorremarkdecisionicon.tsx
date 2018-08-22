/* tslint:disable:no-unused-variable */
import React = require('react');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');

/**
 * Properties of Supervisor remark decision icon
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isTileView: boolean;
}

/**
 * Supervisor remark decision icon in worklist.
 * @param props
 */
const supervisorremarkdecisionicon: React.StatelessComponent<Props> = (props: Props) => {

    return (
        <div className={ classNames('col wl-eur-reason-holder', { 'text-left': props.isTileView }) }>
            <div className={'col-inner'}>
                <a className={'resp-alerts'} title={localeStore.instance.TranslateText
                    ('marking.worklist.response-data.supervisor-remark-decision-not-specified-icon-tooltip')}>
                    <span className={'sprite-icon edit-box-yellow-icon'}  id={props.id}>
                        </span>
                    </a>
                </div>
            </div>
    );
};

export = supervisorremarkdecisionicon;
