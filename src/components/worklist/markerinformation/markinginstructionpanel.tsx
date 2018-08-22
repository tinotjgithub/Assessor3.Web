import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import markingInstructionStore = require('../../../stores/markinginstruction/markinginstructionstore');
let classNames = require('classnames');

interface MarkinginstructionListProps extends LocaleSelectionBase, PropsBase {
    onMarkInstructionFileClick: Function;
    onMarkInstructionPanelClick: Function;
    onMarkingInstructonClickHandler: Function;
    renderedOn: number;
}

/**
 * MarkingInstructionPanel class
 * @param {any} any
 * @param {any} any
 * @returns
 */
const markingInstructionPanel: React.StatelessComponent<MarkinginstructionListProps> = (props: MarkinginstructionListProps) => {

    /**
     * Fire On Clicking MarkInstruction File 
     * @param {any} source - The source element
     */
    function onMarkInstructionFileClick(documementId: number) {
        props.onMarkInstructionFileClick(documementId);
    }

    /**
     * Fire On Clicking Mark InstructionPanel Click
     * @param {any} source - The source element
     */
    function onMarkInstructionPanelClick() {
        props.onMarkInstructionPanelClick();
    }

    let markingInstructionDropDownTriangle = markingInstructionStore.instance.markingInstructionList &&
        markingInstructionStore.instance.markingInstructionList.size > 1 ?
        (<span id='sprite-icon toolexpand-icon' className='sprite-icon toolexpand-icon'></span>) : null;

    /**
     * Render component
     */
    return (
        <div id={props.id} className={'marking-instruction-holder'}>
            <a id='markinginstructionlink' href='javascript:void(0);'
                onClick={onMarkInstructionPanelClick} className='menu-button marking-instruction-btn'>
                <span id='info-icon-blue sprite-icon' className='info-icon-blue sprite-icon'></span>
                <span id='link-text' className='link-text'>
                    {localeStore.instance.TranslateText('marking.worklist.left-panel.marking-instructions')}
                </span>
                {markingInstructionDropDownTriangle}
            </a>
        </div>
    );
};

export = markingInstructionPanel;