import React = require('react');
import localeStore = require('../../stores/locale/localestore');
import enums = require('../utility/enums');

interface AnnotatedMessageHolderProps extends PropsBase, LocaleSelectionBase {
    componentType: enums.MarkingMethod;
}

/**
 * Message Holder to display that all pages are annotated in Fullresponse view
 * If the Only show unannotated pages option On and all pages annotated
 * @param props
 */
const annotatedMessageHolder = (props: AnnotatedMessageHolderProps) => {
    let allPageAnnotatedText: string;
    let noUnannotatedPagesToDisplay: string;
    noUnannotatedPagesToDisplay = localeStore.instance.TranslateText('marking.full-response-view.all-' +
            (props.componentType === 2 ? 'additional-' : '') + 'pages-annotated-text-no-pages-to-display-full-response');

    allPageAnnotatedText = localeStore.instance.TranslateText('marking.full-response-view.all-' +
            (props.componentType === 2 ? 'additional-' : '') + 'pages-annotated-text-full-response');
    return (
        <div className='annotated-message-holder'>
            <div className='message-seen'>
                <div className='seen-message-title'>
                    <div className='seen-title-icon'>
                        <svg viewBox='0 0 40 20' preserveAspectRatio='xMinYMid meet' textAnchor='middle'>
                            <text id='all-annotated-seen-stamp-text' className='caption bolder' x='20' y='10' dy='5'>
                                { localeStore.instance.TranslateText('marking.response.stamps.stamp_811') }
                            </text>
                        </svg>
                    </div>
                </div>
                <div className='seen-message-content'>
                    <h4 className='bolder' id='all-annotated-text'>
                        {allPageAnnotatedText}
                    </h4>
                    <p id='all-annotated-no-pages-text'>
                        {noUnannotatedPagesToDisplay}
                    </p>
                </div>
            </div>
        </div>
    );
};

export = annotatedMessageHolder;