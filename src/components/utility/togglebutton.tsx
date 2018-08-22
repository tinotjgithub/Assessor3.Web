import React = require('react');
let classNames = require('classnames');
import Immutable = require('immutable');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');

/**
 * Props for the Left Panel
 */
interface ToggleButtonProps extends LocaleSelectionBase, PropsBase {
    index: number;
    isChecked: boolean;
    onChange: Function;
    style: React.CSSProperties;
    title: string;
	className?: string;
    isDisabled?: boolean;
    onText: string;
    offText: string;
    displayId?: string;
}

/**
 * React component class for Ask on Logout confirmation
 */
class ToggleButton extends pureRenderComponent<ToggleButtonProps, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: ToggleButtonProps, state: any) {
        super(props, state);
        this.onToggleChange = this.onToggleChange.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        return (
            <div className={classNames('toggle-button', this.props.className)}
                aria-pressed='false' style={this.props.style} title={this.props.title} >
				<input type='checkbox' id={this.props.id + '_toggle_button'}
					data-value={this.props.isChecked} checked={this.props.isChecked} onChange={this.onToggleChange} disabled={this.props.isDisabled} />
                <label className='toggle-label' id={this.props.id + '_label'} htmlFor={this.props.id + '_toggle_button'}
                    title={this.props.title}>
                    <div className='toggle-content'>
                        <div className='on-text'>{this.props.onText}</div>
                        <div className='off-text'>{this.props.offText}</div>
                    </div>
                    <div className='toggle-switch'></div>
                </label>
            </div>
        );
    }

    private onToggleChange = (): void => {
        this.props.onChange(this.props.index, !this.props.isChecked, this.props.displayId);
    };
}

export = ToggleButton;