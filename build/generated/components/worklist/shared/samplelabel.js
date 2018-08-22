"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../../components/utility/enums');
/**
 * Stateless sample label component
 * @param props
 */
/* tslint:disable:variable-name */
var SampleLabel = function (props) {
    /* tslint:enable:variable-name */
    if (props.sampleCommentId === enums.SampleReviewComment.None) {
        return null;
    }
    else {
        return (React.createElement("span", {className: 'dim-text small-text'}, localeStore.instance.
            TranslateText('team-management.response.supervisor-sampling-comments.' + props.sampleCommentId)));
    }
};
module.exports = SampleLabel;
//# sourceMappingURL=samplelabel.js.map