import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import MediaPlayer = require('./mediaplayer');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import localeStore = require('../../../../stores/locale/localestore');
import htmlutilities = require('../../../../utility/generic/htmlutilities');
import eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import ecourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');

interface Props extends LocaleSelectionBase, PropsBase {
    src: string;
    updateFileViewStatus?: Function;
    pauseMediaPlayerOnDownloading: Function;
}

interface State {
    renderedOn: number;
}

class DownloadIcon extends pureRenderComponent<Props, State> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Render method
     */
    public render(): JSX.Element  {
        let iconTitle = localeStore.instance.TranslateText('marking.response.media-player.download-icon-tooltip');
        let svgElement = <g id='download-file-icon'>
            <svg viewBox='0 0 32 32' preserveAspectRatio='xMidYMid meet'>
                <g>
                    <polygon points='21.8,16.8 20.2,15.2 17,18.4 17,6 15,6 15,18.4 11.8,15.2 10.2,16.8 16,22.6 	'></polygon>
                    <rect x='6' y='24' className='st0' width='20' height='2'></rect>
                </g>
            </svg>
        </g>;
        return (
            <div className='player-control download-file'>
                <a href='javascript:void(0);' className='download-file-button' title={iconTitle}
                    onClick={ this.onClick } id='downloadfile' >
                    <span className='svg-icon'>
                        <svg viewBox='0 0 32 32' className='download-file-icon'>
                            <use xlinkHref='#download-file-icon'>{svgElement}</use>
						</svg>
					</span>
                </a>
            </div>
        );

    }

    /**
     * To click
     */
    private onClick() {
        this.props.pauseMediaPlayerOnDownloading();
        // handling offline scenarios
        let isOnline: boolean = eCourseWorkHelper.openFileInNewWindow(this.props.src);
        if (isOnline){
            ecourseworkResponseActionCreator.fileDownloadedOustide();
            if (this.props.updateFileViewStatus) {
                this.props.updateFileViewStatus(null, true);
            }
        }
    }
}

export = DownloadIcon;

