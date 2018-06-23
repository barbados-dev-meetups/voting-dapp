App={
  //define globals
  web3Provider:null,
  contracts:{},

  //Initialize web3
  initWeb3:function(){
    // if (typeof web3 !== 'undefined') {
    //   App.web3Provider = new Web3(web3.currentProvider);
    // } else {
    //   // set the provider you want from Web3.providers
    //   App.web3Provider = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    // }
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      App3.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
      web3 = new Web3(App.web3Provider)
    }

    
    return App.initContract();
  },

  //Connect to smart contracts
  initContract: function(){
    $.getJSON("Voting.json", function(voting){
      //read contract
      App.contracts.Voting = TruffleContract(voting)
      //connect to instance of blockchain
      App.contracts.Voting.setProvider(App.web3Provider)

      return App.render();
    })
  },

  //Read from the contract
  render: function(){

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        document.querySelector("#eth_address").innerHTML = "Your Account: <strong>" + account + "</strong>"
      }
    });

    App.contracts.Voting.deployed().then(function(instance){
      votingInstance = instance;
      return votingInstance.candidatesCount();
    }).then(function(candidatesCount){

      var candidates_list = $("#candidates_list")

      // candidatesCount is a structure from the smart contract and not a simple integer

      // //populate list of candidates
      for (var i = 1; i <= candidatesCount; i++) {
        //Get each candidate from the mapping
        votingInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          console.log(candidate)

          candidates_list.append("<li>"+name+"</li>")
        })
      }

    })
  }
}

window.onload = App.initWeb3()