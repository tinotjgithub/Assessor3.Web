/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import domManager = require('../../utility/generic/domhelper');
import localeStore = require('../../stores/locale/localestore');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import qigStore = require('../../stores/qigselector/qigstore');
import markByOptionActionCreator = require('../../actions/markbyoption/markbyoptionactioncreator');
import loggingHelper = require('../utility/marking/markingauditlogginghelper');
import loggerConstants = require('../utility/loggerhelperconstants');
let classNames = require('classnames');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
}

/*
 * Sates of a component
 */
interface State {
    isOpen?: boolean;
    isMBQ?: boolean;
    isClickedArrowButton?: boolean;
}

class MarkByOption extends pureRenderComponent<any, State> {

    /**
     * Constructor for Allocated response button
     * @param props
     */
    constructor(props: any) {
        super(props, null);

        this.state = {
            isOpen: false,
            isMBQ: userOptionsHelper.getUserOptionByName(userOptionKeys.IS_MBQ_SELECTED,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId)
                === 'true' ? true : false,
            isClickedArrowButton: false
        };

        this.onClickMarkByMenuButton = this.onClickMarkByMenuButton.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        return (
            <div className='mark-by-holder'>
                <label id='mark-by-label' className='mark-by-label'>
                    {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by')}
                </label>
                <div id='mark-by-menu' className={classNames('dropdown-wrap mark-by-menu',
                    {
                        'open': this.state.isOpen && this.state.isClickedArrowButton,
                        'close': !this.state.isOpen && this.state.isClickedArrowButton,
                        '': this.state.isClickedArrowButton
                    })}>
                    <a id={'markby_menu_button'} className='menu-button' onClick={this.onClickMarkByMenuButton}>
                        <span className='markby-txt'>
                            {this.state.isMBQ ?
                                localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-question')
                                : localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-candidate')}
                        </span>
                        <span className='sprite-icon menu-arrow-icon'></span>
                    </a>
                    <ul className='menu'>
                        <li>
                            <input type='radio' id='markByCandidate' name='markBy' defaultChecked={!this.state.isMBQ} />
                            <label htmlFor='markByCandidate' onClick={this.onMarkByQuestionClicked.bind(this, false)}>
                                <span className='radio-ui'></span>
                                <span className='label-text'>
                                    {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-candidate')}
                                </span>
                            </label>
                        </li>
                        <li>
                            <input type='radio' id='markByQuestion' name='markBy'
                                defaultChecked={this.state.isMBQ} />
                            <label htmlFor='markByQuestion' onClick={this.onMarkByQuestionClicked.bind(this, true)}>
                                <span className='radio-ui'></span>
                                <span className='label-text'>
                                    {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-question')}
                                </span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    /**
     * When component mounts
     */
    public componentDidMount() {
        window.addEventListener('touchend', this.handleOnClick);
        window.addEventListener('click', this.handleOnClick);
    }

    /**
     * When component unmounts
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this.handleOnClick);
        window.removeEventListener('touchend', this.handleOnClick);
    }

    /**
     * Method to handle changing of mark by option
     */
    private onMarkByQuestionClicked(isMBQChecked: boolean) {
        userOptionsHelper.save(userOptionKeys.IS_MBQ_SELECTED, isMBQChecked.toString(), true, true);
        this.setState({
            isMBQ: isMBQChecked,
            isOpen: false
        });

        // Log the marking mode changed log.
        new loggingHelper().logMBQChangeAction(loggerConstants.MARKENTRY_REASON_MARKING_MODE_CHANGED,
            loggerConstants.MARKENTRY_TYPE_MARKING_MODE_CHANGED,
            isMBQChecked);
    }

    /**
     * Method to handle onclick event of menu button
     */
    private onClickMarkByMenuButton = (): any => {
        this.setState({
            isOpen: !this.state.isOpen,
            isClickedArrowButton: true
        });
    };

    /**
     * Method which handles the click event of window
     */
    private handleOnClick = (source: any): any => {
        /** check if the clicked element is a child of the user details list item. if not close the open window */
        if (source.target !== undefined &&
            domManager.searchParentNode(source.target, function (el: any) {
                return el.id === 'markby_menu_button';
            }) == null) {
            if (this.state.isOpen !== undefined && this.state.isOpen === true) {
                /** Close the dropdown list */
                this.setState({
                    isOpen: false
                });
            }
        }
        if (source.type !== 'touchend') {
            markByOptionActionCreator.markByOptionClicked(this.state.isOpen);
        }
    };
}

export = MarkByOption;
