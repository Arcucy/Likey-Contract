import fs, { stat } from 'fs'
import path from 'path'
import { handle } from '../contracts/likey-contract.js'

const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/growth-project-initial.json'))).toString('utf-8'))

const state = {
    ...initState
}

state.owner = 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ'

let action
let res

action = {
    input: { 
        function: 'announceCreator',
        data: {
            type: 'Personal',
            shortname: 'xxx',
            intro: '[0-40]',
            categories: ['1', '2'],
            target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
            ticker: {
                ticker: 'ANC',
                name: 'Ayaka Neko Coin',
                contract: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
            },
            items: [
                {
                    title: "Example Title",
                    value: 10,
                    description: "Example Description"
                },
                {
                    title: "Example Title",
                    value: 10,
                    description: "Example Description"
                }
            ]
        }
    }, 
    caller: 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ'
}
res = handle(state, action)

action = {
    input: { 
        function: 'removeCreator',
        target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
    }, 
    caller: '$ADMIN'
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

/**
 * 客户端发起三个请求，分别是
 * 1. 向目标用户转账
 * 2. 向主合约发起余额变更请求，请求中附带转账 ID 以及数据内容
 * 3. 向目标用户所创建的 PST 合约发起余额变更请求，请求中必须附带转账的 ID
 */

// 成为创作者就会发行 PST 并生成一个合约，每个账户个人名下只能有一种 PST
// 合约内容将会被添加到 announces.ADDRESS.creator.ticker-contract

// 成为项目管理者会发行项目 PST 并生成一个合约，每个项目只能对应一种 PST
// 合约内容将会被添加到 announces.ADDRESS.projects[i].ticker-contract

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
