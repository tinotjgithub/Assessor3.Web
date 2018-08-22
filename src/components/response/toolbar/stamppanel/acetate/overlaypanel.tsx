/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import localeStore = require('../../../../../stores/locale/localestore');
import OverlayIcon = require('./overlayicon');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface OverlayProps extends LocaleSelectionBase, PropsBase {
    isResponseModeClosed?: boolean;
}

const overlayPanel: React.StatelessComponent<OverlayProps> = (props: OverlayProps) => {

    if (!props.isResponseModeClosed) {
        return (
            <ul className='icon-grouping overlay-icons dt-group' id='icon-grouping-overlay'>
                <OverlayIcon overlayIcon='ruler' id='ruler' key='ruler_key' ></OverlayIcon>
                <OverlayIcon overlayIcon='protractor' id='protractor' key='protractor_key' ></OverlayIcon>
                <OverlayIcon overlayIcon='multiline-overlay' id='multiple_line' key='multiple_line_key'></OverlayIcon>
            </ul>
        );
    } else {
        return (
            < div className='marking-tools-panel'>
                <div className='icon-tray-right'>
                    <div className='default-marking-tray'>
                        <ul className='marking-tool-tray overlay-icons' id='marking-tool-tray-overlay-icons'>
                            <OverlayIcon overlayIcon='ruler' id='ruler' key='ruler_key'></OverlayIcon>
                            <OverlayIcon overlayIcon='protractor' id='protractor' key='protractor_key'></OverlayIcon>
                            <OverlayIcon overlayIcon='multiline-overlay' id='multiple_line' key='multiple_line_key'></OverlayIcon>
                        </ul>
                    </div>
                </div>
            </div>);
    }
};

export = overlayPanel;