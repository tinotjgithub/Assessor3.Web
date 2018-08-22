import React = require('react');
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../../components/utility/enums');

interface Props extends LocaleSelectionBase, PropsBase {
    sampleCommentId: number;
}

/**
 * Stateless sample label component
 * @param props
 */
/* tslint:disable:variable-name */
const SampleLabel = (props: Props): JSX.Element => {
/* tslint:enable:variable-name */
    if (props.sampleCommentId === enums.SampleReviewComment.None) {
        return null;
    } else {
        return (
            < span className= 'dim-text small-text' >
                { localeStore.instance.
                    TranslateText('team-management.response.supervisor-sampling-comments.' + props.sampleCommentId)
                }
            </span>
        );
    }
};

export = SampleLabel;