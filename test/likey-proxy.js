// import fs, { stat } from 'fs'
// import path from 'path'
// import { handle } from '../contracts/likey-proxy.js'

// const initState = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('./contracts/likey-proxy-initial.json'))).toString('utf-8'))

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
 * 更新合约地址
 * address 填写合约地址
 */
const updateContractInput = {
    function: 'updateContract',
    address: ''
}
