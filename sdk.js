const fs = require('fs')
const path = require('path')
const process = require('process')

const Axios = require('axios')
const Arweave = require('arweave')
const TestWeave = require('testweave-sdk').default
const SmartWeave = require('smartweave')

const arweave = Arweave.init({
    host: 'pool.arcucy.io',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false
})

const testWeave = TestWeave.init(arweave)

// arweave.wallets.generate().then(res => {
//     fs.writeFileSync('./testwallet.json', JSON.stringify(res))
// })

/**
 * isAddress checks whether the input address is a valid arweave address
 * @param {*} address 
 */
function isAddress(address) {
    return /^([a-zA-Z0-9]|_|-)+$/.test(address)
}

async function getUploadPrice (byte) {
    const res = await Axios.get(`https://pool.arcucy.io/price/${Number(byte)}`)
    if (res && res.data) return res.data
    else return 0
}

async function dropRequiredBalanceToAddress(length, key) {
    try {
        const addr = await arweave.wallets.getAddress(key)
        const winston = await getUploadPrice(length)
        console.log('字节数：', length, ', 总计消费: ', winston)
        await testWeave.drop(addr, String(Math.round(parseInt(winston) * 1.2)))
        await testWeave.mine()
        const newBalance = await arweave.wallets.getBalance(addr)
        console.log('余额更新为（winston）: ', newBalance)
    } catch (e) {
        console.error(e)
        return
    }
}

async function createContract(srcPath, initStatePath, keyPath) {
    try {
        let src = ''

        const initState = Buffer.from(fs.readFileSync(path.resolve(initStatePath))).toString()
        const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve(keyPath))).toString())

        await dropRequiredBalanceToAddress(src.length + initState.length, key)
        
        if (isAddress(srcPath)) {
            console.log('从 ', srcPath, ' 创建合约...')
            src = srcPath
            const res = await SmartWeave.createContractFromTx(arweave, key, src, initState)
            console.log('createContractFromTx 结果: ', res)
        } else {
            console.log('创建新合约...')
            src = Buffer.from(fs.readFileSync(path.resolve(srcPath))).toString()
            const res = await SmartWeave.createContract(arweave, key, src, initState)
            console.log('createContract 结果: ', res)
        }
    
        await testWeave.mine()
    } catch (e) {
        console.error(e)
        return
    }
}

async function writeContract(txid, input, tags = '', keyPath) {   
    try {
        if (!isAddress(txid)) {
            console.error('要交互的合约 ID 不是合法的地址')
            return
        }
        const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve(keyPath))).toString())
        
        if (tags !== '' && JSON.parse(tags).length > 0) {
            // await dropRequiredBalanceToAddress(input.length + JSON.stringify(tags).length, key)
            console.log('交互并写入，包含 tag: ', txid)
            const res = await SmartWeave.interactWriteDryRun(arweave, key, txid, input, tags)
            console.log('interactWrite 结果: ', res)
        } else {
            // await dropRequiredBalanceToAddress(input.length, key)
            console.log('交互并写入: ', txid)
            const res = await SmartWeave.interactWriteDryRun(arweave, key, txid, input)
            console.log('interactWrite 结果: ', res)
        }
        await testWeave.mine()

        const data = await SmartWeave.readContract(arweave, txid)
        console.log('新的状态: ', data)
    } catch (e) {
        console.error(e)
        return
    }
}

async function arweaveId(id, keyPath) {
    try {
        const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve(keyPath))).toString())

        await dropRequiredBalanceToAddress(String(id).length, key)

        const idTx = await arweave.createTransaction({ data: String(id)}, key)
        idTx.addTag('App-Name', 'arweave-id')
        idTx.addTag('App-Version', '0.0.1')
        idTx.addTag('Unix-Time', String(Date.now()))
        idTx.addTag('Type', 'name')
    
        await arweave.transactions.sign(idTx, key)
        const uploader = await arweave.transactions.getUploader(idTx)

        while (!uploader.isComplete) {
            await uploader.uploadChunk()
            console.log('上传中: ', uploader.pctComplete)
        }
        let status = await arweave.transactions.getStatus(idTx.id)
        console.log('当前状态: ', status)
        await arweave.transactions.post(idTx)
        status = await arweave.transactions.getStatus(idTx.id)
        console.log('当前状态: ', status)
        await testWeave.mine()
        console.log(idTx.id)
    } catch (e) {
        console.error(e)
        return 1
    }
}

