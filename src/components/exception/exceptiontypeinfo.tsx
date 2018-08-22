import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import ExceptionActionButton = require('./exceptionactionbutton');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');

interface ExceptionInfoItems {
    exceptionTypeId: number;
    status: number;
    markSchemeId: number;
    key: string;
    id: string;
    onActionException: Function;
    isExceptionActionAvailable: boolean;
    alternativeEscalationPoint: number;
    isPE: boolean;
    questionName: string;
}

interface State {
    showExceptionDescription?: boolean;
}

/* tslint:disable:variable-name */

class ExceptionTypeInfo extends pureRenderComponent<any, any>  {
    /** refs */
    public refs: {
        [key: string]: (Element);
        caption: (HTMLInputElement);
    };

    //exception name span width
    private _exceptionTypeSpanWidth: number;
    //exception description callout padding
    private _calloutPadding: number = 6;

    /**
     * Constructor ExceptionTypeInfo
     * @param props
     * @param state
     */
    constructor(props: ExceptionInfoItems, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            showExceptionDescription: false
        };

        this.showExceptionDescription = this.showExceptionDescription.bind(this);
    }

    /**
     * Component will receive props
     */
    public componentWillReceiveProps() {
        //close the description when the component recieves new props
        this.setState({
            showExceptionDescription: false
        });
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        //set type call out style based in the exception name width
        this._exceptionTypeSpanWidth = ReactDom.findDOMNode(this.refs.caption).getBoundingClientRect().width;
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {
        //set tyhe call out style based in the exception name width
        this._exceptionTypeSpanWidth = ReactDom.findDOMNode(this.refs.caption).getBoundingClientRect().width;
    }


    /**
     * Render
     */
    public render(): JSX.Element {
        //setting callout style
        let styleCallout: React.CSSProperties = {
            left: this._exceptionTypeSpanWidth + this._calloutPadding
        };

        let closeException = (!markerOperationModeFactory.operationMode.isTeamManagementMode &&
            this.props.status === enums.ExceptionStatus.Resolved ?
            <ExceptionActionButton
                id={'exception_action_close'}
                key={'exception_action_close'}
                content={localeStore.instance.TranslateText('generic.response.view-exception-panel.' +
                    enums.ExceptionActionType[enums.ExceptionActionType.Close])}
                className={'sprite-icon tick-round-icon'}
                onActionException={this.props.onActionException.bind(this, enums.ExceptionActionType.Close)} />
            : null);

        let escalateException = (this.props.isExceptionActionAvailable &&
            (this.props.alternativeEscalationPoint !==
                enums.EscalationPoint.None || !this.props.isPE) ? <ExceptionActionButton
                id='exception_action_escalate'
                key='exception_action_escalate'
                content={localeStore.instance.TranslateText('generic.response.view-exception-panel.' +
                    enums.ExceptionActionType[enums.ExceptionActionType.Escalate])}
                className='sprite-icon round-arrow-up-icon'
                onActionException={this.props.onActionException.bind(this, enums.ExceptionActionType.Escalate)} />
            : null);

        let resolveException = (this.props.isExceptionActionAvailable ? <ExceptionActionButton
            id='exception_action_resolve'
            key='exception_action_resolve'
            content={localeStore.instance.TranslateText('generic.response.view-exception-panel.' +
                enums.ExceptionActionType[enums.ExceptionActionType.Resolve])}
            className='sprite-icon round-arrow-down-icon'
            onActionException={this.props.onActionException.bind(this, enums.ExceptionActionType.Resolve)} />
            : null);

        let actionException = (<div className='exception-header-right'>
            {escalateException}
            {resolveException}
            {closeException}
        </div>);

        return (<div className={classNames('exception-detail-header  panel',
            this.state.showExceptionDescription ? 'open' : '')} key={'key_' + this.props.id}>
            <div className='exception-header-row'>
                <div className='exception-header-left'>
                    <div className='exception-type'>
                        <span ref={'caption'} className='exception-type-caption'>
                            {localeStore.instance.TranslateText('generic.exception-types.' +
                                this.props.exceptionTypeId + '.name')}
                        </span>
                        <span className='sprite-icon info-round-icon panel-link' onClick={this.showExceptionDescription}>
                        </span></div>
                </div>
                <div className={classNames('exception-header-right exception-status-holder dim-text ',
                    this.props.status === enums.ExceptionStatus.Resolved ? 'resolved' : '')}>
                    <div className='exception-status'>
                        <div className='exception-status-text' id='current_exception_status'>
                            {localeStore.instance.TranslateText('generic.exception-statuses.' +
                                enums.getEnumString(enums.ExceptionStatus, this.props.status).toLowerCase())}</div>
                    </div>
                </div>
            </div>
            <div style={styleCallout} className='menu-callout'></div>
            <div className='panel-content exception-type-info padding-all-15' aria-hidden='true'>
                {localeStore.instance.TranslateText('generic.exception-types.' + this.props.exceptionTypeId + '.details')}
            </div>
            <div className='exception-header-row'>
                <div className='exception-header-left'>
                    <div className='exception-question'><span className='dim-text'>
                        {localeStore.instance.TranslateText
                            ('marking.response.question')}</span>
                        <span className='question-name'>{this.props.questionName}</span></div>
                </div>
                {actionException}
            </div>
        </div>);
    }

    /**
     * function to open/close info button
     */
    private showExceptionDescription() {
        this.setState({
            showExceptionDescription: this.state.showExceptionDescription === false ? true : false
        });
    }
}
export = ExceptionTypeInfo;