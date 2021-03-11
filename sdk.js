const fs = require('fs')
const path = require('path')
const process = require('process')

const Axios = require('axios')
const Arweave = require('arweave')
const TestWeave = require('testweave-sdk').default
// const SmartWeave = require('smartweave')

const arweave = Arweave.init({
    host: 'pool.arcucy.io',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false
})

const testWeave = TestWeave.init(arweave)

async function getUploadPrice (byte) {
    const res = await Axios.get(`https://pool.arcucy.io/price/${Number(byte)}`)
    if (res && res.data) return res.data
    else return 0
}

async function createContract(srcPath, initStatePath, keyPath) {
    const src = Buffer.from(fs.readFileSync(path.resolve(srcPath))).toString()
    const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve(keyPath))).toString())
    console.log(src)
    console.log(key)
    // SmartWeave.createContract(arweave, key, src, )
}

async function arweaveId(id, keyPath) {
    try {
        const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve(keyPath))).toString())

        const addr = await arweave.wallets.getAddress(key)
        const winston = await getUploadPrice(String(id).length)
        console.log('total cost: ', winston)
        await testWeave.drop(addr, String(parseInt(winston) * 1.2))
        await testWeave.mine()
        const newBalance = await arweave.wallets.getBalance(addr)
        console.log('balance updated: ', newBalance)

        const idTx = await arweave.createTransaction({ data: String(id)}, key)
        idTx.addTag('App-Name', 'arweave-id')
        idTx.addTag('App-Version', '0.0.1')
        idTx.addTag('Unix-Time', String(Date.now()))
        idTx.addTag('Type', 'name')
    
        await arweave.transactions.sign(idTx, key)
        const uploader = await arweave.transactions.getUploader(idTx)

        while (!uploader.isComplete) {
            await uploader.uploadChunk()
            console.log('Uploading: ', uploader.pctComplete)
        }
        let status = await arweave.transactions.getStatus(idTx.id)
        console.log(status)
        await arweave.transactions.post(idTx)
        status = await arweave.transactions.getStatus(idTx.id)
        console.log(status)
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
        console.log(image)
        // const addr = await arweave.wallets.getAddress(key)
        // const winston = await getUploadPrice(image.byteLength)
        // console.log('total cost: ', winston)
        // await testWeave.drop(addr, String(parseInt(winston) * 1.2))
        // await testWeave.mine()
        // const newBalance = await arweave.wallets.getBalance(addr)
        // console.log('balance updated: ', newBalance)

        // const imageTx = await arweave.createTransaction({ data: image.toString('base64') }, key)
        // imageTx.addTag('Content-Type', getType[ext])
        // imageTx.addTag('App-Name', 'arweaveavatar')
        // imageTx.addTag('Unix-Time', String(Date.now()))
        // imageTx.addTag('Type', 'avatar')

        // await arweave.transactions.sign(imageTx, key)
        // const imgUploader = await arweave.transactions.getUploader(imageTx)

        // while (!imgUploader.isComplete) {
        //     await imgUploader.uploadChunk()
        //     console.log('Uploading: ', imgUploader.pctComplete)
        // }
        // let status = await arweave.transactions.getStatus(imageTx.id)
        // console.log(status)

        // await arweave.transactions.post(imageTx)
        // status = await arweave.transactions.getStatus(imageTx.id)
        // console.log(status)
        // await testWeave.mine()
        // console.log(imageTx.id)
    } catch (e) {
        console.error(e)
        return 1
    }
}

function deploy() {
    const args = process.argv
    
    for (let i = 0; i < args.length; i++) {
        const cmd = args[i]
        switch (cmd) {
        case 'create':
            if (!args[i + 3]) {
                console.log('请使用 --init 指定合约初始状态 JSON 文件')
                return
            }
            if (!(args[i + 4] && args[i + 4] === '--key-file' && args[i + 4])) {
                console.log('请使用 --init 指定合约初始状态 JSON 文件')
                return
            }
            if (!args[i + 3]) {
                console.log('请使用 --key-file 指定你的 JWK 文件')
                return
            }
            if (!(args[i + 4] && args[i + 4] === '--key-file' && args[i + 4])) {
                console.log('请使用 --key-file 指定你的 JWK 文件')
                return
            }
            createContract(args[i + 1], args[i + 4])
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
                console.log('请使用 --key-file 指定你的 JWK 文件')
                return
            }
            avatar(args[i + 1], args[i + 3])
            break
        case 'version':
            console.log('Growth 合约开发工具包 CLI v0.0.1')
            break
        case 'help':
            console.log('Growth 合约开发工具包 CLI v0.0.1\n作者: Ayaka Neko <neko@ayaka.moe>\n\n此命令行工具用于在Arweave的测试节点中创建，交互，测试合同\n\n' +
            'help                                                    - 显示 CLI 工具的帮助\n' +
            'create [--key-file]                                     - 创建合同并使用钱包JWK密钥进行部署\n' +
            'write [CONTRACT_ID] [--input] [--tag] [--keyfile]       - 使用钱包 JWK 密钥交互合约并写入，参数有「输入 --input」和可选「标签 --tags = [{name:"",value:""}]」\n' +
            'read [CONTRACT_ID] [--input] [--tag]                    - 读取合约状态，如果指定了 --input 和可选参数 --tag，则使用交互读取并发送到合约来读取互动后的合约状态\n' +
            'id [username] [--key-file]                              - 更新新的 Arweave ID\n' +
            'avatar [图片] [--key-file]                              - 更新新的 Arweave Avatar 头像\n' +
            'version                                                 - 显示 Growth 合约开发工具包\n'
            )
        }
    }
}

deploy()
