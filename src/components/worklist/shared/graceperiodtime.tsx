/*
    React component for time to end the grace period
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import stringHelper = require('../../../utility/generic/stringhelper');

/**
 * Properties of time to end the grace period
 */
interface Props extends LocaleSelectionBase, PropsBase {
    timeToEndOfGracePeriod: number;
    isTileView?: boolean;
}

/**
 * React component class for time to end the grace period
 */
class GracePeriodTime extends pureRenderComponent<Props, any> {

    /**
     * Constructor for Grace period time
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
        let elementId = 'dtGrace_' + this.props.id;
        let resourceString: string = this.props.timeToEndOfGracePeriod === 1 ? 'marking.worklist.response-data.hour-to-end-of-grace' :
            'marking.worklist.response-data.hours-to-end-of-grace';

        let remaingPeriod = stringHelper.format(
            localeStore.instance.TranslateText(resourceString),
            [localeHelper.toLocaleString(this.props.timeToEndOfGracePeriod)]
        );
        remaingPeriod = (this.props.isTileView) ? remaingPeriod +
            localeStore.instance.TranslateText('marking.worklist.tile-view-labels.to-end-of-grace-period') : remaingPeriod;
        return (

            (this.props.isTileView) ?
                <div id= { elementId } className='small-text '>{remaingPeriod}</div>
                :
                <div className=' wl-grace-period'>
                    <span id= { elementId } className='small-text'>{remaingPeriod}</span>
                </div>
        );
    }
}
export = GracePeriodTime;