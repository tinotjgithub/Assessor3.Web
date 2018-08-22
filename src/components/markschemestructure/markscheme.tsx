/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import localeStore = require('../../stores/locale/localestore');
import MarkSchemeBase = require('./markschemebase');
import constants = require('../utility/constants');
import Mark = require('./mark');

class MarkScheme extends MarkSchemeBase {

    // Current element height
    private elementHeight: number;

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);
        this.onMarkSchemeClicked = this.onMarkSchemeClicked.bind(this);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let usedInTotalClass = this.getClassForNotUsedInTotal(this.props.node.allocatedMarks.displayMark);
        let classname = 'question-item';
        let markValue: string;
        markValue = this.isTotalMarkVisible() === true ? this.props.node.allocatedMarks.displayMark : '';
        if (markValue === constants.NOT_ATTEMPTED) {
            markValue = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
        }

        if (this.props.node.allocatedMarks.displayMark !== '-') {
            classname = 'question-item marked-question';
        }
        classname = classname;

        return (
            <a href='javascript:void(0)' className={classname} onClick={this.onMarkSchemeClicked} tabIndex={-1}>
                <span className={'question-text'}
                    title={this.title}>
                    <span className={usedInTotalClass}>
                        {this.props.node.name}
                    </span>
                </span>
                {this.renderLinkIndicator()}
                {this.props.node.isUnZonedItem ? this.renderUnzonedIndicator() : null}
                <span className='question-mark'>
                    <span className={'mark-version cur' + usedInTotalClass}>
                        <span className='mark'>{markValue}</span>
                        <span>{(this.props.isNonNumeric === true) ? '' : '/'}</span>
                        <span className='mark-total'>{(this.props.isNonNumeric === true) ? ''
                            : this.props.node.maximumNumericMark}</span>
                    </span>
                    {this.renderPreviousMarks()}
                </span>
            </a>
        );
    }

    /**
     * Binded method to invoke the markscheme selection.
     */
    private onMarkSchemeClicked(): void {
        this.props.navigateToMarkScheme(this.props.node);
    }

    /**
     * This function gets invoked when the component is about to be mounted.
     */
    public componentDidMount() {
        // this will be set only once as dealing with direct DOM is heavy.
        // Transform Style is applying based on the mark scheme height. While message is open, mark scheme component is not rendered in DOM
        // and the height wont be returned, using the mark scheme height from Constants.
        this.elementHeight = constants.MARK_SCHEME_HEIGHT; // markSchemeHelper.getDomOffSet(this);
        if (this.props.node.isSelected === true) {
            this.props.onMarkSchemeSelected(this.props.node.index, this.elementHeight);
        }
    }

    /**
     * This function gets invoked when the component is about to be updated.
     */
    public componentDidUpdate() {
        // When the component has been rendered and if the markscheme is selected,
        // update the selection on UI.
        if (this.props.node.isSelected === true) {
            this.props.onMarkSchemeSelected(this.props.node.index, this.elementHeight);
        }
    }
}

export = MarkScheme;
