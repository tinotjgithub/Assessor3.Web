import React = require('react');
import localeStore = require('../../../stores/locale/localestore');

interface MarkingCheckButtonProps extends LocaleSelectionBase, PropsBase {
    onMarkingCheckButtonClick: Function;
    disable: boolean;
}

/**
 * examinerMarkingCheckButton contain the examiner's marking check button to raise marking checks.
 * @param props
 */
const markingCheckButton: React.StatelessComponent<MarkingCheckButtonProps> = (props: MarkingCheckButtonProps) => {
    return (
        <div className='status-btn-holder padding-top-10 text-center' id={props.id + '_wrapper'}>
            <button className='primary rounded req-marking-check'
                id={'marking_check_button_id'}
                key={props.id + '_key'}
                onClick={() => { props.onMarkingCheckButtonClick(); }}
                disabled={props.disable}>
                {localeStore.instance.TranslateText('marking.worklist.left-panel.request-marking-check-button')}
            </button>
        </div>
    );
};

export = markingCheckButton;