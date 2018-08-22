/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import localeStore = require('../../../../../stores/locale/localestore');
import PureRenderComponent = require('../../../../base/purerendercomponent');
let classNames = require('classnames');
import enums = require('../../../../utility/enums');
import toolbarActionCreator = require('../../../../../actions/toolbar/toolbaractioncreator');
import overlayHelper = require('../../../../utility/overlay/overlayhelper');
import toolbarStore = require('../../../../../stores/toolbar/toolbarstore');
import responseStore = require('../../../../../stores/response/responsestore');
import markingStore = require('../../../../../stores/marking/markingstore');
import responseActionCreator = require('../../../../../actions/response/responseactioncreator');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    overlayIcon: string;
}

/**
 * Component state
 */
interface State {
    isSelected?: boolean;
    overlayIconDisabled?: boolean;
}

/**
 * The overlay icon component
 */
class OverlayIcon extends PureRenderComponent<Props, State> {

    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isSelected: false,
            overlayIconDisabled: markingStore.instance.currentQuestionItemInfo
            && markingStore.instance.currentQuestionItemInfo.answerItemId === 0
        };

        this.onOverlaySelection = this.onOverlaySelection.bind(this);
        this.removeOverlaySelection = this.removeOverlaySelection.bind(this);
        this.onQuestionItemChanged = this.onQuestionItemChanged.bind(this);
    }

    /**
     * This function gets called when the component is mounted
     */
    public componentDidMount() {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.removeOverlaySelection);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.onQuestionItemChanged);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.removeOverlaySelection);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.onQuestionItemChanged);
    }

    /**
     * This method gets the class for overlay icon
     */
    public render() {
        return (
            <li className={classNames('tool-wrap dt', { 'selected': this.state.isSelected })}
                id={this.props.overlayIcon}>
                <a title={localeStore.instance.TranslateText('marking.response.overlays.' + this.props.overlayIcon + '-tooltip')}
                    className={classNames('tool-link',
                        { 'disabled': this.state.overlayIconDisabled })}
                    onClick={this.onOverlaySelection}>
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className={this.props.overlayIcon + '-icon'}>
                            <use xlinkHref={'#' + this.props.overlayIcon}>
                                #shadow-root(closed)
                                    <g id='ruler'>
                                </g>
                            </use>
                        </svg>
                    </span>
                </a>
            </li>
        );
    }
    /**
     *  On selecting an overlay
     */
    private onOverlaySelection = (): void => {
        if (markingStore.instance.currentQuestionItemInfo.answerItemId !== 0 && !toolbarStore.instance.isMarkingOverlayVisible) {
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                // Calculate fracs.
                responseActionCreator.structuredFracsDataSet(enums.FracsDataSetActionSource.Acetate);
            }
            toolbarActionCreator.selectAcetate(overlayHelper.getOverlayToolType(this.props.overlayIcon));
            this.setState({
                isSelected: true
            });
        }
    }

    /**
     *  To remove selection after animation end
     */
    private removeOverlaySelection = (_selectedAcetate: any): void => {
        let that = this;
        if (_selectedAcetate === overlayHelper.getOverlayToolType(this.props.overlayIcon)) {
            setTimeout(() => {
                that.setState({
                    isSelected: false
                });
            }, 600);
        }
    }

    /**
     *  To rerender overlay icon when question item is changed
     */
    private onQuestionItemChanged(): void {
        this.setState({ overlayIconDisabled: markingStore.instance.currentQuestionItemInfo.answerItemId === 0 });
    }
}

export = OverlayIcon;