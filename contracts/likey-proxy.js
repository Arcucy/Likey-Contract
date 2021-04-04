/**
 * Likey Proxy
 * Version: 1.1.0
 * 
 * Copyright ©️ Arcucy.io
 * 
 * Author: Arcucy Team <i@arcucy.io>
 * Assosiated With: Project LIKEY
 * Source: https://github.com/AyakaLab/Likey-Contract
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
}

class Contract {
    static update(state, caller, address) {
        if (!(Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('update#: Permission Denied')
        }

        if (!Utils.isAddress(address)) {
            throw new ContractError('update#: Address is not valid')
        }

        state.contract = address
        return state
    }

    static updatePst(state, caller, data) {
        if (!(Admin.isAdmin(state.admins, caller) || Ownable.isOwner(state.owner, caller))) {
            throw new ContractError('update#: Permission Denied')
        }

        if (!Utils.isAddress(data.state) || !Utils.isAddress(data.src)) {
            throw new ContractError('update#: Address is not valid')
        }

        state.pstContract = data.state
        state.pstContractSrc = data.src

        return state
    }
}

export function handle(state, action) {
    const input = action.input
    const caller = action.caller

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

    // updateContract write_contract_function
    /**
     * @param {Object} data mint data
     */
    if (input.function === 'updateContract') {
        const res = Contract.update(state, caller, input.address)
        return { state: res }
    }

    // updateContract write_contract_function
    /**
     * @param {Object} data mint data
     */
     if (input.function === 'updatePstContract') {
        const res = Contract.updatePst(state, caller, input.data)
        return { state: res }
    }

    throw new ContractError(`No function supplied or function not recognised: '${input.function}'`)
}
