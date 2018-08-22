import dispatcher = require('../../app/dispatcher');
import Action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import tagAction = require('../../actions/tag/taggetaction');
import tagUpdateAction = require('../../actions/tag/tagupdateaction');

/**
 * Store fore locale.
 */
class TagStore extends storeBase {
    public success: boolean;
    private _tags: Immutable.List<Tag>;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: Action) => {
            switch (action.actionType) {
                case actionType.TAG_GET:
                    this.success = (action as tagAction).success;
                    if (this.success) {
                        this._tags = (action as tagAction).tagData;
                        // Adding the empty tag to the list.
                        this._tags.push({ tagId: 0, tagName: '', tagOrder: 0 });
                    }
                    break;
            }
        });
    }

    /**
     * gets the tags
     */
    public get tags(): Immutable.List<Tag> {

        return this._tags;
    }

}

let instance = new TagStore();

export = { TagStore, instance };
