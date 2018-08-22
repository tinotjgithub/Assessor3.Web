import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import enums = require('../../../utility/enums');
import ecourseworkresponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import ecourseworkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
let classNames = require('classnames');
import domManager = require('../../../../utility/generic/domhelper');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import eCourseworkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
declare let config: any;
import URLS = require('../../../../dataservices/base/urls');

interface PlayerModeIconProps extends PropsBase, LocaleSelectionBase {
    isSelected: boolean;
    itemText: string;
    pageId ?: number;
    candidateScriptId ?: number;
    mediaSourceType ?: enums.MediaSourceType;
}

/* tslint:disable:variable-name */
const PlayerModeIconItem: React.StatelessComponent<PlayerModeIconProps> = (props: PlayerModeIconProps) => {
    const onItemClick = (event: any) => {
        ecourseworkresponseActionCreator.mediaPlayerSourceChange(props.pageId, props.candidateScriptId, props.mediaSourceType);
    };

    let tickSvg = <g id='v-icon-tick'>
        <svg viewBox='0 0 32 32' preserveAspectRatio='xMidYMid meet'>
            <polygon points='12.5,24.3 11.1,21.5 24.9,7.7 27,9.8  '></polygon>
            <polygon points='12.5,24.3 5.1,17 7.3,14.9 14.2,21.8  '></polygon>
        </svg>
    </g>;

    return (<li className = {classNames('menu-item ',
                {'selected': (props.isSelected === true) })} onClick={onItemClick}>
             <span className='svg-icon shift-left tick'>
                <svg viewBox='0 0 32 32' className='tick-icon'>
                {props.isSelected ? <use xlinkHref='#v-icon-tick'>{tickSvg}</use> : null}
                </svg>
             </span>
             <span className='label-text'>{props.itemText}</span>
           </li >
    );
};
/* tslint:enable:variable-name */

interface Props extends PropsBase, LocaleSelectionBase {
    isVisible: boolean;
    candidateScriptId?: number;
    isAudioPlayer: boolean;
    playerMode: enums.MediaSourceType;
    updateFileViewStatus?: Function;
    pauseMediaPlayerOnDownloading: Function;
    isAlternateFileDownloadable: boolean;
}


interface State {
    isOpen: boolean;
}

class PlayerModeIcon extends pureRenderComponent<Props, State> {
    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isOpen: undefined
        };
        this.hideList = this.hideList.bind(this);
    }

    /**
     * On click method
     */
    private onClick = (event: any) => {
        let selectedAudioVideoFile = eCourseWorkFileStore.instance.getSelectedPlayableFile();
        if (eCourseWorkFileStore.instance.isSelectedPlayableFilesAlternateDownloadable) {
            this.props.pauseMediaPlayerOnDownloading();
            let url: string = config.general.SERVICE_BASE_URL + URLS.GET_ECOURSE_WORK_BASE_URL +
            selectedAudioVideoFile.alternateLink.linkData.url;
            if (eCourseWorkHelper.openFileInNewWindow(url)) {
                ecourseworkresponseActionCreator.fileDownloadedOustide();
                if (this.props.updateFileViewStatus) {
                    this.props.updateFileViewStatus(undefined, true);
                }
            }
        } else {
            event.stopPropagation();
            this.setState({
                isOpen: !this.state.isOpen
            });
        }
    }


    /**
     * Triggers while the component mounts
     */
    public componentDidMount() {
        window.addEventListener('click', this.hideList);
    }

    /**
     * Triggers while component start to unmount
     */
    public componentWillUnMount() {
        window.removeEventListener('click', this.hideList);
    }


    /**
     * To hide the list when clicked outside
     */
    private hideList = (event: any): void => {
        if (event.target !== undefined){
            if (this.state.isOpen === true &&
                domManager.searchParentNode(event.target, function (el: any) { return el.id === 'media_list'; }) == null ) {
                this.setState({
                    isOpen: false
                });
            }
        }
    };

    /**
     * Render player mode icon item method
     */
    private renderplayermodeIconItem = (sourceType: enums.MediaSourceType): JSX.Element => {
        let title = (sourceType === enums.MediaSourceType.OriginalFile) ?
            localeStore.instance.TranslateText('marking.response.media-player.play-original-file') :
            localeStore.instance.TranslateText('marking.response.media-player.play-transcoded-file');
        let selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter((x: eCourseworkFile) =>
            (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio)).first() : undefined;
        let pageId = selectedFile ? selectedFile.docPageID : undefined;
        return (
            <PlayerModeIconItem
                id={'icon_id_' + sourceType}
                key={'icon_key_' + sourceType}
                selectedLanguage={this.props.selectedLanguage}
                isSelected={this.props.playerMode === sourceType}
                itemText={title}
                pageId={pageId}
                candidateScriptId={this.props.candidateScriptId}
                mediaSourceType={sourceType} />
            );
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let title = this.props.isAlternateFileDownloadable ?
            localeStore.instance.TranslateText('marking.response.media-player.download-transcoded-icon-tooltip') :
            localeStore.instance.TranslateText('marking.response.media-player.file-to-play-icon-tooltip');
        let svgElement = <g id='transcode-toggle-icon'>
            <svg viewBox='0 0 32 32' preserveAspectRatio='xMidYMid meet'>
                <g>
                    {/* tslint:disable:max-line-length */}
                    <path d='M25,6H11c-0.6,0-1,0.4-1,1v3H7c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-3h3c0.6,0,1-0.4,1-1V7 C26,6.4,25.6,6,25,6z M20,24H8V12h2v9c0,0.6,0.4,1,1,1h9V24z M24,20H12V8h12V20z'></path>
                    {/* tslint:enable:max-line-length */}
                    <polygon points='16,17 20,14 16,11 		'></polygon>
			    </g>
		    </svg>
        </g >;

        return (<div className={classNames('transcoded-file dropdown-wrap',
                    { 'up': (this.props.isAudioPlayer === false) },
                    { 'close': (this.state.isOpen === false) },
                    { 'open': (this.state.isOpen === true) })}
                    id={'media_list'}
                    onClick={this.onClick}>
                    <a className='transcoded-file-button menu-button' title={title} id = 'transcoded_button'>
                            <span className='svg-icon'>
                                <svg viewBox='0 0 32 32' className='transcoded-file-icon'>
                                    <use xlinkHref='#transcode-toggle-icon'>{svgElement}</use>
					            </svg>
				            </span>
                    </a>
                    <div className='relative'>
                        <div className='menu-callout'></div>
                    </div>
                    <ul className='transcode-options menu selectable' id='transcoded_list'>
                        {this.renderplayermodeIconItem(enums.MediaSourceType.OriginalFile)}
                        {this.renderplayermodeIconItem(enums.MediaSourceType.TranscodedFile)}
		            </ul >
                </div >
            );
    }
}

export =  PlayerModeIcon;