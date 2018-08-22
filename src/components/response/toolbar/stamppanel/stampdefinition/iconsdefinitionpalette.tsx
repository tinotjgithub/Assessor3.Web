/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../../../base/purerendercomponent');
import stampStore = require('../../../../../stores/stamp/stampstore');
import stampData = require('../../../../../stores/stamp/typings/stampdata');
import StampIcon = require('./stampicon');
import ToolbarIcon = require('./toolbaricon');
import colouredannotationshelper = require('../../../../../utility/stamppanel/colouredannotationshelper');
let icondata = require('./icondata.json');
import enums = require('../../../../utility/enums');
import htmlUtilities = require('../../../../../utility/generic/htmlutilities');
import ToolbarSymbol = require('./toolbarsymbol');
import markerOperationFactory = require('../../../../utility/markeroperationmode/markeroperationmodefactory');

const OVERLAY_MOVER = 'overlay-mover';
const OVERLAY_POINT = 'overlay-point-svg';

interface State {
    renderedOn: number;
}

/**
 * React component class for Icons Definition.
 */
class IconsDefinitionPalette extends pureRenderComponent<any, State> {

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);
    }

    /**
     * This function gets called when the component is mounted
     */
    public componentDidMount() {
        stampStore.instance.addListener(stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampLoaded);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        stampStore.instance.removeListener(stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampLoaded);
    }


    /**
     * This function Refreshing component once the stamp data is loaded.
     */
    public onStampLoaded = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Render method
     */
    public render(): JSX.Element {

        let style = {
            display: 'none'
        };

        // Retrieving the stamps required to be rendered in the Stamps panel
        let stamps = stampStore.instance.stampsAgainstAllQIGs;

        let isEdge: boolean = false;

        if (htmlUtilities.getUserDevice().browser === 'Edge') {
            isEdge = true;
        }

        // Loop through the keys and creating a list of SVG Icons for the stamps.
        let stampsList = stamps && stamps.map((stampData: stampData) => {
            if (stampData.svgImage !== '' && stampData.svgImage !== undefined) {
                return (
                    <StampIcon id={stampData.name + '-icon'}
                        key={stampData.name + '-icon'}
                        svgImageData={stampData.svgImage}
                        isEdge={isEdge} />
                );
            }
        });

        return (
            <svg version='1.1' style={style}>
                <defs>
                    <ToolbarIcon id='plus-icon'
                        key='plus-icon'
                        svgImageData={icondata.plus_icon} />

                    <ToolbarIcon id='icon-marking-comment'
                        key='icon-marking-comment'
                        svgImageData={icondata.icon_marking_comment} />

                    <ToolbarIcon id='new-message-icon'
                        key='new-message-icon'
                        svgImageData={icondata.new_message_icon} />

                    <ToolbarIcon id='icon-mag-glass'
                        key='icon-mag-glass'
                        svgImageData={icondata.icon_mag_glass} />

                    <ToolbarIcon id='icon-change-resp-view'
                        key='icon-change-resp-view'
                        svgImageData={icondata.icon_change_resp_view} />

                    <ToolbarIcon id='icon-fit-width'
                        key='icon-fit-width'
                        svgImageData={icondata.icon_fit_width} />

                    <ToolbarIcon id='icon-fit-height'
                        key='icon-fit-height'
                        svgImageData={icondata.icon_fit_height} />

                    <ToolbarIcon id='icon-rotate-left'
                        key='icon-rotate-left'
                        svgImageData={icondata.icon_rotate_left} />

                    <ToolbarIcon id='icon-rotate-right'
                        key='icon-rotate-right'
                        svgImageData={icondata.icon_rotate_right} />

                    <ToolbarIcon id='icon-bin'
                        key='icon-bin'
                        svgImageData={icondata.icon_bin} />

                    <ToolbarIcon id='delete-comment-icon'
                        key='delete-comment-icon'
                        svgImageData={icondata.delete_comment_icon} />

                    <ToolbarIcon id='exception-icon'
                        key='exception-icon'
                        svgImageData={icondata.exception_icon} />

                    <ToolbarIcon id='new-exception-icon'
                        key='new-exception-icon'
                        svgImageData={icondata.new_exception_icon} />

                    <ToolbarIcon id='message-icon'
                        key='message-icon'
                        svgImageData={icondata.message_icon} />

                    <ToolbarIcon id='icon-offpage-comment'
                        key='icon-offpage-comment'
                        svgImageData={icondata.icon_sideview_comment} />

                    <ToolbarIcon id='supervisor-remark-icon'
                        key='icon-supervisor-remark'
                        svgImageData={icondata.supervisor_remark_icon} />

                    <ToolbarIcon id='promote-seed-icon'
                        key='icon-promote-seed'
                        svgImageData={icondata.promote_seed_icon} />

                    <ToolbarIcon id='link-icon'
                        key='link-icon'
                        svgImageData={icondata.link_icon} />

                    <ToolbarIcon id='reject-rig-icon'
                        key='icon-reject-rig'
                        svgImageData={icondata.reject_rig_icon} />

                    <ToolbarIcon id='ruler'
                        key='ruler'
                        svgImageData={icondata.overlay_ruler_icon} />

                    <ToolbarIcon id='protractor'
                        key='overlay-protractor-icon'
                        svgImageData={icondata.overlay_protractor_icon} />

                    <ToolbarIcon id='add-bm-mark'
                        key='add-bm-mark'
                        svgImageData={icondata.bookmark_icon} />

                    <ToolbarIcon id='add-new-book-mark'
                        key='add-new-book-mark'
                        svgImageData={icondata.new_bookmark_icon} />

                    <ToolbarIcon id='select-bm-icon'
                        key='select-bm-icon'
                        svgImageData={icondata.select_bm_icon} />

                    <ToolbarIcon id='tool-delete'
                        key='tool-delete'
                        svgImageData={icondata.tool_delete} />

                    <ToolbarIcon id='icon-left-arrow-a'
                        key='icon-left-arrow-a'
                        svgImageData={icondata.go_back_icon} />

                    <ToolbarIcon id='multiline-overlay'
                        key='multiline-overlay'
                        svgImageData={icondata.overlay_multiline_icon} />

                    <ToolbarIcon id='unzoned-indicator'
                        key='unzoned-indicator'
                        svgImageData={icondata.unzoned_indicator} />
                    <ToolbarIcon id='v-icon-tick'
                        key='v-icon-tick'
                        svgImageData={icondata.v_icon_tick} />

                    <ToolbarSymbol id='h-mover-line'
                        className={OVERLAY_MOVER}
                        symbolData={icondata.horizontal_mover_line} />

                    <ToolbarSymbol id='cp-mover-line'
                        className={OVERLAY_MOVER}
                        symbolData={icondata.cp_mover_line} />

                    <ToolbarSymbol id='v-mover-line'
                        className={OVERLAY_MOVER}
                        symbolData={icondata.vertical_mover_line} />

                    <ToolbarSymbol id='overlay-point'
                        className={OVERLAY_POINT}
                        symbolData={icondata.overlay_point} />

                    <ToolbarSymbol id='overlay-point-hover'
                        className={OVERLAY_POINT}
                        symbolData={icondata.overlay_point_hover} />

                    <ToolbarIcon id='add-note'
                        key='add-note'
                        svgImageData={icondata.add_note} />

                    <ToolbarIcon id='note-icon'
                        key='note-icon'
                        svgImageData={icondata.note_icon} />

                    <ToolbarIcon id='return_response_icon'
                        key='return_response_iconn'
                        svgImageData={icondata.return_response_icon} />

                    {stampsList}
                </defs>
            </svg>
        );
    }
}

export = IconsDefinitionPalette;
