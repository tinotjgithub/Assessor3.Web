/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import enums = require('../utility/enums');
import standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');

interface Props extends LocaleSelectionBase, PropsBase {
    title: string;
    anchorclassName?: string;
    spanclassName?: string;
    id: string;
    displayId: string;
	totalMarkValue: number;
	candidateScriptId: number;
    esCandidateScriptMarkSchemeGroupId: number;
    markSchemeGroupId: number;
	markingModeId: number;
    rigOrder: number;
    esMarkGroupRowVersion: string;
}

/**
 * React component class for Generic button implementation.
 */
class DeclassifyButton extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        let buttonElement: JSX.Element;
        buttonElement = (
            <a title={this.props.title}
                className={this.props.anchorclassName}
                id={this.props.id}
                key={this.props.id}
                onClick={this.onClick}
            >
                <span className={this.props.spanclassName} />
            </a>
        );
        return buttonElement;
    }

    /**
     * Click event
     * @param evnt
     */
	private onClick(evnt: any) {
		standardisationActionCreator.declassifyPopupOpen(this.props.displayId, this.props.totalMarkValue,
            this.props.candidateScriptId, this.props.esCandidateScriptMarkSchemeGroupId,
            this.props.markingModeId, this.props.rigOrder,
            this.props.esMarkGroupRowVersion, this.props.markSchemeGroupId);
    }
}

export = DeclassifyButton;