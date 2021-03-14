// growth project

// const CONTRACT_NAME = 'growth-contract-dev'
// const VERSION = '0.0.1'
const ContractError = Error

class Ownable {
    /**
     * isOwner checks whether the address is the owner of this contract
     * @param {*} owner
     * @param {*} address
     * @returns boolean
     */
    static isOwner(owner, address) {
        return owner === address
    }

    /**
     * transferOwnership would transfer ownership of this contract to 
     * @param {*} state
     * @param {*} caller
     * @param {*} target
     */
    static transferOwnership(state, caller, target) {
        if (!Ownable.isOwner(state.owner, caller)) {
            throw new ContractError('transferOwnership#: Caller is not the owner of this contract')
        }

        if (!Utils.isAddress(input.target)) {
            throw new ContractError('transferOwnership#: Target is not a valid address')
        }

        state.owner = target
        return state
    }
}

class Admin {
    /**
     * isAdmin checks whether the input address is admin of this contract   
     * For initial state, please follow the example format
     * @example { admins: ['address'] }
     * @param {*} state     - Current state of admin list
     * @param {*} address   - Input address
     * @returns boolean
     */
    static isAdmin(admins, address) {
        if(!Array.isArray(admins)) {
            return false
        }
        if (admins.indexOf(address) !== -1) {
            return true
        }
        return false
    }

    /**
     * addAdmin adds target address into admin list with validation
     * @param {*} state     - Current State
     * @param {*} caller    - Contract function caller
     * @param {*} target    - Target would be added into admin list
     */
    static addAdmin(state, caller, target) {
        if (!Ownable.isOwner(state.owner, caller)) {
            throw new ContractError('addAdmin#: Caller is not the owner of this contract')
        }

        if (!Utils.isAddress(input.target)) {
            throw new ContractError('addAdmin#: Target is not a valid address')
        }
        
        if (state.admins.indexOf(target) !== -1) {
            throw new ContractError('Target is already an admin')
        }
        state.admins.push(target)
        return state
    }

    /**
     * addToAdmin adds target address into admin list with validation
     * @param {*} state     - Current State
     * @param {*} caller    - Contract function caller
     * @param {*} target    - Target would be added into admin list
     */
     static removeAdmin(state, caller, target) {
        if (!Ownable.isOwner(state.owner, caller)) {
            throw new ContractError('removeAdmin#: Caller is not the owner of this contract')
        }

        if (!Utils.isAddress(input.target)) {
            throw new ContractError('removeAdmin#: Target is not a valid address')
        }

        if (state.admins.indexOf(target) === -1) {
            throw new ContractError('removeAdmin#: Target is not an admin')
        }
        state.admins = state.admins.filter(a => a !== target)
        return state
    }
}

class Utils {
    /**
     * isAddress checks whether the input address is a valid arweave address
     * @param {*} address 
     * @returns boolean
     */
    static isAddress(address) {
        if (typeof(address) !== 'string') {
            throw new ContractError('isAddress#: Address is not string')
        }
        return /^([a-zA-Z0-9]|_|-)+$/.test(address)
    }

    /**
     * isValidUsername checks whether the input string is a valid username
     * @param {*} string 
     * @returns boolean
     */
    static isValidUsername(string) {
        if (typeof(string) !== 'string') {
            throw new ContractError('isValidUsername#: input string is not string')
        }
        return /^[a-zA-Z]+([._]?[a-zA-Z0-9]+)*$/.test(string)
    }

    /**
     * compareKeys checks whether the input objects have same keys
     * @param {*} a 
     * @param {*} b 
     * @returns boolean
     */
    static compareKeys(a, b) {
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b).sort();
        return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }
}

class Creator {
    static isCreator(creators, address) {
        return creators.hasOwnProperty(address)
    }

    static hasPST(creators, address) {
        if (creators[address].hasOwnProperty('creator')) {
            if (creators[address].hasOwnProperty('ticker') &&
                creators[address].hasOwnProperty('ticker-contract')) {
                    return true
            }
        }
        return false
    }

