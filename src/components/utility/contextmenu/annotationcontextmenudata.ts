import annotation = require('../../../stores/response/typings/annotation');
import contextMenuData = require('./contextmenudata');
class AnnotationContextMenuData extends contextMenuData  {
    public annotationData: annotation;
}
export = AnnotationContextMenuData;