import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';

await cryptoWaitReady();

// 页面对象
class IndexScirpt {
    constructor() {
        let btnGenerateWallet = document.getElementById("btnGenerateWallet");
        if (btnGenerateWallet) {
            btnGenerateWallet.addEventListener("click", (e:Event) => this.generateWallet());
        }        
    }

    // 生成钱包
    generateWallet() {
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
}

// 实例化
new IndexScirpt();