    static verifyData(state, data) {
        const creators = state.creators
        const example = {
            type: '', shortname: '', intro: '', categories: [''], target: '',
            ticker: { ticker: '', name: '', contract: '' },
            items: [ { title: "", value: 0, description: "" } ]
        }

        if (!Utils.compareKeys(example, data)) {
            throw new ContractError('verifyData#: Data input is invalid')
        }

        for (const [key, value] of Object.entries(data)) {
            if (key === 'type' || key === 'shortname' || key === 'intro' || key === 'target') {
                if (typeof(value) !== 'string') {
                    throw new ContractError(`verifyData#: Invalid key "${key}" with value "${value}", value should be string`)
                }
            }
        }

        if (!Utils.isAddress(String(data.target))) {
            throw new ContractError(`verifyData#: Target is not a address`)
        }

        if (state.schema.types.indexOf(String(data.type)) === -1) {
            throw new ContractError(`verifyData#: Unsupported Creator Type: ${data.type}`)
        }

        if (!Utils.isValidUsername(String(data.shortname))) {
            throw new ContractError(`verifyData#: Shortname is invalid for: ${data.shortname}`)
        }

        if (String(data.intro).length > 100) {
            throw new ContractError(`verifyData#: Intro is out of limitaion`)
        }

        data.categories.forEach((e) => {
            if (state.schema.categories.indexOf(e) === -1) {
                throw new ContractError(`verifyData#: Categories is invalid for: ${e}`)
            }
        })

        const exampleTikcer = {
            ticker: '',
            name: '',
            contract: ''
        }

        if (!Utils.compareKeys(exampleTikcer, data.ticker) || Object.keys(data.ticker) < 3) {
            throw new ContractError('verifyData#: Data.Ticker input is invalid')
        }

        for (const [key, value] of Object.entries(data.ticker)) {
            if (key === 'ticker' || key === 'name' || key === 'contract') {
                if (typeof(value) !== 'string') {
                    throw new ContractError(`verifyData#: Invalid ticker key "${key}" with value "${value}", value should be string`)
                }
            }
        }
    }

    static verifyItems(data) {
        const exampleItem = {
            title: "",
            value: 10,
            description: ""
        }

        if (Array.isArray(data.items) && data.items.length > 0) {
            for (let i = 0; i < data.items.length; i++) {
                const e = data.items[i]
                if (!Utils.compareKeys(exampleItem, e)) {
                    throw new ContractError(`verifyData#: Data.Items items[${i}] input is invalid`)
                }

                for (const [key, value] of Object.entries(e)) {
                    if (key === 'title' || key === 'description') {
                        if (typeof(value) !== 'string') {
                            throw new ContractError(`verifyData#: Invalid items[${i}] key "${key}" with value "${value}", value should be string`)
                        }
                    }

                    if (key === 'value' && !Number.isInteger(value)) {
                        throw new ContractError(`verifyData#: Invalid items[${i}] key "${key}" with value "${value}", value should be integer`)
                    }
                }
            }
        }
    }

