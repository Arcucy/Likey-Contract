// import fs, { stat } from 'fs'
// import path from 'path'
// import { handle } from '../contracts/likey-contract.js'

// const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-initial.json'))).toString('utf-8'))

// const state = {
//     ...initState
// }

let action
let res

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

const isOwner = {
    function: 'isOwner',
    address: 'ADDR'
}

const isAdmin = {
    function: 'isAdmin',
    address: 'ADDR'
}

const shortNameExistInput = {
    function: 'shortNameExist',
    shortname: 'ayakaneko'
}

const addAdminInput = {
    function: 'addAdmin',
    target: 'ADDR'
}

const removeAdminInput = {
    function: 'removeAdmin',
    target: 'ADDR'
}

const transferOwnershipInput = {
    function: 'transferOwnership',
    target: 'ADDR'
}

const updateTypeInput = {
    input: {
        function: 'updateType',
        data: {
            updateTypes: {
                add: ['a', 'b'],
                remove: ['a']
            }
        }
    }
}

const updateCategoryInput = {
    function: 'updateCategory',
    data: {
        update: {
            add: ['a', 'b'],
            remove: ['a']
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
    target: 'ADDR',
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
    recipient: 'ADDR',
    data: {
        tickerCreator: 'ADDR',
        quantity: '10'
    }
}

const burnForCreatorInput = {
    function: 'burnForCreator',
    target: 'ADDR',
    data: {
        tickerCreator: 'ADDR',
        quantity: '3'
    }
}

const sponsorAddedForCreatorInput = {
    function: 'sponsorAddedForCreator',
    sponsor: 'ADDR',
    data: {
        tickerCreator: 'ADDR',
        quantity: ''
    }
}
