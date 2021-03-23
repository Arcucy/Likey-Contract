import * as SmartWeave from 'smartweave'
import Arweave from 'arweave'
import path from 'path'
import fs from 'fs'

const arweave = Arweave.init({
    host: 'arweave.arcucy.io',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false
})

const key = JSON.parse(Buffer.from(fs.readFileSync(path.resolve('/Users/ayaka/Downloads/neko.json'))).toString())

async function main() {
    const res = await SmartWeave.interactWriteDryRun(arweave, key, '0YHMLXXBGGSNJssVSFBkHcfmE0q9pDnk1aNglBeT-Ik', { function: 'tag' }, [{name: 'testing', value: 'data-ayaka 2021'}])
    console.log(JSON.stringify(res.state))
}

main()
