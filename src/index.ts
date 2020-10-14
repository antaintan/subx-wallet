import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';

await cryptoWaitReady();

const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
const mnemonic = mnemonicGenerate();

const pair = keyring.addFromUri(mnemonic, { name: 'first pair' }, 'sr25519');

console.log("mnemonic=", mnemonic);
console.log("address=",  pair.address);
