/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import enums = require('../../utility/enums');
import Immutable = require('immutable');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import awardingActionCreator = require('../../../actions/awarding/awardingactioncreator');

interface Props extends LocaleSelectionBase, PropsBase {
    centerNumber: string;
    awardingCandidateId: number;
}
/**
 * React component class forthe grid column responseid and last updated date
 */
class AwardingCenterNumberColumn extends pureRenderComponent<Props, any> {

    /**
     * Constructor for ResponseIdColumn
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }
    /**
     * Render component
     */
    public render() {
        return (
            <a href='javascript:void(0)' id={this.props.key} onClick={() => {
                this.openResponse(this.props.awardingCandidateId);
            }
            } key='awardingcenterNumber'>{this.props.centerNumber}</a>
        );
    }

    /**
     * event for open the response when clicking the centre link
     * @param responseItemGroup
     */
    private openResponse(awardingCandidateId: number) {
        awardingActionCreator.setSelectedCandidateData(awardingCandidateId);
    }
}
export = AwardingCenterNumberColumn;