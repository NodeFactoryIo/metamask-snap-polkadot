import ApiPromise from "@polkadot/api/promise";
import {WsProvider} from "@polkadot/api";
import {Wallet} from "../interfaces";
import {getConfiguration} from "../configuration";

let api: ApiPromise;
let provider: WsProvider;
let isConnecting: boolean;

/**
 * Initialize substrate api and awaits for it to be ready
 */
async function initApi(wsRpcUrl: string): Promise<ApiPromise> {
  provider = new WsProvider(wsRpcUrl);
  const api = new ApiPromise({ initWasm: false, provider });
  try {
    await api.isReady;
  } catch (e) {
    console.log("Api is ready with error:", e);
  }
  return api;
}

export const getApi = async (wallet: Wallet): Promise<ApiPromise> => {
  if (!api) {
    // first api initialization
    const config = getConfiguration(wallet);
    api = await initApi(config.wsRpcUrl);
    isConnecting = false;
  } else {
    while (isConnecting) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!provider.isConnected()) {
      isConnecting = true;
      await provider.connect();
      isConnecting = false;
    }
  }
  return api;
};