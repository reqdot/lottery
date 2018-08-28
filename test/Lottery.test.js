const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await new web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'});

    lottery.setProvider(provider);    
});

describe('Lottery Contract', () => {
    it('deploys this lottery contract', () => {
        assert.ok(lottery.options.address);
    })

    it('allows an account to enter', async () => {
        await lottery.methods.enter().send({from: accounts[0], value:web3.utils.toWei('0.02', 'ether')});
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);

    })

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({from: accounts[0], value:web3.utils.toWei('0.02', 'ether')});
        await lottery.methods.enter().send({from: accounts[1], value:web3.utils.toWei('0.02', 'ether')});
        await lottery.methods.enter().send({from: accounts[2], value:web3.utils.toWei('0.02', 'ether')});
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);

    })

    it('requires a minimum aount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({from: accounts[0], value: 0});
            // 위에서 에러가 안 나면 이 테스트 실패
            assert(false);
        } catch(err) {
            assert(err);
        }
    })

    it('only manager can call pickWinner', async () => {
        try {
            // 위에서 contract 생성시 accounts[0]으로 지정
          await lottery.methods.pickWinner().send({from: accounts[1]});
          assert(false);
        } catch(err) {
          assert(err);
        }
    })

    it('sends money to the winner and resets the players array', async () => {

        await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('2', 'ether')});
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        const players = await lottery.methods.getPlayers.call({from: accounts[0]});
        // console.log(difference);
        assert(difference > web3.utils.toWei('1.9', 'ether'));
        try {
        assert.equal(1, players.length);
        assert(false);
        } catch(err) {
            assert(err);
        }

    })
})