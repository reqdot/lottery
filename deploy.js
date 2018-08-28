// Rinkeby Network(Infura Node) - Infura API - Provider(Mnemonic을 넣어주어야 함) - web3
// publicKey, privateKey 고려해야(real network이므로) - Mnemonic은 계좌를 unlock하고, contract를 deploy할 수 있는 도구
// #50

// provider는 ethereum network를 사용할 수 있도록 해 줄 뿐만 아니라, 동시에 계좌를 unlock 상태로 만들어준다.
// 여기서는 truffle-hdwallet-provider사용

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'art east call hen inflict reduce sort hockey faculty crane grid trick',
    'https://rinkeby.infura.io/v3/5338fba0f2504055af7532cc5520760e'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x' + bytecode })
    .send({ from: accounts[0]} );

    console.log(interface);
    console.log('Contract deployed to', result.options.address);
};

deploy();

