import React, { Component } from 'react'
import RegisterContract from '../build/contracts/Register.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    // Pending: after submit, before TX reciept
    // Completed: registration done
    this.state = {
      pending: 0,
      completed: 0,
      web3: null,
	    firstName: '',
	    lastName: '',
	    email: ''
    }
  }

  // Do in the beginning
  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  componentDidMount() {
	 document.title = "Register Page";
  }

  // Update state with first name on change
  handleFirstName = (event) => {
    this.setState({firstName: event.target.value});
  }

  // Update state with last name on change
  handleLastName = (event) => {
  	this.setState({lastName: event.target.value});
  }

  // Update state with email on change
  handleEmail = (event) => {
  	this.setState({email: event.target.value});
  }

  // Handle submit button
  handleSubmit = (event) => {
    // Confirm they have the right info
    if (confirm("Confirm Registration?\n\nName: " + 
        this.state.firstName + " " + this.state.lastName +
        "\nemail: " +
        this.state.email) ) {
      console.log("Confirmed Registration");
    } else {
      console.log("Denied Registration");
      return;
    }
    
    // Instanstiate Contract
    const contract = require('truffle-contract')
    const register = contract(RegisterContract)
    register.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var registerInstance;

    console.log("boutta connect");
    console.log(RegisterContract);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      // Get contract instance
      register.deployed().then((instance) => {
        registerInstance = instance
        // Check if theyre already registered
        registerInstance.isRegistered(accounts[0])
        .then((result) => {
          console.error(result);
          if (result) {
            // they are registered 
            registerInstance.getUser(accounts[0])
            .then((user) => {
              console.error(user);
              var userInfo = user;
              // Update state with registered info
              this.setState({ firstName: userInfo[0],
                              lastName: userInfo[1],
                              email: userInfo[2] });
            });
            alert("You are already registered!");
            // Take them to the completed page
            this.setState({pending: 0});
            this.setState({completed: 1});
            this.forceUpdate();
            return true;

          } else {
            // they are not registered
            this.setState({pending: 1});
            this.setState({completed: 0});
            return false;
          }
        // Here we register them
        }).then((result) => {
          if (!result) {
            const gasLimit = 200000;

            // Register the user
            registerInstance.register(this.state.firstName, 
                                      this.state.lastName,
                                      this.state.email,
                                      {from: accounts[0],
                                       gas: gasLimit,
                                       gasPrice: 1100000000})
            .then((result) => {
             // wait for txt:wait
              this.state.web3.eth.getTransactionReceipt(result['tx'],
                (result) => {
                  // After waiting callback
                  if (result !== 'undefined') {
                    this.setState({completed: 1});
                    console.error(result);
                  } else {
                    this.setState({pending: 0});
                    console.error("TX failed")
                    console.error("result");
                    alert ("Transaction Failed");
                    this.forceUpdate();
                  }

                });
            })
            .catch((error) => {
              // Error, take them to Register page
              this.setState({pending: 0});
              this.setState({completed: 0});
              console.error(error);
              console.error("rejected");
              this.forceUpdate();
            });
            return;
          } else {
            // they are already registered 
            // take them to the completed page
            this.setState({pending: 0});
            this.setState({completed: 1});
            this.forceUpdate();
            return;
          } 
        });
      });


    });
    event.preventDefault();
  }

  render() {
    // Completed page. Display infO
    if (this.state.completed) {
      document.title = "Register Page";
      return (
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Register</a>
          </nav>

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
              <div className="chicken">
                <h2>You Are Registered</h2>
                <p>{this.state.firstName}</p>
                <p>{this.state.lastName}</p>
                <p>{this.state.email}</p>
              </div>
              </div>
            </div>
          </main>
        </div>
      );
    }
    // 'Home' page
    if (!this.state.pending) {
      return (
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Register</a>
          </nav>

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
              <div className="chicken">
                <h2>Register yourself here</h2>
                <br/>
                <form className="pure-form" onSubmit={this.handleSubmit}>
                <label>
                  <input type="text" id="first" placeholder="First"  	
                  onChange={this.handleFirstName}/>
                </label><br/><br/>
                <label>
                  <input type="text" id="last" placeholder="Last"  	
                  onChange={this.handleLastName}/>
                </label><br/><br/>
                <label>
                  <input type="text" id="email" placeholder="email"
                  onChange={this.handleEmail}/>
                </label><br/><br/>
                <input className="pure-buttom-primary" type="submit" value="Register"/>
                </form>
              </div>
              </div>
            </div>
          </main>
        </div>
      );
    } else {
      ///Loading page
      return (
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Register</a>
          </nav>

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <h2>Waiting for confirmation...</h2>
                <p>Check MetaMask</p>
              </div>
            </div>
          </main>
        </div>
      );
    }
  }
}

export default App
