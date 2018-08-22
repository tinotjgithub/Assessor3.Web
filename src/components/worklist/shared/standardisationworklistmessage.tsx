/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
import BusyIndicator = require('../../utility/busyindicator/busyindicator');

interface Props extends LocaleSelectionBase, PropsBase {
}

class StandardisationWorkListMessage extends pureRenderComponent<Props, any> {

    /**
     * Constructor for StandardisationWorklistMessage
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }


    /**
     * Render component
     */
    public render(): JSX.Element {
        return (
            <div className='grid-holder grid-view'>
                <div className='grid-wrapper' id = {this.props.id}>
                    <div className='message-box worklist-msgs wait-advise-msg'>
                    <h3 className='bolder msg-title'>{localeStore.instance.TranslateText
                            ('marking.worklist.not-approved-helper.header') }
                    </h3>
                    <p className='message-body'> </p>
                    <p>{localeStore.instance.TranslateText('marking.worklist.not-approved-helper.body-line-1') }
                    </p>
                    <p>{localeStore.instance.TranslateText('marking.worklist.not-approved-helper.body-line-2') } </p>
                    <p></p>
                    </div>
                </div>
           </div>
        );
    }
}

export = StandardisationWorkListMessage;