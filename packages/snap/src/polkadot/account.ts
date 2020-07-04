import {Wallet} from "../interfaces";
import {cryptoWaitReady} from '@polkadot/util-crypto';
import {KeyringPair} from '@polkadot/keyring/types';
import {Keyring} from '@polkadot/keyring';
import {hexToU8a, stringToU8a, u8aToHex} from "@polkadot/util";
import {getConfiguration} from "../configuration";

/**
 * Returns KeyringPair if account is saved in wallet state, creates new one otherwise
 * @param wallet
 * @param unlocked
 */
export async function getKeyPair(wallet: Wallet, unlocked?: boolean): Promise<KeyringPair> {
  // await polkadot crypto promise
  await cryptoWaitReady();
  const state = wallet.getPluginState();
  const keyring = new Keyring({ss58Format: getConfiguration(wallet).addressPrefix});
  let keypair;
  if (state.polkadot.account.publicKey && !unlocked) {
    // account already generated
      keypair = keyring.addFromAddress(hexToU8a(state.polkadot.account.publicKey));
  } else {
    // generate new account
    const appKey = await wallet.getAppKey();
    const seed = appKey.substr(0, 32);
    keypair = keyring.addFromSeed(stringToU8a(seed));
    state.polkadot.account.publicKey = u8aToHex(keypair.publicKey);
    wallet.updatePluginState(state);
  }
  return keypair;
}


