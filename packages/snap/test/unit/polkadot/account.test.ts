import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import {WalletMock} from "../wallet.mock.test";
import {getKeyPair} from "../../../src/polkadot/account";
import {hexToU8a} from '@polkadot/util';
import {testAddress, testAppKey, testPublicKey} from "../rpc/keyPairTestConstants";
import {westendConfiguration} from "../../../src/configuration/predefined";

chai.use(sinonChai);

describe('Test account function: getKeyPair', function () {

    const walletStub = new WalletMock();

    afterEach(function () {
        walletStub.reset();
    });

    it('should generate new keypair on empty state', async function () {
        walletStub.getPluginState.returns(
            {polkadot: {configuration: westendConfiguration, account: {publicKey: undefined}}}
        );
        walletStub.getAppKey.returns(testAppKey);
        walletStub.updatePluginState.returnsArg(0);
        const result = await getKeyPair(walletStub);
        expect(walletStub.getAppKey).to.have.been.calledOnce;
        // once in function itself and once in configuration fetch
        expect(walletStub.getPluginState).to.have.been.calledTwice;
        expect(result.address).to.be.eq(testAddress);
        expect(result.publicKey).to.be.deep.eq(hexToU8a(testPublicKey));
    });

    it('should return locked saved keypair on public key saved in state', async function () {
        walletStub.getPluginState.returns(
            {polkadot: {configuration: westendConfiguration, account: {publicKey: testPublicKey}}}
        );
        walletStub.updatePluginState.returnsArg(0);
        const result = await getKeyPair(walletStub);
        // once in function itself and once in configuration fetch
        expect(walletStub.getPluginState).to.have.been.calledTwice;
        expect(result.address).to.be.eq(testAddress);
        expect(result.publicKey).to.be.deep.eq(hexToU8a(testPublicKey));
        expect(result.isLocked).to.be.true;
    });

    it('should return unlocked keypair on public key saved in state', async function () {
        walletStub.getPluginState.returns(
            {polkadot: {configuration: westendConfiguration, account: {publicKey: testPublicKey}}}
        );
        walletStub.getAppKey.returns(testAppKey);
        walletStub.updatePluginState.returnsArg(0);
        const result = await getKeyPair(walletStub, true);
        // once in function itself and once in configuration fetch
        expect(walletStub.getPluginState).to.have.been.calledTwice;
        expect(walletStub.getAppKey).to.have.been.calledOnce;
        expect(result.address).to.be.eq(testAddress);
        expect(result.publicKey).to.be.deep.eq(hexToU8a(testPublicKey));
        expect(result.isLocked).to.be.false;
    });
});
