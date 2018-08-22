import enums = require('../utility/enums');
import React = require('react');
let classNames = require('classnames');
import messageHelper = require('../utility/message/messagehelper');
import localeStore = require('../../stores/locale/localestore');

/* tslint:disable:variable-name */


const ExceptionCommentHistory:
    React.StatelessComponent<{
        commentedBy: string, isEscalated: boolean, updatedDate: string, comments: string
        , exceptionStatus: number, key: string, id: number
    }> =
    (props: {
        commentedBy: string, isEscalated: boolean, updatedDate: string, comments: string,
        exceptionStatus: number, key: string, id: number
    }) => {
        return (<div key={props.key} className={classNames('exception-history-item') }>
            <div className='exception-history-item-header'>
                <div className='exception-history-item-left item-title'>
                    <span className='exception-examiner' id= {'exception_commentedby' + props.id}>
                    {props.commentedBy}
                    </span><span className='exception-history-status' id= {'exception_status' + props.id}>
                        ({localeStore.instance.
                            TranslateText('generic.exception-statuses.' +
                            enums.getEnumString(enums.ExceptionStatus, props.exceptionStatus).toLowerCase())}) </span></div>
                <div className='exception-history-item-right'>
                    <div className='exception-history-tem-date'>
                        { messageHelper.getDateToDisplay(props.updatedDate) }
                    </div>
                </div>
            </div>
            <div className='exception-history-item-content'
                id= {'exception_comments' + props.id}>
                {props.comments}
            </div>
        </div>
        );

    };

export = ExceptionCommentHistory;

