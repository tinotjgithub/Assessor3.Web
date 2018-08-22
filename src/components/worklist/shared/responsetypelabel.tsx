/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');

interface Props extends LocaleSelectionBase, PropsBase {
    isResponseTypeLabelVisible: boolean;
    responseType?: enums.ResponseType;
}

/**
 * Stateless seed label component
 * @param props
 */
 /* tslint:disable:variable-name */
const ResponseTypeLabel = (props: Props): JSX.Element => {
    /* tslint:enable:variable-name */

    let responseTypeLabel;
    switch (props.responseType) {
        case enums.ResponseType.Seed:
            responseTypeLabel = localeStore.instance.TranslateText('marking.worklist.response-data.seed-indicator');
            break;
        case enums.ResponseType.PromotedSeed:
            responseTypeLabel = localeStore.instance.TranslateText('marking.worklist.response-data.promoted-seed-indicator');
            break;
        case enums.ResponseType.Definitive:
            responseTypeLabel = localeStore.instance.TranslateText('marking.worklist.response-data.definitive-indicator');
            break;
        case enums.ResponseType.WholeResponse:
            responseTypeLabel = localeStore.instance.TranslateText('marking.worklist.response-data.wholeresponse-indicator');
    }

    if (!props.isResponseTypeLabelVisible) {
        return null;
    } else {

        return (<div className='response-type-label small-text'>
            <span className='response-type-text'>
                { responseTypeLabel  }
                    </span>
                </div>);
    }
};

export = ResponseTypeLabel;