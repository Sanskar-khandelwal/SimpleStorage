//imports
const {ethers, run, network } = require('hardhat');
//async main
async function main(){
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying Contract");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed()
  console.log(`deployed contract to ${simpleStorage.address}`);
  // console.log(network.config)
  //what happen when we deploy to hardhat network 
  if(network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
    console.log("waiting for the block txes...")
    await simpleStorage.deployTransaction.wait(6);
   await verify(simpleStorage.address, [] )
  }


  // interacting with the contract
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  //updating the current value
  const transactionResponse = await simpleStorage.store(9);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated value is ${updatedValue}`) 
}

async function verify(contractAddress, args){
  console.log("verifying contract...");
  try{
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  }catch(e){
    if(e.message.toLowerCase().incluedes("already verifired")){
      console.log("Already verified");
    }
    else {
      console.log(e)
    }
  }
  

}
//main
main().then(() => {
  process.exit(0)
}).catch((err) => {
  console.error(err);
  process.exit(1)
});