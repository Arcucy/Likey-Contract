import fs from 'fs'
import path from 'path'
import { handle } from '../contracts/likey-pst.js'

const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-pst-initial.json'))).toString('utf-8'))

const state = {
    ...initState
}

let action
let res

action = {
    input: {
        function: 'mint',
        recipient: '3Kc1_wjK4j7rCD0O9jjjmh4vRVCG0NpJqNrpyX24KHg',
        data: {
            owner: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
            quantity: '10'
        }
    }
}

res = handle(state, action)
console.log(res.state)

const mintInput = {
    function: 'mint',
    recipient: 'ADDR',
    data: {
        owner: 'ADDR',
        quantity: '10'
    }
}

const burnInput = {
    function: 'burn',
    target: 'ADDR',
    data: {
        owner: 'ADDR',
        quantity: '3'
    }
}

const transferInput = {
    function: 'transfer',
    sponsor: 'ADDR',
    data: {
        owner: 'ADDR',
        quantity: ''
    }
}

const sponsorAddedInput = {

}
