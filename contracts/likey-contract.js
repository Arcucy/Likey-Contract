/**
 * Likey Contract
 * Version: 1.0.5
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
        if (!Array.isArray(admins)) {
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
        if (typeof (address) !== 'string') {
            throw new ContractError('isAddress#: Address is not string')
        }
        if ((address === 'undefined' || !address)) {
            throw new ContractError('isAddress#: Address is invalid')
        }
        return /^([a-zA-Z0-9]|_|-){43}$/.test(address)
    }

    /**
     * isValidUsername checks whether the input string is a valid username
     * @param {*} string 
     * @returns boolean
     */
    static isValidUsername(string) {
        if (typeof (string) !== 'string') {
            throw new ContractError('isValidUsername#: input string is not string')
        }
        if ((string === 'undefined' || !string)) {
            throw new ContractError('isAddress#: Address is invalid')
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
        return Object.keys(creators).indexOf(address) !== -1
    }

    static verifyData(state, data) {
        const example = {
            scale: '', shortname: '', intro: '', category: '',
            ticker: { ticker: '', name: '', contract: '' },
            items: [{ title: '', value: '0', description: '' }]
        }

        if (!Utils.compareKeys(example, data)) {
            throw new ContractError('verifyData#: Data input is invalid, keys does not match the schema')
        }

        for (const [key, value] of Object.entries(data)) {
            if (key === 'scale' || key === 'shortname' || key === 'intro' || key === 'category') {
                if (typeof (value) !== 'string') {
                    throw new ContractError(`verifyData#: Invalid key '${key}' with value '${value}', value should be string`)
                }
            }
        }

        if (state.schema.scales.indexOf(String(data.scale)) === -1) {
            throw new ContractError(`verifyData#: Unsupported Creation Scale: ${data.scale}`)
        }

        if (!(Utils.isValidUsername(String(data.shortname)) || String(data.shortname).length > 42)) {
            throw new ContractError(`verifyData#: Shortname is invalid for: ${data.shortname}`)
        }

        const shortnames = []
        for (const e of Object.values(state.creators)) {
            shortnames.push(String(e.shortname).toLowerCase())
        }
        if (shortnames.indexOf(String(data.shortname).toLowerCase()) !== -1) {
            throw new ContractError(`verifyData#: Shortname has been taken by someone else`)
        }

        if (String(data.intro).length > 100) {
            throw new ContractError(`verifyData#: Intro is out of limitaion`)
        }

        if (state.schema.categories.indexOf(String(data.category)) === -1) {
            throw new ContractError(`verifyData#: Categories is invalid for: ${String(data.category)}`)
        }

        const exampleTikcer = {
            ticker: '',
            name: '',
            contract: '',
            ratio: ''
        }

        if (!Utils.compareKeys(exampleTikcer, data.ticker) || Object.keys(data.ticker) < 3) {
            throw new ContractError('verifyData#: Data.Ticker input is invalid, keys does not match the schema')
        }

        for (const [key, value] of Object.entries(data.ticker)) {
            if (key === 'ticker' || key === 'name' || key === 'contract' || key === 'ratio') {
                if (typeof (value) !== 'string') {
                    throw new ContractError(`verifyData#: Invalid ticker key '${key}' with value '${value}', value should be string`)
                }
            }
        }
        const ratio = String(data.ticker.ratio).split(':').pop()
        const ratioDecimals = ratio.split('.')
        if (ratioDecimals.length === 2 && String(ratioDecimals[1]).length > 12) {
            throw new ContractError(`verifyData#: Invalid ticker key ratio with value '${data.ticker.ratio}', decimals should be within 12`)
        }

        data.ticker.ratio = '1:' + ratio

        if (!Utils.isAddress(String(data.ticker.contract))) {
            throw new ContractError(`verifyData#: Contract is not a address`)
        }
    }

    static verifyItems(data, hasId) {
        const exampleItem = {
            title: '',
            value: '10',
            description: ''
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
                    throw new ContractError(`verifyItems#: Data.Items items[${i}] input is invalid, keys does not match the schema`)
                }

                for (const [key, value] of Object.entries(e)) {
                    if (key === 'title' || key === 'description' || key === 'value') {
                        if (typeof (value) !== 'string') {
                            throw new ContractError(`verifyItems#: Invalid items[${i}] key '${key}' with value '${value}', value should be string`)
                        }
                    }

                    if (hasId && key === 'id' && !Number.isInteger(value)) {
                        throw new ContractError(`verifyItems#: Invalid items[${i}] key '${key}' with value '${value}', value should be integer`)
                    }
                }
            }
        }
    }

    /**
     * announceCreator announce a creator and adds the creator data into contract
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} data          - creator data
     * @returns state
     */
    static announceCreator(state, caller, data) {
        if (!Utils.isAddress(String(caller))) {
            throw new ContractError(`announceCreator#: Caller is not a address`)
        }
        if (Creator.isCreator(state.creators, caller)) {
            throw new ContractError('announceCreator#: Caller is already creator')
        }
        try {
            if (typeof (data) !== 'object') {
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

        Object.defineProperty(state.creators, String(caller), {
            value: data,
            writable: true,
            enumerable: true
        })

        return state
    }

    /**
     * removeCreator removes a creator from creators
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} data          - data
     */
    static removeCreator(state, caller, target) {
        if (!Creator.isCreator(state.creators, target)) {
            throw new ContractError('removeCreator#: Target is not a creator')
        }
        if (!(target === caller || Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('removeCreator#: Caller is not the creator of its own or admin/owner')
        }

        const creators = JSON.parse(JSON.stringify(state.creators))
        delete creators[target]
        state.creators = creators
        return state
    }

    static updateCreator(state, caller, data) {
        if (!Utils.isAddress(String(caller))) {
            throw new ContractError(`updateCreator#: Caller is not a address`)
        }
        if (!Creator.isCreator(state.creators, caller)) {
            throw new ContractError('updateCreator#: Caller is not a creator')
        }
        try {
            if (typeof (data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`updateCreator#: Data is not a valid JSON or Object ,${e.message}`)
        }

        const example = {
            scale: '', intro: '', category: ''
        }

        if (!Utils.compareKeys(example, data)) {
            throw new ContractError('updateCreator#: Data input is invalid, keys does not match the schema')
        }

        for (const [key, value] of Object.entries(data)) {
            if (key === 'scale' || key === 'intro' || key === 'category') {
                if (typeof (value) !== 'string') {
                    throw new ContractError(`updateCreator#: Invalid key '${key}' with value '${value}', value should be string`)
                }
            }
        }

        if (state.schema.scales.indexOf(String(data.scale)) === -1) {
            throw new ContractError(`updateCreator#: Unsupported Creation Scale: ${data.scale}`)
        }

        if (String(data.intro).length > 100) {
            throw new ContractError(`updateCreator#: Intro is out of limitaion`)
        }

        if (state.schema.categories.indexOf(String(data.category)) === -1) {
            throw new ContractError(`updateCreator#: Categories is invalid for: ${String(data.category)}`)
        }

        const creator = JSON.parse(JSON.stringify(state.creators[caller]))
        creator.scale = data.scale
        creator.intro = data.intro
        creator.category = data.category

        state.creators[caller] = creator
        return state
    }

    static updateRatio(state, caller, data) {
        if (!(Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller) || Creator.isCreator(state.creators, caller))) {
            throw new ContractError('updateRatio#: Caller is not the creator of its own or admin/owner')
        }

        const ratio = String(data.ratio).split(':').pop()
        const ratioDecimals = ratio.split('.')
        if (ratioDecimals.length === 2 && String(ratioDecimals)[1].length > 12) {
            throw new ContractError(`updateRatio#: Invalid ratio with value '${data.ratio}', decimals should be within 12`)
        }

        state.creators[caller].ticker.ratio = '1:' + parseFloat(parseFloat(ratio).toFixed(12))
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
            throw new ContractError('editItem#: Target is not a creator')
        }
        if (!(target === caller || Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('editItem#: Caller is not the creator of its own or admin/owner')
        }
        try {
            if (typeof (data) !== 'object') {
                data = JSON.parse(data)
            }
        } catch (e) {
            throw new ContractError(`editItem#: Data is not a valid JSON or Object ,${e.message}`)
        }
        if (data.items.length === 0) {
            throw new ContractError(`editItem#: Data.Items should not be empty`)
        }
        if (data.items.length > Number.MAX_VALUE - 100) {
            throw new ContractError(`editItem#: The number of yours total items has reached the limitation of MAX_VALUE`)
        }
        this.verifyItems(data, true)

        // Unique for id
        const resArr = []
        data.items.forEach(e => {
            const i = resArr.findIndex(x => x.id == e.id);
            if(i <= -1){
                resArr.push(e);
            }
        })

        // Pump into objects
        const editItems = {}
        resArr.forEach(e => {
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

        // Build Result
        const final = []
        Object.keys(editItems).forEach((i, index) => {
            const pending = editItems[String(i)]
            pending['id'] = index
            final.push(pending)
        })
        state.creators[target].items = final
        return state
    }
}

class Likey {
    /**
     * updateScale will add a new set of scales into scales attribute
     * @param {*} state                 - contract state
     * @param {*} caller                - contract caller
     * @param {*} updateScales          - the scales would be updated
     */
    static updateScale(state, caller, updateScales) {
        if (!(Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('updateScale#: Caller is not an admin or owner to this contract')
        }

        const exampleUpdateScales = {
            add: [],
            remove: []
        }

        if (!Utils.compareKeys(exampleUpdateScales, updateScales)) {
            throw new ContractError('updateScale#: Data.UpdateScales input is invalid, keys does not match the schema')
        }
        for (const v of Object.values(updateScales)) {
            if (!Array.isArray(v)) {
                throw new ContractError(`updateScale#: Data.UpdateScales ${v} should be an array`)
            }
        }

        if (updateScales.add.length === 0 && updateScales.remove.length === 0) {
            throw new ContractError(`updateScale#: Data.UpdateScales add and remove input should not be empty for both`)
        }

        const temp = [...state.schema.scales]
        const updateRemove = temp.filter(e => updateScales.remove.indexOf(e) === -1)
        const unique = new Set()

        const updated = [...updateScales.add, ...updateRemove]
        updated.forEach(e => unique.add(e))
        const final = []
        unique.forEach(e => { final.push(e) })
        state.schema.scales = final

        return state
    }

    /**
     * updateCategory will add a new set of categories into categories attribute
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
            throw new ContractError('updateCategory#: Data.UpdateCategories input is invalid, keys does not match the schema')
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
            shortnames.push(String(e.shortname).toLowerCase())
        }
        return { result: shortnames.indexOf(String(input.shortname).toLowerCase()) !== -1 }
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

    // updateScale write_contract_function
    /**
     * @param {String} function updateScale
     * @param {String} data update scales data
     */
    if (input.function === 'updateScale') {
        const res = Likey.updateScale(state, caller, input.data.updateScales)
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
        const res = Creator.announceCreator(state, caller, input.data)
        return { state: res }
    }

    // removeCreator write_contract_function
    /**
     * @param {String} function removeCreator
     * @param {String} target address
     */
    if (input.function === 'removeCreator') {
        const res = Creator.removeCreator(state, caller, input.target)
        return { state: res }
    }

    // updateCreator write_contract_function
    /**
     * @param {String} function updateCreator
     * @param {String|Object|any} data creator updating object
     */
    if (input.function === 'updateCreator') {
        const res = Creator.updateCreator(state, caller, input.data)
        return { state: res }
    }

    // editItem write_contract_function
    /**
     * @param {String} function editItem
     * @param {String|Object|any}
     */
    if (input.function === 'editItem') {
        const res = Creator.editItem(state, caller, input.target, input.data)
        return { state: res }
    }

    // updateRatio write_contract_function
    /**
     * @param {Object} data ratio data
     */
     if (input.function === 'updateRatio') {
        const res = Creator.updateRatio(state, caller, input.data)
        return { state: res }
    }

    throw new ContractError(`No function supplied or function not recognised: '${input.function}'`)
}
