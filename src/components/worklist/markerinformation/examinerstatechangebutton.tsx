import React = require('react');
import localeStore = require('../../../stores/locale/localestore');

interface ChangeExaminerStateProps extends LocaleSelectionBase, PropsBase {
    showExaminerStateChangePopup: Function;
    isDisabled: boolean;
}

/**
 * changeExaminerStateButton contain the examiner state change button and its click event.
 * @param props
 */
const examinerStateChangeButton: React.StatelessComponent<ChangeExaminerStateProps> = (props: ChangeExaminerStateProps) => {
    return (
        <div className='status-btn-holder padding-top-10 text-center'>
            <button className='primary rounded change-sts-btn popup-nav'
                id='examinerstatechangebutton'
                data-popup='changeStatus' aria-haspopup='true'
                onClick={() => { props.showExaminerStateChangePopup(); }}
                disabled={props.isDisabled}>
                {localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.change-status-button')}
            </button>
        </div>
    );
};

export = examinerStateChangeButton;