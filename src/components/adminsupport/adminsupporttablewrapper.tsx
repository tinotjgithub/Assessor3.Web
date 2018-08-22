import React = require('react');
import ReactDom = require('react-dom');
import TableControl = require('../utility/table/tablewrapper');
import enums = require('../utility/enums');
let classNames = require('classnames');
import timerHelper = require('../../utility/generic/timerhelper');
import deviceHelper = require('../../utility/touch/devicehelper');
import eventManagerBase = require('../base/eventmanager/eventmanagerbase');
import eventTypes = require('../base/eventmanager/eventtypes');
import direction = require('../base/eventmanager/direction');
import tableHelper = require('../utility/table/tablehelper');
import loginActionCreator = require('../../actions/login/loginactioncreator');

interface Props extends PropsBase, LocaleSelectionBase {
	columnHeaderRows: Immutable.List<Row>;
	gridRows: Immutable.List<Row>;
	getGridControlId: Function;
	onSortClick?: Function;
	renderedOn: number;
	onRowClick?: Function;
}

interface State {
	renderedOn: number;
}
/**
 * React wrapper component for Admin Support table
 */
class AdminSupportTableWrapper extends eventManagerBase {

	private cssRowHeaderTableStyle: React.CSSProperties;
	private cssRowHeaderHeaderTableStyle: React.CSSProperties;
	private cssContentWrapTableStyle: React.CSSProperties;
	private cssBodyWrapTableStyle: React.CSSProperties;
	private isScrolledLeft: boolean;
	private isScrolledRight: boolean;

	/** refs */
	public refs: {
		[key: string]: (Element);
		tableScrollHolder: (HTMLDivElement);
		adminSupportGridPanel: (HTMLDivElement);
		headerScrollHolder: (HTMLDivElement);
		tableWrapDisplayIDs: (HTMLDivElement);
	};

    /**
     * @constructor
     */
	constructor(props: Props, state: any) {
		super(props, state);
		this.onSortClick = this.onSortClick.bind(this);
		this.isScrolledLeft = true;
		this.isScrolledRight = true;
	}

    /**
     * Render component
     */
	public render(): JSX.Element {
		return (
			<div className={this.getGridClass()} style={this.cssRowHeaderTableStyle} ref={'adminSupportGridPanel'}>
				<div className='table-header-wrap' style={this.cssRowHeaderHeaderTableStyle} >
					< div className='table-wrap-t' >
						<div className='header-scroll-holder' ref={'headerScrollHolder'}>
							<TableControl
								tableHeaderRows={this.props.columnHeaderRows}
								gridStyle={'table-view'}
								id={'columnHeader_' + this.props.id}
								key={'key_columnHeader_' + this.props.id}
								selectedLanguage={this.props.selectedLanguage}
								onSortClick={this.onSortClick}
								renderedOn={this.props.renderedOn} />
						</div>
						< div className='drop-shadow' > </div>
					</div>
				</div>
				<div className='table-content-wrap' style={this.cssContentWrapTableStyle}>
					< div className='table-body-wrap' >
						<div className='table-scroll-holder'
							style={this.cssBodyWrapTableStyle}
							ref={'tableScrollHolder'} >
							<div className='table-content-holder' >
								<TableControl
									tableBodyRows={this.props.gridRows}
									gridStyle={'table-view'}
									id={this.props.id}
									key={'key_' + this.props.id}
									selectedLanguage={this.props.selectedLanguage}
									renderedOn={this.props.renderedOn}
                                    onRowClick={this.handleExaminerSelection} />
							</div>
						</div>
						< div className='drop-shadow' > </div>
					</div>
				</div>
			</div>
		);
	}

    /**
     * handle examiner selection in support enviornment grid
     */
    private handleExaminerSelection = (examinerId?: number): void => {
        loginActionCreator.selectExaminer(examinerId);
    }

    /**
     * This will setup events
     */
	private setUpEvents() {
		let element: Element = ReactDom.findDOMNode(this.refs.tableWrapDisplayIDs);

		if (element && !this.eventHandler.isInitialized) {
			this.eventHandler.initEvents(element);
			this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
			this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
		}
	}

    /**
     * unsubscribing hammer touch events and handlers
     */
	private unRegisterEvents() {
		if (this.eventHandler.isInitialized) {
			this.eventHandler.destroy();
		}
	}

    /**
     * margins and styles should be set after first render.
     */
	public componentDidUpdate() {
		this.setColumnWidths();
	}

    /**
     * margins and styles should be set after first render.
     */
	public componentDidMount() {
		if (deviceHelper.isTouchDevice()) {
			this.setUpEvents();
		}
	}

    /**
     * Unsubscribe events
     */
	public componentWillUnmount() {
		this.unRegisterEvents();
	}

    /**
     * returns the grid class (for shadow)
     */
	private getGridClass = (): string => {

		let gridClass = classNames('work-list-grid',
			{ 'scrolled-left': this.isScrolledLeft === true },
			{ 'scrolled-right': this.isScrolledRight === true });

		return gridClass;
	};

	private onSortClick = (comparerName: string, sortDirection: enums.SortDirection) => {
		this.props.onSortClick(comparerName, sortDirection);
	};

	private setColumnWidths = () => {
		tableHelper.setColumnWidthsForTable(this.props.id, 'columnHeader_', '');
	}
}
export = AdminSupportTableWrapper;