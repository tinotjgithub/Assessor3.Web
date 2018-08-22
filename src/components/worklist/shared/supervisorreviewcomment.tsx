import React = require('react');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');

interface Props extends LocaleSelectionBase, PropsBase {
    reviewCommentId: enums.SetAsReviewedComment;
}

/**
 * Stateless supervisor review comment component
 * @param props
 */
/* tslint:disable:variable-name */
const SupervisorReviewComment = (props: Props): JSX.Element => {
    /* tslint:enable:variable-name */
    if (props.reviewCommentId && props.reviewCommentId > 0) {
        return (
            < span className='dim-text small-text' >
                {localeStore.instance.TranslateText('team-management.response.review-comments.' + props.reviewCommentId)}
            </span>
        );
    } else {
        return null;
    }
};

export = SupervisorReviewComment;