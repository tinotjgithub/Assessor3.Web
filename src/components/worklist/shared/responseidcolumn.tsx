/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import ResponseIdGridElement = require('./responseidgridelement');
import LastUpdatedDate = require('./worklistdate');
import enums = require('../../utility/enums');
import ResponseTypeLabel = require('./responsetypelabel');
import TotalMarkTile = require('./totalmarktile');

/**
 * Properties of responseid and last updated date column
 */
interface Props extends LocaleSelectionBase, PropsBase {
    displayId?: string;
    dateValue?: Date;
    worklistDateType?: enums.WorkListDateType;
    isResponseIdClickable?: boolean;
    isResponseTypeLabelVisible?: boolean;
	isTileView?: boolean;
	hasNumericMark?: boolean;
	markingProgress?: number;
    totalMarkValue?: number;
    responseType?: enums.ResponseType;
}

/**
 * React component class forthe grid column responseid and last updated date
 */
class ResponseIdColumn extends pureRenderComponent<Props, any> {

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
            <div className='col wl-id'>
            <div className='col-inner'>
                <ResponseIdGridElement selectedLanguage={this.props.selectedLanguage}
                        displayId={this.props.displayId} isClickable = {this.props.isResponseIdClickable}
                        id={this.props.id} key={'key_response_id_grid_element_' + this.props.id}
                        isTileView={this.props.isTileView} />

                <ResponseTypeLabel id = { this.props.id + '_Seed' }
                        key = { this.props.id + '_Seed' }
                        isResponseTypeLabelVisible = { this.props.isResponseTypeLabelVisible }
                        responseType = { this.props.responseType}/>

				<TotalMarkTile id={this.props.id + '_totalmarktile'}
					key={this.props.id + '_totalmarktilekey'}
					selectedLanguage={this.props.selectedLanguage}
					isNonNumericMark={!this.props.hasNumericMark}
					maximumMark={0}
					totalMark={this.props.totalMarkValue}
					markingProgress={this.props.markingProgress} />

                <LastUpdatedDate selectedLanguage={this.props.selectedLanguage}
                        dateType={this.props.worklistDateType}
                        dateValue={this.props.dateValue}
                        id={this.props.id}
                        isTileView={this.props.isTileView}
						key={'key_last_updated_date_' + this.props.id} />
            </div>
            </div>
        );
    }
}

export = ResponseIdColumn;