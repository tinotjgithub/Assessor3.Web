import React = require('react');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
import qigStore = require('../../../stores/qigselector/qigstore');

interface RIGOrderProps extends PropsBase {
    classificationType?: enums.MarkingMode;
    rigOrder?: string;
    className: string;
}

/**
 * Stateless component for Script ID column in Standardisation Setup Grid
 * @param props
 */
const rigorder: React.StatelessComponent<RIGOrderProps> = (props: RIGOrderProps) => {

/**
 * This mehod will return the classification type header
 * @param classificationType
 */
    function getHeaderBody(classificationType: enums.MarkingMode): JSX.Element {
        let element: JSX.Element;
        if (classificationType) {
            element = (<div id={props.id} className={props.className}>{(localeStore.instance.TranslateText
                ('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[classificationType]))}</div>);
        } else {
            element = (<span id={props.id} className={props.className}>{props.rigOrder}</span>);
        }
        return element;
    }

    return (
        <div className='header-data cursor-move'>
            {props.classificationType === undefined ?
                <span className='sprite-icon drag-icon'
                    title={!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete ? 'Drag to change the order.' : ''}
                />
            : null}
            {getHeaderBody(props.classificationType)}
        </div>);

};
export = rigorder;