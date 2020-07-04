import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../wallet.mock.test";
import {getAddress} from "../../../src/rpc/getAddress";
import {testAddress, testAppKey, testPublicKey} from "./keyPairTestConstants";
import {westendConfiguration} from "../../../src/configuration/predefined";

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', function() {

    const walletStub = new WalletMock();

    afterEach(function () {
        walletStub.reset();
    });

    it('should return valid address with westend configuration and empty account state', async function () {
        walletStub.getAppKey.returns(testAppKey);
        walletStub.getPluginState.returns({polkadot: {config: westendConfiguration, account: {publicKey: ""}}});
        const result = await getAddress(walletStub);
        expect(walletStub.getPluginState).to.have.been.calledTwice;
        expect(walletStub.getAppKey).to.have.been.calledOnce;
        expect(result).to.be.eq(testAddress);
    });

    it('should return valid address with westend configuration and public key in account state', async function () {
        walletStub.getPluginState.returns({
            polkadot: {
                config: westendConfiguration,
                account: {publicKey: testPublicKey}
            }
        });
        const result = await getAddress(walletStub);
        expect(walletStub.getPluginState).to.have.been.calledTwice;
        expect(result).to.be.eq(testAddress);
    });
});
