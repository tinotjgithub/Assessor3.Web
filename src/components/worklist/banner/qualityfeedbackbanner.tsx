/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import bannerBase = require('../../utility/banner/bannerbase');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
let classNames = require('classnames');

/**
 *  Quality feedback banner
 */
class QualityFeedbackBanner extends bannerBase {

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        return (<div onClick = {(e) => this.onQualityFeedbackBannerClickHandler(e) }
                    className = 'message-box text-left float-msg dark-msg info-guide callout marking-approved-msg'>
                    <p className = 'message-body'>
                        { localeStore.instance.TranslateText(this.props.message) }
                    </p>
                </div>);
    }

    /**
     * On quality feedback banner click
     */
    private onQualityFeedbackBannerClickHandler = (event: any) => {
        event.stopPropagation();
    };
}

export = QualityFeedbackBanner;