"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Stateless supervisor review comment component
 * @param props
 */
/* tslint:disable:variable-name */
var SupervisorReviewComment = function (props) {
    /* tslint:enable:variable-name */
    if (props.reviewCommentId && props.reviewCommentId > 0) {
        return (React.createElement("span", {className: 'dim-text small-text'}, localeStore.instance.TranslateText('team-management.response.review-comments.' + props.reviewCommentId)));
    }
    else {
        return null;
    }
};
module.exports = SupervisorReviewComment;
//# sourceMappingURL=supervisorreviewcomment.js.map