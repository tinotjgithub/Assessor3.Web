/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import constants = require('../utility/constants');
import SupervisorMarkDecisionButton = require('./supervisormarkdecisionbutton');
import enums = require('../../components/utility/enums');
import Immutable = require('immutable');
import RemarkDecision = require('./supervisormarkdecisionoption');
import markingStore = require('../../stores/marking/markingstore');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
let classNames = require('classnames');

interface Props extends LocaleSelectionBase, PropsBase {
    amd: number;
    tmd: number;
    accuracy: enums.AccuracyIndicatorType;
    onRemarkDecisionChange: Function;
    calculateAccuracy: Function;
    supervisorRemarkDecisionType: enums.SupervisorRemarkDecisionType;
}

interface State {
    isOpen?: boolean;
    renderedOn: number;
}

class SupervisorMarkDecision extends pureRenderComponent<Props, State>  {

    private remarkDecisionElement: JSX.Element[];
    private remarkDecisionType: enums.SupervisorRemarkDecisionType = undefined;
    private accurayClassName: string;
    private accuracyIndicator: enums.AccuracyIndicatorType;
    private absoluteMarkDifference: number;
    private totalMarkDifference: number;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.hideDecisionBox = this.hideDecisionBox.bind(this);
        this.onDecisionBoxClick = this.onDecisionBoxClick.bind(this);
        this.calculateAccuracy = this.calculateAccuracy.bind(this);
        this.remarkDecisionType = this.props.supervisorRemarkDecisionType;

        this.state = {
            isOpen: undefined,
            renderedOn: Date.now()
        };
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let className = classNames('eur-reason-holder icon-menu-wrap dropdown-wrap up white supervisor-remark-decision',
            {
                'close': (this.state.isOpen === false),
                'open': (this.state.isOpen === true)
            });

        let accuracyText = this.getAccuracyText(this.accuracyIndicator);

        return (
            <div className={className} onClick={this.onDecisionBoxClick}>
                <SupervisorMarkDecisionButton isReadonly={ !(this.remarkDecisionType === undefined
                    || this.remarkDecisionType === enums.SupervisorRemarkDecisionType.none) }
                    key={this.props.key + '_button'} id={'remarkdecisonButton'}
                    onButtonClick={ this.onButtonClick} selectedLanguage={this.props.selectedLanguage}/>
                <div className='menu-callout'></div>
                <div className='menu'>
                    <h4 className='eur-reason-title bolder padding-bottom-15'>
                        {localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.popout-header') }
                    </h4>
                    <div className='eur-reason-options'>
                        <p className='eur-accuracy-levels dim-text'>
                            <span className='eur-accuracy-label'>
                                {localeStore.instance.TranslateText
                                    ('marking.response.supervisor-remark-decision.absolute-mark-difference') + ':'}
                            </span>
                            <span className='eur-accuracy-mark' id={'amdvalue'}>
                                {this.absoluteMarkDifference}
                            </span><br />
                            <span className='eur-accuracy-label'>
                                {localeStore.instance.TranslateText
                                    ('marking.response.supervisor-remark-decision.total-mark-difference') + ':'}
                            </span>
                            <span className='eur-accuracy-mark' id={'tmdvalue'}>
                                {this.totalMarkDifference}
                            </span>
                        </p>
                        <p className='eur-original-accuracy dim-text'>
                            <span className='eur-original-accuracy-label'>
                                {localeStore.instance.TranslateText
                                    ('marking.response.supervisor-remark-decision.original-mark-accuracy') + ':'}
                            </span>
                            <span className={this.accurayClassName} id={'originalmarkaccuracy'}>
                                {accuracyText }
                            </span>
                        </p>
                        <p className='eur-option-title'>
                            {localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.popout-body') }
                        </p>
                        <ul className='remark-decision-options' id={'remarkdecisionoptions'}>
                            {this.remarkDecisionElement}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * triggers once compenent is mounted.
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT, this.calculateAccuracy);
        window.addEventListener('click', this.hideDecisionBox);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION, this.openSupervisorRemarkDecision);
    }


