import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import gridRow = require('../../utility/grid/gridrow');
import TableControl = require('../../utility/table/tablewrapper');
import standardisationSetUpStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');

/**
 * Properties of Dragging Row Holder.
 */
interface DraggingRowHolderProps extends PropsBase, LocaleSelectionBase {
    rowId?: number;
    selectedRow?: any;
    renderedOn: number;
}

class DraggingRowHolder extends pureRenderComponent<DraggingRowHolderProps, any> {

    /**
     * @constructor
     */
    constructor(props: DraggingRowHolderProps, state: any) {
        super(props, state);
        this.state = {
            elementStyle: {
                left: 0,
                top: 0,
            }
        };
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        standardisationSetUpStore.instance.addListener(
            standardisationSetUpStore.StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID, this.onMousePositionUpdated);

    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        standardisationSetUpStore.instance.removeListener(
            standardisationSetUpStore.StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID, this.onMousePositionUpdated);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        return (
            <div className='dragging-row-holder' style={this.props.selectedRow ? this.getDraggingHolderDivStyle() : undefined}>
                {this.props.selectedRow ?
                    <TableControl
                        tableBodyRows={this.props.selectedRow}
                        gridStyle=''
                        id={'draggingRow_' + this.props.rowId.toString()}
                        key={'key_rowHeader_' + this.props.id}
                        selectedLanguage={this.props.selectedLanguage}
                        renderedOn={this.props.renderedOn}
                        selectedRowIdToDrag={this.props.rowId}
                        isDraggableRow={true} /> : null}
            </div>
        );
    }

    /**
     * Re-render div on mouse position change.
     */
    private onMousePositionUpdated = (): void => {
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Get Dragging Holder Div Style on dragging through grid.
     */
    private getDraggingHolderDivStyle(): any {
        let mousePosition = standardisationSetUpStore.instance.mousePosition;

        return {
            'transform':
            'translate(' + mousePosition.xPosition + 'px ,' +
            (mousePosition.yPosition - htmlUtilities.getOffsetTop('work-list-grid', false)) + 'px)'
        };
    }
}
export = DraggingRowHolder;