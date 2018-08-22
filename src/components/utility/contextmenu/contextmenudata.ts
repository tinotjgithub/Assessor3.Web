import enums = require('../enums');
class  ContextMenuData {
    public clientToken: string;
    public contextMenuType: enums.ContextMenuType;
    public annotationOverlayWidth: number;
}
export = ContextMenuData;