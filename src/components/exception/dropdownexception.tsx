import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import React = require('react');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');

interface DropDownItems {
    id: number;
    key: string;
    isOpen: boolean;
    isChecked: boolean;
    onClick: Function;
    showExceptionDesc: Function;
    isDisabled: boolean;
    description: string;
    blockerDescription: string;
}

/* tslint:disable:variable-name */

const DropDownException:
    React.StatelessComponent<DropDownItems> =
    (props: DropDownItems) => {
        let isOpen: string = props.isOpen ? 'open' : 'close';
        let description: string = '';

        let checkBox: JSX.Element = < input type= 'radio' aria-label='exception'
            value= 'selected' id= {'exceptionType' + props.id} key= {props.id}
            name='exceptionType' checked= {props.isChecked}/>;

        if (props.isDisabled) {
            checkBox = < input type= 'radio' aria-label='exception' value= 'selected' id= {'exceptionType' + props.id} key= {props.id}
                name= 'exceptionType' disabled/>;
        }

        if (props.description === '') {
            description = localeStore.instance.TranslateText('generic.exception-types.' + props.id + '.details');
        } else {
            description = props.description;
        }

        return (
            <div className={'exception-type-menu-item menu-item panel ' + isOpen} role='menuitem'>
                {checkBox}
                <label onClick={props.onClick.bind(this, props.id, props.isDisabled) }>
                    <span className='radio-ui'></span>
                    <span className='label-text'>
                        { localeStore.instance.TranslateText('generic.exception-types.' + props.id + '.name') }
                    </span>
                </label>
                <span className='sprite-icon info-round-icon panel-link'
                    onClick={props.showExceptionDesc.bind(this, props.id, isOpen) }></span>
                <div className='menu-callout'></div>
                <div className='panel-content exception-type-info padding-all-15' aria-hidden='true'>
                    <div className='info-item'>
                        { description }
                    </div>
                    <div className='info-item'>
                        {props.blockerDescription}
                    </div>
                </div>
            </div>
        );

    };

export = DropDownException;

/* tslint:enable */