import React = require('react');
import Immutable = require('immutable');
import localeStore = require('../../../../stores/locale/localestore');
import pureRenderComponent = require('../../../base/purerendercomponent');
import enums = require('../../../utility/enums');
import responseHelper = require('../../../utility/responsehelper/responsehelper');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import markingStore = require('../../../../stores/marking/markingstore');
import annotation = require('../../../../stores/response/typings/annotation');
import constants = require('../../../utility/constants');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');

/**
 * properties of OffPagePreviousComments
 */
interface OffPagePreviousCommentsProps extends PropsBase, LocaleSelectionBase {
	style: React.CSSProperties;
	header: string;
	markedBy: string;
	comment: string;
	index: number;
}

/* tslint:disable:variable-name  */
/**
 * Offpage Previous Comments
 * @param props
 */
const OffPagePreviousComments = (props: OffPagePreviousCommentsProps) => {
	return (
		<li className='comment-list' id={'comment-list_' + props.index}>
			<span className='comment-author' id={'comment-author_' + props.index}>
				<span className='remark-type bolder' id={'remark-type_' + props.index} style={props.style}>
					{props.header}
				</span>
				<span className='author-name' id={'author-name_' + props.index}>
					{props.markedBy}
				</span>
			</span>
			<span className='comment-desc' id={'comment-desc_' + props.index}>
				{props.comment}
			</span>
		</li>);
};
/* tslint:enable:variable-name */

interface Props extends LocaleSelectionBase, PropsBase {
}

interface State {
	renderedOn?: number;
}

/**
 * OffPageCommentListHolder
 */
class OffPageCommentListHolder extends pureRenderComponent<Props, State>{

	constructor(props: Props, state: State) {
		super(props, state);
		// Set the default state
		this.state = {
			renderedOn: 0
		};
		this.renderPreviousOffPageComments = this.renderPreviousOffPageComments.bind(this);
		this.reRender = this.reRender.bind(this);
	}

	/**
	 * render
	 */
	public render() {
		let prvCommentLists = this.renderPreviousOffPageComments();
		if (prvCommentLists && prvCommentLists.length > 0) {
			let prvCommentHeader =
				localeStore.instance.TranslateText('marking.response.off-page-comments-panel.previous-comment-header');
			return (
				<div className='comment-list-holder' id='comment-list-holder'>
					<h5 className='comment-list-title bolder' id='comment-list-title'>{prvCommentHeader}</h5>
					<ul className='comment-lists' id='comment-lists'>
						{prvCommentLists}
					</ul>
				</div>
			);
		} else {
			return null;
		}
	}

	/**
	 * componentDidMount
	 */
	public componentDidMount() {
		markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
			this.reRender);
		markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
			this.reRender);
	}

	/**
	 * componentWillMount
	 */
	public componentWillUnmount() {
		markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
			this.reRender);
		markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
			this.reRender);
	}

	/**
	 * re render
	 */
	private reRender() {
		this.setState({ renderedOn: Date.now() });
	}

	/**
	 * render previous offpage comments
	 */
	private renderPreviousOffPageComments() {
		let prvCommentLists: JSX.Element[] = [];
		if (markingStore.instance.currentQuestionItemInfo && !markerOperationModeFactory.operationMode.isAwardingMode) {
			let currentMarkSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
			let seedType = responseHelper.getCurrentResponseSeedType();
			let previousRemarkAnnotationsDetails: Immutable.List<any> =
				annotationHelper.getPreviousAnnotationDetails(responseHelper.isClosedEurSeed, responseHelper.isClosedLiveSeed,
					seedType, markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup);
			if (previousRemarkAnnotationsDetails && currentMarkSchemeId) {
				previousRemarkAnnotationsDetails.map((prvDetails: any, index: number) => {
					if (prvDetails) {
						let prvRemarkAnnotations = prvDetails.get('marksAndAnnotations');
						let markedBy = prvDetails.get('markedBy');
						let header = prvDetails.get('header');
						let style: React.CSSProperties = {
							backgroundColor: prvDetails.get('previousRemarkBaseColor')
						};
						if (prvRemarkAnnotations.annotations.length > 0) {
							let prvCommentAnnotation: annotation = prvRemarkAnnotations.annotations.filter((x: annotation) =>
								x.markSchemeId === currentMarkSchemeId &&
								x.stamp === constants.OFF_PAGE_COMMENT_STAMP_ID &&
								x.markingOperation !== enums.MarkingOperation.deleted)[0];

							if (prvCommentAnnotation) {
								let element: JSX.Element = (<OffPagePreviousComments
									id={'offPagePreviousComments_' + index}
									key={'offPagePreviousComments_' + index}
									style={style}
									header={header}
									markedBy={markedBy}
									comment={prvCommentAnnotation.comment}
									index={index}/>);
								prvCommentLists.push(element);
							}
						}
					}
				});
			}
		}

		return prvCommentLists;
	}
}
export = OffPageCommentListHolder;