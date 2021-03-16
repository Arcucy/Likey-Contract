import fs, { stat } from 'fs'
import path from 'path'
import { handle } from '../contracts/likey-contract.js'

const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-initial.json'))).toString('utf-8'))

const state = {
    ...initState
}

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
            scale: 'single',
            shortname: 'xxx',
            intro: '[x-1000]',
            category: '',
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

/**
 * isOwner 合约读取方法
 * 判断一个地址是不是合约拥有者   
 * address 填写 Arweave 地址
 */
const isOwner = {
    function: 'isOwner',
    address: '${ADDR}'
}

/**
 * isAdmin 合约读取方法 
 * 判断一个地址是不是合约管理员   
 * address 填写 Arweave 地址
 */
const isAdmin = {
    function: 'isAdmin',
    address: '${ADDR}'
}

/**
 * shortNameExist 合约读取方法 
 * 判断一个用户短链接名是否已经存在   
 * shortname 填写字符串
 */
const shortNameExist = {
    function: 'shortNameExist',
    shortname: '${ayakaneko}'
}

/**
 * addAdmin 合约写入方法 
 * 添加一个地址为管理员，该操作只有合约拥有者有权限完成   
 * target 填写地址
 */
const addAdmin = {
    function: 'addAdmin',
    target: 'ADDR'
}

/**
 * removeAdmin 合约写入方法 
 * 从管理员列表溢出一个管理员，该操作只有合约拥有者有权限完成   
 * target 填写地址
 */
const removeAdminInput = {
    function: 'removeAdmin',
    target: 'ADDR'
}

/**
 * transferOwnership 合约写入方法 
 * 转移合约所有权为目标地址，该操作只有合约拥有者有权限完成   
 * target 填写地址
 */
const transferOwnershipInput = {
    function: 'transferOwnership',
    target: 'ADDR'
}

/**
 * updateScale 合约写入方法 
 * 更新合约支持的创作规模   
 * data 结构中含有 updateScales 对象   
 * updateScales 对象中必须包含 add 和 remove 字段
 */
const updateScaleInput = {
    input: {
        function: 'updateScale',
        data: {
            updateScales: {
                add: ['a', 'b'],
                remove: ['a']
            }
        }
    }
}

/**
 * updateCategory 合约写入方法 
 * 更新合约支持的创作类型   
 * data 结构中含有 updateCategories 对象   
 * updateCategories 对象中必须包含 add 和 remove 字段
 */
const updateCategoryInput = {
    function: 'updateCategory',
    data: {
        updateCategories: {
            add: ['a', 'b'],
            remove: ['a']
        }
    }
}

/**
 * announceCreator 合约写入方法 
 * 创建一个创作者   
 * data 结构中必须含有 scale, shortname, intro, category, ticker, items 字段，
 * 其中，items 数组可以为长度为零的数组，ticker 包含 ticker，name，contract 字段，
 * items 的物品包含 title，value，description 字段
 */
const announceCreatorInput = {
    function: 'announceCreator',
    data: {
        scale: 'Personal',
        shortname: 'xxx',
        intro: 'xxx',
        category: '',
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

/**
 * updateCreator 合约写入方法 
 * 更新一个创作者   
 * data 结构中必须含有 scale, intro, category 字段
 */
const updateCreatorInput = {
    function: 'updateCreator',
    data: {
        scale: 'Personal',
        shortname: 'xxxx2',
        intro: 'New!!!',
        category: 'Type3'
    }
}

/**
 * addItem 合约写入方法 
 * 为创作者添加多个售卖物品   
 * data 结构中必须含有 items 字段，
 * items 的物品包含 title，value，description 字段
 */
const addItemInput = {
    function: 'addItem',
    target: 'ADDRESS',
    data: {
        items: [
            {
                title: 'Example Title',
                value: '10',
                description: ''
            }
        ]
    }
}

/**
 * removeItem 合约写入方法 
 * 为创作者移除多个售卖物品   
 * data 结构中必须含有 indexes 字段，indexes 是对应的合约中存储的索引 id 的值
 */
const removeItemInput = {
    function: 'removeItem',
    target: 'ADDRESS',
    indexes: [1]
}

/**
 * editItem 合约写入方法 
 * 编辑多个创作者的售卖物品   
 * data 结构中必须含有 items 字段，   
 * items 的物品包含 title，value，description，id 字段
 */
const editItemInput = {
    function: 'editItem',
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
