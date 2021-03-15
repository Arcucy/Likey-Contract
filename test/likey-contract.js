import fs, { stat } from 'fs'
import path from 'path'
import { handle } from '../contracts/likey-contract.js'

const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-initial.json'))).toString('utf-8'))

const state = {
    ...initState
}

state.owner = 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ'

let action
let res

action = {
    input: { 
        function: 'announceCreator',
        target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
        data: {
            type: 'Personal',
            shortname: 'xxx',
            intro: '[0-40]',
            categories: ['Type1', 'Type2'],
            ticker: {
                ticker: 'ANC',
                name: 'Ayaka Neko Coin',
                contract: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
            },
            items: [
                {
                    title: "我是第零位",
                    value: '10',
                    description: "将被改变的数据"
                },
                {
                    title: "Example Title",
                    value: '10',
                    description: "Example Description"
                }
            ]
        }
    }, 
    caller: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
}
res = handle(state, action)

const user = {
    type: '',
    shortname: '',
    intro: '',
    category: [],
}

const pst = {
    name: '',
    ticker: '',
    balances: [],
    attributes: [
        { 'communityLogo': 'address' }
    ],
    settings: [
        [
            'communityLogo',
            'address'
        ],
        [
            "communityAppUrl",
            "contract addr"
        ]
    ]
}

const expected = {
    admins: [],
    owner: '',
    creators: {
        'ADDRESS': {
            type: 'single',
            shortname: 'xxx',
            intro: '[x-1000]',
            category: ['type1', 'type2'],
            ticker: {
                name: 'TICKER',
                ticker: 'TIC',
                contract: 'ADDR',
                // 持仓人数
                balances: {
                    "A": '10',
                    "B": '10',
                },
                holders: 2,
                totalSupply: '20'
            },
            items: [
                {
                    title: 'Example Title',
                    /** 必须换算为最小小数点 */
                    value: '10',
                    description: ''
                }
            ]
        }
    }
}

const announceCreatorInput = {
    function: 'announceCreator',
    target: 'ADDRESS',
    data: {
        type: 'Personal',
        shortname: 'xxx',
        intro: 'xxx',
        categories: ['1', '2'],
        ticker: {
            ticker: 'EXA',
            name: 'Example Name',
            contract: 'ADDRESS',
        },
        items: [
            {
                title: "Example Title",
                value: '10',
                description: "Example Description"
            }
        ]
    }
}

const addItemToCreatorInput = {
    function: 'addItemToCreator',
    target: 'ADDRESS',
    data: {
        items: [
            {
                title: 'Example Title',
                /** 必须换算为最小小数点 */
                value: '10',
                description: ''
            }
        ]
    }
}

const removeItemFromCreatorInput = {
    function: 'removeItemFromCreator',
    target: 'ADDRESS',
    indexes: [1]
}

const editItemsToCreatorInput = {
    function: 'editItemsToCreator',
    target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
    data: {
        items: [
            {
                id: 0,
                title: "我是第零位",
                value: '10',
                description: "改变之后"
            }
        ]
    }
}

const mintForCreatorInput = {
    function: 'mintForCreator',
    recipient: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
    data: {
        tickerCreator: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
        quantity: '10'
    }
}

const burnForCreatorInput = {
    function: 'burnForCreator',
    target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
    data: {
        tickerCreator: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
        quantity: '3'
    }
}

const sponsorAddedForCreatorInput = {
    function: 'sponsorAddedForCreator',
    sponsor: 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ',
    data: {
        tickerCreator: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
        quantity: ''
    }
}
