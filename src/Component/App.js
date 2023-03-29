import React, { Component } from "react";
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';


class App extends Component {

    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if(window.web3) { 
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non ethereum browser detected! You can check out Metamask!')
        }
    }


    async loadBlockChainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        const networkId = await web3.eth.net.getId()
        console.log(networkId, 'Network ID')
        
       //load Tether Contract
       const tetherData = Tether.networks[networkId]
       if(tetherData) {
           const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
           this.setState({tether})
           let tetherBalance = await tether.methods.balalnceOf(this.setState.account).call()
           this.setState({tetherBalance : tetherBalance.toString() })
           console.log({balance: tetherBalance})
           
       } else {
        window.alert('Tether network  ')
       }

        //load RWD Contract
        const rwdData = RWD.networks[networkId]
        if(rwdData) {
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balalnceOf(this.setState.account).call()
            this.setState({rwdBalance : rwdBalance.toString() })
            
        } else {
         window.alert('Reward Token not deployed to the network  ')
        }

         //load DecentralBank Contract
       const decentralBankData= DecentralBank.networks[networkId]
       if(tetherData) {
           const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
           this.setState({decentralBank})
           let stakingBalance = await decentralBank.methods.stakingbalalnce(this.setState.account).call()
           this.setState({stakingBalance: stakingBalance.toString() })
           
       } else {
        window.alert('Decentral Bank not deployed to the network ')
       }

         this.setState({loading: false})

    }
    
    constructor (props) {
        super(props)   
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralbank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }
    render() {
        this.loadBlockChainData()
        return (
            <div>
                <Navbar account={this.state.account}/>
                <div className='text-center'>
                <h1> 
                   {console.log(this.state.loading)} 
                </h1>
                </div>
                
            </div>
        );
    }
}


export default App;