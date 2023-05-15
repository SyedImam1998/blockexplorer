import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import Web3 from "web3";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [tx, setTx] = useState();
  const [tx2, setTx2] = useState();
  const [nftcount, setnftcount] = useState();
  const [count, setcount] = useState();

  const [gas, setgas] = useState("");
  const web3 = new Web3();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
      // web3.utils.toWei(await alchemy.core.getGasPrice(), 'gwei');
      // setgas(web3.utils.toWei(await alchemy.core.getGasPrice(), 'gwei'));
      let response = await alchemy.core.getGasPrice();

      // Convert the gas price to wei
      let gasPriceInWei = web3.utils.toWei(response.toString(), "gwei");

      console.log("Gas Price in Wei:", gasPriceInWei.slice(0, 2));
      setgas(gasPriceInWei.slice(0, 2) + "Gwei");

      // const txHash = "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713941b";

      // //Call the method
      // const response4 = await alchemy.transact.waitForTransaction(txHash,2)

      // //Logging the response to the console
      // console.log(response4)
    }

    getBlockNumber();
  });

  const getBlockTx = async (blockHash) => {
    console.log("first");
    let response = await alchemy.core.getBlockWithTransactions(blockHash);
    console.log(response);
    setTx(response);
  };
  const getTx = async (txHash) => {
    console.log("first");
    let response = await alchemy.core.getTransactionReceipt(txHash);
    console.log(response);
    setTx2(response);
  };
  const getNftCount = async (address) => {
    let response3 = await alchemy.nft.getNftsForOwner(address);
    console.log(response3.ownedNfts.length);
    setnftcount(response3);
  };

  async function getTransactionCount(address) {
    console.log("started");
    console.log(await alchemy.core.getTransactionCount(address))
    setcount(await alchemy.core.getTransactionCount(address));
  }

  return (
    <div className="App">
      <div className="titleBar">
        <div> Block Number: {blockNumber}</div>
        <div> Gas Price: {gas}</div>
      </div>
      <br></br>
      <div className="GetTx">
        <input
          className="txInputField"
          type="text"
          placeholder="Enter the Block Hash To Get Details"
          onChange={(e) => getBlockTx(e.target.value)}
        ></input>

        {tx ? (
          <div className="txDetails">
            <label>Miner Address: {tx.miner}</label>
            <br></br>
            <label>Block Number: {tx.number}</label>
            <br></br>
            <label>TimeStamp: {tx.timestamp}</label>
            <br></br>
            <label>Total Transaction in Block: {tx.transactions.length}</label>
            <br></br>
          </div>
        ) : null}
      </div>

      <div className="GetTx">
        <input
          className="txInputField"
          type="text"
          placeholder="Enter the Transaction Hash To Get Details"
          onChange={(e) => getTx(e.target.value)}
        ></input>
        {tx2 ? (
          <div className="txDetails">
            <label>Who Sent this: {tx2.from}</label>
            <br></br>
            <label>To Whom: {tx2.to}</label>
            <br></br>
            <label>blockNumber: {tx2.blockNumber}</label>
          </div>
        ) : null}
      </div>

      <div className="GetTx">
        <input
          className="txInputField"
          type="text"
          placeholder="Get Nft Count of an Address"
          onChange={(e) => getNftCount(e.target.value)}
        ></input>
        {nftcount ? (
          <div className="txDetails">
            <label>Total NFT Count: {nftcount.ownedNfts.length}</label>
          </div>
        ) : null}
      </div>


      <div className="GetTx">
        <input
          className="txInputField"
          type="text"
          placeholder="Get Total Transaction Count"
          onChange={(e) => getTransactionCount(e.target.value)}
        ></input>
        {count>=0 ? (
          <div className="txDetails">
            <label>Total Transactions this address did: {count}</label>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