async function avatar(avatarPath, keyPath) {
    try {
        const ext = avatarPath.split('.').pop()
        const getType = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'webp': 'image/webp'
        }
        if (Object.keys(getType).indexOf(ext) === -1) {
            console.error('错误的图片类型')
            return
        }

        const image = Buffer.from(fs.readFileSync(path.resolve(avatarPath)))
        const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve(keyPath))).toString())
        
        await dropRequiredBalanceToAddress(image.byteLength, key)

        const imageTx = await arweave.createTransaction({ data: image.toString('base64') }, key)
        imageTx.addTag('Content-Type', getType[ext])
        imageTx.addTag('App-Name', 'arweaveavatar')
        imageTx.addTag('Unix-Time', String(Date.now()))
        imageTx.addTag('Type', 'avatar')

        await arweave.transactions.sign(imageTx, key)
        const imgUploader = await arweave.transactions.getUploader(imageTx)

        while (!imgUploader.isComplete) {
            await imgUploader.uploadChunk()
            console.log('上传中: ', imgUploader.pctComplete)
        }
        let status = await arweave.transactions.getStatus(imageTx.id)
        console.log('当前状态: ', status)

        await arweave.transactions.post(imageTx)
        status = await arweave.transactions.getStatus(imageTx.id)
        console.log('当前状态: ', status)
        await testWeave.mine()
        console.log(imageTx.id)
    } catch (e) {
        console.error(e)
        return 1
    }
}

function deploy() {
    const args = process.argv
    const helpStr = 'Growth 合约开发工具包 CLI v0.0.1\n作者: Ayaka Neko <neko@ayaka.moe>\n\n此命令行工具用于在Arweave的测试节点中创建，交互，测试合同\n\n' +
    'help                                                    - 显示 CLI 工具的帮助\n' +
    'create [--key-file]                                     - 创建合同并使用钱包JWK密钥进行部署\n' +
    'write [CONTRACT_ID] [--input] [--tag] [--keyfile]       - 使用钱包 JWK 密钥交互合约并写入，参数有「输入 --input」和可选「标签 --tags = [{name:"",value:""}]」\n' +
    'read [CONTRACT_ID] [--input] [--tag]                    - 读取合约状态，如果指定了 --input 和可选参数 --tag，则使用交互读取并发送到合约来读取互动后的合约状态\n' +
    'id [username] [--key-file]                              - 更新新的 Arweave ID\n' +
    'avatar [图片] [--key-file]                              - 更新新的 Arweave Avatar 头像\n' +
    'version                                                 - 显示 Growth 合约开发工具包\n'
    
    if (args.length <= 2) {
        console.log(helpStr)
        return
    }
    
    for (let i = 0; i < args.length; i++) {
        const cmd = args[i]
        switch (cmd) {
        case 'create':
            if (!args[i + 1]) {
                console.log('命令必须包含要上传的合约')
            }
            if (!args[i + 3]) {
                console.log('请使用 --state 指定合约初始状态 JSON 文件')
                return
            }
            if (!(args[i + 2] && args[i + 2] === '--state' && args[i + 3])) {
                console.log('请指定合约初始状态 JSON 文件')
                return
            }
            if (!args[i + 4]) {
                console.log('请使用 --key-file 指定你的 JWK 文件')
                return
            }
            if (!(args[i + 4] && args[i + 4] === '--key-file' && args[i + 5])) {
                console.log('请指定你的 JWK 文件')
                return
            }
            createContract(args[i + 1], args[i + 3], args[i + 5])
            break
        case 'write':
            if (!args[i + 1]) {
                console.log('命令必须包含要写入的合约 ID')
            }
            if (!args[i + 2]) {
                console.log('请使用 --input [字符串] 来指定你的输入值')
                return
            }
            if (!(args[i + 2] && args[i + 2] === '--input' && args[i + 3])) {
                console.log('请指定要写入合约的输入值')
                return
            }

            if (args[i + 4] && args[i + 4] === '--tags' && !args[i + 5]) {
                console.log('如果要使用 --tags 来添加标签，请包含完整的标签内容 --tags {"name": "value"}[]')
                return
            }
            if (args[i + 4] && args[i + 4] === '--tags' && args[i + 5]) {
                if (!args[i + 6]) {
                    console.log('请使用 --key-file 指定你的 JWK 文件')
                    return
                }
                if (!(args[i + 6] && args[i + 6] === '--key-file' && args[i + 7])) {
                    console.log('请指定你的 JWK 文件')
                    return
                }
                writeContract(args[i + 1], args[i + 3], args[i + 5], args[i + 7])
            } else {
                if (!args[i + 4]) {
                    console.log('L 235 请使用 --key-file 指定你的 JWK 文件')
                    return
                }
                if (!(args[i + 4] && args[i + 4] === '--key-file' && args[i + 5])) {
                    console.log('L 239 请指定你的 JWK 文件')
                    return
                }
                writeContract(args[i + 1], args[i + 3], '', args[i + 5])
            }
            break
        case 'id':
            if (!(args[i + 2] && args[i + 2] === '--key-file' && args[i + 3])) {
                console.log('请使用 --key-file 指定你的 JWK 文件')
                return
            }
            arweaveId(args[i + 1], args[i + 3])
            break
        case 'avatar':
            if (!(args[i + 2] && args[i + 2] === '--key-file' && args[i + 3])) {
                console.log('请指定你的 JWK 文件')
                return
            }
            avatar(args[i + 1], args[i + 3])
            break
        case 'version':
            console.log('Growth 合约开发工具包 CLI v0.0.1')
            break
        case 'help':
            console.log(
            )
        }
    }
}

deploy()
