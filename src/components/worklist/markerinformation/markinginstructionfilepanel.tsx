import React = require('react');
import localeStore = require('../../../stores/locale/localestore');

/**
 * Properties of component MarkinginstructionList .
 * @param {Props} props
 */
interface MarkinginstructionListProps extends LocaleSelectionBase, PropsBase {
    documentId: number;
    documentName: string;
    onMarkInstructionFileClick: Function;
    renderedOn: number;
}

/**
 * Marking instruction file name panel for download marking instruction pdf.
 * @param props
 */
const markingInstructionFilePanel: React.StatelessComponent<MarkinginstructionListProps> = (props: MarkinginstructionListProps) => {
    return (
        <a href='javascript:void(0)' id={'markinginstructionlink_' + props.documentId}
            className='marking-instruction-link'
            title={props.documentName}
            onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                props.onMarkInstructionFileClick(props.documentId);
            }}>
            {props.documentName}
        </a>
    );
};
export = markingInstructionFilePanel;