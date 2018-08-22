import React = require('react');
import localeStore = require('../../../stores/locale/localestore');
import pureRenderComponent = require('../../../components/base/purerendercomponent');
import enums = require('../../../components/utility/enums');

/**
 * Props
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    blueBannerMessageKey: string;
}

/**
 * StatelessComponent component for BlueBanner
 * @param props
 */
const blueBanner: React.StatelessComponent<Props> = (props: Props) => {
    return (
        <div className='message-bar'>
            <span className='message-content'>
                <div className='text-left' id='blue-banner-message'>
                    <p>
                    {
                        props.blueBannerMessageKey !== '' || props.blueBannerMessageKey !== undefined
                            ? localeStore.instance.TranslateText(props.blueBannerMessageKey) : null
                    }
                    </p>
                </div>
            </span>
        </div>
    );
};
export = blueBanner;
