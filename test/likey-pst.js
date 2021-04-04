// import fs from 'fs'
// import path from 'path'
// import { handle } from '../contracts/likey-pst.js'

// const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-pst-initial.json'))).toString('utf-8'))

// const state = {
//     ...initState
// }

// let action
// let res

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
 * mint 合约写入方法 
 * 为指定地址铸币   
 * target 填写地址，quantity 填写数量
 */
const mintInput = {
    function: 'mint',
    recipient: 'ADDR',
    quantity: '10'
}

/**
 * burn 合约写入方法 
 * 销毁指定地址的资产   
 * target 填写地址，quantity 填写数量
 */
const burnInput = {
    function: 'burn',
    target: 'ADDR',
    quantity: '3'
}

/**
 * transfer 合约写入方法 
 * PST 转账，通用方法   
 * target 填写地址，qty 填写数量
 */
const transferInput = {
    function: 'transfer',
    target: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
    qty: '20'
}

/**
 * sponsorAdded 合约写入方法 
 * 购买作者的售卖方案   
 * 购买时直接通过这个方法转账   
 * 调用此合约时，必须包含调用合约的 target 和 winstonQty 参数，参见 SmartWeave
 */
const sponsorAddedInput = {
    function: 'sponsorAdded'
}

/**
 * donationAdded 合约写入方法 
 * 打赏作者的动态   
 * data 结构中含有 statusId 字段  
 * 调用此合约时，必须包含调用合约的 target 和 winstonQty 参数，参见 SmartWeave
 */
const donationAddedInput = {
    function: 'donationAdded',
    data: {
        statusId: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0'
    }
}

const updateRatio = {
    function: 'updateRatio',
    data: {
        ratio: '1:2'
    }
}

/**
 * editSettings 合约写入方法 
 * 更新合约支持的设定参数
 * data 结构中含有 settings 对象   
 * settings 对象必须是数组，元素也应该是数组
 */
const editSettingsInput = {
    function: 'editSettings',
    data: {
        settings: []
    }
}

/**
 * editAttributes 合约写入方法 
 * 更新合约支持的拓展标签
 * data 结构中含有 attributes 对象   
 * attributes 对象必须是数组，元素必须是对象
 */
const editAttributesInput = {
    function: 'editAttributes',
    data: {
        attributes: [
            { 'communityLogo': 'address' },
            // 重复项目将会被舍弃
            { 'communityLogo': 'address2' },
            { 'communityLogo2': 'address2' }
        ]
    }
}
