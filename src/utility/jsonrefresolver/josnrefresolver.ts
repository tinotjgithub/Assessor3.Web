/**
 * Class for resolving json ref
 */
class JosnRefResolver {
    /**
     * returns the resolved json.
     * @param object Json for resolving the refs
     */
    public static resolveRefs(object: any) {
        let catalog = [];
        JosnRefResolver.mapObject(object, catalog);
        JosnRefResolver.resolveReferences(object, catalog);
        return object;
    }

    /**
     * Json for resolving the refs
     * @private
     * @static
     * @param {*} obj 
     * @param {*} catalog 
     * @memberof JosnRefResolver
     */
    private static mapObject(obj: any, catalog: any) {
        let i;
        if (obj && typeof obj === 'object') {
            let id = obj.$id;
            if (typeof id === 'string') {
                catalog[id] = obj;
            }
            if (Object.prototype.toString.apply(obj) === '[object Array]') {
                for (i = 0; i < obj.length; i += 1) {
                    JosnRefResolver.mapObject(obj[i], catalog);
                }
            } else {
                for (const name in obj) {
                    if (typeof obj[name] === 'object') {
                        JosnRefResolver.mapObject(obj[name], catalog);
                    }
                }
            }
        }
    }

    /**
     * Json for resolving the refs
     * 
     * @private
     * @static
     * @param {*} obj 
     * @param {*} catalog 
     * @memberof JosnRefResolver
     */
    private static resolveReferences(obj: any, catalog: any) {
        let i;
        let item;
        let name;
        let id;
        if (obj && typeof obj === 'object') {
            if (Object.prototype.toString.apply(obj) === '[object Array]') {
                for (i = 0; i < obj.length; i += 1) {
                    item = obj[i];
                    if (item && typeof item === 'object') {
                        id = item.$ref;
                        if (typeof id === 'string') {
                            obj[i] = catalog[id];
                        } else {
                            JosnRefResolver.resolveReferences(item, catalog);
                        }
                    }
                }
            } else {
                for (name in obj) {
                    if (typeof obj[name] === 'object') {
                        item = obj[name];
                        if (item) {
                            id = item.$ref;
                            if (typeof id === 'string') {
                                obj[name] = catalog[id];
                            } else {
                                JosnRefResolver.resolveReferences(item, catalog);
                            }
                        }
                    }
                }
            }
        }
    }
}

export = JosnRefResolver;