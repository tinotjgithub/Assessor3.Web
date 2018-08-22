import React = require('react');
import localeStore = require('../../stores/locale/localestore');
import responseActionCreator = require('../../actions/response/responseactioncreator');

interface FRVTogglerOptionProps extends PropsBase, LocaleSelectionBase {
    frvTogglerOptionSelected: boolean;
    frvTogglerOptionChanged: Function;
    labelOfToggleButton: string;
    toolTipOfToggleButton: string;
}

/**
 * Only show unannotated pages option component
 * @param props
 */
const frvTogglerOption = (props: FRVTogglerOptionProps) => {

    /**
     * Handles the change event of the option button.
     * @param event
     */
    const handleChange = (event: any) => {
        props.frvTogglerOptionChanged(!props.frvTogglerOptionSelected);

        // Hide the highlighted page option whenever a toggle change happen
        responseActionCreator.hidePageOptionButton();
    };

    return (
        <div className='frv-toggler shift-right'>
            <span id = 'frv-toggler-label' className='frv-toggler-label'>
                {props.labelOfToggleButton }
            </span>
            <div className='toggle-button' id='toggle-button' aria-pressed='false'>
                <input type='checkbox' id='unannotatedPages'
                    checked={props.frvTogglerOptionSelected } onChange={handleChange}
                    data-value={props.frvTogglerOptionSelected } />
                <label id={'un-annotated-pages-label'} className='toggle-label'
                    title={props.toolTipOfToggleButton}
                    htmlFor='unannotatedPages'>
                    <div id='frv-toggle-content' className='toggle-content'>
                        <div id='frv-toggle-on-text' className='on-text'>
                            { localeStore.instance.TranslateText('generic.toggle-button-states.on') }
                        </div>
                        <div id='frv-toggle-off-text' className='off-text'>
                            { localeStore.instance.TranslateText('generic.toggle-button-states.off') }
                        </div>
                    </div>
                    <div id='frv-toggle-switch' className='toggle-switch'></div>
                </label>
            </div>
        </div>
    );
};
export = frvTogglerOption;