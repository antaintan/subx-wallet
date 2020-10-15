import { Keyring } from '@polkadot/keyring';
import uikey from '@polkadot/ui-keyring';
import settings from '@polkadot/ui-settings';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN_ZERO } from '@polkadot/util';

await cryptoWaitReady();

// 指定远端接口
const wsProvider = new WsProvider('wss://rpc.polkadot.io');

// 创建接口
const api = await ApiPromise.create({ provider: wsProvider });

// 页面对象
class IndexScirpt {
    constructor() {
        let btnGenerateAddress = document.getElementById("btnGenerateAddress");
        if (btnGenerateAddress) {
            btnGenerateAddress.addEventListener("click", (e: Event) => this.generateAddress());
        }      
        
        let btnConnectWallet = document.getElementById("btnConnectWallet");
        if (btnConnectWallet) {
            btnConnectWallet.addEventListener("click", (e: Event) => this.connectWallet());
        }   

        let btnRefreshChainInfo = document.getElementById('btnRefreshChainInfo');
        if (btnRefreshChainInfo) {
            btnRefreshChainInfo.addEventListener('click', (e: Event) => this.showChainInfo());
        }
    }

    // 生成钱包
    generateAddress() {
        const keyring = new Keyring({ type: 'sr25519' });
        const mnemonic = mnemonicGenerate();
        
         // 助记词
         let mnemonicEl = document.getElementById("mnemonic")
         if (mnemonicEl) {
            mnemonicEl.innerHTML = mnemonic;
         }

        //const pair = keyring.addFromUri(mnemonic, { name: 'first pair' }, 'sr25519');
        const pair = keyring.addFromUri(mnemonic);
        
        // ss58 address
        let ss58Address = document.getElementById("ss58Address")
        if (ss58Address) {
            ss58Address.innerHTML = pair.address;
        }

        // AcalaAccount
        let acaAddress = document.getElementById("acaAddress")
        if (acaAddress) {
            keyring.setSS58Format(10);
            acaAddress.innerHTML = pair.address;
        }

        // BifrostAccount
        let bncAddress = document.getElementById("bncAddress")
        if (bncAddress) {
            keyring.setSS58Format(6);
            bncAddress.innerHTML = pair.address;
        }

        // PolkadotAccount
        let dotAddress = document.getElementById("dotAddress")
        if (dotAddress) {
            keyring.setSS58Format(0);
            dotAddress.innerHTML = pair.address;
        }

        // EdgewareAccount
        let edgAddress = document.getElementById("edgAddress")
        if (edgAddress) {
            keyring.setSS58Format(7);
            edgAddress.innerHTML = pair.address;
        }

        // DarwiniaAccount
        let cringAddress = document.getElementById("cringAddress")
        if (cringAddress) {
            keyring.setSS58Format(18);
            cringAddress.innerHTML = pair.address;
        }

        // ksm address
        let ksmAddress = document.getElementById("ksmAddress")
        if (ksmAddress) {
            keyring.setSS58Format(2);
            ksmAddress.innerHTML = pair.address;
        }

        // KulupuAccount
        let klpAddress = document.getElementById("klpAddress")
        if (klpAddress) {
            keyring.setSS58Format(16);
            klpAddress.innerHTML = pair.address;
        }

        // StafiAccount
        let fisAddress = document.getElementById("fisAddress")
        if (fisAddress) {
            keyring.setSS58Format(20);
            fisAddress.innerHTML = pair.address;
        }

        // PlasmAccount
        let plmAddress = document.getElementById("plmAddress")
        if (plmAddress) {
            keyring.setSS58Format(5);
            plmAddress.innerHTML = pair.address;
        }
    }

    // 连接钱包
    async connectWallet() {
        await web3Enable('Subx助手');

        //let prefix = settings.prefix;
        //console.log('uisettings=', settings);
        let allAccounts = await web3Accounts({
            ss58Format: 0,
        });
        
        //allAccounts = allAccounts.map(({ address, meta }) =>({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
        allAccounts = allAccounts.map(({ address, meta }) =>({ 
            address, meta: { ...meta, name: `${meta.name}` } 
        }));

        // 加载所有帐号
        //uikey.loadAll({ isDevelopment: false }, allAccounts);

        // 地址数量
        var addrCount = document.getElementById('addrCount');
        if (addrCount) {
            addrCount.innerHTML = allAccounts.length.toString();
        }

        // 地址列表
        var addrList = document.getElementById('addrList');
        if (addrList) {
            addrList.innerHTML = '';
            for (let account of allAccounts) {
                let item = document.createElement('li');
                item.innerHTML = '<span class="item">' + account.meta.name + ': ' + account.address + '</span>';
    
                let btn = document.createElement('button');
                btn.type = 'button';
                btn.innerText = '查看余额';
                btn.addEventListener('click', (e:Event) => this.showBalance(account.address, btn));
                item.appendChild(btn)

                addrList.appendChild(item);
            }
        }
    }

    // 查看余额
    async showBalance(address: string, btn: HTMLButtonElement) {
        console.log('view balance, address=', address);

        // 查询余额
        const acct = await api.query.system.account(address);
        let freeBalance = acct.data.free.toString(10);
        
        // 精度
        if (acct.data.free.gt(BN_ZERO)) {
            if (freeBalance.length > 10) {
                const position = freeBalance.length - 10;
                freeBalance = freeBalance.substring(0, position) + '.' + freeBalance.substring(position);
            } else {
                freeBalance = '0.' + freeBalance;
            }
        }

        btn.innerHTML = freeBalance + ' DOT';
    }

    // 显示链上信息
    async showChainInfo() {
        let latestHash = document.getElementById("latestHash");
        let latestHeight = document.getElementById("latestHeight");

        const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
            if (latestHash) {
                latestHash.innerHTML = header.hash.toString();
            }

            if (latestHeight) {
                latestHeight.innerHTML = header.number.toNumber().toString();
            }
        });

        // 最新区块哈唏
        // const hash = await api.rpc.chain.getBlockHash();
        // let latestHash = document.getElementById("latestHash");
        // if (latestHash) {
        //     latestHash.innerHTML = hash.toString();
        // }
    }
}

// 实例化
new IndexScirpt();