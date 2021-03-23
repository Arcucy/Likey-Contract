/**
 * Likey PST Contract
 * Version: 1.0.1
 * 
 * Copyright ©️ Arcucy.io
 * 
 * Author: Arcucy Team <i@arcucy.io>
 * Assosiated With: Project LIKEY
 * Source: https://github.com/AyakaLab/Growth-Contract
 */

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
        if (address === 'undefined') {
            throw new ContractError('isAddress#: Address is invalid')
        }
        return /^([a-zA-Z0-9]|_|-)+$/.test(address)
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

    static ratioConversion(state) {
        if (!/1:\d+\.\d+(?!\d+)/.test(state.ratio)) {
            throw new ContractError('sponsorAdded#: Ratio is invalid')
        }
        let original = 1
        let conversion = parseFloat(state.ratio.split(':').pop())
        let iteration = 0

        while (true) {
            if (!Number.isInteger(conversion)) {
                conversion = conversion * 10
                iteration++
                continue
            }
            break
        }

        for (let i = 0; i < iteration; i++) {
            original = BigInt(original) * BigInt('10')
        }
        conversion = BigInt(conversion)
        return { original, conversion }
    }
}

class Ticker {
    static _updateHolders(state) {
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        state.holders = String(Object.keys(balancesState).length)
    }

    static _updateTotalSupply(state) {
        let init = BigInt('0')
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        for (const i of Object.values(balancesState)) {
            init = init + BigInt(i)
        }

        state.totalSupply = init.toString()
    }

    static _mint(state, recipient, quantity) {
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        if (!balancesState.hasOwnProperty(recipient)) {
            Object.defineProperty(balancesState, recipient, {
                value: '0',
                writable: true,
                enumerable: true
            })
        }

        try {
            BigInt(String(quantity))
        } catch {
            throw new ContractError('_mint#: Input quantity invalid, should be number string')
        }

        const finalValue = BigInt(balancesState[recipient]) + BigInt(quantity)
        balancesState[recipient] = finalValue.toString()

        state.balances = balancesState
    }

    static _burn(state, target, quantity) {
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        if (!balancesState.hasOwnProperty(target)) {
            throw new ContractError('_burn#: Target has no balance in this ticker or invalid')
        }

        try {
            BigInt(String(quantity))
        } catch {
            throw new ContractError('_burn#: Input quantity invalid, should be number string')
        }

        if (BigInt(String(quantity) > BigInt(balancesState[target])) || BigInt(String(quantity)) === BigInt(balancesState[target])) {
            delete balancesState[target]
            state.holders = String(Object.keys(balancesState).length)
            state.balances = balancesState
        }
        else {
            const finalValue = BigInt(balancesState[target]) - BigInt(quantity)
            balancesState[target] = finalValue.toString()
            state.balances = balancesState
        }
    }

    static _transfer(state, sender, recipient, qty) {
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        if (!balancesState.hasOwnProperty(recipient)) {
            this._mint(state, recipient, qty)
            balancesState[recipient] = state.balances[recipient]
        }
        else {
            const add = BigInt(balancesState[recipient]) + BigInt(String(qty))
            balancesState[recipient] = add.toString()
        }

        const sub = BigInt(balancesState[sender]) - BigInt(String(qty))
        balancesState[sender] = sub.toString()

        state.balances = balancesState
    }

    /**
     * mint will add the specified value of tickers to target
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} recipient     - minted ticker recipient
     * @param {*} data          - mint data
     */
    static mint(state, caller, recipient, quantity) {
        if (!(Ownable.isOwner(state.owner, caller) || Admin.isAdmin(state.admins, caller))) {
            throw new ContractError('mint#: Caller is not the creator or admin of this contract')
        }
        if (!Utils.isAddress(String(recipient))) {
            throw new ContractError(`mint#: Recipient is not a address`)
        }

        this._mint(state, recipient, quantity)
        this._updateHolders(state)
        this._updateTotalSupply(state)
        return state
    }

    /**
     * burn will burn a specified value of tickers from target holder
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} target        - burning target
     * @param {*} quantity      - quantity
     */
    static burn(state, caller, target, quantity) {
        if (!(Ownable.isOwner(state.owner, caller) || Admin.isAdmin(state.admins, caller))) {
            throw new ContractError('burn#: Caller is not the creator or admin of this contract')
        }
        if (!Utils.isAddress(String(target))) {
            throw new ContractError(`burn#: Target is not a address`)
        }

        this._burn(state, target, quantity)
        this._updateHolders(state)
        this._updateTotalSupply(state)
        return state
    }

    /**
     * transfer will transfer a specific number of pst to recipient
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} recipient     - minted ticker recipient
     * @param {*} qty           - transfer quantity
     */
    static transfer(state, caller, recipient, qty) {
        if (!Utils.isAddress(String(recipient))) {
            throw new ContractError(`transfer#: Target is not a address`)
        }
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        if (!balancesState.hasOwnProperty(caller)) {
            throw new ContractError('transfer#: Sender(caller) is invalid')
        }
        try {
            BigInt(String(qty))
        } catch (e) {
            throw new ContractError('transfer#: Sender(caller) input qty invalid, should be number string')
        }
        if (balancesState[caller] === '0' || BigInt(balancesState[caller]) < BigInt(String(qty))) {
            throw new ContractError('transfer#: Sender(caller) is insufficient fund')
        }

        this._transfer(state, caller, recipient, qty)
        this._updateHolders(state)
        this._updateTotalSupply(state)
        return state
    }

