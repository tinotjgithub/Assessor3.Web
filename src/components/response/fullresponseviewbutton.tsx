/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import markingStore = require('../../stores/marking/markingstore');
import enums = require('../utility/enums');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onFullResponseClick: Function;
}

/**
 * FullResponseViewButton class
 * @param {Props} props
 * @param {any} any
 * @returns
 */
class FullResponseViewButton extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        let svgPointerEventsStyle: React.CSSProperties = {};
        svgPointerEventsStyle.pointerEvents = 'none';

        return (<li className='mrk-change-view'>
            <a  onClick = {this.handleClick}
                title= { localeStore.instance.TranslateText('marking.response.left-toolbar.full-response-view-button-tooltip') }
                id = {this.props.id} >
                <span className='svg-icon'>
                    <svg viewBox='0 0 32 32' className='change-resp-view-icon' style={svgPointerEventsStyle} role='img'>
                        <title>
                            {localeStore.instance.TranslateText('marking.response.left-toolbar.full-response-view-button-tooltip')}
                        </title>
                        <use xlinkHref = '#icon-change-resp-view' />
                    </svg>
                </span>
            </a>
        </li>);
    }

    /**
     * Handles the full response view icon click
     */
    private handleClick(): void {
        if (!applicationActionCreator.checkActionInterrupted()) {
            // return;
        }

        /* Save the selected mark scheme mark to the mark collection on response move */
        if (markingStore.instance.isMarkingInProgress) {
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
        } else {
            /* navigating from a response which is in view mode doesn't require save marks */
            this.props.onFullResponseClick();
        }

    }

    /**
     * Navigate to full response view after saving mark if there is any
     */
    private navigateAwayFromResponse = () => {
        /* if the full response view button is clicked, move to full response view */
        if (this.props.onFullResponseClick != null &&
            markingStore.instance.navigateTo === enums.SaveAndNavigate.toFullResponseview) {
            this.props.onFullResponseClick();
        }
    };

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        /* will be called after saving the currently entered amrk into the collection */
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
    }
}

export = FullResponseViewButton;