    static announceCreator(state, data) {
        if (Creator.isCreator(state.creators, data.target)) {
            throw new ContractError('announceCreator#: Target is already creator')
        }
        try {
            if (typeof(data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`announceCreator#: Data is not a valid JSON or Object ,${e.message}`)
        }

        this.verifyData(state, data)
        this.verifyItems(data)

        if (data.items.length > 0) {
            const items = [...data.items]
            for (let i = 0; i < items.length; i++) {
                items[i]['id'] = i
            }
            data.items = items
        }

        const target = data.target
        delete data.target

        Object.defineProperty(state.creators, target, {
            value: data,
            writable: true,
            enumerable: true
        })

        return state
    }

    static removeCreator(state, caller, target) {
        if (!(Ownable.isOwner(state.owner, caller) || Admin.isAdmin(state.admins, caller))) {
            throw new ContractError('removeCreator#: Caller is not a owner or admin to this contract')
        }

        if (!this.isCreator(state.creators, target)) {
            throw new ContractError(`removeCreator#: Target ${target} is not a creator`)
        }

        state.creators[target] = null
        const creators = { ...state.creators }
        delete creators[target]
        state.creators = creators

        if (state.projects.hasOwnProperty(target)) {
            const projects = { ...state.projects }
            delete projects[target]
            state.projects = projects
        }

        return state
    }

    static addItem(state, caller, target, data) {
        if (Creator.isCreator(state.creators, data.target)) {
            throw new ContractError('announceCreator#: Target is already creator')
        }
        try {
            if (typeof(data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`announceCreator#: Data is not a valid JSON or Object ,${e.message}`)
        }
    }

    static removeItem(state, caller, target, index) {
        if (Creator.isCreator(state.creators, data.target)) {
            throw new ContractError('announceCreator#: Target is already creator')
        }
        try {
            if (typeof(data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`announceCreator#: Data is not a valid JSON or Object ,${e.message}`)
        }
    }

    static editItem(state, caller, target, data) {

    }
}

export function handle(state, action) {
    const input = action.input
    const caller = action.caller

    // Read
    // isOwner contract_function
    /**
     * @param {String} function isOwner
     * @param {String} address address
     */
    if (input.function === 'isOwner') {
        const res = Ownable.isOwner(state.owner, input.address)
        return { result: res }
    }

    // isOwner contract_function
    /**
     * @param {String} function isAdmin
     * @param {String} address address
     */
    if (input.function === 'isAdmin') {
        const res = Admin.isAdmin(state.admins, input.address)
        return { result: res }
    }

    // Write
    // addAdmin contract_function
    /**
     * @param {String} function addAdmin
     * @param {String} target address
     */
    if (input.function === 'addAdmin') {
        const res = Admin.addAdmin(state, caller, input.target)
        return { state: res }
    }

    // removeAdmin contract_function
    /**
     * @param {String} function removeAdmin
     * @param {String} target address
     */
    if (input.function === 'removeAdmin') {
        const res = Admin.removeAdmin(state, caller, input.target)
        return { state: res }
    }

    // transferOwnership contract_function
    /**
     * @param {String} function transferOwnership
     * @param {String} target address
     */
    if (input.function === 'transferOwnership') {
        const res = Ownable.transferOwnership(state, caller, input.target)
        return { state: res }
    }
    
    // announceCreator contract_function
    /**
     * @param {String} function announceCreator
     * @param {String|Object|any} data creator object
     */
    if (input.function === 'announceCreator') {
        const res = Creator.announceCreator(state, input.data)
        return { state: res }
    }

    // removeCreator contract_function
    /**
     * @param {String} function removeCreator
     * @param {String} target address
     */
    if (input.function === 'removeCreator') {
        const res = Creator.removeCreator(state, caller, input.target)
        return { state: res }
    }

    // addItemToCreator contract_function
    /**
     * @param {String} function addItemToCreator
     * @param {String|Object|any} data item object
     */
    if (input.function === 'addItemToCreator') {
        const res = Creator.addItem(state, caller, input.target, input.data)
        return { state: res }
    }

    // removeItemFromCreator contract_function
    /**
     * @param {String} function removeItemFromCreator
     * @param {String} title
     */
    if (input.function === 'removeItemFromCreator') {
        const res = Creator.removeItem(state, caller, input.target, input.index)
        return { state: res }
    }

    // editItemsToCreator contract_function
    /**
     * @param {String} function editItemsToCreator
     * @param {String|Object|any}
     */
    if (input.function === 'editItemsToCreator') {
        const res = Creator.editItem(state, caller, input.target, input.index)
        return { state: res }
    }

    throw new ContractError(`No function supplied or function not recognised: "${input.function}"`)
}
