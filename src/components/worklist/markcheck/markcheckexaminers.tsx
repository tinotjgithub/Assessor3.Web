import React = require('react');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
import worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
import qigStore = require('../../../stores/qigselector/qigstore');
import worklistStore = require('../../../stores/worklist/workliststore');
import stringFormatHelper = require('../../../utility/stringformat/stringformathelper');

interface MarkCheckExaminersProps extends LocaleSelectionBase, PropsBase {

    markCheckExaminers: Immutable.List<MarkingCheckExaminerInfo>;
    onExaminerClick : Function;
}

const markCheckExaminers: React.StatelessComponent<MarkCheckExaminersProps> = (props: MarkCheckExaminersProps) => {
    let that = this;

    let toRender = props.markCheckExaminers.map((examinerData: MarkingCheckExaminerInfo) => {
        let examinerIndex: number = props.markCheckExaminers.indexOf(examinerData) + 1;
        let roleText = 'examiner-roles.' + enums.ExaminerRole[examinerData.roleID];
        let _className: string = 'profile-info';
        if (examinerData.isSelected) {
            _className = _className + ' active';
        }

        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', examinerData.toExaminer.initials);
        formattedString = formattedString.replace('{surname}', examinerData.toExaminer.surname);

        return (
            <div className={_className}
                id={'markCheckRequestedExaminerInfo_' + examinerIndex}
                onClick={() => { props.onExaminerClick(examinerData.fromExaminerID); }}>
              <a className='examiner-info relative clearfix'>
                <div className='user-photo-holder user-medium-icon sprite-icon'></div>
                <div className='user-details-holder'>
                  <div className='user-name large-text'>{formattedString}</div>
                  <div className='designation small-text'>{localeStore.instance.TranslateText('generic.' + roleText)}</div>
                    </div>
                    </a>
                </div>
            );
        });

        return (
            <div className='column-left-inner'>
                { toRender }
            </div>
        );
    };

export = markCheckExaminers;