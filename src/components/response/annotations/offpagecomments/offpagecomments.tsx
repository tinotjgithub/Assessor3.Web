import React = require('react');
import Immutable = require('immutable');
import localeStore = require('../../../../stores/locale/localestore');
import pureRenderComponent = require('../../../base/purerendercomponent');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import enums = require('../../../utility/enums');
import markingStore = require('../../../../stores/marking/markingstore');
import annotation = require('../../../../stores/response/typings/annotation');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import constants = require('../../../utility/constants');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import responseHelper = require('../../../utility/responsehelper/responsehelper');

interface Props extends LocaleSelectionBase, PropsBase {
    annotationColor: string;
}

interface State {
	renderedOn?: number;
}

/**
 * OffPageComments
 * @param props 
 */
// tslint:disable-next-line:variable-name

class OffPageComments extends pureRenderComponent<Props, State> {

	private commentText: string = '';
	private commentClientToken: string = '';
	private isContentEditable: boolean = false;

	/** refs */
	public refs: {
		[key: string]: (Element);
		offpageComment: (HTMLElement);
	};

	/**
	 * constructor
	 * @param props
	 * @param state
	 */
	constructor(props: Props, state: State) {
		super(props, state);

		// Set the default state
		this.state = {
			renderedOn: 0
		};
		this.onTextChange = this.onTextChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onCommentPaste = this.onCommentPaste.bind(this);
		this.offpageCommentsAgainstQuestionItem = this.offpageCommentsAgainstQuestionItem.bind(this);
		this.replaceSelectedText = this.replaceSelectedText.bind(this);
		this.onMarkReset = this.onMarkReset.bind(this);
		this.addOrUpdateOffpageComments = this.addOrUpdateOffpageComments.bind(this);
		this.onCommentCut = this.onCommentCut.bind(this);
		this.reRender = this.reRender.bind(this);
	}

	/**
	 * Render method
	 */
	public render(): JSX.Element {
		this.isContentEditable = markerOperationModeFactory.operationMode.isOffPageCommentEditable;

		//using onKeyUp since onChange/onInput are not supported in IE for contenteditable div.
		let commentEditor: JSX.Element = (
			<div contentEditable={this.isContentEditable}
				id='offpage-comment-editor'
				className='offpage-comment-editor'
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				onPaste={this.onCommentPaste}
				onCut={this.onCommentCut}
				onKeyUp={this.onTextChange}
				onInput={this.onTextChange}
				suppressContentEditableWarning={true}
				ref='offpageComment'>{this.commentText}</div>);

		// passing place holder text as empty when there is comment text, to resolve the overlaping issue in IE.
		let placeHolderText: string = '';
		if (this.commentText.length === 0 && this.isContentEditable) {
			placeHolderText = localeStore.instance.TranslateText('marking.response.off-page-comments-panel.comment-text-placeholder');
		}

		let commentPlaceHolder: JSX.Element = (<div id='offpage-comment-placeholder' className='offpage-comment-placeholder'>
			{placeHolderText}
		</div>);

		let borderStyle: React.CSSProperties = {
			border: '1px',
			borderColor: this.props.annotationColor,
			borderStyle: 'solid'
		};
		let commentBorder: JSX.Element = (<div id='offpage-comment-border'
			className='offpage-comment-border' style={borderStyle}></div>);

		return (
			<div className='offpage-comment-editor-holder'>
				{commentEditor}
				{commentPlaceHolder}
				{commentBorder}
			</div>
		);
	}

