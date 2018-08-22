import bookmark = require('../response/typings/bookmark');

class BookmarkComponentWrapper implements bookmark{

    /**
     * Bookmark identifier
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public bookmarkId: number;

    /**
     * Marking operation mode.
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public markingOperation: number;

    /**
     * Examiner Identifier in QIG
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public examinerRoleId: number;

    /**
     * Markscheme group identifier were bookmark belongs to.
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public markSchemeGroupId: number;

    /**
     * Mark group identifier
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public markGroupId: number;

    /**
     * Page number
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public pageNo: number;

    /**
     * The left edge associated with the bookmark
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public left: number;

    /**
     * The top edge associated with the bookmark
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public top: number;

    /**
     * The width associated with the bookmark
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public width: number;

    /**
     * The height associated with the bookmark
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public height: number;

    /**
     * The comment associated with the bookmark
     * 
     * @type {any}
     * @memberof BookmarkComponentWrapper
     */
    public comment?: string;

    /**
     * The file name associated with the bookmark
     * 
     * @type {any}
     * @memberof BookmarkComponentWrapper
     */
    public fileName?: string;

    /**
     * The document id associated with the bookmark
     * 
     * @type {number}
     * @memberof BookmarkComponentWrapper
     */
    public inputFileDocumentId: number;

    /**
     * The row version
     * 
     * @type {any}
     * @memberof BookmarkComponentWrapper
     */
    public rowVersion?: any;

    /**
     * The client token
     * 
     * @type {string}
     * @memberof BookmarkComponentWrapper
     */
    public clientToken: string;

    /**
     * The is dirty flag
     * 
     * @type {boolean}
     * @memberof BookmarkComponentWrapper
     */
    public isDirty: boolean;

    /**
     * The definitive bookmark flag
     * 
     * @type {boolean}
     * @memberof BookmarkComponentWrapper
     */
    public definitiveBookmark: boolean;

    /**
     * The created date associated with the bookmark
     * 
     * @type {Date}
     * @memberof BookmarkComponentWrapper
     */
    public createdDate: Date;

    /**
     * The isEcoursework flag
     * 
     * @type {boolean}
     * @memberof BookmarkComponentWrapper
     */
    public isEcoursework: boolean;

    /**
     * The translatable text for 'Page'
     */
    private _prefix: string;

    /**
     * The tooltip - Page number format example: Page 2
     */
    private _pageNum: string;

    /**
     * The tooltip - Tooltip format example: Essay, Page 2
     */
    private _toolTip: string;

    /**
     * Creates an instance of BookmarkComponentWrapper.
     * @memberof BookmarkComponentWrapper
     */
    constructor(prefix: string) {
        this.isEcoursework = false;
        this._prefix = prefix;
    }

    /**
     * The tool tip associated with the bookmark
     * 
     * @type {string}
     * @memberof BookmarkComponentWrapper
     */
    public get toolTip(): string {
        this._pageNum = this._prefix + ' ' + this.pageNo.toString();

        if (this.isEcoursework) {
            if (this.fileName) {
                this._toolTip = this.fileName + ', ' + this._pageNum;
            } else {
                this._toolTip = this._pageNum;
            }
            return this._toolTip;
        }

        // For non-Ecoursework unstructured response, return only page number
        return this._pageNum;
    }
}
export = BookmarkComponentWrapper;