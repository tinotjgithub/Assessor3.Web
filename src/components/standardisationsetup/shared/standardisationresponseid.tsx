import React = require('react');
import ResponseIdGridElement = require('../../worklist/shared/responseidgridelement');

interface StdResponseIdProps extends PropsBase {
    displayId: string;
    isResponseIdClickable: boolean;
    selectedLanguage: string;
    isReusableResponseView?: boolean;
    candidateScriptId?: string;
}

/**
 * Stateless component for Note column in Classification Grid
 * @param props
 */
const stdResponseId: React.StatelessComponent<StdResponseIdProps> = (props: StdResponseIdProps) => {

    return (
        <div className='col wl-id'>
            <div className='col-inner'>
                <ResponseIdGridElement selectedLanguage={props.selectedLanguage}
                    displayId={props.displayId} isClickable={props.isResponseIdClickable}
                    id={props.id} key={'key_response_id_grid_element_' + props.id}
                    isTileView={false}
                    isReusableResponseView={props.isReusableResponseView ? props.isReusableResponseView : false}
                    candidateScriptId={props.candidateScriptId ? props.candidateScriptId : ''}/>
            </div>
        </div>
	);
};
export = stdResponseId;