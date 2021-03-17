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

class Ticker {
    static _mint(state, recipient, data) {
        const balancesState = JSON.parse(JSON.stringify(state.balances))
        if (!balancesState.hasOwnProperty(recipient)) {
            Object.defineProperty(balancesState, recipient, {
                value: "0",
                writable: true,
                enumerable: true
            })
        }

        const finalValue = BigInt(balancesState[recipient]) + BigInt(data.quantity)
        balancesState[recipient] = finalValue
        state.balances[recipient] = balancesState
    }

    static _burn(state, target, data) {
        if (!balancesState.hasOwnProperty(target)) {
            throw new ContractError('burn#: Target has no balance in this ticker or invalid')
        }
        // const finalValue = SmartWeave.arweave.ar.sub(String(tickerState.balances[target]), String(data.quantity))
        if (arweave.ar.isGreaterThan(String(data.quantity), tickerState.balances[target])) {
            balancesState[target] = "0"
            state.balances[target] = tickerState
        }
        else {
            const finalValue = BigInt(balancesState[target]) + BigInt(data.quantity)
            balancesState[target] = finalValue
            state.balances[target] = balancesState
        }
    }

    /**
     * mint will add the specified value of tickers to target
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} recipient     - minted ticker recipient
     * @param {*} data          - mint data
     */
    static mint(state, caller, recipient, data) {
        if (!(data.owner === caller)) {
            throw new ContractError('mintForCreator#: Caller is not the creator of its own')
        }
        if (!Utils.isAddress(String(recipient))) {
            throw new ContractError(`mintForCreator#: Recipient is not a address`)
        }

        this._mint(state, recipient, data)
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
        if (!(quantity === caller)) {
            throw new ContractError('burnForCreator#: Caller is not the creator of its own')
        }
        if (!Utils.isAddress(String(target))) {
            throw new ContractError(`burnForCreator#: Target is not a address`)
        }

        this._burn(state, target, quantity)
        return state
    }

    /**
     * transfer will transfer a specific number of pst to recipient
     * @param {*} state         - contract state
     * @param {*} caller        - contract caller
     * @param {*} recipient     - minted ticker recipient
     * @param {*} data          - mint data
     */
    static transfer(state, caller, recipient, data) {

    }
}

export function handle(state, action) {
    const input = action.input
    const caller = action.caller

    if (input.function === 'mint') {
        const res = Ticker.mint(state, caller, input.recipient, input.data)
        return { state: res }
    }
    
    if (input.function === 'burn') {
        const res = Ticker.burn(state, caller, input.target, input.data)
        return { state: res }
    }
    
    if (input.function === 'transfer') {
        const res = Ticker.transfer(state, caller, input.recipient, input.data)
        return { state: res }
    }
}
