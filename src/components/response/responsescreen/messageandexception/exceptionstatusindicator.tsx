import React = require('react');
import enums = require('../../../utility/enums');
import exceptionStore = require('../../../../stores/exception/exceptionstore');
import localeStore = require('../../../../stores/locale/localestore');

/**
 * Handles the status of exception
 * @param props
 */
const exceptionStatusIndicator:
    React.StatelessComponent<{ exceptionTypeId: number, status: number }> = (props: { exceptionTypeId: number, status: number }) => {
        let renderStatus;
        let isBlocker = exceptionStore.instance.isExceptionBlocker(props.exceptionTypeId);
        if (isBlocker && props.status !== enums.ExceptionStatus.Closed) {
            let title = props.status === enums.ExceptionStatus.Resolved ? localeStore.instance.
                TranslateText('marking.response.exception-list-panel.exception-blocker-resolved') :
                localeStore.instance.TranslateText('marking.response.exception-list-panel.open-blocking-exception-tooltip');
            renderStatus = (<span className='exception-status-icon blocking-exception'
                title={title}>
                <svg width='100%' height='100%' viewBox='0 0 12 12' className='marking-exception-icon'>
                    <use xlinkHref='#exception-icon'></use>
                    </svg></span>
            );
        }
        return (
            <div className='small-text exception-status'>
                {renderStatus}
                <span className='exception-status-text'>{localeStore.instance.TranslateText('generic.exception-statuses.'
                    + enums.getEnumString(enums.ExceptionStatus, props.status).toLowerCase()) }</span>
                </div>
        );
    };

export = exceptionStatusIndicator;