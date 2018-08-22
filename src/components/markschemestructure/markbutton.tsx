/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import stampStore = require('../../stores/stamp/stampstore');
import enums = require('../utility/enums');
import eCourseworkHelper = require('../utility/ecoursework/ecourseworkhelper');
import responseStore = require('../../stores/response/responsestore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    allocatedMark: AllocatedMark;
    className: string;
    isUnzoned: boolean;
}

/**
 * State of a component
 */
interface State {
    reRenderedOn: number;
}

/**
 * Marking button.
 * @param {Props} props
 * @returns
 */
class MarkButton extends pureRenderComponent<Props, State> {
    private _className: string;

    /**
     * Constructor mark button
     * @param {Props} props
     * @param {State} state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this._className = this.props.className;

        this.onMarkButtonClick = this.onMarkButtonClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        return (
            <a
                href='javascript:void(0)'
                className={this.props.className}
                onClick={this.onMarkButtonClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                draggable={false}>
                {this.props.allocatedMark.displayMark}
            </a >
        );
    }

    /**
     * Click event of mark button
     */
    private onMarkButtonClick(): void {
        if (stampStore.instance.isFavouriteToolbarEmpty
            && responseStore.instance.markingMethod !== enums.MarkingMethod.MarkFromObject
            && !eCourseworkHelper.isDigitalFile()
            && !this.props.isUnzoned
            && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner) {
            return;
        }
        /* updating the new mark to store */
        markingActionCreator.markUpdated(this.props.allocatedMark);
        markingActionCreator.setMarkEntrySelected();
    }

    /**
     * onMouseOver event of mark button to handle the hover color
     */
    private onMouseOver(): void {
        this._className = this._className + ' hover';
        this.setState({ reRenderedOn: Date.now() });
    }

    /**
     * onMouseOut event of mark button to handle the hover color
     */
    private onMouseOut(): void {
        this._className = this._className.replace(' hover', '');
        this.setState({ reRenderedOn: Date.now() });
    }
}

export = MarkButton;
