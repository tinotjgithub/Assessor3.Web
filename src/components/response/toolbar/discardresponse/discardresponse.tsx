/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import MultiOptionConfirmationDialog = require('../../../utility/multioptionconfirmationdialog');
import enums = require('../../../utility/enums');
import standardisationsetupActionCreator = require('../../../../actions/standardisationsetup/standardisationactioncreator');
import responseStore = require('../../../../stores/response/responsestore');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import navigationHelper = require('../../../utility/navigation/navigationhelper');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    id: string;
    key: string;
    onIconClick: Function;
}

interface State {
    renderedOn?: number;
}

class DiscardResponse extends pureRenderComponent<Props, State> {

    private onClickDiscardResponse: any = null;
    private onDiscardPopupCancelClick: any = null;

    /**
     * 
     * @param props Constructor
     * @param state 
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render method
     */
    public render() {
        let svgStyle = {
            pointerEvents: 'none'
        };

        return (
            <div>
                <li onClick={() => { this.props.onIconClick(); }} className='discard-icon'>
                    <a href='javascript:void(0)' title={localeStore.instance
                        .TranslateText('standardisation-setup.standardisation-setup-worklist.discard-icon.title')}>
                        <span className='svg-icon'>
                            <svg viewBox='0 0 32 32' className='discard-icon' style={svgStyle}>
                                <g id='tool-delete'>
                                    <svg viewBox='0 0 32 32' preserveAspectRatio='xMidYMid meet'>
                                        <g>
                                            <polygon className='st0' points='20,7 20,5 12,5 12,7 7,7 7,9 25,9 25,7 	'></polygon>
                                            <path className='st0'
                                                d='M8,24c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V10H8V24z M10,12h12v13H10V12z'></path>
                                            <rect x='12' y='15' className='st0' width='2' height='8'></rect>
                                            <rect x='18' y='15' className='st0' width='2' height='8'></rect>
                                        </g>
                                    </svg>
                                </g>
                            </svg>
                        </span>
                    </a>
                </li>
            </div>
        );
    }
}
export = DiscardResponse;