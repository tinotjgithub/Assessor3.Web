"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
/**
 * Stateless seed label component
 * @param props
 */
/* tslint:disable:variable-name */
var ResponseTypeLabel = function (props) {
    /* tslint:enable:variable-name */
    var responseTypeLabel;
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
    }
    else {
        return (React.createElement("div", {className: 'response-type-label small-text'}, React.createElement("span", {className: 'response-type-text'}, responseTypeLabel)));
    }
};
module.exports = ResponseTypeLabel;
//# sourceMappingURL=responsetypelabel.js.map