<h1 align="center">Likey Contract</h1>
<p align="center">SmartWeave Contract for Growth</p>


## Pre-Requirements
```bash
yarn global add smartweave
```

## Deploy
1. Deploy Likey Contract (main data)
```bash
smartweave create contracts/likey-contract.js contracts/likey-initial.json --key-file [path-to-you-jwk-wallet]
```

2. Deploy Likey PST Contract for Creator (creator data)
```bash
smartweave create contracts/likey-pst.js contracts/likey-pst-initial.json --key-file [path-to-you-jwk-wallet]
```

## References
### Likey Contract
```JavaScript
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
```

### Likey PST Contract (for Creator)
```JavaScript
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
 * recipient 填写地址，qty 填写数量
 */
const transferInput = {
    function: 'transfer',
    recipient: 'A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0',
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
        statusId: "A4LCIVue3lxOR1ua_P2zMs_0B9Evsaypk3iNjsft8m0"
    }
}

/**
 * editSettings 合约写入方法 
 * 更新合约支持的设定参数
 * data 结构中含有 settings 对象   
 * settings 对象必须是数组，元素也应该是数组
 */
const editSettingsInput = {
    function: "editSettings",
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
    function: "editAttributes",
    data: {
        attributes: [
            { "communityLogo": "address" },
            // 重复项目将会被舍弃
            { "communityLogo": "address2" },
            { "communityLogo2": "address2" }
        ]
    }
}
```
