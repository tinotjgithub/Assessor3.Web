import action = require('../base/action');
import actionType = require('../base/actiontypes');

class EnhancedOffpageCommentDataUpdateAction extends action {

    private _index: number;
    private selectedMarkGroupId: number;
    private backgroundColor: React.CSSProperties;
    private headerText: string;
    /**
     * Constructor
     * @param isAllPagesAnnotated
     * @param treeViewItem
     */
    constructor(index: number, markGroupId: number, style: React.CSSProperties, remarkHeaderText: string) {
        super(action.Source.View, actionType.ENHANCED_OFFPAGE_COMMENT_INDEX_UPDATE_ACTION);
        this._index = index;
        this.selectedMarkGroupId = markGroupId;
        this.backgroundColor = style;
        this.headerText = remarkHeaderText;
        this.auditLog.logContent = this.auditLog.logContent.replace('{index}', index.toString());
    }

    /**
     * Returns a index value of marking type.
     */
    public get index(): number {
        return this._index;
    }

    /**
     * Returns selected markGroup id.
     */
    public get markGroupId(): number {
        return this.selectedMarkGroupId;
    }

    /**
     * returns style based on remarks
     * 
     * @readonly
     * @type {React.CSSProperties}
     * @memberof EnhancedOffpageCommentDataUpdateAction
     */
    public get style(): React.CSSProperties {
        return this.backgroundColor;
    }

    /**
     * returns Header text based on remarks
     */
    public get remarkHeaderText() {
        return this.headerText;
    }
}

export = EnhancedOffpageCommentDataUpdateAction;