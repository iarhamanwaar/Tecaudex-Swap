import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json'
import TecaudexSwap from '../abis/TecaudexSwap.json'
import './App.css';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '',
      token: {},
      tecaudexSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = await web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });

      // if user doesnt have any starting balance the function returns null
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      if (tokenBalance === null) {
        tokenBalance = '0';
      }

      this.setState({ tokenBalance });
    }
    else {
      window.alert('Token contract not deployed to detected network.');
    }

    const tecaudexSwapData = TecaudexSwap.networks[networkId];
    if (tecaudexSwapData) {
      const tecaudexSwap = await web3.eth.Contract(TecaudexSwap.abi, tecaudexSwapData.address);
      this.setState({ tecaudexSwap });
    }
    else {
      window.alert('TecaudexSwap contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  buyTokens = async (etherAmount) => {
    this.setState({ loading: true })

    this.state.tecaudexSwap.methods.buyTokens()
      .send({ 
        value: etherAmount,
        from: this.state.account,
      })
        .on('transactionHash', async (hash) =>  {
          console.log('transaction successful', hash);
      })

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = await web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });

      // if user doesnt have any starting balance the function returns null
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      if (tokenBalance === null) {
        tokenBalance = '0';
      }

      this.setState({ tokenBalance });
    }
    else {
      window.alert('Token contract not deployed to detected network.');
    }

    this.setState({ loading: false })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.tecaudexSwap.address, tokenAmount)
      .send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.state.tecaudexSwap.methods.sellTokens(tokenAmount)
          .send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
        })
    })
  }

  

  render() {
    let content;
    if (this.state.loading) {
      content = <h2 id="loader" className='text-center'>Loading...</h2>;
    }
    else {
      content = <Main 
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />;
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto d-flex text-center" style={{ maxWidth: "600px" }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
