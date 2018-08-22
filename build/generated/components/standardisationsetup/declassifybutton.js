"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
/**
 * React component class for Generic button implementation.
 */
var DeclassifyButton = (function (_super) {
    __extends(DeclassifyButton, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function DeclassifyButton(props, state) {
        _super.call(this, props, state);
        this.onClick = this.onClick.bind(this);
    }
    /**
     * Render method
     */
    DeclassifyButton.prototype.render = function () {
        var buttonElement;
        buttonElement = (React.createElement("a", {title: this.props.title, className: this.props.anchorclassName, id: this.props.id, key: this.props.id, onClick: this.onClick}, React.createElement("span", {className: this.props.spanclassName})));
        return buttonElement;
    };
    /**
     * Click event
     * @param evnt
     */
    DeclassifyButton.prototype.onClick = function (evnt) {
        standardisationActionCreator.declassifyPopupOpen(this.props.displayId, this.props.totalMarkValue, this.props.candidateScriptId, this.props.esCandidateScriptMarkSchemeGroupId, this.props.markingModeId, this.props.rigOrder);
    };
    return DeclassifyButton;
}(pureRenderComponent));
module.exports = DeclassifyButton;
//# sourceMappingURL=declassifybutton.js.map