import React = require('react');
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');

/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isSharedProvisional: boolean;
}

class SharedResponseIndicator extends PureRenderComponent<Props, any> {

    /**
     * Constructor for Accuracy indicator
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        if (this.props.isSharedProvisional) {
            let toolTip: string = localeStore.instance.TranslateText('standardisation-setup.shared-response-indicator-tooltip.content');
            let accuracy: JSX.Element =
                (<div className='wl-share'>
                    <span title={toolTip}
                        className='sprite-icon share-icon'>Share
                    </span>
                </div>);
            return (accuracy);
        }else {
            return null;
        }
    }
}
export = SharedResponseIndicator;