    /**
     * triggers on unmounting the component.
     */
    private componentDidUnMount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_FULLY_MARKED_EVENT, this.calculateAccuracy);
        window.removeEventListener('click', this.hideDecisionBox);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION, this.openSupervisorRemarkDecision);
    }

    /**
     * triggers while the component receives the props.
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props !== nextProps) {
            this.accuracyIndicator = nextProps.accuracy;
            this.absoluteMarkDifference = nextProps.amd;
            this.totalMarkDifference = nextProps.tmd;
            this.remarkDecisionType = nextProps.supervisorRemarkDecisionType;
        }
    }

    /**
     * triggers on remark decision button click.
     */
    private onButtonClick = (event: any): void => {
        event.stopPropagation();

        this.setState({
            isOpen: !this.state.isOpen,
            renderedOn: Date.now()
        });
    };

    /**
     * to hide the decision panel on clicking outside the box.
     */
    private hideDecisionBox = (): void => {
        if (this.state.isOpen === true) {
            this.setState({
                isOpen: false,
                renderedOn: Date.now()
            });
        }
    };

    /**
     * triggers on remark decision box click. To prevent the window click so that the box will not hide.
     */
    private onDecisionBoxClick = (event: any): void => {
        event.stopPropagation();
    }

    /**
     * Open supervisor remark decision.
     */
    private openSupervisorRemarkDecision = (): void => {
        this.setState({
            isOpen: true,
            renderedOn: Date.now()
        });
    };

    /**
     * Returns the accuracy name of given accuracy type
     * @param {enums.AccuracyIndicatorType} type
     * @returns
     */
    private getAccuracyText(accuracyIndicatorType: enums.AccuracyIndicatorType): string {
        let accuracyTypeName = '';
        switch (accuracyIndicatorType) {
            case enums.AccuracyIndicatorType.OutsideTolerance:
            case enums.AccuracyIndicatorType.OutsideToleranceNR:
                accuracyTypeName = 'inaccurate';
                this.accurayClassName = 'eur-accuracy-mark error';
                this.setInaccurateRemarDecisions();
                break;
            case enums.AccuracyIndicatorType.WithinTolerance:
            case enums.AccuracyIndicatorType.WithinToleranceNR:
                accuracyTypeName = 'in-tolerance';
                this.accurayClassName = 'eur-accuracy-mark warning';
                this.setAccurateRemarDecisions();
                break;
            default:
                accuracyTypeName = 'accurate';
                this.accurayClassName = 'eur-accuracy-mark success';
                this.setAccurateRemarDecisions();
                break;
        }
        return localeStore.instance.TranslateText('generic.accuracy-indicators.' + accuracyTypeName);
    }

    /**
     * Set remark decison elements for accurate
     */
    private setAccurateRemarDecisions() {

        let options: enums.SupervisorRemarkDecisionType[] = [
            enums.SupervisorRemarkDecisionType.none,
            enums.SupervisorRemarkDecisionType.nonjudgementalerror,
            enums.SupervisorRemarkDecisionType.originalmarks
        ];

        let that = this;

        this.remarkDecisionElement = options.map(function (value: enums.SupervisorRemarkDecisionType) {
            return (<RemarkDecision decisionText = { localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.' +
                enums.getEnumString(enums.SupervisorRemarkDecisionType, value)) }
                isSelected = {(value === that.remarkDecisionType ||
                    (that.remarkDecisionType === undefined && value === enums.SupervisorRemarkDecisionType.none)) }
                onOptionClick = {that.onOptionClick}
                id= {'remarkdecisonoption_' + value}
                key ={'remarkdecisonoption_' + value}
                remarkDecisionType = {value}
                selectedLanguage = {that.props.selectedLanguage}/>);
        });
    }

    /**
     * Set remark decison elements for inaccurate and in tolerance
     */
    private setInaccurateRemarDecisions(): void {

        let options: enums.SupervisorRemarkDecisionType[] = [
            enums.SupervisorRemarkDecisionType.none,
            enums.SupervisorRemarkDecisionType.nonjudgementalerror,
            enums.SupervisorRemarkDecisionType.judgementaloutsidetolerance
        ];
        let that = this;

        this.remarkDecisionElement = options.map(function (value: enums.SupervisorRemarkDecisionType) {
            return (<RemarkDecision decisionText = { localeStore.instance.TranslateText('marking.response.supervisor-remark-decision.' +
                enums.getEnumString(enums.SupervisorRemarkDecisionType, value)) }
                isSelected = {(value === that.remarkDecisionType ||
                    (that.remarkDecisionType === undefined && value === enums.SupervisorRemarkDecisionType.none)) }
                onOptionClick = {that.onOptionClick}
                id= {'remarkdecisonoption_' + value}
                key ={'remarkdecisonoption_' + value}
                remarkDecisionType = {value}
                selectedLanguage = {that.props.selectedLanguage}/>);
        });
    }

    /**
     * triggers on radio button click
     */
    private onOptionClick = (remarkDecisionType: enums.SupervisorRemarkDecisionType): void => {

        if (this.remarkDecisionType !== remarkDecisionType) {
            this.remarkDecisionType = remarkDecisionType;
            this.props.onRemarkDecisionChange(remarkDecisionType);
            this.setState({
                isOpen: false,
                renderedOn: Date.now()
            });
        }
    };

    /**
     * function to calculate and set the accuracy indaicator based on accuracy rules while marking reaches 100%.
     */
    private calculateAccuracy(): void {
        let accuracy = this.props.calculateAccuracy();
        this.accuracyIndicator = accuracy[0];
        this.absoluteMarkDifference = accuracy[1];
        this.totalMarkDifference = accuracy[2];
    }
}

export = SupervisorMarkDecision;
