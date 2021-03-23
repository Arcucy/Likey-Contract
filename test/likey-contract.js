import fs, { stat } from 'fs'
import path from 'path'
import { handle } from '../contracts/likey-contract.js'

const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-initial.json'))).toString('utf-8'))

const state = {
    ...initState
}

let action
let res

action = {
    input: {
        function: 'announceCreator',
        data: {
        /** 创作规模 */
          scale: 'Personal',
          /** 短链接 */
          shortname: 'ayakaneko',
          /** 自我介绍 */
          intro: '🐈🐱🐱可爱猫咪',
          /** 创作类型 */
          category: 'writing',
          /** PST 代币相关 */
          ticker: {
            name: 'Ayaka Neko Coin',
            ticker: 'ANC',
            contract: 'mGjKEbZnNXkxIXIJNkzMZi_jBADXC9QGlovd2fGmQas'
          },
          /** 售卖方案列表 */
          items: []
        }
    },
    caller: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
}

res = handle(state, action)
console.log(res.state)

action = {
    input: {
        function: 'announceCreator',
        data: {
        /** 创作规模 */
          scale: 'Personal',
          /** 短链接 */
          shortname: 'littlesound',
          /** 自我介绍 */
          intro: '🐈🐱🐱可爱猫咪',
          /** 创作类型 */
          category: 'writing',
          /** PST 代币相关 */
          ticker: {
            name: 'Ayaka Neko Coin',
            ticker: 'ANC',
            contract: 'mGjKEbZnNXkxIXIJNkzMZi_jBADXC9QGlovd2fGmQas'
          },
          /** 售卖方案列表 */
          items: []
        }
    },
    caller: 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ'
}

res = handle(state, action)
console.log(res.state)

action = {
    input: {
        function: 'removeCreator',
        target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
    },
    caller: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
}
res = handle(state, action)

action = {
    input: {
        function: 'removeCreator',
        target: 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ'
    },
    caller: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
}
res = handle(state, action)
console.log(res.state)
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
const addAdminInput = {
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
        /** 创作规模 */
        scale: 'Personal',
        /** 短链接 */
        shortname: 'xxx',
        /** 自我介绍 */
        intro: 'xxx',
        /** 创作类型 */
        category: '',
        /** PST 代币相关 */
        ticker: {
            /** 代币缩写 */
            ticker: 'EXA',
            /** 代币名称 */
            name: 'Example Name',
            /** 代币合约地址 */
            contract: 'ADDRESS',
        },
        /** 售卖方案列表 */
        items: [
            {
                /** 标题 */
                title: "Example Title",
                /** 价值 */
                value: '10',
                /** 说明 */
                description: "Example Description"
            }
        ]
    }
}

/**
 * removeCreator 合约写入方法 
 * 移除一个创作者
 * target 填写创作者地址
 */
const removeCreatorInput = {
    function: 'removeCreator',
    target: 'addr'
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
        intro: 'New!!!',
        category: 'Type3'
    }
}

/**
 * editItem 合约写入方法 
 * 为创作者添加多个售卖物品   
 * data 结构中必须含有 items 字段，
 * items 的物品包含 title，value，description 字段
 */
const editItemInput = {
    function: 'editItem',
    target: 'ADDRESS',
    data: {
        items: [
            // id 为 0 的对象不传入的话等效于删除
            // 数据传入后，id 将会重新被排序，请不要完全依赖于 id 作为绝对索引
            // {
            //     id: 0
            //     ...
            // },
            {
                id: 1,
                title: '变更后',
                value: '10',
                description: '变更后'
            },
            {
                id: 4,
                title: '变更后 2',
                value: '20',
                description: '变更后 2'
            }
        ]
    }
}
