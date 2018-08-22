/*
  React component for Reuse button header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import standardisationActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');

interface Props extends LocaleSelectionBase, PropsBase {
    displayId?: string;
    isDisabled: boolean;
    renderedOn?: number;
}

/**
 * State of a ReuseButton
 */
interface State {
    reRender?: number;
}

class ReuseButton extends PureRenderComponent<Props, State> {

    /**
     * Constructor for ReuseButton
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            reRender: Date.now()
        };
        this.onReuseClick = this.onReuseClick.bind(this);
    }

   /**
    * Render component
    */
    public render() {
        return (
            <button
            id={'reuse_button_id_' + this.props.id}
            key={'reuse_button_key_' + this.props.id}
            disabled={this.props.isDisabled ? true : false}
            title={(this.props.isDisabled ?
                localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.disable-tooltip')
                : localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.enable-tooltip'))}
            className={'primary button rounded popup-nav reusebtn'}
            onClick={this.onReuseClick}>
                {(this.props.isDisabled ? localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.disable')
                : localeStore.instance.TranslateText('standardisation-setup.previous-session.reuse-button.enable'))}
        </button>
        );
    }

    /**
     * On Reuse click
     */
    private onReuseClick() {
        standardisationActionCreator.reuseRigActionPopupOpen(this.props.displayId);
    }
}
export = ReuseButton;