    /**
     * sponsorAdded adds a sponsor along with coresponding value of pst according to its transaction quantity
     * @param {*} state         - contract state
     */
    static sponsorAdded(state) {
        if (!(SmartWeave.transaction.target || SmartWeave.transaction.target === '')) {
            throw new ContractError('sponsorAdded#: Sponsor invalid because of transfering target not specified')
        }
        if (SmartWeave.transaction.target !== state.owner) {
            throw new ContractError('sponsorAdded#: Sponsor failed because of transfering target is not the owner of this contract')
        }
        const ratio = Utils.ratioConversion(state)
        const quantity = BigInt(SmartWeave.transaction.quantity) * ratio.original / ratio.conversion

        this._mint(state, SmartWeave.transaction.owner, quantity)
        this._updateHolders(state)
        this._updateTotalSupply(state)

        return state
    }

    /**
     * donationAdded adds a donation records into state.donation
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} data          - donation data
     */
    static donationAdded(state, caller, data) {
        const donations = [...state.donations]

        if (!Utils.isAddress(data.statusId)) {
            throw new ContractError(`donationAdded#: Status ID is not a address`)
        }

        const obj = {
            statusId: data.statusId,
            quantity: SmartWeave.transaction.quantity,
            sender: caller
        }

        donations.push(obj)
        state.donations = donations

        return state
    }
}

class LikeyPST {
    static updateRatio(state, caller, data) {
        if (!(Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('updateRatio#: Caller is not the creator of its own')
        }
        state.ratio = data.ratio
        return state
    }

    /**
     * editSettings edit the settings of this contract
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} data          - setting data
     */
    static editSettings(state, caller, data) {
        if (!(Ownable.isOwner(state.owner, caller) || Admin.isAdmin(state.admins, caller))) {
            throw new ContractError('editSettings#: Caller is not the creator of its own or admin')
        }

        if (!Array.isArray(data.settings)) {
            throw new ContractError('editSettings#: Data.Settings input is invalid, should be array')
        }
        for (const i of data.settings) {
            if (!Array.isArray(i)) {
                throw new ContractError(`editSettings#: Data.Settings<Array> input ${i} is invalid, should be array`)
            }
            console.log(i)
            if (i.length === 0) {
                throw new ContractError(`editSettings#: Data.Settings<Object> input ${i} is invalid, should not be empty`)
            }
            for (const e of i) {
                if (!(e || typeof (e) !== 'string')) {
                    throw new ContractError(`editSettings#: Data.Settings<Object> input value ${e} is invalid, should not be null`)
                }
            }
        }

        state.settings = data.settings
        return state
    }

    /**
     * editAttributes edit the attributes of this contract
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} data          - setting data
     */
    static editAttributes(state, caller, data) {
        if (!(Ownable.isOwner(state.owner, caller) || Admin.isAdmin(state.admins, caller))) {
            throw new ContractError('editAttributes#: Caller is not the creator of its own')
        }

        if (!Array.isArray(data.attributes)) {
            throw new ContractError('editAttributes#: Data.Attributes input is invalid, should be array')
        }
        for (const i of data.attributes) {
            if (typeof (i) !== 'object') {
                throw new ContractError(`editAttributes#: Data.Attributes input ${i} is invalid, should be object`)
            }
            if (Object.keys(i).length === 0) {
                throw new ContractError(`editAttributes#: Data.Attributes<Object> input ${Object.keys(i)} is invalid, should not be empty`)
            }
            for (const e of Object.values(i)) {
                if (!e) {
                    throw new ContractError(`editAttributes#: Data.Attributes<Object> input value ${e} is invalid, should not be null`)
                }
            }
        }

        const uniqueKey = []
        const uniqueObj = []
        data.attributes.forEach((e) => {
            const key = Object.keys(e).pop()
            if (uniqueKey.indexOf(key) === -1) {
                uniqueKey.push(key)
                uniqueObj.push(e)
            }
            return
        })

        state.attributes = uniqueObj
        return state
    }
}

export function handle(state, action) {
    const input = action.input
    const caller = action.caller

    // mint write_contract_function
    /**
     * @param {String} recipient address
     * @param {Object} data mint data
     */
    if (input.function === 'mint') {
        const res = Ticker.mint(state, caller, input.recipient, input.quantity)
        return { state: res }
    }

    // burn write_contract_function
    /**
     * @param {String} target address
     * @param {Object} data burn data
     */
    if (input.function === 'burn') {
        const res = Ticker.burn(state, caller, input.target, input.quantity)
        return { state: res }
    }

    // transfer write_contract_function
    /**
     * @param {String} target address
     * @param {String} qty quantity
     */
    if (input.function === 'transfer') {
        const res = Ticker.transfer(state, caller, input.target, input.qty)
        return { state: res }
    }

    // sponsorAdded write_contract_function
    /**
     * @param {Object} data sponsor data
     */
    if (input.function === 'sponsorAdded') {
        const res = Ticker.sponsorAdded(state)
        return { state: res }
    }

    // donationAdded write_contract_function
    /**
     * @param {Object} data donation data
     */
    if (input.function === 'donationAdded') {
        const res = Ticker.donationAdded(state, caller, input.data)
        return { state: res }
    }

    // updateRatio write_contract_function
    /**
     * @param {Object} data ratio data
     */
     if (input.function === 'updateRatio') {
        const res = LikeyPST.updateRatio(state, caller, input.data)
        return { state: res }
    }

    // editSettings write_contract_function
    /**
     * @param {Object} data settings data
     */
    if (input.function === 'editSettings') {
        const res = LikeyPST.editSettings(state, caller, input.data)
        return { state: res }
    }

    // editAttributes write_contract_function
    /**
     * @param {Object} data attributes data
     */
    if (input.function === 'editAttributes') {
        const res = LikeyPST.editAttributes(state, caller, input.data)
        return { state: res }
    }
}
