/* tslint:disable:no-unused-variable */
import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import domManager = require('../../utility/generic/domhelper');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import markingStore = require('../../stores/marking/markingstore');
import deviceHelper = require('../../utility/touch/devicehelper');
import eventManagerBase = require('../base/eventmanager/eventmanagerbase');
import ReactDom = require('react-dom');
import eventTypes = require('../base/eventmanager/eventtypes');
import direction = require('../base/eventmanager/direction');
import enums = require('../utility/enums');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');

/**
 * Properties of a MarkChangeReason
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isInResponse: boolean;
    isResponseEditable?: boolean;
    markChangeReason?: string;
}

/**
 * State of a MarkChangeReason
 */
interface State {
    isOpen?: boolean;
    markChangeReasonRenderedOn?: number;
    isVisible?: boolean;
}

/**
 * Mark Change Reason component.
 * @param {Props} props
 * @returns
 */
class MarkChangeReason extends eventManagerBase {
    private _markChangeReason: string;

    /** refs */
    public refs: {
        [key: string]: (Element);
        markChangeReasonTextarea: (HTMLInputElement);
    };

    private _onClick: EventListenerObject = null;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isOpen: undefined,
            markChangeReasonRenderedOn: Date.now(),
            isVisible: false
        };

        this._markChangeReason = this.props.markChangeReason;
        this.onMarkChangeReasonClick = this.onMarkChangeReasonClick.bind(this);
        this._onClick = this.handleOnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openMarkChangeReason = this.openMarkChangeReason.bind(this);
        this.onClickOfMarkChangeReason = this.onClickOfMarkChangeReason.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.showHideMarkChangeReason = this.showHideMarkChangeReason.bind(this);
    }

    /**
     * Render markchangereason text area
     */
    private renderMarkChangeReasonTextArea = (): JSX.Element => {
        return (this.props.isResponseEditable ?
            <textarea
                name='markChangeReasonTextarea'
                id='markChangeReasonTextarea'
                className='eur-edit-input'
                ref={'markChangeReasonTextarea'}
                value={this._markChangeReason ? this._markChangeReason : ''}
                onChange={this.handleChange}
                onClick={this.onClickOfMarkChangeReason}
                readOnly={!this.props.isResponseEditable}>
            </textarea> :
            <div id='markChangeReasonTextarea' className='eur-edit-input input-box'>
                {this._markChangeReason ? this._markChangeReason : ''}
            </div>);
    };

    /**
     * Render component
     * @returns
     */
    public render() {
        let _className: string = 'sprite-icon ';
        if (this._markChangeReason && this._markChangeReason.trim().length > 0) {
            _className = _className + 'edit-box-icon';
        } else if (markerOperationModeFactory.operationMode.
            hasMarkChangeReasonYellowIcon(this.props.isResponseEditable, this.props.isInResponse)) {
            _className = _className + 'edit-box-yellow-icon';
        }

        let isTeamManagement: boolean = markerOperationModeFactory.operationMode.isTeamManagementMode;

        let popoutHeader: string = isTeamManagement ?
         (this._markChangeReason ?
          localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.header') :
     localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip')) :
          localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.header');

        let menuCallOutText: string = isTeamManagement ?
            localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.header') :
            localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.body');

        if (this.props.isInResponse) {
            if (this.state.isVisible) {
                return (
                    <div className={classNames('eur-reason-holder icon-menu-wrap dropdown-wrap up white',
                        { 'open': this.state.isOpen })}
                        id='markChangeReason'  >
                        <a href='javascript:void(0)'
                            className={classNames('eur-reason-link menu-button')}
                            onClick={this.onMarkChangeReasonClick}>
                            <span className={_className}
                                title={popoutHeader}>
                            </span>
                        </a>
                        <div className='menu-callout'></div>
                        <div className='menu'>
                            <div className='eur-reason-label dim-text'>
                                {menuCallOutText}
                            </div>
                            <div className='eur-reason-edit'>
                                {this.renderMarkChangeReasonTextArea()}
                            </div>
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        } else {
            return (
                <span className={_className}
                    title={markerOperationModeFactory.operationMode.markChangeReasonTitle} >
                </span>
            );
        }
    }

    /**
     * This function gets called when the component is mounted
     */
    public componentDidMount() {
        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
        window.addEventListener('click', this._onClick);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_MARK_CHANGE_REASON, this.openMarkChangeReason);

        document.documentElement.addEventListener('touchstart', this.onScrollHandler, true);
        document.documentElement.addEventListener('touchmove', this.onScrollHandler, true);

        markingStore.instance.addListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        if (deviceHelper.isTouchDevice()) {
            this.unRegisterEvents();
        }
        window.removeEventListener('click', this._onClick);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_MARK_CHANGE_REASON, this.openMarkChangeReason);
        if (this.props.isInResponse) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarksChangeReason);
        }

        document.documentElement.removeEventListener('touchstart', this.onScrollHandler, true);
        document.documentElement.removeEventListener('touchmove', this.onScrollHandler, true);

        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED,
            this.showHideMarkChangeReason);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    }

    /**
     * This function gets called when the component is remounted
     */
    public componentDidUpdate() {
        if (this.refs && this.refs.markChangeReasonTextarea) {
            this.refs.markChangeReasonTextarea.focus();
        }
    }

    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        this._markChangeReason = nextProps.markChangeReason;
    }

    /**
     * Change visibility of mark change reason
     */
    private showHideMarkChangeReason = (): void => {
        if (markingStore.instance.isMarkChangeReasonVisible(markingStore.instance.currentMarkGroupId)) {
            this.setState({ isVisible: true });
        } else if (this.state.isVisible) {
            markingActionCreator.markChangeReasonUpdated('');
            this.setState({ isVisible: false });
        }
    };

    /**
     * This method will hook the touch events
     */
    private setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this);

        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            let touchActionValue: string = 'pan-x,pan-y';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: 0 });
            this.eventHandler.on(eventTypes.PAN, this.handleOnClick);
        }
    }

    /**
     * unsubscribing hammer touch events and handlers
     */
    private unRegisterEvents() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * Saving mark change reason
     */
    private saveMarkChangeReason() {
        if (this.props.isResponseEditable) {
            let markChangeReason: string = this.refs.markChangeReasonTextarea.value;
            if (!markChangeReason.replace(/\s/g, '').length) {
                markChangeReason = '';
            }

            markingActionCreator.markChangeReasonUpdated(markChangeReason);
        }
    }

    /**
     * handling click of MarkChangeReason text area
     */
    private onClickOfMarkChangeReason = (event: any) => {
        event.stopPropagation();
    };

    /**
     * Open mark change reason
     */
    private openMarkChangeReason = (): void => {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarksChangeReason);
        this.setState({ isOpen: true });
    };

    /**
     * Setting markchange reason text
     */
    private handleChange(e: any): void {
        if (markerOperationModeFactory.operationMode.isTeamManagementMode || this.props.isResponseEditable) {
            if (e.target.value.length <= 500) {
                this._markChangeReason = e.target.value;
                this.saveMarkChangeReason();
                this.setState({
                    markChangeReasonRenderedOn: Date.now()
                });
            }
        }
    }

    /**
     * Click event of MarkChangeReason icon
     */
    private onMarkChangeReasonClick = (event: any): any => {
        if (!markerOperationModeFactory.operationMode.isTeamManagementMode || this._markChangeReason) {
            if (this.state.isOpen) {
                this.saveMarkChangeReason();
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarksChangeReason);
            } else {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarksChangeReason);
            }
            this.setState({
                isOpen: !this.state.isOpen,
                markChangeReasonRenderedOn: Date.now()
            });
        }
    };

    /**
     * Handle click events on the window
     * @param {any} source - The source element
     */
    private handleOnClick = (source: any): any => {
        if (source.target !== undefined &&
            domManager.searchParentNode(source.target, function (el: any) { return el.id === 'markChangeReason'; }) == null
        ) {
            if (this.state.isOpen !== undefined && this.state.isOpen === true) {
                this.saveMarkChangeReason();
                this.setState({ isOpen: false });
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarksChangeReason);
            }
        }
    };

    /**
     * On mouse scroll hide context menu
     * @param event
     */
    private onScrollHandler = (event: any) => {
        if (this.state.isOpen) {
            event.stopPropagation();
        }
    };

    /**
     * On Response opened
     * When response is changed close the mark change reason text box
     */
    private onResponseOpened = () => {
        this.setState({ isOpen: false });
    }
}

export = MarkChangeReason;
