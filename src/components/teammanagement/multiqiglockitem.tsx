import React = require('react');
import ReactDom = require('react-dom');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import pureRenderComponent = require('../base/purerendercomponent');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import GenericCheckbox = require('../utility/genericcheckbox');

interface Props extends PropsBase, LocaleSelectionBase {
    multiQigLockData: MultiQigLockExaminer;
}

interface State {
    renderedOn?: number;
}

/**
 * React wrapper component for multi qig lock item
 */
class MultiQigLockItem extends pureRenderComponent<Props, State> {
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0
        };
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let multiQigLockItem = (<GenericCheckbox
            id={this.props.id}
            key={this.props.key}
            containerClassName='padding-top-10'
            className='text-middle checkbox'
            disabled={false}
            isChecked={this.props.multiQigLockData.isChecked}
            labelClassName='text-middle'
            labelContent={this.props.multiQigLockData.qigName}
            onSelectionChange={this.updateMultiQigLockSelection.
                bind(this, this.props.multiQigLockData.markSchemeGroupId, false)} />);

        return multiQigLockItem ;
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED,
            this.updateMultiLockQigSelectionReceived);
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED,
            this.updateMultiLockQigSelectionReceived);
    }

    /**
     * update multi qig lock selection
     */
    private updateMultiQigLockSelection = (markSchemeGroupId: number, isSelectedAll: boolean) => {
        teamManagementActionCreator.updateMultiQigLockSelection(markSchemeGroupId, isSelectedAll);
    };

    /**
     * This method will call on multi qig lock selection received
     */
    private updateMultiLockQigSelectionReceived = () => {
        this.setState({
            renderedOn: Date.now()
        });
    };
}

export = MultiQigLockItem;