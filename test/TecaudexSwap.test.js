const Token = artifacts.require('Token');
const TecaudexSwap = artifacts.require('TecaudexSwap');

require('chai')
    .use(require('chai-as-promised'))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TecaudexSwap', ([deployer, investor]) => {
    let token, contract;

    before(async () => {
        token = await Token.new();
        contract = await TecaudexSwap.new(token.address);

        await token.transfer(contract.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {
        
        it('contract has name', async () => {
            const name = await token.name();
            assert.equal(name, 'tecaudex Coin');
        })
    })

    describe('TecaudexSwap deployment', async () => {
        
        it('contract has name', async () => {
            const name = await contract.name();
            assert.equal(name, 'TecaudexSwap Instant Exchange');
        })

        it('contract has 1mil coins', async () => {
            const balance = await token.balanceOf(contract.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    })

    describe('buyTokens()', async () => {
        let result;

        before(async () => {
            result = await contract.buyTokens({ from: investor, value: tokens('1')});
        })
        
        it('allows to buy', async () => {
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('50'));

            let tecaudexSwapBalance = await token.balanceOf(contract.address);
            assert.equal(tecaudexSwapBalance.toString(), tokens('999950'));

            tecaudexSwapBalance = await web3.eth.getBalance(contract.address);
            assert.equal(tecaudexSwapBalance.toString(), tokens('1'));

            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('50').toString());
            assert.equal(event.rate.toString(), '50');
        })
    })
})