	/**
	 * componentDidMount
	 */
	public componentDidMount() {
		markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
			this.offpageCommentsAgainstQuestionItem);
		markingStore.instance.addListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onMarkReset);
		markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.reRender);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT,
            this.offpageCommentsAgainstQuestionItem);
	}

	/**
	 * ComponentWillUnMount
	 */
	public componentWillUnmount() {
		markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
			this.offpageCommentsAgainstQuestionItem);
		markingStore.instance.removeListener(markingStore.MarkingStore.RESET_MARK_AND_ANNOTATION, this.onMarkReset);
		markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.reRender);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT,
            this.offpageCommentsAgainstQuestionItem);
	}

	/**
	 * called on paste
	 * @param e
	 */
	private onCommentPaste(e: any) {
		if (!this.isContentEditable) {
			return;
		}
		// preventing the default paste action to remove formats from the copied text
		e.preventDefault();
		if (window.clipboardData && window.clipboardData.getData) {
			this.replaceSelectedText(window.clipboardData.getData('Text'));
		} else if (e.clipboardData && e.clipboardData.getData) {
			this.replaceSelectedText(e.clipboardData.getData('text/plain'));
		}
		this.commentText = this.refs.offpageComment.innerText;
	}

	/**
	 * Called on Cut event
	 * for updating the comment text in IE
	 * @param e
	 */
	private onCommentCut(e: any) {
		// In IE onInput event is not triggered, so 'this.commentText' is not updated.
		if (htmlUtilities.isIE || htmlUtilities.isIE11) {
			// replaceSelectedText method is called to remove the selected text
			// since the cut event is not completed at this stage.
			this.replaceSelectedText('');
			this.commentText = this.refs.offpageComment.innerText;
		}
	}

	/**
	 * Replace selected text while pasting
	 * @param replacementText
	 */
	private replaceSelectedText(replacementText: string) {
		let sel;
		let range;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				range.insertNode(document.createTextNode(replacementText));
			}
			range.collapse(false);
		}
	}
	/**
	 * called on mark reset
	 * @param resetMark
	 * @param resetAnnotation
	 */
	private onMarkReset(resetMark: boolean, resetAnnotation: boolean) {
		if (resetAnnotation) {
			this.commentText = '';
			this.commentClientToken = '';
			this.setState({ renderedOn: Date.now() });
		}
	}

	/**
	 * Called once question item changed
	 */
	private offpageCommentsAgainstQuestionItem() {
		let currentMarkSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
		let currentAnnotations = Immutable.List<annotation>(annotationHelper.getCurrentMarkGroupAnnotation());

		this.commentText = '';
		this.commentClientToken = '';
		if (currentAnnotations && currentMarkSchemeId) {
			let commentAnnotation: annotation = currentAnnotations.filter((x: annotation) =>
				x.markSchemeId === currentMarkSchemeId &&
				x.stamp === constants.OFF_PAGE_COMMENT_STAMP_ID &&
				x.markingOperation !== enums.MarkingOperation.deleted).first();
			if (commentAnnotation) {
				this.commentText = commentAnnotation.comment;
				this.commentClientToken = commentAnnotation.clientToken;
			}
		}
		this.setState({ renderedOn: Date.now() });
	}

	/**
	 * called on text change
	 * @param event
	 */
	private onTextChange(event: any) {
		let target: any = event.target || event.srcElement;
		let text: string = target.innerHTML;
		this.commentText = text;
	}

	/**
	 * replace inner html
	 * @param innerHTML
	 */
	private replaceHTMLText(innerHTML: string) {
		innerHTML = innerHTML.replace(/<\p><br><\/p>/g, '<br/>').replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
		this.refs.offpageComment.innerHTML = innerHTML;
		this.commentText = this.refs.offpageComment.innerText;
	}

	/**
	 * called on focus
	 */
	private onFocus = (event: any) => {
		let placeHolderDiv = document.getElementById('offpage-comment-placeholder');
		if (placeHolderDiv.innerText.trim().length > 0) {
			placeHolderDiv.innerText = '';
		}

        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.OffPageComments);
    }

	/**
	 * called on blur
	 */
	private onBlur = () => {
		this.replaceHTMLText(this.commentText);

		let placeHolderDiv = document.getElementById('offpage-comment-placeholder');
		if (placeHolderDiv.innerText.trim().length === 0 && this.commentText.trim().length === 0) {
			placeHolderDiv.innerText =
				localeStore.instance.TranslateText('marking.response.off-page-comments-panel.comment-text-placeholder');
		}
		keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.OffPageComments);
		this.addOrUpdateOffpageComments();
		this.setState({
			renderedOn: Date.now()
		});
	}

	/**
	 * Re render after save or update
	 */
	private reRender = () => {
		this.commentText = this.commentText.trim();
		this.setState({
			renderedOn: Date.now()
		});
	}

	/**
	 * Saving offpage comments
	 */
	private addOrUpdateOffpageComments = (): void => {
		let newlyAddedOrUpdatedOffPageComment: annotation;

		let currentMarkSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
		if (this.commentClientToken === '' && this.commentText !== '') {
			newlyAddedOrUpdatedOffPageComment = annotationHelper.getAnnotationToAdd(constants.OFF_PAGE_COMMENT_STAMP_ID,
				0, markingStore.instance.currentQuestionItemImageClusterId, 0, 0, 0,
				enums.AddAnnotationAction.Stamping, 0, 0, currentMarkSchemeId, 0, 0);
			newlyAddedOrUpdatedOffPageComment.comment = this.commentText;

			var cssProps: React.CSSProperties = colouredAnnotationsHelper.
				createAnnotationStyle(newlyAddedOrUpdatedOffPageComment, enums.DynamicAnnotation.OffPageComment);
			var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
			newlyAddedOrUpdatedOffPageComment.red = parseInt(rgba[0]);
			newlyAddedOrUpdatedOffPageComment.green = parseInt(rgba[1]);
			newlyAddedOrUpdatedOffPageComment.blue = parseInt(rgba[2]);

			this.commentClientToken = newlyAddedOrUpdatedOffPageComment.clientToken;
			markingActionCreator.addNewlyAddedAnnotation(newlyAddedOrUpdatedOffPageComment, undefined, null, null, null, false);
		} else if (this.commentClientToken !== '') {
			newlyAddedOrUpdatedOffPageComment = markingStore.instance.getAnnotation(this.commentClientToken);
			if (newlyAddedOrUpdatedOffPageComment && this.commentClientToken === newlyAddedOrUpdatedOffPageComment.clientToken) {
				if (this.commentText === '') {
					this.removeAnnotation(this.commentClientToken);
				} else {
					markingActionCreator.updateAnnotation(newlyAddedOrUpdatedOffPageComment.leftEdge,
						newlyAddedOrUpdatedOffPageComment.topEdge,
						newlyAddedOrUpdatedOffPageComment.imageClusterId,
						newlyAddedOrUpdatedOffPageComment.outputPageNo,
						newlyAddedOrUpdatedOffPageComment.pageNo,
						newlyAddedOrUpdatedOffPageComment.clientToken,
						newlyAddedOrUpdatedOffPageComment.width,
						newlyAddedOrUpdatedOffPageComment.height,
						this.commentText, true, false, false,
						constants.OFF_PAGE_COMMENT_STAMP_ID);
				}
			}
		}
	}

	/**
	 * Remove annotation
	 * @param annotationClientToken
	 */
	private removeAnnotation(annotationClientToken: string) {
        let annotationClientTokenToBeDeleted: Array<string> = [];
        let isMarkByAnnotation: boolean;
        isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
        annotationClientTokenToBeDeleted.push(annotationClientToken);
        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted, isMarkByAnnotation);
	}
}
export = OffPageComments;