/**
 * Likey Contract
 * Version: 1.0.0
 * 
 * Copyright ©️ Arcucy.io
 * 
 * Author: Arcucy Team <i@arcucy.io>
 * Assosiated With: Project LIKEY
 * Source: https://github.com/AyakaLab/Growth-Contract
 */

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
        console.log(state, caller, target)
        if (!Ownable.isOwner(state.owner, caller)) {
            throw new ContractError('transferOwnership#: Caller is not the owner of this contract')
        }

        if (!Utils.isAddress(target)) {
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

        if (!Utils.isAddress(target)) {
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

        if (!Utils.isAddress(target)) {
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

    static verifyData(state, data) {
        const example = {
            type: '', shortname: '', intro: '', categories: [''],
            ticker: { ticker: '', name: '', contract: '' },
            items: [ { title: "", value: '0', description: "" } ]
        }

        if (!Utils.compareKeys(example, data)) {
            throw new ContractError('verifyData#: Data input is invalid')
        }

        for (const [key, value] of Object.entries(data)) {
            if (key === 'type' || key === 'shortname' || key === 'intro') {
                if (typeof(value) !== 'string') {
                    throw new ContractError(`verifyData#: Invalid key "${key}" with value "${value}", value should be string`)
                }
            }
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

    static verifyItems(data, hasId) {
        const exampleItem = {
            title: "",
            value: '10',
            description: ""
        }

        if (hasId) {
            Object.defineProperty(exampleItem, 'id', {
                value: 0,
                writable: true,
                enumerable: true
            })
        }

        if (Array.isArray(data.items) && data.items.length > 0) {
            for (let i = 0; i < data.items.length; i++) {
                const e = data.items[i]
                if (!Utils.compareKeys(exampleItem, e)) {
                    throw new ContractError(`verifyItems#: Data.Items items[${i}] input is invalid`)
                }

                for (const [key, value] of Object.entries(e)) {
                    if (key === 'title' || key === 'description' || key === 'value') {
                        if (typeof(value) !== 'string') {
                            throw new ContractError(`verifyItems#: Invalid items[${i}] key "${key}" with value "${value}", value should be string`)
                        }
                    }
                    
                    if (hasId && key === 'id' && !Number.isInteger(value)) {
                        throw new ContractError(`verifyItems#: Invalid items[${i}] key "${key}" with value "${value}", value should be integer`)
                    }
                }
            }
        }
    }

    /**
     * announceCreator announce a creator and adds the creator data into contract
     * @param {*} state         - contract state
     * @param {*} data          - creator data
     * @returns state
     */
    static announceCreator(state, target, data) {
        if (!Utils.isAddress(String(target))) {
            throw new ContractError(`announceCreator#: Target is not a address`)
        }
        if (Creator.isCreator(state.creators, target)) {
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

        if (data.items.length > Number.MAX_VALUE - 100) {
            throw new ContractError(`announceCreator#: The number of yours total items has reached the limitation of MAX_VALUE`)
        }
        if (data.items.length > 0) {
            const items = [...data.items]
            for (let i = 0; i < items.length; i++) {
                items[i]['id'] = i
            }
            data.items = items
        }

        Object.defineProperty(state.creators, target, {
            value: data,
            writable: true,
            enumerable: true
        })

        return state
    }

    /**
     * addItem adds a set of selling solution items to state
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} target        - editing target
     * @param {*} data          - the data would be injected
     * @return state
     */
    static addItem(state, caller, target, data) {
        if (!Creator.isCreator(state.creators, target)) {
            throw new ContractError('addItemToCreator#: Target is not a creator')
        }
        if (!(target === caller || Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('addItemToCreator#: Caller is not the creator of its own or admin/owner')
        }
        try {
            if (typeof(data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`addItemToCreator#: Data is not a valid JSON or Object ,${e.message}`)
        }

        if (data.items.length === 0) {
            throw new ContractError(`addItemToCreator#: Data.Items should not be empty`)
        }
        this.verifyItems(data)
        
        const items = [...state.creators[target].items, ...data.items]
        if (items.length > Number.MAX_VALUE - 100) {
            throw new ContractError(`addItemToCreator#: The number of yours total items has reached the limitation of MAX_VALUE`)
        }
        for (let i = 0; i < items.length; i++) {
            items[i]['id'] = i
        }
        state.creators[target].items = items

        return state
    }

    /**
     * removeItem removes a set of selling solution items from state
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} target        - editing target
     * @param {*} indexes       - the indexes of the items would be removed
     * @return state
     */
    static removeItem(state, caller, target, indexes) {
        if (!Creator.isCreator(state.creators, target)) {
            throw new ContractError('removeItemFromCreator#: Target is not a creator')
        }
        if (!(target === caller || Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('removeItemFromCreator#: Caller is not the creator of its own or admin/owner')
        }
        if (!(Array.isArray(indexes) && indexes.length > 0)) {
            throw new ContractError(`removeItemFromCreator#: Indexes is not a valid Array or Empty`)
        }

        const newItems = state.creators[target].items.filter(e => {
            if (indexes.indexOf(e.id) === -1) return e
        })
        state.creators[target].items = newItems

        return state
    }

    /**
     * editItem will override the items
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} target        - editing target
     * @param {*} data          - the data would be updated
     * @returns 
     */
    static editItem(state, caller, target, data) {
        if (!Creator.isCreator(state.creators, target)) {
            throw new ContractError('removeItemFromCreator#: Target is not a creator')
        }
        if (!(target === caller || Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('removeItemFromCreator#: Caller is not the creator of its own or admin/owner')
        }
        try {
            if (typeof(data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`addItemToCreator#: Data is not a valid JSON or Object ,${e.message}`)
        }
        if (data.items.length === 0) {
            throw new ContractError(`addItemToCreator#: Data.Items should not be empty`)
        }
        this.verifyItems(data, true)
        
        const editItems = {}
        data.items.forEach(e => {
            Object.defineProperty(editItems, String(e.id), {
                value: {
                    title: e.title,
                    value: e.value,
                    description: e.description
                },
                writable: true,
                enumerable: true
            })
        })
        const temp = [...state.creators[target].items]
        temp.forEach((e, index) => {
            if (Object.keys(editItems).indexOf(String(e.id)) !== -1) {
                const pending = editItems[String(e.id)]
                temp[index].title = pending.title
                temp[index].value = pending.value
                temp[index].description = pending.description
            }
        })
        state.creators[target].items = temp
        return state
    }
}

class Likey {
    /**
     * addType will add a new set of types into type attribute
     * @param {*} state                 - contract state
     * @param {*} caller                - contract caller
     * @param {*} updateTypes           - the types would be updated
     */
    static updateType(state, caller, updateTypes) {
        if (!(Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('updateType#: Caller is not an admin or owner to this contract')
        }

        const exampleUpdateTypes = {
            add: [],
            remove: []
        }

        if (!Utils.compareKeys(exampleUpdateTypes, updateTypes)) {
            throw new ContractError('updateType#: Data.UpdateTypes input is invalid')
        }
        for (const v of Object.values(updateTypes)) {
            if (!Array.isArray(v)) {
                throw new ContractError(`updateType#: Data.UpdateTypes ${v} should be an array`)
            }
        }

        if (updateTypes.add.length === 0 && updateTypes.remove.length === 0) {
            throw new ContractError(`updateType#: Data.UpdateTypes add and remove input should not be empty for both`)
        }

        const temp = [...state.schema.types]
        const updateRemove = temp.filter(e => updateTypes.remove.indexOf(e) === -1)
        const unique = new Set()

        const updated = [...updateTypes.add, ...updateRemove]
        updated.forEach(e => unique.add(e))
        const final = []
        unique.forEach(e => { final.push(e) })
        state.schema.types = final

        return state
    }

    /**
     * addType will add a new set of types into type attribute
     * @param {*} state                     - contract state
     * @param {*} caller                    - contract caller
     * @param {*} updateCategories          - the categories would be updated
     */
     static updateCategory(state, caller, updateCategories) {
        if (!(Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('updateCategory#: Caller is not an admin or owner to this contract')
        }

        const exampleUpdateCategories = {
            add: [],
            remove: []
        }

        if (!Utils.compareKeys(exampleUpdateCategories, updateCategories)) {
            throw new ContractError('updateCategory#: Data.UpdateCategories input is invalid')
        }
        for (const v of Object.values(updateCategories)) {
            if (!Array.isArray(v)) {
                throw new ContractError(`updateCategory#: Data.UpdateCategories ${v} should be an array`)
            }
        }

        if (updateCategories.add.length === 0 && updateCategories.remove.length === 0) {
            throw new ContractError(`updateCategory#: Data.UpdateCategories add and remove input should not be empty for both`)
        }

        const temp = [...state.schema.categories]
        const updateRemove = temp.filter(e => updateCategories.remove.indexOf(e) === -1)
        const unique = new Set()

        const updated = [...updateCategories.add, ...updateRemove]
        updated.forEach(e => unique.add(e))
        const final = []
        unique.forEach(e => { final.push(e) })
        state.schema.categories = final

        return state
    }
}

export function handle(state, action) {
    const input = action.input
    const caller = action.caller

    // Read
    // isOwner read_contract_function
    /**
     * @param {String} function isOwner
     * @param {String} address address
     */
    if (input.function === 'isOwner') {
        const res = Ownable.isOwner(state.owner, input.address)
        return { result: res }
    }

    // isOwner read_contract_function
    /**
     * @param {String} function isAdmin
     * @param {String} address address
     */
    if (input.function === 'isAdmin') {
        const res = Admin.isAdmin(state.admins, input.address)
        return { result: res }
    }

    // shortNameExist read_contract_function
    /**
     * @param {String} function shortNameExist
     * @param {String} shortname name
     */
    if (input.function === 'shortNameExist') {
        const shortnames = []
        for (const e of Object.values(state.creators)) {
            shortnames.push(e.shortname)
        }
        return { result: shortnames.indexOf(input.shortname) !== -1 }
    }

    // Write
    // addAdmin write_contract_function
    /**
     * @param {String} function addAdmin
     * @param {String} target address
     */
    if (input.function === 'addAdmin') {
        const res = Admin.addAdmin(state, caller, input.target)
        return { state: res }
    }

    // removeAdmin write_contract_function
    /**
     * @param {String} function removeAdmin
     * @param {String} target address
     */
    if (input.function === 'removeAdmin') {
        const res = Admin.removeAdmin(state, caller, input.target)
        return { state: res }
    }

    // transferOwnership write_contract_function
    /**
     * @param {String} function transferOwnership
     * @param {String} target address
     */
    if (input.function === 'transferOwnership') {
        const res = Ownable.transferOwnership(state, caller, input.target)
        return { state: res }
    }

    // updateType write_contract_function
    /**
     * @param {String} function updateType
     * @param {String} data update types data
     */
    if (input.function === 'updateType') {
        const res = Likey.updateType(state, caller, input.data.updateTypes)
        return { state: res }
    }

    // updateCategory write_contract_function
    /**
     * @param {String} function updateCategory
     * @param {String} data update categories data
     */
    if (input.function === 'updateCategory') {
        const res = Likey.updateCategory(state, caller, input.data.updateCategories)
        return { state: res }
    }
    
    // announceCreator write_contract_function
    /**
     * @param {String} function announceCreator
     * @param {String|Object|any} data creator object
     */
    if (input.function === 'announceCreator') {
        const res = Creator.announceCreator(state, input.target, input.data)
        return { state: res }
    }

    // addItemToCreator write_contract_function
    /**
     * @param {String} function addItemToCreator
     * @param {String|Object|any} data item object
     */
    if (input.function === 'addItemToCreator') {
        const res = Creator.addItem(state, caller, input.target, input.data)
        return { state: res }
    }

    // removeItemFromCreator write_contract_function
    /**
     * @param {String} function removeItemFromCreator
     * @param {String} title
     */
    if (input.function === 'removeItemFromCreator') {
        const res = Creator.removeItem(state, caller, input.target, input.indexes)
        return { state: res }
    }

    // editItemsToCreator write_contract_function
    /**
     * @param {String} function editItemsToCreator
     * @param {String|Object|any}
     */
    if (input.function === 'editItemsToCreator') {
        const res = Creator.editItem(state, caller, input.target, input.data)
        return { state: res }
    }

    throw new ContractError(`No function supplied or function not recognised: "${input.function}"`)
}
