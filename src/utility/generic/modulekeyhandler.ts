import enums = require('../../components/utility/enums');
class ModuleKeyHandler {

    // The keyname
    private keyName: string;

    // priority of the module.
    private priority: number;

    // Holds the in which keymode it triggers
    private keyMode: enums.KeyMode;

    /**
     * Constructor
     * @param {string} keyName
     * @param {number} priority
     * @param {boolean} isActive
     * @param {Function} callBack
     * @param {enums.KeyMode} keyMode
     */
    constructor(keyName: string, priority: number, isActive: boolean, callBack: Function, keyMode: enums.KeyMode) {

        this.keyName = keyName;
        this.priority = priority;
        this.isActive = isActive;
        this.callBack = callBack;
        this.keyMode = keyMode;
    }

    // Get the keyname
    public get KeyName(): string {
        return this.keyName;
    }

    // Get the priority of the module
    public get Priority(): number {
        return this.priority;
    }

    public set setPriority(value: number) {
        this.priority = value;
    }

    // Get the value indicating whether the module is active?
    public isActive: boolean;

    // callback function.
    public callBack: Function;

    public get KeyMode(): enums.KeyMode {
        return this.keyMode;
    }

}

export = ModuleKeyHandler;