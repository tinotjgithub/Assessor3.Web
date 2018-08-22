/*
  React component for All pages not viewed indicator
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');

/**
 * Properties of All files not viewed indicator
 */
interface Props extends LocaleSelectionBase, PropsBase {
    allFilesViewed?: boolean;
    isMarkingCompleted: boolean;
    isTileView?: boolean;
    isECourseworkComponent?: boolean;
}

/**
 * Stateless All files not viewed indicator component
 * @param props
 */
/* tslint:disable:variable-name */
const AllFilesNotViewedIndicator = (props: Props): JSX.Element => {
    /* tslint:enable:variable-name */
    if (props.isECourseworkComponent && !props.allFilesViewed &&
        props.isMarkingCompleted) {
        return (
            (!props.isTileView) ?
                (<div className='col-inner'>
                    <span title={localeStore.instance.
                        TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip') }>
                        <span className='sprite-icon un-view-icon'
                            id={'allFilesNotViewed_' + props.id}
                            key={'allFilesNotViewed_' + props.id}>
                            {localeStore.instance.
                                TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip') }
                        </span>
                    </span>
                </div>
                ) :
                (
                    <div className='icon-holder'>
                        <div className='col wl-view-indicator'
                            title={localeStore.instance.
                                TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip') }>
                            <div className='col-inner'>
                                <span
                                    id={'allFilesNotViewed_' + props.id}
                                    key={'allFilesNotViewed_' + props.id}
                                    className='sprite-icon un-view-icon'>{localeStore.instance.
                                        TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip') }
                                </span>
                            </div>
                        </div>
                    </div>
                )
        );
    } else {
        return null;
    }
};

export = AllFilesNotViewedIndicator;