import {Wallet} from "../../../interfaces";
import {polkadotEventEmitter} from "../index";
import {getApi} from "../../api";
import {PolkadotEvent} from "@nodefactory/metamask-polkadot-types";

export async function registerOnBalanceChange(wallet: Wallet, origin: string): Promise<void> {
  const api = await getApi(wallet);
  const state = wallet.getPluginState();
  const address = state.polkadot.account.keyring.address;
  // Here we subscribe to any balance changes and update the on-screen value
  api.query.system.account(address, ({ data: { free: currentFree }}) => {
    polkadotEventEmitter.emit(PolkadotEvent.OnBalanceChange, currentFree.toString(), origin);
  });
}