/*
    React component for allocated date of a response
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import stringHelper = require('../../../utility/generic/stringhelper');
import enums = require('../../utility/enums');
import constant = require('../../utility/constants');
import GenericDate = require('./genericdate');

/**
 * Properties of last updated date.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    dateValue?: Date;
    dateType: enums.WorkListDateType;
    showAllocatedDate: boolean;
    width?: React.CSSProperties;
    renderedOn?: number;
}

/**
 * React component class for allocated date of a response
 */
class AllocatedDate extends pureRenderComponent<Props, any> {

    private dateText: string = '';
    private elementId: string = '';

    /**
     * Constructor for Allocated date
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render component
     */
    public render() {
        return (
            (this.props.showAllocatedDate) ?
                (<div style={this.props.width}>
                    <GenericDate
                        dateValue={this.props.dateValue}
                        id={'dtalloc_' + this.props.id}
                        key={'dtalloc_' + this.props.id}
                        className={'dim-text txt-val small-text'} />
                </div>) : null
        );
    }
}
export = AllocatedDate;