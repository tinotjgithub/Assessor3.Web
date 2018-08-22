"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for All pages annotation indicator
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
/**
 * React component class for SLAO annotation indicator
 */
var AllPageAnnotationIndicator = (function (_super) {
    __extends(AllPageAnnotationIndicator, _super);
    /**
     * @constructor
     */
    function AllPageAnnotationIndicator(props, state) {
        _super.call(this, props, state);
    }
    /**
     * returns true or false to display or hide the icon
     */
    AllPageAnnotationIndicator.prototype.isAllPageAnnotationIndiactorIconShow = function () {
        /**
         * If allpage annotated cc on, all pages are not annotated and marking is completed
         * then the icon will show. in all other cases icon won't be there
         */
        /**
         * taking the cc from cc helper
         */
        var _isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, this.props.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        if (_isAllPagesAnnotatedCC && this.props.isAllAnnotated === false && this.props.isMarkingCompleted) {
            return true;
        }
        return false;
    };
    /**
     * Render component
     */
    AllPageAnnotationIndicator.prototype.render = function () {
        var className = 'sprite-icon';
        var title = '';
        var isIconVisible = this.isAllPageAnnotationIndiactorIconShow();
        if (isIconVisible) {
            return ((this.props.isTileView) ?
                (React.createElement("div", {className: 'col-inner'}, React.createElement("span", {id: 'allPagesAnnotated_' + this.props.id, key: 'allPagesAnnotated_key_' + this.props.id, className: 'sprite-icon note-and-cross-icon', title: localeStore.instance.TranslateText('marking.worklist.response-data.not-all-pages-annotated-icon-tooltip')}))) :
                (React.createElement("span", {className: 'sprite-icon note-and-cross-icon', id: 'allPagesAnnotated_' + this.props.id, key: 'allPagesAnnotated_key_' + this.props.id, title: localeStore.instance.TranslateText('marking.worklist.response-data.not-all-pages-annotated-icon-tooltip')})));
        }
        else {
            return null;
        }
    };
    return AllPageAnnotationIndicator;
}(pureRenderComponent));
module.exports = AllPageAnnotationIndicator;
//# sourceMappingURL=allpageannotationindicator.js.map