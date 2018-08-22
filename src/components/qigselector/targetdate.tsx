/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeHelper = require('../../utility/locale/localehelper');
import localeStore = require('../../stores/locale/localestore');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    displayTargetDate: boolean;
    markingCompletionDate: Date;
}

/**
 * Class for the Target Submit section
 */
class TargetDate extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for Qig group.
     */
    public render() {
        if (this.props.displayTargetDate) {
            return (
                <div key={ this.props.id + '_targetDateSection'}
                    className='target-date-holder small-text grey-text clearfix align-middle'>
                    <span id={ this.props.id + '_targetDateText'}>
                        {localeStore.instance.TranslateText('marking.worklist.left-panel.target-date-label') + ' ' }
                        </span>
                    <span id={ this.props.id + '_targetDate'}>
                        {this.getFormattedMarkingCompletionDate(this.props.markingCompletionDate) }
                        </span>
                    </div>
            );
        } else {
            return null;
        }
    }

    /**
     * Method which gets the formatted date to be shown in the UI
     * @param markingTargetDate
     */
    private getFormattedMarkingCompletionDate(markingTargetDate: Date) {
        let targetCompletedDate = new Date(markingTargetDate.toString());
        return localeHelper.toLocaleDateString(targetCompletedDate);
    }

}

export = TargetDate;
