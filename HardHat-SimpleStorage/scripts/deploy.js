//imports
const {ethers} = require('hardhat')
//async main
async function main(){
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying Contract");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed()
  console.log(simpleStorage.address);

}
//main
main().then(() => {
  process.exit(0)
}).catch((err) => {
  console.error(err);
  process.exit(1)
});